/**
 * User: Taha
 * Date: 12/30/11
 */
YUI.add('customer-list-view', function(Y) {

	var CustomerListView;

	CustomerListView = Y.Base.create('customerListView', Y.View, [], {

		model                   :   Y.MVRPExample.Customer,
		modelList               :   Y.MVRPExample.CustomerList,
		menuTemplate            :   Y.Handlebars.compile(Y.one('#menu-controls').getContent()),
		quickEditTemplate       :   Y.Handlebars.compile(Y.one('#quick-add-content').getContent()),
		table                   :   null,
		panel                   :   null,
		deleteConfirmDialog     :   null,

		events: {
			'#btnAdd' : {
				click : 'onAdd'
			},
			'#btnDelete' : {
				click : 'onDelete'
			},
			'.yui3-datatable-columns .chkSelectAll' : {
				click : 'chkSelectAll_onClick'
			},
			'.yui3-datatable-data tr td .chkSelect' : {
				click : 'chkSelect_onClick'
			},
			'.yui3-datatable-data tr td button': {
				click : 'btnEdit_onClick'
			}


		},

		initializer: function () {
			var self = this;

			var quickAddContent = Y.Node.create(this.quickEditTemplate());

			this.panel = new Y.Panel({
				srcNode      : quickAddContent,
				headerContent: 'Add A New Customer',
				width        : 250,
				zIndex       : 5,
				centered     : true,
				modal        : true,
				visible      : false,
				plugins      : [Y.Plugin.Drag]
			});

			this.panel.addButton({
				value  : 'Save',
				section: Y.WidgetStdMod.FOOTER,
				action : function (e) {
					e.preventDefault();
					self.fire('saveQuickAdd', {value: '22'});
				}
			});

		},

		render: function () {
			var data = this.get('model'),
				dataList = this.get('modelList').toJSON(),
				self = this,
				content;
			var container = this.get('container');


			content = Y.Node.create('<div class="yui3-skin-sam"></div>');

			var columns = [
				{ key: "select", label: '<input type="checkbox" class="chkSelectAll"/>', formatter: this.formatCheckbox},
				{ key: "editLabel", label: "", formatter: this.formatEditButton},
				{ key: "accountId", label: "Account ID"},
				{ key: "companyName", label: "Company Name"},
				{ key: "customerTypeName", label: "Type"},
				{ key: "taxonomyOwnerName", label: "Taxonomy Owner"},
				{ key: "isMember", label: "Member", formatter: this.formatBoolean},
				{ key: "isSubsidiary", label: "Subsidiary", formatter: this.formatBoolean},
				{ key: "minAmount", label: "Minimum Amount", formatter: "\${value}"},
				{ key: "agencyTypeName", label: "Agency Type"},
				{ key: "lastUpdated", label: "Last Updated"},
				{ key: "lastUpdatedBy", label: "Last Updated By"}
			];

			this.table = new Y.DataTable.Base({
				columnset: columns,
				recordset: dataList
			}).render(content);

			var menuBar = this.menuTemplate();

			container.setContent(menuBar);
			container.append(content);

			return this;
		},

		refreshRows : function() {

			var dataList = this.get('modelList').toJSON();
			this.table.set('recordset', dataList);

		},

		onAdd : function() {
			this.fire('addNew');
		},

		showQuickAddForm : function() {
			if (!this.panel.rendered) {
				this.panel.render();
			}
			this.panel.show();
		},

		onDelete : function() {
			this.fire('delete');
		},
		showDeleteConfirmation : function() {
			var self = this;
			if (!this.deleteConfirmDialog) {

				var srcNode = Y.Node.create("<div/>");
				this.deleteConfirmDialog = new Y.Panel({
					headerContent: 'Confirm',
					bodyContent: 'Are you sure you want to delete selected item(s)?',
					srcNode    : srcNode,
					width      : 400,
					zIndex     : 6,
					centered   : true,
					modal      : true,
					render     : true,
					buttons: [
						{
							value  : 'Yes',
							section: Y.WidgetStdMod.FOOTER,
							action : function (e) {
								e.preventDefault();
								self.fire('deleteConfirmation', {response: true});
							}
						},
						{
							value  : 'No',
							section: Y.WidgetStdMod.FOOTER,
							action : function (e) {
								e.preventDefault();
								self.fire('deleteConfirmation', {response: false});
							}
						}
					]
				});
			}
			this.deleteConfirmDialog.show();
		},
		hideDeleteConfirmation : function() {
			this.deleteConfirmDialog.hide();
		},

		closeQuickAddForm : function() {
			this.panel.hide();
		},

		formatCheckbox : function (o) {
			return '<input type="checkbox" class="chkSelect"/>';
		},

		btnEdit_onClick : function(e) {

			var records = this.table.get("recordset"),
				currentRecord = records.getRecord( e.currentTarget.ancestor('tr').get("id"));
			this.fire('editDetails', {id: currentRecord.getValue("id")});

		},

		formatEditButton : function (o) {
			return '<button class="btnEdit">Edit</button>';
		},
		formatBoolean : function (o) {
			return o.value? 'Yes' : 'No';
		},

		chkSelect_onClick : function(e){

			var chk = e.currentTarget;
			var records = this.table.get("recordset"),
				currentRecord = records.getRecord( e.currentTarget.ancestor('tr').get("id"));
			this.fire('itemSelectionModified', {id: currentRecord.getValue('id'), selected:chk.get('checked')});
		},

		_highlightRow : function(row, highlight) {
			if (highlight) {
				row.all('td').addClass('yui3-datatable-selected');
			}
			else {
				row.all('td').removeClass('yui3-datatable-selected');
			}
		},

		chkSelectAll_onClick : function(e){
			var chkAll = e.currentTarget;
			this.fire('allItemsSelectionModified', {selected:chkAll.get('checked')});
		},
		selectRecords : function(ids) {
			this._changeRowSelection(ids, true);
		},
		unSelectRecords : function(ids) {
			this._changeRowSelection(ids, false);
		},
		_changeRowSelection : function(ids, selected) {
			var self = this;
			var rows = this._getRows(ids);
			rows.forEach(function(row, index, list){
				row.one('.chkSelect').set('checked', selected);
				self._highlightRow(row, selected);
			});
		},
		_getRows : function(ids) {
			var records = this.table.get("recordset");
			var tblNode = this.table.get('srcNode').one('table');
			var self = this;
			var rows = [];

			tblNode.all('.yui3-datatable-data tr').each(function(row, index, list){
				var rowId = records.getRecord( row.get("id") ).getValue("id")
				if (ids.indexOf(rowId) > -1) {
					rows.push(row);
				}
			});
			return rows;
		},

		enableBulkEdit : function(enable) {
			this._enableButton('#btnBulkEdit', enable);
		},
		enableDelete : function(enable) {
			this._enableButton('#btnDelete', enable);
		},
		_enableButton : function(sel, enable) {
			Y.one(sel).set('disabled', !enable);
		},

		showLoadingIndicator : function() {
			this.get('container').addClass('loading');
		},
		hideLoadingIndicator : function() {
			this.get('container').removeClass('loading');
		}


	}, {

		ATTRS:{
		}

	});

	Y.namespace('MVRPExample');
	Y.MVRPExample.CustomerListView = CustomerListView;

}, '0.0.1', {requires: ['app',
	'handlebars',
	'datatable',
	'customers-alist-template',
	'customer-model',
	'customer-model-list',
	'customer-list-pm',
	'panel',
	'dd-plugin',
	'dump']});