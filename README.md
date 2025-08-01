# IKG Player Snapshot Test

A video player application with snapshot functionality and real-time size information display.

## Features

### Video Snapshot
- Press **Spacebar** to take a snapshot of the current video frame
- Press **Spacebar** again to clear the snapshot and resume video playback
- Snapshot overlay displays the captured frame with a dark background

### Size Information Display
The application includes a real-time size information panel that shows:

- **Window Size**: Current browser window dimensions
- **Canvas Size**: Video container dimensions (updated in real-time)
- **Screen Size**: Physical screen resolution
- **Pixel Ratio**: Device pixel ratio (for high-DPI displays)
- **Aspect Ratio**: Window aspect ratio
- **Mouse Position**: Real-time mouse coordinates

#### Controls
- Click the **📏** button to show/hide the size information panel
- Click the **×** button in the panel header to hide it
- The panel automatically updates when you resize the browser window

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Running the Application
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## Browser Compatibility

This application is designed to work with modern browsers that support:
- WebRTC
- Canvas API
- ResizeObserver API
- CSS backdrop-filter

## Technical Details

The size information display uses:
- `ResizeObserver` for real-time canvas size tracking
- `window.addEventListener('resize')` for window size changes
- `window.addEventListener('mousemove')` for mouse position tracking
- CSS `backdrop-filter` for modern glassmorphism effects

## Usage Tips

1. **For Video Testing**: Use the spacebar to capture frames at specific moments
2. **For Size Debugging**: The size panel helps verify responsive design behavior
3. **For Development**: Monitor canvas size changes during video playback
4. **For Testing**: Check how the application behaves on different screen sizes and pixel ratios
