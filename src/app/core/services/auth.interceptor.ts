import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { from, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { API_URL, SKIP_AUTH } from '../api';
import { AuthService } from './auth.service';

/**
 * Añade el access token a las peticiones de la API y, si el servidor rechaza la sesión,
 * renueva el token y reintenta la petición una sola vez. El backend responde 403 (no 401)
 * cuando el token falta, caduca o no es válido, así que los dos códigos cuentan. Si el
 * refresh tampoco vale, la sesión se cierra y el error sigue al llamador.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(API_URL) || req.context.get(SKIP_AUTH)) return next(req);

  const auth = inject(AuthService);
  const send = (token: string | null) =>
    next(token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req);

  return from(auth.usable()).pipe(
    switchMap(() => send(auth.accessToken())),
    catchError((err) => {
      const rejected = err instanceof HttpErrorResponse && (err.status === 401 || err.status === 403);
      if (!rejected || !auth.refreshToken()) return throwError(() => err);

      return from(auth.renew()).pipe(
        switchMap((token) => (token ? send(token) : throwError(() => err))),
      );
    }),
  );
};