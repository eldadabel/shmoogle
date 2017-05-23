
var theQuery;
var queryUrlVar;
var idleTime = 0;


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
	
		$('.popdown').popdown();


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

function addTimer() {

    var idleInterval = setInterval(timerIncrement, 10000); // 10 seconds

    //Zero the idle timer on mouse movement or key press.
    $(document).mousemove(function (e) {
        idleTime = 0;
    });

    $(document).scroll(function (e) {
        idleTime = 0;
    });

    $(document).keypress(function (e) {
        idleTime = 0;
     });
}

function timerIncrement() {
    idleTime++;
    if (idleTime > 5) { // 60 seconds
        window.location = window.location.pathname;
    }
}
