terraform {
    required_providers {
        docker = {
            source = "kreuzwerker/docker"
            version = "~> 3.0.0"
        }
    }
}

resource "docker_network" "fake_insta_network" {
    name = "fake-insta-prod-terraform-default"
}

module "fake-insta-prod" {
    source = "./terraform/modules/docker"

    frontend_container_count = var.frontend_container_count
    backend_container_count  = var.backend_container_count

    depends_on = [ docker_network.fake_insta_network ]
}

module "graylog" {
    source = "./terraform/modules/graylog"

    graylog_password_secret    = var.graylog_password_secret
    graylog_root_password_sha2 = var.graylog_root_password_sha2

    depends_on = [ docker_network.fake_insta_network ]
}


module "zabbix" {
    source = "./terraform/modules/zabbix"

    mysql_root_password   = var.mysql_root_password
    zabbix_mysql_password = var.zabbix_mysql_password

    depends_on = [ docker_network.fake_insta_network ]
}
