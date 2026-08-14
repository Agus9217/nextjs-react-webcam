'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import Webcam from 'react-webcam';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(
    null,
  );
  const webcamRef = useRef<Webcam>(null);

  const handleUserMediaError = (
    error: string | DOMException,
  ) => {
    if (error instanceof DOMException) {
      setErrorMsg(`${error.name}: ${error.message}`);
    } else {
      setErrorMsg(String(error));
    }
  };

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) setImageSrc(screenshot);
  };

  return (
    <div className="flex">
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md font-bold w-full max-w-md">
          Error de cámara: {errorMsg}
        </div>
      )}
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
