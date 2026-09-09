using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Store.Application.DTOs.Categories;
using Store.Application.Interfaces;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            return Ok(categories);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("find-or-create")]
        public async Task<IActionResult> FindOrCreate(
            [FromBody] FindOrCreateCategoryDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
            {
                return BadRequest("اسم القسم مطلوب.");
            }

            var category = await _categoryService.FindOrCreateAsync(dto.Name);
            return Ok(category);
        }
    }
}