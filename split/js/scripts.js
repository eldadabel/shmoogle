

function populateResults(results, container, prefix) {

	$(".half_page").css('height', 'auto');
	$(".half_page").css('background', 'none');

	$(container + " #resultsCounter").html("Showing " + results.length + " results");

	for (var i=0; i<results.length; i++){
		$(container + " #results_container").append(getResultHTML(results[i], prefix));
	}

	addTimer();
}

function getResultHTML(result, prefix) {
	var tmp = '<div class="result">';
	tmp += '<div class="originalPosition">' + prefix + ' position: ' + result.originalIndex + '</div>';
	tmp += '<a href="' + result.url + '" class="title">' + result.titleNoFormatting + '</a>';
	tmp += '<div class="url">' + result.visibleUrl + '</div>';
	tmp += '<div class="content">' + result.contentNoFormatting + '</div></div>';

	return tmp;
}



function ajaxPost(query)
{
	
	$.get("https://shmoogle-167709.appspot.com/shmoogle/" + query , function(data){
        var payload = JSON.parse(data);
        populateResults(payload, ".shmoogle_results", "Shmoogle")
        populateResults(sortResults(payload), ".google_results", "Google");
    });
  

   // populateResults(stub, ".shmoogle_results", "Shmoogle")
   // populateResults(sortResults(stub), ".google_results", "Google");;
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