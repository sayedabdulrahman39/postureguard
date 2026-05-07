// cv/slouch-detector.js

// SLOUCH DETECTION CORE LOGIC

const SLOUCH_THRESHOLD_RATIO = 0.85;   // Trigger if distance drops below 85% of baseline
const SLOUCH_DEBOUNCE_MS = 5000;        // Must slouch for 5s continuously before blur
const CALIBRATION_SAMPLES = 30;         // Frames averaged for baseline

let baseline = null;
let slouchStartTime = null;
let calibrationBuffer = [];

// Landmark indices (MediaPipe Pose)
const NOSE = 0;
const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;

function getVerticalDistance(landmarks) {
  const noseY = landmarks[NOSE].y;
  const leftShoulderY = landmarks[LEFT_SHOULDER].y;
  const rightShoulderY = landmarks[RIGHT_SHOULDER].y;

  // Y_shoulders = (Y_11 + Y_12) / 2
  const shoulderY = (leftShoulderY + rightShoulderY) / 2;

  // Distance = |Y_shoulders - Y_nose|
  return Math.abs(shoulderY - noseY);
}

// Call during calibration phase (user sits straight for ~3s)
function calibrate(landmarks) {
  const distance = getVerticalDistance(landmarks);
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
  // AUTO-CALIBRATE if no baseline exists
  if (!baseline) {
    const calResult = calibrate(landmarks);
    if (calResult.calibrated) {
       return { state: "CALIBRATING_DONE" };
    }
    return { state: "CALIBRATING" };
  }

  const currentDistance = getVerticalDistance(landmarks);
  
  // If the distance is smaller than a certain percentage of the baseline, the user is slouching
  const ratio = currentDistance / baseline;
  const isSlouching = ratio < SLOUCH_THRESHOLD_RATIO;

  if (isSlouching) {
    if (!slouchStartTime) slouchStartTime = Date.now();
    const slouchDuration = Date.now() - slouchStartTime;

    if (slouchDuration >= SLOUCH_DEBOUNCE_MS) {
      return { state: "BLUR", ratio, slouchDurationMs: slouchDuration, currentDistance, baseline };
    }
    return { state: "WARNING", ratio, slouchDurationMs: slouchDuration, currentDistance, baseline };
  } else {
    slouchStartTime = null;
    return { state: "GOOD", ratio, currentDistance, baseline };
  }
}

function resetCalibration() {
  baseline = null;
  calibrationBuffer = [];
  slouchStartTime = null;
}

export { calibrate, analyzePosture, resetCalibration };
