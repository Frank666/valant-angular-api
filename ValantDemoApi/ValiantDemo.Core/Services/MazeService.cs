using Microsoft.Extensions.Caching.Memory;
using System;
using System.Threading.Tasks;
using ValiantDemo.Abstractions.Dtos;
using ValiantDemo.Abstractions.Services;

namespace ValiantDemo.Core.Services
{
  public class MazeService : IMazeService
  {
    private readonly IMazeRepository _mazeRepository;
    private readonly IPlayerPositionRepository _playerPositionRepository;
    private readonly IMemoryCache _memoryCache;


    public MazeService(IMazeRepository mazeRepository, IPlayerPositionRepository playerPositionRepository, IMemoryCache memoryCache)
    {
      _mazeRepository = mazeRepository;
      _playerPositionRepository = playerPositionRepository;
      _memoryCache = memoryCache;

    }

    public async Task<Maze> GetMazeAsync(int mazeId)
    {
      if (!_memoryCache.TryGetValue($"maze_{mazeId}", out Maze mazeDefinition))
      {
        mazeDefinition = await _mazeRepository.GetMazeAsync(mazeId);

        if (mazeDefinition != null)
        {
          var cacheOptions = new MemoryCacheEntryOptions
          {
            AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
          };

          _memoryCache.Set($"maze_{mazeId}", mazeDefinition, cacheOptions);
        }
      }
      return mazeDefinition;
    }


    public async Task UploadMazeAsync(Maze maze)
    {
      await _mazeRepository.UploadMazeAsync(maze);
    }

    public async Task<PlayerPosition> MoveAsync(Maze maze, string direction)
    {
      var playerPosition = await _playerPositionRepository.GetPositionByMazeIdAsync(maze.Id);
      if (playerPosition == null)
      {
        playerPosition = new PlayerPosition { MazeId = maze.Id, CurrentX = 0, CurrentY = 0 };
        await _playerPositionRepository.UpdatePositionAsync(playerPosition);
      }

      if (!IsValidMove(playerPosition, direction, maze))
      {
        return playerPosition;
      }

      switch (direction.ToLower())
      {
        case "north":
          playerPosition.CurrentY -= 1;
          break;
        case "south":
          playerPosition.CurrentY += 1;
          break;
        case "west":
          playerPosition.CurrentX -= 1;
          break;
        case "east":
          playerPosition.CurrentX += 1;
          break;
        default:
          return playerPosition;
      }

      await _playerPositionRepository.UpdatePositionAsync(playerPosition);
      return playerPosition;
    }

    private bool IsValidMove(PlayerPosition playerPosition, string direction, Maze mazeDefinition)
    {
      int newX = playerPosition.CurrentX;
      int newY = playerPosition.CurrentY;

      switch (direction.ToLower())
      {
        case "north":
          newY -= 1;
          break;
        case "south":
          newY += 1;
          break;
        case "west":
          newX -= 1;
          break;
        case "east":
          newX += 1;
          break;
      }
      
      if (mazeDefinition.Definition[newY][newX] == "#" || mazeDefinition.Definition[newY][newX] == "#")
      {
        return false;
      }

      return true;
    }
     
  }
}
