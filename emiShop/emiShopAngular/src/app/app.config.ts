import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

// IMPORTS FIREBASE CORRIGÉS
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Remplacez par vos vraies clés (sans analytics pour l'instant)
const firebaseConfig = {
  apiKey: "AIzaSyAKDJVmf33DPd1tlfKMHtgajOgByykwv2Y",
  authDomain: "emishop-db-bc478.firebaseapp.com",
  projectId: "emishop-db-bc478",
  storageBucket: "emishop-db-bc478.firebasestorage.app",
  messagingSenderId: "407211224754",
  appId: "1:407211224754:web:24e26245a8a13913f063ab",
  measurementId: "G-QTRKRCHK73"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(),

    // CORRECTION MAJEURE ICI :
    // On utilise une fonction fléchée () => pour éviter l'erreur "Injection Context"
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())

    // NOTE : On a retiré "provideAnalytics" pour stopper le crash
  ]
};
