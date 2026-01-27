
import { Request, Response } from 'express';
import Job from '../models/Job';
import path from 'path';
import { jobQueue } from '../queue/queue';

export const uploadCSV = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File is required' });

  const job = new Job({
  filename: req.file.filename,
  status: 'pending',
  totalRows: 0,
  processedRows: 0,
  successCount: 0,
  failedCount: 0,
  errorList: [],
});
    await job.save();

    const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
    jobQueue.add({ jobId: job._id.toString(), filePath });

    res.json({ message: 'Job created', jobId: job._id });
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
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllJobs = async (req: Request, res: Response) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getErrorReport = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const headers = ['rowNumber', 'name', 'email', 'phone', 'company', 'error'];
    const csv = [
      headers.join(','),
      ...job.errorList.map(e => [e.rowNumber, e.name, e.email, e.phone, e.company, e.error].join(','))
    ].join('\n');

    res.header('Content-Type', 'text/csv');
    res.attachment(`job-${req.params.id}-errors.csv`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadErrorReport = async (req: Request, res: Response) => {
  const job = await Job.findById(req.params.id);

  if (!job) return res.status(404).end();

  const rows = job.errorList;

  let csv = 'rowNumber,name,email,phone,company,error\n';

  rows.forEach(r => {
    csv += `${r.rowNumber},${r.name},${r.email},${r.phone},${r.company},"${r.error}"\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    'attachment; filename=errors.csv'
  );

  res.send(csv);
};
