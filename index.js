// Import stylesheets
import './style.css';
import * as d3 from 'd3';
const width = 975;
const height = width;
const innerRadius = 180;
const outerRadius = Math.min(width, height) / 2;
const data = [
  {
    State: 'AL',
    'Under 5 Years': 310504,
    '5 to 13 Years': 552339,
    '14 to 17 Years': 259034,
    '18 to 24 Years': 450818,
    '25 to 44 Years': 1231572,
    '45 to 64 Years': 1215966,
    '65 Years and Over': 641667,
    total: 4661900,
  },
  {
    State: 'AK',
    'Under 5 Years': 52083,
    '5 to 13 Years': 85640,
    '14 to 17 Years': 42153,
    '18 to 24 Years': 74257,
    '25 to 44 Years': 198724,
    '45 to 64 Years': 183159,
    '65 Years and Over': 50277,
    total: 686293,
  },
  {
    State: 'AZ',
    'Under 5 Years': 515910,
    '5 to 13 Years': 828669,
    '14 to 17 Years': 362642,
    '18 to 24 Years': 601943,
    '25 to 44 Years': 1804762,
    '45 to 64 Years': 1523681,
    '65 Years and Over': 862573,
    total: 6500180,
  },
];
const columns = [
  'State',
  'Under 5 Years',
  '5 to 13 Years',
  '14 to 17 Years',
  '18 to 24 Years',
  '25 to 44 Years',
  '45 to 64 Years',
  '65 Years and Over',
];
const arc = d3
  .arc()
  .innerRadius((d) => y(d[0]))
  .outerRadius((d) => y(d[1]))
  .startAngle((d) => x(d.data.State))
  .endAngle((d) => x(d.data.State) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius);

const x = d3
  .scaleBand()
  .domain(data.map((d) => d.State))
  .range([0, 2 * Math.PI])
  .align(0);

// This scale maintains area proportionality of radial bars
const y = d3
  .scaleRadial()
  .domain([0, d3.max(data, (d) => d.total)])
  .range([innerRadius, outerRadius]);
const z = d3
  .scaleOrdinal()
  .domain(columns.slice(1))
  .range([
    '#98abc5',
    '#8a89a6',
    '#7b6888',
    '#6b486b',
    '#a05d56',
    '#d0743c',
    '#ff8c00',
  ]);
const xAxis = (g) =>
  g.attr('text-anchor', 'middle').call((g) =>
    g
      .selectAll('g')
      .data(data)
      .join('g')
      .attr(
        'transform',
        (d) => `
        rotate(${((x(d.State) + x.bandwidth() / 2) * 180) / Math.PI - 90})
        translate(${innerRadius},0)
      `
      )
      .call((g) => g.append('line').attr('x2', -5).attr('stroke', '#000'))
      .call((g) =>
        g
          .append('text')
          .attr('transform', (d) =>
            (x(d.State) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) <
            Math.PI
              ? 'rotate(90)translate(0,16)'
              : 'rotate(-90)translate(0,-9)'
          )
          .text((d) => d.State)
      )
  );
const yAxis = (g) =>
  g
    .attr('text-anchor', 'middle')
    .call((g) =>
      g
        .append('text')
        .attr('y', (d) => -y(y.ticks(5).pop()))
        .attr('dy', '-1em')
        .text('Population')
    )
    .call((g) =>
      g
        .selectAll('g')
        .data(y.ticks(5).slice(1))
        .join('g')
        .attr('fill', 'none')
        .call((g) =>
          g
            .append('circle')
            .attr('stroke', '#000')
            .attr('stroke-opacity', 0.5)
            .attr('r', y)
        )
        .call((g) =>
          g
            .append('text')
            .attr('y', (d) => -y(d))
            .attr('dy', '0.35em')
            .attr('stroke', '#fff')
            .attr('stroke-width', 5)
            .text(y.tickFormat(5, 's'))
            .clone(true)
            .attr('fill', '#000')
            .attr('stroke', 'none')
        )
    );
const legend = (g) =>
  g
    .append('g')
    .selectAll('g')
    .data(columns.slice(1).reverse())
    .join('g')
    .attr(
      'transform',
      (d, i) => `translate(-40,${(i - (columns.length - 1) / 2) * 20})`
    )
    .call((g) =>
      g.append('rect').attr('width', 18).attr('height', 18).attr('fill', z)
    )
    .call((g) =>
      g
        .append('text')
        .attr('x', 24)
        .attr('y', 9)
        .attr('dy', '0.35em')
        .text((d) => d)
    );

function createSvg(width, height) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', [0, 0, width, height]);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  return svg;
}
function createChart() {
  const svg = d3
    .select(createSvg(width, height))
    .attr('viewBox', `${-width / 2} ${-height / 2} ${width} ${height}`)
    .style('width', '100%')
    .style('height', 'auto')
    .style('font', '10px sans-serif');

  svg
    .append('g')
    .selectAll('g')
    .data(d3.stack().keys(columns.slice(1))(data))
    .join('g')
    .attr('fill', (d) => z(d.key))
    .selectAll('path')
    .data((d) => d)
    .join('path')
    .attr('d', arc);

  svg.append('g').call(xAxis);

  svg.append('g').call(yAxis);

  svg.append('g').call(legend);

  return svg.node();
}

const element = document.querySelector('div#chart');
element.appendChild(createChart());
