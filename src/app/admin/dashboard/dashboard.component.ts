import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: false,
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  summary: any;
  productCount = 0;
  today = new Date();

  // Sales Report properties
  selectedDate: string = new Date().toISOString().split('T')[0];
  salesReport: any = null;
  isLoadingReport = false;

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.orderService.getSalesSummary().subscribe(data => this.summary = data);
    this.productService.getProducts().subscribe(data => this.productCount = data.length);
    this.fetchSalesReport();
  }

  onDateChange(event: any) {
    this.selectedDate = event.target.value;
    this.fetchSalesReport();
  }

  fetchSalesReport() {
    if (!this.selectedDate) return;
    this.isLoadingReport = true;
    this.orderService.getSalesReportByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.salesReport = data;
        this.isLoadingReport = false;
      },
      error: (err) => {
        console.error('Error fetching sales report:', err);
        this.isLoadingReport = false;
      }
    });
  }
}
