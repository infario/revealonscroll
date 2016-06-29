/*
 Jquery Reveal on scroll

 Reveal your element on scroll when it reaches view port. its a package of few jquery plugins

 */

/*! animateCSS - v1.2.1 - 2015-03-23
 * https://github.com/craigmdennis/animateCSS
 * Copyright (c) 2015 Craig Dennis; Licensed MIT */

(function() {
	'use strict';
	var $;

	$ = jQuery;

	$.fn.extend({
		animateCSS : function(effect, options) {
			var addClass,
			    animate,
			    callback,
			    complete,
			    init,
			    removeClass,
			    setDuration,
			    settings,
			    transitionEnd,
			    unhide;
			settings = {
				effect : effect,
				delay : 0,
				animationClass : 'animated',
				infinite : 'no',
				callback : options,
				duration : 1000,
				debug : true
			};
			transitionEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
			settings = $.extend(settings, options);
			init = function(element) {
				return animate(element);
			};
			animate = function(element) {
				if (settings.infinite == 'yes') {
					settings.animationClass += ' infinite';
				}
				return setTimeout(function() {
					setDuration(element);
					unhide(element);
					addClass(element);
					return complete(element);
				}, settings.delay);
			};
			addClass = function(element) {
				return element.addClass(settings.effect + ' ' + settings.animationClass + ' ');
			};
			unhide = function(element) {
				if (element.css('visibility') === 'hidden') {
					element.css('visibility', 'visible');
				}
				if (element.is(':hidden')) {
					return element.show();
				}
			};
			removeClass = function(element) {
				return element.removeClass(settings.effect + ' ' + settings.animationClass);
			};
			setDuration = function(element) {
				return element.css({
					'-webkit-animation-duration' : settings.duration + 'ms',
					'-moz-animation-duration' : settings.duration + 'ms',
					'-o-animation-duration' : settings.duration + 'ms',
					'animation-duration' : settings.duration + 'ms'
				});
			};
			callback = function(element) {
				if (settings.infinite == 'no') {
					removeClass(element);
				}
				if ( typeof settings.callback === 'function') {
					return settings.callback.call(element);
				}
			};
			complete = function(element) {
				return element.one(transitionEnd, function() {
					return callback(element);
				});
			};
			return this.each(function() {
				return init($(this));
			});
		}
	});

}).call(this);

/*
$.fn.extend({
animateCss: function (animationName) {
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
$(this).addClass('animated ' + animationName).on(animationEnd, function() {
console.log('done');
$(this).removeClass('animated ' + animationName);
});
}
});
*/

/**
 * author Christopher Blum
 *    - based on the idea of Remy Sharp, http://remysharp.com/2009/01/26/element-in-view-event-plugin/
 *    - forked from http://github.com/zuk/jquery.inview/
 */
