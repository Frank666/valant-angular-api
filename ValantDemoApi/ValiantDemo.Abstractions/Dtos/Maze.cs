using System.Collections.Generic;

namespace ValiantDemo.Abstractions.Dtos
{
  public class Maze
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public List<List<string>> Definition { get; set; }

    public int StartX { get; set; }
    public int StartY { get; set; }
    public int EndX { get; set; }
    public int EndY { get; set; }
  }
}
