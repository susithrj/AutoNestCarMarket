import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/auth/auth.service';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly userMenuOpen = signal(false);

  private readonly currentPath = signal(this.normalizePath(this.router.url));

  readonly browseNavActive = computed(() => {
    const p = this.currentPath();
    return p === '/' || p.startsWith('/cars/');
  });
  readonly sellNavActive = computed(() => this.currentPath().startsWith('/admin'));

  readonly isAuthenticated = computed(() => this.auth.isAuthenticated());
  readonly email = computed(() => this.auth.email() ?? '');
  readonly role = computed(() => this.auth.role());

  readonly initials = computed(() => {
    const e = (this.email() || '').trim();
    if (!e) return 'U';
    return e[0]?.toUpperCase() ?? 'U';
  });

  /** First segment of local-part for header label (e.g. john.doe@ → John). */
  readonly firstName = computed(() => {
    const e = (this.email() || '').trim();
    if (!e) return '';
    const local = (e.split('@')[0] ?? '').trim();
    if (!local) return '';
    const token = local.split(/[._-]/)[0] ?? local;
    if (!token) return '';
    return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.currentPath.set(this.normalizePath(this.router.url)));
  }

  private normalizePath(url: string): string {
    const path = (url.split('?')[0] ?? '/').trim() || '/';
    return path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  }

  async logout() {
    this.userMenuOpen.set(false);
    await this.auth.logout();
    await this.router.navigate(['/']);
  }
}
