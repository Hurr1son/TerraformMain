resource "google_storage_bucket" "rental_bucket" {
  project       = var.project_id
  name          = var.bucket_name
  location      = var.region
  force_destroy = true
  storage_class = "standard"
  versioning {
    enabled = true
  }
}