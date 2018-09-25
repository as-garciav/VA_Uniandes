	//Setting up the canvas dimensions
	var svgWidth = 500;
	var svgHeight = 300;

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;


	//Defining the scales of the plot
	var formatPercent = d3.format(".0%");

	var x = d3.scaleBand()
		    .rangeRound([0, width])
		    .paddingInner(0.05);

	var y = d3.scaleLinear()
		    .range([height, 0]);

	var xAxis = d3.axisBottom(x);
	var yAxis = d3.axisLeft(y).tickFormat(formatPercent);

	// Creating variables and functions for transitions
	var durations = 0;
	  
	function afterLoad() {
	    durations = 750;
	};
console.log("hola Gelita");
	//Creating the SVG canvas in the BarPlot div
	var svg = d3.select("#barPlot").append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	//Loading data from pre-processed table
	var data = d3.dsv(",", "data/LactanciaMaterna_short.csv", function(d) {
			return {
				indicador: +d.idindicador,
				departamento: d.nomdepto,
				valor: +d.dato
			};
		}). then(function(data) {
			console.log(data);
//		});


	x.domain(data.map(function(d) {return d.nomdepto}));
	y.domain([0, d3.max(d3.map(function(d) {return d.dato}))]);


	svg.append("g")
	    .attr("class", "axis axis--x")
	    .attr("transform", "translate(0," + height + ")");

	svg.append("g")
	    .attr("class", "axis axis--y");
	    
	function type(d) { return d; }  

	// Event handlers
	d3.select("#myCheckbox").on('change', update);
	d3.select("#category").on('change', update);
	update();

	// Function update
	function update() {
	  
	  INT = d3.select('#category').property('value');
	
	  // Update domain
	  y.domain([0, d3.max(data, function(d) {
	      return d.dato; })
	  ]).nice();
	  console.log(y.domain([0, d3.max(data, function(d) {
	      return d.dato; })
	  ]).nice());
	  // Update axis
	  svg.selectAll(".axis.axis--y").transition()
	     .duration(durations)
	     .call(yAxis);
	  
	  console.log(INT);

	  //sort data
      sortIndex = data.map( function(d) {return d.nomdepto} );
	  data.sort(d3.select("#myCheckbox").property("checked")
	    ? function(a, b) { return b["dato" + INT] - a["dato" + INT]; }
	    : function(a, b) { return sortIndex.indexOf(a.nomdepto) - sortIndex.indexOf(b.nomdepto);}).slice();
	    
	  // set x domain
	  x.domain(data.map(function(d) { return d.iddepto; }));
	  
	  svg.selectAll(".axis.axis--x").transition()
	    .duration(durations)
	    .call(xAxis);
	    
	  // Update rectangles
	  var bars = svg.selectAll(".barEnter")
	    .data(data, function(d) {
	      return d.nomdepto;
	    });

	   	// some variables to make the transition of movable bars
	    var bars = bars
	      .enter()
	      .append("path") // Appending path rather than rect
	      .attr("class", ".barEnter")
	      .merge(bars);
	    
	    bars.transition()
	      .duration(durations)
	      .attr("d", function(d) { 
	        return roundedRect(
	          x(d.iddepto),                     // x position
	          y(d["dato" + INT]),           // y position
	          x.bandwidth(),                    // width
	          height - y(d["dato" + INT]),  // height
	          5                                 // radius
	        ) 
	      });
	    
	    bars.exit().remove();
	}

	// Funtion of example graph to make it pretier
	function roundedRect(x, y, width, height, radius) {
    return "M" + (x + radius) + "," + y + "h" + (width - 2*radius) + 
           "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius + 
           "v" + (height - 2*radius) + 
           "v" + radius + 
           "h" + -radius + 
           "h" + (2*radius - width) + 
           "h" + -radius + 
           "v" + -radius + 
           "v" + (2*radius - height) + 
           "a" + radius + "," + radius + " 0 0 1 " + radius + "," + -radius + "z";
  	};




/*			  svg.append("g")
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
			      .attr("x", function(d) { return x(d.iddepto); })
			      .attr("width", x.rangeBand())
			      .attr("y", function(d) { return y(d.dato); })
			      .attr("height", function(d) { return height - y(d.dato); });

			  d3.select("input").on("change", change);

			  var sortTimeout = setTimeout(function() {
			    d3.select("input").property("checked", true).each(change);
			  }, 2000);

			  function change() {
			    clearTimeout(sortTimeout);
			}
*/
		afterLoad()
	});