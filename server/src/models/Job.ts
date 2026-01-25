import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  filename: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalRows: number;
  successCount: number;
  failureCount: number;
  errorList: { row: number; error: string }[];
  createdAt: Date;
}

const JobSchema: Schema = new Schema({
  filename: { type: String, required: true },
  status: { type: String, enum: ['pending','processing','completed','failed'], default: 'pending' },
  totalRows: { type: Number, default: 0 },
  successCount: { type: Number, default: 0 },
  failureCount: { type: Number, default: 0 },
  errorList: [{ row: Number, error: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IJob>('Job', JobSchema);
