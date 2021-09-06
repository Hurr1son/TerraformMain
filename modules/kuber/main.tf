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