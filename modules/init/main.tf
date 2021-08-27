resource "null_resource" "docker" {
  provisioner "local-exec" {
    command = "docker build -t eu.gcr.io/${var.project_id}/${var.image_name}-test:${var.tag} ./app | gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin eu.gcr.io | docker push eu.gcr.io/${var.project_id}/${var.image_name}-test:${var.tag}"
  }
}