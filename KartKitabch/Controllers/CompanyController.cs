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

        // GET: api/company
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var companies = await _context.Companies
                .AsNoTracking()
                .ToListAsync();

            var result = companies.Select(company =>
            {
                var batchLimit = GetBatchLimit(company);

                var totalRecords = _context.Report
                    .Count(r => r.CompanyId == company.Id);

                var currentBatchCount =
                    batchLimit > 0 && totalRecords > 0
                        ? ((totalRecords - 1) % batchLimit) + 1
                        : 0;

                var currentBatchNumber =
                    batchLimit > 0 && totalRecords > 0
                        ? ((totalRecords - 1) / batchLimit) + 1
                        : 1;

                var maximumRecords =
                    batchLimit > 0
                        ? batchLimit * (company.ExtraReportBatches + 1)
                        : 0;

                var isComplete =
                    batchLimit > 0 &&
                    totalRecords >= maximumRecords;

                return new
                {
                    company.Id,
                    company.Name,
                    company.MyProperty,
                    company.CompanyTon,
                    company.CompanyPlace,
                    company.CompanyCategory,

                    company.ExtraReportBatches,
                    company.IsAddingClosed,
                    company.AutoCloseEnabled,

                    ReportCount = totalRecords,

                    BatchLimit = batchLimit,

                    CurrentBatchCount = currentBatchCount,

                    CurrentBatchNumber = currentBatchNumber,

                    MaximumRecords = maximumRecords,

                    IsComplete = isComplete
                };
            }).ToList();

            return Ok(result);
        }

        // GET: api/company/5
        [HttpGet("{id:int}")]
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

        // GET: api/company/enums/company-type
        [HttpGet("enums/company-type")]
        public IActionResult GetCompanyTypes()
        {
            var values = Enum.GetValues<CompanyType>()
                .Select(x => new
                {
                    id = (int)x,
                    name = x.ToString()
                })
                .ToList();

            return Ok(values);
        }

        // GET: api/company/enums/company-ton
        [HttpGet("enums/company-ton")]
        public IActionResult GetCompanyTons()
        {
            var values = Enum.GetValues<CompanyTon>()
                .Select(x => new
                {
                    id = (int)x,
                    name = x.ToString()
                })
                .ToList();

            return Ok(values);
        }

        // GET: api/company/enums/company-place
        [HttpGet("enums/company-place")]
        public IActionResult GetCompanyPlaces()
        {
            var values = Enum.GetValues<CompanyPlace>()
                .Select(x => new
                {
                    id = (int)x,
                    name = x.ToString()
                })
                .ToList();

            return Ok(values);
        }

        // GET: api/company/enums/company-category
        [HttpGet("enums/company-category")]
        public IActionResult GetCompanyCategories()
        {
            var values = Enum.GetValues<CompanyCategory>()
                .Select(x => new
                {
                    id = (int)x,
                    name = x.ToString()
                })
                .ToList();

            return Ok(values);
        }

        // POST: api/company
        [HttpPost]
        public async Task<ActionResult<Company>> Create(Company company)
        {
            company.ExtraReportBatches = 0;
            company.IsAddingClosed = false;
            company.AutoCloseEnabled = true;

            _context.Companies.Add(company);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = company.Id },
                company
            );
        }

        // // PUT: api/company/5
        // [HttpPut("{id:int}")]
        // public async Task<IActionResult> Update(int id, Company company)
        // {
        //     if (id != company.Id)
        //         return BadRequest("ID mismatch");

        //     var existing = await _context.Companies.FindAsync(id);

        //     if (existing == null)
        //         return NotFound();

        //     existing.Name = company.Name;
        //     existing.MyProperty = company.MyProperty;
        //     existing.CompanyTon = company.CompanyTon;
        //     existing.CompanyPlace = company.CompanyPlace;
        //     existing.CompanyCategory = company.CompanyCategory;

        //     // These settings can be changed from Company page.
        //     // ExtraReportBatches is intentionally NOT changed here.
        //     // It is controlled only by AllowAdding.
        //     existing.IsAddingClosed = company.IsAddingClosed;
        //     existing.AutoCloseEnabled = company.AutoCloseEnabled;

        //     try
        //     {
        //         await _context.SaveChangesAsync();
        //     }
        //     catch (DbUpdateConcurrencyException)
        //     {
        //         return StatusCode(500, "Error updating company");
        //     }

        //     return NoContent();
        // }
        // PUT: api/company/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, Company company)
        {
            if (id != company.Id)
                return BadRequest("ID mismatch");

            var existing = await _context.Companies
                .Include(c => c.CompanyLocations)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (existing == null)
                return NotFound();

            existing.Name = company.Name;
            existing.MyProperty = company.MyProperty;
            existing.CompanyTon = company.CompanyTon;
            existing.CompanyPlace = company.CompanyPlace;
            existing.CompanyCategory = company.CompanyCategory;

            // Company-level settings
            // ExtraReportBatches is intentionally NOT changed here.
            // It is controlled only by AllowAdding.
            existing.IsAddingClosed = company.IsAddingClosed;
            existing.AutoCloseEnabled = company.AutoCloseEnabled;

            // ---------------------------------------------------------
            // Destination location settings
            // Taxi  = 100 records per location
            // Bus   = 31 records per location
            // ---------------------------------------------------------
            if ((existing.MyProperty == CompanyType.تکسی &&
                 existing.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_تکسی) ||
                (existing.MyProperty == CompanyType.بس &&
                 existing.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_بس))
            {
                if (company.CompanyLocations != null &&
                    company.CompanyLocations.Count > 0)
                {
                    foreach (var incomingLocation in company.CompanyLocations)
                    {
                        var existingLocation = existing.CompanyLocations
                            .FirstOrDefault(x => x.Id == incomingLocation.Id);

                        if (existingLocation == null)
                            continue;

                        // Only these settings can be changed from Company page.
                        existingLocation.IsAddingClosed =
                            incomingLocation.IsAddingClosed;

                        existingLocation.AutoCloseEnabled =
                            incomingLocation.AutoCloseEnabled;

                        // ExtraReportBatches is intentionally NOT changed here.
                        // It must only be increased by AllowAdding.
                    }
                }
            }

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
        // GET: api/company/details/5
        [HttpGet("details/{id:int}")]
        public async Task<IActionResult> Details(int id)
        {
            var company = await _context.Companies
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,

                    MyProperty = c.MyProperty.ToString(),
                    CompanyTon = c.CompanyTon.ToString(),

                    GeneralCount = _context.Report.Count(r =>
                        r.CompanyId == c.Id &&
                        r.DestinationProvinceId == null
                    ),

                    GeneralVehicleTypes = _context.Report
                        .Where(r =>
                            r.CompanyId == c.Id &&
                            r.DestinationProvinceId == null
                        )
                        .Select(r => r.Vehicle.Type)
                        .Distinct()
                        .ToList(),

                    Locations = c.CompanyLocations
                        .Select(l => new
                        {
                            l.Id,

                            CityId = l.ProvincesAndCitiesId,

                            CityName = l.ProvincesAndCities.Name,

                            DestinationCount = _context.Report.Count(r =>
                                r.CompanyId == c.Id &&
                                r.DestinationProvinceId == l.ProvincesAndCitiesId
                            ),

                            VehicleTypes = _context.Report
                                .Where(r =>
                                    r.CompanyId == c.Id &&
                                    r.DestinationProvinceId == l.ProvincesAndCitiesId
                                )
                                .Select(r => r.Vehicle.Type)
                                .Distinct()
                                .ToList()
                        })
                        .ToList()
                })
                .FirstOrDefaultAsync();

            if (company == null)
                return NotFound();

            return Ok(company);
        }

        // DELETE: api/company/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
                return NotFound();

            _context.Companies.Remove(company);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/company/5/locations
        [HttpGet("{companyId:int}/locations")]
        public async Task<IActionResult> GetCompanyLocations(int companyId)
        {
            var cities = await _context.CompanyLocations
                .Where(x => x.CompanyId == companyId)
                .Select(x => new
                {
                    id = x.ProvincesAndCitiesId,
                    name = x.ProvincesAndCities.Name
                })
                .ToListAsync();

            return Ok(cities);
        }

        // POST: api/company/5/allow-adding
        [HttpPost("{id:int}/allow-adding")]
        public async Task<IActionResult> AllowAdding(int id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
                return NotFound();

            var batchLimit = GetBatchLimit(company);

            if (batchLimit <= 0)
            {
                return BadRequest(new
                {
                    message = "This company type does not have a defined record limit."
                });
            }

            var totalRecords = await _context.Report
                .CountAsync(x => x.CompanyId == id);

            var currentMaximum =
                batchLimit * (company.ExtraReportBatches + 1);

            // The current batch must be complete
            // before another batch can be opened.
            if (totalRecords < currentMaximum)
            {
                return BadRequest(new
                {
                    message =
                        $"Current batch is not complete: {totalRecords}/{currentMaximum}."
                });
            }

            // One click = exactly one additional batch.
            company.ExtraReportBatches++;

            company.IsAddingClosed = false;

            await _context.SaveChangesAsync();

            var newMaximum =
                batchLimit * (company.ExtraReportBatches + 1);

            return Ok(new
            {
                message = "Adding enabled for the next batch.",

                companyId = company.Id,

                totalRecords,

                batchLimit,

                extraReportBatches =
                    company.ExtraReportBatches,

                maximumRecords =
                    newMaximum,

                isAddingClosed =
                    company.IsAddingClosed
            });
        }

        // POST: api/company/5/close-adding
        [HttpPost("{id:int}/close-adding")]
        public async Task<IActionResult> CloseAdding(int id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
                return NotFound();

            company.IsAddingClosed = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Adding records has been closed.",

                companyId = company.Id,

                isAddingClosed = true
            });
        }

        // POST: api/company/5/reopen-adding
        [HttpPost("{id:int}/reopen-adding")]
        public async Task<IActionResult> ReopenAdding(int id)
        {
            var company = await _context.Companies.FindAsync(id);

            if (company == null)
                return NotFound();

            company.IsAddingClosed = false;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "د ثبت اجازه بېرته فعاله شوه.",

                companyId = company.Id,

                isAddingClosed = false
            });
        }

        // Determines how many records are allowed in each batch.
        private int GetBatchLimit(Company company)
        {
            // بس = 31
            // بس
            if (company.MyProperty == CompanyType.بس)
            {
                if (company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_بس)
                    return 31;

                return 0;
            }

            // باربری depends on company category.
            if (company.MyProperty == CompanyType.باربری)
            {
                return company.CompanyCategory switch
                {
                    CompanyCategory.بنادرسرحدی => 80,

                    CompanyCategory.مراکزولایات => 58,

                    CompanyCategory.والسوالی => 36,

                    _ => 0
                };
            }

            // تکسی currently has no defined limit.
            if (company.MyProperty == CompanyType.تکسی &&
                company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_تکسی)
            {
                return 0;
            }
            return 0;
        }
        [HttpPost("location/{locationId:int}/close-adding")]
        public async Task<IActionResult> CloseLocationAdding(int locationId)
        {
            var location = await _context.CompanyLocations
                .Include(x => x.Company)
                .FirstOrDefaultAsync(x => x.Id == locationId);

            if (location == null)
            {
                return NotFound(new
                {
                    message = "Location پیدا نه شو."
                });
            }

            var company = location.Company;

            if (!(
                company.MyProperty == CompanyType.تکسی &&
                company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_تکسی
            ) &&
            !(
                company.MyProperty == CompanyType.بس &&
                company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_بس
            ))
            {
                return BadRequest(new
                {
                    message = "دا Location د Taxi یا Bus مقصد شرکت پورې اړه نه لري."
                });
            }

            location.IsAddingClosed = true;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "د دې ځای ثبتول بند شول.",
                locationId = location.Id,
                isAddingClosed = location.IsAddingClosed,
                extraReportBatches = location.ExtraReportBatches,
                autoCloseEnabled = location.AutoCloseEnabled
            });
        }

        [HttpPost("location/{locationId:int}/reopen-adding")]
        public async Task<IActionResult> ReopenLocationAdding(int locationId)
        {
            var location = await _context.CompanyLocations
                .Include(x => x.Company)
                .FirstOrDefaultAsync(x => x.Id == locationId);

            if (location == null)
            {
                return NotFound(new
                {
                    message = "Location پیدا نه شو."
                });
            }

            var company = location.Company;

            if (!(
                company.MyProperty == CompanyType.تکسی &&
                company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_تکسی
            ) &&
            !(
                company.MyProperty == CompanyType.بس &&
                company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_بس
            ))
            {
                return BadRequest(new
                {
                    message = "دا Location د Taxi یا Bus مقصد شرکت پورې اړه نه لري."
                });
            }

            location.IsAddingClosed = false;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "د دې ځای ثبتول بېرته پرانیستل شول.",
                locationId = location.Id,
                isAddingClosed = location.IsAddingClosed,
                extraReportBatches = location.ExtraReportBatches,
                autoCloseEnabled = location.AutoCloseEnabled
            });
        }
        [HttpPost("location/{locationId:int}/allow-adding")]
        public async Task<IActionResult> AllowLocationAdding(int locationId)
        {
            var location = await _context.CompanyLocations
                .Include(x => x.Company)
                .FirstOrDefaultAsync(x => x.Id == locationId);

            if (location == null)
            {
                return NotFound(new
                {
                    message = "Location پیدا نه شو."
                });
            }

            var company = location.Company;

            int batchLimit;

            if (
                company.MyProperty == CompanyType.تکسی &&
                company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_تکسی
            )
            {
                batchLimit = 100;
            }
            else if (
                company.MyProperty == CompanyType.بس &&
                company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_بس
            )
            {
                batchLimit = 31;
            }
            else
            {
                return BadRequest(new
                {
                    message = "دا Location د Taxi یا Bus مقصد شرکت لپاره نه دی."
                });
            }

            var currentCount = await _context.Report
                .CountAsync(r =>
                    r.CompanyId == location.CompanyId &&
                    r.DestinationProvinceId == location.ProvincesAndCitiesId
                );

            var currentMaximum =
                batchLimit * (location.ExtraReportBatches + 1);

            if (currentCount < currentMaximum)
            {
                return BadRequest(new
                {
                    message =
                        $"اوسنی Batch لا بشپړ شوی نه دی: {currentCount}/{currentMaximum}.",
                    currentCount,
                    currentMaximum
                });
            }

            location.ExtraReportBatches++;
            location.IsAddingClosed = false;

            await _context.SaveChangesAsync();

            var newMaximum =
                batchLimit * (location.ExtraReportBatches + 1);

            return Ok(new
            {
                message = "د دې Location لپاره بل Batch اجازه ورکړل شوه.",
                locationId = location.Id,
                currentCount,
                batchLimit,
                extraReportBatches = location.ExtraReportBatches,
                maximumRecords = newMaximum,
                isAddingClosed = location.IsAddingClosed,
                autoCloseEnabled = location.AutoCloseEnabled
            });
        }
    }
}