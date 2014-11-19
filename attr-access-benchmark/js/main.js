$(document).ready(function() {

	var sourceContainer = $('#source_container'),
		overlay = $("#overlay");

	function getSettings() {
		var elemCount = $("input[name=elem_count]").val();
		elemCount = (!elemCount || isNaN(elemCount)) ? 0 : parseInt(elemCount, 10);
		var attrs = $("input[name=attrs]:checkbox:checked").map(function(){
			return $(this).val();
		}).get();
		console.log(elemCount, attrs);
		return {
			elemCount: elemCount,
			attrs: attrs
		};
	}

	function resetTest() {
		sourceContainer.text("");
	}

	function generateHtml(settings) {
		var	source = "";

		for(var i=0; i<settings.elemCount;i++) {
			var elem = $("<div></div>").text(" ELEM "+i+" ");
			$.each(settings.attrs, function(index, val) {
				elem.attr(val, val+i);
			});
			elem.appendTo(sourceContainer);
		}

	}


	function getDOMAttribute(elem, attr) {
		return elem.getAttribute(attr);
	}

	function getObjectProperty(elem, attr) {
		return elem[attr]; 
	}

	function getDetermining(elem, attr) {
		return typeof elem[name] !== "undefined" ? elem[attr] : elem.getAttribute(attr); 
	}


	function runTest(settings, attributeStrategy) {
		var elems = sourceContainer.find('div');
		var time = +new Date();
		for(var i=0;i<elems.length;i++) {
			var elem = elems[i];
			for(var j=0;j<settings.attrs.length;j++) {
				attributeStrategy(elem, settings.attrs[j]);
			}
		}
		return +new Date() - time;
	}

	function displayResults(domTime, propTime, chooseTime) {
		$("#time_dom").text( domTime + " ms" );
		$("#time_property").text( propTime + " ms" );
		$("#time_choose").text( chooseTime + " ms" );
	}


	$('#run_test').on('click', function(event) {
		event.preventDefault();
		var settings = getSettings(),
			domTime = 0,
			propTime = 0,
			deterTime = 0;

		resetTest();
		if (settings.elemCount > 0) {
			overlay.fadeIn('fast', function() {
				
				console.log("Starting test");

				generateHtml(settings);
				domTime = runTest(settings, getDOMAttribute);
				propTime = runTest(settings, getObjectProperty);
				deterTime = runTest(settings, getDetermining);

				displayResults(domTime, propTime, deterTime);
				console.log("Run times", domTime, propTime, deterTime);
				
				overlay.hide();
			});
		}

		
		
	});
		





});
