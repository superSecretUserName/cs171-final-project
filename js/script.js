/**
 * Created by consensus on 4/6/14.
 */
var worldData, chandraData, observationData;

var width = document.body.clientWidth,
    height = 800,
    midWidth = document.body.clientWidth/2,
    midHeight = document.body.clientHeight/2;

var world = {height:150,width:150,scale:80}
var worldPadding = {top:20,left:20}

// World Projection
var worldProjection = d3.geo.orthographic()
    .scale(world.scale) 
    .translate([100, 100])
    .clipAngle(90);

var worldPath = d3.geo.path().projection(worldProjection);

// latitudinal and longitudinal lines
var graticule = d3.geo.graticule();

// Star Projection
// ..

var svg = d3.select('#vis').append('svg')
						.attr('width', width)
						.attr('height', height);

// star group
var starGroup = svg.append('g')
										.classed('star-group',true)

// world group
var worldGroup = svg.append('g')
										.classed('world-group', true)
										.attr('transform', 'translate(0,0)');

d3.json('../assets/world.json',function(error,data){
	if (error) {
		console.log(error);
	}
	worldData = data;
	console.log(worldData);

	worldGroup.append('path')
	    			.datum(topojson.feature(worldData, worldData.objects.land))
      			.attr('class', 'country')
      			.attr('d', worldPath);

 // worldGroup.appebnd('path')
 // 			.classed('country', true)
 //      .datum(topojson.mesh(worldData, worldData.objects.countries, function(a, b) { return a !== b; }))
 //      .attr('class', 'boundary')
 //      .attr('d', path);
loadChandraData();
	//loadObservationData();
});

var loadChandraData = function(){
	d3.json('../assets/chandraData.json',function(error,data){
		if (error) {
			console.log(error);
		}
		chandraData = data;
		loadObservationData();
	});
}

var loadObservationData = function(){
	d3.json('../assets/observationData.json',function(error,data){
		if (error) {
			console.log(error);
		}
		observationData = data;
		buildVis();
	});
}

var buildVis = function(){
	console.log(chandraData);
	console.log(observationData);
}