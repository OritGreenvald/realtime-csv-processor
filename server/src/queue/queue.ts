import { processCSVFile } from '../services/jobsService';

export interface QueueJob {
  jobId: string;
  filePath: string;
}

class JobQueue {
  private queue: QueueJob[] = [];
  private working = false;

  add(job: QueueJob) {
    this.queue.push(job);
    this.runNext();
  }

  private async runNext() {
    if (this.working) return;
    if (this.queue.length === 0) return;

    this.working = true;

    const job = this.queue.shift()!;

    try {
      console.log('Running job:', job.jobId);
      await processCSVFile(job.jobId, job.filePath);
    } catch (err) {
      console.error('Queue error:', err);
    }

    this.working = false;
    this.runNext();
  }
}

export const jobQueue = new JobQueue();
