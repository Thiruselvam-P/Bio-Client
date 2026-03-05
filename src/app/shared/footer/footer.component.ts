import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  companyLinks = [
    { label: 'Our Mission', path: '/about' },
    { label: 'About Us', path: '/about' },
    { label: 'Bulk Enquiry', path: '/contact' }
  ];

  shopLinks = [
    { label: 'Dining Essentials', path: '/products' },
    { label: 'Beverage Solutions', path: '/products' },
    { label: 'Kitchen Tools', path: '/products' }
  ];
}
