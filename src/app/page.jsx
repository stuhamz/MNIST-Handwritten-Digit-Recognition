"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function MainComponent() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [upload] = useUpload();
  const [processedImage, setProcessedImage] = useState(null);
  const processedCanvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 280;
    canvas.height = 280;
    const context = canvas.getContext("2d");
    context.lineCap = "round";
    context.strokeStyle = "black";
    context.lineWidth = 20;
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    contextRef.current = context;

    const processedCanvas = processedCanvasRef.current;
    processedCanvas.width = 28;
    processedCanvas.height = 28;
  }, []);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };
  const clearCanvas = () => {
    contextRef.current.fillStyle = "white";
    contextRef.current.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    setPrediction(null);
    setError(null);
  };

  const predictDigit = async () => {
    try {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Check if canvas is empty
      let isEmpty = true;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
          isEmpty = false;
          break;
        }
      }

      if (isEmpty) {
        setError("Please draw a digit before predicting");
        return;
      }

      setLoading(true);
      setError(null);
      setPrediction(null);
      setConfidence(null);

      // Create processed preview
      const processedCanvas = processedCanvasRef.current;
      const processedContext = processedCanvas.getContext("2d");
      processedContext.fillStyle = "white";
      processedContext.fillRect(0, 0, 28, 28);
      processedContext.drawImage(canvas, 0, 0, 280, 280, 0, 0, 28, 28);
      setProcessedImage(processedCanvas.toDataURL());

      const base64Image = canvas.toDataURL("image/png");
      const { url } = await upload({ base64: base64Image });

      const response = await fetch("/api/predict-digit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: url }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the image");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setPrediction(data.prediction);
      setConfidence(data.confidence);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze the drawing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-8 font-inter">
          MNIST Handwritten Digit Recognition
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-inter">
            Instructions
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300 font-inter">
              Draw a single digit (0-9) following the MNIST dataset format:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 font-inter space-y-2">
              <li>Use thick black strokes (20px width)</li>
              <li>Draw in the center of the 280x280 canvas</li>
              <li>Keep it simple and clear (similar to examples below)</li>
              <li>Your drawing will be processed as a 28x28 pixel image</li>
            </ul>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-inter">
            Drawing Area
          </h2>
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-crosshair bg-white"
              style={{ touchAction: "none" }}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={clearCanvas}
            className="px-6 py-2 rounded-md border border-gray-200 text-gray-900 dark:text-white dark:border-gray-700 font-inter hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={predictDigit}
            disabled={loading}
            className="px-6 py-2 rounded-md bg-gray-900 text-white font-inter hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Predict"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="text-center">
              {error ? (
                <p className="text-red-500 dark:text-red-400 font-inter">
                  {error}
                </p>
              ) : prediction ? (
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white font-inter mb-2">
                    Predicted Digit: {prediction}
                  </p>
                  {confidence && (
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-inter">
                      Confidence: {confidence}%
                    </p>
                  )}
                </div>
              ) : loading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mb-2"></div>
                  <p className="text-gray-700 dark:text-gray-300 font-inter">
                    Analyzing your drawing...
                  </p>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 font-inter">
                  Draw a single digit (0-9) and click Predict
                </p>
              )}
            </div>
            {processedImage && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 font-inter">
                  28x28 Processed Image
                </h3>
                <div className="border-2 border-gray-200 dark:border-gray-700 p-2 rounded-lg">
                  <canvas
                    ref={processedCanvasRef}
                    className="w-28 h-28"
                    style={{ imageRendering: "pixelated" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 font-inter">
            MNIST Dataset Examples
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 font-inter">
            Reference samples from the original MNIST database:
          </p>
          <div className="grid grid-cols-5 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <div key={digit} className="flex flex-col items-center space-y-2">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 w-16 h-16 flex items-center justify-center">
                  <img
                    src={`/mnist-examples/${digit}.png`}
                    alt={`MNIST example of digit ${digit}`}
                    className="w-12 h-12"
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                  Digit {digit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;