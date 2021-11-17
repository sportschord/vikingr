
import '../App.css';
import * as d3 from 'd3'
import React, { useEffect, useState } from 'react';
// import { useEffect, useState } from 'react'

const url = "https://ergast.com/api/f1/2021/results.json?limit=80";


function Circles({sliderVal}) {

    
    var [races,setRaces]= useState([])
    var [loading,setLoading]=useState(true)

    const getData = async () => {
        const response = await fetch(url);
        const jsonData = await response.json();
        
        setRaces(jsonData.MRData.RaceTable.Races)
        setLoading(false);
      };


    useEffect(() => {

        getData(url)
        console.log(sliderVal);
        

    },[]);

    console.log(loading,'Races:',races);

        

    return (

        <div>

            <h4>Rankings</h4>

            <div><svg viewBox="0 0 100 100">
                {loading ? loading : races.map((d) =>
                    d.Results.flatMap((e) =>

                        //filter out anything greater than 5
                        (e.position > sliderVal) ? [] :
                            <React.Fragment>
                                <g>
                                    <circle
                                        fill="black"
                                        stroke="red"
                                        strokeWidth="1"
                                        id={d.season + d.raceName + e.Driver.familyName}
                                        cx={(d.round * 15) + 20}
                                        cy={e.position * 15}
                                        r='3' />
                                    <text x={(d.round * 15) + 20} y={(e.position * 15)}
                                        textAnchor="middle"
                                        fontSize="17%"
                                        fill='white'>
                                        {e.position}
                                    </text>
                                    <text x={(d.round * 15) + 20} y={(e.position * 15) + 5} 
                                        textAnchor="middle" 
                                        fontSize="12%">
                                        {e.Driver.familyName}
                                    </text>
                                </g>
                            </React.Fragment>

                    ))

                };
            </svg> </div>


        </div>
    );
}

export default Circles;
