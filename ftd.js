import BuildOptions from "./BuildOptions.js";
import assemblyTree from "./draw-data-tree.js";
import JsonErrHl    from "./json-err-hl/json-err-hl.js";
import setStyle     from "./CSS/file-tree-diagram.scss.js";
import iconManager  from "./icon-manager.js";

const version = "2.1.1";

export default class FileTree {
	constructor (classPrefix = "file-tree-diagram") {
		this.classPrefix = classPrefix;
		setStyle(classPrefix);
	}

	/**
	 * buildByTextContent (elem)
	 * build              (elem, templ)
	 * testHTML           ()
	 */

	buildByTextContent (...args) { return buildByTextContent (this, ...args); }
	build              (...args) { return build              (this, ...args); }
	testHTML           (...args) { return testHTML           (this, ...args); }
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
		elem.innerHTML = assemblyTree(
			ob, 
			new BuildOptions(self.classPrefix)
		).result;
		elem.classList.remove("executing", "executed", "exec-error");
		elem.classList.add("executed");
	} else if (jsonError) {
		const jsonHl = new JsonErrHl(`${ self.classPrefix }-json-err-hl`);
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
	return iconManager.testHTML(self.classPrefix);
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
