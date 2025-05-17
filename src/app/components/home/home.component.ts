import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  joueurs: { nom: string }[] = [];

  ajouterJoueur() {
    this.joueurs.push({ nom: '' });
  }


  supprimerJoueur(index: number) {
    this.joueurs.splice(index, 1);
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.joueurs, event.previousIndex, event.currentIndex);
  }
}
