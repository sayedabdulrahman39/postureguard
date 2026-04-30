// cv/slouch-detector.js

// SLOUCH DETECTION CORE LOGIC

const SLOUCH_THRESHOLD_RATIO = 0.80;   // Trigger if distance < 80% of baseline
const SLOUCH_DEBOUNCE_MS = 2000;        // Must slouch for 2s continuously before blur
const CALIBRATION_SAMPLES = 30;         // Frames averaged for baseline

let baseline = null;
let slouchStartTime = null;
let calibrationBuffer = [];

// Landmark indices (MediaPipe Pose)
const NOSE = 0;
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;

function getLandmarkDistance(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

function getNoseToShoulderMidpointDistance(landmarks) {
  const nose = landmarks[NOSE];
  const leftShoulder = landmarks[LEFT_SHOULDER];
  const rightShoulder = landmarks[RIGHT_SHOULDER];

  const shoulderMidpoint = {
    x: (leftShoulder.x + rightShoulder.x) / 2,
    y: (leftShoulder.y + rightShoulder.y) / 2,
  };

  return getLandmarkDistance(nose, shoulderMidpoint);
}

// Call during calibration phase (user sits straight for ~3s)
function calibrate(landmarks) {
  const distance = getNoseToShoulderMidpointDistance(landmarks);
  calibrationBuffer.push(distance);

  if (calibrationBuffer.length >= CALIBRATION_SAMPLES) {
    baseline = calibrationBuffer.reduce((a, b) => a + b) / calibrationBuffer.length;
    calibrationBuffer = [];
    return { calibrated: true, baseline };
  }
  return { calibrated: false, progress: calibrationBuffer.length / CALIBRATION_SAMPLES };
}

// Call on every MediaPipe Pose frame result
function analyzePosture(landmarks) {
  if (!baseline) return { state: "UNCALIBRATED" };

  const currentDistance = getNoseToShoulderMidpointDistance(landmarks);
  const ratio = currentDistance / baseline;
  const isSlouching = ratio < SLOUCH_THRESHOLD_RATIO;

  if (isSlouching) {
    if (!slouchStartTime) slouchStartTime = Date.now();
    const slouchDuration = Date.now() - slouchStartTime;

    if (slouchDuration >= SLOUCH_DEBOUNCE_MS) {
      return { state: "BLUR", ratio, slouchDurationMs: slouchDuration };
    }
    return { state: "WARNING", ratio, slouchDurationMs: slouchDuration };
  } else {
    slouchStartTime = null;
    return { state: "GOOD", ratio };
  }
}

function resetCalibration() {
  baseline = null;
  calibrationBuffer = [];
  slouchStartTime = null;
}

export { calibrate, analyzePosture, resetCalibration };
