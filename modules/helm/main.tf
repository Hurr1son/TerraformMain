resource "helm_release" "rental"{
  name       =  "rental"
  repository =  var.chart_path
  chart      = "rental"
  verify     = false
  set {
    name     = "env"
    value    = "${terraform.workspace}"
  }
}