module.exports =
[
	{
		firstName   :   'User',
		lastName    :   'One',
		userName    :   'user1',
		locale      :   'en_US',
		currency    :   'USD',
		permissions :   [
			'ACCOUNT_READ', 'ACCOUNT_WRITE', 'ACCOUNT_MINIMUM_AMOUNT_WRITE',
			'ORDER_READ', 'ORDER_WRITE'
		]
	},

	{
		firstName   :   'User',
		lastName    :   'Two',
		userName    :   'user2',
		locale      :   'en_US',
		currency    :   'USD',
		permissions :   [
			'ACCOUNT_READ',
			'ORDER_READ'
		]
	},

	{
		firstName   :   'User',
		lastName    :   'Three',
		userName    :   'user3',
		locale      :   'en_US',
		currency    :   'USD',
		permissions :   [
			//'ACCOUNT_READ', 'ACCOUNT_WRITE',
			'ORDER_READ', 'ORDER_WRITE'
		]
	}
];