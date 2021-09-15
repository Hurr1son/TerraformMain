locals {
  env = terraform.workspace
}

provider "google" {
  region  = var.region
  project = var.project_id
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "google_container_registry" "registry" {
  project  = var.project_id
  location = "EU"
}

module "network" {
  source          = "./modules/network/"
  region          = var.region
  project_id      = var.project_id
  network_name    = "${var.project_name}-vpc-${terraform.workspace}"
  global_name     = "${var.network_global_address_name}-${terraform.workspace}"
  subnetwork_name = "${var.project_name}-sub-${terraform.workspace}"
}

module "sql" {
  source           = "./modules/sql"
  region           = var.region
  db_instance_name = "${var.project_name}-db-${random_id.suffix.hex}-${terraform.workspace}"
  db_tier          = var.db_tier
  private_network  = module.network.network_id
  db_root_password = var.db_root_password
  db_user          = var.db_user
  db_user_password = var.db_user_password
  depends_on       = [module.network]
}

module "cluster" {
  source                = "./modules/cluster/"
  region                = var.zone
  project_id            = var.project_id
  cluster_name          = "${var.project_name}-cluster-${terraform.workspace}"
  cluster_nodepool_name = "${var.project_name}-nodepool-${terraform.workspace}"
  network               = module.network.network_name
  subnetwork            = module.network.subnetwork_name
  machine_type          = var.node_machine_type[local.env]
  autoscaling           = var.autoscaling[local.env]
  depends_on            = [module.sql, module.network]
}

module "init" {
  source     = "./modules/init"
  project_id = var.project_id
  image_name = var.image_name
  tag        = var.tag
  depends_on = [
    google_container_registry.registry
  ]
}

data "google_client_config" "client" {}

data "template_file" "access_token" {
  template = data.google_client_config.client.access_token
}

provider "kubernetes" {
  host                   = "https://${module.cluster.public_endpoint}"
  token                  = data.google_client_config.client.access_token
  cluster_ca_certificate = base64decode(module.cluster.cluster_ca_certificate)
}

module "kubernetes" {
  source           = "./modules/kuber"
  secret_name      = var.kubernetes_secret_name
  db_host          = module.sql.db_private_ip_address
  db_user          = var.db_user
  db_user_password = var.db_user_password
  db_name          = var.db_name
  depends_on       = [module.cluster]
}
provider "helm" {
  kubernetes {
    host                   = "https://${module.cluster.public_endpoint}"
    token                  = data.template_file.access_token.rendered
    cluster_ca_certificate = base64decode(module.cluster.cluster_ca_certificate)
  }
}
module "helm" {
  source     = "./modules/helm"
  helm_name  = var.project_name
  chart_path = "https://${var.gh_token}@raw.githubusercontent.com/${var.repo_path}"
  depends_on = [module.kubernetes]
}