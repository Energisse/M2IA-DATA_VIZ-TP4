// Definition de la taille du svg
const margin = { top: 60, right: 30, bottom: 20, left: 60 },
  width = 960,
  height = 960,
  size = 5;

// ajout du svg à une 'div id="matrice"' déjà créee dans la page html
const svg = d3
  .select("#visu-tp4")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.json(
  "https://lyondataviz.github.io/teaching/lyon1-m2/2024/data/got_social_graph.json"
).then(({ nodes, links: edges }) => {
  const adjancencymatrix = createAdjacencyMatrix(nodes, edges);

  const maxWeight = d3.max(adjancencymatrix, (d) => d.weight);

  const scale = d3
    .scaleQuantize()
    .domain([0, maxWeight])
    .range(d3.schemeBlues[9]);

  const matrixViz = svg
    .selectAll("rect")
    .data(adjancencymatrix)
    .join("rect")
    .attr("width", size)
    .attr("height", size)
    .attr("x", ({ x }) => x * size)
    .attr("y", ({ y }) => y * size)
    .style("stroke", "black")
    .style("stroke-width", ".2px")
    .style("fill", ({ weight }) => scale(weight));

  const positionsPersonnages = d3.range(nodes.length);

  // [0, 1, ..., 106]
  const echellexy = d3
    .scaleBand()
    .range([0, size * nodes.length])
    .domain(positionsPersonnages)
    .paddingInner(0.1)
    .align(0)
    .round(true);

  const labels = d3
    .select("svg")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .style("font-size", "8px")
    .style("font-family", "sans-serif");

  const columns = labels
    .append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", 0)
    .attr("y", (d, i) => echellexy(i) + size)
    .style("text-anchor", "start")
    .text(({ character }) => character)
    .attr("transform", "rotate(-90)");

  const rows = labels
    .append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", 0)
    .attr("y", (d, i) => echellexy(i) + size)
    .style("text-anchor", "end")
    .text(({ character }) => character);
});
