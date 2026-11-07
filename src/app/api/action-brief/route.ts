import { NextRequest, NextResponse } from 'next/server';
import { generateActionBrief } from '@/lib/gemini';
import { EcosystemType } from '@/types';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, ecosystem, urgencyScore, locationName, targetVolunteers } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Judul laporan diperlukan' },
        { status: 400 }
      );
    }

    const brief = await generateActionBrief(
      title,
      (ecosystem as EcosystemType) || 'pesisir_pantai',
      urgencyScore || 80,
      locationName || 'Bengkulu',
      targetVolunteers || 30
    );

    return NextResponse.json({ success: true, brief });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Gagal menghasilkan Action Brief';
    console.error('API /api/action-brief error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
