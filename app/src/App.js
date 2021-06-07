import {
  BrowserRouter as Router
} from "react-router-dom";
import {AuthContextProvider} from './context/AuthContext';
import {routes,routRenderer} from './routes/router';
import './App.css';

function App() {
  return (
    <>
      <AuthContextProvider>
      <Router> 
        {
          routRenderer(routes)
        }
      </Router>
      </AuthContextProvider>
    </>
  );
}

export default App;
