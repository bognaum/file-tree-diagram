var FileTreeDiagram;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const FTD = __webpack_require__(1).default;

module.exports = FTD;

/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FileTree)
/* harmony export */ });
/* harmony import */ var _BuildOptions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _draw_data_tree_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _CSS_file_tree_diagram_scss_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(14);
/* harmony import */ var _icon_manager_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(3);
/* harmony import */ var _Menu_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(15);







const version = "2.3.0";

class FileTree {
	constructor (classPrefix = "file-tree-diagram") {
		this.classPrefix = classPrefix;
		(0,_CSS_file_tree_diagram_scss_js__WEBPACK_IMPORTED_MODULE_3__.default)(classPrefix);
	}

	/**
	 * buildByTextContent (elem)
	 * build              (elem, templ)
	 * testHTML           ()
	 */

	buildByTextContent (...args) { return buildByTextContent (this, ...args); }
	build              (...args) { return build              (this, ...args); }
	testHTML           (...args) { return testHTML           (this, ...args); }

	get        version () {return version;}
	static get version () {return version;}
}

function buildByTextContent(self, elem) {
	return build(self, elem, elem.textContent);
}

function build (self, elem, templ) {

	if (! (elem instanceof HTMLElement))
		throw new Error([
			"(!) build(). Argument #1 must be a HTMLElement.",
			"",
			elem + " given.",
			""
		].join("\n"));

	if (["executing", "executed", "exec-error"].some((v) => elem.classList.contains(v)))
		throw new Error([
			"(!) File tree diagram. Already handled.", 
			"",
			elem
		].join("\n"));
	
	elem.dataset.fileTreeDiagramVersion = version;
	elem.classList.add(self.classPrefix);
	elem.classList.add("executing");
	elem.innerHTML = "";

	if (typeof templ != "string")
		throw new Error([
			"(!) build(). Argument #2 must be a string.",
			"",
			templ + " given.",
			""
		].join("\n"));

	const {object :ob, error :jsonError} = _tryParseJSON(templ);
	if (ob) {
		const dom = (0,_draw_data_tree_js__WEBPACK_IMPORTED_MODULE_1__.default)(
			ob, 
			new _BuildOptions_js__WEBPACK_IMPORTED_MODULE_0__.default(self.classPrefix)
		).dom;
		elem.append(dom);
		elem.append(new _Menu_js__WEBPACK_IMPORTED_MODULE_5__.default(self.classPrefix, ob));
		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("executed");
	} else if (jsonError) {
		const jsonHl = new _json_err_hl_json_err_hl_js__WEBPACK_IMPORTED_MODULE_2__.default(`${ self.classPrefix }-json-err-hl`);
		elem.innerHTML = "";
		const 
			firstLN = _getFirstLineNum(elem),
			errorCodeField = jsonHl.getHighlighted(templ, firstLN);
		elem.appendChild(errorCodeField);
		jsonHl.scrollToFirstError(errorCodeField);
		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("exec-error");
		console.error(`(!)`, jsonError);
	} else {
		throw new Error();
	}
}

function testHTML (self) {
	return _icon_manager_js__WEBPACK_IMPORTED_MODULE_4__.default.testHTML(self.classPrefix);
}

function _tryParseJSON (json) {
	try {
		return {
			object: JSON.parse(json)
		};
	} catch (err) {
		return {
			text: json,
			error: err,
		}
	}
}

function _getFirstLineNum(el) {
	const dln = parseInt(el.dataset.lineNum);
	if (! dln)
		return 1;
	else if (el.nodeName == "PRE")
		return dln + 1;
	else 
		return dln;
}


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BuildOptions)
/* harmony export */ });
/* harmony import */ var _icon_manager_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _makeWC_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



class BuildOptions {
	constructor (cssClassPrefix="file-tree") {
		this.cssClassPrefix = cssClassPrefix
		this.chProp = "ch";
		this.listStack = [[]];
	}
	get dom () {
		return (0,_makeWC_js__WEBPACK_IMPORTED_MODULE_1__.default)(
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
			commentAlignLiner = "???".repeat((m.aLongestName - m.name.length) || 0);

		let 
			icon,
			foldSwitcher,
			fsCap;

		const dom = (0,_makeWC_js__WEBPACK_IMPORTED_MODULE_1__.default)(
			`<span class="${ CP }__header">`,
				icon = makeIcon({CP, m}), 
				m.ch?.length ? 
					(foldSwitcher = makeFoldSwitcher({CP, m}))
					: fsCap = makeFoldSwitcherCap({CP}),
				`<span class="${ CP }__name">${ m.name }</span>`,

				if_ (m.comment) (
					`<span class="${ CP }__comment">`,
						`<span class="${ CP }__comment-align-indent">`,
							" "+commentAlignLiner+"??? ",
							// "???"+commentAlignLiner+"???",
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
				v: " ??? ",
				f: " ??????",
				c: " ??????",
				e: "   ",
			},
			slim = {
				v: " ??? ",
				f: " ??????",
				c: " ??????",
				e: "   ",
			};
		const text = slim[type] || "err";
		this.currlist.push((0,_makeWC_js__WEBPACK_IMPORTED_MODULE_1__.default)(
			`<span class="${this.cssClassPrefix}__branch ${this.cssClassPrefix}_${ type }-type"`,
				`>${ slim[type] || "err" }</span>`
		));
	}
	endOfRow (m) {this.currlist.push("\n");}
}

function makeIcon({CP, m}) {
	const dom = (0,_makeWC_js__WEBPACK_IMPORTED_MODULE_1__.default)(`<span class="${ CP }-icon">   </span>`,);
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
					replaced = _icon_manager_js__WEBPACK_IMPORTED_MODULE_0__.default.getType(ext)
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
	const dom = (0,_makeWC_js__WEBPACK_IMPORTED_MODULE_1__.default)(
		`<span class="${ CP }-fold-switcher">`,
			`<svg width=".7em" height=".7em" x="0px" y="0px" viewBox="0 0 415.346 415.346">`,
				`<g>`,
					`<path id="arrow-path" class="${ CP }-fold-switcher__arrow" `,
					`fill="#999" d="M41.712,415.346c-11.763,0-21.3-9.537-21.3-21.3V21.299C20.412,9.536,29.949,0,41.712,0l346.122,191.697`,
						`c0,0,15.975,15.975,0,31.951C371.859,239.622,41.712,415.346,41.712,415.346z" transform="rotate(90 207 207)"/>`,
				`</g>`,
			`</svg>`,
			` `,
		`</span>`,
	);
	dom.api = {
		... dom.api,
		showFoldState,
		showUnfoldState,
	};
	if (m.folded)
		showFoldState();
	else
		showUnfoldState();
	return dom;

	function showFoldState() {
		dom.api.id["arrow-path"].setAttribute("transform", "");
	}

	function showUnfoldState() {
		dom.api.id["arrow-path"].setAttribute("transform", "rotate(90 207 207)");
	}
} 

function makeChList({CP, m, children}) {
	const dom = (0,_makeWC_js__WEBPACK_IMPORTED_MODULE_1__.default)(
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
	return (0,_makeWC_js__WEBPACK_IMPORTED_MODULE_1__.default)(`<span class="${ CP }-f-s-cap">??????</span>`);
}


function if_ (cond) {
	return cond ? (...args) => args.join("") : () => "";
}



/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	getType,
	testHTML,
	get types    () {return types;   },
	get replaces () {return replaces;},
});

function getType(ext) {
	if (types.includes(ext))
		return ext;
	else 
		for (let i in replaces) 
			if (this.replaces[i].includes(ext))
				return i;
	return "default";
}

function testHTML(clPref="file-tree") {
	return types.map((v, i) => {
		return [
				`<div style="display: table-row;">`,
					`<span style="display: table-cell;text-align: right;">${i + 1}.</span>`,
					`<span style="display: table-cell;">`,
						` &nbsp;&nbsp;&nbsp;&nbsp; `,
						`<span `,
							`class="${clPref}-icon `,
								`${clPref}-icon_type-${v} `,
								`${clPref}-icon_style-colored`,
							`"`,
						`>&nbsp;&nbsp;&nbsp;</span>`,
						` &nbsp;&nbsp;&nbsp;&nbsp; `,
					`</span>`,
					`<span style="display: table-cell;">`,
						`<span `,
							`class="${clPref}-icon `,
								`${clPref}-icon_type-${v} `,
								`${clPref}-icon_style-mono`,
							`"`,
						`>&nbsp;&nbsp;&nbsp;</span>`,
						` &nbsp;&nbsp;&nbsp;&nbsp; ${v}`,
					`</span>`,
				`</div>`
			].join("");
			
	}).join("\n");
}

const replaces = {
	git: [
		"git", 
		"gitignore",
		"gitmodules"
	],
	archive: [
		"zip",
		"7z",
		"rar",
		"7zip",
		"tgz",
		"gz",
		"pzip",
		"tar",
		"wim",
	],
	excel: [
		"xls",
		"xlsx",
		"xlsm",
		"xlsb",
		"xlt",
	],
	image: [
		"avif",
		"emf",
		"jp2",
		"pnm",
		"ppm",
		"tga",
		"tif",
		"tiff",
		"webp",
		"xbm",
		"xpm",
	],
	powerpoint: [
		"ppt",
		"pptx",
		"pps",
		"ppsx",
	],
	word: [
		"doc",
		"docx",
		"docm",
		"docxml",
		"dotm",
		"dotx",
		"wri",
	],
	video: [
		"avi",
		"mp4",
		"wmv",
	],
	audio: [
		"mp3",
		"wav",
	]
};

const types = [
	"closed-folder",
	"opened-folder",
	
	"access",
	"actionscript",
	"ae",
	"ai",
	"angular",
	"applescript",
	"archive",
	"arduino",
	"audio",
	"babel",
	"binary",
	"blade",
	"bower",
	"c",
	"cad",
	"cf",
	"circleci",
	"clojure",
	"cmake",
	"coffeescript",
	"composer",
	"cpp",
	"crystal",
	"csharp",
	"css",
	"csv",
	"dart",
	"default",
	"dlang",
	"docker",
	"dotnet",
	"editorconfig",
	"ejs",
	"elm",
	"erlang",
	"eslint",
	"ex",
	"excel",
	"fixedform-fortran",
	"font",
	"git",
	"go",
	"gradle",
	"graphviz",
	"groovy",
	"gruntfile",
	"gulpfile",
	"haml",
	"haskell",
	"haxe",
	"html",
	"image",
	"imageunsupported",
	"indesign",
	"java",
	"js",
	"json",
	"jsp",
	"jsx",
	"julia",
	"kotlin",
	"less",
	"license",
	"liquid",
	"lisp",
	"lock",
	"log",
	"lsl",
	"lua",
	"markdown",
	"markup",
	"matlab",
	"maya",
	"mint",
	"modern-fortran",
	"mustache",
	"nginx",
	"nodejs",
	"note",
	"npm",
	"nsis",
	"ocaml",
	"onenote",
	"pcb",
	"pdf",
	"perl",
	"php",
	"plist",
	"postcss",
	"powerpoint",
	"powershell",
	"preferences",
	"premiere",
	"procfile",
	"psd",
	"pug",
	"puppet",
	"python",
	"r",
	"rails",
	"riot",
	"ruby",
	"rust",
	"sass",
	"scala",
	"scss",
	"settings",
	"shell",
	"sketch",
	"slim",
	"source",
	"sql",
	"stata",
	"stylelint",
	"stylus",
	"sublime",
	"svg",
	"swift",
	"tcl",
	"tern",
	"tex",
	"text",
	"textile",
	"todo",
	"twig",
	"typescript",
	"video",
	"vim",
	"vue",
	"webpack",
	"windows",
	"word",
	"xml",
	"yaml",
	"yarn",
];

/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ makeWC)
/* harmony export */ });
function makeWC(...args) {
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

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ assemblyTree)
/* harmony export */ });
function assemblyTree(treeModel, o) {
	if (o.beforeAssembly)
		o.beforeAssembly(treeModel);
	const chProp = o.chProp || "ch"
	
	let 
		rI = 0,
		mArr = []

	recursive(0, "", treeModel);

	if (o.afterafterAssembly)
		o.afterafterAssembly(treeModel);
	return o;
		

	function recursive(depth, mask, mNode) {
		createRow(depth, mask, mNode, 0);
		mArr.push(mNode);

		if (mNode[chProp]) {
			let lastChIndex = mNode[chProp].length - 1;

			if (o.newChList)
				o.newChList(mNode);

			for (let i = 0, len = mNode[chProp].length; i < len; i++) {
				if (i < len - 1) 
					recursive(depth + 1, mask+"0", mNode[chProp][i]);
				else if (i == len - 1) 
					recursive(depth + 1, mask+"1", mNode[chProp][i]);
			}

			if (o.endOfChList)
				o.endOfChList(mNode);
		}

		mArr.pop();
	}

	function createRow(depth, mask, mNode, numInHeader) {
		let cI = 0;
		if (o.newRow)
			o.newRow(mNode, rI);
		for (let type; cI < depth; cI ++) {

			if (mask[cI] == "0")
				type = cI < depth - 1 ? "v" : "f";
			else if (mask[cI] == "1")
				type = cI < depth - 1 ? "e" : "c";
			o.addBranchEl(type, mArr[cI], {row: rI, cell: cI});
		}
		o.addHeader(mNode, {row: rI, cell: cI});

		if (o.endOfRow)
			o.endOfRow(mNode, rI);
		rI ++;
	}

}

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ JsonErrHlter)
/* harmony export */ });
/* harmony import */ var _CSS_themes_scss_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _syntax_highlight_framework_syntax_hl_fk_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);



const version = "1.1.5";

const {
	token,
	nToken,
	spToken,
	rule,
	domain,
	seq,
	alter,
	q,
	not,
	spWrap,
	error,
	deb,
} = _syntax_highlight_framework_syntax_hl_fk_js__WEBPACK_IMPORTED_MODULE_1__.default.describeAPI;

const
	__main_ = rule(function(pc) {
		return seq(
			spWrap(r.subject.catch("Main. Expected subject.")),
			error("Main. Unexpected symbol after end of code.").q("*")
		)(pc);
	}),
	list = rule(function(pc) {
		return token("[").in("list__open")
			.break(
				seq(
					spWrap(r.subject.q("*/", spWrap(token(",").in("list__coma")))),
					token("]").in("list__close")
						.catch("List. Expected closing bracket ' ] '."),
				)
			).msg("List.")(pc);
			
	}),
	dict = rule(function(pc) {
		return spToken("{")
			.break(
				alter(
					spToken("}"),
					seq(
						seq(
							d.string_n.catch("Dict. Expected string name of field."),
							spToken(":").catch("Dict. Expected colon ' : '."),
							r.subject.catch("Dict. Expected subject - (null | boll | number | string | list | dict).")
						).q("*/", spToken(",")),
						spToken("}").catch("Dict. Expected closing curly ' } ' or coma ' , '."),
					),
				)
			).msg("Dict.")(pc);
	}),
	d = {
		string_v : domain("string_v" , function(pc) {
			return r.string(pc);
		}),
		string_n : domain("string_n" , function(pc) {
			return r.string(pc);
		}),
		slashed : domain("slashed", function(pc) {
			return token(
				'\\"'         ,
				"\\\\"        , 
				"\\/"         , 
				"\\b"         ,
				"\\f"         ,
				"\\n"         ,
				"\\r"         ,
				"\\t"         ,
				/\\u\d\d\d\d/y,
			)(pc);
		}),
		number          : domain("number", function(pc) {
			return token(/\b\d+\.|\.\d+\b|\b\d+\.?\d*\b/y)(pc);
		}),
		bool            : domain("bool", function(pc) {
			return token(/\btrue\b|\bfalse\b/y)(pc);
		}),
		_null           : domain("_null", function(pc) {
			return token(/\bnull\b/y)(pc);
		}),
	},
	r = {
		subject         : rule(function(pc) {
			return alter(
				d._null,
				d.bool,
				d.number,
				d.string_v,
				list,
				dict
			)(pc);
		}),
		string        : rule(function(pc) {
			return seq(
				token('"'),
				q(alter(d.slashed, nToken('"', "\n", "\\")), "*"),
				token('"').catch("String: invalid symbol"),
			)(pc);
		}),
		space           : rule(function(pc) {
			return token(/\s+/y)(pc);
		}),
	};

class JsonErrHlter extends _syntax_highlight_framework_syntax_hl_fk_js__WEBPACK_IMPORTED_MODULE_1__.default.Highlighter {
	constructor (clPref="json-err-hl") {
		super(__main_, clPref);
		(0,_CSS_themes_scss_js__WEBPACK_IMPORTED_MODULE_0__.default)(clPref);
	}

	get version () { return version; }

	getHighlighted (
		templ, firstLineNum=1, cssClasses="calm-clarified-theme") {
		return super.getHighlighted(templ, firstLineNum, cssClasses);
	}
}


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setStyle)
/* harmony export */ });
function setStyle(clPref) {

	const cssCode = `.json-err-hl.calm-theme {
  background-color: #222;
}
.json-err-hl.calm-theme .json-err-hl__line-text {
  color: #eee;
}
.json-err-hl.calm-theme .json-err-hl__line-text .string {
  color: #ddc;
}
.json-err-hl.calm-theme .json-err-hl__line-text .string_v {
  color: #ddc;
}
.json-err-hl.calm-theme .json-err-hl__line-text .string_n {
  color: #78a;
}
.json-err-hl.calm-theme .json-err-hl__line-text .slashed {
  color: #f90;
}
.json-err-hl.calm-theme .json-err-hl__line-text .number {
  color: #f90;
}
.json-err-hl.calm-theme .json-err-hl__line-text .bool {
  color: #f90;
}
.json-err-hl.calm-theme .json-err-hl__line-text ._null {
  color: #98f;
}

.json-err-hl.calm-clarified-theme .json-err-hl__line .json-err-hl__line-number {
  background-color: #444;
}
.json-err-hl.calm-clarified-theme .json-err-hl__line-text {
  color: #eee;
}
.json-err-hl.calm-clarified-theme .json-err-hl__line-text .string {
  color: #ddc;
}
.json-err-hl.calm-clarified-theme .json-err-hl__line-text .string_v {
  color: #ddc;
}
.json-err-hl.calm-clarified-theme .json-err-hl__line-text .string_n {
  color: #78a;
}
.json-err-hl.calm-clarified-theme .json-err-hl__line-text .bool {
  color: #fb6;
}
.json-err-hl.calm-clarified-theme .json-err-hl__line-text .number {
  color: #fb6;
}
.json-err-hl.calm-clarified-theme .json-err-hl__line-text .slashed {
  color: #fb6;
}
.json-err-hl.calm-clarified-theme .json-err-hl__line-text ._null {
  color: #98f;
}

.json-err-hl.monokai-theme {
  background-color: #333;
}
.json-err-hl.monokai-theme .json-err-hl__line-text .string_n {
  color: #3bd;
}
.json-err-hl.monokai-theme .json-err-hl__line-text .string {
  color: #da5;
}
.json-err-hl.monokai-theme .json-err-hl__line-text .string_v {
  color: #da5;
}
.json-err-hl.monokai-theme .json-err-hl__line-text .slashed {
  color: #98f;
}
.json-err-hl.monokai-theme .json-err-hl__line-text .number {
  color: #98f;
}
.json-err-hl.monokai-theme .json-err-hl__line-text .bool {
  color: #98f;
}
.json-err-hl.monokai-theme .json-err-hl__line-text ._null {
  color: #e48;
}

.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string_n {
  color: #3bd;
}
.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string {
  color: #da5;
}
.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string_v {
  color: #da5;
}
.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .slashed {
  color: #98f;
}
.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .number {
  color: #98f;
}
.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .bool {
  color: #98f;
}
.json-err-hl.monokai-clarified-theme .json-err-hl__line-text ._null {
  color: #e48;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlOi8vL0Q6L0dpdEh1Yi1teS9qc29uLWVyci1obC9jc3MvdGhlbWVzLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUE7RUFDQzs7QUFDQTtFQUNDOztBQUNBO0VBQWM7O0FBQ2Q7RUFBYzs7QUFDZDtFQUFjOztBQUNkO0VBQWM7O0FBQ2Q7RUFBYzs7QUFDZDtFQUFjOztBQUNkO0VBQWM7OztBQU1mO0VBQ0M7O0FBR0Q7RUFDQzs7QUFDQTtFQUFnQjs7QUFDaEI7RUFBZ0I7O0FBQ2hCO0VBQWdCOztBQUNoQjtFQUFnQjs7QUFDaEI7RUFBZ0I7O0FBQ2hCO0VBQWdCOztBQUNoQjtFQUFnQjs7O0FBSWxCO0VBQ0M7O0FBR0M7RUFBYzs7QUFDZDtFQUFjOztBQUNkO0VBQWM7O0FBQ2Q7RUFBYzs7QUFDZDtFQUFjOztBQUNkO0VBQWM7O0FBQ2Q7RUFBYzs7O0FBUWQ7RUFBYzs7QUFDZDtFQUFjOztBQUNkO0VBQWM7O0FBQ2Q7RUFBYzs7QUFDZDtFQUFjOztBQUNkO0VBQWM7O0FBQ2Q7RUFBYyIsImZpbGUiOiJ0aGVtZXMuc2Nzcy5qcyJ9 */`.replaceAll(/\bjson-err-hl/g, clPref);

	const styleClassName = `${clPref}__theme-style`;

	const styleAlreadyExists = [].some.call(
		document.querySelectorAll(`style.${styleClassName}`), 
		(v) => v.textContent === cssCode
	);

	if (! styleAlreadyExists) {
		const style = eHTML(`<style class="${styleClassName}"></style>`);
		style.textContent = cssCode;
		document.head.appendChild(style);
	}
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

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _describeAPI_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _Highlighter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	version: "5.3.1",
	describeAPI: _describeAPI_js__WEBPACK_IMPORTED_MODULE_0__.default,
	Highlighter: _Highlighter_js__WEBPACK_IMPORTED_MODULE_1__.default,
});

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
	token,
	nToken,
	spToken,
	rule,
	domain,
	seq,
	alter,
	q,
	not,
	spWrap,
	error,
	deb,
});

const Analyzer_proto = {
	q : function (quanto, sepCallb=undefined) {
		if (quanto == "*/" || quanto == "+/")
			chekToAnalyzer("analyzer.q", 2, sepCallb);
		return q(this, quanto, sepCallb);
	},
	in : function (name) {
		return domain(name, this);
	},
	and : function (callb) {
		chekToAnalyzer("analyzer.and", 1, callb);
		return seq(this, callb);
	},
	or : function (callb) {
		chekToAnalyzer("analyzer.or", 1, callb);
		return alter(this, callb);
	},
	break : function (...args) {
		for (let [k, callb] of args.entries())
			chekToAnalyzer("analyzer.break", k + 1, callb);
		let message = "";
		const _break_ = (pc) => {
			if(this(pc)) {
				seq(...args).or(undefinedError(message))(pc);
				return true;
			} else {
				return false;
			}
		}
		Object.setPrototypeOf(_break_, Analyzer_proto);
		_break_.msg = function(msg) {
			message = msg;
			return this;
		}
		return _break_;
	},
	catch : function (msg) {
		const _catch_ = (pc) => {
			return alter(
				this,
				error(msg)
			)(pc);
		}
		Object.setPrototypeOf(_catch_, Analyzer_proto);
		return _catch_;
	},
	deb : function (i0=0, i1=0) {
		return deb(this, i0, i1);
	},
};

Object.setPrototypeOf(Analyzer_proto, Function);

function seq(...callbs) {
	for (let [k, callb] of callbs.entries())
		chekToAnalyzer("seq", k + 1, callb);
	function _seq_(pc) {
		const hpc = pc.createHypo();
		for (let [k, callb] of callbs.entries()) {
			const res = callb(hpc);
			if (res || pc.errC.eFlag) 
				continue;
			else 
				return false;
		}
		pc.acceptHypo(hpc);
		return true;
	}
	Object.setPrototypeOf(_seq_, Analyzer_proto);
	return _seq_;
}

function alter(...callbs) {
	for (let [k, callb] of callbs.entries())
		chekToAnalyzer("alter", k + 1, callb);
	function _alter_(pc) {
		let res;
		for (let [k, callb] of callbs.entries()) {
			const res = callb(pc);
			if (res)
				return true;
		}
		return false;
	}
	Object.setPrototypeOf(_alter_, Analyzer_proto);
	return _alter_;
}

function q(callb, quanto, callb2=undefined) {
	chekToAnalyzer("q", 1, callb);
	let _q_;
	if (quanto == "*") {
		_q_ = function _q_zero_or_many_(pc) {
			while (pc.text[pc.i]) {
				let i0 = pc.i, status;
				status = callb(pc);
				if (status) {
					if (i0 != pc.i) {
						continue;
					} else {
						/**
						 * Not strict variant. Mismatches allowed throw error message in console.
						 */
						console.error(`(!)`, `i0 == pc.i`, 
							"\n\tpc.i :", pc.i, "\n\tpc.monitor :", pc.monitor); 
						pc.i ++;
						return true;

						/**
						 * Strict variant. Mismatches forbidden. Script will stoped.
						 */
						// console.error(`(!)`, `i0 == pc.i`, pc); debugger; throw new Error();
					}
				} else 
					return true;
			}
			return true;
		}
	} else if (quanto == "+") {
		_q_ = function _q_one_or_many_(pc) {
			return callb(pc) && q(callb, "*")(pc);
		}
	} else if (quanto == "?") {
		_q_ = function _q_zero_or_one_(pc) {
			return callb(pc) || true;
		}
	} else if (quanto == "*/") {
		chekToAnalyzer("q", 3, callb2);
		_q_ = function _q_zero_or_many_sep_(pc) {
			seq(
				callb,
				seq(callb2, callb).q("*")
			)(pc);
			return true;
		}
	} else if (quanto == "+/") {
		chekToAnalyzer("q", 3, callb2);
		_q_ = function _q_one_or_many_sep_(pc) {
			return seq(
					callb,
					seq(callb2, callb).q("*")
				)(pc);
		}
	} else {
		console.error(`(!)`, `Invalid quantifier`, `'${quanto}'`); debugger; throw new Error();
	}

	Object.setPrototypeOf(_q_, Analyzer_proto);
	return _q_;
}

function not(callb) {
	chekToAnalyzer("not", 1, callb);
	const _not_ = function _not_(pc) {
		const hpc = pc.createHypo();
		const res = callb(hpc);
		if (! res) {
			pc.match(pc.text[pc.i]);
			return true;
		} else 
			return false;
	}
	Object.setPrototypeOf(_not_, Analyzer_proto);
	return _not_;
}

function domain(name, callb, msg=null) {
	const _domain_ = function _domain_(pc) {
		const
			chpc = pc.createChildHypo(name),
			status = callb(chpc)
		if (msg) 
			chpc.msg = msg;
		if (status || pc.errC.eFlag) 
			pc.acceptChildHypo(chpc);
		return !! status;
	}
	_domain_.msg = function (text) {
		return domain(name, callb, text);
	}
	_domain_.as = function(otherName, msg=null) {
		return domain(otherName, callb);
	}
	Object.setPrototypeOf(_domain_, Analyzer_proto);
	return _domain_;
}

function rule(callb) {
	const _rule_ = function _rule_(pc) {
		const 
			hpc    = pc.createHypo(),
			status = callb(hpc);
		if (status || pc.errC.eFlag) 
			pc.acceptHypo(hpc);
		return !! status;
	}
	Object.setPrototypeOf(_rule_, Analyzer_proto);
	return _rule_;
}

function token(...templs) {
	const _token_ = function _token_(pc) {
		return pc.match(...templs);
	}
	Object.setPrototypeOf(_token_, Analyzer_proto);
	return _token_;
}

function nToken(...templs) {
	const _notToken_ = function _notToken_(pc) {
		return pc.notMatch(...templs);
	}
	Object.setPrototypeOf(_notToken_, Analyzer_proto);
	return _notToken_;
}

function spToken(...templs) {
	const _space_wrapped_token_ = function(pc) {
		return seq(token(/\s+/y).q("*"), token(...templs), token(/\s+/y).q("*"),)(pc);
	}
	Object.setPrototypeOf(_space_wrapped_token_, Analyzer_proto);
	return _space_wrapped_token_;
}

function spWrap(callb) {
	chekToAnalyzer("spWrap", 1, callb);
	const _space_wrapped_ = function(pc) {
		return seq(token(/\s+/y).q("*"), callb, token(/\s+/y).q("*"),)(pc);
	}
	Object.setPrototypeOf(_space_wrapped_, Analyzer_proto);
	return _space_wrapped_;
}

function error(msg) {
	const _error_ = function(pc) {
		domain("error", token(/\s*.*/y), msg)(pc);
		pc.errC.eFlag = true;
		domain("after-error", token(/\s+|\S+/y), msg).q("*")(pc);
		return true;
	}
	Object.setPrototypeOf(_error_, Analyzer_proto);
	return _error_;
}

function undefinedError(msg) {
	const _undefined_error_ = function(pc) {
		return error("Undefined error. "+msg)(pc);
	}
	Object.setPrototypeOf(_undefined_error_, Analyzer_proto);
	return _undefined_error_;
}

function deb(callb, a=0, b=0) {
	chekToAnalyzer("deb", 1, callb);
	function _deb_(pc) {
		b = b || pc.text.length;
		if (a <= pc.i && pc.i <= b) {
			debugger;
			const res = callb(pc);
			console.log(`res`, res);
			debugger;
			return res;
		}
	}
	Object.setPrototypeOf(_deb_, Analyzer_proto);
	return _deb_;
}

function chekToAnalyzer(fName, argN, callb) {
	if (! callb || callb instanceof Analyzer_proto) {
		console.error(`Argument`, argN, `(from 1) of function '${fName}()' is not Analiser. There is: \n`, callb?.toString ? callb.toString() : callb);
		throw new Error(`Invalid callback. \n\tArgument ${argN} of function '${fName}()' is not Analiser. \n`);
	} else
		return true;
}

/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HighlightAPI)
/* harmony export */ });
/* harmony import */ var _ParseContext_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _CSS_highlighter_scss_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(13);



class HighlightAPI {

	constructor (mainRule, clPref="syntax-hl-fk") {
		this.mainRule = mainRule;
		this.clPref   = clPref  ;
		(0,_CSS_highlighter_scss_js__WEBPACK_IMPORTED_MODULE_1__.default)(this.clPref);
	}

	/**
	 * getHighlighted       (template, firstLineNum, cssClasses)
	 * highlightTextContent (el)
	 * scrollToFirstError   (el)
	 * highlight            (el, template, firstLineNum)
	 * setMainRule          (rule)
	 */

	getHighlighted       (...args) { return getHighlighted       (this, ...args); }
	highlightTextContent (...args) { return highlightTextContent (this, ...args); }
	scrollToFirstError   (...args) { return scrollToFirstError   (this, ...args); }
	highlight            (...args) { return highlight            (this, ...args); }
	setMainRule          (...args) { return setMainRule          (this, ...args); }
}


function getHighlighted(self, text, firstLineNum=1, cssClasses="") {
	const el = document.createElement("div");
	if (typeof cssClasses == "string")
		el.className += " " + cssClasses;
	else if (cssClasses instanceof Array) 
		el.classList.add(...cssClasses);
	else 
		throw new Error([
			"(!) getHighlighted(). ",
			"Argument #3 must be a string, an array of strings, or undefined.",
			"",
			cssClasses+" given.",
			""
		].join("\n"));
	highlight(self, el, text, firstLineNum);
	return el;
}

function highlightTextContent(self, el) {
	return highlight(self, el, el.textContent, getFirstLineNum(el));
}

function scrollToFirstError(self, el) {
	const errEl = el.querySelector(".error");
	if (errEl) {
		// errEl.scrollIntoView();
		const 
			top = errEl.getBoundingClientRect().top - el.getBoundingClientRect().top,
			vpH = el.clientHeight,
			deltaScroll = top - vpH / 2;
		el.scrollTop = deltaScroll;
	}
}

function highlight(self, contentEl, text, firstLineNum=1) {
	if (! (contentEl instanceof HTMLElement))
		throw new Error([
			"(!) highlight(). Argument #1 must be a HTMLElement.",
			"",
			contentEl + " given.",
			""
		].join("\n"));

	if (["executing", "executed", "exec-error"].some((v) => contentEl.classList.contains(v)))
		throw new Error([
			"(!) Highlighter. Already handled.", 
			"",
			contentEl
		].join("\n"));
	
	contentEl.classList.add(self.clPref);
	contentEl.classList.add("executing");
	contentEl.innerHTML = "";

	if (typeof text != "string")
		throw new Error([
			"(!) highlight(). Argument #2 must be a string.",
			"",
			text + " given.",
			""
		].join("\n"));

	try {
		const
			model    = _buildModel(self, text),
			contents = _renderToHighlight(self, model, firstLineNum);
		contents.forEach((lineOb) => lineOb.appendTo(contentEl));
		contentEl.classList.remove("executing");
		contentEl.classList.add("executed");
	} catch (e) {
		console.error(`(!)-CATCHED`, e);
		const lines = text.split("\n");
		lines.forEach((line, i, a) => {
			let lineOb = _makeLine(self, firstLineNum + i);
			let m = line.match(/^(\s*)(.*)/);
			[lineOb.indent.textContent, lineOb.content.textContent] = [m[1], m[2]];
			if (i < a.length - 1)
				lineOb.setEol();
			lineOb.appendTo(contentEl);
		});
		contentEl.classList.remove("executing");
		contentEl.classList.add("exec-error");
	}
}

function setMainRule(self, rule) {
	self.mainRule = rule;
}

function _buildModel(self, text) {
	const mSlot = [];
	self.mainRule(new _ParseContext_js__WEBPACK_IMPORTED_MODULE_0__.default({
		text, 
		i: 0, 
		mSlot, 
		dStack: []
	}));
	return mSlot;
}

function _renderToHighlight (self, model, firstLineNum=1) {
	const content = [], nodeStack = [];
	let lNum = firstLineNum, indentZoneFlag = true, lastLine;
	nodeStack.last = () => nodeStack[nodeStack.length - 1];
	content.push(lastLine = _makeLine(self, lNum ++));
	recur(model);
	return content;
	function recur(sb) {
		if (sb instanceof Array) {
			sb.forEach(recur);
		} else if (typeof sb == "object") {
			sb.parent = nodeStack.last() || null;

			nodeStack.push(sb);
			recur(sb.ch);
			nodeStack.pop();

		} else if (typeof sb == "string") {
			if (sb == "\n") {
				lastLine.setEol();
				content.push(lastLine = _makeLine(self, lNum ++));
				indentZoneFlag = true;
			} else if (indentZoneFlag && sb.match(/^\s+$/)) {
				lastLine.indent.innerHTML += sb;
			} else {
				let _sb = sb;
				if (indentZoneFlag) {
					const m = sb.match(/^(\s*)(.*)/);
					if (! m)
						throw new Error(`sb not matched with /^(\\s+)(.*)/. sb = ${sb}`)
					const
						indent = m[1],
						theText = m[2];
					lastLine.indent.innerHTML += indent;
					_sb = theText;
					indentZoneFlag = false;
				}
				const 
					lastDomainNode = nodeStack.last(),
					className = nodeStack.map(v => v.name).filter(v => v).join("- "),
					el = _evaluate(`<span class="${className || ""}"></span>`);
				if (nodeStack.last()?.name == "error") {
					lastLine.guter.classList.add("error");
					lastLine.guter.title = nodeStack.last()?.msg;
				}
				if (nodeStack.last()?.name == "after-error") {
					lastLine.guter.classList.add("after-error");
					lastLine.guter.title = nodeStack.last()?.msg;
				}
				lastLine.content.appendChild(el);
				el.textContent = _sb;
				el.astNode = nodeStack.last();
				const msgStr = nodeStack.reduce((a,v) => {
					if (v.msg) 
						a += `${v.name} : ${v.msg} \n`;
					return a;
				}, "");
				if (msgStr) {
					el.title = msgStr;
					el.style.cursor = "pointer";
				}
				if (lastDomainNode) {
					el.dataset.region = `${lastDomainNode.i0}:${lastDomainNode.i1}`;
					el.domain = lastDomainNode;
				}
			}
		} else {
			console.error("Invalid model node", sb);
			throw new Error("Invalid model node.")
		}
	}
}

function _makeLine(self, num) {
	return Object.setPrototypeOf(
		{
			line: _evaluate(
				`<span class="${self.clPref}__line">`+
					`<span class="${self.clPref}__line-number" data-line-number="${num}"></span>`+
					`<span class="${self.clPref}__line-indent"></span>`+
					`<span class="${self.clPref}__line-text"  ></span>`+
				`</span>`
			),
			eol: null,
			get guter  () {return this.line.children[0]},
			get indent () {return this.line.children[1]},
			get content() {return this.line.children[2]},
		},
		{
			appendTo: function(parent) {
				parent.appendChild(this.line);
				if (this.eol)
					parent.appendChild(this.eol);
			},
			setEol: function() {this.eol = _evaluate(`<span>\n</span>`);}
		}
	) 
}

function _evaluate (code) {
	const shell = document.createElement("div");
	shell.innerHTML = code;
	return shell.children[0];
}


function getFirstLineNum(el) {
	const dln = parseInt(el.dataset.lineNum);
	if (! dln)
		return 1;
	else if (el.nodeName == "PRE")
		return dln + 1;
	else 
		return dln;
}

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ParseContext)
/* harmony export */ });
/* harmony import */ var _ModelNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);


class ParseContext {
	constructor(pc) {
		Object.defineProperties(this,{
			text:   {value: pc.text},
			mSlot:  {value: pc.mSlot},
			dStack: {value: pc.dStack},
			lFStack: {value: pc.lFStack},
			errC: {value: pc.errC || {eFlag: false}},
		});
		this.i = pc.i;
		this.i0 = pc.i0;
		this.selfMN = pc.selfMN;
		this.monitor = pc.monitor;
		// this.debugDomain = pc.debugDomain;
	}
	match (...templs) {
		for (let t of templs) {
			const {mSubstr, len} = this._getMatchSubstr(t);
			if (mSubstr) {
				this.i += len;
				push(this.mSlot, mSubstr);
				this.monitor = this.i+ " : "+this.text.substr(this.i, 20)
				return mSubstr;
			}
		} 
		return "";
	}
	notMatch (...templs) {
		for (let t of templs) {
			const {mSubstr, len} = this._getMatchSubstr(t);
			if (mSubstr) 
				return false;
		}

		const simbol = this.text[this.i];
		push(this.mSlot, simbol);
		this.i += 1;
		this.monitor = this.i+ " : "+this.text.substr(this.i, 20);
		return simbol;
	}
	createHypo () {
		const 
			{text, i, mSlot, dStack, errC} = this,
			hpc = {text, i, mSlot: [], dStack, errC};
		return new ParseContext(hpc);
	}
	acceptHypo (hpc) {
		this.i = hpc.i;
		this.monitor = hpc.monitor;
		// this.mSlot.push(...hpc.mSlot);
		hpc.mSlot.forEach((v) => push(this.mSlot, v));
		return true;
	}
	createChildHypo (name) {
		const 
			{text, i, dStack, errC} = this,
			mSlot = [],
			mn = new _ModelNode_js__WEBPACK_IMPORTED_MODULE_0__.default(name, mSlot),
			hpc = {text, i, i0: i, mSlot, selfMN: mn, dStack, errC};
		mn.i0 = i;
		return new ParseContext(hpc);
	}
	acceptChildHypo (hpc) {
		this.i = this.i1 = hpc.i;
		push(this.mSlot, hpc.selfMN);
		hpc.selfMN.i1 = hpc.i;
		if (hpc.msg)
			hpc.selfMN.msg = hpc.msg;
		hpc.selfMN = null;
		return true;
	}
	_getMatchSubstr (templ) {
		let mSubstr = "", len;
		if (typeof templ == "string") {
			len = templ.length;
			const substr = this.text.substr(this.i, len);
			if (substr === templ)
				mSubstr = substr;
			
		} else if (templ instanceof RegExp) {
			templ.lastIndex = this.i;
			const mOb    = this.text.match(templ);
			mSubstr =  mOb && mOb[0] || "";
			len = mSubstr.length;
		}

		return {mSubstr, len};
	}
}



function push(arr, subj) {
	if (typeof subj == "string") {
		let lines = subj.split("\n");
		for (let [k, line] of lines.entries()) {
			if (k)
				arr.push("\n");
			if (line)
				pushOneLineText(arr, line);
		}
	} else 
		arr.push(subj);
}

function pushOneLineText(arr, subj) {
	let i = arr.length - 1;
	if (
		typeof arr[i] == "string" 
		&& typeof subj == "string" 
		&& arr[i] !== "\n" 
		&& subj !== "\n"
		&& (
			subj.match(/^\s+$/) && arr[i].match(/^\s+$/) 
			||
			! subj.match(/^\s+$/) && ! arr[i].match(/^\s+$/) 
		)
	)
		arr[i] += subj;
	else
		arr.push(subj);
}

/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ModelNode)
/* harmony export */ });
class ModelNode {
	constructor (name, ch) {
		Object.defineProperties(this,{
			name: {value: name},
			ch  : {value: ch},
		});
	}

	get text () {
		let res = "";
		recur(this.ch);
		return res;
		function recur(sb) {
			if (sb instanceof Array) {
				sb.forEach(recur);
			} else if (typeof sb == "object") {
				recur(sb.ch);
			} else {
				res += sb;
			}
		}
	}
}

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setStyle)
/* harmony export */ });
function setStyle(clPref) {

	const cssCode = `.syntax-hl-fk {
  text-align: left;
  white-space: pre;
  background-color: #444;
  color: #ccc;
  -moz-tab-size: 4;
  tab-size: 4;
  overflow: auto;
  max-height: 500px;
  padding: 20px;
  font-family: consolas, monospace;
}
.syntax-hl-fk *::selection {
  background-color: #000;
  background-color: rgba(120, 120, 120, 0.5);
}
.syntax-hl-fk .syntax-hl-fk__line {
  margin-left: -20px;
}
.syntax-hl-fk .syntax-hl-fk__line > * {
  display: table-cell;
}
.syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-number {
  width: 50px;
  min-width: 50px;
  max-width: 50px;
  text-align: right;
  background-color: #333;
  padding-right: 10px;
  margin-right: 5px;
  transition: all 0.2s;
}
.syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-number:before {
  content: attr(data-line-number) "";
}
.syntax-hl-fk .syntax-hl-fk__line span.syntax-hl-fk__line-number.error {
  color: #fff;
  background-color: #e48;
}
.syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-indent {
  padding-left: 5px;
}
.syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-text {
  padding-left: 20px;
  white-space: pre-wrap;
  word-break: break-word;
}
.syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-text .error {
  color: #fff;
  background-color: #e48;
  box-shadow: inset 0 0 2px #fff;
}
.syntax-hl-fk .syntax-hl-fk__line .syntax-hl-fk__line-text:before {
  content: "";
  margin-left: -20px;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlOi8vL0Q6L0dpdEh1Yi1teS9zeW50YXgtaGlnaGxpZ2h0LWZyYW1ld29yay9jc3MvaGlnaGxpZ2h0ZXIuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQTtFQUNDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUVBO0VBQ0E7RUFDQTtFQUNBOztBQUNBO0VBQ0M7RUFDQTs7QUFHRDtFQUNDOztBQUNBO0VBQ0M7O0FBRUQ7RUFDQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUNBO0VBQ0M7O0FBR0Y7RUFDQztFQUFhOztBQUVkO0VBQ0M7O0FBRUQ7RUFDQztFQUNBO0VBQ0E7O0FBQ0E7RUFDQztFQUNBO0VBQ0E7O0FBRUQ7RUFDQztFQUNBIiwiZmlsZSI6ImhpZ2hsaWdodGVyLnNjc3MuanMifQ== */`.replaceAll(/syntax-hl-fk/g, clPref);

	const styleClassName = `${clPref}__theme-style`;

	const styleAlreadyExists = [].some.call(
		document.querySelectorAll(`style.${styleClassName}`), 
		(v) => v.textContent === cssCode
	);

	if (! styleAlreadyExists) {
		const style = eHTML(`<style class="${styleClassName}"></style>`);
		style.textContent = cssCode;
		document.head.appendChild(style);
	}
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

/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ setStyle)
/* harmony export */ });
function setStyle(clPref) {

	const cssCode = `.file-tree-diagram-icon {
  font-family: consolas, monospace;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}

.file-tree-diagram-icon_type-closed-folder.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIHSURBVGhD7Zm/asJQFMZvNItYLFVQQYiDc5EKXbv0MXRSJ0Ffok/g4irGF+gLdOnoUCk4FyQdnGyoIgr+yznkhDSaYErTm9b7g89wc2Pu991zphsmEJw5EvyUy+XrSCRyIUkSM6444cV2u2W73e693+9r5i1uYIB6vT5IJpO3YB5CgNwwjKNms9nnfD6/6/V6r+YUF9Bpo9EY5PN5KwBOuIQA8wBUQdO0DyPEfbfbHeJNDmC/gHGnqBJO0Xw0GmWKolwlEomnarVaxLdxALe52WxiBcjkqVA7jcdjfbVaPVJ1goLWA63X6zdVVR/QbavVGhi7iS0EnBICXgJtpOs6i8fjLJ1OW/8LMggFGI1Gw3a7XULHm82GGTvIlsvlyVosFmw6nbJcLsey2eyXtqM2C1LQwgAGMAbysYe8FIvFWKFQwCsZD1KE8x4GkGWZZTIZX0qlUtYu/AZ20wcB7NCEH6gvg5IXGMCvaT8L/AReaxxUwI7TKClMuAYIm1E3PCvwFxABeCMC8EYE4I0IwBsRgDciAG9EAN6IALwRAXjzfwN853yIB54VoBOwMMgNDGA/QgnzcQp5s3u0ApCc4zDJDo0xAJzzmx/ujj4cBsgXeQUB2Fy1Wu1FUZQbODanfvPqOx7QplKQyWQy7HQ6JXRZqVSKhvlLChA28wSZJ6mq+mxOCQRnCmN76QPUPNGTeu0AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-opened-folder.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOOSURBVGhD7ZpbTxpBFMcPC3ITY4OlBsrFANKWNGnSxz6YNP0WxtSH8mq/gh8E0MRIfOlH6ItP9K1p+to3MDHeqKh4wUvnP90x47AsSyssJPtLTnY5O5fznzMLOzvQuOPSj/csLS298Xq9xbu7O3K5XKRpGj8GAgG9xHBA/4Kbmxu6urqi8/PzT5VK5afu5nQIWF5eXkin09uzs7N0fX1NFxcXvPLl5SVvCAa/z+cjt9tNExMTxATz817IQclggGTkcji/vb2lw8ND2t3dfbexsVHVL3E0/fgANIjAgsEgzczMUDQapbm5OcpkMpTL5Sifz1M8Hqfp6WkuhI0MNZtNOjo6ooODA94ZPsPfbrd5eyKbRiauq+XUOkZ0eD0ez31lGBDnsvn9fgqHwxSJRCiVSnGB2WyWC0wmk9wPccjWyckJFwVxe3t71Gg06OzsjI+sGWqfRhjLkuhWUUXuCOJCoRAXgUxB4Pz8PBeHLMZiMR48pqZcTzUZ9bOg6xQaFJia+EJAdqxiFk/XDKiVcDNZsWHTcwr1i5EoYYPg0QUMG0eA3YyFALN7aGwyMHYCRMA44keP/Zo32fNWnTslRlKAGnytVmscHx8vrK+v1/gFiZGeQhBQr9cbrVbrw+bm5g/d/YCRnkIs+N9s6rwvl8vfdXcHQxUgpgaYnJzkj9sqcpnT09Mva2trhiMvsC0DU1NT/IkVCyYjZCFmDF2AHBgWS1j49FoXmGHrPYDFUyKR4Cs5I6xkwfabGGsDrNpkrE4fYIuAfgLshe0Z+F8cAXbjCLAbR4DdOALsxhFgN44Au3EEDIqRXVI+NoYCoF4dAWx4yDYI/mWh0zMD3RpVBQmzglE5tR+rYjoEYH2KtwRoQDQizmXrhirIyGTktkTb6B+mrpWNMMwAdg+FEFWMQPhk6xdRB5vneMkFa7Va9wZ/Lzpyubi4mNI07aPX600Hg8FEKBSKMPfrQCCgYUcebxGw04itVHk01ZFVMbouhH9jsIEqYbAAAtcz8Gtra2ubO7tg3qvO6uqqtrOzE2MNZt1ud4p1mvF4PM98Pt8LJug5O08wsX4Iw/YpxOG82+66DAJl8ZeLxWJBd/WFJQFWKBQKcTZyL9lIP2WB55moJBOTZBkMM98rJtQLceJ/FfgbA4CAarVaLpVK9gowY2Vlxddut6NMYIxlL8tcOZahJ0zoWxz39/e/ViqVz39L9wPRH2z065ITbrP/AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-closed-folder.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF1SURBVGhDYxgFo2CEA0YQMa3KRRdI8YDYJIAnWW17HkPZAwbAHljY7HlKVozPFCxCJHj1/tund5++2wE9cREqNCAA7IHl7T6nTDQlSfIACJy7+eL924/fnYGeOA8VojtggtJkAUM1CUFhfs69wCSoDxWiO6AoBkDg/38GhlPXnn348v33BqgQXcC/f//uAWO+mSIP/Pn7j+Hxq88MQkLCDBoq0gyMjGDj6AJ2HDh/PrhojRE4Cf3685fh09efJGFg2me4/+Irg46WKoOmqgxdHY8MwB5gYWFlYWADlqIkYF5BYQYrE00Gfl4usEEDBcDBtrYv5JyHg6EhWGSIAJQkNJTBqAcGGox6YKDBqAcGGox6YKDBqAcGGox6YKDBqAcGGox6YKDBqAcGGox6YKDBqAcGGox6YKDBqAcGGox6YKABeHR6XqPXOX0thSE1On3j7tPz0RUbjcAemFbtos/wn4EfLDOEQFbbnkNQ5igYBSMUMDAAABkxgveZ8scEAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-opened-folder.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMBSURBVGhD7ZnLTxNBHMd/O933q0upiKAlUKIVUYjGGElE1MTEf8KLHhTFoxdjOCFyJR5M1JNX9Q+AmshJT6IxMZF4IMFINUKh9LG7fYzTdmxiyqsWnWL2k2x2f9/sbPczs7PZ7cJuh6PrCg/vXuwTEHrkZHM0Ke9kGjKgcskEJ5eHtWT2yshE9AONSlQJPLhzfvB0f2Qm3NEKqbQNiWQGkqlMaTtLpHLZLNiOC6YqgiggkCUeNFkEgf+7egvfEvBx/sfAzfGXr2lUYkOBSLidJtVgsqRSNsQTSXDdHFmnoEB6yHEdIpkFHzmqKgugEDlR8IGuiOWGdbCjAptRkiOjZdtuafQSyTTkiVw6Y0Mhn4d8PgeqJBBBHixyWfK+7Y3cRgI7Pu7FHtFVGYIBE7pCe6G/pxNOHOuGM6d64exAHwycPAqRSBgcLEIy45Yb1cE/n5cymS+WqYGhKzSpD5Y3lh3BE2CNJ8AaT4A1u0bg+3I6wSHfF1pWaHgBTJ5N3n6KxVdWnMEbY1MLNK7Q0ALFk5+di8WX45kL1yam3tP4Nxpa4N1cbCW+7Jy7fj86S6MqmAkELB3ia5s/zC0l7Gcb9fwvmAm0NPshGAzAatKhyZ/B9BLqDLXCYtwm7wgFmtQOUwFR4KH/SBjmY6s0qR3mk9jya+RVNE+r2mEuUC+eAGs8AdZ4AqzxBFjjCbDGE2CNJ8AaT4A1ngBr/k+B4rffev7qqJUs+a21lFu1YLz1Oaz3nbjDh7nLnI/vsgzlQJOp7cEAvX5DRaoig2koIIkCkJq2qI8CxvD0+as3GOPHNKrAAfo8PD49Q8t1qRJYj9FRQM2ZoTZB4LtxAXdgDoV5xLUYunLINNR2SeAP+E1VLorpmgKGJoMiS4DQ1ocvCbyYeTI8Nn2VRjWxLYHtMHl7aD+PfBEOQbAAqAchHPLrWihg6QEictjUVVEnYhoZRdIR0OTXSu0aRmAzJkcuSYKK9xV4tw0w6iYT76As8ZYoScc1Tba+Li5Fh+9Fb9HdawDgJ6CHDrXbHUtYAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-access.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD8UlEQVRo3u2ZWWgTURSGq1asWDTuWvFFpKCCglRcqBVREPXFB8WtihZFiXWtC1Ko2ZrE1gYpCobqiwWVaF3AJSAuRcXGFmspCi6IS3HBBatYg9TG/+AZuIZkksxkMhPIhY87mbk3c/5Zzjn3TFaWyubxePrbbLZpFoulBBwGN8EnEGJasozQQqFQLxgzDiwBFeAceAr+CMZGIvUCcFITKLJarVvQe8F98COGofoIwO2fBENX4kQucBm8UWhoTAFer7cvfo8Aw1wu12D0ucm42iGN+Q5awUfQE+E43dk2cAHYcTHnoc8xkoBOcAbUgF1ggwQ/ok5QD+6CnzwnCG6BzSBbbwEtCVzMbDCVhfl5/m3ZO2IkARFsW8FezpGWAti+Y+B1ut6BbHbhobQSgDm9QYHwHugq4LHD4Rjr8/n6RLOhsrJyJMbN4Je3AXzhuX4OpKoFkK9uAlfASfbtiQrpBh3s89vBE/BMcJ0SlEddokyA7StNhoCasDm+BAx/iSu7CezDtptfylPgBDiE/eXozeiXoR8fwT71AvDnC8Q5+L0+VV4I59quVsAvSpl57EB+ZkdHSQu0EFCuVsB1yTPgz8qEea0pigNuVQJg9B4aZ7fbJ+B3ozDPqbUA8lyYf02VAKTbU3gcrbiCtbW1/TgNn62lAMwrlIKYGgHvaSXG4+p4X6EQJb/FIeA5uUTyMNK7JJw7h2IEJXBgKbCC87wm6QJVwKZGQL0wrp0fqf3CvrMKg1tPlKUoxZcbbHQen2OHYgEwdg2NcbvdgwSvc1WYWxJPJMbjNp1cMVjOOf5ebG9FX4x+MfpZIJ8cRQT7FAsgg0fxmCEkBv1autXC3LwUuNEypQIexfmytWnsRiuUCqgSSyqx/LSGAg4qFTBf8MW0rv3NSd1n8khCVWOOVgK4chFQIqBL8vecl4cf/xC26OhM8nrAxC97h5StJirALxzfHWXMRGFMg4wAMsJMFT0qQVIdiuZyZC/AS7qQnAP6AxwDXrADoX4V9u9UIuAV/1kd5+2RxjjY9Zlwko1JWPhQ4LoHPOTpqAjG9m1LxYqsW+ZYc3V19QBE3DF89SlFWATRcylNoUhMx2XsK9V7SflArzhgCAGWf01XAQGVAqgk+VZPAU0qHp/V5LKp6Js2AjhwFnFNlOY3hqfhqRbwFZwGRyhN5kV6MVjHMYZSkeNcSglwSh1kAWbJner9feAhPwo9UY5L3wccRvw+8N8XGqfTORwMpQAo5/8TETCZb2kVl/LeGak6rajRFaJIyc8rVdCaOdSnhwCZinE+L75pzXqRyoZxFLiMIUBGWC5ymplU/8T2UXAnrFphbAGZlmmZlmmq2l9nrve1X92YKwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-actionscript.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC0klEQVRo3u2ZT0hUURTGRymhhLIko8AkKwpJ2tXGgqJFtbRFBCHtQg0h2kXR77y588Z8NNWiYOifQtkmpYygFkG7kohMaDe7WgRCfwlNrdfmuZGZN++9+5x3gzlwth/fd+6553733lSqQgE0iEg3MApMAO+BR0CfbduNKZNDRE4BXwG3RP4UkTNGkgeu+RBfnHdd160xiXxPCPILec4I8rZtNwI/IgiYUUo1m9D3ZyOQX0gxoX3GNQS8Spr8Jg3yLjCVtABbU8CXJMmvAr5pCnj3P1ffBW4nRX4nMKsrQES6K04+l8utAN7GUH0X6Eii+vdjIu8CrRUj7rpuTUi/EySbKlX1Op/KzwOPgR4ROexlN/AQ+J24AMuy2j1fX4zAM782UEo1e3eBUgK2LhnxbDa7BlA+Vbwe1BIDl0pMof1L0S47gCzw3adyz8P6eWCkCE5fLKTT6fQWEbkITAbYeHNRpkcmk9kATMd6kDmOUw/c8DZi0MkxprG69xZhfQJqI4H19/evBt5EGH2nNQR0FcE7EBXsacTZfURjou0tgjcchXynxuFzSGMFOorg/QHawgK91DBgvRoCTpTAHQlrxuY0VmBUQ8CgD25nUJA2Tf8yq5RqiUC+Cfjld73MZDLrg1oDXRM2FsMILZbjwMogFiEOJ+mEeHq5EAL3CbCsXDUmYhIxCmws0zbDEXAHylWkN0ZPP+NZ7ZPAPm9UdgFDZXreL+fT6fT2cv5+MubLSdx5pZyB2wZ8NljAhyAudDPw2lABM4HvuiJy1LsWTi3Mem+jXxWR45Zl7bJtex1Ql8/nlwNrLctqF5FjwGWgsAQCZqOelrURjdoeIB/gHhw0C4k8eimlWoA7wF9NATeTfvg9CHzUELDbhL+DBuBFBPKDJv2f1QEPwnx6OI5Tb9QPpveqdz7ABh8yjvyi1WgFBrzP72lvXBeAW0b0fDWqUY1qlIx/aSF4DQR3KywAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-ae.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACZUlEQVRo3mNgGAWjgHqgoaHh/1DAox4Y9cCoB0Y9MOqBQeGBPiCWQMP3hpIHUrDonzSUPKCFRb/bUPHAw////zNC9SjB9E+aNIkdyP8yFDwwA0lPY0tLizwSf/2g90BjY6M/kp4DQH4yjA9iE2nONyDeAs033UC8Eog/0sMDvzo7O3mRksx3IF4OM6O1tVWSCDOmtLe3C6Lb39HRwQ+UW0hrD+yFqW9qarKFir2E5QmoOafxxF45viY9yBygunW09EAJkvoaJHE9JPEGHHovoHlUA+iheiDdBMxH0kjiWjTzADDUtZHU70KSK0ISN8GhPwIpr/gC+T+R5G4CMQuSGdtp4YFHSMUnC1qRuQ3JHCYgfo6m9x7MgVD5p1jMd0EyI4MWHpiFpNYCTe7LzJkzWZHk56DJdyLJSQHxCyw4AUmNE9U9AIz2QCS1ZkDcgYYlkOQD0PRGktI/ByZVS2p74DcQ85EwQMCDnMaBHnAmcYDBhdoe2E/GKMdObB4ABQQouWDDQHWpQFwIZG+ktgfKkNSJALEBNoxcTAIdkoukPwotD9C3KQFMk7pI6ibjUYtcHyghiXehVVY36emBJ2gV0FVia1qg2DWYGWillB89PTCbhLbOATQzu7AlI6hcEBCfBOK/UHkQfQqIV1HbA0FIaqJIKa2AbDskubOgSgzdXmijUAxEYyuCKfUAuoPmEhHNyB4G1djvkeQmYPMEmjuo6gH0JHGfCA/MRtOzDE1+D6i9hJyvYADUqAPKzRwqwyr3oXUFqOF2gMjAGR0XGvXAqAdGPTDqgVEPjHpg1AM08cAoGAWkAwAtvCVkdSWMhQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-ai.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB2UlEQVRo3u2YT0QEURzHt1TEWnurUx0iEh1Lh6RLpUPEHvYW0bVDonTI973ZKR0a3TKWiKRzumT7o1N0Lf2XyuoQ/TnFrs10mcfPo9lZpXnL78eP8Xvf7298zMzvjReLcXD8XQDwqiEZgAEYgAEYwDiABwB3JN9C+mwpZQ+AOQBfUQI0a31SITw7micbFcCz53k1Wp8EgGIZn6t5ZFQA68pPQQDkyvjeLcvq8LUtAJ6iAkgR/wi5ngrhLQG4BFCI6iMuAUj63jiAA9XLsqy2aphCx8Q7CKDgOE4jqV0EePMAhkme/juAEGKWeBcBeFLKflJbDvBfaffejeIJdBHviV9bUDUpZZ/JAHk1dfz3v+TX90m/OgCvpgJklU8IMUTqnwAaSM9NIwGEEGPEt0TXpJS9ZC1tIkARQIL4NgCcqxRCjJO1JHm9jAE4rPCw4Mg0gJkKAaaNApBSdiqP4ziN/hTSk37I7SYBPGo/bTc/6Fa13temAKwpfSaTaQ3QnWm9V0wBGCX6iSCtbdtNZK8YMAGgACBO9Ftl9GmldV23HsBH1AA5oq0F8BJ2t/Y921EDzJMp0x1Cf08nkxBikqzd+pucyj0+VmEABmAABmAABmAABvgFAAdH5fENv9iNYdrbx8sAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-angular.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC6klEQVRo3u1ZS2hTQRSN9VcRMbZLrbo1IMZNcdGNG+vOLIq4UBBEybILUTdifiYvBkMJomajoCAhqyKCpfuKK+lG243gD92ILRWU1k88F+aV6dC087mTPiEDh5cZ5p57L3lzz8ybWIy5FQqFvZlM5hbwkZ7Uj/0PDcEmgAfAEtCSsCTGE1ENfAh4qgTdDjRvKApB92Sz2VN4TmkGrmJK2Pd0NPBarbYdji/A8axl4CpmiY94vQYeBMFuOLoKh1+YAlfxmfjJj6+KsmAR1G0LmwWWyrVGRdHFDL3fwGtLe7vKZVhR1kKa+PBaXGTg0q9cmDjP4PBbpVLZSXzVanUH+l8ZOOd1E5hmcBYonDcZOKd1Exh3dPQbC3BglULwy5F3XDeBMUdHjTa8Txx5x3QTGHV0dCzkqtfrWyXeQUfeUd0EUg5OXipcd1qt1iap/8KBO6WbQNLByZmQJ5fLHRFjgxL3aQfupG4CcUsHn5RX5q4YfyiNbQE+WPLHTcTMRguuhfblcnkX+t/F+M9SqbRH4r7iTQMctOBHsVjsl+wvtVuA+N1H871ogIMW3A9tadGi/0rdMiuL+Z4XDXDQgsR65RJ7ouPhnHw+f8iLBlhqwYRsK4IbUYGqdFjx8ZxdAyy14KTNdh3/yDC7BlhowYztmVaslTesGmChBWnJZhtwfj0oWpFm1wADLVje84v5I6avA9kTD6sGGGiBuuef0EzgmWIXsGqAphas2POjvx/4q5nAH2CfdFYYID42DdDUgoZSUW6Y1HXMv674arBpgKYWLO/5m83mZvTfGwrTO7l6ER+bBjCdCziRsk0gGZEEkrYJxCOSQDxm22B8gukzi9VnFPLP9Rn9nMNJyhRUEM6yf3YHYS9wGZjzFPic4O/1fbFBJ6oKsMgU+KLg6+v0Dc1B4LFD4KTcj6DEBzb0qgkHlaMIZNIw+Emyi9pFn07F4qksni/+VqtYfiqLx0TCivW2I5Wl27qt27ptQ9s/jQvHQteHMB8AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-applescript.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACZklEQVRo3u2ZTWgTQRSAU01RUPBiFcGiB1HB4rEHEfXgwZt4UAqKiOC5IiIqCt/bzG6DoRUCgqsXwXowFikI/hQCIpqLSEURvZSCrT8HBaFK1dqOly2Ekg3VmexkIQ/eKYR83/y8ybzJZBwEsAY4CzwDvmXSEmEYtovIReAHoKOcTgV8Pp9fBTypAp/Pl00PDywHntaA10B/GgQuxcDPAVubHX4jMBMjcDUNo5+LgR8FVqZB4HkN+HGlVGcqqg8wtQD+nu/7a1NT+4FPwGvgGrBzwWfZqEItSQxIa90G7ACuAGXgPfAZqAADwC6tdVuMzGrgCDAITFbNygzwDrgMbG/kaO4DXsRsyur8AFwXkQNAF3A6OsRmF/FdDYwopTbYBM8CfYv8cVs5JSL7bS2ZoYTh5/MXsNd09M84gtfAtIicMIHv/od1azvHPM/bZjr6jxzBfwe6TOE3O1w6x4w3r4iccwQ/AWRtlM6HjgQu2Kr9k44Eum0J/HEh4Pv+OlsCTjZwEAQdtgS+uhAwrv1VAm8czcJRWwJlRwLDtgRuOBKYs7KMgOMOT+JKGIbtRgJKqU6HAhq4aXwiA28dS9w3KqsObmG18ouI9Jp01WabQOKxySwMN4FAz38LeJ632zH8aKlUWmq6me84FNhj40xYH13zkoa/a7M3dDJh+J/AJtstxVtJCYjI4UY9FVUSEFCNfiIdbyD8UMO71blcbgvwqt7pCQyKSK+IHAR6gPPAA+B3vaZuoVBYkUibvVgsLgM8YCw6rSeA28Chev8kgyDoAE4BI8DH6OZXjtruyb0TtKIVrWiFlfgLlZnp0BHQNaIAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-archive.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA/0lEQVRo3u3ZQQ6CMBAFUFwoZ9CVp9OVd/hdcIF2xWU4gAnxCl6BlWFVN5oYI0IJMwzh/6Q7UvpaJiHTLOuI9z4HEAA0AKLQuAM4ZhJ5LT4qDBmE8M7LIz5fIPQ8RBHSAHGEBkAUMXZBZj4nTYAIQhswOUKrBsQQcwG6EIsC/EIsogYmnYeApQGmrgECVgdgERPAIiZgPkBZltuvv8cWQO2cO8cYN6YBRVHsAdR/WiYVgINJAIAdgNuAvk815iTEAc65ywDke56TxRO4JgBqi4BHAqC1CEjqgRJAgHIIIICAlQM0L/n6RjMGEAwBQjJA6aK7d+cBBO99njEMw5jME9U6jDH5yLqjAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-arduino.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACi0lEQVRo3u1Xv0tcQRA2kQipAkbtEovEwlQSLdXOxsAVIsQfKURShKRIFBtT3S+OS4pL7O5ARAM2JwHxHzBooQkiIUIgRbpUAcvTQrnzmzDCMsy7t/feXRGYDz7u3e7sN7P7ZnfntbUZDAaDwWAwGAz/BXK53N1kMjmcSqWe4HcU7GmCZjdpseYw+Whq0OVyuR3Cc+A3sArWBE/AebLz1YT9TfAZ+F3Rq7KvuUY0VWQymT4IHStONP7CKk57BD8O/vDUPKYYIgWPwQPgqacjl+tgh9Sr1Wo30P4ugh7FMNBo8F3gHyF0zsHNgwnwOfgJrChO99xcLhQKt9H2WbEjzU3WSrD2Ore7dhRLVyMTWBMCX7PZbK9mi/Z76N9RgtsvlUq3ON+3lf5dpMeDAM1e8ins17yC54AunYG/8/n8nbBxyP+nysoVwRVlk76hlKqnRz7JtzPukmLzWf1F4XDS981hEmOwP6uX07B5rfikviOlfVKMX/SZwJYzoEJpIF7tkOAjZRIXARNIilOunzWo7yc/37/u5xR099iWzwQO3DNe9BWVoLSVW1LsPih2R4pdUdicOH0HsSaA1Z3lSbh8q2h8VAJbUlJu2VmUv/w8E3cCgSnkeYKlAtLngtIrYIz6JqOmUJxNvBByKZ1pk0D7C3CiKZs4yjFKRyIHL2ul90x5eU2FxRH5GG30IkPfQ/CLstqrjs2q0r8TFFCsiyyklNgQpcSmcnn9O3HoBhbVp7axK1yOuKXERuxSIkYxR6n3ss4eeSXSszXFXMRyehd8HKaZTqcHA1KuueW05wcN/T+k1x+hXE/w2GrLPmiCPinpowQrOYLfzriapMFa4y35pDQYDAaDwWAwGFqGKxPlZlbxorHXAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-audio.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADMElEQVRo3u2ZOWgUURjHk2g0HmihNmojWnpLUBQ8wEKLKGqh0cJGBPEAg2mM4O97uywLgQiLzTRaaBXFCyw8cmirYgqxEW1EUTzwDGY9xmYCHx+zk5nslYX9YJr3vTfv/5/3vnMaGupSl9oV4AzwCxgA1tcigRHAV88tYGHVAPX09EwTkXbnXGtMAtcMAR/4JCI7q/E1ZwIPAhB/gdUx1kwWkQPAC0tERLqqBX70OZRgfYuInA25UuL7fmNZwXd3d88IAR9JoLe3dxIwxY6LyBbguzmJo+UGPxgCviAB59wy4D0wDOQymcw8o18LfFbvyce1qfGAHygAviABIBtitLvMnOXmJF4CLaW889OB/gjwUQQ2AvmQ+afMdTpirlJnJcFH2kAqlVoMXA9Zc1jt02T2+ZrJZOaUAnxfDPCxvBCwz5xG3jm3ShFdZDxTR+QL0+n0AhHpDEJ82PMwJvhQAsAs6xaBbQbkY6BJ6a8o3fNItwo8SwAwEQHgUjD+xDm3wehOm/u+R9lCm3nv6igCfjkIZLPZ2Ub3W3seYDLwVOkHRnWe5zUDH5TuWMUJ+L7fGGK033XiJiLtSvcPmKtwXVC6yxUnoKJvB/BHzTlv0hFt0DsUueNq/GlVCKg9UmrOW6MbCvP7wA615nVVCTjnWs28WWr/22o8Y4Lf6PhwzRFwzm2aMASAtJrzpmaukDLiv2pOrpARi0ib0p2oqhEHbvSG0X9Lp9ML1N77I9zoxaq60ZBAltdfOAhWQ0rfpzBNSRLIKpFKPALWmdS5y6zdXeD+j5lKzB8jmRssdTInIttNAHtkkrmrsZO5OG0T4E6p0umgI/FbrRlxzq0wdUP8dDoBibvFEACWBE2sgmuCgkY3C74UXdAkJFEoDmwOKylF5KQ5naNlKSkTkIhb1H/UiVswZyXwo2xFvSFxLyGBpcC7AOA57e8D/Xrgi7GL0rdVYpCIbGx5ntccQm4r8LNijS1T7N8bb2sx+AjpENug7K1FQ+J+kuau53nNInIQeBVygqcr3qHO5XJTRWSvc25NTNI3J0x7vUQ/OG5W9QdHEb+Y+mvyF1Nd6lKXutSlLsXKf90Lalj4Kxq2AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-babel.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD30lEQVRo3u2Za0hUQRTHN+lpIBRCQUb0oYJI0xIpKgMpij4UgSH0wV4EBkEEFfTedXe1Wlls6bV96YNFWJBmlmZBGdHTioyKoKTQCorKyl5qbf9TZ2E43Lt7N9a5LjnwYy93Z+b+Z+bcM+fMdTj6yn9YnE7nwFAo1C8hxHq93hEQvBB4wAXwAYTAT9AKasBakNqbZngS2A1aWGw03oAv4LDb7Z5gi2iPxzPK5XJthIj7FkWr0KrsBfPBLlCo1Z7ZPLr+QbiE+jgFusE0HeKzwQMLwo4UFxfPxgoV4DofZGLFxuBeOq63gQ6l7nf+re1p8UXiwWa8Av0j9YWBZDn/Fqp/HdwDn3t6AEvBV0XoHeCSA8Cs77TY30SlXTuZU08JT+IXLaTM2Bz+75wYQCcYaaHPKSAo2rbEXXxpaekwdHwibKvsdZIUIdJtHrM4KSUGplcRV/EQuwSdXgSVYAstubDjqWS3vDmFRUT1JGz/3+QAcH9G3MT7fL6h6HQHbU5mIQCb1S9FxG0LMz+TNzE5+01xN59IsQv9h4c+EyIKo4jPY38vxb8A47XuwjCveXjoW0XEw0iuE/+tNDIbakc7uh2xzxlwV3Gd6yPs2kGT/YK82XDt4hF8jcWDXwpzyFHrBAKBQRjUYty/ZSCc3hs3SLYr8vQpITJxU/EwkynCFP9L9tgZNieD9+CdIqiK34kGC2EG1bkEUmwZAISuNvEisUahdbZkaCax/w8Lgh8b3CvSLT7XglBKG+uwUqvAXPL9+N3MptMpItYG3QM4GUH4FQjdDp8+2qRtCocd4fp0fVCn+DSRgVFY7WdXmWqhfSqvjjroap0D8IqHB2Js7zJYtTwt4mlTEgFYF6WHVttjb5ilpI1hrul0ncvEw4/G0LZAZHF/jlRimYB4mE+TiNvTrUSyJmbTSSuiTTweNl0IOButjd/vH6JkcSofw6moztmvFSJyo9TPAc0G4ttAhm7x2VZfPM7gyg1cZThsTrMr5icB9RzzLzKptwA8V08XlOvyYDA4QLt4TtjDIl6DRzL4Ql4wThkk8YkPq+r5Ot/OsLlGiW06MPsrRFjgE0HcebCfQ+1m7TmuwaGTasOtnBpmgH2crNDAnvCxSwnXoQztEHkhu8/6T4sBXAU3+LqbhVfwKlTySgTNAjndtp8lxLezWdCMH4cpreOUsY3v15q93HbNfrV0nXz6AJ2urfzJqKxXzLaB+Ew2kafgMn8HGMzH6nVgg225rMUBVPFh1XK2c/LtbnKpjkQoMJE19MENog+AxoT5LGoUfSbMrBusAiXiZY5ELRC/Kdr3rb7SVxK8/AbffFOVpctZjAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-binary.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAuElEQVRo3u3ZsQ2AIBSEYUrHcFSGYEBncAGlsLCQAOI9wPyXXEciHwoxwblEvPdLbIjdYw9Rt9jVKXJN/jCoBiFeeT3i/gDRG/ZShBogR1gApAgrgAxhCZAgrAGfI1KAkmOxZLwc0QuQQkwFeEJIALV7pnZCAAAAAKA7RhVgAFMALAPgl4CW73joTQygxx5oGQMAAAAA/I0C4HcawOAAy0u+XPc3gDAQILwBWFx0Z1f+msPiCCFkyJwvRh5RJIlrGAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-blade.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEF0lEQVRo3u1YWWwNURiuInYaitiKpCixFEnFkthiX14sD5YEsTZBRJBQ0va21Wq0cVNdLA+KhvJgfdCmlqJCpJQI4YGS2lrUvrbX9yffJJPRzpzeezUT5iRfZu6d//zLOedfzh8Q4AxnOOP/GB6Pp4EtFXO5XD2jo6MnAvOANUAskA4cBQqAEqAM+C6/c3NzG9rKACrmIT4Dj4HrwGlgP7A9JiZmHZ67SRNpNwOKRDEoudiCrhFwH3gLBNvGACg+iyt7U8HYyaTda6cdCAQecRemKNCfBaqBCDsZsZIre0WBtjfwA7ghxtvFgKbAKxoxRoE+hTu2zE6+sJUG5FvRJiYmtgHda6ACaPuXFzcoISGhnQphW+CTGBEbGztMgX45DU73k6KtIXc4nkuBVCCP+UdkfMcCj1VhsosTTik6/22gChjio/KHdbnoJ3APOAKltwAz5ClHPC4urpspIxB0J4NqrMYgK8GgGU2hRb6UGqwEJLKlud3uJrXQHJJQL/5qxSyHSuUqCj9G+kU+7oJbKgGUNn1r+d4cuANkW63qYCokRyNMQXAP4CujWJCPkVCOTonJLoQClVLaWDHLpxEHFIXHkd7t4y6EszZzm9DMlDwEI8abhdQJmkNJtWolODk5uQUjxi9goI9GbKTs6RZ5qMJUNxDcIqNMxTyykPSFfihtLgDlQGf5LyUlpRnex7HULwS+UVaxGaN5JPqmMbK68IDuGucs8NGI/ixXZBEvG0p+eb8ERMFfh1qVz084KVVRcATD4fOkpKRWqgoj07ZnVSx5qJgBxKPDXR6bqXJc61JerNUuOiJE0YhsztlpQhMiuwTsAR4YlP0InOElKo0LMtWrraRzviHjBEUDOlMJSYj9+F8YS4+DQKlBYe1IbMORGCk7r/GS6yt+XxV/QJLt4u15dFHQe5U4TyfcxzmluipXQzWPyQ6s8iRJUArVwTsx0qv7OCZ2YKKS8nmr8XtWVlZjKcLwbRMvO5UGhQUPgQxgtlJl+acOc8nH5e0uZJJBRXx8fEeGNBnn2QgwKlzGjoa8P7WsX9R0kAZDlWkCM5kcWkNk0EPuBcfBfBWSSx/dUSrm9yhfDaA/isO/kFPhjREZOoU/yHGBwusl/ddWicrtTteu6eqHXQhnXsrzqvrFxBFy2dFHCoU5J2hEjh8MCGFiE36b66vz14tZVYSOqut8+Fwn5qMiRjDtFLyst3an1gRgaRCoQB/MTslFg+/Je4E04eqS6f1yMaejSyheYUKzBDjHJKgPEiWYt8HrZOanrsdqKlOuJUQ8W+L/+XIHNxRsgmdAEnxugF16T1pv1cNVlqvoF4PSkgT3SwfCNk0zwy5MqyGHiIOfxLc5/kh49bETGYzlcjGJ9Ka0cIYznOEMZzjjnxm/Adij2+QtAbx4AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-bower.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEaUlEQVRo3u1ZaWxMURQuBrXFGpqKvYoIEgmChKCWHxL9JSQUkdSWaO0RJdN9qjGoENVqE0tCE8TSqjbSH7ZSfhSNohpCI6LUVi1a4ztxXnLdvvfmvb43bSVzky9v5s65955z3z3fOedOQIC/+VvrNKfTORzYCpwDSoB3QCPwCbgJRAOBbU3p9rGxsavxLAU8BlAFrPd4PO2MrkGyGDM0Li5uKjApJSWlhy3KQ/G5mPihQcVlHPU2P5QdB7ksoFoYdxvoannXgb3NVFzEfp0d3w78kuTpKAZbUj41NbUbJrlgg/IKFkub0x24qiG7x46dzzeoWANwA8gF3uvIlYv+gO+ZWrIJCQmDrBoQb1D5x/Hx8SOVcWlpaZ3Rd1BHPsLtdneBTy3SkXlp1WHnY5LfBpSvJ8aAAaPw3AxEAit5AwpkpYBC4C1QB3zRmfeW1aNTZnD3r/AYYosQ/nwKGzALWCrJTpMYZ5+OEZlWDFhmwimzeQwFsR/AR+qH8uvwnCfIPVdbKzExcQB+OyPPS5RtxYByEwaU8Ri30FdDDggldgt9hfRWiIXw3MC0TEfqKZAjBcbrVpQfbZYaWaH2rNw2+MMwYAQZIsiV5OTkdED/GJLB90qN+cigICsGRDeD28nZM3CuZ+I5EQpuUqFSotnDHJxyIbOK8ybx9+zk5OTeVqnzso1BS4u1evFaEUAMjFluOeIKBpT62AAPUyix3CXyHTqCTNshgMOqAVU+VPwucBYo5ligFmcoH3oGnATWAuPJv8wYUO8j5YtdLldPaa1AiuB4hjHtHgPuq+hAfnOR40onbwZ89YHy30GrQwxsngMI5RSD0upvHLlFWq8EWUzQm+SFDwxwqqzTh48HsV4FcA3YCIRDwSl4DlZ2m9PtcGG+e3oG3LFZ+SJK3IwcX7ylgZBfgDewk8vUV1zcPOK8qlaZV7NKY+exS/k8o8orOy2XnklJSX25EjwusZhDy4BIGxT/gEV3eHW4f5PHJkzDUXsOR26xzDxkNJWo0GIUziRLhNdaxby+XWYbtZ2WlHdopPRR0rq1XGd4ZaJKznGi2KAl+LyGch26SpHlqYDxtsuUBynKK581yteFlHbz2p/E2w2tcWqW7+JBlBr3tyPC0+Lp6ekdpY0KFfs4tVB7440UJ8wEs2BOrmhwrpk7Ha1GrIG5nlChDmVWOP+2z1zQPJCy0y+c+J0gIfKF5qQU2cKEbhtyrBn8Rl3sQ6+4iqMjc4CpknzuPDDZjqQuWORdutMxlZM0ne80z+NqyWvEGOks5jen2GDnV+b4SZcALWIAOR5FUsmIGpzhLUYDFNKC6RKbEI605FsIAt6oBSsgDZitZgz6+9F9qEbKXGe58jJpBBUarzUorpp9pYKv1IvYIRu8ROvggJZsdG45V/dI5zlc7VpEBzQmptX+G2CHzABScb7Hcn+YCQOy2tw/NZyvG6kj8pSCvs01LkJKuHoqYB+g6i6ZUmLC//b/mcNK4PM3f/M3f/M3fzPa/gBqKBbpAbIwRwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-c.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACl0lEQVRo3u2ZPWgUQRTHc0kwUQiCKBEbU1iHoIKNHwRsFLQUEYyCWgh+gIUIKvzecnveyXHogiiKliqrhSJGBG3Eyg+U+IHGEDRGMCAxiqAJScZmDkIwOHM7u7fFPnjl/e//2519M+9NQ0MWWdQ/CoXCEmA7cBl4AnwC/gATwBjwBXgIICLdYRg2pcI4sBK4CUwDyiLfA3uDIGipi3Hf99uBW5am/5UDnuetSdS8iGwCRhyYr+akiBxXSuWSWDI9Do3PzmKsEMBWYDJGACUiJ2Mx73neBl1VVMw5Dax1ar5UKrUBXxMwX813QKvLpVOowcQ48Ay4CzwCfln+/ogT8/l8frnl0hkDDpVKpbaZOpVKZb6IHLQA6QcaXTz9KxbmPwMr/qPXBfww1NsY1XwzMGpayz3PW2W4j+wy1CxHrTzrLJ7+RVPdMAybgGEDzQdR30DRAqDTUvsU8ALoA97oyvMBGNQHwWHgVVSAp6ZrP5FjQA0A3w0BbqfRfLPF8jmbRoBWCwAvdQBKqZxFk5JPZZuod1UTgHNpBRgyBLifVoDXhgCjqWnSZwHcsPiQ11tqHwUuAWXgBHBARHaKyBZ9AugEFkftffdZAFwz1Q2CoAX4aaB5Ieob6LDppEynC8BmQ80zLpZRnwXEoO/77Qbl+Z5hf3zYBcA2y06qH+iaQ6vRprtzMi/Sf/rSEmIKCIEdwGo9vesBHltoDDmrbHqQpZJMEdnvuqSWEwT46Hxmqruo3gTMj8c2Ky0WiwuB5zGanwJ2x707LwCux2B+RES6kzxqHwN+OzLfCyyrx1lpKXC6hqlbNe8kfjcwB8gifb10Hnirr5VmGp0AvgEDwFUR2QN0pPrOTCmV05VrXnaDmEUWWWSRRZzxF/EjQdnmctfgAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-cad.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACrklEQVRo3u2ZX0hTURzHl5FgTxH0GghB5kshtBbCCBTxwUBQopdiPVQSJb74VnC34SCQPYgQo1DQgbEg6kELxR6S/mBREAViIkUvPUWEEWG0vj/5Do6Xy9l2q+0cOD/4cO7u7jm/73c7957f2SKR/xSe5+0Fy+AeaIzYFBT/ChTJ/Vwut8sW8bsp/iv4DNbBJrhrhYFMJrMPYpdSqdQxtC9BPplM9qGdLxaLO2ybSlsGIraGM+AMOAPedTBgpXg+RmMCjg/b+On/UlbiFavES9ngM7BmxSJG4RfAB0V8iTeg30gjAcLnwE1wi9wAz4wwguQnwFAJ1DnDPuFRTd9un5FBdaya3OxINB4wPbTCyxhRuVwPA16YcWQKoeu0CQaERyBehfBe8Lou3wDm6XEkmpCEmP9XJClYLWckQPgL9D+PNsPX0rbW6kZOMOkeeV0oFHbi+KzPiEyPPJlUhYMeZawYz8dq+STaZqAUAUZUtgk30oDPiLoSv9eMZZ6BamohYw3IooT334FZ0GKdgUo3NM5AtYFndweS3WbSq2B/WAOcZmMcS9oj9ViJO8MakO2mCaXEpTAGcL4BjJpSCz0BXZUYoPDTfEL921pIFiDM8XPZbLbJN+9PUmQPN+uJEqxn3gYZUQ0ECF/iqp1QaGF99RB52lUNokmuEY26TzfOwaPK5uUpzz1Pp9OHNIXaKZ+RO+AL+AhmfMI7y2hY4bUPYOQoz0d5Lq4zkAQb4h7tAjuIqN4qSmXViIpWeEApkuBP81v/L4gRtN+1+w8m2WSndXydZ+SrD7lZUUuJ1bB7bWi4iP6fwG9qe6wzsMGEP0AKHKj370KiAYyAnxzrm+7iNji+hnaRJqbCJsb9clBuSgHHzX9hIE8ti9TWVmnHRhP+nDNFhwsXLly4cOEiKP4Af56PLJ598t0AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-cf.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACbElEQVRo3u2ZPWgUQRTHz/PEIH5jISpiIaKChckpQRAUBA3RRiyCaCHWCmKRKvp7cwd3pxZ6pMj51VjlCIlgaStiZSNYKSKiMYUmEkw0Ca7NVCE3M7s7niPug9f+3+8/uzvvzWwul0UW/0cA60XkAjAGvAVmgehfAO8GngA/gWhxBgteqVQ2AA3g11LgQRsADgITJvBgDQBFYMoFPjgDSqn9wFdX+KAM1Gq1NcC7OPBBGQDuOUK/EpEB4IRSqisIeBE56gD+GTgT6q7zwgL/BdgZJLyInLLAzwFHQu60z00GRORSyPCdltV/3Ww2l4ds4IHFwOlUBer1+krgmIj0A4PAXWDIkPkY8BuBGcu7v1SNoov4JuAG8C1mYynE+Hivxm1aOvtswheB6YTiTgaiKFoGvPFqACjoVyRKkQXH1T+eokZLAw9TwjsbAEa9GgDOeYB3MgBsAea9GQA6gE9tNHAtZY2+JKs/CQwDd/R22irzFvhVwEdDnSmL/iDQuVh0xAI/BKz21Liw1LqZRPS9QfCpr65bLpe3At8NtRaA7UkMmD6osx7HhkeW1R9OKmwSPekJ/pDtegToTio+aRC95QF+LzBugX+cpsAzg/CsUupwQt28Hkts89Q0sC3Niei6pcA8cF9EevT8XmyVSqkDItILlFxnHRG5kvYR79A7QPQX8qWXA4u+g2w3/Diwy8sWV61W1+kr63bBT5RKpT2+j3e7LW3eV35QSu37U2fUzZZdKU0uALd9jSUto9ForAAue3waP4Cxtl8DAh36l86IvnSdcwSe0VvoqIicB9aGdA2Sz2WRRRZZZJFFQPEbw2jxKjJYT80AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-circleci.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADXUlEQVRo3u2ZS0gVYRTHtcIeJlGWPRTLHtse9ICIoF1FmwqSiLAW5aqIRHpA1O+bmTv3Xi9oWOSikGgTCBYUFCVEtTAKSsW0oihqYbXoZWSW2rT5Agln5vvmztwb4YGzm3PO/5zvfOfxTU5OCJRKpfKBDUAN0AJ0AD3AT2AI+AQ8BpqFEAdM0yzLyTY5jpMrQV+TQB1NfgzEgNKMgwcqgO4AoEfifqAOmB45cNM0FwC3QgL+N/cKIQ47jpMbCXghxF6gLyLww/kyMDnslCEDwIdzJzA/LPBnMgz+D79L+4ILIY5mCfwf7gicTkKI9bKGO1nmK8AYLfCxWGw28DENo5+A+8AN4DbwKk0nqnXzvjGAkc9AClg6UikEioBKmRZBAjJNCbxhGMsCpM45VQOyg1cEOOE61ehf11A6IITYFbAplgFPNWz98J2hgBLN6O9Ip8rJu/Zaw95xv8pzWEPZyZD6zCpgUNFmu5+yTkVFb1OpVL5Kvis6cUo1cJ5pBLQCAzIibtwP7PHQMQE4AjwDfgG9wGXDMJa7yViWVaxxClWRTavxeHwq8NDtwgPlHo7fVHSgOco94aKP8T7Lsua6yB5SdKArKvAlMmX8ANguBWSTalOLyoHNigBaXBroakX5oagWni1pOrBWdXOL6gRKFQHEXeS3K8p3R3mJm3yMfwfmucimFB246Qqgvr5+PDDLh4vc5G3bLgTaXQwPAts9nFedixq9IvhEUQluOmpraycCx4Dn8ttvwBXDMFZ62F2nMcJUejnQpjoZAov9UqqpqWms3zghx+tWVQcsyyr2qiQHNSLxCBgXwr2p1rDZ5jfezpQtX1XhBSAvDfBbNWYgRwhxQkXpVc1N6a5t24UB+sZ+zWD1KtkBVgRYKd8A+4BJCivrEo3BbTjHdI72bMDXgw9AjRBiI7DQtu0ZQIlhGGuAKuBOQL1flJd6Wc9nyJcA5x/h3UFmm22K02XUfD6dEncoy+C7VO6VnxMNWQQ/J4wBbQyQyDD4B0FKs58jOzL0g+NSMpksiGRcls+O9yIC/t5r6Q97+9oGvAgJ+DegIfSUUUipPKAcaJaLii7wp0KIA4lEYkrW/xknk8kCuRLGgUuygnyVL9A9wEv5v+A0sNM0zUU5ozRKozRK/wX9Bi05nuuCAeLgAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-clojure.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE2ElEQVRo3u1ZaUhVURA2q5ftVmamWbSXtEdUaFRWULRARBH9iOhPP4LKkhYicH+aJWUg2optlgWtFCWl0EJC2U5lC7Zo+yqv1bRvYG6cHveec97zLQRe+HiX++acMzN3zsx35gYEeOCqq6trlJSUNCIhIWE5sBe4AbwGvgHfgXfALaAgMTFxDX5jCgsLGwf4+0pJSekGZdYDFUCdi3gF5CQnJ/f3ueJYtDsWzwd+uaG4GU4Ag7yuOBZpghBYgV+HhxQXUQNkAC28onxaWloHTF7iBcWdQXulh6c93wd46APlDbynje6peO+Nyd76UHkD1chsIz0RNveBIsT+YmAq7ocQcD+LU2KZyeIfgCu8OY8Dl4A3bhjxEehXn9CJBbpq1IBoyG2DQevwG0XPzOT4bcazU3SNuJmVldXcL3UiOzu7WUZGRmtng6BUIDAPqNI0Yku9lSEvcLWdQaGE+4GkiEVxKwKeCQpQNb4K2MXCZbfb23GIqQz47XadoAUxeB8rIU56DggyCxWOfZlCB2FoBMkTpaDw0zDirEuK5+XlNcWgXKDWZLInQBuhKlPuthv8ht+CQyNVxgohdURlBN76UC3lKW4x4IxkorFCin0h/JcnxPlqDa/+ACaSfHp6elvcP1XI52oxS4U3NhkblD3v/P80NiCY2agyVdIbozHYWzMVsl8Amyp1LpRM8NLgKhQyFjKlRtbB/R7NLHNScF6ZIozGqEKnWjJBKisWxq/fSi6G5cbp5nvKcPwWFilkk2Ten6NYZDjLxSsWOSpkmNeaRuTy3KEKuWMyAw5IBjqMLMMpVLZILTZ4X5bdrmlAhaDHA4ncHZkBT2QlXZB7r6HQAg6J6S7QhmCe/5hE5qsZVTEU+yAZWGwcanToMO0nlm9Bi2oaMIDH7FDI2awM+CQZVMIyNpUixFLJS6mpqZ14zFHNjTxYI+wcshB6qRN7THOl3ocRE3C/jOXn6xgA+t6R5WV1qFJmwHVF1bSxXLHM+yxz2MgYmZmZLXH/WWHAPUGPuxK52zIDCnWKiIQmvONaEs6H9C9C4cvRTKPtLfiXgV0yA1YqFtnMZC3CoqWymjPPOuHZXJ57gEwxOGe0ZrjFWhpAhUqVXYzTEXEi52Mke5+y1HPh+WnBQTst5j0syFyWrH9IxYMCVV02eDdOSI9iwUln708x8e5AHhNuQrOridVqkLkqI6tJL0yySsUeMVFnISzosF6DsIq0eDP/eM4pTKnzEM3PQyS04xrQxZVOhIoGlxoHGjrEA1mCgkUyssaMcwmzzhhhXIHJuHJKxS536zSPeBeBViZjr1hRETrlWawXxmvuBjYSDQGGmZ25dbvOkZwCVUZQqzHUKQTjuG0iZpyfZAD+G++zlogGL/97SuJ9E+TcxaCeEp+PbT7v6XBGKnaBSVZQ987YzBZzhnB4XGDme4DeGDCJ2ibIRj2pD8vtm7l86tvpdseasg0GP3KjJVjJ4UWVfT9wSsHxLd+udidC8TGj0g/N3R/SqutiOEX52IifCKvZnt4TobJekQdRbpy9vbKx4Zm1io5EfbDLrLZ44+sk1YmtTJk9ofh5YLI/Um0vYIOiGSDbpPRNeZjfvxczvxnC4ZXPeb6Km2T0PfgxVWJKqZBZit9RZp3thqvhargarv/v+gMGj586LcmLowAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-cmake.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABsUlEQVRo3u2ZS0oDQRBAY9yJBxAxILj17z1caUQQvIF4hNedEd2IW8GF+yh4CXcqiAp+goIeQV2K7SZCCEl3zeQz1TAFtZsuut6ja6aZUqmIIooYaADT0W7eWjsH3DrnRmKlfw44YC1W+r/NBu6is9BC30VnoY2+i85CB/rxWOhCPx4LHvr6LQTo67cgoK/XgpD+f96rs5CCvgOcMWY9Vvr6LKSlr8qCgP6NagsB+l9JklSAR5UWBPR3m01alRYC9K/r9fpoS6O6zkKA/o+1dqWt2SdVFoAzz4aOOjxfU2MBmPXQ/wDGO6yZD4zVh6FZCNBf9ax7DjRRzZv+RWBtkrsFD/1PYCpw8BcEb+hqXvR3hDVecrPgoX8FlIU19nKx4KH/Y61dSlFnUdBA/y146B9mqNUYqgUP/e9arTaTod7+UC0E5r5rfm0eG2M2gUlBvWXhnaE66MnTLRvACbCVJEmlS91XiQXpcOiFviTfgFNjzPb//wLgQHhr2xg2fUm+A5fCZ7Nb6BP9njOThQHSz5LpLWihn8mCMvrpLWijn8qCUvpyC8AYMKE4y6Uiiuhf/AGm7D3dUnZQ+gAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-coffeescript.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEPklEQVRo3u1ZaUhUURS2ssmsyKKCNooWowILqaSyEjGKVqOdxEqKyn5FUf1ocWbUUYammggaItrEzIp+ROSfwCCLtNQWCFuRUltxsrRNnb4TZ+BymeXOOPNGcC58vDfv3Xvfd+5Z7j1nIiLCrQu1rKysSCCKYLVae4WcUE5OzlC9Xr8U2AVSixwORzeZMN6txbUIeAu0Aw4BH4FCg8GQoClxIooPnwT+AJVAKVAPGJx9QHwBfj+TCBPagNfAS+Cn8zktgpamMJo/nCgJFZ2bmzsY10sS6fckHJCSn5/fT5hHB+LbBMGGBZQoVDvbZrP1dGPLVcBpYAYQBywBjgJNAvF6ENxJ9o77JOCc2WzuI801xtkf35vujgsJTiarRNxoNI7HhGWA1V2f7OzskXhf7cJE/q84iO8jjQhES/ldNd7twHUva+oHP79TXFzcw4vmHyr5C03Gk1Z4ihakHfRZRYKyT2wBxsnOzIsylgl/EgSl+9tApreoxItKPlOpIsA14SOPgORAmiYJ7m21BS5R7CdfmM9jr4NMJtMAdLwpmcVzQA8VzhRNI0hBYgSQxhprFDg8IQ37MlEKcB1okYSheF4LlADHeIXmArHwjeF5eXn9ydE9mF0MkYRZTMR1GfvLeaBcCgLO6FSGPhvdzelSbeJvi8XSmz4EHAfuifHbC34BXzmMNvK+4W1MG+8fZ4EMYIjETefKx2QB0iHxek9HApjSFPRZjfv9HE5JGxXAG8AONLMARPov35MmvwPvOIKRAxeQadI3gVlAXw/fJc2dUYn/CbwaRT7ZXJAaOTwWawMLfkPFhKJZlU57pxh+CEiF3U5QjSD+Ng4iiSC9FVcbUCeYmEHVD8q92PZT4DI+cphNKR4OPMqTCUjHjoHk9ND2PFy3815CJtXgxUdSVAUwKjqqOwHtvFHVccSq59/kzK1+ztusfAzHysxhIhf4SEznnXiODHc7IFxHcEvZDkF6OQZMI3Wzmi3AFY44GXRIE/xEE5BPqJoP2WQ7bzCFbiasFc5MWoCsIUaFfBKvbAsL4OgkuKpCXsfZEg0wKUQjLc1nvordbxYGxfKzlZ1AgGpV2y/hAU3Cs+5ATYgFSFcVwO5MBSXNLA4h+XKlnZ/rNc5BrfKGQftBCMj/RgifrJwliXUbOffk80mDxgIc8DUTeiUMtrp4n6oh+SrlBEYgaJY2jkku+hRpQJ5yiKl+lQox8JswUQ2liGIfLlx9DrIARr/P4og4K6TTIp0g0+SMLYjkyYx1Ha0KLAQ+SBPTuSeTC1qRfDwOhgB7ApIVUQmQd+ZTwEXcH6QqgiDkkWAIQEmRVgXe5CAIUKNZos0F20AmNlS5WKNptYAqxvjo/QCQp6CxLiQlD97BN3Hp0VfilHcUUOE25H83caUhDs6+m3JX4AUn9HYuoTfwswfACT6mDwr/cxhu4RZu4RZuXbr9A1ATMKzWhFauAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-composer.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADb0lEQVRo3u2ZWWgTQRjHY9WIVTxAUd8UEQRLrYg+FBUUvBA0SO2DiCAopQpWEd+k5mgOjQQaqRJUFPFBY5/jLWIt9TYvilasVy0qeEW8tev/k1kYlj3S7Lc5JAM/JtnZ/eb/zX47+82sy5WH4vV660AGHPb7/XOk4z1gpavYSiQSGQ1hETBKCO0CikQ7GAdOgV71vLyWQCAwDR3HfT7fGvk4/i/G8ceod6CuEA4sAz80TrwGLeJ3ixO3fZ3m/yLggbANqK+Ijs/F4/Fh1B6NRkfg/0FwD1RJ1x0DD8A+8EbjxB9R9yWTycHcDjwE9dJoZzSddwI3tSOu5+N3N9ijHpPsVIGn0qgremBgVnA7cBo8A2NAWqfT7lgsNhx1jEYSAhpNbE0Ed4zEC/ZzO7BLvb0mnfZKvw9Z2BsJrpnY6mR1gKY7ixGTIWGVenYURRlEoUhTqM5sJPPSiQf5RRbiX9GUaDIQs9H+OQs775xwoDWLjuuzsFNJ0y3qiyZ2vqrTLltBp9stxD+hEBngoCwB9w1mooXcd2CeyUNMc7gnF7s050NsA67v19hsk/qu5nJis4745xCwlOEON2ns/gInyD74xBVGq3QcqGW8w0bh2WPXuIdyHZDSGL5hck012EjhAbbImafOeWmL5+umXQfaDAxfCofDY+VzRR50RCemifPBYHCCxvYQkR8Zif9gO0RFKmE2QmfFeTXgkcW5lJ3uRL1NZKYVJNDsGrRvsuvAVQtRRxEiM1F/GcAbW6WD3g3gAPhucE673Xx/CoWLyQg1iRWVkiPHwXTw06D9AscskTIwTnn/GRviVZrFG1iv7RaHA0ED430M4hWRI2UM2ro43gENTEJzIc7hwPICif8tL0vthFBNgRw4ybWomVUgB+q4Erm5BRD/jd7sXA7UFsABvrWxRbboFK2cC/sZjHN+tqznXpW5LTJHbiY7sbinnOVuHsR3OLlF7ha7cP0OOuB3fFea9jBpweGA+I80aeRra30qZYuM4q87EvsWIUWrqkbU720Ip3Dcm0gkhhbsa0woFBpPq7Mcno23tLwsms9K4q2dzlL8ZSz0JxXdtzHacYO4reKBNEqTm9n3QB24G/RB47Z2ZwIscJVKEdvu/7JLPOy71W9pJVHEdguJT9GU6yq1AuFrwWpXuZRLuZTLf1/+AlddhX7hBBbOAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-cpp.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACIUlEQVRo3u2YTStEURjHBxsh7BgvX0EW8vIlJOwsRWTLhtLMNDc3lxELUrNjyG1qhk+gLAcLWZC8TCMRG8oIZfyfuqTTvWPuzNxz59R56rc75znP/znvj8cjTRpf8/l8taAPrIITcAteQAZ8ggdwABbAoKqqdSURuKIoDQgoBN6MYHMlDTYCgUCPWxkvB9Pg1WbgZmwHg8FWbsFrmlaNQaNZArqkoIAGVLBE2QbHWfpEeWW+BhxZBKGDtn+WnNfv9w+jXcItAWGTwG+wlrvs+MlkMmUQMoC+59wE0OlhEvwhaCxwOUYcF4ABKsE9Ezwdky2F+qbZgJ8OpwWMstnHEpgQ5ZIq/7NWf0jqul5h089v/wLjseeHNqhJ9mccH7hYftBwkhWQz8XjpoBdRkCKy8BFFHDNCIiJJuCREbAomoA0I0DJdQC7OOGHHH0xDVTRBAg/A+weCMlTSN4DNvzg2TAl+k3cLfRbiF6daHzB/sKEeY0ay2jc5LgaE6lwVQWeGAHPoKlIP7JOx0VgFoZMZiFRyJ/YSMwmiPOaiYiJiCRt9Dyy3g/ODB98BFBNE4OdWhWnQDsFZ9Ufx28zZnLEpC4U57kfqJC7l+UtcgV26NkN5sEy2DKKvlZ9Yrw3NX30Z/Mo6rLQSzdMRWK3qtNeBLAC3m0GTifYOi25Ujlm641NuWYslZQRJGX4A9yBfTAHeun08UiTJk2aNGnSpElzxL4B3RSZ4yDRtYIAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-crystal.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACsElEQVRo3u2YP2jUYBTA01YQqiCiRTp1sGPBQdRVl6M46eAfiqWgggpOOvgHwd/LJbnDU4QDUc9ToWptg511sIibi1rEqUspiIOo3URFG5fv4DjSy5fLl3iBPnhrvt8v5L2871nWWliW7/t9wDFgJAiCnjzCPwIClZ+BSREZd113MG/wYfkRuAnsBzZ2G/zjCPjW/A28Bq7Ytr3H9/2+PMGH5TIwC5wGhjOpHwX/xAB8WC4CNRE55HneFuPwwLoU4VtzBTibV/hGzpmEn8oYPgB+Af15hW9kISn80wSH/1GFmUTgWtbwC8At4EC5XN4kIicSCrzrFH5a84CvwAxw0nGcoZBnTSf9jDzPGzAJ/xN4KSIXbNveCfS2eVavEkwkICJH4sDPhDxkHqgAhThdQQmaKOS6rkDjzX8CHgJjrutuS9AELhoSWNIaM4AlwDM1kwBzBtvpsM6BdWBFRCYMwPerH5ERARE5o3Po0cYcklQCGDX8Q5uNPNTzvIHmYSqJBHDDsMCy1v0BeG9CAviQwlixW+fgSutYG1fCdd3BlOaiyzoChbDZPI6EiIynJPAqSffQlgAm0xqvK5XKhiT9O1IiCIIetVpJa7we1fkELrW76rWTAEZSvh9c15lhdkXdV1eTAM6lLDCvu3n43okE8Dxlgfu6ffyZzuagWaJara4HfqQI/6Dd+N5aB6d01x8NCRHZl+ab14a3LMsqFovb4+xwRGQCKHUFfFM7XIy5iPqWAnw9NnxTHdT+4zolAO51DK8EDucWXglsVZ9G1vC1xPBNEm9zC69a49UM4e8ahW+E4zhDwHG1qfuSK/iwZZVt2ztE5DzwwtCf904m8GGhxoe9gAO8Af7mBj4sSqXSZhE5qBa8CxHwt7sKPqJ+plrqp/vhV6sfYCx38GuxFl0a/wAcStx89KiWFQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-csharp.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADRklEQVRo3u2YW4hNURjHzwyNayNpREIeJB4oinhQRpJyCUUpD0qEB0pRhN9/7z17hqOJERLjkhedkQfyJpEiIR6UXIoIyXUYzYzb9rKmttW57HP2mdHU/td+2uu7/Pda+/v+30qlEiRIkKDXAKiSNAfYAZwCLprnlKRdkuYBVWWOuRboiOWkrq5uJHAI+AwEBZ73kvak0+lB/51AEAQVkjYArRESt5/nwPQocSRtlbS0rASAvsDxHMndAY4BLrAPaAHeZlnXLmluhFh3gQNlIxAEQQVw2krmD3AUGJMjUKWkBcAzy+6d7/s1PUpA0noriVZJ86LY1tfXDwVuWfYXgiCoiEOgqampH1AL7M2bgOd5Y4H2UPAfwKxiPoDv+8OAV2ESjuPMLIaAOQWTgbPGR1uXr0Ln8Vg4sKSdJVaPZdYunCxEwPf9GmAVcCbHP5WfADAQ+B4uiY2NjQNKJFAJPO06gkCLfYyAgZLmm936GrG6vc0XdLG1+HDMGj4bmJrJZPpkeXcG6IyY9G9gm+M4U/L9Sylgv2W4rBu7+sM8CT8A9gK1kjZFrkLAtbAjz/NG9SCB+5JWAyNKLqPA65DDr3m3Kz6Bg5I2u647EbgXuw+YsvUzROBxD4rE+I0MqLK29G6vIpDJZPr0agJm8bcQgSe9kcCjEIG27vyJiyTQ6brueGAjcCGfo0tWGR39vwj4vj9M0krgSjFSYrelgxbFTGwWcFbSGs/zxhYgcMR07jozb/wpWgs5jjPFWnwkJgF7IFpnle1JkjYDHyJKip/AjUK94EnI4EtDQ8OQUpI3+v2fGdp13QkhctcjJv0J+GV0WnWUr7bFctBY4tdfZfm5GVELfQTOmWM3quiJDOgPvLRGycVFJj8ceGMltjAHgV9maLoKTLeVa0kjJbDCCt4haXkRVzD3LfvLdkmWtF3SEqC67DOxMWzOsr0tjuNMy9YfgMGmTr+3bF7bCrPbh/pUKpVKp9ODgMs5zukL4Lwpfc1GhrdnWfcBmNzj1yrWVckeS6VGfW67rjs+bid2HGcG0BCrU7quOw44AXRESPyBGUwqyyElyt3yq0093m0uuZqBk2YUXReu8+XSQgkSJEiQIEGCBAly4y9hK7rHrGaP6QAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-css.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACCklEQVRo3mNgGAWjYBSMgiEDGhoa9gHx/wHAzyl2/P///xmBBn0YIA9soUboKw2Q40G4kWIPNDY2hg6UB4B2+1MjBtoHMAZkqOGBnQPk+Feg/EexB1paWqSBhinQEOfg8MD2oVJEt+LwQOtQ8cB2HB4IGvSOh9YxL3F4QIEaobMBWonRCn/E4fi3FGdgaOi8GaASaDc1Sh/ZASz/O6hRA/sPoAfCqJH+GwbKA83NzcrU8MCmAfLAB6rUwE1NTdpAw0xohYFJtBCHB/YNiQoM6IFqHB7oGSo18DocTejIoeKBhzgysDo1DO8E4htYcBSVHC+CI/l8BmImalhwEYcFNlRK/+44zD9EseF9fX2cQIP+YDH8X2dnJy+VYqAKhwf6qVF8muMwHOSpaUB5Y3LKaZAeoF59aPv/GY4MHEuN6M0korK5AFSXC6SFiGgQ6gFxCxDfIsJcLWpE7xwSas2fQLwC6BlXWOZDcnQzEN8kwayvq1atYqaGB86T2QR4AMQzoKUVOfqPUqt8XgHEv+nc/gHFVAzVKpnW1lZxoIElFIQmMfgOKEODMjZVGm94Sg5roEXzQGmUCo6+B+qsALERzRyNJ2nxATNrKpA+QaKjQU2GbmBAmNLd0Xg8owOqdPD0mZ8AcR8QWwwaR2MDkyZNYocO/u6AOnoiNMkxMYyCUTAKRsEoGAWjADcAAK99D3Ti+NGqAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-csv.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAW0lEQVRo3u3YMQrAIAxA0Rw9N7eTUHAppRZD3oes4nMzEbcyc8yJigEAAAAs5/z6KAAAAACPAVuQAAAADQBfXQ4AAAAAAAAAAACgIcByF+DFV/C0ATgWIElStS4uNvfox4IJqQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-dart.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADPklEQVRo3u2ZS2xMURjHR0mIxCMiIhZW1rYaIeKxEQkLNuiGsLBpQoJEiJlZzWi7GZQEETGmjFdFREOsvCJBWwuxaBUtVa9QlHhd/y/5Ro6bmXPuOfe7MyPmJL90eu/ce77fOd89c+45sViEJR6PTwQHwTfQlUgklsb+lULBIuh+4Cn8wvF1VR04gpwCjvkC/0sCbKjWVl+B4AY1wf8B391UTa0+FeSCBO6jsRqCXwWGHIIvsKVSgU8Dp0MErj4TM8sWuOd5o5C/q1HpG4HgC8/D9rIEn8lkxqKyraj0RkhugtvgDrgHroG6crT8blS0A/SCASEegb2gE+wE46PK+TX0awraWeCrVAoxJ/kvSTVQg0kGPx28VQS8CCSyvv9TIhJ0EyVoVYB4LChxHzwUl+DU8RSB875KJCWyRY65SyipoxMg+sAXAYHjJY6nrSV8qaMKnCtRyRMBiV4eYoud22Ml4UudIAJSErqZbFMgiSKpowqcNQQQVqINfNecb3ZJHRsB4mkIidegw/Cdcbo5/VrNhUEFiGdgRHA0MgvgxAzwziBwxiIQV4kL4LOLQLvhxrYCrhIjLBFcgHP/ZwABl3eAfgeJnEsP3IpIoDBJs5G4Cl5ZCSSTyTmGSkggH2KIHDDktsoPcMplFFqskQgrYCuRtRYwSEgIEM8DStAbW4+1gEaiS9OtUUm0OQmUkHggKEC8CCBxwlmAR6ZFXFFhtnhI+FWS7v1Jc57eme86C1DJ5/Oj0RsLcWEGrAfdwhKDmp6geVVzKAFfj1ziOft+XjrvEZJ4WaIntrGEmMBy31jdwT1zWEk1KYlh9PzGUM9AEYExRXLS4/dimku18oP3XkCihYdSOQGWmAU+aoIY5uGvlafftu8GQ9wADcoxStUmUC+y3IIbLQk4t6FgjoJ94DKnnekaeqAbQYJXA2eLLnT5hlibCVofD8Mkc73YrBUB7wKb8fkKpWvkC76YAC6wmNuodHOKHQAXucWTyl7DkbItuUNivuHHyESnf3EMvbCs3Bse8wwPtg0faCm/Ers2c3kECiuQq+SeWT21YMgdm5UV3fij7k+n0xMI2q1PpVKTCHyeHJC6WK3USq38H+U3rmkQy+fAUl0AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-default.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAnElEQVRo3u3ZsQ3AIAxEUUrGyKgMwYCZgQUIBUWKICTCGZD+SVfjZ0o710gIwZfG0lSaRb1LL6dIHT4bVIMQb16PeD8g+uEgRagBcoQFQIqwAsgQlgAJwhowHbECMBWxCtBCHAX4QhwH+D0DAAAAAAAAAAAAAAAAAAAAAAAAAAAAFgEsj3y9phFA3AgQRwAWh+7u5usM3hFCyJZ5AFDjIlaM9EgUAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-dlang.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACYElEQVRo3u2YMWgUQRSGk2g0HkHRygTBwhQiFmIhgpxREQXBC4KFGLQRQS20EcTK783dclfICQeCq0ZBjMUVFjZREEVBEETBQizVIhBBBSNGzcVsmglcYfZub2Y2J8wPrzve/N/Ozty+v6PDy8vLqy0VBEGfUiqrlMoCO+dLKTWolBoEds2XiOwG9gJ7gG2FQmF9GIbdiwoATACRQdWAN8BVERkuFour0waILFcNGBORoSiKOv9HgPp6AWypW6sfKABvgd/ALDAOjCqlsu0IEGmjp0TkBPCzwW/vApl2A0hajxNdDDGNxkTkIJADciIyBBwGjovIaeA8kAee6vfeGoSIXLIBcC1Bj5Uicgz4YAniR6lUWmUKELZwnnpE5CLwywLEkWYXnbUFUNdzOzBpCFA0BbhueD3nDAGuLCqA7v3A4CCfa3aRv64ARGS/wQ5sMgW4YQpQLpdXADMtmH+UZJudAej+4wnNfwcGbADctATwKYH5b0qpHUkXmHEFEEVRZ5PXaQ24A6xr5QktBDBiCpDP5zfEmH4iIieBA8Aaky12BiAiF2IAztqaBxb6ELtl2Le3wQHe2O4AYYz5VzYnMqsAQJeeuuIO7b40AG630GsAeN7A/D3bM/G0CQCQEZFDwCgw1cD8Z2BtWgDvgMv/qLJ+v+/rOGWqyT+pL8BmF6nEdApz7ldgq6tY5Y9j8w+Bfpe5kCuACeCM83DLAcBLERkGlqUVLT5LGBtO6tvkI/AeeA2MAEeDIOhLPdzVX4y9QEYPID2VSmV5GIbdwNJqtboE6Eol5/Ty8vLy8vLycqM5Ljm0UjfOXagAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-docker.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC+UlEQVRo3u2YX4gNURzH17+VyJ/2gQflQXjyQEqesfZJHlaW8kDUkj8pD+TK/TN37uUycUmuNu0Da00rmzxsWeUWnmTRSitW1uLFkj+xHhjfX323puneuTM7czVX51efzp0z58z5fc89f37n1NUpU6ZM2X9j8Xj8C+h18K6WBLxMJBLHwAH8ToHdkldTAsBJEAOnwUElIAzDkFgLR5o98BbsQfmdSPch3YZ00G97hmFMQ736MHv2MTgFzjOV3n3G3+dADpxhnrwz+Czvh/y0ZVnWBNQxwW1d1xvCFNACbnFYyDDpAodAJ9hBx7uCDiGUXwMs0g9m15qAKzYBQketCXjuEGAlk8mlfibsXo5rOx9BApwFGjgO+kCajoqdYJ680/ksZT87v4c2jrgIGHQKAJlUKrUEaRNo1DRtgVsP9EoD4gTSo2y0R1YVcAF5h+lYkeXy3LjE6aK8Yz2dZSXPwO9dSC+yg/pd2r9TQkApnuBbm0oKAK3s2RiHRXuAITRWv5kd0eImAE7t9yhAuBw5Ablcbjr3k0rOD2cymTmRESAbF3p/NdJLYLSC8/fB/LGKNx3R4yfQLX+PDZlY1xx5Q45nr3lXwXcKk+cb4KGL07+Y/gQPZKcvFApT7MqtKIMldJVpmpNkhy4366MsoMfLxhHp3vciYDiiAkyvW3d3BJ1/7zkSZezut4E/pFoCGv0ETzPAiI+Pj3KNl3X9RxWcj40n2oz7aEBuHq6DewzUwnReG2+4PBO88dHQBxKm89mya70Xw5K1kjtkB2izIdFoDHNlI9Ll4GvIjn8DW8I6Om7gtr7YpUxriM4/Qpy/KOwbiHUSDcqNgmzhZQ7dbQEdl/hoO5hclWsU9MpCfPwuGICQrc6GRBhvHfw6PiAHo3w+P7Xqd0HS0xz3fZyw7XjejHQemMjhtB68quD0azlmYo4tCzRJgwiBAyt4/i1yz/jNc/ILzhkZEk/5vpPnhKZ0Oj03qleI9dlsdlaot2fKlClTpkyZMmX/3v4CGRqf1vNXoPMAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-dotnet.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACQUlEQVRo3u1XPUgcURC+BIMhIiKCFqmCGAyeBBTEQrBNYyOCIJJginTpE0G92/vdHHJyinh4oJ2F1TWCXUgThBSSUxECCURRC2Miiv96fi884Vz2duapWM0HH3e7zHwz8968n/X5BAKBQCAQCAQCwX0gEAi0gRY4RnAUTIKfwLfgE5M4lmU1wmccXATXwHUHt8F9MMsSDIVCdTD+DOYdvHB558afSoOKk8/nH8A2DJ4zNE/Aes5otMNwh5moF38kEokyYoZjBno2mXwwGOyA4TEhtGcQ1PJIvslgRn9Tg6FGvln3mZfQL7DFoIC/xdYD3k8Z6HR5Jh+JRGpgtEGI7KCvX+jgKwbBe53xUqlUKd7/Y/rPc3abLCFyrNZGgX3SoIAZl3idTF/Vzs+p5F8zhHocPq8MCvgDPnT4z952Df1HPB6v0Husl0jOpejH4IFBEa1XvrZtl+P5kOGzmE6nH/nuYBsbLOI7Z1BAsGCne8PZ89GyLz2TD4fDTzmjeLVwXbbc9wYFLBQUPk/ZQ3uAs3BHGIGXPE7rWoMCzqPRaBV+q8EzwvYbWOKZvO7DXcZIDBGDsMotAlrdjFk7Qus0cE5c7vT7iQI+GMyCOri+EkX2cW+Zy4yAXyidWCxWqU9bTgHUbjfMTd7PCLbFuU1qvXcMvVPi3jOmbqasAlRfE8E2WX14vQibcRV2PWmRz0fTj5TvRQLkAupgQFvc8OOnVZ8rGXBaU/2fANPgpH7O6Od+zPIz+WwUCAQCgUAgEAjuDZcjpEk5laQ4HQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-editorconfig.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADjUlEQVRo3u1ZWWhTQRSNtWrVqlBRq6AgLhWNIKL9ENxAoe2PVFA/BKnSglZFVBSKULI3ITRiqErEogh+GATtnx8uFFxaKvpRF3BFilUUrVoXbK3xXJjAECYvL+/dCREycMhy5829Z+bOfXfuOBw2m8vlKgVagFfAV+Cu2+2uleTTPR7PWmBlLBYb48inFolExsPAHiChgBu4CIxI/30A6vOGAGa6KY3xhsBzByys9CI81+D1eivYCGDQe1YIAL8CgcA0Mzpg8Fz0vwlcMvtMNgQeWSRA2GFihbej3yBwJZFIjGJ3IQzcaZUAjDucYexKYAh4HAqFJmnZAxi82cYKNBqMWwy8FERrtW1iKCgD3lkksMpg3A3JqKU19Pr9/plQ0mbB+IdGPg35SdEvpmPWi7Gse/DZBfy1YPxnwJlBR7dwn4PcxlcBTyy6zDDQgbA4z4SeF2YjlVnDi2g5bWxYQh/FdJP6kgTqOYwfC1y2aXwSr4E5JnR2CRdq4iDQwWR8EjS7s0zqbLVr/G5m45PozBCFoqLfVStGzwfWAIuB75oIkHs0GNhQJ/q9yTa73C+Fxj+6jBcYAMpVduDssFTqV5bN7A9oNjoVF1R2xOPx0ZD9FH2qsiHQm2MCQ/Q2z5Cq+0wTEEtHIawfCAG3c0CiOQ2BZIpyy3IUikaj4ygX10ygj1xGsR93CvkPWwkdBtilUPob+AY8Be4zRKRqhd5lUp9KOwS2piqUz6X47WFYhXCqXpp1MVEkP2SHgJPOsJKywWAwOEWStzIQ6E6j+4GQxznyoYWUSVI6LflptXAluwSGw+HwRIXediF/puNcsE5aYttABFyt0LFPyKm2VJovR8l0G3mLIhJtlPqs4CRwXEM4bVToWS7Ja1iMJ18VtRrtLzSfzzc7mzqS2YRvk6YXWkhRNJhhpgyTrfv4NBE4qigrVkh7ZBsXgXOaCNQZrTa+r893AjUKXeelMFrORaBFg/Ej5O8pekrEhQnJr3OG0M0aCNxR6Dlt5F6WG1WKKcVlfokdSZNKE25QXYo7jWhjJNAfCASm0riUJOL3WUn2ns335UY3JRj4I9PsU0LoxOcxfL6VZL3Ij5boSOImiLuxL0yVieeK/0/RJuY2vAiG7+VO4iRQDeoM5T+6LjPaNRj9CbhGaQIwWdtFBvkiRwlFnJ9P0OUd0oQFObsPFuX1Equg6oaWW8ZCK7RC+//bP+Rh6AwPgRUYAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-ejs.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADZ0lEQVRo3u1YX2iOURgfhiHF/Ckif2pISblgCVu7QIvd4AKl0FaS/Luwhvr2bfs+X2ujz8jiZheUJS7kapRcmFArXMzfwhfKIhIL8/k9PJ/Onp3znvPus7Kcp369vec9z79znvM8z3lzcjx58uTJkydPnv4NqqmpmRWJREoHneF1dXVTYPgJ4CtwLGhuOp0eEkZ2dXX1Tsg8JXAUyMva8FgsNgGCEsBnIM3o40AikRiL8SPAfaAb6GSHJwbJx/fVitw/IKeyMpwMgpDDEPZBo6CXA7W1tTMw9lJnCNAVjUYXGoyfDLzR8FwOu4uq0DwYvhfPtwaDejlAivB+VXzvEe8PgBEyzDB2RSP7NXZ9UmjDm5ubh4O5AkgFGE7oxIoWKQ5PE99bgFwOJ3W8UMT9LoP8lWFXfCiwCXhiMfwVO5gr+EvVeRnnkK3mipjenuHBnAV8TqSOBmfDeQvLgHsWwz9C+cH6+voxhgWYL+Zv4/E1woFVNN7Y2DiKQ0rq6UgmkyNdV70EuGUx/Fe6tGWR1tbWYZjzTPDdAL4oY5QI8ll3k0YXZbh5LoYXAtcshhPOArNDhGEx8MMkD6u/meN+rWFOhUux2OFgeBuwqJ/ZazFwV8h7lDmUeE6llKrRedEpZUZ+k8nwjtCn36yHcvsyyk4ZwzhRtGn0pqhQugrWOZCi7SUFA9mGQMd+jW4KuZIwK6NzoJvbhHEDZTyFJB9sqTseVlBQCHVhlXbLapktUeqFzIcafXdC63I8xFTM1ve7D+m7aKc1Oj6hyBUIJ1fAvnJu7MxpGxVwiaZv0eEmsDTLuF9nSKlblTkbuMLLmlBJrY2tkLU7OHJBXS1XQnc6HbzvNPLOK5mpzKI7Zm0luLDYWolvQNJWkUVlvq6R8zwej49X0qq68u9Zx2O1o3VaPBIGRzYKZh2oHaikXsYir0rD24PwXa5cSwtEWB3gEC8SfFtCtdN8kGzt9AtT0eMz9l3DE9XM69PoUToXfHv6daEhRtcLjbhSPtXMbde04KOFo21cL04K3uKsrpQQcMjlSslGtehacVNTiPHjlp2+HZiJQuxIPt+ujJd6vhAZu9CAImfqjOk8zhmI3ypN8rcKXx8bgDMCVS6XKk4g57iTvQTs+yu/UwJ2ZOag/LHlyZMnT548efpf6SchV1GKF6mrOgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-elm.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB50lEQVRo3u2XTU7DMBCFCzfiGrBhh8QBAAGCFbs2tZ2mJQXaLSAEHIUDcCbMWJpWjkmT2ONMJOSRRk7SyHmf6595o1GKFP2FEGIJqYkpsK8FpZ8g8TE+jCmxrzkngLYgiggQOQUiFMBkifcqAsQsdEAoACbv8ZmIADEPgaACmFzg8ywCxKavGSeAPXrjCBClD0QsAJOF+V1KeQfX38Q8xW/lnADbxRj5zMk5Aext8RjyKzAP8d88atvp+gAwqfDdknC4rZ31pTgBbCGLgPJiXbe+TJ+cALagwuPdVcthJzkBNMzjadtitN5ZdVxfgg0AM9s1BazfnjzXl+AEMKM8wZ1l6j7zEO+uL8EGgDlGiMnmGtpHip/gBthCEMVX1s6QAEsiwO0gUwjaB8sUlYF93Wit9zgBbPHacXa+9vTaiIf2mQugTrxbPhcdp80Vin/h2kabxLvOrqny/IG8RPGvXAdZF/GuG5M7xF+g+DeuUsJHfMXZ2YedEQ/359DuQ75zFXMh4t3KM8ORP0PxH1zlNEV8pfJUSh2g+E8uQxNDfKXyhOlzwmUpY4rv7OxiAfQhvpOziwHQp/hWZ0cF4BDf6OwoAGzim5xdKMAQ4mudXQjAYOLrnF2oKxtS/B9jlCJFihQpUvy7+AVxXVcJ3fp0RgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-erlang.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACOElEQVRo3mNgGAWjYBSMglEwCoYyaGho+ADEP9DwJyA2odBclcbGRn8gHQakvVtbW8XJNau9vV0QaM5DLO78ygBl/EfGQAsLybWsqalJF2jGDnQzgfg3EHcCMQ855gLdFIjFzD/YPLCOglAPA+K/WCxCxte6u7u5yTR/HSEP/AJiOTINNwHi7wQcD8OzyYxdS0IemE1B6G8l0vEwrEGqHf///2cE6juDywO/m5ubFcl0vAA09kjxQAqZeaEYlwd2kRv6nZ2dvNAkRAqWIDOwrLB6AOSzIVLscyDFNkoM6AyhuuspugfeD7HK9x66B24MMQ9cR/fA4SHmgbPoHlhPoYFJQNxBR/wK3QMrKPQAqZUYtTDcAxsp9MCygfbASQo90D3QHnhHoQdSBtoD/4EtPUMK+wAD6wEgriPXA9BW4hMqOw7UA5tFoImO4oHTFCajdio6HtR7swCZ29bWJgpk1wDxC0Ie+AfECuR6ANjnlQTq/0YND2Dr0k6aNIkdKJcAxBfxdWgWUhILQItLqeCBNlCSxJdcgfY4QwceMDzwF5gh9SlIRkxAvIpMh38B4hAiAyoVX6d+FyWxMHPmTFagGZNJcDgo6a4F9gY1iQwkNdBwCj4PgNJgPqUNLmBMWgPN2gLNkNgc/hLUBwc6XJ2EGOZBasjh9gAoKQE94UulliOov+wCjfYC0CAXkJbCl85xmMMGxDuxlULYRuZA+M1g6aVB89YCrCNzo2AUjIJRMApGwSgYBSMYAAA795LQFgXiBgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-eslint.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADNUlEQVRo3u1ZSWgUQRSN4xaixigoLoigHqIgQTF4EC9CEPQicTm44cHl4MGTFzdmpmdl1MOIwojoQfDQqIhGD4bgEhRB8CCCiOIaxICgQbO4ZXwfKtBpuqp/tdWTCXbBY4bu/3/9V1W/6v/qmpqoRa2yLR6P1wJXgT9A2RDI1hWyXQkCSYOOD0MikTgatvMLgIGwCAB9qVRqfpgErmk69FlAR8cOxXlM71oNJ34Cx7PZ7DQC/RfPuPprTI/8BOAFs/PLlmUtdNugZ/SOaeNZqVQab3L0DzI6fZxMJlf72SIZkmUE9AFToz8H+KborAud7cBvTMNmDNgOfFDY/QrMNEHgoqSDXtr28FvnpVcsFieKmSsADRLbdcAR4Lukj3P/5Dyme5WH0UHgPM2Ml065XB6Dd5uA187dCGT2y9Z1Op2eTc4K28P6gg/NgZy3bXssDDxxGbwLg8sUhJsh06lYFs9BZD2RlOg3QabDpfNIZ3k6A3efhwONXrI4fOYplpoXbsPZpZJltchDfpfuup8uOYAaXXKTRWrRFzD/OQvMYhDozuVyU3UInJZ06iaQNZA+3GAQIJzkBm6TItN0E8gZINDGJPALWKJ0Xuwg9xWdjSQBQrtsAxhS3urT2UgTILSqCLwdBQReqgj0jAICX1QEDlU7AZxPh6UEKH+hKapiAq9862YIrKtWApSGcA+y60wCxwwQsJkE2tgnsaieBhgEYqIW6ArgeI9It2sZBH7Qc918yOImc4VCYZKYjV6G478pVclkMjM0krlUkEKGio13LkOWKoiQlc7F+wseef0QbqnSAaq9RZHk1HlPAxS0Ft7o4cQbYIvqSMf75VQ7OIt0utXwSWFaxS7jDtzNgSsyYbhdMpoPkfit9NHdAOwFxinIrlDkXx3K3IcZ0ItFJihb05eC3KYxiiD/7FMjHgo+gdkPpPP5/BQ/WyQjYqnfx+YJkxdb9cBHxg7TjTW7h+ppSY29G/jEsEMy9aavFrdp7PFPId/i0G2hZxr6O43fjYqg7NQ8rG4K6Og8CHQLYaDcNIFB1bWNqXg4FSKBM5X4QtMA3AnB+Xt0FR99xIta1KIWtaj9V+0vTMo0XCSjfmQAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-ex.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACQUlEQVRo3u2ZO4tTQRSAs+66hS98FBb+ABtRxEJctFu1tFARH5WNFouVsiCLfmfyIqbRQpdUgljoFcFmBQVhRVCxElJoJSr4KlYQRXR1c2xuIITETTY5c+dCDpz6ft/MmcuZOZmMhxCRAyIymUlbAKuAO4ACl1MFXy6XVwKPY3gFptMGP9sAr8DttJTNMuB+E7wCz1IhICKTLeAV+B5F0XDoqz8G/G0joM65bcHCF4vFdcC7dvBxToS8+tOLwCswGyS8c247UOtAoJbL5TYFBa+qQ8CTDuDreTW0v87xLuAVWAC2hlL3I8DbLgUUeA6MhrD6R5YAX89rIdT+ix4EVEROJfnn2dMLfMN5OJRU/d/rg4AC8yKy1zf8WuBPnwQU+OGc2+nz8B7tI3w9v2az2c2+duCWgYACr4A11vCjwDcjAQUia4FxQ/h6jlvW/0UPAlWzyw9w14OAArutBKqeBEpWAnOeBKpWAgueBH5bCajHHLEQ+OkJ/pfVDrzxJPDSSmDGk8BNK4HzPgTMnuPj1zcfOzBmIlCpVJYDH43hX6vqkGVDd9a4fM6ZdqSlUmk18Knho3PABHAauAI8BN4vUeAzsN7HpWZf87VQRA43j5icc7uAS50KichBn3dj1wJiplUnGQ8+Ti4icD2Jt6ELbWCeAjnghHNuR6FQ2CAi+/8DfyOxAQhwrIcudR6YSnx6k8/nNwKVLnulB8CWECc1Z+JB34eGuUEN+AI8Aqa8PaH0GlEUDQMrgh/wDWIQg0gm/gF3YXG8ysQ7qAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-excel.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRo3u2ZW4hNURjHj0voSJJLLtGkcSkPShMjT/JA0jxIJrcnD+ZBhAe3eTj3i/NkxwsjnjycUpIk1BQexLx4kJEaJTQ4hZBJ5+zt/+Vbp69lzsXee/al9qpfe53vrNt/7fWt247FHIZSqTQzkUisTyaTB/E8DwZBBVjMUCwIoVwuT0mn0yvQoJ2Jv+EGeA1M0djx8F4AKp2HHt2M5xEwAJ6Cny0a6o+AVCq1Fo09gIpK4C74YLOhjXgOFtohk8ksxXNGq962As4YOBNmAcSonwKGQbcdMLSPqXJoEvFLwJCDyWSbKsfPN/AV3BQcpnrRu72I325AZ5AE6Axwvf1N0nRFAlzkO3igwNA5wUNoD687/0ArvhcCRniFvgc+BtGJn1ABWKk34Nmj/fcGTKb8uVxuLuI/WgjdJVDDY7Vmr5PP5+e4IYBWwAWUxrKsSYi/FP/1i/wpD3zAtDuEkiodxuxZttWwR1lCtkKhMBu/vwRZwGcQ53QdbLslRJ32aBYynThxn0j7kPyB43Hw6X93o/TWxEGo0U50qpsCXimHxXOHKhy9f9TDrYTpdBrtkXkMw5gO27s285o8Sykucgec1OySdW4LGNTy7PV4Ja45FWDIPHxS+h0WAWNq2kR8sch3qc0GvwenBNv5KLtJs9fJZrOL3BRgiLR3sPLO5/hyUPXIiW0LkL3fybbjIu+1NgTQWnJBAefdx068Vdo1lrklQPZ+kW0vaGvBtpVUeFB9QPb+NG3R6hb5r3sgoGpHgCG2DL3af5fFvdKaNq5FhgUZrrdPs9ehMt0QQIU9AvfB23EOKbshbAstOnwfOpFOXPXzREbb8C5BB9VLU6Vml8SDJMA3H4gEuHkroabusPqApbbxYb1arPk5hEZBwSZlLqMS9uv1x34KqPBnKjtcpc0dnT+afmJCov3g3AR9YvLvIx8f3K+AZ+BXaAQ0+cy6iq//UnzXPxIaAY1CsVichWG4EW/rEN048AbwW2gERCEKUYiCo/AH+Lz0vsSnbHEAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-fixedform-fortran.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEdklEQVRo3tVaWWyMURT+UVTssVP77oUH4YEQIakICSUI0YQIVQ+8kIiXbtNFkyYaIUV40KZSL21stUWLRGlr31qqJKQprWEoZbTjO3Uq7d977/xz/z9j+idf/uncc84939ztnHNrGJLH5/N1SUxMnB4fH78a2BUXF3cAyAGKgJeAG/gcAEj+A/AWqAAeAnfYXiGQD+QCJ4EjQAKwEogwAnmgMAc4wZ35QgQ1QCYwRup4enp6bwicCiGnRfgFHCVf2zmflZXVHQ03Qtz5trgOhP0jgDm+vxM534rdbaeOWyH4AihzAOXAPeA+8IAX8WPgCfAUeAY85wVeCbwCPgK/JX5VAV3p19+oYpqUlDTa+I8P7Yapqan9mbzZv2W062SrCGRkZPQyQuDhLdfsXzY1lPqZa8NDhMBdgW+lBs8lKYGEhIR5IUygihpq/YwAnZwFwGk+J9JdLtcIP52F88FznE9X0r8KFANXgLPAGbZ3DEjGqT/Zj03RTKmlhjqNLayKFpasMyz8URo2f2JD2RwggTpq+KS5D09RdDZN0+ZvTNm5EptlAvl6gwMtnc4m+YmndA+o8xKbom3UTQ0enY4wZycqCCxR6CYCs2gEeaTMv6xXND35oDPb+kINXzUJjJcRwFxepdBdaXLsvFkG+pECAtUCWx5qaNAc6nGKEdig0Ftgkr0gjXPay9UI5L5Rw3dNAmMUBKKtLn78fVEgc0hgU7RWG6ihUZNAhILAFomOJy8vr5sFAoUCmyI/f1DDTx0CtNcrCGyT6B0WyBYK5CrNAZ3EXiMZ8OoQUJ3GWIQ7BDr5aWlpfQUELokco1wc76U4FxbivUaWoRmKeNunG+TRFkudckEg0s9oXbZxZnjJQLOm8lCHgrQrNgg0GbrKycnJQ0KAQLMdAoMcInDNTm6sPYVSUlIGypzCwpsJmRjM/3XAYnweqSBQZHcK6S7iAQqnYgTyBaL0FN/fsruIvZrK/QIkQNgrkL1tp9ClfZCJ9nQLBIosJipW0agdSnQo71kjUGsxzreKH9rBnKrcgoW7XbbttSsJ/iXwyAaBBjvhdLhiBLZaPQC5KqdL4Jt2QgP00Aynp5lkK2wQ8GinlFTRVhBYr9ClJxrTbCftSpSY2yDwRTupN8f1JgJRQapQu7XLKhSjKxbxoiARqNctbDWp4hsK9EgmCATqrJQWOxzf+IU3WQjSDgaBQEtp8bUfoXy+wYkF1qqqEYLEZipnU7GwsQ/vFIdH5rWsZNeKd6q5rhE6d3V4BMoMvvuVCdxwskTO11lOEsihHWOFQuCmkwRcLtcwhwksbx3WN7JVDsymIhaFAJTE4N0nMzOzJ+uFUUzEd1iDqVKBBH4sFX6BGZzYkP586oxv/J1yvrrlko/37T2d7ZqVfG67uHoAJZ2IQEmHWIynQY6NFDMYIN9yVLdDNBoTqLjq5/I72HCzTxMCumBmMlF8KUGXdef4oq6cb9Pf83+11HMnHs4vGjnXbmZ4+bsGlnGzzge2Uck2i7mPXO4zSnUPQc8fJEFf25Sh40YAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-font.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAVklEQVRo3u3YwQkAIAhAUYdyQDevDTpEUcL70N13STBCeldVjRcPAAAAYAubi6Gyw5cLAAAAAPA54OamBAAAADgPa7MHAAAAAAAAAAAAAHpfJSRJutEEyDnXTthmfqoAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-git.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACRklEQVRo3u2Xv0rDQBzHKyIiKigKgiBuLr6Ai9DBxUXwAfyDik8gDh2kjU1rCRSptpIHULRP4Ch0k0p16uAgVhEEBwcVQW38nVwkHJfkklxyF+jBl9Kk/eXz6V3zuyQSIYx0Oj0AOYP8QN4hSiIuA8PXIAaRgzjDyy/BAC+3BIAdMcDLK5HP54cB7CpWEpqm9QPIAiFR9yBxKBr+AtKGbMRKwgJvQrQzmcx6LCQo8P8SkDXLn3oIklQUZRZe9yHfwiUc4KkSxF1qk2EmyiLhzbwYhtFFfh8dg3MPQiQ8wKPcOPSKGmONsih4lDfUlW0EvNQpi4A3o9OWUS6XG4Fz114kaHXChjdzYvnlRyOV4ACPUrcIqJDVSCQ4wZMCe+jhBprdCkXiE99+g0twhKcJGPgJbdk8XiqVehFUoVAYhOPbDM3OWQI+cMoJ3k7AwDOxZHP9HYa6KSp8sVjsw79Q2AIoxzQGVVXHGOo+UgV0Xe+Bkx8RCVQclrBb3ZbTEtqNSOC2Wq12k9eHpbXIUHfLVgDvVyoRCPzNApp18zOwa51Gy8OlpuZ6G+Uo4SaAco8aHuQc8hUYnrMEiwBrNM9bCQ4Sl5wENN+buQASjWw2O2ERGEdCkcIHkEC9ZIqsA0KTDJ2WL7xPiabDbboRObwPiTsHgaYQeB8SSQr8jFB4jxLP0FXnzZ0jvJ+DPAmH9zETrziGNPAhdOzo4TlKiIPnICEePoCEPPA+JOSD9yAhLzyDhPzwhEQKP2G1HB8DO6MzOqMzYj1+ATVB16vdu+VTAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-go.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADi0lEQVRo3u1ZTUhUURSeiv5tkUWbfiBcFbQJA60W/UEl4yyKDKtF9jNUS7Ey0JgZpxnGoQGHwiZatLFASqJoY3+LAg0qSi0qjDaFZbQoF4pl03fiDNwu76lv5ryrwlz4ePPunHfO+d4799xz7/V4BFssFlsQDAb3BAKBq8BjoBcYAIb4+h54CFyCXDmuczyToTU0NBTBmRZ2NO0AROpKOBxePiGOw3gBcAEYdui4DiJ+PpFIzDXp/ArgZY6O63gOLBN3lt4MYvYklDfiWgVU4vcXYecz6CP9ZIfsAady/jJQ0szK7wKfXXJcB9m5w7+bcyVA2eRnKpWa6ULY2OFVMpmcjesPsp8rgVpW2mVj7AE++W7KRqFQaAN/sREb2RH+fz3J03OcWq1ke+gKmdMSg9ZnEz61NvJlFtlpGM7stJJH/xkL3Z9ovpDMPD7NQMsY8uc0+fAY8tc0ea906vyPAEJgFfdPBxLAW9VJmqBUedwvVXQFWT5Jz3PfalVe9O3zZ96rGPim9JerhmkcKI4OZGbdTB/+L9XetE+R/670V0gTqFKU9ypGvRqBUurnLPKb+38Bs1i+xC5U8Puj0n9QmsBxdUDG4/H51J9Op6fhPgZ0Q6beLuTUkMB9HckDcXpeKU3UgX9Megwc0N5c9Rh10muLtFgwyjPVGuH90gR2aA4NWqVF9BcCT1jmBef5r3xPZXahTdod0ghsFyWA2F5nkav/AG3AIRp0QBToBzqAXdoEdoJn1n6Wq+Dn2liPrrtYuu5f6aAUWNva2jqDw+IyUEMLGIrr8eoge9IhVOiAQMRGR50DAkWiBCKRyCKHBVm7WpLzxDXu5xGyayYyhP5NdhRKtPjhos1pRVoiHULFhkrpDLZIEygzSUC8FoLSfYYJVEoT8BsmcFTMec7p80ZZaUmDJrZ3mVJbKv5DwA1DBG7SmsFuBZcNgSO0xQE0GSLQRFs5wGEpAot55dVniADtO/XQ5Ck5iJOG54GL0guaesMEzk7pNEr2pAlsMzwPbBXf5M3iDCBbDLpyAAKl9w0RuOfWuYB/ypURFiVFl9s702THtdMZvJ3NLhPYZOKIqdEl52Mmz8lqlL3PXPGBDgxNOk+l9Rugk8dFe5anlVQ2d/K46o9GowtNEVgCPOJ8TW9vI28nevlc4Dqn3A528Cnvyt3iitZPuw68pX4beEa1z2hbj/mWb/mWb5Ov/QXOZxPu3qir8AAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-gradle.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADHUlEQVRo3u2ZS2gTQRjHK8YqooKPY33gEwqCgiLiyYMXPXiwQi8KgnrwohfrSUiyaULUU/ASEIKKghGVgkUQRcSoCFoVxFZBxQfxUXzUVxvTdP1/8AnDOruZmU3ILuzAjw2zO998/9nMN9/MtrVFJSr/lVwuN9W27Umhcjoej3eAE+AjsMEoKIHdIBZo57PZ7Ew4WWbHZTwAC4I8+jPAiIcA4gWYE2QRveAPOAn2JhKJQ7gOOkQUgiwgBuY56trBJUFADSwO1eROp9Nz4fSYICIRurAKpx8LAu6EUcA9QcC3hhgtFouTMdE2wmAGXAOvwW9Q5YgyBC7imYO4dvoUMOyYzDE/xmjBydaJ29JYDjE7SLhOf8lkcoPDzoTxKk3hjVdI2wdP4NRalf7IUTx/3dF+2Mh5y7KWcBizG0AVb+OwwoAdkbS9ZSQAo7a+Qc6LXMbArJAM1jLc63NpYxZG8/n8FDR+3wQRE2AAnAanwH2ukz6PgVzpZwIfaIIAHYZMnKblvAc8paUevGmhgJSu84vAQ8FADybfHpVJKqkru9SrMk5zQ9f5tw4jtNmYBZ57dESL2mdnPQnnvGbEUMAZrS0dGjxyMUTzoNvl3lGKLC73LCEtqEDQVlzPaUz0Tp3Rj3sYK2cymdm8/ftX9w4O7cL1uEe7LxQyKZrxm+jgTYqKgPM6zk+jzuoYvJtKpeZzvF4FloJ+BUd+gSLzQ9H5Ud3//k5FwxUSwnG71qzIQzsz3chTanGsFxnQyjzxt1gYIOfHsequ1h39rgAJOGay6qYD4vwrMN1EwJWACNhsmqwNBsD5kp9s80OrBdC204+ASosF1GiVNz7SbqAjVV5tLUrCwHfFds98ncnXMX4Tr3c72C/LNsVzG8TvdaJtzp0KCgL6jQXwCYCb4Rviiojfazxy+y63PjjhG/Po56zfEzDZq6Y8Z7nk2YLJiQFEbPEQccGvAFl6e9XFkU2SZ7tV+kHbbS4b99t+BfRxKKWd1ydmn8dXlZ+cItOR4led1ZO/BzgFvAzboS19E4jxkQ0dHrRHnzijEpWoRCUqOuUvMgHfppBrKJUAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-graphviz.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB70lEQVRo3u1ZvUrEQBA+FBVLS0HhUBSx84EsxEIsxMIHSO5yIV2KIMFYiHBWV+ZdRHKcKCher4WnUXQWcqLjaLKHc7sbs/BBSGbDNzO7Oz9bq1WjGnqNZrO5Ydt2CEgAaQbxHIpv2hL3PG8OSLYBbzloC1mtyAOpOqBbgPwQQrauk+VlyH8ooYUnflg2z4AY4GWIs3fflpMOGxaTOnccZxnLinfiG5ZXurGz0+aL5SnySAnsiVClAgkiExeYE6M5iUoFUkTGKzDHQ3PSSoH/vITM3sTGH6PGB7JSpBKZF9YBLxLkheyaNtloo9E4kPUAzNnXgrzv+7NAqI/3ABDsfSpoLomYcRsEwYwO1t8jLOwTyywgvLCreu1PA24QsUfXdecJ2QXAAMleR1E0pdL6O4T1D39R+IjwwrYS8sJyQOAKEXpqtVqLOaUnjge9TqczqcL6W4T1jwssuxPCC5tjJS8sRgQvYdmlvLmQUqwQJ9IFYGKcfZ4+Yf1Tic1/Rnjh7k/7SBJ9nmFkXZWM3K8F/y3fRxqhz3Mv0+cRspZlPbD0kbiTM/bkjzs9Zv0/d4HCXgBxl4jsJSh3kc7eBOBuk7C3YcqggPFLyOxNbPwxanwgK0UqMWIy15VN5tgvBbmvTcd2Lct9cW3sxXg1yjLeAT9S/duVOW08AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-groovy.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAGW0lEQVRo3u1ZC0yVZRg2u5Hdy27EipGZM1aNlt2bYetqVEZtWnNErpt28VJZWuN2ODAKCzU6lJUSq9BCjXRlQ2blhQq1C8ugWKUJmFGECEL8Pc/2fO3bv/8cDoUE7fzbs+8/3/X93u95L99/hgyJPJFn4D7p6em3AuMGpfBpaWnDgB+AmkAgcPBg3EAWsB3YgVOYOaiEz8zMPAOCt0PwiQTeW4CTB5P2y4FK63clUPxfCHIEkAItPoXysjDHjAc6gXirLh7YF+4cfSX89UAj4FgYG2pMQUHBoehTBzznMd88YEtpaemB/SH8JOBPaXI9cDvwHbCyh3FzgYacnJyjPdqOYhtOc2p/aJ7H/RvwhzT/GvAyjTHEuNOAPaRciD6TgV+B4ftL+DESgtSpt6jDDbyo96ggY5fxtBzHOSDY/GxDn4+Bl/aH8Mcp8OwGqoFngG4JTZ++AmgNMvYqUS6hp3UyMjLO5QmjvKDPhJdm3pXAH1BYCdaiDSQrKFW7xzLKMtoChe45s7Ozj3cbLfpFy6429TZCY8zQUNykoGsodFZW1ukoz1Ndp1yjodPNQBIwAwHrTJSLZDNpMNCbNN9DQJP6twNvMZCh/XH1NXPRqO8SRT8TvciATXIkjB/NzKlQFuiUWziP29f/zJAPrAXKVP+hFlmhiZ4GuuQmjQDdLjfr6ARZbhX13pHQDapfB9wJvKCTM+N42s1ACfCLVf+T7JLvtXTFmi/KZIzT1biAAuH3E9oANbhPQcwBZ8/X0TvabInefcCXwPPWotTmtdIaNZqveioqRae7W4rZDOxSyrGYLhjle8DXPH3UX2PN24Tf9+r9InMCZXKX96hhiTZ2I/CwNLdN7Wnqw4UvkecZChyEvjeYhaSUVNJGjmGzFDIb2AiMRp/71X+ZFPcgym81hn0rKBfq56Cssjbh0xozzQYaxMEkq1O5Ju7Q7wy6VpzCxZaQFHgdyrtlQ7vUViNtbpCQjbKjcnmg912UWy+vVyW67bVsZyGwE/Bb/Tfq9MqGWJ6mJC8v73AX9wwyRYkmadukF296pBpEoeUADBgEl9Irqc1stkMGSoV16d2M6bKcR7JV3yaKNdoUagVGAIniqaPjTLU09qz6L9bvVm3CvYEn1S9dPPYrR6qH1zqLbbm5uUcysfP5fCepb43s7FJp2NE6sXq/WpTi+6eiFd9HcvBo2QA1PBeNt4mrC5VOsGOAPNdij1g0uk78rrI2Ot/jajlRbUUege1Ca745iknRVnrCtgeAGDmFEdaJTLFTCDd9eIRl1IorZtxn24Er23REq+FWfaIVEIlXRaMYudMdMnSuX+FaK8Fr4/g9QfXFpuIVa4Fv5G1iggS9JTJuBpUFVn2GNceP0la5YkUzFHE5yrc9KFcrTRdRaYZmmnOWiQV2jiXv+D03blKBbgke30MoHyuP4pMwXaLaPGl+r9zt5+pHCr4BxFlzJKk/404qnYfq4zT+C64DIW9R5vo3XdUvSptdznozabE6TgvxheExubZa/Wbyt9rSJO8L4/9lQplk2Z3BNpWMwCcC2bp3FNkbiJL1U8BY1vn9/mOVj5Ayv2uSVRTctSi5PDJUGt3LTRzDdNuDagY74Y5PUCbQZHuDs5VjVCgn6rQG0W+n9JWQYWxiFHmv6LxKXrJFeRm90CFy96Ve33JMzsLcZobsY1JvBCCvFaE3AJ8o4xzWiy967L82ROofkF2M89p9tMm7dRKrw12YlxRxk9qqY2KIMk8xhjQM9HSRkY9ntJ0Q5O5RKCW/Ho4W9hib6IGz02RkHfI6iTbdtHCygh3d7xbSg3YW5JvSGiWL0Uo/EixFUPjcoJcbPjISJkyzQgh+hbxXmxK46VwsDH7HKmZsl9sswdgrzYbxfoc26Vgpi7lY8aKTHI4RUbBq93WQG8MCjypmtClf+Ucfqzi3MtrlEq6WlEN+dIoMlfnPKPYTleeH6wF4Qe/iBcbcQ3WpWCovxeOfSur0ldeh0LKXOm1mJWOCUSDdtOg8JuRE+fn5h2mSfNyLT9VtrF5urKhPvyQE9zCJsqN25UkMXHGSZatJKoNpP1tus1JpAjk3hffm/v4uK+Nl5vuVZPpIMs0OJrz5ANusPOWcgfK1WzfBRTLoNn6+9zo6uqbJpNFA/WyvixCTRX/kD7zIE3kiT+SJPP+L5y/bMCbnlj6nlwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-gruntfile.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC2UlEQVRo3u2ZSYgTQRSG2zEirqCI20FBcDkJgkQcPAyCgqAgLgcVVxA3BhEPooImnYQYIi3k1uhFFHWiB8GLMAcZBB2YQVFQcBAdRBjcEeM2I7b/g9fQNtNO0rW1kIKfTtLVr/4vVdX9usqyFBbP80ZlMpk9ULfrumMsU8VxnHEw0ZrNZjfjuB5aROaGq4tzS1HvNH8+C3lQn3++WCxOIYWvy+fzczk2AW+C5gkbR5DZkAvV2EhQL2C0HceUXz+Xyy3E9y/QO5xbFag7hO9rcOyEfvnmuIfIbO8w8Un3bdteFss8zMxHgLcRgf9qBJrOwJcDv3+OqN9JdUul0iR8vllH/J9QOhYEdTUu3grdGaGRR9BU6HkdhhxoIoP/q143em17oVCYIWsydozQ4Cfodx0AXsSQDKqrWq2OljqR8W8crdOcDDnSjNNEhvndOD7UCPCYJ/c0UfO7oEGNxsP6RnNQBKDfoHlfH0QAHiQA4LXIxN1iGgAeDsQGoFsZgjwzCPAUahGdyNcMApyXcRvtMAhwQ8h8uVyeYHgI1ZBKzIr7z8+EehJwF3oCzYkD0JUA877uxgH4miCAwTgAZxIEcLFhgEqlMhYX3k6A+et0M4k7kVOcRr8yYJzSmJXSVhf4nbamwfhHtLVR+AkckRsd15D77FO2vGLb9nINPbBaGQCCr9AAsEH2sKGUuo0B1moYQju5rVZoh5B5Xhv6QbcyhtmmAeAQA1zitheIDBk3EPwgBdcAcAw6EvjNFQF4GWqgV8McCC+O9YsADCXgSfxdBGAgAQADIgBXEwBwRQQg3cB6pyqlRZ8DJw2aPyXrCUy7Ju81Gqe9hf2y04jx6I3DOl5eoMkq86FzCs1fUJJGhwBaoJIC83nl5kMgbdA9Ccb7MDTXGduCpZ1JGNhLCV8Dpns4r1octV1rCoayV5t7JrhL+Qa6BZ3AS9ES638pvLKRspqlWZqlWaLKHyhg38pt7GNNAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-gulpfile.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACdUlEQVRo3tXaPWgUQRTA8Tsunmi6wzal2Ch2FpZBLUQQRAkIHhELY6eIEYwf/7e72ixeyIHinaAc+dJVhIui2EnAEGxU8CuozQlBkkOrFGoxNg+RQ2KWG3Z2B4aF4xbeb9/szuybzeW6aMaYvIiMAI0oigq5rDVjTB6oAwaYBHoyhwB6gKYiprOK2Ag8V8RMtVpdn0VECXiniIYxJp85RBAEfcAiYERkIJfFBgxqFlpAMXOAKIoKwFtFHMxqFoYVMJVVwE4FfMrk5OZ53nYFGOAwUErlo1VEjgBjwH1gFvgArPwVfGf/ASwDn4FXes4joAEEwN6kh0o/EAHtVYJeS/8ITAB7kgYs6gw8JiJngUERGQBOAueBK8AoUAVC4DJwERgCDgBlETmhWZwDviYNePOPq/kLWAIWgHngMXBXj/P6+5L+r/PchaQBT7ocOp39WdKAumXAnaSfQhcsA0aTBhy1DBhOegjtsgwoJwrwfX+LTYCI7E4UEIZhr+UMbHWxcPtmEbDJBeC1peB/OnkN1cWYDUDL1dr/hiXAC1dL6hFLgKarDJQtAWquAP2WADgB+L6/2dIkdtwJoFKpbLAE2O+yCtG2gNjhEvCyW0AQBH0uATMWMlB0CbjeZfBt1/Wh010Cpl2XEovAOd2paa0x6GUtbD0ESmmo0h3SOtFT4BZwGxgHpnT/bBy4p8hJDX4FmEhNTTTG1f/TPc/blqaqdDMm4HuqtqKAmzEB79O2L3A1JmA2beX2SzEBD9IGOJWJd4BVAMdiAoK03QP7YgKGUgWIoqggImeAL/9b+wDXwjDszaWx1Wq1dbpTM9cRdF3rqdY+CPkNTQ2NMNnSG5MAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-haml.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADK0lEQVRo3u2ZTUhUURTHRyuiKMgIKhJDCNuIfUlgbVqEFWEfFmQfRIsoctGiqBYZ/M6dGYZp4WJIaaAPoiASrHARCgZaGBSFREQtEkkkstCS3Jg2r801hmHmvTvjvPFJc+DBMHPfOf/f/Trn3vH5DA3YLCIXgFZgEIgBAd9sMOABYCV5RsPh8OLZANCQAsACbnoeAnhhA2CJyFGvAzyxAwBOTTeGZVkFInIGuA3UtbS0zMkmQImInLcB+JRpwEAgsArYCPQk+OwJBoPLsz0Sz2ym0aEM/BUCozYd80UptTWbAHtsgvWmO2WAgMPUtIDfwJqsAOigH2yC7TTx09jYuABoMRBvAQ3ZnkYnbYJ1G7y/AnhlKD77iTISicwHvtoE3ZLqXaXUOmDAULwFVLiyrYrIZZugbSneqQF+GYge02uj1s28sFQHSiYgBpQntD8H/DEQ3+9aryeBiNgIuavbzAWihtOlC1iWs+zs9/tLgckUYiaUUhuAzjTm+3YvValT+7eT6Fhc2yUzAVCZRg8nPt9E5ID+/HwmC72uDMQ/DQaDK3ViHAMGotHovBkBEJHdaQif1FtwYVwH3NC/PUrcvXJiuhdNktPnZIUZsAh4GNfupYjstyyrIFdTaCEw7iD+cSgUKnLwU6ZL9k69uN8AZbkAqDbo/cp0fOot+L3O3NVuA4SdAPx+f2mGI3sLGA4EAqvdBHhtMAInpuG/A2h3RXwoFCoyrHEmRKQmQ4BjwIRbvV9rIL5dX4RNAs2m9Y6I7ACCetvtcwugyQlARA7rkbqvv/sJXAVK4vxcB95pwCNAPTAMjAA/XCutgY8GI1Ae175Ci58akTaHc/GQiOx1Rby+DnESP56sRNC3Eds0zJDN+81u7j7HDQDeGvjps6lm17sJcMcA4J6Bn9a4svrffRBw0O0ENmiwgC8Z+ioG9gF1SqmqrF4rpjiNrTWpPkVkl1cve+sNy+dirwK0Gogf8ar4Qp1gnAC6PQmglNpkOH2ueXUELhou4NNeBegwAVBKVXkV4KzBETLm6T/+9DqwO8j0+2aDaZAmoBf4rkvgDyJyxZe3vOUtb/+F/QWrYAFC9IPjPQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-haskell.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACpElEQVRo3u1YXYhNURQejN9IGRPGb1HUKEoTSShePEjiiZdJlLzwwot5uP/dW9Mtl5fryYOUa16mqZk0CoVCzZSkCUURhpkMhvE3rm/VUqdpznfmuvuefZv2qq+7b+fb66y1z9prr71qapw4ceLEiZPJIpFIpA0o+uBGsVicUigUpmF8n/AuWXMgmUwuggGDfsZFo9FjwovFYo34/4Pw9lhzAi8/TFb3cyKRWK68s4T3Op1Oz7figIQJDOggxnUJJ5/PT8e4h/AuWvsKWOWlMGCIGNesobQB41+Et9vmhj5CDPsINCgvQngvM5nMPJuhdJ0Y166cGcAjwrtg8yusAL4Q4w5pKG3C+LcfD8932HTiOHFgUFKv8lKE9xyYo6l6CcY7y0GpDkwFbhLj2pQ3C3hCeFnlLQDeEV4gSv4K8Xh8NSZ+JUoPaihtxnjUh/MH2KpnyP5QHdCXniRK3wMLdYVbCa8vm83OVt7VUB3QULpDFF8RnhiI8VPCSwsvlUrVY/whNAc0lNZCwQipgfaps9s0ZMbjjSLUmjyhdKtUlFsrnSar81Y2qTpxjvAe53K5mbaKPRMOCGKhG68h9L3MEPoHqaE2erJXZUNILzJ3gzaxHFgBm9iLXqlqtSTptJlG+yeYRsdDi85bBnyq5EH2Leggw+8WcpD54SewXucfNe6AwVKinzx7CNRqKHWbdoAVcwMTLOaeyf0BeEM4ZzwHnJliDjezlSbKaWC77qO9hCPZbV01XmjOj/milwn3nmS7arpSvgDmevUiROoC9sOpqrnUI2R2+aTkA0S3ZLs1lWyrdJpoq+D5NTL3tmQ/m42tV0GNLe0CDhAdJ/4n7heH2VqULEYcGAZWGW/uyoEDPDDR3FV97URXt3Bc292JEydOnExa+QtjfGWRTkaG2gAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-haxe.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACvElEQVRo3u2Z4W4aMQzH+cSeoox1zzUGnbTdaB4CxD0B36HAnovb9eBTH6IskTwpNb6L7fg6TSKSpVKI8/snduLLDQa3dmt2bbFYXAR29ubW6/UH7Xihb/ABvthjWwlQC9GCSwS8eGushWSAH4GJLeAIn++9PXg7CARdCVGAB+DNcrn8UpblHbA8i0Lob0f0vUTQGaA54FfAxLiyHAjOGEmvWaFglbett4m3EWOcB00Sb6S7ymq1+uyFf/N9fyFBImCC66ARcMzckr9Hq/kz09ezahul4lEA/xr5etWK8Kv6SX0OcPKAAZ8lwveZ5RxkG+FgP1rg1SJ8n71EwFmbBwx4lQj/+xr1b7p+7IgBR4bwIhFU/HsrUjXKCXWYJGaoEMKzRRDxH3ajYWo2H1GnbQ/wLBH++x179jtWoeoJPikCxX969qOO8648CAMawbeK8P8bi2c/6jxEqzDpEZ4U4T9PVbOPQN/kQY/wVyJQ/BeacmAYFWTVO8C/ERHFv3z2UaJe/rEVA237rwWgEKpbTum+zGWHEEriXUepYQ6fncTENjpN1Eum8MQ22ohWgTjIxoyizwyeOsjYFSxRStSCytUEvqWUOLFWgSjmdsLy2wQe/D+h3845s48faqaJcHN9wMNkfkW/P3VeYbbAjBk546zhQyvL8iPxnP4oeaSsBYnvLOEjv7/xjZ/koX4v3H6dJXxLHoiuVWaKE9xZwbfkAV9AeKhWliHOAh58jbQC6kFGQyJcpq9KI2AvHQh2jSnUMfEhFP7eh5DUrCpcDIuv12ec5YUY3REXUF0mEgS32jIBlOMI+InY3i7EHU4B1nAFhXcOqTzgCKghJO5A/RbHIQN8GFe3UJ43Ah8HeLFxj/OA+5KvEp6sV+AtZfqcuP3j+H5Z9PSaNQluKMRUQCMFp4pHqH5tXnTf2q3J2x967cP6iuAIlgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-html.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADAklEQVRo3u2aW4hNURzGx23IPcqdFFE0Il6QItMw8mDyICIpl5LcPZioc3eOU/NwhocTYvJgHEXGtYhSQsgLRq4ZpTQuuUxD5PhWLXXarW/aZ106++Gs+ppO53++//6ty3+tvfdUVJRbublpoVCoA8oHRB06AG8CBPBaB+BegADu6gBcCBBAiw7AsQABHNUBOBAggETRAOFweEeAALbrjMAqYtYOXXSkdlVOdOZKHYBqAnDb4d5zhwAs1DGbRgBeOAR4pcoZiUSqdMxGEICvDgF+qHLG4/HhOmY9u1hUfWxffDqd7kdy/RXXotsjH1WmsVhsbGEchni2hQV8nRUNkyF9SubkTE/cfIcl9IkJwE1SFWo9IzDVIcANE4DTBGCtJ26YQ4BmE4BGArCnMC6Xy/WQi80FQEYbABe6n5imFbCDDdVIcu0zAdhETJsc7AFNJNdGE4A6YnrFAcBVkmuZtimqy1xi+tABwCOSa46J6URi+gFarKtoNDpZkeu9KhdiJ5gADHRRWTA193rydId+q2JTqdQAbYB8Pt8NJj8dAKwrzJNIJIaS2E5xDaZzs42Yz4L6/xcuakMRALWeHFNI7Fsbi+sBOQ/N88TV+AXAb2f4PEvdtwFwmfRinadiVfkFwPl+pKdcryCxl2wAnPCzweDzEOilD4Dn3vM9Pm8lscdtAKSIeb0qXpQ9fLcZOg99h75AZ+QaGU9yxEiOpDEAEu8i5g0+4CvFQc9H3BGSY6cNgDXE/KTFXbiF5FhtA2ARMW/Dd9vwd5JOrRa/kTdCu+XOrspRYwwgSp6fx9/QYWipuDlnXslkchCgl8sp886H73RjANzAjy5yp/0FXRPzV2xQsgPqoVvQnyK9RtmYn5WleiaazWZ72Vpkn0sA8MnmWf1ZCQBabQI0lwDglO07pjFyNz3HnmEa6ht0Flovcjl9BZvJZHrLx+8NhtPrMXQQHbNAFIuSvVOW558t8uTa2dX7XnFGkk87xgX1BXlfaAl0SL5rbpUjVS1GrvwvBOUWsPYPpdYn+MEEOJAAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-image.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABK0lEQVRo3u3ZvQ2DMBCGYUqyRaQswgLZ6UX0VIySAdgkmYEqHWkoLGQbE93ZWLqT3CFxD6cP89M0gQJaYAIWYFVaH+DeaNTW/Jph6SCUr7w+wj2B0oRRRWgD1BE5AKqIXAA1RE6ACiI3QBxRAiCKKAUIIaoC+BDFAKHdV70HAxjAAAYo+zxmgJoAfd8/ga5KwDiON+ANzFUCgN45tqsKMAzDA/g6x85VAYCX5x7fVQHYguvbpObLA5zghj5UdQnP+hQD7IJ7agq7FxWyAzzBTZ6C51UxilABBIJ7OIVA81GEOCAS3OgUDpoPIkQBCcH1TiGxeS9CFJAQXKmFOOBEcEURYoATwRVFSAKKLwPUCFguBFj+AUwXAkz/AHL86D688lsPbWNlZWV1yfoBkT1wCASXWNoAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-imageunsupported.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABK0lEQVRo3u3ZvQ2DMBCGYUqyRaQswgLZ6UX0VIySAdgkmYEqHWkoLGQbE93ZWLqT3CFxD6cP89M0gQJaYAIWYFVaH+DeaNTW/Jph6SCUr7w+wj2B0oRRRWgD1BE5AKqIXAA1RE6ACiI3QBxRAiCKKAUIIaoC+BDFAKHdV70HAxjAAAYo+zxmgJoAfd8/ga5KwDiON+ANzFUCgN45tqsKMAzDA/g6x85VAYCX5x7fVQHYguvbpObLA5zghj5UdQnP+hQD7IJ7agq7FxWyAzzBTZ6C51UxilABBIJ7OIVA81GEOCAS3OgUDpoPIkQBCcH1TiGxeS9CFJAQXKmFOOBEcEURYoATwRVFSAKKLwPUCFguBFj+AUwXAkz/AHL86D688lsPbWNlZWV1yfoBkT1wCASXWNoAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-indesign.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABUUlEQVRo3mNgGAWjgHqgoaHhAxD/GOT4Az4PgBT8H+T4x6gHRj0w6oFRDwwDDzQ2NhYC6QwoXkqGQ6bC9EPNonsMCCDpyyDDAz5I+gVGPTDqgRHigTdAfAKIDwOx3VDxwF8gnt/U1GSMx95B64GXyCE91Dzwvrm5WROLHSxAzDEUPBCFbDYwCRkCxXYA8S+ovMdg9sBFNHNtgPj7UCqFipDkmID41lArRi3Qks6QqwcUkOQ8hpwHWltbJZHk7IacBzo6OviRkpD2kPMAsPxXRyv33w0pDwA7KMlo5tYNtUx8EkvtO2NItUbRYwGqTgEoHgyk/dD0D8qmxHegY92JGZPt7u7mHqyt0T9A3IZcKmGxUw+I+4H4H709cASID0DxLQJqvwDxeiBuBOIKIJ4AxGuB+MrouNCoB0Y9MOqBUQ+MemDUA8PJA0N7onsUjALSAQClb3a2wFtDhgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-java.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEOklEQVRo3u1ZaUhUURQ2M5NoATPbjIiMiiKjghZNfyRRUUab/Wixxags2pM2aMbRaYZIbArLCiJICUMDC+1HKxGVbaJUWKTtmxVUlKbp9J36Bi4vJ0ZwxvdgLnw85/rmve/ce+453zkTEODDYTabZ5hMpsAAow4YsAAGZBjWgLS0tLEwoAHoakgDQHwc4IQh0UZ1oeViAK5TjboDJdyB0UYkHyvkga9AsKHIWyyWASD9igZkGy3yRIP0e5KvAsKMdGiTQPgnyX+BMcMUl4oEtgDncd8svfl7ILCXxJ3cgVH830igEGgCbsG9huqNfDBQoJCv4moHAXYSl13ZkZ+f315X5B0OR0dXqCTKMzIyeuMaClzn3Ftggl5DpVUh/wQIF9kA3HaRT09P76dX8iOoc/7Eevj2QM4Xcq4eiNFzokpTVt8mczabrRv+buTcZb1nWtWAeOaAKGWuUu8GxCtkE5RY71SQqFsDnE5nOxC8SqKHlbk3igGvdV0LgFwfJq16HOLBzMabNbuQpXf5MIkHt1g+S7LC30WKAWVG0ECracRiJRp9pwHFRhFy80H2nSQzutcDVmNJ2ntllxCxxkvXQhV8vji0U4ADwDWgGjgr2l8TmVIhJ3riWgdc0LZVkJn70rgfipuJlgrxmljDSi11rShQgc8bQXyQm/sjaWA20Mm14iQuynSfolRjgM98rt1bBqgHspGfjwsRGLIT1xRgIbAK2AYcE78H8hhmnymSoxwuM9FNQnzuzQpLtvgh9Y2zBagBbgBmydJuFsjsVQM0LxONP4Qr7wCWAMnEMszPkWJeihZcO3vwvDFALQ1Y63UDrFZrd3EDukW4J5WaJDjx/Wb+10sp/AskSPgiVO7WlI2lwGngkGRcYD9wgmfgrpIL5OxkYQF60C3jWLk5eb9v2i5CAC+72MJzIHgk4RcLMJOGNtH4hLbSQOK7ySC0VWoB4ChwklfZhXQJvZKspLxUvpcg2VrNHW2lQlNYNsb+717qIn39PsCYr3YgzvEM7JGVBzKBXIbPb8BTYJ0nUclXBkQoHQdPIYc5Kycnp4Ov24RxXM1qkiiDb88T16Duv8NV1hL+RelxBPctclfUYH6udOtanTjFWC7JfKR+GU6f/ifk2e32LtA6/aUzwb5QkCc5AsatYPs9qlUrNzzspcbPRa/Mll9cpM/jCUFN2zGCESkR2AAc5HM/SDSTBXCVpa1lgEUjd7VopPaXZlYFI5Io0EvATc5V8Z6GZtyrlO8Iwy6sZPeuoNXDpbgFHjwZL1lP7VNCso+Zies05Bp4JmpowBVmWrP83MRfLafxeWeAT/zeC3mXNyNPKNuI96Q9zoRloajbhet2lpUi6jaZ/o5MSuuiZgoYl2vm4XtrpAT1VQh1bfkp4D5JVHPFaxVyTYxaMl9JoyVXpALTPRGCbTIYpUIC/MM//MM/3I3f3U12Dc4g/rkAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-js.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACg0lEQVRo3mNgQAN9fX2cDRBwH4j/DxIMcksDyG0M+ADU8UcGkcPR8RG8noCGPEjhp8bGxkQgrQDEMgOMFaBu+QR1WwM+D4CTDUgDwyADUE+AkxM+D8CiSmGweQCaGsDuI8YDMoPQAzKjHhj1wKgHRj0w6oFRD4x6YNQDox6gsQeAejkaUEEGNnWrVq1iBsoFAfEsIN4OxJuBeCKw2ew8oB5ob28XROtFXcBijxIQn8fT89oyadIk9kHpgY6ODn6g2AMiuo+bgJhlIJKQED4PAJNILZr8TyDeAcQHgfgvkvgLINYadB4A8o8hywM95Iok5wHEv4B4ASgmByQJtbW1CRPwwA00eRZk+ebmZsWBLoVECHjgBJp8wWArRtE9cB5NvhVLhl0HxAaD1QPnkOVbW1slgWIfcJQ8R4HY7////4yDyQNnsIzxuALFv+ApQveCPDpYPHAKhzo1IF6NVnQi41dAbDIYPHASn3pgqaMObU5gi5G7M2fOZB1oDxwnofidhcUTfgPtgWM41DHhEJ+Opr+ZZh6AZsYEZLGWlhZp9CFxtCSjCRTbCcRdONyQhqa/h+oegBq2BjYU39TUZInkqWo0B2xE0tcNxL+R5NqBmAtJXgJU8WGr6KjtgblolvyDWnwJPQ0DPZSOpG8KljT+GYgPA/EhIP6OJvcbGKPytPAADxBfI6JJfAW5XQ9iA8V2ETsjA/R8Pc2KUVDIQNvsuBxwFqhGFl0fqFgEyrUB8Q88er8BHV9KSUWmQEKp4wTEk0G9KCDeBk0mAaAuIz59wJpWHOjIbKDa+UC8Fap3EVAsHySHxR6iJjiG/BTT0J7kG/LTrEieGJoT3aNgFIyCUUB3AADpU8Hbw50OJgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-json.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACCUlEQVRo3u2ZTUsCQRjHRcg6V5BHu3iJjLBbHspudvMTlCeP1SfwJSXQ00qCJ/XYyU71GepQXe2kIAktnfQQEtj/gScQcSXWmXUXnoEfM+7OPC+zuzP/QZ9PipTllEwms5nNZk/AJdpVcA+eQReYYAh+mCFf63If6lvlsfFisbihPeBarbYCh6dwWAHvYKwYslkhH+RL5UwHwTXoawjaij77DC4afAoM5jj6AA+gBM5ALJfL7aIO0WuBOkBwO8T3Yty3xGPnTQz5TtkNPm1h9BvUwRHwK3jCfrZVZ9uzfKbtGDZnGcMsHur6zsi2RQKmnQTGLkpgrCwBfswNrBbHql4httWY8wopTWB6tXgEZQRxzh9oJJ/Pb9M+YRjGKkFtvhahPty3zGP/tbrpSsAxJAEvJmC6KAFT5Ua2DNK6pIRu7EsJz4s57Ir7kxsVSVz8TgADtDUE3WbbiUk5TTFQLHZmvgfuwPqs+6ww43wouQUt8AQ64JMf/9+BZsDXOtynxWMuaBe2OtCQb46ht8gy+gVuMAs7Tp32yBf5ZN9K94EXnnGSBAGFh6YAgt5DfQVendrIRuANNNlxks7IqA9AuFAobKFeI7gdpnvcJ8ljmmxjJDuxJCBaSLSQaCHXaaGoi7RQ1OtaqC9aSLSQaCFJQLSQaCHRQp77k2/6b9ZlaCFtxQktJEWKA+UXKS+VPVPFQE8AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-jsp.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADAklEQVRo3u2aW4hNURzGx23IPcqdFFE0Il6QItMw8mDyICIpl5LcPZioc3eOU/NwhocTYvJgHEXGtYhSQsgLRq4ZpTQuuUxD5PhWLXXarW/aZ106++Gs+ppO53++//6ty3+tvfdUVJRbublpoVCoA8oHRB06AG8CBPBaB+BegADu6gBcCBBAiw7AsQABHNUBOBAggETRAOFweEeAALbrjMAqYtYOXXSkdlVOdOZKHYBqAnDb4d5zhwAs1DGbRgBeOAR4pcoZiUSqdMxGEICvDgF+qHLG4/HhOmY9u1hUfWxffDqd7kdy/RXXotsjH1WmsVhsbGEchni2hQV8nRUNkyF9SubkTE/cfIcl9IkJwE1SFWo9IzDVIcANE4DTBGCtJ26YQ4BmE4BGArCnMC6Xy/WQi80FQEYbABe6n5imFbCDDdVIcu0zAdhETJsc7AFNJNdGE4A6YnrFAcBVkmuZtimqy1xi+tABwCOSa46J6URi+gFarKtoNDpZkeu9KhdiJ5gADHRRWTA193rydId+q2JTqdQAbYB8Pt8NJj8dAKwrzJNIJIaS2E5xDaZzs42Yz4L6/xcuakMRALWeHFNI7Fsbi+sBOQ/N88TV+AXAb2f4PEvdtwFwmfRinadiVfkFwPl+pKdcryCxl2wAnPCzweDzEOilD4Dn3vM9Pm8lscdtAKSIeb0qXpQ9fLcZOg99h75AZ+QaGU9yxEiOpDEAEu8i5g0+4CvFQc9H3BGSY6cNgDXE/KTFXbiF5FhtA2ARMW/Dd9vwd5JOrRa/kTdCu+XOrspRYwwgSp6fx9/QYWipuDlnXslkchCgl8sp886H73RjANzAjy5yp/0FXRPzV2xQsgPqoVvQnyK9RtmYn5WleiaazWZ72Vpkn0sA8MnmWf1ZCQBabQI0lwDglO07pjFyNz3HnmEa6ht0Flovcjl9BZvJZHrLx+8NhtPrMXQQHbNAFIuSvVOW558t8uTa2dX7XnFGkk87xgX1BXlfaAl0SL5rbpUjVS1GrvwvBOUWsPYPpdYn+MEEOJAAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-jsx.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRo3u1ZS2gUQRBdfxF/i4iKHxSJ34OKH1AvBr14UfSopyCo8WQievFDcD+zi5OVFRYF92D8nMIe4kly1LuCQSUqQRDUg6IgGhRFXV9BNTyGzixrdncm0AWPmamu7q3XXdUz25VIBKRSqUxLp9NnU6nUCPAHqEaMv8AofLpYKpVmJsIEhtOBoRg4PR4eAG3jEtCZN8avgD7AixiXgefk14WwFRhRo5fA7ERMREIH/jxR30bDCJiY9xMxE0RHr8mJMAJmmby4EYBP54x/joAj4Ag4Ao6AI+AIOAKOgCPgCDgC/00gk8lshc0BxTLLOJvlFAHXq0B3Lpdbaul/XID77Zbxd5r2bDa7vuEE0D5AtkdI3wb0W04TfgBdxg5OrcbzL217XS6XZ5i2YrE4C7r32vYVWNhKAn1hxyJYlUNke530p+i/73nSX2pKCNkI6OyPsVMaCmZFBjmU8LyE7D/6vj8P1wXAF6MD5raSwCrSfTK21Wp1CojslqtlHI/6ZIArNAE9TUtiG4FCoTCH4locOGZzOjBOUshqnzHNFbl/EzxGbFUO3A3E/SPgYBgRtJ+x5MvRpm6jIQQWy65icWhYiIScur0l2xfA1EgIiOTz+UW6Er8tu1CvZSwh/Y3sJHmTkREgm3bgBvAzcFS+LmB3zbJiucgJGPE8bwUdGgu6aZw1lPjvgA96/x39ljeEgO7vXVI7IN09CovDZrsUMkApmLRyWExjZ0lfIX0nxjpJzzcnTADXDk0q0Q3gE2CtJCNtd4JdanuHdLex92/CdaW80GRGifAJtd9B9o+FtFSHcP9MdZJDGydEQGa3RsXkqZlt+ejC8+ca9hIi8/W3HpK+g3zYR/r7jQih0/yCIsjWtyHQf4uWgWzOy/a6TSdmP+kHLX4M0YrtrYeAtcAhO4oWGCRM+jUskrYxNBf26IfdLaAgYcdfnPKW1s8GQXtwDF1N095ZT4EjziWm4ZolppgW+fx6inyTu8wqMqkL3U6cOHHScvkHlmAlCLqNclYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-julia.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACwklEQVRo3u1ZTUhVQRQ2Cwor+9FcGUS5sG0EbcJ1LVKCliEuglz0vwkD877/+3gu5K1ExUXtni3bCFphJGQQ1cIgiKhNkFS+tD9Jn9+BefAW8+bO3Dk1N7gDHw8ec7/znbnnnjlnpqEhHvGIziiVSlsTiUSP53l3gDfAKrACLAKTwCmgMZLiIaxLCK0E4DlwPGriLwHrGuKrWAPOR0V8r4HwWmwA3a7FHwZ+hHSA8AVoc+nAXQvxVYy4Er9XxLKtA8vFYnH7P3cA6fIsg/gquly8gVtcDmAxLrpwwGd04KaLEBr839/AOcZv4KQLB1qBPwziPwDbXKXSKYbwGXC2kaVSqaOWewGt/n6n5QRW8HJI8WvJZPJEVAq626a7Lxw/E7WSuht4ryF+DqF3JMod2WmILIn4pu/jl+jOxoBjrle5sVAo7KxUKlu4uYnzrxR1EH0IyACva/I+rewLSoHZbPaABXcnMAy8qslm9PtS/N9pI3wHMKHRKv4GchQ+BtzNwLjoyoK6NprXbCq+XTTfJpnlEe3OQdzpdPqgeJsm3DS/XUs8xSEmPwuZ22dUxyb5fH635smFDIv0vM7qj1iWBoMK7lHL0mM0SHybiGkbI2Vgl4S7g6H4o+c7VGXBAFN53C9xIMPEnVG9gadMRqYl3AtM3AsqB8pMRt5JuL8xca+oHFhnMrIk4ebq3jZUDnxlMvJWwr3MxF1WOfCEych9Cfc8E/e8KgtdZzLSJ+EeYuK+VteBXC63z/KwlvCZ6qg6JYTtUeR3OtIM2sxSljvxVQX3sKUDnlZTgnkPQxqY0qhww+4HD7Svp8SZz6yhgXuyEqIOt6kTM+g7WozbQzyYFnGnIqfUeyNEr+GLC0AVN10SelYXg/TRUFzj9zHwCfgJfBSl8wWgKSy3KK/7RcguCW6yMQdc8X1/T3z3G494xCPaYxNvVtqHHxt7sQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-kotlin.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADZ0lEQVRo3u2ZSWgTYRTHW6vWBRRXUNRDERRcDnpRD3pxQVEEtQVXFLEevCgovYj83rRpK4EgI62GIAoqSuoC7oqC9dCqIIiCKNqCC3U5dIFa40LHgzMaxqSZ+b5MrJAH75DJzP97/2++t05BQV7yErwAW4EHQI+tTcCGbOHH4/EioAw4BlwBYiKyGhigBVxdXT0GuARYabShtrZ2pObmLAWepsFvqqmpGaUDfrEP4x09qYg9HbjqAf9mPB4v8r2AiKz1AO7oCh+GjwYOA9+94ovIHpUduuODwOVMeNFodBCwG2j3gevoYxUC730s0Jrhba4CXigY7ug3FQKdPhZ4lwrDMIxZwG0Nwx1NBEmgTUQ2u54dD0SBH1kw3gLuB0GgB6gMh8PDnWdM0ywWkQqgK0uGO1qebQJngCmu+9cBrVk23AIuKyW0NAQeAAtc53wucC8Awy2gXikHpCDwFthkWVZh0v8TgRNAbwCGPwEW69Y/ncBnfskw53okEhkKHAC6AzD8I1CuvOsuAnXAJOe3ZVmFIrIReBOA4QngIDAikGrUMIz5wP2Azvk5oCSoMnoKcDYgwx8BCwPrAURkD/AlAMPbgK3JASGo3b+bZcP/Snz/C4Fe4HRVVdXkXLeR2SDQDMxz4ZYAMWBqfybwWkTWuxLfCDtUfrXv+QDM7m8EuoH9kUhkaBLOQBHZCXxKcX+HuzT5VwR6geOhUGiCK5It6aNh/+3cIrLsXxJoBOYkP1tZWTnNriI9d1xAWa4JtIjI2hQN+yE/DbvrLZbngkCXiOwzTbM42UGTIkyLTuQSkYqgCPwAjgLjXQ66C3jrXAuFQhM8nPtMelA7U7sI3AJmuhx0OfAsVdNtH6VmTRIxrbLaJvAcWOmqTGcANzJNDcLh8HDgpiaJBmCwajG3JBqNDkoiNBaoTzNpSDn2ME2zGIjrHifdozQY2JuhyU9kmDzHdGopwzAWqRq/BnilO3iyLKsQqNVpeoLOxAmPx7JCkcBLFQJ+mpl2H761Q2GS0apC4KGPBRp9BohSu3zwin9FhcAWH9mzVCHKLbPHNl7WWKjqxNc9gJ/XnHZ0ZMA/q/ONbBxwrQ/wC1rfsP6M4NNFurrkmktnQrHd9omE7dzNwKYsFo5DRGQbcMr+bnZEe7SYl7zkJS85kZ+stmHskGyEcwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-less.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADL0lEQVRo3u1XXYiMYRRea6215CfJ+gkXbnAhciH5u5AULmwhXPhLm5VSXKyEnf9ph1EjatrSFm4mGxEiQomNaEMIRSza8hdL0ZrxnDpvnU7vN9+Y2ZvZ3lNP38x5n/fn+c55z/t+FRXOnDlz5sxZf7Dm5uZKICdwoqwEpFKpwUpAW1kJSCaTQ7Do3rIVwGnU4QQ4AU6AvwC01QUCgc14hgD8DKyNx+Mj8o0dDAZngLcD/AjQBNQD04Fqy/iTwN1K4+O5H1iH/rMSicTQkgTANww4DvxRJZfQg4k2WvqMB65b+Aa90Wh0DHNrgZPAXw9uFkIWFSUA/0cCD/MsxOCQ6FMDPPHhvxX8sz7cbN5I+whoV4N1cjocBT7JNkRiJfdpVH3OAXvID85BPC8Bp5k7X3HvgLMX2E5P/M8A94pKIfyeqwZvyeVyA0w7pQB8T0X7Ze53Rvhu2eY047Agw/1g2xtyzv8V0Cr8lBKVlr7LBOcL+y4K3zWfuWOC25XJZAb2WRWiPBX+w7a+iMJoFaWpQFDvD9pLHnOvUdz2cDg8uWQBtGnUwJTvzy14qXgrgInAd12tgDSVUDV3NfBCVyjeewuLFsBvMlcE6rn/UuCzB4fe8gQzfygUmgbfKw/ubZTQmcUImFJgBDTmiXGHAweAr5aFvab0M9x0Oj0IG7pBpa3Bj7wiPATUqGt2SwknPZ0lYVqIWljK9n0CITvR9lFxbxQqICX8ncJ/t9QrC5ddOeabPGuqVQec92GGxgeCeN74VY0mbOqDe1dAjPctHxfzr5bze1YnPhnlQnfxpyaFvlv46a5yjE5P2oT8RmdzyNvExBtY/BK6R5nDiAvDYzFeB3J7AZ4JvuTVmTEikcg4dZ70eJ4RaNxi2Tj3uW19oRXIVBaKogw98Mt2UWPh+sz4rfaeQatnqEgZCFdUh1Pija7S9x4PLGYB3QVwL3jMa8OjWCw2yi83qyjHecAuLHq3bEdIx8K3D203RX3PcrWgUDdS2rHg5fh/hCoHl9CffM95BlxF+zZzLcFzDkeBovaOD7z3fMeiuZp8vweK3IxVtruRM2fOnDlz5syZM2f93/4BSRDnyamxAlsAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-license.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAyElEQVRo3u2ZwQ2EIBBFPVoGpWxpFEFBlmINNLASo4aMXHadj5q8n/yLJt95CHNghgEhP8UYx+JUnIu/Fz0XB5MftudXs/NW52gBkkN4E8Kx+NrJAmTnD+wQH0Hx65+wAMdLh+3YWvHTtvozu12nJ0AFUQMEp9w+AN0zAQBABPBre7srE4DHAnCIAaALAUAXAoAuxCGmC3GIAQAAgA4AirtRpbP6dlrtpJwPSFe+OR9wHpbIbqd7TnxqiHcVbyCmVxaPEEIIqbUA87kwQN2jxUsAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-liquid.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEXklEQVRo3u1ZCUhVQRQ1s72sqLDFoqAkqcAWinaCIqM9imyFkAiiqLCgxcj9u4CFmfmlopXAoqCCyswCW0Bo0axoUduIjIoWNVPrdy7c4PGbeX/+e6P9wAeHecvMfffM3Lnv3vv8/DQeiYmJvWJiYtKBMuAnUAKM8/sfDigaDnwGvgGHgGigCvgCHI+NjZ3vcrla+KryU4E64B5WIQhtF+A84GIQsV/AhfT09Ha+pnxv4CPwlJRPS0vrgPO7QD2wjpQGiuPi4sbzauT4GoEsoBroz9fZPOsL6Bqms43I5ObmtsR5JK1EQkJCX59QnhRh00mk6/j4+FA2lUwDwQgilJSU1A1td97cRcBWrMowtB3/5ezvAz6RzfP1bjadnoY+C3lF8oFaw77YjhVZg/Y6mV2TK5+SktKJFUo1KPsIuAb0g3IbSDmecZc78Hw9EMXXBThfAkzD+QggsClm/8/MhvF1CNAA1IgUFhBYBeySPM9oCgLH2HwSgIcqSrsRWIQ2TfL8UqMoTZ4EwicBe9jzuKwCBGag3S95/lz3bIeR/wbe21HaCHigibyKoucNTqezlU4CxboUNxAYjvasSZ8QLcpT/AJh33UTwDdjENorJiY2U1eEGaSo1BvASe6T/fs63qQPRP05cr1tIm+jFgJY6jEeFP8ArAQCTELsv8bxd6TURG6mLvuPMHnJU/poeRi/VjLWH3hhIvuyLgJbJS/4CgxUGF8gGFvFzz6YECjXRSBbssm2eBqLAK6HJJR4x7JrTQjQuNY6CFwSCK91j1dAaBnuVXLyUsqBXqrsQ0V+XsExDNZB4IlAcIEksFN1o/c5a/PUb5Zd5f0liuW49QtUDeIYN4BghXBjk44qg0h4toDsPC/iIzLLwQr9sux+A8ZKBOdLVmwou1ZPip0GRin0u2LXhJZKBFMaGSwZQ2njYw+KHYZ5TFEgUGGXwHYT4RQGtDfJlV+ZjN0LArMVCPzMyMhoY4dAjocXnJO9AM8mmIxzUAqpGPSF2iGQp/CSQofD0VUy/rHEu+wAVitu+Dl2CDxTfMlFyfiTEgIUsW5SzNyi7HwD6iQBXL3gfndJ2UWkVCSwU3Fy9lstWvWRvHw+lz7uGO5XivYC7h+UyFiMNkWRQL7VFRBtwjoKGwyZ2giyZWy0ARIZJbJsS7Y6Ary0SmC5QFieF+NHm+TDk9EeUSRApcq2VghEC4QVJScnd1as2hWbEBiJ9owXBYAhVggckGVhNIMm4cdwBe8Vouii/5jcXCsErnoQfJOSGmA6/UaicjqX2n8oKEX/FG55Eb1utkKgTHcpxYBA2QaXwGmFABWd3jYGAS5RlnsxpsBuXSicA7tTlA7aJFDDE+RNmfK11lopeSJ2hRuBo1y8alBU5j0TUMngyBkcpUJZo5fb6e8j+X6uymXzbyRRSbKcTcj9fjX/EHFQAEcVDV/4ARhAWRpIreDfT6RgIW/iCuAElSDpu6C1Gt18NB/NR/PRZMdva5K5JoPuVcAAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-lisp.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADDklEQVRo3u1ZS2hTQRSNWitWQRFUqLoQigu1C6HgQulCKUIX1U11IyiIK3GjG0UXSZrEYCSLrAyCoIhK/MS4E2rRohZBFD8rxaIiKP7Qqlh/ieeWefAY7subeZP3eMJcODTJzJ05Zz537kwTCWvWrFn7b6zRaExLpVJ9yWTyLPAK+As0IsAEcAd9H8TfBYHIZ7PZxXC+FhHhZvgA9GuRz2Qyy+D0IgbkHfzBbGxUIo/KbcDdGJF38LpYLM72FQClu2NIfgrgtotGuBOokSLgQi6XWyjNwAPG+TOc96bT6VX4vDpMoI9u9DWIz88ZHleI4Ij041WHPInhlKPRdVFHQPTbRWtf4vKUCupyyHKcQHQtI2DMrzMSDt81qNvTBCsCiHgo74MEtzxcDuvZaWOsXC7PxFTvQfljjXU8DHQokm8H3kv+j1oiQITZ+wE34wE/8jQ4qFdifE8bCxD7ZNwgmpxiRnsRZvOQCC63gDceUajPWAC+VwxD4Q5pmewDvij4XqfUxkiACHWepyUw2QSUEqSnSIg8C98vKgr/TYHAIWEiIMmUT9Ko0rrVjDCHFcmT+K1uRxMBNaY8pxsexYFY98t/gCqwUlZuImCEWdObA8T3ox6kzwADQG8+n5/n5WwigNvAmQACbjLtHFN1DiwAo73fY41ur1QqMzQE3GPa6QxdAD4vFRGBm/5f4uS8DQzBlusIUEqVTQWIOkWN0DcETFecgbmRCCiVSrPw26jG4XUyVgLICoXCHHHRVz19t8VKgKt+L3DeK3dx4UlUAnqY8nMq7dJJLA6oGx4iuqIQ0Mbk9/2aMX4+8JXpZ6BVAupM+GuX0uUcbT6s3U0Br4NjzD4YbJWAt4zzzhbeZTuAj8y9uttV54RUPu5kqSodVBkB30mEbkbJ3Y3RziWm/W/uk1rUGxZlz+gurjNCW5pEix/AJ9oXAeH1dlrzuvcqj7z7wdYjmQoLP4O8SPi9fS5Boy8jEnAklIcjIWI0ZPLHdbLUQO//Yk9URXSqGxIm/3fAZWCD/Q+LNWvWrFmzJtk/O9E1UPLr2RgAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-lock.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABUklEQVRo3u2YMU7DMBSGs1EJbgBTLsIFEFyBiY3SiSHT5yiIIWIgisRCb5KzMHRAYU1XmrIYCZCdBst10ug96S2R8uf/nPdblqPIYwExkAAVUAMb3bV+lgBxNLYCzoClNrvd0RtgmWXZ6SjMK6WugHUP4397DVwOvfJzoHUw/90tMB9y5bceug3+J/TMd43NO/CilLpTSt0CJbDqGqegmdCBtZl5zvP82PDODHjsCPprKPNxh4mLXe+naXoOfFp2pzgEQGIxX/5D48GikYQAqAwf/gBO+moURXEEvBl0qhAAtY/5BZ4MOnUIANP83zvo3JhyEALANLsLB51rk5YACIAACMCvs0sJNJ5OnS7daA8zF4ByQOPOx5SfAM2IABpfs77/kFk8CMAkAfYNJgCTB5AQC4CEWAAkAwIgu5AAyC4kIRaAyd5KHPy90GHfzElJ9asvQ/SQ2hN6cxMAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-log.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAsklEQVRo3u3ZsQ2AIBSEYUrGcFSGYEBncAGloLDQaAx3oP6XXC0f8kJBCCdJKcXSXLqUrqLOpVNQpC5+NVSDEO+8HrH/gOgPJylCDZAjHAApwgWQIZwACcINaI7oAWiK6AU4Q7wKcIRoBmh1+8o3EcCoAPMcAPgeQHHWAfwKwBADGOQmvrM4AJ8EMMQAOs4AAAAMMQAAAJwA5yPfVZcngDwQID8BOB66L3e+riEGQggZMhuPXhCuYgnwTAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-lsl.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEhElEQVRo3u1ZfWiVZRS/2RLDyLnoQyM/McpUCHEqZloUfm1pta0MkURUmvmHQ01IaLu7+6ixEX7NiYIfEDpLDEbknJYYpWAKIX6ii0Cm4RS3YpuW13Pq3Pj14332Ie9zmbAHDvfe83ve5z2/+57nPOecNxIJeeTn56eIbBNpEimO3G+joKBgkRgeT4j8nt3tjKyurn6wpKSkv+MJrCUCn/CceDz+gOizRd5MuvHFxcWPi2GnzMAakT5EIIYElFAAyc8Az00qgfx/Bxq4mPA8wr8IWKMR8IPJJvApGbid8PcJ30/4o4TvTjaBLDLgHOFvEH4c8Wg0OprwsqQSiMViz5ABd0TSgMBLhNcTwQza5MsCwvAEkd4+n8JlMnImYCMJa6Ywu9QVZuV3L5HDhn3tk8BeMjIK2FOExfHf5D0kLvUiuNdYwNp8HlYfkYG1YGBvJlBUVDQA8F2ISVh+DNZdCdhRn09gKhl5Ux8/4DcQLywsHArYT4D9Set+A1iJTwKPiPxNJJ4D/CQRGA7Yb4Cdoc3bDHtjmu9wepIIzHHtESEwArA/ANsD/j8R9LfKysr6JvtAWwVYedDTqaqqeoj0a8D/Pwb9j8nIOl8hY7YAgQ8JG2n6JyiEZsI1tYD5T8Pt32yGmx4BcrOIwCgz8lnSDwrKj8SdJoftLqOC0mc9bMCYq+DPL5ChY0w/HnTXYZ0hoL+CES0sArdMouRGH6ChpaWl/VSvGzDosJLv00H/Paz/FugrfWzYa+C3sxJ6je9k6Di45iroxxrhuUF1AtUQr/kgcBFusI+w80BuLuirTX8j4X6CL4C5CwMOMP2jUnwQ+BkI3MbsU0tG0/+lvp/QV1RUPKypN57CmjaI7oDWCCKpsH6DrbHVV8w/SK4yGetbzUZFXnVcm6YkzN3SHHMavLmP3eArV/zmYZFGD7JjdOr+l15bPlQuc6dYjTFYvk/yeepubY+AdRkyBfshwOCO5Be59nXfacPnrrzHuhR192A4S3no8R8IROkJvG3uMo6yy45Ey8+jtqcaAnBvm3gFEXhHT1eRVtA3Wg6U6zD+dsLn5Xu6puSyzgytmWnthT4ILCZj1Mg58PuEbMSnbe4OB4FLELWuJSouqdaeJBJnfRB4l2tg9Vf5t5Zr5kgx/ZTLhWT+EvnMEWnBcpJ7SRJynw+bwEwyZnM7cy90YU8MczQC5oVNIL29bhvN/baTxrdhX5VK1LywCaRaBEncoMV1quom7CSBPZR2OJtdYZE4QQbEHPO0OXWoA+ObqE5+mfAMHwS469yaSJMdXYsvHcafxmaWzd/pShZDG1qsYI5v8rv2QtshrT3OUnvlpCdthr4coTnzyT1rfBby2UGbUfudbFgnnqi62mruL2l7xXdeVOlwjXp7+TFGDyvX9bZhcwL2lMoG790IO0mrOtikmlZ8py8/RNaLbLQK7TilH/8LzV5b6gHupOnz2RCy0H8OxqQaT/3MLGtK3emi0er7ddogi3SHIcYMtJxmkxU2v9rL7lb7rDe3WifyntYRkZ7RM3pGz7jvx10K6/vWNNOXkQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-lua.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEO0lEQVRo3u1ZW0hUQRje7IKVldmFsJCuRGVUdr89JFpQT0UJrbWGdHkJIegpItZd3V3b8jkL0gwpfKjsbpoZEUFl1kM3zIgk6KGCEnqotu375T8wTOecnT3n7JqxAx/nnDkz//z/zH+Z+cflcrBEo9FBXq/3IvAKuKnV470K6AZuAdkqdHw+38ry8vI9wHb0meRyuvAgy0G8DigTmC3DoCXEgFCXC3iASmAY1eH/arzXAktEun6/fxbqOoCogB+AH0hzTAAQGw9851nNj7c/BFjMfaM0EUwzC+iRmBfhs8t0BgZbK3xn2Z0IzPg0Wk2m5zdhXluJiZYGAuPz0Pkl8Fgb0OkC2g9jCEAoskrcB1wIhUJjzNSK9B/Po8BZ4DbQyu9U5wkEAuNM+j9XEKDUstHqzXxjY+NgML0ThO8CEQUGfgHtgFs2Snyfj9UfmrA0Hv2cg04na2pqhur9B+Mb8P+ZAtNGeAIUCAKsidH+gbL6VlVVjWKdb5I70ayj/rgNxmWEiCYLcdCgzTtgejxGuwAd2oBMHcGu2WS4F3gNfBXqrhJtIUY08OreB46Y2Z5y4Zm/boPxHqjdZjyHCPQ2Am80IbSVsOubZxh4ibAN5j9UVFRMNgmK3dwuqPM/Xdl9kpWzN8mWiKy3ozaY+WKzcfF/k9B2nTR2Lv/LU/H3tLdp0VGdpzYEINc5QkE9v3H7RzouluyxVkWAInJnUp3HptF+UgyW3UYRF99zgalWo/A9mwJENA9jMsYw3hxqfVqsMJou1yH0T1CMsLGwN4YNbJPa/wwGg2PFNuQEyL2bCdAMHJIIlzgUrD7Du802GDeHvJROH7fULgRcMROgixh20HXK+AL6+7SgFA6HR6JuF/DRoH1A4qWUTntmAtRjiRZJdQ0OCqDhNwmjoJp1Ei8zgd3x2sWdBAigihbbUXlACYAOp4GFSVAhVcgqlE875P404nihZ8QvzASgLMHhBLlRK5Dd6A7ghKEA5NYMdoqRfmD+r0Bmx5DbB4wHQsetdCKS1Ki4HwQo0tluH1MRoF6Wnra2QGcSmdfbTlN65pTKgYbynRH59IQZKEyWADoHmgzgvZxHNcz/UII1AUdKS65TK0apHSuH+hsJZL5JVp3q6urhVnOh8zk1mCmtwugECUHMZ0hjUbb6LbDFUiaaoh5wWZ4VXgkn1Smgl/tH3SXKl+rFp3hSi7XapYTOKaqQ04NWGe8wu1ugyEtZccduZPTykuxi3bxrVU3utvHVkd6sp8U6P1sNcF5e0swYtzYevhPriyeMOlYTt9n2gGizyjY7LgCrE+XvOxN4wXGO7I7GSgT9vs2e01dMdEwUrphyZE+UsMIurpddbYGF/nnaJZ+cSEtK4TvhZcAZGOQBgbH9nGlYJWbV+BanUss94bmCPVye618qdI/GF92tQh0ZcBcHwCmuVEmVVEmV/6b8AUQ9reODjL24AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-markdown.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABf0lEQVRo3mNgGAWjYBSMggEHjY2NsQ0NDTeA+P8QwTdBbkZ2/P+hiIFuj2YYYiGPjq8wDGHHg/D3oe6BH8PXA7hKLKDcAgKGLsCjl1S7aOIBLiC+ikMfSJxrUHsAarAWEH9F0wPiaxHQNzg8ADU8AU1PAhF6Bo8H0PLDAiLVDzoPgPLDKnzpflB7gFQw6oFRD0Bar8kEHJlCwEGXgZiDDM9zQPVSXJF9b2pqMsYhZwI2lHCITiTDA1OoVROD5B+0tbUJI4uD+CBxIpPEPyD2IMHxPtRsSsDU7ABiJqgYExDvJDFNPwd6WpQIx0sA8StaeACEm6FiLWRmyk34HP///39G5IChhQdASaEPSpNVqgALhUw86oto0Rol2E4nUe83INbAotYAiH8OBQ+A8DkgZkNrolynVX+AFh4A4W4kdTOHYpfyHzA/OANx4FDuEz8F4rekeuDfUB9WGcoDW5dBjbPoIeyBiKE4uPsP6tao0WH5UTAKRsEoGAWjYBSMdAAA/qYAUxOhW4cAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-markup.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABYUlEQVRo3u2YvQ3CMBCFoaCjDi0SG8AMYQgYgwXyo3RhgPQwBIiCAWADCkpSp0uBOSNHQpaCc8QOsXVPutJ33wshz/ZgQCKRSNYqSZJJEAQnqCl2LV8j1np/gYfBY6grFIO6Y0wI+LtYe+G9OoXPsmwEQ48CgGFMSPBVHXnPTuAZY0MYuJcAGpmoga9qx3t38epsawCqOn9Ze1asTY3Ch2G4UQC0+QXexWeYgl/DgOev8AgTfMZK92uzhCrbwiNMlPDAfC3wURQtoGGhCx5houCzW8HHcTyDRrlueISJnDO0SdmbKXiEiRs6raWUNQaPMNE8rWtS1hg8woQ6rRUpawweYeJ7WitS1ig8wkTqrgHrX6Ge/4kPjbfc4jN6sfIz+tHUszbIerSVePy8lejDZg5qruss4Fu7nXbiQOPEkdKJQ70T1yqGLrYOnV1s1aS1XVeLUlrbeblLIpFIJBKJ5IBeAgbDg7690/EAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-matlab.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADGUlEQVRo3u2YSWgUQRSGo0YT9aAEiRqCC4mI4EGjIgjBXFQU8SCImIu3IOrJNRfNrDA6ZNRBkFFyiB6EATHihii5iAbEXcSEoLiARo0LinG3/Z+8kaaZnqmu7mprpAs+epiq7vrf61f1XnVZWdCCVnotFAo1gEfgMZhTUuKj0eh0iB4ABkO/a0rF8+Xgtkl8jmOlYsCWPOKJH3gzdbqLnwI+2hhAHNHdgLMFxBNfQa2u4puLiM/Rrp34eDw+GcJegbsCBgym0+kKnTxfA/oovsF9kbcQDofX6SK+FvSDqxC1RDCEiG4dxM8GD0FnKpUajetxBwb8+idbajabHQFPr4WAC2AIbGZjqnmHETWAwmiX3x4fD3rAC0zehoU70dTX6kQ80+ub+EQiMQ4TXgNd1h0E/w3nos2QYL4fnh8FLoOTmUxmpLUfb2O9pHhivx8GHAY3QGWevkrw1IUBA7SuVHo+DD6BaTZjdrgQn1vMy1Ts7XHwkmObrkeTyeRYy7gq8M6tAfRsr4Q3gRPgGzgPVvICpUx7hbIs9u5ZpvHtHog3uHodIyWavIqbN4B77M19EDnDOo4WL/XxZM2xWGwqrl88MsB5aYGb6lkQib4DWkS8gInWYNwH8MQr8cwZJ+L3UioHFyORSKNEqLV6LJ74DiYICeC65RB4DVY5PKzX4Z73CgygMNrk1JOrwVsyhowSGF8lWi5L0iN7hqUs+wDhNNduHPVhzC2F4v8gVaFSJuSERdXlNsMwhplCZib+y/KaMXxgt3QegJcX4wHPwCX8XohrB30KUSCSPnJ18/Hzp6Wvz20yozjv4oc956OiV8IH6ZuRuZqlEoWT599xcN4CL7LyJNPev5wXuxvx5Iz6fHNRyKIvrbRCxUMXuQinN+YSpMAce0whVq7CiA4J8VRXNYnOgbe9k9fFCs8NQGzOkzCgRcJRS8FBVWeEmw7EH3AxT7UqAzYKij+l7KTlweF+qIj403Sa0/kLdGehslhr8byYG23En9Pqo22Rt9BrEv4Z2992LWO+wH69FcKvg6hdhg1a0IIWtP+n/QYn6X1lrwwljwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-maya.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACSElEQVRo3u2ZvWsUQRjGLxKjImgQbSxS2IiNWmilYGNpJ36Af0AqESwsxOI3s3ocnFxxhXqIVYpooflShKSIhyGigoWgaBUCGmMUtUmIn2OzxbCuNzu7O7cbmAemOd7nefd3xe47M5WKl5cb1Wq1rUEQ7JZSHgFOCiHOApeBm8A48BSYA2aVUj1pewD9ptVoNDZZ9wBU0iWlPGT78EEQ7LHpAWx0BgDctgUArpcJ4Cew0yJ7G7BSJgAFYJF9IUW+c4BFoC9Bbi8wX0YABZw25QohjqfM7grA4wS57TIDKGBvh8z9GXK7BtDqkHlrLQAsA/3RvGq1ugNYTZn5rdlsbugWgBJCnIvJu5ghc6aS4kupMqy3+uzSarXWA+8y5LW7DaCAo9qr85SF70+49N8eFQEwomXNZswqBOA3MCClPJhDViEACrgCDJUVYBW4Zqj5DPww1EwVBdAG+oBXGf7Z78CuBN8HJwAzYd3hDAC1MONjEQDPtdrhFA+/BGwJ/fNFALzUagdsd1hCiEHNXwjAm0i9sAB4DfRq3veG+kkXAHN6fb1e32wxLhyL9Fow1D90AbAQs9s6k8A3HT3jAT4YPA9cAHyJepRSPcATg+9ATK9Fg+e+C4CVOJ+Uch9wFWgCN8JNzBBw538nFwleoxNORom0R4oxvZYMvcZdzULrcgL4ZOgz5mQWyusgOZyZOvUadQHwdS0DLAPVHAGeuQb4BbwA7gLnge153kUIIU6E2feAEWAUGAvvISaAS/7GxsvLy8vLy8vrX/0FuGDiLxiHB7gAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-mint.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACm0lEQVRo3u2ZTUhUURTHJxcDoUjholUbAzFoXesWUogrcxO50I3BBGq2cGGLmffmYzE1GLiwXe0cFMpWtSh0oaQtVOzDCiuKwgqjSLM0nf6H7oNh0DfnIJ53B+fCjxne+7/7/ud+3/tCoXIqJ3uT67rHiZI0n06nK6PR6AyYA1UlZR6GT4AXIGdYoGulYr4FrOaZ91iNxWLnbDVdkclkDsJgF/5vbWPeg+51kpaesSYAGL8S/Z/++pj3IE0M9NhS+vVgDWwwzHtsmGfqbQhgWGC8kJGgzdcxm41fcwqmFpLJZA1ePr8L8x5PKa8gSt9hmNtiBuEEEcBzZmflNLFnqubNOM4p2d/gD0dLeWqO++146SbD2C8zXBbTUV5tms1nklkDP8EKUzuhZb5KMGl9Bz+Y2nVawWo0n9OCIXIZfOPqKW+NGmgSBPAFfBXomzQCaBQYWgKfBfpGjQAigo75EXxiainPiEYA08yhkXgPPjC1lOcTjQDmBE3iLXgnWRdpBPBQYGgRvBHoH2kEMCAwtGDg6gc05oGLAkOzwibXoVEDtwWGHoMpgf6WRg30CgyNgXHBTNy75wEkEokjZpnMMXUfPOAuvSnvPQ8glUodxsvuMU3dBaNMLeV5SGtF+oppaghkmdqXmvuBG9xOKej0/Zo7sgamqUFwk9mBG1TPQpkz7DVwnTlj656VosQuM0q1D79XGQF0B3GsUm02LH7GIgjiEmPTUx3U0WJrkRo4TxTRXAj6fDTrY+4Mfs/6BJC14XQ6DO7sYPCk4zindrhHz4Rt+krTXDgyxePxo0SBcdI02/iZKWwmOG+/vG6G24q848UVowmHbEy5XO4ADYlmH7yYF9xrc62bNCHbE5l0XfdYXgC1JWG8nPZj+gcGCz8kJ9PVrQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-modern-fortran.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEdklEQVRo3tVaWWyMURT+UVTssVP77oUH4YEQIakICSUI0YQIVQ+8kIiXbtNFkyYaIUV40KZSL21stUWLRGlr31qqJKQprWEoZbTjO3Uq7d977/xz/z9j+idf/uncc84939ztnHNrGJLH5/N1SUxMnB4fH78a2BUXF3cAyAGKgJeAG/gcAEj+A/AWqAAeAnfYXiGQD+QCJ4EjQAKwEogwAnmgMAc4wZ35QgQ1QCYwRup4enp6bwicCiGnRfgFHCVf2zmflZXVHQ03Qtz5trgOhP0jgDm+vxM534rdbaeOWyH4AihzAOXAPeA+8IAX8WPgCfAUeAY85wVeCbwCPgK/JX5VAV3p19+oYpqUlDTa+I8P7Yapqan9mbzZv2W062SrCGRkZPQyQuDhLdfsXzY1lPqZa8NDhMBdgW+lBs8lKYGEhIR5IUygihpq/YwAnZwFwGk+J9JdLtcIP52F88FznE9X0r8KFANXgLPAGbZ3DEjGqT/Zj03RTKmlhjqNLayKFpasMyz8URo2f2JD2RwggTpq+KS5D09RdDZN0+ZvTNm5EptlAvl6gwMtnc4m+YmndA+o8xKbom3UTQ0enY4wZycqCCxR6CYCs2gEeaTMv6xXND35oDPb+kINXzUJjJcRwFxepdBdaXLsvFkG+pECAtUCWx5qaNAc6nGKEdig0Ftgkr0gjXPay9UI5L5Rw3dNAmMUBKKtLn78fVEgc0hgU7RWG6ihUZNAhILAFomOJy8vr5sFAoUCmyI/f1DDTx0CtNcrCGyT6B0WyBYK5CrNAZ3EXiMZ8OoQUJ3GWIQ7BDr5aWlpfQUELokco1wc76U4FxbivUaWoRmKeNunG+TRFkudckEg0s9oXbZxZnjJQLOm8lCHgrQrNgg0GbrKycnJQ0KAQLMdAoMcInDNTm6sPYVSUlIGypzCwpsJmRjM/3XAYnweqSBQZHcK6S7iAQqnYgTyBaL0FN/fsruIvZrK/QIkQNgrkL1tp9ClfZCJ9nQLBIosJipW0agdSnQo71kjUGsxzreKH9rBnKrcgoW7XbbttSsJ/iXwyAaBBjvhdLhiBLZaPQC5KqdL4Jt2QgP00Aynp5lkK2wQ8GinlFTRVhBYr9ClJxrTbCftSpSY2yDwRTupN8f1JgJRQapQu7XLKhSjKxbxoiARqNctbDWp4hsK9EgmCATqrJQWOxzf+IU3WQjSDgaBQEtp8bUfoXy+wYkF1qqqEYLEZipnU7GwsQ/vFIdH5rWsZNeKd6q5rhE6d3V4BMoMvvuVCdxwskTO11lOEsihHWOFQuCmkwRcLtcwhwksbx3WN7JVDsymIhaFAJTE4N0nMzOzJ+uFUUzEd1iDqVKBBH4sFX6BGZzYkP586oxv/J1yvrrlko/37T2d7ZqVfG67uHoAJZ2IQEmHWIynQY6NFDMYIN9yVLdDNBoTqLjq5/I72HCzTxMCumBmMlF8KUGXdef4oq6cb9Pf83+11HMnHs4vGjnXbmZ4+bsGlnGzzge2Uck2i7mPXO4zSnUPQc8fJEFf25Sh40YAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-mustache.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACMElEQVRo3u2WTUhUURTHxw+KNEpCiNSFbUwwRAhCsDYRunLTRmwpGhaCEARBmxlnBgZGB5tVUlAbUUcSjDBwoyCFizZii4LADwxaFGYiZU28fkfvwPWpzfONEcH5w4/3ce+559x7zz3vBQIqlUqlUqlUKpVKpfqP5DhOXjAYvApP4D1swhq8DIVC3VyL3Da8Kw1uaw6+ww94Az2oJuegxCnUiqMs/apgGpw/sAgXLZtG+JTF5imUZfF9Cuqj0ejpHavJqt2jYcMMlOb5zj4DtJvVczywDnVwxay2F5svcENicvsmpptmp6XfL+jd6sfNddcgMpGfUOhKmZDHIGw+wIoPu37Idy2epOhXE/xWPybVIQ2vLMO2eDxezHUsY5hKpQp4fuAjiFx5bC8i96NwgqBbrT6vpeGb9eK8dE4kEseM0REY/gfBZxhLJpNHTSwlkgnhcPicnS0Be0tgXDqKAQflDPcvfDpehSkYghGYNWnpZ6zJSCRSbiaRDwNWWzpgyqBtIIf0nQ+Hkp8PKYmXJe32KADH2f4mro+sguGVTZPqC673yzLw/Ry3WSbbKWfHa8mOxWInsbkFb3P0PSATqDDl66DG06xos7taHESyU4zRwhjzPvyvcR7OZra3Gp55MErDIGly4TC/7Ca3r8GMx+A/wqVdAxFYAw19Up6swy0fpOfQJbv1t39T8FEJd2EClqyP4GfzB3BbUtDT9koJ2+urqFKpVCqVSqVSqVSqQ9BvZaHnsGoz6KUAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-nginx.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACUUlEQVRo3mNgGAWjgL6gu7ubu6Gh4QkQ/6cB/gnEEjT1QAME/KchbqKZ41taWmSBFnyjsQde9/X1cdIq9JfQ2PEwnEILx1vQyfEgfOX///+M1HQ8ExCfoKMHQNiNah5obGyMprPjQXgHPYvN10DcQiJuBeLPBMzVokbo1xMRWhlkJs0WAubOojTtyxBRbF4CYhYyzRcC4o94zP4OxCI0LTaBMeRM44qxhpbF5gZKk2hHRwc/0Jz3eOx4MWnSJHaSDAWVwUQUm7+am5tVqVTKVROI5XhSQz+KiNDvplYx3dnZyduAH0SR4nguIH5MwPGvQFE/KJvLxBSbQDXpg9Lx1Co2gfJmQNwIxBNogGvwWbyYiLTvRKDNNJ2WTQxg7Jfis/wBAQN+4OsxAQ3PpXH76AUoj+KLgRAiDJmPR/9NGod+PjHl/15CBjU1NZnj8MBXGnoA1KDkIJiRgY7TBir8Q8CwU6Akh8UDu2jogQxSSqN+IqIzEYs+IxrFwn0gZiO1ffKSgKEvsVVmQHEDIN4KxO+A+AsR+DcRHkgip0JLJMLgPkrqHWieO0PAjttkNdeJ7Af/pqTXBNTrR0QgxZAdQsAMbQo04B8BC3aTM4IADaALBMy+tmrVKmZKmxdziMjQgWSYG0RE6IdRo30kBsQfCFj0EIgrSMSEKr2L2Ipqcj2RNwDDKgHUbKWyAPFlOjr+DFVH5qCecKCjB7xo1V9YSQfHH6d66KMNr3+lsQdcaN3lrKah4w/SLPSRkhEHEN+lkQfsRifxRsEoGAWjYBSMKAAAkCTkq2dwY6oAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-nodejs.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEaUlEQVRo3s1ZaUhUURQ2M7MNysoWWqjMKKUFwjYigoJWIVstAqEFKyFCKpCKGWfGcTQMpU2qHxVFSIntElFh2Y8yaIcso7SFijadds2+A6e63e68ebO9NwMfs7377nfuO/cs342ICMHLYrEkASeA78APoCInJ2dURLi/nE5nF5AtApqAFgk/gd1At7AjXlpa2tpqta4AuTcK4jLeA5lAVFiQh2tMAJkbCqL1MCoNmIPPtYr/7+C/yaYRB4HewEEFsa+AraCgoINwbQyQDXxSXF8K9DOMeHFxcVus3EZM6laQKbPZbAM0jO4DHFaM+wxsKSwsbBdS8iA+ExM9VBC4j/+m+uB2EzHmpuI+T4DUlpaWVsF2lwTgtGLCDyC+tqSkpI0/Gx/jM4C3ivueh5GJARN3uVydcDMXx3M5JO4B4oKwOLHAdqBZmoNC8Tagsz83jcTKLsX7S8XqXAVGhyAoDAcuKuZ7DSynJ6bXP0cwSflGL9ioyFDtMfJ9zDEfc9Qp5q/2unCU7hWhjtwnj9zJwBDdHrBySP4nRIPjOK2B56QBJxEWB5uVaygkg8Mx2YW1DGgULkwPl1IFXOYJvJo97gfpkcUHy685DC8CNljIN6zWzVwPzdITyXBNT+kpxATFAFyzgzOyG6Sy5EhG0QN4oKPAu4Lx080w4KhwfZ7wezRQroO4jHxVFjbDAIc0YTOHQaqDSoB93PD8Fy4pVJtqABV7+Nwg/H4bGKixP1KAj8L1j+SnYKgBnFHFyVJ03CddHIPwOdRMA5KlyWbouE+MmEDhRrNNMyA3N7e7ojNbg1UdolWG8P9jCeSGZm/isx6iDDUut7gLo1IhFcQHeauvDDfAbrf3xfcaH8InNfo7PUkvhhtAL+qJOZFV+ZgLDskNkikGyARIgQBWsW50hlvTJg9GZIeVARrjo+E2Y/BeLBlTa2YYrRR+y/DBmHyJZJRZBohtYbkPisd6secWS2ajDXCKNZAe9Y0TWbUw7p6ZLhQvqRikTu/lpmQ89wZxHGqTuS+4KxV0WWYnskw/SunfuESb2/QohO8LPMgynkAl9y5q6MMikQm+Ta3kAS6rGyS1o46FhGwvmqpuA8QJVnrTKP3JA1T36Bap/kaohaJip9XUV/iiUUqSR34IZBUq9I5LnCq9qXJuPRoli7OiUl0URBmlI7el3yQuXyhze1PnEqVs+kejxKNcR0IXdUyKw43VQZIW03CvZ4r5q2iBfdFyaPPV64wg7kCVaowfCVz2oMku8evMgEtim0KjlKX2xf4SRwfXlXoBhbxO7uMMiiaLrNmfRaxX0iTXgSl+rngUuR3wTrEoodFk6TE6HI4eHB1iAzjZnMStpUy8Ro8IEHSjMOk04AJXokkaT5LqnyMK4o1cjUYbSp5FrGuKsLtV9F3OyJs8HLPux1PtZab0naBIgITntLmxsnPx/lh14qJ5WGG0G/GJ/FMdIZfyybJQHlUFejRkV2TQwE4dTTCEmpoyNoQamlPAsFDM9QuYSEPK9MhSgwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-note.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAArElEQVRo3u3Zuw2AMAyE4ZSMwag3RAZkBhaAhoKCKCLKOTz+k1zjL8iWoqRUiKRJUpa0StpMtUiakyNH81tAeRDmk/cjzh8w/WFZEW6AHREBsCKiADZEJMCCiAZ0R5QAd1fkMMQoQAnxKsAV4hUz0LUHAAAAfBTguA8A+BWAIQbAEANgCwFgCzHEbCGGGAAAAAGAyEe+Wq0tgPwgQG4BRDx0V0/+6GFKhBDyyOx2IFQT7ETVTgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-npm.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAWklEQVRo3u3YsQ3AIBAEQULKvs5NA04egQzWrPTpoUlpTdpTkuekAwAAAJgc+updAACANUNJ+tvdBCjtAAAAAAAAAAAAAAAA7PwX6sWr7vjYAgAA+ANAkqQbGixhN/1q3FmlAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-nsis.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE0ElEQVRo3u1ZaWwVVRR+Ciiy72oFlIJADIG4BgHDagyREMMSdogEGkCjBqEJW9O+vr6+pskLvD/wEhJCiD9s/KOBBNRatkIr+yZFFssajQlWQSoUeXyn+Uomk3nz5t47U/jRm3y5k5l75p5z7vadc0MhS8nPz18NpAyxHGgLhIF2IZ8K/vW0p4YFBQWfayr+AFgCdAB+4rt9QCdT5ROJxLP4zzYVa3OA/xWUvw/Mj8VinVEfsH37ubi4uKuB59sBPwB1noVKS0vbQ2AuFcuk/D2M2vRoNNodz0fStDkB9FJVvqSkpCPk9vIfdSpWV0ChnqiniYIuyv8HTAJeAE5lMPRsJBJ5yasOMmoyehZ5JQPqgF+KiopehHc/xHO9g0L/4tv7UKoPnn/1ONUuAq9k6p/OO26TVTZAhM4DfaHoeNS3LT/7GxgFZAO1iov9KjDQpe8scZ6DnJYBgsvAgHA4PJKK38Tz26gHA9c1d6zfgSH2fjGaL+P9hTQy2gYIbgCvAW8BQ2Uuo65kZ7qoktG19DmAzkoFYYDgT3j+9VBAhQalgjRA8BcwnPP0MKeCLo7JCABvYI2N5fS5GLQBglsYidGFhYX98HxJcw1cgfyr+M+77KseRkx0WcC+GiCoYLveQI2i8hfo7THiDMv7u8CUNFuorwbs4Qk5X84InBXP4/mkR+XFu1mQ+wD1HYfvDcBsHmLVQRiwS7gJFFhK8naPp3U3rgk35Y/Tux/R2+naCQdbZKMRvhjwrbBCKP+lncjh3TwSuco0SlXTqzPpZS/M9jMSue/9MODrZDLZBnWeS4c5JIHltm97xZsw8mNFhpuCzCpS6e9MDNhaVlbWCnXMQ6dfMJjZYZ1ywDIaqbNjRei8pI4BGyUSAhIKXlvDDnPpvSXcbW4bIJxKpZ5SNSBOz2/W8FpR6HEWKLACaA18ZRAbr2eI+gn3dW3gH+t0jMgz7Vjmvgw96g0GjhAntoYRKx/3qEY1lN/MabxeaRei18KGC++WTB8u5Fwu7LUKyieofFLnHNjEDiMGKZZPLRkFebedW+xyD/IxrsFtJidx08m7SlF5OawWSj6IeSHrtx/lsLNQESf5PDrvGz+40K54PP4ck11eDqIGtJ3lkFGwYr8Yh3YLHNI2K2wHoS9kbjezbYsyUIG7JGq9mAdyM/SQEEAYMYPcSJyzLA0V8YXMHQS6oMM5acjYHaHIjJXPepxqJ0nFJ5MndeLoBBaRHQV6SNBho8ONEZrkezKEhE6oaUp2SZzRHDHxaSa7JjLZ1RgjS3goYaLmjnVJwlM44T08/9McMXFTsmusZCkYmB8zDPBlTWQx33SzOWLiqgBP7KHAH0EaUIsh729p25c5HZMkVyVHYBjwJrN+14Iw4Lw1m2ZpP4RTQWcNXINDBqF+h9NH+h7BvOtvfhpwRhawi8xAJm5VlBcFsx0WsHCpcbbMt5EBjVuoBzmVrfQc80oTJFXv8L2eqX25ezhtYkDjIeZVlodZjcdDbBIvSdxuf6by9qdcx4AKoREaO4kbnTjMPFKm2x/r/dtcpRtPGrBTiJzBdtjNgdBVSv5I8kge798eMVzILFbpfAvwjA97upVSl5Os5eimWIQV+3up7P2aVKK7tgZ30FasDrWUltJSWsoTUx4CnYwSTC5yjLEAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-ocaml.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACt0lEQVRo3mNgGAWjgPqgoaHBCog3AfFHIP4/wPgj1C1WxDo+C4j/DQKHo2OQm7LwOr6pqclykDoe7gmQG/GF/sZB7HgY3ojPAx+HgAc+4vPA/6GARz0wlDzwAogXA/FBPAaeBeJuIN482DzwsaWlRRpJbioWw46vWrWKGUlNxaDxQGNjYz2yXGdnJy9Q/CGaGmdkNf///2cEim8fDB5429HRwY8uD3SwN5Ka8yAHYzHDjATHXAeaWQjE0UD2ciB+Ak22PyjyANDAcmzy0BDeAFWXgsecXUQ4/lxfXx8nDv0s0PbYZCD+Q6oHLnZ3d3PjUtPW1iYK9GD+zJkzWfE0SWyJ8IAbMW0zoF2lpHjgIhCLUKlFe5CAB1SINEeLFA+IUKtJDgw5RzyOfw/ETHjcIQXKG0B6OrbSj279CqAj0nG0r1bgcLgDNOb+kZWJadQ54gB6JBTkaCA+CcRrQCGMo4C4TVExOsC9QD2K64EB9sCcIesBoKO8qFITD5Dj3YD4C1U9AFRkAcRzm5ubNWnocCkg7iOnD06M4fugir8BS5BKYKtUloKiNBtozg4gXgfES4F4PRBfomTwgJDjdYD4L7aGF6jBBWonQRt1JpMmTWJH0hcAxIeB2AbNvC66tUZB7RuggtNEGrQKVpuCmt5I4r+A2AnJAy30bE63EmnIX1hnB8jWgDoaWf4NECtB5aPo6YE/RBqyH0nPThxqVkLlDQZjpz4NmnSC8aj5BWx6C4PyCZD9eTB54BisHwxk38CnFujBVKi67kHjAaCjIqFqTYhQvwaqlg2Inw2WGPAjkPaR8StYUQttiQ64B/4BSx95kCdIsHAW1Oy2weCBc1B1F0gcEtcFYvPB4IEu6PjQXxItnQiq9KiVDyjxAKjlaEeGpR9APTMgnkFTD4yCUTAKRsEoGAVDDQAANfsObwzyukEAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-onenote.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADG0lEQVRo3u2ZSWgUQRSGhyh6EBRE44bRQ1RQUJGgYjTEBfHgQQRRIWeJB1G8BTzMbuMgwhxE3MhNGUTRgGsuatSAccOFREJE44aOMqPRCIrxf/ACRVPT1VNlT3fDFHxUdVen8v6perW8ikQMUzQaHRePx5cgbwGHwBXwFvxibkaCkmBMHdgci8XakJ8Bz8BvMOJAtx+GTsSv2ghDd6N8FHSBgsJQfwTA0EX4JztAGnSA15qGlqInnU5PRV6bSqWmgRkoz0wmk7MotyxrEvIak197JCD8AB/BS/AANIdNgJ2zYK6ydypgyFPQUCYvhL//Cl/c6aeAbo1h3WP3o0D3AE0kok1w8Dl4vxBs4Db6gu4DvTLbePai+kE/BRRBp4LTJWyr5TbyofIBiYAhLwR8A3d47/PQCwG08Gn3AKauvcibwFJwXvLNDaGNVgcBQzyrOHGuhG3TuY0BnR5oEL6ZL9m0uRVQthPj+TC4DG5z/WMjAfzdcVv9dZcCHoF6BXWKdeCWsQDefA1rCNBdyGg1PsW5vgDaLQrfZjQEDHB9SeBv2yUCTnLZMhpCyNeRM3N5snAuuOahD9gF6Dsxfp215EzC9wfKFPCOjXBiv0JA3qQHmvl5Ez1nMpkJvG+/6rEPiAKGTQQ02XeE6JU95QgAY53I5XJjFAI+aQvATnGN8G7raCSCzsoV9IFeEwGNwrvnoyckTKuzXQqgBTCv4J5CwF2TIbTK9r5F0oYXPkAhm2N8nugwEbDS9r6fxm0FBBSFANkFkyG0QlK3qwwBn0G7goMSAe1cjorTuE4PLJfUDWaz2fEeO7EoQMuJn9BUyScmWf0RsJGHWNyhnT6wxQlMy+sVAr6EMSohCvjjpwCaelcrWKYQ8D1UUQmJgA9+CiiwLzlxQiGgP4w+0EnnBOSXKGgQ5tBiwe/YqG5wtyuRSCywr/phCq9bYb4feEPxKLcCFgs3jDQjvPdgCNW7AUNmHkU//scl3xQ+zO/j0MZ98FP3jiwoV6w15FSYEbahnAAXwSvwNxQCnK5k+dDTKlzJFkMjoJqqqZqqySj9A8MY+gkB3QvBAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-pcb.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACgUlEQVRo3mNgIAM0QMB/LLiFYSiAUQ+MemDUA0PfA204PNBDijlNTU3aQD1zgfgeEH8B4sdAvKSlpUWelo4PAuLvODzwp7GxMZdIc9KA+DcOcz4CzYmlheMDgPgfDkuRcRQR5hAy4z/QE+HUdDwbNIphFpwAJgHTmTNnsgLZRkB8FD028GBkdSeB2AyIWYDmGQLpI0hyL4CYg1oecEMy+FlHRwc/mjwPED8kJmSR8HMgFsBizgOkWPCnigeABhUjWTwBhye7SPTAZBzmdCJ5oJZaMVCEZHE/IYuJxBNxmNOOpKaOWh5wQTIUlBd40OS5gPg+iR540tnZyYvFnHtIaoKo4gFoZn2GZPBBINb5//8/Y3NzsyaQvZ9Ex8PwITRz9qDlES5qlkRxRBZ/iaDSAxcGykcTYQ6otLKjRV1Qh8dSUB1RQmShkA9U+xePOTk0q42B5bU5qMoH4qdQy94D8XqguCWJgWEAxEuB+BXU4W+AeBWoXmAYBaNgFIyCUUAIQGve2UB8B4g/A/EjIF4ExHKD3vHAiiwZ6NBfdO2RUbE29yOiKQGqpS0GyoESQHyVyB7ZaZBDQW0kYE1ujNYjuzZp0iR2ujq+tbVVEmjxdSJboi9w9MgeUr1HRoLjb5DQlJ5CRMeoZrA6Hl+PrI3qPTIaOB5rj6yvr48TKH4XKQkFD1bHI/fstKA9MnUgezfy6Ed3dzf3QDv+CRBroPXI4nF0YtCLUYcBdzwwVFVxpPMSfKN8oGGcQet4pJ4dqNxfAcSvoXreAvEaUnt2A+J4LDHCNFhKG5IdT6/mgdSQdXxLS4ss0HG3h2rIK6AN9Q0pxysRMWQ+OB0/CkbBKBgFdAEAiFhIrld0nyUAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-pdf.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACrklEQVRo3u3ZTWgTQRTA8a201B4rWLxVRASRIHpQ8AM8VDx7UaEXvQiKUEHx4Ok/kyWLXxE2HlxB6EUQAyJ4EKV48aIU9CJ4UWyjKCIVQxUqhK6XUYZ18rXZGTeQB0NIsi8zv9mdze5bz2sSYRiOAhWgDsSW2gKw0bMRavCxg2YHYXnm7SP0DjrNKZfLY8CcylsF5oEtTX4fq4g0ACHEOcPsPmrRhz1EGgDw2ABYapNjB5ESUDMAPnaQlz0iJeCnAfClw9xsERkC3neRnx0iJWDBAHjeZb/ZIFIC5gyA+yn6/gfhCnDTALiR8gggzRh6BZw2AC66XIc9JUsptxsAx/sGAKwBlvVcIcThfgJsNuyBO/0E8A2AX8BE7gHq8Kklzt89LWSnACHEQS3ngxDikPb+UxAE43nfAw+1nKtxHA8Bb7TPqrkFFIvFreoGJgZiKeUOtVdOJc5IJ3IJAG6brn3UunimfbcspSzkCgBsAFa0WT6qf+/7/iTwXfu9uhBiOk+Aa9q2NWDYsM0RoJE4vc4Dl4FbQBV4AjxQn02pNWQXAEwk7gFOtrjM2Au87KJS8doF4Iq23dM4joeS20RRNCKlLAghptXsfk5TeskcUCqV1muz/wPYpOXuAi4Br9Q/cc+1o8wBaoB/Fu4MsA+4Diy2GMg3dezfVa/uAUEQjAPn1az/LZ2YqhHAPSHEjJRyt+mfWEpZUOiv1gHAMHAhebmcvP8Fzvi+P9lNX1EUjQAHgLPArDr0FjMDADvbnEGqUsptGZc212YJaLQY/LtyuTxmobicKaBVm7JU3ncCmPUshQvAW2BdvwKWmtX9+wGwIqXc71kOW4AGcMxzEDYAL4A9nqPIApB8yLfq8KFfstXTACr/ccDJVuka4OhBd9uZByphGI56gxjEIAaRy/gNnjlUjU1p9zwAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-perl.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADzElEQVRo3u1Za0hUQRS2IAoyemAUpETSCwJ/RFEWGUFERVFBgRlR2YsiirBISmHXddddjIiFjP2jQfUj6EeZRIQRBgYqpmWBFWQPChM0QqvVHtt34mwMw713597dsZV24GN378w9830zZ2bOnE1LS5X/uLhcrtEjjfBst9t9Ep+NwCAQAXqAy8BcbR2XlZUtQAfngdPl5eVZDt5fgndvM2EzfIW4TQkjHYlERhFZGD0O4/1CR2HgqI1R3wr8ikE+ii8+n2+qY9IgPBNGrgJtwIBVZxB2SHHkvymSjyIQj4822+howGq0Kisrx6PNS5vkIzxwGU4FPLfZ2WETO5OAOgfko3A5FTAOyAOOAK8UOqoysLEMeB0HeUIf3HlGXIsYPn7KjoBgMDgWv88BP+IkH8VjmknHO5CK/5JIau/3+yfi98MEERdR53Tfz1XsYDWLrddAPor1TtynVMVPQ6HQGLTdo5E8oY0Gye5iPqtguJrbvtAsgJBvV0CJgtFCPqgiw4AeWyEMb6OxjD7joCwyTGiinU51DewYRmJ2UK20HtAwExhKRhEY3CJVN7qSRMQpmn3C35tVBWQDvUkioIqDQ/KKLjvnwaokcaV8HtS3FJ7b3VILbVxIdCGPudA9ZcjJybyF7666iV4DDhg8z2YBd4BuR/FRIBCYQPE/cBPoANqBGjKYIPJ9Xq93GsdW8trL5OddwP2EXvgxOzsNyHQCIaDVhGwl4De7xNCiFes8Hs8cfBbwNro30QKKJCJhGkkmstBEQA7e2yiRnCcIWCS3Bxpo9nXkenxSZ0+Fut0G5O8ahOxh+YRlN/1TTzEXBM5SDiVszsAZiWCtQCIg1dFtLZPrMoTnHwzsbhfqN+jMthUYbXm86N/LAaD07id+3mFiu53rN+sUkCcQfCSM4EF5bciZNzz7yHWNJrN7jF1osU4BOQLJi8LzYuF5L0isMHj3O9c3mAhYxzvPLm0COBsxyB2VCuT2CQJKDMhnCKnKtVYCgOu6s87RPJBXyszVywtbClFI9H4Lu0v5/Uu6BXQaTTXl/9mVfooHEH5PoZ0HuBHDbjoLWKNbAF0t31Fmz8QV6ND6DHh4Zmo4LEhXsN2v0i5eAfcokxEj17SSZkKIbIsVbXen6S40+rRtKrS7JSzslmjIYdGeFnqL9r+NeK/OVUgcywnjthjvnADe6BbgZjLTLdxnOeofCPn/v8mwioqKyRa2m7QuYiLNZFot/vXJQn0QuEAhNlxtG7tGLV1QzNIkfL6EWYB7JP4FO58OMIpuY20QqZIqqZIq/678BnMM92wRBe8lAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-php.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADkElEQVRo3u2YW0iUQRTHt6IrUUFkFBRGYEXgk10fQiywh4SyoMKQHrrZFUroJWKvpiUb2UOIQReKTIKICpTMHiIMMgIjtcgoyKKSzCzUst3+J84nn8N3m91vlg2+Az9m2W/mzDlzPXN8Pk888cSTtBa/3z85EAgUoKwA9eAV6AED4Ad4Dx6BE2Buuhg9G0YfQNkABkHcIf1gu15XKBSah//WgYPgDLgJboEboBZcACH0t9mVAYCSHeCnhNFGFLKu5Qm0fQ5njpaVlc2QNh4NtyZpuMZHMAFkJKGDZrMSTHNkPKZ6Aa/puEtos9CRpJ63IMfJ0rnrovHEWdZb64KuQayO3VbG57psPNHAuk+7qHO/mQP1ChxoZt1RF3XGMBMbRxgfiURm4sOQAgfuswNXXdY7gP26SD/6exUYT5xj/S8U6G6Kx+OjNAcuqnAAU70BZaaiwSH9RZoDLcKHQyingDaDht8ddtBaXV09FuVJVQ6A9n+zIBoFB/ZR/EM3okGjHg4BrBT/AUtBFvil0IF4MBhc4TPb7TZL46vJ9yF831lXVzcGvxsVGq8NzHkfj5hM48ug2Ch8gPH5KMeBSwqN/4yRX4yyD3SRA92yZzEHaaXgJXgItrHhK8U9pYBK3rt5oJd+PBEqUDzUaqOkj2/YPRj1EpSnwDPFhmtk6a6ADB93PnxJgFW0u1FeSZFBMjwwCiMW6pZGoe7/vDQz/jedbmaxEL28IsJ/FWnmQKnVW2A+KtymaI8vMv0RSPfBWnA4hetchILN0XbvgWKTxlGtDu8NcuZpCo2PIeCc5fRJWcRrbcRjAufuEn09dmSL6puW6ZZ91K8B3wQlH8Lh8ByDuseSNI6WZ7tNnS7pxz3F22j4RgzQKMjT1yOnbDqnSDeTw48aeiPwgUHplVyaSQ47rB5UvQmlVyitwbesXtk1g6VkFhd9AZMcLt18q4EoLy+fmpAT0Wh0IhR06oM1ChmEZdRmNvoS6ZzVNjOZnUyiSx8+99OUC9/fmXQakejjuM3jpSARwykxFRCi1TvCMptuEXrXSPTVlFA2wmZaS8QYHMfpMqHjHM6gGXXaKOFAh5MIVHYGMjlc1pTsMqm33qTTTom+sq0eUeB6Quu/qqpqPOVhhh/QBsIn0Wuj4EvcLzZONFvsgSOq0/H3eARj/EB6TMHgcOrDmQ5KQX7ixHAXn26UU9oko8cTTzzxxBNP/iv5CxqFA1J5NTZgAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-plist.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABYUlEQVRo3u2YvQ3CMBCFoaCjDi0SG8AMYQgYgwXyo3RhgPQwBIiCAWADCkpSp0uBOSNHQpaCc8QOsXVPutJ33wshz/ZgQCKRSNYqSZJJEAQnqCl2LV8j1np/gYfBY6grFIO6Y0wI+LtYe+G9OoXPsmwEQ48CgGFMSPBVHXnPTuAZY0MYuJcAGpmoga9qx3t38epsawCqOn9Ze1asTY3Ch2G4UQC0+QXexWeYgl/DgOev8AgTfMZK92uzhCrbwiNMlPDAfC3wURQtoGGhCx5houCzW8HHcTyDRrlueISJnDO0SdmbKXiEiRs6raWUNQaPMNE8rWtS1hg8woQ6rRUpawweYeJ7WitS1ig8wkTqrgHrX6Ge/4kPjbfc4jN6sfIz+tHUszbIerSVePy8lejDZg5qruss4Fu7nXbiQOPEkdKJQ70T1yqGLrYOnV1s1aS1XVeLUlrbeblLIpFIJBKJ5IBeAgbDg7690/EAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-postcss.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAGNUlEQVRo3u1Ze2yeUxivGmrYipm47GZzCzZmJMomIUYIgpnGJchcYuaSzWVki94vaVTSbaUzXWZuK9GFuYxipsKYjhnbqK7TEDpdtTaq2n5+v/odTt587znf135r/dE3+eX93u99znOe55znPLc3KWngGrj694pEIntlZGSMz8zMvAv3MuAN4CugCWgGdur3NmAt8AyQDfoLcE/pN8Ex+STgBQkXCaA58NwVhYb4HXiJynAh+krwM7XKtrBLIcQl2dnZY0pKSvbDc57eNeqenpeXd6h26mbcHwe2BJTZDFy2xwSvqKjYGxNkAZ2akAJMA/YNKDhFNEuysrJOw/1PoAXKjY2yGBOBYr63FHkbGJlQ4XNyco4C0w81wS7Z+6AoAqUC23UGBvM/0N6vcTXcnZBd5bh5wC+i5bm5MiHC5+fnHyyBulcdq3qSw7x4JtpoKoFDXqXxpR7zHMIzYXYDyt/RW3tPAT4Qw+rCwsKDHLQzRbc0ZAfNYU/3zDkIWC3av2iSvVHgabP9BQUFQz0Hm7b+ZphrpEmIVyswzjUvFwo0G0S/gwvQE+HTxeAnYHgYnbwL7b7VZV7i+ZR4flpWVraPh/ZI4AfRr4r30I6wfPnFnoleBTqAi3x8i4qKDgDdN+Jb5KPHgpwOuj9Ef308q/+iBi1x0eGQzdBhmx8rbwh1hmybwe08Hz14P2LFFH/khr8+Xn78t9zc3MMduzRK9vw+kOzjSxdaXFy8v3YhV0Jtg0JnAxPCIrEcSb0WakYsq1/uW1W5xnclxApgkez7OaBSh3kN8DnQoJQh4sDXHpkKRbfRKTxW/AgQtXP16ZMdDO+W14n0EF2B8Zs8CkwxtNwtl71dJ8JFDmYncEVBO0e0PGRz8Xwn7rOlfJjgzbLpFM1neOyi1/GkMS2yjFtdmi6QlqdEe08bln8uV3DqPlwaOw741iRmmOge3G+TzY8GHtaZ4fs1PBO0f0u5Ks8umLjwhItoPSOm4z2zzBquIH2+GP7Iw47793pmvn9gyHgqWWvODnhMDuzQLY65y0SzznUwaf+rQ9zfuXhXBxxt1QMm0H3k3d7/zhmV/UxjHwso8GtY1AXvy0VT51KAh6swivaHgMHVtp3i99TA5M/GEShHyVXv1lju3ipX1GUgM6mFy4SYzl4b+C+NGWLQTzNCW8LXu3KlkLk+tsbXygPuDPP3KoJI2+ZiWhkMXooL06PQ2jtQ3INcq9JWIOAFW1ndBUzoIUPvYsrqaLE16Abg9hCbvFAMO3z5UshcNZYCTXSV+v9l/bfWjvCWAh1JngBVZZ8LB63ZgZp4hZc73m2boMV3OO1cpjQnigJNvohXF4sQ3GKrNk6NRwE2AAIO4LuAHNNN18LU0vj9qP5b79va1zDoxBhMYLQYtrgid8jYUqviiiitSA3QrNC791hfW7XBch/ziYyeMaTFE8Rwu5pWaTGm02fJhRIF1i6cHKUWr9e7cotubqL6QyMVNxphElfRDHztEPn/rRLkSYw73yozjwkpVdsD5jY+UQqk2345459rhxzBsCiV2GwlbRGl24OZc+n55zCHoZzq3+ZXwnpFWvVuO5YCtNOFcqtdWulq4MtA6rwQdfRhTBlkTqZdw0rtHLpk8lbkT9c8daJ7xysYi22lxqWyvWVK0J7XwaKfXgl8YQm1TGXoK8zte1EnGLRrt5oCxVAnu30+9zhWFdBiVVUbtIqbVZDXWuDzRuATBZ63pASVWc6aWtUaXWAmcB8DI9MV3C9Vgsj24nFMJdROSbYXk9WayZFcRVZYcpfRn617q6Bv97VswhRgq3BmfwjP5NA6O9k99TTz5K8f6Evh1aI36fXWsKZwLAoks4smRiV99P1hiKJvRI3itF4xVMQ1weR1thL3lPBwIMdaWWonXWiivg+MkEch4wYwvrHH2xqy0/rmYDLUtoQJH/AK863vXVtYA8dbiUXZ4clqgBlf3+D19Qn4uFdtTcie5b3xKKJvANOs7p4BvwJN6isffY0y0YiVGm9S+2MW3l+B+6lMEZT/z1LFt9L6lGQqukpWeH32pTLQeL1JLq81znShUc2uYUn/h4thn/aMlXxQuRO/G6xT67Fd6TY/zy6gE6BjSBq4Bq7+v/4G038CBVOahZYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-powerpoint.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACh0lEQVRo3u2ZT4hNcRTHnyFJTElkQWjkT2rMYhTNxpOFopQkyYaUKMNCMoupz/n9bvf1ZiUZq1Gz4vU2FKKk1Fj4M4QkxagpI+VvxMKUa/N79ev1XvPu/3vrnfpuTvd3O597f+fec86vUAhpwFyl1CbgEDAE3AamAM9ovJAVcxxnJbBbRAaAq8ArYNoKtpGSBwA6lVJ9InIcuAQ8AH7MEGg6AEqpjcABwAVuAJMBA00HIOJgG+kzMBJCF4D1aQJEoYk0Ab4DNwPqUe0+aQI8DLG9d7YBogYALgL9wJq8ALwBTgCjWusu4J3xTwPnqtXq7KwD2OqxAGq64nnerLgA/gBvgXHgHnANuA68BP5FBOABB+MCqDRbp7XeADyOCOALMC9RALN2GfAzAgAP2BErgIgUTbm8vW79sE+AIWC0XiJSjBtg0PLvt9bv9QEgwNEG6o49B0wPUPOPWNVsXwRfpyOxAwBnLP+wBbYnLIDWuisJgNPG9xvYYvnPhwS4FeePrGJtlc1Av+M4K2o+13WXmGozaPDftNarEwGot1KptMj84IIGPwX0xl0LVRpc3wH0Ak99dGR3gY/AJ2AMOAt0JlHM1SfxpMkBP0/6eZrltA1AwK2Se4Cvfpp4rfW6rAH41basAUyYuVOrWholwDMROSwiu4DLSQ+2stKRvTaf3ZZULpcXZrmlTDwHotAv4L4P9WQNIPc5EAlAs8lF5pLYloictO4zJ8/T6Q95Hq//FZHBNAFeAMsDahUwf6ZE6bZOGO+Yuj0/R0yNzHXdxSJSFJFTpoR4YsaM+QBo8qY6gLXAPkCZGen7Fmak2TknbgK2QCm1VUSOmSndWN2RbLYB2ta2trUtlP0HxHAyh2FGTVIAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-powershell.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACqUlEQVRo3mNgGAWjYBSMgkEP/v//z9jQ0FAFxG+A+P8A4p9AXEGyBxobG1MH2OHI+AfJHgBqOjCIPHCHJMevWrWKGajpCx4DPwHxSiB+QCcPLCY19PXwGPYViDWg6gSA+CKtPQBMztmkeiANj4Hb0NRK0TommpqajEn1wDw8Bj7u7OzkRVbf3NysTsPS6vvMmTNZSfXANQKG7gZiNmQ9wFAyhyYvanvgMKmOFyDS4GVAzIRW9HoCxX5T2QPdpHrAjQTD+0AVHpr+OCpn4GBSPVBHogWlWMwoo5YHWlpapEn1wDYyQikWSzOknwoeeEyq45mA+B0ZFv0GpX8sZi2j0AOrSfIAtDgk17KvoJIIzRNsQLyLgvRfTGoDLp7CEHsDCgRkM0F1BlD8LJkVmDWpSWg6FdItqFYWQasjjMlJln19fZykeuA8hY7/AyqV0OsHIF+BDLNOk+T47u5ubqCmv5SUGEBshW4uqBkAFF9KhnmTSfIAMJrtKXD8VvRkAwLAMlweKH6czAwcTWoGLiczyZSjJxmoeb5kFslgDCwMlElN/+tJtOQJENvgSDLdFOal1+hNFGI68M9JsGB7W1ubKDWTDBreTGroE1tK/AGNENAiyaCl/2pSPRBBhMFPgRndlkZJBt0DzqR6YAIBQ3cCsRgWfXJYksxdIL6CB98jYNc/IOYj1QMn8IRGJbYkAxTzwZJkEoi0LwOPBy6T5PhJkyaxQ0e/sBm2hoQk85PYkgOolgWPB2aTGvoWeAybSUSSITntAtV64TEjmVQPFODxAGhwywGUhIAGBxJRyvyEdojW4MHb8MQ4qAWqTaoHVhBZfNJjBO4jtvxGyAMPB9EY6B5yBnF/DBYPAJNpITnD6IWg0a8Bdvw3UGeK5BG4UTAKRsEoGAWjYCgCABl1ahjZeBhHAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-preferences.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAm0lEQVRo3u2YQQqAMAwEe+u39w3pS/sCvSh4EilNm8gM5Kbo4HaRlALgj6Tjniz3IoAAAgjsbT8E0gmYWZXUJPXn9S/TJTUzqyEErpc/BqZFEeiDAh0BIhT9EGf8jUdgi0D6HIduko8Ccbs8ssC06O6K0LTn7jrEHl9+aRX+QWB6dJcKeEQ33mYh41oFARZbCCCAQP4GAwAA8OQEWo+ozzoXfb8AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-premiere.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABZElEQVRo3u3YPUvEQBCA4RVELSxOEGsLS/0H2tkICoKQwrPUQkE4RQQt5J1t0qeysFMR/CitRLnGTkEESysbO3+AwtpEWJboncdJNjgD22R3JnmSLENijIZG9wJwVRgKUIACFKCAUgGnwDawKSLrIrIKLIvIApAAFniKGbDUTlMUkTrwVlmAMcZYayf+AtE1QJZl/fnrsyIiG8As0BvUTKIFALWC+XtgJKj7UCWAA86CurtVA3wAA96GnitY8wIciEjdWjsFjAGDwHEMAAcMe+umveN3wPgP13AUA+DdfwLAvDd31eKbJArARVAXb64Z9IsZYB+4BK6B17IBJ2maDn2tcc71BJ25GZzzvPQ+kI9FYLSg5lqQHw+gjW/svYL8+AHAJHDzTX48AKAPSPKNmOR3/LZFflSAWgedVAEKUIAC/jngEGgADRHZ6QDwDGx541H/CylAAQpQgAIUoIAYABoav49P6QF6P+TxYRsAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-procfile.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABvElEQVRo3u3YP0vDQBjH8eIfRHBQVJSKIoqzL8AX4FsQCg6+AN+AIN9L0is6dCgidHBzCipSXBSHdhNBF1EUHRycBN20Wm3jUhdJlKTlksP7wbP1ud6nTe5ySaVMTNQGeAc+gE+gAXhAOeQYa8CbTx2qAHg+VQ7RnwaqfuNYljWnA2AzYIwDVZdQZIBt29PNy+9nf92yrNlEA4AOoBzQv6ryJm5EBCwHTL7ium5nogG2bc8Arz59z47jjKteRuthAUAfMOpT/XHsA/VWVqEkbGTaAz5/AwCTQogMsAEcAzfNjasKPAJ3wB6wAHQlBXAJZIGrgJUmqE6BtGrAR8hJ/lXnxWKxW2eAByyqBNRCTOwJOAFKQAV4CfjcbhIADeAMWBdCzEspB3/2SikHgVu/e0j1eeD7i2tASQiR8ZtwQP+OD+BeJeAVOAKWcrncQIT+eAFSyuEWf4B4AW34Bw3AAAwgTkA+n+/VGtB8LBjSGfAAXGSz2RGdAR5w7TjOmM4Ar3m6mtAZ4AH3wJTOAA/Y0hmwXygUenQFuGHPs0kCbEd5LZIUwFbUF7KxA4QQK0DHv32YMzExMTExaWe+AGv05hBX63XKAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-psd.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB9klEQVRo3u2YyytEURzHPfK2sJCEKKVsRImE5ZCULPwHFtIsZaVR80pqahaThZuysphGWRCRBRkbhY1H8thgY2s0YhbX9+jcOv26M2bKNOfW79Sne+95/O793Lnnd+7coiIuXP6veL1e0wmwAAuwAAuwQEEFHsA+2AXbYAtsgqjcv9ddYP6vBdHv9/ei37FjBUSJxWKl6LuqtUAoFKrBscvn843grneHw+EqG4m4tgLY7yFtH2COxBx0ksAv+EWmrD6maRaj7jVDvBT41koA7JC4h6Q9DslJbBuEoJSsB+PgWgeBUxJ3T2lbF3MjwzVEdRDYIHHPZP0zqCRttZFIpEIngRQyUp/VR2Qm1CVl27JVHwwGm3F8pYy7AAvgqFACYiLegDESc1rpM6PUj+qQhaoDgUAHtnViItrEawFvSnZaJGuEB3xquRLjMepC30cy9pKKoq5dvlcVXkDe1QGwJvO73XhPGuEhG+H8CsjH50C+nZ6DRJYxRKZptDl/k/rIFTKNZkNCZh2aVt1OEbC4Ba1k4msrkExTv6LELNdZwI1UOkEWqxfQr8Ts1FlgVlmJ28R4wzDKyDUsOUIgzfmHwVe+BfwiBUpcOQqciFcI8vJWIv9DGxnWDu0+q4gLfQJ34J2/C7EAC7AAC7AAC7CADgJcuORefgA5Y3/t/84MkwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-pug.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAERUlEQVRo3u1YaUgVURQuM7Mys00qClppLwLbxChoMfzVTkSrEIWVUShERbk/TbGy/CEWgUSUYAuUURJYGEVglpZZEbTTQllEFlq9vlNn6Hqde+fZm/fyxxz4mHlz557znTvnnnPua9fOEUccccQRR2wUt9vdPjc3t3NSUlJPoH9GRkYfXEOKi4s7tAmCINMFiExOTt6M60GgBLgOPAO+Am4JP4X7b8Bb4DZQChQm/ZHFqampQ3EN8MmKpqSkTIByF1AN/BAINQI3gXw4tBbX2UAEkcHK98J9IJHirzEMeqbgGgPEAod4bqOg7xNQDl2J9L7X5GFwBhTdN1nVfIxNysvL6+StDdIBfZNBeqeJnbvE4Z8UQ+E6KGgyUVruq3iG7gMm9pqIS2uUBCoUET6kpaUN9OH+CgZqFLb3EzcrBWHARYUCN8W5H5JEhMo+cwvTxWKFZnK1v1IhbB3X8Khosfco02CgSDOJEOOvVI0sNljKTjKKiLPo8Q4L8k+NCfQV8HskFSkbVzwUGJudnd1VeHZOx4mylpFtFlmQJ1xmpVHkDD97AJx0uVw9vKkxsL8Heio54zUACWwrz4oX5i6hFy944MBhLkb1/Lues9V2qsRerPwKoI5DWMx8C0Fuqwe8zhutwUWrz4XrKuk5tQGPqFXIzMzsbhLHw9nBvZi/WgwPwQGy+51bkleC7rOYs8CCPM3tImagM5qXl0Phes14uEQsnjPJPK6yVBTLgNHSe1cV+spQgSdq7NH+CG62GgUFBR1V6QvKplFvIvVBBioFQn2BHOBKsyzxZ2w8N3zzjTFF+0DYxjXJbOwUEKSKyRDgo8mkvmxwo+TES8oeHIYHuNuk55+BOO4wqbpOZcPGPOpeI3nskmTrjEHQhAv9DrXaWDnSpAZxNelLcEgsZYfDgRuK1XpCrbJirJHjPADXWbhuwJeeLtmqkua4PMkMg6RVrtW8OwR4rIlVcmC5Zpw28DKN/tPiWSI9Pb2fp+ltn9G8GTVA0XrUWGQKcmCNxTu0WFEKHvnCYu5ubVdYxemtVt6QvB8SPcjTD/nwYvVejdlpjE9ulFjutcg6HjgRxJnpGDBXGqNT1gsNIdrMCVQLENfj4OwcWgiLWhMt1ZERVO3pS2dlZXXz5lRG+fiO2AHi2RhdSIDMFqmzfU8hQHo08w5KzSXF/ya7mi06D28XwidaQ6SU947ZWImuOAn6V9LeszzAeCrcgZ42TmO4n6khUqcZa+KNbeqcsPqUlnvb2qNT52d8Be5KVSS/WGzYBsXzE0LFPmr7IYOasd/d318jbptRyLozdbXB270Qz+eHUB84sItbjlvKXscGBwI4O8RyjrfTgRPAG8p6Pj2vcm2IA97Z7MA15P5R/vyPNIwPLGUebFwVaBGO0JnBrNr705kgjt94rtz0H+pzbqvp34XX3A6U0hmY68iA/0raEUccccQRR9qC/AKsT02v7MyU1gAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-puppet.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABAUlEQVRo3mNgGAWjgL6goaHhP4k4YtQDox4Y5h6wAWIFJLxtqHlAAU1+zagHRj1AmgfmAfEEJHx7uJVCOUPdA98aGxsdh7IHQPhLU1OT9WDxwAQi8Bwg/ofmiY9AT5gOpUZfBpaYeAf0hP5Q8kQBFk+8AuaJeFDpRAgPCk8AHVtOZr75P5hiomFIewDqiVlD3QM5ox4Y9cCoB0Y9MFqMjryKDOiQiiHblMDVmAPiMCD2IYQHuhGXOSib05R0aIDYZKh2KT8DsdWQ7dQDscPosAoNPbATOhoHw8+H2sCWBpr8llEPjHqABA8AKyxntAmOvaNTTKMeGPXAIPbAKBgFqAAA0kIAoXXjwX8AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-python.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC6ElEQVRo3u2aT0hUQRzHxdZSFCovJV5WCpFCCCH7d846CB69eAgELxl1iAih+Pze2+cKC3vwEg+iBG/e9mBQ4NnKisqOBSUalF2K/K9sh2bhITjOG9c3Hnbgd3nMznw/b3478/v95lVVVVqluW+e57WLyC1gDJgBvgC/gHVgCVgAPgFTwDBwPZfL1TsXDlwEpoGihf0GMvl8vs6JeBHpATYsxUftLXAsUfFhGNYAP5SAZRG5CXQpF7GBGE/adVojk2dLz0dGRo4CaxYA60BDkgBtkcmHIs8PA8s2q+D7fosrgEURuQqkgSd7+C+kXQGUyyoAcQAagfuGtuEUIAzDmiAImoCTlrZqCgCcA26UTER6M5lMs+1b7gAKMQTs2YX437Y/3wQeAbVxxPepvbmYoO0EULJJoNpEfGeZQoRyAxSBQROAaQfiTQG+Aymd+NOOxBeDIDhhAFAELusA7jgCmFPzD+/WV0Qe6AAKLgBEpF/NP2nQ/7kO4I0DgILK6i4AWwb9P+oAviUofAm4OzExcQhIAR8MfzevA4gbCq8Cj4EBdXaYWjfQqN78WeB1jDmXdQArMQZ6BZyJxEbdMSEGFHzck35JB7BgOMh7IKWW/55tEmNpX3UAswYDbHmed97hrjWjA3hhMMAzVZXod3RmFHQADw0GyKq+c47OjNu6CtsVg0FQx76TkMP3/VO6FUipgEkLoAIvFwDTJtHo4AEF2AA6TQCqd4lJXACsA31xMrJalcZtOgZYVVt1h1VenMlkmkWkN5poq8Q7HUOAVTEgCIKmMAxr9qusko7ht6bll8Yk60L74UJtFYCEAMaAtCoILzoB8H2/xVL8yujo6JHIixhytQINlrWjteh10rYkvjXpW5pxy1WYArrUtVQpj/i5b1vmTi2bzR4H3pUjRBCRHic3lfl8vk65wR9L8S89z7vk/L44l8vVi8g1IFAuMgvMA39VHLMIfFaX4E+BQc/z2iufCFTaAWj/AIf3zYOlI+/aAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-r.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADs0lEQVRo3u2Ze0hTURzHl5VFTwN7j6IYlUT9o1FBUFH/BAUhPUDCiApN+qOCoMA/nE7dGpRZEYNlRvVHo0RIC4KEoNCo9aAnGT0sizCJXtQ0W9+fHOV0u3fn3O2eTeIe+LDtnHt+j3tev9+Zw2EXu6S2lJWVzXC73ZtLSkoOgToQBh/AZ/AFfAUfwV1QDw7j+S34nJkSg6E4DQaswGcNeAuiCfAanIK8NaFQaLBqwzOBxwKjjXgHfBjR2SoMPwC+KTJcj/OWOAJBeaAziYbzdIMAmGLacK/XO5beggVG/GZT4ya4DBrAFXCPLWwZGbQJbJA23uPxTEWHB3EaTMrOgZ0gB6QLRngUFvByfBYzx7pjyK4KBAJDRVPGBdriMPwqyAXDLVhvRaDZQM+NioqK8bqdfT7faDzwOA7Dc5jyOQkwC0zg7SktLV2KuiYdnfdpiut5X2/CcFrYeZr+VixckhuE8dl9ctmZ80rzXGM0Gh3EK19rQgmNkkvnBVi9C7WA+dymcoZvh2MFvYrpBETFE0mhFA5kGMxfFVspnT1LOB0erq3D7/ePpMrVksI6aIeKsQBVnQfvwRhOTy3Xto0qjkkKyhfsIMoONUyXvZyeIbSQWVsDVTyVEEKLKC1BB6js0+GSRN9rGl3r+uIn+hGREFAlsYeLZGTE6Fsr6NumeX4E6AI99OOXxBAWKHZgEgs7jPq26/ShWRGhL60SDmxX7EA6+Bmj73WdPrS4W+nLSQnlfpUO4AXtEPR164QcVH+afuRLKH/218kXnwMrwSId9gjW4Q8wTaOrkLXlOqqrq4fhyxuJabQ+Fdso9O7XmW7PwYv+6JTzSHSgOJPsQFA78qjzsrZN/ZXkCUs6RAIfVlZWjkuCA5TsFOroKGbtzf+cS+Xl5ZMlE/YwQorpChygXShEUW5vjGNs/Ett6M3H4NmSyXsn5uYqBSNAZ9IFJPRZmjzlOGv/xLfFcqJdUmEjnl8s4wBGeCJlbASc38h2F6PnI+zyaxdbe73Gg2Vm8uI7Jt5ck9lzgHY1k5mf01R+SvMQnY4KEm0zOCmJp9CYrkooWQGPBH264Ohu0RkkuvvMgqCLglhFFT2YogusuqGj5PsIu7RNphO3RKG8WUfSWVhwENwG3+M0LMJusmtYaJxQNJzQbTVdlUsY7IEhW2n7xbSYx19Soe2ExG1Fpurb60TCaZdEXhIcsA6w/mdF96wYuYUD1gEYN1dipwtbuqCtdIDJqJOQU2T/sWcXu9jFLnb5b8of4Fat/J7qiZwAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-rails.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADPUlEQVRo3u2ZSWgUQRSGxwVEcAH1kASNW4SAIgYEFzQuqGgIGPUmHqIgCiquCAbB2Z1BbeOgiRovwRhlGC9CXA4hMKAHSRRUJIIGUSM6oAcdd53xf/AGiiaRdHd1VSNT8NFdk0zX/1e/fv2qxufT0Px+/yXwCbwFjT6vtUgkUgphBigfxMBukGe6PSUegurBVxb3JBaLjTf/TzAYXIC/nQcpcBKsAfMMwxhtutZIMF+1gTIODTLwORAIrMdxOFgFLoCMMPtmyHgHvrMrHA5PJfPof0N/v2oTC0ErieA70vsP0YPxB1wGdeA2qFVqAmGyCIM+tSHczE/QDCYoEZ5MJkdgsBM8g3mJPMekzHY7dMaBmw5EvqaHGzG/CcclOK4DR3DeIzxTG2QIpazRCSpM4ntsCu+EsNX5fH7YANmqlsIH1IA34I7T2K6imeCBv2DgHYlEYhTOu2wIf8nZqRW8p2ubJmojuAuOc78EiWGK09lPCQJynCZbbIi/SneNr3mGM1W5ihRJOf0Q5WfQwGnOqvhzYrhQiAz0wnO1CS+ajEXxUZAOhUKzvFA2BCyK7xbCLU13U6f4SVxRDlX8d8z6zGg0OhHnz/g9MU2ngVMWZ98ofBdGpqMf1Cl+Mj/EQxWfpTvmpZL5osXZb9cldCeoNH1WAX5ZNFBHb9V4PD5WpfgSoSBLU33CnzdZLYtJOD+4va4XZIUGwXtNQlo472ctGuijuwh+cP++yjjPFYTA0AocD9h463bw9arBR3BWabaB8D04Xuf16Qs7NY9wvUqE0DJdD/RKm6Vyu1dSZ7NNA1e8IJ4q0Hc2DbTRm5fWDDoNLHewTGzjZeErHLfSmlmHgUYHBm6AmND36zDw2IGBB7xsfMj9Jh1lc86BgYywnl6K/jalBniLw8l+Tk7ZA4zB1oJ9YAuf0z5nQsKm1AxVBq6ZBt4M7kkwUKPKgFnsXPBBgoGwKgP9wqC/ufqUsa/ZpcrAYS4ZbvEeZ7UkA1neGkwxFKpjVGSg7RJ3l+vFPq59UIWBYxINNAi/3BD9rqdX3ueXZeARb6cs5nCiDFfmtoHTkn+kmKO6jIhLNhBRbeCoZAN9vmIrtmIrtv+q/QX7ALFbVvHJEAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-riot.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABq0lEQVRo3u2ZPUvDUBSG07gouohDh24uHSwiKsXRxcGlv8Gt/Q1Oz81Xh0InJ8FNB4OI0MGxbupSNzcFJxdB0C1+XJcgIdzGOvUeyAvvduE9Ty7JubnHcQwCXKADjIAE0FNyktbQAVxnEgVBUAOGUyx6nIdBENQKi0+f/JWFxf9CFO5EulXaZiul2kUAI9sBgFERQCIAICkC0BJcAvzTXzYDzP7VV7TWlSiKlpRSO8AB8CYKIK8oipaAI7EAmSxfOoALXFsFAGwBnxl/A+/AcRiGVUNey0aAcWvv4jieya7v9/tzwIcUAA1sGzKfJAHsGTIfJQG08j0CeJUC8Nzr9eZz65elvMT3nudtGPL2bQNYADYzbvq+X9daV/JZYRhWgReRjazb7S4CtyI7sVJqF3gQexYCLq09jQIN4CbjQ0NG02YA01eoacgZSAIYGHLWJQHoMT3gXAwAcGHIWpUEoIE1Q14sCeAsn+d53kr60yPmNNowZJ5IAjjNZ/q+Xy9v5koAiwDEX6+LH3CIHzG5lk4oJxvyiR+zZndCKdW2ZdCd1uI6pUqVKmWdfgAUzMmXxkzjWQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-ruby.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA1UlEQVRo3u2YSw6AMAhEPYpH5ajeRBe6MmorDHRomKRb857lY1yWSiUucmZ3PpIZ3kciGB4r8QC/icjqcMPr9WycRBS8i0Q0PFQCCa+pd5ME+s1rm1Yl4VE2lsnzS8Kr5q3js0vCs2ERO+BTwnvaoBbZq0R6gfQlNEUTTzFGp1hkU3xKoCWGwCMlhsGjJIbCIySGw1slKOAtEjTwWgkqeI0EHfxfCUp4QznxwCtugg++V4IaviWRAr4hkQO+8082N3xDIgf8i0Qu+JtETvhKpVKpVCJyAAtZ5FaB75hrAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-rust.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEzUlEQVRo3u1ZaWxNQRRu7PseoX4IIhIhJASpfa+dqh+WH0L9sEUlJIQfXV7bV6WkglQtrSJVJBKxRCQIEaWiFYJILG2CpPail5b6TnJuMiZz5y7vvkekN/lyZ96bOXO+mTNnzpwbFeXjk5ycPDEpKSnerKN8iCD8Pw/1SVH/ygNlugHThXopUEckoOx4vOsJVGbl6b9SgdAMkvHXCECBjazkUZRnmQoDtcA3of6NfzMJkeLHuL4p0rO+CogRTKReg0fAC5s2h1lWDMmOBIG3PHAJ8EmjWHlxcXHjrKys1ihXadp9YllUrooEgUqbGf0CVAMPc3NzmwaDwfYovwM+S2alQkU4Z70cOAAYioG/Ant44zYDRjCJCuANISUlZWB2dnZL3it5TEiWY/AYZb6uBiuvmrEfQDrQRe4DhccysZepqal9FTK7AvvYM6lk3/eTwAHFAGVQcpBNv05AK5s2/cncFPIPheoiV/LyPwdqJOEX7RRz82RkZHSEvOsKc6pk813jZdZjLJaWSC0DlngBJmYxMBXlDtJ4LYALFmOO8mo6JTZeIxTQ/jkCREsmVyG1K3WldFpaWnc6HYF8Gz/vF+iMGCyQGCNtbPJmhVi1zY7CDjScFgGlZTwl9+vA68U6NZ0jkSZBwR673+EWbQrd2P5M7kTeZyj8eB+8X7P3iQV2aJQ5DyQosBf4pekX4LGLKIais4M2vKvZ55O0VOj0XCB1DfiYk5PTHO+lGkWCmonZremXEAgEenDUmsftm/FmN9uUkI66mY8HfkqCTwMHuVzplQAFdvjvnEUf2qidQKAnrzrFTAHgrNSuDgTm263CAjF2N1cCv6/Hux0T1RGg8PmyBFL8icb+V5jjw3R64bddilipVrzt6VZhDMcwZscrNHtSm6U+bd4aq1OWJgu4LZ7MFF/ZKb9fMchxRTu/CJTRuaPR54SiT56OQIGiw4kwEqhnn9/CQp+TivYFdqswQbp4XHZJ4BKZhQnY9zq8i21IJEr7cAufxqLbNfD7ZCeudI7kul66JBC0mJgUTZ+bUttkRZtaJx5onsUFo1uoBNLT0ztrDjK6hvYWYrFnFu1Itzid+UwB7ik6fuS43ES1hgDF8DdMiLOG+mNNP4MvNoamzR1KnjlxpbN93KSJUqbOa6w0y00sVBAmAgkhyCl0qnysz5FmorQP3oUga7rTfOcmXgX5OP/FG8kN1kjZiiGcNjEsUKdIfFEstsF1HhUdbknC3lKsEq6kGeWOFJN21+t9eITFMpIn2c5ZBIqZTnmU3wi4ykkCijq3WuVRQWy01yRuFV+yDYXLy2cyFH638SB/AMt6aJGNMHjsKnig1X4ntoJC6Ev1cR7yTss5Gm3DY5zxNbElESiThNOSN+Gwg+ppHmSSk6jDJPTjm5ecwin3kwCZ0n0+iGqEWP6PSw+wDRimMqnMzMy2sOWR+G8nxVdCv+/Ae6Gcx9FAeFLtrKgTn03u7wHvk2qHfV5F4vvAG9O9WaTI3YLI3eTyh0h8F1tN104mk+8DgWMsaxhkr430R77NrESRsKHNsNeQXKJ4ws4VyG/9m59ZoylylT6z0rmwiJMDZiQ5kcJqJnFPSmNG/zPfjenKBywUCOXSTAv1OLpzRDU8DU/D0/D8N89v9ukvofWdkm8AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-sass.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE9klEQVRo3u1Za2zNZxi3saEW12LikmViJmiIZstmGxk+LJIOOUm/yFgVUUxDQjMTp6ftOdXS0VjWbsTlA0mR0CAukbjUFx8aWrrMpRVTRF0jBNOe/R5+b/LszWnPv+3/3zZy3uSX0/97ed7ned7nfS5vO3WKtbew+f3+LiUlJZ07PKPhcPgdMPuZ/007BFQBT4Ew8QQ4B2RmZWUN70ga/gjIA+4oZp3gqKxtT8a/BfYD9U0w+Qp4ATyzTsPgNjCsrRlPAE41wnAdsDUzM3M+fscA71prBwApwGW15mCbMB4Khfpgs83UqmZaTqAUTM8sLi5+z6ESPgAuqfXxXmvdR+1qxhuAfYFAYHRLaELgZYrWl14yn0FmNfPlYHxCa+hCgDmGHmiN98R/A39YjL/ExmudmkoU+psNzYKCgu5uM98NOGIxfwEY5xJ9uQP3Sfe4F9rfZjF/JD8/v4eL9H81tHGi091mPsUOOG6YjKKfqu7UTi9M55Zi/h+3XJzEBCBf0b4O9HRVABznUkv7M9ygm5OTM0gClqJ73yvPc1ZtcseOpJawqzH+fhR6HwNFwHNFtwrJ3EivfP5LtdGhKKe1CnMqadOfAn2zs7OHQrOT8PdyejEdtSUfynHdZVoCXFMbljowuRWY97iJZO5fptArg8Fgf4c8LCFNWTuruQJkqc1rmzIhy6f7IMwa/IZYD6ThJL5oStuMxOJO0y165YYHmNqo5grQV+c82GShRyf9iVLUJau2MP13W0p8qrp0coy+FtBIFB/PezCukftjGM1T6/5U/Zdb406nt0QIlpVBq8jZFyEeXFXjqdIv5sJLX8r+F7g3/VojxBQQuWeEkCKlGSnCQ0b088BJa84MEwv4m87+A8ANCW7AA479ZNZJHQ0epqEvCffr69zc3F5OTGEYvYjRVlGktIK2u9uUkXKB2S8MPaIixrDvNN2vcRhSln7FO5fMOSYL/gtYB9xspFzdGbWuFobpXYxZlCGyDuRGvYH1VqB6nd9IoaM3lBjBuyGMzuMLhjHRKn1SNKcG5Q3lZGfLCQDfq5ePR6y5U6OeBgPUDRIVG15JzUrwK1PFyVgKp/OeKvbtEu8iOZflMkU5CepEN6q1exvjSTJkjP8m67HvRKd1sS7ID0tagN9cfp+SefKQxRcHM+93YAi1HVD3bLE5BXNh8fcv1OwGjlU7MPVdUR8HmC6ctOwwiWNH+R1UXiys4skc2vJTY35yCfH9t5qTTGWIkLOZosjYmWgCYN0IoR1xsLCwsKtojbZWT80ESXwTBbjA7zR+77EETaRnCilXepipex0FWEzTqaYnqhCmxHSjCUBl3Iuk9W+UyVwRb0EN/2g8COdVkgnJjeJ5qWuUACG6xt6cv44PXQvU3ZnAwHeNQtSh73OHgTPNnL7u/EFlk6LRODVmNj7AbxN8jgHb+ffP1ttRBufO4ncei5rXd4RjSWKOTNXjHcarZMly//eAzCBmmD9h5/343sGxQs5fZJnMRbjNwVZlF8e1J1R/jbhUL55TzPHX2GUfixTzzulT7qxWMeZTd+Gqrr7w/aG8q4qvl9TDi0xxsmLEH8HvVphs0fhzxomxdJdz2/W5XF1QQYp10w/aSViHaxDgOx1BWSFtVImdYEtH/pdQXISH3LDKStd6YrtuNklXmYU+Z1Il7q6o2SVerMVarMVarMVarDlv/wGxGb1dXFke0QAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-scala.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACtElEQVRo3u2ZW6hMURjHxxEl5RqSB5dISfGAckkp10JekJJS5IHikFMnYe4zmRqiMA/CAzFFnvCiXHJ58CCFxMmpk2NyOIwOhmNsv6/Wg6Zj9jiz1t571az6tWdq77X//zXfXt+3vwmFAjgSicT4cDh8OmTLcBxnQCwWm47ovXAPytAbSLH5fH4g4mbCFjgKd6AITgUlX4Umk8kx0Wh0biQSWQ/7EXQKHsG3PsT2xVfTcTqOm8yDDdACJ+E6PIeeGkVW44s2sazgPrWCN+CFrI4GgW580mZA4tEDwZV8tN3Ae9sNvLPdQIfNBj7AOtsM/IKbsDmTyQzVuucbMiBb8W1IsU2vIfGNNpa06jDQC+1wF86phLcapkCTyz1XmjbwUx40eAzX4LiUDLCREmJ+PB6f4CayclDQTeb6Zq57KNlcp4FdTLwJlvB5BoySCrLOOYfBYubczfE8PKtYoGIgqk+EDGZlp0lIILaVYx5ew2+X8Ov2VCDilsF2vifgAtyHtzUI/RddOkVONSDQjYJOA44PdNpuoMN2A+22G2iz3cAxGw1Ixr/CbrdC915vUvRLOIvorRxHmEpWWl7S4QGckSYBrKpWgXLeJC8NlFVSkyLsEhyR+gnWUtjNSqVSI2u8TxPnL5T4h886DUjdfllVnAc4bpMaXvpCVJ0Tc7ncoP7MKy8uzLGAuXZKGEn2/WtRfgSqpSjhgqilqkt3UfWXylV+1e+eCkyn08O56Wx5l4U9KgzkPeGJhEM/npmeoAt0o6jzGSj4kMi6dRrwoy/UZbuBgu0GOm03cMtWA2/IFQez2ewQWwxIMnsKJ2BRve0a0wZKSqzUS4ekbJb84kXrpPQfAl9J/KraJiJ1EyyXzob8Q+lXc0ra3W2qlXJV/tBj9Q7DDpWZ58BYIz9/YzRGYzRGoMcfqeaGAx9Crq0AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-scss.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADvUlEQVRo3u1ZfWiNURi/mDXfzNJkIklsJKRdFClNIquFUUrqFil/KB+Tr/v90eXiD+UaJdP+uCRDFm2+FvIVYZvZH2JDW2mhGGPX79G5dTq9773vve/HfW/dU7+2dc6e83ue9znPeZ7nWCwGjEAgMMLhcJTb7fYgUAc0A9+BfuAv8AV4AZwDbECBJd3D7/ePApGtwB3gNxBNAr+AU8A4w4k7nc5F2LgG+JEkaSl8hrx5hhDHZouBWwkI/QHeABcBJ7CNXAbutR0//cBNoFf4n25dvwQsNBsbNMYh/RWoBckNPp9vTCJ5Xq93LNYfE2Qc0cPiQ9mh7JMh/prOQDAYHJai/BAnq11T8rDmUgh9J0P8KVCmgYFmcjL7NCEejUYHgPxe5ssi8XbMVdIaLfZyu90T+KikVVi8IhXyQPxAOBwerLGLLuP2aFYljPwYQh5KkH+GQzxLp6h2htvneMqCyLIQUC9B/iyQqxP5Yv7yg5HmqBFWI0G+Ssf7ZCTQyu1Vp0bYGoPJ5wlfuweYrCbOvxfIN+pIvhB4xN/aCA7L1cT6PQJ5yhzn6kEee62F7E6B/Ga1FnklKFCrgEhlkmnIAok05BuwWouwKfr+OgVKnwcuA1Nl5nMo7NI5Eg5qDLdxgU1S/Ukp6ZIQvlCBAqPpbmBFShNLyijrDAOPgZ8y6cd9oELrQ/WW34QqKiX/FwqFhmDtIZYr9cfJUJuwbpcmFpdRYKew6elUwqLL5ZpByR3IrqQkUDfCMjG5TSjzrJZMGiyl7eaUoOK7ONOUmA585JToTPl2TKMSU4QC5hPCYWlGKcEKjLucEr04lJsy7UsMBOl9Qh18NBKJDMooReA+86mE5JS4oaTjYLavMVyomujiqwAcwCVWwT1nNzCVogeheIkZFdkY58aVAilTZAry1KySqBkukKVZE4BqiiL8vYR1M16yNV10Q6fzDJSCxAOO9D2gIfZ7vLYM5veztgzd8nlGu0sOcJhzmQ5gPfsaO2L5vAI5q5gMm2HkPR7PeGbpmNXryU04d9rCzeUqUILOQsQolymhVne82M/y/v9tQCXdOazbTUYwwm0KmKvE7RSzooTm2xTKraaOnhEKVHPkW6VaiKzZG1tzUsEXpUeQFt4F9fR7vpFrkykjP3BrrAkMYmXPR4VGxPlyIcZPE8jkAte4+aumumWpDBTq4hVcOC0DnnDzLUC+2dKEfOHNiroNXRLvWB1ItyeaMmmjSJHg0e4EvWuZPfOsYo/TPaxGvk51gSmzy+zIjuzIDkPHP736lIO+7vxHAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-settings.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADF0lEQVRo3u1ZSYsTQRSO47gNetabg6gHcXfQuNxUEB0djSiO+iu8eVCyCvEQJQchB1FEIkZUjKIiKqgHkXHccD2KBxXXmRHEmcy035M3EEJ3VXXXC01LCj4C6er33ldVb6nXsVgTRjKZLANOPVKp1KFYFEaxWJwCgwcbCQBvI0EAhna7GP8P6XR6RRQInPIiABwL07Dl2Wx2tmZOO/BNQeBjpVKZ6PW+4zgTMCeBnVorbfw6YAgY5hWe7zYPjrpVYfw4Eh7v9uDZU54zJEaizvh6I0aB81CyBL9tfO6v8/+OAe7D4F5yeCbd7zKHAsEaK+NpFVyMb8RnQ6Pd8FvzfBA2LLNZ/T0WxkmgBsy1IUDH41WIBMoSPrA7JOPHcHwWWRPg0PYyBAJXxMIoIsUu01UDquw7nZwXCJ2QsY8j1ZiJLKz+Ksk8MBX4o1H6wqRUwLw48EYj67sq4QUhsFej8CbQ4UPedOCuSiZ2bIckgQcKZc/9GD8+8vn8DLz3WiH3logDc4r3UjJqk2j4OHn6E3TvLJVKk4JkYCoRjgIfNEfnosDu3tDo+AGc5nJlsi7aHPQZMhMCBPb70PcTOKMS5jdWzxIgMMevXikCw0IBoj0sAiNRJ+DkcrmZtgTolidJoOzRUfDCdoEypdeHvifAAW3ZwLH/LDCgEVgROELXNDreA0eABUF7PKpyumZT8lKjQFXc0XWTkqmEo91WkHhMuxZAZgcVgAq5dyRroYRmm6t+SBQKhWlcWquKuR4xAlTackpXkeg3OU6YtxR4ZlA+tEnuQNwwSlBb5QKVwvUhljI2FWb4vWTaesH8jZIEqgGvhSOMIO8+lDJ+sek1sAnYLEHgXIhtlT4r4zOZzDwf7cJmYVvMMtHoSotfFsZ90TynSmClbX90tQeJR8AmuvJxtr7nI1JdRZTZwp2/LuCyi58NiLVWGkj0eTkXh0odgQ0eu72Qi8kar3xc+hsB5YJug4T3SfWBQ5egqJlr1ZEWIHpcQeBEFL6RdSmy6/qofKl850LgK10fo0LgsAuBk7HWaI3WaI3/bvwFNUCvFv6LvvAAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-shell.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABSElEQVRo3mNgGAWjYBSMgkEDGhoaeIB4IRB/A+L/gwx/g7qNB58HFgxCh6Pjhfg88G0IeOArPg/8Hwp4RHvgFhQPSQ+cBWIxKD471Dywr7OzkxdJHR8Q7x8yHmhsbIxEVztp0iR2oNy6oRIDf4A4BV39qlWrmIHis4dMJgbGRCUOfW1DqRjt+///PyO6XqDnCoFy/4ZKPbAIiFmweCIWKP57qFRkq7CZAfRE6FDwwDsgtkLX397eLggUPzrYPfAUiHWw6JUC4stDoSmhgK6vublZFSh+f0g0JbDoMQLil0OqKYGUYR2Bcp+GZFMCKB4ExD9w6LEhEdO3KQH0UCpUjDQLqNQPoagpAaSriLCEhUQ82iMb9cCoB0Y9MOqBUQ9QxQNfh/rY6Pwh4IH5hOYHFgzSmAC5aUF3dzf36EzOKBgFo2AUjIJhAwDu7Kn0ONOQrwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-sketch.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEFUlEQVRo3u1ZWUhUURg2M9tsLyFbNKLeIiMSKwgRKiTbzJaXeigpgyDrIYoKnBnXtMkmexAqwgxKqCgKbIFIKVvIIEgpCh+ktEgtFUuYtO+nb+AwjDP3eu+dppgDH9fr3Pv9yznnX86NiAiP8Aj+yM3NjQa2AXXAgEHUkSvacsXz8vJmQJAdaDNBcW+0CrfIsMLjMUAV4LZAcW+4KSvGsOIlJSVj7Xb7EhoRBziBXguV76WMOJEJ2YtFhyEpX11dPRxEN0l8H0gZGBgYhmssUAR0m6h4Nzlj6awVwF3+dguI1KU8FXX5EPTYZrOlye8FBQVTuB++GVBc3rULl8gF92rc1/p47owuA0B0IIDgl3hmk3hGphjXmUOBvEtnbQBeBJB5UKvyoli/Bu/1OxyOubjOZhjUDUSceFwTNAaHX0CGX+WxaZbioR8ap/8a1+sVA0voKjmqdWzyZH/h8o4O4cmYgTkGQ6ubHEk63rkdKMOe0kBSy+ddJkQgF7keaXjWWVFRMcJvpiWZbKrOwYiwT9biOhnoMcGAHnKl+3mmAzLXqzr6KxUKXS7XSG6uZz7ImiT6gPCoWXlAuBiNGn38Xs/NHpX7Z8wPFIU246EGRhhZUie9CHfSwFYz6yDhhOxdapQDSmXJ0LFS9GVrrX0uMslk8H6dTCPwicpnmV1GiPKKY9plmdKhK3H/RTKy5kRWXFw8Di98IHkZvRAvOYJT3WRBHdRI7kzmlkjAxvjfhmw9TW8FukwJkbIOZyllRowVUGRLvfVAmZ20oZbRNsVD7YzZ4plsYJ/JEM5I8TSuHxW55Ub6ANn5TxWyKv7/ggVL6Dy5T6vLyul0jjbUEzAadSuRIZFhrc9E5fuEkzPs4e1DabPIlI7MK7zV0FNnTTSgnJyXlf8dMrutvK6Qp+bn5083qTvrJVeiUgU/1N3EBBpsYDyb6zmNKjXBgBJy1fC+0xPxTB9MKv0MbZKxpwJdBpTvomNSlZC51eozIU+1+o5RymHAADvziqcbq7T8bIjp/jW9tbeoqGgCywy9ynfw3S28bwbGB+VkDuFtAYT9lLpF+loYcmQIBhzmDMpMusG5PNjHizlU5Bgb+886lJeTvTEyg7x3BP18lGv3HvCdmzlHR+W5n0a3sueI+iuHvIzfX6Vi5d5o0WBAC2v/49KNIfvO+6sn1VBkI9N/Av7eo8GA3Ur4zQqV4/ZzwCXpG5Q+whfec+OWATdC5nsB1/NbRJKFuO7ws/a3s9du9hwnhtJHjyTPQewgzfkb/lYJrArJLzfcmCksM7wNyOQMOUP20xOP5J309CtF+QaG3RPAqJD+fiZNCYu+dGXtr5FzV8ng/8pHwGRGm3rgiXg/6KWC0VFYWDiJZbJgohgR/r4bHuERHv/f+A2I0D8n3q9BkwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-slim.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAESUlEQVRo3u1ZW0hVQRS9mRVRH0UiZSFlRRAVgfWRQUUPEMkKekElGkV+FUFpD0J8XL2kpKC97E1RkPYR9CVoaVFiEWUPxKL8qQwlzUpTy25rw1w57ubcM2c8R+9HA4ur5+zZe82c2bP37PF4BtkyMzOnZWVl7cLvCeAO0Ai0AM3AB+A9UAEUADuAGM9wN5CIAtKBOuAP4LcJ6rcPiBxq4pFAEfBTg7QMv4CSvLy8Sa4SLysrGwlDGcAPRWJ9QCvwRfxtJd+OZXiA7JhxyM7OXg65WmC63VmfDNwLYvw7UA4CSfhd5PV6pxqJ4Fk4MBdIAc4K/5Dp8cns+/3+EWK5/hZyVcrkxag/mxisBenE4uLiMXYmpLS0dBT6rgOqrcjj+QTgtkHuRW5u7hTVmV8GdEmIvwHxjQ75VDxw0OTdQuCdwe4jn883UXXmY9GhQ0L+JM2g25uF2JaNG0VFQUHBONVZiREOaCTeC6WpbhMvLCwcC1uXmO1yYLSSAuEw9yXk19hcGv39Vfvk5OTMhPxzZvs8EGbH8H6+bHRm3u4AILcB+Mps59syihmYIXHa05rOqTQAscXmS3ztsI7RM3y3kTmszvIIEl9qJAFwj21lFMols7/JqfVtEl+aua8BW6yc3Gw2jvEg5aSDBomqAXRSTLD4YtTSzV42MMdNdCER5FG1Pw8C4hTIk+xDaT7Pcxu76YECeR5VA6BltMAiqB1iPhLJBZKZ0lsOEA6j4EObgCSqBtAEzFLQVcr67eYCl9nySdYhTV+NcnuTFITjNR2KFNOKJNb3Bh/AgFQZO8RizVkvUT2N2TnAID7NZv2fBXVgyuc1B6Ay85XAeI38yKijlRtuZ04SrrN1qsy+2eZgpV9ss/3HUP6y1/CyTXfvVxmAbmzB80/GSeYvjUe8Ptm5NAQG0GOQaeEvG5mhKJd8oENHr0hzBuxg3HAt24ViXdqFSjTzpvlMTzU3fJHFge0OxwH6v0Q3uoPPZqbvilUkvukJoQY+1xi/FNkZ2CjwTfkM6j75cFEcM/KLlgk2MaGEEBnASsbrrdk6O8IEH4TIAKoYrwwzwQieMWJQ64eZfDwjT/wignXg9ZiGYMVWl8lTOl7P+JxTKWh1sk6FwzSA44xHF9WNVPbcNEldaOdQkqc4JOGQZuce4ClTQHnIiiGa+TjJ6a3O1lIWtfx2pqTb7S8BG9sk5NuwdObo5B9LJf5AKHLasYXD+iS2OsFjyWAUJ4g7LK74FbDWwa2yXmKj16pOpOpQqySl9gBqqGotO8FZpQdCb6WJXrK32slPHA08DnZBB1wHqa1U46FgQxU4ls/Po1sd/F6V5DZGPJHmOoNtIlX2mlw5ydAjjoHdivKkN8/pgto/jSoW4vzQ59A9MdVIL+hWQrSbuEs4Khxah/hLKigrRdchCD60vlPpAlDU+6ne2SZuXOhs8RG4C5yC3F6KM57/7X8LnfYX+chJgAI56CQAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-source.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAsklEQVRo3u3ZsQ2AIBSEYUrGcFSGYEBncAGloLDQaAx3oP6XXC0f8kJBCCdJKcXSXLqUrqLOpVNQpC5+NVSDEO+8HrH/gOgPJylCDZAjHAApwgWQIZwACcINaI7oAWiK6AU4Q7wKcIRoBmh1+8o3EcCoAPMcAPgeQHHWAfwKwBADGOQmvrM4AJ8EMMQAOs4AAAAMMQAAAJwA5yPfVZcngDwQID8BOB66L3e+riEGQggZMhuPXhCuYgnwTAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-sql.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACCUlEQVRo3u2ZTUsCQRjHRcg6V5BHu3iJjLBbHspudvMTlCeP1SfwJSXQ00qCJ/XYyU71GepQXe2kIAktnfQQEtj/gScQcSXWmXUXnoEfM+7OPC+zuzP/QZ9PipTllEwms5nNZk/AJdpVcA+eQReYYAh+mCFf63If6lvlsfFisbihPeBarbYCh6dwWAHvYKwYslkhH+RL5UwHwTXoawjaij77DC4afAoM5jj6AA+gBM5ALJfL7aIO0WuBOkBwO8T3Yty3xGPnTQz5TtkNPm1h9BvUwRHwK3jCfrZVZ9uzfKbtGDZnGcMsHur6zsi2RQKmnQTGLkpgrCwBfswNrBbHql4httWY8wopTWB6tXgEZQRxzh9oJJ/Pb9M+YRjGKkFtvhahPty3zGP/tbrpSsAxJAEvJmC6KAFT5Ua2DNK6pIRu7EsJz4s57Ir7kxsVSVz8TgADtDUE3WbbiUk5TTFQLHZmvgfuwPqs+6ww43wouQUt8AQ64JMf/9+BZsDXOtynxWMuaBe2OtCQb46ht8gy+gVuMAs7Tp32yBf5ZN9K94EXnnGSBAGFh6YAgt5DfQVendrIRuANNNlxks7IqA9AuFAobKFeI7gdpnvcJ8ljmmxjJDuxJCBaSLSQaCHXaaGoi7RQ1OtaqC9aSLSQaCFJQLSQaCHRQp77k2/6b9ZlaCFtxQktJEWKA+UXKS+VPVPFQE8AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-stata.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAT0lEQVRo3u3WsQ0AIAhFQXFyNtcZNBQS79VSXGN+jKIycx2+j4rbOZoHAAAAAAAAIDUuXpjE5jQAAAAAAACAZE5f3/qFAAAAAAAAACTpyzZThRxG1Jl6eQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-stylelint.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD+klEQVRo3u1ZW2xNQRStqqoovjx+REhTQdPS8OED4YdIPUJR9QiiXqGod1L0vureNLnojzSC8Kcf+BDx0UilHpU0RJH4qiAeCZWQlqLptTbTZEzmzNnn3HvcK7k7WTk558ysvffMPntmz8nISEtavJWaP9Ij4ZqHuq4AXRJqYrHYgHgIw8ShgIizGxsbB+JaHQ6HR7jlj0Qiw4gDyKqvrx+Ma7dGX9iVE+h4SkP2Gz6fby6uOeL+Pe7XueAvB94KjlxgnpU+soXtBDVEhzMGMsIJyYF+3Pb7/VPs+AOBwCS0vaX0zbWYbRlkU6bdqGQC522ICA81DhB+AoFgMDgW1wIZ4hnJD00/cuARQ+8FCl2TAxcZJIQ+YZDu3XOgSfO8GXiq61NXVzeUqZdwyeRACfCVSVSeKAfwDc1n6iTbSoxhhDieiUadDLLNiXIAWMrQ94lsY33I4kN75dKB68BUYIGCYlpDXDrwGpjsNM2VOnTgHUJhDYO3DHjj0IFSp8bnAx+ZDvQCp50saGIBi4qsxXGgE1ExkUUeCoVGo0MHIyY3UEggLot0PGJl3QmstVqE8K4QuIqZW8HQ10G2cUa/lZMRoHQ3sLGhoWGQBU+11H6ZwclNwB5mFmq1XZHRKOIgJ8cwA7PsHKARtsh4c5zootXadgbEqDxzQFpj4QCt1FU0woYQ8jvQQzblcD/i6dIHZoc7cex27zJ19GK2ZjglDzHJaW+T68L44SKDcXQE3YxONtDOVLDQBX8Jk7udwtrVFGPapjFDKerCgZMMXtJdHG+Z52MoeuyC94nbBOFIKM8z9up9wCg1BJE+K3BdqWYhPBvDMJ50Zieq2C60KERklMl9YPwRea+jKSeNicFqhXctMOiojdKzSvvj0kK2SnHgnA1XtRdHHllAm0HpC7l9NBodAsMP4fk2uZYVNfdLA0+b1fYkbqGiHQq+G5RPYAxEnqE/cRd4etClxLa6watg9N9qcOCw5yd14kDrgYUBlxkz0GjRlziz/slxoyg5ezRGfDBtd8Wxja5Q6nFcMibgoz5osb0uslnZdaF3IBmHvjSa9zTG7JOy1nrcL+mfFdzv1zhw33hY5bET+ZpzpBvqDMGJReLZTaXtN3at66ETVerptdh++CQHVovdbbcyW3tT4f8BhVKLWmaK48JjQKVoM1txtCVpoWOxOHWbdpFK+Uhhl5dqf3Iq5dE1lY8InV0p9ytK7HGadWWmUj42257zJ0uQUcaLX1B/lZlS+djF2S8lO5R2qGVmf/mI0Nme8n81RSg1yWWmKB+bUjZ0VAkGg+Ng7Ofa2tqR4qz1Cz3L+J8ERm+hMpMWMc42O1WdWAzjl8f1szotafFWfgH9NwO4TP/m3wAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-stylus.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACyElEQVRo3u2ZO2gUQRjHNyHGYExURBCCCBYqopImhWB1goKm9QGCBPFRBBs7Y/P79ta9Ww8JXCFcLAQtRJT4KiIBBUVFYkBQUQiaIvjCRk+EJOaxNhs5lp2dDcLuIPfBVPsN/H8738z8Z8ayUgygSUT2AzeBj8AcMAOMA9dE5GC5XF5qmRjARuAN4GvaZ6DHKPEisgv4nkB8besxRfyeoExqxc0DfcVicYXjOB3ArQiAt5mL9zyvDZiIEOfU5pVKpdaIEZo1oe7LEeIngfaI3EehvG8mTNr5CIDnivyxUN6VrAHOKSbnw3CubdtdoZxpYEvWAK8UAGPhvQF4VvN9BjiUtfjlivLxAd913TU1uWuBB8Br4LJt29tMmLydmjX+mGVyALs1AE9MB+jW7bT5fH6TyQC5BFahaDLA5gQAX4AmUwGaI/xPVOs2eRRGEgAMmgzgJgCYcV13tZEAtm3vSOj7D5g6Ao3A1wQAAyaX0UACgA8mA+xNWEYbTAVoAX7pAETkuMmjcCPBCFzNTKDjOOtE5CRQAe4A94BLnue1BYf6wwkARrL4s9uBuwrfP1QqlVoty7IKhcKquLNB0D6lJtz3/QagD5iNEDIlIr2+7zeEYN9rAH6mKb6iEDEnIvsUozWsAfiR1iXVmRgRp2PK7boGYDyNmt+qKBsfeAE0xvQd1AAMpQFwO0bAzn9xpiJyNssDymNN33bgd6bHS6AYI+CEZt6c0pTP/TTKZ1QlwHGc9ap+waVtnCOdAzrTAFD5mWp4zQ/1O6/5+25au67qfDsRUzq9GvHDlUplSVoAYwoR00BLKHcZcEFjH54uWI20APpjxOSBxuAx40gM7N/baWBl2o6zA6jGWYGE1yj9md0FBW9dk4t8qFto74CcKbfOo4sQ/hI4CjQbc8IKHGkOuBgIrNZM6InAeYpt211xS2w96lGPevwf8Qdg+GoCtA3ZxwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-sublime.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADMklEQVRo3u2YW4hNURjHD2MmUjIuJTzJvRBeRFEuT1KS5gFPHjBSNA9E5LfWnvZpOoyQy3Yb4z7HNZmXoTAyjUx5wMQDMWrKMO5MCcfLUnumfdbZa50zY5+ar/6dl93/+37rrMu3ViyWJoDRQAXwCPgGpHpYP4HHQoiNQL+YSTiOMw74+B+KTqfHwMjQAEBZhIpPASkhxEoTgN1RAwAwAbgQQYADJgD1EQQ4agLwIoIANSYAHTlK+gf4nSOv26GKj8fjxVkmahJClDqOM+Hf/h2Px4ullDOB9UCdJdTTsKM/0bLw90BJyBwzgFZT/7AAcy2K/wSMMTksgf2m0zGZTBaEMV5uARDv6iOEWAs0A8+AOiHEFmCy53mFajq9scgzIiOAEKLU1FhKOcfvUV5ePiqHi9efZ1oYgJ0W5p2mj+u6Q4G33dBOLAozhQ5YmC8L8BkihNgKPFDbaS4gVoUBSFoYtzmOMymdp+u6w4ENQFOWAGVhAO5YmrdKKadn8pdSTgEaLHNUhAFozvLkvSGlnAf0TZfD87xCYJ+Ff1UYgPc5mq9tQDVQAgxLk0sYetZqi08mkwU5XHBdr4fr0rQtJtvtw0yjP6Ibu8kfQP+AnC0GHq8zAUztRoDvnucVBuRsN/DoyASw0KKweiHEYmA+sA24D/wK+E4G5BtvkW+QDmCFodmHysrKAUGHmPLaCySEEAvS5HMtAMbqADYZmr0L1SEG5xqv1oUpwGydqc2IuKlUqo9h8SOB55ZraanO+JilaQOwLGg6dd02VbPYnsVmsEYHcD3LnaYDaATOA3uAzUoHgVrgSw460h06gMYIvkZ01X4dwMs8AKjRAXzJA4D7OoCfeQDwVQfQkgcA33J9nexp3c30KncvwsX/EkIs0f0DRep3lmorXGCXuj0dAg4reT4dUTrq0zGl4z6dUKry6WRI1QAJKeWUoI6200mcSCQGxiIawGDguO6DJ8BX4DZwRl0JT/l0WumM0lmlc0rnfbqgVKOUVLqodMmny0pXlK4qXfOpTtX2SgdwMw8W8SMdQHUeANzSAazOA4DtOoC+6qnjcwQLb1c3vKJYb/RGb/RGZOIv0zufYpQr+YwAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-svg.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE7klEQVRo3u1ZW2gdVRSNUWupiig+qkaMqBVFsLWKmgbB+iFVqAWxBopfavUjig/EglDzzk1Ta3v9SK8VP2KIEhQR0/xoH9pqBeGmpGrrA7SIFo1orMF6tXRcW/aExfacM8Odsb0fGVjczDn77NnrzD77Mamry/kaGRk5ua2trRUYByoK+btV5upq+YKRjcBuIPJA5hpr1fg5QNkYfFDBY+VSqXRqzRFob29/joz8qqOjY3E8J39j7EuaX3sidrgeRt6N343AMLBJ7+sVP6lxR4EFjvULdC5S2XrSWVSd8rtCxnM1vrOz8zIo3e7xaxlvpvudgU3YSXLNAZ0id0Wexv8WOJgR7axgNEBg1LPGhWk8+/LMbmN2aR/QAizU3wnHg38FzrC6+vv7T8f4Lw55q3Mfze3I5E7qnzMPEiMcRrlIFBybUXAZb3UKeUNiRZY3sJEUtXhkVjoMG3LIDTnkWjwbdx/JFLMQGCZFCz0yDcDvVRCQNQ0unQi715HccBYCm5J2S+WaDIkkAiLbFHDdfN6AOQMT1l8DJEIEgsbbcyU25BmFJtTnGxJI+Ah4jVdXXGmCwrZMUUgJNDtidsgQITHgGB9IWGPP0VGchSVVEZDCTGubyUCi8ZLo6+s7M81YwHiG2LA2dQGoJXE5IUumOoxJF3b4Fqw/nPJZ5cRSXJsRruf/1rpkqyeLVk0iwXjJ5mPAB8Z9dwebIrjNo1wSoxa5ymTIgh5GiwGfi/hcDGteAl53YD3rEhtMKd4acp9xEryhVnoN7Sdiu8ZDBCpxJ1WDHd+3alslJMR++GeNYca2tARch3UQ5+QpAf5+VWp2mn8XeETxgmN9J81/SONTwCvQ+QTwtJ6DIyFbqiHwFnCule/p6TkP42+rzFg83t3dfYFZL9FsLj1nj44PFgqFs6zerq6uizH3Xl4E3gmFLsyfomF2Moqik2icv0aU43FJSLrDQyzv+cqxKyuBiuyGUbpcMYd27BLc/8WJBn+/QXpKFFEWSfzv7e09m2TnSuMCF7qDNwsh9OqsBEZNknvfNN71tHYMBtxLOeUZkn2Q5FbL+Ynvi8Xiabj/hGTfNG/y4ywE1tHczXYeRi7D73zFZiO/NJaTBoXGtwBriOgyq1ezdKz3tSwENtDcNSnqlR2xvBxO3B8D/pBzQnr2Ao/TfUvKWqgqArvM/IYE5YeNW+2XkEn387S2OW4E/tMLI0ReiFd8I179w8Z3/4UcPNI3KB8GTOkceQhInrnWgZGsBCY4YjganjXmXNzPxSGwiuQfCxCY8jxjcx6J7ABwqy9uY+55VxOON3UTfyfV7H1CCMTYr1FhPcd8LY/jz497TIjkM3EgQEDyyMuKxv+LAOMHrtvJV4+42j+NSlGAQOQq5bMS+Iwaje2OPHA7rV1HcXyRQ/dSWvuk5xtQvH4xrStlIfAizc3X1zzz1QAlxKUmQcVzqx3dHmfm7kB+meYCL2sU+pQPLoy4B2NfSLvJX+pERsfidVscurk2+siQewBj3wCfA3eaQvFQ1jOwPMUXPOsGex26Dxr3uy2F3ofySGQ/S0IJrLlevyLYf3jMI5nzXUEASe/KQB+8xDRMmaLQtPiwNDDctGDsWa11XGuaaCfv8shMSSeG33PIhou0e6vk2ZExvgO+TyH3I/C1YjJB9pjqPZSpFpq9Zq/Za/Y67tc/cD6QnHKLemcAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-swift.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADVUlEQVRo3u1YW4hNURgex33K5DaN+4QHJQyjxIMXkWuN25QYRqI8UHiQhynnfjqTOTiJTt6U5IiX4YUp5VJeCA8iIYSQzJAZDLbv1zq1WtbZZ1/+vTnsVV9nt9ZZ/1rfv/71X1ZFRdD+w2YYRp+yJhAOh5cBY8qWQDqdHgICtyORyOKyJYHNbwAJA0gC/XxbOJFIjOa6B9j4VUGCfkf5QiCZTI6A9nbncrn+DHdhiSBAuM+lHFnbNRAcUvuj0egs9F8AmWqXBELAQ4VEDRuBTCYzGEKjwEiNDW9E/1Og3iWJPRIBwrVsNjuQ0+VNAu5C6/M1Y1mghy6kG5OEjB8KieOssQICVwC9QEs+n+9b6Kd7gL4rYtE2p94E824qBAwopZE7+MSF8A7ZY9A38KIwRhp1ILtNJQC8BKrYCJDmIfCSEP4aGlokbWAu8FWMPYG51dmMCWs0BAiHuE9hOHBPCCe7TRTMho4c39/FWDddchtyZxYh0JNKpYZxk5ggmcyvIBSPx8eLsS3KBnLAoFIyMb+2CAHCDi+SsRlAl7TIO2h8lRjbpWzgFnmyEgTGmhC441VGuUCy+wJOAENBZr/S34m+BhNZU00IEMZ5RWKdZrHnwELgoGasVZeCgNzyEgTWe5nbby+y6BHglKaf7kytIiNSgsAxrwuUrZpoSngEPNP0d0HrzYVoqwtkCq77kd83FyFhhnagycL/XvlVKjZJsYATH/ysd+lif2Mm0O13ubiUtMZI4IvvNS/yoemiXuAg8N7q8W8C5jCaE2WqNxgIXLS6YJUo8dqpbGSs6k67JBC1o7V64LOYeI7yHoaTCEmpuBOctVWhidDeKwnI0yOU3VqVFsVJzsb8k27NCOvvtOtJGjU+/SNpA9hMGaZcXlKj3J2KGxHUWoEHnJ7IdlKHCauBTyZCyd+/FfVBpwcB7Lf8yok7rGN0h65PIRaLTXTy9FEtTOdvIJF1401WKuXkn8Bjty6RYsU+4I0HmyOncYYcCJkuMA/f29B3XvnfAI4oW0muzUIubwVUXx82s2/KEES1Z7A+PVLDwpPFqXQoxX4pXBZvrJUWlTaNHIrX6XQIhKbgd60oN1vogQo4ChwA9tJdopcIh5luQ0XQgha0oAUtaP9K+wmOCKk9yoqggwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-tcl.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADIklEQVRo3u2ZW4iNURTHvyHXktsouZUo5ZJrcikvyi15mBcaNVMueTl4Qhrlt/Y3zsyQMwxiPJhyK8eLPGBIGKMwQiRpZtA0LkeDMGHEbA/Wqa/Td06enH1y/vXVtzsvv/86a6+91v487x/LWlsAzAOOAc1As5crAqYBTUAncAN4BXTkCnwE+AIcAs4DPwELfHcZeowxZiawRqO9CWhTcOu0gfLy8tHAc+AF8BpYpaljU542F+FHAi3AA+CZiGwG3oTAW+Cea2nTX8FvASOAWcCJNPAWiDsDryXyJHAfGA48FJFSoDuDgYgzBkRkI/AVmKiVJgn5C7gbZsAYM8WZiqPwERFZnwK6T0toqoEGa22BKwbOAu3RaHQo8C4AeQXYGwL/E5jsBLxCWxHZzh8lId8aY6bqP5NqoFlElmYd3hgzH1gBdEej0WFAaxJSRBYC+zNs4BlZha+pqekDJPTAegzMDsCd0vOgKw38bReqTqnCfASOagpZoMv3/bHAngzRL3Gh5t8HHgGFwAygTuGqKysrBwKf08C/B/pmO/ena55vE5G1wFZtlT8BhSKyJUP0d7tQNqMKMwaoD2zcMqA30J4Gvtv3/XEupE8z0BCLxfoB35KtcUVFxWCgJEP0L7oQ/cka7Q0isji1MQPuZDCwwAUD67S/GQLEAnDLgfEZ4C+70jYcBlr0/YnCJWpra3sBO9LlPjDbFQPXgQtA3wBgtf52O8yAiOx0aWi5ChzUgSUJOaeqqmpAYFgPPvXAIFcGlghwHKgOGOjS0rkkTfp8EZHVWTcQj8d7BgaU0wrdnexr9DALM/AZ6O9K+iSAS0Cdrp8C+/X9SBoD1S7l/zngWmB9ACjW9/oQ+IQT+R8ALtKqsljX85KtAdAYUn1WunZt0kMH9ITv+xOstQXJuRa4mQJf5uqV4XigQ9viYmPMJL2JaAoY2OXMwJ7GxDLgR0jOdwJFrt80j9IeqCPEQCuwyMsF6Ux8JgDfGIvF+nm5pOAgb4yZ6+Wa9PLWAh+c3rR/YaDdy0XlDThgYJB+98pNA4H70ZdeLktESr288sorr/9OvwEp1f99Z6ntsgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-tern.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACoUlEQVRo3u2ZTUhUURiGx58WllG0qrAksbIiaiFWRBC1SC0KKwrsFxEKorCN4KJ63nOvMINxF+00opUQQxBhi4owIhdB+2gXFhWIVkw/pqS3zV0MMXPnitKcC/PBt7087znf9533nJtIlKIUxY2+vr4lQBfwHPgAfAXGgTHgPfAaGAIGJPVIOuI4zvp0Ol1hjQhghaQWST3APeAt4BfIH8ADoNXKnQF2Ak8iCPGB+/39/YtsFXIcyBQSIemStX3iOM4mYLqAgJPWCpB0IQT+N9BtLTxQB/zKAz8DNFs9ZoHHIas/YDv84QLN22S7gKdhAjzPq7IW3nXdWmA2TEAqlVpq8+oTYfYfsBW+HBiNcAK/A04bY7YAi9PpdAVQWSzoSmPMVuAscCeihciVs8DDZDK5bD4wy4F6Y8wuYB/QCDQATUAz0C7psqQbwO3AcU7OAzpXjszZsQbgjcAJoEvSNWAQ+AhMLTBglOxY0DLxPK+qt7d3VbAbe4EO4BbwCvi+gOBTwDDw7L/1gO/7ZcHobAVMBMjPwCPgJtBpjNkNrHQcZ13gYAclnQOOFqOhqyOU3LiklpBvrAa6jTHbgLXFEHE3wi78kdRWwIbXF+XAc113TYgLzc4J3/fL8n2nqKc1cD2CgCHbXywmCgg4ZLsjDeuFEevfjUIs9YwxZoft8OdDVt/YDl8DfMsD/9Kql7k5ls4oUGM7/MU88J+Aetvh6/IYuzFgs+3w5cCLHPBfgO3Wj0xJV3PAZ6x/PglWvyHHreynMWZPIg6Ro3QmJe2PC3z7P/DTkg7GBb46uDNne/xjibgEkMr2N5JOxQbecZyNWVfHWaAzEafI+geWkXQmVvCS2gL4Ydd1a2MF73leFfAGuBJ2n7W5dJqBDYlSlCL+8RfTZzwRnWD6pgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-tex.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC6UlEQVRo3u1XW4iNURQe5XJGDJopStG41ETNAyYeFC/ME2UekTxMuTxMSUqhzn/O+c/Fw4kzpPNABnmaEHljSLnluEskEYkaqWnc0vD7Vq2/drt/7/9m/Ef2qq//nL3WXnt9e6+999oNDUaMGDFixIgRI/+xWJa1J51O1wTcAu5IbTr9QNgx0ecE8AL4CTgCfgDHpPi2oe27ZPcRuOk66we+AVY2m22ltmq1Og7/U0Cv24l0lUplAumLxeIUON7gBuE4zpgokwef89H/vRDYEoVdK3SfgeeZTGaFPBsDCGanYqb2Cs5THvo5wEihUJgWIwPWCGMcUsTRBDyybXu6l7KWz+eboxBgm8uYoblx0hg+jvMYv0BolYf+KNo7VZ37NY59CdAewrJ2xCFAKQn/b3kc+k6VVqhXx74ahwDa1ytnJ1wqdQpjnWTfLcDVcrncqOyYy+VmRyGAAdeh7S7wTjohXgKPgSeMe8BtYEiwsVSTKdh0Aaexuovj5KbvCrDdNbZ5rbEZD2wGPrkz7GEzCXjFvr6qiI4GgbNs8yyAz7XADY1+JW1m9nfxbxE4F5QA3Rmwu67x1QYMCuNurysCbH+A0sWjfSztFzpK8T0vpFJbogTQbkv/u4F2j5NoH9qP8OEyU9j4NaoOEiFQKpUmo/1MgLEWUakgrgwIbRHGtxMhgCB2kF43DtVYVCrIdQ7vlyvsmwq/5aNN4AtwiXGB7wPHjwD0+4GDCt083gcOH7FNkQi4lagPAapOZxCovsJ3GZ04OgI063wZTtTc0ruEiewLFDwvX5/QsT1KCiHAhV4EaFNySU4bddinIqBqdFiIpUdluAm4zw+WQalEoBx8yo+Y3SFPoVPC7wXAAykgN/22evTtlsoQFx/Izx951QUgMEtHKnEJe5FRdUkX1T9LAHYbgcP1RCBMMZfiMrunngj4ltN8Ii3ltwHZrk466C5+rPg9aB7yXfBGtNMdm0aMGDFixIgRI0aCyW/mMEwb/IztOAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-text.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAArElEQVRo3u3Zuw2AMAyE4ZSMwag3RAZkBhaAhoKCKCLKOTz+k1zjL8iWoqRUiKRJUpa0StpMtUiakyNH81tAeRDmk/cjzh8w/WFZEW6AHREBsCKiADZEJMCCiAZ0R5QAd1fkMMQoQAnxKsAV4hUz0LUHAAAAfBTguA8A+BWAIQbAEANgCwFgCzHEbCGGGAAAAAGAyEe+Wq0tgPwgQG4BRDx0V0/+6GFKhBDyyOx2IFQT7ETVTgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-textile.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB9klEQVRo3mNgoAD09fVxNjY2Ojc0NLQA8TEg/g3E/4F4BcNgBUDHMQEd7Q6ktwDxT6iD0fGg9sABHI4eMh64M+qBUQ+MRA+sWrWKuampyR7ouDdDygNAx8gA8UQgfk6Ew2H4AxBfwIeBRbE3TR0OqqSAFvUA8Q8SHE4KjqF1yKvQyOGjHiAKdHZ28gIticCCnxHhuJNAnIAPNzc3Kw9Upr4x1OuBUQ+MemDUA6MeGPXAqAdGPTDqgVEPjHpg1AM09cCCoe6BpdSyr6WlRRo0ggHEwaBhne7ubm5KPXCTCA8cpEJAKUFHwNHN/gLEXaBRE3INvk+EB352dHTwk+t4UH8ZaMZrAnYcmTRpEjs5HrhF61EHHCGPDVeRY/guIg3fDxqOJNX8trY2YaDef0TacZMcDzSSMPazE4hNQLM6IM8AaT5g8lAFzfAAcS2Qn4ZuPjCjGpMyvkRO+tSk4uDWASwe0CVB/09y0+gGKnlgJRaz2YD4I5H6D5HrAQUg/kSBw+8Bk1Di////GXGY30yMOUAzPMkup6Fp9TaJDj8OtDQcSLMQCCBQLKzBY84foDn51KiVOYA4B4jPYCk53gPxZahDklpbWyVJMRsUO0BHBgL1bgLiR0D8AoivAfF0INaiRRODB5jB1YG0GojNMApGwSgYBSMCAAB6qQcQYW+tHwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-todo.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACj0lEQVRo3u2ZzWsTQRjGY08iqVbRlkaIBT3owR5swRZKFIkgKoKKYMUeSm8egtAecsz3x//h0ZMnwYOIF78goVqiWMH2UGhpoWqbpjEan7csMoSZndntTsiSGfiRzbszz77PZGcysxsImGKKd6XZbB5IJBIxUALfNUC6MbqOFgMQj4NmG4jrMrDaJgOrugywF5lgEMWd8l9HuwGVuFf6xoDgFnrKIIo7pa0GtGIMKBh4zCCKO8UM4q6aheYYRHGnmEHcVQaeMIjiIrQYQLuhtgxiHQaSyeQk2tXBfd8ZQP07oGG1bcDMbZULX2YQxUV4ZgDJ3rB6nm1P3693/CBGvSioCTQoHtVt4DW4AA6CMfBB1QDqREBVov/czsAig5vkX4FDrH6hUDiC2HuZAcvsL4n+W3DY8SBW5E2xWOwVJHcMlG2Sp19sU6JfyufzR13NQgrQo5M+ux7O5XInePFUKnUebTck+p/AcZVZKMigmvwCLzmV50BoexasSfS/ZLPZAV1Lia8QH2zVTKfTp3HuHX3aXPcMWJHof8tkMid1rYWWQJijF7bO7dVBAqda61CMqSNimdfWKwPr1IMcrRBnBltke5GOqWcl+is8fc8M4J9ylqPTDyqCNhW6jwkcf5bor+HWO6d7OR3h6LyUtJkHHyV1aDYa1r4fwC8wxZkOL+Lcz32MqR/QGHGz3q67uBj1ZJCjRc9Ct13obSH5cbcbmmdeLRssvStgx4FOFclfcr0js2aFsksTL2jRxjFxDewqtK/hdrzqxbayB4xaS1mnhASat8Bvm+Tp3M2Ofn2F3r2HJP9wkqcd1l1fvINDsg/BXyZ5On7gqxeJ6O0ZZgqe9uXbUCT/iDDvhU0xxRT/l3/F/NPiMTV1BQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-twig.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC3UlEQVRo3u2ZS0hUYRSAByozlZIeFmQuahdEhRQlVNCq16JF0MJoUYseRgshNxV95/c6jQxJGBSzKDBqM2AYQURGRFaLFglBkagQPUgyNLLCZ7b5Jy7i4977/zPOjTlw4MI9/5zvnPkf5z83EslJTv4fARYCt0RkdxjhtwDdwDjwFpgbCvCGhoYFInIeGNHwKT2d1eDxeLxQRM4APRPAU9oXjUaXZONUWSoiZ4FvU4C79VJWQCeTyTkishdoBoY9gP/7F4D82cx2GRADPvuAnqiHZgO8FLgGDBmAp7Qlk+ArgCvAoAXwlA4AeZmAPwz0B4Qcm+69UmpH2sDr6uqWA3cNMjzmwaYmXVnfDHw1nCKdHmxupgN+F/DTEL4faPNg12Yb/oDP/XwqveFxCnVZg1dKbQR+W4D/ogPwYttrrQwA3tvYHkXkgo8p+N1WAE2W9vbnwFUf9r024Dd4nK8z6Q+9AfhZQ102ArhnKftHAvzWMyP4aDS6bJILRxC9LiKVAcY1mWb/pAX4h7o67Quw4I+ZBtBiCP8aKAYeBBg76jjOStMAOg3gPziOswq4GHD8HRsLOOjB1QGUichBgwTstBFAEMftQAmw3SABT2wdYMMBDqpi3esZCAg/DKy1FcAnH46TQIFSapPBBWccqLdZfbZ6cDgoIlXafp9hqf20sbFxvs0AamZw2K2UKo9EIhEROQGMGsC/AxZbrf+VUuumcdgci8UWAUUWir0eYHW6ro8fJ3GI647QYQj/AihNZ9fBcTkbEZGjGn4r8MsQ/nIikZiX1raJLuhSoKdcU6vPALwb2J/JxlU9cFs/F/vcXt36RkSqMtKwmhBAfjweL9TPCR/Af4BXOgEV2dAir9BQ48BLfUmpBpQu2s4B1SJSqZQqB4qyrcff6mr7bQvVt6za2to1ruzfD+PHOHddvyeMAbRr+CGgIGzwea7S+nHosq+UWg88Ao4DJZGc5CT88heuOk6WH7WXIAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-typescript.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB50lEQVRo3mNgQAINDQ3/hwJmwAWGkwfuAPGCQYbvkOKBBQyDDEA9MeqBUQ+MemDUA6MeGPXAqAdGPYBmp0Rzc7NyU1OTNpAt9///f0aaeQAozgfEN8jBjY2N7mhmRQDxPSytzSdAPLmlpUWeFh4QoKAZHAIyY9WqVcxA9hYi1EcMSg8A6WY08WdAvBeKn9LUA6D0CZTjQcfA5FGMpHcHNjVAzALEakD8F6ruJxDHoKd5YF4wBYpvo4kH8OjLQdK7BY+6AiR1U/CZ2d7eLjgYPdCLpK5i0BSjJHigBkndIVxF5mD2gAlaBp4zadIk9iHjAajapWieuAsroYaEB/r6+jiBajZjKWYPALHKoPcAVD0TEOcB8Sc0T3wFFsn5g94DMABsLkgD1a/BEhv9Q8IDMAAMdW+gvvtonggaMh6AmsEFxFuRzLkwpDwANUcOORa6u7u5B1s9wEWEWR+QzJIYbB7oBKb3cFzywI6NOpI5X0BN78HmgSlQNbuAHgmFlkKgVioXqMMD7fzAzFk6GJsSU4jsO3wFNb0HnQeAoZyL1B/AhUGdGge61gPATogtUM8EKE7DpxaYzlWBHqkHJSPopAXIwdeAeDVQPBm55BkdVhn1wAB6YMhP8o3OEw+IB0bBKBgFo4DuAABrfvSRYrwkswAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-video.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABTUlEQVRo3u2YsUrEQBCGTxAsRLzKxsJHsBYsDs7eykofxPKbsEVCGk1lodU12gsWNr6AYGVhYaeVHAiCwqlrYYoUuWTX88IuzAfTZWC+TSA7f6+nKIqiKJFgrV1ofMAYswHcAF+AnUM9iMjQd/CiKJYAA3wAo6kPlsPbOddrmqarrsMnSbIF3Ff6v5sEPjsQsMB22+B5ni8Dx3VfQ5OA7agGTcMDO8DjtP5gBYA+cNbWH6SAiOwCzy79QQkAa8CFT38wAiKyD7z49ocgcABc/rU/BIGZfpQhCFgVUAEVUAEVmKUmUQuIyB5wHvMbGFRuoE/RClR2gNNoBSr7wLBpC4tiIyv34KO2y17wO3FNEuEsEEwqUcmCJj4C1x0MP86ybMUjF9oEbp1yIWPMOnAFvJUp2H/WO3Dncvo1B7sIHAJj4ERDVkVRFEVRlF9+AGQI+YbuTbP9AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-vim.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB00lEQVRo3u2ZvUvDQBjG/f5CRRFFpIggTv4b4qLgoIODi4uTi4vz7xpM6dKhg9DBwUGQIggOCkJxELSgCCJKEUREEDcXRfyMi5PUcJdcmhPvgRvz3PsLyeV9n1RVWVlFI+AQ8BTXDZD4zTOZTA4D98Cj4ioEAfACrnEfz6mgvv8SYBU4Bp4kN3kASkCfj2cCOP9+jF4UADJh3oWi5CYjCp6jwLOkb9bzvGpjAIQQYwp3fzlU8boBhBATwKukXw6o0XGcagEQQkwCb5JeK1qK1wUATAPvkj6r+Xy+VucHLRQAMAN8SHqsaS0+LIAQYhb4lLx+HaiLoqUIBADMKZzzG5EUHxQAmFcofjOXy9VH2dQpAQghFhSK3wIaou5KpQGARYXit7PZbGMl2mpZgB2F4neBpkrNBcUQnWm5VchkMs2VHGx0AuwBLZWezHQB7AOtcYyWOgAO0ul0W1yzcViAItAe53AfBuAI6Ig7nQgKcJJKpTpNiFeCAJy6rttlSj6kCnDmum63SQGXCsAF0GNaQicLUAJ6TYwYZQAu/fIg0wGu/PJQ0wGugX7TU+qiTxI98Bdi9nIAt47jDP6V/wRLP5KFO8dxhuwfFCsrKysrKyur+PUFBRIOL/hw7qEAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-vue.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACr0lEQVRo3u2WOy9EQRTHZSMkElsgHh0FStuwtCiwHwCFV0XjkXjU+8hubHTbWIXFB6Dx6FF4hIrCo6OgYD22EOt5JrmS4+bcMXtn7r2Ke5KTzb33f86cOTOz88vLc80111z7NxYMBrfAvzRfJ74XgV8hzS8PhULjAmNMGMVruYuImHWk2TRMHolE6kHwhsQdRLIeTgGP4OVG+aPRaIWmMWpAtz4G3nUiTRa87q8OzaGAM/ACQrPDmcQSJ/cyJ26b0BeAnyPNnMg28oLfoq5MEhof+IdBIZ/gzfqYcDjcon2jYt7hewMxzhTSsJq8QmcBih5CgU9s6YnkSU43j8A9SOsBP+bo54n8leDPSDOYy2FmAx6i4EVCUwb+wNnPw0g7wik+HYvFSon8KaQ5wA0RMlhSPx4InhuJQcY4hd2Bl7Di4PeeM9FRIm+Tbmy/2b/VFZRoT98FeM4HP+VtjT+22gnLQaz+PtIsm74XYO9XQYIM6lYfcV7aOAV+cA4781aiaf3oe4bVIHu5zaCEN/F4vJjQrHGKNPJVfR6Wm42BGjYtfTsnEolCSHaJBp4lLsAaeP+SQ/FMW000Io40F9QdZMqgEwGU+BUKriUGj+QwgTDRhFrtpv3pfsAJTroWKN6IdzaEeMesiXASdK1XYAI90rwjsQoinLTLKX5HCe9ITECGk9g7nzLekTjQmJMYq1QSRS0QE0gq5R2JVdBzUkqAk9LsHaFbkuIds5YrJ1nKOxIrIcpJp5byjipOYgxDTLKdsRJxjgaU8o6VnGQL71jJSbbxjiJOylKchIqvs5R3rOIk23hHFScxtiGK77KFdxRx0jne27byjhWcZDvvqOQkR3hHJSc5xjuqOMlR3lHESc7xjkJOco53VHCSo7yjgJOc5x0ZTvo3vOOaa665Zol9A2lGJHirjS19AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-webpack.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEpElEQVRo3u1ZaWxNQRSuemoLaqutsSZIGksqfohYwg9LglgjIn7wRyKR2GP50b2vKpU0ghdLCP7UEhHELkURCaIRhNiXllKliKV1fUfOyDF57765977XPtJJvtztzJ3vmzn3zJm5cXFRKmlpaYOB88ChzMzMPnH/SsnOzu4E0juAWsBifAM2+P3+NjFLvLCwsGl6evpqEP3IpH9qR0IFbBbh6Isp8iA0A3gkiJ4FRvJ5VUZGxjAcr4rndyBkQiwQTwWKBbEHIDaFnyUqAXRtWVYjnM8Bngr7ExCXUh/EOwM7hZ9XgfgyHBOEzV8CVCkoKGgO27W4X83Pa4AtOTk5HeuCeDNgjdb41mCNhxKgdcJ2rRNWyE6INPlZwGMx/Kcx/ANs7G0FCLuBwBnx3ocQMj1ixEFyCF56UTRwH5hsINhIgCogPQm290Q7xdS2l3jeBS/ZJcLge2BpIBBoYjhijgRQoXfDfjHwToTg3VlZWd3cuEy1eMlmoIPD+o4FqJKbm9sW9baJ0ah0I8ASOA70d1C3L3BUdMAeINmkLofbeUCZaP+rFwGf+fgd2Eg9G6bXC9jW0vAFyMzPz28ZZl4pkRNeJAQkA3vFt1ABLCwqKmqsbOmc7vEzKwxeAfOBeFUfYbg9rgMipL6jlIPEqlzKtQARjSgduCaIlAJjGKUGxHXcBMmxnBtV8r1antTaq/zKi4DfPU4+GcQ/X/KLT4HAVIrdLgQUc8qtUpELdK0niBEVoAoPbbaK0yITrTYg/hyYLUZ2OOVIITgkqO/PtQDpq9pzH83MID7TZu6Q+ApkAS0EuZWcfvuiIaDWQMBf7iB6dSiuL4vnh4Heou5EntHVc5/NxOZNgIw2NgLUB0iTT5JMnzFC47T54ViQ0Qkn4IcbATUOBSh8AJbLrDIvL68Vrtfz0tIyFSDaqFMBCpfYLkmbVd0IqHEtwODlofCQ7GhHwiAyRUXAD48CHrFdb7cCeIb3JiBU+mwg4DHb9YyAgNqICqB1LSVmYUg9IVvk8j0MBOTThx6EQ7wXASqjTNDuTyNyBqSesX13G5ufYtKjJG9u1ARwDD8pGr8NjOb9nxvBUgaulxyCfAlNeJwkXpfRS02KPJf8FupaAKe6eSKGf8DktET6LfUU7i3AsVwQecEu1E0j/lTmQqKnF4qlJE2Km7lt1wK+iaFVjdO6oLNNndZC7Eu+15XrfgLW0fcTqj4T3irXBXpa70YA4RaGeoRpXY79AbHZu5uEONzxuyJHzo0A2fP7nBAQxE8BR5y2jQ7ohXoHRftlbgQk8hpYfcyfeEuwmWH9JK732rRNzpn8nHqrFDw3WIh10hv9tAySdudmhatH241s/8ZArAoCMmfaTyMRya3F8cBd0QAtAVNt7DuYCAgShul8ZLT2R328cyYX4TvI320EVNj4+QFBvFzfrYha4XC3SWSsH+ECq2htrNnQs7dR93MPG78pHGn+pNCUavAItFOx3MbPD0TUz90W3lmWa9xznGZY7G66n9+E+FGx9p8sgf/SVAX5uffHz3kU4uNitXD4DGi/WcnP/fXi5x6+j0H8o/ug3FJpKA2loTSU/6v8AgNIBBgoGUX3AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-windows.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABgklEQVRo3u3Zv4oTURQH4MmK7oq2ayto4YqID6APoIWriNiLz6AoWnxnJgxKIEW6gKJit4WI9XbivwdQEPEFRLRVVMZmizSJMQmbEc4Pbnvv+ebeW9w5RdGiDIfDvdiIiAu4gQd4iS9Ya0WRTdN06rpex5mIuIYenuMDfqIZM3YXgH1VVR3HRdzEQ7zC1wlFNrsK2Nra2lNV1dGIOIfNoiiKbrd7GB/xa8ZCFwtomqaDQyNbfg/P8B4/RhbY3vnyGwsufHpAWZancAV38ARv8W3KBZYPmHPbE5CABCQgAQlIQAISkID5AAdnHf1+f//OHCvzzDNuNE3T+Sug1+sdmGORtZEH0MIB075j8w4kIAEJSEACEpCABCRgeb/XT+JyRNzGY7z5h47K8gHjUtf1elmWpyPiKu7iKd7h+38BmHDkVnAEZyPi/EiL6RN+tx4wKYPBYLUsyxO4FBG38AivW9Xkm+dItr7NOmuju6qqY9iMiOu4jxf4PBgMVotMJpNpXf4AqJ16AL0q3tkAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-word.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC20lEQVRo3u2ZSWgUQRSGRwwKwRWCGXE9RBREDyrqQQW9imYEcUFPKoiQg0JAPDlLtz2jeJmLICgiehkUxYUoiI4HRXEXRDAHl4gmakLUkINb+z95A4/GWap7cF5LF3xM96uqnvf31Kt6VROLBSzJZLIZLAY7QB4UQT9wmWJMQ3FddwScaUulUuvAflyfBd3gp3D2b/x7AY7jTMQXrwAd4Ci4A75WcbQxAtLp9Fy80c34IgdcBj0+HS3HbRAPwIRqY9hVDg3RzjALIHoaKeAhWOoHnizoGb2NFFAMMEVv1SDgAVhkyChNAvwwU5OAQV6dTYhrEhD6GFAjYBj0gQGP/RSwMeXtK5MXUQpy3wTbtif7FfANbIAzq/F5SdivldqjbqPsk81mx3NKMk9FEFuWNYMd3SvstmjfJuxvhbCdZZy5y31MaPItAI60s0Ptwr7Wk1YPsv2qeM4JFTFAyzfZM5nMbGGPe/pcZ/thYXtRRkA3p+U1k8vlxgYJ4vNsb+KYeM33kzC8pvH1IW67je9bNC1kr0Tdc1DgIUWBnWD7JmqLwF3CdWsqOPMGZE2gDVWgaVQ84FwpF+fMMMPDaxauf4Ex3O6AqnUAzq7kOgdveTlfXwRdIpCfiGfcqCDgJg/HmqmHgD381rfQqQO3ew8+iH6dIlaGtCVzJ6mutEjhfqpYJ/4EslgtF1Rx5gdPuyZMDyrgqadNQtQlPHUdGnOh7/l8frRoY4k6y9P/tMpkDsG7ULS5Iuq6PP1fVhHQy6u0CS31yEYfgzPgGPgs7J9olqI1wJvY/a87smdgvSHN0YamjjwCy0woTSDRqUSdGOBZrGawSLZGMaBMQF/YD3c/hv14/V6YBQzhl9heScB8HmsHeRZ4p+UvJqTuU+QGxyR4aJO+CuwGx/nEbFjln3y1lkKhMBLOzKGTO06vL9ABQGgEVPi1xtHyj3G6C59HwC3wJTQCohKVqEQlUPkNLrZ+cciAC10AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-xml.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABzklEQVRo3u2XP0sDQRDFYxRBURARbKz9AGKhEEEhlmqh6KewsLIJmgQipAkqARE7ixTprGwNYmFhUESICP4rFKwEm5gcnm9hF4Zh73JFcklgHjyyN7OZm9/t3eYSiYhEIpFIJBKJRG1TMplc62YrALebLQCdCvAF54nPWf6S5d/hbxZTvmLfO2b5M5Kj8etmrEDcPOi5XG4Ax686/pPJZMbJJjAFO3DFskHESb0nn7zD4olmALzAQ6Touo4nSKwPLuu4DWAQ/jVXP2wA5UNT1HXdHhwXVFMmlkqltsncCmlghIwvVB5zNyy5lgMox0jhKBlPwlUbQDqdnjON4nNH5c1tB5CVsAEe1TPAThCFS2weXYF5eFmPY/A9yR2EDfBBl5081M8NAPb1uB/eI+NyqABY8iXbKwjiCw0A7sjxGLm1KmECnPKm2YmOfABc0zj5/m6YAJ/wKCk6rU6EqzhrYtlsdhixNy8ANLzKGisFBJiAZyyuBQagu0WxWOxF7EbnbtX+T67qos8K5NlvQi0IgM+bczUoQIEt/SaD22KFTzwAHhqAtgygricb/1nm0HydxWqWeY4lVveo52V5ne5IgO7+SykSiUQikUgkErVN/8IcKqWbekBoAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-yaml.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACCUlEQVRo3u2ZTUsCQRjHRcg6V5BHu3iJjLBbHspudvMTlCeP1SfwJSXQ00qCJ/XYyU71GepQXe2kIAktnfQQEtj/gScQcSXWmXUXnoEfM+7OPC+zuzP/QZ9PipTllEwms5nNZk/AJdpVcA+eQReYYAh+mCFf63If6lvlsfFisbihPeBarbYCh6dwWAHvYKwYslkhH+RL5UwHwTXoawjaij77DC4afAoM5jj6AA+gBM5ALJfL7aIO0WuBOkBwO8T3Yty3xGPnTQz5TtkNPm1h9BvUwRHwK3jCfrZVZ9uzfKbtGDZnGcMsHur6zsi2RQKmnQTGLkpgrCwBfswNrBbHql4httWY8wopTWB6tXgEZQRxzh9oJJ/Pb9M+YRjGKkFtvhahPty3zGP/tbrpSsAxJAEvJmC6KAFT5Ua2DNK6pIRu7EsJz4s57Ir7kxsVSVz8TgADtDUE3WbbiUk5TTFQLHZmvgfuwPqs+6ww43wouQUt8AQ64JMf/9+BZsDXOtynxWMuaBe2OtCQb46ht8gy+gVuMAs7Tp32yBf5ZN9K94EXnnGSBAGFh6YAgt5DfQVendrIRuANNNlxks7IqA9AuFAobKFeI7gdpnvcJ8ljmmxjJDuxJCBaSLSQaCHXaaGoi7RQ1OtaqC9aSLSQaCFJQLSQaCHRQp77k2/6b9ZlaCFtxQktJEWKA+UXKS+VPVPFQE8AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-yarn.file-tree-diagram-icon_style-mono {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAClklEQVRo3u2ZO2gUQRiAN+ezCr6NRVAjqEVA0mgpWhhBsLA6MVgFYqNBCx+F8P37uANBkAsRT1MoRsSrLBRBUlioxEYEET2RgI2ino8IEhONY7MHR7hXsjM7d3A//Gy1zPftzM4/D8cxHMAx4DuwyWm2ALqBP4ACrjejwGgIr4B/QHczwXcAMyUCCrjrOI7j+/7GIAjWNxRwLpdbJCK9InIeGALG5sAX83H4vNxIX3sf8KICcKWcaATwxcDwPMFLs8Mm/DrgYQR4JSJ7rMCLyDngRxT4MPtih/c8b5sG8GIPDNj4+md0CQD9Nsb+iEaBQzYEhnUJuK7bY0OgX5PAdCaTWRa7QDqdXgl81SDwyFoNEJEDGmagQZtFbBUwEWX4pFKptVbgPc/bAuQj9sCQFXjXdXuALxHhJ4E1NobNcuB1U1bfUCDQMPPcUUq12drb/tUgMGJL4JrG5cPZ2LeKmgpXaSbjnHl2aIZXwC/f9zvjGj5JAwIKyMa1bDhuSGAKWBFHD5wwJKCAo3EIiEGBG6bh9wOzBgWemz42+WkQXgGfanEEQbBBRA6HI+ECsLVegdOG4RUwWWPheD88FC595029Am9jEPhYpt0u4HaVd97XKzAbg8CzOZuki2VOtItZAHLAznoFPscgMCYiR4ArVU768kAym80ume9P/CAGgWr5TUQGgaULnYX6ajRQAH4bAJ8BLqVSqdVRp9FEeFFRqNDQVWCvpn1CMUc9z9ussxa0hzeM5Ro7CDzVtCa6ZeSUznXdXRUafSkivRHBx0VkwOiCDkiEP9J4SUHJA9td1929UHArt5VAu+/7nUDCcRxHKdUmIieBd2HNmAI+AK+AJ8A94CaQAU6Fp3ldVvbErWhFK1phLP4Dc0R+FEinPJsAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-access.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEvElEQVRo3u1Za2gUVxRercUWS+tb29I/pQgqKEilWqpWWpDaP/7o0qqZO3c3e+/E2PiqD0TQqKFqUfFHC5bWPxXa0voEbQXxhYpapSqiYJX6CjXZmYm6wSii2X7nzkw2ibubZGY3uwu5cLi78zzffXznO2dCoYDtTnjhyxYX420uohY3tli6PGzq0kSfdMw4FyqGlgyFetVH57xtcTnD1sVKOLcDdhX2LOVsOisAgHuc94/rxmQ4MNfW5fdw4hR+N2Z3tEAAMJqjTd2YaTG5Ds7uw0tv+3O0YwBJKV+s0yqGJmbKwfdnzRkQD1e+EhhAbp1NawkMzHn09bDmNOcbsWcuot9t6WItAH90g/OXignAA5PLX00uNtnMWGQzGfOMligc/hr9dlMXJ9A/dO95DDBHTG5UJD+s7lNgAJ3fA+SsGZHjFDBuHFD3c3k064wUE4D2DbP2hctyNSUJQJEMl1vxnFslCYCWlEvhyZICkKyu7m1qxrst+6CwAORlO1L5VjIcfiGTD/Wx2DCbxyaozcvkTvS2s4GNA04gDQ6gEWxw2mZiP17wE3G7DyBPYbUu51+CXYH904o6lbk6ai8pAeUfk18GBkAc3u6e3zrrOBz612TSsJixDKJvPW1KRP+f4dg2jO5GXLPCYqISx8PxsvJ3nvMvFwBsTUxrKz+MSLexEBPzgwJ4RJJZPWx21auKn8vk6xlkQc4BqBkKCOBgCzPo8qvULCh9k38AWHaBAEDHLFHXabGRcPpY6j6lYfIbB8BcGLQ/AwGojxpjnYiIjAsi61pVVV/6H+exSfkE0MDkB14QCwLgLmViat3r8gc6Rg9ORUl5vxMgrhElEsN4e8lrJNIoRpCAg1L9DHnJaji9y81JmqBYvwGDrQkCYHur6y45x8Ty1DHxu8/g1pwhFU2Abg+R02Y0+oarhRb4B8CFpqZTytc81sFM/JESWmpZdRiJLU2+R1SMUf6cND6OLUWUrYKzZXjep3ZEvG8yMYKIIo2Y8w2gOc4rh9M1D8rLBxIYTC+jqW6RuxilfLMQMZ8vAJjGC518wcW8BjKnAtJ1ALSBWpdUOuLpPAayDf6WEBMfe1xMeS3siVtasYiRWmZAE1PyBYAqFyCKM34ANHl8r3T58+fr2iYdCmDOAFBdyt3stZ5a7RoA6PDUGheL0y6xiDGqlWLcmWUWakltUkVPlSB1MZrupchOg9PAxCcOOchVbgy47jLedaiAWYj+C7sOgMmb9DA3eF3J4FgNUZ8zWkLkIPFpwntP4p2biemoCOb6N687MrKnWc6drdO0fhareJNGnyJ5nBvTwXJTSaZQJKbzGf3LRT4Q0P4qSBwoGgBcVhcYgDgTDIDYhOfcKRwALk/7Xz5iNlE2FX1LBgAFTvVtgsujiq6RRLWX4d29BxrgxC/ovyWZrJJ0qFDEBK5iDKQI+h+plOJG3YSqThMAxA+PTgv6fQD2t7MU0hYCEqnvA7KmCL8PtP1CczcSGZJgcwdRAMzG/13IPWNjaEpJfbq1yP+KqTrtq9EIUaR01qvcRtFUhfpSAZCxYgzto5JvSrS52ENlw44LXEUCIFOjL40ANVHVP7nxHUAdb1utKHIAPa2n9bSeFqj9D0G50BQy9P8RAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-actionscript.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADX0lEQVRo3u1ZTWgTQRSOooIK/mJFQcWqKKJ400sVFQ/qUSmiNjOTTfZN0mqheBPFCKKoiHpQEH8L/lxs0YqgB8GbFhGr4K23Fm2y2aStiDGtxjdJPdhu9md2m10hA+8SNm+/N/ve9743EwpVaeUYm5ehkMhQ3qkR6NEofMww9Qn+1jpMWhaGgrwQMEegObRiBfumU2gLJHgEd9UE+Djjd4uh0JTggCdqs33wY0bgeCDAi7xGQMOOA6CQ1yPNy/zPewrHJMCXTKP8dAByX+2WDQBr4Y2v4LMElsuDF18ANJ93n591EwBa1jfw+uGjcxDAoJsAsCd8+J93X1DpbX9yPxzfgAAKrgNAyVF18H2NbTPxxe89AF9EEmjwoevCAy/AC0spifqqARfaxZnesbaBcLyuOuAbG2eY7Pwo2lOhh7JE3SOsLKfhMdpP3wPIMtgodL0hCMZfmKWB0Dpjs4BhAOmm6OpJAz54KDEfX3Km4i4yfs2uJMbnzxt2YgI7vC9SBuswXc7hC4ZMPv9Lp3oefXYY+Gn1BHSKwiqdwCl0+MlG8Y3IsIfWBEvwvz88bWQD4fBsdHR9rBDtskeXi+59f5yv/mIyOVWuOAHmooN3Eu3/iIsAyAR/kdhOOTFG1Ocy3J1mfK9sAGkW2zpR0KkPJQqV75NWkIzvdjE/NBj4/KVH+HqnTPPaRQdtkZchvKlCWnY4FWMjLsbAThcUfa+iX8wKe7mPn8ulhinkotEVzhkvXof//W42XqZiscW2pIEHQqzLAwo1MLX7C8AsOxLBtZLUKb9om/EYnHSQos+K25PTrM4we7yRxLxTU5SlZmkjaNLx5hC4YCWuWjzU9fmS1GYqS1O+rUyVomGp7WY5b2GjmpJYa67v7eke3wyL+rJFV+Rr8MGBAAfx2Vrzh2MrkZvfBjSAvO1ZFwttvxgLBRf/5fpSoTN+RaP8YErhm75GIotE6hUBpg9FowsEHeuEH9CYegmf752EAApy86+kvM2EYYtO4YbVHOzAen059BJdGl9+B+23yyK+6fetzS4E0id/7Bjf7PvdQenGkvBXjsGj6AvM/ZkofKyNR04uPcSoG6gbzPKpHj9hXeBqe+DA/3P6oSTqhc4pXX6XTyjECXevRtVbgcj52qqt2qqtiusPLdwWykgpPE0AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-ae.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACzElEQVRo3u2YT6gNURzHH5GNPykJb6GsRGQhsWCB7Pxd8VbqUTYWJDbKZeVPSffOnPsu3sKGWJDSfRHN7b2ZM+N6yoayeTcirKRehDS+p845/e4xlxnmXm/qnPo1d86f3zmf8/ud3+/c6euzxZb8Cnd5XASxABbAAlgACzAlAC423eYiKqibKAxA6IQHzPGBE5QLAxANRSt+AXCDbcUAcPirOI6niTFjbGyZGl8v12ehfbIIFhjSYxx+Gq6zlOi4M+UBsOCdZEwDMkjeB1Pq+Qy5J8/NBchNyKdeAHzzh/05xGW+hCy8oXSM1kYXp3BBB64335x/vDY+D+3Xugvg8Eeqv8/8jbL+gzoTUs+TjtZjwYnfXemFHvS73U0LHCNh86SOSixaTaJRKTH0svBZG2iFLw/d8BTazvAq71f1IsJ1DcB3/JVkoQ/I4o5qy1T8tR3Ozl7VBwvfDmt+1W1u8NIreTPIWkZyB8Akr9UOismMkFnXblCKp+P9nTF+Qi1Qtr9NsNBWDcjCQ7kDYNcuE/9fb7RP4hDOJLquGvDniIWWoO69KdC/X1u3GmzO34Ucvlv3rfJ1uE6cpSLuQ7qd8V3G+H1Z/p/D3TbkDfA9Kkdz0y7Ac73Z1Mfxe0sWAOFO+QIw7v3FV477SQBiI4S7JAlc7SCeR2CBu7kCQOlxknAWYKI1SULDJHbxMNmAAeMM9PgqUeGrSL9Kx1sqyQfiokcAztNkJcJmLwHetCUghz9Pm2lR90LpoFEK1tnRMwAs6kqGu06jTSd2PsmNZDLbg814jLYfso94NiG3cgUQE5EFDWSJVjiMm0jbU5HEzHnFpRBxf6F4dgjB/wTQtiC8D6dIeBpYZuyPpP1SEoRhtVwBGkaf1h+vHMTl5JjrRp+H4r5EzxVJkP1wq1pRPqu0ZK4YkX+MWva7kAWwABbAAlgAC2AB/heALbZkLz8BfTAGTgC70igAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-ai.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACOUlEQVRo3mNgGAWjgHrgZ3XE/6GARz0w6oFRD4x6YNQDg84DD4D4DhJ+R6S+1l+1EeY/q8MrgOy/A+aBLw2hEijm1ESEENYXvglZz4/q8NkD5YFnQBMZkc353xDNBxT/hU/fj+qImWiebhogD0TOgzscySO/qiN3E4iB9z9rwjVBar+Xh8oBxR4NjAeAyQWeDGqivBBJIiKPCP1/gPg6EP8cqEz8539DggAk2YTy/KqO2IvwTLjyoC+FflRHHkRysBsoJP8XhnIimXcNj/4nP2oiPWD4Z1XEKfrHQFVEOVImbAOJ/a6MtEeYF96JJ+/cQLN7ywB4IFIPSe9xaOasg4n9roywHcweeAIrdUDpH5oh/wPzwR5EcerAAhR7Oyg9AKp44Om/KsodSe4b0ENsCDMjlwzWGAhEcmQ7shwwH1jC5arCIwajB36BaltEBo5cCBS7AsPASiwekYwSBGDJa9B4AOjAfaQMFgDzxf5B5QFgLVtCigeA+aVocCWh2khteBIBVlygUggLhmfkH5XhaoPHAzURD5EbbUCxW1iTWVXkBDSzbw4KDwCTz3SY+u/VUfJ41F5GzQeRvYPDAzURfnBHVUUk4e3oVEWKwz1bFeY4GDzwE5S+kdQvw9/UCI+A55W0NFag2IcB9QCok4Io3xuYgMnpFbG1NdT8FQMdA1WwUuZXdZQZEervIZdMv2oiUpHkboMqORgG8neODquMemDUA6MeGPXAqAdGPTDqgVEPUOCBUTAKSAcAbSRl8VAZJDEAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-angular.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADRElEQVRo3u1ZPWgUQRQ+/xUR/0p/WwUxNmJhY6N2WgSxUBCCYmkR1EZMI4hBDZfdvQTUgIKEq0KQKGm2uN3ZTQiSFGdsBKOijWiIoCRq1veOvWVuwun8vLmLcAOPY/Z2vvfezJv3zZvN5YgbK7AdzGN3mMveV36hn/sfWtwX74+c6BEYvgCScLKAz/H/5Wm4Gx8FI4cFo+vJML7fdKOTrmRl6ISnwKBQ0nBRQhyPOA01fCQ/sg6Ud4C81jRcFMTpQFyrhk/0T2wOvfAaKPtEZLgoHxEf9djKKHOqRkGI3NVwZI4kc/0lo8jKNMY3c1hZc7xe5lLMKHUl8qLLiBe64UWC8JLPXPDyLIHCL1PdUxsrePfYBuh/JsCclXIAZm7SePad6DaPCZvzFsGKTsquwJChsl/j7viuJYnAZT8NcYdkHegxUQQxP1gH96mhAz1yDjjsiomiwAuOcNyxhluFw0YOgF1yDnjstIGiWJgMJ0mSFdwqMG1ssEvKAQiBNu3wccKzVZxSvnSw8hxmPksQTnTGIDTbpBzw7/tbNJV84EMGMo+XKh7IsLv81dB/p4OPdskfH/S44Hp1fPAw2AT9b+nzHyWvtDVbBTe6ao0DDLjg+5gztp3bR5fqbUD2gG3D961wgAEX9GV1Amxa6L8Uj8zCZi5Y4QBdLuAPXPXSZeAGx7gw2meFA7S4wGMvasIPjION2i4K62UHhEl6Ts4BmlxwUqvO6GUnyDlAgwumdWvadK+8IuUAVS6onvmxlYvltRA+F/4lPFfgeHIOUOCC7Myfrlq7ajjgeMQh5QBZLhDP/LiZJcPuWY0ewCHlAEkuqDnzB/3Bbni2KOnA7zgf76yORRzEI+MAGS4Qz/wQ2zcV8/oNIWkMknGADBfwZ/5isbgK3p1RdOAtn70Qj4wDiOoCOlHlAIq6gFKUOYCgLiAVLQ7gVuE4xTWL7jUK6qe6Rj+vW0lpFO8zUM2dI7929wf89aCgE+SrJeMRtxP1WL1mTyuqbpipeaIZn6/gAW5DP3REhWgvENgTA+MXIUU+hvDc09RPTVCBHYL9MaqYGkdx3LL60CeTscgyi+UPf0szlq3MYqtxGetNQzJLq7Vaq7VaU9sfHf6bmbudUIYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-applescript.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC2klEQVRo3u1ZS2gTQRiOLxQUvPhAUPQgKigePYioBw/exENE8EHb3QmlEJrsDNGKwuzMVkVRQRB8XAT1oBYRBF8QENFeRCqK6EUEWx8HBaGKzzZ+U6KEGkPtzO6fQAY+FrKb5Ptm/v/7Z/5NpQhGu5BzfK52+zy8j+vHVKOMTObUFD/Q+/xAfQbxUhlfGoP8roMzQfxuBfERMK4e1T35Fimngfy90eQNPKGO1L0AxPqhauSB4QyXy+qafHtOLgLRH9UEMBGerPvZ97jS1Wdf93V0yBn1Hz4ifPBX3HP1sjWIFjSE+4Dw4CgB1/zO7rkN4/0g/Bbh8sQL9OkMj9ZU3pNSTjYOhevEBCmVJrAgWo0wOAFyReAV8A7oZTw86vForXmmai3gchbsdDsEncfzAxWrYpL8Oe4d84VcGV9C5vVGVNKH/7DESrwGzsBlNntCrvACJcpFbGgM3zW4jYlY6Iy4WWr86IEx/rkrDMIANjkJGVTLnoTJ/8Y3JvQGWx8vEJEf2eghDJlFzEer/iNuXeMFy6vlVrPPAnWLiPwnk/yW5OUSqtDBxLXYW6bQXUQC+o3ruaigN0lmn6u9rrYAAxQCjHG4EvCTQkAm1z3PlQCSBG7N7p/tSsAHkhyw9f4/NsrVU5JVCNROVytQJBJw1ZEAfZYoD4adhBH28G2Em7he08WzEmAO3YQCSr5Q56wrMn7oGaUIbOWvW9kqwSmsGt4zrjttumpD5CKEujP+VYCtUQtgQm0df0HLq3W0AnRfOn1pkm0yX6YLH73evqgV5HxzzCOoylccNmlVLmEBX728XOy0pYgZuZDcySzcFs+rIpT5+OM+jGJ9RWr6+7FVX6F6Yu9WtxX0UvzZ41rV03SgTQX1gjBtfByf7UEe3cD1e62m7g5xeHoiTfZs9vhULLUyHbRyte4HLoLsllo7SbO3YYEKDFngTfnkVzRt94TfEzRHczRHczgYvwAh3UHnJVN74gAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-archive.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABG0lEQVRo3u3ZMQ6CMBQG4DqoZ9DJS3kBpdWFhFDjXNt4AZ28jAcgMV7BKzAZJqQbMZJawnuU8P6ECVLeV/oS0jLWkDi+zHmqr1zqPJK6BLpe+0StGERs8YCFwyOAZx4eUX8ByPOHkwJFQAPAERgAUETbgoJZTpgAEAQ2oHMEVg+AIfoCNCEGBfiFGEQPdDoOAYYG6LoHCDA6ADUxAaiJCdAfQIjb9OvvsYhS89imZsdYOQkaIJLzwhbbtGXCpb5vjmoZJGCt1CyS5una97GINl8CHMCliV3P1MYRwQGqe9nfgGqZhQh4e3yBIkSA1x4oAQiAHAIQgABjBiAf8rl+BnN/AN4xqxtQ1eINQDrods68rcHWwigUCiXIfAD29S+OleICmgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-arduino.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC10lEQVRo3u1XO2hUQRRdFQUrwV+nFmqhlail2tkoWEhEo9lPjATRQhPSaLWWplG7FEFUSJNg2DgzS0KKiBaJ8hAxIFjYpRIsNymyZD0nCWEye9++324hzIGBt/tmzjkzc+fOfbmch4eHh4eHh4eHx3+BwuTkgYJSF4paXy0acyk/M3M4K2dvtXqIXOQkNzXaavrG+PiukjEliHyFyBpaw2mLJa3vsl9cznK5vLOgdQ/ad4FvjVrUTMIpoqTUyaJS3wQRqf2CcHcMzivo+yMWJ7TpIZ15Y86A5G9M81sNu/EGK7enibDR2IEJPk/KRw/0ksh8t1IHMXDJIVqhOYYLnq8VjLmHmH2H55og+smOZUxoL8LlvdBvBRxj5CInuanB/51+S/QUewJYqdcOwZc+Y46Jh7BSOYL+HwRzn/uDYDfjHaYqwvu5YrV6XOKkFjW39YeneFmBhrSuW4N/98/O7ovMUErddFcOxkcQx6/cQ4r/HzOkWvFRk9rWuDq95WIYGbQF8bsrwbm5jDHLrWIafI+adnzjXSB46XLGDkaHj9YT1qAaw8De2rwx5+2GPH5amMSqeMCVKtt981qfIsfm+598hsmjW7sAbeeMTURPQKl5O8dvM8eQaDYWCIswJPR7IfQLhCw24vRZtNLqfKYJ4N0dCtgN2eWpEEovhQkMCVpPrEX5s85pzO1sE2gRQrEymNbPQuJ/leEVMkbcyVQhlOUQI9UNRFxKy9IkcDbuY/Wvt+UQp0qjG7fsgFsrQXCYTbgQb0X5SJ1Gk15kPVNTJ7CqH4XVHrVCZLTpPS6/MEOZLrJWpQRI3jqlxJhw7a9nHN7AdvUZcrBrLEfsUoIamUuJDMVcHVnpQYudfeiEZ2eKuZTl9FyvUmdjZKlzISHX3nI65gcN65oFbn9S3s2QWZA42/ZBE/ZJyY8SiF/sm57en5WTHOQiZ0c+KT08PDw8PDw8PDw6hn/VAeYTmO/figAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-audio.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADt0lEQVRo3u1ZT2wMURhf/+pvOOCCi3D0X4RUQiUOHBBkQ9XOm6197y1rJRUuKrGiETdJ48yBG0ElDpQW15I6iEuDQ6PanZlNtTS6Veubabvz5u3M7Ex3d6abzEveZb/3Zr/f+77v933ve6FQMIJRvUNG9KqMyB8Z4U4limurEAAZhZlj5jOlIbbGN4V6w00LJUTrZRHvcGiBxxwAdSqyQI94rnw6fG6JgsjbSSXGpSjZVmxPri41V0K4Adb3mABp9kt5bSoCiTnd/00UF8D6a7xLgTWv50KhWRVVvj8SWcwrXwxALhyeA7OG/10SyD7YO8x9K1FR5WWRvDExvyWAjEg2gnwA5ogs4NYf0ehKQ1xEyE6QZZhvZZ3GlHvlgf7MlLcDAMrcKgxafNQAUohtYi0BFv6iulnZlO8jZBF8uMNKeTsAaUT3aKfKrYdgvsRR7FmDXCSXPVO+WAwMILIO1jwpBEFJPk5Sqdnc//wcEhLLS1deoK+LKe+UhSQRn+SskU0L8a1T8sFIbC3LTIpAL9onFiG+WjXVRIovnAqi75wobwVAaUgu5WlREekBI33S9+rp666EHzLf/WxLq7Dgk1MF3QKA3+5Pyj5kUHy38eDIFcNehI/rVqKHDG5mlyDLpTwPIEPIMk4+xjKPmpGBabp1Oe7MywiZJyEi5WUCOe85ANXsJkE7zBZuWg2ly/4N1ZMVjF53GRd74DmAqeyrBiHI/jLr7rDlCBvQQKuH9dxBk0xO6PYFABOUN5h1fVwp8dGM91UwzJ5efwFAWWBYB8yUZyQBP2dc5SaX/Kb2jFQdACmC984cAIi0MOu+V40LMUE8rlMibrUMYuB/Rq8LvgaxRqMifsqtGVIzv56wyClrGqX3fKVRk0SWZU9YS1aM+6j1FmO5GjeJzItSoksRY7s4WbNhv0iPWfi/fSkhNTausivmrG5fpRRzGQEf5CrSLmMxRx45LuactE3gIy/KVk5PdCTGmH2jA410M3dvcF5OOweBX5YCIH36zHq1iWUb+GAFrlkwWPKFxg0IKwCSGK8zu1KCsk1cXCQqcqV0CsLFpV5mCzfNQiLeAr//qtilnouJdldtlUh8A8j7VQWBHm+zfK8FehTXqu7CxkVF2irFQBRtbAH3F15p8X7Y+9uzxhbXqWifbmtx8hBa+NgAv09VvLXIgXjlqrkLVoDMisCVvha4IdyTPe9Q9yST84GrT0gott3h+0DbjGmvl+mBo83XB47pPzGRjqp8YgpGMIIRjGAEo9TxH85U8G8R8DwFAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-babel.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEoklEQVRo3u1Za2gcVRTeiq1aIdAiKKhUIY3duXe31RRpqS9KQ8UfLYWWgj+0rQgtCCJUwdpHSh9UI2H33tmk2z/9oSK20GeqsRX6oBjtQzESS6HWlo1Rk8xMkr6bx3rOzN3kzuzs7qTszmRpLhxm2L2z+917v3POd86EQuPjPhzpWjIpnQ5NKAuw/8Xo4wYni3ROthqcHoOrAZYGGwRL6So5pDPyXl+y6rExA1qPhymA+xTssgBbyDrBboDt6opFnwsEdHfjzCd1Rj+E3fzNI2jZDE1V4lqCvA7P7zAYectXPiM9wPrvAbjT+jVO9sF1QGPhOSUH38PpbJ3T3wsB01Sy22CRVzVOl2uMLDUSZJahhqfpPBKB3V4Pc65L82+La1Npec7pascf57KOdO1rD+b7LYMpz8Piaq35tAWuv4JdK/ECyJtgN0eA0vOwu5udCzC4ssnL78GzivRcD9KpRJwPPYCOJgFv6WbhBWJR3zoWcLczQZ4oSEU1/ALMTTqevVx8zjdEpkAs3zPMVYg6uCDpVJxh8yuPdNyeTT3li6KC17iyDI75B50p3wDwdXjktsXFI9XIWzM5ZZzXQyRB/sPcWy6+M69o4P+tiz5qqGQjJqdcEkDQamgYPCdnC+58grwkkpgdvErOFZ/7ebQLfgd//KfNeQskox5O5mO8d9n5q13qjCpfszDs9kI4gS4JRFu+0KkxuioHbdowo/uvfTg5DPaLRJ8P8mTtpHu+oC299WSq7+B7ePRZAPC3TIduRl60AWeVDxkqXQK0OuMCfggy9ZaOZPXkYJQnV+okiQyJi/w8EmHITFSY8vcuDvtZYLIZdw1A6GCaRIX96BOwkKOFZIaYc1xjlRWBLABywbtuUWTUKpSR7wKp0HJo/zseQF9wceLVvoIHOfyKB6CDuLugNN/RVFpjxn5V+VhQ566sWPEznxdA9uYBfgoAbdAS9Gl36lVWCNmRmQ/3SqOP3I8+5ajAbgLgegyVXopznCOKetkPDvjHfVXZ5uAvG6XzZ9UNSC9/amBISg4B1o/loXfHV16WysaM/egn99+2JyL6pXfNRJfbqzirpTKaDSgCfcg5O4BIxIuSdaONGYngRPxzXjUy18H9I4WeSdXPfUSq4mTrzZSifqrOJpsUgFyQt9kFog7mtbqAb9cbaNRn1Yk9IG+OhxUc6KFYVqgUshnDcFCaH0E0W7uvLHb3kfAb8P0Vubsg1QmxdLJ6ov+a3yrYM4D+AfvDKb564+Hp0iJRJveJZlWzec/I0uC6zdgCH2mJXze4stIuC8yaQBZx34MlhNRu9b3GdWk6yTxOmaUhOCGkf1UUK4MgJS6abRerx5MyKzSV7sQoFGyvn5ODjgWcBvtJ3A8gcGxCmaeAPSPrJJK5hJy/itNqOqUdPUtdUOlriO/vi5KxXXzelMu5g9l9UIjO0IndByur0k/wlREo0M/HxG5n7X6CzBKdhktgJ/A9wF+7n3nYbKtbRcrawGpZjw3X/disMhhZYfGcXMH2B4bUUDkMiCBr8IUbLKIBFnOybF6LuqnPstn1bPVJa9BJQ+U6gPcfFXq/NT7GR5mP/wFq26694JpQ3gAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-binary.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAzUlEQVRo3u3ZsQ3CMBSEYZeMwWgUKSiRwgA2M2RAZsgCgUgUFFixCXdx0H/S6yzlfXZsWXIImZxiPHR9Grr+Nj5rEtX9fInHoMir+clQGoR45vWI9w9IVviaohShBsgRDoAU4QLIEE6ABOEG/ByRA5QciyXj5YitADnErgCfEBJA7Z6pbQgAAAAAdMeoAgxgFwBnAPwlYM1/3PQmBrDFHlgzBgAAAAC4jQLgOg2gcYDzkW+pxi8AtmfWgkpDNcD00L0483MPcy+BEEKazAMuRa3ZltjFtgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-blade.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE7UlEQVRo3u1YaYgcRRReL7wP4oW3QjzxFiIeYFQ8oiZ/tLeqZrMSRTcqRAnGbKa6RhojioIGg0ZR90eiCV4/PH9o8L5QZHUVUfRHjOKZVWOS3enucbf9XlX1OpnsTPdOb0KjXVA0M11d9V694/ve6+goRjGK8f8YUUfHdrkUrKqco3zFLg4kL/kuvzlQ/A5f8mV4Ph26/PXA5QN49yOeAf2OHGeHXClAgmFGdg5hrsH8CPMlzL7AFXf7is/3XfYQrQldcVO+FFD8Ay2YYte0dCFv+o5Y9xXmH5En9suRBcSV9vY/SVrrK3EprYU1HstPcHre9hDqWy2YZDOSFWavYO1o6Jam5UYJBOcNWgHF30u0Qpkdg7UhAvtjUj4nVpizC5T4lZSoKj49UWHJ7zdxw6/PTyxIXrFZZnWiwr3O3ki5v2H9YOQ5U7by5e4Tla/eN8VCZwoE2qSVqPAzU7hdj4kbvmxyBO3aq1YWZ4VSXBe6bAn2f83iDyWYoCo7z08TCw+YD9iLKYP/M8yRULLTM6bylXVYVENm/BLPpwLJXN8VM+lJLj7s8sNao7JbOsJsgCxTYackHYwbO08fCizJQjU0E6AzJX8wmjdj5ybp/klK9RSvSci8ytyEeCZl7Dyr3U7yOZkyoWRLNRNQ7PjxLT5zN3jG51izovVGFX6aNeVIUBbHJXKpRfxIrK2SiSngsmRC6zoDzazgL3Km4v16ojYJsSBWG9cQy9P5sLjTWIEtzWaF0qmaNLbYB8LPIhyqSn5hc5+U4qI4oIitJt7egu7dbcb4O5Di5IzUZqEBVXZFAg4NtpQN/vappRePpETzbovm72SlNtjrTeDMuiGPH6z/m+/sWlXiAk31sT/O8e0F97cKzpJd5McbJRU8WPuh/kaK2dlAlZ2o6QouEYq820D5A6TWt/FUYaV0RhJ9/s6gM1uSzgqlaZQOMX+KFs7aM/Wtl539iRVbHOrXCeRfgWl+QW7jq9Jl5K4Tyc+3xIUOHZKyQFphKcl9TTNXr3M4WQm3+ygE/7pB2I2YL1OmIVygCyHB2/NHCk6X/27B6q4035C7WSFqQdk5QSuFdKyph+JPYK5tENi6BLu9Vu48hyw/dj7KV7x/n+Jh2HUOabfkXGwP+itNnqcgxIGPW6XXxiy3bo5qN1HiXl+WLiGASmYH7E9Ssq16fKPXfQABlQlOXtlC4J6enYiE4V2vLXbWNwhM8xso9TAUuioVs9wiqEWn3Wdxe1wFqdRuMLhJigNtSvPg52/YRsDmAgMTbEeDfn+fyF/SeUIfBXdLAGuqgIHwkXFuNp6DuP3nQsVu9JVzbB1b7bfvVWa6reNRB/zP5BUTV4JcYExgsYHcBYh9K8F/MyZK1V2cxYa9rkMzl76GavhUK7TFfmsuP5uKnfpMkcL0z1slVmVuwiH9WmCj/eQ2KVWRw482qMqjmivOnej3Q3L2QRqPTP9qNPYCWOGXbdbujJsARA3SdDKocUadEoDZWw2xN0LJgZpwE0H6SSnMTaBTJ0PMbbYGil6LNa/aqrA+SQwgE97WNphNjiuJeaarx9fFgBh5zh6wShfV4A2EjVLxD/j/nqDSdVJOek9jvdVI37IpRYcbbppAsI86ELlpmm0OiPzycTCEunwv4LadyQC8ra+EwROfChNq1bdDLYpRjGIUoxjF+M+MfwBXV1PHxLwrFgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-bower.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFPElEQVRo3u1ZaWwbRRQOUG4QpwCBgAKliXfGLiICVJCgHAV+IJU/IJA4hcRViVLKIcShSPzgqEjjnXFKOBqJQyqVCuJoKVSIH5RQKPzgqKBQAqgN0Nq766SElDbt8r31xB27u/bY66RB8khPcdazM++9ee973xu3tDRHc+ybke9OnukI/qAj2HLIOsgWV7BdkDxkjSfZ/b/2Tj1kUintd7TsD6XvcG32DZT0DWQAcq/vt+xnvAfmeovapjoyOTOXYedln209siHKO5LPhjLfGipeKpK/UG19VySTcM4SzM9p7/b90dN+WGyvu5I9V5fimjg2WxTlcXz/MGRn2Tv5rGg9OZbyfy1MHe4K/nZc5YtGSH69vv7WDDsC4fhB2Fzk0JPxPS/YKkPlRqHIpzB2Bf5mo0OJ/ajngyfYy5HGZvipMWOePWWo/PeD6cTZRcPtaQc70kpHzfdsdsumzpmHetKaU2HN3+IpL9hVWGS3gfLbCTGyXalWGPwAPHwnFLxNefejcqU8wVfj75+QEcwdqnBSn8UNnfWG3n+/gCCsbzDDpgWfJX/dS7NLEUo3loREml+oIw4MfT7KCAqtug1AHN9knpSsV50YFbF/Ia6CzXscm1+pzf05bK8tXfxEfLc0JNln128AEq0GZFmvwqVTe+ZRAuLZE3s8ylfTqRAKYf25CpYRUmwDvlumF0Y44+O6lc+JZFvtRYrNDSo0KWfzh/IidUbe5meRIZpS6/xl1x2Qy/AEzcGz/ojQ2QBoPaluA4i/1IHvuxHPL3l28pK8TJwLZeeHQOkoJFPgSXyFJ6zbFW8qfk/hCH51TCz0wULvNapoRaPWOUcHzgKcQh73JL85dsUtGmBO0uLISIBykr0b5A5CkGCbUMzvmDUl7gkMjJfiUPYL17bexOe1qhaE1ZmdMOYnV1ivIdTudrt5ivKrFgO2j5MBa92e9qP0vahXoAqesxNXEOxizos4ja9CdKD+4h2qK34HO6iaAdvGQfl/PJk4vXoBnTUlK9umE8VQtPrvoHKXwno/8mZGJQN+abQBUKajfJ/BTnYshYdCvY2QDz2b3+eJxLU5aV3gptlpY94OGhw817jUl5Wq8OcNNuATIm5GNWjxjFOcDLvaldaj1Kbi3d8LzQ3/TvGq4bF1I7u0QvI0TPmVpsqPebq89RySbccRrUBYvaKjWCRaEZtsgOIO1nmkasJp5DEMaahq56V1uarcepspTKnExihEISZJ9EA71gHC9aA1LEObME+XKh/uTSTwvLJ9h6nPMEGifkXA5gUGSXYD8Psu4jp0lbKXQmhgqnoZPKgYJupzaPsq+TVEu5Xyef12I+q9sER+TL3kblucOqEh1zHY3O9pP1B/RpCpPyNqEXHiu6hOGG9GvESRL5+IVy13OpFrAjWw3g/UqENuJWjF/4OFhoZ/XcJOC01OBoXrVZpHuVBPP9yrUYDOuAagkF0cNDs2e0ZRCYLIviBkBOsiqKScw+e3cjY7P/aRq1MY1u90auIke+fVG8FaMGDCrhGJ6pbF4qp6mo2g0dmzxg66BJiYe1AkHlXSMiM8x7YWmBYozL+oDE3oFLon7BTI49h0c2ixEtzOC3ZZmDFDPdOPp/vQCMo8ErvzqmVQo4FNN0VAXE7lChW9NYUTCxJytFK1blgHZpwPiFvF1f2SeC6wxKU10IwdlFv77rcBJCQ18CB9C1HWWUA/qCExp9ZLJt0vNep63KSPWDnW0E+6QU1IQO7QPSnuPqq6u6eJEpP8r34/I4YZp/A1R3M0R3M0R3OYjv8Acq6d26//QYQAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-c.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC70lEQVRo3u1ZXUgUURTeLPqDCKIoeqmHniMq6KUfhF4K7M2IoDL3ryKLeojAgiGiRCQqEPfHtbeKrYciMoJCCJHYmbuGZZSGlBUUhP0QlJJO38ERtljYc517r/MwBz52h9175jsz556/G4mEEsrMy8GO4rJ4xt6TSIscUEiknXfAb2AM+AZ8TKacx4m0beF7dW0+PzsQxEFmPQjfxucE4ErgNRBruDo4b0aIx7JPl8czzh1J0uXwBthklDxcZQdu+lkB+Sn8gWs1Rlx3lnbyyZS9XyHxf4A32qTVCDz5XZNPS48BHs5qIl/Y5kUVVzMoGGxWSr4+170ISj8ZID+FV3XXuuYr9HvnwjRIjCbTjgO/vo/1T3D9U2Y91pxUQj7aXlwl6TqUtI7RWyvVc+JSzwKQapAwZMCy3CoFicrukCD/Ptou1lTYS+vwv++8qGRv90XesrrmQNEIN5bHsmIDM3sfYOps8ZltxRYJn81w9VIdhDUfKuu1H/kMnU4T1wAYu1ayhroI9AJ9QD9FHmAQGPIKQTLwuV//t7m+b6QMmEal+ZVngLgbOPLeBuZGnyuBM4AyoYQB54LXYsGn+U2KOB/INtHLqpwQ2hpUA4aZLvQwqAa8YBowEpgm/b9EdoufiYtbJXPMKazLUrkAFzyD66OoffYlU6KGKgBKjPhtqU8DRJwficQNrl6aRGDND4bOlC8DDrX1rpbspFjTBfTVO5nB4bKKfdAnYcQQjVsqh2f7AbPJP65gH4jdkp3YANX85bO7WyXZ3fmfF9FNoeiZpBHjQB7Yi829kaZ3NI7BE+2W0DGsLLJ5gyzXMA6rzgktBsm/VT4zneyiRKcB8qPaZqVQvBgQGsmPI2jU6S4vFiIM3tRAnobF1SZL7dPALzXkRWd9rrjSeK10pLWwAm+jWXbqVpJp7xk/Gyg/vetZQsdLiPNtIPTSO1YqJUvXX+gwA/+5jpwQpTIl2IdmcDOKXLX5/rnhCWIooYQSSig65S/rxxb8x6E2WAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-cad.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADNklEQVRo3u1ZX6gMURgf5BZPUl6VUv68kHJdKSmSh3tLMXvO2aLrwSUhHsTOOVtLuaU8SXkgCkUp8eBPxAP5E6J01e3SRl48SbramVkZv+/M3DW7d3fsndidqfnqa6Ztznd+vznf+b7fmTWM/2ReyZzrWPyFI/kN3PcYaTINXvLXcE+7xW96Q0MzUwJ+YHYA/psr+Rdcy/Aq/Ho6CBTMebbkj90iXwXQrxwpLsO3gMw9zzCmpSqVJggYabWMQEYgI8BOoPrsTiV4KqOuZH3ai2xZGtPnZ60TSzGaLikB2VBPgH9IRRMj4Mj5IQD+GAIfOHvrKL41kUSaAL9tS3YWkuJc4Gfw27NEEKkovs6W4kDNLXYoDNyV+d5WY20lNoWJgNj+cKyObHbX4qcnp0c08GgifxyrtrfzBBQvxUo7pBDGXuo+AbgrxcOqzK1tH7jYjBR605UVqBbEatT183pCJfbRpLgf+xuRJsBfuorvxCoMBys57BTMpZ3pshYfpEm90uAcDc40Z7gW2x4m4qeHPszA+YUwcFux/losdGp/DOvrnExoIFB7yw1EGrwOeCIJhIk0dOL3LWMlkcBUtFBiCVBTAvB3yP1bTkEsTh2Bdg80GYEpayGLr8eEV4P8VpXD5vy4BCjNULVOaQK4ulZ+ecc7sa1yG2ITwHGz61ICTWtPHAJeqTTdVexkIrQQ/Ama1MZ2CBBwx2Lcr1D/WAvpTqrYDu+gOatO/koxEIDs14d1bOKak56RfKQZkTCBRuD6+ym6djgWlVvSVyi9d6uF3Jo6bMBEzxDG1kINQsxPC1/b0+EFmuZp8In8uaPYkpZCzRK5MBE8fw3Xrxj/CSLuShh41L7xMYjRIM4dbPSV/n7J99JvkaoXA4/ioXFij9y+HwQZIRXZtlSuJxJKj2jgkzWVLtXlif8XiAjuf0SeP2iS4Fs+TVpGldhGSx/rsFKvhcZin7WV2AUCnxHjF2GzFX8U1XjGgwkrYHrMPmIu7PZ3IcKAGMfhThDre0SFYSvAtog3/0CTkPxi7ImVuYg2JXlFmQvivwh9nqhoTIQNGNtbvpLZk4Q/55KCI7PMMssss8wya2a/AWUl8Npjp6NGAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-cf.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACz0lEQVRo3u1ZTUhVURA2M5LonxZRES0iKmiRWUgQGAQV1SYSSn1nzlNwZxAtWlUX2lWLAhdmP5tWPkJ7zjdHwcXdRLSQNkGrQiLKXJSGpKXSa3NX5r3n/vW40B2Y7TffN+ecmblza2pyy+3/MD04uJGYiyQySMB7AuYIqGSfuDFNxMwE/CKgstQzS7wV2ETAAwJ+L0c80wIU8xFingwinlkBBZFGAqbDkM+cAGXMQQK+hSWfKQEd5fI6AsajkM+UAGJ+GJL0Gw1c1yKnCDiUjasDHA9B/ItivpDNWg+8spD/2l4u784meeZzFvLzmrk5sw2LgJdBAjTQnVnyReYGS/bftpRKKzMrQAGPLdk/nyhAtzGrFXBCAdeIuUcBfRro9XPHcWrDYneOjGwmYDbw7i8ToyDSaAW/xLxFMd8m4HuUptLsunUR7v7VqE3LO5WLNuBOAmbigIcWUKmsIOBdqgKaXbdOAX1xQKMKKAAn48bwFUAiT5KQjyKAgIFUBSigPSn5sAI6yuVtBCykJkC7bj0Bn6slgIAbSWL8JSBk9qcI6Cfm+8Tc4+e2MtrFvIaATwFxpoPwibmnyNywdIx9ZlHc21IqrU1p7nEsiboTZxb5EAA4muJ37nYCfgTEWlTMO+MI8H1QWqQ1xaHtqSX7/XGBfUGVyNlUhjbgqG09oo1piitgKgD4bmLyxuwnYMLyzp4nOdoXAeBzGjgWB9dxnFpvLLHNUzNtxuyI/7hEbloCLBDwSBlzusjcUBBp9HM9NHSYgDPEfCv0rCNyJVlpGx7eRcBiGo0ssjO/TuWDxdtBVlvAhBLZk0qJ6xod3eCtrKuV+ckCsC/t7cBeS5tPyz9qkQP/ZsUhstVSlZL4oha5l9ZY4n+dxsZWkcjlFE/jp/dXpbprQO269cRc9Ia9cQLmQxKe9UrogBYptBmzPjNrkChbh9xyyy233HKrhv0B1De8sg8CgicAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-circleci.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD8UlEQVRo3u1ZWWgTQRiOB94i3idqPV498AARwTcVX1SISNFas7uxFkO7R5IWRGdnkrZaUFGxD0oRX4RCFRQUWxD1QVHQWqq1oij64PHgjbVq2/hPuhaV7O7MHolIBn42ZHfmP+af///+fwIBD8Y2rXakIJO1oqofEFXcLKqkFZ4vgb4D9QC9B7oP1CippEzUSEEg9yM1gAotqPiiIWiKk6hCyXAczcy66KKCi0QNtzsQOhN1wXqHwiqa4Lvg4SiZK6n4ikeC/02fJI3E6c76Iryk6RIw6fRJ+H4CA50rLUWjvHUZTUd+C/4nkbaQjOZ4Jfzx7ArfT69dH3BBI5U5Ev7XTrQ6didJ1dcYMTyVYzqPEBrIF23Kk1Nh4jsXTCFx6bckBV+GcHsVcsUzN0oICtb4/F4l9Q4YfZA0XCtF0aJMobBEQ5Pgm7CRpbkNIshoHJvfK3gxt+so5CQzA1AunQh5dxiSHWPUwZc4Fv4hqPp2Z9GNFMD8Dg5e32wxlBhDM3isL2i40FVmp2dNwc+Z+al4r022JXH2xfTDXuQZQU4sh/W6GbP0PbvD28aowCsKoVn8nSlkK/gosytZuRF8cIP6tWERM+qCrRTN1ihGaBh8UwH0CKg3DdIA38BzidmcEjkxnXkXFKz4hlZ3VVSPhYh0x+zAQ5jdbGG8JsZdaPRNAdiZMzbMOwU1MctkbozxHDzwp8jpi2C99i6gV2XGXfp61qTmk/XJBkYBmjPND2l4BeP8Hr8Kno1uFBCjeBVr5eZPuQnYnVGA6swGwFvYwihu9+0QQyJssBHga0k5mm2iQC2jAZpMBYhEjgwtjqIpVkRRpdn8osqq8TRbmjDupla2CKOMuIjUWyWyh2zbqCOzNWT54HBQYg9899hAkV9oUQL/LbMAdqs5QF3YCkq0sCNDtMDOpYLBhkH2cALgdR8CYFKAZm2rUChzWOIulHqDXYdfqLY4auQW62RUlpxsYCHGHg45HURoiOPkp5JNrBjIKJz2MSyKL3BWStfp4eVvGpAIj7Fo/GfiE5ITSx10I15AcbM7jNAI2/UVvJADuP1OSY6txSccdhDe0ha7pOrroEaetyNSNZFiJCGKV1IYDO+uOWw3fmSvuWGkGff19FP/AoHyxQ6igx5kQZdZ6M6dcoPvYzm1PGB/lnNldx7qciV8KIamuQZotC8J7lSTZQVuOwnNNp1qXJiNCw7IK2dDsf2j/am60m1H/aZPwr+xKvo9ViQdoZ54ZHGKVus8dxlbpAkYiFqMtjlooeJA+A56ZxyO14zJ+Y0x9VmjJKymPkwjCPz+bHSg6YX3U3pfAHQM3m/dGSXzA/mRH/mRH//F+AnA7OMPRatuFQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-clojure.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFqUlEQVRo3u1ZaYgcRRReb423xvvC+yDRGBEVFW9QPEBEEX+I+McfgroqHkhgEMR7zXZX9UzP7O5g1KhjwEQlokFncWe6a3Q9Eg2aqCEeMUazUbOsmhgzvlddPWnb7lc1uzOzCFvw2J2Z6qr3Xn313vded3W1YNTr9e3yVX5mzmd3gzzv+uwTkHUgf4D8CbIeZBnIi3mPPegKfl6pVNqha7JHX5Ud5Qr2BCi2GqTepPwI4hR8fnLHFS/U7KPzwn4WFPhrHIr/R+DUXi8I59S2K54pZ3aE478HNh1rheIx2eL6/HF32J3WFuVZje3v+vZgGxSPyzLnA+eYliqfr7ETYOEvO6B8KCN40VuifE70Hg8L/txB5UMZBTlr4rAR7AvA5hL4e7tbc66EcDlLirCvkyHR5x8lbL4BRODlhL+vgVRBfmraCMF+cT37pIlEm4vdSu+RuhyQ9e1zYcMCHPucnLBOwe+S5uFpguH3Bk4xNmRpj9ez26TkCWuxtUt/pX/PuEGZemZ78OxNID+YGWHbE1YGvYDZNu/b1yCUYPOZqEhickPI+ezbiBKYjYfhmUejicsZcvZVENMZ8fe48wRuCAu8oJTYlnw89k6xXNw1ESoB9qnE9XLWyx6G85FSSPhpjMj77O2mFIeEshNgNQcPb01YcJUlrL3CrCx5Dng35DfBKWiT3QjesQakBH9VZ0TWs043Uh5xCwq9leoNz7kgEmK/b/zmMbfhAMEfMIDGprxvXaoctjd8/kYTlXJGzJLyRs7jc8MLqhhmzDh2Ff5eLD+zj2Kj2lCJJyYTpseu1czfWFqe2ZnOuh67lVhgbchVEDIpWK2FUQcu83NGUcaz32g4LzmvNKRQs86noRNkwLQFHsF5/H1+MB5/ulcDGgD54ULTeI8RLnAMv01j7MPp3vfZDaT1wjlDzsNkRCnjsYWRCLPOMOtKfGer2QM1cxelRx6fv0Q8OBZGGQyhmk22OhXnxMApvM/wFFZv04OtSD8B9hlhAFtFpfTIvBF93Oa3SGN9frUpjPDiq/UXEfN+T6IqoWIbiERSbhQ1BnQY75MKj9NwUxMDAD4zghDM+ql5qZEIfvyV4CODEtfwsNb7wFLRSwUx9yAV2RYalZY16zQD2I1REFprgj1JczXeh3tyCTxzV3Bn+M0mBgy8Zx2gkiCVldekGyDYx1TWDI8O4UR5XzljQRgx5i19cnf4/zeNAZ9HHLmcQMKnhAG8ZJJECJqwHr3fX7EPDYp0trGR+HzmmITRPq9nvxT+FRLBIgEh+z6Nl3plrAYmmdhSAcOUgXMaJyLYjSq+zyAVq7JzTOAWEsBk6gyJShddwuoIOVG8jETvqyj1XeT7NyPQGEhZd0EExh4Bz1fovg/SWm2XjXdHwuOKSJh9LLgf9hUJ6X9mQFUktOI0exRZrZbMQfUWRjW6C+Gz+7WF9rB7SAQWWKxvAX50RMrJ/MtzMZiOYj2tHDKdoB0fFoR1eBMNLJoGI+MMCxos4kGpnggdWUKRtYBxsjsk64z0frDxm3DaKzEUN92tMyzxKrzM90h4VqRREazykvZT7LYAys6DdZ9GGgKfZyfV3EYD4SBDoL5bMIjsMUYIu1XbJBpxNksDBL+oYy0RLS+PVEl4b+IFPkYr7ClhtaWtotrSiYbjozJuEh3G7l14mVMaBdMVPIYC5ov0nXfnBLsM2yZu1ToW+7CyfQP5Q1V9A+PuWGO0gQW+Gkdfc43sZENmh+JnPii5mOT4xOkadyKolxmBQh1v7m4is25zHWoMlR01YjPA5/qW3glZqxK9otYJXxnW3m252IDth8iOxMTelRWTckvLB0aanG/nFWVuhfLvAgW5vPOvWT1+HGz+lKYZkHpJ1Tvl2ZP+vli96J6F8FKvX4dU739Uvg/22NeYiTGkgtwJGD87qbM9NabG1Jga/7/xDwIY0YJ+GLiZAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-cmake.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB5ElEQVRo3u2Zy0rDQBSGq+7EBxBRENx69z1cWUUQBGmb0oX4CMULuhFXpWmLuK+CL+FCOpkqXvCGgj6CuizGEzFQgzNzOm2TM5ADP4F2EnK+L8lM2kQirrji6mplixejxp58puRMQC4TrttjaAP8BBpwLZstmEr/y2sAcmWcBZ++H6MsBOi7xlkI0jfKgoC+ORZE9I2woKBP34KKPmkLSPp+rslZwNJvStJU+vQsaNCnYwFBn5O2oKD/kSvURmB7R9KCmj7f+B23SdKCjL5VcpxktdrX1Cite0FBv5Gq8LnA+HtSFtJl51h8Quzgn/FbZCxki2xcQv8tV7gdCO4DRiYVDdyEZkFGP11m85LL7kHWRLrMF6Omf6q46bcjtyCh/56qnA/L9rXs+pRqdu6qBQX9deTT6zEyC2L6jOXzbi+uAbYTiQUJ/QZ8N4OHUJtGLPI6b0FEHz7f15gEn0K1IKH/CRnTaGA3VAvyWfcnsNrkNrzrLq8d1ocQDcxi3hc6YkHx5BHFu0Qqls1XvOW0oIlnjAXsw6Ed+pi8WLZzBNtV//8COO4e7hcMvhQ2fUxeoYEz5Fh9Cx2i33a0LHSRvk5at0CFvpYFYvRbt0CNfksWiNLHW4BB/TD5DFJN2xNbXHH9rW+sZw+ldqHAWQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-coffeescript.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFD0lEQVRo3u1ZaWgcVRyPV6ytxSpW8ELxRAUV8cC7FMUzUdHJe2+baBStR/FDMaS78yY62g9+EG8ERcSjohEVP4jYL4KCVazaxgMkWhVRU0+MrcnOzCYdf/83b7Oz292dl2R3ttB98Gc3k3nv/Y/f/9yOjvbajVboLts7dPsXKLr7in1bztCE3XuoJ0WX5/DVnpO5Muzo2KOSYV9yBhoG/QjaAQqLFEj+Oz5fCYb4OelqEox6kj2FywPQJgjwPj7HfIc/UHzHszOX4dnXcYY1TYO+B30HyhefkxJSEyCf5UfTpQUpLogLFbpdC8OctdR3xKsVTP9CwnlOzyXhYPfikoWszsARtxcFm3D5YQ1ltJDrOT9cuXKfalj2JdsMKzwbyMzZvi1O9Rx2dSDZo74U22KMj0GzqwjveYcvw98vhAN9i+JnednMMTOQGmJn1bQ6BCfIGjEOPB+PAzcENnui1juTkh+Jd0aqQCTSuM3XkEVKZyqY0f9GAofdCUEHtaX+UxCS4oPQsvaqxxfe+8zIX+gwfdmn9aIFWQfQuIEEJZ8IbHGrl7WOq3TmSAB2LDHsSf7HDO7xHY78XiDFXUlRSSuVfGZTogDQ3psxbX6ed8TyhgYBCJ6k7RJc+xdoP/lL8/NF8qZs5kBg/J0KWHwDs99fyIlz49Boxpp0VxwBv+qNIMb+KfHAviQLGx9EUcO32VvYPFkhzA5A5yccuB6weYw0VJA9F3k5dsKktA4P11gHkKPX1L7bv0Qx6bCT4Bvd5C9g9kV8bqwIAsWwuwEwu6nWmVXNVvb3ams/ugh4fRyMfxSP3wnkgf5WTh1pMjDYM63zx/OBzW/Z7vYdUs6b1VnNx8oWnPJGaELUKwkQ8k4DUxYoS+GUrEFOD/oBNA6a0AIQ0wX9nSy5HZr+WUUjODDueZmgSXcWJD8PDO5fR7FLsO+5RAtQqNLaGJ4V5pqV+eHwUNAKLfjbBhDqWqhNqfAexXB2L3B6redYJ5pGkDkzjCBCWT5w+G0Itc+A8V9nIBYrV5JC6cYEbH+Fw17De/cRlACBM/Iyc1Q9CJSXHdZB5PSIahcDSndQLokgxbfW8xEKLGYCSL7W0FFrCTiukhZpT0UslBUqiSlnnprjuRPGZXghxy/UjLykSmLUO6RligyA1IfzEG4+9K4xDqGpa2DSM8ncysw2fwTafF0VcJEQq2J+kgqRTxgxT5hUyYoSDBqOqgcCFrGaKQ3yKIwm1/pR2TutYnYkQLhrEHvDIHxanbpbwgbxoEE0So08W1yaDB2H3TyzASEu8gVx/S4gwIip467X2t9Wsoq7J56NtlIAKjNMY/94sRUsq0ptflXLBACEjTI/VaCxjVOVCUPng7QF8P0hcYpxlxSf21T2nlGTUz/NN4GcWRVR2LAlhrudGnoq5lIMm5uNG5iYAA+V1TM56+Qq7wynIEAQ2JnT5zQqxOZ/YweNUotYBqWctRRF2Z9NFmDtnGtxbL4uXi1GFaXo3bljaxrzWyihzquh8BxxOeqh38oyIeoemt/QQEsPbceaknElH2hMVzTQt4gys2ezp1G4rUM8HqIpQqngEw83QwBqitIZ8DpieRMEGE2v0Uaia3BjU4Cv9aQ7LRjsXoyLP24A81O+zXhrRh7I4OjQ+qPR46wZn6a5EA1uW//7F1pP9TuBLe6h3hX0rR6HjOsR+lb1TPJPEOGepDI9dMXB7V8O26u92qu92mu3Xv8D4YFBJ2q28HYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-composer.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEE0lEQVRo3u1ZW2wMURheLRUlLgnBGxGJRFNEeGgQJC5NU0Q6PeesEhIqiEuDaM9MmQgJIhIEDwgRD0Sf6y6Cpu76QqioWzVIXNvam3b8/+7Mdna7M7vtnO220pOczJ6Zs//8t/P93znjcnVB8ym0wCez316ZnvKXk2nh+zKt8yp0kau7NW2HNASU3qepywbrilZD19o6qdBUNhzmXIRxvTGvS5tXcY/3c3IElJEi7nM2D5R6DdetmqqmheayhXDPZzbCL9PPPoXtCY7hKj7snBWZxx6FzYUXLfErZBWE/bauyFVtY27/oNe3LR8IKXICDHrm4yTLlCZnob+A/x0Epb9ERoK26NcGTZLSxRogs5dgRKHhbczhqJdXaaqUgc8DZXQmjGtB+f3GvTZHkCx49jbs9UgZ4e7lNE9wBOglEPxOU1cOhWtNjJfWaiXSAD+nh9CT4OF1VrKaVGkUzHlipbxu3FHBEaCKEV6bF9eHPSiTk7YLW5UGQerds5FVJdQAhDs7j0WEHxTT1PzMmIq7XH0wFRFC26ORqXP6UfxClumHuAZw+gkh0doR7qkwrzEBR3wTbgDk5eH4BoQWun365Gci3IK8Gzay/hiwKxDraUkcA95ginRMJpkPiPY8ljwPL5wj1ICAzGbYLOIWrAudqtSA+X6FrQUZrRFrSSbHTHUoW1AasfXtlFfoey93L3AeYbI5SnYAonMe5cPvX4IWMlkcbUBApjkCI2yVnnUOGSTQhiDXoZVRgh/Y0I9sP2erMT1g/WwwM8/oeRbF0YxuD52FF/LRomLe1ErdwyJyGngQPDsdndP6/GtNnI2MRKXZfZEfWRtAfjhOUZ1K2CAQuRJcI9w9Gcav4qAVsFOy3SuzLchMES5RQVtqodA1TiH0ThylzkCKTIJrc6IVuw1t6F2sDUDgjsPYa+GgCkcGeBRpLKaLNX0IIkhdR5U39XO+MjYBrv7Yqcqui6ASlRYeBN5PLztQ3vDyTqzAFs8fiTBgr4XwBufKB3tjjH2G0audF7FQtdRS0RHCnXMhTnJTZMBf87a08xEIQWQqDLggaFNDp6TEAIUWCCJy7ukpMMCDlV0QnaY5KTBA3N44DltMDvrALlDcnricTRSI+YnC5wqx55yqlGHPHMV2TykdI/50IsRZniZbeSR5yTtxhkjop3CtSYTP3ck/leY0DzccSTDgJ4JGFx2tk3HIFoUpz+n9pOS+fUqpaXigCwp8d6B8K+y9D2jFxf1S9zWmTBqBu7OOrg1YsF9xe9ltPivpVbsmsWLFbjXzotHd79uYJKWDZzfhgrSkybALE34GKrrpHzQeR59MBOTCWa6e0vDY3WCX8HuX8S2tRzT9uAWVr0TIdfW0Bh53+xSy1NXbeltv623/ffsH3aqPfOkpTqkAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-cpp.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACe0lEQVRo3u1Yz2sTQRSO9iIqbW/1578gPZS2/hMiWk8xyWrb0NKrXhQkFzGojdRDS6E3f5QGIVlnN6T0EMFj2h6KhxaxGiKixEsCRlqh8Xthje1ks2Sz2U0G5sFHWth5831v3sybeT6fNGnemj+V6lUYuxrStHlgC/gKlIAK8CfE2A/8vgeeBhkbC6+t9XUF8QlVHQCpGPDbINssysALiLncEeKRSOR4UNPugcQvm8TNsHwrmbzoGfnA6uoppMQbC0KfiBTwRNG0KH6fUbQxZrPhGPjzhPyNePw0JtxoQCQeVNVLVuNvptNn8d04kO2IAEy2xBNHKn0J6PqILUeVyrGQrl/H+B3PBNDpYRL1dUXXzzhJR/h95boAJZM5AbLfOfIlHJ8XHDvHamAFh9xOnXBd9HV9RogiRUdmLVf/I4cN3WMzCLXxDoNpzw9tUJPcv+/6xO3ygw/v8AJaKTydFKByAvKeTNxGAZ+5zZsQTUDh8CCc+7OiCSgfEaBpD5udwC7c8EOODjgBUdEECL8CBe6DmDyFZB2w4QfH5l2hK7GSSo0KfReiWyc+/si/woS5jRqDpvlVUBibEqZxFWbsJEj/5EQUb6vquXa8yPCsHHb/Qc+Y32QvZJ28iY3AvERxTHqyEtUHeL2IHG10u1EH6Wvwt21Ud28EUE8TE35o1JzCagwSOYsAnMfemeT7Qp4J+NfIRTV+a3EX2QVW6NoNwo8hbA7/vzaavuZjWqzuTh/6D1po6vKgm+4SNYk7cjpRqxA14TlI7NkkXgQWqynXDaYkEv20KZEKC0aq5A2SFOF94BvIvkNKPcLfV+j08UmTJk2aNGnSpElzxf4CSuMaIwbuULcAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-crystal.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADF0lEQVRo3u2ZTWgTQRTHt1UQVBBREU896FHwIOpVLyKe9BAVsYqZ3WiLQTMzpa0I7sykqRhFEEStVcHvij3rQRFvXvxAPPUigngQtTdR0cY36zY27SY7m5lds5CBx0LYnfn9d+d9zItltYdlZTL359mY70PUXWtZlY70wVN+0ya84ttHh4gbiLDu3LGhVWmDD7K38HXO2Vhs7+11F7cWPBG3QuBn20+bsGcO4SdylG+Sc6QJPsgmwcZB0GFUcNck4j++w942AD/HEOHvEBYjCLPM/sHSMuPwruvOjws+wKYQ5UfSCj9tT8zBE3EnYXhpP3KuuzCt8J5l+8RWLXhwrLsaAL+kY+qJYKcThYdnJsAuICJ25PpPLbEpQ5pf4WWz2+ae4gKfwcYA2kak2DV7rgjz1LWD+dIKk/DfwR47VPTDdT3c39lgrk5foJ4vYLY7Ajwfmz0BZMrXDuVl6VBRooIUaMSZsRhVXLD65j/AlrgOiWSvfXRoZbNBAOYZMCOAv1cqM+SNDmYlUzWJTETGygyvVgoVIEa9FE7YAV14udVkIjKWE7DoCV0U9vmeah2iKQIVxDbDSW08dFEZrmqKKQ0R4D9nDQuYVDo/gCO/MiECnn1jvNwuFDeqbKPynLI2ogh5Fo6pNjoeuriM9YG1eQQR8kAfk4CnOtFDWYTsSsRVXnfT8iKd+K0gotIhWytxldcyuilEEDHY8KjXQIRsbsV7RmBnFLYA3xB6Xq0jwsEcxylA1mWKbRP+tRkRNuUPYxZwVTURPVDqHMwQkc+fXwC/fYtPgLjWqHyvFYDFIeX2hy8ii9mWON+8MrwXTvvE6kg9HBAB1+GWgJ8OhxEP5FNgX4wLgAq5CfjqNhr5X+0U3640De/XRbtSC+/5AXGX+1sjUXj55bXhZ5zSXqQW3hdwMkEBl43C/yuPi10I86zXqaP8U6rgg5pVWczXQVYksOgjE5nXoexSIvBBwysfqNhsU1aEL/QcgH6nBj5o9AwMLwWonX8bvHwiRMDFloJv5D/efwy1/tP68PX8R7YsUwffHu3RouMPQd4fFN/gUL4AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-csharp.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADqElEQVRo3u1YfWhNYRgfk+9IIhLyh8QfFEX8oZCkmEyjVivL7j37aCFFEVtJIS3G7udsPv7RJX+Q/2SkxnbOudtkyaaIZsl8bKZtzK7fs3OX97zux3vvObvr1vvU07nbed/nfX7PeT7fjAxJkiRJShvKCbROdHq1TU6vflzxaLVOr3qP2PitnVQ86lZaY+eZkFsA7rcqZD6UvoznN3AoDn/G2rK8Gy3Txh5AKDQOm4vA3QKK8/y20K2uFVTyiMOn77YVQHl53QRs9EdWTlXBXodPO43neTxv4/+dEdb2KZ7glnhnKV5NgxtetA+AYflrnDJDUNSN56LIgEPjHT51O96/4fZ9yq8JzkkpAFhV4ZTopgAV2VvkejELyjxj9+Pvu2QUKwBKK9snFfj1zYivczEVOFAdXEyfnlHgl8PXuCERA5RcaZiNfR/MIILrEwIAwFB4JYx5Myyjd0RWPOt7OX8/kUz8Kx49m5NTEw8AuRrW5sJVr0eJqdgA8HIq+CebEg9X1E9JBgDFBPa3j7ggBTrvRnQess+28NfqEcxunVEPRRBmcb5bZSWHw202Qs7qnEAg8/+zhq08IKj0H3zBo5C3KlYskUUumAHo2aNV1SH/ZQyFmylYw0FbIpyFsPgxK6jQ3bwghQCa4AF5xVWN85JOo1jYwQjsifm5rAO4BDc6CCsvx2/deh0witdvBsDrVDWJthSycKf5z/8hNM0ABDLTGkB48Q8GRFs6AnjFAOgdzSBOEMCA4mlaiqAvHu6rohce7T7rRkhpC8cKAPVTqEP7UMAeCrcSQHiKK2Q7rShGTSA1Y5CTT01iLAA4z2VUbvWMMW9oQwn3QlSqucUui7neb04MupNN2zhvBdUCvOsSbCkozT+NVwvamA3fwTOTUZ76d36GLnKpy5iu94mg0l/Bg9SnlVY+nyHSThwyC9ArkrR+LtdO1wv2Ql+w9ha5HbUyCU9k+2vrJmPDe/MoqWYlonyhu2Uu9n1kFUPbvCMKgEEamsCP6BKA71yTGilx2F7OKv0AsUf8CkZrMiuvPeBTMrLOMYypu8gt7B/qDVe6yn9eGkrQfK2JVB+Kq1qnU5427oVM+zr4DnP0byVAdDFFlovip+8A8A5lKQPocBveF2FdF821qb9WMY2FehnXpQoxwDdQ9bShEq+DrLOWKmWBv2EJhFSTJQSUb6bBhMDb0UrYShRwlJGoYhuXXOQ+ag2NolSk2DxvVy8kSZIkSZIkSZIkKTr9BakoQ3+dv0vJAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-css.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACTklEQVRo3u1YSyhEURj2WMiChZQFSiwUojyi2MpSKYrYMMMQC2XFZoQQEcUMg7UsJCmkLIQmd67HzitRIqJIFiLXd5rJ6h7M3H8cV+erv1lM85/v+8/5XxMSIiEhIWEa1E941mGaALs2zl7TQuHoQZCAJcP8G8eVZEHktQanp5Pi+ZSLE6CUUgjoFSXA4nInUAhYFSTgluWfYQE2x368zbGXFCyrn1Ca9QUoyyYp0UoPR0CPWQQs6yewWvb32Xt7zI2eAPa8DPu3TnoWfE0sWPbISeB74wnsjc6dmAqkrhmOftPYTqKo+o+b7zMsgHVBcQLUCorqYBclAJZCIWBREPkHkg5sndxJb3Du5gbLEKBWjoB1szSwDo6AQVMIwKw/zxmhK82ypl7oCcAClUrgXO2Hs0MdqyIiH8t5Pk92uxZGccAB54AiCgGo8yWcFXLDsPPWoe1IOHvTOeC9dnoziuYG1HbOCD1MEf18TvSZqHGLS80JqE7jNyifWb75/0q/Ays1FAIaf9Bs9nHdLXVT2zHfkYbgTES8G785/n6J302jGKGn/OiaL4joLEpf8Wfy+UjDTxe+P/LD13P53Fw4xQ3sBTgCnCPSTl+1CmSE3qLqkLNw+PrL888RVshqsiZjcbnj8ATaAo/mj+yUJTRLbJLhjZeENodSiINm2BslIH3GlhV8ZgePNActo+5oNCArDnf7SfoCFWsA023er5Pm/9mlZLCm88XOfImkHEI1KvgzpPVv5SSC/fmLCK94SXtG2JMjmWckJCQkJCT+Mz4AUVPaFt2bDREAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-csv.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAX0lEQVRo3u3YMQrAIAxA0dx/7uKJeqx2EoQuIm2J5H3IKj43EzHUzuPqEzsGAAAA8Djn10cBAAAAmAZ8ggQAACgAeOtyAAAAAAAAAAAAAAUBlrsAC1/BbAOQFiBJ0m7d5z8NVvpGAGYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-dart.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADwklEQVRo3u2ZSWgUQRSG4wKK4IKIiAdPnr0qorheRNCDeohZZhI14EFBQQVRHD2piReXKKiIGBMzLrFT1W1ikDm4IaiJHsRDFjXRuBOjWXAb/5epYE873dPVXT0zQgp+uslS9b6q169evcrLC7AVGMakMOenQpx/L+a8pdgwVuT9L42MheGdUNyk3yHGSnLa8A0NDVNDun7eYngSRLGub8zNWdf11TCw28F4szbnjOH5jE2DQdUuDf8rXd+a/VlnbC38+p208UL4/+1ZMbyosXE6DLjs1fCkb4KxWZmzPB4fhaXPx8AfFRifWAXOd2XE9i2GMS6s6zsw6B0/gsF34Xb38f4AeoQVuBWJREYHPvOIMvsw+G4M2gZ1qRCMf47nMagZK7unjLEJgdiPmV9Puyl21usCYFCVC5HQ/yXx3oVxCmnCVBo/Ax1/MgHEA4CoSgLi/KAaCHQybLQFgNSuDIKxx3g+Uw5BrmOKFi3w0zrL4O0KV6LqH9fyAzHsOmkASB3QgAKACzY79iF5CJPrJAFwfs0mlr9QANE2FGJT79iHpSDMruMGQBmEcyZb7grC6jpmAOhqml3VL0QN9MPh9xXSriMDIPTSB8QHjN/guGfEYuNt7Uc4K3CYXbcA5Aqv8OxXFY1cAZRq2kz8wWcnAABekfBnrxAa1CcNYOc6ngG8Q/QLCAkASpM5/5UWwNsZoNMDRLX0CuCX9wICiIvsUwaiCXovBVCk63OdBhEAUR8hssvJty36CdV6iULL7CAUAMhCVEkDOEEoAiC9dglBJ7ZWaQA7CAFQqyjzdAtR4wnABuKpQgDSm3QQSOIuegagVmIYS8VAiVMYY6dVHiVF398cAOjM/NAzALV10egYuM8S6Cg2u1JsTk8UQ3Q7rATlVRW+AJIqcZzrlLMD5IQonbcqgnibciUY2ykg1ACgg1XmWE2ZI60M3s+YXE0VRG+YsU2+vgFrWxyLjbX6pNCgyKUqxYfX4xcC55IjIpSqA6BWqGmz0dFXByN6RfirFOn3gGSFgorFPVQfMv2cXLU8bBjzlJRb0PlyV7lNwphzeB7H84ZIEdJB9FHpHc/9Q9VATZujtNBlCbEyCVrHUBhOwNxOlbXCDffC+G14v0nuGnyZvb5+kURuYz4nUCiuxPMkgBjNOFb1wPBdA97PZqzijllb6LQZuVBziuLYykzf1CxI82HL6AuV8jN+a1PC+XwRgfwCVGftzozCHM2gz+LWmqxe/NHyl2raRBLd1pc1NU0mhevqprhR8Lc1I22kjbScaX8AlCNg+xEF06cAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-default.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAArUlEQVRo3u3ZuQ2AMBBEUYeUQWkEBIRIUIBNDRRIDTTAIREQgDhnDdIfaWLvW4fr3E4y75O8Cm1eNf3UQdSuKH3qFFmGHwyqQYg3r0esH5D8cB28FKEGyBEWACnCCiBDWAIkCGvA64gYgFcRsQB7iF8BthC/AzyeAQAAAAAAAAAAAAAAAAAAAAAAAAAAAJEAlke+o/Y3AGZn1hMN7WWA0aH7cPPzDPMsjhBCPpkR3JfgfMVAuM4AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-dlang.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC0ElEQVRo3u2YTWgTQRTH4/cHouhJRfCgBxEP4kEEUauIgqAiGJCm2Zl0M2/SQBRBEE8GFLyIngS/BVGPHryoIIqCIIiCB/HgoYpUmv2ItqLWJnZ9k6YRhGyzmZlthHnwZ8Nmd3Z+M/PezHuJhDFjxox1pLk9sMyh2S01Eb51Qm6abauJ5roasmC7Z7GdXia7w7NyG7/Y9soAYNaUAngEBlGBhCqo1x7lF1zCUl+7+xbHDRAoVsUlcN+z+P4gkZj2PwL8lQXPHcrWN5Zrb+9yvH8aAd/gdQQ1hhrA526LJdx5AOMacSnP+YTb+Pt7+LP81meA+Z0GEFWPIgWGZg2JdYwjtxcdc5+QWNO+xQ/iKFn4fx/eO+YRdgr1pO7IyiB8C05KA/gULrbahp8qLPQoS+N7/YogvpUBFskBELgU1Z/6KZ2LM3IC3/8pC+FSdqhVgDFVAI0ZodlN2MawZAQ7Iwdg8ctSO7zwG5kZIHB+SgHqbd9r35HZkVY/8lsXgJ9mu9sGyPC1UgA4hVdkAT4lj87DtqptADyMMs3aAOrtD0Ts/JDTY69WAMCuKgL4GKHz5TLJbY76gaouAHEabTGcVjBs3vRT2RXtjFC1SRy+JgtQIrAqpNOPcbNiDuV7hmx7icwUawPA89PxEIDDqvKBZgex6zLtOsn8glAHprCmowHEUSRk9F+qzMiUAgTF4nSRdYVuUgR2xQDAb0ReNhi/MfN6Ft55dkd1TjwqAyBSQM9iB0Rei+/9mCRclhyaXxoTALzFqT77r3CHPje+vvndWjll8k5PyCunc+t0VCVGY8hzfTcDG3SVVX5p7TzlD0Q5RWddSBfAIPpGXntxSzkAhReixBgkk7NjKS2iQz6NWAcVh7MSRp0PeH2HeiWOHS6FblEojr24K6ZYbPsiHIoERFQW3hcKc0RxKegqzsSRnCE2p1jqnMaMGTNmzJgxY3rsDyrGMTofuE66AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-docker.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADYElEQVRo3u1YSWgUQRSNO6K44EEPggdRTx4UQbwJbjmJB4MamS3GEMUoggcliiOOexQ3RCSIB9dBM4lV1TGMEgPqaYgLikQ0Yox6cSEqGg86vl9TyNhMOt2ZGumR+vCo7uqq/v9V/6r/f5eUGDFixMh/IyHOe4CbNrwpJgLPg0LsDAmxOcTY7iDn66mvqAgAdSCwPSzEUVxvMQR0CIxZFGRseX+Asa/RbggzthYkNsKNIujr9KqvLB4fCQzXRgC+/AAkDsOYU9Sq1X0i+xg7ietDaI+pPnp2hO7lcyG6PClLpwdhfhxIBhsaJugjwPlKvJQrt6iDgVdh4FbgMjZupTQcffm6EHQtxJy0wuNwIjGuuAgwdiGLAOFiURHA+Kc2Amm8a6b7Dct5jfTrbHD+HtgFnABiMPAA2vsYu4cMxaaNYuUOUp98JsRedR8DPuV4X60DgU47AbxrX0Vz8wzoKsX8xWuEmOK0AhQ9a8kIGLiDFKK9QacK2tO436YMa6Nx+DrHZeDCeNUXk/PoPjO2TW5qztdh7Bm5QPBtBxe6ZSeQE0I8xNgVOQlgRaulC8AVpKtwfm7ALqTm0zFLC6He40RgkysCGZz3HYFAS8soiicujO8u53y8bwhQ4MLYBZh7Fs97nYyHK95dbVmTMwYLcd2WPX6Ekkb6PFmgjXXlrz4EKNsYt32XgK+KLD1PoE05GP1Dtd+BexTpq1KpYdkrnvYzYPA8fJ0hFKH7OnV8azy5nJvA4evVd0Og26cE4m4jb6MPjX/rOhOVubt3Bb8UCkMA6YKX4mE0Jn3woKCXznhVwHzTbjxiiPeKC8mYByU9CCTX0N6RiZpeArEBpcuIamMw+ZUHRe8UdB6Z+/s8691IQIi5MkKigADq/4DSX0oNOC+LMDYbfZ81r/oXuGS5nuKdsWUU1pHbTHcYU61xs7bjfdO0/oEIcL5EZoOMRWQIz1101+e5UbvwRSvmt7YOLcz/Hcuais96G8o60AbsioiY+gvh1fgOKoxqLGtE4X8GYaXJ72WZiA1LKTGUrwKhSdFodLCK4kuBF/0Y/ZLKzKBlzcprk+ZDBBt8DtW/qjykmPFT1cnPZCqcSZkf0XOqD1SdUFrZ1DTRl78QqfioSibHav17ZsSIESNGjBgx8u/lNyuZfnLHDkK/AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-dotnet.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACfElEQVRo3u1XT4iNURR/RESSFAsriQgpShaKpY2NlJq877156e1mj8IjJUqjSCZq7CzU1PfOvV+9ZvFkI/UWk0FKUQiLMYjwMJ7fHd9M0zfvu+dcNKvzq9P379xzzj3/7vkKBYVCoVAoFAqFQjEXiIh2R8acKRFd8ZIxl0H94L9QNqZSJVoSoqds7VasvwpdI7i+BL3K0BjoMyiWCSRaD6F3sKCToV9d3nWjZ04Gq6jTmQfes6AJgczvkLmRlVms1/eAeVxoqI+eFhuNpUyEz4nlWXte4vn9YG4zwj5Jlbr0y9PVS7RdHFFrX3DOKIBxR5pnPmHP4bWdAVF4n1cP+DYodgTRQa/xR+J4NRhfM4LGi8ZsSpU/DojC4ay+viRZhG8fhN5vsKnjqpsR1Ha1MYO/PyAKt2alqjEHhGvbkbUb/MYTRZwgdKSeTNvbF7CBd7VabX7GYbf/tYYmUR0eXp72WJ+g0VkebDYX4/0X6SbKSbJram0ljpfh3VeB8SPVVmth4T+0sZM5kUsConB6WqcxJUnPrxBt44xfI/HiVOF2yeO+gA3cn944ipKNmDEnJMf3JYHih7m1kyTrAjYwEQ0NrUQvX4X7nwxva2+zucBrfJqHH9k8tPYUE8UnAb38kCBq30r1+mbe+8LwI322MFE8GhCFQdTNPS8PUa9oWAPzI4HCu5ycHmNWuNNWuIExplVfFBnvvCpQ9lY0Tf5xRlUg74d37sFI7iZT2YyPvGaUvRHl4cxNYFLk2mLeSQvjjwX9pGDRgxwFo/B6zaXF3/z8uMMqPVduoMZuOkrvr+E6AEOvu+eUBnAeHMd4slZ/GxUKhUKhUCgUijnDb/Gy4siL0SxzAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-editorconfig.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEMklEQVRo3u1ZaWgTQRSO9T6qoKhVUBSraXYmQa0KCmoFBesfUVB/CKJiwRNRUSiCVCmUUHpkdmOJKBXBHxZB+88fHhQ8Kor+qAdotUix1qa7mzYeaK3xzWZj1maT7jFbInTgY2lnMvPezJv3vvfG5bLZuoJoksSjCsB7QA/goSzgLYn+aJ1vhky8a7uDaHksVDjalU2tvXrleJFHT0Do2ECIBJ2F71VAv+b/XaKA9mWNApLAleoJPxhkHh81u1Y37y2ATSkJ1/rc7BTg8SMrCgC+R8mS6UbWiPC++ZKA7kqEu2b0NyYUQC8sKhCTCdo16PyE2wljo7BRN2Ix1wj2JsTjJqsKiIQ7kdFkCFoB434CXob97lxH7oAsoDNWFQAcTDdvrKxoFPS/U05K49GYt55qNBUW+WTpBAJ4Vfrd96xPeC1HXW+4xjNLIkiwoMDzTDYN/UF1XIi50MrxCvgATN4M+G1BeEkKeHBG0+TRY+WUeHSMqfBiEG2EiV9ZtPk+QGOE4AUGvFurUU9lcNddOfQ4bVxYinbq0w26Z0UBJlE7VobGwJFetyl8HAJqkwJorgEFmuPjuVIWwaqRifBJtIZ592wja4IJVdkNVPsZC68CN2X2Qpgo4wi6ad63B1G+LHjWAHHiYJIvziigsNWStF6IoN3quA/mIivPHdG4xl9OCa9ChlwiT/8EvN7EOBoszdi77LDQ/4KgK7qOo2HbSOj/ppwUuG4zNt8ypAoAWaPRfBCqXm5CAeXoqAvrAPgB951WghJCfSr9l6Lcsx4DSP5YysUdVqKdmozOfdyj9n+1RehEgvfqLPoDglIvfF/D96l9JbjiFAWCaHGin+YG1hUQ8PaBC2rzUiBc5xgoUJly+rDrykbFKcVx68EMmCPNYTULRqVQ4RSNz66yfQ+Afabxis/UIkCDbT4UFgoWUSZJ6XRyAa5YNSW796Cvs9I3MTXj4y6ptPoN+3SSx0WJI2YTE7jVOp7osNrfTwtoWZFKpqUWPLdN5/5tSPRHeLyMXWJDUI0D7jQlyY8InqVJKu7ZxER4aqvxWo3zAU0M4jlm6kgGSyncZocCmn/gWp9r8UwjZRizCU65QwqcSql6QLxJ3hG8g439C6jeEU4EOUCm05YDaF1WK6B3ScH/X9a40TxWJlThgAL91N6167TVzxunPpjQ7O02uwBG8Fb2u48epG4UV5fJvKyXE/3uXEpx2WZm+GQaKk1pxB1al2JbVrdWD02Hjl6hYJoyL5BEIHYXNSSvk5ntaxt9KQElwmwUAEKoMF58Gv7+qCm9tIgCh5gL3xEqnKC+jUVYVCYAb3WS/fP0EjOuSrty4LIdYk3iNKA1qAuU/zj0GhPn5owhAm5RmiCS/MmOPWRQW2RRQqH5M8wVoI93PQHPwiF7D6bmQ23SKmh1w5FXxuE23Ibb/9/+AGCqllvjudC7AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-ejs.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD+ElEQVRo3u1YWWjUQBiu94XgDYriAVURRPBBRdSKDyqivqgPKggqLYiI14PiAYsPHkhbm5nJJrutpYKCi+iD6ItKpbaZbFsoXlBtFdRSBUWpSC1qu/6TzbbJ7OTY3RYs5och7Gz+a/7rm+TlBRRQQAEFFFBAAf0bFI2juYqONw06w9VGdbpCEVEp/qVo5Irbu4lEYkhGsnV8EJbCrdLK6srRORuO43iySsklMLwTVoItkQMVtRXjIxRfVCl6Du90gQHNhsON6hQ3+SBrY0qubYFTORnODFJ1chaEdfDCeQfK6/Bs2P8gNITiL0pcWiLSEa4LT4P/P6XJp/huplHsJRY2OPGjIOizg0E2B5gi2HvIvdNt+63hF7GXoZF8mkHE7gnkf7xaI03NJsdHQNiKQECbk+FmaJsjmlzQW9S6NNP6f0RHVaHq0PBkOvXtR3V5hS11KDoklk/WZ2R4KBEaqmpoFzC3uhquoXbmIDPOZgh0JJsDpnNyrbzAHjW0v/ewNLTYqBNOBzhd7NvwZAjRVmB85mo4xd+hME9fe3p5nLAIdWmR3QG8j+3Dc7N9H21g+yVayRiWUoLINkn3pVF+e/k6YNI9DDfapVcXicViw+DdtxxfDTx/WvY6yrWSScnTx1igqxOistDbcMhDRcOPPAxn67rcIM/zG80wRWuBp8dJXoSS3cm8J1sc6qrIu0gpPuBtOHkAz6XZdK+wJi0D3kZO3utUUVbUohmspQpa5m1fLRPyOOTSWZoyrn4nR1hv18kq1p1ShhmNInk4vO42Nij9tUmxA20svEzBgMIQnRwX6O5htehfiNiBLgYTKqtLJwyY8ZCSrLAFbflChoJcUghyEwbQYX5a5kqs9YLsV+nG44aMdfkrYtyq6GR71jgkXWdUoOOHopflW51U6vAaSOVCA9i5tW1gXi7ALaKi1iIaWZmL8RDRbUIcpaO9lom8w5jw/EzQyUkGbVwHGWAR6iMit6yn5ZdIPZkFvF8FLfNmKromCnDUDRDlvCeUMAeLF5T4DRhF8prI9smMHgvkvJOfyBMt+KvdEvFvhg6KW6yI1tfhMWGQezs5ZtHqYKFlWMYj708JeLujcWl1H34qy+cicyKJn+QCDrbvyQhOs0LyhNMUv3caemaN/RG0zHOC99KAHmvnXLc6kt2FBhj9XmhsNzgNv0nPe0R5CA6HNdbuaBLCwJKtvAxj5XSlhNCe8XOlNLtOlQiKO4FCqBPkEel6107klxgMNm9Xjpd680LkiEKdhpwLMm6JxPH8fv+sYmJ522cV8/pYDMaWWxcrZj+XKtZAIHo3DCSrkzsQ9WP98jnFGfuH5wzKD1sBBRRQQAEFFND/Sn8BFyNXTAqQOt8AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-elm.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACN0lEQVRo3u2YS07DMBCGCzfiGrBhh8Si7QoQIFixa0uAPijPLSAE3MF21xyAM6WMjR0ZkzSJx5lIyCNZTdPW/j9nxvbfTidGjOaiy9hNj/MlpvUZS3RfM0w/XuJDDKzbheyrJ8SUDED+yED0OZ+gIRi7wkB4AagmxFw9Cc4vAzyJse+E+APIPOb8Wg0M+YyGgCfgA4EC0Ok00/dHWAirrzEZgD178DoI8CTmdSDCAPyk00SlgBBn8P4L06CPXTUWFDgZgF2MIaMMIjRAtixCYW/DTH56NcY29VhbZStdeABZjDCgrom59+bG+aNdX0UQjQDYQurs2OZ4kYl36kv2SQmQCaqytlviH1bVlwvRKIBKJyHOy4ox+06xeLe+EjIA3UZFKWA+g+K9r1NfBoIKQObxUNUEzLZ7r6p4t75M2pEA6BVloGtiaK7h/h3GT9ACWBAY8W7ttAaAdXbw+9NWUgiub40p8tzsZF8nneVyjQ7AEm/NoJc9he8fS/FQS080ADni3eNzZSMjxJEUD9fPNMvoKvGOsys5eaawBxxK8fD6QrORVRCf48byNrsUls0DPfOvNEeJGuJdZ2dvdmrmhdhPkmQdPn+jOcz5iP978pQeO4W2p8Rz/k5znEaId0+e3cViQ4oHqA8aQxNG/K+TJ9TGDo2lDCm+hrML9bdKcPFVnR0eoFnxpc4OB0AgvszZYf7cJRO/ytn5AbQjPtfZ1QdoUXyes/N1Ze2JzzFGMWLEiBEjxr+Lb9k1nDB00PnyAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-erlang.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACoUlEQVRo3u2YS4gTQRCGR8EHuIIexMdBFMQHKCJ48HHUm4gIxoPs9HTG6epsYFERbyJ78oFHb3rRi4jgiqCgXj2JevCigqAsKG7mlSC+MO7G6uyyJqEzk+kOxsH+oWAJbE19XTXTVWVZRkZGRkZGeVboQA3tR4d9Dmy+U8evP3x8Q0j4ochhRwMHDlQ8b6Wqr9qxkeUY04Qkzq/W7B+NVoscOKX6sJjCtpDyh50+0epol/xCeUjpoAk7LPH5SwLAx1WDF6eNPqYkD2q1V5O2vUStWvh4GsDPmMBaFeei5PD/v6cE3zQsqWtKB0T47kQAVcczztmDXoKfMwqbsz6jYVnzMAvPuwHUa7a3XiX4KqXLRPayAEQEPKVMO3C6CwB7rHr6gesuFSWUxXxaXqWU6SLbIwUQZHn47L+ndHFLtv8AxHZpa47uro+dANU8Xb5YLe/aAQi8yVn38LoNAIme5AzgRWcJ3dVxGFHmhpRd/GvmgN+eAQq3tACyXmL9s7kM3NMCcNjNAQOwp3oA/PKgMxDrlRB4gwZo+KS0Q2sGGDQA1vE5VYCZLhE+9Dm4CWyfr6a06G3d6DOtbzOBC30Mvh5Rb5fw+6lYXIEt9Fn8bTINYLpKS+uUr/dhWI0+vvUDQDbSvh0dXYR3AMVL92XCRMZuaPUoFM7oA/DzoiRThpp9YvEgGymnKi7frvwujI3NRx+3FYP/gjV/pLeDYixhqFcfbJoQAAvQz5UMgU/j+3MntL0tPQVP2EaxTkkAEOMeO6HbcMVOaS/W8v3ZdYos8IqYwQN3ZFPPu6ZCeailkesOIEopoPxgPzrH5rxM2H6R9ojCSbHkwhF0TVKdSzNbKCzEuB7JvkKyzZyw8F+Z0prvFoXr0s2ckZGRkZGRkdF/rN+BYfp1dTTl3QAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-eslint.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADnUlEQVRo3u1ZXUgUURS2/9iyLCj6IYLsYRNCiqSH6CWQIF/CsofKMNd110J66qUyliwKrB4M13VdFQp6WCqirIcirDSRnbljShKx0T+hEJSU2q/bOTnCOs29c2e8oxvNhcPIeO8555t77rnfOZuW5gxnTOwoamqZ7QvJ10rr5F8gCUECuqSrqNt2AGDshEDHtVJhq/NlQWkVGPlqI4BBT0RZaRsAb1i+btKhD6qYWRO1yXmy1YQT30HOlgW7F6Dg3+o7rvUl9WSLUOcLoj0zQfEzPgfIFXhm6pydTPV/PCCegMwQeHDJYWOjkgRfbrORLpyDc430QbgeEuJ8cYOyDBR+Zhh75w1LhYFAYiqvTpzrC5G9sPYtQ+8nf23XYgFfX7pEMTCAaQ/EpbeuvDo+C3cO7oyqoqbODEpKdsH/j8HzC2UXIuNy3l8rbdJRPAygGnFndBclElN8IWknzHsxNhuRg7S4hvdL0dkR3WNtecOxHIsHNzoNFCiaA3ofQK2jZ6pYDsxrZYTFU5A8BKm33hdSsmFH7mnWdJgJz+TQ8ek44Nabe6AmtoIRanqhcQeea/V0eSJk9d/zSZEp5z2R9oWUC8g91vGeuSq1GLTCf+BrhwH8EiMAIH0g87kBgOIailG3JnZPj5c+gK2bHAAwfM9zOq9kM5imW0MtzgjgP818AOQf4FsW2/s/GUR+yDA2mQBwF+7SEsBoSOw2MDbJADDkSD4LwKtUBwASZwHo/wcAfGSRtiOpD0A6SgUwwl/keAoDeG5YNwOP2ZbCAPJ4acQNTgDHBQCIcgJoNtN5yKQU724tr8daAGsCC473I93WhgQFwDd8b7aAr+Qlc4UXu+aouzHA4fhPpCr7G5VFvGQOgJ600v9xgbzWsMhK1iHy1z5eDs416fD6UUdus+iAWntXaNa9wQ9ksRMh7dBx5CXQ212sKx3mrMfaIblIx64Gm8KQfMwyOvYKrJdkoBj5ByUft8NzI3utvN1XR0oDgZbpDPK4gca/sLhhch+eUVJP1iATZBQnl6100ziKIA72yV8fVBkczCFw5lRxQ1u6cZejLV1NEEMGVds5YX2h8uqOeaD0PUeG6YNY92I9TamxS0B6OfT0ok3RrcU9JnJ8N9zouUm3ey6+46/SpH3im6Mjh7LVzGUFYXALxdwFRx5Z6kIIKDdFyDCrbSOqT3rBRgDBCfiJqTMDwqJFvPPSA2zFOz/iOcMZznCGM/6r8RtqAUgCKrCITwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-ex.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAClUlEQVRo3u2Zv2tTURTH0x928Bf+GBz8A1xEEQex6FZ1dFARf0wuOhQnpSBFg7iog7W954aAIoiDPhFcKijIqyTne28lgyUEnUQFfw0VRBGtJsehrxBCQ9Mk974XyIEz5/N5L+/cc+5JpTwEKz7ImkdSnRYhhatBeAiCgDDWUfAz12dWgfAighcQMp0GP1UFLyA86Ah4SUsvCE9q4MWQMR0hwJpHauGj/BEEQV+i4UEYBOFfHQHJjee2JxY+p3ProfC+HnyUw0l++pkl4AWEqWTCZ7ADhEoDAhVksDlZVUekh4lzDcAvVCNKlIAhc6JR+CjLVtttyWgV0mE/CO+WKSAg2FJQGkjC0z/aBLyAIKxZx/7fB+FlswJRno5NIK/ze1uEFxDKTHw4rrr/uA0CAsKcVXaf34/3RrgOhL9tEhAQfhpldvl8+sfaCL+Q3/I6v8VPx0l834GAgPDajtu1TuFLQWkAhO+OBASEwG3t12bIIfx8u6HNkMvD65JrARCKzoYfEB55EBBLdo8rgaIPASa+6kZAYdaHAAhFV2+g7EVA4Y8rAfGVYTrsdyHwy5PAb1dv4K0PAaPNK1fnwKSnKnTPjYAyF7wIuLqOj27ffHwDg04ECtnCChA+OYZ/IyI9LueBc47PgPNu5+Hb+TUgfK76wVkQho02ZwyZm0z8jIk/NCnwBbewwcdQs792LITGkdoVEyveDY1rjQrxBB/yOVpeXuTqcHKxTlLS0guFU0uUzjv+74Y0LtYBAhNfYc0nrbY7p9X0RkzgQF0BjbuxLUCgcbyFLnWOFY/Gvr2xY3YTFLLL7JWecoa3Jm5Tw4rPRou+j1V7gwoIX6HwnBWPertCaTWCIOgrZAsrE7/g60Y3uhFP/Aejmls/KCTiXQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-excel.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADgklEQVRo3u1ZTWgTQRSuP6hURMQfrKKIWBU8CCL+4Ek8KCIeRBT/Th7sQRT14O8hige1p2Rm9q+NEQ8eAoKIFFEh0Ka7k7aXHkoVQUFUqi2oqFikzfommVlnQ9OfzXY3Cxn42OTtzOz7Zt978+ZtXV2F7WFv83zVTGzTTHRat3DcsHAGrkMAm6OnrhpaOp2epdF4o2aRQ7qFYoDHoNxbQF5SdiwET0Dv0ZfolOyGh58zLNIK1y7A7wkUDYeAlktsNig+pZmkWaP4uW6izx4VLYde0kWWe8SqVCY1b/zV9lfZ6cAw4FqUCTAMhEeA4tctVNnhBbpFLoh5WBAJ6w14dmLwy31injBN6Lth4icCuknOFpSz0FEIGM/GQqtJ1lUTARdYWC4SwDfK9dFyaGuNgI/4CXjlgJJLXLljbN8ZG/HGIAi8Yzs05D4v4PqlGp2Y8gm2GxY6WHLvfcyOzWTjcQ4vhv+/xiOqUXLYATcPcNaNLrkEpUNZ5AeBYbVTXcb62LY9A/73OzYK9uuMN9GtAHwg78mEwB5v/u+HrnP5qGqqK3nStxA2qm9VSwAwCErWs36qpa7hsqdiLMT1qwFFIc8EwFxQk+RU7cwf+OrXw/2vU81G2VsTB6FyWWgsE5vtGwHAG+GwsOIHxOQGRecDTCUqImCLVRct0ZaYC/KPkySQ51GqAHijhJvQZVlegi0+E8AZ1xgTHQ94Jx6tlEBCHsNOSiD/GxUCwyJsJrNohWOfFjImqfQnSB+uCEBo3l+MamiXLHehR2/wjYC8+nDAaLvfnljKfivdylq4PxKQE3sm4Kw+y9H5LnxRGvtgEgQGdRNjATChE8WIhvbKchey8dW+EChZ/btc3sdSi4ISObyeTV6tPuCsfrovNkfetNh51dmNKXoUAIGRKROQV79w/HPfb3EIdOFNE5ZF4GDvwCK3+ZxNLrkENmfFBIoPwx3wwJdw/VB6SAGCRzQT72GbDq+HTqcTj4R5IutnJiHAkkKeSzXIchkigawWAuH4QI2Az1UJEbqj6gO2SOOjWlocDdOEBiDM3vECSOzSfI6hSJfXgUw2TAJDzHG9ABw9xZI7dv4Y9xOTRtFJ2HnvTdMnpvA+8hUO7hQnYRW6QZE/kSFQ7jOrklU2sNIfq8YVav3F+mg0CJRryWxygdaJd+omOcMqDsUEEP+IDIFaq7Vaq7WK2j8N/nFLyOfEYAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-fixedform-fortran.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFCklEQVRo3tVaW2wUVRgeFFSiWAiCIiKCiMKLPBB9wECMJhiCCaAFgoFA2XbbEiI8QEJ82UgCiSYmNNDupdAEaDT1pQ1F7mlBItvOzLZFK1AolwRCgJaFhUqh0OX7dw6X3T3n7O6Zybqd5M9O99z+b89//6tpoicaHeQKmFMK/fo3hX7j+yKf/lORz6gu8pmN+DwLCoNuZUA0/zroEugMqA37NtF+bq+xH++1eP8V71V4r8D4j6B5rkDwHS2Tp7hC/wTM7mCHRXOErgJUGT7fFTK+dGfbq2B8Vw4xzaMHuCE/8RrHPAaGYOBYjjP/lHAbDR5Pw+DnAOg/DBTmn5G55jnRiSmYaPJpt88w7BL2MUEhUAuolZQY9DfoH1A76F/QKabgHaBzoBughwK+Oj2e6Ataod/8Toa0dFvzOO3/fGANwUceAx/Hm9urz9Eg+7tlANb+8tdQLQcey+QmAjB2k/zrKW7grVwAAJlvTuZP18kCdcoAwC/MyF0ARicBuJZC4+E5zTqg/Y38BK7tZ3w3RnbY8qqGV8jxgCrJu7L1h0FH8X4Ie+zB2O/M7wTw9ya3t+UDOQCupFwjAF0KZoxuLU/szVvHKux53+01V2QIoIsA3FRzJk2TxYcZHynadzKZn/L2ZKY4cX63xgKtjA9bWWlOksdTyl52r+BHCXHmh2kgonjY+2KTp38pYXBjob95Gt0g3RTnl+3jiSdzdIn73aaBOyoAXIGmCWIA5nzJ2nkJ9n1vMkhzNgfABc5eERroUQFQXNHynkQHlojWub2hmQnm8Q9hnBO/51XOfndp4D9FERLG5nDxy9JVfliXfRwHtZUDgKerPTTQqyZC4kwJOlAgWBfJr6l5MRUAytA4AHh83qOB+2oi1DpWeAM+s0iwrjz5toz9nHkdnICOt1+vxrReRYTGSHSghGN9agu2Hx/GmXuAxxjl4nBsX8FizYJIfivK0DRJvB1VDfLIxNKhVkHAnC27LQA7aCOx6aPD+tVEqG20Q0HaIRsAHmmqi1fsCI3KAQD9ygBWbW0a6QQAKPERO7mxsgiVlJ8cIWYq9DEYK4YSLsL7FwXbQ29LbqDRrggpKfHyqpbhkl+1mONd63jpKZT4uF0lVjKjq8uCr2cGIOZh13PmnrBT6FJ2ZDybnhqA2ZhmopIu9SqHEknlvbQAIAVML85Pl+4pB3Oycgt+VbfI7MWVBC0AJ20A6FEOpylxl3hiV7oOkFXlVAHcVU5o8mvaX1IJpykLSwBwxgaAiJ2UcogknF4sXqd7LIDmKrJKlJjbAHBbOalPjOvjb8BckKUqdVi5rEIxukQHPs8SgG7VwtYjWXxDgR7NyQKArnRKi0nuGzK+NHWUaWzJAoBYafF8ikJTLXVw8FmK5GShrBqR+JSU6x9aiQ2tNTZgv80O38x5UcnuCV2WyXqmD3VUnLwB4l2zer+iGo5xzMkSOWtnOSlC1WTyvpZM+NNJAK5A8E1nu5Xm3CfXelGk5UhIplMRi0IASmJKt7W/trrs7Mu0juIaiolYD+sNqlSsrAyNp8Iv1k21EpvY+s/oMKvj7xiAC7EmH8uK1g3ANuu6p1dLcQ2+DA4gAMGkWIyJQbVqipklesh4zJPZ7olUXE3R/M42hYkn4i2jBjMtoMCMmhJWs86otxp1sa47ddOvsP9q6WaAIyy/6GW5dj+jPvZdD5sTZmuusz06rD1je9fTWXQmnS3rQ9DzGCveUhT94Rk3AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-font.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAX0lEQVRo3u3YsQkAIRAAQYuyUz/QisSq3goMBEWFWTC/STy4EKRzlfr9Jx4AAADAfLmlOBootxSv/3IBAAAAAO4H7NyUAAAAAOthz+wBAAAAAAAAAAAAgLevEpIk7agDeuzvZbRmxPkAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-git.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACjUlEQVRo3u2YTUvcQBiAU4oUqYWKQqEg3rz0D3gRevDiRfCwzRvBVdqyNw+CSHcmLaIIhb0U+kV/QEX/gUdhb2LRnjz0IH4gCB56UDe7W52+o4m76mwmyc5mEtiBl80m2TfPs/Mdw2hBYfOZrrINq2UKFxhneLxgpKVweIdCEcFZfVQofE4tfCokZPCJl0D47zL4REuwd+PdCPcrVRJsduKxY8PoHYnNwBIEvuiGX0eQywqx3qZKog7eA7ms2PAmFRIC+JoEgde1UWnqacmGl9U8DGENfcLr/7RL+MALJeoLdtqcrCYcan7VCe/FCTOMB/d+j+fKBA60SISA5/HbZ64oBsmhVCIkPI9TPisLBULkUSIRAd59OPwQNqN8tgevb4eREOVpKXxdLNdGJKs3VgkF8Dw2vXx4vISj01QsEorgbwvY8JFvbirUmhRIOHz4VSKhEF4kwK4kiJm9ed70yCMOxeZGn5SpNSeb7KQSeNOKIvhGAtcSFCbEzzc/BMhLxP/+TKbT3cO2WoDh958ihlNiPQuQ91AskMt14MXzOAQcAt8aNeEAeff9mtBiLDVA4Q/LZB4Knj8WYI6ZbdyJsYPwfycGgata4LV+c8976wVvHpKcBfkwqk7CV8DtC3t8wsPOu4af1abhFUvIBYJHIfxSolkJAhuKBArRF3ORJcytcwp9Xp6zeXjOhWKFb0LiwsmbA3fzlOh4v2ymVQ4fUWKn8TBtbsUOH0Fi12ee2dECH1aCv424v6k3B7XCh5HAxdqxQ8wRb+Xo2K+G8fyRdvgIzemvGywx8C2YseOHVyihD16BhH74JiSSAx9BInnwISSSCx9AIvnwt95EUyDuDmvfdxvYLu3SLu2S6vIf9xmnyM2qaEwAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-go.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAED0lEQVRo3u1ZS0hUURi2pIc9Fj1o0wOiVUGbKMhq0Qt6kC4KC7VxZrSGCtqIvcDCogcaBUVRRIs2FkiJzjn34tjDhUEFFj0sKoo2iWW0KBeKpfb9d87Ymcu904xz7tFgLvzMnXPP+V/nf53/ZGUpfEobG6cGOC8A3PBz3gr4AOgG9Irf94AH+H41wFheoKVlYtZoePymuaCEsVrB6GAKQEJdDzY0zB0Rxgvq6qb4GbsEJvpSZNwOvQHDOAd8OdqYh8bnlXD+PE3G7fC02DTneKHpHGjoAJiugcaDfsMoBLEvipmPQaeFH3QEvYNp7wwQXiHk0LiB3w6PGLdDB5hn1jvopydANJr8DLW1jfPAbJzBMF7sN80JeP9B9NMSAOZzWCB+6UQMW30fBLdRNAKsFDvW78JcP30Pcr7Cmk/rEFpd5raLnT+UfqjkPN/JfEg4R6EZ2+wQnfpKTHOTI37GjjgI8Jnyhbp4HxVC1nxtwp3j/JSNoZP/wH8zDr9hbFGbsGwC+DhfSONVVVVj8f88BHorM0kJyibwbAnXcZoP87hI6635prkobndVal/E/h0SgW+SueTFaRp+IDHaHcu6Ep5c287kS/O/S468Xe0OUA74S3QoMtBW2zSdS+MiivwW478Qz8dbApvmcjdTwf9Pkn8FVJvQXtkhfZHIZOvD4OAYaKsaY69g90fdTE42CcyvpPmAs7R+qDSRHB/z96g1Ic532jRdnrBO4vy1PSzSeAITLY+bz1ixUgGwpRttDPU4hcWypqbp+PZQMPHMivOMfRVrWum7S9jttQWJDWoFCIeXOcTqAUA9TKeUnA5aPIP/XWD4Eca2ygkMO7hPZNYuax7mW+uwXuCJw+0zjKVKBfCFw/OTLQWCjC2BuWSTWYDxaxiroAMM2XWyOIieUgGEaSRby5x2KQwrk8aBUkOtE9fXz0ixKGuWS3KR6JJeD59bPGImFEt2ZEp0+BFFW0oVKeULtQLAqTSdBaJ+ZJpr1UahaKjTJoDyWgg2WaRTADpaqi4lQpp3YLfKg312iLFJCU5aqoES27tYqa3E/pGQTiDD3tYhAGjdsc4MLie41HOAYeyiFgfggpYdAB1q5eC9TIkAhYzNFCevTk0mRH2ndkqeKsvpi1qdmPPLasMoDitawyjnx/7rMEr0VJ/I1msVgLF1ypu8w7gDGC70eHIBAsT3NAlw15vbGE1+oLSMsJcUbk1elZ1pouPd7QznazzW/modV0w1Hmm/Wt/tJOcVUu8zXfhIF4bamBel9Rtk58fCL5qHeVs5QDiEX3UVcT5NiwC+SGQWCLZQvCbtwaRWUduQGrXiXuCWFXKjDS5i8Al15fDeICraEHUdrJa6YYTxv41qn0Stx8yTeTJP5hl9zx99KzeYlLx08gAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-gradle.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADe0lEQVRo3u1ZS2gTQRhOUauICj6OvvAJgqCgiHjRgxc9eNBCfTRtWs1BEHtRT4LiCx9Hj0JQUTBi7HZmNkWUIFZFiFVBrApVfBAfxUd91RjT+P1x1XU72c7utmQDO/AzYbPz7/fN7Hz//8+GQkELWr+2TddHhgqFqooCvVHXJ9dzfqKesTfoC7BeWHtYiM3LU6nhvgbfqGljATZjAJfZ7TBjU31LoCYeHwOQPTYEyLqa2tom+JZEA+cHAPJHvRAn0UfDnO9C32khEfMtAXrP1zM2ybIy1SB00UQg38j5jIra3OFEYiKAfzeR2FtxsopVuGcicKPyCHB+y0Tg42ApxzBstBWQt0Nwehn2DPYNliNFwfWH6BMNQuyI6Po8jwS6zZvZU1woBhwhDg+g21ItB5k6Iu4IvK4vs/jpcx2lSd6MCFnwYPcbWlsXKz0QQLGSVyzju92B1/WZJGMewf+xHHR/94AKxNgRydhr7uSMsaWDBN5svDGZnNsvqDE2G/9pJca4k9FoOj0Cg18NAYk+JHAd6E9jkk6hTxevlbgf+2i+l3DfPAQElI2UzY1cVmOGdsLBAwr1UKDnZSSx39mMJ5PTMejOXwcggvdzi8omlVzLlLiuaj9pbzgF/+I/Jyg2EAfG4fdjmwdRUHvX790FcSOv6XH5+pxxVNIhyt6VbiLsA1htiQcdJWWR/sfYPlNakEWltQb9OdWN7iiaY7b22DjLbOB8fLH8+3ftJQBGYMdtxr0nySQ1o5UwSsguRQLn1cGnUqPoYbYOGbsZaWmZQu8kZG3BJk2bhRUTCkC+wuKGfVYE3+vo3Qe4sKLjLBExdDs/ZNKJysxpvtNeTq23rHSHo8yzSYhpvgEP2Qzr+kKn+c46HxE45qZ0O+gT8E+jjI12k+8n/UAAqrPKbcHS6QMC7V5qz9dln32UnV4IZMtMIE9R3vWR9iACyRWjLfIfSsLw+5PiuEeezuQHcH4VSVwNAG2XZZvmc5s6IZaYfRu5U0wh6gr3hy+FQpWN85Q5IgLgolK5PcUSmzQlYjkmtNpZrydgsqXOI/WdI7k35ubEAPesLkUCK3DBKwFZentJmrUKsVJSK9QqBsy1ssIdBK57JaAVpfT3Z563ZHC61earyhcjRaYjxQ9OoqfxPcA6WU8q6tCW9hUZFTl0eEAWfOIMWtCCFrSgOWm/AKNL3YLKhIdKAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-graphviz.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACIElEQVRo3u1ZPUvDQBguioqjo6AgiiJu/hgXP/qhoDgUB/9ANzcHkSIOItSpU/Eu1/6IriItFQXF7jqoTUXfa6s0l9Pkim9yF3PwQkguyfN+f1wiEa946bWSjC2nKM0D1YDsHvHrPH+mLfBVSicAZAHow4MKfK9W4NPl8gwAq/sA/0V1/o5OklcB/82EFpr4wWxaKcu6TBJywIlfd+5JzEkHhxVBXaUYm3MxCvc6z4T9oTp2L9o4JS8BLzAhaiIfJgM1BxgwFc93uubUz0AtTAZshzmAvXuaHfcJJwN2zMB/NiGzndj4MGp8IotEKcHXGmNLAKjtF3wS9qYJWdSmGgVQ+6oaANPa0wL8SrE4DoCaQjjl9t7oa2hu4J4tMPGQZWws/F6A0qxEwoeuiEXpkWTfbtjSHwUQ9wKol/VKZVLiJ1Pw7FXwhbvtanUkvDxgWTsuqRJy/Iu2TiRa2AoFPJcc/PxWAPOWKZWmPVpPMR80QJPDwUceQjKS8HjqoxY6E99LW9ZG0LY/LElerU1KZz2dnpB5sYoFus7lckPBzXkIabqkSOm5Qt64kGjv8U/nSApzHk5tcOgFv9/OdDP3u89vq8+RBpjzPKnMefheyMTPKHMk7OIMvfjDLo9Rv4/doKA3QNgtInoLit2kow8BsMck6GOYKDBgvAmZ7cTGh1HjE1kkSokBi7m6ajGHfiiIfWwa2LEs9sG1sQfj8YrK+gSck832PiBEGAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-groovy.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAHP0lEQVRo3u1ZCWxVRRSt+76LK1EjblGjRuK+BJe4W1dMgFLaQuqCqAiuqKkoGIOCC4i4QzUoKPV35r0WMJSgsmhV3IhYkKACpYhoKZuU1nPmnynPz/+/RQuh5r9k8t6fN/Pm3jvnnnvv/KyszJW5tt2rRxDc1MOYS9qk8IXG7N7D2oVocworK3dqe9a39km0X9EWofVrW8KHYQcIvRYQ6uKatbV5QXBIW7K+hcBT/W8+o694qwvSedy4PbF4Xp61j+Yac35L5uQGwTUQdn13a0/2fXxG318t/UarXHnGXAUGWYqFG31DX6d0c/qE4S4YNw9KP5dkV4blWjsbRtlhywsfBF2x4AZaEm06cHwL7vNxL22GNh/BuOrCyZP3SXzXLQz35juM6b3lLY/tRvsDbaWzvLVv4f4anTEldIw5Au9XEXIpFTQmF2N+72LMgVtEeAhxJoUQdBY0QQcKoL3snisqdk0h3PvcrazGxu1SLoB3GPMJxr7a6sL3LC/fX4FnORb4Evdn0BqkBDk9hlaXVHFrLyXk8o05vbl1Cow5lTucV1p6RutJT8sYYyTwJAorx6ulAtiZm11QgmKbRFxEWUZbYHtk4jdzJ0w4INFpC2Kxw5xfWTtrcyN0UVHR9umwSUtPptA9g+BIYPk09a0XNXomuh73bCh1L56PhfVfdxY1pgjjrpMz34W+Gs1Zi/YeAxnGPiD/8sxWjbXz5WOVDl5EAJQjkSh+rGBOhbkviFhq+Z1/cD06FyvkV2Bwiaz/kRaJ6UOPodWTJiMCNERpVm2SuwfB14LeBAldrffTIEAO7i+5nds4j7u9AoZ5B/ffIv2/OL+MP1eRip3BvC9iob7upTHDnUDGPCQFatxABDFN7qit5/MiLUQHH4T7t5j3fGTRSih9haxGiw5V/2IXGOO7u1yG+QptmdKO0aRgzAvQ970C4uWR79Zgl29164bh2V6BEtFlofA+RnR6LZ7vluXm8j1h4iZj4XxrzyXzEJedKip2RP/VTQvBKFCsgLARMVDIGvx+EP0z88PwRPy+XYYjezWgvw/uP2oOjTdFcg3A9z6LMOIgPffzEbJaGMyOaGr14XVOKWsHklqh0DmRMRR4GlpP+dAy9c9x1jRmhhMyTskMiNYxUBBMTIDcdMd6cSEJtzXedyDXCNyXYN2nIgrMdLsqqDumIRy6T5y4RwL2GmWhJ+RgNbS2Ty9gqXcTUw1Zf2SEAHxjEBxPVtI7r+w6V/TQYPSv+LOfU+/JQyzo+1c7iGHtKITqcmKxY7C1F8uhG912wmjeYlj4WY0frfd1TokEBfDxh2WYx4ljWk850oKCsrLjRaV7MbHrFYsdrLFxZw7D82RhGmJ0XlnZUTLiZYIU1/jcwYprBcFxWcLjSoc75DL4QGdhdYTSCU4aRZw737D2niZhw/BKh29u/0ZovJgkR+oi5V5JfNc9CM6KGGAA4wdjRSQ94bw7kEu1JynQ0H5HoECvaAqRCJ96tzuwSkKudFvUD6LZpqy1NJrraFdrI3PeJIwkUI7oe6HWnxJdi5E9meIw4o36VrG30BtNVjXmB7INF0iRL42Rc28g9UbSiYERP/hZFGoVK1Zg0QvQ90GSuFFFS1NIGs3DTEbp72NBNMcSO/5ExX0q0EDBo0VIiky1ExmFVCZh6gW1YXLoNaLjL8Q8hODYAmuPjgiVrfHD6WMkD+cXGKP533AdyHMDM9coXJ0MCGBUFnM/ZL//aLGsf2fKEwZj7ldaUMXfSv7KIpacT9b4j6VodsTvfJsrGM2GsgdhdwfTV7VjcQWolbx/LT2ffV2t3Y/5iCDzp/AdUvCEQqW9Y4N0afTm1CMlJfsy3U4CNd+WwK/aKROo2ah9aelJylmmuJwoDgE/aZkrVFpJyBYUVScQ9y46w2hiSRJBjCyE/G1n0f24ZGc5LmdhbsOM04V57MTmCKCgyAg9A1v9KTNOwq7FUMJ4GjFNUTRKiNj01I8c7PNu7URZiy2HIkXYrHVZKxJD3IcotyEMRzVXyIjjV5Mqk9YeiPQy8tstscIq7xPpMEvnV5pLeh1L7o/CjQs7weLBbgPHEh70s2RnSqxLmCzSmEw/FA+GNNUYQfB0yuJGwaed0uD+aU4gLhR7rVYC15eLNbtLMIhiBo8d19AZ8fsirzAM102Fi/e/Ol9YsdChIVpCZ8XMEBPLQSoGf7iPMcMJjnzl3x5W8duM5OJzCldFyOWUlx9KR2X+Q2fWuIpkKUpWmgKdlVdHX4eqqBjvTtcIlSDoTei0FutQaPnLPKdMEJQyJngDkqYJZ6Y8zVllN31kKAYfrmqMxysrXfRr1ZOE5Ayj3GmsguYiBi5GaScLylSfVKbC9WDR5lTtwixmfKybt/a5rKsd4pnvd8qnPnapCzLl5NytA1h3CoA8JTcWO2VbOe1mJajTjzrne2HYYdPgAGpiaUgYbavH9iyEmCyySMr8gZe5MlfmylyZ639x/Q2tx/dWQ+/HFAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-gruntfile.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADaElEQVRo3u1ZW2gTQRRdqyI+QRFfHwpC1S9BkIrFjyIoFKyIuszM1vgCWx8UKYptdqa6iB8Kot9Ff0TxgX4I/gh+iAgqtFQUFCyiRYTim9DE7G7E9U4ebZKmTbKzs7tCBi6bLLN3zpm5986dO4oisTmKMsXW8UFLxy+ctrbpSlDN6VRnpihutChSLUZ2WFGyhoMr1demeD0APpP+zdBFi2IHZHBUV7c2n0vxd0mqreC604QZ3m12ayuFgScMvMykuBcAxLNA8uWDyUiHYzRNy/U3mboa3o/AN99MnWzJ65syddRsU/IIfv/JgeOTwMHCu/4S+rk8t3vwBlfgTabVA5CvEyguGGTEiCzi31iU3Mh7HyvVn5NIgz+1fS78v1+BfsumWoM704GlBnPQwCwelxnklWOoC+D5vhwgMJFL0HcOJz5pX/AbGDcS18liT5wRlvrO5ODQL3j+rWBGnQlMclRMSp44qjrVU0cGmz5RIThh4avkGXDuyBBNDsAMv/SLAIz1mju3Y5CFQuBhJvaDQts/4OPkN/dB1wRAwVCA4HPyQ4TAQAgIfBYgQEjQBMD/jrgPnxDKQMm7AAm8dQyjTsiRQcntoAiYFF0RDqPlNzCp4fSe2A58MjI7YBOKJ/Q9S12BjxvqElDQF3wUIm+SXery6lMHyEdCEEKzvoCfunHeRFgI8GzAjfOeDw0BRq5V78AdzTMgCjwMHLyO7/Jg4i4KwXExm0Z/CgD8QJKRzZ5VF/iZttxBxCP5CZFnl/AOXNIvdBKVn/uQdmnllVSUbJQeMhnaKo8AJZvkRxy001uzgZQ6yXBTptSCtkk3IUr2ZSYLN9o62it2kGdaPSg1eSjLkEGt8k0IH8vuQ9f52GYUrXJPIFOVy83MUa7ch7jfBeN05qURvSJngY9FA/T7EEaLi2NDIgRSIUglkiIEhkNAYFjgNEZuhYDATfeFLao1VFHvlBRWXVamx9IHRAM8E5/2ZDNL35pQ/N1H8DGb4sPeXjMZLbNgJz7ux+HFMVrnScuHbIouSzz7XpWSRheuhFEHtnlBwsyfkw6+4FYREjzIV555AH7QpKQlsCtYfjNpM3yIJ3xVgO5L51U6WTvRdW1AZCB7ZfhsdmViY7Ecf4HnAxDd7sHrlP+l8cpG/j1yrdVardXauPYPvC5D3BscgJEAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-gulpfile.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC4ElEQVRo3tWaS2gTQRjHI75Qb+LVo3hRvHnwKOpBBEEUQTAoHqw3RVSwPnqoXoqKcXfSRFGKj+oqQqpEPFXazMwSAhowPlAvFUTaoKce1EP8f9tBbPGRZYd5LHzsZrNLvt98j5nvm+RyGY5OpzNPhrJXhGIoiqL5Od8OBVAGQEcE4vZo3+gC7yBIaR7wCkFIJoe9hGiUGksBwBNLhGKkWqgu9g5CXBPLofwrBTFE7uUdRD2sr4TynxJ3CuXunI8HFN9HADzkE62otcg7AEqnyEgtBbHTVyscV7Fwx0sAKL4hAWDivZeT23hhfJ2yAEHsoQzlZGrFBLYX7nIZE9gDKDsGeQOZ/qX8XAnEN8TFFK4/4J0X6p3HlHZxv78W1LaaBSjyjfjxCNL+q9LdyTsA3IJsMe3rlPM5WYEzfoJSKOV/jPRhWOcUzufhQpdwXcBzA3jmHD6fwej34LkduJeXgTxE7+NaQD6bBnj5h9H8AZnEaL7FOYZUIffUOVb3J9Vzs96l70wDPMnoOnPlmel8X9YJAAvcNW2B01otgHgxm4UY368TgGZwsy7E5CbNMZA3ClBjtdU6AeIg3mwUoDnQXKY1iIt8jY2F2xddAChNV9gAaGoC+G6lDFWLMR1zwISttf+gJgvUbVVfvVosEPCKLQvktVggECU7Rc1MTaAjBvqsAMSD8SpNMXDQjgtdFEs0xcB2m12IdmaIolhvE+B5VgBqS9oEGMkKYLUNibqAZQRo2+0PhfxopkKGyWGrAGR+GciTNJvSmqbLvD+VNLaYeESdO/v9UCZ2qT7RU8Bch4I3sMy4SQ1e2j9T1/eT7Sh8Vl25aWpoOdMT7Xb0Z8kVsdalXmklJcBXp7aikI2upgR47Vq3+kJKgDGnABCoZ1MCPHQN4IgXNcA/lhQHUtYA/W4BBGJbyhm4xykAtcV6DMp9/N/aB+4WUmMs5+LRKDUWJjs1M7suvytdpn6qzj+E/ARlGj8Ocyrt/gAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-haml.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADuElEQVRo3u1ZXUhUQRS+/RFFQUVQURSCaHtnXDUjsF58iH6I/qzol+ghinzooageKuihHuxB3bmzWwv9EAWRYEUPoVBghUFRSETYQyKZSLp7712rF8u8nVlHE7s/s7qzXmkHzsPe3TvzfTNnzvnOWUURHHGCVhkEn9I1VGdoqAOsH+yiMhGGQdR7ANaysZ5YZf5s3xMwCTrnQMAyqXrd9yQA6EsnAkkj6n6/E3jsSoCiI2Ndw7KUSQbFx3SKbsJ8e6zaXVPSRyCElupEPelC4tNoF4xfKVycoIEVALppxKY0ddXgBek+iedOJHQN70551y8ok1kgcNmYTrA16bvMGtrislhzyi4DYdjVNQfsZ08Y5aaFAF+0xfEUwmiDyDxfqkpnmBquFQBvsQiYVjeCS3bYeUH8zOv97jBaCKBei4CXkigtkjsdXOmr4ymE8GqXfFIIv2kXBG8ZERyUFFbxWZeQ+sg+m6PN8P13AeA/2M6bBJdLyws9VWgeX8gOQL8RCuARbncCnv/2BE9Rm7RdtzkF4gxGvT0QJsumwueooMs0fovmzc9Ydk5owRxYtM8BzC+TqMU6QU9E/T1OAmv9pFKT8VsAeP/gb83qojkZJ5DQ8ErhiPKvdUNtsWNADKIX4yn0GlMFD8CfxqoDi3hiZMGg3YqWTBunYgdvSgF8HwvBTAMNkyfXeBJ8MDJ6ZWTwXRRJTp/thBlk5llwIveHpIOGXpkUb2fzZoRAZ7RkJizc617woIeJSMFct3lidHkek+w8csHlxm/ZM+kEdILXee0+u+yplbBqMbz3gWVuNr/sS1zpTSCYM5qThRrjBryvmzSwTB4Bit4ISOJDY9igBrB6OXkA/FpI40BmZmJulJLlAHtfUrsFlwuAr+eNsD4gERHVOxCZ1htUvcSVb6ss/w97EiBoLz+pu/xZAtzuMmsU/HVDfBWAvmcE4ft9YBXM98EMMFOatAYgHz0JDEtOTConwQ+eCNQObnUxnEKXSdWtUsCzdoiA+/TaSQSWiaEmLmNkGEiX04vIbDceFHCfdwJu2OqkZs0wKpIZ/295V1j4jsBlrRsmq4f6QZCRd8pOYB0CJeIZsWweXGJqgW2spajTgtK0thVtdUtNMF9Mfaob/drsrRDS/bCzviTA/daLgOFL8Lwha3gT8O7SjctIhApKhPyfIOpX/z8tRkA96lcCDUIXGMKhLwmAsDruWUJCYvL1H3/Je+BWyFDUpkyEwS80k9TNcGljXAK3mBo6r2RHdmRHdvwX4w+sQGfsgGFU8gAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-haskell.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADAUlEQVRo3u1YXahMURS+/n8i5Sf/P0VRFCWRhOLFgySeeJEoeeHleuFh8iAPujFz9kwj4kHKuC9SI111mHvOOjPjRsmVUBTh4uafy3Uda2371tCcNXeaM2dPt71qdffufrPPWnt9a629d1OTESNGjBgxMljES3qtIMAP0Bu+7w/JZDLDwIJCIM6C89ocyJ/MT0UDuoOMc4W7l3CO5SxG3I8gHG7EJn1REN5OJgqfiqI4W+EOM7gXHemOCVocIJpAEq4yxl0jDBo4Asd3AqMgvNPaogApmIlGfGCM20W49nj7Upz3MlTaqM8JC3YzUXjvJJwZhMO8iDG4Z85ZZ7w+Kgm4HpjQlnuFMJ2ZzpE4v8dUJUtbFJy0MweN+BxoXBJ2yOqVzC/H+S8Gt05nb9jH7G43lV5FuWOMA08w6ccSLpfOTfcS3vpatDoqxfyhaIDNJGor4exz9micP2DyoUU6egYm4vg1g6uoVUfBjbvz8YdfmQa3XUbL8lbivC8A9xt1tYrW1kgdkB8VcIBZ9A1SZLJqcCcY3ENogTFqvUuROqCo5DALX5SGoYE4fhRIOcs7LnMhnpuCkXsbmQOyKiWdhbjAd6a0bpFVSeTXKMqUw/Wh4StKqHSzWq21wTUzu/OKklRR6RSDu5+NZ0fp6tBhOEB6NPrG9pdCPTVSqF97kUrLSqpXfSkkLzIC3EpJTA2LS+L/9C6datWxJauzjHYNsIyWi9oRGbV4fhbOP9azkX2r1MiQYquYRhakP92Uu0RRaU/oDoR4lOhi/nfbjtnDFZXaQnWAPcwJeDegw5yAx3R/wL8vmUvSof4GF9phDvk5N4zjNK6zVuXHZsbJHkjAosa70AhI/LMpwr3AYIGqXSNdKZ/awh5Xum7BKkxi88GCgw1zqUdjNpSlZsLdxjhN1W5BPZ9VsmE8qyDmMvONW1T9dD5sPa/0sCVfAbGKMb1lf9XGo3HTonxapCrGbMIXL+XNC/1xlxoOjothPO7SelTNmG+2EcY8uxsxYsSIkUErfwDWAFVGTy8nLwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-haxe.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADFElEQVRo3u1ZXW4TMRDOE5yCv3IaDhDFWwlaQIJS4LlVdh+4SNpQzpVlWfrEAcjPQ5eZjZPaXu96ZtYLEoolq4lS29/n+WY8Ho9Gh3Zo8do6VRWj367Syafq84uH0vVwLM6Bc3HWjkVATEQKnExglapf8LeMTaQH8IXGRLbAAr+vLo+PNlP1Br7fMAg1iAiAL6DPNql6+TtVj2psmfrBktBuoNmYhGoiROANwO66bB/AyUJaFloIe75Ok6vNdPJqeTF+HFpHr8F24hk3qqyyyfNNpt6Cub85hFiAPbhuJAQWfUIyWPDd3prZ5EOv8G7onxVGfXpkgL8z5rqTklhm42fic4DiBwTwvUjAmNd9DrIZb7HkfQt4MYl1lnzlELiV+gEBvIgE/H/hjC/bo8g2ZlsLksIcHTyLhE//INGzzhxlPVU/rQEQ+gKaP2OCJ5No6B+iUfVl/CAQy9VHe6HkagDwJBLw+5y8+x1WyAcCHyRh6Z+y+/fgkvMuP8AFI4FvJbG8VE/Zu7+3AjA1rWD6wQDgvSQg/zkV7b4D1PKDAcE3SJj6Z+2+ZYX7hCz/C+AtEnv9S3bfcdTqX3bR7v8XBBwJFb5Teqiu1+onIduJ1bwt1RgCfG8nboZRddqVL8UG3wijoASWFRoHGRwqoaQvJnjvQUbNYD2pREHNXGOB96YSgIlkhWYyt9X/UCTawGsC13ZESs7Du+9cakz9xybRBV5L+cQag1boKmF6LzSO/mORCIGv/SA9ftIYBwrhXCkLck2IQYIC3sD03a340S/1cKFmFbYIJDjgfX7AK6vAlY5dnesgwQXv9QMOAbxUS9IQHwkJ+NoP4DIlJVCMejSThBS8gSvnE2Dqfxc1dAowd+o5Bc6HkpRYFS9U/PI6Qf9oXq3RuacA1dVZhPBKyybgm9gAfO0Jb5Vbw8EsUt8pSiohfHMI+QGFQK1/rE5v2dcmzEm7q4GbeQt+1ul5SZ0D3wTwYWNHyFyf+siXs05XD3Bfml5nuk71jzI395EvKvBoRCITKLnAvc+u2+w3zkP3oR0av/0BfeQYbv3Q4sYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-html.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADlklEQVRo3u1aSWgUQRQdd3FHwV0RIgpKRNGLihBRohEVg3S6aibRCBpB3I0mXd0DfRBX8OByUlHxYERQ3AVFQRAVFS9qxBUjCOKGJpPuzIjtrzBCJtY3PdXdTh+moOhhqPm/33+//lI1kUh+5Ecwo0UnCZhOSGZCBsDbEAF4IwPgfmgAMHJPBsDF8DCgXpABcDQsAGydHJEAQHeGhgGD7MgagG2QTeFhgG7MngFGogidn+B5KYiZli0AQakEA2VzEYvcCTD33BXptBiZI8EAnYQAeBkggNdCnfFYYdbCmkxlKALge4AAmkQ6mxgdkrUwxyzqim0qx6zs6ffLO9UVvRF9v/i7yFrks0hos05GtV2X0uh0rxs4qZMbWNDwQukzkdBkPDq17TrLIEXBhVH6VBoAWOWW0CpMLckAGqcTgwKQ1OlNeQYMchoRurztukazYnCAiazOCwMHEAa2ZmxARenCN1sgDDB1vzwDjMQRwXv/jlqVA7xMzFgwDXkGDLpaXFzRE77nAJApdldS5SUKlSJWuep/ElOvIcZaIi00pZXNRAA8CgDAY5GulE5mSAu1a5WxCK0fbYPOl5/KeAHbH4QBw1AL5NO7GesXTI9LtUw9Zmf4PiUsW7Yt7isPIBLpBEJs30Ojoa7I0KMtG4Sstfg7eK0QGxA3muaYSp8/M2mQVa47rPaZXFMmIK3kOz9K3IfCzaWRWZkNkFrsmoE4meKylnrgB4AriPDSzHooVugWQIKVD2unQ0WOUy77AeC4mwQDbjQQvn/lAsCL9vU9lMzrkbXH/IjPuxHhTNxLqwVQ7K2BMuQ8rGmE33+Dz2f4HrFqyRgkC29H9sAuzwBsRreIiyyyr+MwrHTnhV6HOnT1sLiZUTd7BgCuUoFY56SPWfgCki/KfWAgOg9xoQZwlw22po6TidWtOQYaIfD/ap7ZkSxc7J0BCHlujr+B7kOgcCFvztGXrlH6Q4u4tNVlGHnfcS8QnewZQLOujMgy07bAJr7O/ZcnqLQBmG2Q2/D8mY2shEmGez/ugI2YqzNRp6qqm18HTl9zAOCLj7U6fZ4DAPV+HvnV/f87AXrK146p2YyNbK04mXoOO8P0eID1A55nk4yu5LoCvYJ11pX04MfvPBt7dK8nYOk9FiubzYNFzu6Uef0DYXNtunK1/nXfy2skftph1SijQ3lB7piLetlGdAGwczB911zPmeKMcebyfyHIj5CN32LNYkYJKfclAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-image.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABTUlEQVRo3u3ZSw6CMBAGYJZ6CxMv4gW8E17AhcUAKy/hXjdSb6FnYOVOS9Tgoy+S+VuazCRd2cT5+DMUQpYZanfYTeqmKGpZtGrdQetaynKWIerV/D3AwiDAVx6P+PwDSMJS5FAEGgBHhABAEaEAMERIAAQRGkCOiAEgRcQCmBBJAXSIaADT6QvvgQEMYAAD4j6PMSAlQCW3y1KKRZKAdbOeqj0XdfQfkwRU52L13kedAhxQnzZz9fut30ubAh7QiP3v/Z0yBSigG1z9IUWXAgzQD67+lHWl8HzWF3k0wOfgDk3h+0XFjoAA/gfXPwXNq6IVgQFoBtcnBX3zdgQ5wDy49hTszZsRpADX4JpS8GtejyAFuAeXavUIMoDv4FIj6ADeg0uLoAOMYDEgRUA7IkA7HBDuM6t7qV4GAwJ96HZe+a6HrpeMi4uLa5T1ANiJ0Ixs7X/1AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-imageunsupported.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABT0lEQVRo3u3ZQQ6CMBAFUJZ6CxMv4gW8gwloXGqKewp7VxzFA3gTPQMrdwrEIMaWFjO/pclMMitJnMfPCEgUaWqTZbNEyDIReVX3E9T3/SFbRIh6D/900BgE+MzjEf0vgCScygyKQAPgCBcAKMIVAIZwCYAgXAPIET4ApAhfAB0iKIAK4Q2gu/rCZ2AAAxjAAL/3YwwICRCncp2kxSpIwPF4nscivyVpfg0SsBW57I4lTgEO2J2KZf354wOgTQEOqM/+5ec3njAFKKBdXNVFijAFGKBbXN0fVYYU2nv9ur0BvhZ3ZApfDyoGBATws7gjUlA8Kg4iIADl4lqkoBzegCAHaBfXkMLg8AMIUoBxcTUpWA2vQZACjItL1T0EGcB6cYkRZADrxSVGkAGm0AwIEVBNCFD9AXD2mtWiZTka4OhFt/HMNzM0s0RcXFxck6wXzbX47roEUuUAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-indesign.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABjklEQVRo3u3Zv0sDMRQH8CIOgoNd3bqJCIK4OEhXO4iLm2uXrnVykrq4OFRoXmqnTo7i6hapyfed0KXg1P9AEO0gtIhalx5cK/4oSEnqe5Apee/yCUcu5FIpCYm/CxA6IPQ8b53vAD0Q+p63ngAEIAABTAGAiYusucCaC1A4H3ciTExxPhMXJw4wZZOO81hzYeyVVNiO803ZpAUggH8CeAAhcuRunHLZUABvjlw90tH6V8/1GXCfXOnQAE9MvPxpsiUza+pmzn+Axt5Q7SrWoHEFwstgTM5nQCtZN6JoE4RuMLsQa96P+/ql/gwI7aC2UavtxtCrE9p3gKucSdTMBQdo1BqLcZ9TLhscoFlrLsR9VtmV4ABW26Xkvg/CY2hnofxQXY3DsAAKt6NfXxDOQjuN5kfrc5UzruJ2WfNOMt9XQBcVbP3mTrZ10pr39TT6CoXj5K40GpGOVqFRBuF9stcqGhaE60Fr/zD+GYRLKByBcADCKQgXINzJvZAABCAAAQhAANMECPtHt4TE+PEBmXByHda8B9wAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-java.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFJUlEQVRo3u1ZaYgcRRQeHS/EA7xPRFRUFBUVvI1gEBWNqFlFdqe7dmaqarJxvRU1grvGK4jiRRQNSEBDQBIhSvSHJyJqPIlEiUHXM9mZ7lnNhtUYTcbvq6qe7d1M2BF2Jt2yDUV318z0fK/qve9973Um08YjEPryWl/fjpm0HoEvO0OhHkitAWFOnRH66u9qZ+9eqTSgKopnwoDakF86J50G+LpgDPDkJSmNAfU6DQj84mmpA1/x9fkEjzFc6+jYJVXgf88VjwTwX5wB81MFngEL0GXrOur74evUfumhTU/5AP6XW/n1VV+eUHeprsLRyAu3hUK/EXryykQBZ7YF4zzigHOUg251qgEu5Cmhr5dibkvoy4/DXPH4ZIFHgGLll0Tg6TZc7doFfTvhfp4Fjl3x1N34bjZR4Nf09u4aUaUbK4MudfD6QmEfAP7Aza2rdsuzk+nzvn4wBn7NYK50AGUDrj8ZBd9zeDLZxiueRJ0TcX3ZV0c5o5a6uU1Dnjo3uVnWU/fVV1/Ih41RSu2N+812Xr6TbJkQN8CT0zlXzuuTYy61OuGcL6ePMo+cEXF9zIAa8sA1iTWglsnsUPXVewaoUM9Gc7hfGzPi10TXAkE+f4iTDZuC/KxjnQK9Nb4LyLyPJ9uVfH0hAxfAl7vElsX9srp7eerL5GsgX82y7KO9GBuNuMy8PB3Vl6evBeBBJjNn1CrLUMpvID+y+P5Z7FrEBV/rg1boiwHqKazq+zgPYMVfpfYfx0x3lIvFA3HeiPHm+LZK6JUOdcb9MUrDasmAELu1TKxBaXbXV9RXX4F9bq4IfUzDSszIZmPg/LVK7V6PCwCnMg2EfDRSqszU+N6Qe+68Vvn3shirbLb3+gUCwfUcrHpP6OkuuEMpFOpO5IQF9Hu4xiJDs576ISY5VlZE8bxtJMQfW1dhWbn8NelyDEVOMGBIAGM/DHzdzyzduPDX/S01YIw7UeMLdZxb+SehgUTVU0UzhMxj1a82xTyKlkpHzx4T5pGcPh3P+tPFwfUtN2DYm70v3YBuEbHNRJUaExx9f6tYET0H1Qt/7DBJog1Uqe6Nl40YK6A6X8Z4hhkX90/geiFjANefRbnAxA4+X9fdvb9deTmNlZtTrQvb1nYhAATsW/8lDtz4hvSL317hDGWZuSISge3XQPBd+n0g1O2sBbCazyNYX7Rn7oK6n9TLZMXycjRg5Qxm63ju2C4q1FAnykYG7AQ5JJu49wPk/HgHAlz/mokBTz3ElcfcY7h+ifSJ+w34/Ducb2iGldqjeTqLh8U6Ds2OEfp+Tamd2+zrcppdTeoeNUJpjOKlg65hdb/+lKvcAPA/lB6IgecQI7ltFTX4fCa7dZMO3IgxC5xgQsqGoVzpROPTDSgPhc2evxUKR7Azwb4QE15TOUJIyf9glp7Uyg0P/Tnu50avCH0V37iwz9MMwDFtR7gdGYk1MnbwJjz3aZcHKobNsABRWTpJBsi5Y+Tu1oOibpDNLKpTMpJToG9DanzEOQdwMCbk4u7FBDiXnWssjmYDjNl40umSbgEWuajqyRupfVwbkV23b10m3jgOHMFuoIgzBgj1rs3Mup+vm/jWEjL8UvM8X72CUXW/+4n/1bJgNr1O20b8nO1xm7DMLs3B/D24votlpRV2+hYkuD7SKaW1k+Orxu+opWC5CNezWYK2hZWiLQfAxdiZL5ybDFjZ7FSlHVsMa9n51eadAHMFqrXAk5c1IwS3V6s927LScOqYOqaO/8fxL6s8ydgXpK+yAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-js.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC/UlEQVRo3u2ZS2gTQRjH1xc+EMQHqKhYRWqyM41CvPQmiuBJRPCuFxU86MWTiAFRQaWtOxNLClLxqCL4foAHtdYHakVEvEgFQbRxd2IUX0XX71uzcbPZ3aaSdCcwA8Mm880k/9/M981jR9N86W1H+1ST0YzFyaDFiC1FBi2oCbVpUQkrQIM+aYRX575ICKfn/xIXBdO3is5Ei2mkFsaZUQNqQU2oDTWGArhugw00yZIDUXKncIDSUCG1dACgydU3IgAOnWwAqEkBKAAFoAAUgAJQAApAATQYYLC3ZQru2d1sMbojqJ59ZvMEYdBN8H89lkGuwfOSyfXjBa6vjRWgcKJtpu8U9SygzlIoH4g4eV22jWWTpQSwcukZUPamhnPwRTuzeuKYA3zqILOiAAQj+3z2H5Cvg6vdhuev8qGKkfemQXTpAOB7v9ducrquLDJL1kPZT5ORUziSsbhQkSdmRwJw8spr97qJ44IstSTWIC7mWueMMAIPvHbByW6pptEAgIHKEdAP+gMWXOa8yJKVsgI89drzncn5UFYImXnuQfBusG1tnDwAnDyuEgOBC7YvYVMojMgtBJUCQBjkUVC9PE+0gv+f9U6dvjxUYHRV/ACMPIyqn+9KLXe2E8Ej8trOpSfFHAP0/iim3x4/BMZE3EHcH7iZy2jjgzXo3ZULHTnQMAAMRvDxLd6yj90rFvhfiVfYszQJZTcguI+EvGDeVrlO0GN1B3BeezNyzn0Vb/K29n+/Qff6AC54evcofB/22A6/y6WnufahLJmHC1/QQldXAMH1kz6Rv0t//LwqEA19e/n3DcIDAvUzlN+F5x3I33y2YcGTi+sOAD01Heq9rOFG5YV3X4+fYeRu1nojI5i+v2HTKPYM7tnDBdAnZpYuqgpemBbBdgjqfI8Q/9Uy6J7/XshGc8FRYGQNtGF4ioJ8Fd1EsORGPDJGtfvQRedCB+yEWaYXgK6U2p4WjO5CW1WH1XTB0exXTE1/ydf016wuRNNedKukkkoqjXn6A6/pQ0UHadl+AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-json.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACdElEQVRo3u1Zv2sUQRQOAaO1ClpqYxOMhNhpYZJK0wXuduYCIVoEG0GtvJk52MJC0MqgbUxpZarkbzBFTHtXnRByoFjdwf6IsL5vbgMnlz2Svd29HLyBD+5m3s/dmXnfYycmePAYzYhced1TYtE34pWvxOdAi+1Aib3AiJ++Fr/pf4fwN0bHztGalSFZ6EDXM3Ihqq5eyz/g9fVL5HQp1GKDAmgQoozRgG34gK/MAu+4pZuBkW/JQSuHoJPQgk/4Hir4UIlnZKw9wNERYYfwnmTXjrV8GNRW7npvxC1si8gtTVnQb8xhDTKQhU6sO+jBtBFDuuC1eJ5g1CdsekY8ilx3cviz5E7CFmzGtvt8IpZzG44PYp+x42r5QV7nDLZP84lYzm0s6bWOIgEgswTi1/zFU+X5zLYQ2YLNpC2UdQL/3xZa7IbG+UB4ag+xkjOeKd1GnYhePL5sgZpBc1izh5hkoQPds95ueSVQGDiBsUsg6RodBVJdowMKWeFIVcjOSCXyRnoqMfZkLqyJ2d5CZem0qTwJlfORHNRzCLoO2/DRS6cRA2JJcwsdUgPyldjk1VMrKBgmNSO2odHOp0A530jnO6FJh+5XvPVOGpp2PNe0MiQLHV/Ll7aiJzQ08I0YEMsw1+gfMvIuqMnporo9+LI+4TvjOrCPJw5KAJ6fXXtamgprzj16K68D7fwoqpCFhAM6bFvWsXGW0SPTlXffrzp3OkreiNy1KwB+Yw5rkIFsV0duWRtdW1yJOQHmQsyFmAtdKC5Umbs4XKgyN+5cqMVciLkQcyFOgLkQcyHmQmP3ka/vM+sIuFB+340L4EI8eBQw/gFrZAW0ZjSseAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-jsp.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADeklEQVRo3u2aa4gNURzA11veUd6kiCIiviBFtB75YPNBRFLYkrx9IGo/yGtr6c5jbXZbmw+4iiyWIlO3OWfmrittWSvPUEpeeWxLZPyPRt29zt/OzDnHnQ936t+t6cz/P7/zP//HOXOLigpX4VJzUYO2gngxkdYoAM9iBPA0PIBO0zECcMMDmPRyjADqoyyhmhgBVEcBOBQbAJ0eDA3gGM72GAFsixIDq3jKiEHewO8VFeLr5kGsDO8B01mAKCOqag943UE8MD+0Mtd0pyAAjxQWzydcmxqdHFpZo9E4FAH4qBDgC8+me9wdElqZVWZ1xYLKqrV6yn75pvKm3oi9n+xdos7IW55S8M6o7HFEJzMlBPFNLGmIuPQ+16WmO71d8GnOXIUptDk6gEktnlLIUIuzx9m6PUkVAGSmWyIeOIcArG23hCrJYFUAsITOigBoiFt3Z49LJpNdWLApAdBJQgRgP6K4/K+sdcwaICLYZAHAPhGAUgSgTkENqOPaMunG6Ep1WoIAXJMOYNLrCMCy6L2J5sxGAO4o8MBdxNYsEaXjEKWvQRZFFdu0J3BsveLGQIKMjQzgJtx+StKjSfdk2/HKvM5w/ztvrF1j940M4HleJ1DyVXpqNMm6bDtpPT0IGdvG3kFobUIhecGdGc2eYRlWnz8C4zYErq45ldw94U5E6s1zGcGV4QKY9pwc0OLAXqik0wL2UrdlADQgs1PSbhxsOoICpKpSw3J2YiuQPuiqOIBOTwUpMLSaDoR7jwMAPMzt76HabkH6oFphAFByhDs7urOXOx7SHjyzCV7qEoz7DPIB5DyLEafSGYPYOIDYOCwDYCcykxUdPducbO7OGr0ObZjkJBLsO8QBdLIGWZ+nJVbheiTdrhZXrtGFyPpk6XUr5PDxUXI1e8bfCO3yKzvPRrE4AKS8IMff4BEDAn4p25xjujJVmf5EI8v9JfMywGZmqgyAESH3sN/g9wZbv78LFEwAC3i4lwL5EUYXFMvhwgAsEPN1Jgoe6yYryN7n4UD3ncxe/UEePNAiDYCdDPxvAIihM1J3TLA3GOl3nBexM0xB+QRyAQJ+PbOl9BNsQ6Khh3/8XiG4vO5B/3TUNux5LFnk7Zsy63/gZTb7nWvbv773+j1SqV1lj47lB3JIfb2gwi6BLKL735pbmKeYx5jnCn8hKFwxu34BI6/SjC6B9VMAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-jsx.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADZElEQVRo3u1ZS2gTYRCOj1Z8IqLiA0V81YOKD1AvFr14UfRU6kWpTTeJhdbXxQfBoBV8FIVizMMm1Z5KDvUkHutBinZ3k1RNVYIgqIcWBVFpUapxpvv/2elmk7amSbbwD3xkd//ZP/P9/8z8y4zNZpCqSGSGI6CcA/QB/gBSJcZfQNIRkC81tCRn2XKJx9M1ExSfWMBoU0hBpasqkijPSoCtPH/hHZC56QioTaUEGH0dbHmt26VezEWgjym+BcyxWUTQdcCeGLMtmYsA83n1hs1iAna5eUzkUuLb1GRBAue5fYKAICAICAKCgCAgCAgCgoAgIAgIAv9NwOWTt0tB9RCiNhRdYRyvu69uxSoC4A7M1whYbnwfntUhQHeniR27+fjJe3LFpBMAwzr0SoF8VC/JJMphLGxSURhyBlQH+Z91gN9s7D2gjI+dud09G+4/s7HvgMVFI6BVMbKXRZx++QjXdfoVr/5caeDPpaBygdhxuSAuZEZAW33lJzVKcwVtR+C+k7pSvbdnGdEfqA09m29v7V4E19/4s3pvYl7RCLh8sTVktb+klVOpaeDne/E3cx6s/aTfuQJoJkWsUwULYjMCx9p75xK/Rnexmxk9ut7zfAGSZe/gbgyx6w/GMmKRYkBtH+33sgzjh3MRAdc6m1lCVGsKmkazEXD5epeyrGIM4PgIkexVt49E943Hk5peEgIoJ8LRJWwnhk2IuDPPlBHSP4jOALpWyQhwgQNoLczjB51ftFQuBV9sNMx1N5OofK3kBEi6XEWKxohGPmZvVdeTwP8E6GfXgy5ffOWkEMD8jqco9g6I3iM926jVPF0iGUh/LcagxWIxSY9XyTwRkrWOw8I4iQ2hvAk4/dFKDCq2rR1Of2wDBiNJdynI8XvYCfqQrPIDwBbAanagDZIMI7HvoV1p4wOKgqRZd+gVez4MOpvzJKBWj9E1eclXGz+64P7rGPr9NW2xhWxXnuqrH60kNhwgu/U4bxeC69P0gCLA1LeJvi8Fe7ZhGyiL8Zhed7D/OUg+OTpNYoy2ufZPhIBpg0PLKIpbcxM5jG5hlup4LMDW78MPO9BrA9xiblemH16ynX02NOPcJhmsgo9jbEykwWHlFlN8PC0myzX5WAYbX5NvyrdZtbw/hRvdQoQIEVJ0+QcnogEhzZEa0wAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-julia.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADJklEQVRo3u1ZTWgTQRSuP6D4/39SEO1BryJ4Ec96UBE8ingQ9KBWvUiFakCLggVLurutWhX0lnqUglBdSTKzyVrEeGhBENGLUNE2pv4F2/V7aQoBt7M/M2ZX2IHHQpL95nszL+99b6alJRnJiM/IZDILmMYOcoM/4Dp/A5uEVWAjlmbdw3Ovk3Lmx5I8iO8hojDHw17me/I7Y0UepE7BpnyQn7UqM9iRuJA/GoB4o01bhnUgUvI5I7cFRL6HdIDsC+tlGyJzwNKthxLkZ607EvLmTXMVxbICByYG04OLmh/7Gj+kgHzNKIM1P3w066IqB2AnonDgurIdMNiFKNJnx3+9A0xnh1U5UNALu5vuwPCt4XWY/Ld0+Ojsg5kyF0ZVhQekd8Dg7VEWsu0ytYBWn/fzNZHKCeiZ0yEdqCKT7YqHoDP4paDVF7u3P1aSmpQlqvN7H+SzLM22xrYjgyP7QDJTi++Z/8dP6s6w4rcRMjsiJUjtYOlGaanjOPOUYwPzn4g6q9fajFLfiVUcbcj7Vaz0K0qB2XR2fej/Tg/fhp3pAt7rhmxGz1Ltc3wfXi7fNxcDqN+zVdT4LzyvUfj4xS6kCyuwKHeoK/Pq2uh39PtA5PHCRmq+A2aW51SdvbBt3d5U380g2KPEyRd5ikO88CJkbh8SHZvk7+aX+zy5cLMRet+PPOiWlAcdAuw+Sew+scJEg12PaZlJyqZuLnMh36pA/NH7raKK2q5CHiNDnfxrcWYymYrmp1PU5xYVafwnLjtgK8K2RfFfVjTJOxfsr4qwKyIHppRss84+uWCraj+nRQ6MK5rkrQv2hCLsssgBpmiSxy7YXBE2F3VY55RkId065oJ9WYkDGj8rOqxdLXlYSxN8Jh01h4SQPYr8RkeaXo3JFclJ2gQ73CWZHFK+mhIUNDPkJAM+FK4dMiyf+b6eqp35aPxpwOr7yE1CzHGeFNSJoaJWXBv8wk5nVynuPMDHQf580F6jfrZa8cCepLCRuhis3wO0ASiH5xjsB+wjrQpIHMeKLgmLTfKYdBOFLBW/OvZYrfHX2Blgr0zufpORjGTEe/wByG8noV4jhDcAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-kotlin.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD2ElEQVRo3u1ZWUhUURieFm2DohWM6iGCgpaHeqke6qWSogiqCVoMTcfRREgofIkY6CVfIix1xtGMFpJpg7KVwvRh1LlzJA2jMIUWbHnQArNpwen7xxm5Tnece8+5Rw3mwOHAPff+5//+8+/XYkmMxJA/bOUs3Vbub8p2+fsGpuLFut8s+laPZwLO2JvtYpWgW4PptjuVnQ5HcLwQ4bzzTbPB7B0QDGpNgLqOdYbIGfh+C+YL7TMUb25p60wR4rdjMa865DIn7WUQwL349P2P6IY41EbZrYN4aOK6t+mlm1nhnQVVOYfvfuulDyEVGAZgd/qf6gfgv6tD4klg/CjWbv2MD87nPFf80cABncMLg+3AO685GI/MXzwAvho44EMMGitx/U8EGI/MgEwAXbCXNPW3OWUt88C4C3t/TGCeZqMMAH3wIqfSLrVMi3yTX9w+CfZQiL1vJjE+YGMulm0yAHYN66Kheq7sIVswk/GIg+AKaFoAKBrbyn3r1e9ludkaHFJvNuPhWcoVAzQAvIcnOWgJBsdF9g9XNs/H84uY/RIYb4VdbbIIhngC8B3G6MA6NfK84Ix3Cm7iJJ71SmD8M+k7t9SjAllJlrtxweADSB8J1wEc8k4C4wHYVVF+ceN0Kdmo3dm8jlyZHD1nN3JLlcVSGCdPAxWqlmSgDILZIK0GoAQKh/yQwHgX1RdqhyAJAHtmMuP/BL7/BQC52atHSnwLR7SMNAMAPFkDAt1aNV0yWCoZMyvYkrEM4C1Si31qPScXSa4Sez/D73wCuFVjDUAvpH6Cgl2EjsNROxEOwY69Lxrv90SnJqMFoB+MV2FNiUrwNscu2NXGzVJHEYBSh3V1lJ4vpSzSSMVFbZWRBtBBhX90wQ7Gzxor2FW3yJP3cwBAscKOU/GiNlCVh+kQ9FyFsgCgPGROKheHGijLo3RblX6k6ND7ePlRkXCkVgNABH2cU6asiOobbcXeS62iO6xKDYJxxC2UVocBvIJxbR/KuG85mHsYr2tAKQN11URAUOvS6mlL5kyhQy4wSaUac6jEi9Fp0Gx7kJ1gzyOsTmKd47ZkSOJYnC5FYLjOM6mDSC6FW9/IeQtsFwi8EW48hao5/2mRokd2JA7oE0ioZ8QDop2nGjNSzHQb+Fli4+hkdPLcgM9A+7vOoHCslD4YAFDD44UOGTjAyvHbKnWgbaMnOnPWzpDsAx3SvynY7eiJQ7+a24VmXGieC1W6P0zeckvoH9ZgC17b01FvSp1zCfSFlMywTQTIuClNCLUaTRrpVbWTQS8DdK/QfzPMMuHWYmIkRmIkxoiMv0a0euo/fzZyAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-less.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADm0lEQVRo3u1YW0iUQRS2sptFFyK6Uj30Uj1E0UNEt4eIoHoosKiIvK3rBaGoByMquxF0BUtdXTPp8rIkRVFRJFsQtvn//2qmFRkUZYnQjbKgULfv+M/fzj/N7q+7vShz4LCzM2fOzDfnzDdnNyFBiRIlSpQo6Q9SUBAamFmqh8KqVfQpAHmFzUPtAPTKPgVgx6ma4dh0R58FQIJNBxQABUABcAaQU1Q70e0xUl1l+iG3Rz+A9kbYj47m21VWOyez1MgFPR+BbT7mrHd7grOTfU1DJPuY5vZo6eQf7b1ob8oq0eZtvfBkRFwAcoqaRqK/GPpboFzSdug2cU7aueBkgKyW2FvakVoRHM/WTwLAi/jsjGDbhYNYFhOAlPN1Y9AXjLIRS0+E5/iH4Xujg/1bbv2rDrZdUSMdDQBOpkpwVm+mg3EG7Y/8GNJjrZk2eg7fj+/XoLvMfmM/9Bb6L7O1FwuVQA3sdqOdzT59sK+NKYUyvMZCwfmxhFBogDVOKYD+Z9z4bdOfcYXreyBdlPkxAf1d44PsbvBr9goA2l6uv5HqJnEuTn0VZ/OZReAmB+Cew9pHufktyT7foP/GQpSnXBqclM3NPft4HB+l9HJjJj4PiveD7pKcpYwNQpSr0suD0+MGQJdG2ATl+wuJNtvz3ViT4Q1MRfvbv2yllRKF8mtTymDspchQBAS2S2MGwE4y1Fslnmc+V0I/ye20qqyS+incXZuF/lcyW0T+IYDM7TWArJK6GT2MgE3B14vCpXpgFDawD/1fJJt7TenH7WEwgLn5tOX0e1QQMgCMyztsDBSjmG+JcZg2Ipxuoez3CR7APIy3Crb+HgHgnZqcb6WG/ijekoXRbj23sTdR9pQkPHCRHzMMGNxJXw/32ziaLmhKvCCohuJ8fnVI7WQ7w0VgJ/YycjlnbKdQsjKijRvrxAaK6PWkS8hOdD4LeSVHjVsIvKtMW0F1lPUYMWJ4yvkL4AIvwfzjdPmpWOQ2P8n+nujtEd8ILJQmYQqNOdrcUwaymIWiKIT+p6xQY8DFN+OX8BPXUm/EUBEyGNwRnF/iTnSdWPfIAWjLGeg2Z7rVb8jWjaAN2cUNYx3+XvEnUo4zhy3Qnfw4HqcJONk9SI37HL/T6bZSqKlQo7RjAFbD9jQxB6PQH1TnQJ+j7y7WcVllCehxgRmF7qi9Y+X5e7PG6l4r3/H3QGz/J/kTZbWREiVKlChRokSJEiX9X/4A6WCAtIrNQosAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-license.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA30lEQVRo3u2ZwQ2DMAxFOXaMjsIkJUN1kwRxpKN0hixAQ0XbBKWHEjsF6X3JB0Cy/jOJD3bTICQnM46nztpr55wPMZXExbm7GYZzkj88z+9Lcz/9BZ+z3wRgMT9JRQwhaP4TwW8KIFD5LIS1rbj55U+sAd4fi49jpuK5Y7VFX31KArwg4pwS5qsCVM8JAABKAL+2t3/lBGC3AFxiAOhCANCFAKALcYnpQlxiAAAAoAKAV5hfaoZXnU6rx3o6Lbkf0K58dj8guixRnE7X2/hEEIczH0OYvr8d0jxCCCGkrQefUf/K/yHMFAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-liquid.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFL0lEQVRo3u1ZaYgcRRRe7/vCiLcoqBhUMFEUbwRFxTOieAsiEhBFgwq6Ks4PRTSwSbqqpqd7slmNirCKARWNyboj7k53zxCPXY1iookXYkIUjySu627G79VUwuxO1XTtdE92hW149Ewf1d+rd9T3XrW1pXh4q7wjvZB1eAH/1gv5KGTQD8R5bf+HIxeIKwD4d8hfkCW5kD+J82bIH/j9ih/wOZVKZZcpCd4PnUsBdNiL+Kf5aOHhXYUFBwP027hWUUKKbfMC9k5H0LHPlALf2c+OArhfvVCsIfBLB+bvh9+f4Nq/XiDuJ9D4PeCG7PyqNZg/pRQAqCxkixu6x8v/Ec/RrOdCcYO0TsAfJ2W6u7t3ywXsHrKEKItjpwR4AiJdJ+TP0v98KGZWXYXzHe4V8VtIIV7ihyLIZ6jgLnuReAzWOV0UxP6TF7ghEwDzG/m8mv0FNNtQ7Igdz0TiRhUHPZChmrhoh4vNRdb6kNxuEny/8wAJKOIv1LjTl37IC17/ouP8iD1I4NSMV8YLlH8AVnhY/e9FFrs1F/HL8Hu2EzkHtn721cz6RXGGdJUSPxn/RyBbdYDrFIjY3Qj2p3X3MAnOTghe8TK5D87P4LzaBvQYCdhNmPX5euX48paAlpmkyC/ChxdS5pkw6DGzzK70Q+Ea7n+T7kIFN6H8jYE3JgFdK/mSc6Gyou7+CDLWHmnm+oG0gG8XN3BmIYiXGS2EmEoFPPEXDPh32grkokUnwQIrjc+UslelogDRA0tQP2EB82T6pPwOGlENUva59nkwV7hlaA5y/lBa7nNODPBNAHpXppDZ3Uyx69+T60jAv2igAE8ngBUV0ItYQ4tW4/fFfbp3M5XMrjh/1yDNvp+OBYiz6D/y5+JAnGhhwV7Nu5vVvU0NLLsuJQWq7FJj4kfj3l3ykXOYgUr8ohQYaqDAaPfqzJ4pUAa+XDP40Hi+gkXpdlzfIIsX+LYkeuBJpoWK8rzFan1KGkH8tWbwXi2xs0+jnxGDjV2tA351IvAq0IY0THJMVUXWsCVxiqz15yPnmPhnxbwUugyagREXdc8G7HpbfiTdEu5h8Ww2mf8X+bmGgXt0z7tF9zSZWuOBvZErsbMsLLAymQUCdpth8GFyAYPVqGz8Kgbci0jPl1gouj5pALcb3YBowCpv3wa18g9mYIyh6L/GQoFR511nryQ1rx/zgbdMH8AMX9AgPT5HJaQV7Q7FzAQNK77C4iN92b7sIQYLGlyJPYF1417LwufaJC601jI1vmd4/zUtKFnwi3lWY6PwT7IGDGsJHHXd6unxDEPbpT5+qMEViafsLCDcphRwA/dow+o4h1ofkI9rrm/QxQLWi05DArgZE/G8pXV7mmWhuiAcJtpQU6nNJl/Ol9gJBhcaNFVbJuto5PsmSRy7Q0MBVthb0DnbzHGyFyMOXrJUYFtXoWvvJlKo7O+PH6wMXz/IsmtnbATko+yZGP9Na+5U5qc2kULFYlMVRjPYYOZnxWUv6jhYpujt3Om6JnZc+AcxAxepqPEDdjltI1E7XbXa/4kDJPcUIh5YWyBijzTBg+Q+V6UVouj3oH0bknvNZKFlWPJ/boUC1KKkmncC7/Qm6gupDbx2rAGvy3IwmQJbVYqdSJvyx3Q708hEFMjUfIIsVc2rEUswG5UCNhXcWjl+IOa2vN1Ou48y91NXrtrJKBtakuuUC42/vkVuiICpEoGjjsak76FRt46qND/id1a3n+SOTZ8K4vWQV6kFSetCqt3o6WP6mD6mj512/AclzJLdSMFWAwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-lisp.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADkklEQVRo3u1ZS2gTURQd//gBRVDBz0IQF34WguBCEVFEcKFuogs7b16azH2hkoW6UXQRVCqIuHAlCIIiKv5q3Qm1qPhBEMXPymLxR1szM7H1g7Vq633pjCQzL8m8mSREmAuXJDPc13veu/fce18VJZJIIonkv5ERRRljUbbR0vQLpgbvUf+gjtRBv6A+NDV9/0AiMTOQ85+SyTm4yK06OVxOzSxlm6Wct+ItC0wCbxvAeUd/mxrb4C9s1mXG49E9biDnHf34IbZ7ckUABtX1BnQ+r5bGEorR3DwXf7RzRLjTV3rj8VlF4aPBM4Fxv0lZGpN5aU5NLaupUlhuUYihH288flD9hoJfOl0vbjrOczAi5DkttbreDJhtSiwajf0iX15zAMNuynKMTBVWeQGwR5X+GAeeJakVhspWllSiL5YFYWjw3J0Hiig8HIMcgTXCYxMlO8AEfL8L9aVEHHf0AEzxRSax2EQEYLjsX1QFQJ5mNXgaKBkp7KvoPN8cop/02BI4FxoADxfcme7gbKKfdTvcp6Zm47sDnFwMTb+Pn71CFsKuIDQAfHY5FB0S0ArDxCJsDz4fqGzHbvPWJhQATnPlqyUMllHTIHAo74TdZ+Gzqz6B/+JE4OxgYAAGhYzAfpDvKo9bGYZBdjvo0/lBrD/bC0MgMAC7ALpptlWWHnlBFNC56ETbrDhb4kIeCkCnIDa3SgMgcEzsNDuPSbwlq7G1OYDpJY4uFABRAh+RPwG46+1z4LjP2AuRAxrsFecAa0JGGScR/0/c6/AereYArJ3J+ZwRSsTsUL5yEniAXH+4X00ulAHgq1UOC8A+hRN+qY8DGclkxvoBkI21TKsLgK50ehL25fckiteZhgIwWvrVqfag728QIWxHQwH417Mj3WFxu1SqdynQV3UBwMu1gN4u+mp/sRLnCxSFOyIQfECpOYDRgb64v5e90vhM6Qy0++qhSSxQ1QLgLuFDvCssHitZK08+S9U3BRkH+RTnbYUhVi0AfYI4p9WaZfnEhWtanrkah/UCKj5dfDrQ7XSpfgC0CcLoOwch21GKZmMsZNcE638rrNT25UGH/a6Lz+L+j5fCtjJs8QM1l79GCaal7k7bS829vne+6MJW0EzVUH8GuZEofwokNQ8XflcXAASO1uTiiIOQbAnkrwIpnJLpUgPd/9s50Waz03BIp7l9FmnyuhlPro/+wxJJJJFEEkkkLvkLr9DexxdYz7gAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-lock.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABgklEQVRo3u2YsU7DMBCGs4EEbwBTX4QXQDAxodgWqh1ASmFi6F4xMVSKxELfJG+CBBIDcomzpCttuYRUqorTppFx0ugs/UNT+/J/zt3JsuMYHOOrm44ioq+oCEESNM0ls2fwXzrHadqIL7vHYG6Um51v0DSbS66PGmFeEe8cTE1KGF/VJKL8rF7zVPRAswrmF0rX9urc+bkBzax/iSzn16fNp6L8OSb8TjHPh98B6GNdOlmtibxgi8wMpeserK55Z2wf1j0WFTp8hRcr5rNWWWSC8NNN6yOXn8Dcb113stJi8z6v2/mgdAwmBtoYENtG5wk1Lx9/Xdwelo3x6vt7ERVvmjihDQBpIn8jxp80ANIGgC7/H7YGoJ7Q1YENgD+5GzNxv3UcxpkuFgIgAAIgwNLZ5fcQlhg6dVZR+u4g9VJlp4MajVc+piwDJA0CSIzkupUiK/CAAK0E+G8wBGg9ABYxAmARIwDWAAJgF0IA7EJYxAjQ2luJ3b4X2vmbORw4yo0f5nMUBYpaZIYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-log.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAx0lEQVRo3u3ZsQ2DMBCFYZcZI6NRUKSMRAawMwMDZgYWIEGiSBEEifyeDfmfdDX3HT65cAgLaWI8tV3q2+4+vGoU1eNyjeegyNz8aCgNQjx5PeL9A5I/fEtRilAD5AgHQIpwAWQIJ0CCcAOyI0oAsiJKAZYQuwJ8QmQD5Lp95UMEUCvAugcAjghQnHUAfwVgiQFUchNvaQ7AIQEsMYCCOwAAAEsMAAAAJ8D5yLdWww8A2zPrhkr91wDTQ/fq5Kcepl4CIYRUmSdS+7Cq3q00IwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-lsl.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFF0lEQVRo3u1Ze4hUVRifskQxeqKW0Zui1AKRTCnLoqjU7b2+HUc3V9L6o+gFBS0iPQmilxUJPUBsrXVnzjnX2V11lKIHrAYhpUUagWyKJq2Fr3L7vtkzl9/55t6Zpe4ZFPbAgeF8Z+79/c753jeVSnhMKhROyWj9wTytu+cZ83zqRBsZpRYS+J7STBtz93EHsr65ecAsrc+KkqW1fl0QeK5sU0/PSXRL9Wml7q05+PlBMJSAbbUAdaZQGIRyWlvmECBCZSSVehnki2utIk0IkGajAPeYkK+Uz6C1fSEBpdbXlAAZ5ksOQGM+dAgakxHyNpTPDoLTBcFPakqATuwBAWC7ON27hLxTELxayF+prQ20tl4gABxryOfPBoI3CPlO5wCMmYpyMuZHytxwEIwnRzHQnxppvcsBodRkMPKRgsABoYJL4txsU1PTybS2ycqyPgm0CE+zFFTkXEGgB09T2lA6CMbAc8eC7LA/O9D6KQGyHWLEQElgTj5/HhBc5RBoaTkHZE+Aan3t05VOEiD/4OuHk9yP8rm53CWhTKmvQPaXc7NKBeBeX/AZiU+jl/wj7OBKIPCtQzAILgMV+hVkP6Dxsr2EpLW+3W88ECCJwD1xNkKyy0H2J8hWg/eaAOtH5ra1DaltQFPqSdDlV6Nup7Gz81QR5J4FYs+A7Ev/AU3rm4UdvA+n+TDK2LXyOp3qMEGsDgi0AzH/abg9zQMA6HMAM8UxYq1H2yB2heOBlLowKj8iDzQxUbAMICp95mADKrQ7XM/lRjlAs9lris8x5jpY/z1UubVrL4b139CjJWWwR3hiwLLrDyHQxo6OM6yqDIkKVmQbd4SnbMzGkIDW94H6LPfhcfYCoCnhzZB/d3Q6l7sWfPpukI21hj8zqk7AGoLWb/VB4GfQz1Yh+xFObyasN9v1/SX1I1LzgVRDRADby/HAB4HN8OKjTvZJJaNd/5t1H4LdYE69MQpz2kD7OrhGyKxZcyY8v8ue/gpfNcB6kQJPdOpbykbJVd4S9V8myyR4InFxQF3e1Mf6/M/i/HeZxyJPYwPZNyLqhuk150O8h0jdVCRpzEWUblzvM2itqEig9xbqSPZFBOBq8zsic5vfQt6Y1+LyHtulWPcfgDuTbyRx/w83sFTkMPcXiZHbFNlltXmM83xrU11S7s2I6eGPixRgOkdX+n0I1vdxDsR9nhjwR0s6T/vGcUpOAe5OrpnFvgYfBBrFSS1mNYI0YguBOt+C+yiGwI6SvbC/L1VcD2azw5EE/X9b8jag9QxZAxcLcGMe5cxR+PStcSpEMWMR7Z9Gvw9iOSl7SZR7XZV0CTlZEHivwm391FebWKD1pVGNAHr+nKQD2bhK3TZxW/k+EjiMfVUsUbk9mewNkIqwB4GXH6wQVRv6SGA1ph2Vml3JGDIZqgCwLGqfbU5tqAK+26mTjblR2MpUH/mQ7DofKqXJkV0LpT6NAf89NrPsrX0clywmV0JSsSJyfJ57uBcaq3pBMJ7U4UX+5MSRlk+WP46Im00L9dT+Ugqt66OMkfudEli1wapGpJ6W/SVur/hupyyPUY2d/PGjWP9SsKrQFBtcjAXlNsXG+5b//npvJH23ipFyh6HAHz8I6Jv0+21boXWK9MNxzV5b6hHBrY7D/v/NQkuBsabgsZ9pv9i0C0Psy2TdX8cNstTxMBZksyM4pyE9focLGwL2S/Fjd6/KdNuErUDzDdo3i+uIVP/oH/2jf5zw41/hD8bpAZ+qrgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-lua.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEyklEQVRo3u1ZWWgUQRBdT7xvRVTEK4gX3rd+KB6gX4oRjEdiTLKJFwh+iciieB8fomY3URMjouRDjfeZRLwzPbuJEI1oRBTBDxVU8EON66vMDM52Zmd6Z2ZXlDQUu1vbR1X1q+rqao/HzRYON8kKsHOgGq+fXdPYWQF5N3i1mXnsRvqxYC+Rebz+4OTMPDnT65eWrD5c0dPjelOEnQgqBK3/IyxbD0olATRedq40HIKsyApI25OLq1uqvKlQsgD9xumn9fpDSRgvg8I6+g7lt/l84aauyY9Ju4G+kVUz8uWZsY7HmLE0VhVwIvFWHX3QBd/fcsLraasjoVcfrm6Hhadrv2lBp4bIyH/cn3aTvpOVTYSv34ns3KoethbKzKsYhgmeeQOMaQu63eArFRYKhOEXi+1CZiswexafHS1glQqs7wGdRP/b+LxF34lHfrDm0OOuJuOrrRWQ0m07rZHlk4uLm2HS5RDwDhaosxIA9BOWLsdnCu+UmOOMtQIV42NxtCGwYh4GtjCGlTwX/1UJCB2NglB+lm4Hppn1hywPheGbfuxee8I8rFXCD1KszvY7EJyzKttFc6qOvDFKv9c5R6QBwtZHfB6JQaVpBaFOvGJY5LJDob+CnoM+63iXaG7tjMDvU8ruyvex3hYz3xNuZCVMeMWB4G8BuwU+X1lzbT449jzwX2pKaDvh9JAaaLwrbK8D4d9l51b2NoletWq/nfz/aQVlrYTDJ3k5RRM+ZwFvjjOcy0stjDZf13+G/j9KRVT+GBHrI7eRbzaEDqt0oABCJ2tjDU/2RekvSQ1DLCul3ElgB+TFFM4ioUOJmCOn/SAI3dpoJy6CytDs3FA/uz5x16ECdVqEib4D1S0pOfwzJhIFQo2cheetPB7sLnjCmpI3IGdZGCmZG/Mj58iTzpG+UNmbwrvZJNeh+SaOl+rSgfURB9HgKOv2pShlMCYlEt5sF/zgopkCL0hgF0MnT5/goF7tUFpeVNUWWE/D7/dRUocdkQpI6XTbM0tnixCyRnNKnXJRAY1+KcpYQrNQL8uqo/Ig8DJivAewsjgoIEg2HPmfVgD4PI6TeFQCICRKhVx6P5My5L/pxLGFXmMnfmoGlxsYtDlOYdQOpUQaU14GWPmjKkBhLUqmWPcXhG9wkDmpFpT/MxEIidsiuhFxCd7SRCvAJ3Nqur1PxNpFvPaU2mJwKHEKGKXTVJ5h+SKZJ9U76/jbE3ZmdgJ3YAZfEQTvDV9HNakMh5LicKW0FTp1hm3h0qVeuhpHxy3hobPhwIPWdi8xI6g0yJdV1h181CE+SsglBJXI5K2+Wv0K8X+hrUo0nXoQ9gJvFaUc4h6cCDZGtX8crOepXmp0PsVSWizQHiUMQi45dtCB8LLZ2wKdvFQVd+1FxqguqYbYFDVrFSzuUoVBWmJkdeJZ3Z9t+oTkoy3lfYJPO5QKBr2JKeeJQqyQYEKKmqUHNDdBlq62ritAcFLr96E4PnCcJr+jteIxf32y5/YTE10TNYPQ5Z6PRHFraoj7SqFWX+OPIUyP0T3yTfMkvMFqSPomQIgTwO0Gna+spUoDoscUfVVNfcXZrtWesJOTKMIJ1TsT2dR3tBpKvnS8HcptT7qakf+oj6exNbbG1tj+m/YbeEXLCyXBdRMAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-markdown.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABwElEQVRo3mNgGAWjYBSMggEHycWNsSnFTTeA+P8QwTdBbkZ2/P+hiFOLG6MZhljIo+MrDEPY8SD8fah74Mfw9QCuEiuluHkBfkObF+DWS6pdNPBAWkMDV2px01XspULTVZD8oPYACCQWN2ilFDV9RdED5IPE8ekbNB4AgdSipgSU0AfyCekZVB5AzQ+40/2g9gA4P5Q0r8KX7ge1B0gFox4Y9QDI0JLGZPxN86YU/A5qvpzQ0MBBqudBekB6qVATN30HYmNsckmFLSZgQwmFaFHTRNJjr3EKlZoSYPkHcZVtwsjiID5InMgk8S+5sNmDWMenFjX7ULEtBFezo6GhgQkkBqKBFdlOEtP088TcNlGCSae0QSKlpOkVLTzwH5jem6H5ooXMTLkJv/P/MyIHDNU9AEoKwG5dH4gmu1Qpas7E01wpokFzmnA7nUS939KKGzQwHF/aYACU+zkUPADC50IbGtiQmyhAses06tDQxAP/U0uaupHUzRyKXcp/yUWNzqkljYFDuU/8FIjfkuqBf0N9WGUID2w1X2YADc8N2aHFkqaIoTi4C0ryN5JLmqJGh+VHwSgYBaNgFIyCUTDSAQBTW2AJ32r+4QAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-markup.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABe0lEQVRo3u2YMW4CMRBFSZEuddJGyg3CGcgNaBKFEAlxAa4Bt4CGDtkLWpSCAzg3oKCEmo6CZSZiJbQKlof1wNqaL00FY7+Pl/22azWRSCQKVp3J5OlL65/2bPZM7cUe7P1M08ebwDfH4wcA+IXKWlqvKCbwu9iDvVAGx7oqfNeYe5h4fgTIKCYK8HnNcczr0GfZXUupUQHAycQZ+LyGODY7fztJBmcA/go+X1h6F7ZeqD4rPEzQswGUXIG8ejzwSn3A4PtL4Qkm9rBS777h32DgXVl4gokdmGj4emzqUFtf8AQTOGe9HPx0+gK//sY3vLMJnBsYyqTskguesBJLclqfpiwnPMGEe1r/l7Kc8AQTDmltSVlOeIIJe1rbUpYbnmCiH6+B4B+hSv+JkyR13nIfX6MmyNdoLgyPYIOsMlsJrdcXbyWqsJn7VurV1ymsEex2OooDTRRHyigO9VFcq7BcbFFS1vPVognyarGQ1mFe7opEIpFIJBJFoAPJLUt4G0859QAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-matlab.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADsElEQVRo3u1ZWWgTURSNWrXqh1LEDXFBRQQ/XBGEYn9UKuqHMMx70aJfQVw+1GrTmYmOiB8KxQVBUPyofgiCqLghij+iBXEXsUUUF6hbXbBLJhN1PHcypqFt2pnJTJxIHlwS+ibvnfvm3HvPuw2FiqM4Cm/okjgnIbNXsNe6FJ5VUODjijBZl9kHgDfI6Hu7ysYVBHhDrSgB6Ed/wadNYacKwgFNFrd2A5+yn5oiTgk2dWqECQDamsUBA84dD7QDCVm8nA28ZYkOdfX4YIKXWLgP8FZA87rAgW+X1ozVZPYJb+CJDSdajM2Vg4MDHukRoJqI3wmZP7PzFvAcDwR44jMAvUCKvKNJfLE98CaNbgaA8+JMgHmZUHi9sUUYgs/Tdh2A/f4nKdUQhAHYXIRdg3WANpvo761q1SjKMA4cMBD0sTxX2HUjsHED7D0239Um8dEZ6TPqCHwqDhrzB75GGA7Qd7Hx+a4ZxFDV/pZoM5waNNK8PJy8MAgp8hY4f86IRAZ2U50yX+sGvOmAxA/mQduwY9jsPihU2gOtSjH31rUDUKkUV76dPHi6Gxu1x6NsUs/Sge9wCz6tj6TwUj9y+16czkfitvV50qiuGtbFwTIE77dcHaC1PbqEsAoE6lksqMOuIk8vpwC1Ku1ts8oq4owM7td5AJ6s1VBXDHVHE5wqTng9FnlKp6nL4gFNCU/r9hyCl+ZMqQzRFpfDE/Fd88gB59JCiwpTU4BMCjyGExE7p4DnBWz2A9LhjXfgTbtkXwIofD+VclDgerKWlbvQ/FGPwZMlDZWPtEcb6BakxqOwz5rCVjp6c9Av2Oy7Dw4YwLLR2Ukq4ir88Cs5Q07ZSKtl9uWyK2twdYc1q6zMnusxNjtrjwdzoM5DH8Fbb8GFQk0pTLNgQV2yaiMU6tdJGWE65s5QzPgNPmXiTtd1IFnLFyFFvkNGuoETX4AFT1ArxGuQJB/oQmNdP391mW/KVT6UkeK0FmumBT0E30I9o0w1SxLFKp6dDsbE+TlX5TZVGJOmkSRWUrDnCL6Zak+PhwbK6pJ42FeFmpTZwhzo9CVTgvRSX/alFapaUeJD08qMCafgddJYDnpLNRQXkDPLvG+Xx8JzXQRsxPH9QxGX6BI74lPrkD1wAP6Q232oSeDPPy1kvsFmx+GCbzetnC/3KHh9OHCRbnPB7UArvL43WRxo8KmKzcqzgL8SqKZt78HMGzOAx1HstgeS81lTncS3Afg92J5sFbY4iqM4iuP/GX8AoBxFSIcFwooAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-maya.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACn0lEQVRo3u2ZO2gUURSGNxKjImgQbSxS2IiNWmilYApLO1kfhJ1zXSFWQbCwEIsVVCysLHwgVinUhTiZOf+ZTdxiDIaIGiwERasQ0BijqE1CfI7NIuNmN/Pau7uB+eF25/xnv7vDnXPPZDKpUulRf7m8MV8qbc/Z9gESOaKAAQIuEvNtErEJeErAFAETGc/riFtDmWZ30MoWi+si1yDAC70cZ1/UH58DdkSpoVx3rTYAJXIvKgCJ3GgbAAJ+5i1ra1jvkyMjmwhYaCcATzEXQnszn43srxuAgNlssdgV5Nvrup0ETLcjgKeAYyGe/cOxvJsBQMDjEL5j7QzgGZa1s56nEtkd17dpAATcqudpAHdWAsC8Ms3uar8TjrOFgMWYnt8GHGdNswA8g/l0jd0/l8BzPHKfkgSAgLf+3qV/cnI1Ae8S+I01G8AzgIP/dp/5aITcP5Xlb1UeNR2AREyf10QSr9YAAL8N5h5l23uTerUKwFPAJQIG2xVgkYDrATGfCfgREFNuFcBYtljsIuBVgt39nge2Bb0fdAGMV06Y/QkesSuV9vpjKwCe+2LvxgCY63OcDZX86VYAvPSd8z1Rb1iGyClfreYDGMxvquIvRAB43eu6nb7c9wHxD3X8A1P/TRlGR9eHbRcMkUNVtWYCcko6AGZq3HX7QuS51TMeAj4EtCWiA+DLkiTP6yDmJ8vl5UT21Kg1G1ALOgAWauXlmXcRcNUAringZuUSM0jA/XqTi6BjlJhZSysRd6RYo9ZcQGNoawEoFAqrGgTwKaCWpaUXatQgudIzLffGHtYB8HUlA8yTyOWGAYg80w3wi5hfGMCQwXzmOPPmRn6LUEDWAIYIeEAipgKGCbBIxCZmJpHz6RebVKlSpUqVKlWqpfoL0S3eVgqYBaMAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-mint.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC/UlEQVRo3u1ZT2wMYRRfDhIhQhycXEiExJmzQ0PECRfhUBcSEoqDA4fVK6rded/uzDooJ0VSeuJAiex837YHNpQiSgjxJ4Rolf4b701nqtl0d98XmW9mY7/kl0lm3rz5vZn395tUqrEaK7nrvBTrCHVJ/lLp9CJHwQNHQkn0isV1RT5XyK1H4k8Rng8Fg3SuLsjbSuxE0iMz5P9iJK+sHYkknfbS89vctoVI8DASnZqDfAi6dohk6Z7EGOAoccyRVhrJTVQhH2LCVnDKlnA0GeRday2SGkWMM8iHGPfvwXtjNyDvwlUN4uW4Fi/5Iqxhuk1Fd4rtK0ARlqPfP/oH8tNw4THpisP3WxkEp3hGWK3mDZDwhBmsHBcbMEqe8jjTRX4hfnNkSafBamvtxYdOMoj9DFJsLbnJvBTNBgsXuMwv8AMxzJQtGCFPnaVG0fqG+M6UHaMO1kTbsEkjTX5BfGXLo24TlXebhgGfEJ+58qTbQADDVg0DPiA+cuVJd/RfQIkDGoH5DovUe6bsMOk2UcD6mKmR8AbxlimL3Sn0mzCgpOFCrxCvdfqi6GPAhdsahF7icUjD4DsGmjgAflqEQR98g8GAAWK/xht9qOVyCvYZyELWRQ0DVF5CUUO+M/oYkHCcT8i6i2/1HrsOoO7otwtV+4qgTeYUpptYB25xW2/SHbkB2fvZZfiwHmZrcB2PN5gG9FzoPbfU0DQmnvNIicvoFl1MA56ZHCc7uEHJDXrbFe0GJzJoYqZFG3O7w4yXJqN7ocwKewbT6FlOxTa+V4r+fYSRRk9gDJxkGNBifFslozJLgoGlchai1lvBwVpDD+mK6V+AtadGYO4iVDVSit3x/tCokibzrrUZDdhSpfJ2xb47fWUgvQCH8e65CObczAY8bqwwwHfTvcn5tSTF9vLMJPrESkIZ+SGSTdxvJv9LTBe4cF4eo9QYpNxwe5GudSTqzc9enufNo5Toz8GY22dV7hfBuRaSSSV9+YYUMqtnGsD+7Kq6IN5Y/+P6A9Obmmhi8DjxAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-modern-fortran.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFOklEQVRo3tVaWYwURRhuEFHjhVHxPkBR9EUeiD5IPKKJR9Qg2lNVsyxRYlbUGCVR2Olqko6baKJPGqOJGn0Qo4kva+QQj6hIgroLCp6sLmiiISjrwrKz092zbPP/3bXozFTV9NR0xtlO/tTM1PV/XfXfY1mKJ7KsaYFLrgg4u8d3yWOBy54NXPqW79LPAk5/CTgZhvZAeiLDPqd/wRq/w/ddQDuAvkrWIx/A517Y421o34BxL8O4p+D74jGv43yrkSfk+auB6dfjzTiN2oT2hg55obTavlDJePRE54mA+s02YlpGIbzYV5DXSua7uo6Fo9zc5swfpZDTTyPvhhlHAQQO4VOF+UnyOXv836uTCKRiMPsZ2v4MaBvQdtjrG2i/FUL8HdD3sMcP0P4I9JMQ8AGgX+G6/A3tuIK3wcjzpluwYIcO6RinF1j/44PaMFptn5qArzoFN387AGBrdQCilfYJVhs8qHIlt2MtdvTpAIx69tltAcChX0v460MAgzoA5ULu2jYGMAiGi+7TSjxaToe+B5/fEXbiuaKz9BztvfXuOx4NDwjha7F1hfmwz8egOT4POfsI1ngffnsX1/M5eRXap+E+z6tzhfok6nQfduw3UGODKFiqzca4fZ7BmkHokvsbAYC8Y8c/Rnq4QC5TblZg8w31+3i4hl6jANAvGT9kCWercQDd9qV6f8rUSJH1CgDbJWOHUY2OGAFwySUqAL6bu1kztyd08gvwBMVJVb/Zsux6CkNXvdZB7DhkAqDk2nM09/VutVJgiyvHkvU1L8fJ3yJZc4/EDoxgR9EIQDe9WKPy8kq1zHPXVTG2QennVI7bK1lvFDvGjABofHNQocvSCj/8trFGPTr0RQkAmawWscM3AaCLlICB5QrHcCSy7WPqAcAITQJAxmcJOwIjAKDr1VqIdknfvkNfqmUsDierxw7UhLdyPnwEUDYBoLPGYJAekszpjVbddbLkzW6SMZbE4uzWcoFdD5b6XlWEZmn87cjUyUMVm2wKTIBGqXNaHzYR2JQRwITJ5ENe5+wsnDThG5kCOGyZTo4K9pltAGCiCQDLTs8GAP2kmdjY+ApF3fnTlEytIVcBYytgHCk59KaiR89Vy0ucKGvqChkJMfj8szRvdUXNHIgJZOEpANjSrBCXzQB0nNIQgMSQrZKo0a3NJLqMDZlMp9cDgNclZaCSlnxjV6ImvZcCQBwCpvLzU1PJ2JnTpVtClz2oUnsVKcHEldjZBICisTuNgbvamWMPpDWAIitnCmDUOKCJPHumiTuNUVjVFdplDiAOaMxCSsxoqwMaQjVpGg8BgkA/gloJA/MmTuCgcVBf7ddXAHDJktZkqeOg3iytgj66CkDJyd3YojT7kGli67A2MweOHo5pAYD99VOLEvMNczpTOGnPt6BSE6cWd9cZ2IsVHHB7Hw4cltNlI2r9HPtyDGzE3AII7TMZn8xuVcpukv7Q3fWGixWeNz3jU+i3sParzr7RzZlWW+JyVoYAgHfL5+xOdSGNfpElgFGHnZVpoc8ld0we628qKQdBWYhJLHQBMIgBC3xS9Ohtx+E89GvQJ8JcZuSxMzBTUeL5izDxGxTsK0Vgs7DM2SLcLK74ZwdgT1zki4XNIU9OuTIr8Pwf4bJnQsT05ZQBALzW+GJxKTMR6PE2Zn4cedRVhyy/Oz8Xk6v64neriQwjT8hbQwVmnCAcsx7xV5h1WKgTVfcBOMo/xb9ahhLAsWdbFFFeWWQ8JsRnP+nDMfHLGYrnwhqiMr9NrL1O7NWDe+vqEPgcAaV/Uq4t8bDoAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-mustache.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACh0lEQVRo3u1WX4hMURi/lsifkJT8eeAFRVJKCiWJPOyLunvOuUtJCNFGtt2552wdnineiOJFSLZIlBdK5MGLeLCl/InyQOyu2bn3zuj6nb3X7NmZabozs5L6fvVrZs98/7/vfGcdh0AgEAgEAoFAIBAI/xFix5kUqI5toeRXwbdgCA6CTwPFumLdPqNKR4v5oeIaMi/BAIzA1zg7HfaJVa0HBaehL9YYR/XkghxbHij+GM7jOnwfSW99WUex7Tj7WlfH57fzmi+qH6M7L5Jsw09fLBhXzdBnEkbyqbFS4LPuWgYiX+xPqxdn4HDke2sLSmxNq51F50ck+UETU5VvxQ6nnTZyv/D3mVE5ZO5VGDGJFGO9Zcq4JKU4lTEIu6qf8fmpUT0U6lysdZudQDKiYsgEX5ZT/ICDGXw2psj3xSf3zMT3/nLwrjsZHbnQcPCt84pdRBTjVqw7ZyMJYcm8MJkVxirGVo8Gfdydns7cVJzf+AfB/2F/fGzntCSWvXOT5eGusKfFsVuCLO8YQaOQ93cvxNmD5hyz75jlR6ES19Hhm7D73IxlM7Zg5+GIdBcnSei2QPKL1u8lJ12DtpK5pAONOxRDgWSXijm+2YxdjQ0yK/C9HQjgsrUwsjJMR/1dxflHBxmeb7HNA7BxyNydzCu7x50TSXEESb9pxbfphjOiO5eY9dWwMt6CQIr2ym3R0NuDTsEWA181kcBgQbnLkhueEysxt3czKJXQymtRn7duQl92FCFUbBcq+iTjvfhSlGJTlaFirmMjWnvWrCfrcg+D9zDfR023/va/KYVevhTF7IXP+yjWB+sR/JZ0nZ0wI5ipvWaF1XoVCQQCgUAgEAgEAoEwAfgNO7ZTYqWpQggAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-nginx.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACxklEQVRo3u1ZPWgVQRC+xKAxIgERsdDSRhsR/KlEVCwsREUsoiARQRu1EoQInhKrwFNvZ303l4QHauOrbBRR5CH4dtbHFcY/EBEVUyQG/EHjX8S1SNJo3u397B4Bb2Da2flm5779Zs5xCissX7s81LcACYaRQFnwH7zBl1oFgMRcS8lPumBnrSXPG3w5Eny1CoBgrCRK860A8AmuWk5+2g8ZT75fXtqQU/IKBTxRSrUYS95VbisSyNwAECiUfJsxAAHxfbkmT6B8CbfypM0xJN6bzOEcEnyOBuGtNECb/LS2WsSOpIzdq4kbZPxwvWUxaPORW3Pb0sQfEKVFSPApIvY3DHGxVdr0BWyx+TD6BKes0WYg4HrmFg2xEyV8iDhnxLvpzUsUVCnVEoM2f/ry4gpD8qRHc9aBZAEF69K3Du8zRdOD9wcXTrZSExesK8mVdiDBWw2Adxhi56yUy3FoEwU/PCuTN0WbZeGt8yWc8QW/YNyjWAmJX9FVv/8B2xylmQLiZctC70SUYHutCfA9amLyiR21rJFGMMSO5g+X5Hv0sgEqzW8QntsEEEh2XMv/voC7MYKtbwJg3CKA4Uqt0q6Xzg1YhQS/NMEarnJb/5XdcNuavE4iGFHCeb1eZ90z3MAaS7fwqvrUnZtMnxCMaoKOzvSYBXW+OiC4gQTvkeBLDJ+IobkOJleiknXrK8NKWd6dKc0Vas55kUqux5yDJ7JMTQGxHTFadX/6WbjO1yLB7+hD+J00G4SpAj3UAHhWrVbnZB3oB2L06K7kwxLfrY1LsDezPirXy0uQ4KPmsDco+clErn/0hmai6pQKFY7lvVZBwXaaW2zV3DYk9jhHAKHRzZzjOE6Z2KYcl1rbbS13r1lPnhgZr/5f6/Vxq4qTvK22f3D02Fvowj1r1Z+2Sq3SjgJeWmmfOmwsfuIVVlhhhRX2X9kfpoSN5DI7NsMAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-nodejs.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFRUlEQVRo3s1ZCYgcRRRd7xu8LzzwxgMPEE9EAgqeAY23CIIH8QCRoMKiMqJiPNi43VU93T27LkYishjxjCLiSLJT1bNZwagRjEY0XhjRaLKJJrvr+P7Y63ZXV8/0zPZ0z0CxO7vdVf9X/Xr//fd7ejrwKVaKpziSvYmxDWPC9th7RWGc0dPtH2uFtQ8M7seYxKgp4x/HY7Yz5uzfdYYPDw/v4Ep+B4z8VWN4eHhsgyP4vYVyYceuML4ozfNh2McaY7+3Bb/RFewqR7C10f+bnzken5Ob4YMj5qGO5C9pDP/blezxxaue3WP62aHy0K74ey/G5uiJ8GFnpP+IzAw3lhm72JI9hMXHVWPw99dKVfOouHdLnnGY65kva5zegpN6tE/07dZR452qdTkW+0pjwBdAmouTzlOqGhfgnU8083xrS351rVbbLlXD3So7HmHxjmbBP7Cj9wFZdmrn4tvSnI85ftPM+4E7yk5OIc4H90KcP+3jeRgSJSsB7w+c7RoDom9fXHKG+aaUNSaBWIuGyov2bnnSQq2wveuxWzDJzxoYFHbVPDPt8Cx51qk45bLmNNZj3E4nlmgiu2qcRkZGJhLmT+QUOdepO0axj3WuxXrrNI6MNd04SvcaqNuGnVlI4ZQV0uFO7Q5QeIwgWYVou8LOjb+skr2vwOJbttd/XF65hiAZCW+pGsLxnku2afpBUINbu4Wq2B6/JuDEVOx9CB7ZgODHphXXdRj22A3YzQcxCsi+jxAfQvK6IgmS8VF+cPAUKLOn4gBwnPsZeRxGLVCRjNAD48tmBA+hO+JK89LMHcBzrwaMWPh/klpd2Bm7+3pTZhqF6Gd0WThzB/D9ScU4SlJjdR4kmANDB/2CJwKXBNW5OkBkD983Bhb81FppHR17P6Q5F8/8GXj+a/UUMnWAMmo4vs25TbkWEC/4TknyE3NzAMnwrFAu8dhlzebx64XNM/mHX5mbAy8sNw5QKzPE/D3WiHVCIxpC/8fpnUODwjDvS/xuDNJswVhFVRhRBeL+TsU4phm/ytwBLHg4aPiaFuBzA35acdJL5g7Qh2piP5FVWswHS9QCKRcHIgZ4fA6eu+s/3Ygv80vTyRgnervKgdiyEhkb756Nd42QM4Ktzc0BW/DlM3Bozk9cA4BGBI0MCl+ZOhAsC4kPJXZAsAeCNXeQMmfqAErCp0IcKIH65ieyscB7q3MLIXpPUTEmQBUGqChxBT+PagOqAQhq61kbdQF2/3NFrVuQbyIjo1ql0jOa6Ud0uXNHIXy/TivLxI8pnFSRCvquSGTTsV0vJQVbTLRaodkUZut8IaG3kabaigMbA+n9zmYaZTt5gHhPYpFqpnS9PqjYxb5PraBWNMqQ5AEcT10fAtHD3G+E6DnyTGNVLiqbazVK2gVFqe5Py3Be5nv6ZelWxZa/KHM3ro6w48FsGtYo+f0kdFHFpDY3XI/fnYYEQ10dzPeDZv0KbXByLaeu46AYSYYg47NVqt0KPx3zrNBqspLf3FbPgCgxtYs0GmVYahfmTe0azqpsP6oFNPL6VsrqqWiyAxV2pC9i/RLeHbbSlcZF7cxJZI3CDvP8rmlVdUaTpWMsec8fROhAjYm2w0VYF9ZLy8hp8jVJRIDUncLFuwQGfEhMlLr0DRISlZqvaMJwE7FRlUJk0rHE4qMR2JXsuWDsUuZEWDysa7O6nvki6MMhuUnfxC41CZDGj3S5YeA8/P6NtuPSqFmRdRjVO/KSfZcActfbwrytk62qWbWGEONPaDLo7LqOWX+IyVLX3ndkAqH0tu0ZJ3VirX8Bs27ijCcVgykAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-note.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAvklEQVRo3u3ZQQqDMBCF4Sw9Ro/qHQyIK4/SXXONnsELWAUXLgwh4HvW9n8wa+eLzEBICJmMz7EZXjEOKU5LzaJ696l/BEW25mdDaRDik9cj9h+Q/OHUtVKEGiBHOABShAsgQzgBEoQbcDoiB6hdkZchrgLkELcCHCFuMQOn9gAAAIAfBSjuAwD+CsAQA2CIAbCFALCFGGK2EEMMAAAAA8D5yFeqqR7ge2Yt19JLNcD00F08+bWHtZdACCFfmQ+5hH3sVm14LwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-npm.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAYklEQVRo3u3YsQ2AIBRFUUq2hMq1XYAdcAEoIBLEnJv89pFTagjSmkq66pcOAAAAYHJo17sAAADvDN05x9YdAxjdAQAAAAAAAAAAAAAAWAbofWH1bnTHjy0AAICfACRJOqEHFnrZYZov1skAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-nsis.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFi0lEQVRo3u1ZaYgcRRQe7/vWeN/xQIJiPPDEGxFFxAOvGFFU1IgrMQaMGsKiIghxnenuycJKEPGHi38UDcardaarumezajZmk9VoEjWKIsSoa9Zrd/y+mtpN0/RMX9OJP7ah6Jrprq53v++9KhR8l2u486Qp61mGa7mz7cX2rph39nf3715o01VfUN8+1ovYuCMl8WMg/n7btPd0TfdD/idMUfWK3t5ZiV9SXLILvvlK7AXSkveBgNEExP+LMRMS3wd3GXjWV7Wq+6UlnlrEN97D2BR70cDzA3sIS8zQhEUR/zcYvqlm1A7A/JMm7wyIspiSlHjnJWcvrK3ob2xKogG7UqwcBBO4URHYnPg/pSGv6TP7DsH88whGV8uyPDwuDdQatedbn4ABvIyxqtJdORSauBrzkRCC/vAM7woQfyTmX8Y0ta/dsntM1P4UHvxpeWBtYga4aI3T7RwFKV+G+bDvY796pncBpHQc5usTOvt3MLcTm5pNyTmMwgtZl4qBOoj/Bvepbsk9n4RjbIRpnSVL8mTMv08ZsX6ET0wL7isMcTTM96sma1Iy0Bg/eIu8UyCdMz3LO5W2jP+E2iztMKVH7fr2nKqFVc+DAcb0n0H46YWcLjIUobVsDOjxi2M552g77acpZBifUQPI/tMd07lEmQ+cPG8GOH6HCVxUK9WOxXxtGh+ANr+FSZ4Aos/Ve40g6lzVwoHbykCdeYLvASYcgd9DiRiA/VPaCAoXK2FsCRZ/AS5c3ySEtpWBj3WGnMkc4XV5B2O+IiYDq5SUS/JKzDeHPP8HDN6mkpgha3kwsJTYBHb7AMEbs7TK1j1yf+0TrVDqckoXBF5Habd4dxTfvycAI9oQhQzxBlEhCH40COTw7A4N5EQoUZAmpYr3blFSjoFs8e7DFBb2e7cdDLyGj+0E6c1vtiERLEEgiP0g8KxCacLc7kqIcOkvj1NomL+ZhYGXe3t7d4Ban4vc0JCPsJiBM77tNzlI8UFtcmki1tNKeIbsTsNAmZUQ1FmMXZGZ7hPcEPe5qhBBkaOjzXCG0Vmv17dLysBCSh73nsRSs8QzhW15gYg59gJ7R6jt1Qz1cZeuLWYxAmUZ+NZTyZmAw2bdmLZP1cOcXkwtCAhRC/OxbatVQz6bgoEebcZdiaIQpUbHyeh4xEyzdEdhLh0bweDJ2H6EwKGIR/RJkwcWqQ0RwtK2WDAe8nUU+N9bKsRa7uzISIaQTbNhKyV1Jh7PvEwmCYkfhdTuZj+IfaHAs/eZ7HxQJCx5zVdh2HJfbwcWWioXyt10sytOIiJMuDWko+An0CFzIPDOkLbNnEAibAuY+0h12wCwWkIBAjQANfZ/2AeKYHQZASAIvVkzPcaI1QSKZAdz2Mi1X7D3xf32JmBss4LIjVp5dUxTW0EoDk1cS5xErVA7eVZkn8I2D2TREYDDqkJjvyeiJAwbQ+PNLtYZW6MmXslmF8s/3exSNbIqD1EmpoxYa1me4jsXYv7b1qiJVbOLhTi7FKrxhQI9Y4G/jJWa6jeZcmP+NbEpvbwytuo7mfKnPBlYL4ri+IlWYEMDXsYml6AGqsXqaWDgDN3125AHA2v83bSJlmBZTNOmkMYHNsD+T4I5nq3Nh3ufp/uu69rHgCEH6cDN1rBhy8ZtQuLXkdAQBx6GUC4NdL4zMaBCaNS6JKEUDvsF+0qIaJezVR/yzgjbNvrsYWVqBsaTWOy1jWQ2FCeJ8XBEHZK0OP0RJXGDOv1Bhk7OgCVtwoikkSQCTvQTRsQ4/dnStrHEjEQnnooBS75DIJe6gGk0u4KATrB/xD5SzPO3CYQLhu+NL0FTLB7sHdw5c0z3Q2qYgAJrjRPQsZQRq6O9h8rxj0k79eF3R+aDdMOdV5i8Jq/Ja/L631z/AXi3TVN2JLxsAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-ocaml.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADNElEQVRo3u1YTWgTQRSO/4qIB/WiiCLFNvMmVamoFZWq4EFBBOlBvfoD9SAeRD3ZgwpaKGRm0hpRPIiopajVgz8HRQRFxPpzUfAgRZFis5tsKyKlyfpms9E17m43P002sA8eu8m8nfm+mXlv3ptQKJBAyi9KlK5XBdxVOWioepVVk1gkJk/g8YM21IwPgOerxNTmPvMi0uxT8H9ISIxus9/nY/A57XMjoNUAAc2NgF4LGhCoGQJJDoMqJ1dVTp86d0hfo00Hvt/zGwEt0b1ikaUtZgP+hd7TOsVic8I3BJKcnLK2DZ2rn4P/D1htUoJstdroemiSyuC+Hwgoarxp7n/tjO6w2LyRgPNtEgzWFADmg8LhqMrIPny/jvo1u23hV2kEBBy3azdn+I60UQTsd+oHQTzyAL7/S2fzLNtx2lumGvkYB446VhgBBu8GOxpnO9mMsFULkpwe0eNN0xz7YWTjeAQURrd5ys0YPeadAIIfji+fX46M1j1yga7FoM5TZsyAeCZQLvDGNorCZhcCSb09NNnp2yFev9DwDU667aJfxeoK3EqHHPKrG/a+Q1vMlcsU5cQTIZ+vLJ2pcNIqQaNzv0TtlTNsGyA4fCopjFZT1C7aWPI5UE3BlblUswRUEd5elpO4KhcIeB4gqB9lJaCw8LqkIJcTMRqeKODSkXHbdBZTg3tYUnhsGv9UBTmpxOji4rcHHMZ+HmBcv4XPaxgmb+PzfSmXB+4DRsMUjdJ2iZeRcGGeJJO6FKerdVY3468ThnfhSf5MjcGGPALnK5aNyvwGZ+qVl07w0OnJnaYy9ba0jaY4bLHkV6crl04LcsZjJ+lcsZPgkQYJOq89keqKLDMJ7K1kPTDmsZMnlm8e2towctNYnRis9F9RL+CgEa047HaxGx0WDfOkn+D7iJ8IPM/VwUjko3vODwey/RpFv08IMNgjbWUUGt/RoTdbYcF0/P3NFwQQ1E7Xvf+vfs+FWpmJ+oFAJinCSySJAga8aFZoZ/1AoN+0e1vYvX4kkhBkbfUJ4Klq3g+lCxlQESQqD71y+UHRBGTmiFtoUxGDpmRlpgp6YUIJBBJIIIEEEkityW+rPM9A0bG6cQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-onenote.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADpElEQVRo3u1ZSWgUQRQNKnoQFMRdXA4uoKAiomJU3BAPHkQQFXIWPYjiTfAQFFQMoky6ezIaxZsyiKJC3ALBSXdVJ45L0EgiEtG4oVESjUZQHN9ve0LPpFM9U51ZGqbg0TNV3cV/VX+rX2VlPltrtHVkY6hxkaEZFUxjJ5nKbgFvgV827pcVS9Mj+gymsC0Q9BDX+CUI9wz4DSQEMPMuqBkyx/BqXs4Vvhcrq0FgHYJ0ewhaGAK6oi8wFGMnVvYYBL2J52tJQQdDPBaKTTDCxkTzjDkpFolN0av1qSzMptEzHomPTVQmhkkTGGJh/eAH8BF4ATyEBqwNGoEUGKpxmYf5LM/dyYMwT6EqS7MBvnnu+P4rsKuQBEwJtY6n21Fx7wAciVMmOJWZZo05H656o61O7cVuA21uspH3ssc7C0mgB6gXAfHmgpts5HrtOboCZQMuBHpzQeAbYNi5z6NcEKDA52cH9sOY1sCAFuP3VZfxe8k5YGx7BPP02l5lUOD7K26yNavNk+05OrImQN4h+U6T0jTXJWnLlEDWRoyFO4W+OixeI41j/ie+CFhCqvxsWqS8myGBx8BsESjL9YgDMd8EKPlCf58EAdlARtH4vP2UJ0DZouPdKgkCHTQuhMp3uBCoteZW+AlfKgRXtp6M2Xq3lo1znAvu5MoG0gn4MmJd1deRMTkM7HCWBN5ZqyiCxg96EOiSJkB5ud23mf63VLWMtvJ2jd3OsQ04CfTJqxDUJz0jhMD7siHQUNkwQoRoNDrcg8AneRXS9NXJPhjbtmQlgs7KebSBNj8qVN7fr7DW5AkJUXJ6hgQoAHaJgIXhHgSYNAH8XpkSwDSjIn2OHNkAlWxq6DxBxQY/KrQiZUxjL0lv80Cgx1EguyavQgpfPmBcY7szJQAX/Bmqd1EIlR0fQAD9lhNRjUqnG89ehcJsmct4Z12oblROjdhBQMqIgRZylfapKeGyC6cx+SZbxY4IdqAd724VQmEbhAQU9iV4VYnUHfhTOAJwvaZqrhIBdrbEg8D3QFUlXAh8KCSBbsuWBEBsOSckANcdxMpcPZ0T8LxBRYMglxa7C10blSvuakyHi56XHvUDU16nJC6w9wMw3DdUj8qs+qWZC/tvGP9H3vdDrUJeZZUkzBpzDlU/fN+bxSPx8XSYhys7YJc2HgA/Ze/IiuKKlQ4yZFTYpe1I3o7iqHkdwr0C/gaCgOhKlg49lJE6rmR7AkOg1Eqt1ErNV/sHgVYyW6mi8YsAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-pcb.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC4ElEQVRo3u1YS4gTQRAdxf8HPargB0H8HtTF30X2IB5VVkRQk0x2IScXwd2jLjmIoggqehMvoiBByG66erJLhKAoKO7VD6jrZ1dd/CCiIOiu8bXG0A7pTI9Mkhnogscw0zNVr7qrq6basv5DbMbSCaJSFRyzoiDGAeOAcSDiDiQ4P65w4LQvPbnc6jjRJXw3BHwFhoErHZwvrt/sE7XByDeFA2MY79QiT5QCfij0fLY5j9UjdHZB+U+F0QpgfJ+GnpIX4oztDYz8nkxmSnmJ/5AkumvnchtSg4OTk4ytRyjcca9GDcjv3QPRja3F4qS446zD/W1pbNQuFqcFE/eMbZcUv0kVCnNcDs7C85c6MyvhrZ3NznXrwWS8qKwC5zuDcYCoSwqRs9XewUye8unAeUWSOCmt9NFAHAC5w5LhM16GtcDYOYWtE9J7PcE4QLRNUjoslloeTzE2A8+f+1yBkfa+vtlV9AxJK9AWiANis4rYl4zfjBGtsUqlCbiuxH3RJ/m/uOXSc0PeI8Kh4AoYY3HN0EiK7KECxvdr6BlDSG4NvgojJmsYFTWiW3NPHcK74yo9GD9Yt2oc43yTKPnA6zLpT5itLIxu8VUYOV+Lb67i+3dl4h+AjKgLlhEjRowY8UzHovIydhGp8ynwBan4FVLoZWBR+NtSog7ge0M7sgDJ79D4lRi3HWdzc04tOJ8HAg80O7L7gujvfySiFldH9rDTcaY2lPyB/v75MPxI8090tFpHJnd2gXVkuuSxAR/7aGgueDZGnB8JJ/kaHZnr3KknnOQVHRlCaDqeP5NWYHdYyVc6u6TjrBIdWXs+vxz3Bfn0IzYwMLPZ5EdsxlbIHRn664SiGfo3jTLWGgbyyxS1oNvjlK8rtOQlJ1pQM67h+r78zUds7Ot+O7umkHdLOp2eGJZs45t8QwTpbkFkySd7exeC3JNIkrfz+SXyUV+0woZoqcaReTjJGzFixEhD5BfDW+V3OeeUKAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-pdf.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADFElEQVRo3u2ZTWgTQRSAV1HUo4LiTRERRET0oOAP9FDx7MEf1OxOms7bTbGoKD14ysGLf/QQDyIIXgSxIIIHUYoXL0pBL4IHldpUrMlm04YqVCiNb+Jqxt1JzG5nphvIg0eSzZufb/a9NztvDaOJfBgcXFW2II9aRa0pURM+TxNns6FC/MnXlKsqCKUrrwOCH6DdNpPHLqxB+1G/3QLqmGvSbSJbl0BOKUQcANeCi8HVxWtPm9qrhIgDgLbPBC7itYRWBREToCAA+PLfO6cCIibADwFAsS33kw0hEWC87RiSCRELAAcMARB4FWVcaRAx78Bo+A7Yj6KOLYLQAuARuC1woVtxPCAIocmF6IBgl72sMw4X1bjYZ+8KxwAlHQNQy+WWo/3sv3eAHu0YgNKZzFaBC93vGAC0vSII4p/fUs6GxAP47lPgU99iA1krgEfsw1ybSS9Fj3C/v86cyq5NNABuWE/+2HsW3MBGy/D7+0Y/dCSxAOVU/3b/AFO3L5nObr+PLN+PZ9npZAKYcFf07MPiAg80L7m+ZisEdiYKoEQGNqLN3N9VNu0T/P/TmcwmvD7D9Vd1LXo6MQAuoTc520KtJ7ciFOAWPY7/zQfS65hnwjUEvsPiA/U57tqP2TXc/Hr9GFILwPI7fwZwLRua2VYs5wDavIlQrXinHACD8jpn94KtWmh/AFjJ/J65TX11LZiKU3qRDjCVTq/nVv97sS+7pRHUzl68dhXT6Vu2E8uoHUkHYBNsBC49VzHhIGacYfw90WIilXqtiMAD9rkkAGxHRXe4xFadL52IqhGoDxlcOQX7RDvxb9eCYVRXOQDLLvh9KPS4HDj/4p5wlqXOKGOxOHGJ04MnuvPYxz3f9SakAbhp2NM6g9ARTJU7ZJY2xwlZLQ1AkMO5xwP4xGqisovLsgFaVJZpr4ryvh4A9FdDkegA+FjNZNZ1KoDXrO7fCQBzJdJ/yFAsqgDm8enzpKFBFADQ116a7jc0iQyA4Eu+BW0v/cJajQOQX8IJBzUfGUDLi+42Vp7Ngc3F6EpXutKVRMov7p7jPfZXP4sAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-perl.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEbElEQVRo3u1Ze4hMURhfShTyiCgk8irlD5FXSEmIUJRHsuveGWwWc++dtXnUeYzHRpJC/kHhD+UPrySRKMoK61Ue5RmhkHYx1mN939wzO3fv3jtz7t05rMypr2buPfOd33fO9/idb4qKCuM/HoSQ1v8UYC1GBugWj+smvaKb7BtIvW6xdyCHIgYZpGzhSIwN1Uy6ExZcV2Ik+gT9fdRiozSTnUkB9pcvukVn5RF2fSsEq5k8BsprHAslYcdWyWrRTT4XfvMrB3hbDPa5pGxz9/BHbCb6gpIjsOgtUFibfTG+QmbnYe5XKfBCIiarDG0AKKgKsFhttt1abG1rD3MeBwGf1hs1SbewBjwMuFulXnqK15DO8O50CPC2WJSEMqCYkHbgRhM0i60ERU8kFtrTJOCNxFh49yw0eFs+LI8lejUv81h8bRADysp2tY2YdAc8/9FM8EL4bTzJ0BlIxn/RyFSwrt3aCb5fzQ/wRi56OhT8pRYbI7WAxScLY8/nG7wj200PHswG3yjjp9HovjbgRiXKwNuudAs3KWA2otslFO+3awd7pNYAPGk2P1gAm2xDLqWawZaKQlWvXIAvBaIwIo3mCrD7gpTV/xmh1zDTSZ4AXfTngAWKh/1S8aCXk97wg7oWaoQpyyIPtyDgyGbviM9VcrUgRvrD5PctwgCo+IIc1kHWeypf0Aw6qSW4UjqNwucXSM+D3REgXUpfSBQJEkzh1nhPqQtB7Oic1N1VPdijIFH3c3RncQJnQd6E40fllR2R/4MPnoCduAufq+HzAVSYJ/Af9NWbeghu1Tj2ICvic/R/+H4xv50Gky72APMAZB9wqhs+Pr1NM+hWv0sMBq3z3bI4HwjFdaGYp+XVAMzLLoBJeyeBZsfJcO+sQoZpFp3ZyE3K+eBMBkyMcM+HSnwJTz//LReDbnYBvJd5x4o9DDjnQdmT7gqLbpp+n+JcFu8nTSUCUu/1LoAnHaSw0vXuh+3PcDpwcXc8f+3BiBc0uJzBZ6jrtqV905XyMOjh+ys3AXQ1ET4KenDXhxVX2zr5bHUGAGAHyJuZ+sGXNYkNV+cNnr0VTPOKtwF8tTB8pDID7ABrALnXAa7C8fy9HmfjPdo434UBl3xY8TT7BOgSZQZgYDU0auEqmjkZpjtcZ0OTrl0mBpJajE/NaoDFjintOjv6QJtcnbnz7sB2URSoCTTinyASo0WMHFRtwAOvo8b+v3Cln84CpMVIV8w8usGOZ9NbWko6pGpEnE9RbEDqavkSO3vemYrOBDf6BG7F8WSQgiAtQIASm1MjM6+5J3ABOxk5/mOYmDqJDLOtkNT9pkj1wN3HtCkx75SD+1xPUw7f9jwGOsxT/7cR+ilQg1yN46YNY2xaZb2LWBAnz5UaAL5NEUxxnPT0BRJn4wDI5XT/39kMW1GxpUuW2LqmNIgRdAoM0Ga/OdiQAiC7YN5upNhAo+eJGnASLyh+bRJRX5KijtB/7i9YMHIIFjBkt7kSRGEURmEUxt8bvwGEgVAc2nT/RwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-php.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAECklEQVRo3u1Ya0gUURTeip5EBZFRYBSBFYG/7PkjogL9kdBLKgqxcB9qFpXQnwgjJCwxtGwfVlokmQQRFSiZ/ojS3dlZsfBVGQVZVJKZhmbq9t2d67Y7zszO7M7IBnPgMJeZueeec+85537nGAw66aSTTlFNmSUts802NtlkZ/PNNne1ye5+De4BD4L7wR/x7Tme58FLokLpw9c9i6FsNhSqAf8Ge2XygNHBpgXKSi91LsO77fh2FFwEvg+DH4DvmexMJdYpMzrc57BJe1XZAAhJB/9SoPQ4hjK7OOXZ9WHMfwWjTh264VmgWHmzjdkfieIB/DmtrH6GxdocE4GMAXBBWlnTPFnKZ1xlVlCfVsMA/ylg3B6hrPdmmychpAHww8dqKc8xe5kzgKlUQR7ikDGLKm+xMpvVVd7HNdSAS+rJZI6I+L4vPapqAGQ2cAawhSrKHTU6mN2G4DTXuBAfhjUw4CmNgQqVZQ8iu60K9P1MDdzHC7lWakCLBvLrDF7vpLG8X66NAexOi7VpqRayqfwDnP/b3W7ezh3LLm6cg3GrwMSfMhd4CZ6KoLuglQHgNt8pjFeKzSL4h9yIApN6OAggKXgEWW2t0eGMw3hIQwMQZ54NBrFol3INPL+LfB/Gd2NKVdUU7H6thsoPUW+5RgwYUXhB3QLkSBWCD1A+MaWqZRoE39RQ+a9Gh2s1nn3gLmJAt9JcTEAalMzBuAP8DLDhIKe4ayM/pjTgAgoUt2DcS25KhvdDPw1CKSF95IZFrrdgnIHnRTybNFacurAz7h+CaI4x0MX9lwQCYxOJbry/PREKKbxb6oXw/8ox1xhDkAFHFE0G/CHZTayIQeXF5AW/Y/OjbPdzpKqw5XCZhwTtkYuMlwJRIbFJ+H5iovxcAFdV5+Z6J4eqxlJF0mah/ydfbLBJeM9OoAHkTlokqyoj+IL4Gr+YQHpcE/QjDAGs3af1TUu5W1FdDMW2YdIPnpBPmSWuWIE64nSEyhG40hbiny7FxT3B25j4jg/QCMgL7hm5YkMsXk4QKYUfpaRGoK2aIlIFkpMksCNEQdUbVnuFtDXILcuLhzt8V5LARd/As2S6bmKIjZgblhHHC1/MxOTOQLBGIAMvg7WK7b78do5nq5QB8Ij4CBpdQfB5gBw5z4APIgV4nvy4c58J0aJJVqw4aUzBN8/y0OqjwH+yrjjnS0DvUgXdwLqwuhEhhGYIYPB1vKNPoB00oUVrFazVLgeBKiJaz3b4j9HOmkQW3yGyaKeCrBcvVUTBE+6G5f/ZxW+mkz6Mv4AWIi4TvRUCX/x4kQ5kd4PECZzUtB2PQH9Cd3CUFkiNBAz6Wx+yZPhakF9IZUcuL5rdKgBx9iiRo5NOOumkk07/Ff0Fe4FKSyUG2SwAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-plist.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABe0lEQVRo3u2YMW4CMRBFSZEuddJGyg3CGcgNaBKFEAlxAa4Bt4CGDtkLWpSCAzg3oKCEmo6CZSZiJbQKlof1wNqaL00FY7+Pl/22azWRSCQKVp3J5OlL65/2bPZM7cUe7P1M08ebwDfH4wcA+IXKWlqvKCbwu9iDvVAGx7oqfNeYe5h4fgTIKCYK8HnNcczr0GfZXUupUQHAycQZ+LyGODY7fztJBmcA/go+X1h6F7ZeqD4rPEzQswGUXIG8ejzwSn3A4PtL4Qkm9rBS777h32DgXVl4gokdmGj4emzqUFtf8AQTOGe9HPx0+gK//sY3vLMJnBsYyqTskguesBJLclqfpiwnPMGEe1r/l7Kc8AQTDmltSVlOeIIJe1rbUpYbnmCiH6+B4B+hSv+JkyR13nIfX6MmyNdoLgyPYIOsMlsJrdcXbyWqsJn7VurV1ymsEex2OooDTRRHyigO9VFcq7BcbFFS1vPVognyarGQ1mFe7opEIpFIJBJFoAPJLUt4G0859QAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-postcss.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAHN0lEQVRo3u1ZeWwUVRiv930rxgPvM954JB6o0XhEosajqMDOzHb3vWmLxQMPNBKrRCMxYiKIoghRUDEaMZ6gKIgSRbEqIoggVyPSvQoVpVTK+v1mvkdfh503u7S0/3SSl73evvnO3/f7vikr67l6ru698mVlO+Ss5JkZx63J2nJc2pafZGz5K60srUZaOX6/PGu7szO2OzljixFZx71quePs3m2Cp2PueWlHTmHh8oHVGPi8ucAerH9pvQNlYIguETxjVV7AVtaEdSfSd/3WxpLHLqmp2Y0+P8m/pfCadsTtTdbgg+Ap8kKcPPBCxpK/BZRZlLbFDdsvVMrLd0pb8nG6Uat3QxIga7m30ve76vtStnsp9pAw41NW5Tn0fiOtdQ22PH4rL8ZlH1J8FH7XFPksZ8mjOtvqR5DAc/gG6xHv+ctrdw7ua3Sc/en3lciB1VLu6QnpyPv5f3XwTqHz/f+5j9CeDO/N0T1u7hTh1w6oOoCT0re6LU4LzQs/J5oRKnqS03czWLCxpntlB9bsi5zQvFHVIeGBEuTir7w4tsXX6YqKfcK9JKr9m7oTC3qQkx35YAxV8iztm84K/IeQ7EDoyNeU+3NS7mdKbC/WHXdaGDQiJPisptSgxAlGhCNDEST/6BtOpmGA0mGSLMU3XLMmVtkrbB/QheO+yRRebJBX+Mzv81LuEqHE4bTvT+wnZT4sSfhsvLq3wvKU415nFMp2P6B9mwjLr406d00sthft/d0Xyn060oh28lzau8HPP3dQ8aFji7c57scbFbXdhCeMI4cXfbYjzkdse8Utnrwi0piWfFTVlKIqd7qi6mTG+r8bkslDw/Y1JhJH+2Ejv8zX1u4YdS4gtL78nj08LzjyCRZqec6uvLihwj0rrBJDaAq9Fey1RBHWlxOirMrQ+IXvJfctStDnEd+UA2/Qd1ORzCTkLCp8P9HneqYMecNaGCHTSN4332z9QfIw2tQC6wOTDQcO4Qqb38a1OfD/BSa5uLp7e+EtQ9KIgd5Gsmh4DMtTYFGCt6F86Ab6bhi9DiZqcS+UNwjeiJhWsaydsR6oY6Ixim4QOgqTq0ZjU86RZxT6HTHM+DyBi5OXXJ6VCNvp/RJFzLKWuIvCSyLmG53KYyjEHkbO+AaSs5ATiH9NuRlmwPDrAoX2iyZInIeKafgdLLMOFgTm841XI9npdRVX4smp8uq9C4aCr+RSlTspJ9lX9xB5J2lQYJy/T8w1JSbif3ph/i8uI5cvyw5MHqn6AVXoSOhvIt3LFyv7A1fZZwMhtjas6lIduJH/s8ykAJJrZPC3dYnEgeS6cj1OySJXt7u5JV8vthYwBAOq/+H/r0K1NVVdFDJFLUw5kCFGOaB9VRYXgSEGcRoVWhN+hYkrhYDBt5oBljIC5sLw3muC/L3NJgWmBosXEpbivX+BmNziATQlJRNF1AtNgXYoSMmO7i6gwENqvwFG5SiCwpe0sh+jYuQWTKqYuIYP3BTFl0IUqNMUyAIqGSjeZS/M1iu8psCmsogCNUPPCwMqKA/UlSo84FiLfy8E2whfZS+PQvueHVpAgayx4oVmebBTIxerLg0tYUlU3Zb92sGnLf9obxzRX00tVC9NCPcMw/S8CPYnPsrEkqdGIgmKk3+TdabKHeLpsarj4teNQSN4HMvH/Znor1VvQGuS2Tpx2QfVMxLPiZPwgSu9oRWhVVG9huVeyBDaSjn2lPJCLlZ5+la9OLNQRTC5ig/rlGYfow+uGyly+S0Ig6hxCOP/Yo7vlykcrlSo01BRdVxIq9qih5s+MOjYZK6t5WzmiUQtJ9+QpjvkwcFOjIneeiaL0xAW4Fx8RkMYYIBT6cOvTpsVweoqjvGZ43QMYI49sxiTDHr9JUCdx/wVjx8CysDh5AEBOjXy4CWAZM+jqPxkJLwHsHBb+Xn0BI6abVBjTjSKPfEqCBqFyJt+YhFOO+I9OvTnNqGwx2tD3we370CfoFYLeysbaIZaMe0zJyfBFvgQChpoL9NYWHERN+RLtYXP82l950+exae+Ep4yk9BTA6EAgaT8Y/T5PhRG0JW0417vEUSMFy1xEqgExil68WJjLlQcydRkFSR3iOvuHN1rDX1L1MgmTIEpmLh1h/Agh225I0Zs22TOH7gCsx/oSuHRrSl6DTAIGwpHe4HiEVM0HwHEc10SNt6AV8xUEF1sgYyquC1cfD7GKHF7CU8QeqLGUlsBoZ1jlXh1bw9R/IPrCbftbXZrmKcdt0ZjqM2dJnw7RRw5fMvzLio+6IFL7cS2tnqyLw/AFNbXR2J9hx/u+RVW3TBFit1diiJ4BoDHU2q6p/UFc3B+F2G0exsz0bxGjRd44w9L3klJf1PKEWeDInj8n77znodRFdceJeWZekxFh9dlTyrbDV4d4TDkNZVIF1IYdgWJX7ddKPveoMpyH/QfZuO5gZjL8/0W0G1+PDsaIABgKOu5eq7uv/4HzGl7FOPE7FgAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-powerpoint.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADB0lEQVRo3u2ZX6gMURzH1yVJKIk8ECJ/UpcHirxc8qD8K5k95+xFSIny50G3nTNn6/DgwZPkerrqPnHfKERJKR78D0mKq5Qr5W+uuzNztozfuTu7s3t3l935P7Wnvp2zs83M7zOdc35/TirlsVlcmShyaIVJyS6TkTOmhm+aFA9Bb9l6kopL07XMPIOhLWCsCsZeBuNegQoVxtZT+AAW755WUNPrBEOHDIovGAzfB0N+/sfQaADMHFluUoRNhk/Dy65B/8GloREB+GtsjQwNfwH1uZWg6JypkqWRAfikwQgB0A/or7vUw9JzogOg+IHb6W0wsqkN4DeAoPg8LM6jRlZZlAwAjbwRGjkM435wgguhf2f/Bw4QZS1FGR9zAEeCZlZWAJR0CawbFxRAHvRWOiOh4Tvg8K7A+Cp8uZfQ//EJQE6zTFAAAw3vY2gZvPiRLwAa/mrxvZNCBZDtN1dmwxz/5QOAZbD0xkABdJpeL8NlnZENVS/RUG9LAMWQu3+s5PMDBYDpknPmLElXTKUdLexIJwUlB8YKntcZ+BoYzQGcAK2vdF2G3d53J7w/cAAw+oQDgHqd+9F2zxEr+IcQAMhx+9qI0NAax7OSsx6DvRtBOrIyAOS9q2UIkNfw3HLmpioz7WjTLcB3nSkLQgGoSTuzmenSwXmIkYbAOa4KOhYaqM2XeYd8Mfz3tNmMDGKh2zD+BPd9ht/3YDfqkXl3GMFc9SIu5ssjLX7t51GG0842yjB3OV0SD/CtpUSeKUviBtCSdIa74gYwOFp3alLDfPcsPwGeCYb2GRRvhvHFsAtbccnIXsttt1lZPdumxjaljGIN+KFhg+G7zUrmDHEDSPwa8AWgUeUidou4UgBwpAzAuyYkuTr9McnldSHz8SgBXuR59xw30rN4vsW3Tv73CQ0lnc4JI7ol4/ZEHTHVzbbUPTNknQaS7WN2CPHYLjMmA6D+ySXvMFS0GIK6naBTxRopft9EjTQ+58QNDrqnFFSyVjByUJZbiilj1ZFsvAHard3ard08tb8dX7RB2XVkOwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-powershell.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC8ElEQVRo3mNgGAWjYBSMgsEP/v9nTJt5tipt5pk3QPx/APFPIK4g2f2ps86mDrDDkfEPkj0ADP0Dg8gDd0hyfOiqVcxATV/wGPgpfcaZlUD6AX08cHoxSR5ImX1WD4+BX4FYA6QuYf55ASD7Iu09cDabJA+kzzybhsewbchqk+aek6J1TAAD1JjE9H96Hh4DHyfNPcKLrD5z2ml1GpZW34GYlUQPnLlGIEp3h666yoamxxyavKjtgcMkOR6argkanDrrzLKGhv9MqEXvaU+g3G9qegBYWHSTGvpuJGSuPlCFh5J/ZpyOo6YHgIESTGIFdqaOxBKiFEseKqOWBzKmX5AmtQLbRkYoxWI2Q073U8EDj0lyPChNAzW9I8Oi36D0j24WKJ9QlnzOrCbJA9DikFwLQSWQOWqNfpUN6IhdFJhZTGoGjqcwyt+AAgG1ojvCCxQ/S176P21NagaeToV0C6qVRdCaJsbkJMvCvmOcpMbAeQod/wdUKqHXDxnTzyuQ0YA7TZLjYxdd5AZq/EtJiZE665QVlkBhBeKlZDTgJpOYfE7ZU1BabEVPNiCQPOecPLAmPU6emWejSWuBzjhTTk6SAelDTzIQ8876klkkw7Ayqel/PYkWPAFiG2xJBtR+oTAvvUZvohDRgT/znIQMtj1x3jlRaiYZtAbcZpJCn4RS4g9ohIBGSQY5gKpJzMCnI4gw+CmwPLelUZJBi4FzzqRm4AkEDN2ZMf2iGBbHy2FJMneB+AoefI+AXf9yJ53gIzUDn8BTRFZiSzLAYs4HPckAxRKIDLAMPB64TJLjcyfdZoeOfmGrTNaQkGR+EltyNDTsZ8HjgdmkDqFY4MlMM4lIMiSnXWCvzQu3GaeTSe3AFOAJjS/AFqEDpG1/NpCIUuYnpEN0dg0evA13jIOS4SltUodQVhBZfNJjCPEjtvxGKAM/HDxjoKf3kDGIe+bHIPJAIRkeOF0IHf0aSMd/g3amWBlGwSgYBaNgFIyC4Q4AeL6joVqNLY0AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-preferences.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAnklEQVRo3u2YQQqAMAwEe/Mj3vyt+afQF9QWFDyJlKZJZAZyskWHboMkJQB9DtnKXVH2IoAAAgjYdj8EwgmUfV3qc6mVn+tfqq2Tts+FwPXxpaPEi0DuFMgIECHvlzjibzwCJgLhc+y6k3wU8NvLPQsMi65VhIa91+oSa5z81Fb4B4Hh0Z0qoBFdf5OFiGMVBBhsIYAAAvE7GAAAgCYnaLH6O42aBzoAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-premiere.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABmUlEQVRo3u3YTStEURgH8KuEhQUlawtLvgE7G0UpNQssx4JSQ1IsJF9AcZ4zlLJAysvSbMRVM+f/txglNUsrGzsfgLoWqOt2vTaaM/U8dVbn6en8zst96gaBhkb1AoKoHoYCFKAABSigpoBDChdoOUfLGRpO0TDrNtwoDTMQrMKg4i3AWTfxk6ZI4TgEj3ULCIIgwAZ6/wNRNUBhvdBMw6wTN0nhLAyGwpWw8cNJvF4rPwHhWtiWknPt8q7zA8Lypp4AEQRHiVNYqjfAc7gTtsQe9HBKzj0E2xSOl2ypH4LuUMJWGOz7AIjKW+WO2BUaiM2VXd71fLYGJ27PB8BT/ARgMRKbO/vqy+UL4CSxqJXY3GXigQ9CsEnhKQzOIXioKYCWB0VbbH/PiaKoIdGZk4DjmvcBGmZhMcY8u1KuxHSihj+AbzuxxXJKDf8BV3LVR+HFJzX8AVQOK000zNBykIaZtx1339TwB/BVH1CAAhSgAAWkDgp3YZCDQQ4Wi38A3EEwHxu3+l9IAQpQgAIUoAAF+ADQ0Ph9vADeKHD1lussVQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-procfile.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB9klEQVRo3u2YTUvDMBjHhy+I4EFRURRFFM9+AD+AX0EQPPgB/AKC7OJBDypd27nDbp6KigwZKEJ1bdJuTC+iKO7gwZOgN+fLpvMJToSS6rpplmj+8Kej5EnyY83zJAmFpKTYCqv4CWu4AC6CX8El8EGQPpCGFiHmkeLd3wd4n7DXFQPYEbsP2j/Q+nEizjj3AEhHuk8fO2w+oRoAkIJGyp+fN/7FUqwxrgFK4VIDaUeN1/E8u0X8uXADASAVzfrAHxqG0cg1gLvmjkKbPCXuLqNlBtimUfhegwKYmtkGE+312lwx29nXgSoA+CpkfwCg+BWAE3WGHM2Zgoqtwvt9qLoX5cJFfAMZJwfPLVjUk2bYbOIDQMWnUKAW4PeZT6bxc4ZUZtYAhYCT/M7H2Vi2WWQA4mmWAM8VT0zFt/B0wQlSsMD3Pm03eQAgBe4IFukSjuCJtJru9MaSd9DmkraGWJ8HPgYnMAmSdWgTpsnRnQ0K/BXLfyAPqXEPQGYs3eoIGl93gJSS6q4lvu4AtUoCSAAJUO80uoxbxQaAwgWbry6RAa7BJ+6q2yMyABn0HEdxv8gA5D4nZ8fsQXEByoPDnmhYZADiuMgA20kl2SIqgBH0PMsNAJwJ1qu5FuEFIF7thWzdAeD4OEeuyv/tZk5KSkpKSuon9QZEu+3hOQ4xYgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-psd.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACTUlEQVRo3u2Yz0tUURTHNdE0W7iQEBODQHATCqGEtqyIQFyIi4jG5wiDCG2kVSgMLcQ/oEUitGoREzQ49wcOLkayTTC16QehtVE3blWMmsX0PeNM3HedkRlQ3n1wDhzezLk/3vm8e8659726OhaWs5MJKfNhUAZgAAZgAAYIFGDLk3I1IqWaUCqF/++gbz2l3hR/b7oO8LSKDfEmgNZDC0Aynkg0YKVeOg3wOJ1uRSjdwdO+GxWiD0632BDov+EsABzvt9oOI0LMmnNOSjkUJoBjVWrs/6T5fD1su6fMl4P+dQtACGHNu2b12YgoNYoQvEKApA+FaPeEeIC2r8EDSPnBN68Q2lidV5QblXwoluPAAV5b834sOr/tZTLNVqJffqL1RZcAcl4qNWA42ALbEbWhrC6W7Ej2q7B9McZ9QkV7hmsmKABKxG+w3feFhJRRo0/MCKt7gVehmBCXkHg9XjLZVkhGSx5p3QVH90pjATPv2yOUmoP9t5M7MVbiBvr+tKrTZxs0KuX1wrnKBYDC8UHrW3B0uVjfy+0Rc2XvrfXwCeBzzwGEDxxK0+kU9iz0oJo5qNJAO+z7R1dWOs2QC7KMVqMHVHXssgrbTFgASvodJbXbl/gOAxxVOHq8MPKoyVkACg/kzYi1We1gBQaNvOp1FgDOTZfGTil1jcbHstlGnw9KLYQCoJxgJW6j359zBUAYPKcSSEpvYzXmwHs6QpiHt3g8foHeoaFLFfcOBz+rkKO/8MR/4LrP34UYgAEYgAEYgAEYwAUAFpba5R/aCzb9BCW/UgAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-pug.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFFElEQVRo3u1Ya4gVZRg+Wdm97EpFgdXm7pnvO6dkuxlFQlf61UUjojtEYWUUCUtG7T+74brfzGwsFUJEmGAZmGESaBhKYBctsyKyLDHPmTNnXdqWXW16njkz7pxxLifPOZs/5oOPM5z5Ls/7fu/7vM83uVzWspa1rGUtay1sjpM7YufiWccNLRanlfTOc4fVzDP3mOJEZ/ncIw8LgLsGu4+3+uXVtq49WdGFbuliRUWXG/H8G/rf6E6o/xN4HkXfg/41+mpbiTcsXfZaSsypKnmR05ub0haPYqNLsOEi9C3o+wOAxvDuC/yaMOihssrfUNXlZQSz1+g63emdfRRB8TSGTNFRNrQrK0b+VkvJhytKGN7cscB6Q+jrKkou4PimwduqcB0W/D7Cq2bZFJc7quOYph2ENcpKXIFTXBixz7fEcEgL41gfwQLjEYuua1c8W4bWH7HfOLE07hEce8xC7BXLlOe3K79+WTr9WJzE1qi9kWtLiC05ZPounYbBa2LAO4zzdpMEcyhuf2IjxthYxIANCZO3TBYVYq93E3BsOCj3yDRghbcTJjlkj8mi6qpevCDETvUdWIl5wmIln0sEr4tf/Qk8hbJe6GKRalnyqo6TK/15ufvV4gmBU1iVjEkurE3WxZ0p4JlAn7qLmuIaGlPLB/FDRWnvVQcKpzZVY3TtRYDZ7DHeCArbszUDpErHpc2F98XHaQMB9k0WIzzb3n82GQG/PazEhx7r8t6KIbbTkCDz2UregXWfTsOF+R+50iCJefzjQtW8v84oyAD8/uRKhcHuU8LghvrzF9NAAHzFNsQDwfAIhAn33UdJgr4rsP6HtiFvTzFgDbFPMJASKxMG34NweTTu/fDrxbPqK7icTyaxTHELqywLka3LtfjVQgZ8Fn3icq2ttJkJeFaxZtTH42D30XH0ZRmFWdQmIR3kn85mfw2ozrPhudfw3/o6liDYAVmk4LP1/G3+uxj5gP3EM15NisrH951eMTUyJil7MagankRg7oaGeDxkxB9kD1eh1mJ41Pt/GH0eRR09Zan8Vdw4YPRGKlq+Q359EqLIlT7ACCxVMlZyNXY9WDdpJOhNngRDwjLkXTSY4YMxm2KOegelcsy7McY51WrV0K6HUY8hTK8N7oUxX4XmLEpXoH1d00Ne3hZbcAYKF+L9zwmxusPNn/j3+3Cqdyew1AfBu0SpL39Oo0q074B482pAtPSIFl5BA8BWD6aM2c/6EiMpTN+ZYLIX/qMqdI+P9LYtnJBe9V7QQAH80b28pPP51qjbmHdzI7F8dxDrpMtqMdVlJkO+AxA31b/LTcGivyeAGmVFrdWCQgH5ciMdkWLszcE9SkuKnaz2POnSy50nNXErAx8r8U1QAYJxRFJIgMefCilbiyHAdRLm6XXikvGvxBOtkre8D/ccMADeSgCymrkT4+UVScUpwIT3MfdSLzANhxMUKD3i38bg4dnxsltsTwA57jFTpHET3heb9g7OOKO191UoP/8UPFUaB/KvlKQdifl/mV+xUYmXtvySQTHmqr8JWeC0slMc1thNvJRUG5r8zCLn8/7gXkBab8DzlBx4/jJW6zSdCy59IhfA7eT4FhuxDGv+SdZr77fPmmqdh6MutdQAQ3xeNmV+0r6RenK3h9q9gcSNu5yXbEN7i3eGqGo/eV+kEbOMX/cig8rtfUPd6cnqMVTU3ZQD7gdd3IFZRyxVPO9/BZ21rGUta1nL2uHQ/gXsDcHlULEWwAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-puppet.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABM0lEQVRo3u2ZsUoDQRCG8ygp7Wy0UQvF1vrm38pWIYWdl50L+AjWIj6BpQgWPokPIFgIoni3e+BZhIMkGsIp6k78f/irrT5uZ+6f2V6Pon5XQdF0shcQgADLDFCr2ypz9FsHxbUpgDJHf/pcLglAgE5F7C6id6etg+JuqbpQpTKw3UYVr6XPdiwDNEHxUg+zzSQAJu/7PFeK86B4m4F4iiNZNxP6ouLgky/xGEeyagaiUnf0sajxENXtBy9Y5DRqxuP4i3XTpFP4BU5MA4yvE86MA8iAAAQgAAHYRv/fjyyo5GajxLwwF7zLqkL2Fvlv43Qhh0nG6W8NNIo1qyPlc63YsDvUF9jmWuUHAW7G27jWuLe12Bq6lZnzKwIQoANA6bE7+cARFbd8YiIAARIGoKhpvQMfmaBbJBxNpAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-python.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADaElEQVRo3u1aTWgTQRQO/ouCPxcVLxWLJDuztVj8qV68VD0InsSLB0HoRUUPIlJQctD2IDS6M7EUxAq9ecuhgkLP8R//jopaW7FNNpsW06aJZX1vs4l7MJvJkOz0kIEHCUl237fz5r3vey+hUGu1lvqVYbpuMe2SycgjsFcZRr6ApcEKYDmwKbBP8Nl4htF+M05O/LrTsUG546YROQQOJcE5W8JmwW79GOxer8R5i2unwIGipPMeo2+sWOfmQJ23h7tWQzhMu07MZzi5YBr0WClEZEBoo4ECSPHwHo8DA5WzMNy1Cd4vSoAozMTJxsAApJkertzcoH2VnYmSNc6OSOxClnXsUgSApExOe6xYuM1k9KHsWcDfqwHQIGsBqGfNDpKtcNPrglZUCgBTZioW2QFZYruMgXN5UQBWnHRaBjlXNjhTZ9JDe3dKOZ7lkX1w4YSoA40IIXA4+p/P/kCdGPo60rauDm5Dz7o8xg7KfACUK/aYHQ2tqH1ADXKgMRSh0QCclH1R5Okng3ZeGAAjP+3o0VXVs0uctKtwHm36Lt0mAMA279HDPgyTXFEEYMLd/f6aO8XIDZ/wcbJO4ADgyZ93AYwJfP9pdQCcvFYAIOEkD64dhNdLAt//4LcD3wN0PAdP/qr9+PRKPJiQYd4L/m7SD0C9VDgPMfkAdq63VDsEjdOTSEccWco1AlX3ZR33nPcDsCCc9hh5YRpEq3AjcKo+EKTXAV9/pc/5AZgSvMg73Hbcfnh9TVbESNo3vyL2UeACS+k42a8qa2HbpnodYOSZwEWeOLELqU9RzUj4FbKbAhcYcJ/+hBLKwehlvzNwRKDoRLHsq6IcWYPuri5eMB8DYaoFAImXGgA0WZuNAmVdpgCKSPVrS0gQDX6cRBGAAtYOYUWG8g1lXEnOKQWARS6B8laufQKCGoW1V2g7wlscQF62GYCNBGwoNKczLQ6gKNp+KXOjYFrrTQghbJa1AAQBAMdQjoDntAcbw0oAYCtcEsCCbbSv/VdzaJ8SADiMkOwdLXrHSV4Rj0OTgCeT2qhkCI3jOArHUh4dMdO0lFk1jO7rW+DGbxtBEXBgqGRSiSNSJww4mZN0/rnJ9W7l82IcWkNoHM9w7bY7zEZlNwn22+ExpWzzGdWUyclIiTDqeusvAq21DNZfcaGlrS+gdfYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-r.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAELElEQVRo3u1ZaUgUYRi2w4ruwO4oiqgk6o9GBUFF/QkKQrJAyjx23VUSKggK+mHgjw4oszx2vTp/JCVBWhCkBIbHzKxaaZFRZpmESpRFrUfb8+7O5rg7s/PN7o5K7Acvs7vf8T7vN++9YWGhERqjOwwFdctTLPzhFAt3yZTPl+GzAPoC+gb6DuoFdYMajFb+Pp6XTflCYmout2JUAGdkOMab8m07ALgYYD6BHAHQBwh1HQLtiS0tnaArcDCLSLEImUEArUSfcf45vJnVOgDnzuP5QyfgMiTcDYogOCwO1DNywIdRPy7OklRkW+QP8Fl0C0EA8YdUA3peBzCP8Lkcnx/j2SgaNssZvUarsJ8ZvDmvcTE2vfATcC880R2APQJDj44tbZ7ki1daTvN07NmOPadFwfqVzsaaLDzDfYJPLhRWYlG7VuA4/Ak8SUxCSdWUQO0NgqThvBoF23iWWGybK7s5qah6Bha1aAduixaZr/GXjNa6Vea8pnlSPEZr/VbMVcrwbSIV9xJADDKs4Mmw4zxuLxiG2wMchYYCIcp9rivm8G3SdVhTEeZwjJMy36uBSQupmszrD7YXqoUg691OBW/71vB5zuRkTBEQP7xiPLQhoaRhtoL+6uFKKfZsGeLhDKTuua5DN5qmQXWE3YyHdZGH8mGAesWDzvTs2pkSPtckcwboGJ/DZrBcvIoH0TMynxjKxaomioZMc+XE+DXDIW2UxAUmAJeB50lvEh4y7H0q5YXL3OfOn4ixncFdZjH4cJ9nKNmOjFrIUbvH+qmgPtAgfRlguAGTngKk5dQvENMOpf0dMvzItdrpQ6sacxi6UU8BKOXAmt/K/PlqGX6dhJ2MuIRBhS7orEKpKvzPeKf4Ts24SQYRz2DEb4ZFPj8EMFq5nQhMmzwJ4I6r2OEv0NLhRsybXYIJMWHp2a2T8eUjgxCxo+FGoT6nZNTtLejdv+zULZFaQDEU1C4ZSQEoL/J88/jtrHj7B6XMw11Fh+qhL1Nzn88ZAQG66VI9eVDdINpEjVdcwsRCxoJdSC60LdNBAPJCpZTlOnMcBfCg956pt6THI0QxFu9Ie7ldOrwBxCTuHnBESusUaEeeOP9VOudLiA5GHa1Avr6ZRQDYz3yq2IigvwdE76K03k7NL6QZR0V/7wRvzuO2aamLbRpurlJrHCCvpqXy8+VAZAfpIV7nVV+FthYiAFTEU2pMrRIqVvB7s8o+5DvcMbUYpKZSkbiBByq5il40iNp4Q7A6dCjAhSti03YEheA4tVRe06BISGkBhLlosvA8mPz0E5zd1cl2Non7As2GA+pWU6ucoarKRN6VTO4X39dJm1SYK2LogkTo3b32OxsVG2oDqmnFWBVA3H+boc+6ccwKAG+zlsHTCUE16GAKIOY7ZQzRPy30x15ohEZohEZo/DfjL4yu+PsO9Ky1AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-rails.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEAElEQVRo3u1ZWWgTURSNC4jgAuqHivsCBUUUBBdcqqioCG7kQ9vMvCzvvdgatCqCIhjFFbcq2qr1R6zLh/4Ibh9SEPRDqoKKKC6ItWKTmVRrrXvivZNpM+kinczkTZE+uGQymcyc+9695517x+VyYERlekaRWR3YB4XwYldHG9F8Nigqs8MxiQ1r7XdFYmsBfCJpvLJDgVcIJQCsQQf4NMZY3xbXeNgUlbCT8PtlVWYHwRZECJ1Y5S7qabwukRvuHvXwyWJn3+cbrIVG0oEvisSXJsLhropE5wHQU3Aukpr9FtagSvQafBbW+v3D0Xk4/gb/KxLqhEoCUxWZnkUQ2opI7Pk/QLdlf8DOKYQtgzy5GZXoErFOSHwaAHiWAfDm9hMmo/Sz399PCPCE291NlfkBfQYTNtorVabjsjvreaE+wD7XLYCswuQGoCuBwWbEJLoIZn8LnH+Qyim63DpQYA1IztuRfP8YI3jDg8wZ3EslfH7C5erSnK0w9jF8IoQvhmvfg92yBD4iBSdpM5F8+NeoxPjLUKgHzFSFeeDsLbITJjx8r8F7p1MyXwHX3AXbqz2bFAxUvQVDrfE8cLcBRBxpEsKmzCx4WMWLuGr6PY8iU7W18dmbpMDpIAU2IT/DQ7dqNGd25gk/YQwXDJHWNrysDsNGEzHnAN8DLHUHYnqs85pH5jtMgq9sDDd0AlfTMfB1q9gAXVG214HvNTIbXScV9ofjF7hP1JLgCOdmn9BDZmYf1Wnjfz95AiOBvXY6Bl7NCwzRkrj9DtTjinUYyQw657Q5yqQXHAoTHgSazEnbyGD3BVC/zNEmUC3uqj5fb2HgcddrFGTIGKhP9E2nxKwsRuBa4sJmlXVBlgoTuq5ZEpbpvF9vMnnf4CrC8Q/93H2RcR5vAiKxOXBug2nJABWWtqIynwXfY2DHxbIN4SFY+itYn4J+eZ2J5kmJM5YT9dDZzhTr3sDcTKSyYwzUUoXS0sy0PjvvOHitqyCzj5lVWbwcd16sGRyUDcHczMtEXq6Xhe+Ajr1YMzvQrOLFFurcqwqh+5rYjLCwA/HPnlhw4KHe1Hqkfy9xQjbHLTgQSe3ugZkqoT6xwg0khMV+TlxYAquEL1QJWw+Fej4ea31OiR6z2pSq8a0ZJYht2KU0HUPYavi8Z9UB7OmIStY0sDEpMAE+VRvagrtEOVBteOhvXX3a0NekFaIc2IySASTwDexx6grSjsZsvd4axKbYZQzViLugl4jCndrWXU6+uTHWCRsF1ARsu20OYBcv9eYGrTrr9Kr3+e3q7z9GUad66XQMJ2Q4pOksd97YETtfUsQ8wfGiNdB+W9+yELZbsAN8m50OYIHv6hydo3N0jv9q/AVmvEvbVQHV6wAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-riot.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAB/ElEQVRo3u2Zvy8EQRTHDw2hEYVCp1EQEeSi1Cg0um0ktzMuuzN7VFrVJf4FlURHQUQkCiUdmtPpEFFwt7NHTnd+rDf3I3d259Zp3LxkX/Jt9vbuvU/m3bw38xIJhfnZbLdLuSMIy4HKIL9Dkr5zMhYZU6IdE6YzIoh91sGgWwhigtgig5eUgrJz/YJvQESuRC1tfJ3lmoy3Tp9qzvuaKxcFUEYAUI4C8DEoBvijPrUFuKe097e6At66SubakEf5AnxnC1RCBRA0CSNMtoMWoOHL3kQNUKn6hF9oBeBRaw6efzTpC/QGge7mLWs4VPmJvaQjgPJdj7Br3zB6mt9/NNb74LN3FACVPoY68wqfD2gABLVpOI3YHZ4VgJwP1gh4/oIF4Ok5lepvfj+fzoxi+RPfuMSaCZ/+2IZWAAVjdcBN8dm64AiYdNOZMZkqQV9yW4XfECgL2etyZhAq8RXKSlw07UWoCbdoeyHYNk+17UaLKWdCUHZZl2fybcW1TVJbAOUuBAGH/fATPAAQbCiNVtg0IgBZgRU1gPAjNADQAx2HdyNrEg8AqEDtKYW/AzQAoMOgP4/Y47VDD45uVG6zin5oD1E7zfdDOxL0SvHNXAygEQD663XcAw70I6bqdZ+OE8o2h3zox6w/Bt2wVNoMuiGWtgfdscUWW2z/at93cOt0HEdUIQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-ruby.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAA5klEQVRo3u2YSw7CMAxEexROBl1FHIOjsgeJI4CyQwJCYo+dceSRuk3fa/2pum2ZjF9ue7ncT+VpedV7hIU3k/CEh0t8wB/L9bGfD+g3XM+sZ0MlvOBNJLzhoRJIeEm9qyTQT17atCIJi7LRTJ4hCaua147PLgnLhkXsgKaE9bRBLbKfEuEFwpfQEk28xBhdYpEt8SmBlpgCj5SYBo+SmAqPkJgOr5WggNdI0MBLJajgJRJ08KMSlPDScqKCH5WghO+VoIb/JxECviURBr7nTzY9fEsiDPw3iXDw7xJh4TOZTCaT8cgLAuhg8MZpgrYAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-rust.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFdUlEQVRo3u1ZfWwURRS/+IHf38ag/mHUGBMj0USDBhVRRBTED4Q/+Gg5rtpEhKiJJhr9oxo0xmg0MWCUilTEQFWwzOz2KiSn0RCrZ4pEosZEBBJt0qLUAj1pC/7e9e0xHWfmdrd7BzHd5OV2b2fevN+bmfd+8zaVSvBaIMTkWiFmlZ49byVJ8Ix3D9RKeUfqWLnSnjc2LcS0ksFS5iEDBAKG3ob7wyR0T8bTO2qjtJ9OOo4mgKfYyA8AZEZgMKQfckB5PsD/Bc/TAWgN3UPH01U1Gt5ctFDKCaUlcsQok/yI9r+VafMe6SKdpLviADBgNw/cDumxGuZ5389ubj6+pq3tNDx3OQD0sC6676oGgN1lPLoP0gvZXp/Pn1i/adNZuN8D+VtbVibQuyrndXgUv42QgmHw/Wkpl9FmhdfHpH3/xiIIGITfThKs9XF4d0pxrwixggHpekh3I/RsTXQ22HiT1w7i3UtzhDhf71OzceOtBAyyE0Zf8Z/3bW0XoO9bHJlMurclOQON+gDkpYwQ17j61WWz59YLcaqrzULfv4qWm2E5rRyp0Y/w9O+A9KnKsVyy5QyLcs2V8hzo/dKwnGi/dSPkLo6slMKaZWo7ASCDGZgfR7D+59VIOTW9YcPZw3JKLncydLeaxgSAm+POQnuZiDMSOQjD3s+0tFykLjne+Gq7fCSj52ezF1J2hJdXOeN8ctKF8a5VAsZEbWNTSF6NmXsmFO2o9f27q2C0Lr9Q+C0X9QDgrnB0AVNbbRBE9orh1fNusLRZHZ7veN493KkPCq9f4PuX4/4Pij7kBchrVmOE8NH/IV3wbjnkkAPEUiaIa4lDUe6gDR/J+0yB84rSHcqG/gKyd4nvnwRlaZshAPmyIyi8aZ0BAirExUXWikxN7WlZFZPlkXbtZKNr6cxCo0EtYX0CeZefd8cFQMQOejxLv16KQHWedwnnHOJMSwFEaO0GsD8edHN8KWdr3L04E+j4xDzfP5On2QqA6fNmVdjwn62ghXhYoSCXQv8bBq7Ur572XLxnInOYoGOOvKcdZNIJbd4+W5YlZ8GWb9TMTPyq3B54xzDIh4aTWCIAiE9R3nHsmXWGILHC5f0mw0DrKgUgOPgQjbAA+MjQvilVhh3erh08NkcE8BktC0Uew3/NLhDYd49rhj/L2VgNuwWMOyVMDrhPC107owCwRSEslxccILZoAJ43tOkvG4GU0oeewseOGMD69ec5Etm+jJSXBVwMz79a2g1A/0xXYepONOowdNzLh/lAeh3eJA7/VUkUr8FBPzn6FfhgU3C0+ZaKZ2Fo9L1JbVJ1fYcowxx25IoZUc7ATZUAwJworq5wZI5IU5IscxiAoX2wZwSzMC1cvRMHGp4FPZ0f4k0eWvRMi/+u47JJwSJ6EOlhLvZk5DoqvPe1pqybuEoFa63jDE77Lp6yoeKU6eBBkeRVriLsR1T4OI7+hoaG42Dw58XKB7FOz3vOVkeFI2+JVcQt1jSHDtl6aCvQmZnBDILsnR5Vf42UV7Ou7ZZqRIHHJhseTbSwFSQrWk68uSbF0FlHbDQAD52fJlrY0mZjq8YIxaRc7gSmHQToxRjlSgoSA5nW1iv55NWuk7wkS4tUHt/GiSio0vXphx4sqVcg401LKtPScgbO1jeh3evEr5R+/0D+LN0PFX47KlZq51JjmLhNNaUfeJ/0huzzezW+D3QG4c1SIo8qBG4L3/9VeQCICHTs5I23KoF60BomeuOhb0lVv5dRuY/p9tpgQ5eqB8ND77AMi6h1fwk84v9R+0pJhVlirtpn1kEAmsvFgSBqTSZazSA61DKmWtw9Fr4bT4GhcxRAb5OnFWoyk84cqdFr9Bq9Rq//zfUvP0xh0YaPsYkAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-sass.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFo0lEQVRo3u1Za2wUVRTGt6Lx/YyPGI0PohiNRuMT4+OHMUEkTfhjREEw1mckUeIjVo0ooFJ3Z2ZbxYD+wKRIAg02oiEr25k7Q0OIFVsjYiEoSnwAxpRAS12/c/fM9Oxl3Z0ts9CYvcnNsNM755577ne+82DMmPr4H45sU/bItra2I0a9ovl8/jCVUdd7ttfk2/5nyla9mP2YeZ5/Y3YpS73qpbyLR43ifsa/UDlqHpTbLpSNM1fRt4dMcS/j3QEllmMOlVFyHyy+F8/dxm2E81e31b3goCoeOMFV2HhNKYUBn9/x/BDPGTjglfmm/OHGoc/EgaZhzUbx3cqDonin03kKNre0VYsVpxtox1/uX9e67qhYjm1nT8D6nvB7fHd6beFiew1sXan4P5jLXMu9YiQy8e3TQtZNNVMewmezslL59YDStQfk/I4/NZKXUdfUhL9Bh+8big/g3StxoVLWMAU4apnqXXVcssovyh4LavzcUL4bMLo6EfkFH/iT5X5ZC8wvKlIeh+me3318YrB01IKIuRzv3mQxX6C5ooCTBGQi7Fv+I5FPOerj5KFjq1+E8j8lRXEUEyBvvpC9JUgFJyabFjj+kwZ0JiUhN9eaO4cCViSX8F8L5oFwTxxguxlJiw5r+y/2tPUcXSH4XQQ5LZh7hNxe13EvqxXnD4QbUUZZ1tEd73ms26AxnVaXq4Xq1C6763zc2gTc5LPMYjJq78Y3byROmcYBfhQbtsdgq1lY91eZZG6QUmgY47lcKndGTB2eYJmD+G5ytT7wuth8WzkISU6nVAPrX8Z8k+oBzEbP8m4sZ20diYlOLfWMcYD1AgXjqrsBwMDIeR6txU2vtdZeKhy6p6i2GN77t5Ey0V3C6QbJutXKcNPudcTx5Aelojf7T8h088T7D8QBNo48EiM6juQQuqy01ByjyFm2Xzxw1KYIJiABZrVx7PTtfDN7cVOnHUhEvhOC/hCHmFFFirCTIjpu82v8+ytjzaQoFhSe2gfgMyuwx1YKbni/Q6cZlvdUZFTU0YEV3A2ZE0HDtyLAnlQZCij3dCE+bM2WUmkFYReCPwnLSHJgZqmt+L2LDEEVGjtpTtPvMGEsD+zgFnbaKXwbYRb8HWTMxfPnkuUqYFqxriaFiV0iWDjKDZqDszQDLciejM3eLgpUnN9QoSM3pBihfaPwezp1MATV9sqbYjiFNcg2ulnA+gG6ARjnPtH52EVQC2FYCR4T2KKk5CbidobYAB0qUjatxrOlZd7Ty++WELtQzmVQ5hDV2oJKmyMfcfxP/0snypChh03f+2n/5nh1cXFB3kFpASzwFv9eQ+uokUUdB7EuA2yfx9Z+TRjl8fAWQoeFhV8iy+L5Dv+tL0bwW1KxOaDTBVyzhAU5FAtYxQ45R7CYXDeVsdwfwo+cEO++F0FrChlDEwbgwmk3dTo6K3ZKWoJLSHbJP3akOo4hq3F/Z0hbpkCVtOl7fIBu3qyRfy+VB2Ds7yRfEql1B6XuUeAs3AZBp4+Z6BvdSwJ0Kx2AjEFw3j8eWN5tAjI/EFuwhR8OGYQV3sAHmEX1Azv1ZnEIIoEd5PTMTnNZuZnhGmoScAJI+VgfHQy3cEPMCrIxvH2JqwdFNrkUio0V2J3JPL2C17bzAb6AoMUcoF4wekezmWEm69+FduSW0Ec4C5ioW45I1eMWUgQ9ynKLGsgcxPYxrlebeT/ef8QHSHGZ+JjB0d+CJs81KruxLHu1eE+3ND3xdoq4/s1m2cdFSj9bvCGkM83Xwy3GhsgXKG0Q1RfiwdnUVyWup9Qj+W5z2r9dKNJk8i47V17yObPUeIICFHvokLbLhYMSfKYZnr7STMJG3YAj3SMjKFdIzSKxo7lw1P5PCzlbiUZuVCJSa7Em2E1yULrKWegeTqqI7lqqLvHqoz7qoz7qoz7qI/74FxdrXO8PKptQAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-scala.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADL0lEQVRo3u1ZXYiMURgeREn5DcmFn0hJcYHyk1J+C7kZwn7nO7Mz55yZlliiJKwLKTdE4Ua4IBS5wo3yE+vChbaQELXZnZ3vZ3a2XZa1xvPuutC0zYzd883MqXnraW6m8z3Pe97zvc95v1CoAsOpkdM8Li+FTIlsKDTMqU3M85ja79jymWvLXqCnMsmGwyN8K77AtRUD2TOeLZ+AbAbI5qC7rERbI5HJLhdLUAphh8uDri0uuly+BLFvA5AdCF2BEmyLxaa6LL7Us8U2POwQcAEZvY/ft0BnkSTzoUPfobLlAcogfh9g4XeUHQ0ECyGtTQDVYwkI58IzXUDKdAGtpgtoNlmAi1fuVtME/HK5eugyVZO0rDFa3/kBCehClh+7TJ5yuNrcweomBda0hiCgBwS/eLZ6CrJXqeE5TGxqq03MzjY0DM/3TI+rDUEL+EkHDZ7mFSzDPZeJc2QZYMi2A8vQpacXIpkb7VZsFrxRPdZspG6uTwCTux1b7XCYXO1F1PxMNDqRHORQ1vR27RmbstUqj4m96PLXQPhNToIyleI+R6W4mkslAaKHQew28BH4XaD8/FITXOtwIVDrJ7Fj14HnIPG1CKIDAr7L0UYyVROdo5tgEUjqPMTZMqDFdAHNZgtA/zBaAPrBJ7N3gKuzJgroRunc8SyxXrcXCpL0e1iHK/BLkTTn44Myc1ou6cALZPgyDQl8Jjbmc6BpHp9ZSgG9/U1NNcLQ3fSYPN3vn8SWtlq1sH1nYkJRXR3mz7fjK6j+sV67PgHw7TBzt8hxYuEjIBgjD09zoXQ0OiMr5cjBrEsXFy8ilmPNOioj6r7/JOVHRY0UqVyQgDV9ltsWN/7Ol3rz7Or3khL0pRyX4mIR3WU9Lvf1lQHuCbDgr6kcBnFmOiudYCFkdB7iZBmama9TQMnnQlrvA2UabCVNF9BitgCmHpkq4DPeckebw/WjTRFAzawJOO8zuXKo45qgBdA6TX1+yRbHyDZTfwm8y/6HAPrfB6pf8jbwTyfIN+F2tY4mG/SFsiw+hsbddMXrH6Wou/RBD8SOowsr6syOpRYnrfiUQLa/GtWoRjUqOv4APIo9XCB0RaEAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-scss.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAESklEQVRo3u1Za0gUURS2h9H7TRQVRUT0JCqih1AEUYSREJUJQQRCEfQj6Ekv81dgaenMrKZSVPhji0iLpMi23J07u2aU1WrljyitSBCpoCwf23fWWblOsw93d8Zd8MJhdnfunvvdc8/7JiSYMBzFjlGyIKcwkWXhWcoE5sbnn6BOUAe+NyuS8pJJ7JoiKOnVBdUTE/p6AMQYgNoHgE9Af0GekElgfxRRuSxb5EmmA1fylCQsfh1AfvUKtD59dUrOZaYAh2qsAfDHQQC1g97iZG7hmSmL8n5SGXw/gOc5fH+I31s1/2ky9CTsufbFOPKKAKC/g0pAaXbJPi4YP5fgmoC5F3keEM4FI3R8OBklqM0P8DdkAzVZNSPC4Y//Z3O86qPrVUTHOjD94Ad4NVRhQ8QqaZEXcjzbogLc4/EMgKs7ruqyFng9bCCV5kRjLWZhU3mvFBW3CGZlei4Pz1N4nxhVbyYp67k13BExIz2GdBUdqT9neWyREc4BvIt962DtS5FIPhFMynUkf9VtdQ8xArwz3zm/R/CzsCXhH2VXUNJK/phRbtmZ6xwN/nWcCy0N3xOI8jYzwduu2IZqTrtFsSgzw/fzAvuoUZsKo8BXiVWTwd/VI2rnsY3hS1+Sj2ok34lwv9QQg5XYdvBv5MFj/T2ReoHXmg2UhGAvqb3Mn1bppCE/4EK3ROw2tboP6e8IwWZuYO4d0GxdHc+wDSa3S3bEG2o3ScyGTc2IPEFD0qVjvKuDGmGObaw3NqBIwWbsalKWCSkX4FkF+u0n/ZBxelujHUjeazLClJD+l82GAcwZNVfq9JehejcosMNRkbifDRzSLFoUjlvEZuZRcgejTKYk0DDAeotj4Xd8zuOQHCsT4mmoKW0Tt4lmCvNxtQl4jbkA/5lTpcawo2NfDXilWZoC5gvc6or4OomuAuMpt4lWBJzdcbUJT4ZnILzKiR51sMRyrFbroPgyblFeTiUkdxoPQuk4xNSwibaRfNVEgY+iKTzVWXy+rVZwL9QIXIaTOu0QHAti7zQkeVeAiKtHZShapsWGYYss7b+aQWQ3SdLUBKCagsBC+mvVbsYrdc43itB9BpxcKEAwDnQl6JHvc6C2DFKJk958H1Geor25eo90GJI7z6lMAwDtVGuBg758PujJCWyzWiClmwa+sqByiippn9TLSU04ddrrexdKt0LtMVlNAU86Ta3uQL7fm/erbcBQunM4sSMkBMPB020JqUqwTjEVJd730O0QvVchdfTMcJOFnNrU6bUQ1Wavb05+UOnnKUmYV8uroJF6387Vxel6ZSSk/sk3J1jNQO/p+ojaKMZLv+tirtvHuwTXHP49GSt+v8fZxt1Yi7LJPToTkrLJ506pTMRvz7j3tayIjY+tFBqANHdWHRRFde6xGqAS02OzDoCnCHRpB30W6V4rtosZakR1XU63qDXyfaoLYjK77B/9o3/0D1PHPz2L2TY23HpvAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-settings.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADpElEQVRo3u1ZSWgUQRQd9wU96y0i6kHcFfebCuJuZMSohzg9PUogaFf3CB6UWlpBDyoeBA+iiESMqBhFRVRQDyKauOB6FA8q7hNBzDb+mulAEruruqcqTkam4ENIOr/e6/r1//u/Y7FeWEmb1SVtmu1miO2OlcKqrT0yBABn/iJg09clQcBEbIUP+E6b2ecJGDY9EUgA0UNFA5ZK4xmG7VaInsEYDwSgXwQn8D4erx8Q7CHbD+5PpZGmC/SCt92FsHkzWAt/wybCE3zfvkNWCsB7xip9L75DVsPfHnvPNWsj0QV8VyDtYGcTiE6Ft96fxz0Qu+r9Pis1RO8mbVLFL3yONGKNPs9lTOTOV4tneAs+4Hvax1Cg/e2X5O8ZA9HphWcUh25QAKfD2gwLjyuYQC48bPqieARYnXped+j6IhHoSFl0soZrzFMbff6vCUBSuKSvOCESD/vWwBr43dm2A4/hdYEb/9m0ySYvU3WE8ZVy6BxtBKoxHgpOf0s2fRZGKiSROxeeeyXx9VVc8KKegEM3Sja8nsJ4eFh/NTV4BCSH2yKfpkPWatQ35J4gUzyNAr5zJXbuH5l06EsBiRt6LnCuxAdu0q5SaLxwCrxPJiLrUqljgyI75hIBSv0BcPJOEjrnlZsfh16T7PENTvkklytxjAdLYp3tipYy/YVZtFOgmyOk1++mzU4JWsFoubo6jUerEkhYeGzUfXURaNGRILweoigEWkudQDa5fe8o9RTtVmgkkBuHZMLrFbZGfQRDqiKAbzIRRXLZkG/vTkO1/CGulqxeWe3a9Iqke3sL9WDfFhtPLGjGI5HTbSqSlw8KROKOt5u8mGqYtNGbAhKP+KlFBg/ywxOAQX5v6RwVVkpisyEKCcs6OMyT1sE+IYy1EeDSNl/SRbHKGsOEk5nG0yDun8jkA29n9Z2AWHT1HLec41K4a4rlFZsLM7iQF0KPXmyyRGMI0YYCW8NWzwr4X3JfD3gHTwnbBmo3xJbpGNaeKdpYxSEPlcBvTbPx4WO2dwz6gFUxxUIjkxY/FQB+EoIHJWBY7mw1ve7Qef4kyAPDYkt5y5ev1uROhEx1Garscp4qE5Y7C4Be7HnPOHhto5VuJCAugy5XLlXKQsJhi/27QTzJE5NtOQ0GqVvvhztwyPvSEAXvg+gDh6xA8WGu0kRawwjmsCCrHO3z38h4TAeqS0QWlcSXSgD7xofAZ94+lgQBKH57fFLi8Vh5lVd5ldd/t/4AwcIXK86FH5kAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-shell.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABgklEQVRo3mNgGAWjYBSMgkEDpu6fyjPrxOSFM49P+QbE/wcZ/gZyG8iNOD0AVLRgEDocBYM8gc8D3wa7B4D4Kz4P/B8KeCR7YOotCB6aHjg7/eh0MRAGsYeaB/bNPTKXF6Zu0olJfLOOT9k/ZDww49jUSHS1k7ZNYp9xfMq6oRIDf4A4BV39qlWrmIHis4dMJp51bEolNn0zTkxpG0LF6OS+////M2LqnVoIlP83NOqBY1MWNexvYEHXP+vElFig/O+hUZGdmLoKqxnHJocOBQ+8m3VsqhW6/mmHpwkC5Y4Odg88BVZmOuh65x6ZLAXMH5cHfVNi+vHpCpil0ERVoPz9IdGUwKLHCIhfDqmmBFz9iamOQLlPQ7IpMeP41CCg3A8cJZQNSZjeTYlZx6emQsVIs4BK/RCKmhJAuoqQOlAlRwoe7ZGNemDUA6MeGPXAqAeo5YGvQ3psdMbxKfMHuwdAbsQ7PwAdYh+MMQFy04JFF7u5R2dyRsEoGAWjYBQMGwAAH037wgOwPegAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-sketch.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE6UlEQVRo3u1Ze6gUVRi/aZm9rOwBvY2o/6Ikih4QEpRIaS/nnnP2diUqbgZFGaF358zCpH8Uqbf3fxVhBhWkKAbXB4hF3SwyCFKSwj+kJ/nIq7szc293+n7nnMnxsnd3dmdmXWUPHNidx/d953v+vm+6ujqrs1q/Qtea4tuMe5J/4UseptmKBtECzdwFL0vrMt/hSwPJ/0greJX9O2iDRx4aP9uXYjUxGc1B8PF7FLzAM73gL/SeFZTYzfh9xOWXBjYfIAblHIUvgwd4gWdQKtwEGZoT3rIm+zZfB8KBFJsrDp8VdnWdMuz2XkymfpmuD2co+DBogjZ4j8juO+naRn2PrQ9dd1JjwpOggc3eqMLoS89mc3A/LC64AD5L1w6mEPwgaIAW+Hp2Ybbn8M/HP0cx92ZDByAii+ow/o789GFoBiYuuz2XN7PxLpThO+IBovlt7WzFnk8kPASjF8YSaG/Mc9g1lSXWlUiDzeyKLFxV6eczEiaHf32HPVRT+JGiuI0erCQyv80/1QfmHzXtQg7/2Cjtk8RBLtmtNbTPPkvKHIQqjnV1ytQ6ChqBLNzSwDsbalZYEuzVutWTAk2lueqB3tAGDRV3Umyr/ywfCPv6TqtZaZUlVFCxAxMHlJhLh51Ovw9nkEIPgxbF0301ntlP8twfl3FiqCDFS+Ezc043wbW9CrFdyD4UhDKzOkC0VDaSfGeV+0MI9tCddSrFjOsV2XV1shCz6KUdyDDapcTKcWZ8DAdU2CVDHASagcMfj2e5wGEr4DJQLEAf1YOFCVMpf18XGZ22yOfnaTPy3xQjWzyRNYyA8DHF7IOb6uIm7ibh/0JFTl6JF887h4j8ojUuXoMWYEZVvLSpd+WAg3bqosbno7YoN5XiReR/oN+waF3UUDUekfz2WIocKkt+RQQzgBTz2BFvYCISesv/SYPgS1OAzmgg0tA+5GxoBr5Ipf3pLDdoKmhCmqYi+Wss5t5K0QdQ5Nv866OHEKvNwd7LwYXeVbVF8tePcatF1hmpegJkoxh0Hgvswo06HrifofC+wkW6skd0/aDEZ2bSkR2b3tigrpzs7cwykHETCuAPY9ZenGlbSUTXRMQrjrjriP3IJRl1Z2XQgmUjFExutLXhJqZuPKCBiYLL5t9oy7AVGRxguSmgg8bCB6KMl/lCUTnaKzArdMWFZOpDzQsvDkExsGjsOst1tBJDq7tVlpJ8WYp+YKkpjFE3tir/oZYq9+wHXf7ZU+ES61wDMxo9wH71ri26zf89odszrSWTOb/Ucz0x9BQIo76WhCg2fgDWbyy4GxV/pNh9R0vHiwS2njPCOGp+JPmfybs5wjbu3DNhQXNtWevnoxi9SL6JmP+DYI4dqP481GHPKstp5LkdljguQ15TC/5WiBWxYfO9CYYBe82zJXRjnlO49rhOqkmIBxUUoA4ucMSTCdynL0q/6CvaYtxODcc7lBI/QN8Q9RET7J/hLrAYtZFr2+d7gfbnn4ISuyGw2YIa2u81vfaeaJzYNkvPdvQgtnpzLn4091ZREN/Tll9uEJiYYpvBwPiqO19biA+076cny5qshk9K0+z72AF2mCHuK6H76NS2/n6GpkRNEmKDKs/m96q5K1XwE+IjIOamBiYMket8Be23HCqkdqf+wvmAydjkNufhEJ3vu53VWZ118q3/AEVUUI0ORPpXAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-slim.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAE00lEQVRo3u1Zb2iVVRi//kkJ/WAkok2krAhCQ1h90KCGGoyoFMoit3t3t8n6ZAi61IixD6JY2D6stH9mFAVpbN37nvedA22bojJdVP5BpqhfzIWjrU03nbpuv2e9G+d9dt57z3v23u1+8MDD7t7z7/c85/l3nhOJjLEVOc78EiHK47a9q8SyLPxuB10HdYCugi6X2HYj/n4UE6K4TIiFkYluZYnEIwD7HkC1gv4FpQJSK5h6N9rYOGdcgdOG2LwGdMsAtIrugmpjdXUPZxX4mv37p2CjKtBNTWCDoE7Q3+7vTOO7QRtpH1/hJZMv4tRPxBsaHg0EHro9F4s3pdn8BugAxkWjtv1szLLyZCAFTU1TSx3nafTH40J85trHqHUwb4cSQCo1yVXXe+64w/oqQ1wL8ZcSOEnDsl5d7zjTgwikoq3tAcx/DQw1ZwIfr6+fBaZ/lvY9XXzw4DytjWBkL2BCvwL8BfS9HoZqgolCrLfJp28J+i5J+x5fK8RDeuCFyAf1KKT+CUkw286C3LLHUcANw4HM0HOR8NOuAcrg78Rs+51sA4ftPAiwX7O9D+D7NL0VyGCEOMLB4zhfCijBkfnacxzncQS639mJf1ldXT1ZXyeF2DDKOxhIPigDcAarMfYf5pU+DBakksnHFEa721CHtRggF0tAudBw4luCb2rbe7i3URmsiXqkiS8tigBYEXgxCuVc+pDMG2Hpt0986eC2BiG+mcnI/aT/AQ9SYRqoX1SVqI9iQgY7qaa5fqDOe3QQETZsF6mIqiN5UKkQyzKCJ60Q4phfPu/JbYKmBxr6zqPqMHXEEoln0qq3EJtlGxmVgmNACVOfn8YKmHw3BR837yn3Sb+vFCcST2h4tM+ZW1/HB+zzDABDJqDp1Ci3V6Ygo+kcXYo0Ty/K5v7AGfCkyvFk8jlD31+rexsLcoGB/j/J5v+W1oApnzdkQEfyh6BaMwPnR941OvnG3bKRUHQ0cZ060vdzDpnWJzcrX0N55x2ps8vU9+swYBpb8P2aLGTeKV/xBlX30hxgYEAac513tssL6HoHAxvoMVnXTXM8Hsy7MdIGNiA/S16o1jAILmaZajMPZHtZICsKOQ7Q/7Wm0R3pxxoPA0J8kz4SC/FjJIca8HzHTiCuugPLDPTq30Gz28ilu8UxOU4tUHF5hWWjL+cCA6WOs5wJ96L6mCxrKxt4NBcYoCocw1WlHPi2Zc3mGSOyvlUTCd4tesngbxHOdHdiXo85n67Yms1G6Tjw/MGy5C90Clp9jImPJ8Tz2PZOhqOf6kY6x1apKCeWjit4xCFFmaUyyDvAr2yBAXilgnHxOrgbK25vrYFUmWr5LMUmup3tk4CU1yrAd5U1NDwV/Bgd53mFPRDVhG3YZLD0PqDYqw/fl5pLBMHMfcPiC5+Fi30lNFfJvI1UUC4Mw6BWKErtw9RCVWvVDS5jevD/uod81u2Ey1wZZjRcACmdTPdAhzHfg96iGs9QsEmlJsn5fFSIRfSqgzHf8tyG0SllrjPW5qbK23yenFQ04F4Db2uO7weD28MuqKlOI8+9PwyG9E5MNdKvTCshxo3eEsDI+2TQhsDPDBWUdaJr1pmBftMrDj0AuvV+Kpt3uS8uvaA/Qb/gJvUpaD3Fmcj9dr/lTvsPu8gaPgY1Yy0AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-source.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAyklEQVRo3u3ZsQ2EMAwF0JSMcZNdMsoNkU1siTKr3AwsAA0FBUhByv/Jcf9LrskzWJFwCBdJpUzRLEf3JbqviHq7f9M8vwIi++FXdMEQyM5TEMcHIN5wMvtAEWgAHMEAQBEsAAzBBEAQbEBzRA9AU0QvwBXipwBniGaAVrcvvIkCjApgRoBHAhDfugB/BdAQCzDITVxzOAEeCdAQC9BxBgQQQEMsgAACMAG0JV9FLfcBpDVrVZnl+3+HCYvums5Hs5xKmYKiKMqQ2QB6K7/TNIEHDQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-sql.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACVElEQVRo3u1ZPUvDUBQVwY9ZBR11cRGVopsOfmy6Ce5+NG1RBPUXODgIOvnZpoI66qKTjm5im6S6OKiLglgwONVBRKjn0CeItCppElu4Dw55fe++c+9NX3LPIxUV0qT9TwvFzIZwNDUYihlz6G9qunkUillJ9O8BG3gB3hVe1Ng9bXK25ibXBuPWwPR6ot6PgKuAYQSwhusNkHUZN4p7mL5cC3xqI9kE4kWQpj0IuhDS9EnfRQWv6cYEyDI/OHqEo+Nw1FzWdGsMv3uB9sjWRTO3xejBVTXBPsc4Rxvacg3X/nJjMozBUfBwEClA+oq5nciW0bewkK0s9h8mB7nISe58PhmLkz1v5yODsx6vnjNyF7hptpMEsiWUQNa1BNTfvAv0u7WFyKU4X/1I4NvbwjjBdSUctcb5gOK93hGMJ1pYJ2ZWb2sI9jnGOdoo2xW19k9vN68S8A2SQDkmYJdQArabhcx3OCpkf5QSXsO5lCh7MYeqGPhaqChxw1FjCFp+Ff1rD4K+Jjd9fJXTSisFnDzED9h7+5PbZ3X55qkweRjhoQR2G7A/RAAJXO+AJ7X1Pg80GTV2p2wOc2usWVbhQgca+mYMjKWY1+gznC5perLNr9MefdEnfbtdB1LqGNhBne9WwOTC8bQTd3sePi78KmRvwCXu1B4dQ9+M8IwMdGt6ojUYP28c2zmtJdjnGOdyNrQ157mWHIpLKrEkIFpItJBooRLSQihWXaWihRhLuWuhtGgh0UKihSQB0UKihUQLld1Hvu+fWf9DC3nW/NBC0qT50D4AM/oAGy0i3BsAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-stata.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAUklEQVRo3u3WwQkAIAwEwXRqk+lPaxAOFDILPn0MKFxVqNW9b07qbgEAAAAAAAAAfACQHr7j2B8AAAAAAAAAADCnNW9OAwAAAAAAAACYxJJGdgC77ew3TQdwNwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-stylelint.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEsUlEQVRo3u1ZXWwUVRTeooLEvyfQF2IwRONPChh88EGIvkAIolGKYi1pd3eW0rClc+9sC0mB+7OFNib480KMEaNv9kF5IMaHxkDKX5OGxmoTnkqAKCaKiaaW/hDqObPTMjt7Z+bObLctSW9y0uz03vNz77nnnO/cRGJxLI7KjrTFWZqKsRki4lTFZBHxHcgYmSGQnUhMVcVmmCK8ExhNeWikhrGlNTXdDxhUtGfaOp+Iyz/Z2vUY8mCMPZjNfrYMDPjPKw91iGVEivJPFMrblCT89XrGHnZ+/wFz6yLzt8QHsPZ35NHUxB5NW/INP3moSwQjpqpg0Qk/Zg4dcxngED9rmOLFUDdpkc/Drv/kXosG+Jy2m07ASS0JZI4T0lSeDGGEdLnUAJsmU1TIBpJflbLYS27Cb859mvCus0+AyoEwucD7K3TdgAsrvtZQHumurZD6f1eAekq+W+IM/P1VtabO+ugRTblTBpXf+BpgELkNJo3qMHJ8eFYMMCjfrGnAKOoYHBks8SpMvKVxnOnZMiBF5dsayv+NuunFY7hosOB6HAPggp42cmxdypRb3JTJsZcxh8Q04EYDZS9ESypU7ohowE1whdowvoYl3oe5v0UzQO6IpLxB2LOw8C9NA+7Azn4aJaEVEhg/jlFL8wRuJVvlc3o7v7/jSVgwHBoNiKhHl0gSsVbFBzMrXPR9MOdDvySUtlg1uNz3kANqNO7AMOqmkYHFJc1wth/iekMm8/lDylOEEsHlAu/4GklEEi54i1bkA91CMzII7tKNyTblxGthBuAOK+eYYlMUWYW6KGTgroDwIW3GdsVYOjBTg5sR3GF/F+JCP4GJIeSpd8nM/IbpCxZKRJyLXT5Tfl7TgDtgwCsRmYsOTeYTWMtEVb42yx63I5jeKecj7w7W/LB4UO8U5Nao/J2yRWeDBtGtYwIasV7HlTCmx0BfH2soP4kZvCyYB77HwwXJn6P7v/wlboCINDDOa9TqdxstttLrgobFDSgddnqjUH2OPaWxKQPIY5aAPatWAZEiN4IapxgyyoPuWkcBJwMDg1+GL6NjIA+FCP3CM//IvUvO3/O45ZchMb991lse2DkA5v0Baf6qe75pHl9uWLINlGksxrKAuYm4FmBAv195UvZA0A4Cxn27FSZ7JjSymWxNgPLjiJ8r2uhy+3bpPeBGeGiWewIMOFDxTh12BaAE6PNR4NtwQCO71Wt5H7rp3LQbC5BzTKHIn0HlbqFtowRKY5EhY9muREWrumvnH/6czK5IWDI3501fZzcvKBIQnYlaROyGbPrW9KmAAZbCdS4GNqsqORzsPOoJpz94Tyhl8TedCvdHjwG3tbFu5YwQxNu9xjheXEPxXXZ16+k+Q4Y25/39AF0pRXmvF2ZiuxBO4TDg3ebCnPxGT8e5d95cR5mc3LurqCI98HEU1yywlxzR7N7dIPhoUJldgI9RUOMU+p8lMLMIPsKc0D7//J2CXO28bxXBTBd8HNGpl+Y3KlHR5IWZM/CRyL33wbum/UTV44aZDnzsWbCuU1pm5J+Gk/inIXt0hdNr/Re/Je6nAUpnCq10vkunzF6Y94HI7Qbh75b1WL04Fkdlx/9UjV5HU4Rn2AAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-stylus.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADQElEQVRo3u1ZSYgTQRSN4oa7iCCICB5URMWLB8GTgoJ6dQFBRFwOgxdv6iWiDqLIQPevTlfGMTAexIVxA0cGNDimuyuZgLjDoHMY3PDigjCOmRh/JXHo6XRXtYjdhaTgk8tv8l7Vr//f/5VIRLiS2eQEauvbqAPX0N6gldFKaANol0xH36Hd0SYnVFzpPCyhNjxDoBWh2fq7tEP2KAXetGEDZfBJCt5lypBI2/qmepi4Af5EO0qLdFbKTi2gjFz3IfEidvAduY4ZCGSwERw56fbrfHx2ms8JjcS/+w5oPjs7pDFtptcXCTzw+H2M/9LWQsVLgPn546n0j73M0BkrAQRxKuCC3m8ga5E1Hp9hk2nL4ybwxJ8A6W+oDQxsl08pzWBnrOBJlkwPCJ+qXejV5o36Fsh8TLP3qKM/NR3IYB1YGf/ltchqSZ7fl1B5YV7fKC5SkFOaQNqGrbJKa+SMpcoSaM/r6+VSAU6rG0K2viyE3nnPM5CSBK48T07y0T+Np4Chpu4pOFCQEcC02aUsAZNBa4gwKkEe5qpJwIK14XQ/bFeSQLKSHI8AP8jDSE+rG0YITt5CwmuV78HmMGFk9BmLlSSQyWamIMBvIfrf/SrLiqvyUyAX45POBbKQ2uQgxjJFMDcxt9/G33beD9faSrIrRBgVotc7zFiFf3wrQPd380ad+xkPjTmi3qBubyMDXqlUxlVHIg6M+AD5jt1VC/fxVOVXEgJfowNfCxU/EGWaN7YETCd6JAQ+R3Uhjwh0zeHgegCXJQQG/jn4lJVaERA2vBj18corINAlIdAdxe7fCATAyLq/U6b6sdgaFNMmvaJv+RQO/X7E2l7y9i949+GARA8dEoo5BnejaE6KQQDOW7Ao6Lvq0FasSMt8BBMFgSA988Wb8z0D2zOS3W+Nqj0M6m8HBeBbJI1MDy3SiRER8EyOXUNYrjjH+BbpVAR3TiIfrN9SI6JJG7QJdvIErwFcvGFG2i0gOzqdzmTbZkcq3KrPQBjvIikQZozCNyK2WVD9rWvoTx7qXPaST+tUmToXQwNn8Agr+F4+6FKmw+Jpsz77NDhAV2gN86zEswumx+P81UWUYpuruZqruf6P9QvciW+3aRm6WQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-sublime.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD4UlEQVRo3u1ZSWgUQRQd44IiiCuIehJ3UFEvoqDichJBxJ6qmlERD3FBUINoehlsPUSCimiIW6JxN+4ielHBjYSIQg7RoAdFIwTUxC3LzHSi7a+ayTrTNV09ndiBFDyYpmeq6v3/67//a3w+i9GoB8dFVZQLKI+quB5gdjMMQEVEQ9tMfVE/n8iIaIGJsPEf/2HTVqho0PEY+wRUlOWhzceBgrYJGCo55DkCGtZtE4AfFHuNAERFvsAZwM88SKBAxAPvPRhCV0UIhF1a+C/gjxtzGSp+bGvzZnZgWJqLvTI0tDmiSZNb8jed0wgF5kBy2AIbeeCMFHljz/oymeJw4zVRhfhtZTkFzYbvV4vOb4tAk+pf4GDzPyPZgfEiYgmeyBMNR1OS+qb2gIZXO3Dv/oQNamQjvKuEd29Z2Ch4d1SWppmZmf1pOMHzZ9F16nVpdGrLQPyKTtwk++d3qKNUaaxbh7fDQQ6hmak9oOA9wjm6U/iY8roRYPUvrmuBQpbZqYPyxXM0WpWQzXRpOBxqGd6/iKfT9EkoZI0NDSDXxFUSfwUSUy1TsyyNAsNspSk2TTXOslNGPHG4QLURwrNSGigUnA6JotRhRZprR4Ur01Tee00yWWjqeoalR2gmUtBRB/MX2SFQ407xRcOKnKPiZupkpEW47hX0wH1+GQFC4dqB69QeQlbaZFG2iKTbl1wCVCi6sKJsNPX1A5N4vEqgIv2UQgPIjC4k0EBjPwmBWoE5wikykH+pcKxD8xNR8PKwRhbDswIoATQnsd6+hPVkNEl0PVMPDuGpcEBwwu/mDmlQchHDAYj7I/CdA2EFL7Gou3LEVV+awFFhsl0w03yzVSEmWytm/UbhukvF83iVaI6DVi/H9Pn6iGye3vHAb985ay3JSo4HcKHDfrWU1kPJwikhbcaKxdo0WstMjoihu2lmmjBssAysdMVQ0WEQql0UcMiPURGCz7/TL+hwiHeIy7x3I5fggTxeGfHB6wS41yuuuLjrUcLzgNEDCNTxCFT1AAL17raT3X5HSp5y8zRowXMPE2gGAiusCejSgNilE5rLygpQWUNDB2n3BMSORxR0gkHFJ9vhVAyooA24MC6Kp9tAzsSAi9rhrC1A5qE1FW1Hk1W0HZTY3Ll2sM+jA/qJodQYvEP8mp5yehMM1rrIWkIVn2+Fhi8w0HfsPb7EoOLLDKDArYj9SVLMrMcsSG87AAq+zqCiG61Q8E0GFd9iUNBtBhXfaUH8UrgO8JH319JD72chVM6pRpnFvV5KPOJce+MNPUAHNM4h0TPiVx2/PLjxWtrhtWTK3tE7ekfv8Mb4BwzrZOuikmIGAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-svg.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFyUlEQVRo3u1ZaYgcRRRe7+CBKN4HKl5EBBMPPCLi8UOimAjSU1UTFwLq6g8j3jvT3YkDIkjQeP3wiPhjXVaRiIhJ/sT7iiDshngkHqBBVDwwqzNmenqC7Xs93V2vuqt6Z6eHZH5sw2N663j9vqp379BQn5/AsvbzHHZny2FTLYe3OsSmcAznhgb5aVb4qZ7LPwahAx3hHK4ZSOGDmnUgCDmpCO3yHSGpQCaDkZEDBg5Ay+YPESG/81eWL4jn8B3GvpXzbNVeOOHavvDhpb4tngQhJnyHP4V/4ziS5/DfIwF3e1V2Vno/juFcqEqwNt7X4cmeDnnirytuxPH+6rZrneY74l2dXuN42xGXEz1/38QH5+J1uMfEE9d5FeuMvgkPTP82GWZ86uR9vVHNYM6wR0cNz2WnF1ab1Cl90bIZ9+3yAvyF69+a/TDbCQZ9aIbX/cOHwPxfGkFTPOHv5Hb5e4XUCfWTfgiFyAqlAeHyRzO8YEwnfIYngKcg0CZ6BhAZbIcRnI7e+4hSVjAxnj0MMZ5ZZ+LpcJbcAhh2gRvgE5JReYFuza7aspNgvt4DgDru1R7cSnYeWTfR+w2ErjL/tPBpO/wyFcSMAOq4J+fg+nUD1AbY1rS+mkHkAsgVPmtXbGkfvRAwBp03Xb0EYQRgFD5UxdCepPCgAe8U8kK4OQpSaZ9tFATHIdI+mwliMJa3J2tHfHe7WlrUE4AwMYPcBj76R06gMYIIHlxyWDdjOcLLqBzKwFZ1nQBiupvJKnsA0c3TropLQbX+6fJbkzOm4mExoubz7U7+wjYYomjPIPKFZzvhdyN8+0OqvihbblHkuWIFTYk91zpbiZBhNEVjVAn126QiJhWDPS/AN15Nk++yxygvlIGm4ljZ5bnNKeIBLhyUWiOqJ+LbmcqLvK24khq4gsnhP0YgWnmLqC56A0aJbN0CyBgr0Jhni/uQ4JZexpydFDabQO3u6BB7QrP/4Xge3j8h49NgRy+Bgd7j2eyByBaaebLMHoDN3ghq4qiMMVatoyFevBmt2xiPN2xxbIpHO6gtn0e+szkaHwtGrcMzUdmxTgSgb/cLwFt5riuoXbk/ulkMOMB5H5L/027EZLIeAlLnhMU4Xa8LpsDzo6IAWngaClOXL0HCd3li/GRY69NAA6DWkWj6vPQofCH6/6BSPkLyXT4PCxfPLl9LD6vlsvlFAaxXO27iA1p40zwFVQiEtkibZVSmxOJWkqKPoP0kfFcsPgjWfC7Vlb+u3KTNP+sdgCtWyw+zSzJ5is0WN2rWcUjw/hxd33TF1QkAKFBkUsfWAtBK8jfwSPPFKB3zBZ6v9AzAt/maZK5qnTNTvoJFeHKyYJww9h/QLrQT8o0tcJN3yxMOC/lgNtQ1ADQitUbma/KZg26rarUNXabU9RsODhtfewqArhb+1775eFCJi3xX3K7obqJ2bD7hN4aNgVTqHBgA1OH93Aw54rWCbhRKSeIxNO3GSkqNhtXkkC0jRc1dOQCmtQkm2lbhQOaI7W2ndIXJb0MUflxXhIPLvJj2SaPovTcAJLQNvQKmvNTnY/pL2o+bqYtUbUJszwHgww29iER59xsApV9o3k50takr/yKvFOQACHSpfEEA4quk0NB0kps2v0aqh1gt/T5fmG0Sy7gAseBeXQ9I7pf/W8Ao3nsccPgzSYKGQQWumXYNmk75FDVAJftGNP8AGSV7H8mJLw2a4BX1Ql8qYd0RN8HYN1hu0k4drgnH5Amv1VR760jz91PFCbj8Fhj/Aehrzy1fpyaK/NdCNoCJWxfVUloNtmi60ztU9StdNWMp6fLb+pFO/4kBxdzBZudHXQSlKYVRN15Trw0fo3MCcNpnmrsWpUW0YCrqhRqow1jAKEWLzRzMdXR7aKvFs/n1Br7TWIlBan5kEulr/ASs3pL6vE8ASHXGfwL6uYvE7jf4/R5phg5fECZ9yFej77MCMPfMPXPP3LPHn/8BBnG7avPQYJsAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-swift.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD+UlEQVRo3u1ZW2wMURhedZdo3Bp3ggeJuFYiPEhECHWr2zjnzFY1QuNBE/VQ3ZmzMQQPQlwiRLxJRBBeygsSiZJ4IXgQIgiCIKKl3Z2dbY3/351tp3vrzs7ZpexJ/rSdmXP+//vPf6/HU1j/4TI9nl49GoDO5RWtGh3Tc2+gbs3gkEof64q8rMeCCKnECyDMEKeHTG1Rn7wxblUqRovyA12ljQgCf7Zo0qj8XL+vcrjOaa1ZXd3XvS+w5ZFbiBB7Lko5HatFYSNNTSuKf2746RwwgRumTypxpQw4G4R/aQeBPMVpu1YaCDa639TYiAQQKt0M794aCil1dQsq2d0JAMyJ03tmTVl/cSGvXp4M2n4a9tGFCSAUchKYBtEh3ZgknPGrCwiVnBOaK3ROVsHBYSBuSlLvDubgB6Cxu8jUUNnRbKMJ7H9oBxAlIokNe5wdiApKb9sjBv4eUuiH2DvUqNOzEXwiAPrR1LzF4vwBNA+MblmCftYVtrRTADIfnhsW4zeGn8xydgNsQxIApqGw42JDqCYNg4OfWQzQbg/GzAavHP5ut94F0MkzvgFFnp0MAPqXWS8PFQoiuEeaEDOZWBIKqHR8VBC6tasz0rOmVjWg2zNVeWIKAOjQO8WXAQqbCYc32xh9A1oXDYtsV5wQjzCSpTsvoEpjUwEAepKTjBzkbLHN7mN0HjQ+BG5ob9zzJjCx8pQK8UnT0gAwA5p3XG4KMoXQBIYKfa/zTUvAsY8lvOPscLISRFfoynQA4Ew5Z7UROOuO5BGEngKBLybaNG1Em4+LQvvSAYA9Z3Ja4EG42xafTS16BfQuyfNmCMlbYtk2eSLrQvdzXqWiQClApKMGCAgVGXz3KT9NSlSYdocgMiD2I3+dVtSx2wSDCOS3aVdIGWpNIIBQ/ntev3cG9gtiAJDvGUYTUmmo8jxhHV20Un3gFgCE6psZFmveYqvFa8C2UWBXd8kVCOgKHcR0UgqbdGvzNax73FexWlGsFM+KFHrVUYdmpfawLYxdxiGU014VmRp+eS5o8IJbM9I5q3E6eJKSxPSfqA0oE6qwwrS3lxGBoXbH5iaS1KDuge9fiIxEjou6ECfrYWNrmkPboE75avUHTeITWGJ95bxEgPZQXDh0fwtBLk3KYvQhlaDp/A0gcJTjZjKx1t5O/iF67TIkYq4g9WD7X3IgXDso6AoGEDTdsI8tMDjdDs+v278zNamfgAnF6kEY2jKo5TMh6A/oiXT2jRUCdnsRACJHj9bkbgreCg624pr97kqEOzh+QWVkWOlOx4CS2/E7ZF2dS1OB0Uar3eQ4oILkeNrg5AgkxTr0JZxEZPmPkXJPYRVWYRVWYRXWv7J+A4cxcCafZBIjAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-tcl.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADxklEQVRo3u1ZW2wMURgexDUR90TcQjRq55ztRUW0Ei8SRcSDRAiJJi7x4vKESCX6QoJou+fMqvWgiVuiXsQDSgRVSV2CEBGhKlWl7c7MdtugUh3/v3vGTtsZ8WTPxP7Jn3929+X7zvyX7z+rKP/YLEsZoodokc7pGYOTt+iKX8wMkzydk8cAutvg9B7ET+BRX4A3GNkJYLvAw4ZGrkLsBbfAv8sLOkRmxULBAp3RLXjaJqO7ITYL4JbUBPQwnQng3sNpN0FshbghmTr9wKM3Swc+WpU7HYC9A39mcvLG5HQPPH92AW8BsSdSgW+NFIxB4ADsQQfPnhbjdKHB1XOu4MGBXI004LFFGho9D8CetofJVIjPTY2UQOzzIoDFLU+b5OouAPVVZ0QVncYG+tNk5JE7iWBQmo6D4PFEgcB2J0jo/ZWihQ4kUIdvTY7T18hlANQS1+ZPgtjuyPFbcPonXMD3GqEAlQK8AA0dRT0AEqEsBZ58AfC5iTczmADICHVl+lOHkyUAdA0WahfLnwKx0QYZ09RluqaGvAo4pgUWpLfrsKyRkN9tiYHF6csoI4scAC+IedDjQaBBhrwvEWBM8NOYQuJzT4znzIEUOe7Z/xnZnP6eD/0e/EU8Mm8ypoOukepE12GkwogUjINWGvcgoDdVzx6V3tNnar6QAvuhcLfC8z4hlTuRkMHoXs/hpZFjEhQvPZIAk+z/tSmAtNQqIyOwpXoQ6IsxOleG9MFtqu5jeeFoiN9saRw7GZyA+f0H6XBdgqkboEkw6g5Im+KBwgza6kPP4tUCS9Ov9TWyDfVNZzmZCGDLU7lNV3eGSZa38iQ35dA9XK1CvS8G2Suhd9qsSMFwSJ+DXrmPc0ISAuQu+DVshb8FG7RO8VuD++mrh+RZFzm5DcWo4cKSIhBY3HE0e6xjWXd6rVmRN16OhQVvFxg5iyfuINCDrVMPkxUe6dMFBb8p/QRq1g2zFxTwi6Lf99m6BoeZx+CK46opS/qgeLuBskGAfo2KM/Gs0VNuBOz6kOWC6gqAuuMoaA6+UTzXDgIPhKXI/5QGomsFsOLEGwnRIlsawPf1gwnQ9VJdm1hlylBc0PFkOypzsrGw7b0W3s79/gRoqZS3bmLaRlEWY/pADRC8iRBqVBSueliahd21FrTAKgD6w6VouzHNpL5p1lnODKGBoi4EGnVGlyt+MNyJYUBdcoCvR3mt+Mmci7yuBQsVv1ny8jZBwJC6aP+CQIviR8sQSLu0AJ0j/vfyJwH7fhT8g+Jnw2tGJWMZy1jG/jv7BahFP1lR3DtMAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-tern.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADKklEQVRo3u1ZS2gTURSNWhf+UFyp+EHxL6IL8YMIogvrB8VPFdRqOr9KRcm895LiQn3zXgSL4sKdirgSRASRulCRiuhCcC/uRKUKpX6In9piG88bs4g1M5lqaN5ALlwmCcnMuZ9377k3iURNalJdaWTnxllMpCwqHkHfQj9Bu/FZF65vLOY9x7XdJPKyyeQJvN/RnJbzGhpujtLGCNPlk23qbfYBUnkDgF9C82X0q03FbYvILVpGxiLZ1TYR9yMYkjeZuOU4l0braQiVewAyV9YQIo9qe06slFwEkH3hBnj7tDUAB7g5BPwPk4qMtuANl88ByO8B4PtNV9ZrXWYB8l7g4UVp1Rq8TeT20OrjZlfq7v0HYQa47oUx+h5cmp0FkANhBhiZtgn6ep95vFztR/fepCV4zvlIi4jXZTswFa/wvYO2K5Y4nI9V/Ai/rasW6DrHFUsB6BA4ztUoFCJAB2DYHaf17MR/BpNM8UkgaHMNJtZYTG4w3OwKh/KFqmqoug3ust+m8hja/2k88EqBcfb8B+gSnVk8HTJjVcAVWJuJvT5FJvIkbnQdN+yE9lYUYBSSR4RR0TRRZc9JnZmqooHIrFcPsKh3ESF/hgd+qSD4XqRhB64Ph/EU5Ef4pRP8HiklIoB8D5B34YDzcIBlpsXaZJpPgWNm+wwWkTepdxivdw37gW5p4eMjpFy3GoICOVSGT1MkzyBimdPKZ1ahkYlrEaLw02bezjAa7heTajS8JpKdEcJCi/WDSr/gSFSxWyMKpyIY0K73xgIeDqUTRG7TmpGGngU0K+33RiGUut9hYpXmA41IBnofvUJvz2f4dAD9XJqFek+02swNKXUUzYZxeqcOFUcCUuedakxagy+sUf4mdkx0NVG+WGvw/iRGvcclPP/RTvPl2pdMk0q3BPic9usTJf6MMHgqI+KblRbrEnGQEqnTYxJvYyzAqxl5EPg+k3lbYwG+MLx0/sHxibc7ERdBzW8r5jeYsg7EBryRkQuKRke1z7EScZKi/8By4DeN8QKPWfb3flN0qG1ErMCr/RCowQvo8bB5Vt+y6cp6m/D5iZrUJP7yC/Oa6u7EOpFkAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-tex.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADTUlEQVRo3u1YTWhTQRCOYP1DraKgICj+gSh48Ac9CHpRTwoWvKhI0KSvibRQRBBUaA+9eBBtmzY/1loVD1JUFG/aiGhN+vYltVpRglQsoqAIUv8QNX7T7COvL+8vSTURd2BIsjM7s9/szO5sXC5BggQJEiRIkKD/mKpD8jEpxJjK1SEWw5isHbOS43dP/j6VC5iXAv8EpzX8HbbPjdVlPvA3nd57Kcgeqsa6MfAVA42eSHwxn1Th7oxOgaxFnUSy2ubUZC6v9IaVveoiXOn0hEKCJwWTyzH/jepDCibWGemRb8g/gZ97w32bddFgPeDDxg7YcdU4AdLLfW3yEsh++NoGZheaAVJQ2ZGNrNxqpFPbHJsJ+YAnEpuXawBpcKg1PqcQAFznDuRLi0tjdp77+SUF5a0GKdeBHd9ulo/d5tGxB0A1hG1dXySASvAw9zXs7kzOGrtDSotVEYeKA8D2mEYnDyIbmlS6yG3PxeLv1p/qnWo68eDZxKJCAMDhLowr4Ne6E+IF+DH4CeeEN8zi+PyYLVbWaBbMrI5ShXmXPRFlravwArPfAa53j+u9NNPZfWVwEkC7ofNBjbCe/IHB6ZAPcVtfzICOOwDIr3G9Z/apIu8EgF4zeU27vIWKmexhB279FQBwdN0pALozkNcPLIKxAvxO9Qvb/vICkLF7mtJFP97QEJ1I9UJHKXbphppKBKqkALCYJl2UPSjO1QbRPwFb7ZlU6l+gFj5vWSpKAuBAx/0ZsHPVwV2whloF7c4AuKQ5WptKAgCO60lu5Yd6LGoVcvoc1AvmRrltavw2/WkAn7Hg28SYe5PfB2k7ANA/Cb0zxveUsozXAdkfor6oIABqJ2oDIOUP9M0npv4Keb6RThwrABR1fhlOs2i/j2hOpS5nq89sX1e2nc4tOicphAWuMgJARclbcirUEauOgHejI5rbvs4k4vJ+CJP0YNGexZocfMpPhKP5nELYyUvZ74mV0OvXLWg0/aBXYwDUo21DNPyW7IzLq87+GGULrUCVnPK9yKi7pIvqnwWATnMfdiBQRn8MOG/mMm/t0Ta7rmwAOGmnOdAN/G1AuttKvGilih4rDh40j+guwOcrrZ7VsSlIkCBBggQJEiTIGf0GuKy0lx5IJIwAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-text.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAwElEQVRo3u3ZsQ2DMBCFYZeMkdEoXKSMZAY4M4MHZAYWIA0FBRYh4h2Q/E+6Gn9Gd5J1IVTSmjUx5RJTP8bUT6Iani97BEXmw08OpUGIb16PWH5A8oe7bFKEGiBHeACkCC+ADOEJkCC8AYcjaoC9I/I0xFmAGuJWgDXELXrg0DMAAADgRwGK9wCAvwLQxABoYgBMIQBMIZqYKUQTAwAAwAHgueTbqvELgNua9YPKZTfAadG9efMx5dKaNYEQQi6ZNwmT7/Ie3IpyAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-textile.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACR0lEQVRo3u2ZPWgUQRTHLzmJHkYtrEQLMX6gYKV9CguRVGKhhYVaWAn2gnCilcqBe/PmkkK0EXRIIRIC2my87Pu/XbjCICdGRcFCBQU/sPBQHAst5O687Mct5sg8eOX+5/97Mzsz+7ZQyBCooASFA0x8CQSA8B0Ey8S3C8s1bNkOo4qDIMxAoQWCbc9lDQDCXDfTgwOg8cIBOICVCGCMKUJjHIQPAwUQeuEWIbkGwtuljP+Vn0TLo17JmifyXSoVlITkKgjfEhiPnaz5eN77/fY8jDuAuBFcD9ax4mPtCcKbJQ0qREJyoleyx2P/6yrxdLDPAQfgAByAA3AADsABOAAH4AAcQJ4AULg56AC3+jZeDZtZ8wRX+Qg0xheuLKzNJMjEizG+eR9mNT6v57eBMNNF+ys0LqOCUtoZeBVjBlqNqcaG1EXyeIyJ3/ccQyOY9WZXpwF4lnfX4R+V70hRci7NEnoQq3Wi4Rtjikn1IxVtBOFnrCIRLyavjsKFBP2f+0E12G/LdtgYUwy9cH04Ge7484fnPDROd7QydbgvSX8pMYCQ7O5jg2uuo0BV7I39vEIr7Rq92yeAO+3aTdMcAeFzzOfrqQCkJltB+JLB+EvWfNJaO9RVX8vFWC+xlkPp2+6/1+rzJMaFRITkqF/2V/XSbprmiGiZ7qH1A4SzmU9J/4a/BoQzIDS67BwfQXgsWqahcKo+Vd+URNtaOwSFwyDcY+LXILwD4QkItXAy3NP3K4ZP/migg12Rinb65I8WXLhw4WJFxC/eWJs1uiNtnwAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-todo.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC+klEQVRo3u1Zy2sTQRivnkR8oxYVVNCDHvRQBRVERRRERVARVPQg3jwUQQ8e+xeozcw+k5iLR0+eBA9Bm+xMNBCxShUrqIeCxYLPGtPY9ZuY1LWZ2Vd3QpfuwI9d5vGb7/ftzuz37XR1JSUp0RXbtucZBPcaFFfg+i5y/OXtZfNIEWBQ5QZMYEsHzCNHAMEfOyIA5pElwOmlvVMQ1QeFg0e6AD/1UfEnArivEMH3HBDVB0VHBUhFIsBTgIWvTkFUHxTJIp5LAkyKrrcgqg+KZBHPKQE6wXdbENWLIEuARrSNHVnEMgTolnIOxtVMis/GToBOlFMwpt4cWzctfNJzYo2gAy2I6kWIUoBRUo8xz08bX9MpPjrrF7FJUoegb1XAUWXtsgUMAHpy+dyCNFV3w33ZrwC9iPdBv3E3fngKD9wEDDsQIu/Fj4yysfA//rKxFGKip14CmmK/ufGbBJdSNLUk8CL2CZotZBfzjMtYN1dA+zOXDaAH8NnDORV1QF0eahfy4flKLn9rmZuH7zxOreIab6FtwDHmym/hF/AkV3ruQkpeWdRCAAEvecb5+Q8Exm+B8aMe/K/T9Ha3rFDiDXhmTRtnMbUJ2p6wq2jejKVsBgEjHp5/q1naOlmx0Huj0L++jQ/qGm3NPpki3tBmPNQ5+ojwgTc2KgGfmAenc2ULaC1nBxt2epHdM8+6ex6N8PijE0CVa21BV1FbDW1DgjFD7D1mgAX/yoN/NE2UrVLDafbBaf+C4rzHuOcGQYMefcbge7Bdej4A0eFFDs8uwNcZrKkvYPyOMPlALfhkaJBttZw/3exf6I8Qxn+Hp7onbEJzP6qwoRESlNBBaP8ZgGvctNT9oTOyxq4An/lwj115yII2TiJyBNp/+eCoQnB2eMZpZZ/dN18voZ0sVA0KtnXyw2J0AgyccDF+ApKU47P6+Ar28zNg6G+O8XWTotOxOIPTKboABk86jJ8EYedjdZCoW+jyv4QEXYrlaahJlSsMyblwUpKSlPiXPw0EhFd792i8AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-twig.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADZUlEQVRo3u1ZSWgUQRQdcF9QcQeXg94EURFFBRU8uR08CB4UD3pwxYNgLioOIqiIY+yq6m00g0EvAxFFCKLiSJKu7omiGIgYNCAuGFSiqJEsRv0104kdyWS6u6pnpmUKPnRDddf7v17/ev93JFIe5fH/DMmSJqgmvqqbaEPowMcteYVGcatm4t9gz6Kp6PBQAI/R2BjNIscBdI8Nvs8OlTTw6qfnxkHEjwDQtn+A91k7TuMpJQdce6RN1Ux0FAB+ygG833QTny8J0MlkcpiWljcB8BoA1p0PuHMXEqnE6OJFu+HiXIjiGQDyzgPoAaZaaEcRMoo0WzeJAgC6/ALvpxHFNwoGnDSSmUATBAt38gJ32Ldkc3Rk4OBVSnZqFv7sE2Tv0Lsgrw2QLpUzYJGbHBHuzT8HVQQCXqHScljgAydFXuSdQ3F1EJRZDy//zgU+S7l6F3PrxYK3yFaP+TyXVbmjEH4pkjZL4IU/BIB/bzvgZu5HgTIAvxKTHskJDxT8IsQB3UJXBOV2A0z2MJ9/B3SDLHbJ13z21U4AXr4h/m8AKqVbIqIP0mCX13eBnmrgAl9VJ00bpODwkzYvg0ba7tlpoC4n98l+7sib+A5Tp0wie36ekj18DoAi5HSgKZG6MEm18G0fz/5UqDKLL326Oe5z22tQqXM0ik77qgdMfJ0///s/uFoYbVQTbfMbgHgarRPhgJ8P9oliKNNVA6/xHwD0QMwJ7F33GIzzmV4PFCQ+o9+tWtICUQ68dR95kgTJMRYOvmUcBQ6TGmfFFecmueti0U4AfMDOWpt5pDac1HVSrTRKoAOoIk/B0Qp0WWrv1j6W+jgOu+eXaGyy2PYIRQuH+NBqgDITSYqMFyD22uSH8rxgejwmfjMI+KijRmjhlBmUtWOCa1KZ5JRjwR6Vot0ZkWfglXDfwQMeOF8Juzgi0LaJLeg6bG1y0EGtdt/gWTudoi2FaxVCaoOFr7Frluc9pdeB1swyVkEaVs7BGq2sLZ6NPtY8AP4Fzj9mAdApWVX0bjMDkQWVAddoFymHgQ4nmWiD62Psnml/ll5ZhiqtHr/jYIunpdWh+pelGdL8v9EntaH7GefU9VCgbAyfAyCTbQe6mGgLFXiW9hzS+n7ooq+mpUUA/B5UWHtZsRIpj/II//gD+x/e//MEPu4AAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-typescript.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACG0lEQVRo3u2ZO0sDQRDHzweID0S7gBALX4WtlkI6CzsxKJrkgoFURgUbC8GAlYUoaGlhkyYKIdmdixEk4iewEgsfjbEWMYWFxBk443rmkhBM3JMd+EOOm3389jE7m9M0wXTOC06QZmf/CeA2yPmRTKI+VQ1ABTTJzIRQAApAASgABaAAFIAC+NYxAJduGAN6KjUaYMytFQpNdQNYMIxubOSmFvk5n7R0aA7bui+RbT6i9kMA/b8OEEwkempNgRFihurwxuMt+Mwr+ROglAA6Y1uWd0/47pyEv3N1BaD1iSPYZRWWWRPKnpby8WSzrQGAYfR5N33fApz7rGs+mEqNI6RRHwAbw9FbEkaUl4kkq0U/xg7K1TnPea98AAA7xTYA1qUJo9UC6AAbgt+lXciUFsAPMGbZwIcRw2hzDIDpG7NA3H1GKEcAYERqxw3MfsR9gAtfMjkoPQBZNBptxv2wjL4vFpA81rUiPYBQrg9n46TEwbfrCACh3SnUgyWVmHYMAFmYsQ48maGYenB+5SgAsx63OAv+TKZTKgAa5SqW07MQmVyyncTb6Dtr934xnR4R6nml1FsuAEzgTJ8zbMNLUYiyVJoZuvDQxUdIv2Py5UJfAJWUp9RbxnQ6ItwH7JQLMuZp6DmA/hO44fZIWD5c1pexIRzdTVpG5kcLuoVdo45RITHyqL9VFMBfATj+I5/6TvxXAMqUKVPWcPsA9hfAM3j5qaUAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-video.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABcUlEQVRo3u2YsUoDQRCGIwgWQbSysfARrAWLQOytrPR2lgh29j6AD6CdhVY2WoUw/0aOK+ILCFYWFnZaSUAQFKKuhacE9e72jEl2YT6Y6na4+ZaDm5lKRRAEQRBCwdqJ3OebxixoY84JeCXADiGuibletu7tdnuKgF0Cngk4zjyYFm+HHA9bSTLjWrxiXiLgqi//LfMwAS8jELCKebmo8CiOq8S8/9vXkCdgRxGauZZ768AKATdZ+d4K6GZzVgFHRfleCihjVgm4c8n3SiCK4zkCTsvkeyNAzOsE3JfNH7uAAjYIwF/zxy4w6I/SBwErAiIgAiIgAoNEL2gBDaxpY07CFUh7obQDvQ1W4HMGIOAwWIGvdzPX86awICayKI6r2pi9ombP/5n45ybCWcCbrUTfLqhXRiAZgUC30WpNu+6FGsyLBFw47YUU8zwBZwQ8pluw/4wnBVy63P53ap3OpDZmh4CuBg5kxyoIgiAIgvDBO1KHFwHMIkylAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-vim.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACKElEQVRo3u2Zv2sUQRTH4+8fqCiiiAQRxMp/Q2wUUmhhYWNjZWNjvY3thcy8udu34TxSCHIIQooIQlgwl3kv8RBEIkGQEASxs1HEn2tjY3HHm93Z2xHnC9O+/X6G3Z33vjM1FRVVj1LShASF49qeZzU9qma2DheQ4AMSfHJZqYVlZ4AS5gskKDILV0ZuCptrZev+fwAZ6wUkGCLBZ9FDGD4iw2Z3oE+PqjnPahoJNv68Rl/lALpV+ltAAhbtPKmL4ppsLiHBF1ldUEVR7AgGANfalx12v13JvG+AlGEGCb6JzFvApEh2Vv6d+gLIWF9Fgu/C76nrxbwvgIzhOhL8ENVhvdDv93d5O9CqAqSsbyDBT+E7/8Cr+aoAKeubSPBLZt48TPJkt/eWoiwAMtxyOKge1WK+LABac1tsns1jHOKe2po6VwAkc8dh5xf7G8neWrtSFwAkfVdu3iypJbWv9rZaCoAET8QNH8HTXt7bP5G5wAFAtFILyy3bOjCxwcYnQEaQ4xAPTnQy8wiwYnJzaOKjpRcABtsddA83Mht7AGDF6khjw30lAAvPe/ns0UbTifIA5kV7pX2s8XilJMBLWIPjQeRD7gD61f1n6kQwAZcjwOvOaudkUAmdGIBh06ybU8FFjDIA82ZcHhQ2gIW34/LQ0AG2cDB3JuiUegzAdoc6Z4OP2UcAvMNVde6fuCdAgnt/JQtWv0957ny8QYmKioqKioqKal6/AQbmLxbzjz26AAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-vue.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADCElEQVRo3u2Wv2sUQRTHDxEFQQsVf3RaqKU2/upELTRXiwa9u80pahMV/FEf2ij5A0wKTWwDHtzNm7lLFYyFP9DKFP7otDCFRk2KYPSM8wI5HrtvZ/d2Z3dF9sHCMvOdN2/evJn5FAq55ZZbbv+MVYRQFYCl5U8I4e6/KMS6ipQfuxrXVxbiatAcDsA1v/HoG+dg4hLdOQCkr/Nqq7VHi36tiB0pTzABnPENAOB7aWJii5//C43GVtQYEnDaPaas1EmiWSxLudu8CwBDxOHbU+PjaxjNlGERo4bsjxnGPXHrcW7d/o5ohgLL6KxSG7Rwhgy67glEyn26veMTyB9HqUOeTApxGPt8xvyuCrGXSdQNopnB2MKehQEy8AduPZPNYUM2X9VqtVUrWvzXba8NtX+fSdI23TdHytkJfZiXJ5TyJTk4D9yafiE2675vvvUs5aVuMEJcNix2tlyvb/IkUcqHRPOCJiSUlaQ8SCdyms39zCRXDIF9Od9ub8Tg9P9XP53eyUGm3A5QDcYS7VqV8hG5Vp+5s3BkcnK17ps2lUZAqb1BH+7d12OekwWORX4XzrXb27WTeVKHJea8HDME2DEc9qUBpY4y/spEM48xxH3cbhGHn6uNxnrmtqgbFsGfEYDHnndI+8Y5SMJuxn6dB5Vaq519IFt613Nems2dum+hhwUsOK3WDqZk7xHNe+4NirYLAEXi+Ke+VXYxO3Wnh+zf9lyb2ie+tERXTJ+TAD4FLsCPdwAgFO9EtTCcpIPrD1oAslRs3olRSmE46alhAVNWeCeqxeSkDvZZ450YZ4Fy0hwyCxPUCFM6w1Z5J6q5OQmZJQQnzWIbs9DRWLwT1XrlpER5J3Ipheek6UR5xxYnIcN4sgxwHFmJaa9Y5Z0kOSkV3kmSk1LjHUuctMhxUrd09AubKO8kxUmp8Y4tTkK2YWizLxXescFJyDa0tlPlnSQ4KXXesclJmfCOTU7KjHdscVKmvGOFk7LkHWuclCXv2OCkTHnHAidlzzsxOalYyC233HL7b+0v3qu/bkOTYPoAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-webpack.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFTElEQVRo3u1ZaWxUVRSuaFE0LLKplKC0CZIQlkj4QYxi9IdAUohICTFCsNgFCCSIQFh+NFEDLoGEYDvd2PlTlhCjRkFtWqG2fX1TStgCgbJIWyhVsGAQWobvzL3Xd+Z13sxbZkohvcnJ2+5yvnvPPee75yUkxKlkFFSPyyioKc3y1ezPzK9JSXhUyseFlS9k5uvFULodEpDyH+QbSN8uq/jiTWefxoyvgpL/SKXvm64kzQC3KCen9KkupXyWT5sJ5c4rRWE2v2b5/G/K5xu4n4hrJQNyMqNAm/LQFYcir2Xma2VMsbMAM52+zdta208BCFYOBJ7A/QeQiwzoT9grozpd8YXfVr8IxbcwO78BWZZWcqKnqtMBgCxLN1T0Qts1eN8qv7fB9PI+2uIfFHfF520tfQY2vJoPjmdfuMGtAPBJgOJFoZOgL+eTEGO3qM/CIPWGueiHcB1tDTYyAMNr6WOwIr8wMzyH/fF+DN2iPh6d/s4GOIMBpkVfLXsADEegp6LuaWMcrYzG9rJBX4JsY27wb2y6T3BNtGduzgDIMRMhSyAtygXDzLZn5x1NcgOglfnxXMhAZ/vFOQBVFuQeex7tCtmq/+UGQIDZ+4+4jrS/X6pGoP73xgRoOxGhh9pqDHcLVzwX7RqZDne8ALgtr3ehyEaa2cizrm8QdfkEBOVfmMNnc3bUPRc5ruhHeMDzDIBmDra/i+2FZjxnp5WUPKnq0j29E1Shg+JmaYATSM/JCfRQ7RdtrhqAyclnLrWFKAeBVVzKNQDDSxAd0KuZIsfgJd4moXsbipulFn2+Q4qSjct37RTUCJDiV14ABGecbDKMfV6hbxjsIOLDe+S7nQPQyohyKyqCFSynZzNBjC0AWcTSal8oP82YaKsN5S/DhGarvrLztNeJI4XTgaKy2n+uAXBb5YUosYzMaRFiB5c7MJfPcX3WUE5bQfTbil57BdBuA0CIObDT2AS8q1DfsToHFuRqyYx+T6WIrr5bAZCBzRsA7m2sAYgNSMEnO69uMKfP2CPv8vgAMD+YV8cGgHtuALQ5BKDkJpT8lLPK9OLDvbEiX8mjZcAuADZGpwJQZnNYbNK6waao6gZAm2sANjq3knOyn5RonileAO55BHBeEDMt2S0AWn3PAKzosw0A9cKEal+JAYD2mAKgcy0RsyiKXaC684v8L0cDgCj8NW30jpMU6OEFwF2xiUPPqDg5zSDlbETcS7KfYRHq3GdBrwF9fxg3AJLj/8wGPw4a8JbM//jDUQaZqRsaXnn9CAU8mTPSuff6PyiKWBIE6hqAoLr6l8yH34RPX8rtlmYK0XU+vjUxJf8Ue+Bokkn5i5wLGe2DdLyFBcVcMbZ7AErhBmaruygdYp1erOzDwF4RQcw/RLa/hfZraf9YtZeT5Qs9F4TSejcASOrAPN9w0DaFDigq2UsHcwLiJOMHsH/wlXMDoIF1sNuJAkzxgwDynfNUTtVwtNvHxm90kYWj8622kZ1vb1FKkLJzdtpLCkHtrtodk1wpQK8X1FtR8Jp14VysgxSH9qqJQdZTli5aO0o3yvrXotVlTqCReaM9tBIxTKHrk9HxKbahy8lWI5jgQDsAwrhhP72LS35U0ocl/BBOf2PI3iMAaLa2c30vU7zJnK2IW5FpkM2KsdKxECuyks7GoXWC367H3c49/MgbJTyNQaGJaggOVNFf+XIrO6cViKmde9gfqfyMC/mNaIbKa4ax81qAn9Sl/pPJDMIy+bcmYJGZaKJV6BQ7d1uE+wxJEwbtnOz+odi5e7Pyj6Uf3RRReUqlu3SX7tJdHq/yAFVJ3aSKI6XtAAAAAElFTkSuQmCC");
}

.file-tree-diagram-icon_type-windows.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAABqElEQVRo3u2Zu0oDQRSGV8Ub2moraKEi4gPoA2jhBYl22ZkkYGepKFqkVHwFRcUuhUhmzoSAkEK8QVoFEV9ARFtFJf7ThBTZmGQTd4Vz4GOWZXfmfHtmi+E4TohiJZ9vl0qNuETzQql1V+sDcCm0fpG5XFc4siwUWmLG9LlKTSGxBNgTRGmMD+ATFMrx5wJLqVRHVOtRfNEFSbSBJA7BFXj1SrISTRFAkm3CmCHXmBksMmfvJYgGcP0IvupJtPECKHk0m+0vlpxoV2p9hut78FGyyLl93O7hRiZek0BcqQkkuAy28dIJuAVvVS4SvIDPsrMAC7AAC7AAC7AAC7AAC/gQwAGl1wfddo5kMtnqc56y2HPJrwI4uPTUu0DxC2GhpghUE/wPsAALsAALsAALsAALsEBwApJo3FUqghe2BNGx1Pqmho5K8AJeYXtawphJoVQMUjuY8BTcgfd/IeAV9vQV13oQlZtG4rMlLaYn8B16gUqxakynSKfHULFFVG4T4xHG61A1+fxsydC3WettdMczmWHb8cS2XMO4Dy7As62ow8HBwRG6+AGz7QE6cuAnqQAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-word.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADQ0lEQVRo3u1ZW0hUQRg2ioLoClJJWT0UBVEPFdVDBfUapUF2oR7CvSoJBUL0pJBmFL0s2F7UiqiXpSi6YEGkQcXmnOOqsAT50MUo7SKV4kNl2zc7c9hpcXedsws7J87Ax5md2/7fnP82c4qKcizuoDbT6yeb8HS6QprPHdQ7Uf8KxBn0ziIlSjw+xdGqr3CF9L0Qqs4dJDchYD8wnhR2IhSAQNXFvvmeQPd2CHnME9BCECQCjGQWtEAEXKGuNZ4AOYQ/a4IK3MdzwJyg6UCeVzd3LTKLo5ej87LpcFxxjGNja61MgGKgkAS6nS36FjNgziKxxmABCZg3Yk9AP6IAAU2HR9sog4pwbLpKBKTh9UeXq0TgG4vOkwd1nwoRsLwNqENgDBgChsV2pBrXEG0bEWxOpcmLRjxBTZMB5pSYJfATydp+PHcB94R04JGwKwdS5szl66xVwogdrd3L2GTtpECg0RhPM1Jh/PvkOsQzkTB4My/oHBnU13dMM00AiV0Zm0zKkkKQPWJazTxLou+hsM4VRWxAr2MpNVlltBluTZjzmO/uBaHtVRqV6KdpuQwq257ONk0AQt2m7fQ1UpsA3tLfXn/vAhAp5ep1nr+ZSr5GsUqB7I3Q9xII8zo17HJ2hiAH+djN/I92ZxDoHTblrAzogSonN2osgPotIxenqoX6abZwdCX6/lQ3x2bxN3JGtTiwg/c1Ia3dxoW8C/1sFwy5N3mq0zoynMieUHWUQR4IkBNMMP0wvXXg4z4CnwShawVbGVUsmdOv8r5EkHK2RJYIHqmU95Xw5/osAv3mblcGS3NVob6UMeVCX/m/fdT1qZcL/arx9c9IjtEbBIEaUuZfVzKZg/FuSC6kPRDsoz1l/ussKjTIo7QMivORjfZg924Abah/F9q/UC9FY8AEid1/eSKLIa/aJwPD89kHmjwhCmyVgeFA7FuJPGGYejEZIHAutG1AMQJDVr/c/Wzx63VCrExgFMHNkZYAXtU6pmvkHM95Pqjyicnr71ksHnBkPp0Wg9hO6OBxCHCJ35aNKfmRb7KlIhyeCoFWs5s7ml6TO/QCwDIE0pUaX2QOTwGqcMz0Q+BnqP+wDAG72MUudsmp/AXnfwts4zu5jAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-xml.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACJElEQVRo3u2Xv2sUQRTH10SESAQRwSa1f4CkUFA4QcuchdnbGWz8ByyuUW5mMVtZqwRCsLO43srWEFJYKAkiKEJMLBSsBMW73T1c3+R2fmZ3k6C3l4P3hQe3772dfZ/5fZ6HQqFQKBQKhUKNTXFIFifZvJiTbJINAY4lQJ+T7wkjy9LA99KJrzvxL2A/TF/u33DeW7XijLyQMee91/88Av2wdUMu9Kztz4BvJ4/9/MXoBRlLWHAJfIOY0w/uBiHaMNr8VBEfWBsLJ+H/mEKfs8ifVY0y2sr9oQKLGifh+e3Qvx8gixZOQyyWvV83AAxr8FQV43knwNcVRWko8kDna4AsuntWF0le5TnB/tiIAYSlnF7VhUVT6uOd4CLE+0UAaYdck4XGPHgo4nLawfOtWgHAPoo1YE+NaKrP6ZqdpwF6IWlAzzf3YKADIP5OrRlOntQN8NUcdmNRb1cBJIw+HsL6p+DEfKR+w5qpFQB6eqHoCtJjretVAODb0iNGz8upZebVAfDcLdraRThZqQDIZOHGol+qE+AbDPk5Y+7Oiw+lHXpF9ez95hmYHrtlAOC7bQOLdXMwwO/ozlzCg8uuQV5yBAC9W2S+Pw2+N3lsU+z/qghGb5YBiFPVOROSwwCU3pytXa8aoGsfOPSefUqTtt2zwbOSEXhfBTpKgDRPlvanIMeMp44vKcgbFPjSkvbKDK/TxxBg0v9SolAoFAqFQqFQY9Nf+x0TMbKGx4QAAAAASUVORK5CYII=");
}

.file-tree-diagram-icon_type-yaml.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACeklEQVRo3u1Zv2sUQRQOgj9qDWipjY2oBO208EennZDCIjOTZHdmUQLqX5AihaCVwbRqaRUr/Ru0UNtoYQLBkJvdU3MpJAjn982dEE02Jnu7ezl4A48dZt773nu7b2a+YYeGpEnrT1u7bYdT7a5n2t5PtZ1LTfwKz3eQJa+tx3Md8qsr692xpaDT0Z0LtuPRtTV191jlAbetPYggbsLxLOQTpF2yEHOWPuirtMAb5s4JAM9AVioIOk/oa4a+ewo+M/EEgFo7OPqKN/Y60+4RysI0lb3cNPbsN5OcZFm0R0cPUdjnGOeoQ13a0PY/L6bFGAoF741LckB/ovafeZNcaU9PH+i5NIFBLGJ2sLf6ZCx7T6Cz6LaANXVyqap1RuxtE0AsewbL+6z9SIBSWgLhMxv73Ct7tbQSAhYx80qo7AT+2i3wed9gP3+MRTkeFrGKzn0fi07xnPg8NXWYwj7HOEcd6tKGtrvd3apKoDaRBAYugbxttB9SaBvd4SCrP4EiB9kuqUTVUpxKDDyZa6hkZPNBRYrbMO5GquInAF+oIOgFYtPHZjrNGBhLkV1o2Wv38sfk5NFtLzRgmLyMhEuJcU+hP5/q+G2q7CL6jW7p/bnQtMJYmIMOdWGTGXuPp3DehYa+GQNj6WUbzUB/H2Y6PlPXbY++6DP4LvkceM83TkpAnl/abQ9YqxPufKbcA+B/qOsg28Dn/4iSeEHHKIlbvCP7MXfRq/j0ahQd/2LMEQr7HOMcdagbbGDbwbAbchJLAsKFhAsJF9pfXMjr6MJ+4UKMZdC50IpwIeFCwoUkAeFCwoWECw3cT75/f7P2gwtV96O7Bi4kTVoN7TcYOINN+ixeaAAAAABJRU5ErkJggg==");
}

.file-tree-diagram-icon_type-yarn.file-tree-diagram-icon_style-colored {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC8UlEQVRo3u1ZSWgTURiOuydxXw7iBupBkF70KHpQQfAgFCoWqXQmiUqUenA5CPXgRRAkNW0yCVaxIubkQRGkUA9aks5M6kLRqgheFPcFRK3W8fuToQ4lHad5WwN58JM2Ifm/773v/duEQoJXJGlFwynrU7Sjf3mo2la0w1wH8L9gDuxi1RHA7ne54Mn+EKGqAX8g0bcYoIc8BBzdsK7TZ82ZwjItnVs0oQDXZ7NTdMPeBqAnwym7LZwyu73gPSTuun+3TxjwALMVdr8cYB97oRx4a2vPVOg8MU7gI0YyUxhhHiyEHG5XCt61zUrAA/gJOP/MCN6JJO1G6eD3t5trWIH/MzOiIrYf40fA0lTIJ8OLACS0S8UJJHgRQGauUxHzNU4Efsbiz2YouMQP58D5B3YC9h2VmXcHKwHcpcPKCDRneudSKcAin30XCgtU7f4q2CCjfNpUNSh1APCOUT5fYPOlg2/q7JkJx4+rMvuWpGOeZk9c1rWQ40xS1dv+5hB5MkoIwHmaY/1zXHqryCdxeU/CbJBY+xTW8wTv2jd0Y0slVZ9mgwACFI1SsqrPmBgC1vemzv7ZMi7wIUEEEFbNvTJO4JQoAgirlwSDt7fD0bAoArCC0LEJHHwVCJ7sTQAJL4HUdpeUYJ7RjfzqoKXDUcHgi4WdX+EIid2kofCo7zwJenmfSiDwuszYZiXK7as+33kZlMCwaALY4by3ScL/Z0dPtD32HpbFyWwISuCt+BMwu3XD3oMdT/pM+gbdZDptvOXzLQkS8rOP1DfXZwemVxpCG//jgI70hwDgQ4g45w6ez89jHJ07k0sPKopAyzUnhpa2t/DoEzy/2aWl8yu45YJYPDeLnjCOURLvhMx6edREsCtCpnT44Y1jOH3kPk5iAZ6j/lhoQUcyootUcjaSUGikslY3+jZVClzJ00qSEzUhRKr4Bnpb7GALAD13cwZJ4RVsAHfnHl5v4PPL2IA4tH2EpnmUpJT0xLVVW7VVW8LWX3alf1C7l0sgAAAAAElFTkSuQmCC");
}

.file-tree-diagram {
  margin: 10px 5px;
  padding: 10px 5px;
  white-space: pre;
  font-family: consolas, monospace;
  line-height: 1.2em;
  font-style: italic;
  display: flex;
}
.file-tree-diagram .file-tree-diagram-ch-list {
  transition: height 0.2s linear;
}
.file-tree-diagram .file-tree-diagram__header .file-tree-diagram-fold-switcher,
.file-tree-diagram .file-tree-diagram__header .file-tree-diagram-f-s-cap {
  font-style: normal;
  color: #999;
}
.file-tree-diagram .file-tree-diagram__header .file-tree-diagram-fold-switcher {
  cursor: pointer;
  overflow: hidden;
}
.file-tree-diagram .file-tree-diagram__header .file-tree-diagram-fold-switcher svg path {
  transition: transform 0.2s linear;
}
.file-tree-diagram .file-tree-diagram__branch {
  color: #999;
}
.file-tree-diagram .file-tree-diagram__comment {
  color: #999;
  font-weight: normal;
  font-style: normal;
}
.file-tree-diagram .file-tree-diagram__menu-container {
  z-index: -1;
  opacity: 0;
  transition: opacity 0.2s linear;
  position: relative;
  height: 15px;
}
.file-tree-diagram .file-tree-diagram__menu-container > .file-tree-diagram__burger {
  overflow: hidden;
  transition: all 0.2s linear;
  opacity: 1;
  width: 15px;
  height: 15px;
  margin-left: 10px;
}
.file-tree-diagram .file-tree-diagram__menu-container > .file-tree-diagram__menu {
  position: absolute;
  right: 0;
  top: 0;
  overflow: hidden;
  transition: all 0.2s linear;
  width: 0;
  height: 0;
}
.file-tree-diagram .file-tree-diagram__menu-container > .file-tree-diagram__menu > button,
.file-tree-diagram .file-tree-diagram__menu-container > .file-tree-diagram__menu > label {
  display: block;
  width: 100%;
}
.file-tree-diagram .file-tree-diagram__menu-container > .file-tree-diagram__menu > label {
  color: #333;
}
.file-tree-diagram .file-tree-diagram__menu-container:hover > .file-tree-diagram__burger {
  opacity: 0;
}
.file-tree-diagram .file-tree-diagram__menu-container:hover > .file-tree-diagram__menu {
  background-color: #eee;
  border: 1px solid #333;
  border-radius: 5px;
  padding: 5px;
  width: 100px;
  height: 100px;
}
.file-tree-diagram:hover .file-tree-diagram__menu-container {
  z-index: initial;
  opacity: 1;
}

/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaWxlOi8vL0Q6L0dpdEh1Yi1teS9maWxlLXRyZWUtZGlhZ3JhbS9DU1MvZmlsZS10cmVlLWRpYWdyYW0uc2NzcyIsImZpbGU6Ly8vRDovR2l0SHViLW15L2ZpbGUtdHJlZS1kaWFncmFtL0NTUy9fZm9sZGVyLWljb25zLTQ4LW1vbm8uc2NzcyIsImZpbGU6Ly8vRDovR2l0SHViLW15L2ZpbGUtdHJlZS1kaWFncmFtL0NTUy9fZm9sZGVyLWljb25zLTQ4LnNjc3MiLCJmaWxlOi8vL0Q6L0dpdEh1Yi1teS9maWxlLXRyZWUtZGlhZ3JhbS9DU1MvX3R5cGVkLWljb25zLTQ4LW1vbm8uc2NzcyIsImZpbGU6Ly8vRDovR2l0SHViLW15L2ZpbGUtdHJlZS1kaWFncmFtL0NTUy9fdHlwZWQtaWNvbnMtNDguc2NzcyIsImZpbGU6Ly8vRDovR2l0SHViLW15L2ZpbGUtdHJlZS1kaWFncmFtL0NTUy9fbWVudS1jb250YWluZXIuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtFQUNDO0VBQ0E7RUFDQTtFQUNBOzs7QUNORDtFQUFrRTs7O0FBQ2xFO0VBQWtFOzs7QUNEbEU7RUFBcUU7OztBQUNyRTtFQUFxRTs7O0FDRHJFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FBQ3RFO0VBQXNFOzs7QUFDdEU7RUFBc0U7OztBQUN0RTtFQUFzRTs7O0FDdEl0RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBQUN6RTtFQUF5RTs7O0FBQ3pFO0VBQXlFOzs7QUFDekU7RUFBeUU7OztBSnhIekU7RUFDQztFQUNBO0VBQ0E7RUFDQTtFQUVBO0VBQ0E7RUFDQTs7QUFDQTtFQUVDOztBQUdBO0FBQUE7RUFFQztFQUNBOztBQUVEO0VBQ0M7RUFFQTs7QUFFQztFQUNDOztBQUtKO0VBQ0M7O0FBRUQ7RUFDQztFQUNBO0VBQ0E7O0FLbERGO0VBQ0M7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFDQTtFQUNDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFFQTs7QUFFRDtFQUNDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBOztBQUNBO0FBQUE7RUFFQztFQUNBOztBQUVEO0VBQ0M7O0FBTUQ7RUFDQzs7QUFFRDtFQUNDO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTs7QUFLRjtFQUNDO0VBQ0EiLCJmaWxlIjoiZmlsZS10cmVlLWRpYWdyYW0uc2Nzcy5qcyJ9 */`.replaceAll(/\bfile-tree-diagram/g, clPref);

	const styleClassName = `${clPref}__theme-style`;

	const styleAlreadyExists = [].some.call(
		document.querySelectorAll(`style.${styleClassName}`), 
		(v) => v.textContent === cssCode
	);

	if (! styleAlreadyExists) {
		const style = eHTML(`<style class="${styleClassName}"></style>`);
		style.textContent = cssCode;
		document.head.appendChild(style);
	}
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

/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Menu)
/* harmony export */ });
/* harmony import */ var _TextographicBuildOptions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);
/* harmony import */ var _draw_data_tree_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _makeWC_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);




class Menu {
	constructor (cssClassPrefix="file-tree", m) {
		this.cssClassPrefix = cssClassPrefix;
		const
			CP = this.cssClassPrefix, 
			dom = (0,_makeWC_js__WEBPACK_IMPORTED_MODULE_2__.default)(
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
				text = (0,_draw_data_tree_js__WEBPACK_IMPORTED_MODULE_1__.default)(t, new _TextographicBuildOptions_js__WEBPACK_IMPORTED_MODULE_0__.default()).result;
			// console.log(text);
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

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TextographicBuildOptions)
/* harmony export */ });
class TextographicBuildOptions {
	constructor () {
		this.result = "";
		this.chProp = "ch";
	}
	addHeader (m) {
		this.result += `${ m.ch ? "(/)" : "???#???" } ${ m.name }`;
		if (m.comment) {
			const commentAlignLiner = "???".repeat((m.aLongestName - m.name.length) || 0);
			this.result += ` ${commentAlignLiner}??? ${m.comment}`;
		}
	}
	addBranchEl (type) {
		this.result += 
			type == "v" ? " ??? " :
			type == "f" ? " ??????" :
			type == "c" ? " ??????" :
			type == "e" ? "   " :
				"ERR";
	}
	endOfRow (m) {this.result += "\n";}
}

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	FileTreeDiagram = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=ftd-bundle.js.map