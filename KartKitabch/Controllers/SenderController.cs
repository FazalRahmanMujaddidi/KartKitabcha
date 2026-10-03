using KartKitabch.Data;
using KartKitabch.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SenderController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SenderController(AppDbContext context)
        {
            _context = context;
        }
        // GET: api/Sender
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sender>>> GetSenders()
        {
            return await _context.Senders
                .OrderBy(x => x.SenderTitle)
                .ToListAsync();
        }
        // GET: api/Sender/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sender>> GetSender(int id)
        {
            var sender = await _context.Senders.FindAsync(id);

            if (sender == null)
                return NotFound();

            return sender;
        }
        // POST: api/Sender
        [HttpPost]
        public async Task<ActionResult<Sender>> PostSender(Sender sender)
        {
            _context.Senders.Add(sender);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSender),
                new { id = sender.Id }, sender);
        }
        // PUT: api/Sender/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSender(int id, Sender sender)
        {
            if (id != sender.Id)
                return BadRequest();

            _context.Entry(sender).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Senders.Any(x => x.Id == id))
                    return NotFound();
                throw;
            }
            return NoContent();
        }
        // DELETE: api/Sender/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSender(int id)
        {
            var sender = await _context.Senders.FindAsync(id);

            if (sender == null)
                return NotFound();

            _context.Senders.Remove(sender);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}