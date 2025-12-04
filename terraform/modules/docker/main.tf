terraform {
    required_providers {
        docker = {
            source = "kreuzwerker/docker"
            version = "~> 3.0.0"
        }
    }
}


resource "docker_image" "frontend" {
    name = "fake-insta-prod-frontend:latest"
    keep_locally = true
    build {
        context = "${path.root}"
        dockerfile = "docker/frontend/prod/Dockerfile.frontend"
        tag = ["fake-insta-prod-frontend:latest"]
    }
}

resource "docker_image" "backend" {
    name = "fake-insta-prod-backend:latest"
    keep_locally = true
    build {
        context = "${path.root}"
        dockerfile = "docker/backend/prod/Dockerfile.backend"
        tag = ["fake-insta-prod-backend:latest"]
    }
}

resource "docker_image" "proxy" {
    name = "fake-insta-prod-proxy:latest"
    keep_locally = true
    build {
        context = "${path.root}"
        dockerfile = "docker/nginx/Dockerfile.proxy"
        tag = ["fake-insta-prod-proxy:latest"]
    }
}

resource "docker_image" "jenkins" {
    name = "fake-insta-prod-jenkins:latest"
    keep_locally = true
    build {
        context = "${path.root}/docker/jenkins"
        dockerfile = "Dockerfile.jenkins"
        tag = ["fake-insta-prod-jenkins:latest"]
    }
}

resource "docker_container" "backend" {
    count = var.backend_container_count
    name  = "${var.backend_container_name}-${count.index + 3}"
    hostname = "${var.backend_container_name}-${count.index + 3}"
    image = docker_image.backend.image_id
    
    env = [
        "NODE_ENV=production",
        "NODE_ENV=production"
    ]

    capabilities {
        add  = ["NET_ADMIN"]
    }
    
    networks_advanced {
        name = var.network_name
        aliases = ["backend-${count.index + 3}"]
    }
    
    restart = "unless-stopped"
    
    healthcheck {
        test         = ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
        start_period = "30s"
    }
}

resource "docker_container" "frontend" {
    count = var.frontend_container_count
    name  = "${var.frontend_container_name}-${count.index + var.container_index_offset}"
    hostname = "${var.frontend_container_name}-${count.index + var.container_index_offset}"
    image = docker_image.frontend.image_id
    
    capabilities {
        add  = ["NET_ADMIN"]
    }

    networks_advanced {
        name = var.network_name
        aliases = ["frontend-${count.index + var.container_index_offset}"]
    }
    
    restart = "unless-stopped"
    
    healthcheck {
        test         = ["CMD", "curl", "-f", "http://localhost"]
        start_period = "30s"
    }
    
    depends_on = [docker_container.backend]
}

resource "docker_container" "jenkins" {
    name  = "fake-insta-prod-jenkins"
    image = docker_image.jenkins.image_id
    
    env = [
        "JENKINS_OPTS=--prefix=/jenkins"
    ]
    
    networks_advanced {
        name = var.network_name
        aliases = ["jenkins"]
    }
    
    volumes {
        host_path      = "${var.project_root}/jenkins_home"
        container_path = "/var/jenkins_home"
    }
    
    volumes {
        host_path      = "/var/run/docker.sock"
        container_path = "/var/run/docker.sock"
    }
    
    restart = "unless-stopped"
    
    healthcheck {
        test         = ["CMD", "curl", "-f", "http://localhost:8080/jenkins"]
        start_period = "30s"
    }
}

resource "docker_container" "proxy" {
    name  = "fake-insta-prod-proxy"
    image = docker_image.proxy.image_id
    hostname = "proxy"
    
    ports {
        internal = 80
        external = 80
    }

    capabilities {
        add  = ["NET_ADMIN"]
    }
    
    networks_advanced {
        name = var.network_name
        aliases = ["proxy"]
    }
    
    upload {
        content = templatefile("${path.root}/docker/nginx/default-terraform.tftpl", {
            backend_count  = var.backend_container_count
            frontend_count = var.frontend_container_count
            index_offset   = var.container_index_offset
        })
        file    = "/etc/nginx/conf.d/default.conf"
    }
    
    restart = "unless-stopped"
    
    healthcheck {
        test         = ["CMD", "curl", "-f", "http://localhost"]
        start_period = "30s"
    }
    
    depends_on = [
        docker_container.frontend,
        docker_container.backend,
        docker_container.jenkins
    ]
}