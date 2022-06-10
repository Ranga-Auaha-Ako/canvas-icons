#!/bin/bash
build_dir="$(dirname "$0")/build"
root_dir="$(dirname "$0")/../"
script_dir="$(dirname "$0")"

echo "Deleting and Creating build directory/zip"
rm -r $build_dir
rm "$script_dir/build.zip"
mkdir $build_dir

echo "Copying files to build directory"
cp -r $root_dir/{package.json,yarn.lock} $build_dir
cp -r "$root_dir/build" "$build_dir/build"
cp -r "$script_dir/Dockerfile.prod" "$build_dir/Dockerfile"

echo "Creating zip file"
cd $build_dir
zip -r ../build.zip .