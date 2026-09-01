using Microsoft.AspNetCore.Mvc;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        [HttpGet("status")]
        public IActionResult GetStatus()
        {
            return Ok(new
            {
                project = "Store API",
                status = "Running",
                version = "1.0"
            });
        }
    }
}