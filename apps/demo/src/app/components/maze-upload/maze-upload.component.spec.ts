// maze-upload.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MazeUploadComponent } from './maze-upload.component';
import { MazeService } from '../../services/MazeService';
import { NotificationService } from '../../services/notification.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MazeUploadComponent', () => {
  let component: MazeUploadComponent;
  let fixture: ComponentFixture<MazeUploadComponent>;
  let mazeServiceMock: any;
  let notificationServiceMock: any;

  beforeEach(async () => {
    mazeServiceMock = {
      uploadMaze: jest.fn(),
    };

    notificationServiceMock = {
      notify: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [MazeUploadComponent],
      providers: [
        { provide: MazeService, useValue: mazeServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should select a file', () => {
    // Arrange
    const mockFile = new File([''], 'maze.json', { type: 'application/json' });
    const event = { target: { files: [mockFile] } };

    // Act
    component.onFileSelected(event as any);

    // Assert
    expect(component.selectedFile).toEqual(mockFile);
  });

  it('should upload the selected file', () => {
    // Arrange
    const mockFile = new File([''], 'maze.json', { type: 'application/json' });
    component.selectedFile = mockFile;
    mazeServiceMock.uploadMaze.mockReturnValue(of({}));

    // Act
    component.onUpload();

    // Assert
    expect(mazeServiceMock.uploadMaze).toHaveBeenCalledWith(mockFile);
    expect(notificationServiceMock.notify).toHaveBeenCalledWith('Maze uploaded successfully!');
  });

  it('should handle upload error', () => {
    // Arrange
    const mockFile = new File([''], 'maze.json', { type: 'application/json' });
    component.selectedFile = mockFile;
    mazeServiceMock.uploadMaze.mockReturnValue(throwError('Upload failed'));

    // Act
    component.onUpload();

    // Assert
    expect(mazeServiceMock.uploadMaze).toHaveBeenCalledWith(mockFile);
    expect(notificationServiceMock.notify).toHaveBeenCalledWith('Failed to upload maze.');
  });
});
