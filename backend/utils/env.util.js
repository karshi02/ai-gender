const path = require('path');
const fs = require('fs');

function updateEnvFile(key, value) {
    const envPath = path.join(__dirname, '../.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    const lines = envContent.split(/\r?\n/);
    let keyFound = false;
    
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(`${key}=`)) {
            lines[i] = `${key}=${value}`;
            keyFound = true;
            break;
        }
    }
    
    if (!keyFound) {
        lines.push(`${key}=${value}`);
    }
    
    fs.writeFileSync(envPath, lines.join('\n'), 'utf8');
    console.log(`✅ Updated ${key} in .env file`);
    process.env[key] = value;
}

module.exports = { updateEnvFile };