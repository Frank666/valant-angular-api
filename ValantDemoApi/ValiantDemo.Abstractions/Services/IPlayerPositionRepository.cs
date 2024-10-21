using System.Threading.Tasks;
using ValiantDemo.Abstractions.Dtos;

namespace ValiantDemo.Abstractions.Services
{
  public interface IPlayerPositionRepository
  {
    Task<PlayerPosition> GetPositionByMazeIdAsync(int mazeId);
    Task UpdatePositionAsync(PlayerPosition position);
  }
}
