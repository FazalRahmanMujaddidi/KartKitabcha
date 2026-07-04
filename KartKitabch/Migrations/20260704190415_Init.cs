using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KartKitabch.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
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
                name: "CompanyLocation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    ProvincesAndCitiesId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CompanyLocation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CompanyLocation_Companies_CompanyId",
                        column: x => x.CompanyId,
                        principalTable: "Companies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CompanyLocation_ProvincesAndCities_ProvincesAndCitiesId",
                        column: x => x.ProvincesAndCitiesId,
                        principalTable: "ProvincesAndCities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CompanyId = table.Column<int>(type: "int", nullable: false),
                    SerialNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PaletNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ProvincesAndCitiesId = table.Column<int>(type: "int", nullable: false),
                    KartDuration = table.Column<int>(type: "int", nullable: false),
                    TypeOfKart = table.Column<int>(type: "int", nullable: false),
                    TypeOfActivity = table.Column<int>(type: "int", nullable: false),
                    KartNewRenewLost = table.Column<int>(type: "int", nullable: false),
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
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Report_ProvincesAndCities_ProvincesAndCitiesId",
                        column: x => x.ProvincesAndCitiesId,
                        principalTable: "ProvincesAndCities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CompanyLocation_CompanyId",
                table: "CompanyLocation",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_CompanyLocation_ProvincesAndCitiesId",
                table: "CompanyLocation",
                column: "ProvincesAndCitiesId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_CompanyId",
                table: "Report",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Report_ProvincesAndCitiesId",
                table: "Report",
                column: "ProvincesAndCitiesId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CompanyLocation");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropTable(
                name: "Companies");

            migrationBuilder.DropTable(
                name: "ProvincesAndCities");
        }
    }
}
