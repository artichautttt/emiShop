import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router'; // On retire withComponentInputBinding pour l'instant
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Routeur standard
    provideHttpClient(withFetch()) // Client HTTP standard
  ]
};
