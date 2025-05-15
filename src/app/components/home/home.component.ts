import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { PlayersComponent } from '../players/players.component';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent,PlayersComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
