/* script.js 
   Author:
   Date:
*/

//padding
function leftPad(value, length) { 
    return ('0'.repeat(length) + value).slice(-length); 
}

// DROPDOWN/LOCATION CODE __________________________________________

var picked_state;
var picked_state_fips;
var picked_state_name;
var picked_county;
var picked_county_fips;
var picked_zip;
var which_gobutton;


// COLORS FOR MAP____________________________

function getColor(d) {
    return d > 90 ? '#0d0787' :
    d > 80 ? '#6703a5' :
    d > 70 ? '#8b169a' :
    d > 60 ? '#ac2790' :
    d > 50 ? '#c2407d' :
    d > 40 ? '#d8586a' :
    d > 30 ? '#f38a47' :
    d > 20 ? '#fbbf2b' :
    d > 10 ? '#f5dd27' :
    '#f0f723';
}

	


$(document).ready(function(){
	//___________________________menu stuff___________________________

	$(".menu-back-to-top").click(function(){

		$(".header").fadeIn(500)

		$('html, body').animate({
	        scrollTop: $(".header").offset().top
	    }, 1000).delay(1000);

	    // $("body").css({"overflow":"hidden"})


		$(".content-menu").css({
	    	"position":"relative",
	    	"top":"0px",
	    	"left":"0px"
	    	});

		$(".content-header").css({
	    	"margin-top":"0px"
	    	});

	});



	$(".concern").mouseenter(function(){
		$(this).find("video").get(0).play()
	});

	$(".concern").mouseleave(function(){
		$(this).find("video").get(0).pause()
	});

	//______________________________________________generic stuff______________________________________________

	$(".click-more-info-map").click(function(){
		$(".popup-background").show()
		$("body").css({"overflow":"hidden"})
	});

	$(".exit").click(function(){
		$(".popup-background").hide()
		$("body").css({"overflow":"scroll"})
	});



	//_____________________________title stuff____________________________

	$("#card").flip({
	  axis: 'x',
	  trigger: 'manual'
	});

	var flipcount = 0
	// console.log(flipcount)

	$("#card").each(function (i) {
        var el = $(this);
        setInterval(function () {
            el.flip('toggle');

            var flip = $("#card").data("flip-model");

            if (flipcount == 3) {
            	flipcount = 0
            } else {
            	flipcount = Number(flipcount)+1
            }

            if (flipcount == 0) {
            	$(".front").html("live")
            	$(".back").html("learn")
            } else if (flipcount == 1) {
            	$(".front").html("live")
            	$(".back").html("work")
            } else if (flipcount == 2) {
            	$(".front").html("play")
            	$(".back").html("work")
            } else if (flipcount == 3) {
            	$(".front").html("play")
            	$(".back").html("learn")
            }

            

			// e.g. to see currect flip state
			// console.log(flipcount)
        }, 1000);

            
    });


	//_______________________________MAP PAGE HEADER____________________________________

	var queryString = location.search.substring(1);
	// console.log(queryString)

	var string_split = queryString.split("|");
	// console.log(string_split)

	var geo_type = string_split[0];
	console.log(geo_type)

	var risk_type = ""
	risk_type = string_split[1];

	console.log(risk_type)
	

	// tab styling!!!

	if (risk_type == "fire") {
		$(".fire-tab").css({"background-color":"#0d0787", "color":"white", "box-shadow":"0px 0px 3px #000000"})
		$(".heat-tab").css({"background-color":"#ffba00"})
		$(".flood-tab").css({"background-color":"#ffba00"})
		$(".wind-tab").css({"background-color":"#ffba00"})

		$(".risk_type_title").html("fire");

	}

	else if (risk_type == "heat") {
		$(".fire-tab").css({"background-color":"#ffba00"})
		$(".heat-tab").css({"background-color":"#0d0787", "color":"white", "box-shadow":"0px 0px 3px #000000"})
		$(".flood-tab").css({"background-color":"#ffba00"})
		$(".wind-tab").css({"background-color":"#ffba00"})

		$(".risk_type_title").html("heat");

	}

	else if (risk_type == "flood") {
		$(".fire-tab").css({"background-color":"#ffba00"})
		$(".heat-tab").css({"background-color":"#ffba00"})
		$(".flood-tab").css({"background-color":"#0d0787", "color":"white", "box-shadow":"0px 0px 3px #000000"})
		$(".wind-tab").css({"background-color":"#ffba00"})

		$(".risk_type_title").html("flooding");

	}

	else if (risk_type == "wind") {
		$(".fire-tab").css({"background-color":"#ffba00"})
		$(".heat-tab").css({"background-color":"#ffba00"})
		$(".flood-tab").css({"background-color":"#ffba00"})
		$(".wind-tab").css({"background-color":"#0d0787", "color":"white", "box-shadow":"0px 0px 3px #000000"})

		$(".risk_type_title").html("wind");

	}



	if (geo_type == "state") {

		picked_state_fips = string_split[2];
		// console.log(picked_state_fips)


		filtered_state = states.filter(function(obj) {
        	// return the filtered value
        	return obj.FIPS === Number(picked_state_fips);
      	});

      	picked_state_name = filtered_state[0].STATE

      	console.log(picked_state_name)

      	$(".content-location").html(picked_state_name)

	} else if (geo_type == "county") {


		picked_state_fips = string_split[2];
		picked_county_fips = string_split[3];
		console.log(picked_state_fips)
		console.log(picked_county_fips)

		$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/uscounties_simple.csv', function(csvString) {

			// Use PapaParse to convert string to array of objects
	    	var county_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(county_data)

	    	filter_counties = county_data.filter(function(obj) {
            	// return the filtered value
            	return obj.geoid === Number(picked_county_fips);
          	});

          	// console.log(filter_counties)

          	picked_state_name = filter_counties[0].state_name
          	picked_county = filter_counties[0].county_name

          	$(".content-location").html(picked_county + ', ' + picked_state_name)

	    });

	} else if (geo_type == "zip") {

		picked_state_fips = string_split[2];
		picked_county_fips = string_split[3];
		picked_zip = string_split[4];
		console.log(picked_state_fips)
		console.log(picked_county_fips)
		console.log(picked_zip)

		$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/uscounties_simple.csv', function(csvString) {

			// Use PapaParse to convert string to array of objects
	    	var county_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(county_data)

	    	filter_counties = county_data.filter(function(obj) {
            	// return the filtered value
            	return obj.geoid === Number(picked_county_fips);
          	});

          	// console.log(filter_counties)

          	picked_state_name = filter_counties[0].state_name
          	picked_county = filter_counties[0].county_name


          	$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta20_county20_natl_crosswalk.csv', function(csvString) {
						
				// Use PapaParse to convert string to array of objects
		    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

		    	console.log(picked_zip)

		    	filter_zips_for_county = zip_data.filter(function(obj) {
	            	// return the filtered value
	            	return obj.GEOID_COUNTY_20 === Number(picked_county_fips);
	          	});

	          	filter_zips = filter_zips_for_county.filter(function(obj) {
	            	// return the filtered value
	            	return obj.GEOID_ZCTA5_20 === Number(picked_zip);
	          	});

	          	console.log(filter_zips)

	          	$(".content-location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)

			});

	    });
		

	} // end if else


	//___________BUILD MAP!___________

	var map = L.map('map', {
		minZoom: 3,
		zoomControl: false
	}).setView([40.3596928,-99.0598404], 5);

	var pane = map.createPane('boundary', document.getElementById('map'));

	L.control.zoom({
		position: 'topright'
	}).addTo(map)



	//tile layer
	L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
	}).addTo(map);


	if (geo_type == "state") {

		picked_state_fips = string_split[2];
		console.log(picked_state_fips)

		var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
		console.log(url)


		$.getJSON(url,function(data){

        	var items = data;

        	// console.log(items.features)

			// items = data.features.filter(function(obj) {
			// // return the filtered value
			// return obj.properties.state === leftPad(String(picked_state_fips), 2);
			// });

         	// console.log(items)

         	function majorStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_major),
			        weight: 0.5,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}

			function severeStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_severe),
			        weight: 0.5,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}

			// var geojsonLayer = L.geoJson.ajax(url);

	        var major = L.geoJson(items, {
	            style: majorStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindPopup('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style', direction: 'auto', sticky: 'true', interactive: 'true'})
	            }

	        }).addTo(map);

	        var severe = L.geoJson(items, {
	            style: severeStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }); //.addTo(map)


	        var risk_severity = {
			    "Major risk": major,
			    "Severe risk": severe
			};

			var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);

	        var bounds = major.getBounds();
            var zoom = map.getBoundsZoom(bounds);
            var swPoint = map.project(bounds.getSouthWest(), zoom);
            var nePoint = map.project(bounds.getNorthEast(), zoom);
            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
            map.flyTo(center, (zoom));  


    

	         

      });


	} else if (geo_type == "county") {


		picked_state_fips = string_split[2];
		picked_county_fips = string_split[3];
		console.log(picked_state_fips)
		console.log(picked_county_fips)


		var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
		console.log(url)

		var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"
		console.log(url)

		$.getJSON(url,function(data){ //actual tract data

        	var items = data;

        	// console.log(items.features)

			items = data.features.filter(function(obj) {
			// return the filtered value
			return obj.properties.state === leftPad(String(picked_state_fips), 2);
			});

         	// console.log(items)

         	function majorStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_major),
			        weight: 0.5,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}

			function severeStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_severe),
			        weight: 0.5,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}


	        var major = L.geoJson(items, {
	            style: majorStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }).addTo(map);

	        var severe = L.geoJson(items, {
	            style: severeStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }); //.addTo(map)


	        var risk_severity = {
			    "Major risk": major,
			    "Severe risk": severe
			};

			var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);


		});

		$.getJSON(url_boundary,function(data){ //county boundary data

        	var items_boundary = data;


			items_boundary = data.features.filter(function(obj) {
			// return the filtered value
			return obj.properties.geoid === leftPad(String(picked_county_fips), 5);
			});

			console.log(items_boundary)

         	var boundary_style = {
              "fillColor": "none",
              "color": "black",
              "weight": 2,
              "fillOpacity": 0.9
          	};

            var boundaries = L.geoJson(items_boundary, {
                style: boundary_style,
                // pane: "boundary",
                opacity:1,
                className: "boundary"
            }).addTo(map)


	        var bounds = boundaries.getBounds();
            var zoom = map.getBoundsZoom(bounds);
            var swPoint = map.project(bounds.getSouthWest(), zoom);
            var nePoint = map.project(bounds.getNorthEast(), zoom);
            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
            map.flyTo(center, (zoom));  

            map.on("layeradd", function (event) {
				boundaries.bringToFront();
			});	

		});

		




	} else if (geo_type == "zip") {

		picked_state_fips = string_split[2];
		picked_county_fips = string_split[3];
		picked_zip = string_split[4];
		console.log(picked_state_fips)
		console.log(picked_county_fips)
		console.log(picked_zip)


		var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
		console.log(url)

		var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/all_zips.geojson"
		console.log(url)

		$.getJSON(url,function(data){ //actual tract data

        	var items = data;

        	// console.log(items.features)

			items = data.features.filter(function(obj) {
			// return the filtered value
			return obj.properties.county === leftPad(String(picked_county_fips), 5);
			});

         	// console.log(items)

         	function majorStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_major),
			        weight: 0.5,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}

			function severeStyle(feature) {
			    return {
			        fillColor: getColor(feature.properties.pct_severe),
			        weight: 0.5,
			        opacity: 1,
			        color: 'white',
			        fillOpacity: 0.7
			    };
			}


	        var major = L.geoJson(items, {
	            style: majorStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }).addTo(map);

	        var severe = L.geoJson(items, {
	            style: severeStyle,
	            // pane: "polygonsPane",
	            opacity:1,
	            className: "polygons",

	            // add tooltips_________________________________________

	            onEachFeature: function (feature, layer) {
	            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
	            }

	        }); //.addTo(map)


	        var risk_severity = {
			    "Major risk": major,
			    "Severe risk": severe
			};

			var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);


		});

		$.getJSON(url_boundary,function(data){ //zip boundary data

        	var items_boundary = data;
			
			console.log(items_boundary)

			items_boundary = data.features.filter(function(obj) {
			// return the filtered value
			return obj.properties.geoid === leftPad(String(picked_zip), 5);
			});

			

         	var boundary_style = {
              "fillColor": "none",
              "color": "black",
              "weight": 2,
              "fillOpacity": 0.9
          	};

            var boundaries = L.geoJson(items_boundary, {
                style: boundary_style,
                // pane: "boundary",
                opacity:1,
                className: "boundary"
            }).addTo(map)


	        var bounds = boundaries.getBounds();
            var zoom = map.getBoundsZoom(bounds);
            var swPoint = map.project(bounds.getSouthWest(), zoom);
            var nePoint = map.project(bounds.getNorthEast(), zoom);
            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
            map.flyTo(center, (zoom-2));  

            map.on("layeradd", function (event) {
				boundaries.bringToFront();
			});	


		});
		

	} // end initial MAP if else


