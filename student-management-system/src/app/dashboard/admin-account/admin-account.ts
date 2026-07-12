import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-admin-account',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-account.html',
  styleUrls: ['./admin-account.css']
})
export class AdminAccountComponent {

  username: string = '';
  name: string = '';

  constructor(private authService: AuthService) {
    this.username = this.authService.getUsername() || 'admin';
    this.name = this.authService.getName() || 'Admin User';
  }

  logout(): void {
    this.authService.logout();
  }
}
