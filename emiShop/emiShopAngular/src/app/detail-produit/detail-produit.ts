import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Nécessaire pour [(ngModel)]
import { ProduitService, Product } from '../service/produit-service';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './detail-produit.html',
  styles: []
})
export class DetailProduitComponent implements OnInit {

  product: Product | null = null;
  loading: boolean = true;
  errorMsg: string = '';
  isAdded: boolean = false;

  // Variables pour les commentaires
  comments: any[] = [];
  newComment: string = '';
  currentUser: any = null;

  private route = inject(ActivatedRoute);
  private produitService = inject(ProduitService);
  private fbService = inject(FirebaseService);

  ngOnInit(): void {
    // 1. On surveille l'utilisateur connecté
    this.fbService.user$.subscribe(user => this.currentUser = user);

    // 2. On surveille l'ID dans l'URL pour charger le produit et ses avis
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = Number(idParam);

      this.loading = true;
      this.errorMsg = '';
      this.product = null;
      this.comments = [];

      if (idParam && !isNaN(id)) {
        this.loadData(id);
      } else {
        this.errorMsg = "ID du produit invalide.";
        this.loading = false;
      }
    });
  }

  loadData(id: number) {
    // Chargement du Produit
    this.produitService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = "Impossible de charger le produit.";
        this.loading = false;
      }
    });

    // Chargement des Commentaires depuis Firebase
    this.fbService.getComments(id).subscribe(data => {
      this.comments = data;
    });
  }

  addToCart() {
    if (this.product) {
      this.produitService.addToCart(this.product);
      this.isAdded = true;
      setTimeout(() => { this.isAdded = false; }, 2000);
    }
  }

  sendComment() {
    if (this.newComment.trim() && this.product) {
      const userName = this.currentUser ? this.currentUser.email : 'Anonyme';
      const productId = this.product.id; // On sauvegarde l'ID

      this.fbService.addComment(productId, userName, this.newComment)
        .then(() => {
          this.newComment = ''; // 1. On vide le champ

          // --- AJOUT IMPORTANT ---
          // 2. On recharge la liste des commentaires pour voir le nouveau immédiatement
          this.fbService.getComments(productId).subscribe(updatedComments => {
            this.comments = updatedComments;
          });
        })
        .catch(err => console.error("Erreur d'envoi", err));
    }
  }

}
