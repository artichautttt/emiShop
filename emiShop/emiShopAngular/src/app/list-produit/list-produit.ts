import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitService, Product } from '../service/produit-service';

@Component({
  selector: 'app-list-produit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-produit.html',
  styleUrls: ['./list-produit.css']
})
export class ListProduitComponent implements OnInit {

  produits: Product[] = [];

  // Variables de gestion
  totalProduits: number = 0;
  skip: number = 0;
  limit: number = 30;
  searchTerm: string = '';
  currentCategory: string = '';

  private produitService = inject(ProduitService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    // 1. C'est ici que le chargement initial se lance
    this.loadProducts();
    this.produitService.categorySelected.subscribe((categorySlug) => {
      console.log('Filtre demandé :', categorySlug); // Pour débugger

      // 1. On réinitialise les variables de navigation
      this.currentCategory = categorySlug;
      this.searchTerm = '';
      this.skip = 0;

      // 2. LA CONDITION IMPORTANTE
      if (categorySlug && categorySlug.length > 0) {
        // Cas A : Il y a un nom (ex: "laptops") -> On charge la catégorie
        this.loadProductsByCategory(categorySlug);
      } else {
        // Cas B : C'est vide ("") -> On charge TOUS les produits
        console.log('Retour à la liste complète...');
        this.loadProducts();
      }
    });
  }

  // --- CHARGEMENT GÉNÉRAL ---
  loadProducts() {
    this.produitService.getProducts(this.skip, this.limit).subscribe({
      next: (data: any) => {
        // C'EST ICI QUE L'ERREUR ÉTAIT CORRIGÉE :
        if (this.skip === 0) {
          this.produits = data.products; // On met la LISTE dans produits
        } else {
          this.produits = [...this.produits, ...data.products];
        }

        this.totalProduits = data.total; // On met le CHIFFRE dans totalProduits

        console.log("Produits chargés :", this.produits.length); // Pour vérifier
        this.cd.detectChanges();
      },
      error: (err) => console.error("Erreur chargement:", err)
    });
  }

  // --- CHARGEMENT PAR CATÉGORIE ---
  loadProductsByCategory(category: string) {
    this.produitService.getProductsByCategory(category).subscribe({
      next: (data: any) => {
        this.produits = data.products;
        this.totalProduits = data.total;
        this.cd.detectChanges();
      }
    });
  }

  // --- RECHERCHE ---
  onSearch() {
    if (!this.searchTerm) {
      this.currentCategory = '';
      this.skip = 0;
      this.loadProducts();
      return;
    }

    this.produitService.searchProducts(this.searchTerm).subscribe({
      next: (data: any) => {
        this.produits = data.products;
        this.totalProduits = data.total;
        this.cd.detectChanges();
      }
    });
  }

  // --- BOUTON VOIR PLUS ---
  loadMore() {
    if (!this.currentCategory && !this.searchTerm) {
      this.skip += this.limit;
      this.loadProducts();
    }
  }

  addToCart(product: Product) {
    console.log('Ajout au panier :', product.title);
  }
}
