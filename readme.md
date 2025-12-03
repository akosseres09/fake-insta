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

### Step 1.1: Running the containers in development mode

You do not need to run any installation commands, these are handled by the
entrypoint shell scripts. Use these commands inside the `docker` directory.

When you first start the project, you should use

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

### Step 1.2: Running the containers in production mode

There is also a "production ready" state for Dockerfiles. The preferred way of
running the application in production mode is by using terraform, but docker
compose can be used as well.

### 1.2.1 Using Terraform

If you do not have terraform installed, you can add this line to your
`~/.bashrc` file (if you have docker installed):

```
alias terraform='docker run -it --rm -v "$PWD":/workspace -v /var/run/docker.sock:/var/run/docker.sock -w /workspace hashicorp/terraform:light'
```

Then you can use these commands to start and stop the application:

-   `terraform apply`. This runs `terraform plan` as well, so one could see the
    infrastructure that will be created.
-   `terraform destroy`. This will stop the application and remove all docker
    images and containers.

### 1.2.2 Using docker compose

To start the app using docker compose run:

    docker compose -f compose.prod.yaml up -d [--build]

If you have already used these containers, you can just use

    docker compose restart

When the containers are built, the apps are available:

-   **Frontend** at `localhost`
-   **Backend** at `localhost/api`
-   **Jenkins** at `localhost/jenkins`
