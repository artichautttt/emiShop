import { Routes } from '@angular/router';
import { ListProduitComponent } from './list-produit/list-produit';
import { PanierComponent } from './panier/panier';
import { DetailProduitComponent } from './detail-produit/detail-produit';

export const routes: Routes = [
  // Page d'accueil
  { path: '', component: ListProduitComponent },

  // Page Panier
  { path: 'panier', component: PanierComponent },

  // Page Détail : ATTENTION aux deux points ':' devant id
  { path: 'produit/:id', component: DetailProduitComponent },

  // Redirection par défaut
  { path: '**', redirectTo: '' }
];
