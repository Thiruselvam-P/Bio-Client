import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/models';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  searchQuery = '';
  categoryFilter = '';
  selectedImage: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['search'] || '';
      this.categoryFilter = params['category'] || '';
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts(this.searchQuery, this.categoryFilter).subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onSearch() {
    this.loadProducts();
  }

  addToCart(product: Product) {
    const confirmAdd = confirm(`Are you sure you want to add "${product.productName}" into cart?`);
    if (confirmAdd) {
      this.cartService.addToCart(product);
      alert('Item added to cart successfully!');
    }
  }

  buyNow(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/checkout', product._id]);
  }

  openModal(imageUrl: string) {
    this.selectedImage = imageUrl;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  closeModal() {
    this.selectedImage = null;
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}
