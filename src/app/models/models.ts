export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'ADMIN' | 'USER';
}

export interface Product {
    _id?: string;
    productName: string;
    category: string;
    description: string;
    price: number;
    availability: boolean;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Order {
    _id?: string;
    orderId?: string;
    userId: any;
    productId: any;
    quantity: number;
    totalAmount: number;
    gst?: number;
    deliveryCharge?: number;
    paymentMethod: string;
    paymentStatus?: string;
    orderStatus: string;
    shippingAddress: string;
    couponCode?: string;
    expectedDeliveryDate?: Date;
    createdAt?: Date;
}
