# 🧠 HLTV API - Complete Technical Overview

A robust RESTful API wrapper built with Express.js and TypeScript to provide structured access to CS:GO match data via HLTV, including statistics, teams, players, and event insights.

## � Quick Start

### Development
```bash
# Install dependencies
pnpm install

# Run in development mode
pnpm dev
```

### Production
```bash
# Build the project
pnpm build

# Start the server
pnpm start
```

### Docker 🐳
```bash
# Build and run with Docker
docker build -t hltv-api .
docker run -d -p 3000:3000 --name hltv-api-container hltv-api

# Or use Docker Compose
docker-compose up -d
```

## �👀 Features

- Match results and statistics
- Team and player information
- Event details and schedules
- Head-to-head statistics
- Search functionality
- Live and upcoming matches
- Error handling with detailed responses
- TypeScript support
- Date validation for match queries
- Team name formatting
- Comprehensive match statistics
- Player performance metrics
- Event prize distribution
- Team rankings and history

## 🔧 Technologies Used

- TypeScript
- Express.js
- HLTV API
- CORS
- dotenv
- Cheerio (for HTML parsing)

## 📁 Project Structure

```
hltv-api/
├── src/
│   ├── lib/
│   │   ├── config/         # Configuration settings
│   │   ├── endpoints/      # HLTV API endpoint implementations
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic and HLTV integration
│   └── index.ts           # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Prerequisites

- Node.js (v14 or higher)
- Yarn, npm or pnpm package manager

## 🐱‍👤 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hltv-api.git
cd hltv-api
```

2. Install dependencies:
```bash
yarn install
# or
npm install
# or
pnpm install
```

## 😎 Development

To start the development server with hot-reload:

```bash
yarn dev
# or
npm run dev
# or
pnpm dev
```

The server will start on the default port (check your environment variables).

## 🔌 API Endpoints

### Match Endpoints

#### GET /matches
Retrieves all matches.

**Query Parameters:**
- `selectedDate`: Date in YYYY-MM-DD format (optional)

**Response:**
```json
{
  "liveMatches": [
    {
      "id": 12345,
      "team1": {
        "name": "Team A",
        "logo": "https://example.com/logo.png"
      },
      "team2": {
        "name": "Team B",
        "logo": "https://example.com/logo.png"
      },
      "event": {
        "id": 100,
        "name": "Event Name"
      },
      "date": 1647781200000,
      "format": "bo3",
      "stars": 5
    }
  ],
  "upcomingMatchesByChampionship": [
    {
      "event": {
        "id": 100,
        "name": "Event Name"
      },
      "matches": [
        {
          "id": 12345,
          "team1": {
            "name": "Team A",
            "logo": "https://example.com/logo.png"
          },
          "team2": {
            "name": "Team B",
            "logo": "https://example.com/logo.png"
          },
          "date": 1647781200000,
          "format": "bo3",
          "stars": 5
        }
      ]
    }
  ]
}
```

#### GET /matches/:id
Retrieves a specific match by ID.

**Parameters:**
- `id`: Match ID (path parameter, required)

**Response:**
```json
{
  "id": 12345,
  "team1": {
    "id": 1,
    "name": "Team A",
    "score": 2
  },
  "team2": {
    "id": 2,
    "name": "Team B",
    "score": 1
  },
  "event": {
    "id": 100,
    "name": "Event Name"
  },
  "date": "2024-03-20T15:00:00Z",
  "format": "bo3",
  "status": "completed",
  "maps": [
    {
      "name": "de_dust2",
      "team1Score": 16,
      "team2Score": 14
    }
  ]
}
```

#### GET /matches/upcoming
Retrieves upcoming matches.

**Query Parameters:**
- `limit`: Number of matches to return (optional, default: 10, type: number)

**Response:**
```json
{
  "matches": [
    {
      "id": 12345,
      "team1": "Team A",
      "team2": "Team B",
      "event": "Event Name",
      "date": "2024-03-20T15:00:00Z",
      "format": "bo3"
    }
  ]
}
```

