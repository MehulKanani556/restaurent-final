import React, { forwardRef, useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';

const PDF417Barcode = ({ data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid: 'pdf417',       // Barcode type
        text: data,           // Text to encode
        scale: 2,             // Scaling factor (adjust to make barcode smaller/larger)
        height: 8,            // Height of barcode
        width: 3,             // Adjust the width to make the code look more compact
        includetext: false,   // Set to false if you don't want the text under the barcode
        textxalign: 'center', // Align text to center (if includetext is true)
        rows: 30,             // Number of rows (adjust to compress vertically)
        columns: 10           // Number of columns (adjust to compress horizontally)
      });
    } catch (e) {
      console.error(e);
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: 'auto' , padding:'10px '}} // Apply 100% width, auto height
    />
  );
};

export default PDF417Barcode;
