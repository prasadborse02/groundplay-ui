# Groundplay UI

A modern, clean React application for finding, joining, and organizing local sports games.

## About Groundplay

Groundplay is a community-driven platform where users can:
- Register and create a profile
- Create and organize sports games
- Find games happening nearby
- Join games with just a few clicks
- View game details including location, time, and enrolled players

## Tech Stack

- **Frontend**: React 18 with Vite, Tailwind CSS
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Maps**: Leaflet with OpenStreetMap
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- API backend running (see `Api-doc.txt` for details)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd groundplay-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

The application uses environment variables for configuration. Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:8080
```

## Project Structure

```
src/
├── api/               # API service modules
├── assets/            # Static assets (images, fonts)
├── components/        # Reusable UI components
├── context/           # React context providers
├── hooks/             # Custom React hooks
├── pages/             # Application pages
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard-related pages
│   ├── game/          # Game creation and details
│   └── profile/       # User profile pages
├── utils/             # Utility functions
│   ├── helpers.js     # Helper functions
│   └── validation.js  # Form validation
├── App.jsx            # Main application component
└── main.jsx          # Application entry point
```

## Features

- **Authentication**: JWT-based authentication
- **Game Creation**: Create games with location selection via interactive map
- **Game Discovery**: Find nearby games based on geolocation
- **Game Enrollment**: Join or leave games with a single click
- **Dashboard**: View your created games and enrollments
- **Profile Management**: View and update your profile
- **Story Page**: Read about the vision behind Groundplay

## API Documentation

The backend API documentation is available in the `Api-doc.txt` file, detailing all endpoints, request parameters, and response formats.

## License

This project is licensed under the MIT License.