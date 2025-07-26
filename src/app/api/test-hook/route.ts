// TODO: DELETE AFTER PROD VERIFICATION
// Temporary API route to test end-to-end integration

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role (bypass RLS)
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// POST only - return 404 for other methods
export async function POST(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString();
    
    // 1. Create test object
    const testData = {
      type: 'test',
      initiator: 'manual-button',
      timestamp
    };

    // 2. Insert into Supabase
    const { data: insertData, error: insertError } = await supabaseServiceRole
      .from('test_requests')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      console.error('Test DB insert error:', insertError);
      return NextResponse.json(
        { error: 'Database insert failed' },
        { status: 500 }
      );
    }

    // 3. Send Discord webhook
    await sendTestDiscordWebhook(timestamp);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Test hook error:', error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
}

// Send test Discord notification
async function sendTestDiscordWebhook(timestamp: string) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured');
    return;
  }

  const embed = {
    title: '🧪 Тестово съобщение',
    color: 3447003, // Blue color
    fields: [
      {
        name: '👉 Database',
        value: 'Table write OK',
        inline: true
      },
      {
        name: '🕒 Timestamp',
        value: new Date(timestamp).toLocaleString('bg-BG'),
        inline: true
      }
    ],
    timestamp
  };

  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [embed]
      })
    });

    if (!response.ok) {
      console.error('Discord test webhook failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Discord test webhook error:', error);
  }
}

// Return 404 for all other HTTP methods
export async function GET() {
  return new NextResponse(null, { status: 404 });
}

export async function PUT() {
  return new NextResponse(null, { status: 404 });
}

export async function DELETE() {
  return new NextResponse(null, { status: 404 });
}

export async function PATCH() {
  return new NextResponse(null, { status: 404 });
}

// Purpose: Test Supabase DB writes + Discord webhook integration
// Security: Service-role key for DB, webhook URL from env
// Cleanup: Remove this entire file after production verification 