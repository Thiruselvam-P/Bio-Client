import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/models';

@Component({
  standalone: false,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  kitchenware: Product[] = [];
  drinkware: Product[] = [];
  fruits: Product[] = [];
  millets: Product[] = [];
  spices: Product[] = [];
  organicRice: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.fetchFeaturedProducts();
  }

  marqueeProducts: Product[] = [];

  fetchFeaturedProducts() {
    this.loading = true;

    // Fetch all needed categories and a general 'all' list in parallel
    forkJoin({
      kitchenware: this.productService.getProducts('', 'Kitchenware'),
      fruits: this.productService.getProducts('', 'Fruits'),
      drinkware: this.productService.getProducts('', 'Drinkware'),
      millets: this.productService.getProducts('', 'Millets'),
      spices: this.productService.getProducts('', 'Spices'),
      rice: this.productService.getProducts('', 'Organic Rice'),
      all: this.productService.getProducts()
    }).subscribe({
      next: (res: any) => {
        // Assign to specific categories
        this.kitchenware = res.kitchenware.slice(0, 4);
        this.fruits = res.fruits.slice(0, 4);
        this.drinkware = res.drinkware.slice(0, 4);
        this.millets = res.millets.slice(0, 4);
        this.spices = res.spices.slice(0, 4);
        this.organicRice = res.rice.slice(0, 4);

        // Fallback: If ALL specific produce categories are empty, 
        // let's fill 'kitchenware' with the latest 4 products from 'all' 
        // so the page doesn't look broken.
        const totalProduce = this.kitchenware.length + this.fruits.length + this.drinkware.length +
          this.millets.length + this.spices.length + this.organicRice.length;

        if (totalProduce === 0 && res.all.length > 0) {
          this.kitchenware = res.all.slice(0, 8); // Just show whatever we have in the first section
        }

        // Update marquee with specifically Kitchenware and Drinkware as requested
        let marqueeItems = [...(res.kitchenware || []), ...(res.drinkware || [])];

        // If we have items in these specific categories, use them exclusively
        if (marqueeItems.length > 0) {
          const originalItems = [...marqueeItems];
          // Ensure enough items for a smooth loop
          while (marqueeItems.length < 8) {
            marqueeItems = [...marqueeItems, ...originalItems];
          }
          this.marqueeProducts = marqueeItems;
        } else {
          // If BOTH requested categories are empty, hide the section or fallback gracefully
          this.marqueeProducts = [];
        }

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching featured products:', err);
        this.loading = false;
      }
    });
  }

  updateMarquee() {
    // Logic moved inside fetchFeaturedProducts for synchronization
  }

  addToCart(product: Product) {
    const confirmAdd = confirm(`Are you sure you want to add "${product.productName}" into cart?`);
    if (confirmAdd) {
      this.cartService.addToCart(product);
      alert('Item added to cart successfully!');
    }
  }
}
