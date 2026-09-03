function copyToClipboard( element ) {
	const $temp = jQuery( '<input>' );
	jQuery( 'body' ).append( $temp );
	$temp.val( jQuery( element ).val() ).select();
	document.execCommand( 'copy' );
	$temp.remove();
	jQuery( '#copyFBText' ).html('Text copied successfully! Be sure to follow the <a href="/republishing-guidelines">Republishing Guidelines</a>.');
	setTimeout(() => {
		jQuery( '#copyFBText' ).html(' ');
	}, 10000);
}

function modal_actions(){

	const $ = jQuery;
	const $modal = $('#republication-tracker-tool-modal');
	const $modal_content = $('#republication-tracker-tool-modal-content');
	const $btnOpen = $('#cc-btn');
	const $btnCopy = $('#republication-tracker-tool-copy-btn');
	const $close = $('.republication-tracker-tool-close');

	// Remove captions from shareable text
	const $shareable = $('#republication-tracker-tool-shareable-content');
	const html = $shareable.val();
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	$(doc).find('.wp-caption').remove();
	const captionless = $(doc).find('body').html();
	$shareable.val(captionless);

	// Restrict keyboard nav to modal while open
	if ($close.length && $btnCopy.length) {
		$modal.on('keydown', function(e) {
			if (e.key === 'Tab') {
				const loopStart = $close[0];
				const loopEnd = $btnCopy[0];
				if (e.shiftKey) {
					if (document.activeElement === loopStart) {
						e.preventDefault();
						loopEnd.focus();
					}
				}
				else {
					if (document.activeElement === loopEnd) {
						e.preventDefault();
						loopStart.focus();
					}
				}
			}
		});
	}

	// Open modal
	$btnOpen.click(function(){
		$modal.show();
		$modal_content.show();
		if ($shareable.length) $shareable[0].focus({ preventScroll: true });
		$('body').addClass('modal-open-disallow-scrolling');
		$('#republication-tracker-tool-modal-content').unbind().click(function(e) {
			e.stopPropagation();
		});
		$btnOpen.prop('ariaExpanded', true);
		$modal.prop('ariaHidden', false);
	});

	// Close modal
	function closeModal() {
		$('body').removeClass('modal-open-disallow-scrolling');
		$modal.hide();
		$btnOpen.prop('ariaExpanded', false);
		$modal.prop('ariaHidden', true);
		$btnOpen.focus();
	}
	$modal.click(closeModal);
	$close.click(closeModal);
	$(document).keydown(function(event) {
		if (event.keyCode === 27) {
			closeModal();
		}
	});
}

jQuery(document).ready(function(){
	const $ = jQuery,
		postId = $( '#republication-tracker-tool-modal' ).attr( 'data-postid' ),
		pluginsdir = $( '#republication-tracker-tool-modal' ).attr( 'data-pluginsdir' );

		$('#republication-tracker-tool-modal').append($('#republication-tracker-tool-modal-content'));
		$('body').append($('#republication-tracker-tool-modal'));

		modal_actions();

});
