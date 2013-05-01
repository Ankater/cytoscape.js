(function($){

  var BirdsEyeView = function ( element, options ) {
		this.init(element, options);
	};

	BirdsEyeView.prototype = {

		constructor: BirdsEyeView,
		destroy: function () {
			this.$element.remove();
		},
		initMniature: function () {
			this.$Mniature = $('<div class="cytoscape-birdseyeviewMniature"/>');
			var birdseyeViewRatio = 1.0 * this.$panel.width() / this.$panel.height(),
			birdseyeviewMniatureRatio = 1.0 * this.$element.width() / this.$element.height();
			if( birdseyeViewRatio > birdseyeviewMniatureRatio ) {
				this.$Mniature.width(birdseyeviewMniatureRatio * this.$panel.height());
				this.$Mniature.height(this.$panel.height());
				this.$Mniature.css({left: 0});
			} else {
				this.$Mniature.width(this.$panel.width());
				this.$Mniature.height(birdseyeviewMniatureRatio * this.$panel.width());
				this.$Mniature.css({top: (this.$panel.height() - this.$Mniature.width())/2});
}
			this.$panel.append(this.$Mniature);
			this.initView();
		}, 
		initPanel: function () {
			var options = this.options;
			if( options.container ) {
				if( options.container instanceof jQuery ){
					if( options.container.length > 0 ){
						this.$panel = options.container.first();
						options.forceClassName && this.$panel.addClass(options.className);
					} else {
						$.error("Container for jquery.cyBirdsEyeView is empty");
						return;
					}
				} else if ( $(options.container).length > 0 ) {
					this.$panel = $(options.container).first();
					options.forceClassName && this.$panel.addClass(options.className);
				} else {
					return;
				}
			} else {
				this.$panel = $('<div class="'+options.className+'"/>');
				this.$element.append(this.$panel);
			}
			this.$panel.width(options.size.width);
			this.$panel.height(options.size.height);
			this.$panel.css({top: options.position.vertical, left: options.position.horizontal});
			this.initMniature();
		},
		init: function ( element, options ) {
			this.$element = $(element)
			this.options = $.extend(true, {}, $.fn.cytoscapeBirdsEyeView.defaults, options);
			this.initPanel()
		},
		stop: function () {
			if( !that.options.live ) {
				that.moveCy();
			}
		}, 
		initView: function () {
			var that = this, 
			cy = this.$element.cytoscape('get');
			this.$view = $('<div class="cytoscape-birdseyeviewView"/>');
			this.$Mniature.append(this.$view);
			this.$view.draggable({
			containment: this.$Mniature, 
			scroll: false, 
			drag: function () {
				if( that.options.live ) {
					that.moveCy();
				}
		}
});
this.$view.on('click.BirdsEyeView mousedown.BirdsEyeView touchstart.BirdsEyeView ', function (ev) {
	ev.stopPropagation();
})
this.setView();
this.$element.cytoscape('get').on('zoom pan', function () {
	that.setView();
})
},
moveCy: function () {
	var that = this,	
	position = {
		left: parseFloat(that.$view.css('left')),
		top: parseFloat(that.$view.css('top'))
	},
	borderDouble = this.options.view.borderWidth * 2, 
	MniatureWidth = this.$Mniature.width() - borderDouble, 
	MniatureHeight = this.$Mniature.height() - borderDouble,
	cy = this.$element.cytoscape('get'), 
	cyZoom = cy.zoom(), 
	cyPanNew = {x: 0, y: 0}, 
	elementWidth = this.$element.width(), 
	elementHeight = this.$element.height(), 
	cyWidth = elementWidth * cyZoom, 
	cyHeight = elementHeight * cyZoom;

	cyPanNew.x = -position.left * cyWidth / MniatureWidth;
	cyPanNew.y = -position.top * cyHeight / MniatureHeight;
	cy.pan(cyPanNew);
}, 
setView: function () {
	var width = 0, 
	height = 0, 
	position = {left: 0, top: 0}, 
	visible = true,
	borderDouble = this.options.view.borderWidth, 
	MniatureWidth = this.$Mniature.width() - borderDouble, 
	MniatureHeight = this.$Mniature.height() - borderDouble,
	cy = this.$element.cytoscape('get'), 
	cyZoom = cy.zoom(), 
	cyPan = cy.pan(), 
	elementWidth = this.$element.width(), 
	elementHeight = this.$element.height(), 
	cyWidth = elementWidth * cyZoom, 
	cyHeight = elementHeight * cyZoom;
	if( cyPan.x > elementWidth || cyPan.x < -cyWidth || cyPan.y > elementHeight || cyPan.y < -cyHeight) {
		visible = false;
		this.$view.hide();
	} else {
		visible = true;
		position.left = -MniatureWidth * (cyPan.x / cyWidth);
		position.right = position.left + (MniatureWidth / cyZoom);
		position.left = Math.max(0, position.left);
		position.right = Math.min(MniatureWidth, position.right);
		width = position.right - position.left;
		delete position.right;
		position.top = -MniatureHeight * (cyPan.y / cyHeight);
		position.bottom = position.top + (MniatureHeight / cyZoom);
		position.top = Math.max(0, position.top);
		position.bottom = Math.min(MniatureHeight, position.bottom);
		height = position.bottom - position.top;
		delete position.bottom;
		this.$view.show().width(width).height(height).css(position);
	}
}
}
$.fn.cytoscapeBirdsEyeView = function ( option ) {
	return this.each(function () {
		var $this = $(this), 
		data = $this.data('birdseyeView'), 
		options = typeof option == 'object' && option;
		if ( !data ) $this.data('birdseyeView', (data = new BirdsEyeView(this, options)));
		if ( typeof option == 'string' ) data[option]();
		})
}
$.fn.cytoscapeBirdsEyeView.Constructor = BirdsEyeView;
$.fn.cytoscapeBirdsEyeView.defaults = {
	container: false, 
	live: true, 
	forceClassName: true,
	className: 'cytoscape-birdseyeView', 
	size: {
		width: 150,
		height: 150 
	},
	view: {
		borderWidth: 1
	},
	position: {
		vertical: 449, 
		horizontal: 449
	}
};
$.fn.cyBirdsEyeView = $.fn.cytoscapeBirdsEyeView;
})(jQuery);
