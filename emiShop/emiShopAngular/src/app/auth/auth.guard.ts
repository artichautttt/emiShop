import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { FirebaseService } from '../service/firebase.service';
import { ToastService } from '../service/toast.service';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const fbService = inject(FirebaseService);
  const router = inject(Router);
  const toast = inject(ToastService);

  // On écoute l'état de l'utilisateur UNE seule fois (take(1))
  return fbService.user$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true; // Accès autorisé
      } else {
        // Accès refusé
        toast.show("Veuillez vous connecter pour accéder au panier.", "warning");
        return router.createUrlTree(['/auth']); // Redirection vers la page de connexion
      }
    })
  );
};
