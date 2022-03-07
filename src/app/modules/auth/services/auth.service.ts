import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ResponsePayload } from 'src/app/_share/models/response-payload';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export type UserType = UserModel | undefined;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<UserType>;
  currentToken$: Observable<string>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserType>;
  currentTokenSubject: BehaviorSubject<string>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): UserType {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserType) {
    this.currentUserSubject.next(user);
  }

  get currentTokenValue(): string {
    return this.currentTokenSubject.value;
  }

  set currentTokenValue(authToken: string) {
    this.currentTokenSubject.next(authToken);
  }

  constructor(
    private authHttpService: AuthHTTPService,
    private http: HttpClient,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
    this.currentTokenSubject = new BehaviorSubject<string>("");
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.currentToken$ = this.currentTokenSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  // login(email: string, password: string): Observable<UserType> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.login(email, password).pipe(
  //     map((auth: AuthModel) => {
  //       const result = this.setAuthFromLocalStorage(auth);
  //       return result;
  //     }),
  //     switchMap(() => this.getUserByToken()),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  socialLogin(authToken: string): Observable<ResponsePayload>{
    this.isLoadingSubject.next(true);
    return this.http.post<ResponsePayload>('http://localhost:8000/api/auth/login-token', {token: authToken}).pipe(
      map((resp: ResponsePayload) => {
        
        this.currentUserSubject.next(resp.payload.user);
        this.currentTokenSubject.next(resp.payload.token);
        this.setAuthFromLocalStorage(resp);
        return resp;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    )
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<UserType> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return of(undefined);
    }

    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', `Bearer ${auth.authToken}`);

    return this.http.get<ResponsePayload>('http://localhost:8000/api/v1/get-user-by-token', {headers: headers})
    .pipe(
      map((resp: ResponsePayload) => {
        if(resp.status == true){
          this.currentUserSubject.next(resp.payload);
        }else{
          this.logout();
        }
        return resp.payload;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    )
    // return this.authHttpService.getUserByToken(auth.authToken).pipe(
    //   map((user: UserType) => {
    //     if (user) {
    //       this.currentUserSubject.next(user);
    //     } else {
    //       this.logout();
    //     }
    //     return user;
    //   }),
    //   finalize(() => this.isLoadingSubject.next(false))
    // );
  }

  // need create new user then login
  // registration(user: UserModel): Observable<any> {
  //   this.isLoadingSubject.next(true);
  //   return this.authHttpService.createUser(user).pipe(
  //     map(() => {
  //       this.isLoadingSubject.next(false);
  //     }),
  //     switchMap(() => this.login(user.email, user.password)),
  //     catchError((err) => {
  //       console.error('err', err);
  //       return of(undefined);
  //     }),
  //     finalize(() => this.isLoadingSubject.next(false))
  //   );
  // }

  forgotPassword(email: string): Observable<boolean> {
    this.isLoadingSubject.next(true);
    return this.authHttpService
      .forgotPassword(email)
      .pipe(finalize(() => this.isLoadingSubject.next(false)));
  }

  // private methods
  private setAuthFromLocalStorage(resp: ResponsePayload): boolean {
    if(resp.status == true){
      localStorage.setItem('user', JSON.stringify(resp.payload.user));
      localStorage.setItem('auth_token', resp.payload.token);
    }else{
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
    }
    return resp.status;
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    // if (auth && auth.authToken) {
    //   localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
    //   return true;
    // }
    // return false;
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem('auth_token');
      if (!lsValue) {
        return undefined;
      }
      let authData = new AuthModel();
      authData.authToken = lsValue;
      console.log(authData);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
