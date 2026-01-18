import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  id: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts$ = new BehaviorSubject<Toast[]>([]);

  show(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success') {
    const id = Date.now();
    const newToast: Toast = { message, type, id };

    // On ajoute le toast à la liste
    this.toasts$.next([...this.toasts$.value, newToast]);

    // On le retire automatiquement après 3 secondes
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number) {
    const currentToasts = this.toasts$.value.filter(t => t.id !== id);
    this.toasts$.next(currentToasts);
  }
}
