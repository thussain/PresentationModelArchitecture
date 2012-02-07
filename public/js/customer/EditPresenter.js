/**
 * User: Taha
 * Date: 12/31/11
 */
YUI.add('customer-edit-presenter', function(Y) {
	var CustomerEditPresenter;

	CustomerEditPresenter = Y.Base.create('customerEditPresenter', Y.View, [], {

		model       :   Y.MVRPExample.Customer,
		view        :   null,
		lookups     :   null,

		initializer: function () {
			var self = this;

			this.publish('cancelEdit', {preventable: false});

			this.set('pm', new Y.MVRPExample.CustomerEditPM());
			this.get('pm').set('entityId',this.get('id'));

			this.get('pm').after('stateChange', this._handleStateChange, this);
			this.get('pm').after('taxonomyOwnerChange', this._handleTaxonomyOwnerStateChanged, this);
			this.get('pm').after('agencyAllowedChange', this._handleAgencyStateChange, this);
			this.get('pm').after('currencyStateChange', this._handleCurrencyStateChange, this);


			Y.MVRPExample.LookupsHelper.load(function(err, data){
				self.lookups = data;
				self.get('pm').set('fields.lookups_downloaded', true);
			});


		},

		render: function () {

			var self = this;
			var content = Y.one(this.get('container'));
			this.view = new Y.MVRPExample.CustomerEditView();

			var customer = new Y.MVRPExample.Customer();

			if (!Y.Lang.isNull(this.get('id')) && this.get('id') > 0) {
				customer.set('id', this.get('id'));
			}
			this.set('model', customer);
			this.view.set('model', customer);


			this.view.on('doCancel', this.doCancelEdit, this);
			this.view.on('taxonomyOwnerChanged', this.taxonomyOwnerChanged, this);
			this.view.on('accountTypeChanged', this.accountTypeChanged, this);

			this.view.on('isAgencyModified', this.isAgencyModified, this);

			this.view.on('agencyTypeChanged', this.agencyTypeChanged, this);
			this.view.on('currenciesChanged', this.currenciesChanged, this);
			this.view.on('defaultCurrencyChanged', this.defaultCurrencyChanged, this);


			if (!customer.isNew()) {
				this.get('model').load(function (err, response) {
					if (!err) {
						self.get('pm').set('fields.data_downloaded', true);
					}
				});

			}
			this._showView();
			self.get('pm').set('fields.view_rendered', true);

			return this;

		},

		_showView: function (req) {

			//this.get('view').set('model', this.get('model'));
			this.get('container').setContent(this.view.render().get('container'));
			this.view.showLoadingIndicator();
		},

		_handleStateChange : function(event) {
			var state = event.newVal.LOADING_STATE.value;
			var agencyChecked;
			var model = this.get('model');

			if (state == 'CAN_FILL_LOOKUPS') {

				this.fillLookups();
				this.get('pm').set('fields.lookups_filled', true);

			}
			else if (state == 'CAN_FILL_DATA') {

				this.view.setData();
				this.get('pm').set('fields.data_filled', true);

			} else if (state == 'DATA_FILLED') {

				agencyChecked = !Y.Lang.isNull(model.get('agencyType')) && model.get('agencyType') != 0;
				this.view.setIsAgency(agencyChecked);

				var title = model.isNew()?
					'Add Customer' : 'Edit ' + this.get('model').get('companyName');

				this.view.setTitle(title);

				//order matters
				this.get('pm').setAttrs({
					defaultCurrency     :   model.get('defaultCurrency'),
					selectedCurrencies  :   model.get('currencies'),

					agencyType          :   model.get('agencyType'),
					agencyChecked       :   agencyChecked,

					accountType         :   model.get('accountType'),
					taxonomyOwner       :   model.get('taxonomyOwner')

				});

				this.view.hideLoadingIndicator();
			}

		},

		fillLookups : function() {
			var view = this.view;
			view.setTimezoneCollection(this.lookups.TIMEZONES);
			view.setCurrencyCollection(this.lookups.CURRENCIES);
			view.setAccountTypeCollection(this.lookups.ACCOUNT_TYPES);
			view.setAgencyTypeCollection(this.lookups.AGENCY_TYPES);
			view.setLanguageCollection(this.lookups.SUPPORTED_LANGUAGES);
			view.setTaxonomyOwnerCollection(this.lookups.TAXONOMY_OWNERS);
			view.setTaxonomyOwnerCollection(this.lookups.TAXONOMY_OWNERS);
			view.setDefaultCurrencyCollection([]);

		},

		doCancelEdit : function() {
			this.fire('cancelEdit');
		},

		taxonomyOwnerChanged : function(event) {
			this.get('pm').set('taxonomyOwner', event.taxonomyOwner);
		},


		_handleTaxonomyOwnerStateChanged : function(event) {
			var pm = this.get('pm');

			var accountTypes = this.lookups.ACCOUNT_TYPES;
			var accountTypeToSet = pm.get('accountType');
			var accountTypeExists = false;
			var taxonomyOwnerId = event.newVal;

			if (taxonomyOwnerId == 'CTM') {
				accountTypes = accountTypes.filter(function(item,index, arr){
					return item.id != 'VN';
				});
			}
			if ( !Y.Lang.isNull(accountTypeToSet) ) {
				accountTypeExists = accountTypes.some(function(value, index, arr) {
					if (accountTypeToSet == value.id) {
						return true;
					}
				});
			}
			this.view.setAccountTypeCollection(accountTypes);
			if (accountTypeToSet && accountTypeExists) {
				this.view.setAccountType(accountTypeToSet);
			}

		},

		accountTypeChanged : function(event) {
			this.get('pm').set('accountType', event.accountType);
		},

		currenciesChanged : function(o) {
			this.get('pm').set('selectedCurrencies', o.currencies);
		},
		_handleCurrencyStateChange : function(o) {
			var selectedCurrenciesIds, defaultCurrency;
			if (o.newVal == 'OPTIONS_OUT_OF_SYNC') {

				selectedCurrenciesIds = this.get('pm').get('selectedCurrencies');
				this.updateDefaultCurrencyOptions(selectedCurrenciesIds);
				this.get('pm').set('defaultCurrencyOptions', selectedCurrenciesIds);

			} else if (o.newVal == 'DEFAULT_VALUE_OUT_OF_SYNC') {

				defaultCurrency = this.get('pm').get('defaultCurrency');
				this.view.setDefaultCurrency(defaultCurrency);

			}
		},
		updateDefaultCurrencyOptions : function(selectedCurrenciesIds) {
			var selectedOptionIds, selectedCurrencies;

			selectedCurrenciesIds = this.get('pm').get('selectedCurrencies');
			selectedCurrencies = this.lookups.CURRENCIES.filter(function(item,index, arr){
				return selectedCurrenciesIds.indexOf(item.id) > -1;
			});

			this.view.setDefaultCurrencyCollection(selectedCurrencies);
		},

		isAgencyModified : function(o) {
			this.get('pm').set('agencyChecked', o.selected);
		},

		_handleAgencyStateChange : function(event) {
			var agencyType = this.get('pm').get('agencyType') || '0';
			this.view.enableAgencyType(event.newVal);
			if (event.newVal) {
				this.view.setAgencyType(agencyType);
			} else {
				this.view.setAgencyType(0);
			}
		},

		agencyTypeChanged : function(o) {
			this.get('pm').set('agencyType', o.agencyType);
		},

		defaultCurrencyChanged : function(o) {
			this.get('pm').set('defaultCurrency', o.defaultCurrency);
		}

	}, {
		ATTRS:{
			id : 0,
			pm:{value: null}
		}
	});


	Y.namespace('MVRPExample');
	Y.MVRPExample.CustomerEditPresenter = CustomerEditPresenter;


}, '0.0.1', {requires: ['app', 'customer-edit-view', 'customer-edit-pm', 'lookups-helper']});