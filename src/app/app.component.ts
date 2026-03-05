import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  showHeaderFooter: boolean = true;

  constructor(private router: Router) { }

  ngOnInit() {
    // Check initial route
    this.updateHeaderFooter(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateHeaderFooter(event.urlAfterRedirects || event.url);
    });
  }

  private updateHeaderFooter(url: string) {
    // Hide header and footer for login and register pages
    this.showHeaderFooter = !(url.includes('/login') || url.includes('/register'));
  }
}
