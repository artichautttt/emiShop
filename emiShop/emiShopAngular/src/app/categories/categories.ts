import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../service/produit-service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styles: [`
    /* CONTENEUR PRINCIPAL */
    .sidebar-container {
      /* Hauteur de l'écran moins la hauteur du header (environ 80px) */
      height: calc(100vh - 80px);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 80px; /* On le colle juste sous le header */
    }

    /* ZONE DÉFILANTE (LISTE) */
    .scrollable-list {
      overflow-y: auto; /* Active le scroll/swipe vertical */
      flex-grow: 1;     /* Prend tout l'espace restant */
    }

    /* --- ESTHÉTIQUE SCROLLBAR (Chrome, Safari, Edge) --- */
    .scrollable-list::-webkit-scrollbar {
      width: 6px; /* Barre très fine */
    }
    .scrollable-list::-webkit-scrollbar-track {
      background: #212529; /* Fond sombre */
    }
    .scrollable-list::-webkit-scrollbar-thumb {
      background-color: #495057; /* Couleur de la barre */
      border-radius: 10px;
    }
    .scrollable-list::-webkit-scrollbar-thumb:hover {
      background-color: #ffc107; /* Jaune au survol */
    }

    /* --- ESTHÉTIQUE BOUTONS --- */
    .list-group-item-action:hover {
      background-color: #343a40;
      color: #ffc107;
      padding-left: 1.5rem; /* Petit effet de mouvement */
      transition: all 0.2s;
    }
    .active-cat {
      background-color: #ffc107 !important;
      color: #000 !important;
      font-weight: bold;
      border-color: #ffc107 !important;
    }
  `]
})
export class CategoriesComponent implements OnInit {

  categories: any[] = [];
  selectedCategory: string = '';

  private produitService = inject(ProduitService);

  ngOnInit(): void {
    this.produitService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  onSelectCategory(slug: string) {
    this.selectedCategory = slug;
    this.produitService.selectCategory(slug);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
