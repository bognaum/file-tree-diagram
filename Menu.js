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
						// `<button class=${ CP }__copy-all-btn" id="copy-all">copy all</button>`,
						// `<button class=${ CP }__copy-unfolded-btn" id="copy-unfolded">copy unfolded</button>`,
					`</div>`,
				`</div>`,
			);
		dom.api.id["copy"].onclick = function(ev) {
			const text = assemblyTree(m, new TextographicBuildOptions()).result;
			copyToClipboard(text);
		}
		/*dom.api.id["copy-all"].onclick = function(ev) {
			const text = assemblyTree(m, new TextographicBuildOptions()).result;
			console.log(text);
			copyToClipboard(text);
		}
		dom.api.id["copy-unfolded"].onclick = function(ev) {
			const text = assemblyTree(m, new TextographicBuildOptions({unfoldedOnly: true})).result;
			console.log(text);
			copyToClipboard(text);
		}*/
		return dom;
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