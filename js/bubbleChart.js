var selected_cycle;

/*-------------------------------------------------------------------------------------------------
	Cycle Selector - checkboxes
-------------------------------------------------------------------------------------------------*/

// $('#cycle_selector').click(function(){
// 	var selected_cycles = new Array();
// 	$('#cycle_selector :checkbox:checked').each(function() {
// 		checked_cycle = $(this).val()
// 		cycle_num = checked_cycle.substring(5,7)
// 	    selected_cycles.push(cycle_num);
// 	});
// 	    console.log(selected_cycles);
// 	    return selected_cycles;
// });

// console.log(selected_cycles);

/*-------------------------------------------------------------------------------------------------
	Cycle Selector - radio buttons
-------------------------------------------------------------------------------------------------*/

$('#cycle_selector').click(function(){
	selected_cycle = $("input[type='radio'][name='cycle']:checked").val();
	console.log(selected_cycle);
});

console.log(selected_cycle);

/*-------------------------------------------------------------------------------------------------
	D3 Code
-------------------------------------------------------------------------------------------------*/

var w = 940;
var h = 600;
var center = {x: w/2, y: h/2};

var layout_gravity = -0.1
var damper = 0.5

var nodes = [];
var nodes_to_plot = [];
var vis, force, circles, radius_scale;

var fill_color = d3.scale.ordinal()
                  .domain(["STARS AND WD", 
                  		   	"GALACTIC DIFFUSE EMISSION AND SURVEYS", 
                  			"WD BINARIES AND CV",
                  			"BH AND NS BINARIES",
                  			"SN, SNR AND ISOLATED NS",
                  			"NORMAL GALAXIES: DIFFUSE EMISSION",
                  			"NORMAL GALAXIES: X-RAY POPULATIONS",
                  			"ACTIVE GALAXIES AND QUASARS",
                  			"CLUSTERS OF GALAXIES",
                  			"EXTRAGALACTIC DIFFUSE EMISSION AND SURVEYS",
                  			"GALACTIC DIFFUSE EMISSION AND SURVEYS",
                  			"SOLAR SYSTEM"])
                  .range(["#66c2a4", 
                  		   	"#8c96c6", 
                  			"#7bccc4",
                  			"#fc8d59",
                  			"#74a9cf",
                  			"#67a9cf",
                  			"#df65b0",
                  			"#78c679",
                  			"#41b6c4",
                  			"#fe9929",
                  			"#fd8d3c",
                  			"#f768a1"]);

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "bubble")
    .attr("id", "svg_vis");


d3.json("/assets/nodeData.json", function(error, data) {
	nodes = data;

	var time_range = d3.extent(nodes, function(d){return d['time'];})
    radius_scale = d3.scale.linear().domain(time_range).range([3, 160])
    //console.log(time_range);

	//find nodes to plot based on selected cycles
	for (var i = 0; i < nodes.length; i++) {
		if (nodes[i]['cycle'] === "12") { // check against selected cycles here
		//console.log(nodes[i]['cycle']);
			nodes_to_plot.push(nodes[i]); 
		};
	};

	//console.log(nodes_to_plot);

	circles = svg.selectAll("circle")
				.data(nodes_to_plot);

	circles.enter().append("circle")
      	.attr("r", 0)
      	.attr("fill", function(d) { return fill_color(d['category']) ;})
      	.attr("stroke-width", 1.5)
      	.attr("stroke", function(d) {return d3.rgb(fill_color(d['category'])).darker();});

    circles.on("mouseover", function(d) {
          var xPosition = d.x;
          var yPosition = d.y;
          //Create the tooltip label
          d3.select("#tooltip")
            .style("left", xPosition+radius_scale(d['time']) + "px")
            .style("top", yPosition + "px")
          //d3.select("#hbar").attr("fill", fill_color(d['category']))
          d3.select("#prop_num").text(d['proposal_number'])
          d3.select("#pi").text(d['last'])
          d3.select("#title").text(d['title'])
          d3.select("#time").text(d['time'])
          d3.select("#type").text(d['type'])
          d3.select("#category").text(d['category']);
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);
         })
        .on("mouseout", function() {
          //Hide the tooltip
          d3.select("#tooltip").classed("hidden", true);
        });

    circles.transition().duration(2000).attr("r", function(d){return radius_scale(d['time']);});
    start();
    display_group_all();
});

function charge(d) {
	return -Math.pow(radius_scale(d['time']), 2/1.06);
}

function start() {
	//console.log("start")
    force = d3.layout.force()
            .nodes(nodes)
            .size([w, h]);
}

function display_group_all() {
	force.gravity(layout_gravity)
	     .charge(charge)
	     .friction(0.8)
	     .on("tick", function(e) {
	     	//console.log('tick')
	        circles.each(move_towards_center(e.alpha))
	               .attr("cx", function(d) {return d.x;})
	               .attr("cy", function(d) {return d.y;});
	     });
	force.start();
}
 
function move_towards_center(alpha) {
	return function(d) {
		d.x = d.x + (center.x - d.x) * (damper + 0.02) * alpha;
		d.y = d.y + (center.y - d.y) * (damper + 0.02) * alpha;
	};
}
 
//console.log("end");






