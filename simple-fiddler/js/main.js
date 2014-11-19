(function() {
	"use strict";

	var input = document.getElementById("js_input"),
		output = document.getElementById("js_output"),
		defaultVal = output.innerHTML;

	document.getElementById("js_run").addEventListener("click", function() {
		var val = input.value;
		output.innerHTML = val ? eval(val) : defaultVal;
	});

	
}());