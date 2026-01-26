import { Request, Response } from 'express';
import Job from '../models/Job';
import path from 'path';
import { processCSVFile } from '../services/jobsService';

export const uploadCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File is required' });
    }

    const job = new Job({
      filename: req.file.filename,
      status: 'pending'
    });

    await job.save();

    const filePath = path.join(process.cwd(), 'uploads', req.file.filename);

    processCSVFile(job._id.toString(), filePath);

    return res.status(200).json({
      message: 'Job created',
      jobId: job._id
    });

  } catch (err) {
    console.error('Upload CSV error:', err);

    return res.status(500).json({
      message: 'Failed to upload file'
    });
  }
};


export const getJob = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.json(job);

  } catch (err) {
    console.error('Get job error:', err);

    return res.status(500).json({
      message: 'Failed to get job'
    });
  }
};


export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });

    return res.json(jobs);

  } catch (err) {
    console.error('Get jobs error:', err);

    return res.status(500).json({
      message: 'Failed to get jobs'
    });
  }
};


