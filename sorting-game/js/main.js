(function() {


	var game = {
		minNumber: 1,
		maxNumber: 100,
		numberCount: 10,

		initialize: function(gameboardId) {
			this.showGamesPlayed();
			
			this.gameboard = document.getElementById(gameboardId);
			this.gameboard.innerHTML = "";
			this.generateNumbers();

			this.blocks = this.gameboard.getElementsByClassName('block');
			// Add event listeners
			for(var i=0;i<this.blocks.length;i++) {
				this.blocks[i].addEventListener('dragstart', this, false);
				this.blocks[i].addEventListener('dragover', this, false);
				this.blocks[i].addEventListener('dragenter', this, false);
				this.blocks[i].addEventListener('dragleave', this, false);
				this.blocks[i].addEventListener('drop', this, false);
				this.blocks[i].addEventListener('dragend', this, false);
			}
		},

		generateNumbers: function(amount, min, max) {
			for(var i=0;i<this.numberCount;i++) {
				var number = this.getRandomInt(this.minNumber, this.maxNumber);
				this.gameboard.innerHTML += this.getNumberMarkup(number);
			}
			// Place dropable area in bottom
			this.gameboard.innerHTML += "<div class='block edge' draggable='true' id='dragBlockEmpty'>" +
											"<div class='dropable-area'><span>Drop here</span></div>" +
										"</div>";

		},

		getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		getNumberMarkup: function(number) {
			return "<div class='block' draggable='true' id='dragBlock"+(number+"_"+this.getRandomInt(0,1000))+"'>" +
						"<div class='dropable-area'><span>Drop here</span></div>" +
						"<div class='number-field'>"+number+"</div>" +
					"</div>";
		},

		handleDragStart: function(e) {
			e.dataTransfer.setData("Text",e.currentTarget.id);
			this.draggedBox = e.currentTarget;
			this.draggedBox.classList.add('moving');
		},

		handleDragOver: function(e) {
			if (e.preventDefault) {
				e.preventDefault(); // stops the browser from redirecting.
			}
			e.dataTransfer.effectAllowed = 'move'; 


			return false;
		},

		handleDragEnter: function(e) {
			if (e.stopPropagation) {
				e.stopPropagation(); // stops the browser from redirecting.
			}
			//console.log("dragEnter", e.currentTarget.id);
			e.currentTarget.firstChild.hidden = false;
			if (e.currentTarget != this.draggedBox)
				e.currentTarget.classList.add('active');

			return false;
		},

		handleDragLeave: function(e) {
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			//console.log("dragLeave", e.currentTarget.id);
			
			e.currentTarget.classList.remove('active');

			return false;
		},

		handleDrop: function(e) {
			if (e.stopPropagation) {
				e.stopPropagation(); // stops the browser from redirecting.
			}
			//e.currentTarget.classList.remove('active');
			//this.hideAllDropFields();

			var movedBlock = this.draggedBox;
			movedBlock.classList.remove('moving');
			movedBlock.style.opacity = 0;
			
			this.gameboard.insertBefore(movedBlock, e.currentTarget);
			
			e.currentTarget.firstChild.hidden = true;
			
			var self = this;
			setTimeout(function() {
				movedBlock.style.opacity = 1;
				self.checkSorting();
			}, 1);

			this.draggedBox = null;
			return false;
		},

		handleDragEnd: function(e) {
			this.hideAllDropFields();
			if (this.draggedBox)
				this.draggedBox.classList.remove('moving');
		},

		checkSorting: function() {
			var numberElems = this.gameboard.getElementsByClassName('number-field');
			var lastVal = this.minNumber - 1;
			var isSorted = true;

			for(var i=0;i<numberElems.length;i++) {
				var val = parseInt(numberElems[i].innerText, 10);
				if (val < lastVal) {
					isSorted = false;
					break;
				}
				lastVal = val;
			}

			if (isSorted)
				this.gameWon();
		},

		gameWon: function() {
			this.incrementGamecount();
			var more = prompt("Well done!\nWant to try again with another amount of numbers?", "10");
			if (more) {
				this.numberCount = parseInt(more,10);
				this.initialize(this.gameboard.id);
			}

		},

		incrementGamecount: function() {
			if (localStorage.gamecount) {
				localStorage.gamecount=Number(localStorage.gamecount)+1;
			} else {
				localStorage.gamecount=1;
			}
			this.showGamesPlayed();
		},

		showGamesPlayed: function() {
			var count = localStorage.gamecount || 0;
			document.getElementById('gamecount').innerText = count;
		},
		
		/**
		 * Since dragLeave isn't called consistently in IE, we will have to close all hover effects on drag end
		 */
		hideAllDropFields: function() {
			for(var i=0; i<this.blocks.length;i++)
				this.blocks[i].classList.remove('active');
		},


		/*  =========================
			Object wide event handler
			=========================== */

		handleEvent: function(event) {
			switch(event.type) {
				case 'dragstart':
					this.handleDragStart(event);
				break;
				case 'dragover':
					this.handleDragOver(event);
				break;
				case 'dragenter':
					this.handleDragEnter(event);
				break;
				case 'dragleave':
					this.handleDragLeave(event);
				break;
				case 'drop':
					this.handleDrop(event);
				break;
				case 'dragend':
					this.handleDragEnd(event);
				break;
			}
			return false;
		}
	};

	game.initialize('sorting_game');

})();
