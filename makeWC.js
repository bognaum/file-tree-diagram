export default function makeWC(...args) {
	const 
		_shell = document.createElement("template"),
		pastedElems = [];
	for (const [k, v] of args.entries()) {
		if (typeof v == "string")
			continue;
		else if (v instanceof Node) {
			const index = pastedElems.push(v) - 1;
			args[k] = `<!--<<<${ index }>>>-->`;
		}
	}
	_shell.innerHTML = args.join("");
	// const dom = _shell.content;
	const 
		dom = _shell.content.childNodes[0],
		selfEls = [dom, ... dom.querySelectorAll("*")],
		id = {};
	for (const el of selfEls) {
		const name = el.getAttribute("id");
		if (name)
			id[name] = el;
	}
	recurPasteChildren(dom);
	dom.api = {
		id,
		selfEls,
		children: pastedElems,
		dom,
	};
	return dom;

	function recurPasteChildren(el) {
		for (const node of el.childNodes) {
			if (node.nodeType == document.COMMENT_NODE) {
				const m = node.textContent.match(/^<<<(\d+)>>>$/);
				if (m) {
					const index = parseInt(m[1]);
					node.after(pastedElems[index]);
					node.textContent = ` pasted-${ index }->> `;
				}
			} else if (node.nodeType == document.ELEMENT_NODE) {
				recurPasteChildren(node);
			}
		}
	}
}