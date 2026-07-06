using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Data;
using KartKitabch.Models;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProvincesAndCitiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProvincesAndCitiesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ProvincesAndCities
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProvincesAndCities>>> GetAll()
        {
            return await _context.ProvincesAndCities.ToListAsync();
        }

        // GET: api/ProvincesAndCities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProvincesAndCities>> GetById(int id)
        {
            var item = await _context.ProvincesAndCities.FindAsync(id);

            if (item == null)
                return NotFound();

            return item;
        }

        // POST: api/ProvincesAndCities
        [HttpPost]
        public async Task<ActionResult<ProvincesAndCities>> Create(ProvincesAndCities item)
        {
            _context.ProvincesAndCities.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = item.Id }, item);
        }

        // PUT: api/ProvincesAndCities/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProvincesAndCities item)
        {
            if (id != item.Id)
                return BadRequest();

            var existing = await _context.ProvincesAndCities.FindAsync(id);

            if (existing == null)
                return NotFound();

            existing.Name = item.Name;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/ProvincesAndCities/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.ProvincesAndCities.FindAsync(id);

            if (item == null)
                return NotFound();

            _context.ProvincesAndCities.Remove(item);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}