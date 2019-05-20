# AppFinder - Server

AppFinder is a server with REST API which allows to get detailed information regarding mobile apps from either Apple App Store or Google Play Store. It requires authorization (via JWT token). It allows bulk lookups for multiple apps.

## How to run
The server is ideally supposed to be used with [Appfinder-UI](https://github.com/yossisp/app-finder-ui). The allowed origins as configured per `Access-Control-Allow-Origin` header are: `http://localhost:3005`, `https://localhost:3005`,`http://localhost:80`, `https://localhost:80`. You can still use the server as a standalone service provider via REST API (see below).

The server can be started from a docker compose container:

1. From docker container (`docker-compose` must be installed):
	- `docker network create --driver bridge appstore-net` - creates a docker network needed to bind AppFinder backend container with frontend container.
	- `cd Appstore`
	- `docker-compose -f docker-compose-prod.yml build && docker-compose -f docker-compose-prod.yml up -d`
	- By now the server will be available at `http://localhost:3000`.
2. Locally by:
	- `cd Appstore`
	- `npm install`
	- `npm test`
	- This will make the server available locally at `http://localhost:3000`.

## Environment Variables
The following environment variables need to be suppied:

- `GOOGLE_KEY` - OAuth2.0 Google secret key
- `JWT_SECRET` - secret string to encode JWT token
- `GOOGLE_CLIENT_ID` - OAuth2.0 Google client id
- `HTTPS` - should the server be started in secure mode or not (possible values are `true`/`false`)

If `NODE_ENV` is set to `production` additional parameters can be used:
```
DB_URL
DB_USERNAME
DB_PASSWORD
HOSTING_SERVICE
```
where `HOSTING_SERVICE` can be `aws` or `heroku`. If `HOSTING_SERVICE=heroku` `DB` variables need not be specified, however, if `HOSTING_SERVICE=aws` they do (the database must be a Postgres instance).

## REST API

There's REST API which can be used to access server functionality. Postman collection describing the API can be viewed [here](https://documenter.getpostman.com/view/4351524/S1LsYq1S).

## Technologies and Frameworks Used

- Express.js
- [JWT](https://jwt.io/)
- [Sequelize ORM](https://sequelize.readthedocs.io/en/v3/)
- Docker

## Main Challenges
- Authentication: at first I wanted to use Passport.js but quickly I understood that it obscures a lot of details that have to do with how authentication works which I wanted to understand. Therefore, I'm not using any authentication helper libraries.
- Configuring CORS.
- Working with JWT.

## Integrations
Database integration with AWS and Heroku are provided (just put in your credentials).
More database integrations can be added in db/db.js.


## Miscellaneous
- Currently bulk lookups are limited to 20 mobile applications per lookup. There will be about 5 seconds pause between lookups. The reason for this is that I suspect that the ip making thousands of requests at once to one of mobile applications stores can get blocked. You can increase the bulk lookup limitation by changing the value of `APPS_IN_LOOKUP_BATCH` in `constants.js`.
- The ability to retrieve information on mobile applications depends on the HTML structure of https://itunes.apple.com/app and https://play.google.com. Therefore if the structure changes there may be issues with the server results. You can open a GitHub issue if you notice such problems and I will try to resolve them.
