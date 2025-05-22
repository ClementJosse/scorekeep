import { Component, OnInit, ViewChildren, QueryList, ElementRef, AfterViewInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { Router } from '@angular/router';
import { database } from '../../firebase';
import { ref, onValue, update } from 'firebase/database';
import { LoaderComponent } from '../loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NavbarComponent, LoaderComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {
  @ViewChildren('scoreInput') scoreInputs!: QueryList<ElementRef>;

  currentValue: any = null;
  playerNames: string[] = [];
  playerScores: number[][] = [];
  maxRounds: number = 0;
  totalScores: number[] = [];

  editingCell: { player: number, round: number } | null = null;
  gameKey: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
    this.gameKey = this.router.url.substring(1);
    if (!this.gameKey) return;

    const dbRef = ref(database, `/${this.gameKey}`);

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

  ngAfterViewInit() {
    this.scoreInputs.changes.subscribe(() => {
      if (this.editingCell) {
        const inputs = this.scoreInputs.toArray();
        if (inputs.length > 0) {
          const activeInput = inputs[0].nativeElement;
          activeInput.focus();
          activeInput.select();
        }
      }
    });
  }

  focusInput(): void {
    setTimeout(() => {
      const inputs = this.scoreInputs.toArray();
      if (inputs.length > 0) {
        const input = inputs[0].nativeElement;
        input.focus();
        input.select();
      }
    });
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

    // Vérifier si toutes les cellules sont remplies et ajouter une ligne si nécessaire
    this.checkAndAddNewRow();

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

  // Méthodes pour l'édition des cellules
  editCell(playerIndex: number, roundIndex: number): void {
    this.editingCell = { player: playerIndex, round: roundIndex };
    this.focusInput();
  }


  isEditing(playerIndex: number, roundIndex: number): boolean {
    return this.editingCell?.player === playerIndex && this.editingCell?.round === roundIndex;
  }

  saveCell(playerIndex: number, roundIndex: number, event: any): void {
    const newValue = parseInt(event.target.value);

    if (!isNaN(newValue)) {
      // Assurez-vous que le tableau a la taille nécessaire
      if (!this.playerScores[playerIndex]) {
        this.playerScores[playerIndex] = [];
      }

      // Étendre le tableau si nécessaire
      while (this.playerScores[playerIndex].length <= roundIndex) {
        this.playerScores[playerIndex].push(0);
      }

      // Mettre à jour la valeur
      this.playerScores[playerIndex][roundIndex] = newValue;

      // Mettre à jour Firebase
      this.updateFirebase(playerIndex, roundIndex, newValue);

      // Recalculer les totaux
      this.totalScores[playerIndex] = this.playerScores[playerIndex].reduce((sum, val) => sum + val, 0);

      // Vérifier si toutes les cellules sont remplies et ajouter une ligne si nécessaire
      this.checkAndAddNewRow();
    }

    this.editingCell = null;
  }

  updateFirebase(playerIndex: number, roundIndex: number, newValue: number): void {
    if (!this.gameKey) return;

    const updates: any = {};
    updates[`/${this.gameKey}/table/${playerIndex}/${roundIndex}`] = newValue;

    update(ref(database), updates)
      .then(() => console.log('Database updated successfully'))
      .catch(error => console.error('Error updating database:', error));
  }

  // Vérifier si toutes les cellules existantes sont remplies
  checkAndAddNewRow(): void {
    // Vérifier si toutes les cellules sont remplies
    let allCellsFilled = true;

    for (let playerIndex = 0; playerIndex < this.playerNames.length; playerIndex++) {
      if (!this.playerScores[playerIndex]) {
        this.playerScores[playerIndex] = [];
        allCellsFilled = false;
      }

      for (let roundIndex = 0; roundIndex < this.maxRounds; roundIndex++) {
        if (this.getScoreForRound(playerIndex, roundIndex) === null) {
          allCellsFilled = false;
          break;
        }
      }

      if (!allCellsFilled) {
        break;
      }
    }

    // Si toutes les cellules sont remplies, ajouter une nouvelle ligne
    if (allCellsFilled && this.maxRounds > 0) {
      this.maxRounds++;
      console.log(`Added new row, now maxRounds = ${this.maxRounds}`);
    }
  }
}