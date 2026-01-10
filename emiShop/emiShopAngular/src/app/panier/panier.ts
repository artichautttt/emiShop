import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // AJOUT
import { ProduitService } from '../service/produit-service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [CommonModule, RouterLink], // AJOUT
  templateUrl: './panier.html',
  styles: []
})
export class PanierComponent implements OnInit {

  cartItems: any[] = [];
  total: number = 0;

  private produitService = inject(ProduitService);

  ngOnInit(): void {
    this.produitService.cart$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((acc, item) => {
      const price = item.product ? item.product.price : item.price;
      return acc + (price * item.quantity);
    }, 0);
  }

  removeFromCart(item: any) {
    this.produitService.removeFromCart(item);
  }
}
