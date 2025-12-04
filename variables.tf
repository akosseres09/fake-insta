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

variable "graylog_password_secret" {
  description = "Graylog password secret"
  type        = string
  sensitive   = true
}

variable "graylog_root_password_sha2" {
  description = "Graylog root jelszó SHA-256 hash-e"
  type        = string
  sensitive   = true
}

variable "mysql_root_password" {
  description = "MySQL root jelszó"
  type        = string
  sensitive   = true
}

variable "zabbix_mysql_password" {
  description = "Zabbix MySQL felhasználó jelszava"
  type        = string
  sensitive   = true
}
