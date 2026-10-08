using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Data;
using KartKitabch.Models;
using KartKitabch.Models.Dto;

namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyLocationController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CompanyLocationController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/CompanyLocation
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var locations = await _context.CompanyLocations
                .Include(x => x.Company)
                .Include(x => x.ProvincesAndCities)
                .AsNoTracking()
                .Select(x => new
                {
                    id = x.Id,
                    companyId = x.CompanyId,
                    provincesAndCitiesId = x.ProvincesAndCitiesId,
                    oldLocationRecordCount = x.OldLocationRecordCount,

                    company = x.Company == null
                        ? null
                        : new
                        {
                            id = x.Company.Id,
                            name = x.Company.Name
                        },

                    provincesAndCities = x.ProvincesAndCities == null
                        ? null
                        : new
                        {
                            id = x.ProvincesAndCities.Id,
                            name = x.ProvincesAndCities.Name
                        },

                    extraReportBatches = x.ExtraReportBatches,
                    isAddingClosed = x.IsAddingClosed,
                    autoCloseEnabled = x.AutoCloseEnabled
                })
                .ToListAsync();

            return Ok(locations);
        }
        // GET: api/CompanyLocation/
        [HttpGet("{id}")]
        public async Task<ActionResult<CompanyLocation>> GetById(int id)
        {
            var item = await _context.CompanyLocations
                .Include(x => x.Company)
                .Include(x => x.ProvincesAndCities)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (item == null)
                return NotFound();

            return item;
        }

        // POST: api/CompanyLocation
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CompanyLocationDto dto)
        {
            var model = new CompanyLocation
            {
                CompanyId = dto.CompanyId,
                ProvincesAndCitiesId = dto.ProvincesAndCitiesId,
                OldLocationRecordCount = dto.OldLocationRecordCount
            };

            _context.CompanyLocations.Add(model);
            await _context.SaveChangesAsync();

            return Ok(model);
        }

        // PUT: api/CompanyLocation/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CompanyLocationDto dto)
        {
            var item = await _context.CompanyLocations.FindAsync(id);

            if (item == null)
                return NotFound();

            item.CompanyId = dto.CompanyId;
            item.ProvincesAndCitiesId = dto.ProvincesAndCitiesId;
            item.OldLocationRecordCount = dto.OldLocationRecordCount;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/CompanyLocation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _context.CompanyLocations.FindAsync(id);

            if (item == null)
                return NotFound();

            _context.CompanyLocations.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}