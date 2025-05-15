# PowerShell script to deploy the Lambda function

# Step 1: Install dependencies
Write-Host "Installing dependencies..."
npm install

# Step 2: Create zip file
Write-Host "Creating zip file..."
Compress-Archive -Path * -DestinationPath bedrock-chat.zip -Force

# Step 3: Deploy to AWS Lambda
Write-Host "Deploying to AWS Lambda..."
# aws lambda create-function `
#   --function-name bedrock-chat `
#   --runtime nodejs18.x `
#   --handler index.handler `
#   --zip-file fileb://bedrock-chat.zip `
#   --role arn:aws:iam::182587667429:role/lambda-bedrock-role

# Or update existing function
aws lambda update-function-code `
  --function-name bedrock-chat `
  --zip-file fileb://bedrock-chat.zip

Write-Host "Deployment script completed!"