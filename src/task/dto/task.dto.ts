export interface CreateTaskDTO {
  name: string;
  start_time?: string;
  end_time?: string;
  type: string;
  description: string;
  course?: number;
}
