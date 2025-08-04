#!/bin/bash

# Fetch environment variables
S3_KEY="$S3_KEY"
FOLDER_NAME="$FOLDER_NAME"
AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID"
AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY"
AWS_DEFAULT_REGION="$AWS_DEFAULT_REGION"

echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
echo "AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION"

# Configure AWS CLI with credentials
aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
aws configure set region $AWS_DEFAULT_REGION


# Check if AWS credentials are now available
if ! aws sts get-caller-identity &>/dev/null; then
  echo "AWS credentials not working."
  exit 1
fi

# Create working directory
mkdir -p /app/output/$FOLDER_NAME

# Download video from S3
aws s3 cp s3://videotubes.input.video/$S3_KEY /app/input.mp4

# Transcode video to HLS format
ffmpeg -i /app/input.mp4 \
  -vf "scale=-2:1080" -c:v h264 -b:v 5000k -hls_time 10 -hls_segment_filename "/app/output/$FOLDER_NAME/segment%03d_1080p.ts" -hls_playlist_type vod "/app/output/$FOLDER_NAME/index_1080p.m3u8" \
  -vf "scale=-2:720" -c:v h264 -b:v 2500k -hls_time 10 -hls_segment_filename "/app/output/$FOLDER_NAME/segment%03d_720p.ts" -hls_playlist_type vod "/app/output/$FOLDER_NAME/index_720p.m3u8" \
  -vf "scale=-2:480" -c:v h264 -b:v 1000k -hls_time 10 -hls_segment_filename "/app/output/$FOLDER_NAME/segment%03d_480p.ts" -hls_playlist_type vod "/app/output/$FOLDER_NAME/index_480p.m3u8"

# Upload output to S3
aws s3 cp /app/output/$FOLDER_NAME s3://videotubes.output.video/$FOLDER_NAME --recursive

# Delete the original video file from S3
aws s3 rm s3://videotubes.input.video/$S3_KEY

# Cleanup
rm -rf /app/output /app/input.mp4