//CHANGE MAP ON CLICK________________________________________________________


	$(".map-tab").click(function(){
		var tab_risk_type = $(this).attr("risk_type")
		var tab_risk_type_long = $(this).attr("risk_type_long")
		risk_type = tab_risk_type

		$(this).css({"background-color":"#0d0787", "color":"white", "box-shadow":"0px 0px 3px #000000"})
		$(".map-tab").not(this).css({"background-color":"#ffba00", "box-shadow":"none", "color":"black"})

		$(".risk_type_title").html(tab_risk_type_long);

		console.log(risk_type)

		$(".leaflet-overlay-pane svg g").empty()
		$(".leaflet-right").empty()

		if (geo_type == "state") {

			picked_state_fips = string_split[2];
			console.log(picked_state_fips)

			var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
			console.log(url)

			$.getJSON(url,function(data){

	        	var items = data;

	        	// console.log(items.features)

				// items = data.features.filter(function(obj) {
				// // return the filtered value
				// return obj.properties.state === leftPad(String(picked_state_fips), 2);
				// });

	         	// console.log(items)

	         	function majorStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_major),
				        weight: 0.5,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}

				function severeStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_severe),
				        weight: 0.5,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}


		        var major = L.geoJson(items, {
		            style: majorStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }).addTo(map);

		        var severe = L.geoJson(items, {
		            style: severeStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }); //.addTo(map)


		        var risk_severity = {
				    "Major risk": major,
				    "Severe risk": severe
				};

				var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);

		        var bounds = major.getBounds();
	            var zoom = map.getBoundsZoom(bounds);
	            var swPoint = map.project(bounds.getSouthWest(), zoom);
	            var nePoint = map.project(bounds.getNorthEast(), zoom);
	            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            map.flyTo(center, (zoom));  


	    

		         

	      });


		} else if (geo_type == "county") {


			picked_state_fips = string_split[2];
			picked_county_fips = string_split[3];
			console.log(picked_state_fips)
			console.log(picked_county_fips)


			var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
			console.log(url)

			var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/counties.geojson"
			console.log(url)

			$.getJSON(url,function(data){ //actual tract data

	        	var items = data;

	        	// console.log(items.features)

				/*items = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.state === leftPad(String(picked_state_fips), 2);
				});*/

	         	// console.log(items)

	         	function majorStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_major),
				        weight: 0.5,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}

				function severeStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_severe),
				        weight: 0.5,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}


		        var major = L.geoJson(items, {
		            style: majorStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }).addTo(map);

		        var severe = L.geoJson(items, {
		            style: severeStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }); //.addTo(map)


		        var risk_severity = {
				    "Major risk": major,
				    "Severe risk": severe
				};

				var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);


			});

			$.getJSON(url_boundary,function(data){ //county boundary data

	        	var items_boundary = data;


				items_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === leftPad(String(picked_county_fips), 5);
				});

				console.log(items_boundary)

	         	var boundary_style = {
	              "fillColor": "none",
	              "color": "black",
	              "weight": 2,
	              "fillOpacity": 0.9
	          	};

	            var boundaries = L.geoJson(items_boundary, {
	                style: boundary_style,
	                // pane: "boundary",
	                opacity:1,
	                className: "boundary"
	            }).addTo(map)


		        var bounds = boundaries.getBounds();
	            var zoom = map.getBoundsZoom(bounds);
	            var swPoint = map.project(bounds.getSouthWest(), zoom);
	            var nePoint = map.project(bounds.getNorthEast(), zoom);
	            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            map.flyTo(center, (zoom));  

	            map.on("layeradd", function (event) {
					boundaries.bringToFront();
				});	


			});



		} else if (geo_type == "zip") {

			picked_state_fips = string_split[2];
			picked_county_fips = string_split[3];
			picked_zip = string_split[4];
			console.log(picked_state_fips)
			console.log(picked_county_fips)
			console.log(picked_zip)


			var url = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/" + risk_type + "tracts_"+leftPad(String(picked_state_fips), 2)+".geojson"
			console.log(url)

			var url_boundary = "https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_geojson/all_zips.geojson"
			console.log(url)

			$.getJSON(url,function(data){ //actual tract data

	        	var items = data;

	        	// console.log(items.features)

				items = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.county === leftPad(String(picked_county_fips), 5);
				});

	         	// console.log(items)

	         	function majorStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_major),
				        weight: 0.5,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}

				function severeStyle(feature) {
				    return {
				        fillColor: getColor(feature.properties.pct_severe),
				        weight: 0.5,
				        opacity: 1,
				        color: 'white',
				        fillOpacity: 0.7
				    };
				}


		        var major = L.geoJson(items, {
		            style: majorStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_major+'%</span> are at major risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }).addTo(map);

		        var severe = L.geoJson(items, {
		            style: severeStyle,
		            // pane: "polygonsPane",
		            opacity:1,
		            className: "polygons",

		            // add tooltips_________________________________________

		            onEachFeature: function (feature, layer) {
		            	layer.bindTooltip('<div class="tooltip-headline">'+feature.properties.name+'</div><div class="tooltip-content">Out of <span class="tooltip-bold">'+feature.properties.count_property.toLocaleString("en-US")+'</span> properties in this area, <span class="tooltip-bold">'+feature.properties.pct_severe+'%</span> are at severe risk for '+risk_type+'.</div><div class="tooltip-source"><a href="https://firststreet.org/" target="_blank">Look up your address at First Street Foundation</a></div>', {className: 'tooltip-style'})
		            }

		        }); //.addTo(map)


		        var risk_severity = {
				    "Major risk": major,
				    "Severe risk": severe
				};

				var layerControl = L.control.layers(risk_severity, null, {position: 'bottomright', collapsed: false}).addTo(map);


			});

			$.getJSON(url_boundary,function(data){ //zip boundary data

	        	var items_boundary = data;
				
				console.log(items_boundary)

				items_boundary = data.features.filter(function(obj) {
				// return the filtered value
				return obj.properties.geoid === leftPad(String(picked_zip), 5);
				});

				

	         	var boundary_style = {
	              "fillColor": "none",
	              "color": "black",
	              "weight": 2,
	              "fillOpacity": 0.9
	          	};

	            var boundaries = L.geoJson(items_boundary, {
	                style: boundary_style,
	                // pane: "boundary",
	                opacity:1,
	                className: "boundary"
	            }).addTo(map)


		        var bounds = boundaries.getBounds();
	            var zoom = map.getBoundsZoom(bounds);
	            var swPoint = map.project(bounds.getSouthWest(), zoom);
	            var nePoint = map.project(bounds.getNorthEast(), zoom);
	            var center = map.unproject(swPoint.add(nePoint).divideBy(2), zoom);
	            map.flyTo(center, (zoom-2)); 

	            map.on("layeradd", function (event) {
					boundaries.bringToFront();
				});	 


			});
			

		} // end click to change MAP if else
	});

//mobile map description 

	$(".map-subheader-mobile").click(function(){
		$(".map-subheader").slideDown()
		$(this).hide()
		$(".map-subheader-mobile-hide").show()
	});

	$(".map-subheader-mobile-hide").click(function(){
		$(".map-subheader").slideUp()
		$(this).hide()
		$(".map-subheader-mobile").show()
	});


//CAROUSEL OF STORIES

	$.get('data/stories.csv', function(csvString) {

			// Use PapaParse to convert string to array of objects
	    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	console.log(stories)

	    	for (i = 0; i < stories.length; i++) {
	    		$(".carousel-row").append('<div class="carousel-tile story'+[i]+'"><a href="'+stories[i].story_link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title">'+stories[i].story_title+'</div></a></div>')
	    	}

	    });

	

}); 
//end document ready function


	

	



