import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/models';

@Component({
    standalone: false,
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
    product?: Product;
    cartItems: any[] = [];
    isCartCheckout = false;
    quantity = 1;
    loading = true;
    placing = false;

    // User Info
    userName = 'Guest User';
    shippingAddress = 'Bonton Software Solutions Pvt Ltd, Sp Infocity, Block A, IIFL Towers, Kandanchavadi, Perungudi, CHENNAI, TAMIL NADU, 600096, India';

    // Checkout States
    checkoutStep = 1; // 1: Selection, 2: Final Review
    showAddressEditor = false;
    selectedPaymentMethod = 'cod';
    deliverySpeed = 'standard';
    couponCode = '';
    deliveryDate: string;
    tomorrowDate: string;

    // Simulation Flags
    showPaymentModal = false;
    paymentSubmitting = false;
    paymentSuccess = false;

    // Card Details for Simulation
    cardNumber = '';
    cardName = '';
    cardExpiry = '';
    cardCVV = '';

    formatCardNumber(event: any) {
        let val = event.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length > 16) val = val.substring(0, 16);
        this.cardNumber = val;
    }

    formatCardName(event: any) {
        this.cardName = event.target.value.toUpperCase();
    }

    formatExpiry(event: any) {
        let val = event.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length > 4) val = val.substring(0, 4);
        if (val.length > 2) {
            val = val.substring(0, 2) + '/' + val.substring(2);
        }
        this.cardExpiry = val;
    }

    formatCVV(event: any) {
        let val = event.target.value.replace(/\D/g, ''); // Remove non-digits
        if (val.length > 3) val = val.substring(0, 3);
        this.cardCVV = val;
    }

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private productService: ProductService,
        private orderService: OrderService,
        private authService: AuthService,
        private cartService: CartService
    ) {
        // Set default delivery date to 3 days from now
        const date = new Date();
        date.setDate(date.getDate() + 3);
        this.deliveryDate = date.toISOString().split('T')[0];

        // Set tomorrow's date
        const tom = new Date();
        tom.setDate(tom.getDate() + 1);
        this.tomorrowDate = tom.toISOString().split('T')[0];
    }

    ngOnInit() {
        if (this.authService.isLoggedIn()) {
            this.userName = this.authService.getUserName() || 'Valuable Customer';
        }

        const productId = this.route.snapshot.paramMap.get('id');
        const qty = this.route.snapshot.queryParamMap.get('qty');
        if (qty) this.quantity = parseInt(qty);

        if (productId) {
            this.isCartCheckout = false;
            this.productService.getProduct(productId).subscribe({
                next: (data) => {
                    this.product = data;
                    this.loading = false;
                },
                error: () => this.router.navigate(['/products'])
            });
        } else {
            this.isCartCheckout = true;
            this.cartService.getCart().subscribe(items => {
                this.cartItems = items;
                if (items.length === 0) {
                    this.router.navigate(['/cart']);
                }
                this.loading = false;
            });
        }
    }

    nextStep() {
        if (this.checkoutStep < 2) this.checkoutStep++;
        window.scrollTo(0, 0);
    }

    goToStep(step: number) {
        this.checkoutStep = step;
        window.scrollTo(0, 0);
    }

    getPaymentMethodLabel() {
        switch (this.selectedPaymentMethod) {
            case 'cod': return 'Cash on Delivery / Pay on Delivery (Cash/Card)';
            case 'upi': return 'UPI (GPay, PhonePe, Paytm)';
            case 'card': return 'Credit or Debit Card';
            default: return 'Not Selected';
        }
    }

    getSubtotal() {
        if (this.isCartCheckout) {
            return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        }
        return (this.product?.price || 0) * this.quantity;
    }

    getShippingFee() {
        const subtotal = this.getSubtotal();
        if (subtotal > 499) return 0;
        return this.deliverySpeed === 'fast' ? 79 : 40;
    }

    getGST() {
        return Math.round(this.getSubtotal() * 0.18);
    }

    getTotal() {
        const subtotal = this.getSubtotal();
        const shipping = this.getShippingFee();
        const gst = this.getGST();
        const codFee = this.selectedPaymentMethod === 'cod' ? 14 : 0;
        return subtotal + shipping + gst + codFee;
    }

    setPaymentMethod(method: string) {
        this.selectedPaymentMethod = method;
    }

    initiateOrder() {
        const hasItems = this.isCartCheckout ? this.cartItems.length > 0 : !!this.product?._id;
        if (!hasItems || !this.shippingAddress) return;

        if (this.selectedPaymentMethod === 'cod') {
            this.placeOrder();
        } else {
            this.showPaymentModal = true;
        }
    }

    placeOrder() {
        if (this.isCartCheckout) {
            if (this.cartItems.length === 0) return;
            this.placing = true;

            const orderObservables = this.cartItems.map(item => {
                return this.orderService.placeOrder({
                    productId: item._id,
                    quantity: item.quantity,
                    shippingAddress: this.shippingAddress,
                    couponCode: this.couponCode,
                    paymentMethod: this.getPaymentMethodLabel(),
                    expectedDeliveryDate: new Date(this.deliveryDate)
                });
            });

            forkJoin(orderObservables).subscribe({
                next: (res: any[]) => {
                    this.cartService.clearCart();
                    this.router.navigate(['/order-success'], {
                        queryParams: { orderId: res[0].orderId } // Show the first order ID as reference
                    });
                },
                error: () => {
                    this.placing = false;
                }
            });
        } else {
            if (!this.product?._id || !this.shippingAddress) return;

            this.placing = true;
            this.orderService.placeOrder({
                productId: this.product._id,
                quantity: this.quantity,
                shippingAddress: this.shippingAddress,
                couponCode: this.couponCode,
                paymentMethod: this.getPaymentMethodLabel(),
                expectedDeliveryDate: new Date(this.deliveryDate)
            }).subscribe({
                next: (res: any) => {
                    this.cartService.clearCart();
                    this.router.navigate(['/order-success'], {
                        queryParams: { orderId: res.orderId }
                    });
                },
                error: () => {
                    this.placing = false;
                }
            });
        }
    }

    confirmSimulatedPayment() {
        this.paymentSubmitting = true;
        // Simulate a delay of 2 seconds for payment processing
        setTimeout(() => {
            this.paymentSubmitting = false;
            this.paymentSuccess = true;
            // After success animation, place the order
            setTimeout(() => {
                this.showPaymentModal = false;
                this.placeOrder();
            }, 1500);
        }, 2000);
    }

    closePaymentModal() {
        if (!this.paymentSubmitting) {
            this.showPaymentModal = false;
        }
    }

    toggleAddressEditor() {
        this.showAddressEditor = !this.showAddressEditor;
    }
}
