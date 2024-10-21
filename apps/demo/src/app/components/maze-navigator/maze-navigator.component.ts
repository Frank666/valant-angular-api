import { Component, Input, OnInit } from '@angular/core';
import { MazeService } from '../../services/MazeService';
@Component({
  selector: 'valant-maze-navigator',
  templateUrl: './maze-navigator.component.html',
  styleUrls: ['./maze-navigator.component.css'],
})
export class MazeNavigatorComponent implements OnInit {
  @Input() maze!: any;
  currentPosition: any;

  constructor(private mazeService: MazeService) {}

  ngOnInit(): void {
    this.currentPosition = { x: this.maze.startX, y: this.maze.startY }; // Inicializar posición
  }

  move(direction: string): void {
    this.mazeService.nextMove(this.maze.id, direction).subscribe(
      (response) => {
        if (response) {
          this.currentPosition.x = response.currentX;
          this.currentPosition.y = response.currentY;
        }
      },
      (error) => {
        // TODO: handle exception
        console.error('Error moving player:', error);
      }
    );
  }

  isAtEnd(): boolean {
    return this.currentPosition.x === this.maze.endX && this.currentPosition.y === this.maze.endY;
  }
}
