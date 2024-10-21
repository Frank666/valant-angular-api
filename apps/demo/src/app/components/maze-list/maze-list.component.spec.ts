import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MazeService } from '../../services/MazeService';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MazeListComponent } from './maze-list.component';
import { of } from 'rxjs';

describe('MazeListComponent', () => {
  let component: MazeListComponent;
  let fixture: ComponentFixture<MazeListComponent>;
  let mazeServiceMock: any;

  beforeEach(async () => {
    mazeServiceMock = {
      getMazes: jest.fn().mockReturnValue(
        of([
          { id: 1, name: 'Maze 1' },
          { id: 2, name: 'Maze 2' },
        ])
      ),
    };

    await TestBed.configureTestingModule({
      declarations: [MazeListComponent],
      providers: [{ provide: MazeService, useValue: mazeServiceMock }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load mazes on init', () => {
    // Act
    component.loadMazes();

    // Assert
    expect(mazeServiceMock.getMazes).toHaveBeenCalled();
    expect(component.mazes.length).toBe(2);
    expect(component.mazes).toEqual([
      { id: 1, name: 'Maze 1' },
      { id: 2, name: 'Maze 2' },
    ]);
  });
});
