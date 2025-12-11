// Structure d'un produit unique
export interface Produit {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string; // L'image principale optimisée
  images: string[];  // Le tableau de toutes les images
}

// Structure de la réponse globale de l'API (l'enveloppe)
export interface ProductResponse {
  products: Produit[];
  total: number;
  skip: number;
  limit: number;
}
