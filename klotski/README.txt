The Klotski game is run primarily through javascript

A basic setup is done with markup, where the different blocks are defined and the width, height and position of them are set through data-attributes
The game is initialized when the page is loaded.
The game functionality is contained in an object of its own. To start it a initialize function must be called on this object, specifying the gameboard element.
The code then iterates through all contained elements with the class 'block'. The blocks are positioned and the they are blown into the correct dimensions, according to the initial size of the gameboard and the specified attributes.

When a block is clicked a selected state is toggled, and the selected block is stored in a variable.
When the arrow keys are pressed and a block is selected, a new position is calculated according to the pressed key. When the new position is determined, a function calculates whether or not this position is valid - considering the frame of the game and other blocks.

If valid, the element is moved to the new position (through absolute positioning in css)

The game is won whenever the main block reaches the goal area. This is checked after each move of the main block.

Throughout the game logic positions and dimensions are handled through an internal grid, based on the values defined in markup. The actual pixel position is only ever used in the move function.
All animations are handled through css transitions