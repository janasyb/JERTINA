variable "project_name" {
  description = "Project identifier."
  type        = string
  default     = "jertina"
}

variable "environment" {
  description = "Deployment environment."
  type        = string
}

variable "region" {
  description = "Deployment region."
  type        = string
  default     = "global"
}
