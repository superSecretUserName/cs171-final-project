var w = 940;
var h = 600;
var center = {x: w/2, y: h/2};


var layout_gravity = -0.01
var damper = 0.1

// var diameter = 960,
//     format = d3.format(",d"),
//     color = d3.scale.category20();

// var bubble = d3.layout.pack()
//     .sort(null)
//     .size([diameter, diameter])
//     .padding(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "bubble");

function create_nodes() {
	var nodes = [];
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
    var radius_scale = d3.scale.linear().domain(time_range).range([2, 85])

	console.log(time_range);

	var circle = svg.selectAll("circle")
					.data(nodes);

	circle.enter().append("circle")
      	.attr("r", 0)//function(d) {return d.time;})
      	.attr("fill", "cyan")
      	.attr("stroke-width", 2)
      	.attr("stroke", "yellow");

    circle.transition().duration(2000).attr("r", function(d){return radius_scale(d['time']);});

    //start: ()
    var force = d3.layout.force()
      				.nodes(nodes)
      				.size([w, h]);
      				.start();

    //display_group_all: () =>
    force.gravity(layout_gravity)
      	.charge(2)
      	.friction(0.9);

    force.on("tick", function(d) {
    	nodes.attr("cx", function(d) { return d.x; })
        	.attr("cy", function(d) { return d.y; });
    });
    //force.start()



	//console.log(proposalData);
	//var cycle15 = {};
	//var cycle14	= {};

	// make an "alldata" object and each cycle is an object within

		//var cycle = key.substring(0,2);
		//cycle = "cycle" + cycle; // name of cycle object
		//console.log(cycle);
		//console.log(proposalData[key].length);
		//console.log(proposalData[key]);
		// output object
		// console.log(proposalData[key][0]['first']);
		//proposal = {};
		//var proposal_number = key;
		// substring slice to grab cycle numbers, push objects associate with prop_num key to each cycle
		//for (var i = 0; i < proposalData[key].length; i++) {
		// for (var i = 0; 10; i++) { 
		// 	//console.log(proposalData[key][i]['first']);
		// };		\
		//var proposal = proposalData[i]//['proposal_number'];
		//console.log(proposal);
	
	console.log("end");
});



