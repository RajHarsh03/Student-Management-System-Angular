import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Notice {
  text: string;
  date: string;
}

@Component({
  selector: 'app-admin-notices',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './admin-notices.html',
  styleUrls: ['./admin-notices.css']
})
export class AdminNoticesComponent {

  notices: Notice[] = [];
  newNotice: string = '';
  showForm: boolean = false;

  constructor() {
    this.loadNotices();
  }

  loadNotices(): void {
    const stored = localStorage.getItem('adminNotices');
    this.notices = stored ? JSON.parse(stored) : [];
  }

  postNotice(): void {
    if (!this.newNotice.trim()) return;
    const notice: Notice = {
      text: this.newNotice.trim(),
      date: new Date().toLocaleString()
    };
    this.notices.unshift(notice);
    localStorage.setItem('adminNotices', JSON.stringify(this.notices));
    this.newNotice = '';
    this.showForm = false;
  }

  deleteNotice(index: number): void {
    this.notices.splice(index, 1);
    localStorage.setItem('adminNotices', JSON.stringify(this.notices));
  }
}
