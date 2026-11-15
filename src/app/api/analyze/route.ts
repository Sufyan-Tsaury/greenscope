import { NextRequest, NextResponse } from 'next/server';
import { analyzeEnvironmentalImage } from '@/lib/gemini';
import { EcosystemType } from '@/types';

// Batas waktu eksekusi Serverless Function Vercel (30 detik) untuk inferensi multimodal Gemini
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Image, mimeType, ecosystem, locationName } = body;

    if (!base64Image) {
      return NextResponse.json(
        { error: 'Gambar tidak boleh kosong' },
        { status: 400 }
      );
    }

    const analysis = await analyzeEnvironmentalImage(
      base64Image,
      mimeType || 'image/jpeg',
      ecosystem ? (ecosystem as EcosystemType) : undefined,
      locationName || 'Bengkulu'
    );

    return NextResponse.json({ success: true, analysis });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Gagal memproses analisis gambar';
    console.error('API /api/analyze error:', errorMessage);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
