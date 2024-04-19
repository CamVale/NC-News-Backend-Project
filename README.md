# Northcoders News API

[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB)](https://expressjs.com)

A news API that serves topics, articles, comments and users. It has full functionality meaning users can GET, POST, PATCH and DELETE from this API. Produced as part of a project on RESTful APIs. This project uses Express.js and Postgres databases. 

## Try it! 🚀  (The API will take a few minutes to spin up after inactivity)

[HERE](https://be-portfolio-project.onrender.com/api)

There are some GET endpoints you can try here:
-  /api
-  /api/topics
-  /api/articles/:article_id
-  /api/articles/:article_id/comments
-  /api/articles (you can add a topic query like "?topic=football")


## Setup

To run the development server: 

This project requires Node.js and NPM to run!


### 1. Clone the repo and install the dependencies
```sh
  git clone https://github.com/CamVale/NC-News-Backend-Project
  cd nc-news-backend-project/
```

  ```sh
    npm install
  ```

  This command installs the dependencies needed for running the project, and the devDependencies for testing and seeding the test database.

### 2. Environment variables
Create two dotenv files `.env.test` and `.env.development` in the root directory as follows:

Two 'dotenv' files must be created in the root directory: `.env.test` and `.env.development`

Inside these files we need:

# inside .env.development:
```sh
  PGDATABASE=nc_news
```
# inside .env.test:
```sh
  PGDATABASE=nc_news_test
```

### 3. Create and seed the databases

```sh
  npm run setup-dbs
  npm run seed
```

### 4. Test the setup:

The tests will re-seed the test database each time, with jest you can run the full test suite:

```sh
  npm test
```
or you can just test the endpoints in the app:
```
  npm test app
```

### 5. Run the server locally (on port 9090 by default)
```sh
  npm run dev
```
The API is now ready to use! Using a client (browser, Postman, Insomnia, etc.) make a GET request to `http://localhost:9090/api`.


<br/>


