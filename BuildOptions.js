import iconManager from "./icon-manager.js";

export default class BuildOptions {
	constructor (cssClassPrefix="file-tree") {
		this.cssClassPrefix = cssClassPrefix
		this.shell = new DocumentFragment();
		this.chProp = "ch";
		this.mountStack = [this.shell];
	}
	get currMount () {return this.mountStack[this.mountStack.length - 1]}
	newChList (m) {
		const 
			CP = this.cssClassPrefix,
			chList = makeChList(CP);
		m.chlistDom = chList; 
		this.currMount.append(chList);
		this.mountStack.push(chList.api.slot);
	}
	endOfChList (m) {
		this.mountStack.pop();
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
			[type, ext] = (() => {
				if (m.ch) {
					if (m.ch instanceof Array)
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
			})(),
			commentAlignLiner = "─".repeat((m.aLongestName - m.name.length) || 0);

		const dom = eHTML([
			`<span `,
				`class="${ CP }__header"`,
				`data-type="${ type }"`,
				`data-ext="${ ext }"`,
			`>`,
				`<span `,
					`class="`,
						`${ CP }-icon `,
						`${ CP }-icon_type-${type} `,
						`${ CP }-icon_style-${ m["self-iconstyle"] } `,
					`"`,
				`>   </span>`, 
				m.ch?.length ? getFoldSwitcher(CP) : getFoldSwitcherCap(CP), 
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
		].join(""));
		const 
			foldSwitcher        = dom.querySelector(`.${ CP }-fold-switcher`),
			foldSwitcher__arrow = dom.querySelector(`.${ CP }-fold-switcher__arrow`);

		this.currMount.append(dom);

		if (foldSwitcher) {
			foldSwitcher.onclick = function(ev) {
				m.folded = ! m.folded;
				// m.chlistDom.hidden = m.folded;
				if (m.folded) {
					m.chlistDom.api.collapse();
					foldSwitcher__arrow.setAttribute("transform", "");
				} else {
					m.chlistDom.api.expand();
					foldSwitcher__arrow.setAttribute("transform", "rotate(90 207 207)");
				}
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
		this.currMount.append(eHTML(
			`<span class="${this.cssClassPrefix}__branch ${this.cssClassPrefix}_${ type }-type"
				>${ slim[type] || "err" }</span>`
		));
	}
	endOfRow (m) {this.currMount.append("\n");}
}

function getFoldSwitcher(CP) {
	return [
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
	].join("");
} 

function makeChList(CP) {
	const dom = eHTML([
		`<div class="${ CP }-ch-list" style="overflow: hidden;">`,
			`<div class="${ CP }-ch-list-underflow"></div>`,
		`</div>`,
	].join(""));
	dom.api = {
		slot     : dom.children[0],
		collapse : collapse,
		expand   : expand,
	};
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

function getFoldSwitcherCap(CP) {
	return `<span class="${ CP }-f-s-cap">─╴</span>`;
}


function if_ (cond) {
	return cond ? (...args) => args.join("") : () => "";
}

function eHTML(code, shell=null) {
	const _shell = 
		! shell                  ? document.createElement("div") :
		typeof shell == "string" ? document.createElement(shell) :
		typeof shell == "object" ? shell :
			null;
	_shell.innerHTML = code;
	return _shell.children[0];
}

function eHTMLDF(code) {
	const _shell = document.createElement("template");
	return _shell.innerHTML = code, _shell.content;
}