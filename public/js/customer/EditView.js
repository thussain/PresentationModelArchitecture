/**
 * User: Taha
 * Date: 12/31/11
 */
YUI.add('customer-edit-view', function(Y) {

	var CustomerEditView;

	CustomerEditView = Y.Base.create('customerEditView', Y.View, [], {

		model       :   Y.MVRPExample.Customer,

		template    :   Y.Handlebars.compile(Y.one('#customer-form').getContent()),
		panel       :   null,

		events: {
			'#btnSave': {
				click: 'onSave'
			},

			'#btnCancel': {
				click: 'onCancel'
			},

			'#taxonomyOwner': {
				change: 'taxonomyOwner_onChange'
			},

			'#accountType': {
				change: 'accountType_onChange'
			},

			'#currencies': {
				change: 'currencies_onChange'
			},

			'#defaultCurrency': {
				change: 'defaultCurrency_onChange'
			},
			'#isAgency': {
				click: 'isAgency_onClick'
			},
			'#agencyType': {
				change: 'agencyType_onChange'
			}

		},


		initializer: function () {


		},

		render: function () {

			var data = this.get('model'),
				self = this,
				content;

			content = Y.Node.create(this.template());


			this.panel = new Y.Panel({
				srcNode      : content,
				headerContent: '',
				width        : 300,
				centered     : true,
				visible      : false
			});


			this.panel.addButton({
				value  : 'Save',
				section: Y.WidgetStdMod.FOOTER,
				action : function (e) {
					e.preventDefault();
					//set model
					self.fire('save');
				}
			});
			this.panel.addButton({
				value  : 'Cancel',
				section: Y.WidgetStdMod.FOOTER,
				action : function (e) {
					e.preventDefault();
					self.fire('doCancel');
				}
			});

			this.panel.render();

			var simplePanel = Y.Node.create('<div/>');
			simplePanel.setContent(this.panel.get('contentBox'));


			this.get("container").setContent(simplePanel);

			return this;
		},

		onCancel : function() {
			this.fire('doCancel');
		},

		onSave : function() {
			this.fire('doSave');
		},

		taxonomyOwner_onChange : function() {
			var container = this.get('container');
			var taxonomyOwnerValue = container.one('#taxonomyOwner').get('value');

			this.fire('taxonomyOwnerChanged', {taxonomyOwner: taxonomyOwnerValue});

		},

		accountType_onChange : function() {
			var container = this.get('container');
			var accountTypeValue = container.one('#accountType').get('value');

			this.fire('accountTypeChanged', {accountType: accountTypeValue});

		},

		agencyType_onChange : function() {
			var container = this.get('container');
			var agencyTypeValue = container.one('#agencyType').get('value');

			this.fire('agencyTypeChanged', {agencyType: agencyTypeValue});
		},

		defaultCurrency_onChange : function() {
			var container = this.get('container');
			var defaultCurrencyValue = container.one('#defaultCurrency').get('value');

			this.fire('defaultCurrencyChanged', {defaultCurrency: defaultCurrencyValue});
		},

		currencies_onChange : function() {
			var container = this.get('container');

			var allCurrencies = container.one('#currencies').get('options');
			var selectedOptions = allCurrencies.filter(function(option, index, arr){
				return option.selected;
			});

			var selectedCurrencies = [];
			selectedOptions.each(function(option, index, arr){
				selectedCurrencies[selectedCurrencies.length] = option.get('value');
			}) ;

			this.fire('currenciesChanged', { currencies : selectedCurrencies });

		},

		isAgency_onClick : function(e) {
			this.fire('isAgencyModified', {selected : e.target.get('checked') });
		},


		setPartner : function(value) {
			var container = this.get('container');
			container.one('#isPartner').set('checked', value);
		},

		setMember : function(value) {
			var container = this.get('container');
			container.one('#isMember').set('checked', value);
		},

		setSubsidiary : function(value) {
			var container = this.get('container');
			container.one('#isSubsidiary').set('checked', value);
		},

		setDataProvider : function(value) {
			var container = this.get('container');
			container.one('#isDataProvider').set('checked', value);
		},

		setDefaultCurrency : function(value) {
			var container = this.get('container');
			var element = '#defaultCurrency option[value="'+value+'"]';
			container.one(element).set('selected', true);
		},

		setAccountType : function(value) {
			var container = this.get('container');
			var element = '#accountType option[value="'+value+'"]';
			container.one(element).set('selected', true);
		},

		enableAgencyType : function(value) {
			var container = this.get('container');
			container.one('#agencyType').set('disabled', !value);
		},

		setAgencyType : function(value) {
			var container = this.get('container');
			var element = '#agencyType option[value="'+value+'"]';
			container.one(element).set('selected', true);
		},

		setIsAgency : function(value) {
			var container = this.get('container');
			container.one('#isAgency').set('checked', value);
		},

		setData : function() {

			var data = this.get('model').toJSON();
			var container = this.get('container');
			var w_taxonomyOwner = '#taxonomyOwner option[value="'+data.taxonomyOwner+'"]';
			var w_accountType = '#accountType option[value="'+data.accountType+'"]';
			var w_agencyType = '#agencyType option[value="'+data.agencyType+'"]';
			var w_timezone = '#timezone option[value="'+data.timezone+'"]';
			var w_languagePref = '#languagePref option[value="'+data.languagePref+'"]';

			container.one('#companyName').set('value', data.companyName);
			container.one('#companyUrl').set('value', data.companyUrl);
			container.one('#userName').set('value', data.userName);
			container.one('#email').set('value', data.email);


			container.one(w_taxonomyOwner).set('selected', true);
			container.one(w_accountType).set('selected', true);

			container.one('#isDataProvider').set('checked', data.isDataProvider);
			container.one('#isMember').set('checked', data.isMember);
			container.one('#isPartner').set('checked', data.isPartner);
			container.one('#isSubsidiary').set('checked', data.isSubsidiary);

			container.one('#minAmount').set('value', data.minAmount);
			if (data.agencyType != '0') {
				container.one(w_agencyType).set('selected', true);
			}

			container.one(w_timezone).set('selected', true);
			container.one(w_languagePref).set('selected', true);

			var allCurrencies = container.one('#currencies').get('options');
			allCurrencies.each(function(item, index, arr){
				if (data.currencies.indexOf(item.get('value')) > -1) {
					item.set('selected', true);
				}
			});

		},

		setTimezoneCollection : function(data) {
			this._fillLookup('#timezone', data);
		},
		setCurrencyCollection : function(data, preselection) {
			this._fillLookup('#currencies', data, preselection);
		},
		setAccountTypeCollection : function(data) {
			this._fillLookup('#accountType', data);
		},
		setAgencyTypeCollection : function(data) {
			this._fillLookup('#agencyType', data);
		},
		setLanguageCollection : function(data) {
			this._fillLookup('#languagePref', data);
		},
		setTaxonomyOwnerCollection : function(data) {
			this._fillLookup('#taxonomyOwner', data);
		},
		setDefaultCurrencyCollection : function(data, preselection) {
			this._fillLookup('#defaultCurrency', data, preselection);
		},

		_fillLookup : function(elementSelector, data, preselection) {
			var option = '<option value={id}>{text}</option>',
				container = this.get('container'),
				options = '',
				isMultiSelect = container.one(elementSelector).get('multiple');

			if (!preselection && !isMultiSelect) {
				preselection = '0';
			}

			if (!isMultiSelect) {
				options = (Y.Lang.sub(option, { id:"0", text: "[Select one]"}));
			}

			data.forEach(function(el, index, arr){
				options += (Y.Lang.sub(option, el));
			});
			container.one(elementSelector).setContent(options);

			if (!isMultiSelect) {
				container.one(elementSelector+' option[value="'+preselection+'"]').set('selected', true);
			}
			else {
				container.all(elementSelector+' option').set('selected', false);
			}
		},

		setTitle : function(title) {
			this.panel.set('headerContent', title);
		},

		showLoadingIndicator : function() {
			this.get('container').addClass('loading');
		},
		hideLoadingIndicator : function() {
			this.get('container').removeClass('loading');
		}


	});

	Y.namespace('MVRPExample');
	Y.MVRPExample.CustomerEditView = CustomerEditView;

}, '0.0.1', { requires: ['app',
						'handlebars',
						'customer-model',
						'customer-edit-template',
						'scrollview-base',
						'scrollview-scrollbars'
	] }
);