/**
 * Created by consensus on 4/6/14.
 */
var worldData, chandraData, observationData, globePaths, rotating, m0, m1, delta = [],c0 = [0,0];

var width = 200,
    height = 200,
    midWidth = document.body.clientWidth/2,
    midHeight = document.body.clientHeight/2;

var world = {scale:100}
var worldPadding = {top:20,left:20}

// World Projection
var worldProjection = d3.geo.orthographic()
    .scale(world.scale) 
    .translate([width/2,height/2])
    .rotate(c0)
    .clipAngle(90)
    .precision(.1)

var worldPath = d3.geo.path().projection(worldProjection);

// latitudinal and longitudinal lines
var graticule = d3.geo.graticule();

var worldSvg = d3.select('#vis').append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('class','world');

// world group
var worldGroup = worldSvg.append('g')
		.classed('world-group', true)
		.attr('transform', 'translate(0,0)');

// scales
var lonScale = d3.scale.linear()
    .domain([0, width])
    .rangeRound([-180, 180]);

var latScale = d3.scale.linear()
    .domain([0, height])
    .rangeRound([90, -90]);

// defs 

var defs = worldGroup.append('defs');
		
defs.append('path')
    .datum({type: 'Sphere'})
    .attr('id', 'world-path')
    .attr('d', worldPath);

worldGroup.append('use')
    .attr('class', 'world-path-stroke')
    .attr('xlink:href', '#world-path');

// add longitude,latitude
worldGroup.append('path')
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', worldPath);

////// Rotate functions

var moveDelta = function(ch){
	if (ch) {
		var cd0 = c0[0] - ch[0];
		var cd1 = c0[1] - ch[1];
		moveTo([cd0,cd1]);
	}
}
var moveTo = function(coords){
	if (!coords) return;
	worldProjection.rotate(coords);
	globePaths.attr('d', worldPath);
	c0 = coords;
	console.log('new coords: '+c0);
}
var mouseDown = function(){
	rotating = true;
	var mouse = d3.mouse(this);
	m0 = [latScale(mouse[0]),lonScale(mouse[1])];
}
var mouseMove = function(){
	if (rotating) {
		var mouse = d3.mouse(this);
		m1 = [latScale(mouse[0]),lonScale(mouse[1])];
		if (m0[0] != m1[0] || m0[1] != m1[1]) {
			delta[0] = m1[0]-m0[0];
			delta[1] = m1[1]-m0[1];
			moveDelta(delta);
		}
		m0 = m1;
	}
}
var mouseUp = function(){
	rotating = false;
}

d3.selectAll('#vis').append('button').attr('class','click-button').text('reset').on('click', function(){
	var coords = [0,0];
	moveTo(coords);
});

////// end rotate functions

worldSvg.on('mousedown', mouseDown)
		.on('mousemove', mouseMove)
		.on('mouseup', mouseUp)
		.on('mouseout', mouseUp);

d3.json('../assets/world.json',function(error,data){
	if (error) {
		console.log(error);
	}
	worldData = data;

	// display world data
	worldGroup.append('path')
	    .datum(topojson.feature(worldData, worldData.objects.land))
      .attr('class', 'country')
      .attr('d', worldPath);

	worldGroup.append('path')
	    .datum(topojson.mesh(worldData, worldData.objects.countries))
      .attr('class', 'boundary')
      .attr('d', worldPath);

	globePaths = worldSvg.selectAll('path');	
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