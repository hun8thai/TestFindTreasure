using Microsoft.AspNetCore.Mvc;

namespace FindTreasure.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        //private static readonly string[] Summaries = new[]
        //{
        //    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        //};

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly IDBConnection _db;
        public WeatherForecastController(ILogger<WeatherForecastController> logger, IDBConnection jsonFileConnection)
        {
            _logger = logger;
            _db = jsonFileConnection;
        }

        //[HttpGet]
        //public IEnumerable<WeatherForecast> Get()
        //{
        //    return Enumerable.Range(1, 5).Select(index => new WeatherForecast
        //    {
        //        Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
        //        TemperatureC = Random.Shared.Next(-20, 55),
        //        Summary = Summaries[Random.Shared.Next(Summaries.Length)]
        //    })
        //    .ToArray();
        //}


        //[HttpGet("getall")]
        [HttpGet()]
        public IEnumerable<TreasureModal> GetAll()
        {
            return _db.GetAll();
        }

        [HttpPost()]
        public TreasureModal? Insert(TreasureModal data)
        {
            var intValue = _db.Insert(data);
            if (intValue > 0) return null;
            return data;
        }
    }
}