#### GET /matches/live
Retrieves currently live matches.

**Response:**
```json
{
  "matches": [
    {
      "id": 12345,
      "team1": {
        "id": 1,
        "name": "Team A",
        "score": 1
      },
      "team2": {
        "id": 2,
        "name": "Team B",
        "score": 0
      },
      "event": "Event Name",
      "currentMap": "de_dust2",
      "format": "bo3"
    }
  ]
}
```

#### GET /matches/:id/stats
Retrieves detailed statistics for a specific match.

**Parameters:**
- `id`: Match ID (path parameter, required)

**Response:**
```json
{
  "matchId": 12345,
  "team1Stats": {
    "kills": 45,
    "deaths": 38,
    "roundsWon": 16,
    "firstKills": 8
  },
  "team2Stats": {
    "kills": 38,
    "deaths": 45,
    "roundsWon": 14,
    "firstKills": 6
  },
  "playerStats": [
    {
      "playerId": 1,
      "name": "Player1",
      "kills": 25,
      "deaths": 20,
      "assists": 5,
      "rating": 1.25
    }
  ]
}
```

### Results Endpoint

#### GET /results
Retrieves match results with filtering options.

**Required Query Parameters:**
- `eventIds`: Array of event IDs to filter matches (type: number[])
- `bestOfX`: Number of maps in the match (type: number, e.g., 1, 3, 5)

**Example Request:**

GET /results?eventIds=[123,456]&bestOfX=3

**Response:**
```json
{
  "results": [
    {
      "matchId": 12345,
      "team1": {
        "id": 1,
        "name": "Team A",
        "score": 2
      },
      "team2": {
        "id": 2,
        "name": "Team B",
        "score": 1
      },
      "event": {
        "id": 100,
        "name": "Event Name"
      },
      "date": "2024-03-20T15:00:00Z",
      "maps": [
        {
          "name": "de_dust2",
          "team1Score": 16,
          "team2Score": 14
        }
      ]
    }
  ]
}
```

### Team Endpoints

#### GET /teams/:id
Retrieves team information by ID.

**Parameters:**
- `id`: Team ID (path parameter, required)

**Response:**
```json
{
  "id": 1,
  "name": "Team A",
  "logo": "https://example.com/logo.png",
  "country": "Brazil",
  "ranking": 5,
  "players": [
    {
      "id": 1,
      "name": "Player1",
      "role": "rifler"
    }
  ]
}
```

#### GET /teams/stats/:id
Retrieves team statistics.

**Parameters:**
- `id`: Team ID (path parameter, required)

**Response:**
```json
{
  "teamId": 1,
  "name": "Team A",
  "matchesPlayed": 100,
  "wins": 65,
  "losses": 35,
  "winRate": 65,
  "averageScore": 16.5,
  "mapsPlayed": {
    "de_dust2": 30,
    "de_mirage": 25,
    "de_inferno": 20
  }
}
```

#### GET /teams/name/:name
Retrieves team information by name.

**Parameters:**
- `name`: Team name (path parameter, required)

**Response:**
```json
{
  "id": 1,
  "name": "Team A",
  "logo": "https://example.com/logo.png",
  "country": "Brazil",
  "ranking": 5
}
```

#### GET /teams/search
Searches teams by name.

**Required Query Parameters:**
- `query`: Search term (type: string)

**Response:**
```json
{
  "teams": [
    {
      "id": 1,
      "name": "Team A",
      "logo": "https://example.com/logo.png",
      "country": "Brazil"
    }
  ]
}
```

#### GET /teams/:team1Id/vs/:team2Id
Retrieves head-to-head statistics between two teams.

**Parameters:**
- `team1Id`: First team ID (path parameter, required)
- `team2Id`: Second team ID (path parameter, required)

