YUI().use('customer-controller', 'app', function(Y) {

	// Create and render a new instance of our controller
	new Y.MVRPExample.CustomerController({
		// Here we set our app's rendering container
		container   : '#page-content'

	}).render();

});
