import { Request, Response } from 'express';
import Job from '../models/Job';
import path from 'path';
import { processCSVFile } from '../services/jobsService';

export const uploadCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

    const job = new Job({ filename: req.file.filename, status: 'pending' });
    await job.save();

    // processCSVFile(job._id.toString(), req.file.filename); 
    const filePath = path.join(__dirname, '../uploads', req.file.filename);

processCSVFile(job._id.toString(), filePath);

    res.status(200).json({ message: 'Job created', jobId: job._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
