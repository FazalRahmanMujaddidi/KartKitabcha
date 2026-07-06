using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Data;
using KartKitabch.Models;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportController(AppDbContext context)
        {
            _context = context;
        }

        // GET ALL
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Report>>> GetAll()
        {
            return await _context.Report
                .Include(x => x.Company)
                .Include(x => x.ProvincesAndCities)
                .ToListAsync();
        }

        // GET BY ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Report>> GetById(int id)
        {
            var item = await _context.Report
                .Include(x => x.Company)
                .Include(x => x.ProvincesAndCities)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (item == null)
                return NotFound();

            return item;
        }

        // CREATE
        [HttpPost]
        public async Task<IActionResult> Create(Report report)
        {
            _context.Report.Add(report);
            await _context.SaveChangesAsync();

            return Ok(report);
        }

        // UPDATE
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Report report)
        {
            if (id != report.Id)
                return BadRequest();

            var item = await _context.Report.FindAsync(id);

            if (item == null)
                return NotFound();

            item.CompanyId = report.CompanyId;
            item.SerialNumber = report.SerialNumber;
            item.PaletNumber = report.PaletNumber;
            item.ProvincesAndCitiesId = report.ProvincesAndCitiesId;
            item.KartDuration = report.KartDuration;
            item.TypeOfKart = report.TypeOfKart;
            item.TypeOfActivity = report.TypeOfActivity;
            item.KartNewRenewLost = report.KartNewRenewLost;
            item.Chasis = report.Chasis;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.Report.FindAsync(id);

            if (item == null)
                return NotFound();

            _context.Report.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ENUMS
        [HttpGet("enums/kart-duration")]
public IActionResult GetDuration()
{
    return Ok(Enum.GetValues(typeof(KartDuration))
        .Cast<KartDuration>()
        .Select(x => new { id = (int)x, name = x.ToString() }));
}

[HttpGet("enums/type-of-kart")]
public IActionResult GetTypeOfKart()
{
    return Ok(Enum.GetValues(typeof(TypeOfKart))
        .Cast<TypeOfKart>()
        .Select(x => new { id = (int)x, name = x.ToString() }));
}

[HttpGet("enums/type-of-activity")]
public IActionResult GetTypeOfActivity()
{
    return Ok(Enum.GetValues(typeof(TypeOfActivity))
        .Cast<TypeOfActivity>()
        .Select(x => new { id = (int)x, name = x.ToString() }));
}

[HttpGet("enums/kart-status")]
public IActionResult GetKartStatus()
{
    return Ok(Enum.GetValues(typeof(KartNewRenewLost))
        .Cast<KartNewRenewLost>()
        .Select(x => new { id = (int)x, name = x.ToString() }));
}
}
}