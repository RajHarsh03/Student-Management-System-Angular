import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-student-account',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './student-account.html',
  styleUrls: ['./student-account.css']
})
export class StudentAccountComponent {

  username: string = '';
  name: string = '';

  constructor(private authService: AuthService) {
    this.username = this.authService.getUsername() || 'student';
    this.name = this.authService.getName() || 'Student';
  }

  logout(): void { this.authService.logout(); }
}
