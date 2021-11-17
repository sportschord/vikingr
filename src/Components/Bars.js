
import * as d3 from 'd3'
import { useEffect, useState, useRef } from 'react'
import Hamilton from '../Hamilton.csv'

var h = 400;
var w = 800;


function Bars() {

  const ref = useRef();

  const [dataSet, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    d3.csv(Hamilton)
      .then((d) => {
        setData(d);
        setLoading(false);
      });
      
    }, []);

  useEffect(() => {

    const svgElement = d3.select(ref.current)


    var xScale = d3.scaleBand()
      .domain(d3.range(dataSet.length))
      .rangeRound([0, w])
      .paddingInner(0.05);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataSet, d => d.Wins)])
      .range([0, h]);
    var sortOrder = false;
    var sortBars = () => {
      
      //flip value of sort
      sortOrder = !sortOrder

    var sortItems = function(a,b){
      if (sortOrder) {
        return d3.ascending(a.Wins,b.Wins);
      } else {     
      }
        return d3.descending(a.Wins,b.Wins);
      }

      svgElement.selectAll("rect")
      .sort(sortItems)
      .transition("sortBars")
      .delay((d,i)=> i*50)
      .duration(1000)
      .attr("x", (d,i) => xScale(i));

      svgElement.selectAll("text")
      .sort(sortItems)
      .transition("sortText")
      .delay((d,i)=> i*50)
      .duration(1000)
      .attr("x", (d,i) => xScale(i)+12);

    } 

    
    svgElement.append("svg")
      .attr("width", w)
      .attr("height", h);

    svgElement.selectAll("rect")
      .data(dataSet)
      .enter()
      .append("rect")
      .attr("x", (d,i) => xScale(i))
      .attr("y", d => h - yScale(d.Wins))
      .attr("width", xScale.bandwidth())
      .attr("height", d => yScale(d.Wins))
      .attr("fill", d => "rgb(0,0, "+Math.round(d.Wins*80)+ ")")
      .on("click", () => sortBars())
      .on("mouseover", function() {
        d3.select(this)
        .attr("fill","rgb("+Math.random()*150+","+Math.random()*150+ ","+Math.random()*150+")");})
      .on("mouseout", function(d) {
          d3.select(this)
          .transition("restoreBarColour")
          .duration(250)
          .attr("fill",d => "rgb("+Math.random()*150+","+Math.round(d.Wins*50)+ ","+Math.random()*150+")");
        })
      // .transition(1000);
      

    svgElement.selectAll("text")
    .data(dataSet)
    .enter()
    .append("text")
    .text(d => d.Wins)
    .attr("x", (d,i) => xScale(i)+ 12)
    .attr("y", d => h - yScale(d.Wins)+20)
    .attr("font-family","sans-serif")
    .attr("fill","white")
    .attr("text-anchor", "middle")
    
        

    console.log(dataSet);
    console.log(ref.current);

    


  }, [dataSet])


  return (
    <div id='BarChart'>
    {loading && <div>loading</div>}
    
    <svg ref={ref} height={h} width = {w}></svg>
    </div>
  );
}

export default Bars;
