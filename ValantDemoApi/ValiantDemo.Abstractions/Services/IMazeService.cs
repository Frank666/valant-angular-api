using System.Collections.Generic;
using System.Threading.Tasks;
using ValiantDemo.Abstractions.Dtos;

namespace ValiantDemo.Abstractions.Services
{
  public interface IMazeService
  {
    Task<Maze> GetMazeAsync(int id);
    Task UploadMazeAsync(Maze maze);
    Task<PlayerPosition> MoveAsync(Maze maze, string direction);
    Task<List<string>> GetAvailableMovesAsync(Maze maze, int x, int y);
  }
}
