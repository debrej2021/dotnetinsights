import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from "./pages/About";
import Footer from './components/Footer.jsx';
import Navbar               from './components/Navbar.jsx';
import DotNet7Rs            from './pages/DotNet7Rs.jsx';
import MigrationArchitecture from './pages/MigrationArchitecture.jsx';
import CobolToCSharp   from './pages/cobol-to-csharp.jsx';
import JavaToCSharp    from './pages/java-to-csharp.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                       element={<DotNet7Rs />} />
        <Route path="/dotnet-7rs"             element={<DotNet7Rs />} />
        <Route path="/migration-architecture" element={<MigrationArchitecture />} />
        <Route path="/about"                    element={<About />} />
        <Route path="/cobol-to-csharp"            element={<CobolToCSharp />} />
        <Route path="/java-to-csharp"            element={<JavaToCSharp />} />
        <Route path="/terms"                  element={<TermsAndConditions />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
