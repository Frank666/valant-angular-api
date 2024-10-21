import { Component, Input, OnInit } from '@angular/core';
import { MazeService } from '../../services/MazeService';

@Component({
  selector: 'valant-maze-list',
  templateUrl: './maze-list.component.html',
  styleUrls: ['./maze-list.component.less'],
})
export class MazeListComponent implements OnInit {
  @Input() maze!: any;
  mazes: any[] = [];

  constructor(private mazeService: MazeService) {}

  ngOnInit() {
    this.loadMazes();
  }

  loadMazes() {
    this.mazeService.getMaze(this.maze.id).subscribe(
      (mazes) => {
        this.mazes = mazes;
      },
      (error) => {
        console.error('Error loading mazes', error);
      }
    );
  }

  onSelectMaze(mazeId: number) {}
}
