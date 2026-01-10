import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProduitService, Product } from '../service/produit-service';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-produit.html',
  styles: []
})
export class DetailProduitComponent implements OnInit {

  product: Product | null = null;
  loading: boolean = true;
  errorMsg: string = '';
  isAdded: boolean = false;

  private route = inject(ActivatedRoute);
  private produitService = inject(ProduitService);

  ngOnInit(): void {
    // On s'abonne aux changements d'URL (plus robuste que snapshot)
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      console.log("URL changée, ID reçu :", idParam);

      const id = Number(idParam);

      if (idParam && !isNaN(id)) {
        this.loadProduct(id);
      } else {
        this.errorMsg = "ID du produit invalide.";
        this.loading = false;
      }
    });
  }

  loadProduct(id: number) {
    this.loading = true; // On affiche le chargement
    this.produitService.getProductById(id).subscribe({
      next: (data) => {
        console.log("Produit chargé !", data);
        this.product = data;
        this.loading = false; // On cache le chargement
      },
      error: (err) => {
        console.error("Erreur API :", err);
        this.errorMsg = "Erreur de connexion au serveur.";
        this.loading = false;
      }
    });
  }

  addToCart() {
    if (this.product) {
      this.produitService.addToCart(this.product);
      this.isAdded = true;
      setTimeout(() => { this.isAdded = false; }, 2000);
    }
  }
}
