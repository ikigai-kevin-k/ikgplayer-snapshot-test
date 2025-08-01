import { useEffect, useCallback, type Ref, useState } from "react";

import "./App.css";
import useStream from "./useStream";

// Component to display window and canvas size information
function SizeDisplay() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [canvasSize, setCanvasSize] = useState({
    width: 0,
    height: 0,
  });
  const [isVisible, setIsVisible] = useState(true);
  const [devicePixelRatio, setDevicePixelRatio] = useState(window.devicePixelRatio);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setDevicePixelRatio(window.devicePixelRatio);
    };

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    // Get canvas size from video container
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
      const rect = videoContainer.getBoundingClientRect();
      setCanvasSize({
        width: rect.width,
        height: rect.height,
      });
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Update canvas size when video container changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCanvasSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (videoContainer) {
      resizeObserver.observe(videoContainer);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
    };
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button 
        className="size-toggle-button"
        onClick={toggleVisibility}
        title="Show size information"
      >
        📏
      </button>
    );
  }

  return (
    <div className="size-display">
      <div className="size-header">
        <span className="size-title">Size Info</span>
        <button 
          className="size-close-button"
          onClick={toggleVisibility}
          title="Hide size information"
        >
          ×
        </button>
      </div>
      <div className="size-info">
        <div className="size-item">
          <span className="size-label">Window:</span>
          <span className="size-value">{windowSize.width} × {windowSize.height}</span>
        </div>
        <div className="size-item">
          <span className="size-label">Canvas:</span>
          <span className="size-value">{Math.round(canvasSize.width)} × {Math.round(canvasSize.height)}</span>
        </div>
        <div className="size-item">
          <span className="size-label">Screen:</span>
          <span className="size-value">{window.screen.width} × {window.screen.height}</span>
        </div>
        <div className="size-item">
          <span className="size-label">Pixel Ratio:</span>
          <span className="size-value">{devicePixelRatio.toFixed(2)}x</span>
        </div>
        <div className="size-item">
          <span className="size-label">Aspect Ratio:</span>
          <span className="size-value">
            {(windowSize.width / windowSize.height).toFixed(2)}:1
          </span>
        </div>
        <div className="size-item">
          <span className="size-label">Mouse:</span>
          <span className="size-value">{mousePosition.x}, {mousePosition.y}</span>
        </div>
      </div>
    </div>
  );
}

function App() {
  const streamData = useStream();
  const { videoEl, setVideoEl, run, isPlaying } = streamData;
  const { snapshot, setSnapshot, stopVideoWithSnapshot } = streamData;

  useEffect(() => {
    if (!videoEl) return;
    if (isPlaying || (!isPlaying && snapshot)) return;

    console.log("Running stream with video element");
    run(videoEl).catch((error) => {
      console.error("Error in useStream:", error);
    });
  }, [isPlaying, run, snapshot, videoEl]);

  useEffect(() => {
    if (!isPlaying) return;
    console.log("Video is playing");
  }, [isPlaying]);

  useEffect(() => {
    if (snapshot) console.log(snapshot);
  }, [snapshot]);

  const handleSpaceKey = useCallback(async () => {
    if (snapshot) {
      // Clear snapshot
      setSnapshot("");
    } else {
      // Take snapshot and stop video
      await stopVideoWithSnapshot();
    }
  }, [snapshot, setSnapshot, stopVideoWithSnapshot]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && (isPlaying || snapshot)) {
        event.preventDefault(); // Prevent page scroll
        handleSpaceKey();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying, snapshot, handleSpaceKey]);

  return (
    <div className="app">
      <SizeDisplay />
      <div
        ref={setVideoEl as Ref<HTMLDivElement> | undefined}
        className="video-container"
      />

      {/* Snapshot Overlay */}
      {snapshot && (
        <div className="snapshot-overlay">
          <div className="snapshot-indicator">Displaying Snapshot Overlay</div>
          <img src={snapshot} alt="Video snapshot" className="snapshot-image" />
        </div>
      )}
    </div>
  );
}

export default App;
