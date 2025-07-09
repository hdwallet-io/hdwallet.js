import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig).then(() => {
  const splashScreen: HTMLElement | null = document.getElementById('splash-screen');
  const appRoot: HTMLElement | null = document.getElementById('app-root');

  if (splashScreen) {
    splashScreen.style.opacity = '0'; // Fade out splash screen
    setTimeout(() => {
      splashScreen.remove(); // Remove splash screen element from DOM

      if (appRoot) {
        appRoot.classList.add('visible'); // Add 'visible' class to app-root
      }
    }, 500); // Match the CSS transition duration (500ms)
  }
}).catch((err) => console.error(err));
