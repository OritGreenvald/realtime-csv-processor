import Job from '../models/Job';
import Customer from '../models/Customer';
import { parseCSV } from '../utils/csvParser';

export const processCSVFile = async (jobId: string, filename: string) => {
  try {
    await Job.findByIdAndUpdate(jobId, { status: 'processing' });

    const rows = await parseCSV(`uploads/${filename}`);
    let successCount = 0;
    let failureCount = 0;
    const errorList: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        if (!row.name || !row.email || !row.company) throw new Error('Missing required fields');

        await Customer.create({
          name: row.name,
          email: row.email,
          phone: row.phone,
          company: row.company
        });
        successCount++;
      } catch (err: any) {
        failureCount++;
        errorList.push({ row: i + 1, error: err.message });
      }

      await Job.findByIdAndUpdate(jobId, {
        totalRows: rows.length,
        successCount,
        failureCount,
        errorList
      });
    }

    await Job.findByIdAndUpdate(jobId, { status: 'completed' });
  } catch (err) {
    console.error(err);
    await Job.findByIdAndUpdate(jobId, { status: 'failed' });
  }
};
