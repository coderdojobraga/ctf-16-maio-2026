import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('file');

  if (!filename) {
    return NextResponse.json({ error: 'Missing file parameter' }, { status: 400 });
  }

  // Sanitize filename to prevent directory traversal
  const sanitized = path.basename(filename);
  const filepath = path.join(process.cwd(), 'public', 'images', sanitized);

  try {
    const fileBuffer = fs.readFileSync(filepath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="${sanitized}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
