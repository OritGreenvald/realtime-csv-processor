import React, { useState } from 'react';
import { uploadCSV } from '../services/api';
import { socket, joinJobRoom } from '../services/socket';
import { JobProgress, JobFailed } from '../types';


interface Props {
  onJobCreated: (jobId: string) => void;
}

const JobUpload: React.FC<Props> = ({ onJobCreated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<JobProgress | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

const handleUpload = async () => {
  if (!file) return;

  const data = await uploadCSV(file);
  

  setJobId(data.jobId);
  onJobCreated(data.jobId);

  joinJobRoom(data.jobId);

  socket.off('jobProgress');
  socket.off('jobCompleted');
  socket.off('jobFailed');

  socket.on('jobProgress', (progressData: JobProgress) => {
    setProgress(progressData);
  });

  socket.on('jobCompleted', (finalData: JobProgress) => {
    setProgress(finalData);
    alert('Job completed!');
  });

 socket.on('jobFailed', (err: JobFailed) => {
    alert('Job failed: ' + err.error);
  });
};


  return (
    <div>
      <h2>Upload CSV</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {progress && (
        <div>
          <p>Processed: {progress.processedRows}</p>
          <p>Success: {progress.successCount}</p>
          <p>Failed: {progress.failedCount}</p>
          {progress.errorList.length > 0 && (
            <ul>
              {progress.errorList.map((err, idx) => (
                <li key={idx}>Row {err.row}: {err.error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default JobUpload;
