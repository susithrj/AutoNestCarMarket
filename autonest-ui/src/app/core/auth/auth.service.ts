import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthResponse, Role } from './auth.models';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly _accessToken = signal<string | null>(null);
  private readonly _email = signal<string | null>(null);
  private readonly _role = signal<Role | null>(null);

  readonly isAuthenticated = computed(() => !!this._accessToken());

  accessToken() {
    return this._accessToken();
  }

  email() {
    return this._email();
  }

  role() {
    return this._role();
  }

  setAuth(auth: AuthResponse) {
    this._accessToken.set(auth.accessToken);
    this._email.set(auth.email);
    this._role.set(auth.role);
  }

  clear() {
    this._accessToken.set(null);
    this._email.set(null);
    this._role.set(null);
  }

  async login(req: LoginRequest): Promise<AuthResponse> {
    const res = await firstValueFrom(this.http.post<AuthResponse>('/api/auth/login', req));
    this.setAuth(res);
    return res;
  }

  async register(req: RegisterRequest): Promise<void> {
    await firstValueFrom(this.http.post<void>('/api/auth/register', req));
  }

  async refresh(): Promise<AuthResponse> {
    const res = await firstValueFrom(this.http.post<AuthResponse>('/api/auth/refresh', {}));
    this.setAuth(res);
    return res;
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(this.http.post<void>('/api/auth/logout', {}));
    } finally {
      this.clear();
    }
  }

  async bootstrapRefresh(): Promise<void> {
    try {
      await this.refresh();
    } catch {
      this.clear();
    }
  }
}

