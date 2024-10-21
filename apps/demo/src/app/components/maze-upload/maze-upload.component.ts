import { Component, Output, EventEmitter } from '@angular/core';
import { MazeService } from '../../services/MazeService';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'valant-maze-upload',
  templateUrl: './maze-upload.component.html',
  styleUrls: ['./maze-upload.component.less'],
})
export class MazeUploadComponent {
  selectedFile?: File;
  @Output() mazeUploaded = new EventEmitter<void>();

  constructor(private mazeService: MazeService, private notificationService: NotificationService) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
    }
  }

  onUpload() {
    if (this.selectedFile) {
      this.mazeService.uploadMaze(this.selectedFile).subscribe(
        (maze) => {
          this.notificationService.notify('Maze uploaded successfully!');
          this.mazeUploaded.emit(maze);
        },
        (error) => {
          this.notificationService.notify('Failed to upload maze.');
          console.error('Upload error:', error);
        }
      );
    }
  }
}
