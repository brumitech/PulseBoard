import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { AppProvider} from "@pulseboard/common";
import Editor from './pages/Editor';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <AppProvider>
      <Editor />
    </AppProvider>
  </StrictMode>
);
