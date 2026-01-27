import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  processedRows: number;
  successCount: number;
  failedCount: number;
  errorList: {
    rowNumber: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    error: string;
  }[];
  createdAt: Date;
  completedAt?: Date;
}

const JobSchema: Schema = new Schema({
  filename: { type: String, required: true },
  status: { type: String, enum: ['pending','processing','completed','failed'], default: 'pending' },
  totalRows: { type: Number, default: 0 },
  processedRows: { type: Number, default: 0 },
  successCount: { type: Number, default: 0 },
  failedCount: { type: Number, default: 0 },
  errorList: [
    {
      rowNumber: Number,
      name: String,
      email: String,
      phone: String,
      company: String,
      error: String
    }
  ],
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

export default mongoose.model<IJob>('Job', JobSchema);

