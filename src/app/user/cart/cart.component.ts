import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
    standalone: false,
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];

    constructor(private cartService: CartService, private router: Router) { }

    ngOnInit() {
        this.cartService.getCart().subscribe(items => {
            this.cartItems = items;
        });
    }

    updateQuantity(productId: string | undefined, qty: number) {
        if (productId) {
            // Find current quantity
            const item = this.cartItems.find(i => i._id === productId);
            if (item) {
                let newQty = item.quantity + qty;
                if (newQty < 1) return;
                this.cartService.updateQuantity(productId, newQty);
            }
        }
    }

    removeItem(productId: string | undefined) {
        if (productId) {
            this.cartService.removeFromCart(productId);
        }
    }

    getTotal(): number {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    onCheckout() {
        this.router.navigate(['/checkout']);
    }

    goToProducts() {
        this.router.navigate(['/products']);
    }
}
