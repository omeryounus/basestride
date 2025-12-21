"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { StepDetector, MotionData } from '../utils/stepAlgo';

export const usePedometer = () => {
    const [steps, setSteps] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const detectorRef = useRef<StepDetector>(new StepDetector());

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        if (!event.accelerationIncludingGravity) return;

        const { x, y, z } = event.accelerationIncludingGravity;

        // Some devices return null
        if (x === null || y === null || z === null) return;

        const data: MotionData = { x, y, z };
        const isStep = detectorRef.current.process(data);

        if (isStep) {
            setSteps(prev => prev + 1);
        }
    }, []);

    const startTracking = useCallback(() => {
        window.addEventListener('devicemotion', handleMotion);
        setIsTracking(true);
    }, [handleMotion]);

    const stopTracking = useCallback(() => {
        window.removeEventListener('devicemotion', handleMotion);
        setIsTracking(false);
    }, [handleMotion]);

    const resetSteps = useCallback(() => {
        setSteps(0);
    }, []);

    const requestPermission = useCallback(async () => {
        if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const response = await (DeviceMotionEvent as any).requestPermission();
                if (response === 'granted') {
                    setPermissionGranted(true);
                    startTracking();
                } else {
                    setPermissionGranted(false);
                    setError("Permission denied");
                }
            } catch (e: unknown) {
                console.error(e);
                if (e instanceof Error) {
                    setError(e.message);
                } else {
                    setError("Error requesting permission");
                }
            }
        } else {
            // Non-iOS 13+ devices typically allow it by default or via browser prompt
            setPermissionGranted(true);
            startTracking();
        }
    }, [startTracking]);

    useEffect(() => {
        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [handleMotion]);

    return {
        steps,
        isTracking,
        permissionGranted,
        error,
        requestPermission,
        startTracking,
        stopTracking,
        resetSteps
    };
};
