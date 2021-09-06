resource "null_resource" "docker_build" {
  provisioner "local-exec" {
    command = "docker build -t eu.gcr.io/${var.project_id}/${var.image_name}-${terraform.workspace}:${var.tag} ./app"
  }
}
resource "null_resource" "docker_push" {
  provisioner "local-exec" {
    command = "gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin eu.gcr.io | docker push eu.gcr.io/${var.project_id}/${var.image_name}-${terraform.workspace}:${var.tag}"
  }
  depends_on = [null_resource.docker_build]
}