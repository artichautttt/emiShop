import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../service/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055;">
      @for (toast of toastService.toasts$ | async; track toast.id) {
        <div class="toast show align-items-center text-white border-0 mb-2"
             [ngClass]="'bg-' + toast.type"
             role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body fs-6">
              <i class="bi" [ngClass]="{
                'bi-check-circle-fill': toast.type === 'success',
                'bi-exclamation-triangle-fill': toast.type === 'warning',
                'bi-x-circle-fill': toast.type === 'danger'
              }"></i>
              {{ toast.message }}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    (click)="toastService.remove(toast.id)"></button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast { transition: all 0.3s ease-in-out; opacity: 0.95; }
    .toast:hover { opacity: 1; }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
