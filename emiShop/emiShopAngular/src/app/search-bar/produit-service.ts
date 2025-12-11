import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Il faut bien 'export' ici
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  rating: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) { }

  // Il faut bien cette méthode publique
  getProducts(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
