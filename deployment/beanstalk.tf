resource "aws_elastic_beanstalk_environment" "tfenvtest" {
  name                   = "canvas-icons"
  application            = aws_elastic_beanstalk_application.app.name
  solution_stack_name    = "64bit Amazon Linux 2 v3.4.16 running Docker"
  wait_for_ready_timeout = "10m"

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = "vpc-04a3b19a64f18c9e0"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = "subnet-06c65863acf3349c5"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "AssociatePublicIpAddress"
    value     = "True"
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.small"
  }

  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
  }

  #   setting {
  #     namespace = "aws:autoscaling:launchconfiguration"
  #     name      = "IamInstanceProfile"
  #     value     = "arn:aws:iam::809789462832:instance-profile/aws-elasticbeanstalk-ec2-role"
  #   }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = "aws-elasticbeanstalk-ec2-role"
  }
}

resource "aws_elastic_beanstalk_application" "app" {
  name        = "canvas-icons"
  description = "Canvas Icons app"

  appversion_lifecycle {
    service_role          = "arn:aws:iam::809789462832:role/aws-elasticbeanstalk-service-role"
    max_count             = 4
    delete_source_from_s3 = true
  }

}
