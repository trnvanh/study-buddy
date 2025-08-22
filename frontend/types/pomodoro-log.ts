export type PomodoroLog = {
  id: number;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  taskName: string | null;
  petId: number;
};