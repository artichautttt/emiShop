import { Routes } from '@angular/router';
import { ListProduitComponent } from './list-produit/list-produit';
import { PanierComponent } from './panier/panier';
import { DetailProduitComponent } from './detail-produit/detail-produit';

export const routes: Routes = [
  { path: '', component: ListProduitComponent },
  { path: 'panier', component: PanierComponent },

  // ON REVIENT À LA ROUTE STANDARD
  { path: 'produit/:id', component: DetailProduitComponent },

  { path: '**', redirectTo: '' }
];
