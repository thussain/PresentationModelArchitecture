/**
 * User: Taha
 * Date: 1/2/12
 */
YUI.add('customer-list-pm', function(Y) {

	var CustomerListPM;
	CustomerListPM = Y.Base.create('customerListPM', Y.Model, [], {

		initializer: function (config) {
			this.changed = {};
			this.lastChange = {};
			this.lists = [];

			this.after('fieldsChange', this._calculateState);

		},

		_calculateState : function (event) {

			var newVal = (event.newVal.selectedItems.length > 0);
			var curVal = this.get('state.BulkOperationsAllowed');
			if (newVal != curVal) {
				this._set('state.BulkOperationsAllowed', newVal);
			}
		},

        addItems : function (items) {
            var selectedItems = this.get('fields.selectedItems');
	        items.forEach(function(value){
		        if (selectedItems.indexOf(value) < 0) {
			        selectedItems.push(value);
		        }
	        });
            this.set('fields.selectedItems', selectedItems);
        },
        removeItems : function (items) {
            var selectedItems = this.get('fields.selectedItems');
            var remainingItems = [];
	        selectedItems.forEach(function(value){
				if (items.indexOf(value) < 0) {
					remainingItems.push(value);
				}
            });
            this.set('fields.selectedItems', remainingItems);
        }

	}, {
		ATTRS:{
			fields : {
				value : {
					selectedItems : []
				}
			},
			state : {
				value : {
					BulkOperationsAllowed : {
						value : false,
						readOnly : true,
						validator : function(val) {
							return value != val;
						}
					}

				}
			}

		}
	});

	Y.namespace('MVRPExample');
	Y.MVRPExample.CustomerListPM = CustomerListPM;

}, '0.0.1', {requires: ['app', 'dump']});
