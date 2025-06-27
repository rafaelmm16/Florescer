export interface Routine {
  id: string;
  name: string;
  days: number[];
  goal: number;
  progress: number;
  isCompleted: boolean;
  isDeleted: boolean;
  deletedTimestamp?: number;
}