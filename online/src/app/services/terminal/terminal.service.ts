import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerminalService {

  public data: WritableSignal<any> = signal<any>('');
  showTerminal: WritableSignal<boolean> = signal(false);
  stopDerivation: WritableSignal<boolean> = signal(true);

  update(
    data: any, format: 'json' | 'csv' | 'warning' | 'error' | null = 'json', showTerminal: boolean = window.innerWidth < 640
  ): void {
    if (data === null) {
      this.data.set(data);
    } else if (data === 'clear') {
      this.data.set(data);
    } else if (format === 'json') {
      this.data.set({ json: data });
    } else if (format === 'csv') {
      this.data.set({ csv: data });
    } else if (format === 'warning') {
      this.data.set({ warning: data });
    } else if (format === 'error') {
      this.data.set({ error: data });
    }
    this.showTerminal.set(showTerminal);
  }

  clear(showTerminal: boolean = window.innerWidth < 640): void {
    this.data = signal<any>('');
    this.showTerminal.set(showTerminal);
  }
}
