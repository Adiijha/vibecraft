import React, { useState } from 'react';
import { generateImageFromSketch } from '@/lib/sketch-to-image';

interface ImageGeneratorProps {
  sketch: File | null;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ sketch }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleGenerate = async () => {
    if (!sketch) return;
    setIsLoading(true);
    try {
      // Convert File to data URL
      const reader = new FileReader();
      reader.onload = async (event) => {
        const sketchDataUrl = event.target?.result as string;
        const result = await generateImageFromSketch(sketchDataUrl, prompt);
        const base64String = arrayBufferToBase64(result);
        setGeneratedImage(`data:image/png;base64,${base64String}`);
      };
      reader.readAsDataURL(sketch);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt"
      />
      <button onClick={handleGenerate} disabled={!sketch || isLoading}>
        Generate Image
      </button>
      {isLoading && <p>Generating image...</p>}
      {generatedImage && <img src={generatedImage} alt="Generated" />}
    </div>
  );
};

export default ImageGenerator;
