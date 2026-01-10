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
    // 1. MÉTHODE DIRECTE (Snapshot)
    // On prend l'ID directement au moment où la page s'ouvre
    const idParam = this.route.snapshot.paramMap.get('id');
    console.log("--> ID REÇU DANS L'URL :", idParam);

    const id = Number(idParam);

    // 2. Vérification de sécurité
    if (idParam && !isNaN(id)) {
      this.loadProduct(id);
    } else {
      console.error("ERREUR : ID invalide ou manquant");
      this.errorMsg = "Impossible de lire l'ID du produit.";
      this.loading = false;
    }
  }

  loadProduct(id: number) {
    console.log("--> Lancement de la requête API pour l'ID :", id);

    this.produitService.getProductById(id).subscribe({
      next: (data) => {
        console.log("--> SUCCÈS : Données reçues !", data);
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error("--> ERREUR API :", err);
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
