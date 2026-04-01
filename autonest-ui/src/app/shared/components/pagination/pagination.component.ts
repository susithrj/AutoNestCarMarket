import { Component, computed, input, output } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgIf],
  template: `
    <nav class="flex items-center justify-center gap-1" aria-label="Pagination" *ngIf="totalPages() > 1">
      <button
        type="button"
        class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        [disabled]="currentPage() <= 1"
        (click)="goTo(currentPage() - 1)"
      >
        Prev
      </button>

      @for (p of pages(); track p) {
        @if (p === '…') {
          <span class="px-2 py-2 text-sm text-gray-500">…</span>
        } @else {
          <button
            type="button"
            class="rounded-lg px-3 py-2 text-sm"
            [class.bg-primary]="p === currentPage()"
            [class.text-white]="p === currentPage()"
            [class.bg-white]="p !== currentPage()"
            [class.text-gray-700]="p !== currentPage()"
            [class.border]="true"
            [class.border-gray-200]="p !== currentPage()"
            [class.border-primary]="p === currentPage()"
            (click)="goTo(p)"
            [attr.aria-current]="p === currentPage() ? 'page' : null"
          >
            {{ p }}
          </button>
        }
      }

      <button
        type="button"
        class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
        [disabled]="currentPage() >= totalPages()"
        (click)="goTo(currentPage() + 1)"
      >
        Next
      </button>
    </nav>
  `
})
export class PaginationComponent {
  currentPage = input.required<number>(); // 1-indexed
  totalPages = input.required<number>();
  pageChange = output<number>();

  pages = computed<(number | '…')[]>(() => {
    const total = this.totalPages();
    const current = this.currentPage();

    const maxButtons = 5;
    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | '…')[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    const adjustedStart = Math.max(1, end - 4);

    if (adjustedStart > 1) {
      pages.push(1);
      if (adjustedStart > 2) pages.push('…');
    }

    for (let p = adjustedStart; p <= end; p++) pages.push(p);

    if (end < total) {
      if (end < total - 1) pages.push('…');
      pages.push(total);
    }

    return pages;
  });

  goTo(page: number) {
    const total = this.totalPages();
    const clamped = Math.max(1, Math.min(total, page));
    if (clamped !== this.currentPage()) {
      this.pageChange.emit(clamped);
    }
  }
}

