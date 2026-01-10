import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // IMPORTANT
import { ProduitService, Product } from '../service/produit-service';
import { CategoriesComponent } from '../categories/categories';

@Component({
  selector: 'app-list-produit',
  standalone: true,
  imports: [CommonModule, FormsModule, CategoriesComponent, RouterLink],
  templateUrl: './list-produit.html',
  styleUrls: ['./list-produit.css']
})
export class ListProduitComponent implements OnInit {

  produits: Product[] = [];
  totalProduits: number = 0;
  skip: number = 0;
  limit: number = 30;
  searchTerm: string = '';
  currentCategory: string = '';

  addedProducts = new Set<number>();

  private produitService = inject(ProduitService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadProducts();

    this.produitService.categorySelected.subscribe((categorySlug) => {
      this.currentCategory = categorySlug;
      this.searchTerm = '';
      this.skip = 0;

      if (categorySlug && categorySlug.length > 0) {
        this.loadProductsByCategory(categorySlug);
      } else {
        this.loadProducts();
      }
    });
  }

  loadProducts() {
    this.produitService.getProducts(this.skip, this.limit).subscribe({
      next: (data: any) => {
        if (this.skip === 0) {
          this.produits = data.products;
        } else {
          this.produits = [...this.produits, ...data.products];
        }
        this.totalProduits = data.total;
        this.cd.detectChanges();
      }
    });
  }

  loadProductsByCategory(category: string) {
    this.produitService.getProductsByCategory(category).subscribe({
      next: (data: any) => {
        this.produits = data.products;
        this.totalProduits = data.total;
        this.cd.detectChanges();
      }
    });
  }

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

  loadMore() {
    if (!this.currentCategory && !this.searchTerm) {
      this.skip += this.limit;
      this.loadProducts();
    }
  }

  addToCart(product: Product) {
    this.produitService.addToCart(product);
    this.addedProducts.add(product.id);
    setTimeout(() => { this.addedProducts.delete(product.id); }, 2000);
  }

  isAdded(id: number): boolean {
    return this.addedProducts.has(id);
  }
}
