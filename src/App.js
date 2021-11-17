import logo from './2019 Updated Logo-01.png';
import './App.css';
// import Bars from './Components/Bars';
// import Chord from './Components/chord';
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';
import { useState } from 'react';
import Circles from './Components/circles';
import Bump from './Components/Bump';

var data = [0, 1, 2, 3, 4]

function App() {

  const [value, setValue] = useState(5)
  const [value2, setValue2] = useState(5)

  const Note = (d) => {
    setValue(d)
  };
  const Note2 = (d) => {
    setValue2(d)
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          D3 Bar Chart
        </p>
      </header>
      {/* <Bars /> */}

      <div className='layout'>

        <Bump />
        <div className='rankings'>
          <div className='sliders'>
            {data.map(i =>

              <div>
                <Slider
                  id={i}
                  vertical
                  onChange={Note}
                  min={0}
                  max={10}
                  step={1}
                  value={value} />
                <p>{value}</p>
              </div>

            )}
            <Slider
              vertical
              onChange={Note2}
              min={0}
              max={10}
              step={1}
              value={value2} />
            <p>{value} <br /> {value2} <br /> {value * value2}</p>
          </div>
          <div>
            {/* <Circles sliderVal={value2}/> */}
          </div>
        </div>
      </div>

    </div>

  );
}

export default App;
