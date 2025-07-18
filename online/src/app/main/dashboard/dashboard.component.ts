import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild
} from '@angular/core';
import { NgClass, NgIf, Location } from '@angular/common';

import { ToolsComponent } from './tabs/tools/tools.component';
import { DumpsComponent } from './tabs/dumps/dumps.component';
import { TerminalComponent } from '../terminal/terminal.component';
import { CustomModalComponent } from '../../common/custom-modal/custom-modal.component';
import { DonationComponent } from './donation/donation.component';
import { TerminalService } from '../../services/terminal/terminal.service';
import { CustomComboboxComponent } from '../../common/custom-combobox/custom-combobox.component';
import { ShareComponent } from './share/share.component';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageService } from '../../services/storage/storage.service';
import { DisabledStateService } from '../../services/disabled-state/disabled-state.service';
import { ComboboxInterface } from '../../../interfaces';
import { toBoolean } from '../../../utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    ToolsComponent,
    DumpsComponent,
    TerminalComponent,
    CustomModalComponent,
    DonationComponent,
    ShareComponent,
    NgIf,
    NgClass,
    CustomComboboxComponent,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  currentYear: number;
  tabs: ComboboxInterface[]   = [
    { name: 'Tools', value: 'tools' },
    { name: 'Dumps', value: 'dumps' }
  ];
  showMobileTerminal: boolean = window.innerWidth < 640;
  @Input() selectedTab: ComboboxInterface = this.tabs[0];
  @ViewChild('dashboard', { static: false }) dashboard!: ElementRef;
  @ViewChild('donationModal', { static: false }) donationModal!: CustomModalComponent;
  @ViewChild('shareModal', { static: false }) shareModal!: CustomModalComponent;
  @ViewChild(ToolsComponent) toolsComponent!: ToolsComponent;
  @ViewChild(DumpsComponent) dumpsComponent!: DumpsComponent;
  @Input() main!: HTMLDivElement;

  constructor (
    public terminalService: TerminalService,
    public storageService: StorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private disabledStateService: DisabledStateService,
    private renderer2: Renderer2,
    private location: Location
  ) {
    this.currentYear = new Date().getFullYear();
  }

  ngOnInit(): void {
    if (this.storageService.getStorage('disclaimer') !== 'true') {
      this.storageService.clearStorage('terminal');
      this.terminalService.update('Read and understand the disclaimer before', 'warning', false);
      this.disabledStateService.setDisabledState(true);
    }
  }

  ngAfterViewInit(): void {
    setTimeout((): void => { this.updateModalHeights() }, 10);
  }

  iUnderstand(): void {
    this.storageService.setStorage('disclaimer', true);
    const action: string = this.storageService.getStorage('action');
    if (action === 'entropy') {
      this.toolsComponent.entropyComponent.initFromURL(action);
    } else if (action === 'mnemonic') {
      this.toolsComponent.mnemonicComponent.initFromURL(action);
    } else if (action === 'seed') {
      this.toolsComponent.seedComponent.initFromURL(action);
    } else if (action === 'passphrase') {
      this.toolsComponent.passphraseComponent.initFromURL(action);
    } else if (action && action.startsWith('dumps') && this.selectedTab.value.startsWith('dumps')) {
      const actions: string[] = action.split('?')[0].split('/');
      this.dumpsComponent.initFromURL(actions[1], actions[2]);
    }
    this.storageService.clearStorage('action');
    this.terminalService.update('clear', null, false);
    this.disabledStateService.setDisabledState(false);
    setTimeout(() => { this.updateModalHeights() }, 10);
  }

  updateModalHeights(): void {
    this.donationModal.customModalStyle = { height: this.dashboard.nativeElement.offsetHeight + 'px' };
    this.shareModal.customModalStyle = { height: this.dashboard.nativeElement.offsetHeight + 'px' };
    // const width = this.dashboard.nativeElement.offsetWidth;
    // const margin = width * 0.075;
    // this.donationModal.customContentStyle = {
    //   'max-width': `${width - (margin * 2)}px`,
    //   'margin': `0px ${margin}px`,
    //   'top': `${window.innerWidth < 640 ? 5 : 15}%`
    // };
    // this.shareModal.customContentStyle = {
    //   'max-width': `${width - (margin * 2)}px`,
    //   'margin': `0px ${margin}px`,
    //   'top': `${window.innerWidth < 640 ? 5 : 15}%`
    // };
    this.changeDetectorRef.detectChanges();
  }

  @ViewChild(ShareComponent) shareComponent!: ShareComponent;

  share(data: any): void {
    this.shareComponent.updateShareData(data);
    this.shareModal.open();
    this.renderer2.setProperty(this.main, 'scrollTop', 0);
  }

  donation(): void {
    this.donationModal.open();
    this.renderer2.setProperty(this.main, 'scrollTop', 0);
  }

  selectTab(selectedTab: ComboboxInterface): void {
    this.selectedTab = selectedTab;
    this.terminalService.update(null, null, false);
    this.location.replaceState(`/${this.selectedTab.value}`);
    setTimeout(() => { this.updateModalHeights() }, 10);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.showMobileTerminal = window.innerWidth < 640;
    this.terminalService.update(null, null, false);
    setTimeout(() => { this.updateModalHeights() }, 10);
  }

  protected readonly toBoolean = toBoolean;
}
