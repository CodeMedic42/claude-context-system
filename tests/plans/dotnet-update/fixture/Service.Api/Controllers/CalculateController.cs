using Microsoft.AspNetCore.Mvc;
using Shared.Library;

namespace Service.Api.Controllers;

[ApiController]
[Route("calculate")]
public class CalculateController : ControllerBase
{
    private readonly ILogger<CalculateController> _logger;

    public CalculateController(ILogger<CalculateController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Adds two numbers together
    /// </summary>
    /// <param name="request">The values to add</param>
    /// <returns>The sum of the two numbers</returns>
    [HttpPost("add")]
    public ActionResult<CalculateResponse> Add([FromBody] CalculateRequest request)
    {
        _logger.LogInformation("Adding {A} and {B}", request.Value1, request.Value2);
        
        var result = Calculator.Add(request.Value1, request.Value2);
        
        return Ok(new CalculateResponse { Result = result });
    }
}

public class CalculateRequest
{
    public int Value1 { get; set; }
    public int Value2 { get; set; }
}

public class CalculateResponse
{
    public int Result { get; set; }
}
