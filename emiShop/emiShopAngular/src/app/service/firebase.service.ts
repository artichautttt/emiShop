import { Injectable, inject } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, addDoc, query, where, collectionData, orderBy } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  user$ = user(this.auth); // État de l'utilisateur en temps réel

  // --- AUTHENTIFICATION ---
  login(email: string, pass: string) { return from(signInWithEmailAndPassword(this.auth, email, pass)); }
  register(email: string, pass: string) { return from(createUserWithEmailAndPassword(this.auth, email, pass)); }
  logout() { return from(signOut(this.auth)); }

  // --- COMMENTAIRES ---
  getComments(productId: number): Observable<any[]> {
    const col = collection(this.firestore, 'comments');
    const q = query(col, where('productId', '==', productId), orderBy('date', 'desc'));
    return collectionData(q) as Observable<any[]>;
  }

  addComment(productId: number, userName: string, text: string) {
    const col = collection(this.firestore, 'comments');
    return addDoc(col, { productId, userName, text, date: new Date() });
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
