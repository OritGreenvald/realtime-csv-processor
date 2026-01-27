import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../services/api';
import { socket } from '../services/socket';
import { Job, JobProgress } from '../types';

const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);


  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const handleProgress = (data: JobProgress & { jobId: string }) => {
      setJobs(prev =>
        prev.map(job =>
          job._id === data.jobId
            ? {
                ...job,
                status: 'processing',
                processedRows: data.processed,
                successCount: data.success,
                failedCount: data.failed,
                totalRows: data.total
              }
            : job
        )
      );
    };

    const handleCompleted = (data: any) => {
      setJobs(prev =>
        prev.map(job =>
          job._id === data.jobId
            ? { ...job, status: 'completed' }
            : job
        )
      );
    };

    socket.on('jobProgress', handleProgress);
    socket.on('jobCompleted', handleCompleted);
    socket.on('refreshJobs', loadJobs);

    return () => {
      socket.off('jobProgress', handleProgress);
      socket.off('jobCompleted', handleCompleted);
      socket.off('refreshJobs', loadJobs);
    };
  }, []);

  const loadJobs = async () => {
    const data = await getAllJobs();
    setJobs(data);
  };

  return (
    <div>
      <h2>Jobs</h2>

      {jobs.length === 0 && <p>No jobs yet</p>}

      <ul>
        {jobs.map(job => (
          <li key={job._id} style={{ marginBottom: '15px' }}>

            <strong>ID:</strong> {job._id}
            <br />

            <strong>Status:</strong> {job.status}
            <br />

            {job.status === 'processing' && (
              <>
                <strong>Progress:</strong>{' '}
                {job.processedRows || 0} / {job.totalRows || 0}
                <br />

                <strong>Success:</strong> {job.successCount || 0} |{' '}
                <strong>Failed:</strong> {job.failedCount || 0}
                <br />
              </>
            )}

            {job.status === 'completed' && (
              <>
                <strong>Total:</strong> {job.totalRows}
                <br />

                <strong>Success:</strong> {job.successCount} |{' '}
                <strong>Failed:</strong> {job.failedCount}
                <br />
              </>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobsList;


