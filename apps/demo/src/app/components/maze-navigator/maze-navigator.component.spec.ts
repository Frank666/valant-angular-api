import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MazeNavigatorComponent } from './maze-navigator.component';
import { MazeService } from '../../services/MazeService';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MazeNavigatorComponent', () => {
  let component: MazeNavigatorComponent;
  let fixture: ComponentFixture<MazeNavigatorComponent>;
  let mazeServiceMock: any;

  const mockMaze = {
    id: 1,
    startX: 0,
    startY: 0,
    endX: 2,
    endY: 2,
  };

  beforeEach(async () => {
    mazeServiceMock = {
      nextMove: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [MazeNavigatorComponent],
      providers: [{ provide: MazeService, useValue: mazeServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeNavigatorComponent);
    component = fixture.componentInstance;
    component.maze = mockMaze;
    fixture.detectChanges();
  });

  it('should initialize currentPosition on init', () => {
    // Assert
    expect(component.currentPosition).toEqual({ x: 0, y: 0 });
  });

  it('should move player and update position', () => {
    // Arrange
    mazeServiceMock.nextMove.mockReturnValue(of({ currentX: 1, currentY: 1 }));

    // Act
    component.move('south');

    // Assert
    expect(mazeServiceMock.nextMove).toHaveBeenCalledWith(1, 'south');
    expect(component.currentPosition).toEqual({ x: 1, y: 1 });
  });

  it('should handle error when moving player', () => {
    // Arrange
    const consoleErrorSpy = jest.spyOn(console, 'error');
    mazeServiceMock.nextMove.mockReturnValue(throwError('Error moving'));

    // Act
    component.move('north');

    // Assert
    expect(mazeServiceMock.nextMove).toHaveBeenCalledWith(1, 'north');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error moving player:', 'Error moving');
  });

  it('should check if at the end of the maze', () => {
    // Act
    component.currentPosition = { x: 2, y: 2 };

    // Assert
    expect(component.isAtEnd()).toBe(true);
  });
});
