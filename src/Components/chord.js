import { useState, useRef, useEffect } from "react";
import * as d3 from 'd3';

var width = 440;
var height = 440;
var data = [
    [0, 15, 0, 20],
    [20, 20, 10, 0],
    [0, 20, 30, 0],
    [20, 20, 20, 0]
];

var colors = ["#440154ff", "#31668dff", "#37b578ff", "#fde725ff"]

// var chordGenerator = d3.chord()

const Chord = () => {

    const refchord = useRef();

    useEffect(() => {

        // const chordSvg = d3.select(refchord.current)

        const chordSvg = d3.select(refchord.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(220,220)")




        var chords = d3.chord().padAngle(0.05).sortSubgroups(d3.descending)(data);
        // var ribbonGenerator = d3.ribbon().radius(200);


        chordSvg
            .datum(chords)
            .append("g")
            .selectAll("g")
            .data(d => d.groups)
            .join("g")
            .append("path")
            .style("fill", function (d, i) { return colors[i] })
            .style("stroke", function (d, i) { return colors[i] })
            .attr("d", d3.arc()
                .innerRadius(200)
                .outerRadius(210)
            )

        // Add the links between groups
        chordSvg
            .datum(chords)
            .append("g")
            .selectAll("path")
            .data(d => d)
            .join("path")
            .attr("d", d3.ribbon()
                .radius(200)
            )
            .style("fill", function (d, i) { return colors[i] })
            .style("stroke", "black")
            .style("opacity", "0.8")
            .on("mouseover", function() {d3.select(this).style("opacity","0.4")})
            .on("mouseout", function() {d3.select(this).style("opacity","0.8")});



    }, []);

    return (
        <div width='600' height='600'>
            <svg ref={refchord} height={height} width='800'></svg>
        </div>


    );




}

export default Chord