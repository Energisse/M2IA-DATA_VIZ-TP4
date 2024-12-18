// Definition de la taille du svg
const margin = { top: 0, right: 30, bottom: 20, left: 10 },
  width = 960,
  height = 960;

// ajout du svg à une 'div id="matrice"' déjà créee dans la page html
const svg = d3
  .select("#visu-tp4")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(
  "https://lyondataviz.github.io/teaching/lyon1-m2/2024/data/got_social_graph.json"
).then(({ nodes, links: edges }) => {
  const adjancencymatrix = createAdjacencyMatrix(nodes, edges);

  const maxWeight = d3.max(adjancencymatrix, (d) => d.weight);

  const scale = d3
    .scaleQuantize()
    .domain([0, maxWeight])
    .range(d3.schemeBlues[9]);
});
