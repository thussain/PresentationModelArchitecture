/**
 * User: Taha
 * Date: 1/2/12
 */
YUI.add('customer-edit-pm', function(Y) {

	var CustomerEditPM;
	CustomerEditPM = Y.Base.create('customerEditPM', Y.Model, [], {


		initializer: function (config) {
			this.changed = {};
			this.lastChange = {};
			this.lists = [];

			this.after('fieldsChange', this._calculateState);

			this.after('selectedCurrenciesChange', this._calculateCurrencyState);
			this.after('defaultCurrencyOptionsChange', this._calculateCurrencyState);

			this.after('agencyCheckedChange', this._calculateAgencyState);

		},

		_calculateCurrencyState : function (event) {

			var curCurrencyState = this.get('currencyState');
			var defaultCurrency = this.get('defaultCurrency');
			var newCurrencyState = 'SYNCED';
			var selectedCurrencies = this.get('selectedCurrencies')  || new Array();
			var defaultCurrencyOptions = this.get('defaultCurrencyOptions') || new Array();
			var notSame = !(selectedCurrencies.length == defaultCurrencyOptions.length);

			if (!notSame) {
				notSame = selectedCurrencies.some(function(value, index, arr) {
					if (defaultCurrencyOptions.indexOf(value) < 0) {
						return true;
					}
				});
			}

			if (notSame) {
				newCurrencyState = 'OPTIONS_OUT_OF_SYNC';
			} else {
				if (!Y.Lang.isNull(defaultCurrency) && defaultCurrencyOptions.indexOf(defaultCurrency) > -1) {
					newCurrencyState = 'DEFAULT_VALUE_OUT_OF_SYNC';

				}
			}

			if (newCurrencyState != curCurrencyState) {
				this._set('currencyState', newCurrencyState);
			}

		},

		_calculateAgencyState : function (event) {
			this._set('agencyAllowed', event.newVal);
		},

		_calculateState : function (event) {

			var curLoadingState = this.get('state.LOADING_STATE.value');

			var entityId = this.get('entityId');
			var isNew = Y.Lang.isNull(entityId) || entityId < 1;
			var viewRendered = this.get('fields.view_rendered');
			var lookupsDownloaded = this.get('fields.lookups_downloaded');
			var dataDownloaded = this.get('fields.data_downloaded');
			var lookupsFilled = this.get('fields.lookups_filled');
			var dataFilled = this.get('fields.data_filled');
			var runningState = curLoadingState;

			if (runningState == 'DATA_FILLED') {
				return;
			}

			if (runningState == '') {
				if (viewRendered) {
					runningState = 'WAITING_FOR_LOOKUPS';
				}
			}

			if (runningState == 'WAITING_FOR_LOOKUPS') {
				if (lookupsDownloaded) {
					runningState = 'CAN_FILL_LOOKUPS';
				}
			}

			if (runningState == 'CAN_FILL_LOOKUPS') {
				if (lookupsFilled) {
					runningState = 'LOOKUPS_FILLED';
				}
			}


			if (runningState == 'LOOKUPS_FILLED') {
				if (isNew) {
					runningState = 'DATA_FILLED';
				}
				else if (dataDownloaded) {
					runningState = 'CAN_FILL_DATA';
				}
			}

			if (runningState == 'CAN_FILL_DATA') {
				if (dataFilled) {
					runningState = 'DATA_FILLED';
				}
			}

			if (runningState != curLoadingState) {
				this._set('state.LOADING_STATE.value', runningState);
			}


		}

	}, {
		ATTRS:{
			fields : {
				value : {
					lookups_downloaded : false,
					lookups_filled : false,
					view_rendered : false,
					data_downloaded : false,
					data_filled : false
				}
			},
			state : {
				value : {
					LOADING_STATE : {
						value : "",
						readOnly : true
					}

				}
			},

			entityId                :   {value:null},

			selectedCurrencies      :   [],
			defaultCurrencyOptions  :   [],
			defaultCurrency         :   {value:null},
			currencyState           :   'SYNCED',

			agencyChecked           :   false,
			agencyType              :   {value:null},
			agencyAllowed           :   false,

			taxonomyOwner           :   {value:null},
			accountType             :   {value:null}


		}
	});

	Y.namespace('MVRPExample');
	Y.MVRPExample.CustomerEditPM = CustomerEditPM;

}, '0.0.1', {requires: ['app', 'dump']});
