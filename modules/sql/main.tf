resource "google_sql_database_instance" "sql" {
  region = var.region
  database_version = "MYSQL_5_6"
  name   = var.db_instance_name

  #depends_on = [google_service_networking_connection.private_vpc_connection]

  settings {
    tier = var.db_tier
    ip_configuration {
      ipv4_enabled    = false
      private_network = var.private_network
    }
  }
}

resource "google_sql_user" "master" {
  name     = "root"
  host     = "%"
  password = var.db_root_password
  instance = google_sql_database_instance.sql.name
}

resource "google_sql_user" "sql_user" {
  name     = var.db_user
  host     = "%"
  password = var.db_user_password
  instance = google_sql_database_instance.sql.name
}
output "db_private_ip_address" {
  value       = google_sql_database_instance.sql.private_ip_address
}