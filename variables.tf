variable "frontend_container_count" {
    description = "Number of frontend containers to run"
    type        = number
    default     = 2
}

variable "backend_container_count" {
    description = "Number of backend containers to run"
    type        = number
    default     = 2
}
