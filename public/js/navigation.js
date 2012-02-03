/**
 * Created by JetBrains WebStorm.
 * User: Taha
 * Date: 2/2/12
 * Time: 12:28 AM
 * To change this template use File | Settings | File Templates.
 */


//  Call the "use" method, passing in "node-menunav".  This will load the
//  script and CSS for the MenuNav Node Plugin and all of the required
//  dependencies.

YUI().use('node-menunav', function(Y) {

	//  Retrieve the Node instance representing the root menu
	//  (<div id="productsandservices">) and call the "plug" method
	//  passing in a reference to the MenuNav Node Plugin.

	var menu = Y.one("#navigation_container");

	menu.plug(Y.Plugin.NodeMenuNav);

	//  Show the menu now that it is ready

	//menu.get("ownerDocument").get("documentElement").removeClass("yui3-loading");

});

