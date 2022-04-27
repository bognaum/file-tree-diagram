import TextographicBuildOptions from "./TextographicBuildOptions.js";
import assemblyTree             from "./draw-data-tree.js";
import makeWC                   from "./makeWC.js";

export default class Menu {
	constructor (cssClassPrefix="file-tree", m) {
		this.cssClassPrefix = cssClassPrefix;
		const
			CP = this.cssClassPrefix, 
			dom = makeWC(
				`<div class="${ CP }__menu-container">`,
					`<div class="${ CP }__burger">`,
						`<svg 
							version="1.1" 
							xmlns="http://www.w3.org/2000/svg" 
							xmlns:xlink="http://www.w3.org/1999/xlink" 
							width="15"
							height="15"
							viewBox="0 0 250.579 250.579" 
							style="enable-background:new 0 0 250.579 250.579;" 
							xml:space="preserve"
						>`,
							`<g id="Menu">`,
								`<path `,
									`style="fill-rule:evenodd;clip-rule:evenodd;" `,
									`d="M22.373,76.068h205.832c12.356,0,22.374-10.017,22.374-22.373c0-12.356-10.017-22.373-22.374-22.373H22.373C10.017,31.323,0,41.339,0,53.696C0,66.052,10.017,76.068,22.373,76.068z M228.205,102.916H22.373C10.017,102.916,0,112.933,0,125.289c0,12.357,10.017,22.373,22.373,22.373h205.832c12.356,0,22.374-10.016,22.374-22.373C250.579,112.933,240.561,102.916,228.205,102.916z M228.205,174.51H22.373C10.017,174.51,0,184.526,0,196.883c0,12.356,10.017,22.373,22.373,22.373h205.832c12.356,0,22.374-10.017,22.374-22.373C250.579,184.526,240.561,174.51,228.205,174.51z"`,
									`fill="#999"`,
								`/>`,
							`</g>`,
						`</svg>`,
					`</div>`,
					`<div class="${ CP }__menu">`,
						`<button class=${ CP }__copy-btn" id="copy">copy</button>`,
						`<label><input id="with-coments" type="checkbox" checked> with <br> comments</label>`,
						`<label><input id="with-folded"  type="checkbox" checked> with <br> folded</label>`,
					`</div>`,
				`</div>`,
			);
		dom.api.id["copy"].onclick = function(ev) {
			const 
				withComents = dom.api.id["with-coments"].checked,
				withFolded  = dom.api.id["with-folded"].checked,
				t = cloneTemplate(m, {withComents, withFolded}),
				text = assemblyTree(t, new TextographicBuildOptions()).result;
			console.log(text);
			copyToClipboard(text);
		}
		return dom;
	}
}

function cloneTemplate(ob, opts) {
	const o = {
		... {
			unfoldedOnly: false,
			withComents: false,
		},
		... opts
	};

	return recur(ob);

	function recur(subj) {
		if (subj instanceof Array) {
			return subj.map(recur);
		} else if (typeof subj == "object") {
			const ob = {};
			for (const i in subj) {
				if (i == "ch" && subj.folded && !o.withFolded)
					continue;
				if (i == "comment" && !o.withComents)
					continue;

				if (["parent", "chlistDom"].includes(i))
					continue;
				ob[i] = recur(subj[i]);
			}
			return ob;
		} else {
			return subj;
		}
	}
}

function copyToClipboard(str) {
	const tA = document.createElement("textarea");
	tA.value = str;
	document.body.appendChild(tA);
	tA.select();
	document.execCommand("copy");
	document.body.removeChild(tA);
}