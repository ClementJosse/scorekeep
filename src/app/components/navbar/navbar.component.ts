import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() menuOption: string | null = null;
  isMenuOpen = false;

  constructor(private router: Router) {}

  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
    isHomePage(): boolean {
    return this.router.url === '/';
  }
}
