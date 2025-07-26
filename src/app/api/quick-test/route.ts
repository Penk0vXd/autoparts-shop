// TODO: DELETE THIS FILE AFTER LIVE VERIFICATION
// Quick test endpoint to verify production requests table + Discord webhook

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with service role (god mode)
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

// POST only - all other methods return 404
export async function POST(request: NextRequest) {
  try {
    // Create dummy test record for requests table
    const testData = {
      name: 'TEST REQUEST',
      phone: '0000000000',
      email: 'test@example.com',
      brand: 'TEST',
      model: 'TEST',
      year: '0000',
      engine: 'TEST',
      part_text: 'Тестова заявка – моля игнорирайте',
      image_path: null
    };

    // Insert into production requests table
    const { data: insertData, error: insertError } = await supabaseServiceRole
      .from('requests')
      .insert(testData)
      .select()
      .single();

    if (insertError) {
      console.error('Test insert error:', insertError);
      return NextResponse.json({
        ok: false,
        error: `Database error: ${insertError.message}`
      }, { status: 500 });
    }

    // Send Discord webhook notification
    await sendTestDiscordNotification(insertData.id);

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Quick test API error:', error);
    return NextResponse.json({
      ok: false,
      error: 'Server error during test'
    }, { status: 500 });
  }
}

// Send test Discord notification
async function sendTestDiscordNotification(requestId: string) {
  if (!process.env.DISCORD_WEBHOOK_URL) {
    console.warn('Discord webhook URL not configured');
    return;
  }

  const embed = {
    title: '🧪 Тестова заявка изпратена',
    color: 3066993, // Green color
    fields: [
      {
        name: '✅ Запис в requests',
        value: 'OK',
        inline: true
      },
      {
        name: '🆔 Request ID',
        value: requestId.substring(0, 8),
        inline: true
      },
      {
        name: '🕒 Timestamp',
        value: new Date().toISOString(),
        inline: false
      }
    ],
    timestamp: new Date().toISOString()
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
      console.error('Discord webhook failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Discord webhook error:', error);
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

// Purpose: Quick test to verify production requests table write + Discord webhook
// Usage: POST /api/quick-test - inserts dummy record and sends Discord notification
// Cleanup: Delete this file after live verification is complete 