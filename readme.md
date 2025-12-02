# Fake Instagram web application

This web application is a project for the courses of _Development of Software
Systems_ and _Basics of Cloud and DevOps_ at **University of Szeged**.

## Starting the application

### Step 0: Initialize

In the `backend` directory:

-   Run `cp .env.example .env`
-   fill out the information inside `.env`

This is needed for the backend to run correctly. <br> This project uses a local
Jenkins container to test the pipelines. If you want to use this, you should:

-   create an empty `jenkins_home` directory in the root of the project

### Step 1: Running the containers

You do not need to run any installation commands, these are handled by the
entrypoint shell scripts. When you first start the project, you should use

    docker compose up -d [--build]

(-d for detached mode, --build for rebuilding, _**optional**_) in the root
directory of the project. <br> <br> If you previously used this application, use

    `docker compose restart`

and the containers will be restarted.

When the containers are built, the apps are available:

-   **Frontend** at `localhost:4200`
-   **Backend** at `localhost:3000`
-   **Jenkins** at `localhost:8080`

Be sure to wait a little as the frontend waits for the backend to be built and
the frontend angular environment has to get started.
