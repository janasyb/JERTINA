variable "environment" {
  description = "Environment name."
  type        = string
}

output "environment_name" {
  value = var.environment
}
