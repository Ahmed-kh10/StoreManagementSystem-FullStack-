using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.Brands;
using Store.Application.Interfaces;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BrandsController : ControllerBase
    {
        private readonly IBrandService _brandService;

        public BrandsController(IBrandService brandService)
        {
            _brandService = brandService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var brands = await _brandService.GetAllAsync();
            return Ok(brands);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("find-or-create")]
        public async Task<IActionResult> FindOrCreate(
            [FromBody] FindOrCreateBrandDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("اسم الماركة مطلوب.");
            }

            var brand = await _brandService.FindOrCreateAsync(dto.Name);
            return Ok(brand);
        }
    }
}