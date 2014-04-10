/**
 * Created by consensus on 4/6/14.
 */
var worldData, chandraData, observationData, globePaths, rotating, m0, m1, delta = [],c0 = [0,0];

var world = {width:200,height:200,scale:100}

var star = {width:900, height:500, scale: 800}

// latitudinal and longitudinal lines
var graticule = d3.geo.graticule();

// scales
var lonScale = d3.scale.linear()
    .domain([0, world.width])
    .rangeRound([-180, 180]);

var latScale = d3.scale.linear()
    .domain([0, world.height])
    .rangeRound([90, -90]);

// World Projection
var worldProjection = d3.geo.orthographic()
    .scale(world.scale) 
    .translate([world.width/2,world.height/2])
    .rotate(c0)
    .clipAngle(90)
    .precision(.1)

// world path
var worldPath = d3.geo.path().projection(worldProjection);

// world svg
var worldSvg = d3.select('#vis').append('svg')
		.attr('width', world.width)
		.attr('height', world.height)
		.attr('class','world');

// world group
var worldGroup = worldSvg.append('g')
		.classed('world-group', true);

// world defs 
var worldDefs = worldGroup.append('defs');
		
	worldDefs.append('path')
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

// World Projection
var starProjection = d3.geo.orthographic()
    .scale(star.scale) 
    .translate([star.width/2,star.height/2])
    // .rotate(c0)
    .clipAngle(90)
    .precision(.1);

var starPath = d3.geo.path().projection(starProjection).pointRadius(3);

var starSvg = d3.select('#vis').append('svg')
		// .attr('width', star.width)
		// .attr('height', star.height)
		.attr('class','stars');

var starGroup = starSvg.append('g')
		.classed('star-group', true);

// world defs  !to be removed!
var starDefs = starGroup.append('defs');
		
starDefs.append('path')
    .datum({type: 'Sphere'})
    .attr('id', 'star-path')
    .attr('d', starPath);

starGroup.append('use')
    .attr('class', 'star-path-stroke')
    .attr('xlink:href', '#star-path');

// add longitude,latitude
starGroup.append('path')
    .datum(graticule)
    .attr('class', 'star-graticule')
    .attr('d', starPath);

var starsGroup = starSvg.append('g')
		.classed('stars-group', true);

////// Rotate functions

var moveDelta = function(ch){
	if (ch) {
		// globe
		var cd0 = c0[0] - ch[0];
		var cd1 = c0[1] - ch[1];
		// stars
		var s0 = ch[0] - c0[0];
		var s1 = c0[1] - ch[1];
		moveTo([cd0,cd1],[s0,s1]);
	}
}
var moveTo = function(gCoords,sCoords){
	if (!gCoords || !sCoords) return;
	// world coords
	worldProjection.rotate(gCoords);
	globePaths.attr('d', worldPath);
	// star coords
	starProjection.rotate(sCoords);
	starPaths.attr('d', starPath);
	c0 = gCoords;
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
	moveTo(coords,coords);
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
		buildStarMap();
	});
}

var buildStarMap = function(){
	console.log(chandraData);
	//console.log(observationData);

	// star points
	var circles = starsGroup.selectAll('path')
			.data(chandraData.geoCoords)
			.enter()
			.append('svg:path')
			.attr('class', function(d){
				//console.log(d);
				return 'star-point';
			})
			.attr('d', starPath)
			.on('mouseover', function(d){
				console.log(d);
				console.log('test mouse over');
			})
			.on('mouseout', function(d){
				console.log(d);
				console.log('mouse out');
			});

	starPaths = starSvg.selectAll('path');
}
