using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KartKitabch.Migrations
{
    /// <inheritdoc />
    public partial class AddCompanyLocationBatchControl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AutoCloseEnabled",
                table: "CompanyLocations",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ExtraReportBatches",
                table: "CompanyLocations",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "IsAddingClosed",
                table: "CompanyLocations",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutoCloseEnabled",
                table: "CompanyLocations");

            migrationBuilder.DropColumn(
                name: "ExtraReportBatches",
                table: "CompanyLocations");

            migrationBuilder.DropColumn(
                name: "IsAddingClosed",
                table: "CompanyLocations");
        }
    }
}
