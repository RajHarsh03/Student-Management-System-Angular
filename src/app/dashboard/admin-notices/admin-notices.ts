import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Notice {
  id: string;
  title: string;
  text: string;
  audience: string;
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
  newTitle: string = '';
  newNotice: string = '';
  newAudience: string = 'All Students';
  searchQuery: string = '';
  showForm: boolean = false;
  formError: string = '';
  editingNoticeId: string | null = null;

  constructor() {
    this.loadNotices();
  }

  loadNotices(): void {
    const stored = localStorage.getItem('adminNotices');
    const savedNotices = stored ? JSON.parse(stored) as Partial<Notice>[] : [];
    this.notices = savedNotices.map((notice, index) => ({
      id: notice.id ?? `legacy-${index}`,
      title: notice.title ?? 'Campus announcement',
      text: notice.text ?? '',
      audience: notice.audience ?? 'All Students',
      date: notice.date ?? ''
    }));
  }

  postNotice(): void {
    if (!this.newTitle.trim() || !this.newNotice.trim()) {
      this.formError = 'Add both a title and message before publishing.';
      return;
    }

    const notice: Notice = {
      id: this.editingNoticeId ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: this.newTitle.trim(),
      text: this.newNotice.trim(),
      audience: this.newAudience,
      date: new Date().toLocaleString()
    };

    if (this.editingNoticeId) {
      this.notices = this.notices.map(existing =>
        existing.id === this.editingNoticeId ? notice : existing
      );
    } else {
      this.notices.unshift(notice);
    }

    localStorage.setItem('adminNotices', JSON.stringify(this.notices));
    this.closeForm();
  }

  openForm(): void {
    this.editingNoticeId = null;
    this.newTitle = '';
    this.newNotice = '';
    this.newAudience = 'All Students';
    this.formError = '';
    this.showForm = true;
  }

  editNotice(notice: Notice): void {
    this.editingNoticeId = notice.id;
    this.newTitle = notice.title;
    this.newNotice = notice.text;
    this.newAudience = notice.audience;
    this.formError = '';
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingNoticeId = null;
    this.newTitle = '';
    this.newNotice = '';
    this.newAudience = 'All Students';
    this.formError = '';
  }

  deleteNotice(id: string): void {
    this.notices = this.notices.filter(notice => notice.id !== id);
    localStorage.setItem('adminNotices', JSON.stringify(this.notices));
  }

  get filteredNotices(): Notice[] {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.notices;

    return this.notices.filter(notice =>
      `${notice.title} ${notice.text} ${notice.audience}`.toLowerCase().includes(query)
    );
  }
}
