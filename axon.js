import { constant } from './reactive.js';

export function element(tag, ...instructions) {
	return {
		instructions: instructions,
		getNode() {
			if (!this.element) {
				this.element = document.createElement(tag);
				for (const instruction of this.instructions) {
					if (instruction.getNode) {
						this.element.appendChild(instruction.getNode());
					} else {
						instruction.run(this.element);
					}
				}
			}
			return this.element;
		},
		disconnect() {
			for (const instruction of this.instructions) {
				instruction.disconnect();
			}
		}
	};
}

export function text(...texts) {
	return {
		texts: texts.map(text => text.get ? text : constant(text)),
		getNode() {
			if (!this.node) {
				const text = this.texts.reduce((a, b) => a + b.get(), '');
				this.node = document.createTextNode(text);
				for (const text of this.texts) {
					text.addObserver(this);
				}
			}
			return this.node;
		},
		update() {
			const text = this.texts.reduce((a, b) => a + b.get(), '');
			const newNode = document.createTextNode(text);
			this.node.parentNode.replaceChild(newNode, this.node);
			this.node = newNode;
		},
		disconnect() {
			for (const text of this.texts) {
				text.deleteObserver(this);
			}
		}
	};
}

export function onClick(callback) {
	return {
		run(parent) {
			parent.addEventListener('click', callback);
		},
		disconnect() {}
	};
}
export function onEnter(callback) {
	return {
		run(parent) {
			parent.addEventListener('keydown', event => {
				if (event.key == 'Enter') {
					callback();
				}
			});
		},
		disconnect() {}
	};
}
export function bindValue(value) {
	return {
		value: value,
		run(parent) {
			this.element = parent;
			this.update();
			this.value.addObserver(this);
			parent.addEventListener('input', event => {
				value.set(event.target.value);
			});
		},
		update() {
			this.element.value = this.value.get();
		},
		disconnect() {
			this.value.deleteObserver(this);
		}
	}
}

export function a(...instructions) {
	return element('a', ...instructions);
}

export function div(...instructions) {
	return element('div', ...instructions);
}
export function span(...instructions) {
	return element('span', ...instructions);
}

export function p(...instructions) {
	return element('p', ...instructions);
}
export function h1(...instructions) {
	return element('h1', ...instructions);
}
export function h2(...instructions) {
	return element('h2', ...instructions);
}
export function h3(...instructions) {
	return element('h3', ...instructions);
}

export function form(...instructions) {
	return element('form', ...instructions);
}
export function input(...instructions) {
	return element('input', ...instructions);
}
export function button(...instructions) {
	return element('button', ...instructions);
}

export function run(instruction) {
	document.addEventListener('DOMContentLoaded', () => {
		document.body.appendChild(instruction.getNode());
	});
}
