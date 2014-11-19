(function() {

	var Utils = {
		getData: function(elem, key) {
			return elem.getAttribute("data-" + key );
		},
		getDataInt: function(elem, key) {
			var val = this.getData(elem, key);
			return val ? parseInt(val, 10) : 0;
		},

		addClass: function(elem, className) {
			elem.className = elem.className + " "+className;
		},

		removeClass: function(elem, className) {
			elem.className = elem.className.replace(" "+className,"");
		}
	};


	var klotski = {

		initialize: function(gameboardId) {
			this.gameboard = document.getElementById(gameboardId);
			this.blocks = this.gameboard.getElementsByClassName('block');
			
			// Add event listeners
			for(var i=0;i<this.blocks.length;i++) {
				this.blocks[i].addEventListener('click', this, false);
			}
			document.addEventListener('keyup', this, false);

			// Get winner position
			this.winnerPosition = {
				x: Utils.getDataInt(this.gameboard, 'winner-x'),
				y: Utils.getDataInt(this.gameboard, 'winner-y')
			};

			// Determine main block
			this.mainBlock = this.gameboard.getElementsByClassName('main')[0];

			this.initSizes();
		},

		// Blow up and place boxes
		initSizes: function() {
			this.gameboard.grid = {
				width: Utils.getDataInt(this.gameboard, 'width'),
				height: Utils.getDataInt(this.gameboard, 'height')
			};

			this.widthRatio = this.gameboard.clientWidth / this.gameboard.grid.width;
			this.heightRatio = this.gameboard.clientHeight / this.gameboard.grid.height;
			

			for (var i=0;i<this.blocks.length;i++) {
				var block = this.blocks[i];
				block.grid = {
					width: Utils.getDataInt(block, 'width'),
					height: Utils.getDataInt(block, 'height')
				};
				block.style.width =  block.grid.width  * this.widthRatio + 'px';
				block.style.height = block.grid.height * this.heightRatio + 'px';

				this.moveBlock(block, Utils.getDataInt(block, 'x'), Utils.getDataInt(block, 'y'));
			}
		},

		moveBlock:function(block, newX, newY) {
			block.style.left = (this.widthRatio * newX)+'px';
			block.style.top = (this.heightRatio * newY)+'px';
			block.grid.x = parseInt(newX, 10);
			block.grid.y = parseInt(newY, 10);
		},

		selectBlock: function(event) {
			if (this.selected)
				Utils.removeClass(this.selected, 'selected');
			
			if (this.selected == event.target) {
				this.selected = null;
			} else {
				this.selected = event.target;
				Utils.addClass(this.selected, 'selected');
			}
		},



		onKeyDown: function(event) {
			if (!this.selected)
				return;
			event.preventDefault();

			var dX = 0,
				dY = 0;
			switch(event.keyCode) {
				case 37: // left
					dX = -1;
				break;
				case 38: // up
					dY = -1;
				break;
				case 39: // right
					dX = 1;
				break;
				case 40: // down
					dY = 1;
				break;
			}

			if (!dX && !dY) return;

			var newX = this.selected.grid.x + dX,
				newY = this.selected.grid.y + dY;

			if (this.validatePosition(this.selected, newX, newY, this.selected.grid.width, this.selected.grid.height))
				this.moveBlock(this.selected, newX, newY);

			if (this.hasWon()) {
				var self = this;
				setTimeout(function() {
					self.showWinner();
				}, 300);
			}
		},

		validatePosition: function(block, x, y, width, height) {
			if (x+width > this.gameboard.grid.width || y+height > this.gameboard.grid.height || x < 0 || y < 0)
				return false;
			var isFree = true;

			for (var i=0;i<this.blocks.length;i++) {
				if (this.blocks[i] == block) continue;
				var other = this.blocks[i].grid;
				

				if (y + height > other.y && y < other.y + other.height && x + width > other.x && x < other.x + other.width) {
					console.log("Overlapping", x, y, other);
					isFree = false;
					break;
				}
			}

			return isFree;
		},

		hasWon: function() {
			return (this.mainBlock.grid.x == this.winnerPosition.x && this.mainBlock.grid.y == this.winnerPosition.y);
		},

		showWinner: function() {
			this.moveBlock(this.mainBlock, this.mainBlock.grid.x, (this.winnerPosition.y + this.mainBlock.grid.height) );
			if (confirm("Congratulations, you have won the game!\nWould you like to try again?")) {
				location.reload();
			}
		},



		/*  =========================
			Object wide event handler
			=========================== */

		handleEvent: function(event) {
			switch(event.type) {
				case 'click':
					this.selectBlock(event);
				break;
				case 'keypress':
				case 'keyup':
					this.onKeyDown(event);
				break;
			}
			return false;
		}

		
	};

	

	klotski.initialize("klotski_game");

})();
