output "cluster_name"{
    value = google_container_cluster.test.name
}
output "client_certificate"{
    value = google_container_cluster.test.master_auth.0.client_certificate
}
output "client_key"{
    value = google_container_cluster.test.master_auth.0.client_key
}
output "cluster_ca_certificate"{
    value = google_container_cluster.test.master_auth.0.cluster_ca_certificate
}
output "public_endpoint"{
    value = google_container_cluster.test.endpoint
}