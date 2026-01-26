import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../services/api';
import { Job } from '../types';

interface Props {
  onSelectJob: (jobId: string) => void;
}

const JobList: React.FC<Props> = ({ onSelectJob }) => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const fetchJobs = async () => {
    const data = await getAllJobs();
    setJobs(data);
  };

  return (
    <div>
      <h2>Jobs</h2>
      <ul>
        {jobs.map(job => (
          <li key={job._id}>
            <button onClick={() => onSelectJob(job._id)}>
              {job.filename} - {job.status}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
