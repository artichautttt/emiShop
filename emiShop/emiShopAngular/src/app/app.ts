import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common'; // Importez isPlatformBrowser
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { ProduitService } from './service/produit-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.html', // Vérifie que c'est bien app.html
  styles: []
})
export class AppComponent implements OnInit {
  title = 'emiShop';
  showCart: boolean = false;

  private produitService = inject(ProduitService);
  private platformId = inject(PLATFORM_ID); // Injectez l'ID de plateforme

  ngOnInit() {
    this.produitService.showCart$.subscribe((status: boolean) => {
      this.showCart = status;

      // PROTECTION : On n'utilise window que si on est dans le navigateur
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    });
  }
}
