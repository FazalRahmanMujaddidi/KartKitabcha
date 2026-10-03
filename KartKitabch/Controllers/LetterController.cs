using KartKitabch.Data;
using KartKitabch.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LetterController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LetterController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/letter
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Letter>>> GetLetters()
        {
            return await _context.Letters
                .Include(x => x.Person)
                  .Include(x => x.Vehicle)
                .Include(x => x.ProvincesAndCities)
                .Include(x => x.OfficeContent)
                   .Include(x => x.Sender)
                .ToListAsync();
        }

        // GET: api/letter/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Letter>> GetLetter(int id)
        {
            var letter = await _context.Letters
                .Include(x => x.Person)
                .Include(x => x.Vehicle)
                .Include(x => x.ProvincesAndCities)
                 .Include(x => x.OfficeContent)
                    .Include(x => x.Sender)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (letter == null)
                return NotFound();

            return letter;
        }

        // POST: api/letter
        [HttpPost]
        public async Task<ActionResult<Letter>> CreateLetter(Letter letter)
        {
            _context.Letters.Add(letter);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLetter), new { id = letter.Id }, letter);
        }
        // PUT: api/letter/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLetter(int id, Letter letter)
        {
            if (id != letter.Id)
                return BadRequest();

            _context.Entry(letter).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/letter/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLetter(int id)
        {
            var letter = await _context.Letters.FindAsync(id);

            if (letter == null)
                return NotFound();

            _context.Letters.Remove(letter);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}