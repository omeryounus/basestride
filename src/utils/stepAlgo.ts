/**
 * Simple Peak Detection Algorithm for Step Counting
 * 
 * Analyzes the magnitude of the accelerometer vector.
 * A step is counted if the magnitude crosses a threshold and a minimum time has passed since the last step.
 */

export interface MotionData {
  x: number;
  y: number;
  z: number;
}

const THRESHOLD = 10.5; // m/s^2 (adjust based on sensitivity needs, gravity is ~9.8)
const MIN_STEP_DELAY = 300; // ms between steps (approx 200 possible steps per minute max)

export class StepDetector {
  private lastStepTime: number = 0;
  private lastMagnitude: number = 0;

  constructor() {}

  public process(data: MotionData): boolean {
    const magnitude = Math.sqrt(data.x * data.x + data.y * data.y + data.z * data.z);
    
    let isStep = false;
    const now = Date.now();

    // Peak detection logic
    // If magnitude exceeds threshold and we haven't counted a step recently
    // And verify it's a peak (current < last is hard to do without buffer, 
    // so we just check if it crosses threshold and was previously lower? 
    // Or just simple threshold crossing for now).
    // Better: Check if we cross threshold upwards.
    
    if (magnitude > THRESHOLD && this.lastMagnitude <= THRESHOLD) {
      if (now - this.lastStepTime > MIN_STEP_DELAY) {
        isStep = true;
        this.lastStepTime = now;
      }
    }

    this.lastMagnitude = magnitude;
    return isStep;
  }
}
