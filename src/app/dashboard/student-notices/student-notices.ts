import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

interface Notice {
  id?: string;
  title?: string;
  text: string;
  audience?: string;
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

  studentName: string;
  studentInitials: string;
  notices: Notice[] = [];

  constructor(private authService: AuthService) {
    this.studentName = this.authService.getName() || 'Student';
    this.studentInitials = this.studentName
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
    const stored = localStorage.getItem('adminNotices');
    this.notices = stored ? JSON.parse(stored) : [];
  }

  logout(): void { this.authService.logout(); }
}
