YUI().use('customer-controller', 'app', function(Y) {
	// -- Go-go-gadget App! --------------------------------------------------------

	// Create and render a new instance of our `ContributorsApp`!
	new Y.MVRPExample.CustomerController({
		// Here we set our app's rendering container, and restrict which links on
		// the page should cause the app to navigate.
		container   : '#page-content'

	}).render();

});
