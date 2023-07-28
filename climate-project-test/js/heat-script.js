/* script.js 
   Author:
   Date:
*/

// COLORS FOR MAP____________________________

function getHeatColor(d) {
    return d > 100 ? '#7e0000' :
    d > 75 ? '#be0000' :
    d > 50 ? '#f38a47' :
    d > 25 ? '#fbbf2b' :
    d > 0.001 ? '#f0f723' :
    '#DADADA'
}

function get125Color(d) {
    return d > 0 ? '#be0000' :
    '#DADADA'
}

var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"


$(document).ready(function(){ // begin document.ready block

	//jquery code here

	var boundaries;

	var heat_map_1 = L.map('heat_map_1', {
		minZoom: 3,
		zoomControl: false
	}).setView([40.3596928,-99.0598404], 5);

	heat_map_1.createPane('labels');

	//tile layer
	// L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
	// 	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	// }).addTo(heat_map_1);

	var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: '&copyOpenStreetMap, &copyCartoDB'
	}).addTo(heat_map_1);

	var positronLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
	    attribution: '&copyOpenStreetMap, &copyCartoDB',
	   	pane: 'labels'
	}).addTo(heat_map_1);

	var url_counties = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"

		$.getJSON(url_counties,function(data){ //county boundary data

        	var counties = data;

         	var counties_style = {
              "fillColor": "#DADADA",
              "color": "white",
              "weight": 0.25,
              "fillOpacity": 0.7
          	};

            counties = L.geoJson(counties, {
                style: counties_style,
                // pane: "boundary",
                opacity:1,
                className: "counties"
            }).addTo(heat_map_1)

        });


	$(".scrolly-box-1").waypoint(function(dir){
		if (dir == "down") {

			$(".scrolly-bg").css({"position":"fixed"})
			var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"

			$.getJSON(url_boundary,function(data){ //county boundary data

	        	var items_boundary = data;


				items_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === "12086";
				});

				console.log(items_boundary)

	         	var boundary_style = {
	              "fillColor": "#be0000",
	              "color": "white",
	              "weight": 2,
	              "fillOpacity": 0.7
	          	};

	            boundaries = L.geoJson(items_boundary, {
	                style: boundary_style,
	                // pane: "boundary",
	                opacity:1,
	                className: "boundary"
	            }).addTo(heat_map_1)


		        var bounds = boundaries.getBounds();
	            var zoom = heat_map_1.getBoundsZoom(bounds);
	            var swPoint = heat_map_1.project(bounds.getSouthWest(), zoom);
	            var nePoint = heat_map_1.project(bounds.getNorthEast(), zoom);
	            var center = heat_map_1.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            heat_map_1.flyTo(center, (zoom));  

	            heat_map_1.on("layeradd", function (event) {
					boundaries.bringToFront();
				});	

			});
			
		} else if (dir == "up") {
			$(".scrolly-bg").css({"position":"absolute"})

			heat_map_1.flyTo([40.3596928,-99.0598404], 3).removeLayer(boundaries);
		}
	});

	$(".scrolly-text-2").waypoint(function(dir){
		if (dir == "down") {

			$("#heat_map_1").fadeOut(1000)

		} if (dir == "up") {

			$("#heat_map_1").fadeIn(1000)

		}

	});

	$(".story2").waypoint(function(dir){
		if (dir == "down") {

			heat_map_1.flyTo([40.3596928,-99.0598404], 3).removeLayer(boundaries);

		} else if (dir == "up") {

			var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"

			$.getJSON(url_boundary,function(data){ //county boundary data

	        	var items_boundary = data;


				items_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === "12086";
				});

				console.log(items_boundary)

	         	var boundary_style = {
	              "fillColor": "#B22222",
	              "color": "white",
	              "weight": 2,
	              "fillOpacity": 0.9
	          	};

	            boundaries = L.geoJson(items_boundary, {
	                style: boundary_style,
	                // pane: "boundary",
	                opacity:1,
	                className: "boundary"
	            }).addTo(heat_map_1)


		        var bounds = boundaries.getBounds();
	            var zoom = heat_map_1.getBoundsZoom(bounds);
	            var swPoint = heat_map_1.project(bounds.getSouthWest(), zoom);
	            var nePoint = heat_map_1.project(bounds.getNorthEast(), zoom);
	            var center = heat_map_1.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            heat_map_1.flyTo(center, (zoom));  

	            heat_map_1.on("layeradd", function (event) {
					boundaries.bringToFront();
				});	

			});

		}
	});

	$(".scrolly-box-3").waypoint(function(dir){

		if (dir=="down") {

			$("#heat_map_1").fadeIn(1000)

			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heatStyle(feature) {
				    return {
				        fillColor: getHeatColor(feature.properties.days_above_100_30yrs),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat = L.geoJson(items_heat, {
	                style: heatStyle,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            heat_map_1.flyTo([29.9985205,-102.3456628], 5);  


			});

		} else if (dir=="up") {
			$("#heat_map_1").fadeOut(1000)
			heat_map_1.removeLayer(heat);
			heat_map_1.removeLayer(heat125);

		}

	});

	$(".scrolly-box-4").waypoint(function(dir){

		if (dir=="down") {
			heat_map_1.flyTo([41.8899438,-81.0705978], 6);
		}

		else if (dir=="up") {
			heat_map_1.flyTo([29.9985205,-102.3456628], 5);
		}
	});

	$(".scrolly-box-5").waypoint(function(dir){

		if (dir=="down") {
			heat_map_1.removeLayer(heat);

			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heat125Style(feature) {
				    return {
				        fillColor: get125Color(feature.properties.bin_flag_today),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat125 = L.geoJson(items_heat, {
	                style: heat125Style,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            heat_map_1.flyTo([29.9985205,-102.3456628], 5);  


			});
		}

		else if (dir=="up") {
			heat_map_1.removeLayer(heat125);
			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heatStyle(feature) {
				    return {
				        fillColor: getHeatColor(feature.properties.days_above_100_30yrs),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat = L.geoJson(items_heat, {
	                style: heatStyle,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            heat_map_1.flyTo([29.9985205,-102.3456628], 5);  


			});
		}
	});


	$(".scrolly-box-6").waypoint(function(dir){

		if (dir=="down") {
			// heat_map_1.removeLayer(heat125);

			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heat125Style(feature) {
				    return {
				        fillColor: get125Color(feature.properties.bin_flag_30yrs),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat125 = L.geoJson(items_heat, {
	                style: heat125Style,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            heat_map_1.flyTo([29.9985205,-102.3456628], 5);  


			});
		}

		else if (dir=="up") {
			heat_map_1.removeLayer(heat125);
			// var url_heat = "https://raw.githubusercontent.com/abcotvdata/climate-extreme-heat/main/heatcounty.json"

			$.getJSON(url_heat,function(data){ //county boundary data

	        	var items_heat = data;

				console.log(items_heat)

	         	function heat125Style(feature) {
				    return {
				        fillColor: get125Color(feature.properties.bin_flag_today),
				        weight: 0.25,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.9
				    };
				}

	            heat125 = L.geoJson(items_heat, {
	                style: heat125Style,
	                // pane: "boundary",
	                opacity:1,
	                className: "heat"
	            }).addTo(heat_map_1)


	            heat_map_1.flyTo([29.9985205,-102.3456628], 5);  


			});
		}
	});


	$(".scrolly-text-6").waypoint(function(dir){
		if (dir == "down") {

			$("#heat_map_1").fadeOut(1000)

		} if (dir == "up") {

			$("#heat_map_1").fadeIn(1000)

		}

	});


	//CAROUSEL OF STORIES

	$.get('data/stories.csv', function(csvString) {

			var origin = window.location.origin; 

			// Use PapaParse to convert string to array of objects
	    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	console.log(stories)

	    	for (i = 0; i < stories.length; i++) {

	    		var link = origin + "/" + stories[i].story_link

	    		console.log(link)

	    		$(".carousel-row").append('<div class="carousel-tile story'+[i]+'"><a href="'+link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title"><p>'+stories[i].story_title+'</p></div></a></div>')
	    	}

	    });



}); //end document.ready block
