variable "project_id" {
  default   = "terr-325411"
}
variable "project_name" {
  default   = "rental"
}
variable "region" {
  default   = "europe-west3"
}
variable "zone" {
  default   = "europe-west3-a"
}

#Network_______________________________
variable "network_global_address_name" {
  default   = "private-ip-address"
}
#______________________________________

#DB variables___________________________
variable "db_name" {
  type      = string
  default   = "rentaldb"
}

variable "db_region" {
  type      = string
  default   = "europe-west3"
}

variable "db_tier" {
  type      = string
  default   = "db-f1-micro"
}

variable "db_root_password" {
  type      = string
  sensitive = true
}
variable "db_user" {
  type      = string
  sensitive = true
}
variable "db_user_password" {
  type      = string
  sensitive = true
}
#______________________________________________

variable "bucket_count" {
  type      = map(string)

  default   = {
    prod    = 0
    dev     = 1
  }

}

#ClusterNode variables______________________

variable "node_machine_type" {
  type      = map(string)
  default   = {
    prod    = "e2-medium"
    dev     = "e2-small"
  }
}
variable "autoscaling" {
  type      = map(any)
  default   = {
    prod    = {
      min_node_count = 1
      max_node_count = 2
    }
    dev = {
      min_node_count = 1
      max_node_count = 1
    }
  }
}
#____________________________________


#Init module____________________________________
variable "image_name" {
  default   = "rental"
}
variable "tag" {
  default   = "init"
}
#________________________________________________


#kubernetes_____________________________
variable "kubernetes_secret_name" {
  default   = "db-secrets"
}
variable "repo_path" {
  default   = "Hurr1son/helm/main/"
}
variable "gh_token" {
  type      = string
  sensitive = true
}
#________________________________________________
