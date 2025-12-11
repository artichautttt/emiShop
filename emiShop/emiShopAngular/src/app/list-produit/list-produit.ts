import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Nécessaire pour le champ de recherche
import { ProduitService, Product } from '../service/produit-service';

@Component({
  selector: 'app-list-produit',
  standalone: true,
  imports: [CommonModule, FormsModule], // On ajoute FormsModule
  templateUrl: './list-produit.html',
  styleUrls: ['./list-produit.css']
})
export class ListProduitComponent implements OnInit {

  produits: Product[] = [];
  totalProduits: number = 0; // Pour savoir quand cacher le bouton "Voir plus"
  skip: number = 0;          // Compteur pour la pagination
  limit: number = 30;
  searchTerm: string = '';   // Ce que l'utilisateur tape

  private produitService = inject(ProduitService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadProducts();
  }

  // Fonction pour charger les produits (initial ou suite)
  loadProducts() {
    this.produitService.getProducts(this.skip, this.limit).subscribe({
      next: (data: any) => {
        // On AJOUTE les nouveaux produits à la liste existante
        this.produits = [...this.produits, ...data.products];
        this.totalProduits = data.total;
        this.cd.detectChanges();
      }
    });
  }

  // Fonction appelée quand on clique sur "Voir plus"
  loadMore() {
    this.skip += this.limit; // On avance de 30
    this.loadProducts();
  }

  // Fonction appelée quand on écrit dans la recherche
  onSearch() {
    // Si la recherche est vide, on recharge tout comme au début
    if (!this.searchTerm) {
      this.produits = [];
      this.skip = 0;
      this.loadProducts();
      return;
    }

    // Sinon, on appelle l'API de recherche
    this.produitService.searchProducts(this.searchTerm).subscribe({
      next: (data: any) => {
        this.produits = data.products; // Ici on remplace tout
        this.totalProduits = data.total; // On met à jour le total trouvé
        this.cd.detectChanges();
      }
    });
  }

  addToCart(product: Product) {
    console.log('Ajout au panier :', product.title);
  }
}
