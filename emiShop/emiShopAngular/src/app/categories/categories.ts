import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProduitService } from '../service/produit-service'; // Vérifiez le chemin

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css']
})
export class CategoriesComponent implements OnInit {

  // La liste qui contiendra vos catégories (Beauty, Fragrances...)
  categories: any[] = [];

  private produitService = inject(ProduitService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.produitService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('Catégories récupérées :', this.categories);

        // 2. On FORCE la mise à jour de l'écran pour éviter l'erreur NG0100
        this.cd.detectChanges();
      },
      error: (err) => console.error('Erreur catégories:', err)
    });
  }
  onSelectCategory(slug: string) {
    console.log('Catégorie cliquée :', slug);
    // On envoie l'info au service
    this.produitService.categorySelected.next(slug);
  }
}
