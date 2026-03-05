import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    standalone: false,
    selector: 'app-order-success',
    templateUrl: './order-success.component.html',
    styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {
    orderId: string = '';

    constructor(private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.orderId = params['orderId'] || 'ORD_XXXXXX';
        });
    }

    goToOrders() {
        this.router.navigate(['/my-orders']);
    }
}
