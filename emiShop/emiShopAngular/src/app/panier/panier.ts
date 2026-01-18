import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ProduitService } from '../service/produit-service';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panier.html',
  styles: []
})
export class PanierComponent implements OnInit {

  cartItems: any[] = [];
  total: number = 0;
  currentUser: any = null;

  private produitService = inject(ProduitService);
  private fbService = inject(FirebaseService);
  private router = inject(Router);

  ngOnInit(): void {
    // 1. S'abonner au panier
    this.produitService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });

    // 2. S'abonner à l'utilisateur
    this.fbService.user$.subscribe(user => this.currentUser = user);
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  updateQuantity(item: any, event: any) {
    const newQty = event.target.value;
    if (newQty > 0) {
      item.quantity = Number(newQty);
      // CORRECTION : On utilise la méthode publique updateCart
      this.produitService.updateCart(this.cartItems);
      this.calculateTotal();
    }
  }

  removeItem(item: any) {
    this.produitService.removeFromCart(item);
  }

  async checkout() {
    if (!this.currentUser) {
      alert("Veuillez vous connecter pour passer commande.");
      this.router.navigate(['/auth']);
      return;
    }

    if (this.cartItems.length === 0) return;

    try {
      await this.fbService.placeOrder(this.cartItems, this.total, this.currentUser.email);

      alert(`Merci ${this.currentUser.email} ! Votre commande de ${this.total} MAD a été validée.`);

      // CORRECTION ICI : On utilise la méthode publique clearCart()
      this.produitService.clearCart();

      // Optionnel : rediriger vers l'accueil
      this.router.navigate(['/']);

    } catch (error) {
      console.error("Erreur commande :", error);
      alert("Une erreur est survenue lors de la commande.");
    }
  }
}
