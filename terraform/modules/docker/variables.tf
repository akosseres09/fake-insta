variable "frontend_container_count" {
    description = "Number of frontend containers to run"
    type        = number
    default     = 2
}

variable "frontend_container_name" {
    description = "Name of the frontend container"
    type        = string
    default     = "fake-insta-prod-frontend"
}

variable "backend_container_name" {
    description = "Name of the backend container"
    type        = string
    default     = "fake-insta-prod-backend"
}

variable "backend_container_count" {
    description = "Number of backend containers to run"
    type        = number
    default     = 2
}

variable "project_root" {
    description = "Root directory of the project"
    type        = string
    default     = "/home/seresa/projects/fake-insta"
}

variable "container_index_offset" {
    description = "Offset for container index numbering"
    type        = number
    default     = 3
}

variable "network_name" {
    description = "Name of the Docker network"
    type        = string
    default     = "fake-insta-prod-terraform-default"
}