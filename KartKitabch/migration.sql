IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Companies] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [MyProperty] int NOT NULL,
    [CompanyTon] int NOT NULL,
    CONSTRAINT [PK_Companies] PRIMARY KEY ([Id])
);

CREATE TABLE [OfficeContents] (
    [Id] int NOT NULL IDENTITY,
    [Office] nvarchar(max) NULL,
    [TypeLetter] nvarchar(max) NULL,
    [Content] nvarchar(max) NULL,
    CONSTRAINT [PK_OfficeContents] PRIMARY KEY ([Id])
);

CREATE TABLE [Person] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [FatherName] nvarchar(max) NOT NULL,
    [NIC] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Person] PRIMARY KEY ([Id])
);

CREATE TABLE [ProvincesAndCities] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_ProvincesAndCities] PRIMARY KEY ([Id])
);

CREATE TABLE [Senders] (
    [Id] int NOT NULL IDENTITY,
    [SenderTitle] nvarchar(max) NULL,
    [SenderName] nvarchar(max) NULL,
    CONSTRAINT [PK_Senders] PRIMARY KEY ([Id])
);

CREATE TABLE [Vehicles] (
    [Id] int NOT NULL IDENTITY,
    [Type] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_Vehicles] PRIMARY KEY ([Id])
);

CREATE TABLE [CompanyLocations] (
    [Id] int NOT NULL IDENTITY,
    [CompanyId] int NOT NULL,
    [ProvincesAndCitiesId] int NOT NULL,
    CONSTRAINT [PK_CompanyLocations] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CompanyLocations_Companies_CompanyId] FOREIGN KEY ([CompanyId]) REFERENCES [Companies] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_CompanyLocations_ProvincesAndCities_ProvincesAndCitiesId] FOREIGN KEY ([ProvincesAndCitiesId]) REFERENCES [ProvincesAndCities] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [Letters] (
    [Id] int NOT NULL IDENTITY,
    [PlateNumber] nvarchar(max) NULL,
    [VehicleId] int NULL,
    [DateS] nvarchar(max) NULL,
    [Chasis] nvarchar(max) NULL,
    [ProvincesAndCitiesId] int NULL,
    [PersonId] int NULL,
    [OfficeContentId] int NOT NULL,
    [SenderId] int NULL,
    CONSTRAINT [PK_Letters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Letters_OfficeContents_OfficeContentId] FOREIGN KEY ([OfficeContentId]) REFERENCES [OfficeContents] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_Letters_Person_PersonId] FOREIGN KEY ([PersonId]) REFERENCES [Person] ([Id]),
    CONSTRAINT [FK_Letters_ProvincesAndCities_ProvincesAndCitiesId] FOREIGN KEY ([ProvincesAndCitiesId]) REFERENCES [ProvincesAndCities] ([Id]),
    CONSTRAINT [FK_Letters_Senders_SenderId] FOREIGN KEY ([SenderId]) REFERENCES [Senders] ([Id]),
    CONSTRAINT [FK_Letters_Vehicles_VehicleId] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicles] ([Id])
);

CREATE TABLE [Report] (
    [Id] int NOT NULL IDENTITY,
    [CompanyId] int NOT NULL,
    [SerialNumber] nvarchar(max) NULL,
    [PaletNumber] nvarchar(max) NULL,
    [ProvincesAndCitiesId] int NULL,
    [DestinationCompanyId] int NULL,
    [DestinationProvinceId] int NULL,
    [ReportId] int NULL,
    [KartDuration] int NULL,
    [TypeOfKart] int NULL,
    [TypeOfActivity] int NULL,
    [KartNewRenewLost] int NULL,
    [VehicleId] int NOT NULL,
    [DateS] nvarchar(max) NOT NULL,
    [Chasis] nvarchar(max) NULL,
    CONSTRAINT [PK_Report] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Report_Companies_CompanyId] FOREIGN KEY ([CompanyId]) REFERENCES [Companies] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Report_Companies_DestinationCompanyId] FOREIGN KEY ([DestinationCompanyId]) REFERENCES [Companies] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Report_ProvincesAndCities_DestinationProvinceId] FOREIGN KEY ([DestinationProvinceId]) REFERENCES [ProvincesAndCities] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Report_ProvincesAndCities_ProvincesAndCitiesId] FOREIGN KEY ([ProvincesAndCitiesId]) REFERENCES [ProvincesAndCities] ([Id]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Report_Vehicles_VehicleId] FOREIGN KEY ([VehicleId]) REFERENCES [Vehicles] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_CompanyLocations_CompanyId] ON [CompanyLocations] ([CompanyId]);

