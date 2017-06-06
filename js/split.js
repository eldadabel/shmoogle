

function populateResults(results, container, prefix) {

	$(".half_page").css('height', 'auto');
	$(".half_page").css('background', 'none');

	$(container + " #resultsCounter").html("Showing " + results.length + " results");

	if (results.length > 0) {
		for (var i=0; i<results.length; i++){
			$(container + " #results_container").append(getResultHTML(results[i], prefix));
		}
	} else {
		showNoResults(container + " #results_container");
	}

	addTimer();
}

function getResultHTML(result, prefix) {
	var tmp = '<div class="result">';
	tmp += '<div class="originalPosition">' + prefix + ' position: ' + result.originalIndex + '</div>';
	tmp += '<a href="' + result.visibleUrl + '" class="title">' + result.titleNoFormatting + '</a>';
	tmp += '<div class="url">' + result.visibleUrl + '</div>';
	tmp += '<div class="content">' + result.contentNoFormatting + '</div></div>';

	return tmp;
}



function ajaxPost(query) {

	$.ajax({
	  url: "https://server-dot-shmoogle-167709.appspot.com/shmoogle/" + query,
	  success: function(data) {
	    var payload = JSON.parse(data);
        populateResults(payload, ".shmoogle_results", "Shmoogle")
        populateResults(sortResults(payload), ".google_results", "Google");       
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

function sortResults(array) {
	return sortByKey(array, "originalIndex");
}

function sortByKey(array, key) {
	return array.sort(function(a, b) {
	    var x = a[key]; var y = b[key];
	    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});
}