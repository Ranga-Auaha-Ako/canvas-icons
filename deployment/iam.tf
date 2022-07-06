# https://github.com/RafalWilinski/elastic-beanstalk-terraform-setup/blob/master/main.tf

# Beanstalk instance profile
resource "aws_iam_instance_profile" "beanstalk_ec2" {
  name = "${var.app_name}-${terraform.workspace == "default" ? "staging" : terraform.workspace}-beanstalk-ec2-user"
  role = aws_iam_role.beanstalk_ec2.name
}

resource "aws_iam_role" "beanstalk_ec2" {
  name = "${var.app_name}-${terraform.workspace == "default" ? "staging" : terraform.workspace}-beanstalk-ec2-role"
  assume_role_policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Action" = "sts:AssumeRole",
        "Principal" = {
          "Service" = "ec2.amazonaws.com"
        },
        "Effect" = "Allow",
        "Sid"    = ""
      }
    ]
  })
}



# Beanstalk EC2 Policy
# Overriding because by default Beanstalk does not have a permission to Read ECR
resource "aws_iam_role_policy" "beanstalk_ec2_policy" {
  name = "${var.app_name}_${terraform.workspace == "default" ? "staging" : terraform.workspace}_beanstalk_ec2_policy_with_ECR"
  role = aws_iam_role.beanstalk_ec2.id

  policy = jsonencode({
    "Version" = "2012-10-17",
    "Statement" = [
      {
        "Sid"      = "VisualEditor0",
        "Effect"   = "Allow",
        "Action"   = "ecr:GetAuthorizationToken",
        "Resource" = "*"
      },
      {
        "Sid"    = "VisualEditor1",
        "Effect" = "Allow",
        "Action" = [
          "s3:GetObject",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:DescribeImages",
          "ecr:DescribeRepositories",
          "s3:ListBucket",
          "ecr:ListImages",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetRepositoryPolicy"
        ],
        "Resource" = [
          aws_ecr_repository.ecr_repo.arn,
          "${aws_s3_bucket.beanstalk_deploys.arn}/*",
          "${aws_s3_bucket.beanstalk_deploys.arn}"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "test-attach" {
  role = aws_iam_role.beanstalk_ec2.name
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier",
    "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore",
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker",
    "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
  ])
  policy_arn = each.key
}
