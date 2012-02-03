/**
 * User: Taha
 * Date: 12/30/11
 */
YUI.add('customer-model-list', function(Y) {

    var CustomerList;

    CustomerList = Y.Base.create('customerList', Y.ModelList, [], {
        model    : Y.MVRPExample.Customer,

	    del: function (options, callback) {
		    var self = this;

			// Allow callback as only arg.
		    if (typeof options === 'function') {
			    callback = options;
			    options = {};
		    }

		    this.sync('delete', options, function (err, response) {
			    if (!err) {
				    self.reset(self.parse(response), options);
			    }

			    callback && callback.apply(null, arguments);
		    });

		    return this;
	    },
        // Custom sync layer.
        sync: function (action, options, callback) {
            var data, io, configuration, uri;

                if (action === 'read') {


                uri = "/customer/list";

	            configuration = {
		            on: {
			            complete: function(o) {
				            callback(null, o.data.responseText);
			            }
		            }
	            };

	            io = new Y.IO({
		            emitFacade: true, // Event handlers will receive an Event Facade.
		            bubbles: true // Events will bubble to registered event targets.
	            });

	            io.send(uri, configuration);

            } if (action === 'delete') {

                uri = "/customer/delete";


                configuration = {
                    method  : 'DELETE',
                    data    : options,
                    on      : {
                        complete: function(o) {
                            callback(null, o.data.responseText);
                        }
                    }
                };

                io = new Y.IO({
                    emitFacade: true, // Event handlers will receive an Event Facade.
                    bubbles: true // Events will bubble to registered event targets.
                });

                io.send(uri, configuration);

            }
            else {
                callback('Unsupported sync action: ' + action);
            }
        }

    }, {
        ATTRS: {

        }
    });

    Y.namespace('MVRPExample');
    Y.MVRPExample.CustomerList = CustomerList;

}, '0.0.1', {requires: ['app',
                        'io']
});
