import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  // 🛒 Cart Count
  cartCount: number = 0;
  searchTerm: string = '';
  isScrolled: boolean = false;
  searchOpen: boolean = false;

  @ViewChild('searchInput') searchInputRef!: ElementRef<HTMLInputElement>;

  // 🎁 Top Offer Messages
  offers: string[] = [
    'Order Above ₹799 - Get 3 Free Gifts + 10% Extra 🎁',
    'Order Above ₹999 - Get Apron + 10% Extra 🛒',
    'Order Above ₹1999 - Get Makeup Pouch + 10% Extra 👝',
    'Order Above ₹4999 - Get Tumbler + 10% Extra 🥤',
    "Women's Day Sale is LIVE 🌸"
  ];

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // 🛒 Subscribe Cart Count
    this.cartService.getCartCount().subscribe({
      next: (count: number) => {
        this.cartCount = count;
      },
      error: (err) => {
        console.error('Cart count error:', err);
      },
    });
  }

  // 🔍 Toggle search bar open/close
  toggleSearch(): void {
    if (this.searchOpen && this.searchTerm.trim()) {
      // If already open and has text → perform search
      this.search();
    } else {
      this.searchOpen = !this.searchOpen;
      if (this.searchOpen) {
        // Focus the input after animation
        setTimeout(() => {
          this.searchInputRef?.nativeElement.focus();
        }, 200);
      } else {
        this.searchTerm = '';
      }
    }
  }

  // 🔍 Navigate to products with search query
  search(): void {
    const term = this.searchTerm.trim();
    if (term) {
      this.router.navigate(['/products'], { queryParams: { search: term } });
      this.searchTerm = '';
      this.searchOpen = false;
    }
  }

  // Close search on outside click
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (this.searchOpen && !target.closest('.search-wrap')) {
      this.searchOpen = false;
      this.searchTerm = '';
    }
  }

  // 🚪 Logout
  logout(): void {
    this.authService.logout();
  }

  // 🖱️ Scroll Monitor
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }
}
