import React, { useState, useEffect } from 'react';
import { uploadCSV, downloadErrorReport } from '../services/api';
import { socket, joinJobRoom } from '../services/socket';
import { JobProgress, ErrorRow } from '../types';

interface Props {
  onJobCreated?: (jobId: string) => void;
}

const JobUpload: React.FC<Props> = ({ onJobCreated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    joinJobRoom(jobId);

const handleProgress = (data: JobProgress) => {
  setProgress(data);
};

socket.on('jobProgress', handleProgress);



    socket.on('jobCompleted', (data: any) => {
      alert(`Job ${data.jobId} completed!`);

    });

    socket.on('jobFailed', (data: any) => {
      alert(`Job ${data.jobId} failed: ${data.error}`);
    });

    return () => {
      socket.off('jobProgress', handleProgress);
      socket.off('jobCompleted');
      socket.off('jobFailed');
    };
  }, [jobId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!file) return;

  try {
    setLoading(true);

    const data = await uploadCSV(file);

    setJobId(data.jobId);
    socket.emit('newJob', data.jobId);

    if (onJobCreated) {
      onJobCreated(data.jobId);
    }

    setProgress(null);
    setFile(null);

  } finally {
    setLoading(false);
  }
};

  const handleDownloadErrors = () => {
    if (!jobId) return;
    downloadErrorReport(jobId);
  };

  return (
    <div>
      <h2>Upload CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
<button onClick={handleUpload} disabled={loading}>
  {loading ? 'Uploading...' : 'Upload'}
</button>
{jobId && (
  <p style={{ color: 'green' }}>
    Job started: {jobId}
  </p>
)}
      {progress && (
        <div>
          <progress
  value={progress.processed}
  max={progress.total}
  style={{ width: '100%' }}
/>

          <p>Processed: {progress.processed} / {progress.total}</p>
          <p>Success: {progress.success}</p>
          <p>Failed: {progress.failed}</p>

        {progress?.errorList && progress.errorList.length > 0 && (

            <>
              <h4>Errors:</h4>
              <ul>
                {progress.errorList.map((err, idx) => (
                 
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
              <button onClick={handleDownloadErrors}>Download Error Report</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default JobUpload;



