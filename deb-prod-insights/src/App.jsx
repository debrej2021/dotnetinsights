import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar               from './components/Navbar.jsx';
import DotNet7Rs            from './pages/DotNet7Rs.jsx';
import MigrationArchitecture from './pages/MigrationArchitecture.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                       element={<DotNet7Rs />} />
        <Route path="/dotnet-7rs"             element={<DotNet7Rs />} />
        <Route path="/migration-architecture" element={<MigrationArchitecture />} />
      </Routes>
    </BrowserRouter>
  );
}
