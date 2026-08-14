'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(
    null,
  );
  const webcamRef = useRef<Webcam>(null);

  const handleUserMediaError = (
    error: string | DOMException,
  ) => {
    if (error instanceof DOMException) {
      console.error(
        'ERROR cámara:',
        error.name,
        error.message,
      );
    } else {
      console.error('ERROR cámara:', error);
    }
  };

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) setImageSrc(screenshot);
  };

  return (
    <div className="flex">
      <div>
        <Webcam
          audio={false}
          height={360}
          width={720}
          ref={webcamRef}
          onUserMedia={(stream) =>
            console.log('OK, stream:', stream)
          }
          onUserMediaError={handleUserMediaError}
        />

        <button onClick={capture}>Capture photo</button>
      </div>
      {imageSrc && (
        <Image
          width={300}
          height={300}
          src={imageSrc}
          alt="Capture"
        />
      )}
    </div>
  );
}
