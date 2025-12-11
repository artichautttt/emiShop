import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListProduitComponent } from './list-produit/list-produit';
import { Auth } from './auth/auth';
import { CategoriesComponent } from './categories/categories';
import { Footer } from './footer/footer';
import { SearchBar } from './search-bar/search-bar';
import { Header } from './header/header';
import { Panier } from './panier/panier';

@Component({
  selector: 'app-root',
  imports: [ListProduitComponent, Auth, CategoriesComponent, Footer, SearchBar, Header, Panier, RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('nom-projet');
}
