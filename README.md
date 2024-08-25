# AI-Powered Car Dealership Assistant

This project consists of two main components: a voice-based AI assistant for handling customer inquiries and a dashboard for monitoring and analyzing call data.

## Tech Stack

### Caller Agent

- Node.js
- Express.js
- WebSocket (express-ws)
- OpenAI GPT for natural language processing
- Deepgram for speech-to-text transcription
- Twilio for handling phone calls
- MongoDB for data storage

### Dashboard

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Chart.js and react-chartjs-2 for data visualization
- MongoDB for data retrieval

## Caller Agent

The caller agent is a Node.js application that uses various APIs and services to create an AI-powered voice assistant for a car dealership.

### Key Features:

1. Voice-to-text transcription using Deepgram
2. Natural language processing with OpenAI's GPT model
3. Text-to-speech conversion for AI responses
4. Integration with Twilio for handling phone calls
5. MongoDB integration for storing call logs and transcriptions
6. Real-time audio streaming and processing

### Main Components:

- `app.js`: The main application file that sets up the Express server and WebSocket connections
- `gpt-service.js`: Handles interactions with the OpenAI API
- `tts-service.js`: Manages text-to-speech conversion
- `transcription-service.js`: Handles speech-to-text conversion
- `db-service.js`: Manages database operations with MongoDB
- `recording-service.js`: Handles call recording functionality
- `stream-service.js`: Manages audio streaming

### Function Calls:

The AI assistant can perform various functions, such as:

- Checking car availability
- Getting car prices
- Scheduling test drives
- Scheduling maintenance appointments
- Scheduling oil changes

These functions are defined in the `functions` directory and are dynamically loaded based on the `function-manifest.js` file.

## Dashboard

The dashboard is a Next.js application that provides a user interface for viewing and analyzing call data.

### Key Features:

1. Overview of call statistics
2. Detailed call logs
3. Transcription viewer
4. Charts for data visualization
5. Appointment management

### Main Components:

- `app/dashboard/page.tsx`: The main dashboard page
- `components/CallLogDetail.tsx`: Displays detailed information for a specific call
- `components/CallLogsList.tsx`: Lists all call logs
- `components/charts.tsx`: Renders various charts for data visualization
- `components/AppointmentsList.tsx`: Manages and displays appointments

### UI Components:

The dashboard uses custom UI components built with Tailwind CSS and Radix UI primitives, including:

- Cards
- Tables
- Tabs
- Badges
- Charts

## Setup and Installation

1. Clone the repository
2. Install dependencies for both the caller agent and dashboard:
   ```
   cd caller-agent && npm install
   cd ../dashboard && npm install
   ```
3. Set up environment variables:

   - For the caller agent, copy `.env.example` to `.env` and fill in the required values
   - For the dashboard, set up the necessary environment variables, including the MongoDB connection string

4. Start the caller agent:

   ```
   cd caller-agent && npm run dev
   ```

5. Start the dashboard:
   ```
   cd dashboard && npm run dev
   ```

## Testing

The caller agent includes Jest tests for various functions. Run tests using:

```
npm run test
```

## Deployment

### Caller Agent

The caller agent can be deployed using Fly.io. Modify the `fly.toml` file with your app name and use the following commands:

```
fly launch
fly deploy
fly secrets import < .env
```

### Dashboard

The dashboard can be deployed to your preferred Next.js hosting platform, such as Vercel or Netlify. Follow the platform-specific deployment instructions.

## Development

- The project uses ESLint for code linting
- Tailwind CSS is used for styling in the dashboard
- TypeScript is used in the dashboard for type safety

## License

This project is licensed under the MIT License. See the LICENSE file for details.
