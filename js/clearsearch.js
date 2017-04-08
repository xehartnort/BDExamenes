(function($) {
	$.fn.clearSearch = function(options) {
		var settings = $.extend({
			'clearClass' : 'clear_input',
			'focusAfterClear' : true,
			'linkText' : '&times;'
		}, options);
		return this.each(function() {
					var $this = $(this), btn,
						divClass = settings.clearClass + '_div';

					if (!$this.parent().hasClass(divClass)) {
						$this.wrap('<div style="position: relative;" class="'
							+ divClass + '">' + $this.html() + '</div>');
						$this.after('<a style="position: absolute; cursor: pointer;" class="'
							+ settings.clearClass + '">' + settings.linkText + '</a>');
					}
					btn = $this.next();

					function clearField() {
						$this.val('').change();
						triggerBtn();
						if (settings.focusAfterClear) {
							$this.focus();
						}
						if (typeof (settings.callback) === "function") {
							settings.callback();
						}
					}

					function triggerBtn() {
						if (hasText()) {
							btn.show();
						} else {
							btn.hide();
						}
						update();
					}

					function hasText() {
						return $this.val().replace(/^\s+|\s+$/g, '').length > 0;
					}

					function update() {
						var width = $this.outerWidth(), height = $this
								.outerHeight();
						btn.css({
							top : height / 2 - btn.height() / 2,
							left : width - height / 2 - btn.height() / 2
						});
					}

					btn.on('click', clearField);
					$this.on('keyup keydown change focus', triggerBtn);
					triggerBtn();
				});
	};
})(jQuery);