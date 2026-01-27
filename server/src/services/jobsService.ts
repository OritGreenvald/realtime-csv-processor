
import Job from '../models/Job';
import Customer from '../models/Customer';
import { parseCSV } from '../utils/csvParser';
import { io } from '../server';

export async function processCSVFile(jobId: string, filePath: string) {
  try {
    
    await Job.findByIdAndUpdate(jobId, { status: 'processing' });

    const rows = await parseCSV(filePath);

    let success = 0;
    let failed = 0;
    let processed = 0;

    const errorList: any[] = [];
    const total = rows.length;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      processed++;

      const name = row.name?.trim() || '';
      const email = row.email?.trim()?.toLowerCase() || '';
      const phone = row.phone || '';
      const company = row.company?.trim() || '';

      let error = '';

     
      if (!name || !email || !company) {
        error = 'Missing required fields';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!error && !emailRegex.test(email)) {
        error = 'Invalid email format';
      }

      if (!error) {
        const exists = await Customer.findOne({ email });
        if (exists) {
          error = 'Duplicate email';
        }
      }

      if (error) {
        failed++;
        errorList.push({
          rowNumber: i + 1,
          name,
          email,
          phone,
          company,
          error
        });
      } else {
        await Customer.create({
          name,
          email,
          phone,
          company,
          jobId
        });
        success++;
      }

      io.emit('jobProgress', {
        jobId,
        processed,
        success,
        failed,
        total
      });
    }

    io.emit('jobProgress', {
      jobId,
      processed,
      success,
      failed,
      total,
      errorList
    });

    await Job.findByIdAndUpdate(jobId, {
      status: 'completed',
      totalRows: total,
      processedRows: processed,
      successCount: success,
      failedCount: failed,
      errorList,
      completedAt: new Date()
    });

    io.emit('jobCompleted', {
      jobId,
      processed,
      success,
      failed
    });

  } catch (err: any) {
    console.error(err);

    await Job.findByIdAndUpdate(jobId, {
      status: 'failed'
    });

    io.emit('jobFailed', {
      jobId,
      error: err.message
    });
  }
}
