using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Data;
using KartKitabch.Models;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VehicleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VehicleController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<vehicle>>> GetAll()
        {
            return await _context.Vehicles.ToListAsync();
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<vehicle>> GetById(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);

            if (vehicle == null)
                return NotFound();

            return vehicle;
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create(vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();

            return Ok(vehicle);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, vehicle vehicle)
        {
            if (id != vehicle.Id)
                return BadRequest();

            var existing = await _context.Vehicles.FindAsync(id);

            if (existing == null)
                return NotFound();

            existing.Type = vehicle.Type;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);

            if (vehicle == null)
                return NotFound();

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}