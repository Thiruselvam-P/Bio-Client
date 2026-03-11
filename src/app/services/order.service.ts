import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://bio-backend.onrender.com/orders';

  constructor(private http: HttpClient) { }

  placeOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  getMyOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/my-orders`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}/status`, { orderStatus: status });
  }

  getSalesSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/summary`);
  }

  getSalesReportByDate(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/report/${date}`);
  }
}
