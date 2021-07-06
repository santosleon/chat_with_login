const actions = {
	signin: (username) => { return { type: 'SIGNIN', payload: { username } } },
	signout: { type: 'SIGNOUT' },
	authorize: { type: 'AUTHORIZE' },
	deauthorize: { type: 'DEAUTHORIZE' },
};

export default actions;