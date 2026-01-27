import React, { useState } from 'react';
import JobUpload from './components/JobUpload';
import JobsList from   './components/JobList';

const App: React.FC = () => {
  const [latestJobId, setLatestJobId] = useState<string | null>(null);

  return (
    <div style={{ padding: '20px' }}>
      <JobUpload onJobCreated={setLatestJobId} />
      <JobsList />
    </div>
  );
};

export default App;