**Response:**
```json
{
  "team1": {
    "id": 1,
    "name": "Team A",
    "wins": 5
  },
  "team2": {
    "id": 2,
    "name": "Team B",
    "wins": 3
  },
  "totalMatches": 8,
  "recentMatches": [
    {
      "matchId": 12345,
      "date": "2024-03-20T15:00:00Z",
      "winner": "Team A",
      "score": "2-1"
    }
  ]
}
```

### Player Endpoints

#### GET /players/:id
Retrieves player information by ID.

**Parameters:**
- `id`: Player ID (path parameter, required)

**Response:**
```json
{
  "id": 1,
  "name": "Player1",
  "nickname": "player1",
  "country": "Brazil",
  "team": {
    "id": 1,
    "name": "Team A"
  },
  "role": "rifler",
  "age": 25
}
```

#### GET /players/stats/:id
Retrieves player statistics.

**Parameters:**
- `id`: Player ID (path parameter, required)

**Response:**
```json
{
  "playerId": 1,
  "name": "Player1",
  "matchesPlayed": 100,
  "kills": 2500,
  "deaths": 2000,
  "assists": 500,
  "rating": 1.25,
  "headshots": 1000,
  "headshotPercentage": 40,
  "mapsPlayed": {
    "de_dust2": 30,
    "de_mirage": 25,
    "de_inferno": 20
  }
}
```

#### GET /players/search
Searches players by name.

**Required Query Parameters:**
- `query`: Search term (type: string)

**Response:**
```json
{
  "players": [
    {
      "id": 1,
      "name": "Player1",
      "nickname": "player1",
      "team": "Team A"
    }
  ]
}
```

### Event Endpoints

#### GET /events
Retrieves all events.

**Response:**
```json
{
  "events": [
    {
      "id": 100,
      "name": "Event Name",
      "date": "2024-03-20T15:00:00Z",
      "prizePool": "$100,000",
      "location": "Online",
      "teams": 16
    }
  ]
}
```

#### GET /events/:id
Retrieves event information by ID.

**Parameters:**
- `id`: Event ID (path parameter, required)

**Response:**
```json
{
  "id": 100,
  "name": "Event Name",
  "date": "2024-03-20T15:00:00Z",
  "prizePool": "$100,000",
  "location": "Online",
  "teams": 16,
  "format": "Double Elimination",
  "participants": [
    {
      "id": 1,
      "name": "Team A",
      "seed": 1
    }
  ]
}
```

#### GET /events/upcoming
Retrieves upcoming events.

**Query Parameters:**
- `limit`: Number of events to return (optional, default: 10, type: number)

**Response:**
```json
{
  "events": [
    {
      "id": 100,
      "name": "Event Name",
      "date": "2024-03-20T15:00:00Z",
      "prizePool": "$100,000",
      "location": "Online",
      "teams": 16
    }
  ]
}
```

### News Endpoint

#### GET /news
Retrieves latest news articles.

**Response:**
```json
{
  "articles": [
    {
      "id": 1,
      "title": "Article Title",
      "description": "Article description",
      "date": "2024-03-20T15:00:00Z",
      "url": "https://example.com/article"
    }
  ]
}
```

### Ranking Endpoints

#### GET /ranking/teams
Retrieves team rankings.

**Response:**
```json
{
  "rankings": [
    {
      "position": 1,
      "team": {
        "id": 1,
        "name": "Team A",
        "points": 1000
      }
    }
  ]
}
```

#### GET /ranking/players
Retrieves player rankings.

**Response:**
```json
{
  "rankings": [
    {
      "position": 1,
      "player": {
        "id": 1,
        "name": "Player1",
        "rating": 1.25
      }
    }
  ]
}
```

## 🔒 Error Handling

The API returns appropriate HTTP status codes and error messages:

- `400 Bad Request`: Missing required parameters
- `500 Internal Server Error`: Server-side errors with detailed messages

Error responses include a timestamp and descriptive message:
```json
{
  "error": "Error message",
  "timestamp": "2024-03-20T15:00:00Z"
}
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📦 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ❕ Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.
