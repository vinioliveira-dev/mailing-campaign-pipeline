import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { CampaignsPage } from './pages/CampaignsPage';
import { MailingsPage } from './pages/MailingsPage';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/campaigns" element={<CampaignsPage />} />
          <Route path="/mailings" element={<MailingsPage />} />
          <Route path="/" element={<Navigate to="/campaigns" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
