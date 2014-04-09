var diameter = 960,
    format = d3.format(",d"),
    color = d3.scale.category20();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select("body").append("svg")
    .attr("width", diameter)
    .attr("height", diameter)
    .attr("class", "bubble");

// test data for final project
// d3.tsv("../proposalData.txt", function(error,data){
//   if (error) return console.log("error!");
//     proposalData = data;
//     console.log(data);
// })

d3.json("assets/observationData.json", function(error, data) {
	proposalData = data;
	console.log(proposalData);
	for (var i in proposalData) {
		
		// output object
		console.log(i['0']['dec']);
		// stop
		break;
		//var proposal = proposalData[i]//['proposal_number'];
		console.log(proposal);
	};
	console.log("end")
});



