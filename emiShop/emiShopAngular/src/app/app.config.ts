import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser'; // Import indispensable

export const appConfig: ApplicationConfig = {
  providers: [
    // Indispensable pour que l'écran se mette à jour après l'appel API
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(routes),
    provideHttpClient(withFetch()),

    // Indispensable pour que le passage Serveur -> Navigateur se fasse sans bug
    provideClientHydration()
  ]
};
