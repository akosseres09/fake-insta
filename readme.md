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

### Step 1.2: Running the containers in production mode using terraform

There is also a "production ready" state for Dockerfiles. The preferred way of
running the application in production mode is by using terraform.

If you do not have terraform installed, you can add this line to your
`~/.bashrc` file (if you have docker installed):

```
alias terraform='docker run -it --rm -v "$PWD":/workspace -v /var/run/docker.sock:/var/run/docker.sock -w /workspace hashicorp/terraform:light'
```

Then you can use these commands to start and stop the application from the root
of the project (you should have docker installed):

-   `chmod +x volumes.sh`. This way the volumes.sh is runnable
-   `./volumes.sh [--remove]`. This creates the desired named docker volumes.
    Add --remove to remove these volumes
-   `terraform init`. This initializes terraform
-   `terraform apply`. This runs `terraform plan` as well, so one could see the
    infrastructure that will be created. Type `yes` to create infrastructure.
-   `terraform destroy`. This will stop the application and remove all docker
    images and containers. Type `yes` to destroy infrastructure

After using `terraform apply` the infrastructure is being set up. This should
take some time. After this the pages should be available:

-   **Frontend** at [`http://localhost`](http://localhost)
-   **Backend** at [`http://localhost/api`](http://localhost/api/health)
-   **Jenkins** at [`http://localhost/jenkins`](http://localhost/jenkins)
-   **Zabbix** at [`http://localhost/zabbix`](http://localhost/zabbix)
-   **Graylog** at [`http://localhost/graylog`](http://localhost/graylog)

## Technologies Used

-   **Nginx** - Reverse Proxy, serves frontend
-   **Iptables** - Proxy, Frontend and Backend firewall configuration
-   **Jenkins** - CI/CD (Pipeline)
-   **Zabbix** - System Monitoring
-   **Graylog** - Collect logs from Proxy, Frontend and Backend
-   **Terraform** - Managing "production" infrastructure
-   **Git & Docker**
