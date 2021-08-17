data "google_client_config" "client" {}

data "template_file" "access_token" {
  template = data.google_client_config.client.access_token
}

provider "kubernetes" {
  host = "https://${var.endpoint}" 
    token                  = data.google_client_config.client.access_token
    cluster_ca_certificate = var.cluster_ca_certificate
}

resource "kubernetes_secret" "db_data" {
  metadata {
    name = var.secret_name
  }

  data = {
    db_host = "${var.db_host}"
    db_user = "${var.db_user}"
    db_pass = "${var.db_user_password}"
    db_name = "${var.db_name}"
  }
}