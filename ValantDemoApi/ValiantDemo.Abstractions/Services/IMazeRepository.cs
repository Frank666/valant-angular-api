using System.Threading.Tasks;
using ValiantDemo.Abstractions.Dtos;

namespace ValiantDemo.Abstractions.Services
{
  public interface IMazeRepository
  {
    Task<Maze> GetMazeAsync(int id);
    Task UploadMazeAsync(Maze maze);
  }
}
