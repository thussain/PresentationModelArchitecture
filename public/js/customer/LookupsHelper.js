YUI.add('lookups-helper', function(Y) {

	var LookupsHelper;

	LookupsHelper = function () {};

	LookupsHelper.load = function (callback) {
		var uri, configuration, io;

		Y.Lang.isFunction(callback) || (callback = function () {});

		uri = "/customer/lookups";

		configuration = {
			method  : 'GET',
			on      : {
				complete: function(o) {
					callback(null, Y.JSON.parse(o.data.responseText));
				}
			}
		};

		io = new Y.IO({
			emitFacade: true, // Event handlers will receive an Event Facade.
			bubbles: true // Events will bubble to registered event targets.
		});

		io.send(uri, configuration);

	};

	Y.namespace('MVRPExample');
	Y.MVRPExample.LookupsHelper = LookupsHelper;

}, '0.0.1', {requires: ['app', 'io']});
