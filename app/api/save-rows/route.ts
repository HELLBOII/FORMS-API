import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface FormRow {
  name: string;
  amount: number;
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { rows }: { rows: FormRow[] } = await request.json();

    if (!Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Delete all existing rows
    const { error: deleteError } = await supabase.from('form_rows').delete().neq('name', '');
    if (deleteError) {
      throw deleteError;
    }

    // Insert new rows if any
    if (rows.length > 0) {
      const { error: insertError } = await supabase.from('form_rows').insert(rows);
      if (insertError) {
        throw insertError;
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Database operation failed' },
      { status: 500 }
    );
  }
}