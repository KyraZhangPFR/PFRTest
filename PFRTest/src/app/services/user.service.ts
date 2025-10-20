import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com';

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<User[]>(`${this.API_URL}/users`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to load users. Please try again.');
        return throwError(() => error);
      })
    );
  }

  getUserPosts(userId: number): Observable<Post[]> {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.http.get<Post[]>(`${this.API_URL}/users/${userId}/posts`).pipe(
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        this.errorSubject.next('Failed to load posts. Please try again.');
        return throwError(() => error);
      })
    );
  }
}
