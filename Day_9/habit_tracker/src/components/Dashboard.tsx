"use client";

import { useHabits } from "@/hooks/useHabits";
import { HabitCard } from "./HabitCard";
import { AddHabitDialog } from "./AddHabitDialog";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Sparkles, Calendar as CalendarIcon, Zap } from "lucide-react";

export function Dashboard() {
    const { habits, addHabit, deleteHabit, toggleHabit, calculateStreak, isLoaded } = useHabits();

    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950">
                <div className="h-4 w-4 animate-ping rounded-full bg-zinc-100" />
            </div>
        );
    }

    const today = new Date();

    return (
        <div className="min-h-screen bg-zinc-950 p-6 md:p-12 lg:p-20 selection:bg-white/10">
            <div className="mx-auto max-w-5xl">
                <header className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-zinc-500"
                        >
                            <CalendarIcon className="h-4 w-4" />
                            <span className="font-outfit text-sm font-medium uppercase tracking-[0.2em]">
                                {format(today, "EEEE, MMMM do")}
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-outfit text-5xl font-extrabold tracking-tighter text-zinc-100 md:text-7xl"
                        >
                            Good evening, <br />
                            <span className="text-zinc-500">Master of Habits.</span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <AddHabitDialog
                            onAdd={addHabit}
                            disabled={habits.length >= 3}
                        />
                    </motion.div>
                </header>

                <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <AnimatePresence mode="popLayout">
                        {habits.map((habit) => (
                            <HabitCard
                                key={habit.id}
                                habit={habit}
                                streak={calculateStreak(habit)}
                                onToggle={() => toggleHabit(habit.id)}
                                onDelete={() => deleteHabit(habit.id)}
                            />
                        ))}
                    </AnimatePresence>

                    {habits.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/20 p-20 text-center"
                        >
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-900 shadow-inner">
                                <Sparkles className="h-8 w-8 text-zinc-500" />
                            </div>
                            <h2 className="mb-2 font-outfit text-2xl font-bold text-zinc-300">Your Journey Starts Here</h2>
                            <p className="max-w-xs text-zinc-500">
                                Consistency is the bridge between goals and accomplishment. Add your first habit to begin.
                            </p>
                        </motion.div>
                    )}

                    {habits.length > 0 && habits.length < 3 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            whileHover={{ opacity: 1 }}
                            className="group flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/5 transition-all hover:bg-zinc-900/20"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900/50 text-zinc-600 transition-colors group-hover:text-zinc-400">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="mt-4 font-outfit text-sm font-medium text-zinc-500 uppercase tracking-widest">
                                Add Progress
                            </span>
                        </motion.div>
                    )}
                </section>

                {habits.length > 0 && (
                    <motion.footer
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-20 flex items-center justify-between border-t border-zinc-900 pt-8"
                    >
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Total Focus</span>
                                <span className="font-outfit text-2xl font-bold text-zinc-300">{habits.length} / 3</span>
                            </div>
                            <div className="h-8 w-[1px] bg-zinc-900" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Active Streaks</span>
                                <div className="flex items-center gap-1.5 font-outfit text-2xl font-bold text-zinc-300">
                                    <Zap className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                                    {habits.reduce((acc, h) => acc + (calculateStreak(h) > 0 ? 1 : 0), 0)}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Built for Excellence</p>
                            <p className="font-outfit text-xs font-medium text-zinc-500">v1.0.0 "Lumina"</p>
                        </div>
                    </motion.footer>
                )}
            </div>
        </div>
    );
}

function Plus({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    );
}
