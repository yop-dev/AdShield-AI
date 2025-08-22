import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { TextAnalysis } from './pages/TextAnalysis';
import { DocumentAnalysis } from './pages/DocumentAnalysis';
import { DeepfakeAnalysis } from './pages/DeepfakeAnalysis';
import { LearningHub } from './pages/LearningHub';
import { Layout } from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page without layout */}
        <Route path="/" element={<HomePage />} />
        
        {/* Analysis and Learning Pages */}
        <Route
          path="/analyze/text"
          element={
            <Layout>
              <TextAnalysis />
            </Layout>
          }
        />
        <Route
          path="/analyze/document"
          element={
            <Layout>
              <DocumentAnalysis />
            </Layout>
          }
        />
        <Route
          path="/analyze/deepfake"
          element={
            <Layout>
              <DeepfakeAnalysis />
            </Layout>
          }
        />
        <Route
          path="/learn"
          element={
            <Layout>
              <LearningHub />
            </Layout>
          }
        />
        <Route
          path="/settings"
          element={
            <Layout>
              <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-gray-900">Settings Page</h1>
                <p className="text-gray-600 mt-2">Settings coming soon...</p>
              </div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
