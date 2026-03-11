import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'https://bio-backend-6agg.onrender.com/contact';

  constructor(private http: HttpClient) { }

  sendMessage(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
