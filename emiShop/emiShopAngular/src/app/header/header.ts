import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // AJOUT IMPORTANT
import { ProduitService } from '../service/produit-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink], // AJOUTER RouterLink ICI
  templateUrl: './header.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  cartCount: number = 0;
  public produitService = inject(ProduitService);

  ngOnInit(): void {
    this.produitService.cart$.subscribe((items: any[]) => {
      this.cartCount = items.reduce((acc: number, item: any) => acc + item.quantity, 0);
    });
  }
}
