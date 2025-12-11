import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// CORRECTION 1 : Le chemin relatif vers votre nouveau dossier service
import { ProduitService, Product } from '../service/produit-service';

@Component({
  selector: 'app-list-produit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-produit.html', // Vérifiez si c'est .html ou .component.html
  styleUrls: ['./list-produit.css']
})
export class ListProduitComponent implements OnInit {

  produits: Product[] = [];

  // CORRECTION 2 : On retire ': unknown' pour que TypeScript reconnaisse le service
  private produitService = inject(ProduitService);

  ngOnInit(): void {
    this.produitService.getProducts().subscribe((data: any) => {
      this.produits = data.products;
    });
  }

  addToCart(product: Product) {
    console.log('Ajout au panier :', product.title);
  }
}
