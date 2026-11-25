import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast {{ toast.type }}">{{ toast.message }}</div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .toast {
      min-width: 260px;
      max-width: 380px;
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 500;
      color: #fff;
      box-shadow: 0 4px 14px rgba(0,0,0,.18);
      animation: slideIn .3s ease;
    }
    .toast.success { background: #2ecc71; }
    .toast.error   { background: #dc3545; }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(40px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
