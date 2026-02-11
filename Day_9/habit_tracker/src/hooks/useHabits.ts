"use client";

import { useState, useEffect } from "react";
import { Habit, NewHabit } from "@/types/habit";
import { format, differenceInDays, parseISO, isSameDay, subDays } from "date-fns";

const STORAGE_KEY = "habit-loop-data";

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setHabits(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse habits", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
        }
    }, [habits, isLoaded]);

    const addHabit = (newHabit: NewHabit) => {
        const habit: Habit = {
            ...newHabit,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            completedDates: [],
        };
        setHabits((prev) => [...prev, habit]);
    };

    const deleteHabit = (id: string) => {
        setHabits((prev) => prev.filter((h) => h.id !== id));
    };

    const toggleHabit = (id: string, date: Date = new Date()) => {
        const dateStr = format(date, "yyyy-MM-dd");
        setHabits((prev) =>
            prev.map((h) => {
                if (h.id === id) {
                    const isCompleted = h.completedDates.includes(dateStr);
                    return {
                        ...h,
                        completedDates: isCompleted
                            ? h.completedDates.filter((d) => d !== dateStr)
                            : [...h.completedDates, dateStr],
                    };
                }
                return h;
            })
        );
    };

    const calculateStreak = (habit: Habit) => {
        if (habit.completedDates.length === 0) return 0;

        const sortedDates = [...habit.completedDates]
            .map((d) => parseISO(d))
            .sort((a, b) => b.getTime() - a.getTime());

        let streak = 0;
        let currentDate = new Date();

        // Normalize currentDate to start of day for comparison
        const today = format(currentDate, "yyyy-MM-dd");
        const yesterday = format(subDays(currentDate, 1), "yyyy-MM-dd");

        const hasCompletedToday = habit.completedDates.includes(today);
        const hasCompletedYesterday = habit.completedDates.includes(yesterday);

        if (!hasCompletedToday && !hasCompletedYesterday) {
            return 0;
        }

        let checkDate = hasCompletedToday ? parseISO(today) : parseISO(yesterday);

        // Sort all unique completed dates descending
        const uniqueDates = Array.from(new Set(habit.completedDates))
            .map(d => parseISO(d))
            .sort((a, b) => b.getTime() - a.getTime());

        for (let i = 0; i < uniqueDates.length; i++) {
            const expectedDate = subDays(checkDate, i);
            if (isSameDay(uniqueDates[i], expectedDate)) {
                streak++;
            } else {
                break;
            }
        }

        return streak;
    };

    return {
        habits,
        addHabit,
        deleteHabit,
        toggleHabit,
        calculateStreak,
        isLoaded,
    };
}
