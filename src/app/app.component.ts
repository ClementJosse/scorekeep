import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { PlayersComponent } from './components/players/players.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, NavbarComponent, PlayersComponent],
})
export class AppComponent {
  constructor(public router: Router) {}
  title = 'scorekeep';
}