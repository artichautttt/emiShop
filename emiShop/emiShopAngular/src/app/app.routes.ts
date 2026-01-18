import { Routes } from '@angular/router';
import { ListProduitComponent } from './list-produit/list-produit';
import { DetailProduitComponent } from './detail-produit/detail-produit';
import { PanierComponent } from './panier/panier';
import { Auth } from './auth/auth';
import { authGuard } from './auth/auth.guard'; // <-- IMPORT DU GUARD

export const routes: Routes = [
  { path: '', component: ListProduitComponent },
  { path: 'produit/:id', component: DetailProduitComponent },

  // Route sécurisée : seul un utilisateur connecté peut y accéder
  {
    path: 'panier',
    component: PanierComponent,
    canActivate: [authGuard]
  },

  { path: 'auth', component: Auth },
  { path: '**', redirectTo: '' }
];
