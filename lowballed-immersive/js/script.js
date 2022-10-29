/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	//build blank map

	var map = L.map('map').setView([50.8513826,-118.2170459], 3);

	//tile layer
	L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 20,
	}).addTo(map);


	$('.startscrolly').waypoint(function(dir){

		if (dir == "down") {

			console.log("SCROLL DOWN")

			$(".outermap").css({"position":"fixed", "top":"0", "left":"0", "z-index":"-1"})

		} else if (dir == "up") {

			console.log("SCROLL UP")

			$(".outermap").css({"position":"relative"})

		}

	});


	$(".scrollbox1").waypoint(function(dir){
		
		if (dir == "down") {

			console.log("SCROLL 1 DOWN")

		} else if (dir == "up") {

			console.log("SCROLL 1 UP")
		}
		
	}, { offset: '100%' });


	$(".scrollbox2").waypoint(function(dir){
		
		if (dir == "down") {

			map.flyTo([40.6166386,-74.799314], 8, {animate:true, duration:1.5});

		} else if (dir == "up") {
			
			map.flyTo([50.8513826,-118.2170459], 3, {animate:true , duration:1.5});

		}
		
	}, { offset: '100%' });


	$(".scrollbox3").waypoint(function(dir){
		
		if (dir == "down") {

			map.flyTo([35.9209034,-79.4994774], 8, {animate:true, duration:1.5});

		} else if (dir == "up") {
			
			map.flyTo([40.6166386,-74.799314], 8, {animate:true , duration:1.5});

		}
		
	}, { offset: '100%' });


	$(".scrollbox4").waypoint(function(dir){
		
		if (dir == "down") {

			map.flyTo([29.7050148,-94.8108052], 8, {animate:true, duration:1.5});

		} else if (dir == "up") {
			
			map.flyTo([35.9209034,-79.4994774], 8, {animate:true , duration:1.5});

		}
		
	}, { offset: '100%' });


	$(".scrollbox5").waypoint(function(dir){
		
		if (dir == "down") {

			map.flyTo([33.9491484,-116.9440362], 8, {animate:true, duration:1.5});

		} else if (dir == "up") {
			
			map.flyTo([29.7050148,-94.8108052], 8, {animate:true , duration:1.5});

		}
		
	}, { offset: '100%' });

}); //end document.ready block
