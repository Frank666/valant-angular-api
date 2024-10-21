using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using ValiantDemo.Abstractions.Dtos;
using ValiantDemo.Abstractions.Services;

namespace ValiantDemo.Core.Services
{
  public class InMemoryMazeRepository : IMazeRepository
  {
    private readonly ConcurrentDictionary<int, Maze> _mazes = new();

    private readonly IMemoryCache _cache;

    public InMemoryMazeRepository(IMemoryCache memoryCache)
    {
      _cache = memoryCache;
    }

    public Task<Maze> GetMazeAsync(int id)
    {
      if (_cache.TryGetValue(id, out Maze maze))
      {
        return Task.FromResult(maze);
      }

      _mazes.TryGetValue(id, out maze);
      return Task.FromResult(maze);
    }

    public Task UploadMazeAsync(Maze maze)
    {
      var cacheEntryOptions = new MemoryCacheEntryOptions()
      {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
      };

      maze.Id = _mazes.Count + 1;
      _mazes[maze.Id] = maze;
      _cache.Set(maze.Id, maze, cacheEntryOptions);

      return Task.CompletedTask;
    }
  }
}
