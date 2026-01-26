// import Job from '../models/Job';
// import Customer from '../models/Customer';
// import { parseCSV } from '../utils/csvParser';
// import mongoose from 'mongoose';

// export const processCSVFile = async (jobId: string, filename: string) => {
//   try {
//     await Job.findByIdAndUpdate(jobId, { status: 'processing' });

//     const rows = await parseCSV(filename);

//     let successCount = 0;
//     let failedCount = 0;
//     let processedRows = 0;
//     const errorList: { row: number; error: string }[] = [];

//     for (let i = 0; i < rows.length; i++) {
//       const row = rows[i];
//       processedRows++;

//       const name = row.name?.trim();
//       const email = row.email?.trim().toLowerCase();
//       const phone = row.phone?.trim() || '';
//       const company = row.company?.trim();

//       // בדיקה אם השדות חובה קיימים
//       if (!name || !email || !company) {
//         failedCount++;
//         errorList.push({ row: i + 1, error: 'Missing required fields' });
//         continue;
//       }

//       // בדיקה אם האימייל תקין
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         failedCount++;
//         errorList.push({ row: i + 1, error: 'Invalid email format' });
//         continue;
//       }

//       try {
//         // בדיקה אם כבר קיים לקוח עם אותו אימייל
//         const existing = await Customer.findOne({ email });
//         if (existing) {
//           failedCount++;
//           errorList.push({ row: i + 1, error: 'Duplicate email' });
//           continue;
//         }

//         // יצירת הלקוח
//         await Customer.create({
//           name,
//           email,
//           phone,
//           company,
//           jobId: new mongoose.Types.ObjectId(jobId),
//           createdAt: new Date()
//         });

//         successCount++;

//       } catch (err: any) {
//         failedCount++;
//         errorList.push({ row: i + 1, error: err.message });
//       }

//       // עדכון סטטוס העבודה אחרי כל row
//       await Job.findByIdAndUpdate(jobId, {
//         totalRows: rows.length,
//         processedRows,
//         successCount,
//         failedCount,
//         errorList
//       });
//     }

//     // סיום העבודה
//     await Job.findByIdAndUpdate(jobId, {
//       status: 'completed',
//       completedAt: new Date()
//     });

//   } catch (err) {
//     console.error('Processing failed:', err);
//     await Job.findByIdAndUpdate(jobId, {
//       status: 'failed',
//       completedAt: new Date()
//     });
//   }
// };

import Job from '../models/Job';
import Customer from '../models/Customer';
import { parseCSV } from '../utils/csvParser';
import { io } from '../server';

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
        io.to(jobId).emit('jobProgress', { processedRows, successCount, failedCount, errorList });
        continue;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        failedCount++;
        errorList.push({ row: i + 1, error: 'Invalid email format' });
        io.to(jobId).emit('jobProgress', { processedRows, successCount, failedCount, errorList });
        continue;
      }

      try {
        const existing = await Customer.findOne({ email });
        if (existing) {
          failedCount++;
          errorList.push({ row: i + 1, error: 'Duplicate email' });
          io.to(jobId).emit('jobProgress', { processedRows, successCount, failedCount, errorList });
          continue;
        }

        await Customer.create({ name, email, phone, company, jobId, createdAt: new Date() });
        successCount++;
      } catch (err: any) {
        failedCount++;
        errorList.push({ row: i + 1, error: err.message });
      }

      io.to(jobId).emit('jobProgress', { processedRows, successCount, failedCount, errorList });

      await Job.findByIdAndUpdate(jobId, { totalRows: rows.length, processedRows, successCount, failedCount, errorList });
    }

    // await Job.findByIdAndUpdate(jobId, { status: 'completed', completedAt: new Date() });
    await Job.findByIdAndUpdate(jobId, {
  status: 'completed',
  completedAt: new Date(),
  totalRows: rows.length,
  processedRows,
  successCount,
  failedCount,
  errorList
});

    io.to(jobId).emit('jobCompleted', { processedRows, successCount, failedCount, errorList });

  } catch (err: any) {
    console.error(err);
    await Job.findByIdAndUpdate(jobId, { status: 'failed', completedAt: new Date() });
    io.to(jobId).emit('jobFailed', { error: err.message });
  }
};



