import iconManager from "./icon-manager.js";

export default class BuildOptions {
	constructor (cssClassPrefix="file-tree") {
		this.cssClassPrefix = cssClassPrefix
		this.result = "";
		this.chProp = "ch";
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
					if (m.ch.length)
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

		this.result += [
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

				`<span class="${ CP }__name">${ m.name }</span>`,

				if_ (m.comment) (
					`<span class="${ CP }__comment">`,
						`<span class="${ CP }__comment-align-indent">`,
							"╶"+commentAlignLiner+"╴",
						`</span>`,
						`${ m.comment || "" }`,
					`</span>`
				),
			`</span>`,
		].join("");
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
		this.result += 
			`<span class="${this.cssClassPrefix}__branch ${this.cssClassPrefix}_${ type }-type"
				>${ slim[type] || "err" }</span>`;
	}
	endOfRow (m) {this.result += "\n";}
}

function if_ (cond) {
	return cond ? (...args) => args.join("") : () => "";
}