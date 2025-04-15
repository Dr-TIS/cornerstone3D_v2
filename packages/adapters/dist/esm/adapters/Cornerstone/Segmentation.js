import Segmentation$1 from "./Segmentation_3X.js";
import Segmentation from "./Segmentation_4X.js";

/**
 * generateSegmentation - Generates a DICOM Segmentation object given cornerstoneTools data.
 *
 * @param  {object[]} images    An array of the cornerstone image objects.
 * @param  {Object|Object[]} labelmaps3DorBrushData For 4.X: The cornerstone `Labelmap3D` object, or an array of objects.
 *                                                  For 3.X: the BrushData.
 * @param  {number} cornerstoneToolsVersion The cornerstoneTools major version to map against.
 * @returns {Object}
 */
function generateSegmentation(images, labelmaps3DorBrushData) {
    var options =
        arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {
                  includeSliceSpacing: true
              };
    var cornerstoneToolsVersion =
        arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;
    if (cornerstoneToolsVersion === 4) {
        return Segmentation.generateSegmentation(
            images,
            labelmaps3DorBrushData,
            options
        );
    }
    if (cornerstoneToolsVersion === 3) {
        return Segmentation$1.generateSegmentation(
            images,
            labelmaps3DorBrushData,
            options
        );
    }
    console.warn(
        "No generateSegmentation adapter for cornerstone version ".concat(
            cornerstoneToolsVersion,
            ", exiting."
        )
    );
}

/**
 * generateToolState - Given a set of cornerstoneTools imageIds and a Segmentation buffer,
 * derive cornerstoneTools toolState and brush metadata.
 *
 * @param  {string[]} imageIds    An array of the imageIds.
 * @param  {ArrayBuffer} arrayBuffer The SEG arrayBuffer.
 * @param {*} metadataProvider
 * @param  {boolean} skipOverlapping - skip checks for overlapping segs, default value false.
 * @param  {number} tolerance - default value 1.e-3.
 * @param  {number} cornerstoneToolsVersion - default value 4.
 *
 * @returns {Object}  The toolState and an object from which the
 *                    segment metadata can be derived.
 */
function generateToolState(imageIds, arrayBuffer, metadataProvider) {
    var skipOverlapping =
        arguments.length > 3 && arguments[3] !== undefined
            ? arguments[3]
            : false;
    var tolerance =
        arguments.length > 4 && arguments[4] !== undefined
            ? arguments[4]
            : 1e-3;
    var cornerstoneToolsVersion =
        arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 4;
    if (cornerstoneToolsVersion === 4) {
        return Segmentation.generateToolState(
            imageIds,
            arrayBuffer,
            metadataProvider,
            skipOverlapping,
            tolerance
        );
    }
    if (cornerstoneToolsVersion === 3) {
        return Segmentation$1.generateToolState(
            imageIds,
            arrayBuffer,
            metadataProvider
        );
    }
    console.warn(
        "No generateToolState adapter for cornerstone version ".concat(
            cornerstoneToolsVersion,
            ", exiting."
        )
    );
}

/**
 * fillSegmentation - Fills a derived segmentation dataset with cornerstoneTools `LabelMap3D` data.
 *
 * @param  {object[]} segmentation An empty segmentation derived dataset.
 * @param  {Object|Object[]} inputLabelmaps3D The cornerstone `Labelmap3D` object, or an array of objects.
 * @param  {Object} userOptions Options object to override default options.
 * @returns {Blob}           description
 */
function fillSegmentation(segmentation, inputLabelmaps3D) {
    var options =
        arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {
                  includeSliceSpacing: true
              };
    var cornerstoneToolsVersion =
        arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 4;
    if (cornerstoneToolsVersion === 4) {
        return Segmentation.fillSegmentation(
            segmentation,
            inputLabelmaps3D,
            options
        );
    }
    console.warn(
        "No generateSegmentation adapter for cornerstone version ".concat(
            cornerstoneToolsVersion,
            ", exiting."
        )
    );
}

export { fillSegmentation, generateSegmentation, generateToolState };
