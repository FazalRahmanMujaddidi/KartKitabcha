using KartKitabch.Data;
using KartKitabch.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfficeContentController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OfficeContentController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/OfficeContent
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OfficeContent>>> Get()
        {
            return await _context.OfficeContents
                .ToListAsync();
        }

        // GET: api/OfficeContent/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OfficeContent>> Get(int id)
        {
            var officeContent = await _context.OfficeContents
                .FirstOrDefaultAsync(x => x.Id == id);

            if (officeContent == null)
                return NotFound();

            return officeContent;
        }

        // POST
        [HttpPost]
        public async Task<ActionResult<OfficeContent>> Post(OfficeContent officeContent)
        {
            _context.OfficeContents.Add(officeContent);
            await _context.SaveChangesAsync();

            return Ok(officeContent);
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, OfficeContent officeContent)
        {
            if (id != officeContent.Id)
                return BadRequest();

            _context.Entry(officeContent).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var officeContent = await _context.OfficeContents.FindAsync(id);

            if (officeContent == null)
                return NotFound();

            _context.OfficeContents.Remove(officeContent);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}