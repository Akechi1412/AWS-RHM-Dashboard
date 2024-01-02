import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DevicePage from './pages/DevicePage';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/device" element={<DevicePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
