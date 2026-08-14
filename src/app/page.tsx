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

  // Nuevo estado para controlar cuándo montar react-webcam
  const [isCameraActive, setIsCameraActive] =
    useState(false);

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

  // Función que engaña a iOS pidiendo permiso de forma síncrona y nativa
  const handleActivarCamara = async () => {
    try {
      setErrorMsg(null);
      // 1. Pedimos permiso de forma nativa e inmediata en el click
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
        });

      // 2. Apagamos ese stream instantáneamente (ya tenemos el permiso)
      stream.getTracks().forEach((track) => track.stop());

      // 3. Ahora sí, dejamos que React monte react-webcam
      setIsCameraActive(true);
    } catch (error) {
      if (
        error instanceof Error ||
        error instanceof DOMException
      ) {
        setErrorMsg(
          `Permiso denegado: ${error.name} - ${error.message}`,
        );
      } else {
        setErrorMsg(String(error));
      }
    }
  };

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) setImageSrc(screenshot);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {errorMsg && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md font-bold w-full max-w-md text-center">
          Error de cámara: {errorMsg}
        </div>
      )}

      {/* Renderizado condicional: Mostramos el botón nativo o la cámara */}
      {!isCameraActive ? (
        <button
          onClick={handleActivarCamara}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
        >
          Activar Cámara
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Webcam
            audio={false}
            height={360}
            width={720}
            ref={webcamRef}
            playsInline={true} // VITAL: Evita que iOS abra el video a pantalla completa
            videoConstraints={{ facingMode: 'user' }} // Fuerzo la cámara frontal
            onUserMedia={(stream) =>
              console.log('OK, stream:', stream)
            }
            onUserMediaError={handleUserMediaError}
            className="rounded-lg bg-black"
          />

          <button
            onClick={capture}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Capture photo
          </button>
        </div>
      )}

      {imageSrc && (
        <Image
          width={300}
          height={300}
          src={imageSrc}
          alt="Capture"
          className="mt-4 border-4 border-gray-200 rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}
