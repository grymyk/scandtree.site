(function($) {
	'use strict';

	// Get the form.
	var form = $('#ajax-contact');

	// Get the messages div.
	var formMessages = $('#form-messages');

	// Set up an event listener for the contact form.
	$(form).submit(function(e) {
		// Stop the browser from submitting the form.
		e.preventDefault();

		//$(form).find('input[type="submit"]').addClass('disable');
		formMessages.addClass('board_spinner');

		// Serialize the form data.
		var formData = $(form).serialize();

		// Submit the form using AJAX.
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		}).done(function(response) {
			// Make sure that the formMessages div has the 'success' class.
			//$('input[type="submit"]').removeClass('disable');
			$(formMessages).removeClass('error board_spinner');
			$(formMessages).addClass('success');

			// Set the message text.
			$(formMessages).text(response);

			// Clear the form.
			$('#name').val('');
			$('#email').val('');
			$('#phone').val('');
			$('#message').val('');
		})
		.fail(function(data) {
			// Make sure that the formMessages div has the 'error' class.
			$('input[type="submit"]').removeClass('disable');
			$(formMessages).removeClass('success board_spinner');
			$(formMessages).addClass('error');

			// Set the message text.
			if (data.responseText !== '') {
				$(formMessages).text(data.responseText);
			} else {
				$(formMessages).text('Oops! An error occured and your message could not be sent.');
			}
		});
	});

	$(form).on('focus', 'input, textarea', function() {
		$(formMessages).text('');
	});
})(jQuery);
