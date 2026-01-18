import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { ProduitService } from './service/produit-service';
// CORRECTION 1 : Le chemin vers le composant Toast doit être correct
import { ToastComponent } from './service/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // CORRECTION 2 : On ajoute bien ToastComponent dans les imports
  imports: [CommonModule, RouterOutlet, HeaderComponent, ToastComponent],
  templateUrl: './app.html',
  styles: []
})
// CORRECTION 3 : On garde le nom "App" pour éviter les erreurs dans main.ts
export class App implements OnInit {
  title = 'emiShop';
  showCart: boolean = false;

  private produitService = inject(ProduitService);
  private platformId = inject(PLATFORM_ID);

  ngOnInit() {
    this.produitService.showCart$.subscribe((status: boolean) => {
      this.showCart = status;

      // Votre protection est excellente ici !
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }
}
