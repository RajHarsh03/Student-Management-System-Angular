import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface Notice {
  text: string;
  date: string;
}

@Component({
  selector: 'app-student-notices',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './student-notices.html',
  styleUrls: ['./student-notices.css']
})
export class StudentNoticesComponent {

  notices: Notice[] = [];

  constructor(private authService: AuthService) {
    const stored = localStorage.getItem('adminNotices');
    this.notices = stored ? JSON.parse(stored) : [];
  }

  logout(): void { this.authService.logout(); }
}
