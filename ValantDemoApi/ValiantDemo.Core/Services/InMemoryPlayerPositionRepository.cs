using System;
using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ValiantDemo.Abstractions.Dtos;
using ValiantDemo.Abstractions.Services;

namespace ValiantDemo.Core.Services
{
  public class InMemoryPlayerPositionRepository : IPlayerPositionRepository
  {
    private readonly List<PlayerPosition> _playerPositions = new();
    private readonly IMemoryCache _memoryCache;

    public InMemoryPlayerPositionRepository(IMemoryCache memoryCache)
    {
      _memoryCache = memoryCache;
    }
    public Task<PlayerPosition> GetPositionByMazeIdAsync(int mazeId)
    {
      _memoryCache.TryGetValue(mazeId, out PlayerPosition playerPosition);
      return Task.FromResult(playerPosition);
    }

    public Task UpdatePositionAsync(PlayerPosition position)
    {
      _memoryCache.Set(position.MazeId, position);
      return Task.CompletedTask;
    }
  }
}