CREATE INDEX [IX_CompanyLocations_ProvincesAndCitiesId] ON [CompanyLocations] ([ProvincesAndCitiesId]);

CREATE INDEX [IX_Letters_OfficeContentId] ON [Letters] ([OfficeContentId]);

CREATE INDEX [IX_Letters_PersonId] ON [Letters] ([PersonId]);

CREATE INDEX [IX_Letters_ProvincesAndCitiesId] ON [Letters] ([ProvincesAndCitiesId]);

CREATE INDEX [IX_Letters_SenderId] ON [Letters] ([SenderId]);

CREATE INDEX [IX_Letters_VehicleId] ON [Letters] ([VehicleId]);

CREATE INDEX [IX_Report_CompanyId] ON [Report] ([CompanyId]);

CREATE INDEX [IX_Report_DestinationCompanyId] ON [Report] ([DestinationCompanyId]);

CREATE INDEX [IX_Report_DestinationProvinceId] ON [Report] ([DestinationProvinceId]);

CREATE INDEX [IX_Report_ProvincesAndCitiesId] ON [Report] ([ProvincesAndCitiesId]);

CREATE INDEX [IX_Report_VehicleId] ON [Report] ([VehicleId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260801151604_AddSenderWithValidateNverd', N'10.0.12');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Report] ADD [GPSCompanyId] int NULL;

CREATE TABLE [GPSCompanies] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    CONSTRAINT [PK_GPSCompanies] PRIMARY KEY ([Id])
);

CREATE INDEX [IX_Report_GPSCompanyId] ON [Report] ([GPSCompanyId]);

ALTER TABLE [Report] ADD CONSTRAINT [FK_Report_GPSCompanies_GPSCompanyId] FOREIGN KEY ([GPSCompanyId]) REFERENCES [GPSCompanies] ([Id]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261002092121_AddGps', N'10.0.12');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Report] DROP CONSTRAINT [FK_Report_GPSCompanies_GPSCompanyId];

CREATE TABLE [AspNetRoles] (
    [Id] nvarchar(450) NOT NULL,
    [Name] nvarchar(256) NULL,
    [NormalizedName] nvarchar(256) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);

CREATE TABLE [AspNetUsers] (
    [Id] nvarchar(450) NOT NULL,
    [FullName] nvarchar(max) NULL,
    [CompanyId] int NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UserName] nvarchar(256) NULL,
    [NormalizedUserName] nvarchar(256) NULL,
    [Email] nvarchar(256) NULL,
    [NormalizedEmail] nvarchar(256) NULL,
    [EmailConfirmed] bit NOT NULL,
    [PasswordHash] nvarchar(max) NULL,
    [SecurityStamp] nvarchar(max) NULL,
    [ConcurrencyStamp] nvarchar(max) NULL,
    [PhoneNumber] nvarchar(max) NULL,
    [PhoneNumberConfirmed] bit NOT NULL,
    [TwoFactorEnabled] bit NOT NULL,
    [LockoutEnd] datetimeoffset NULL,
    [LockoutEnabled] bit NOT NULL,
    [AccessFailedCount] int NOT NULL,
    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUsers_Companies_CompanyId] FOREIGN KEY ([CompanyId]) REFERENCES [Companies] ([Id]) ON DELETE SET NULL
);

CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [RoleId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [UserId] nvarchar(450) NOT NULL,
    [ClaimType] nvarchar(max) NULL,
    [ClaimValue] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserLogins] (
    [LoginProvider] nvarchar(450) NOT NULL,
    [ProviderKey] nvarchar(450) NOT NULL,
    [ProviderDisplayName] nvarchar(max) NULL,
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserRoles] (
    [UserId] nvarchar(450) NOT NULL,
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE TABLE [AspNetUserTokens] (
    [UserId] nvarchar(450) NOT NULL,
    [LoginProvider] nvarchar(450) NOT NULL,
    [Name] nvarchar(450) NOT NULL,
    [Value] nvarchar(max) NULL,
    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);

CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);

CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;

CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);

CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);

CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);

CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);

CREATE INDEX [IX_AspNetUsers_CompanyId] ON [AspNetUsers] ([CompanyId]);

CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;

ALTER TABLE [Report] ADD CONSTRAINT [FK_Report_GPSCompanies_GPSCompanyId] FOREIGN KEY ([GPSCompanyId]) REFERENCES [GPSCompanies] ([Id]) ON DELETE SET NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20261002141013_AddUsers', N'10.0.12');

COMMIT;
GO

