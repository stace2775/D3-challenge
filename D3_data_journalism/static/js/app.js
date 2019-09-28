// @TODO: YOUR CODE HERE!	
	//Set up SVG
	var svgWidth = 800;
	var svgHeight = 500;
	var margin = {
	top: 60,
	right: 60,
	bottom: 60,
	left: 60
	};
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;
	var svg = d3
	.select("#scatter")
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight);
	var chartGroup = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);
	//Load data from .csv
	d3.csv("static/data/data.csv").then(function(homeworkdata) {
	console.log(homeworkdata);
	// //log a list of names
	homeworkdata.forEach(function(data){
	data.abbr = data.abbr;
	data.poverty = +data.poverty;
	data.healthcare = +data.healthcare;
	console.log(data.abbr,data.poverty, data.healthcare);
	});
	//Create the scales & axes 
	var xLinearScale= d3.scaleLinear()
	.domain([7,d3.max(homeworkdata, d => d.poverty+2)])
	.range([0, width]);
	var yLinearScale = d3.scaleLinear()
	.domain([3, d3.max(homeworkdata, d => d.healthcare+2)])
	.range([height, 0]);
	//create axes
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);
	//Append the axes to the chartGroup
	// ==============================================
	// Add bottomAxis
	chartGroup.append("g").attr("transform", `translate(0, ${height})`).call(bottomAxis);
	// Add leftAxis to the left side of the display
	chartGroup.append("g").call(leftAxis);
	//create the circles
	var circlesGroup = chartGroup.selectAll("circle")
	.data(homeworkdata)
	.enter()
	.append("circle")
	.attr("cx", d => xLinearScale(d.poverty))
	.attr("cy", d => yLinearScale(d.healthcare))
	.attr("r", "13")
	.attr("class", "stateCircle");
	// .attr("fill", "skyblue")
	// .attr("opacity", ".5");
	// add text to circles
	var circlesGroup = chartGroup.selectAll()
	.data(homeworkdata)
	.enter()
	.append("text")
	.text(d => (d.abbr))
	.attr("class", "stateText")
	.attr("x", d => xLinearScale(d.poverty))
	//.attr("y", d => yLinearScale(d.healthcare));
	.attr("y", d => yLinearScale(d.healthcare - (0.25)));
	// Create axes labels
	chartGroup.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0 - margin.left)
	.attr("x", 0 - (height/2))
	.attr("dy", "1em")
	.attr("class", "aText")
	.text("Lacks Healthcare (%)");
	chartGroup.append("text")
	.attr("transform", `translate(${width/2}, ${height + margin.top-10})`)
	.attr("class", "aText")
	.text("In Poverty (%)");
	// initialize tooltip
	var toolTip = d3.tip()
	.attr("class", "d3-tip")
	.offset([80,-60])
	.html(d => (`${d.state}<hr>Poverty: ${d.poverty}%<br>Healthcare: ${d.healthcare}%`));
	// create tooltip in the chart
	chartGroup.call(toolTip);
	// create event listeners to display and hide tooltip
	circlesGroup.on("click", function(data) {
	toolTip.show(data, this);
	})
	// onMouseOut event
	.on("mouseout", function(data, index) {
	toolTip.hide(data);
	})
	}).catch(function(error){
	console.log(error);
	});
