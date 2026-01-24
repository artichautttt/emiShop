import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

// --- CORRECTION DES IMPORTS ---
// 1. On importe les fonctions de création depuis le SDK natif 'firebase/...'
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 2. On importe les fournisseurs (providers) depuis '@angular/fire/...'
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { provideFirestore } from '@angular/fire/firestore';

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

    // L'initialisation reste la même, mais maintenant 'initializeApp' vient du bon endroit
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};
