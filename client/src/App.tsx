import React, { useState, useEffect } from 'react';
import JobUpload from './components/JobUpload';
import JobList from './components/JobList';
import JobDetails from './components/JobDetails';
import { initSocket } from './services/socket';

const App: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    initSocket();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <div>
        <JobUpload onJobCreated={setSelectedJobId} />
      </div>
      <div>
        <JobList onSelectJob={setSelectedJobId} />
      </div>
      <div>
        {selectedJobId && <JobDetails jobId={selectedJobId} />}
      </div>
    </div>
  );
};

export default App;
