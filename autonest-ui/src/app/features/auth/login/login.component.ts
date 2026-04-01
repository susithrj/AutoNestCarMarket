import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastService } from '../../../shared/components/toast/toast.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-screen-xl px-4 py-6 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-6">
        <div class="text-2xl font-medium text-gray-900">Sign in</div>

        <div class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800" *ngIf="error()">
          {{ error() }}
        </div>

        <form class="mt-5 space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <label class="block">
            <div class="text-xs font-medium text-gray-500">Email</div>
            <input class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="email" placeholder="admin@autonest.com" />
            <div class="mt-1 text-xs text-red-600" *ngIf="showError('email')">Valid email required.</div>
          </label>

          <label class="block">
            <div class="text-xs font-medium text-gray-500">Password</div>
            <input type="password" class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary" formControlName="password" placeholder="••••••••" />
            <div class="mt-1 text-xs text-red-600" *ngIf="showError('password')">Password required.</div>
          </label>

          <button type="submit" class="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark" [disabled]="loading()">
            {{ loading() ? 'Signing in…' : 'Sign in' }}
          </button>

          <div class="text-center text-sm text-gray-600">
            No account?
            <a class="font-medium text-primary underline" routerLink="/register">Create one</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  showError(name: 'email' | 'password') {
    const c = this.form.get(name);
    return !!c && c.touched && c.invalid;
  }

  async submit() {
    this.error.set(null);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      const v = this.form.getRawValue();
      await this.auth.login({ email: v.email ?? '', password: v.password ?? '' });
      this.toast.success('Signed in');
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';
      await this.router.navigateByUrl(returnUrl);
    } catch {
      this.error.set('Invalid email or password');
      this.toast.error('Sign in failed');
    } finally {
      this.loading.set(false);
    }
  }
}

