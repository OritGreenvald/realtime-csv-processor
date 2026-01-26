export interface Job {
  _id: string;
  filename: string;
  status: string;
  totalRows: number;
  processedRows: number;
  successCount: number;
  failedCount: number;
  errorList: { row: number; error: string }[];
  createdAt: string;
  completedAt: string | null;
}

export interface JobProgress {
  processedRows: number;
  successCount: number;
  failedCount: number;
  errorList: { row: number; error: string }[];
}

export interface JobFailed {
  error: string;
}

export interface JobError {
  row: number;
  error: string;
}

export interface UploadResponse {
  jobId: string;
}
