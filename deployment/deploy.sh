#!/bin/sh
workspace=$(terraform workspace show)

if [ $# -eq 0 ]
  then
    terraform refresh
  else
    terraform refresh -var-file=$1
fi

ecr_name=$(terraform output --raw ecr_name)
region=$(terraform output --raw region)
account_id=$(terraform output --raw account_id)
version=$(terraform output --raw version)
app_name=$(terraform output --raw app_name)
beanstalk_deploys_bucket=$(terraform output --raw beanstalk_deploys_bucket)
beanstalk_env_name=$(terraform output --raw beanstalk_env_name)
beanstalk_app_name=$(terraform output --raw beanstalk_app_name)
ZIP=$version.zip

build_dir="$(dirname "$0")/build"
root_dir="$(dirname "$0")/../"
script_dir="$(dirname "$0")"


aws ecr get-login-password --region $region | docker login --username AWS --password-stdin $account_id.dkr.ecr.$region.amazonaws.com
# docker build -t $ecr_name ../ --platform linux/amd64
docker build -t $ecr_name ../ --platform linux/arm64
docker tag $ecr_name $account_id.dkr.ecr.$region.amazonaws.com/$ecr_name:$version
docker push $account_id.dkr.ecr.$region.amazonaws.com/$ecr_name:$version

# Process Dockerrun json:
echo "Deleting and Creating build directory/zip"
rm -r $build_dir
mkdir $build_dir
cp $script_dir/Dockerrun.aws.json.tpl $build_dir/Dockerrun.aws.json
# Replace the <ACCOUNT_ID> with your ID
sed -i="" "s/<ACCOUNT_ID>/$account_id/" $build_dir/Dockerrun.aws.json
# Replace the <NAME> with the your name
sed -i="" "s/<NAME>/$app_name/" $build_dir/Dockerrun.aws.json
# Replace the <REGION> with the selected region
sed -i="" "s/<REGION>/$region/" $build_dir/Dockerrun.aws.json
# Replace the <VERSION> with the your version number
sed -i="" "s/<VERSION>/$version/" $build_dir/Dockerrun.aws.json

# Zip up the Dockerrun file
(cd $build_dir; zip -r $ZIP Dockerrun.aws.json)

# Send zip to S3 Bucket
aws s3 cp "$build_dir/$ZIP" s3://$beanstalk_deploys_bucket/$ZIP

# Create a new application version with the zipped up Dockerrun file
aws elasticbeanstalk create-application-version --application-name $beanstalk_app_name --version-label $version --source-bundle S3Bucket=$beanstalk_deploys_bucket,S3Key=$ZIP

# Update the environment to use the new application version
aws elasticbeanstalk update-environment --environment-name $beanstalk_env_name --version-label $version
