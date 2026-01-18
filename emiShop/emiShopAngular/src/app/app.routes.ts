import { Routes } from '@angular/router';
import { ListProduitComponent } from './list-produit/list-produit';
import { DetailProduitComponent } from './detail-produit/detail-produit';
import { PanierComponent } from './panier/panier';
import { Auth } from './auth/auth'; // Vérifiez que cet import est correct

export const routes: Routes = [
  { path: '', component: ListProduitComponent },
  { path: 'produit/:id', component: DetailProduitComponent },
  { path: 'panier', component: PanierComponent },
  { path: 'auth', component: Auth }, // C'est cette ligne qui est cruciale
  { path: '**', redirectTo: '' } // Redirection par défaut
];
