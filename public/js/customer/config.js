/**
 * User: Taha
 * Date: 12/30/11
 */
(function () {

    var filter = (window.location.search.match(/[?&]filter=([^&]+)/) || [])[1] || 'min';

// YUI Config (this is suppose to be a global var).
    YUI_config = {

        groups: {
            customer: {
                base     : '/js/',
                comboBase: '/js/?',
                combine  : filter === 'min',
                root     : '/',
                modules  : {
                    'customer-controller': {
                        path    : 'customer/Controller.js',
                        requires: [ 'app',
                                    'customer-list-view',
                                    'customer-list-presenter',
			                        'customer-edit-view',
			                        'customer-edit-presenter',
	                                'form-css'
                        ]
                    },
                    'customer-model': {
                        path    : 'customer/Model.js',
                        requires: [ 'app', 'io' ]
                    },
                    'customer-model-list': {
                        path    : 'customer/ModelList.js',
                        requires: [ 'app', 'io' ]
                    },
                    'customer-list-view': {
                        path    : 'customer/ListView.js',
                        requires: [ 'app',
                                    'handlebars',
                                    'datatable',
                                    'customer-model',
                                    'customer-model-list',
	                                'customers-alist-template',
	                                'panel',
	                                'dd-plugin',
	                                'dump'
	                                ]
                    },
                    'customer-list-presenter': {
                        path    : 'customer/ListPresenter.js',
                        requires: [ 'app',
                                    'customer-list-view',
	                                'customer-list-pm']
                    },
	                'customer-list-pm': {
		                path    : 'customer/ListPM.js',
		                requires: [ 'app', 'dump' ]
	                },
	                'customer-edit-view': {
		                path    : 'customer/EditView.js',
		                requires: [ 'app',
			                        'handlebars',
			                        'customer-model',
			                        'customer-edit-template',
					                'scrollview-base',
					                'scrollview-scrollbars'
					    ]
	                },
	                'customer-edit-presenter': {
		                path    : 'customer/EditPresenter.js',
		                requires: [ 'app',
			                        'customer-edit-view',
			                        'customer-edit-pm',
			                        'lookups-helper' ]
	                },
	                'customer-edit-pm': {
		                path    : 'customer/EditPM.js',
		                requires: [ 'app', 'dump' ]
	                },
	                'lookups-helper' : {
		                path    : 'customer/LookupsHelper.js',
		                requires: [ 'app',
			                'io' ]
	                },
                    'customer-edit-template': {
                        path    : 'generated/customer-edit-template.js',
                        requires: [ 'node']
                    },
	                'customers-alist-template': {
		                path    : 'generated/customers-alist-template.js',
		                requires: [ 'node']
	                },
                    'form-css': {
                        path: 'form.css',
                        type: 'css'
                    }

                }
            }
        }
    };

}());