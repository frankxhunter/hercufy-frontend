import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_URL, UpdateUsernameRequest, UserResponse } from '../api';
import { User } from '../models';

/** Convierte la respuesta de /users/me al modelo que usan las pantallas. */
export function toUser(d: UserResponse): User {
  return { id: String(d.id), name: d.username, email: d.email, role: d.role, emailVerified: d.emailVerified };
}

/** Datos de la cuenta del usuario autenticado. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);

  me(): Promise<User> {
    return firstValueFrom(this.http.get<UserResponse>(`${API_URL}/users/me`)).then(toUser);
  }

  updateUsername(username: string): Promise<User> {
    const body: UpdateUsernameRequest = { username: username.trim() };
    return firstValueFrom(this.http.patch<UserResponse>(`${API_URL}/users/me`, body)).then(toUser);
  }

  /** Borra la cuenta y, en cascada, sus rutinas y tokens. */
  deleteAccount(): Promise<void> {
    return firstValueFrom(this.http.delete(`${API_URL}/users/me`)).then(() => undefined);
  }
}