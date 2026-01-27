export interface ErrorRow {
  rowNumber: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  error: string;
}

export interface Job {
  _id: string;
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  successCount: number;
  failedCount: number;
  errorList: ErrorRow[];
  createdAt: string;
  completedAt?: string;
}


export interface JobProgress {
  processed: number;
  success: number;
  failed: number;
  total: number;
  errorList?: ErrorRow[];
}

