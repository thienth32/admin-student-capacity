import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const user = this.auth.currentUserValue;
    const jwtToken = this.auth.currentTokenValue;
    const isLoggedin = user!.id != undefined && jwtToken.length > 0;
    const isJwtUrl = request.url.startsWith(environment.jwtTokenUrl);

    if(isLoggedin && isJwtUrl){
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${jwtToken}`
        }
      })
    }

    
    return next.handle(request);
  }
}
