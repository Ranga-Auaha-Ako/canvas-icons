variable "asset_host" {
  type    = string
  default = "https://assets.canvasicons.auckland.ac.nz"
}

variable "asset_host_staging" {
  type    = string
  default = "https://assets.canvasicons.auckland.ac.nz"
}

variable "aws_region" {
  description = "What AWS region to build to?"
  type        = string
  default     = "ap-southeast-2"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "canvasicons"
}

output "region" {
  value = var.aws_region
}

output "version" {
  value = local.app_version
}

output "app_name" {
  value = var.app_name
}

locals {
  app_data    = jsondecode(file("${path.module}/../package.json"))
  app_version = local.app_data.version
}
