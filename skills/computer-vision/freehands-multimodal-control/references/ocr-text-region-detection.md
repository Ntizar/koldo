# OCR Text Region Detection for Gaze Typing

## Overview

OCR-free text region detection for gaze typing in FreeHands. Uses OpenCV contour analysis to detect text-like regions on screen without requiring Tesseract or any external OCR engine.

## Implementation

### Module: `src/freehands/ocr/text_region_detector.py`

**Pipeline:**
1. Capture screen via `mss` (fast, no GUI dependency), fallback to `pyautogui.screenshot()`
2. Convert to grayscale
3. Apply `cv2.adaptiveThreshold` with `ADAPTIVE_THRESH_MEAN_C` + `THRESH_BINARY_INV`
4. Morphological operations (dilate + erode) to connect broken text characters
5. `cv2.findContours` with `RETR_EXTERNAL`
6. Filter by size (MIN_TEXT_REGION_W=30, MIN_TEXT_REGION_H=12), aspect ratio (<20), pixel density (>0.15)
7. Group nearby contours into text blocks (merge within 20px gap)
8. Sort by confidence (density*0.6 + size_factor*0.4)

### Key Constants

```python
MIN_TEXT_REGION_W = 30
MIN_TEXT_REGION_H = 12
MAX_TEXT_REGION_W = 2000
MAX_TEXT_REGION_H = 500
MIN_DENSITY = 0.15
MAX_ASPECT_RATIO = 20.0
CAPTURE_COOLDOWN = 1.0  # seconds
```

### Dependencies

- `mss` — fast screen capture
- `Pillow` — fallback screenshot
- `opencv-python` — contour analysis
- `numpy` — array operations

### Throttling

Screen capture is throttled to 1Hz via `CAPTURE_COOLDOWN` to avoid excessive CPU usage. The `TextRegionDetector` caches results and returns them for 1 second after last capture.

## Usage in FreeHands

The widget `GazeTextSelectorWidget` in `src/freehands/ui/gaze_text_selector.py` wraps the detector:
- Auto-scans every 2 seconds
- Highlights detected regions with blue borders
- Dwell selection (1200ms default) to select a region
- Blink-to-select alternative
- Voice commands: "gaze typing", "escribir", "escribir texto" to open; "cerrar escritura" to close
- Gesture: open palm held 2 seconds

## Limitations

- No actual text recognition — only detects regions that LOOK like text blocks
- Works best with high-contrast text (dark on light)
- May detect buttons, icons, or UI elements as text regions
- Not suitable for reading actual text content — only for identifying WHERE to type

## Tests

18 unit tests in `tests/test_ocr_text_region_detector.py` covering:
- TextRegion dataclass (centre, rect, contains_point)
- Detection (empty screen, dark screen, text-like regions)
- Filtering (size, density, confidence ranking)
- Region merging (adjacent regions)
- Grayscale support
- Scan cooldown/throttling