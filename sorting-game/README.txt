The sorting game requires next to no markup. Only a game container is required and optionally a element for writing game count to.

Like the Klotski game, the sorting game is contained in its own object and started by an initialize function.
The initializer renders the elements to sort and applies the necessary eventlisteners to these.
Event handling are done through a single dedicated method. The reason for this is to maintain a reference to "this" within the object

The dynamic rendering of the elements, means you are able to specify the number of elements and the interval, in which the random numbers should exist.

The dragable elements contain two childs - one is the visible element and the other is only visible when dragging over it to indicate that you are able to drag to this area.
Doing it this way however introduces a problem, since the dragenter and dragleave events behaves somewhat oddly. These events are fired whenever the element dragged over changes - meaning that it is also fired when dragged over the different child elements within the elements themselves.
To prevent this in chrome, the css property "pointer-events: none" is used. This however doesn't have any effect in IE, where a suitable solution haven't been found.
For this reason all drop-areas are hidden everytime a drag-and-drop ends

To determine whether or not a game is won, the block elements are iterated through from top to bottom. If none is out of order the game is considered won and the gamecount is updated and stored in localstorage