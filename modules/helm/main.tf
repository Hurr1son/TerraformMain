resource "helm_release" "rental"{
  name       =  "rental"
  repository =  var.chart_path
  chart = "rental"
  set {
    name = "container.env"
    value = "${terraform.workspace}"
  }
}