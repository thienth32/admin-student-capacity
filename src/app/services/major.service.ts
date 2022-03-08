import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MajorService {

  constructor(private http: HttpClient) { }

  list(url : string): any {
    return this.http.get<any>(url);
  }
}
