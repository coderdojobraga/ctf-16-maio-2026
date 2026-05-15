import piexif from 'piexifjs';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imagePath = path.join(process.cwd(), 'public', 'images', 'FotoSecretaFinal.png');
const outputPath = path.join(process.cwd(), 'public', 'images', 'FotoSecretaFinal.jpg');

async function addMetadata() {
  try {
    console.log('📸 Adicionando metadados à imagem...');

    // Converter PNG para JPG (para suportar EXIF)
    await sharp(imagePath)
      .jpeg({ quality: 95 })
      .toFile(outputPath);

    console.log('✅ PNG convertido para JPG');

    // Ler o ficheiro JPG
    const jpgData = fs.readFileSync(outputPath);
    const jpgBase64 = jpgData.toString('base64');

    // Dados EXIF a adicionar
    const exifDict = {
      '0th': {
        [piexif.ImageIFD.Make]: 'CoderDojo',
        [piexif.ImageIFD.Model]: 'Coder Camp 2026',
        [piexif.ImageIFD.Software]: 'CTF Event Camera',
        [piexif.ImageIFD.DateTime]: '2026:05:16 14:30:00',
      },
      'Exif': {
        [piexif.ExifIFD.FocalLength]: [35, 1],
        [piexif.ExifIFD.FNumber]: [28, 10],
        [piexif.ExifIFD.ExposureTime]: [1, 100],
      },
      'GPS': {
        [piexif.GPSIFD.GPSVersionID]: [2, 3, 0, 0],
        [piexif.GPSIFD.GPSLatitude]: [[38, 1], [43, 1], [2, 1]],
        [piexif.GPSIFD.GPSLatitudeRef]: b'N',
        [piexif.GPSIFD.GPSLongitude]: [[9, 1], [8, 1], [22, 1]],
        [piexif.GPSIFD.GPSLongitudeRef]: b'W',
        [piexif.GPSIFD.GPSAltitude]: [27, 1],
        [piexif.GPSIFD.GPSAltitudeRef]: 0,
        [piexif.GPSIFD.GPSDateStamp]: b'2026:05:16',
      },
    };

    // Serializar EXIF
    const exifBytes = piexif.dump(exifDict);
    const newData = piexif.insert(exifBytes, jpgBase64);

    // Escrever ficheiro com metadados
    fs.writeFileSync(outputPath, Buffer.from(newData, 'base64'));

    console.log('✅ Metadados EXIF adicionados com sucesso!');
    console.log('📍 GPS: 38°43\'2"N, 9°8\'22"W (Braga)');
    console.log('📅 Data: 2026-05-16 14:30:00');
    console.log('🎥 Câmara: CoderDojo Coder Camp 2026');
  } catch (error) {
    console.error('❌ Erro ao adicionar metadados:', error);
    process.exit(1);
  }
}

addMetadata();
