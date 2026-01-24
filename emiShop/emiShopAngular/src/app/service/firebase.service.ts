import { Injectable, inject, NgZone } from '@angular/core';
// Import natif pour l'Auth
import { Auth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, user } from '@angular/fire/auth';
// Import de l'APP pour récupérer Firestore manuellement
import { FirebaseApp } from '@angular/fire/app';
// Imports natifs Firestore
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private auth = inject(Auth);
  private app = inject(FirebaseApp); // <-- On injecte l'application globale
  private zone = inject(NgZone);     // <-- Pour mettre à jour l'écran (Angular Zone)

  // On récupère Firestore directement depuis l'app pour éviter les erreurs de version
  private firestore = getFirestore(this.app);

  user$ = user(this.auth);

  // --- AUTHENTIFICATION ---
  login(email: string, pass: string) { return from(signInWithEmailAndPassword(this.auth, email, pass)); }
  register(email: string, pass: string) { return from(createUserWithEmailAndPassword(this.auth, email, pass)); }
  logout() { return from(signOut(this.auth)); }

  // --- COMMENTAIRES (Version Robuste) ---
  getComments(productId: number): Observable<any[]> {
    const col = collection(this.firestore, 'comments');
    const q = query(col, where('productId', '==', productId), orderBy('date', 'desc'));

    // On crée notre propre Observable pour contourner le bug "Injection Context"
    return new Observable(observer => {
      const unsubscribe = onSnapshot(q,
        (snapshot) => {
          // On force Angular à voir la mise à jour
          this.zone.run(() => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            observer.next(data);
          });
        },
        (error) => {
          console.error("Erreur Firestore:", error);
          observer.error(error);
        }
      );
      // Nettoyage quand on quitte la page
      return () => unsubscribe();
    });
  }

  addComment(productId: number, userName: string, text: string) {
    const col = collection(this.firestore, 'comments');
    return addDoc(col, {
      productId,
      userName,
      text,
      date: new Date()
    });
  }

  // --- COMMANDES ---
  placeOrder(cartItems: any[], total: number, userEmail: string) {
    const col = collection(this.firestore, 'orders');
    return addDoc(col, {
      items: cartItems,
      total: total,
      customer: userEmail,
      status: 'En attente',
      date: new Date()
    });
  }
}
