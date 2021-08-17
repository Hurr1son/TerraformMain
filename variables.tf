variable "project_id" {
  default ="terraform-319316"
}
variable "project_name" {
  default = "rental-service" 
}
variable "region" {
 default = "europe-west3"  
} 

variable "bucket_name" {
  default = "rental_bucket_backend"
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
}
variable "db_user" {
}
variable "db_user_password" {
}
#______________________________________________


#Node variables______________________

variable "node_machine_type"{
  default = "e2-micro"
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
variable "chart_path" {
  default = "./rentalchart"
}
#________________________________________________

