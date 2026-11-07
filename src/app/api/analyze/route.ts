import { NextRequest, NextResponse } from 'next/server';
import { analyzeEnvironmentalImage } from '@/lib/gemini';
import { EcosystemType } from '@/types';

export const maxDuration = 30; // 30 detik untuk analisis AI multimodal

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
      (ecosystem as EcosystemType) || 'pesisir_pantai',
      locationName || 'Wilayah Pesisir Bengkulu'
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
