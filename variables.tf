variable "project_id" {
  default ="terraform-319316"
}
variable "project_name" {
  default = "rental" 
}
variable "region" {
 default = "europe-west3"  
} 

variable "bucket_name" {
  default = "rental_backend"
}
#Network_______________________________
variable "network_global_address_name" {
  default = "private-ip-address"
}
#______________________________________

#DB variables___________________________
variable "db_name" {
  type        = string
  default     = "rentaldb"
}

variable "db_region" {
  type        = string
  default     = "europe-west3"
}

variable "db_tier" {
  type        = string
  default     = "db-f1-micro"
}

variable "db_root_password" {
  type = string
  sensitive   = true
}
variable "db_user" {
  type = string
  sensitive   = true
}
variable "db_user_password" {
  type = string
  sensitive   = true
}
#______________________________________________

variable "bucket_count" {
  type = map(string)
  
  default = {
    prod = 0
    test = 0
  }
  
}

#ClusterNode variables______________________

variable "node_machine_type"{
  type = map(string) 
  default = {
    default = "e2-micro"
    prod = "e2-micro"
    test = "e2-micro" 
  } 
}
variable "autoscaling" {
  type = map
  default = {
    default = {
    min_node_count = 1
    max_node_count = 1
    }
    prod = {
    min_node_count = 1
    max_node_count = 1
    }
    test = {
    min_node_count = 1
    max_node_count = 1
    }
  }
}
#____________________________________


#Init module____________________________________
variable "image_name"{
  default = "rental"
}
variable "tag"{
  default = "init"
}
#________________________________________________


#kubernetes_____________________________
variable "kubernetes_secret_name" {
  default = "db-secrets"
}
variable "repo_path" {
  default = "Hurr1son/helm/main/"
}
variable "gh_token" {
  type = string
  sensitive   = true
}
#________________________________________________
