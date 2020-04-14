# Dev Environment Setup

You will need at least:
yarn: 1.19.1
npm: 6.12.0
node: 12.13.0
mongo: 3.6

Clone down and in the project directory create a `.env` file with the following items:

```
MONGO_URL="mongodb://localhost/homebase"
CAMPAIGN_MONITOR_KEY="<YOUR CAPAIGN MONITOR API KEY>"
NODE_ENV="development"
DISABLE_LOGGING=true
```

Do a `yarn install` to install dependencies

# Running The Project

Inside the project directory run `yarn dev` to spin up the admin interface.