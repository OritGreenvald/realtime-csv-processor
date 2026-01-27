import { processCSVFile } from '../services/jobsService';
import { QueueJob } from './queue';

export async function startWorker(job: QueueJob) {
  console.log('Worker running:', job.jobId);

  await processCSVFile(job.jobId, job.filePath);
}
