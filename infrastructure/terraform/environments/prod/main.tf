terraform {
  required_version = ">= 1.8.0"
}

module "environment" {
  source      = "../../modules/environment"
  environment = "prod"
}
