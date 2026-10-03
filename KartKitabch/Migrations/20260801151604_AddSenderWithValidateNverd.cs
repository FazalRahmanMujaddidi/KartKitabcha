using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KartKitabch.Migrations
{
    /// <inheritdoc />
    public partial class AddSenderWithValidateNverd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Companies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MyProperty = table.Column<int>(type: "int", nullable: false),
                    CompanyTon = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Companies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "OfficeContents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Office = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TypeLetter = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OfficeContents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Person",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FatherName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NIC = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Person", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProvincesAndCities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProvincesAndCities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Senders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SenderTitle = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SenderName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Senders", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Vehicles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vehicles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CompanyLocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    ProvincesAndCitiesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyLocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyLocations_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompanyLocations_ProvincesAndCities_ProvincesAndCitiesId",
                        column: x => x.ProvincesAndCitiesId,
                        principalTable: "ProvincesAndCities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Letters",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlateNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VehicleId = table.Column<int>(type: "int", nullable: true),
                    DateS = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Chasis = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProvincesAndCitiesId = table.Column<int>(type: "int", nullable: true),
                    PersonId = table.Column<int>(type: "int", nullable: true),
                    OfficeContentId = table.Column<int>(type: "int", nullable: false),
                    SenderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Letters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Letters_OfficeContents_OfficeContentId",
                        column: x => x.OfficeContentId,
                        principalTable: "OfficeContents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Letters_Person_PersonId",
                        column: x => x.PersonId,
                        principalTable: "Person",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Letters_ProvincesAndCities_ProvincesAndCitiesId",
                        column: x => x.ProvincesAndCitiesId,
                        principalTable: "ProvincesAndCities",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Letters_Senders_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Senders",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Letters_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    SerialNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PaletNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProvincesAndCitiesId = table.Column<int>(type: "int", nullable: true),
                    DestinationCompanyId = table.Column<int>(type: "int", nullable: true),
                    DestinationProvinceId = table.Column<int>(type: "int", nullable: true),
                    ReportId = table.Column<int>(type: "int", nullable: true),
                    KartDuration = table.Column<int>(type: "int", nullable: true),
                    TypeOfKart = table.Column<int>(type: "int", nullable: true),
                    TypeOfActivity = table.Column<int>(type: "int", nullable: true),
                    KartNewRenewLost = table.Column<int>(type: "int", nullable: true),
                    VehicleId = table.Column<int>(type: "int", nullable: false),
                    DateS = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Chasis = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Report_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Report_Companies_DestinationCompanyId",
                        column: x => x.DestinationCompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Report_ProvincesAndCities_DestinationProvinceId",
                        column: x => x.DestinationProvinceId,
                        principalTable: "ProvincesAndCities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Report_ProvincesAndCities_ProvincesAndCitiesId",
                        column: x => x.ProvincesAndCitiesId,
                        principalTable: "ProvincesAndCities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Report_Vehicles_VehicleId",
                        column: x => x.VehicleId,
                        principalTable: "Vehicles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyLocations_CompanyId",
                table: "CompanyLocations",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyLocations_ProvincesAndCitiesId",
                table: "CompanyLocations",
                column: "ProvincesAndCitiesId");

            migrationBuilder.CreateIndex(
                name: "IX_Letters_OfficeContentId",
                table: "Letters",
                column: "OfficeContentId");

            migrationBuilder.CreateIndex(
                name: "IX_Letters_PersonId",
                table: "Letters",
                column: "PersonId");

            migrationBuilder.CreateIndex(
                name: "IX_Letters_ProvincesAndCitiesId",
                table: "Letters",
                column: "ProvincesAndCitiesId");

            migrationBuilder.CreateIndex(
                name: "IX_Letters_SenderId",
                table: "Letters",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_Letters_VehicleId",
                table: "Letters",
                column: "VehicleId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_CompanyId",
                table: "Report",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_DestinationCompanyId",
                table: "Report",
                column: "DestinationCompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_DestinationProvinceId",
                table: "Report",
                column: "DestinationProvinceId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_ProvincesAndCitiesId",
                table: "Report",
                column: "ProvincesAndCitiesId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_VehicleId",
                table: "Report",
                column: "VehicleId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyLocations");

            migrationBuilder.DropTable(
                name: "Letters");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropTable(
                name: "OfficeContents");

            migrationBuilder.DropTable(
                name: "Person");

            migrationBuilder.DropTable(
                name: "Senders");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "ProvincesAndCities");

            migrationBuilder.DropTable(
                name: "Vehicles");
        }
    }
}
