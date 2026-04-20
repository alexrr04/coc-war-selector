# COC Clan War Selector

A desktop app for Clash of Clans that randomly selects clan members for war based on Town Hall level and war preference. Built with Electron.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A Clash of Clans API token (see below)

## Getting a CoC API token

1. Go to [https://developer.clashofclans.com](https://developer.clashofclans.com) and log in with your Supercell ID.
2. Click **My Account** → **Create New Key**.
3. Fill in a name and description, then enter your **current public IP address** in the allowed IP list. You can find your public IP at [https://whatismyip.com](https://whatismyip.com).
4. Click **Create Key** and copy the token.

> **Note:** Tokens are IP-restricted. If your public IP changes (e.g. you switch networks), you will need to create a new key and update your `.env` file.

## Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/alexrr04/coc_war_selector.git
cd coc_war_selector
pnpm install

# 2. Create a .env file with your API token
cp .env.example .env
# Edit .env and replace "your_token_here" with your actual CoC API token

# 3. Run the app (build.js and tsc run automatically via the prestart hook)
pnpm start
```

## Usage

1. Enter your clan tag in the **Clan Tag** field (e.g. `#2QLLUOGPY`).
2. Select the minimum Town Hall level from the dropdown.
3. Enter the number of participants (must be a multiple of 5), or check **select as many as possible**.
4. Click **Select Warriors**.
5. The app fetches each member's profile, filters by Town Hall level and war preference set to **IN**, then randomly picks the requested number.

## Build a distributable

```bash
pnpm package
```

Output is written to `dist/`. Supports Windows (NSIS installer), macOS (DMG), and Linux (AppImage).
