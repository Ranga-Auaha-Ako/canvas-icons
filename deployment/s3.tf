# S3 Bucket for storing Elastic Beanstalk task definitions
resource "aws_s3_bucket" "beanstalk_deploys" {
  bucket = "${var.app_name}-${terraform.workspace == "default" ? "staging" : terraform.workspace}-deployments"
}

output "beanstalk_deploys_bucket" {
  value = aws_s3_bucket.beanstalk_deploys.bucket
}
