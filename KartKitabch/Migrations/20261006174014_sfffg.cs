using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KartKitabch.Migrations
{
    /// <inheritdoc />
    public partial class sfffg : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompanyPlace",
                table: "Companies",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompanyPlace",
                table: "Companies");
        }
    }
}
