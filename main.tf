locals {
  env = terraform.workspace
}

provider "google" {
  region = var.region
  project = var.project_id
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "google_container_registry" "registry" {
  project  = var.project_id
  location = "EU"
}

module "bucket" {
  count = var.bucket_count[local.env]
  source = "./modules/bucket"
  project_id = var.project_id
  region = var.region
  bucket_name = "${var.bucket_name}-${terraform.workspace}"
}

module "network" {
  source = "./modules/network/"
  region = var.region
  project_id = var.project_id
  network_name = "${var.project_name}-vpc-${terraform.workspace}"
  global_name = "${var.network_global_address_name}-${terraform.workspace}"
  subnetwork_name = "${var.project_name}-sub-${terraform.workspace}"
}
  
module "sql" {
  source = "./modules/sql"
  region = var.region
  db_instance_name = "${var.project_name}-db-${random_id.suffix.hex}-${terraform.workspace}"
  db_tier = var.db_tier
  private_network = module.network.network_id
  db_root_password = var.db_root_password
  db_user = var.db_user
  db_user_password = var.db_user_password
  depends_on = [module.network]
}

module "cluster" {
  source = "./modules/cluster/"
  region = var.region
  project_id = var.project_id
  cluster_name = "${var.project_name}-cluster-${terraform.workspace}"
  cluster_nodepool_name = "${var.project_name}-nodepool-${terraform.workspace}"
  network = module.network.network_name
  subnetwork = module.network.subnetwork_name
  machine_type = var.node_machine_type[local.env]
  autoscaling = var.autoscaling[local.env]
  depends_on = [module.sql, module.network]
}

module "init" {
  source = "./modules/init" 
  project_id = var.project_id
  image_name = var.image_name
  tag = var.tag 
  depends_on = [
    google_container_registry.registry
  ]
}

module "kubernetes" {
  source = "./modules/kuber" 
  endpoint = module.cluster.public_endpoint
  cluster_ca_certificate = base64decode(module.cluster.cluster_ca_certificate)
  secret_name = var.kubernetes_secret_name
  db_host = module.sql.db_private_ip_address
  db_user = var.db_user
  db_user_password = var.db_user_password
  db_name = var.db_name
}
module "helm" {
  source = "./modules/helm"
  endpoint = module.cluster.public_endpoint
  cluster_ca_certificate = base64decode(module.cluster.cluster_ca_certificate)
  helm_name = var.project_name
  chart_path = "https://${var.gh_token}@raw.githubusercontent.com/${var.repo_path}"
}
#provider "kubernetes" {
#  host = "https://${module.cluster.public_endpoint}" 
#    token                  = data.template_file.access_token.rendered
#    cluster_ca_certificate = base64decode(module.cluster.cluster_ca_certificate)
#}

#resource "kubernetes_secret" "db_data" {
#  metadata {
#    name = "db-secrets"
#  }

#  data = {
#    db_host = "${module.sql.db_private_ip_address}"
#    db_user = "${var.db_user}"
#    db_pass = "${var.db_user_password}"
#    db_name = "${var.db_name}"
#  }
#}

#provider "helm"{
#  kubernetes{
#    host = "https://${module.cluster.public_endpoint}" 
#    token                  = data.template_file.access_token.rendered
#    cluster_ca_certificate = base64decode(module.cluster.cluster_ca_certificate)
#  }
#}
#resource "helm_release" "rental"{
#  name       =  "${module.cluster.cluster_name}"
#  chart      = "./rentalchart"
#  depends_on = [kubernetes_secret.db_data]
#}
#resource "null_resource" "kuber-secrets"{
#  provisioner "local-exec"{
#   command = "gcloud auth activate-service-account --key-file=${var.GOOGLE_APPLICATION_CREDENTIALS}| gcloud container clusters get-credentials ${module.cluster.cluster_name} --zone=${var.region}   | kubectl create secret generic db-secrets --from-literal=db_name=rentaldb --from-literal=db_user=${var.db_user} --from-literal=db_pass=${var.db_user_password} --from-literal=db_host=${module.sql.db_private_ip_address}"
#  }
#  depends_on = [ module.network, module.sql, module.cluster, null_resource.docker]
#}
#resource "null_resource" "kuber" {
#  provisioner "local-exec" {
#    command = "gcloud container clusters get-credentials ${module.cluster.cluster_name} --zone=${var.region}  |kubectl apply -f ./rental-service.yml "
#    }
#  depends_on = [module.cluster, module.sql, module.network, null_resource.docker, null_resource.kuber-secrets]
#}