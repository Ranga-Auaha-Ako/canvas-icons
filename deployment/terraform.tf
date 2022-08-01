data "aws_s3_bucket" "tf_state" {
  bucket = "uoa-raa-terraform-state"
}

terraform {
  backend "s3" {
    bucket = "uoa-raa-terraform-state"
    key    = "canvas-icons"
    region = "ap-southeast-2"
  }
}

provider "aws" {
  region  = var.aws_region
  profile = "default"
}

data "aws_caller_identity" "current" {}

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}
