terraform {
    required_providers {
        docker = {
            source = "kreuzwerker/docker"
            version = "~> 3.0.0"
        }
    }
}

module "fake-insta-prod" {
    source = "./terraform/modules/docker"

    frontend_container_count = var.frontend_container_count
    backend_container_count  = var.backend_container_count
}
