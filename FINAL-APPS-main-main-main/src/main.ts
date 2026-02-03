import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// bootstrapApplication(App, appConfig)
//   .catch((err) => console.error(err));

// main.ts
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app/app.routes';

import { provideHttpClient } from '@angular/common/http';
// si tenés más providers (animaciones, etc.), los dejás/importás igual

bootstrapApplication(App, {
  providers: [
    // 👇 ACÁ está la clave: agregamos withComponentInputBinding()
    provideRouter(
      routes,
      withComponentInputBinding()
    ),

    provideHttpClient(),

    // otros providers que ya tengas:
    // provideAnimations(),
    // provideClientHydration(),
  ],
}).catch(err => console.error(err));
