# Teka API

> Backend API for Teka application, which is a product sharing platform

## Links

Tetegram app info: `https://my.telegram.org/apps`
Airgram (wrapper for node.js to work with TDLib): `https://airgram.netlify.app/`
TDLib (Telegram Database Library) docs: `https://core.telegram.org/tdlib`


## Usage

Rename "config/config.env.env" to "config/config.env" and update the values/settings to your own

## Install Dependencies

```
npm install
```

## Run App

```
# Run in dev mode
npm run dev

# Run in prod mode
npm start
```

## Database Seeder

To seed the database with users, bootcamps, courses and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```
