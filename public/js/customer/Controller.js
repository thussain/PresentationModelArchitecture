/**
 * User: Taha
 * Date: 12/30/11
 */

YUI.add('customer-controller', function(Y) {
    var	CustomerController;

    CustomerController = new Y.Base.create('customerController', Y.App, [], {

	    views: {
		    listView: {
			    type:  Y.MVRPExample.CustomerListPresenter
			    //,preserve: true
		    },

		    editView: {
			    type  : Y.MVRPExample.CustomerEditPresenter,
			    parent: 'listView'
		    }
	    },


	    initializer: function () {

		    this.on('customerEditPresenter:cancelEdit', this.navigateToList);
		    this.on('customerListPresenter:editCustomer', this.navigateToEdit);
		    this.on('customerListPresenter:addCustomer', this.navigateToAdd);

            this.once('ready', function (e) {
                if (this.hasRoute(this.getPath())) {
                    this.dispatch();
                } else {
                    this.showListView();
                }
            });
        },

        // -- Event Handlers -------------------------------------------------------
        navigateToList: function (e) {
            this.navigate('/customer/');
        },

	    navigateToEdit: function (e) {
		    this.navigate('/customer/'+e.id+'/');
	    },

	    navigateToAdd: function (e) {
		    this.navigate('/customer/0/');
	    },

        showListView: function (req) {
	        this.showView('listView');
        },

	    showEditView: function (req) {
		    this.showView('editView', {
			    id : req.params.id
		    });
	    }


    }, {
        ATTRS: {

            routes: {
                value: [
                    {path: '/customer/',    callback: 'showListView'},
                    {path: '/customer/:id/',    callback: 'showEditView'}
                ]
            }
        }
    });

    Y.namespace('MVRPExample');
    Y.MVRPExample.CustomerController = CustomerController;

}, '0.0.1', {requires: ['app',
                        'customer-list-view',
                        'customer-list-presenter',
						'customer-edit-view',
						'customer-edit-presenter']}
);