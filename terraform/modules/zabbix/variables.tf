# modules/zabbix/variables.tf
variable "network_name" {
  description = "Docker network name"
  type        = string
  default     = "fake-insta-prod-terraform-default"
}

variable "zabbix_mysql_password" {
  description = "Password for Zabbix MySQL user"
  type        = string
  default     = "zabbix_pwd"
}

variable "mysql_root_password" {
  description = "Root password for MySQL"
  type        = string
  default     = "root_pwd"
}

variable "zabbix_mysql_data_volume_name" {
    description = "Name of the Docker volume for Zabbix MySQL data"
    type        = string
    default     = "zabbix_mysql_data"
}