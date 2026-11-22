// Bring the page components together here without fetching their data.
// Read and Create each take care of their own requests when they need them.
import { Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar.jsx';
import Content from './components/Content.jsx';
import Footer from './components/Footer.jsx';
import Read from './components/Read.jsx';
import Create from './components/Create.jsx';
import './App.css';

function App() {
  return (
    <div className="page-layout">
      {/* Keep navigation above the changing page content.
          It stays available when we move from the form back to the list. */}
      <NavigationBar />
      <main className="container page-content">
        <div className="content-panel">
          {/* Let the address choose which page we show inside this panel.
              The menu and footer can stay in their familiar places. */}
          <Routes>
            {/* The home route is our small greeting page. */}
            <Route path="/" element={<Content />} />
            {/* Read asks the API for the movie documents saved in MongoDB. */}
            <Route path="/read" element={<Read />} />
            {/* Create collects the three fields and sends a POST request. */}
            <Route path="/create" element={<Create />} />
          </Routes>
        </div>
      </main>
      {/* This sits outside Routes so the same footer appears on all pages. */}
      <Footer />
    </div>
  );
}

// Exporting the component lets main.jsx use it as the app entry point.
// The component itself stays a normal function that returns JSX.
export default App;
