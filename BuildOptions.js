import iconManager from "./icon-manager.js";

export default class BuildOptions {
	constructor (cssClassPrefix="file-tree") {
		this.cssClassPrefix = cssClassPrefix
		this.chProp = "ch";
		this.listStack = [[]];
	}
	get dom () {
		return makeWC(
			`<div>`,
				... this.listStack[0],
			`</div>`,
		);
	}
	get currlist () {return this.listStack[this.listStack.length - 1]}
	newChList (m) {
		this.listStack.push([]);
	}
	endOfChList (m) {
		const 
			CP = this.cssClassPrefix,
			children = this.listStack.pop(),
			chList = makeChList({CP, m, children});
		m.chlistDom = chList; 
		this.currlist.push(chList);
	}
	newRow (m) {
		if (m.ch) {
			let aLongestName = 0;
			for (let i in m.ch) {
				aLongestName ||= Math.max(...m.ch.map((v) => v.name.length));
				m.ch[i].aLongestName = aLongestName;
				m.ch[i].parent = m;
				if (m.iconstyle) 
					m.ch[i].iconstyle ||= m.iconstyle;
				if (m["child-iconstyle"])
					m.ch[i]["self-iconstyle"] ||= m["child-iconstyle"];
			}
		}
		m.iconstyle ||= "colored";
		m["self-iconstyle"] ||= m.iconstyle;
	}
	addHeader (m) {
		const 
			CP = this.cssClassPrefix,
			commentAlignLiner = "─".repeat((m.aLongestName - m.name.length) || 0);

		let 
			icon,
			foldSwitcher,
			fsCap;

		const dom = makeWC(
			`<span class="${ CP }__header">`,
				icon = makeIcon({CP, m}), 
				m.ch?.length ? 
					(foldSwitcher = makeFoldSwitcher({CP, m}))
					: fsCap = makeFoldSwitcherCap({CP}),
				`<span class="${ CP }__name">${ m.name }</span>`,

				if_ (m.comment) (
					`<span class="${ CP }__comment">`,
						`<span class="${ CP }__comment-align-indent">`,
							" "+commentAlignLiner+"─ ",
							// "╶"+commentAlignLiner+"╴",
						`</span>`,
						`${ m.comment || "" }`,
					`</span>`
				),
			`</span>`,
		);

		this.currlist.push(dom);

		if (foldSwitcher) {
			foldSwitcher.onclick = function(ev) {
				m.folded = ! m.folded;
				if (m.folded) {
					foldSwitcher.api.showFoldState();
					m.chlistDom.api.collapse();
				} else {
					foldSwitcher.api.showUnfoldState();
					m.chlistDom.api.expand();
				}
				icon.api.setIcon();
			}
		}
	}
	addBranchEl (type) {
		const 
			bold = {
				v: " ┃ ",
				f: " ┣━",
				c: " ┗━",
				e: "   ",
			},
			slim = {
				v: " │ ",
				f: " ├─",
				c: " └─",
				e: "   ",
			};
		const text = slim[type] || "err";
		this.currlist.push(makeWC(
			`<span class="${this.cssClassPrefix}__branch ${this.cssClassPrefix}_${ type }-type"`,
				`>${ slim[type] || "err" }</span>`
		));
	}
	endOfRow (m) {this.currlist.push("\n");}
}

function makeIcon({CP, m}) {
	const dom = makeWC(`<span class="${ CP }-icon">   </span>`,);
	dom.api.setIcon = setIcon;
	setIcon();
	return dom;

	function setIcon() {
		const [type, ext] = (() => {
			if (m.ch) {
				if ((m.ch instanceof Array) && (! m.folded))
					return [`opened-folder`, ""];
				else 
					return [`closed-folder`, ""];
			} else {
				const 
					ext      = m.name.match(/\.([^.]*)$/)?.[1] || "",
					replaced = iconManager.getType(ext)
						.replaceAll(".", "---");

				return [replaced, ext];
			}
		})();
		dom.className = [
			`${ CP }-icon `,
			`${ CP }-icon_type-${type} `,
			`${ CP }-icon_style-${ m["self-iconstyle"] } `,
		].join(" ");
	}
}

function makeFoldSwitcher({CP, m}) {
	const dom = makeWC(
		`<span class="${ CP }-fold-switcher">`,
			`<svg width=".7em" height=".7em" x="0px" y="0px" viewBox="0 0 415.346 415.346">`,
				`<g>`,
					`<path class="${ CP }-fold-switcher__arrow" `,
					`fill="#999" d="M41.712,415.346c-11.763,0-21.3-9.537-21.3-21.3V21.299C20.412,9.536,29.949,0,41.712,0l346.122,191.697`,
						`c0,0,15.975,15.975,0,31.951C371.859,239.622,41.712,415.346,41.712,415.346z" transform="rotate(90 207 207)"/>`,
				`</g>`,
			`</svg>`,
			` `,
		`</span>`,
	);
	dom.api = {
		showFoldState,
		showUnfoldState,
	};
	if (m.folded)
		showFoldState();
	else
		showUnfoldState();
	return dom;

	function showFoldState() {
		dom.querySelector(`.${ CP }-fold-switcher__arrow`).setAttribute(
			"transform",
			""
		);
	}

	function showUnfoldState() {
		dom.querySelector(`.${ CP }-fold-switcher__arrow`).setAttribute(
			"transform",
			"rotate(90 207 207)"
		);
	}
} 

function makeChList({CP, m, children}) {
	const dom = makeWC(
		`<div class="${ CP }-ch-list" style="overflow: hidden;">`,
			`<div class="${ CP }-ch-list-underflow">`,
				...children,
			`</div>`,
		`</div>`,
	);
	dom.api = {
		slot     : dom.children[0],
		collapse : collapse,
		expand   : expand,
	};
	if (m.folded)
		collapse();
	return dom;

	function collapse(ev) {
		const height = dom.api.slot.getBoundingClientRect().height;
		dom.style.height = height+"px";
		setTimeout(function() {dom.style.height = "0px";});
		dom.addEventListener("transitionend", function(ev) {
			// ev.target.style.height = "";
		}, {once: true});
	}
	function expand(ev) {
		const height = dom.api.slot.getBoundingClientRect().height;
		dom.style.height = "0px";
		setTimeout(function() {dom.style.height = height+"px";});
		dom.addEventListener("transitionend", function(ev) {
			ev.target.style.height = "";
		}, {once: true});
	}
}

function makeFoldSwitcherCap({CP}) {
	return makeWC(`<span class="${ CP }-f-s-cap">─╴</span>`);
}


function if_ (cond) {
	return cond ? (...args) => args.join("") : () => "";
}

function makeWC(...args) {
	const 
		_shell = document.createElement("template"),
		pastedElems = [];
	for (const [k, v] of args.entries()) {
		if (typeof v == "string")
			continue;
		else if (v instanceof Node) {
			const id = pastedElems.push(v) - 1;
			args[k] = `<!--<<<${ id }>>>-->`;
		}
	}
	_shell.innerHTML = args.join("");
	// const dom = _shell.content;
	const 
		dom = _shell.content.childNodes[0],
		selfEls = [dom, ... dom.querySelectorAll("*")];
	recurPasteChildren(dom);
	dom.api = {
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
					const id = parseInt(m[1]);
					node.before(pastedElems[id]);
					node.textContent = ` pasted ${ id } >>> `;
				}
			} else if (node.nodeType == document.ELEMENT_NODE) {
				recurPasteChildren(node);
			}
		}
	}
}