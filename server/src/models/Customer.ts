import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone?: string;
  company: string;
    jobId: mongoose.Types.ObjectId;
  createdAt: Date;

}

const CustomerSchema: Schema = new Schema({
  name: { type: String, required: true ,trim: true },

   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
  phone: { type: String, default: '' },
  company: { type: String, required: true, trim: true },
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true }, 
  createdAt: { type: Date, default: Date.now },
  
});

export default mongoose.model<ICustomer>('Customer', CustomerSchema);
