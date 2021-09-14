## TerraformMain
#This repository is used to store Terraform files.
In Terraform, we have modules such as:
- `network`. In this module, we create a VPC for our project, where we create a resource for balancing HTTP(S) load, resource for managing private access to the VPC, and subnet for the cluster.
- `sql`. Here we create a GCSQL with a private IP address and users for it.
- `cluster`. Here we create a Kubernetes cluster where our application will run.
- `init`. This module is used to create an initialization image for application, which has a script that will create a database with tables and information.
- `kuber`. Here we create kubernetes secrets where information about the database is stored (IP address of the database, username and password of the user, as well as the name of the database).
- `helm`. This module is used to launch the first version of the application in kubernetes. The module receives the version of the chart from private GitHub via a token. The name of the environment is taken from the name of the workspace.

This Terraform project is optimized for using workspaces.


The `app` folder contains the initialization version of the application.


Sensitive variables are stored locally in the `secrets.tfvars` file.
```javascript
gh_token         = "value"
db_root_password = "value"  
db_user          = "value"
db_user_password = "value"
```
To create infrastructure for a specific environment, you need to:
1. Initialize the working directory containing the Terraform files and run the backend.
  ```css
  terraform init
  ```
2. Create a workspace.
  ```css
  terraform workspace new "env_name"
  ```
3. Create an execution plan with sensitive variables specified via `-var-file` and make sure that the infrastructure being created is correct.
  ```css
  terraform plan -var-file secrets.tfvars
  ```
4. Create infrastructure.
  ```css
  terraform apply -var-file secrets.tfvars
  ```
