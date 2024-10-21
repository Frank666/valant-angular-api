using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Moq;
using NUnit.Framework;
using ValiantDemo.Abstractions.Dtos;
using ValiantDemo.Abstractions.Services;
using ValiantDemo.Core.Services;

namespace ValantDemoApi.Tests
{
  [TestFixture]
  public class MazeServiceTests
  {
    private Mock<IMazeRepository> _mockRepository;
    private Mock<IPlayerPositionRepository> _mockPlayerRepository;
    private IMemoryCache _mockMemoryCache;
    private MazeService _mazeService;

    [SetUp]
    public void Setup()
    {
      _mockRepository = new Mock<IMazeRepository>();
      _mockPlayerRepository = new Mock<IPlayerPositionRepository>();
      _mockMemoryCache = new MemoryCache(new MemoryCacheOptions());
      _mazeService = new MazeService(_mockRepository.Object, _mockPlayerRepository.Object, _mockMemoryCache);
    }

    [Test]
    public async Task UploadMazeAsync_ShouldStoreMaze()
    {
      var maze = new Maze
      {
        Name = "Test Maze",
        Definition = new List<List<string>>
        {
          new List<string> { "#", "#", "#" },
          new List<string> { "#", " ", "#" },
          new List<string> { "#", "#", "#" }
        },
        StartX = 1,
        StartY = 1,
        EndX = 1,
        EndY = 2
      };

      await _mazeService.UploadMazeAsync(maze);

      _mockRepository.Verify(repo => repo.UploadMazeAsync(maze), Times.Once);
    }

    [Test]
    public async Task GetMazeAsync_Should_Return_Maze_From_Cache_When_Available()
    {
      // Arrange
      var mazeId = 1;
      var cachedMaze = new Maze { Id = mazeId, Name = "Cached Maze" };

      _mockMemoryCache.Set($"maze_{mazeId}", cachedMaze);

      // Act
      var result = await _mazeService.GetMazeAsync(mazeId);

      // Assert
      Assert.AreEqual(cachedMaze, result);
      _mockRepository.Verify(repo => repo.GetMazeAsync(It.IsAny<int>()), Times.Never,
          "Shouldn't call repo");
    }

    [Test]
    public async Task GetMazeAsync_Should_Call_Repository_When_Maze_Not_In_Cache()
    {
      // Arrange
      var mazeId = 2;
      var mazeFromRepo = new Maze { Id = mazeId, Name = "Repo Maze" };

      _mockRepository.Setup(repo => repo.GetMazeAsync(mazeId))
                         .ReturnsAsync(mazeFromRepo);

      // Act
      var result = await _mazeService.GetMazeAsync(mazeId);

      // Assert
      Assert.AreEqual(mazeFromRepo, result);
      _mockRepository.Verify(repo => repo.GetMazeAsync(mazeId), Times.Once,
          "Should get maze from repo cache");
    }

    [Test]
    public async Task GetMazeAsync_Should_Store_Maze_In_Cache_After_Retrieving_From_Repository()
    {
      // Arrange
      var mazeId = 3;
      var mazeFromRepo = new Maze { Id = mazeId, Name = "Repo Maze" };

      _mockRepository.Setup(repo => repo.GetMazeAsync(mazeId))
                         .ReturnsAsync(mazeFromRepo);

      // Act
      var result = await _mazeService.GetMazeAsync(mazeId);

      // Assert
      Assert.AreEqual(mazeFromRepo, result);

      var cachedMaze = _mockMemoryCache.Get<Maze>($"maze_{mazeId}");
      Assert.IsNotNull(cachedMaze);
      Assert.AreEqual(mazeFromRepo, cachedMaze);
    }

  }
}
