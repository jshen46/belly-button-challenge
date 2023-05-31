// Fetch the JSON data
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
  
  // Populate the dropdown with the sample names
  d3.select("#selDataset").selectAll("option")
    .data(data.names)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

  // Initial plots and metadata
  updatePage(data.names[0], data);

  // On change to the dropdown menu, update the plots and metadata
  d3.selectAll("#selDataset").on("change", function() { updatePage(this.value, data); });
});

// Function to update the plots and metadata
function updatePage(sampleId, data) {
  var sample = data.samples.filter(d => d.id === sampleId)[0];
  var metadata = data.metadata.filter(d => d.id == sampleId)[0];

  // Bar chart
  var barData = [{
    y: sample.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
    x: sample.sample_values.slice(0, 10).reverse(),
    text: sample.otu_labels.slice(0, 10).reverse(),
    type: "bar",
    orientation: "h",
  }];
  var barLayout = { title: "Top 10 Bacteria Cultures Found", margin: { t: 30, l: 150 } };
  Plotly.newPlot("bar", barData, barLayout);

  // Bubble chart
  var bubbleData = [{
    x: sample.otu_ids,
    y: sample.sample_values,
    text: sample.otu_labels,
    mode: 'markers',
    marker: { color: sample.otu_ids, size: sample.sample_values }
  }];
  var bubbleLayout = { title: 'Bacteria Cultures per Sample', showlegend: false, hovermode: 'closest', xaxis: { title: 'OTU ID' }, margin: { t: 30 } };
  Plotly.newPlot('bubble', bubbleData, bubbleLayout);

  // Metadata
  var metadataPanel = d3.select("#sample-metadata");
  metadataPanel.html("");
  Object.entries(metadata).forEach(([key, value]) => {
    metadataPanel.append("h5").text(`${key}: ${value}`);
  });
}
