import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './LineChart.css';

const LineChart = () => {

  const d3Chart = useRef();
  const parseDate = d3.timeParse('%Y-%m-%d')

  useEffect(() => {
    fetch('https://data.cityofnewyork.us/resource/tg4x-b46p.json')
    .then(resp => resp.json())
    .then(data => {
      const permits = data.filter(event => {
        return event.eventtype === "Shooting Permit"
        })
      
      const dates = [...new Set(permits.map(permit => permit.enteredon.slice(0, 10)))]
      
      let CountsByDate = []
      
      dates.map(time => {
        let date = time
        let count = 0
        
        return permits.map(permit => {
          let timestamp = permit.enteredon.slice(0, 10)
          if (timestamp === date) {
            count += 1
          }
          const counts = {date: parseDate(date), count: count}
          return CountsByDate.push(counts)
        })
      })
      
      const margin = { top: 50, right: 30, bottom: 30, left: 30}
      const width = parseInt(d3.select('#d3demo').style('width')) - margin.left - margin.right
      const height = parseInt(d3.select('#d3demo').style('height')) - margin.top - margin.bottom
      
      const svg = d3.select(d3Chart.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
        .attr('transform', 'translate('+ margin.left + ',' + margin.top + ')')

      const x = d3.scaleTime()
                .domain(d3.extent(CountsByDate, d => d.date))
                .range([0, width])

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

      const max = d3.max(CountsByDate, d => d.count)

      const y = d3.scaleLinear()
                .domain([0, max])
                .range([height, 0])

      svg.append('g')
        .call(d3.axisLeft(y))

      svg.append('path')
        .datum(CountsByDate)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 3)
        .attr('d', d3.line()
                    .x(d => x(d.date))
                    .y(d => y(d.count)))

      svg.append('text')
        .attr('x', (width/2))
        .attr('y', (margin.top/2))
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('stroke', 'black')
        .text('New York City Film Permits Entered in 2020 & 2021 - Shooting Permits')

    })
    // eslint-disable-next-line
  }, [])

  return (
    <div id="d3demo">
      <svg ref={d3Chart}>
      </svg>
    </div>
  );
}

export default LineChart;