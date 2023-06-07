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


$.fn.extend({
   qcss: function(css) {
      return $(this).queue(function(next) {
         $(this).css(css);
         next();
      });
   }
});

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

	function countyfilterFunction() {
	  var input, filter, ul, li, a, i;
	  input = document.getElementById("countyInput");
	  filter = input.value.toUpperCase();
	  div = document.getElementById("countyDropdown");
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

//set empty counties array 
	
$(document).ready(function(){

	// Click on the state
	$('#statedrop p').click(function(){

		const counties = []

		$("#countydrop").empty()
		$("#countyInput").val("")

		$("#zipdrop").empty()
		$("#zipInput").val("")

		$("#statedrop").hide()
		$("#countyDropdown").show()

		if ($(window).width() >= 640) {
			$(".dropdown-content").css({"float":"left", "margin":"10px"})
		}
		

		//what state did you pick?
		picked_state = $(this).attr("abbr")
		picked_state_fips = Number($(this).attr("fips"))
		picked_state_name = $(this).attr("name")


		$("#stateInput").val(picked_state_name)
		$(".state_location").html(picked_state_name)
		$("#state_gobutton").show().attr("state_fips", picked_state_fips)
		$("#OR1").show()
		// $("#choose_state").css({"display":"flex"})

		//go get the data from the API for that state
		
		$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/uscounties_simple.csv', function(csvString) {

			// Use PapaParse to convert string to array of objects
	    	var county_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

	    	// console.log(county_data)

	    	filter_counties = county_data.filter(function(obj) {
            	// return the filtered value
            	return obj.state === picked_state;
          	});



			   	var filter_counties_leng = filter_counties.length;

			   	//putting just counties into an array
			   	for (var i=0; i<filter_counties_leng; i++) {

			   		var county = filter_counties[i].county_name
			   		counties.push(county)
			   		$('#countydrop').append('<p fips="'+filter_counties[i].geoid+'" county="'+filter_counties[i].county_name+'">'+ filter_counties[i].county_name +'</p>')

			   	}

			   	// console.log(counties)


				$("#countyInput").click(function(){
					$("#countydrop").show()
				});	


				//which county did you pick?
				$('#countydrop').on('click', 'p', function(){

					$("#countydrop").hide()
					$("#zipDropdown").show()
					$("#OR2").show()

					picked_county = $(this).attr("county")
					picked_county_fips = $(this).attr("fips")
					//picked_county_fips = leftPad(picked_county_fips, 5)
					picked_county_fips = Number(picked_county_fips)
					// console.log(picked_county)
					// console.log(picked_county_fips)

					$("#county_gobutton").show().attr("county_fips", picked_county_fips).attr("state_fips", picked_state_fips)

					$("#countyInput").val(picked_county)

					$(".county_location").html(picked_county + ', ' + picked_state_name)
					


					//zip county crosswalk!!
					$.get('https://raw.githubusercontent.com/abcotvdata/localizer20/main/zcta20_county20_natl_crosswalk.csv', function(csvString) {
						
						// Use PapaParse to convert string to array of objects
				    	var zip_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    	// console.log(zip_data)

				    	filter_zips = zip_data.filter(function(obj) {
			            	// return the filtered value
			            	return obj.GEOID_COUNTY_20 === picked_county_fips;
			          	});

			          	// console.log(filter_zips)

						var zip_leng = filter_zips.length;

						for (var i=0; i<zip_leng; i++) {
							// console.log(zip_filter[i])
							var zip_clean = leftPad(filter_zips[i].GEOID_ZCTA5_20, 5)
							$('#zipdrop').append('<p zip="'+zip_clean+'">'+ zip_clean +'</p>')

						}

						$("#zipInput").click(function(){
							$("#zipdrop").show()
						});	

						$("#zipdrop").on('click', 'p', function(){
							$("#zipdrop").hide()

							picked_zip = Number($(this).attr('zip'))
							// console.log(picked_zip)

							$("#zip_gobutton").show().attr("zip_fips", picked_zip).attr("county_fips", picked_county_fips).attr("state_fips", picked_state_fips)

							$("#zipInput").val(picked_zip)

							$(".zip_location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)




						});

					});


				}); 
				// end click on county



		   }); 
		   //end data response


	});
	//end click on state

	$(".gobutton").click(function(){
		$(this).hide()

		$("#begin").show()

		which_gobutton = $(this).attr("gobutton-title");
		console.log(which_gobutton)

		$(".dropdown-content").css({"float":"none", "margin":"auto"})

		$("#countyDropdown").hide()
		$("#zipDropdown").hide()
		$("#state_gobutton").hide()
		$("#county_gobutton").hide()
		$("#zip_gobutton").hide()
		$("#OR1").hide()
		$("#OR2").hide()

		$("#stateInput").val("")

		$("#countydrop").empty()
		$("#countyInput").val("")

		$("#zipdrop").empty()
		$("#zipInput").val("")

		$('body').css({"overflow":"scroll"});

		$(".content").show()

		$('html, body').animate({
	        scrollTop: $(".content").offset().top
	    }, 1000);

	    $(".header").fadeOut(1500)

		$(".content-menu").delay(1000).qcss({
	    	"position":"fixed",
	    	"top":"0px",
	    	"left":"0px"
	    	}, 1000);

		$(".content-header").delay(1000).qcss({
	    	"margin-top":"60px"
	    	}, 1000);


		//which go button did you pick??? that will determine which data it comes from



			if (which_gobutton == "state") {

				console.log(picked_state_fips)

				$(".content-location").html(picked_state_name)

				//fire state
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_state_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_state_fips;
		          	});

		          	console.log(filtered_data)

		          	$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".fire-map-link").attr("href", "risk-maps.html?state|fire|"+picked_state_fips)


				});

				//heat state
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_state_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_state_fips;
		          	});

		          	console.log(filtered_data)

		          	$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".heat-map-link").attr("href", "risk-maps.html?state|heat|"+picked_state_fips)


				});


				//flood state
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_state_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_state_fips;
		          	});

		          	console.log(filtered_data)

		          	$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".flood-map-link").attr("href", "risk-maps.html?state|flood|"+picked_state_fips)


				});

				//wind state
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_state_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_state_fips;
		          	});

		          	console.log(filtered_data)

		          	$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".wind-map-link").attr("href", "risk-maps.html?state|wind|"+picked_state_fips)


				});

				
			} else if (which_gobutton == "county") {

				console.log(picked_county_fips)

				$(".content-location").html(picked_county + ', ' + picked_state_name)

				//fire county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_county_fips;
		          	});

		          	console.log(filtered_data)

		          	$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".fire-map-link").attr("href", "risk-maps.html?county|fire|"+picked_state_fips+"|"+picked_county_fips)


				});

				//heat county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_county_fips;
		          	});

		          	console.log(filtered_data)

		          	$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".heat-map-link").attr("href", "risk-maps.html?county|heat|"+picked_state_fips+"|"+picked_county_fips)


				});


				//flood county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_county_fips;
		          	});

		          	console.log(filtered_data)

		          	$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".flood-map-link").attr("href", "risk-maps.html?county|flood|"+picked_state_fips+"|"+picked_county_fips)


				});

				//wind county
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_county_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_county_fips;
		          	});

		          	console.log(filtered_data)

		          	$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".wind-map-link").attr("href", "risk-maps.html?county|wind|"+picked_state_fips+"|"+picked_county_fips)


				});

				
			} else if (which_gobutton == "zip") {

				console.log(picked_zip)

				$(".content-location").html(picked_zip +' - '+ picked_county + ', ' + picked_state_name)

				//fire zip
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/fire_zip_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_zip;
		          	});

		          	console.log(filtered_data)

		          	$(".wildfire-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".wildfire-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".fire-map-link").attr("href", "risk-maps.html?zip|fire|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)


				});

				//heat zip
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/heat_zip_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_zip;
		          	});

		          	console.log(filtered_data)

		          	$(".heat-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".heat-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".heat-map-link").attr("href", "risk-maps.html?zip|heat|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)


				});


				//flood zip
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/flood_zip_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_zip;
		          	});

		          	console.log(filtered_data)

		          	$(".flood-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".flood-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".flood-map-link").attr("href", "risk-maps.html?zip|flood|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)


				});

				//wind zip
				$.get('https://raw.githubusercontent.com/abcotvdata/climate_risk_factors/main/data_tables/wind_zip_chart.csv', function(csvString) {

				    // Use PapaParse to convert string to array of objects
				    var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;

				    filtered_data = data.filter(function(obj) {
		            	// return the filtered value
		            	return obj.fips === picked_zip;
		          	});

		          	console.log(filtered_data)

		          	$(".wind-risk-major").html(filtered_data[0].pct_major + '%')
		          	$(".wind-risk-severe").html(filtered_data[0].pct_severe + '%')
		          	$(".wind-map-link").attr("href", "risk-maps.html?zip|wind|"+picked_state_fips+"|"+picked_county_fips+"|"+picked_zip)


				});
			}



	}); //end button click!!!!


	//___________________________menu stuff___________________________

	$(".menu-back-to-top").click(function(){

		$(".header").fadeIn(500)

		$('html, body').animate({
	        scrollTop: $(".header").offset().top
	    }, 1000).delay(1000);

	    $("body").css({"overflow":"hidden"})


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





	

}); 
//end document ready function


	

	



