
import http from 'http';
import fs from 'fs';

const postData = JSON.stringify({
    name: 'Test Agent',
    email: `agent-${Date.now()}@test.com`,
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
    }
};

console.log('Testing Registration endpoint...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log('BODY:', data);
        fs.writeFileSync('api-response.json', data);
        try {
            const json = JSON.parse(data);
            if (json.success) {
                console.log("SUCCESS: User registered.");
                process.exit(0);
            } else {
                console.error("FAILURE: API returned success=false");
                process.exit(1);
            }
        } catch (e) {
            console.error("FAILURE: Invalid JSON response");
            process.exit(1);
        }
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
    process.exit(1);
});

// Write data to request body
req.write(postData);
req.end();
