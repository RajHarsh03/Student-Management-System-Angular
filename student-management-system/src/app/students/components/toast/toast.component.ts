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
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
