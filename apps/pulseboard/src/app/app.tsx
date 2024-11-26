import React, { useEffect, useState } from 'react';
import { CurrentDataWidget } from '../widgets/CurrentDataWidget'
import { ADW } from '../widgets/AverageDataWidget';



export const App: React.FC = () => {
  return (
    <div>
      <h1>My Dashboard</h1>
      <CurrentDataWidget />
      <ADW />
      {/* Other components */}
    </div>
  );
};

export default App;