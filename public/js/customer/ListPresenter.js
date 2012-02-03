/**
 * User: Taha
 * Date: 12/30/11
 */
YUI.add('customer-list-presenter', function(Y) {
	var CustomerListPresenter;

	CustomerListPresenter = Y.Base.create('customerListPresenter', Y.View, [], {

		model       :   Y.MVRPExample.Customer,
		modelList   :   Y.MVRPExample.CustomerList,
		view        :   null,


		initializer: function () {
			this.publish('editCustomer', {preventable: false});
			this.publish('addCustomer', {preventable: false});

			this.set('pm', new Y.MVRPExample.CustomerListPM());
			this.get('pm').after('stateChange', this._handleStateChange, this);

		},

        render: function () {
            var self = this;
	        var content = Y.one(this.get('container'));

	        var list = new Y.MVRPExample.CustomerList();
	        this.set('modelList', list);

	        this.view = new Y.MVRPExample.CustomerListView({
		        modelList : list
	        });

	        this.view.on('editDetails', this.doEditDetails, this);
	        this.view.on('addNew', this.doAdd, this);

	        this.view.on('quickAdd', this.doQuickAdd, this);
	        this.view.on('saveQuickAdd', this.doQuickAddSave, this);
            this.view.on('delete', this.doDelete, this);
	        this.view.on('deleteConfirmation', this.doDeleteConfirmation, this);

	        this.view.on('itemSelectionModified', this.doItemSelection, this);
	        this.view.on('allItemsSelectionModified', this.doAllItemsSelection, this);
	        this._showView();

	        list.load(function (err, response) {
                if (!err) {
	                self.view.refreshRows();
	                self._enableBulkOperations(self.get('pm').get('state.BulkOperationsAllowed.value'));
	                self.view.hideLoadingIndicator();
                }
            });

        },


        _showView: function () {
	        this.get('container').setContent(this.view.render().get('container'));
	        this.view.showLoadingIndicator();
        },

	    doEditDetails : function(id) {
		    this.fire('editCustomer', id);
	    },
		doAdd : function() {
			this.fire('addCustomer');
		},
		doItemSelection : function(e) {
			if (e.selected) {
				this.view.selectRecords([e.id]);
				this.get('pm').addItems([e.id]);
			}
			else {
				this.view.unSelectRecords([e.id]);
				this.get('pm').removeItems([e.id]);
			}
		},
		doAllItemsSelection : function(e) {
			var ids = this.get('modelList').map(function(m){
				return m.get('id');
			});
			if (e.selected) {
				this.view.selectRecords(ids);
				this.get('pm').addItems(ids);
			}
			else {
				this.view.unSelectRecords(ids);
				this.get('pm').removeItems(ids);
			}

		},
		doDelete : function() {
			this.view.showDeleteConfirmation();
		},
        doDeleteConfirmation : function(e) {
	        if (e.response) {
		        var self = this;
		        var selectedItems = this.get('pm').get('fields.selectedItems');

		        this.get('modelList').del(selectedItems, function (err, response) {
			        if (!err) {
				        self.view.refreshRows();
				        self.get('pm').removeItems(selectedItems);
			        }
		        });
	        }
	        this.view.hideDeleteConfirmation();

        },

		doQuickAdd : function(e) {
			this.view.showQuickAddForm();
		},
		doQuickAddSave : function(e) {
			this.view.closeQuickAddForm();
		},

		_handleStateChange : function(event) {

			if (event.subAttrName == 'state.BulkOperationsAllowed') {
				this._enableBulkOperations(event.newVal.BulkOperationsAllowed);
			}
		},

		_enableBulkOperations : function(value) {

			this.view.enableBulkEdit(value);
			this.view.enableDelete(value);

		}
	}, {

		ATTRS:{
			pm:{value: null}
		}

	});
    Y.namespace('MVRPExample');
    Y.MVRPExample.CustomerListPresenter = CustomerListPresenter;


}, '0.0.1', {requires: ['app',
						'customer-list-view',
						'customer-list-pm']});