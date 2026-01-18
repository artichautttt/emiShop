import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, map } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  sku?: string;
  weight?: number;
  quantity?: number; // Ajouté pour le panier
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com/products';

  public categorySelected = new Subject<string>();

  // Le panier est privé, on y accède via des méthodes
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  private showCart = new BehaviorSubject<boolean>(false);
  showCart$ = this.showCart.asObservable();

  constructor() { }

  // --- LOGIQUE PRIX (x10 pour MAD) ---
  private convertPrice(p: any) {
    return { ...p, price: p.price * 10 };
  }

  // --- API ---
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(p => this.convertPrice(p))
    );
  }

  getProducts(skip: number = 0, limit: number = 30): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}&skip=${skip}`).pipe(
      map(res => ({
        ...res,
        products: res.products.map((p: any) => this.convertPrice(p))
      }))
    );
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/${category}`).pipe(
      map(res => ({
        ...res,
        products: res.products.map((p: any) => this.convertPrice(p))
      }))
    );
  }

  searchProducts(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`).pipe(
      map(res => ({
        ...res,
        products: res.products.map((p: any) => this.convertPrice(p))
      }))
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  selectCategory(categorySlug: string) {
    this.categorySelected.next(categorySlug);
  }

  // --- GESTION DU PANIER (CORRIGÉE) ---

  // 1. Ajouter
  addToCart(product: Product) {
    const currentCart = this.cart.value;
    const existingItem = currentCart.find((item: any) => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      this.cart.next([...currentCart]);
    } else {
      this.cart.next([...currentCart, { ...product, product: product, quantity: 1 }]);
    }
  }

  // 2. Supprimer un article
  removeFromCart(item: any) {
    const currentCart = this.cart.value;
    const updatedCart = currentCart.filter((i: any) => i.id !== item.id);
    this.cart.next(updatedCart);
  }

  // 3. Mettre à jour (quantité) - C'était manquant !
  updateCart(items: any[]) {
    this.cart.next(items);
  }

  // 4. Vider le panier - C'était manquant !
  clearCart() {
    this.cart.next([]);
  }

  // 5. Récupérer la valeur actuelle (sans s'abonner)
  getCartValue() {
    return this.cart.value;
  }

  toggleCartView(show: boolean) {
    this.showCart.next(show);
  }
}
