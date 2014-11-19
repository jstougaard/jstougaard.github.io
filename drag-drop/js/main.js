$(document).ready(function() {

	var removableList = $('.removable'),
		trashArea = $('.trash'),
		trashAlert = $('#remove-confirmation'),
		trashList = $('#trash-container');

	removableList.find("li").draggable({
		appendTo: "body",
		helper: "clone",
		opacity: 0.7
	});
    trashArea.droppable({
      hoverClass: "drop-hover",
      drop: function( event, ui ) {
        ui.draggable.hide().appendTo(trashList);
        if (!trashAlert.is(':visible')) {
			trashArea.addClass('full');
			trashAlert.fadeIn('fast');
		}
		ui.draggable.fadeIn('slow');
      }
    });

    function setTrashEmpty() {
		trashArea.removeClass('full');
		trashAlert.fadeOut();
    }

    $('#btn-cancel').on('click', function() {
		trashList.find('li').hide().appendTo(removableList).fadeIn();
		setTrashEmpty();
    });
	
	$('#btn-delete').on('click', function() {
		trashList.find('li').fadeOut(400, function(){
			$(this).remove();
		});
		setTrashEmpty();
	});
		





});
