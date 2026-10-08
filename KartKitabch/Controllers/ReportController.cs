using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KartKitabch.Data;
using KartKitabch.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using ClosedXML.Excel;
using System.IO;
using System.Globalization;
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

            // --------------------------------------------------
            // Get selected company
            // --------------------------------------------------
            var company = await _context.Companies
                .FirstOrDefaultAsync(x => x.Id == report.CompanyId);

            if (company == null)
            {
                return BadRequest(new
                {
                    message = "Company not found."
                });
            }

            // --------------------------------------------------
            // TAXI + ولایت_والسوالی_مقصد_تکسی
            // Each CompanyLocation allows 100 records.
            // CompanyLocation is DestinationProvinceId.
            // --------------------------------------------------
            var isTaxiWithLocationLimit =
                company.MyProperty == CompanyType.تکسی &&
                company.CompanyCategory == CompanyCategory.ولایت_والسوالی_مقصد_تکسی;

            if (isTaxiWithLocationLimit)
            {
                // CompanyLocation is required
                if (!report.DestinationProvinceId.HasValue ||
                    report.DestinationProvinceId.Value <= 0)
                {
                    return BadRequest(new
                    {
                        message = "CompanyLocation is required for Taxi."
                    });
                }

                var destinationProvinceId =
                    report.DestinationProvinceId.Value;

                // --------------------------------------------------
                // Check that this location belongs to this company
                // --------------------------------------------------
                var locationExists = await _context.CompanyLocations
                    .AnyAsync(x =>
                        x.CompanyId == report.CompanyId &&
                        x.ProvincesAndCitiesId == destinationProvinceId);

                if (!locationExists)
                {
                    return BadRequest(new
                    {
                        message = "This CompanyLocation does not belong to the selected company."
                    });
                }

                // --------------------------------------------------
                // Find existing taxi
                // --------------------------------------------------
                var existing = await _context.Report
                    .FirstOrDefaultAsync(x =>
                        x.PaletNumber == report.PaletNumber &&
                        x.ProvincesAndCitiesId == report.ProvincesAndCitiesId);

                // --------------------------------------------------
                // New taxi
                // --------------------------------------------------
                if (existing == null)
                {
                    var locationTotal = await _context.Report
                        .CountAsync(x =>
                            x.CompanyId == report.CompanyId &&
                            x.DestinationProvinceId == destinationProvinceId);

                    if (locationTotal >= 100)
                    {
                        return BadRequest(new
                        {
                            message =
                                "This CompanyLocation has reached the maximum of 100 records.",

                            companyId = report.CompanyId,

                            companyLocationId = destinationProvinceId,

                            totalRecords = locationTotal,

                            maximumRecords = 100
                        });
                    }

                    _context.Report.Add(report);

                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        message = "New taxi created successfully.",

                        totalRecords = locationTotal + 1,

                        maximumRecords = 100,

                        companyLocationId = destinationProvinceId
                    });
                }

                // --------------------------------------------------
                // Existing Taxi -> Transfer
                // --------------------------------------------------

                // Check whether this existing taxi is already
                // assigned to the same company and same location.
                var sameCompanyAndLocation =
                    existing.CompanyId == report.CompanyId &&
                    existing.DestinationProvinceId == destinationProvinceId;

                // If it is being moved to a new company/location,
                // that destination location must have space.
                if (!sameCompanyAndLocation)
                {
                    var locationTotal = await _context.Report
                        .CountAsync(x =>
                            x.CompanyId == report.CompanyId &&
                            x.DestinationProvinceId == destinationProvinceId);

                    if (locationTotal >= 100)
                    {
                        return BadRequest(new
                        {
                            message =
                                "This CompanyLocation has reached the maximum of 100 records.",

                            companyId = report.CompanyId,

                            companyLocationId = destinationProvinceId,

                            totalRecords = locationTotal,

                            maximumRecords = 100
                        });
                    }
                }

                // Current company becomes the selected company
                existing.CompanyId = report.CompanyId;

                existing.VehicleId = report.VehicleId;

                existing.GPSCompanyId = report.GPSCompanyId;

                // Save destination information
                existing.DestinationCompanyId =
                    report.DestinationCompanyId;

                existing.DestinationProvinceId =
                    report.DestinationProvinceId;

                existing.SerialNumber =
                    report.SerialNumber;

                existing.Chasis =
                    report.Chasis;

                existing.DateS =
                    report.DateS;

                existing.KartDuration =
                    report.KartDuration;

                existing.TypeOfKart =
                    report.TypeOfKart;

                existing.TypeOfActivity =
                    report.TypeOfActivity;

                existing.KartNewRenewLost =
                    report.KartNewRenewLost;

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Taxi transferred successfully."
                });
            }

            // --------------------------------------------------
            // NON-TAXI / OTHER COMPANIES
            // Keep your existing behavior.
            // --------------------------------------------------

            var existingOther = await _context.Report
                .FirstOrDefaultAsync(x =>
                    x.PaletNumber == report.PaletNumber &&
                    x.ProvincesAndCitiesId == report.ProvincesAndCitiesId);

            // --------------------------------------------------
            // New record
            // --------------------------------------------------
            if (existingOther == null)
            {
                _context.Report.Add(report);

                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "New taxi created successfully."
                });
            }

            // --------------------------------------------------
            // Existing record -> Transfer
            // --------------------------------------------------
            existingOther.CompanyId = report.CompanyId;
            existingOther.VehicleId = report.VehicleId;
            existingOther.GPSCompanyId = report.GPSCompanyId;

            existingOther.DestinationCompanyId =
                report.DestinationCompanyId;

            existingOther.DestinationProvinceId =
                report.DestinationProvinceId;

            existingOther.SerialNumber =
                report.SerialNumber;

            existingOther.Chasis =
                report.Chasis;

            existingOther.DateS =
                report.DateS;

            existingOther.KartDuration =
                report.KartDuration;

            existingOther.TypeOfKart =
                report.TypeOfKart;

            existingOther.TypeOfActivity =
                report.TypeOfActivity;

            existingOther.KartNewRenewLost =
                report.KartNewRenewLost;

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


        [Authorize]
        [HttpGet("filter")]
        public async Task<IActionResult> FilterReports(
       string? date,
       int? month,
       string? paletNumber,
       int? companyId,
       int? vehicleId,
       int? gpsCompanyId,
       KartNewRenewLost? status,
       TypeOfKart? kartType,
       KartDuration? duration,
       TypeOfActivity? activity,
       int? provinceCityId,
       int? companyLocationId)
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
            // MONTH FILTER
            // ============================================

            if (month.HasValue && month.Value >= 1 && month.Value <= 12)
            {
                var paddedMonth = month.Value.ToString("00");

                var persianMonth = paddedMonth
                    .Replace("0", "۰")
                    .Replace("1", "۱")
                    .Replace("2", "۲")
                    .Replace("3", "۳")
                    .Replace("4", "۴")
                    .Replace("5", "۵")
                    .Replace("6", "۶")
                    .Replace("7", "۷")
                    .Replace("8", "۸")
                    .Replace("9", "۹");

                var arabicMonth = paddedMonth
                    .Replace("0", "٠")
                    .Replace("1", "١")
                    .Replace("2", "٢")
                    .Replace("3", "٣")
                    .Replace("4", "٤")
                    .Replace("5", "٥")
                    .Replace("6", "٦")
                    .Replace("7", "٧")
                    .Replace("8", "٨")
                    .Replace("9", "٩");

                query = query.Where(x =>
                    x.DateS != null &&
                    (
                        x.DateS.Contains($"/{paddedMonth}/") ||
                        x.DateS.Contains($"/{persianMonth}/") ||
                        x.DateS.Contains($"/{arabicMonth}/")
                    ));
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
                if (isOwner)
                {
                    query = query.Where(x =>
                        x.CompanyId == companyId.Value
                    );
                }
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
            // COMPANY LOCATION
            // ============================================

            if (
                companyLocationId.HasValue &&
                companyLocationId.Value > 0
            )
            {
                var selectedLocation =
                    await _context.CompanyLocations
                        .AsNoTracking()
                        .FirstOrDefaultAsync(x =>
                            x.Id == companyLocationId.Value);

                if (selectedLocation == null)
                {
                    return Ok(new List<object>());
                }

                query = query.Where(x =>
                    x.CompanyId ==
                        selectedLocation.CompanyId &&
                    x.DestinationProvinceId ==
                        selectedLocation.ProvincesAndCitiesId
                );
            }

            // ============================================
            // RESULT
            // ============================================

            // ============================================
            // RESULT
            // ============================================

            var reportRows = await query
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    x.Id,
                    x.SerialNumber,
                    x.PaletNumber,
                    x.DateS,
                    x.Chasis,

                    Company = x.Company != null
                        ? x.Company.Name
                        : null,

                    CompanyId = x.CompanyId,

                    CompanyType = x.Company != null
                        ? x.Company.MyProperty
                        : (CompanyType?)null,

                    CompanyCategory = x.Company != null
                        ? x.Company.CompanyCategory
                        : (CompanyCategory?)null,

                    CompanyExtraReportBatches = x.Company != null
                        ? x.Company.ExtraReportBatches
                        : 0,

                    CompanyIsAddingClosed = x.Company != null &&
                                            x.Company.IsAddingClosed,

                    CompanyAutoCloseEnabled = x.Company != null &&
                                              x.Company.AutoCloseEnabled,

                    DestinationProvinceId = x.DestinationProvinceId,

                    CompanyLocation =
                        _context.CompanyLocations
                            .Where(location =>
                                location.CompanyId == x.CompanyId &&
                                location.ProvincesAndCitiesId ==
                                    x.DestinationProvinceId
                            )
                            .Select(location =>
                                location.ProvincesAndCities != null
                                    ? location.ProvincesAndCities.Name
                                    : null
                            )
                            .FirstOrDefault(),

                    CompanyLocationId =
                        _context.CompanyLocations
                            .Where(location =>
                                location.CompanyId == x.CompanyId &&
                                location.ProvincesAndCitiesId ==
                                    x.DestinationProvinceId
                            )
                            .Select(location =>
                                (int?)location.Id
                            )
                            .FirstOrDefault(),

                    LocationExtraReportBatches =
                        _context.CompanyLocations
                            .Where(location =>
                                location.CompanyId == x.CompanyId &&
                                location.ProvincesAndCitiesId ==
                                    x.DestinationProvinceId
                            )
                            .Select(location =>
                                (int?)location.ExtraReportBatches
                            )
                            .FirstOrDefault(),

                    LocationIsAddingClosed =
                        _context.CompanyLocations
                            .Where(location =>
                                location.CompanyId == x.CompanyId &&
                                location.ProvincesAndCitiesId ==
                                    x.DestinationProvinceId
                            )
                            .Select(location =>
                                (bool?)location.IsAddingClosed
                            )
                            .FirstOrDefault(),

                    LocationAutoCloseEnabled =
                        _context.CompanyLocations
                            .Where(location =>
                                location.CompanyId == x.CompanyId &&
                                location.ProvincesAndCitiesId ==
                                    x.DestinationProvinceId
                            )
                            .Select(location =>
                                (bool?)location.AutoCloseEnabled
                            )
                            .FirstOrDefault(),

                    GPSCompany = x.GPSCompany != null
                        ? x.GPSCompany.Name
                        : null,

                    Vehicle = x.Vehicle != null
                        ? x.Vehicle.Type
                        : null,

                    ProvinceCity =
                        x.ProvincesAndCities != null
                            ? x.ProvincesAndCities.Name
                            : null,

                    Status =
                        x.KartNewRenewLost != null
                            ? x.KartNewRenewLost.ToString()
                            : null,

                    KartType =
                        x.TypeOfKart != null
                            ? x.TypeOfKart.ToString()
                            : null,

                    Duration =
                        x.KartDuration != null
                            ? x.KartDuration.ToString()
                            : null,

                    Activity =
                        x.TypeOfActivity != null
                            ? x.TypeOfActivity.ToString()
                            : null
                })
                .ToListAsync();

            // ============================================
            // GET COMPANY COUNTS
            // ============================================

            var companyIds = reportRows
                .Select(x => x.CompanyId)
                .Distinct()
                .ToList();

            var companyCounts = await _context.Report
                .Where(x => companyIds.Contains(x.CompanyId))
                .GroupBy(x => x.CompanyId)
                .Select(g => new
                {
                    CompanyId = g.Key,
                    Count = g.Count()
                })
                .ToDictionaryAsync(
                    x => x.CompanyId,
                    x => x.Count
                );

            // ============================================
            // GET DESTINATION COUNTS
            // ============================================

            var destinationCounts = await _context.Report
                .Where(x =>
                    companyIds.Contains(x.CompanyId) &&
                    x.DestinationProvinceId.HasValue
                )
                .GroupBy(x => new
                {
                    x.CompanyId,
                    x.DestinationProvinceId
                })
                .Select(g => new
                {
                    g.Key.CompanyId,
                    DestinationProvinceId =
                        g.Key.DestinationProvinceId!.Value,
                    Count = g.Count()
                })
                .ToListAsync();

            var destinationCountDictionary =
                destinationCounts.ToDictionary(
                    x =>
                        $"{x.CompanyId}_{x.DestinationProvinceId}",
                    x => x.Count
                );

            // ============================================
            // BUILD FINAL RESULT
            // ============================================

            var reports = reportRows
                .Select(x =>
                {
                    // ====================================
                    // DESTINATION COMPANY?
                    // ====================================

                    bool isDestination =
                        (
                            x.CompanyType == CompanyType.تکسی &&
                            x.CompanyCategory ==
                                CompanyCategory.ولایت_والسوالی_مقصد_تکسی
                        )
                        ||
                        (
                            x.CompanyType == CompanyType.بس &&
                            x.CompanyCategory ==
                                CompanyCategory.ولایت_والسوالی_مقصد_بس
                        );

                    // ====================================
                    // DEFAULT VALUES
                    // ====================================

                    int batchLimit = 0;
                    int batchTotal = 0;
                    int batchCount = 0;
                    int batchNumber = 0;

                    bool batchClosed = false;
                    bool batchAutoClose = false;
                    bool batchComplete = false;

                    // ====================================
                    // DESTINATION COMPANY
                    // TAXI = 100
                    // BUS = 31
                    // ====================================

                    if (isDestination)
                    {
                        batchLimit =
                            x.CompanyType == CompanyType.تکسی
                                ? 100
                                : 31;

                        if (x.DestinationProvinceId.HasValue)
                        {
                            var key =
                                $"{x.CompanyId}_{x.DestinationProvinceId.Value}";

                            destinationCountDictionary.TryGetValue(
                                key,
                                out batchTotal
                            );
                        }

                        int extraBatches =
                            x.LocationExtraReportBatches ?? 0;

                        int maximumRecords =
                            batchLimit *
                            (extraBatches + 1);

                        if (batchTotal > 0)
                        {
                            batchNumber =
                                ((batchTotal - 1) /
                                batchLimit) + 1;

                            batchCount =
                                ((batchTotal - 1) %
                                batchLimit) + 1;
                        }

                        batchClosed =
                            x.LocationIsAddingClosed ?? false;

                        batchAutoClose =
                            x.LocationAutoCloseEnabled ?? true;

                        batchComplete =
                            batchTotal >= maximumRecords;
                    }
                    // ====================================
                    // NORMAL COMPANY
                    // CARGO
                    // ====================================
                    else
                    {
                        if (x.CompanyType == CompanyType.باربری)
                        {
                            batchLimit =
                                x.CompanyCategory switch
                                {
                                    CompanyCategory.بنادرسرحدی => 80,

                                    CompanyCategory.مراکزولایات => 58,

                                    CompanyCategory.والسوالی => 36,

                                    _ => 0
                                };
                        }

                        if (batchLimit > 0)
                        {
                            companyCounts.TryGetValue(
                                x.CompanyId,
                                out batchTotal
                            );

                            int extraBatches =
                                x.CompanyExtraReportBatches;

                            int maximumRecords =
                                batchLimit *
                                (extraBatches + 1);

                            if (batchTotal > 0)
                            {
                                batchNumber =
                                    ((batchTotal - 1) /
                                    batchLimit) + 1;

                                batchCount =
                                    ((batchTotal - 1) %
                                    batchLimit) + 1;
                            }

                            batchClosed =
                                x.CompanyIsAddingClosed;

                            batchAutoClose =
                                x.CompanyAutoCloseEnabled;

                            batchComplete =
                                batchTotal >= maximumRecords;
                        }
                    }

                    // ====================================
                    // RETURN
                    // ====================================

                    return new
                    {
                        x.Id,
                        x.SerialNumber,
                        x.PaletNumber,
                        x.DateS,
                        x.Chasis,

                        x.Company,
                        x.CompanyId,

                        x.CompanyLocation,
                        x.CompanyLocationId,

                        x.GPSCompany,
                        x.Vehicle,
                        x.ProvinceCity,

                        x.Status,
                        x.KartType,
                        x.Duration,
                        x.Activity,

                        // =================================
                        // BATCH STATUS
                        // =================================

                        IsDestination = isDestination,

                        BatchLimit = batchLimit,

                        BatchNumber = batchNumber,

                        BatchTotal = batchTotal,

                        BatchCount = batchCount,

                        BatchClosed = batchClosed,

                        BatchAutoClose = batchAutoClose,

                        BatchComplete = batchComplete
                    };
                })
                .ToList();

            return Ok(reports);
        }


        [HttpGet("export-excel")]
        public async Task<IActionResult> ExportExcel(
    string? date,
    int? month,
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
            var currentUser = await _userManager.GetUserAsync(User);

            if (currentUser == null)
                return Unauthorized();

            if (!currentUser.IsActive)
                return Forbid();

            var isOwner = await _userManager.IsInRoleAsync(
                currentUser,
                "Owner"
            );

            var isSimpleUser = await _userManager.IsInRoleAsync(
                currentUser,
                "SimpleUser"
            );

            var isCompanyUser = await _userManager.IsInRoleAsync(
                currentUser,
                "CompanyUser"
            );

            if (isCompanyUser &&
                (!currentUser.CompanyId.HasValue ||
                 currentUser.CompanyId.Value <= 0))
            {
                return BadRequest(new
                {
                    message = "This user is not assigned to a company."
                });
            }

            // =========================
            // QUERY
            // =========================

            var query = _context.Report
                .Include(x => x.Company)
                .Include(x => x.Vehicle)
                .Include(x => x.ProvincesAndCities)
                .Include(x => x.GPSCompany)
                .AsNoTracking()
                .AsQueryable();

            // CompanyUser can only see his own company's reports
            if (isCompanyUser)
            {
                query = query.Where(x =>
                    x.CompanyId == currentUser.CompanyId!.Value);
            }

            // Date
            if (!string.IsNullOrWhiteSpace(date))
            {
                query = query.Where(x =>
                    x.DateS != null &&
                    x.DateS.StartsWith(date));
            }

            // Month
            if (month.HasValue &&
                month.Value >= 1 &&
                month.Value <= 12)
            {
                var monthText = month.Value.ToString("00");

                query = query.Where(x =>
                    x.DateS != null &&
                    x.DateS.Length >= 7 &&
                    x.DateS.Substring(5, 2) == monthText);
            }

            // Palet Number
            if (!string.IsNullOrWhiteSpace(paletNumber))
            {
                query = query.Where(x =>
                    x.PaletNumber != null &&
                    x.PaletNumber.Contains(paletNumber));
            }

            // Company
            if (companyId.HasValue &&
                companyId.Value > 0)
            {
                if (isOwner)
                {
                    query = query.Where(x =>
                        x.CompanyId == companyId.Value);
                }
            }

            // GPS Company
            if (gpsCompanyId.HasValue &&
                gpsCompanyId.Value > 0)
            {
                query = query.Where(x =>
                    x.GPSCompanyId == gpsCompanyId.Value);
            }

            // Vehicle
            if (vehicleId.HasValue &&
                vehicleId.Value > 0)
            {
                query = query.Where(x =>
                    x.VehicleId == vehicleId.Value);
            }

            // Status
            if (status.HasValue)
            {
                query = query.Where(x =>
                    x.KartNewRenewLost == status.Value);
            }

            // Kart Type
            if (kartType.HasValue)
            {
                query = query.Where(x =>
                    x.TypeOfKart == kartType.Value);
            }

            // Duration
            if (duration.HasValue)
            {
                query = query.Where(x =>
                    x.KartDuration == duration.Value);
            }

            // Activity
            if (activity.HasValue)
            {
                query = query.Where(x =>
                    x.TypeOfActivity == activity.Value);
            }

            // Province / City
            if (provinceCityId.HasValue &&
                provinceCityId.Value > 0)
            {
                query = query.Where(x =>
                    x.ProvincesAndCitiesId == provinceCityId.Value);
            }

            // =========================
            // GET DATA
            // =========================

            var reports = await query
                .OrderByDescending(x => x.Id)
                .Select(x => new
                {
                    x.Id,
                    x.SerialNumber,
                    x.PaletNumber,
                    x.DateS,
                    x.Chasis,

                    Company = x.Company != null
                        ? x.Company.Name
                        : null,

                    ProvinceCity = x.ProvincesAndCities != null
                        ? x.ProvincesAndCities.Name
                        : null,

                    Vehicle = x.Vehicle != null
                        ? x.Vehicle.Type
                        : null,

                    GPSCompany = x.GPSCompany != null
                        ? x.GPSCompany.Name
                        : null,

                    Status = x.KartNewRenewLost != null
                        ? x.KartNewRenewLost.ToString()
                        : null,

                    KartType = x.TypeOfKart != null
                        ? x.TypeOfKart.ToString()
                        : null,

                    Duration = x.KartDuration != null
                        ? x.KartDuration.ToString()
                        : null,

                    Activity = x.TypeOfActivity != null
                        ? x.TypeOfActivity.ToString()
                        : null
                })
                .ToListAsync();

            // =========================
            // CREATE EXCEL
            // =========================

            using var workbook = new XLWorkbook();

            var worksheet = workbook.Worksheets.Add("راپور");

            // RTL
            worksheet.RightToLeft = true;

            // =========================
            // COLORS
            // =========================

            var darkColor = XLColor.FromHtml("#343148");
            var lightColor = XLColor.FromHtml("#cdc6bd");
            var brownColor = XLColor.FromHtml("#583432");

            // =========================
            // HEADERS
            // =========================

            string[] headers =
            {
        "شمېره",
        "سریال نمبر",
        "پلیت نمبر",
        "نېټه",
        "شرکت",
        "ولایت / ښار",
        "موټر",
        "GPS شرکت",
        "چیسس",
        "حالت",
        "د کارت ډول",
        "موده",
        "فعالیت"
    };

            for (int i = 0; i < headers.Length; i++)
            {
                var cell = worksheet.Cell(1, i + 1);

                cell.Value = headers[i];

                cell.Style.Fill.BackgroundColor = darkColor;
                cell.Style.Font.FontColor = lightColor;
                cell.Style.Font.Bold = true;

                cell.Style.Alignment.Horizontal =
                    XLAlignmentHorizontalValues.Right;

                cell.Style.Alignment.Vertical =
                    XLAlignmentVerticalValues.Center;
            }

            // Header height
            worksheet.Row(1).Height = 25;

            // =========================
            // DATA ROWS
            // =========================

            int row = 2;

            foreach (var report in reports)
            {
                // Index number, NOT database ID
                worksheet.Cell(row, 1).Value = row - 1;

                worksheet.Cell(row, 2).Value =
                    report.SerialNumber ?? "";

                worksheet.Cell(row, 3).Value =
                    report.PaletNumber ?? "";

                worksheet.Cell(row, 4).Value =
                    report.DateS ?? "";

                worksheet.Cell(row, 5).Value =
                    report.Company ?? "";

                worksheet.Cell(row, 6).Value =
                    report.ProvinceCity ?? "";

                worksheet.Cell(row, 7).Value =
                    report.Vehicle ?? "";

                worksheet.Cell(row, 8).Value =
                    report.GPSCompany ?? "";

                worksheet.Cell(row, 9).Value =
                    report.Chasis ?? "";

                worksheet.Cell(row, 10).Value =
                    report.Status ?? "";

                worksheet.Cell(row, 11).Value =
                    report.KartType ?? "";

                worksheet.Cell(row, 12).Value =
                    report.Duration ?? "";

                worksheet.Cell(row, 13).Value =
                    report.Activity ?? "";

                // Style complete data row
                var dataRange =
                    worksheet.Range(row, 1, row, 13);

                dataRange.Style.Fill.BackgroundColor =
                    lightColor;

                dataRange.Style.Font.FontColor =
                    darkColor;

                dataRange.Style.Alignment.Horizontal =
                    XLAlignmentHorizontalValues.Right;

                dataRange.Style.Alignment.Vertical =
                    XLAlignmentVerticalValues.Center;

                row++;
            }

            // =========================
            // TOTAL COUNT ROW
            // =========================

            int totalRow = row;

            worksheet.Cell(totalRow, 1).Value = "ټول شمېر";
            worksheet.Cell(totalRow, 2).Value = reports.Count;

            // Merge columns 2 to 13
            worksheet.Range(
                totalRow,
                2,
                totalRow,
                13
            ).Merge();

            worksheet.Cell(totalRow, 2).Value =
                $"ټول شمېر: {reports.Count}";

            // Total row style
            var totalRange =
                worksheet.Range(totalRow, 1, totalRow, 13);

            totalRange.Style.Fill.BackgroundColor =
                darkColor;

            totalRange.Style.Font.FontColor =
                lightColor;

            totalRange.Style.Font.Bold = true;

            totalRange.Style.Alignment.Horizontal =
                XLAlignmentHorizontalValues.Right;

            totalRange.Style.Alignment.Vertical =
                XLAlignmentVerticalValues.Center;

            worksheet.Row(totalRow).Height = 25;

            // =========================
            // COLUMN WIDTH
            // =========================

            worksheet.Columns().AdjustToContents();

            // Keep reasonable minimum widths
            worksheet.Column(1).Width = 10;
            worksheet.Column(2).Width = 18;
            worksheet.Column(3).Width = 18;
            worksheet.Column(4).Width = 15;
            worksheet.Column(5).Width = 22;
            worksheet.Column(6).Width = 22;
            worksheet.Column(7).Width = 18;
            worksheet.Column(8).Width = 22;
            worksheet.Column(9).Width = 20;
            worksheet.Column(10).Width = 15;
            worksheet.Column(11).Width = 18;
            worksheet.Column(12).Width = 15;
            worksheet.Column(13).Width = 18;

            // =========================
            // FREEZE HEADER
            // =========================

            worksheet.SheetView.FreezeRows(1);

            // =========================
            // AUTO FILTER
            // =========================

            worksheet.Range(
                1,
                1,
                totalRow - 1,
                13
            ).SetAutoFilter();

            // =========================
            // BORDER
            // =========================

            // Keep borders very light / minimal
            worksheet.Range(
                1,
                1,
                totalRow,
                13
            ).Style.Border.OutsideBorder =
                XLBorderStyleValues.Thin;

            // =========================
            // DOWNLOAD FILE
            // =========================

            using var stream = new MemoryStream();

            workbook.SaveAs(stream);

            stream.Position = 0;

            var fileName =
                $"Reports_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName
            );
        }



        [Authorize]
        [HttpGet("finance-report")]
        public async Task<IActionResult> FinanceReport(
            [FromQuery] string? date = null,
            [FromQuery] int? month = null,
            [FromQuery] int? year = null,
            [FromQuery] int? kartDuration = null)
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
                return Unauthorized();

            if (!user.IsActive)
                return Forbid();

            var roles = await _userManager.GetRolesAsync(user);

            bool isOwner = roles.Contains("Owner");
            bool isSimpleUser = roles.Contains("SimpleUser");
            bool isCompanyUser = roles.Contains("CompanyUser");

            if (isCompanyUser || (!isOwner && !isSimpleUser))
                return Forbid();

            var query = _context.Report
                .AsNoTracking()
                .AsQueryable();

            // ============================================
            // EXACT AFGHAN / PERSIAN DATE
            // YYYY/MM/DD
            // ============================================

            if (!string.IsNullOrWhiteSpace(date))
            {
                var normalizedDate = date
                    .Trim()
                    .Replace("-", "/");

                var parts = normalizedDate.Split('/');

                if (parts.Length != 3)
                {
                    return BadRequest(new
                    {
                        message = "د نېټې بڼه ناسمه ده. YYYY/MM/DD وکاروئ."
                    });
                }

                int selectedYear;
                int selectedMonth;
                int selectedDay;

                if (!int.TryParse(parts[0], out selectedYear) ||
                    !int.TryParse(parts[1], out selectedMonth) ||
                    !int.TryParse(parts[2], out selectedDay))
                {
                    var normalizedNumbers = normalizedDate
                        .Replace("۰", "0")
                        .Replace("۱", "1")
                        .Replace("۲", "2")
                        .Replace("۳", "3")
                        .Replace("۴", "4")
                        .Replace("۵", "5")
                        .Replace("۶", "6")
                        .Replace("۷", "7")
                        .Replace("۸", "8")
                        .Replace("۹", "9")
                        .Replace("٠", "0")
                        .Replace("١", "1")
                        .Replace("٢", "2")
                        .Replace("٣", "3")
                        .Replace("٤", "4")
                        .Replace("٥", "5")
                        .Replace("٦", "6")
                        .Replace("٧", "7")
                        .Replace("٨", "8")
                        .Replace("٩", "9");

                    var numberParts = normalizedNumbers.Split('/');

                    if (numberParts.Length != 3 ||
                        !int.TryParse(
                            numberParts[0],
                            out selectedYear
                        ) ||
                        !int.TryParse(
                            numberParts[1],
                            out selectedMonth
                        ) ||
                        !int.TryParse(
                            numberParts[2],
                            out selectedDay
                        ))
                    {
                        return BadRequest(new
                        {
                            message = "د نېټې بڼه ناسمه ده. YYYY/MM/DD وکاروئ."
                        });
                    }
                }

                if (selectedYear <= 0 ||
                    selectedMonth < 1 ||
                    selectedMonth > 12 ||
                    selectedDay < 1 ||
                    selectedDay > 31)
                {
                    return BadRequest(new
                    {
                        message = "د نېټې ارزښت ناسم دی."
                    });
                }

                var datePrefix =
                    $"{selectedYear:0000}/{selectedMonth:00}/{selectedDay:00}";

                var persianDatePrefix =
                    ToPersianDigits(datePrefix);

                var arabicDatePrefix =
                    ToArabicDigits(datePrefix);

                query = query.Where(x =>
                    x.DateS != null &&
                    (
                        x.DateS.StartsWith(datePrefix) ||
                        x.DateS.StartsWith(persianDatePrefix) ||
                        x.DateS.StartsWith(arabicDatePrefix)
                    )
                );
            }

            // ============================================
            // MONTH FILTER
            // ============================================

            if (!dateHasValue(date) &&
                month.HasValue &&
                month.Value >= 1 &&
                month.Value <= 12)
            {
                var paddedMonth =
                    month.Value.ToString("00");

                var persianMonth =
                    paddedMonth
                        .Replace("0", "۰")
                        .Replace("1", "۱")
                        .Replace("2", "۲")
                        .Replace("3", "۳")
                        .Replace("4", "۴")
                        .Replace("5", "۵")
                        .Replace("6", "۶")
                        .Replace("7", "۷")
                        .Replace("8", "۸")
                        .Replace("9", "۹");

                var arabicMonth =
                    paddedMonth
                        .Replace("0", "٠")
                        .Replace("1", "١")
                        .Replace("2", "٢")
                        .Replace("3", "٣")
                        .Replace("4", "٤")
                        .Replace("5", "٥")
                        .Replace("6", "٦")
                        .Replace("7", "٧")
                        .Replace("8", "٨")
                        .Replace("9", "٩");

                query = query.Where(x =>
                    x.DateS != null &&
                    (
                        x.DateS.Contains($"/{paddedMonth}/") ||
                        x.DateS.Contains($"/{persianMonth}/") ||
                        x.DateS.Contains($"/{arabicMonth}/")
                    )
                );
            }

            // ============================================
            // YEAR FILTER
            // ============================================

            if (!dateHasValue(date) &&
                year.HasValue &&
                year.Value > 0)
            {
                var yearText =
                    year.Value.ToString("0000");

                var persianYear =
                    ToPersianDigits(yearText);

                var arabicYear =
                    ToArabicDigits(yearText);

                query = query.Where(x =>
                    x.DateS != null &&
                    (
                        x.DateS.StartsWith(yearText + "/") ||
                        x.DateS.StartsWith(persianYear + "/") ||
                        x.DateS.StartsWith(arabicYear + "/")
                    )
                );
            }

            // ============================================
            // KART DURATION
            // ============================================

            if (kartDuration.HasValue)
            {
                if (kartDuration.Value == 1)
                {
                    query = query.Where(x =>
                        x.KartDuration == KartDuration.یو
                    );
                }
                else if (kartDuration.Value == 2)
                {
                    query = query.Where(x =>
                        x.KartDuration == KartDuration.دری
                    );
                }
            }

            // ============================================
            // GET RECORDS
            // ============================================

            var records = await query
                .Select(x => new
                {
                    x.Id,
                    x.DateS,
                    x.KartDuration
                })
                .ToListAsync();

            // ============================================
            // یو = 1000 AFN
            // ============================================

            int oneCount = records.Count(x =>
                x.KartDuration == KartDuration.یو
            );

            int oneAmount =
                oneCount * 1000;

            // ============================================
            // دری = 3000 AFN
            // ============================================

            int threeCount = records.Count(x =>
                x.KartDuration == KartDuration.دری
            );

            int threeAmount =
                threeCount * 3000;

            // ============================================
            // TOTAL
            // ============================================

            int totalCount =
                oneCount + threeCount;

            int totalAmount =
                oneAmount + threeAmount;

            // ============================================
            // DAILY DETAIL
            // ============================================

            var daily = records
                .GroupBy(x => x.DateS)
                .Select(g =>
                {
                    int one = g.Count(x =>
                        x.KartDuration == KartDuration.یو
                    );

                    int three = g.Count(x =>
                        x.KartDuration == KartDuration.دری
                    );

                    return new
                    {
                        date = g.Key,

                        oneCount = one,

                        oneAmount =
                            one * 1000,

                        threeCount = three,

                        threeAmount =
                            three * 3000,

                        totalAmount =
                            (one * 1000) +
                            (three * 3000)
                    };
                })
                .OrderByDescending(x => x.date)
                .ToList();

            return Ok(new
            {
                oneCount,
                threeCount,

                oneAmount,
                threeAmount,

                totalCount,
                totalAmount,

                daily
            });
        }

        private static bool dateHasValue(string? date)
        {
            return !string.IsNullOrWhiteSpace(date);
        }
        private static string ToPersianDigits(string value)
        {
            return value
                .Replace("0", "۰")
                .Replace("1", "۱")
                .Replace("2", "۲")
                .Replace("3", "۳")
                .Replace("4", "۴")
                .Replace("5", "۵")
                .Replace("6", "۶")
                .Replace("7", "۷")
                .Replace("8", "۸")
                .Replace("9", "۹");
        }
        private static string ToArabicDigits(string value)
        {
            return value
                .Replace("0", "٠")
                .Replace("1", "١")
                .Replace("2", "٢")
                .Replace("3", "٣")
                .Replace("4", "٤")
                .Replace("5", "٥")
                .Replace("6", "٦")
                .Replace("7", "٧")
                .Replace("8", "٨")
                .Replace("9", "٩");
        }


    }
}