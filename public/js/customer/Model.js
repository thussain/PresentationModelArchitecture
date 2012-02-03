/**
 * User: Taha
 * Date: 12/30/11
 */

YUI.add('customer-model', function(Y) {

    var Customer;
    Customer = Y.Base.create('customer', Y.Model, [], {

	    // Custom sync layer.
	    sync: function (action, options, callback) {
		    var data, io, configuration, uri;

		    if (action === 'read') {


			    uri = "/customer/get";
				options.id=this.get('id');
			    configuration = {
				    method  : 'GET',
				    data    : options,
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

		    } if (action === 'update') {

			    uri = "/customer/update";


			    configuration = {
				    method  : 'UPDATE',
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
        ATTRS:{

			accountId			:	{value:null},
			customerType		:	{value:null},
	        customerTypeName	:	{value:null},
			companyName			:	{value:null},
	        companyUrl          :	{value:null},
	        userName            :	{value:null},
	        email               :	{value:null},
			taxonomyOwner		:	{value:null},
	        taxonomyOwnerName	:	{value:null},
	        accountType         :   {value:null},
			isMember			:	{value:null},
			isSubsidiary		:	{value:null},
	        isPartner			:	{value:null},
	        isDataProvider		:	{value:null},
			minAmount			:	{value:null},
			agencyType			:	{value:null},
	        agencyTypeName		:	{value:null},
	        timezone			:	{value:null},
	        currencies          :	{value:null},
	        defaultCurrency     :	{value:null},
	        languagePref		:	{value:null},
	        lastUpdated			:	{value:null},
	        lastUpdatedBy		:	{value:null}
        }
    });

    Y.namespace('MVRPExample');
    Y.MVRPExample.Customer = Customer;

}, '0.0.1', {requires: ['app', 'io']});
