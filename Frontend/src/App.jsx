import './App.css';
import {Route,BrowserRouter as Router ,Routes} from "react-router-dom";
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <>
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/auth" element={<Authentication/>}/>
      </Routes>
      </AuthProvider>
    </Router>
    </>
  );
}

export default App;
