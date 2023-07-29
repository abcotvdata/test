/* script.js 
   Author:
   Date:
*/


$(document).ready(function(){ // begin document.ready block

	//jquery code here


	// _______CAROUSEL______

	$.get('data/stories.csv', function(csvString) {

			var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;

            console.log(url)

			// Use PapaParse to convert string to array of objects
	    	var stories = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(stories)

	    	for (i = 0; i < stories.length; i++) {

	    		var link = url + stories[i].story_link

	    		// console.log(link)

	    		$(".carousel-row").append('<div class="carousel-tile story'+[i]+'"><a href="'+link+'" target="_blank"><img src="'+stories[i].story_img+'"><div class="story-title"><p>'+stories[i].story_title+'</p></div></a></div>')
	    	}

	    });

}); //end document.ready block
