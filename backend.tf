terraform {
  required_version = "= 1.0.6"
  backend "gcs" {
    bucket = "rental_tfbackend"
    prefix = "terraform/state/"
  }
}