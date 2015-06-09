/*
 *  jquery-dom-router - v1.0.0
 *  Fire JavaScript based on body classes. Based off the DOM router in the Sage WordPress Theme.
 *  http://jqueryboilerplate.com
 *
 *  Made by Tor Morten Jensen
 *  Under MIT License
 */
;(function ( $ ) {

    if(!$.fn.watch && !$.fn.unwatch) {
    	
    	/**
    	 * Watches an element for a change in a property
    	 * @param  {string}   id The property to watch
    	 * @param  {Function} fn The function to execute when something has changed
    	 */
	    $.fn.watch = function( id, fn ) {
	 
		    return this.each(function(){
		 
		        var self = this;
		 
		        var oldVal = self[id];
		        $(self).data(
		            'watch_timer',
		            setInterval(function(){
		                if (self[id] !== oldVal) {
		                    fn.call(self, id, oldVal, self[id]);
		                    oldVal = self[id];
		                }
		            }, 100)
		        );
		 
		    });
		};

		/**
		 * Unwatches an element
		 */
		$.fn.unwatch = function() {
		 
		    return this.each(function(){
		        clearInterval( $(this).data('watch_timer') );
		    });
		 
		};

	}

    if (!$.DOMRouter) {
        $.DOMRouter = {
        	router: function(el, routes) {
		        var base = this;
		        base.$el = $(el);
		        base.el = el;
		        base.$el.data( 'DOMRouter.router' , base );

		        /**
		         * Initalize the functions
		         * @return {void}
		         */
		        base.init = function () {
		            base.routes = routes;
		            $(document).ready(base.load);

		            base.executed = [];

		            $(document).find('body').watch('className', function(property, oldClasses, newClasses) {
		            	var classes = newClasses.replace(/-/g, '_').split(/\s+/);

		            	$.each(classes, function(i, className) {
		            		if(!base.routeExecuted(className, base_classes)) {
		            			base.fire(className);
		            		}
		            	});
		            });
		        };

		        /**
		         * Checks if a route has been executed already
		         * @param  {string} 	route        [description]
		         * @return {boolean}	
		         */
		        base.routeExecuted = function(route) {
		        	return base.executed.indexOf(route) > -1;
		        };

		        /**	
		         * Gets the classes on the body element
		         * @return {array}
		         */
		        base.classes = function() {
		        	return document.body.className.replace(/-/g, '_').split(/\s+/);
		        };

		        /**
		         * Load all events to be fired
		         * @return {void}
		         */
	        	base.load = function() {
	        		base.fire('common');
	        		$.each(base.classes(), function(i, className) {
	        			base.fire(className);
	        		});
	        	};

	        	/**
	        	 * Fire an event
	        	 * @param  {Function} func The function to be fired
	        	 * @param  {Array} args Arguments
	        	 * @return {Void}
	        	 */
	        	base.fire = function(func, args) {
	        		var fire,
	        			routes = base.routes;

	        		fire = func !== '';
	        		fire = fire && routes[func];
      				fire = fire && typeof routes[func] === 'function';

      				if(fire) {
	      				routes[func](args);
            			base.executed.push(className);
	      			}
	        	};
		        
		        // Run initializer
		        base.init();

        	}
        };
    }

    $.fn.router = function( routes ) {
        return this.each(function () {
            (new $.DOMRouter.router(this, routes));
        });
    };

})( jQuery );