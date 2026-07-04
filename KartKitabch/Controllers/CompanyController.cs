using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Models;
using KartKitabch.Data;
namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompanyController(AppDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/company
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Company>>> GetAll()
        {
            return await _context.Companies
                .Include(c => c.CompanyLocations)
                .Include(c => c.Report)
                .ToListAsync();
        }

        // ✅ GET: api/company/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Company>> GetById(int id)
        {
            var company = await _context.Companies
                .Include(c => c.CompanyLocations)
                .Include(c => c.Report)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (company == null)
                return NotFound();

            return company;
        }

        // ✅ POST: api/company
        [HttpPost]
        public async Task<ActionResult<Company>> Create(Company company)
        {
            _context.Companies.Add(company);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = company.Id }, company);
        }

        // ✅ PUT: api/company/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Company company)
        {
            if (id != company.Id)
                return BadRequest("ID mismatch");

            var existing = await _context.Companies.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Name = company.Name;
            existing.MyProperty = company.MyProperty;
            existing.CompanyTon = company.CompanyTon;

            _context.Entry(existing).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Error updating company");
            }

            return NoContent();
        }

        // ✅ DELETE: api/company/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
                return NotFound();

            _context.Companies.Remove(company);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}