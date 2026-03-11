import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  quantity = 1;
  loading = true;
  placing = false;
  successMsg = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching product details:', err);
          this.router.navigate(['/products']);
        }
      });
    }
  }

  updateQty(change: number) {
    const newQty = this.quantity + change;
    if (newQty >= 1) this.quantity = newQty;
  }

  placeOrder() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product?._id) return;
    this.router.navigate(['/checkout', this.product._id], {
      queryParams: { qty: this.quantity }
    });
  }

  addToCart() {
    if (!this.product) return;
    const confirmAdd = confirm(`Are you sure you want to add "${this.product.productName}" into cart?`);
    if (confirmAdd) {
      this.cartService.addToCart(this.product, this.quantity);
      alert('Item added to cart successfully!');
    }
  }
}
