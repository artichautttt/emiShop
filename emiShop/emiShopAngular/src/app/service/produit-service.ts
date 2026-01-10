import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

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
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private http = inject(HttpClient);
  private apiUrl = 'https://dummyjson.com/products';

  public categorySelected = new Subject<string>();
  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();
  private showCart = new BehaviorSubject<boolean>(false);
  showCart$ = this.showCart.asObservable();

  constructor() { }

  // --- MÉTHODE CRUCIALE POUR LE DÉTAIL ---
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // --- AUTRES MÉTHODES ---
  getProducts(skip: number = 0, limit: number = 30): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}&skip=${skip}`);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/${category}`);
  }

  searchProducts(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`);
  }

  selectCategory(categorySlug: string) {
    this.categorySelected.next(categorySlug);
  }

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

  removeFromCart(item: any) {
    const currentCart = this.cart.value;
    const updatedCart = currentCart.filter((i: any) => i.id !== item.id);
    this.cart.next(updatedCart);
  }

  toggleCartView(show: boolean) {
    this.showCart.next(show);
  }
}
