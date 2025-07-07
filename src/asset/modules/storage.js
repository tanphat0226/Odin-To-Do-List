class Storage {
	constructor() {
		this.storage = window.localStorage
	}

	setItem(key, value) {
		this.storage.setItem(key, JSON.stringify(value))
	}

	getItem(key) {
		const value = this.storage.getItem(key)
		return value ? JSON.parse(value) : null
	}
}

const storage = new Storage()

export default storage
