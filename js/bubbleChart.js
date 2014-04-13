var w = 940;
var h = 600;
var center = {x: w/2, y: h/2};

var layout_gravity = -0.1
var damper = 0.5

var nodes = [];
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

function create_nodes() {
	for (key in proposalData) {
		node = {
			'proposal_number': key,
			'cycle': key.substring(0,2),
			'first': proposalData[key][0]['first'],
			'last': proposalData[key][0]['last'],
			'time': parseFloat(proposalData[key][0]['approved_time']),
			'category': proposalData[key][0]['category_descrip'],
			'title': proposalData[key][0]['title'],
			'type': proposalData[key][0]['type'],
			'abstract': proposalData[key][0]['abstract'],
	    	x: Math.random() * 900,
	    	y: Math.random() * 800
		}

		if ((!isNaN(node['time'])) && (node['cycle'] === "15")) {
			nodes.push(node);
		};
	}
	return nodes;
}

d3.json("assets/observationData.json", function(error, data) {
	proposalData = data;
	nodes = create_nodes(proposalData);
	console.log(nodes[1]['cycle'])

	var time_range = d3.extent(nodes, function(d){return d['time'];})
    radius_scale = d3.scale.linear().domain(time_range).range([3, 170])
    //console.log(time_range);

	//console.log(time_range);

	circles = svg.selectAll("circle")
					.data(nodes);

	circles.enter().append("circle")
      	.attr("r", 0)
      	.attr("fill", function(d) { return fill_color(d['category']) ;})
      	.attr("stroke-width", 1.5)
      	.attr("stroke", function(d) {return d3.rgb(fill_color(d['category'])).darker();});

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

/*-------------------------------------------------------------------------------------------------
	Cycle Selector
-------------------------------------------------------------------------------------------------*/

$('#cycle_selector').click(function(){
	var selected_cycles = new Array();
	$('#cycle_selector :checkbox:checked').each(function() {
		checked_cycle = $(this).val()
		cycle_num = checked_cycle.substring(5,7)
	    selected_cycles.push(cycle_num);
	    console.log(selected_cycles);
	});
});





