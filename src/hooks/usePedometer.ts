"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { StepDetector, MotionData } from '../utils/stepAlgo';

export const usePedometer = () => {
    const [steps, setSteps] = useState(0);
    const [isTracking, setIsTracking] = useState(false);
    const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const detectorRef = useRef<StepDetector>(new StepDetector());

    // Persist steps to localStorage to prevent loss on refresh
    useEffect(() => {
        const savedSteps = localStorage.getItem('basestride_temp_steps');
        if (savedSteps && !isTracking) {
            setSteps(parseInt(savedSteps));
        }
    }, []);

    useEffect(() => {
        if (isTracking) {
            localStorage.setItem('basestride_temp_steps', steps.toString());
        }
    }, [steps, isTracking]);

    // Handle Page Visibility to "resume" or "keep alive"
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.log("App in background - maintaining state");
            } else {
                console.log("App in foreground - checking state");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    const handleMotion = useCallback((event: DeviceMotionEvent) => {
        if (!event.accelerationIncludingGravity) return;

        const { x, y, z } = event.accelerationIncludingGravity;

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
        localStorage.removeItem('basestride_temp_steps');
    }, [handleMotion]);

    const resetSteps = useCallback(() => {
        setSteps(0);
        localStorage.removeItem('basestride_temp_steps');
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
