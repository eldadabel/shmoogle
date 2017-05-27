



function populateResults(results) {

	$("#results_page_container").css('height', 'auto');
	$("#results_page_container").css('background', 'none');

	$("#resultsCounter").html("Showing " + results.length + " results");

	if (results.length > 0) {
		for (var i=0; i<results.length; i++){
			$("#results_container").append(getResultHTML(results[i]));
		}
	} else {
		showNoResults("#results_container");
	}
	

	addTimer();

}

function getResultHTML(result) {
	var tmp = '<div class="result">';
	tmp += '<div class="originalPosition">Original position: ' + result.originalIndex + '</div>';
	tmp += '<a href="' + result.url + '" class="title">' + decodeUnicode(result.titleNoFormatting) + '</a>';
	tmp += '<div class="url">' + result.visibleUrl + '</div>';
	tmp += '<div class="content">' + decodeUnicode(result.contentNoFormatting) + '</div></div>';

	return tmp;
}


function ajaxPost(query) {

	$.ajax({
	  url: "https://shmoogle-167709.appspot.com/shmoogle/" + query,
	  success: function(data) {
	    var payload = JSON.parse(data);
        populateResults(payload);      
	  },
	  error: function(XMLHttpRequest, textStatus, errorThrown) { 
	    if (XMLHttpRequest.status == 0) {
	      alert(' Check Your Network.');
	    } else if (XMLHttpRequest.status == 404) {
	      alert('Requested URL not found.');
	    } else if (XMLHttpRequest.status == 500) {
	      alert('Internel Server Error.');
	    }  else {
	       alert('Unknow Error.\n' + XMLHttpRequest.responseText);
	    }     
	  }
});

}

