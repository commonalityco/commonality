let store: any;

export const getStore = async () => {
	if (store !== undefined) return store;

	const { default: Configstore } = await import('configstore');

	const newStore = new Configstore('@commonalityco/cli');

	store = newStore;

	return newStore;
};
