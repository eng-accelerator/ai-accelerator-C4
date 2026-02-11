"use client";

import { Habit } from "@/types/habit";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flame, Trash2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface HabitCardProps {
    habit: Habit;
    streak: number;
    onToggle: () => void;
    onDelete: () => void;
}

export function HabitCard({ habit, streak, onToggle, onDelete }: HabitCardProps) {
    const isCompletedToday = habit.completedDates.includes(format(new Date(), "yyyy-MM-dd"));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="relative overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-xl transition-all hover:bg-zinc-900/80">
                <div
                    className="absolute top-0 left-0 h-1 w-full"
                    style={{ backgroundColor: habit.color }}
                />

                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h3 className="font-outfit text-xl font-semibold tracking-tight text-zinc-100">
                                {habit.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-orange-500">
                                    <Flame className={cn("h-4 w-4", streak > 0 && "animate-pulse")} />
                                    <span className="text-sm font-medium">{streak} day streak</span>
                                </div>
                                {streak >= 7 && (
                                    <Badge variant="outline" className="border-orange-500/50 bg-orange-500/10 text-[10px] text-orange-500">
                                        WEEKLY WARRIOR
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                            onClick={onDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex gap-1.5">
                            {[...Array(7)].map((_, i) => {
                                const date = new Date();
                                date.setDate(date.getDate() - (6 - i));
                                const dateStr = format(date, "yyyy-MM-dd");
                                const isDone = habit.completedDates.includes(dateStr);
                                const isToday = i === 6;

                                return (
                                    <div key={i} className="flex flex-col items-center gap-1">
                                        <div
                                            className={cn(
                                                "h-8 w-3 rounded-full transition-all duration-500",
                                                isDone ? "opacity-100" : "bg-zinc-800 opacity-30",
                                                isToday && !isDone && "ring-1 ring-zinc-700"
                                            )}
                                            style={{ backgroundColor: isDone ? habit.color : undefined }}
                                        />
                                        <span className="text-[8px] font-medium text-zinc-600 uppercase">
                                            {format(date, "EEE")[0]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                            <button
                                onClick={onToggle}
                                className={cn(
                                    "group relative flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-500 overflow-hidden",
                                    isCompletedToday
                                        ? "bg-zinc-100 text-zinc-950 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                                )}
                            >
                                <AnimatePresence mode="wait">
                                    {isCompletedToday ? (
                                        <motion.div
                                            key="check"
                                            initial={{ scale: 0.5, rotate: -45 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            exit={{ scale: 0.5, opacity: 0 }}
                                        >
                                            <CheckCircle2 className="h-7 w-7" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="circle"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <div className="h-6 w-6 rounded-full border-2 border-current opacity-40 group-hover:opacity-100 transition-opacity" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Subtle shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            </button>
                            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">
                                {isCompletedToday ? "COMPLETE" : "PENDING"}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
