# Amazon Bedrock Chat Lambda Function

This Lambda function integrates with Amazon Bedrock to provide AI chat capabilities.

## Deployment Instructions (Windows)

1. Install dependencies:
   ```
   npm install
   ```

2. Create zip file using PowerShell:
   ```
   powershell -Command "Compress-Archive -Path * -DestinationPath bedrock-chat.zip -Force"
   ```
   
   Or run the included deployment script:
   ```
   .\deploy.ps1
   ```

3. Deploy to AWS Lambda using AWS CLI:
   ```
   aws lambda create-function --function-name bedrock-chat --runtime nodejs18.x --handler index.handler --zip-file fileb://bedrock-chat.zip --role arn:aws:iam::<ACCOUNT_ID>:role/lambda-bedrock-role
   ```

4. Create an API Gateway REST API and integrate it with this Lambda function.

5. Update the API URL in the Angular service (`src/app/services/bedrock.service.ts`).

## Required IAM Permissions

The Lambda function needs the following permissions:
- `bedrock:InvokeModel`

Example IAM policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "bedrock:InvokeModel",
      "Resource": "*"
    }
  ]
}
```