# Inventory Manager

This is a full stack web application to track and manage inventory. The application uses Node JS, Fastify, PostgreSQL, and Prisma for the backend, and Next JS, Material UI, and Tailwind CSS for the frontend. Additionally Typescript is used on both the front and backend. The website can be viewed at [product-inventory-manager.netlify.app](https://product-inventory-manager.netlify.app). 

> Note the initial load of the website might be a little slow since Heroku puts the server to sleep after 30 minutes of inactivity.

## Getting Started

1. Install [Node JS](https://nodejs.org/en/download/), [PostgresSQL](https://www.postgresql.org/download/), and [Yarn](https://classic.yarnpkg.com/en/docs/install#windows-stable) 
2. Executes the SQL queries in `app/server/database/schema.sql` inside of a new PostgreSQL database
3. Create a `.env` file in `apps/server` with the contents `DATABASE_URL=<URL>` where `<URL>` is a URL to the Postgres database with user credentials
4. Run: 
```
> git clone https://github.com/alexander-azizi-martin/inventory-manager.git
> cd inventory-manager
> yarn install
> yarn build
> yarn start
```
