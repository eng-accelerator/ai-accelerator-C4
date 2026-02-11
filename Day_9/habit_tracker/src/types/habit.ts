export interface Habit {
    id: string;
    name: string;
    createdAt: string; // ISO String
    completedDates: string[]; // YYYY-MM-DD
    color: string;
    category?: string;
}

export type NewHabit = Omit<Habit, "id" | "createdAt" | "completedDates">;
