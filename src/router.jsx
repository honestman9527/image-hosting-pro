import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Upload from './pages/Upload';
import ImageManager from './pages/ImageManager';
import Settings from './pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'upload',
        element: <Upload />,
      },
      {
        path: 'images',
        element: <ImageManager />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]);

export default router;