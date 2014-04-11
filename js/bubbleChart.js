var w = 940;
var h = 600;
var center = {x: w/2, y: h/2};

var layout_gravity = -0.1
var damper = 0.5

var nodes = [];
var vis, force, circles, radius_scale;


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

	var time_range = d3.extent(nodes, function(d){return d['time'];})
    radius_scale = d3.scale.linear().domain(time_range).range([4, 85])

	//console.log(time_range);

	circles = svg.selectAll("circle")
					.data(nodes);

	circles.enter().append("circle")
      	.attr("r", 0)//function(d) {return d.time;})
      	.attr("fill", "#a8ddb5")
      	.attr("stroke-width", 2)
      	.attr("stroke", "#43a2ca");

    circles.transition().duration(2000).attr("r", function(d){return radius_scale(d['time']);});
    start();
    display_group_all();
});

function start() {
	console.log("start")
    force = d3.layout.force()
            .nodes(nodes)
            .size([w, h]);
}

function display_group_all() {
	force.gravity(layout_gravity)
	     .charge(5)
	     .friction(1)
	     .on("tick", function(e) {
	     	console.log('tick')
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
 



console.log("end");

