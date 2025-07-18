import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { info } from '@hdwallet/core';

import { TerminalService } from './services/terminal/terminal.service';
import { StorageService } from './services/storage/storage.service';
import {
  __changelog__,
  __description__,
  __keywords__,
  __license__,
  __name__,
  __tracker__,
  __url__, __websites__
} from '../../../src/info';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  constructor(
    private terminalService: TerminalService,
    private storageService: StorageService
  ) {
    this.getInfo();
  }

  ngOnInit(): void {
    if (!this.storageService.getStorage('disclaimer')) {
      this.storageService.setStorage('disclaimer', false);
    }
    if (!this.storageService.getStorage('stop')) {
      this.storageService.setStorage('stop', true);
    }
  }

  getInfo(): void {

    this.storageService.setJSONStorage('info', {
      project: `${info.__name__}.js`,
      version: info.__version__,
      license: `${info.__license__}-License`,
      author: info.__author__,
      email: info.__email__,
      source: info.__source__,
      changelog: info.__changelog__,
      tracker: info.__tracker__
    });
    this.terminalService.update(null, null, false);
  }
}
