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
  availableMoves: string[] = [];

  constructor(private mazeService: MazeService) {}

  ngOnInit(): void {
    if (this.maze) {
      this.currentPosition = { x: this.maze.startX, y: this.maze.startY };
      this.getAvailableMoves();
    }
  }

  move(direction: string): void {
    this.mazeService.nextMove(this.maze.id, direction).subscribe(
      (response) => {
        if (response) {
          this.currentPosition.x = response.currentX;
          this.currentPosition.y = response.currentY;
          this.getAvailableMoves();
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

  getAvailableMoves() {
    this.mazeService.getMazeStatus(this.maze.id, this.currentPosition.x, this.currentPosition.y).subscribe(
      (availableMoves: string[]) => {
        this.availableMoves = availableMoves;
        console.log('Available moves:', this.availableMoves);
      },
      (error) => {
        // TODO: handle exception
        console.error('Error fetching available moves:', error);
      }
    );
  }
}
