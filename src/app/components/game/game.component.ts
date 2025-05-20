import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NavbarComponent, LoaderComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  currentValue: any = null;
  playerNames: string[] = [];
  playerScores: number[][] = [];
  maxRounds: number = 0;
  totalScores: number[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    const key = this.router.url.substring(1);
    if (!key) return;

    const dbRef = ref(database, `/${key}`);

    onValue(
      dbRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.currentValue = data;
          this.processGameData(data);
        } else {
          this.currentValue = 'No data available';
        }
      },
      (error) => {
        console.error('Error reading data:', error);
      }
    );
  }

  processGameData(data: any) {
    this.playerNames = data.players || [];
    const table: number[][] = data.table || [];
    const numPlayers = this.playerNames.length;

    // Les scores sont déjà organisés par joueur dans le tableau 'table'
    // table[0] correspond aux scores de players[0] (Thomas), etc.
    this.playerScores = table;

    // Déterminer le nombre maximum de rounds parmi tous les joueurs
    this.maxRounds = Math.max(...this.playerScores.map(scores => scores ? scores.length : 0));

    // Calculer les totaux pour chaque joueur
    this.totalScores = this.playerScores.map(scores =>
      scores ? scores.reduce((sum, val) => sum + val, 0) : 0
    );
  }

  getScoreForRound(playerIndex: number, roundIndex: number): number | null {
    return this.playerScores[playerIndex] && roundIndex < this.playerScores[playerIndex].length
      ? this.playerScores[playerIndex][roundIndex]
      : null;
  }

  getMenuOption(): string {
    return this.currentValue === 'No data available' ? 'notfound' : 'ingame';
  }
}