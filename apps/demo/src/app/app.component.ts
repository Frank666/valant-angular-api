import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { MazeService } from './services/MazeService';

@Component({
  selector: 'valant-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  public title = 'Valant demo';
  public data: string[];
  selectedMazeId: number | null = null;
  maze: any; // Objeto para almacenar el laberinto

  constructor(private notificationService: NotificationService, private mazeService: MazeService) {
    this.notificationService.notify$.subscribe((message) => {
      alert(message);
    });
  }

  onMazeUploaded(maze: any) {
    this.maze = maze; // Almacenar el laberinto cargado
  }
}
