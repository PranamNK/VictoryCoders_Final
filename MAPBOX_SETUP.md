# Mapbox Setup Instructions

## Getting Your Mapbox Token

1. Visit [https://mapbox.com/](https://mapbox.com/) and create a free account
2. Navigate to your [Account Dashboard](https://account.mapbox.com/)
3. Go to the **Tokens** section
4. Copy your **Default Public Token** (starts with `pk.`)

## Setting Up the Token

1. Create a `.env` file in the root of your project (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Add your Mapbox token to the `.env` file:
   ```
   VITE_MAPBOX_TOKEN=pk.your_actual_token_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Important Notes

- The Mapbox token is **public** (starts with `pk.`) and is safe to use in client-side code
- Free tier includes 50,000 free map loads per month
- Never commit your `.env` file to version control (it's in `.gitignore`)
- The application will work with a placeholder token but the map may not load correctly

## Features Using Mapbox

- Interactive map with temple locations
- Clustered markers for better visualization
- Popup information on marker hover
- Smooth flyTo animations when selecting temples
- User geolocation with "Locate me" button
- Navigation controls (zoom, rotate)

## Troubleshooting

If the map doesn't load:
1. Check that your `.env` file contains the correct token
2. Verify the token starts with `pk.`
3. Check browser console for any error messages
4. Ensure you've restarted the dev server after adding the token
