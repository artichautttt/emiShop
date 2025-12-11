import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;

  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];
  weight: number;
  sku: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private apiUrl = 'https://dummyjson.com/products';
  categorySelected = new Subject<string>();

  constructor(private http: HttpClient) { }

  // 1. Récupérer les produits avec Pagination (skip = combien on en saute)
  getProducts(skip: number = 0, limit: number = 30): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}&skip=${skip}`);
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/${category}`);
  }
  // 2. Chercher des produits (Search)
  searchProducts(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`);
  }

  // --- AJOUTEZ CETTE FONCTION ---
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>('https://dummyjson.com/products/categories');
  }
}
