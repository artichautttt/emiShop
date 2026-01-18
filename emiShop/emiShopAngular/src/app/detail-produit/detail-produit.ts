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
    // Écoute dynamique de l'URL pour capter l'ID à coup sûr
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = Number(idParam);

      this.loading = true; // On affiche le chargement
      this.errorMsg = '';

      if (idParam && !isNaN(id)) {
        this.loadProduct(id);
      } else {
        this.errorMsg = "Impossible de lire l'ID du produit.";
        this.loading = false;
      }
    });
  }

  loadProduct(id: number) {
    this.produitService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false; // L'écran va maintenant se mettre à jour grâce à ZoneChangeDetection
      },
      error: (err) => {
        console.error("Erreur API :", err);
        this.errorMsg = "Le produit n'a pas pu être chargé.";
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
