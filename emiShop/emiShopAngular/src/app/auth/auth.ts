import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Pour *ngIf
import { FormsModule } from '@angular/forms';   // Pour [(ngModel)]
import { Router } from '@angular/router';
import { FirebaseService } from '../service/firebase.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.html',
  styleUrls: ['./auth.css'] // Correction: styleUrls (pluriel)
})
export class Auth {

  email: string = '';
  password: string = '';
  isLoginMode: boolean = true; // Par défaut, on est en mode "Connexion"
  errorMessage: string = '';

  private fbService = inject(FirebaseService);
  private router = inject(Router);

  // Basculer entre Connexion et Inscription
  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // On efface les erreurs
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = "Veuillez remplir tous les champs.";
      return;
    }

    // On prépare l'action (Login ou Register)
    const action$ = this.isLoginMode
      ? this.fbService.login(this.email, this.password)
      : this.fbService.register(this.email, this.password);

    action$.subscribe({
      next: () => {
        console.log("Succès !");
        this.router.navigate(['/']); // Redirection vers l'accueil
      },
      error: (err) => {
        console.error(err);
        // Gestion des messages d'erreur Firebase courants
        if (err.code === 'auth/invalid-credential') {
          this.errorMessage = "Email ou mot de passe incorrect.";
        } else if (err.code === 'auth/email-already-in-use') {
          this.errorMessage = "Cet email est déjà utilisé.";
        } else if (err.code === 'auth/weak-password') {
          this.errorMessage = "Le mot de passe doit faire au moins 6 caractères.";
        } else {
          this.errorMessage = "Une erreur est survenue (" + err.code + ")";
        }
      }
    });
  }
}
