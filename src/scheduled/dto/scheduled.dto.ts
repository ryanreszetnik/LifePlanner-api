export interface CreateScheduledDTO {
  name: string;
  start_time: string;
  end_time: string;
  completed_time?: string;
  task: number;
}
