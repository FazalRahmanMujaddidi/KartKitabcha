using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Data;
using KartKitabch.Models;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GPSCompanyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GPSCompanyController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<GPSCompany>>> GetAll()
        {
            return await _context.GPSCompanies.ToListAsync();
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<GPSCompany>> GetById(int id)
        {
            var gps = await _context.GPSCompanies.FindAsync(id);

            if (gps == null)
                return NotFound();

            return gps;
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create(GPSCompany gps)
        {
            _context.GPSCompanies.Add(gps);
            await _context.SaveChangesAsync();

            return Ok(gps);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, GPSCompany gps)
        {
            if (id != gps.Id)
                return BadRequest();

            var existing = await _context.GPSCompanies.FindAsync(id);

            if (existing == null)
                return NotFound();

            existing.Name = gps.Name;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var gps = await _context.GPSCompanies.FindAsync(id);

            if (gps == null)
                return NotFound();

            _context.GPSCompanies.Remove(gps);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}