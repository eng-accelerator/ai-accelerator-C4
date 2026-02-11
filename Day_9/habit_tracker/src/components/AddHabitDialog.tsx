"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Sparkles } from "lucide-react";
import { NewHabit } from "@/types/habit";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
    "#A855F7", // Purple
    "#22C55E", // Green
    "#3B82F6", // Blue
    "#F97316", // Orange
    "#EF4444", // Red
    "#EC4899", // Pink
    "#06B6D4", // Cyan
];

interface AddHabitDialogProps {
    onAdd: (habit: NewHabit) => void;
    disabled?: boolean;
}

export function AddHabitDialog({ onAdd, disabled }: AddHabitDialogProps) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onAdd({
            name: name.trim(),
            color: selectedColor,
        });

        setName("");
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    disabled={disabled}
                    className="group relative overflow-hidden rounded-xl bg-zinc-100 px-6 py-6 text-zinc-950 hover:bg-white transiton-all"
                >
                    <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                    <span className="font-outfit font-semibold">New Habit</span>
                    {disabled && (
                        <span className="absolute inset-0 flex items-center justify-center bg-zinc-900/10 backdrop-blur-[1px] text-[10px] text-zinc-500 font-bold uppercase">
                            Limit Reached
                        </span>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="font-outfit text-2xl font-bold text-zinc-100">Create Habit</DialogTitle>
                    <DialogDescription className="text-zinc-500">
                        What's your next transformation? Limit to 3 for focus.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Habit Name</label>
                        <Input
                            placeholder="e.g. Morning Meditation"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 border-zinc-800 bg-zinc-900/50 text-base focus-visible:ring-zinc-700 font-outfit"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Accent Color</label>
                        <div className="flex flex-wrap gap-3">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={cn(
                                        "h-8 w-8 rounded-full transition-all hover:scale-110 active:scale-95 ring-offset-2 ring-offset-zinc-950",
                                        selectedColor === color && "ring-2 ring-white"
                                    )}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-zinc-100 text-zinc-950 font-bold hover:bg-white text-base shadow-lg shadow-white/5"
                    >
                        Launch Habit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
