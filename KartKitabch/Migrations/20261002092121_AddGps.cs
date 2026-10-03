using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KartKitabch.Migrations
{
    /// <inheritdoc />
    public partial class AddGps : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GPSCompanyId",
                table: "Report",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GPSCompanies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GPSCompanies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Report_GPSCompanyId",
                table: "Report",
                column: "GPSCompanyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_GPSCompanies_GPSCompanyId",
                table: "Report",
                column: "GPSCompanyId",
                principalTable: "GPSCompanies",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_GPSCompanies_GPSCompanyId",
                table: "Report");

            migrationBuilder.DropTable(
                name: "GPSCompanies");

            migrationBuilder.DropIndex(
                name: "IX_Report_GPSCompanyId",
                table: "Report");

            migrationBuilder.DropColumn(
                name: "GPSCompanyId",
                table: "Report");
        }
    }
}
