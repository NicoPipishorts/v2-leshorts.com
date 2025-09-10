import App from '@/App';
import About from '@/pages/About';
import Home from '@/pages/Home';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: '*', element: <div style={{ padding: 24 }}>Not found</div> },
    ],
  },
]);
