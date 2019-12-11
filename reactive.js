export function constant(value) {
	return {
		get() {
			return value;
		},
		addObserver(observer) {},
		deleteObserver(observer) {}
	};
}

export function reactive(value) {
	const observers = new Set();
	return {
		get() {
			return value;
		},
		set(newValue) {
			if (newValue === value) {
				return;
			}
			value = newValue;
			for (const observer of observers) {
				observer.update();
			}
		},
		addObserver(observer) {
			observers.add(observer);
		},
		deleteObserver(observer) {
			observers.delete(observer);
		}
	};
}

export function map(observables, callback) {
	if (!observables[Symbol.iterator]) {
		observables = [observables];
	}
	return {
		get() {
			const values = observables.map(observable => observable.get());
			return callback(...values);
		},
		addObserver(observer) {
			for (const observable of observables) {
				observable.addObserver(observer);
			}
		},
		deleteObserver(observer) {
			for (const observable of observables) {
				observable.deleteObserver(observer);
			}
		}
	};
}

export function constantList(...items) {
	return {
		get(index) {
			return items[index];
		},
		get length() {
			return items.length;
		},
		addObserver(observer) {},
		deleteObserver(observer) {}
	};
}

export function reactiveList(...items) {
	const observers = new Set();
	return {
		get(index) {
			return items[index];
		},
		get length() {
			return items.length;
		},
		splice(start, deleteCount, ...newItems) {
			items.splice(start, deleteCount, ...newItems);
			for (const observer of observers) {
				observer.update(start, deleteCount, newItems.length);
			}
		},
		unshift(...newItems) {
			this.splice(0, 0, ...newItems);
		},
		push(...newItems) {
			this.splice(this.length, 0, ...newItems);
		},
		shift() {
			this.splice(0, 1);
		},
		pop() {
			this.splice(this.length - 1, 1);
		},
		addObserver(observer) {
			observers.add(observer);
		},
		deleteObserver(observer) {
			observers.delete(observer);
		}
	};
}
