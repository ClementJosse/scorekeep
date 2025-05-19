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
  hasBeenOpened = false;

  constructor(private router: Router) { }
  isHomePage(): boolean {
    return this.router.url === '/';
  }
  toggleMenu() {
    if (!this.isMenuOpen) {
      this.hasBeenOpened = true;
    }
    this.isMenuOpen = !this.isMenuOpen;

    // Optionnel : supprimer l'élément du DOM après l'animation de fermeture
    if (!this.isMenuOpen) {
      setTimeout(() => {
        if (!this.isMenuOpen) {
          this.hasBeenOpened = false;
        }
      }, 1000); // Attendre la fin de l'animation (3s)
    }
  }
}