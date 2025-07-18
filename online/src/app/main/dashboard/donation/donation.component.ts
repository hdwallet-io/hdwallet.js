import { ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';

import { CustomComboboxComponent } from '../../../common/custom-combobox/custom-combobox.component';
import { ComboboxInterface, DonationAddressInterface } from '../../../../interfaces';
import { copyToClipboard } from '../../../../utils';
import { donation } from '../../../../donation';

@Component({
  selector: 'app-donation',
  imports: [
    QRCodeComponent,
    CustomComboboxComponent,
    FormsModule
  ],
  templateUrl: './donation.html',
  styleUrl: './donation.css'
})
export class DonationComponent {

  copyDisable: boolean = false;
  copyMessage: 'Copy' | 'Copied' | 'Failed' = 'Copy';
  @ViewChild('addressInput', { static: false }) addressInput!: ElementRef;
  addresses: ComboboxInterface[] = donation.addresses.map(
    (item: DonationAddressInterface): ComboboxInterface => ({ name: item.cryptocurrency, value: item.address })
  );
  selectedAddress: ComboboxInterface = this.addresses[68]; // Ethereum
  selectedTruncatedAddress: string | null = null;
  @Input() main!: HTMLDivElement;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private renderer2: Renderer2
  ) { }

  onAddressChange(address: ComboboxInterface): void {
    this.selectedAddress = address;
    this.selectedTruncatedAddress = this.getTruncatedAddress(
      this.selectedAddress.value, this.addressInput.nativeElement.offsetWidth
    );
    this.renderer2.setProperty(this.main, 'scrollTop', 0);
  }

  getTruncatedAddress(address: string, inputElementWidth: number): string {
    const maxChars: number = Math.floor(inputElementWidth / 8);
    if (address.length > maxChars) {
      const visibleChars: number = Math.floor((maxChars - 3) / 2) - 2;
      return `${address.slice(0, visibleChars)}...${address.slice(-visibleChars)}`;
    }
    return address;
  }

  async copyAddress(address: string): Promise<void> {
    this.copyDisable = true;

    try {
      const isCopied = await copyToClipboard(address);
      this.copyMessage = isCopied ? 'Copied' : 'Failed';
    } catch {
      this.copyMessage = 'Failed';
    }
    this.changeDetectorRef.detectChanges();

    setTimeout(() => {
      this.copyDisable = false;
      this.copyMessage = 'Copy';
      this.changeDetectorRef.detectChanges();
    }, 1000);
  }
}
