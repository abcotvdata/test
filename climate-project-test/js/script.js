/* script.js 
   Author:
   Date:
*/

// DROPDOWN/LOCATION CODE __________________________________________

	function statefilterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("stateInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("stateDropdown");
	  p = div.getElementsByTagName("p");
	  for (i = 0; i < p.length; i++) {
	    txtValue = p[i].textContent || p[i].innerText;
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
	      p[i].style.display = "";
	    } else {
	      p[i].style.display = "none";
	    }
	  }
	}

	function cityfilterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("cityInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("cityDropdown");
	  p = div.getElementsByTagName("p");
	  for (i = 0; i < p.length; i++) {
	    txtValue = p[i].textContent || p[i].innerText;
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
	      p[i].style.display = "";
	    } else {
	      p[i].style.display = "none";
	    }
	  }
	}

	function zipfilterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("zipInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("zipDropdown");
	  p = div.getElementsByTagName("p");
	  for (i = 0; i < p.length; i++) {
	    txtValue = p[i].textContent || p[i].innerText;
	    if (txtValue.toUpperCase().indexOf(filter) > -1) {
	      p[i].style.display = "";
	    } else {
	      p[i].style.display = "none";
	    }
	  }
	}	

	

//JQUERY PUTTING THE STATES IN THE DROPDOWN
$(document).ready(function(){
	var states_leng = states.length;

	for (var i=0; i<states_leng; i++) {
		//console.log(counties[i])
		$('#statedrop').append('<p abbr="'+states[i].STATE_ABBR+'" name="'+states[i].STATE+'" fips='+states[i].FIPS+'>'+ states[i].STATE +'</p>')

	}

	$("#stateInput").click(function(){
		$("#statedrop").show()
	});
});

//set empty cities array 
	
$(document).ready(function(){

	// Click on the state
	$('#statedrop p').click(function(){

		const cities = []

		$("#citydrop").empty()
		$("#cityInput").val("")

		$("#zipdrop").empty()
		$("#zipInput").val("")

		$("#statedrop").hide()
		$("#cityDropdown").show()

		if ($(window).width() >= 640) {
			$(".dropdown-content").css({"float":"left", "margin":"10px"})
		}
		

		//what state did you pick?
		var picked_state = $(this).attr("abbr")
		var picked_state_name = $(this).attr("name")


		$("#stateInput").val(picked_state_name)
		$(".location").html(picked_state_name)
		$(".gobutton").show()

		//go get the data from the API for that state
		var api_url = 'https://www.huduser.gov/hudapi/public/usps?type=2&year=2021&query=' + picked_state
		console.log(api_url)

		fetch(api_url, {
			method: 'GET',
			headers: new Headers({
				'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjBiZGI0NWIyZDAwNGRmZDgyNDliY2QwMjJhMTY0YTg3ZTY0MWZhMjMyYWZmMjBiYmE5OTUwNzgwZjUwMTJmYTk4Yjg5OWFlODU5ZWQzZDkxIn0.eyJhdWQiOiI2IiwianRpIjoiMGJkYjQ1YjJkMDA0ZGZkODI0OWJjZDAyMmExNjRhODdlNjQxZmEyMzJhZmYyMGJiYTk5NTA3ODBmNTAxMmZhOThiODk5YWU4NTllZDNkOTEiLCJpYXQiOjE2NzU3OTg2MTQsIm5iZiI6MTY3NTc5ODYxNCwiZXhwIjoxOTkxNDE3ODE0LCJzdWIiOiI0Njc3NiIsInNjb3BlcyI6W119.Ltw2S8OhuxamZL20Bc0py0peLPqnQsHHRdxA84CadezKJU1j1H8gptnxmh1aBDZhtL7tvzPApQfEsViSFa5IYQ'
			})
		}).then((response) => response.json())
		   .then((data) => {

			   	var results = data.data.results
			   	// console.log(results)

			   	var results_leng = results.length;

			   	//putting just cities into an array
			   	for (var i=0; i<results_leng; i++) {

			   		var city = results[i].city
			   		cities.push(city)
			   	}


			   	//getting rid of duplicates
			   	let uniqueCities = [...new Set(cities)].sort();

			   	var cities_leng = uniqueCities.length; 

			   	//dumping into the city dropdown menu
			   	for (var i=0; i<cities_leng; i++) {
					// console.log(city_filter[i])
					$('#citydrop').append('<p city="'+uniqueCities[i]+'">'+ uniqueCities[i] +'</p>')

				}

				$("#cityInput").click(function(){
					$("#citydrop").show()
				});	


				//which city did you pick?
				$('#citydrop').on('click', 'p', function(){

					$("#citydrop").hide()
					$("#zipDropdown").show()

					var picked_city = $(this).attr("city")
					console.log(picked_city)

					$("#cityInput").val(picked_city)

					$(".location").html(picked_city + ', ' + picked_state_name)

					var zip_filter = results.filter( element => element.city == picked_city)
					console.log(zip_filter)

					var zip_leng = zip_filter.length;

					for (var i=0; i<zip_leng; i++) {
						console.log(zip_filter[i])
						$('#zipdrop').append('<p zip="'+zip_filter[i].zip+'">'+ zip_filter[i].zip +'</p>')

					}

					$("#zipInput").click(function(){
						$("#zipdrop").show()
					});	

					$("#zipdrop").on('click', 'p', function(){
						$("#zipdrop").hide()

						var picked_zip = $(this).attr('zip')
						console.log(picked_zip)

						$("#zipInput").val(picked_zip)

						$(".location").html(picked_zip +' - '+ picked_city + ', ' + picked_state_name)

						$(".content-location").html(picked_zip +' - '+ picked_city + ', ' + picked_state_name)



					});


				}); 
				// end click on city



		   }); 
		   //end data response


	});
	//end click on state

	$(".gobutton").click(function(){
		$(this).hide()

		$(".dropdown-content").css({"float":"none", "margin":"auto"})

		$("#cityDropdown").hide()
		$("#zipDropdown").hide()

		$("#stateInput").val("")

		$("#citydrop").empty()
		$("#cityInput").val("")

		$("#zipdrop").empty()
		$("#zipInput").val("")

		$('body').css({"overflow":"scroll"});

		$('html, body').animate({
	        scrollTop: $(".content").offset().top
	    }, 1000);
	});

	$(".menu-back-to-top").click(function(){

		$('html, body').animate({
	        scrollTop: $(".header").offset().top
	    }, 1000);
	});


	$(".concern").mouseenter(function(){
		$(this).find("video").get(0).play()
	});

	$(".concern").mouseleave(function(){
		$(this).find("video").get(0).pause()
	});

	

}); 
//end document ready function


	

	



