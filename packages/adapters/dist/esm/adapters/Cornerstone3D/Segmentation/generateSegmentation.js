import { objectSpread2 as _objectSpread2 } from "../../../_virtual/_rollupPluginBabelHelpers.js";
import { normalizers, derivations } from "dcmjs";
import { fillSegmentation } from "../../Cornerstone/Segmentation_4X.js";

var Normalizer = normalizers.Normalizer;
var SegmentationDerivation = derivations.Segmentation;
function generateSegmentation(images, labelmaps, metadata) {
    var options =
        arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var segmentation = _createMultiframeSegmentationFromReferencedImages(
        images,
        metadata,
        options
    );
    return fillSegmentation(segmentation, labelmaps, options);
}
function _createMultiframeSegmentationFromReferencedImages(
    images,
    metadata,
    options
) {
    var datasets = images.map(function (image) {
        var instance = metadata.get("instance", image.imageId);
        return _objectSpread2(
            _objectSpread2(_objectSpread2({}, image), instance),
            {},
            {
                SOPClassUID: instance.SopClassUID || instance.SOPClassUID,
                SOPInstanceUID:
                    instance.SopInstanceUID || instance.SOPInstanceUID,
                PixelData: image.voxelManager.getScalarData(),
                _vrMap: {
                    PixelData: "OW"
                },
                _meta: {}
            }
        );
    });
    var multiframe = Normalizer.normalizeToDataset(datasets);
    if (!multiframe) {
        throw new Error(
            "Failed to normalize the multiframe dataset, the data is not multi-frame."
        );
    }
    return new SegmentationDerivation([multiframe], options);
}

export { generateSegmentation };
