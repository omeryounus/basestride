"use client";

import { useEffect, useState, useCallback } from 'react';

export const StepSimulator = () => {
    const [isAutoRun, setIsAutoRun] = useState(false);

    // Defined before usage to avoid hoisting error with arrow functions
    const triggerData = useCallback((acceleration: number) => {
        try {
            const event = new Event('devicemotion');
            // @ts-expect-error - device motion properties are read-only but we are mocking for test
            event.accelerationIncludingGravity = {
                x: 0,
                y: acceleration,
                z: 0
            };
            window.dispatchEvent(event);
        } catch (e) {
            console.error("Failed to dispatch simulation event", e);
        }
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isAutoRun) {
            interval = setInterval(() => {
                triggerData(15); // Strong step
                setTimeout(() => triggerData(2), 100); // Return to low
            }, 600); // 100 steps per minute pace
        }
        return () => clearInterval(interval);
    }, [isAutoRun, triggerData]);

    return (
        <div className="fixed bottom-4 right-4 p-4 glass-panel rounded-lg flex flex-col gap-2 z-50">
            <h3 className="text-xs font-mono text-muted-foreground uppercase">Sensor Debug</h3>
            <div className="flex gap-2">
                <button
                    onClick={() => triggerData(15)}
                    className="px-3 py-1 bg-primary text-black text-xs font-bold rounded hover:opacity-80 transition"
                >
                    Step +1
                </button>
                <button
                    onClick={() => setIsAutoRun(!isAutoRun)}
                    className={`px-3 py-1 text-xs font-bold rounded transition ${isAutoRun ? 'bg-red-500 text-white' : 'bg-muted text-foreground'}`}
                >
                    {isAutoRun ? 'Stop Auto' : 'Auto Run'}
                </button>
            </div>
        </div>
    );
};
