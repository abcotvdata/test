/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	//jquery code here


	// _______CAROUSEL______

	$.get('data/stories.csv', function(csvString) {

			// Use PapaParse to convert string to array of objects
	    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(stories)

	    	for (i = 0; i < stories.length; i++) {
	    		$(".carousel-row").append('<div class="carousel-tile story'+[i]+'"><a href="'+stories[i].story_link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title">'+stories[i].story_title+'</div></a></div>')
	    	}

	    });

}); //end document.ready block
