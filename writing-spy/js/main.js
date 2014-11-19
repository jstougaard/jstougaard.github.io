(function() {
	/*****
	 * This will store snapshots of the message to a log field as it is being written
	 * The event will attempt to log all modifications of the message as they are being made
	 * To avoid doing an entry for every single keypress certain criteria must be fulfilled
	 * A log entry is only stored if it is an actual modification of the existing message
	 * This means that something was deleted or additional text was added inbetween the existing
	 * Additionally hesitation is logged, meaning if more than 5s has passed since last input, the existing message will be stored
	 * Simply appending more text at your current position DOES NOT trigger a log entry
	 ******/

	"use strict";

	var input = document.getElementsByName("message")[0],
		log = document.getElementsByName("log")[0];


	if (input && log) {
		
		
		var loggedMessages = "",
			lastMessageStart = "",
			lastMessageEnd = "",
			lastKeyCode,
			lastInputTime;
		
		var storeMessage = function(version) {
			loggedMessages += version + "\n-----------------------------------------\n";
		};
		
		var getCaretPosition = function() { 
			if (input.selectionStart) { 
				return input.selectionStart; 
			} else if (document.selection) { 
				input.focus(); 

				var r = document.selection.createRange(); 
				if (r === null) { 
					return 0; 
				} 

				var re = input.createTextRange(), 
				rc = re.duplicate(); 
				re.moveToBookmark(r.getBookmark()); 
				rc.setEndPoint('EndToStart', re); 

				return rc.text.length; 
			}  
			return 0; 
		};


		// Helper methods
		if (typeof String.prototype.startsWith != 'function') {
			String.prototype.startsWith = function (str){
				return this.slice(0, str.length) == str;
			};
		}
		if (typeof String.prototype.endsWith != 'function') {
			String.prototype.endsWith = function (str){
				return this.slice(-str.length) == str;
			};
		}

		

		
		input.addEventListener("keyup", function(e) {

			var msg = input.value;
			var currentTime = +new Date();

			if (msg != lastMessageStart + lastMessageEnd) {
				var caretPosition = getCaretPosition();

				if ((lastInputTime && currentTime-lastInputTime > 5000) || // Is more than 5s has elapsed since last input
					!( (e.keyCode == 8 || e.keyCode == 46) && lastKeyCode == e.keyCode) && // If we are not doing continous deletions
					((lastMessageStart && !msg.startsWith(lastMessageStart)) || (lastMessageEnd && !msg.endsWith(lastMessageEnd))) ) // If not just appended to previous text (at cursor position)
				{
						storeMessage(lastMessageStart + lastMessageEnd);
				}


				log.value = loggedMessages + msg;
				lastMessageStart = msg.slice(0, caretPosition);
				lastMessageEnd = msg.slice(caretPosition);
			}

			lastKeyCode = e.keyCode;
			lastInputTime = currentTime;
		});
	}

	
}());