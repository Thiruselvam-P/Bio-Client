import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/models';

export interface CartItem extends Product {
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItems: CartItem[] = [];
    private cartSubject = new BehaviorSubject<CartItem[]>([]);

    private cartCountSubject = new BehaviorSubject<number>(0);

    constructor() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart);
            this.cartSubject.next(this.cartItems);
            this.updateCartCount();
        }
    }

    getCartCount() {
        return this.cartCountSubject.asObservable();
    }

    getItemCount() {
        return this.cartCountSubject.value;
    }

    private updateCartCount() {
        const count = this.cartItems.reduce((total, item) => total + item.quantity, 0);
        this.cartCountSubject.next(count);
    }

    getCart() {
        return this.cartSubject.asObservable();
    }

    addToCart(product: Product, quantity: number = 1) {
        const existingItem = this.cartItems.find(item => item._id === product._id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cartItems.push({ ...product, quantity });
        }
        this.saveCart();
    }

    removeFromCart(productId: string) {
        this.cartItems = this.cartItems.filter(item => item._id !== productId);
        this.saveCart();
    }

    updateQuantity(productId: string, quantity: number) {
        const item = this.cartItems.find(item => item._id === productId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.cartItems = [];
        this.saveCart();
    }

    getTotalAmount() {
        return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }


    private saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cartItems));
        this.cartSubject.next(this.cartItems);
        this.updateCartCount();
    }
}
