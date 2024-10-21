using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using NUnit.Framework;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ValantDemoApi.Tests
{

  [TestFixture]
  public class MazeControllerTests
  {
    private readonly HttpClient _client;

    public MazeControllerTests()
    {
      var factory = new WebApplicationFactory<Startup>();
      _client = factory.CreateClient();
    }

    [Test]
    public async Task UploadMaze_ShouldReturnOk_WhenValidMazeUploaded()
    {
      //Arrange
      var mazeJson = @"{
                ""name"": ""Test Maze"",
                ""definition"": [
                    [""#"", ""#"", ""#""],
                    [""#"", "" "", ""#""],
                    [""#"", ""#"", ""#""]
                ],
                ""startX"": 1,
                ""startY"": 1,
                ""endX"": 1,
                ""endY"": 2
            }";

      var fileStream = new MemoryStream();
      var writer = new StreamWriter(fileStream);
      await writer.WriteAsync(mazeJson);
      await writer.FlushAsync();
      fileStream.Position = 0;

      var file = new FormFile(fileStream, 0, fileStream.Length, "file", "testMaze.json")
      {
        Headers = new HeaderDictionary(),
        ContentType = "application/json"
      };

      var content = new MultipartFormDataContent();
      content.Add(file.ToFormFileContent(), "file", "testMaze.json");

      // Act
      var response = await _client.PostAsync("/maze/upload-maze", content);

      // Assert
      Assert.AreEqual(System.Net.HttpStatusCode.OK, response.StatusCode);
    }

    [Test]
    public async Task GetMaze_ShouldReturnNotFound_WhenMazeDoesNotExist()
    {
      // Arrange
      var mazeIdFake = "123";

      // Act
      var response = await _client.GetAsync($"/maze/{mazeIdFake}");

      // Assert
      Assert.AreEqual(System.Net.HttpStatusCode.NotFound, response.StatusCode);
    }
  }

  public static class FormFileExtensions
  {
    public static HttpContent ToFormFileContent(this IFormFile file)
    {
      var content = new StreamContent(file.OpenReadStream());
      content.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
      return content;
    }
  }
}
