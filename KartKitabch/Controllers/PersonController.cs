using KartKitabch.Data;
using KartKitabch.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PersonController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/person
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPerson()
        {
            return await _context.Person
                .Include(x => x.Letters)
                .ToListAsync();
        }

        // GET: api/person/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var person = await _context.Person
                .Include(x => x.Letters)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (person == null)
                return NotFound();

            return person;
        }

        // POST: api/person
        [HttpPost]
        public async Task<ActionResult<Person>> CreatePerson(Person person)
        {
            _context.Person.Add(person);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPerson),
                new { id = person.Id }, person);
        }

        // PUT: api/person/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePerson(int id, Person person)
        {
            if (id != person.Id)
                return BadRequest();

            _context.Entry(person).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/person/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _context.Person.FindAsync(id);

            if (person == null)
                return NotFound();

            _context.Person.Remove(person);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}