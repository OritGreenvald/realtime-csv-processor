import Job from '../models/Job';
import Customer from '../models/Customer';
import { parseCSV } from '../utils/csvParser';

export const processCSVFile = async (jobId: string, filename: string) => {
  try {
    await Job.findByIdAndUpdate(jobId, { status: 'processing' });

    const rows = await parseCSV(filename);

    let successCount = 0;
    let failedCount = 0;
    let processedRows = 0;
    const errorList: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      processedRows++;

      const name = row.name?.trim();
      const email = row.email?.trim().toLowerCase();
      const phone = row.phone?.trim() || '';
      const company = row.company?.trim();

      if (!name || !email || !company) {
        failedCount++;
        errorList.push({ row: i + 1, error: 'Missing required fields' });
        continue;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        failedCount++;
        errorList.push({ row: i + 1, error: 'Invalid email format' });
        continue;
      }

      try {
        const existing = await Customer.findOne({
          $or: [ { email }]});

        if (existing) {
          failedCount++;
          errorList.push({ row: i + 1, error: 'Duplicate entry' });
          continue;
        }

        await Customer.create({
          name,
          email,
          phone,
          company,
          jobId,
          createdAt: new Date()
        });

        successCount++;

      } catch (err: any) {
        failedCount++;
        errorList.push({ row: i + 1, error: err.message });
      }

      await Job.findByIdAndUpdate(jobId, {
        totalRows: rows.length,
        processedRows,
        successCount,
        failedCount,
        errorList
      });
    }

    await Job.findByIdAndUpdate(jobId, {
      status: 'completed',
      completedAt: new Date()
    });

  } catch (err) {
    console.error('Processing failed:', err);
    await Job.findByIdAndUpdate(jobId, {
      status: 'failed',
      completedAt: new Date()
    });
  }
};
