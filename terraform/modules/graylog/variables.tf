# modules/graylog/variables.tf
variable "network_name" {
  description = "Docker network name"
  type        = string
  default     = "fake-insta-prod-terraform-default"
}

variable "graylog_password_secret" {
  description = "Secret key for password encryption"
  type        = string
}

variable "graylog_root_password_sha2" {
  description = "SHA256 hash of the root password"
  type        = string
}

variable "datanode_image" {
  description = "Graylog datanode image"
  type        = string
  default     = "graylog/graylog-datanode:6.0"
}

variable "graylog_image" {
  description = "Graylog server image"
  type        = string
  default     = "graylog/graylog:6.0"
}

variable "graylog_mongodb_volume_name" {
    description = "Name of the Docker volume for Graylog MongoDB data"
    type        = string
    default     = "mongodb_data" 
}

variable "graylog_datanode_volume_name" {
    description = "Name of the Docker volume for Graylog Datanode data"
    type        = string
    default     = "graylog_datanode"
}

variable "graylog_data_volume_name" {
    description = "Name of the Docker volume for Graylog data"
    type        = string
    default     = "graylog_data"
}

variable "graylog_journal_volume_name" {
    description = "Name of the Docker volume for Graylog journal data"
    type        = string
    default     = "graylog_journal"
  
}