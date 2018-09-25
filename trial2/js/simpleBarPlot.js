
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;
 console.log(height)

	var x = d3.scaleBand()
		    .rangeRound([0, width])
		    .paddingInner(0.05);

	var y = d3.scaleLinear()
		    .range([height, 0]);

	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y);

	//Creating the SVG canvas in the BarPlot div
	var svg = d3.select("#barPlot").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Loading data from pre-processed table
	var data = d3.dsv(",", "data/LactanciaMaterna_duracionTotalLM.csv", function(d) {
			return {
				indicador: +d.idindicador,
				departamento: d.nomdepto,
				valor: +d.dato
			};
		}). then(function(data) {
			console.log(data);

	x.domain(data.map(function(d) {return d.nomdepto}));
	y.domain([0, d3.max(d3.map(function(d) {return d.dato}))]);

		  	svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis);

			svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 6)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end")
			      .text("Meses");

			svg.selectAll(".bar")
			      .data(data)
			    .enter().append("rect")
			      .attr("class", "bar")
			      .attr("x", function(d) { return x(d.nomdepto); })
			      .attr("width", x.bandwidth())
			      .attr("y", function(d) { return y(d.dato); })
			      .attr("height", function(d) { return height - y(d.dato); });

			});




