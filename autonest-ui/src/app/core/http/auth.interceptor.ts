import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const AUTH_ENDPOINT_PREFIX = '/api/auth/';
const RETRIED_HEADER = 'x-autonest-retried';

let refreshInFlight: Promise<void> | null = null;

function isAuthEndpoint(url: string) {
  return url.startsWith(AUTH_ENDPOINT_PREFIX);
}

async function runRefresh(auth: AuthService): Promise<void> {
  if (!refreshInFlight) {
    refreshInFlight = auth
      .refresh()
      .then(() => void 0)
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  let request = req;

  const token = auth.accessToken();
  if (token && !isAuthEndpoint(request.url)) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(request).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse)) return throwError(() => err);

      const is401 = err.status === 401;
      const alreadyRetried = request.headers.has(RETRIED_HEADER);

      if (!is401 || alreadyRetried || isAuthEndpoint(request.url)) {
        return throwError(() => err);
      }

      return from(runRefresh(auth)).pipe(
        switchMap(() => {
          const newToken = auth.accessToken();
          const retriedReq = request.clone({
            setHeaders: {
              ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
              [RETRIED_HEADER]: '1'
            }
          });
          return next(retriedReq);
        }),
        catchError((refreshErr: unknown) => {
          auth.clear();
          return from(router.navigate(['/login'], { queryParams: { returnUrl: router.url } })).pipe(
            switchMap(() => throwError(() => refreshErr))
          );
        })
      );
    })
  );
};

