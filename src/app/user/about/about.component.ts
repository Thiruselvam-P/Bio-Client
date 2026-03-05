import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {

  coreValues = [
    {
      icon: 'bi bi-leaf fs-2 text-success',
      title: 'Purity First',
      desc: 'Every product is sourced from certified organic farms. No pesticides, no synthetics — just the goodness of nature.'
    },
    {
      icon: 'bi bi-people fs-2 text-success',
      title: 'Farmer Forward',
      desc: 'We pay fair prices directly to our farming partners, ensuring their livelihoods are secure and dignified.'
    },
    {
      icon: 'bi bi-recycle fs-2 text-success',
      title: 'Planet Conscious',
      desc: 'From areca-leaf plates to compostable packaging, everything we use and sell is designed to return to the earth.'
    },
    {
      icon: 'bi bi-shield-check fs-2 text-success',
      title: 'Radical Transparency',
      desc: 'We share our farm partners, sourcing regions, and certifications openly. No hidden processes, no guesswork.'
    },
    {
      icon: 'bi bi-heart fs-2 text-success',
      title: 'Community Care',
      desc: 'We reinvest in rural agricultural communities, supporting education and sustainable farming infrastructure.'
    },
    {
      icon: 'bi bi-truck fs-2 text-success',
      title: 'Farm to Table Speed',
      desc: 'Our cold-chain logistics ensure that produce reaches you within 48 hours of harvest — fresher than your local market.'
    },
  ];

  offerings = [
    { img: 'freshhome3.jpg', title: 'Kitchenware', desc: 'Eco-friendly essentials' },
    { img: 'freshhome2.jpg', title: 'Eco Tableware', desc: 'Areca & wooden cutlery' },
    { img: 'freshhome1.jpg', title: 'Drinkware & Millets', desc: 'Ancient grains, rediscovered' },
    { img: 'paper-cups.jpg', title: 'Green Packaging', desc: 'Paper cups & bowls' },
  ];
}
