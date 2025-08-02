import {
  AfterViewInit, Component, computed, ElementRef, Renderer2, Signal
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
  syntaxJSONHighlight, syntaxCSVHighlight, replaceHyphen2Underscore, toLowerCase, toBoolean
} from '../../../utils';
import { StorageService } from '../../services/storage/storage.service';
import { TerminalService } from '../../services/terminal/terminal.service';
import { GroupBoxService } from '../../services/group-box/group-box.service';
import { DictionaryInterface } from '../../../interfaces';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.html',
  styleUrl: './terminal.css'
})
export class TerminalComponent implements AfterViewInit {

  terminalOutputWithOperations: Signal<void> = computed((): void => {
    this.output(this.terminalService.data());
  });

  constructor(
    public storageService: StorageService,
    public terminalService: TerminalService,
    public groupBoxService: GroupBoxService,
    private renderer2: Renderer2,
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute
  ) { }

  ngAfterViewInit() {
    this.updatePreInnerHTML(this.storageService.getStorage('terminal'));
    this.activatedRoute.queryParams.subscribe(queries => {
      let queryParams: DictionaryInterface = replaceHyphen2Underscore(queries);
      if (queryParams['clear']) {
        if (toLowerCase(queryParams['clear']) === 'true') {
          setTimeout(() => { this.clear(); }, 1);
        }
      }
    });
  }

  updatePreInnerHTML(data: string): void {
    const info: any = this.storageService.getJSONStorage('info');
    if (info) {
      const placeholder: string = syntaxJSONHighlight(
        info, 'rgba(225, 225, 225, 0.5)', 'rgba(225, 225, 225, 0.5)', 'rgba(225, 225, 225, 0.5)'
      );
      data = data ? data : `<code style="user-select: none;">\n${placeholder}</code>`;
      this.renderer2.setProperty(
        this.elementRef.nativeElement.querySelector('pre'), 'innerHTML', data
      );
      this.scrollToBottom();
    }
  }

  output(data: any): void {
    if (data === 'clear') {
      this.storageService.clearStorage('terminal');
    } else if (data) {
      const currentData: string = this.storageService.getStorage('terminal') || '';
      let updatedData: string = '';
      if (data.json) {
        updatedData = `${currentData}\n${syntaxJSONHighlight(data.json)}`;
      } else if (data.csv) {
        updatedData = `${currentData}\n${syntaxCSVHighlight(data.csv)}`;
      } else if (data.warning) {
        updatedData = `${currentData}\n<code style="color: rgb(221, 125, 10)">WARNING<code style="color: #FFFFFF">: ${data.warning}</code></code>`;
      } else if (data.error) {
        updatedData = `${currentData}\n<code style="color: rgb(255, 96, 96)">ERROR<code style="color: #FFFFFF">: ${data.error}</code></code>`;
      }
      this.storageService.setStorage('terminal', this.limitLines(updatedData));
    }
    this.updatePreInnerHTML(this.storageService.getStorage('terminal'));
  }

  scrollToBottom(): void {
    const element: any = this.elementRef.nativeElement.querySelector('#pre-terminal');
    this.renderer2.setProperty(
      element, 'scrollTop', element.scrollHeight
    );
  }

  clear(): void {
    this.groupBoxService.clear();
    this.terminalService.clear();
    this.storageService.clearStorage('terminal');
    this.terminalOutputWithOperations = computed((): void => {
      this.output(this.terminalService.data());
    });
  }

  limitLines(data: string): string {
    const maxLines = 1000;
    const lines = data.split('\n');
    if (lines.length >= maxLines) {
      return lines.slice(-maxLines).join('\n');
    }
    return data;
  }

  protected readonly toBoolean = toBoolean;
}
