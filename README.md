# Ranki - AI Visibility Intelligence Platform (Backend)

Ranki is a backend ASP.NET Core 8 Web API platform for generating AI visibility reports. It discovers competitors, generates search intents, and provides actionable recommendations to improve AI search visibility using the Gemini API.

## Features

- **Authentication**: JWT-based authentication with `Admin` and `BusinessOwner` roles.
- **Background Processing**: Hangfire integration for long-running scan tasks.
- **AI Integration**: Uses Gemini API to mock and discover search intents, competitors, and generate recommendations.
- **Reporting**: Generates mock PDF reports and optimization files (`robots.txt`, `llms.txt`).
- **Dashboard & Settings**: Endpoints to retrieve scan history, visibility scores, and manage user settings.
- **Admin**: Dedicated admin endpoints for user and scan management.

## Tech Stack

- ASP.NET Core 8
- Entity Framework Core (SQL Server)
- Hangfire (Background jobs)
- BCrypt (Password hashing)
- JWT (Authentication)
- Gemini API (AI content generation)

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/IbrahimZatary/Ranki-.git
   cd Ranki-
   git checkout dev
   ```

2. **Configure AppSettings**:
   Add your Gemini API Key in `appsettings.json`:
   ```json
   "Gemini": {
     "ApiKey": "YOUR_GEMINI_API_KEY",
     "BaseUrl": "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
   }
   ```
   Ensure your database connection string in `DefaultConnection` and `Hangfire` points to your local SQL Server Express (`RankiDB`).

3. **Run EF Core Migrations**:
   ```bash
   dotnet ef database update
   ```

4. **Run the Application**:
   ```bash
   dotnet run
   ```

## API Documentation

Once the app is running in Development mode, visit `/swagger` to interact with the endpoints.

## License

All rights reserved.
