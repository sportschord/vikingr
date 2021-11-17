import { useRef, useEffect, useState } from "react";
import * as d3 from 'd3';
import Points from '../Points.csv'

var height = 500;
var width = 800;
var margin = { left: 105, right: 105, top: 20, bottom: 50 };
var padding = 25;
var seq = (start, length) => Array.apply(null, { length: length }).map((d, i) => i + start);
var bumpRadius = 13
const compact = "default";
var drawAxis = (g, x, y, axis, domain) => {
    g.attr("transform", `translate(${x},${y})`)
        .call(axis)
        .selectAll(".tick text")
        .attr("font-size", "12px")
        .attr("font-family","Roboto");

    if (!domain) g.select(".domain").remove();
}

const Bump = () => {


    const [dataSet, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const bumpref = useRef();

    useEffect(() => {

        d3.csv(Points)
            .then((d) => {
                setData(d);
                setLoading(false);
                console.log('dataset; ', dataSet);

            });

    }, [loading]);



    useEffect(() => {

        var Drivers = Array.from(new Set(dataSet.flatMap(d => [d.name])));
        var Seasons = Array.from(new Set(dataSet.flatMap(d => [d.season])));
        console.log(Drivers, Seasons.length);

        const ti = new Map(Drivers.map((name, i) => [name, i]));
        const qi = new Map(Seasons.map((season, i) => [season, i]));

        const matrix = Array.from(ti, () => new Array(Seasons.length).fill(null));
        for (const { name, season, points } of dataSet)
            matrix[ti.get(name)][qi.get(season)] = { rank: 0, points: +points, next: null };

        matrix.forEach((d) => {
            for (let i = 0; i < d.length - 1; i++)
                d[i].next = d[i + 1];
        });

        Seasons.forEach((d, i) => {
            const array = [];
            matrix.forEach((d) => array.push(d[i]));
            array.sort((a, b) => b.points - a.points);
            array.forEach((d, j) => d.rank = j);
        });

        console.log(matrix);

        var ranking = () => {
            const len = Seasons.length - 1;
            const ranking = matrix.map((d, i) => ({ Drivers: Drivers[i], first: d[0].rank, last: d[len].rank }));
            return ranking;
        }
        var left = ranking().sort((a, b) => a.first - b.first).map((d) => d.Drivers);
        var right = ranking().sort((a, b) => a.last - b.last).map((d) => d.Drivers);

        console.log(ranking(), 'left: ', left, 'right:', right);

        var bx = d3.scalePoint()
            .domain(seq(0, Seasons.length))
            .range([0, width - margin.left - margin.right - padding * 2])

        var by = d3.scalePoint()
            .domain(seq(0, Drivers.length))
            .range([margin.top, height - margin.bottom - padding])

        var ax = d3.scalePoint()
            .domain(Seasons)
            .range([margin.left + padding, width - margin.right - padding]);

        var y = d3.scalePoint()
            .range([margin.top, height - margin.bottom - padding]);

        var strokeWidth = d3.scaleOrdinal()
            .domain(["default", "transit", "compact"])
            .range([5, bumpRadius * 2 + 2, 2]);

        var color = d3.scaleOrdinal(d3.schemeTableau10)
            .domain(seq(0, Drivers.length))


        //begin building the chart
        const bumpSvg = d3.select(bumpref.current)
            // .append("svg")
            .attr("viewBox", [0, 0, width, height]);
            
        bumpSvg.append("g")
            .attr("transform", `translate(${margin.left + padding},0)`)
            .selectAll("path")
            .data(seq(0, Seasons.length))
            .join("path")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 2)
            .attr("stroke-dasharray", "5,5")
            .attr("d", d => d3.line()([[bx(d), 0], [bx(d), height - margin.bottom]]));

        bumpSvg.append("g").call(g => drawAxis(g, 0, height - margin.top - margin.bottom + padding, d3.axisBottom(ax), true));
        const leftY = bumpSvg.append("g").call(g => drawAxis(g, margin.left, 0, d3.axisLeft(y.domain(left))));
        const rightY = bumpSvg.append("g").call(g => drawAxis(g, width - margin.right, 0, d3.axisRight(y.domain(right))));

        function highlight(e, d) {
            this.parentNode.appendChild(this);
            series.filter(s => s !== d)
                .transition().duration(500)
                .attr("fill", "#ddd").attr("stroke", "#ddd");
            markTick(leftY, 0);
            markTick(rightY, Seasons.length - 1);

            function markTick(axis, pos) {
                axis.selectAll(".tick text").filter((s, i) => i === d[pos].rank)
                    .transition().duration(500)
                    // .attr("font-weight", "bold")
                    .attr("fill", color(d[0].rank));
            }
        }

        function restore() {
            series.transition().duration(500)
                .attr("fill", s => color(s[0].rank)).attr("stroke", s => color(s[0].rank));
            restoreTicks(leftY);
            restoreTicks(rightY);

            function restoreTicks(axis) {
                axis.selectAll(".tick text")
                    .transition().duration(500)
                    .attr("font-weight", "normal").attr("fill", "black");
            }
        }



        const series = bumpSvg.selectAll(".series")
            .data(matrix)
            .join("g")
            .attr("class", "series")
            .attr("opacity", 1)
            .attr("fill", d => color(d[0].rank))
            .attr("stroke", d => color(d[0].rank))
            .attr("transform", `translate(${margin.left + padding},0)`)
            .on("mouseover", highlight)
            .on("mouseout", restore);



        series.selectAll("path")
            .data(d => d)
            .join("path")
            .attr("stroke-width", strokeWidth("default"))
            .attr("d", (d, i) => {
                if (d.next)
                    return d3.line()([[bx(i), by(d.rank)], [bx(i + 1), by(d.next.rank)]]);

        const bumps = series.selectAll("g")
            .data((d, i) => d.map(v => ({ Driver: Drivers[i], points: v, first: d[0].rank })))
            .join("g")
            .attr("transform", (d, i) => `translate(${bx(i)},${by(d.points.rank)})`)
        // .call(title);

            bumps.append("circle").attr("r", bumpRadius);
            bumps.append("text")
                .attr("dy", "0.35em")
                .attr("fill", "white")
                .attr("stroke", "none")
                .attr("text-anchor", "middle")
                .style("font-weight", "bold")
                .style("font-size", "14px")
                .text(d => d.points.rank + 1);

        


            });

    }, [dataSet]);



    return (<div>
        <svg ref={bumpref} ></svg>
    </div>
    );


}

export default Bump