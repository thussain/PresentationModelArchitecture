/**
 * User: Taha
 * Date: 2/2/12
 */


YUI().use('node-menunav', function(Y) {

	var menu = Y.one("#navigation_container");

	menu.plug(Y.Plugin.NodeMenuNav);

});

