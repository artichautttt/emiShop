import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../service/produit-service';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {

  cartCount: number = 0;
  currentUser: any = null;

  private produitService = inject(ProduitService);
  private fbService = inject(FirebaseService);

  ngOnInit() {
    // 1. Panier
    this.produitService.cart$.subscribe(items => {
      this.cartCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    });

    // 2. Connexion
    this.fbService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    // CORRECTION ICI : On utilise .subscribe() au lieu de .then()
    this.fbService.logout().subscribe(() => {
      window.location.reload(); // Recharger la page pour vider les états
    });
  }
}
