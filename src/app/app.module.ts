// Finalized Auth Module Registration
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './user/home/home.component';
import { ProductListComponent } from './user/product-list/product-list.component';
import { ProductDetailsComponent } from './user/product-details/product-details.component';
import { MyOrdersComponent } from './user/my-orders/my-orders.component';
import { ServicesComponent } from './user/services/services.component';
import { ContactComponent } from './user/contact/contact.component';
import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';
import { ManageProductsComponent } from './admin/manage-products/manage-products.component';
import { AddProductComponent } from './admin/add-product/add-product.component';
import { ManageOrdersComponent } from './admin/manage-orders/manage-orders.component';
import { CheckoutComponent } from './user/checkout/checkout.component';
import { CartComponent } from './user/cart/cart.component';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AboutComponent } from './user/about/about.component';
import { OrderSuccessComponent } from './user/order-success/order-success.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProductListComponent,
    ProductDetailsComponent,
    MyOrdersComponent,
    ServicesComponent,
    AdminDashboardComponent,
    ManageProductsComponent,
    AddProductComponent,
    ManageOrdersComponent,
    CheckoutComponent,
    CartComponent,
    ContactComponent,
    AboutComponent,
    OrderSuccessComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }