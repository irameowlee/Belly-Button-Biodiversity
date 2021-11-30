function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var buildingArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = buildingArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // 8. Create the trace for the bar chart. 
    var bar_data =[
      {
        y:otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x:sample_values.slice(0,10).reverse(),
        text:otu_labels.slice(0,10).reverse(),
        type:"bar",
        orientation:"h"
  
      }
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };
  
    // 10. Use Plotly to plot the data with the layout. 
    
    Plotly.newPlot("bar", bar_data, barLayout);
  
// Bubble

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: samples[0].otu_ids,
      y: samples[0].sample_values,
      text:samples[0].otu_labels.slice(0,10),
      mode: 'markers',
      marker: {
        size: samples[0].sample_values,
        color: samples[0].otu_ids
      }
    }];

  // 2. Create the layout for the bubble chart.
  var bubbleLayout = {
    title:{
      text: ` Bacteria Cultures per Sample`
    } ,
    xaxis: {
      title: `OTU ID`
    },
    yaxis: {
      title: `Sample Value`
    }
  };

  // 3. Use Plotly to plot the data with the layout.
  Plotly.newPlot('bubble', bubbleData, bubbleLayout); 
});
}

// Gauge
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

var wfreq = data.metadata.map(d => d.wfreq)


var data_g = [
  {
  domain: { x: [0, 1], y: [0, 1] },
  value: parseFloat(wfreq),
  title: { text: `Weekly Washing Frequency ` },
  type: "indicator",      
  
  mode: "gauge+number",
  gauge: { axis: { range: [null, 9] },
           steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "lime" },
            { range: [8, 9], color: "green" },
          ]}
      
  }
];
var layout_g = { 
    width: 700, 
    height: 600, 
    margin: { t: 20, b: 40, l:100, r:100 } 
  };
Plotly.newPlot("gauge", data_g, layout_g);
});
} 
