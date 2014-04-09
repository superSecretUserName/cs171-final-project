/**
 * Created by consensus on 4/6/14.
 */
var worldData, chandraData, observationData;

var width = document.body.clientWidth,
    height = 800,
    midWidth = document.body.clientWidth/2,
    midHeight = document.body.clientHeight/2;

var world = {height:300,width:300,scale:300}
var worldPadding = {top:20,left:20}

// World Projection
var worldProjection = d3.geo.orthographic()
    .scale(world.scale) 
    .translate([(world.height+20),(world.width+20)])
    .clipAngle(90)
    .precision(.1);

var worldPath = d3.geo.path().projection(worldProjection);

// latitudinal and longitudinal lines
var graticule = d3.geo.graticule();

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

worldGroup.append('defs').append('path')
    .datum({type: 'Sphere'})
    .attr('id', 'world-path')
    .attr('d', worldPath);

worldGroup.append('use')
    .attr('class', 'world-path-stroke')
    .attr('xlink:href', '#world-path');

worldGroup.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr("d", worldPath);

var mouseDown = function(){
	console.log('mousedown');
}
var mouseMove = function(){
	console.log('mousemove');
}
var mouseUp = function(){
	console.log('mouseup');
}

d3.json('../assets/world.json',function(error,data){
	if (error) {
		console.log(error);
	}
	worldData = data;
	console.log(worldData);

	worldGroup.append('path')
	    .datum(topojson.feature(worldData, worldData.objects.land))
      .attr('class', 'country')
      .attr('d', worldPath)

	worldGroup.append('path')
	    .datum(topojson.mesh(worldData, worldData.objects.countries, function(a, b) { return a !== b; }))
      .attr('class', 'boundary')
      .attr('d', worldPath);

  worldGroup.on('mousedown', mouseDown)
    	.on('mousemove', mouseMove)
    	.on('mouseup', mouseUp);

  
  loadChandraData();
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