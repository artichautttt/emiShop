import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from './toast.service'; // <-- Import du ToastService

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
  quantity?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {

  private http = inject(HttpClient);
  private toast = inject(ToastService); // <-- Injection
  private apiUrl = 'https://dummyjson.com/products';

  // Permet de vérifier si on est dans un navigateur (pour le LocalStorage)
  private platformId = inject(PLATFORM_ID);

  public categorySelected = new Subject<string>();

  private cart = new BehaviorSubject<any[]>([]);
  cart$ = this.cart.asObservable();

  private showCart = new BehaviorSubject<boolean>(false);
  showCart$ = this.showCart.asObservable();

  constructor() {
    // Au démarrage, on charge le panier sauvegardé
    this.loadCartFromStorage();
  }

  // --- API & CONVERSION PRIX ---
  private convertPrice(p: any) {
    return { ...p, price: p.price * 10 };
  }

  getProductById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(map(p => this.convertPrice(p)));
  }

  getProducts(skip: number = 0, limit: number = 30): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?limit=${limit}&skip=${skip}`).pipe(
      map(res => ({ ...res, products: res.products.map((p: any) => this.convertPrice(p)) }))
    );
  }

  getProductsByCategory(category: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/category/${category}`).pipe(
      map(res => ({ ...res, products: res.products.map((p: any) => this.convertPrice(p)) }))
    );
  }

  searchProducts(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`).pipe(
      map(res => ({ ...res, products: res.products.map((p: any) => this.convertPrice(p)) }))
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories`);
  }

  selectCategory(categorySlug: string) {
    this.categorySelected.next(categorySlug);
  }

  // --- GESTION DU PANIER & PERSISTANCE ---

  private saveCartToStorage(items: any[]) {
    // On vérifie qu'on est bien sur le navigateur avant d'accéder à localStorage
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('emiShop_cart', JSON.stringify(items));
    }
  }

  private loadCartFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const savedCart = localStorage.getItem('emiShop_cart');
      if (savedCart) {
        this.cart.next(JSON.parse(savedCart));
      }
    }
  }

  addToCart(product: Product) {
    const currentCart = this.cart.value;
    const existingItem = currentCart.find((item: any) => item.id === product.id);

    let newCart;
    if (existingItem) {
      existingItem.quantity += 1;
      newCart = [...currentCart];
      this.toast.show(`Quantité mise à jour : ${product.title}`, 'info');
    } else {
      newCart = [...currentCart, { ...product, product: product, quantity: 1 }];
      this.toast.show(`${product.title} ajouté au panier !`, 'success');
    }

    this.cart.next(newCart);
    this.saveCartToStorage(newCart);
  }

  removeFromCart(item: any) {
    const currentCart = this.cart.value;
    const updatedCart = currentCart.filter((i: any) => i.id !== item.id);
    this.cart.next(updatedCart);
    this.saveCartToStorage(updatedCart);
    this.toast.show('Produit retiré du panier', 'warning');
  }

  updateCart(items: any[]) {
    this.cart.next(items);
    this.saveCartToStorage(items);
  }

  clearCart() {
    this.cart.next([]);
    this.saveCartToStorage([]);
  }

  getCartValue() {
    return this.cart.value;
  }

  toggleCartView(show: boolean) {
    this.showCart.next(show);
  }
}
