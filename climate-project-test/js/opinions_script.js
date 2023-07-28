/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	//jquery code here


	// _______CAROUSEL______

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
