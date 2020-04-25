# Just Music Live

Member of a 4 person development team building ,front end application that uses Spotify API’s to deliver an experience for user to listen to their favorite songs and chat with friends .

# Getting Started

These instructions will get you a copy of the project up and running on your local machine.

# Prerequisites

```
1. Node JS
2. React
3. Redux
4. Postgres
5. Sequelize
```

Optional the application has been containerized

use docker-compose and it will create three seperate containers.

### Server container

    - Depends on the db container and will wait till that is up.
    - Upon initial start up youl will need to run the following command to run the migrations.
        ```
        docker exec -t [container] npx sequelize-cli db:migrate
        ```

### Client Container

    - Links to the server container to proxy all requests to the proper address.

# Installing

1. Clone repository

```
npm install

```

2. cd into the backend file and run node index
3. cd into the frontend file and run npm start

# Built With

- Spotify API
- Styled Components
- Materialize
- Axios
- GraphQL

# Authors

- Joetta Hall - Library & Chatroom
- Juan Castillo - Homepage
- Antony Tsygankov - Queue , Search field , Styling
- Alexander Santos - Created the backend and the routes

# Currently Working on

- Changing how the project is deployed
- Library
