import React, { useEffect, useState } from 'react';
import { getJob } from '../services/api';
import { Job } from '../types';

interface Props {
  jobId: string;
}

const JobDetails: React.FC<Props> = ({ jobId }) => {
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!jobId) return;
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    const data = await getJob(jobId);
    setJob(data);
  };

  if (!job) return <div>Select a job to view details</div>;

  return (
    <div>
      <h2>Job Details</h2>
      <p>Filename: {job.filename}</p>
      <p>Status: {job.status}</p>
      <p>Total Rows: {job.totalRows}</p>
      <p>Processed Rows: {job.processedRows}</p>
      <p>Success: {job.successCount}</p>
      <p>Failed: {job.failedCount}</p>

      {job.errorList.length > 0 && (
        <ul>
          {job.errorList.map((err, idx) => (
            <li key={idx} style={{ marginBottom: '8px' }}>
              <strong>Row {err.rowNumber}</strong><br />
              Error: {err.error}<br />
              Name: {err.name}<br />
              Email: {err.email}<br />
              Phone: {err.phone || '—'}<br />
              Company: {err.company}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobDetails;
