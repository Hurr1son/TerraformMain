resource "null_resource" "docker" {
  provisioner "local-exec" {
    command = "gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin eu.gcr.io | docker build -t eu.gcr.io/${var.project_id}/${var.image_name}:${var.tag} ./app | docker push eu.gcr.io/${var.project_id}/${var.image_name}:${var.tag}"
  }
}