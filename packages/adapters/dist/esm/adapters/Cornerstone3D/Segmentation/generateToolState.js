import { generateToolState as generateToolState$1 } from "../../Cornerstone/Segmentation.js";
import { createLabelmapsFromBufferInternal } from "./labelmapImagesFromBuffer.js";

function generateToolState(imageIds, arrayBuffer, metadataProvider) {
    var skipOverlapping =
        arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : false;
    var tolerance =
        arguments.length > 4 && arguments[4] !== undefined
            ? arguments[4]
            : 1e-3;
    var cs3dVersion =
        arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
    return generateToolState$1(
        imageIds,
        arrayBuffer,
        metadataProvider,
        skipOverlapping,
        tolerance,
        cs3dVersion
    );
}
function createFromDICOMSegBuffer(referencedImageIds, arrayBuffer, _ref) {
    var metadataProvider = _ref.metadataProvider,
        _ref$skipOverlapping = _ref.skipOverlapping,
        skipOverlapping =
            _ref$skipOverlapping === void 0 ? false : _ref$skipOverlapping,
        _ref$tolerance = _ref.tolerance,
        tolerance = _ref$tolerance === void 0 ? 1e-3 : _ref$tolerance;
    return createLabelmapsFromBufferInternal(
        referencedImageIds,
        arrayBuffer,
        metadataProvider,
        {
            skipOverlapping: skipOverlapping,
            tolerance: tolerance
        }
    );
}

export { createFromDICOMSegBuffer, generateToolState };
