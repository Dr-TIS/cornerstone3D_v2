import { CornerstonePMAP } from "../../Cornerstone/index.js";

var ParametricMap = CornerstonePMAP.ParametricMap;
var generateToolStateCornerstone = ParametricMap.generateToolState;
function generateToolState(imageIds, arrayBuffer, metadataProvider) {
    var skipOverlapping =
        arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : false;
    var tolerance =
        arguments.length > 4 && arguments[4] !== undefined
            ? arguments[4]
            : 1e-3;
    return generateToolStateCornerstone(
        imageIds,
        arrayBuffer,
        metadataProvider,
        skipOverlapping,
        tolerance
    );
}

export { generateToolState };
