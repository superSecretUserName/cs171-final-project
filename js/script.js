/**
 * Created by consensus on 4/6/14.
 */
/**
 * all that cool JS goes here!
 */

var chandraData, observationData;

d3.json('../assets/chandraData.json',function(error,data){
	if (error) {
		console.log(error);
	}
	chandraData = data;
	loadObservationData();
});

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