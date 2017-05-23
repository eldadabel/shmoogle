var stub = [{
 'content': 'Eldad (Hebrew: ) may refer to: Eldad and Medad, two Biblical figures \nmentioned in the Book of Numbers; Kfar Eldad, an Israeli Communal settlement \nin the\
 .',
 'title': 'Eldad - Wikipedia',
 'url': 'https://en.wikipedia.org/wiki/Eldad',
 'originalIndex' : 4
},
{
  'content': 'Eldad (Hebrew: ) may refer to: Eldad and Medad, two Biblical figures \nmentioned in the Book of Numbers; Kfar Eldad, an Israeli Communal settlement \nin the\
 .',
 'title': 'Eldad - Wikipedia',
 'url': 'https://en.wikipedia.org/wiki/Eldad',
 'originalIndex' : 1
},
{
 'content': 'Eldad (Hebrew: ) may refer to: Eldad and Medad, two Biblical figures \nmentioned in the Book of Numbers; Kfar Eldad, an Israeli Communal settlement \nin the\
 .',
 'title': 'Eldad - Wikipedia',
 'url': 'https://en.wikipedia.org/wiki/Eldad',
 'originalIndex' : 3
},
{
 'content': 'Eldad (Hebrew: ) may refer to: Eldad and Medad, two Biblical figures \nmentioned in the Book of Numbers; Kfar Eldad, an Israeli Communal settlement \nin the\
 .',
 'title': 'Eldad - Wikipedia',
 'url': 'https://en.wikipedia.org/wiki/Eldad',
 'originalIndex' : 5
},
{
 'content': 'Eldad (Hebrew: ) may refer to: Eldad and Medad, two Biblical figures \nmentioned in the Book of Numbers; Kfar Eldad, an Israeli Communal settlement \nin the\
 .',
 'title': 'Eldad - Wikipedia',
 'url': 'https://en.wikipedia.org/wiki/Eldad',
 'originalIndex' : 2
}];

var theQuery;
var queryUrlVar;


$( document ).ready(function() {

	queryUrlVar = getUrlParameter('q');

	if (queryUrlVar != undefined) {
		preformSearch(queryUrlVar);
	} else {
		$("#main_page_container").show();
	}
	
	$(".submit_btn").click(function() {
  		if(checkInput()){
  			addToURL(returnInput());
  		}
	});

	$('body').keypress(function (e) {
	 var key = e.which;
	 if(key == 13)  // the enter key code
	  {
	    if(checkInput()){
  			addToURL(returnInput());
  		}
	    return false;  
	  }
	});   
	

    
});

function checkInput(){
	if ($("#main_input_field").val() != "" || $("#results_input_field").val() != ""){
		return true;
	} 

	return false;
}

function returnInput() {
	if ($("#main_input_field").val() != "") {
		return $("#main_input_field").val();
	} 

	if ($("#results_input_field").val() != "") {
		return $("#results_input_field").val();
	}

	return false; 
}

function preformSearch(query){
 	theQuery = query;
 	$("#main_page_container").hide();
	$("#results_page_container").show();

	$("#results_input_field").val(query);
	if (queryUrlVar == undefined){
		addToURL(query);
	} 

	ajaxPost(query);

}


function populateResults(results) {

	$("#results_page_container").css('height', 'auto');
	$("#results_page_container").css('background', 'none');

	$("#resultsCounter").html("Showing " + results.length + " results");

	for (var i=0; i<results.length; i++){
		$("#results_container").append(getResultHTML(results[i]));
	}

}

function getResultHTML(result) {
	var tmp = '<div class="result">';
	tmp += '<div class="originalPosition">Original position: ' + result.originalIndex + '</div>';
	tmp += '<a href="' + result.url + '" class="title">' + decodeUnicode(result.titleNoFormatting) + '</a>';
	tmp += '<div class="url">' + result.visibleUrl + '</div>';
	tmp += '<div class="content">' + decodeUnicode(result.contentNoFormatting) + '</div></div>';

	return tmp;
}

function decodeUnicode(string)
{
	var tmp = string;
	//decodeURIComponent(JSON.parse('"' + tmp.replace(/\"/g, '\\"') + '"'));
	return tmp;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function addToURL(query)
{
	var urlString = window.location.href;

	if (urlString.indexOf("?q=") != -1) {
		urlString = urlString.slice(0, urlString.indexOf("?q="))
	}

	urlString += "?q=" + query;

    window.location.href = urlString;
}

function logResults(json){
  console.log(json);
}

function myJsonMethod(response){
  console.log (response);
}

function ajaxPost(query)
{
	/*
	$.ajax({type: "POST",
            crossDomain : true,
            url: "https://shmoogle-165417.appspot.com/shmoogle/cats?callback=?",
            async: false,
    jsonpCallback: 'jsonCallback', 
    contentType: "application/json",
    dataType: 'jsonp',
    success: function(json) {
       console.dir(json.sites);
    },
    error: function(e) {
       console.log(e.message);
    }
    }); 




	$.getJSON( "https://shmoogle-165417.appspot.com/shmoogle/" + query + "?callback=?", function( json ) {
	  console.log( "JSON Data: " + json );
	 });
*/
	$.get("https://shmoogle-165417.appspot.com/shmoogle/" + query , function(data){
        var payload = JSON.parse(data);
        populateResults(payload);
    });
 /*
	$.ajax({
			url: "https://shmoogle-165417.appspot.com/shmoogle/" + query ,
			type: "GET",
			dataType: 'text',
			contentType: "application/json",


			success: function(json){

				if (json.status == "200"){
					

						populateResults(json.payload);
					
				} else
				{
					

				}

			},
			error: function(data) { 
				console.log(data);
			} 

			
		});
	*/	
}