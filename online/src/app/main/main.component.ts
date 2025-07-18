import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgClass, NgIf } from '@angular/common';
import { take } from 'rxjs/operators';

import { DashboardComponent } from './dashboard/dashboard.component';
import { TerminalComponent } from './terminal/terminal.component';
import { ComboboxInterface } from '../../interfaces';

@Component({
  selector: 'app-main',
  imports: [
    DashboardComponent,
    TerminalComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './main.html',
  styleUrl: './main.css'
})
export class MainComponent implements OnInit {

  gridCols?: string;
  showTerminal: boolean = window.innerWidth >= 640;
  tab: ComboboxInterface = {
    name: 'Dumps', value: 'dumps'
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(take(1)).subscribe((params: ParamMap) => {
      const tools: string | undefined = params.get('tools')?.toString().toLowerCase();
      if (!tools || !['entropy', 'mnemonic', 'seed', 'passphrase'].includes(tools)) {
        this.router.navigate(['tools'], { replaceUrl: true });
      }
    });
    if (this.router.url.startsWith('/tools')) {
      this.tab = { name: 'Tools', value: 'tools' };
    } else if (this.router.url.startsWith('/dumps')) {
      this.tab = { name: 'Dumps', value: 'dumps' };
    }
    this.updateGridCols(window.innerWidth);
  }

  updateGridCols(screenWidth: number): void {
    if (screenWidth >= 1921) {
      this.gridCols = 'grid-cols-[30vw_1fr]';
    } else if (1920 >= screenWidth) {
      if (1024 >= screenWidth) {
        this.gridCols = 'grid-cols-[1fr_1fr]';
      } else {
        this.gridCols = 'grid-cols-[40vw_1fr]';
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.showTerminal = window.innerWidth >= 640;
    this.updateGridCols(window.innerWidth);
  }
}
