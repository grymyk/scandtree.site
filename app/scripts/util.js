(function($) {
	'use strict';

	/**
	 * Generate an indented list of links from a nav. Meant for use with panel().
	 * @return {jQuery} jQuery object.
	 */
	$.fn.navList = function() {

		var	$this = $(this),
			$a = $this.find('a'),
			b = [];

		$a.each(function() {

			var	elem = $(this),
				indent = Math.max(0, elem.parents('li').length - 1),
				href = elem.attr('href'),
				target = elem.attr('target');

			b.push(
				'<a ' +
				'class="link depth-' + indent + '"' +
				( (typeof target !== 'undefined' && target !== '') ? ' target="' + target + '"' : '') +
				( (typeof href !== 'undefined' && href !== '') ? ' href="' + href + '"' : '') +
				'>' +
				'<span class="indent-' + indent + '"></span>' +
				elem.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Panel-ify an element.
	 * @param {object} userConfig User config.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

		// No elements?
		if (this.length === 0) {
			return $this;
		}

		// Multiple elements?
		if (this.length > 1) {

			for (var i = 0; i < this.length; i += 1) {
				$(this[i]).panel(userConfig);
			}

			return $this;
		}

		// Vars.
		var	$this = $(this),
			$body = $('body'),
			$window = $(window),
			id = $this.attr('id'),
			config;

		// Config.
		config = $.extend({

			// Delay.
			delay: 0,

			// Hide panel on link click.
			hideOnClick: false,

			// Hide panel on escape keypress.
			hideOnEscape: false,

			// Hide panel on swipe.
			hideOnSwipe: false,

			// Reset scroll position on hide.
			resetScroll: false,

			// Reset forms on hide.
			resetForms: false,

			// Side of viewport the panel will appear.
			side: null,

			// Target element for "class".
			target: $this,

			// Class to toggle.
			visibleClass: 'visible'

		}, userConfig);

		// Expand "target" if it's not a jQuery object already.
		if (typeof config.target !== 'object') {
			config.target = $(config.target);
		}

		// Panel.

		// Methods.
		$this.hidePanel = function(event) {

			// Already hidden? Bail.
			if (!config.target.hasClass(config.visibleClass)) {
				return;
			}

			// If an event was provided, cancel it.
			if (event) {
				event.preventDefault();
				event.stopPropagation();

			}

			// Hide.
			config.target.removeClass(config.visibleClass);

			// Post-hide stuff.
			window.setTimeout(function() {

				// Reset scroll position.
				if (config.resetScroll) {
					$this.scrollTop(0);
				}

				// Reset forms.
				if (config.resetForms) {
					$this.find('form').each(function() {
						this.reset();
					});
				}

			}, config.delay);
		};

		// Vendor fixes.
		$this
			.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
			.css('-webkit-overflow-scrolling', 'touch');

		// Hide on click.
		if (config.hideOnClick) {

			$this.find('a')
				.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

			$this
				.on('click', 'a', function(event) {

					var $a = $(this),
						href = $a.attr('href'),
						target = $a.attr('target');

					if (!href || href === '#' || href === '' || href === '#' + id) {
						return;
					}

					// Cancel original event.
					event.preventDefault();
					event.stopPropagation();

					// Hide panel.
					$this.hidePanel();

					// Redirect to href.
					window.setTimeout(function() {

						if (target === '_blank') {
							window.open(href);
						} else {
							window.location.href = href;
						}
					}, config.delay + 10);
				});

		}

		// Event: Touch stuff.
		$this.on('touchstart', function(event) {
			$this.touchPosX = event.originalEvent.touches[0].pageX;
			$this.touchPosY = event.originalEvent.touches[0].pageY;

		});

		$this.on('touchmove', function(event) {
			if ($this.touchPosX === null ||	$this.touchPosY === null) {
				return;
			}

			var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
				diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
				th = $this.outerHeight(),
				ts = ($this.get(0).scrollHeight - $this.scrollTop());

			// Hide on swipe?
			if (config.hideOnSwipe) {
				var result = false,
					boundary = 20,
					delta = 50;

				switch (config.side) {

					case 'left':
						result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
						break;

					case 'right':
						result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
						break;

					case 'top':
						result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
						break;

					case 'bottom':
						result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
						break;

					default:
						break;

				}

				if (result) {
					$this.touchPosX = null;
					$this.touchPosY = null;
					$this.hidePanel();
				}
			}

			// Prevent vertical scrolling past the top or bottom.
			if (($this.scrollTop() < 0 && diffY < 0) || (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
				event.preventDefault();
				event.stopPropagation();

			}
		});

		// Event: Prevent certain events inside the panel from bubbling.
		$this.on('click touchend touchstart touchmove', function(event) {
			event.stopPropagation();
		});

		// Event: Hide panel if a child anchor tag pointing to its ID is clicked.
		$this.on('click', 'a[href="#' + id + '"]', function(event) {
			event.preventDefault();
			event.stopPropagation();

			config.target.removeClass(config.visibleClass);
		});

		// Body.

		// Event: Hide panel on body click/tap.
		$body.on('click touchend', function(event) {
			$this.hidePanel(event);
		});

		// Event: Toggle.
		$body.on('click', 'a[href="#' + id + '"]', function(event) {
			event.preventDefault();
			event.stopPropagation();

			config.target.toggleClass(config.visibleClass);
		});

		// Window.

		// Event: Hide on ESC.
		if (config.hideOnEscape) {
			$window.on('keydown', function(event) {

				if (event.keyCode === 27) {
					$this.hidePanel(event);
				}
			});
		}

		return $this;

	};

	/**
	 * Apply "placeholder" attribute polyfill to one or more forms.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.placeholder = function() {
		// Browser natively supports placeholders? Bail.
		if (typeof (document.createElement('input')).placeholder !== 'undefined') {
			return $(this);
		}

		// No elements?
		if (this.length === 0) {
			return $this;
		}

		// Multiple elements?
		if (this.length > 1) {
			for (var i = 0; i < this.length; i += 1) {
				$(this[i]).placeholder();
			}

			return $this;
		}

		// Vars.
		var $this = $(this);

		// Text, TextArea.
		$this.find('input[type=text], textarea')
			.each(function() {
				if ($(this).val() === '' || $(this).val() === $(this).attr('placeholder')) {
					$(this).addClass('polyfill-placeholder').val( $(this).attr('placeholder') );
				}
			})
			.on('blur', function() {
				if ($(this).attr('name').match(/-polyfill-field$/)) {
					return;
				}

				if ($(this).val() === '') {
					$(this).addClass('polyfill-placeholder').val( $(this).attr('placeholder') );
				}

			})
			.on('focus', function() {
				if ($(this).attr('name').match(/-polyfill-field$/)) {
					return;
				}

				if ($(this).val() === $(this).attr('placeholder')) {
					$(this).removeClass('polyfill-placeholder').val('');
				}
			});

		// Password.
		$this.find('input[type=password]')
			.each(function() {
				var x = $(
					$('<div>')
						.append(i.clone())
						.remove()
						.html()
						.replace(/type="password"/i, 'type="text"')
						.replace(/type=password/i, 'type=text')
				);

				if ($(this).attr('id') !== '') {
					x.attr('id', $(this).attr('id') + '-polyfill-field');
				}

				if ($(this).attr('name') !== '') {
					x.attr('name', $(this).attr('name') + '-polyfill-field');
				}

				x.addClass('polyfill-placeholder')
					.val(x.attr('placeholder')).insertAfter($(this));

				if ($(this).val() === '') {
					$(this).hide();
				} else {
					x.hide();
				}

				$(this)
					.on('blur', function(event) {

						event.preventDefault();

						var x1 = $(this).parent().find('input[name=' + $(this).attr('name') + '-polyfill-field]');

						if ($(this).val() === '') {
							$(this).hide();
							x1.show();
						}
					});

				x
					.on('focus', function(event) {

						event.preventDefault();

						var i1 = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

						x.hide();

						i1
							.show()
							.focus();

					})
					.on('keypress', function(event) {

						event.preventDefault();
						x.val('');

					});

			});

		// Events.
		$this
			.on('submit', function() {

				$this.find('input[type=text],input[type=password],textarea')
					.each(function() {
						if ($(this).attr('name').match(/-polyfill-field$/)) {
							$(this).attr('name', '');
						}

						if ($(this).val() === $(this).attr('placeholder')) {
							$(this).removeClass('polyfill-placeholder');
							$(this).val('');
						}
					});

			})
			.on('reset', function(event) {
				event.preventDefault();

				$this.find('select')
					.val($('option:first').val());

				$this.find('input,textarea')
					.each(function() {

						var el = $(this),
							x;

						el.removeClass('polyfill-placeholder');

						switch (this.type) {

							case 'submit':
							case 'reset':
								break;

							case 'password':
								el.val(el.attr('defaultValue'));

								x = el.parent().find('input[name=' + el.attr('name') + '-polyfill-field]');

								if (el.val() === '') {
									el.hide();
									x.show();
								} else {
									el.show();
									x.hide();
								}

								break;

							case 'checkbox':
							case 'radio':
								el.attr('checked', el.attr('defaultValue'));
								break;

							case 'text':
							case 'textarea':
								el.val(el.attr('defaultValue'));

								if (el.val() === '') {
									el.addClass('polyfill-placeholder');
									el.val(el.attr('placeholder'));
								}

								break;

							default:
								el.val(el.attr('defaultValue'));
								break;

						}
					});

			});

		return $this;

	};

	/**
	 * Moves elements to/from the first positions of their respective parents.
	 * @param {jQuery} $elements Elements (or selector) to move.
	 * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
	 */
	$.prioritize = function($elements, condition) {

		var key = '__prioritize';

		// Expand $elements if it's not already a jQuery object.
		if (typeof $elements !== 'object') {
			$elements = $($elements);
		}

		// Step through elements.
		$elements.each(function() {

			var $e = $(this), $p,
					$parent = $e.parent();

			// No parent? Bail.
			if ($parent.length === 0) {
				return;
			}

			// Not moved? Move it.
			if (!$e.data(key)) {
				// Condition is false? Bail.
				if (!condition) {
					return;
				}

				// Get placeholder (which will serve as our point of reference for when this element needs to move back).
				$p = $e.prev();

				// Couldn't find anything? Means this element's already at the top, so bail.
				if ($p.length === 0) {
					return;
				}

				// Move element to top of parent.
				$e.prependTo($parent);

				// Mark element as moved.
				$e.data(key, $p);


			// Moved already?
			} else {

				// Condition is true? Bail.
				if (condition) {
					return;
				}

				$p = $e.data(key);

				// Move element back to its original location (using our placeholder).
				$e.insertAfter($p);

				// Unmark element as moved.
				$e.removeData(key);

			}
		});
	};
})(jQuery);
