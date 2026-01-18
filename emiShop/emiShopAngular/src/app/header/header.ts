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
    // 1. Gestion du panier
    this.produitService.cart$.subscribe(items => {
      this.cartCount = items.reduce((acc, item) => acc + (item.quantity || 1), 0);
    });

    // 2. Gestion de la connexion (pour savoir si on affiche "Se déconnecter")
    this.fbService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // --- NOUVELLE FONCTION DE DÉCONNEXION ---
  logout() {
    this.fbService.logout().subscribe(() => {
      // On recharge la page pour vider le panier et remettre l'état à zéro
      window.location.reload();
    });
  }
}
