# Amazon Bedrock Chatbot Integration

This project integrates Amazon Bedrock AI capabilities into an Angular application.

## Setup Instructions (Windows)

### 1. Deploy the Lambda Function

Navigate to the Lambda directory:
```
cd lambda\bedrock-chat
```

Run the deployment script:
```
.\deploy.ps1
```

Or manually:
```
npm install
powershell -Command "Compress-Archive -Path * -DestinationPath bedrock-chat.zip -Force"
```

Deploy to AWS Lambda:
```
aws lambda create-function --function-name bedrock-chat --runtime nodejs18.x --handler index.handler --zip-file fileb://bedrock-chat.zip --role arn:aws:iam::<ACCOUNT_ID>:role/lambda-bedrock-role
```

### 2. Create API Gateway

Create a REST API in API Gateway and integrate it with your Lambda function.

### 3. Update Environment Configuration

Update the API URL in `src/environments/environment.ts` and `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: false, // or true for prod
  apiUrl: 'https://your-api-gateway-url/stage'
};
```

### 4. Run the Application

Install dependencies:
```
npm install
```

Start the development server:
```
ng serve
```

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