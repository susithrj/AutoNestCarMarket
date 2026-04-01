import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'autonest.favoriteCarIds';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  readonly ids = signal<Set<number>>(this.readFromStorage());

  isFavorite(id: number): boolean {
    return this.ids().has(id);
  }

  toggle(id: number, event?: Event): void {
    event?.stopPropagation();
    const next = new Set(this.ids());
    if (next.has(id)) next.delete(id);
    else next.add(id);
    this.ids.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    } catch {
      /* ignore quota / private mode */
    }
  }

  private readFromStorage(): Set<number> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return new Set();
      return new Set(parsed.filter((n): n is number => typeof n === 'number' && Number.isFinite(n)));
    } catch {
      return new Set();
    }
  }
}
