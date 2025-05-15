const AWS = require('aws-sdk');

// Initialize the Bedrock Runtime client
const bedrockRuntime = new AWS.BedrockRuntime();

// Sample dealer dataset
const dealersData = [
    {
        "OEM NAME": "OEM A",
        "BUNDLE TYPE": "Type 1",
        "Billing Price": 1000,
        "Manufacture Name": "Manufacturer A",
        "Country": "Country A",
        "Region": "Region A",
        "Contract Status": "Active",
        "Enrolled date": "2023-01-01",
        "Dealer name": "Dealer A",
        "Dealer Id": "D001",
        "Contact": "1234567890",
        "Zip Pin": "123456",
        "Dealer address": "Address A",
        "Account Id": "A001",
        "Case": "Case A",
        "Communications": "Email"
    },
    {
        "OEM NAME": "OEM B",
        "BUNDLE TYPE": "Type 2",
        "Billing Price": 2000,
        "Manufacture Name": "Manufacturer B",
        "Country": "Country B",
        "Region": "Region B",
        "Contract Status": "Inactive",
        "Enrolled date": "2023-02-01",
        "Dealer name": "Dealer B",
        "Dealer Id": "D002",
        "Contact": "0987654321",
        "Zip Pin": "654321",
        "Dealer address": "Address B",
        "Account Id": "A002",
        "Case": "Case B",
        "Communications": "Phone"
    },
    {
        "OEM NAME": "OEM C",
        "BUNDLE TYPE": "Type 1",
        "Billing Price": 1500,
        "Manufacture Name": "Manufacturer C",
        "Country": "Country C",
        "Region": "Region A",
        "Contract Status": "Active",
        "Enrolled date": "2023-03-15",
        "Dealer name": "Dealer C",
        "Dealer Id": "D003",
        "Contact": "5556667777",
        "Zip Pin": "789012",
        "Dealer address": "Address C",
        "Account Id": "A003",
        "Case": "Case C",
        "Communications": "Email"
    }
];

exports.handler = async (event) => {
    console.log('Event received:', JSON.stringify(event));
    
    try {
        // Parse the incoming request body
        let body;
        
        if (event.body) {
            // API Gateway sends the body as a string, possibly with HTML entities
            const bodyStr = event.body;
            // Replace HTML entities if present
            const decodedBody = bodyStr.replace(/"/g, '"');
            body = JSON.parse(decodedBody);
        } else if (event.messages) {
            // Direct invocation might have messages directly in the event
            body = event;
        } else {
            // Try to use the event directly
            body = event;
        }
        
        console.log('Parsed body:', JSON.stringify(body));
        
        const messages = body.messages || [];
        
        // Validate that messages exist
        if (!messages.length) {
            return {
                statusCode: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ error: 'No messages provided' })
            };
        }
        
        // Get the user's query from the last message
        const userQuery = messages[messages.length - 1].content;
        console.log('User query:', userQuery);
        
        // Create a system prompt with the dataset and instructions for handling spelling errors
        const systemPrompt = `You are an automotive dealer assistant. Answer questions based on this dealer dataset:
${JSON.stringify(dealersData, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Be tolerant of spelling mistakes and typos in user queries.
2. If you detect a misspelled word that might refer to something in the dataset, try to understand the user's intent.
3. For example, if they type "OEM B" as "OEM be" or "OME B", still provide information about OEM B.
4. If they misspell "Region" as "Regon" or "Rejion", understand they're asking about regions.
5. For dealer IDs, be flexible with format (D001, d001, D-001, etc.).
6. If multiple interpretations are possible, provide information for the most likely match.
7. Always acknowledge when you've corrected a spelling mistake in your response.
8. Format your responses with markdown for readability.
9. Provide detailed, thoughtful answers and analyze the data when appropriate.`;
        
        // Prepare the request for Bedrock
        const params = {
            modelId: 'anthropic.claude-v2', // Use Claude v2 model
            contentType: 'application/json',
            accept: 'application/json',
            body: JSON.stringify({
                anthropic_version: 'bedrock-2023-05-31',
                max_tokens: 1000,
                system: systemPrompt,
                messages: messages,
                temperature: 0.7 // Slightly higher temperature for more flexible responses
            })
        };
        
        // Call Bedrock
        const response = await bedrockRuntime.invokeModel(params).promise();
        
        // Parse the response
        const responseBody = JSON.parse(Buffer.from(response.body).toString());
        console.log('Bedrock response:', JSON.stringify(responseBody));
        
        // Return the response
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                message: {
                    role: 'assistant',
                    content: responseBody.content[0].text
                }
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'Internal server error',
                details: error.message,
                stack: error.stack
            })
        };
    }
};
