export default function assemblyTree(treeModel, o) {
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
			let lastChIndex = mNode[chProp].length - 1
			for (let i = 0, len = mNode[chProp].length; i < len; i++) {
				if (i < len - 1)
					recursive(depth + 1, mask+"0", mNode[chProp][i]);
				else if (i == len - 1)
					recursive(depth + 1, mask+"1", mNode[chProp][i]);
			}
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