using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Data;
using KartKitabch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
namespace KartKitabch.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public ReportController(
            AppDbContext context,
            UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        // GET ALL
        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<Report>>> GetAll()
        // {
        //     return await _context.Report
        //         .Include(x => x.Company)
        //         .Include(x => x.Vehicle)
        //         .Include(x => x.GPSCompany)
        //         .Include(x => x.ProvincesAndCities)
        //         .ToListAsync();
        // }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Report>>> GetAll()
        {
            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
                return Unauthorized();

            if (!currentUser.IsActive)
                return Forbid();

            var isCompanyUser = await _userManager.IsInRoleAsync(
                currentUser,
                "CompanyUser"
            );

            var query = _context.Report
                .Include(x => x.Company)
                .Include(x => x.Vehicle)
                .Include(x => x.GPSCompany)
                .Include(x => x.ProvincesAndCities)
                .AsNoTracking()
                .AsQueryable();

            if (isCompanyUser)
            {
                if (!currentUser.CompanyId.HasValue)
                {
                    return BadRequest(new
                    {
                        message = "User is not assigned to a company."
                    });
                }

                query = query.Where(x =>
                    x.CompanyId == currentUser.CompanyId.Value);
            }

            return await query.ToListAsync();
        }
        // // GET BY ID
        // [HttpGet("{id:int}")]
        // public async Task<ActionResult<Report>> GetById(int id)
        // {
        //     var item = await _context.Report
        //         .Include(x => x.Company)
        //         .Include(x => x.Vehicle)
        //         .Include(x => x.GPSCompany)
        //         .Include(x => x.ProvincesAndCities)
        //         .FirstOrDefaultAsync(x => x.Id == id);

        //     if (item == null)
        //         return NotFound();

        //     return item;
        // }
        [Authorize]
        [HttpGet("{id:int}")]
        public async Task<ActionResult<Report>> GetById(int id)
        {
            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
                return Unauthorized();

            if (!currentUser.IsActive)
                return Forbid();

            var isCompanyUser = await _userManager.IsInRoleAsync(
                currentUser,
                "CompanyUser"
            );

            var query = _context.Report
                .Include(x => x.Company)
                .Include(x => x.Vehicle)
                .Include(x => x.GPSCompany)
                .Include(x => x.ProvincesAndCities)
                .AsNoTracking()
                .AsQueryable();

            if (isCompanyUser)
            {
                if (!currentUser.CompanyId.HasValue)
                    return BadRequest("User is not assigned to a company.");

                query = query.Where(x =>
                    x.CompanyId == currentUser.CompanyId.Value);
            }

            var item = await query
                .FirstOrDefaultAsync(x => x.Id == id);

            if (item == null)
                return NotFound();

            return item;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Report report)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Remove navigation properties
            report.Company = null;
            report.ProvincesAndCities = null;
            report.DestinationCompany = null;
            report.DestinationProvince = null;
            report.GPSCompany = null;

            // Check if this taxi already exists
            var existing = await _context.Report.FirstOrDefaultAsync(x =>
                x.PaletNumber == report.PaletNumber &&
                x.ProvincesAndCitiesId == report.ProvincesAndCitiesId);

            // -------------------------
            // New Taxi
            // -------------------------
            if (existing == null)
            {
                _context.Report.Add(report);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "New taxi created successfully."
                });
            }

            // -------------------------
            // Existing Taxi -> Transfer
            // -------------------------

            // Current company becomes the selected company
            existing.CompanyId = report.CompanyId;
            existing.VehicleId = report.VehicleId;
            existing.GPSCompanyId = report.GPSCompanyId;
            // Save destination information
            existing.DestinationCompanyId = report.DestinationCompanyId;
            existing.DestinationProvinceId = report.DestinationProvinceId;

            existing.SerialNumber = report.SerialNumber;
            existing.Chasis = report.Chasis;
            existing.DateS = report.DateS;

            existing.KartDuration = report.KartDuration;
            existing.TypeOfKart = report.TypeOfKart;
            existing.TypeOfActivity = report.TypeOfActivity;
            existing.KartNewRenewLost = report.KartNewRenewLost;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Taxi transferred successfully."
            });
        }
        [HttpGet("check-existing")]
        public async Task<IActionResult> CheckExisting(
            string paletNumber,
            int provincesAndCitiesId)
        {
            var existing = await _context.Report
                .FirstOrDefaultAsync(x =>
                    x.PaletNumber == paletNumber &&
                    x.ProvincesAndCitiesId == provincesAndCitiesId);

            if (existing == null)
            {
                return Ok(new
                {
                    exists = false
                });
            }

            return Ok(new
            {
                exists = true,
                message = "This taxi already exists. It will be transferred.",
                company = existing.Company?.Name,
                id = existing.Id
            });
        }
        // UPDATE
        [HttpPut("{id:int}")]
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
            item.GPSCompanyId = report.GPSCompanyId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE
        [HttpDelete("{id:int}")]
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

        [HttpGet("summary")]
        public async Task<IActionResult> GetReportSummary()
        {
            var reports = await _context.Report
                .Include(x => x.Vehicle)
                .AsNoTracking()
                .ToListAsync();

            var result = new
            {
                totalReports = reports.Count,

                vehicles = reports
                    .GroupBy(x => x.Vehicle?.Type)
                    .Select(g => new
                    {
                        vehicle = g.Key ?? "Unknown",
                        total = g.Count()
                    })
                    .OrderBy(x => x.vehicle),

                statuses = reports
                    .GroupBy(x => x.KartNewRenewLost)
                    .Select(g => new
                    {
                        status = g.Key?.ToString() ?? "Not Set",
                        total = g.Count()
                    })
                    .OrderBy(x => x.status),

                kartTypes = reports
                    .GroupBy(x => x.TypeOfKart)
                    .Select(g => new
                    {
                        type = g.Key?.ToString() ?? "Not Set",
                        total = g.Count()
                    })
                    .OrderBy(x => x.type),

                durations = reports
                    .GroupBy(x => x.KartDuration)
                    .Select(g => new
                    {
                        duration = g.Key?.ToString() ?? "Not Set",
                        total = g.Count()
                    })
                    .OrderBy(x => x.duration),

                activities = reports
                    .GroupBy(x => x.TypeOfActivity)
                    .Select(g => new
                    {
                        activity = g.Key?.ToString() ?? "Not Set",
                        total = g.Count()
                    })
                    .OrderBy(x => x.activity)
            };

            return Ok(result);
        }


        // [Authorize]
        // [HttpGet("filter")]
        // public async Task<IActionResult> FilterReports(
        //     string? date,
        //     string? paletNumber,
        //     int? companyId,
        //     int? vehicleId,
        //     int? gpsCompanyId,
        //     KartNewRenewLost? status,
        //     TypeOfKart? kartType,
        //     KartDuration? duration,
        //     TypeOfActivity? activity,
        //     int? provinceCityId)
        // {
        //     // ============================================
        //     // GET CURRENT USER
        //     // ============================================

        //     var currentUser = await _userManager.GetUserAsync(User);

        //     if (currentUser == null)
        //         return Unauthorized();

        //     // ============================================
        //     // CHECK ACTIVE
        //     // ============================================

        //     if (!currentUser.IsActive)
        //         return Forbid();

        //     // ============================================
        //     // CHECK ROLE
        //     // ============================================

        //     var isOwner = await _userManager.IsInRoleAsync(
        //         currentUser,
        //         "Owner"
        //     );

        //     var isCompanyUser = await _userManager.IsInRoleAsync(
        //         currentUser,
        //         "CompanyUser"
        //     );

        //     // ============================================
        //     // COMPANY USER MUST HAVE A COMPANY
        //     // ============================================

        //     if (isCompanyUser &&
        //         (!currentUser.CompanyId.HasValue ||
        //          currentUser.CompanyId.Value <= 0))
        //     {
        //         return BadRequest(new
        //         {
        //             message = "This user is not assigned to a company."
        //         });
        //     }

        //     // ============================================
        //     // BASE QUERY
        //     // ============================================

        //     var query = _context.Report
        //         .Include(x => x.Company)
        //         .Include(x => x.Vehicle)
        //         .Include(x => x.ProvincesAndCities)
        //         .Include(x => x.GPSCompany)
        //         .AsNoTracking()
        //         .AsQueryable();

        //     // ============================================
        //     // IMPORTANT SECURITY FILTER
        //     // ============================================

        //     // CompanyUser can ONLY see his own company
        //     if (isCompanyUser)
        //     {
        //         query = query.Where(x =>
        //             x.CompanyId == currentUser.CompanyId!.Value
        //         );
        //     }

        //     // ============================================
        //     // DATE FILTER
        //     // ============================================

        //     if (!string.IsNullOrWhiteSpace(date))
        //     {
        //         query = query.Where(x =>
        //             x.DateS != null &&
        //             x.DateS.StartsWith(date));
        //     }

        //     // ============================================
        //     // PALET NUMBER
        //     // ============================================

        //     if (!string.IsNullOrWhiteSpace(paletNumber))
        //     {
        //         query = query.Where(x =>
        //             x.PaletNumber != null &&
        //             x.PaletNumber.Contains(paletNumber));
        //     }

        //     // ============================================
        //     // COMPANY FILTER
        //     // ============================================

        //     if (companyId.HasValue && companyId.Value > 0)
        //     {
        //         // Owner can filter any company
        //         if (isOwner)
        //         {
        //             query = query.Where(x =>
        //                 x.CompanyId == companyId.Value);
        //         }

        //         // CompanyUser:
        //         // DO NOT use requested companyId.
        //         // The query is already restricted to their company.
        //     }

        //     // ============================================
        //     // GPS COMPANY
        //     // ============================================

        //     if (gpsCompanyId.HasValue && gpsCompanyId.Value > 0)
        //     {
        //         query = query.Where(x =>
        //             x.GPSCompanyId == gpsCompanyId.Value);
        //     }

        //     // ============================================
        //     // VEHICLE
        //     // ============================================

        //     if (vehicleId.HasValue && vehicleId.Value > 0)
        //     {
        //         query = query.Where(x =>
        //             x.VehicleId == vehicleId.Value);
        //     }

        //     // ============================================
        //     // STATUS
        //     // ============================================

        //     if (status.HasValue)
        //     {
        //         query = query.Where(x =>
        //             x.KartNewRenewLost == status.Value);
        //     }

        //     // ============================================
        //     // KART TYPE
        //     // ============================================

        //     if (kartType.HasValue)
        //     {
        //         query = query.Where(x =>
        //             x.TypeOfKart == kartType.Value);
        //     }

        //     // ============================================
        //     // DURATION
        //     // ============================================

        //     if (duration.HasValue)
        //     {
        //         query = query.Where(x =>
        //             x.KartDuration == duration.Value);
        //     }

        //     // ============================================
        //     // ACTIVITY
        //     // ============================================

        //     if (activity.HasValue)
        //     {
        //         query = query.Where(x =>
        //             x.TypeOfActivity == activity.Value);
        //     }

        //     // ============================================
        //     // PROVINCE / CITY
        //     // ============================================

        //     if (provinceCityId.HasValue &&
        //         provinceCityId.Value > 0)
        //     {
        //         query = query.Where(x =>
        //             x.ProvincesAndCitiesId == provinceCityId.Value);
        //     }

        //     // ============================================
        //     // RESULT
        //     // ============================================

        //     var reports = await query
        //         .OrderByDescending(x => x.Id)
        //         .Select(x => new
        //         {
        //             x.Id,
        //             x.SerialNumber,
        //             x.PaletNumber,
        //             x.DateS,
        //             x.Chasis,

        //             Company = x.Company != null
        //                 ? x.Company.Name
        //                 : null,

        //             GPSCompany = x.GPSCompany != null
        //                 ? x.GPSCompany.Name
        //                 : null,

        //             Vehicle = x.Vehicle != null
        //                 ? x.Vehicle.Type
        //                 : null,

        //             ProvinceCity = x.ProvincesAndCities != null
        //                 ? x.ProvincesAndCities.Name
        //                 : null,

        //             Status = x.KartNewRenewLost != null
        //                 ? x.KartNewRenewLost.ToString()
        //                 : null,

        //             KartType = x.TypeOfKart != null
        //                 ? x.TypeOfKart.ToString()
        //                 : null,

        //             Duration = x.KartDuration != null
        //                 ? x.KartDuration.ToString()
        //                 : null,

        //             Activity = x.TypeOfActivity != null
        //                 ? x.TypeOfActivity.ToString()
        //                 : null
        //         })
        //         .ToListAsync();

        //     return Ok(reports);
        // }
        [Authorize]
        [HttpGet("filter")]
        public async Task<IActionResult> FilterReports(
         string? date,
         string? paletNumber,
         int? companyId,
         int? vehicleId,
         int? gpsCompanyId,
         KartNewRenewLost? status,
         TypeOfKart? kartType,
         KartDuration? duration,
         TypeOfActivity? activity,
         int? provinceCityId)
        {
            // ============================================
            // GET CURRENT USER
            // ============================================

            var currentUser =
                await _userManager.GetUserAsync(User);

            if (currentUser == null)
                return Unauthorized();

            // ============================================
            // CHECK ACTIVE
            // ============================================

            if (!currentUser.IsActive)
                return Forbid();

            // ============================================
            // CHECK ROLES
            // ============================================

            var isOwner =
                await _userManager.IsInRoleAsync(
                    currentUser,
                    "Owner"
                );

            var isSimpleUser =
                await _userManager.IsInRoleAsync(
                    currentUser,
                    "SimpleUser"
                );

            var isCompanyUser =
                await _userManager.IsInRoleAsync(
                    currentUser,
                    "CompanyUser"
                );

            // ============================================
            // COMPANY USER MUST HAVE A COMPANY
            // ============================================

            if (
                isCompanyUser &&
                (
                    !currentUser.CompanyId.HasValue ||
                    currentUser.CompanyId.Value <= 0
                )
            )
            {
                return BadRequest(new
                {
                    message =
                        "This user is not assigned to a company."
                });
            }

            // ============================================
            // BASE QUERY
            // ============================================

            var query = _context.Report
                .Include(x => x.Company)
                .Include(x => x.Vehicle)
                .Include(x => x.ProvincesAndCities)
                .Include(x => x.GPSCompany)
                .AsNoTracking()
                .AsQueryable();

            // ============================================
            // COMPANY USER SECURITY
            // ============================================
            //
            // CompanyUser can ONLY see reports
            // belonging to his own company.
            //
            // This is server-side security.
            // ============================================

            if (isCompanyUser)
            {
                query = query.Where(x =>
                    x.CompanyId ==
                    currentUser.CompanyId!.Value
                );
            }

            // ============================================
            // DATE FILTER
            // ============================================

            if (!string.IsNullOrWhiteSpace(date))
            {
                query = query.Where(x =>
                    x.DateS != null &&
                    x.DateS.StartsWith(date)
                );
            }

            // ============================================
            // PALET NUMBER
            // ============================================

            if (!string.IsNullOrWhiteSpace(paletNumber))
            {
                query = query.Where(x =>
                    x.PaletNumber != null &&
                    x.PaletNumber.Contains(paletNumber)
                );
            }

            // ============================================
            // COMPANY FILTER
            // ============================================

            if (
                companyId.HasValue &&
                companyId.Value > 0
            )
            {
                // Owner can select any company
                if (isOwner)
                {
                    query = query.Where(x =>
                        x.CompanyId == companyId.Value
                    );
                }

                // CompanyUser cannot change the company.
                //
                // The query is already restricted above
                // to currentUser.CompanyId.
            }

            // ============================================
            // GPS COMPANY
            // ============================================

            if (
                gpsCompanyId.HasValue &&
                gpsCompanyId.Value > 0
            )
            {
                query = query.Where(x =>
                    x.GPSCompanyId ==
                    gpsCompanyId.Value
                );
            }

            // ============================================
            // VEHICLE
            // ============================================

            if (
                vehicleId.HasValue &&
                vehicleId.Value > 0
            )
            {
                query = query.Where(x =>
                    x.VehicleId ==
                    vehicleId.Value
                );
            }

            // ============================================
            // STATUS
            // ============================================

            if (status.HasValue)
            {
                query = query.Where(x =>
                    x.KartNewRenewLost ==
                    status.Value
                );
            }

            // ============================================
            // KART TYPE
            // ============================================

            if (kartType.HasValue)
            {
                query = query.Where(x =>
                    x.TypeOfKart ==
                    kartType.Value
                );
            }

            // ============================================
            // DURATION
            // ============================================

            if (duration.HasValue)
            {
                query = query.Where(x =>
                    x.KartDuration ==
                    duration.Value
                );
            }

            // ============================================
            // ACTIVITY
            // ============================================

            if (activity.HasValue)
            {
                query = query.Where(x =>
                    x.TypeOfActivity ==
                    activity.Value
                );
            }

            // ============================================
            // PROVINCE / CITY
            // ============================================

            if (
                provinceCityId.HasValue &&
                provinceCityId.Value > 0
            )
            {
                query = query.Where(x =>
                    x.ProvincesAndCitiesId ==
                    provinceCityId.Value
                );
            }

            // ============================================
            // RESULT
            // ============================================

            var reports = await query
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    // ====================================
                    // BASIC REPORT INFORMATION
                    // ====================================

                    x.Id,

                    x.SerialNumber,

                    x.PaletNumber,

                    x.DateS,

                    x.Chasis,

                    // ====================================
                    // COMPANY
                    // ====================================

                    Company = x.Company != null
                        ? x.Company.Name
                        : null,

                    CompanyId = x.CompanyId,

                    // ====================================
                    // COMPANY LOCATION
                    // ====================================
                    //
                    // Find the CompanyLocation that belongs
                    // to this report's company AND province/city.
                    //
                    // This prevents another company's location
                    // from being shown.
                    // ====================================

                    CompanyLocation =
                        _context.CompanyLocations
                            .Where(location =>
                                location.CompanyId ==
                                    x.CompanyId
                                &&
                                location.ProvincesAndCitiesId ==
                                    x.ProvincesAndCitiesId
                            )
                            .Select(location =>
                                location.ProvincesAndCities != null
                                    ? location.ProvincesAndCities.Name
                                    : null
                            )
                            .FirstOrDefault(),

                    // ====================================
                    // COMPANY LOCATION ID
                    // ====================================

                    CompanyLocationId =
                        _context.CompanyLocations
                            .Where(location =>
                                location.CompanyId ==
                                    x.CompanyId
                                &&
                                location.ProvincesAndCitiesId ==
                                    x.ProvincesAndCitiesId
                            )
                            .Select(location =>
                                (int?)location.Id
                            )
                            .FirstOrDefault(),

                    // ====================================
                    // GPS COMPANY
                    // ====================================

                    GPSCompany = x.GPSCompany != null
                        ? x.GPSCompany.Name
                        : null,

                    // ====================================
                    // VEHICLE
                    // ====================================

                    Vehicle = x.Vehicle != null
                        ? x.Vehicle.Type
                        : null,

                    // ====================================
                    // PROVINCE / CITY
                    // ====================================

                    ProvinceCity =
                        x.ProvincesAndCities != null
                            ? x.ProvincesAndCities.Name
                            : null,

                    // ====================================
                    // STATUS
                    // ====================================

                    Status =
                        x.KartNewRenewLost != null
                            ? x.KartNewRenewLost.ToString()
                            : null,

                    // ====================================
                    // KART TYPE
                    // ====================================

                    KartType =
                        x.TypeOfKart != null
                            ? x.TypeOfKart.ToString()
                            : null,

                    // ====================================
                    // DURATION
                    // ====================================

                    Duration =
                        x.KartDuration != null
                            ? x.KartDuration.ToString()
                            : null,

                    // ====================================
                    // ACTIVITY
                    // ====================================

                    Activity =
                        x.TypeOfActivity != null
                            ? x.TypeOfActivity.ToString()
                            : null
                })
                .ToListAsync();

            return Ok(reports);
        }
    }
}