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
