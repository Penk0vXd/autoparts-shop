// Test script for Discord webhook functionality
// Run with: node test-discord-webhook.js

const fetch = require('node-fetch');

async function testDiscordWebhook() {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.log('❌ DISCORD_WEBHOOK_URL not found in environment variables');
    console.log('Please set DISCORD_WEBHOOK_URL in your .env.local file');
    return;
  }

  console.log('🧪 Testing Discord webhook...');
  console.log('Webhook URL:', webhookUrl.substring(0, 50) + '...');

  const testPayload = {
    embeds: [{
      title: "🧪 Test Notification",
      color: 0x00FF00,
      description: "This is a test message from AutoParts Store",
      fields: [
        { name: "Test Field", value: "Test Value", inline: true },
        { name: "Environment", value: process.env.NODE_ENV || 'development', inline: true }
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "AutoParts Store - Test" }
    }],
    username: "AutoParts Test Bot"
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AutoParts-Store-Test/1.0'
      },
      body: JSON.stringify(testPayload)
    });

    if (response.ok) {
      console.log('✅ Discord webhook test successful!');
      console.log('Status:', response.status);
    } else {
      console.log('❌ Discord webhook test failed');
      console.log('Status:', response.status);
      const errorText = await response.text();
      console.log('Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Discord webhook test error:', error.message);
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testDiscordWebhook(); 