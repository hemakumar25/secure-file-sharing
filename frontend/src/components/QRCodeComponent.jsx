import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { FiDownload } from 'react-icons/fi';

const QRCodeComponent = ({ fileId, downloadLink }) => {
  const qrRef = useRef(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');

    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');

    link.href = url;
    link.download = `qrcode-${fileId}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        ref={qrRef}
        className="p-4 bg-white rounded-lg border border-gray-200 shadow-md"
      >
        <QRCodeCanvas
          value={downloadLink}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      <button
        onClick={downloadQR}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        <FiDownload size={18} />
        Download QR
      </button>
    </div>
  );
};

export default QRCodeComponent;
