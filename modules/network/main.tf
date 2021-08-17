resource "google_compute_network" "network" {
  name                    = var.network_name
  project                 = var.project_id
  auto_create_subnetworks = "false"
}

resource "google_compute_global_address" "private_ip_address" {
  name          = var.global_name
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.network.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.network.self_link
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}
resource "google_compute_subnetwork" "subnet" {
  name          = var.subnetwork_name
  region        = var.region
  network       = google_compute_network.network.name
  ip_cidr_range = "10.10.0.0/24" 
  depends_on    = [google_compute_network.network]
}

output "network_id"{
  value = google_compute_network.network.id 
}
output "network_name"{
    value = google_compute_network.network.name 
}
output "subnetwork_name" {
    value = google_compute_subnetwork.subnet.name
}