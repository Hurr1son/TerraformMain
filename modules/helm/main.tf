data "google_client_config" "client" {}

data "template_file" "access_token" {
  template = data.google_client_config.client.access_token
}

provider "helm"{
  kubernetes{
    host = "https://${var.endpoint}" 
    token                  = data.template_file.access_token.rendered
    cluster_ca_certificate = var.cluster_ca_certificate
  }
}
resource "helm_release" "rental"{
  name       =  var.helm_name
  chart      =  var.chart_path
}