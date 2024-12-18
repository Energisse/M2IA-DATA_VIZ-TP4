// Definition de la taille du svg
const margin = { top: 60, right: 30, bottom: 20, left: 60 },
  width = 960,
  height = 960;

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
  const adjancencymatrix = createAdjacencyMatrix(nodes, edges, undefined, true);

  const maxWeight = d3.max(adjancencymatrix, (d) => d.weight);

  const zoneScale = d3.scaleOrdinal(d3.schemeCategory10);

  const positionsPersonnages = d3.range(nodes.length);

  const size =
    Math.min(
      width - margin.left - margin.right,
      height - margin.top - margin.bottom
    ) / nodes.length;

  const echellexy = d3
    .scaleBand()
    .range([0, size * nodes.length])
    .domain(positionsPersonnages)
    .paddingInner(0.1)
    .align(0)
    .round(true);

  const matrixViz = svg
    .selectAll("rect")
    .data(adjancencymatrix)
    .join("rect")
    .attr("width", size)
    .attr("height", size)
    .attr("x", ({ x }) => echellexy(x))
    .attr("y", ({ y }) => echellexy(y))
    .style("stroke", "white")
    .style("stroke-width", ".2px")
    .style("opacity", ({ weight }) => `${(weight / maxWeight) * 1000}%`)
    .style("fill", ({ zone_t, zone_s }) =>
      zone_s !== zone_t ? "#eee" : zoneScale(zone_s)
    );

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

  d3.select("#filter").on("change", (e) => {
    let order;
    switch (e.target.value) {
      case "appearances":
        order = appearances;
        break;
      case "zones":
        order = zones;
        break;
      case "influences":
        order = influences;
        break;
    }

    update(order);
  });

  function update(newPositions) {
    echellexy.domain(newPositions);

    rows
      .transition()
      .delay((d, i) => i * 10)
      .duration(1000)
      .attr("y", (d, i) => echellexy(i) + size);

    columns
      .transition()
      .delay((d, i) => i * 10)
      .duration(1000)
      .attr("y", (d, i) => echellexy(i) + size);

    matrixViz
      .transition()
      .delay(({ x, y }, i) => (x + y) * 10)
      .duration(1000)
      .attr("x", ({ x }) => echellexy(x))
      .attr("y", ({ y }) => echellexy(y));
  }
});
