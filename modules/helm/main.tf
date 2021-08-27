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
  name       =  "rental"
  repository =  var.chart_path
  chart = "rental"
#  set {
#    name = "container.tag"
#    value = "${terraform.workspace}"
#  }
}