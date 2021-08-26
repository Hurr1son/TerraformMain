terraform {
  backend "gcs" {
    bucket = "rental_backend"
    prefix = "terraform/state/"
  }
}