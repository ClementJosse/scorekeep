import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { database } from '../../firebase'; // Assurez-vous que le chemin est correct
import { ref, onValue } from "firebase/database";

@Component({
  selector: 'app-game',
  imports: [NavbarComponent],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  currentValue: string | null = null;
  key: string | null = null;
  constructor(private router: Router) {}

ngOnInit() {
  console.log("Initializing GameComponent");

  const key = this.router.url.substring(1);
  console.log("Key:", key);

  if (!key) {
    console.error("No key found in URL");
    return;
  }

  const dbRef = ref(database, `/${key}`);
  console.log("Database reference created");

  onValue(dbRef, (snapshot) => {
    console.log("Data snapshot received");
    const data = snapshot.val();
    if (data) {
      this.currentValue = data;
      console.log("Data:", data);
    } else {
      this.currentValue = 'No data available';
      console.log("No data available");
    }
  }, (error) => {
    console.error("Error reading data:", error);
  });
}

}
