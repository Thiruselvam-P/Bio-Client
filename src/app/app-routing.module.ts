// App routing configuration
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './user/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './user/product-list/product-list.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { ProductDetailsComponent } from './user/product-details/product-details.component';
import { MyOrdersComponent } from './user/my-orders/my-orders.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageProductsComponent } from './admin/manage-products/manage-products.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ServicesComponent } from './user/services/services.component';
import { ContactComponent } from './user/contact/contact.component';
import { CheckoutComponent } from './user/checkout/checkout.component';
import { CartComponent } from './user/cart/cart.component';
import { AboutComponent } from './user/about/about.component';
import { AuthGuard } from './guards/auth.guard';
import { OrderSuccessComponent } from './user/order-success/order-success.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'products', component: ProductListComponent },
    { path: 'products/:id', component: ProductDetailsComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'cart', component: CartComponent },

    // User Routes
    { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
    { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'checkout/:id', component: CheckoutComponent, canActivate: [AuthGuard] },
    { path: 'order-success', component: OrderSuccessComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: HomeComponent, canActivate: [AuthGuard] }, // For consistency

    // Admin Routes
    { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] },
    { path: 'admin/products', component: ManageProductsComponent, canActivate: [AdminGuard] },
    { path: 'admin/add-product', component: AddProductComponent, canActivate: [AdminGuard] },
    { path: 'admin/edit-product/:id', component: AddProductComponent, canActivate: [AdminGuard] },
    { path: 'admin/orders', component: ManageOrdersComponent, canActivate: [AdminGuard] },
    { path: 'admin/users', component: ManageUsersComponent, canActivate: [AdminGuard] },

    { path: '**', redirectTo: '/home' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
