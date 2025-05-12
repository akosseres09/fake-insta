# Fake Instagram web application

This web application is a project for the course _Development of Software Systems_ at **University of Szeged**.

## Starting the application

When you first start the project, you should use `docker compose up -d [--build]` (-d for detached mode, --build for rebuilding, _**optional**_) in the root directory of the project. <br>
<br>
If you previously used this application, use `docker compose restart` and the containers will be restarted.
<br>
<br>
When the containers are built, the **frontend** should be available at `localhost:4200` and the **backend** at ``. Be sure to wait a little as the frontend waits for the backend to be built and the frontend angular environment has to get started.
