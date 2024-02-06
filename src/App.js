import logo from './logo.svg';
import './App.css';
import AuthenticateUser from './Components/AuthenticateUser'
import { Route, Routes } from 'react-router-dom';
import Dashboard from './Components/Dashboard'

function App() {
  return (
    <div className="App">
      <Routes>
       <Route path='/' element={<AuthenticateUser/>}></Route>
       <Route path='/dashboard' element={<Dashboard/>}></Route>

       </Routes>
      
    </div>
  );
}

export default App;
