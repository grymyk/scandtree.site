'use strict';

/* global skel */
(function($) {
	skel.breakpoints({
		wide: '(max-width: 1920px)',
		normal: '(max-width: 1680px)',
		narrow: '(max-width: 1280px)',
		narrower: '(max-width: 1000px)',
		mobile: '(max-width: 736px)',
		mobilenarrow: '(max-width: 480px)'
	});

    $(document).ready(function() {
        var	$window = $(window),
            $body = $('body'),
            $header = $('#header'),
            $nav = $('.desktop_menu_holder'),
            $hamburger = $('#hamburger');

        // Disable animations/transitions until the page has loaded.

        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 0);
        });

        // Touch mode.
        skel.on('change', function() {
            if (skel.vars.mobile || skel.breakpoint('mobile').active) {
                $body.addClass('is-touch');
            } else {
                $body.removeClass('is-touch');
            }
        });

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on mobile.
        skel.on('+mobile -mobile', function() {
            $.prioritize(
                '.important\\28 mobile\\29',
                skel.breakpoint('mobile').active
            );
        });

        // CSS polyfills (IE<9).
        if (skel.vars.IEVersion < 9) {
            $(':last-child').addClass('last-child');
        }

        // Gallery.
        $window.on('load', function() {
            $('.gallery').poptrox({
                baseZIndex: 10001,
                useBodyOverflow: false,
                usePopupEasyClose: false,
                overlayColor: '#1f2328',
                overlayOpacity: 0.65,
                usePopupDefaultStyling: false,
                usePopupCaption: true,
                popupLoaderText: '',
                windowMargin: (skel.breakpoint('mobile').active ? 5 : 50),
                usePopupNav: true
            });
        });

        // Section transitions.
        if (!skel.vars.mobile
            &&	skel.canUse('transition')) {

            var on = function() {

                // Generic sections.
                $('.main.style1')
                    .scrollex({
                        mode: 'middle',
                        delay: 100,
                        initialize: function() { $(this).addClass('inactive'); },
                        terminate: function() { $(this).removeClass('inactive'); },
                        enter: function() { $(this).removeClass('inactive'); },
                        leave: function() { $(this).addClass('inactive'); }
                    });

                $('.main.style2')
                    .scrollex({
                        mode: 'middle',
                        delay: 100,
                        initialize: function() { $(this).addClass('inactive'); },
                        terminate: function() { $(this).removeClass('inactive'); },
                        enter: function() { $(this).removeClass('inactive'); },
                        leave: function() { $(this).addClass('inactive'); }
                    });
            };

            var off = function() {
                // Generic sections.
                $('.main.style1').unscrollex();

                $('.main.style2').unscrollex();
            };

            skel.on('change', function() {
                if (skel.breakpoint('mobile').active) {
                    (off)();
                } else {
                    (on)();
                }
            });
        }

        // Events.
        var resizeTimeout;
        var sectionIds = {};
        var sections = $('section');
        var headerHeight = $header.height();

        function setTopOffset(shift) {
            sections.each(function() {
                var halfWidth = $(this).width() / 2;

                sectionIds[$(this).attr('id')] = Math.ceil( $(this).first().offset().top - shift - halfWidth);
            });
        }

        $window
            .resize(function() {
                // Disable animations/transitions.
                $body.addClass('is-resizing');

                window.clearTimeout(resizeTimeout);

                resizeTimeout = window.setTimeout(function() {

                    // Update scrolly links.
                    $('a[href^=#]').scroll({
                        speed: 1500,
                        offset: $header.outerHeight() - 1
                    });

                    // Re-enable animations/transitions.
                    window.setTimeout(function() {
                        $body.removeClass('is-resizing');
                        $window.trigger('scroll');
                    }, 0);

                }, 100);

                setTopOffset(headerHeight);
            })
            .load(function() {
                $window.trigger('resize');
            });

        setTopOffset(headerHeight);

        $(window).scroll(function() {
            var scrolled = $(this).scrollTop();

            //when reaches the row, also add a class to the navigation
            for (var key in sectionIds) {
                if (sectionIds.hasOwnProperty(key)) {
                    if (scrolled >= sectionIds[key]) {

                        $nav.find('a').removeClass('active');

                        var id = '#' + key;
                        var current = $nav.find('a[href=' + id + ']');

                        current.addClass('active');

                        var marginLeft = parseInt( current.parent().css('margin-left'), 10);
                        var left = current.parent().position().left + marginLeft + 'px';
                        var width = current.parent().css('width');

                        $('#nav-indicator').css({
                            'left': left,
                            'width': width
                        });
                    }
                }
            }
        });

        // Hamburger Menu
        var isClosed = true;

        $hamburger.on('click', function() {
            if (isClosed) {
                $header.addClass('open');
                isClosed = false;
            } else {
                $header.removeClass('open');
                isClosed = true;
            }

            return false;
        });

        function clickHandler(event) {
            var $target = $(event.target);

            var id = $target.attr('href');

            var top = Math.ceil( $(id).first().offset().top - headerHeight );

            $('html, body').animate({
                scrollTop: top + 'px'
            }, 300);

            if (isClosed === false) {
                $header.removeClass('open');
                isClosed = true;
            }

            return false;
        }

        $nav.find('a').on('click', clickHandler);
        $('#about').on('click', clickHandler);

        $('#top').on('click', function(event) {
            var target = $(event.target);
            var id = target.attr('href');

            if (id === 'undefined') {
                $('html, body').animate({
                    scrollTop: '0px'
                }, 300);
            } else {
                clickHandler(event);
            }

            return false;
        });
    });
})(jquery);
