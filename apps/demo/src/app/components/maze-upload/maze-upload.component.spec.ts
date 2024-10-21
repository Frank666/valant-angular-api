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
    // Mock del servicio MazeService
    mazeServiceMock = {
      uploadMaze: jest.fn(),
    };

    // Mock del servicio NotificationService
    notificationServiceMock = {
      notify: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [MazeUploadComponent],
      providers: [
        { provide: MazeService, useValue: mazeServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Para evitar errores de componentes hijos
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa la detección de cambios
  });

  it('should select a file', () => {
    // Arrange
    const mockFile = new File([''], 'maze.json', { type: 'application/json' });
    const event = { target: { files: [mockFile] } };

    // Act
    component.onFileSelected(event as any);

    // Assert
    expect(component.selectedFile).toEqual(mockFile); // Verifica que el archivo seleccionado se guarde correctamente
  });

  it('should upload the selected file', () => {
    // Arrange
    const mockFile = new File([''], 'maze.json', { type: 'application/json' });
    component.selectedFile = mockFile;
    mazeServiceMock.uploadMaze.mockReturnValue(of({})); // Simula una respuesta exitosa

    // Act
    component.onUpload();

    // Assert
    expect(mazeServiceMock.uploadMaze).toHaveBeenCalledWith(mockFile); // Verifica que se llamó al servicio con el archivo correcto
    expect(notificationServiceMock.notify).toHaveBeenCalledWith('Maze uploaded successfully!'); // Verifica que se notifique el éxito
  });

  it('should handle upload error', () => {
    // Arrange
    const mockFile = new File([''], 'maze.json', { type: 'application/json' });
    component.selectedFile = mockFile;
    mazeServiceMock.uploadMaze.mockReturnValue(throwError('Upload failed')); // Simula un error

    // Act
    component.onUpload();

    // Assert
    expect(mazeServiceMock.uploadMaze).toHaveBeenCalledWith(mockFile); // Verifica que se llamó al servicio con el archivo correcto
    expect(notificationServiceMock.notify).toHaveBeenCalledWith('Failed to upload maze.'); // Verifica que se notifique el error
  });
});
