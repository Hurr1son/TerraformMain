# TerraformMain
Variables such as: "gh_token", "db_root_password", "db_user", "db_user_password" come from secrets.tfvars which is stored locally. 
When running "terraform plan" or "terraform apply" is specified via -var-file secrets.tfvars.
