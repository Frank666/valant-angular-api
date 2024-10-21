using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using ValiantDemo.Abstractions.Dtos;
using ValiantDemo.Abstractions.Services;

namespace ValantDemoApi.Controllers
{
  [ApiController]
    [Route("[controller]")]
    public class MazeController : ControllerBase
    {
        private readonly ILogger<MazeController> _logger;

        private readonly IMazeService _mazeService;
        private readonly IPlayerPositionRepository _playerPositionRepository;

      public MazeController(IMazeService mazeService, IPlayerPositionRepository playerPositionRepository)
      {
        _mazeService = mazeService;
        _playerPositionRepository = playerPositionRepository;
      }

      [HttpPost("upload-maze")]
      public async Task<IActionResult> UploadMaze(IFormFile file)
      {
        if (file == null || file.Length == 0)
          return BadRequest("No file uploaded.");

        Maze maze;
        using (var reader = new StreamReader(file.OpenReadStream()))
        {
          var json = await reader.ReadToEndAsync();
          maze = JsonConvert.DeserializeObject<Maze>(json);
        }

        await _mazeService.UploadMazeAsync(maze);
        return Ok(maze);
      }

      [HttpGet("{id}")]
      public async Task<IActionResult> GetMaze(int id)
      {
        var maze = await _mazeService.GetMazeAsync(id);
        if (maze == null) return NotFound();
        return Ok(maze);
      }

      [HttpPost("{id}/next-move")]
      public async Task<IActionResult> NextMove(int id, [FromBody] string direction)
      {
        try
        {
          var maze = await _mazeService.GetMazeAsync(id);
          var newPosition = await _mazeService.MoveAsync(maze, direction);
          return Ok(newPosition);
        }
        catch (ArgumentException e)
        {
          return BadRequest(e.Message);
        }
        catch (Exception e)
        {
          return StatusCode(500, e.Message);
        }
      }

      [HttpGet("{id}/status")]
    public async Task<IActionResult> GetAvailableMoves(int id, [FromQuery] int x, [FromQuery] int y)
    {
      try
      {
        var maze = await _mazeService.GetMazeAsync(id);
        var availableMoves = await _mazeService.GetAvailableMovesAsync(maze, x, y);
        return Ok(availableMoves);
      }
      catch (Exception e)
      {
        return StatusCode(500, e.Message);
      }
    }
  }
}
