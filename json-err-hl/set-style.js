export default function setStyle(clPref) {

	const cssCode = `
	.json-err-hl.calm-theme {
	  background-color: #222; }
	  .json-err-hl.calm-theme .json-err-hl__line-text {
	    color: #eee; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .string {
	      color: #ddc; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .string_v {
	      color: #ddc; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .string_n {
	      color: #78a; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .slashed {
	      color: #f90; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .number {
	      color: #f90; }
	    .json-err-hl.calm-theme .json-err-hl__line-text .bool {
	      color: #f90; }
	    .json-err-hl.calm-theme .json-err-hl__line-text ._null {
	      color: #98f; }

	.json-err-hl.calm-clarified-theme .json-err-hl__line .json-err-hl__line-number {
	  background-color: #444; }

	.json-err-hl.calm-clarified-theme .json-err-hl__line-text {
	  color: #eee; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .string {
	    color: #ddc; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .string_v {
	    color: #ddc; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .string_n {
	    color: #78a; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .bool {
	    color: #fb6; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .number {
	    color: #fb6; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text .slashed {
	    color: #fb6; }
	  .json-err-hl.calm-clarified-theme .json-err-hl__line-text ._null {
	    color: #98f; }

	.json-err-hl.monokai-theme {
	  background-color: #333; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .string_n {
	    color: #3bd; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .string {
	    color: #da5; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .string_v {
	    color: #da5; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .slashed {
	    color: #98f; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .number {
	    color: #98f; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text .bool {
	    color: #98f; }
	  .json-err-hl.monokai-theme .json-err-hl__line-text ._null {
	    color: #e48; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string_n {
	  color: #3bd; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string {
	  color: #da5; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .string_v {
	  color: #da5; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .slashed {
	  color: #98f; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .number {
	  color: #98f; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text .bool {
	  color: #98f; }

	.json-err-hl.monokai-clarified-theme .json-err-hl__line-text ._null {
	  color: #e48; }

	 `.replaceAll(/json-err-hl/g, clPref);

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