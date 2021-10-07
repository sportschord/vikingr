import logo from './2019 Updated Logo-01.png';

import './App.css';
import Circles from './Components/circles';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          D3 Bar Chart
        </p>
        <Circles />
      </header>
    </div>
  );
}

export default App;
