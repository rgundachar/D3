// Define SVG area dimensions
var svgHeight = 500;
var svgWidth = 650;

// Define the chart's margins 
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

// Define the dimensions of the chart area 
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.bottom - chartMargin.top;

// Select scatter id, append SVG area to it and set the dimensions 
var scatter = d3.select("#scatter")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

// Select svg
var svg = d3.select("svg");
console.log(svg);

// Append a group to the SVG and shift (translate) it to the right and bottom 
var chartGroup = svg.append("g")
    .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load the data from data.csv
d3.csv("assets/data/data.csv", function(error, newsData) {
    if (error) throw error;

    console.log(newsData);

    // Extract the healthcare and poverty values from newsData in arrays and cast them to numeric values using '+'
    var healthcare = newsData.map( row => row.healthcare = +row.healthcare);
    var poverty = newsData.map(row => row.poverty = +row.poverty);
    
    // Creat a linear scale for vertical axis 
    var xLinearScale = d3.scaleLinear()
    
        // adding +2 and -2 to extend the scale beyond the min and max values of the healthcare array
        .domain([d3.extent(poverty)[0] - 2, d3.extent(poverty)[1] + 2]) 
        .range([0, chartWidth]);

    // Creat a linear scale for vertical axis 
    var yLinearScale = d3.scaleLinear()
        // adding +2 and -2 to extend the scale beyond the min and max values of the healthcare array
        // Also note the reverse order for the y-axis
        .domain([d3.extent(healthcare)[1] + 2, d3.extent(healthcare)[0] - 2])
        .range([0, chartHeight]);

    
    // Create two new functions passing the scales in as arguments 
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append two SVG group elements to the chartGroup area,
    // and create the bottom and left axes inside of them
    chartGroup.append("g")
        .attr("transform", `translate(${chartMargin.left}, ${-chartMargin.top})`)
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(${chartMargin.bottom}, ${chartHeight - chartMargin.bottom})`)
        .call(bottomAxis);


    // Add the labels for x-axis 
    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth/2 + 10 }, ${chartHeight + 10})`)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text("In Poverty (%)");

    // Add the label for y-axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - chartMargin.left)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "2em")
        .style("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text("Lacks Healthcare (%)"); 
   
    // Select the circle tag which will create an empty node and bind the data to the DOM element 
    var tBubble = chartGroup.selectAll("circle").data(newsData);

    // Enter to append and add 'g' for the chartGroup
    // Translate each of the node for both circle and text to be drawn at the x and y coordinates 
    var nodes = tBubble.enter()
        .append("g")
        .attr("transform", function(d) { return "translate("+ xLinearScale(d.poverty) + "," + yLinearScale(d.healthcare) + ")"; })

    // Create a circle at this translated point
    nodes.append("circle")
        .attr("r", "7")
        .transition()
        .attr("fill", "#8cb3d9");

    // Add text at this translated point
    nodes.append("text")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "7px")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .text(d => d.abbr); 

} );