( function(factory) {
		if ( typeof define == 'function' && define.amd) {
			// AMD
			define(['jquery'], factory);
		} else if ( typeof exports === 'object') {
			// Node, CommonJS
			module.exports = factory(require('jquery'));
		} else {
			// Browser globals
			factory(jQuery);
		}
	}(function($) {

		var inviewObjects = [],
		    viewportSize,
		    viewportOffset,
		    d =
		    document,
		    w =
		    window,
		    documentElement = d.documentElement,
		    timer;

		$.event.special.inview = {
			add : function(data) {
				inviewObjects.push({
					data : data,
					$element : $(this),
					element : this
				});
				// Use setInterval in order to also make sure this captures elements within
				// "overflow:scroll" elements or elements that appeared in the dom tree due to
				// dom manipulation and reflow
				// old: $(window).scroll(checkInView);
				//
				// By the way, iOS (iPad, iPhone, ...) seems to not execute, or at least delays
				// intervals while the user scrolls. Therefore the inview event might fire a bit late there
				//
				// Don't waste cycles with an interval until we get at least one element that
				// has bound to the inview event.
				if (!timer && inviewObjects.length) {
					timer = setInterval(checkInView, 250);
				}
			},

			remove : function(data) {
				for (var i = 0; i < inviewObjects.length; i++) {
					var inviewObject = inviewObjects[i];
					if (inviewObject.element === this && inviewObject.data.guid === data.guid) {
						inviewObjects.splice(i, 1);
						break;
					}
				}

				// Clear interval when we no longer have any elements listening
				if (!inviewObjects.length) {
					clearInterval(timer);
					timer = null;
				}
			}
		};

		function getViewportSize() {
			var mode,
			    domObject,
			    size = {
				height : w.innerHeight,
				width : w.innerWidth
			};

			// if this is correct then return it. iPad has compat Mode, so will
			// go into check clientHeight/clientWidth (which has the wrong value).
			if (!size.height) {
				mode = d.compatMode;
				if (mode || !$.support.boxModel) {// IE, Gecko
					domObject = mode === 'CSS1Compat' ? documentElement : // Standards
					d.body;
					// Quirks
					size = {
						height : domObject.clientHeight,
						width : domObject.clientWidth
					};
				}
			}

			return size;
		}

		function getViewportOffset() {
			return {
				top : w.pageYOffset || documentElement.scrollTop || d.body.scrollTop,
				left : w.pageXOffset || documentElement.scrollLeft || d.body.scrollLeft
			};
		}

		function checkInView() {
			if (!inviewObjects.length) {
				return;
			}

			var i = 0,
			    $elements = $.map(inviewObjects, function(inviewObject) {
				var selector = inviewObject.data.selector,
				    $element = inviewObject.$element;
				return selector ? $element.find(selector) : $element;
			});

			viewportSize = viewportSize || getViewportSize();
			viewportOffset = viewportOffset || getViewportOffset();

			for (; i < inviewObjects.length; i++) {
				// Ignore elements that are not in the DOM tree
				if (!$.contains(documentElement, $elements[i][0])) {
					continue;
				}

				var $element = $($elements[i]),
				    elementSize = {
					height : $element[0].offsetHeight,
					width : $element[0].offsetWidth
				},
				    elementOffset = $element.offset(),
				    inView = $element.data('inview');

				// Don't ask me why because I haven't figured out yet:
				// viewportOffset and viewportSize are sometimes suddenly null in Firefox 5.
				// Even though it sounds weird:
				// It seems that the execution of this function is interferred by the onresize/onscroll event
				// where viewportOffset and viewportSize are unset
				if (!viewportOffset || !viewportSize) {
					return;
				}

				if (elementOffset.top + elementSize.height > viewportOffset.top && elementOffset.top < viewportOffset.top + viewportSize.height && elementOffset.left + elementSize.width > viewportOffset.left && elementOffset.left < viewportOffset.left + viewportSize.width) {
					if (!inView) {
						$element.data('inview', true).trigger('inview', [true]);
					}
				} else if (inView) {
					$element.data('inview', false).trigger('inview', [false]);
				}
			}
		}


		$(w).on("scroll resize scrollstop", function() {
			viewportSize = viewportOffset = null;
		});

		// IE < 9 scrolls to focused elements without firing the "scroll" event
		if (!documentElement.addEventListener && documentElement.attachEvent) {
			documentElement.attachEvent("onfocusin", function() {
				viewportOffset = null;
			});
		}
	}));
	
	//https://gomakethings.com/setting-multiple-javascript-plugin-options-with-a-single-data-attribute/
var getDataOptions = function(options) {
	var settings = {};

	// Trim whitespace from a string
	var trim = function(string) {
		return string.replace(/^s+|s+$/g, '');
	};

	// Create a key/value pair for each setting
	if (options) {
		options = options.split(';');
		options.forEach(function(option) {
			option = trim(option);
			if (option !== '') {
				option = option.split(':');
				settings[option[0]] = trim(option[1]);
			}
		});
	}

	return settings;
};

var ros = {
	init : function() {

		$('[data-ros]').css('visibility', 'hidden');

		$('[data-ros]').on('inview', function(event, isInView) {
			var $this = $(this);

			if (isInView) {
				if ($(this).css("visibility") == 'hidden') {
					var options = getDataOptions($this.data('options')) || null;
					$(this).animateCSS($this.data('ros'), options);
				}

				// element is now visible in the viewport
			} else {
				// element has gone out of viewport
				if ($(this).css("visibility") == 'visible') {
					$(this).css('visibility', 'hidden');

				}

			}
		});

	}
}