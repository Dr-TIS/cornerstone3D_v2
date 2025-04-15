import {
    asyncToGenerator as _asyncToGenerator,
    regeneratorRuntime as _regeneratorRuntime,
    toConsumableArray as _toConsumableArray
} from "../../../_virtual/_rollupPluginBabelHelpers.js";
import { imageLoader } from "@cornerstonejs/core";
import { data, normalizers, utilities } from "dcmjs";
import ndarray from "ndarray";
import checkOrientation from "../../helpers/checkOrientation.js";
import {
    calculateCentroid,
    checkSEGsOverlapping,
    unpackPixelData,
    getValidOrientations,
    getSegmentMetadata,
    readFromUnpackedChunks,
    alignPixelDataWithSourceData,
    getSegmentIndex,
    findReferenceSourceImageId
} from "../../Cornerstone/Segmentation_4X.js";

var DicomMessage = data.DicomMessage,
    DicomMetaDictionary = data.DicomMetaDictionary;
var Normalizer = normalizers.Normalizer;
var decode = utilities.compression.decode;
function createLabelmapsFromBufferInternal(_x, _x2, _x3, _x4) {
    return _createLabelmapsFromBufferInternal.apply(this, arguments);
}
function _createLabelmapsFromBufferInternal() {
    _createLabelmapsFromBufferInternal = _asyncToGenerator(
        /*#__PURE__*/ _regeneratorRuntime().mark(function _callee(
            referencedImageIds,
            arrayBuffer,
            metadataProvider,
            options
        ) {
            var _options$skipOverlapp,
                skipOverlapping,
                _options$tolerance,
                tolerance,
                _options$TypedArrayCo,
                TypedArrayConstructor,
                _options$maxBytesPerC,
                maxBytesPerChunk,
                dicomData,
                dataset,
                multiframe,
                imagePlaneModule,
                generalSeriesModule,
                SeriesInstanceUID,
                ImageOrientationPatient,
                validOrientations,
                segMetadata,
                TransferSyntaxUID,
                pixelData,
                pixelDataChunks,
                rleEncodedFrames,
                orientation,
                sopUIDImageIdIndexMap,
                overlapping,
                insertFunction,
                segmentsOnFrameArray,
                segmentsOnFrame,
                imageIdMaps,
                labelMapImages,
                i,
                referenceImageId,
                labelMapImage,
                segmentsPixelIndices,
                overlappingSegments,
                centroidXYZ;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1)
                    switch ((_context.prev = _context.next)) {
                        case 0:
                            (_options$skipOverlapp = options.skipOverlapping),
                                (skipOverlapping =
                                    _options$skipOverlapp === void 0
                                        ? false
                                        : _options$skipOverlapp),
                                (_options$tolerance = options.tolerance),
                                (tolerance =
                                    _options$tolerance === void 0
                                        ? 1e-3
                                        : _options$tolerance),
                                (_options$TypedArrayCo =
                                    options.TypedArrayConstructor),
                                (TypedArrayConstructor =
                                    _options$TypedArrayCo === void 0
                                        ? Uint8Array
                                        : _options$TypedArrayCo),
                                (_options$maxBytesPerC =
                                    options.maxBytesPerChunk),
                                (maxBytesPerChunk =
                                    _options$maxBytesPerC === void 0
                                        ? 199000000
                                        : _options$maxBytesPerC);
                            dicomData = DicomMessage.readFile(arrayBuffer);
                            dataset = DicomMetaDictionary.naturalizeDataset(
                                dicomData.dict
                            );
                            dataset._meta = DicomMetaDictionary.namifyDataset(
                                dicomData.meta
                            );
                            multiframe = Normalizer.normalizeToDataset([
                                dataset
                            ]);
                            imagePlaneModule = metadataProvider.get(
                                "imagePlaneModule",
                                referencedImageIds[0]
                            );
                            generalSeriesModule = metadataProvider.get(
                                "generalSeriesModule",
                                referencedImageIds[0]
                            );
                            SeriesInstanceUID =
                                generalSeriesModule.seriesInstanceUID;
                            if (!imagePlaneModule) {
                                console.warn(
                                    "Insufficient metadata, imagePlaneModule missing."
                                );
                            }
                            ImageOrientationPatient = Array.isArray(
                                imagePlaneModule.rowCosines
                            )
                                ? [].concat(
                                      _toConsumableArray(
                                          imagePlaneModule.rowCosines
                                      ),
                                      _toConsumableArray(
                                          imagePlaneModule.columnCosines
                                      )
                                  )
                                : [
                                      imagePlaneModule.rowCosines.x,
                                      imagePlaneModule.rowCosines.y,
                                      imagePlaneModule.rowCosines.z,
                                      imagePlaneModule.columnCosines.x,
                                      imagePlaneModule.columnCosines.y,
                                      imagePlaneModule.columnCosines.z
                                  ];
                            validOrientations = getValidOrientations(
                                ImageOrientationPatient
                            );
                            segMetadata = getSegmentMetadata(
                                multiframe,
                                SeriesInstanceUID
                            );
                            TransferSyntaxUID =
                                multiframe._meta.TransferSyntaxUID.Value[0];
                            if (
                                !(TransferSyntaxUID === "1.2.840.10008.1.2.5")
                            ) {
                                _context.next = 22;
                                break;
                            }
                            rleEncodedFrames = Array.isArray(
                                multiframe.PixelData
                            )
                                ? multiframe.PixelData
                                : [multiframe.PixelData];
                            pixelData = decode(
                                rleEncodedFrames,
                                multiframe.Rows,
                                multiframe.Columns
                            );
                            if (!(multiframe.BitsStored === 1)) {
                                _context.next = 19;
                                break;
                            }
                            console.warn(
                                "No implementation for rle + bit packing."
                            );
                            return _context.abrupt("return");
                        case 19:
                            pixelDataChunks = [pixelData];
                            _context.next = 25;
                            break;
                        case 22:
                            pixelDataChunks = unpackPixelData(multiframe, {
                                maxBytesPerChunk: maxBytesPerChunk
                            });
                            if (pixelDataChunks) {
                                _context.next = 25;
                                break;
                            }
                            throw new Error(
                                "Fractional segmentations are not yet supported"
                            );
                        case 25:
                            orientation = checkOrientation(
                                multiframe,
                                validOrientations,
                                [
                                    imagePlaneModule.rows,
                                    imagePlaneModule.columns,
                                    referencedImageIds.length
                                ],
                                tolerance
                            );
                            sopUIDImageIdIndexMap = referencedImageIds.reduce(
                                function (acc, imageId) {
                                    var _metadataProvider$get =
                                            metadataProvider.get(
                                                "generalImageModule",
                                                imageId
                                            ),
                                        sopInstanceUID =
                                            _metadataProvider$get.sopInstanceUID;
                                    acc[sopInstanceUID] = imageId;
                                    return acc;
                                },
                                {}
                            );
                            overlapping = false;
                            if (!skipOverlapping) {
                                overlapping = checkSEGsOverlapping(
                                    pixelDataChunks,
                                    multiframe,
                                    referencedImageIds,
                                    validOrientations,
                                    metadataProvider,
                                    tolerance,
                                    TypedArrayConstructor,
                                    sopUIDImageIdIndexMap
                                );
                            }
                            _context.t0 = orientation;
                            _context.next =
                                _context.t0 === "Planar"
                                    ? 32
                                    : _context.t0 === "Perpendicular"
                                    ? 38
                                    : _context.t0 === "Oblique"
                                    ? 39
                                    : 40;
                            break;
                        case 32:
                            if (!overlapping) {
                                _context.next = 36;
                                break;
                            }
                            throw new Error(
                                "Overlapping segmentations are not yet supported."
                            );
                        case 36:
                            insertFunction = insertPixelDataPlanar;
                        case 37:
                            return _context.abrupt("break", 40);
                        case 38:
                            throw new Error(
                                "Segmentations orthogonal to the acquisition plane of the source data are not yet supported."
                            );
                        case 39:
                            throw new Error(
                                "Segmentations oblique to the acquisition plane of the source data are not yet supported."
                            );
                        case 40:
                            segmentsOnFrameArray = [];
                            segmentsOnFrameArray[0] = [];
                            segmentsOnFrame = [];
                            imageIdMaps = {
                                indices: {},
                                metadata: {}
                            };
                            labelMapImages = [];
                            for (i = 0; i < referencedImageIds.length; i++) {
                                referenceImageId = referencedImageIds[i];
                                imageIdMaps.indices[referenceImageId] = i;
                                imageIdMaps.metadata[referenceImageId] =
                                    metadataProvider.get(
                                        "instance",
                                        referenceImageId
                                    );
                                labelMapImage =
                                    imageLoader.createAndCacheDerivedLabelmapImage(
                                        referenceImageId
                                    );
                                labelMapImages.push(labelMapImage);
                            }
                            segmentsPixelIndices = new Map();
                            _context.next = 49;
                            return insertFunction(
                                segmentsOnFrame,
                                labelMapImages,
                                pixelDataChunks,
                                multiframe,
                                referencedImageIds,
                                validOrientations,
                                metadataProvider,
                                tolerance,
                                segmentsPixelIndices,
                                sopUIDImageIdIndexMap,
                                imageIdMaps
                            );
                        case 49:
                            overlappingSegments = _context.sent;
                            centroidXYZ = new Map();
                            segmentsPixelIndices.forEach(function (
                                imageIdIndexBufferIndex,
                                segmentIndex
                            ) {
                                var centroids = calculateCentroid(
                                    imageIdIndexBufferIndex,
                                    multiframe,
                                    metadataProvider,
                                    referencedImageIds
                                );
                                centroidXYZ.set(segmentIndex, centroids);
                            });
                            return _context.abrupt("return", {
                                labelMapImages: [labelMapImages],
                                segMetadata: segMetadata,
                                segmentsOnFrame: segmentsOnFrame,
                                segmentsOnFrameArray: segmentsOnFrameArray,
                                centroids: centroidXYZ,
                                overlappingSegments: overlappingSegments
                            });
                        case 53:
                        case "end":
                            return _context.stop();
                    }
            }, _callee);
        })
    );
    return _createLabelmapsFromBufferInternal.apply(this, arguments);
}
function insertPixelDataPlanar(
    segmentsOnFrame,
    labelMapImages,
    pixelData,
    multiframe,
    imageIds,
    validOrientations,
    metadataProvider,
    tolerance,
    segmentsPixelIndices,
    sopUIDImageIdIndexMap,
    imageIdMaps
) {
    var SharedFunctionalGroupsSequence =
            multiframe.SharedFunctionalGroupsSequence,
        PerFrameFunctionalGroupsSequence =
            multiframe.PerFrameFunctionalGroupsSequence,
        Rows = multiframe.Rows,
        Columns = multiframe.Columns;
    var sharedImageOrientationPatient =
        SharedFunctionalGroupsSequence.PlaneOrientationSequence
            ? SharedFunctionalGroupsSequence.PlaneOrientationSequence
                  .ImageOrientationPatient
            : undefined;
    var sliceLength = Columns * Rows;
    var groupsLen = PerFrameFunctionalGroupsSequence.length;
    var overlapping = false;
    return new Promise(function (resolve) {
        for (var i = 0; i < groupsLen; ++i) {
            var PerFrameFunctionalGroups = PerFrameFunctionalGroupsSequence[i];
            var ImageOrientationPatientI =
                sharedImageOrientationPatient ||
                PerFrameFunctionalGroups.PlaneOrientationSequence
                    .ImageOrientationPatient;
            var view = readFromUnpackedChunks(
                pixelData,
                i * sliceLength,
                sliceLength
            );
            var pixelDataI2D = ndarray(view, [Rows, Columns]);
            var alignedPixelDataI = alignPixelDataWithSourceData(
                pixelDataI2D,
                ImageOrientationPatientI,
                validOrientations,
                tolerance
            );
            if (!alignedPixelDataI) {
                throw new Error(
                    "Individual SEG frames are out of plane with respect to the first SEG frame. " +
                        "This is not yet supported. Aborting segmentation loading."
                );
            }
            var segmentIndex = getSegmentIndex(multiframe, i);
            if (segmentIndex === undefined) {
                throw new Error(
                    "Could not retrieve the segment index. Aborting segmentation loading."
                );
            }
            if (!segmentsPixelIndices.has(segmentIndex)) {
                segmentsPixelIndices.set(segmentIndex, {});
            }
            var imageId = findReferenceSourceImageId(
                multiframe,
                i,
                imageIds,
                metadataProvider,
                tolerance,
                sopUIDImageIdIndexMap
            );
            if (!imageId) {
                console.warn(
                    "Image not present in stack, can't import frame : " +
                        i +
                        "."
                );
                continue;
            }
            var sourceImageMetadata = imageIdMaps.metadata[imageId];
            if (
                Rows !== sourceImageMetadata.Rows ||
                Columns !== sourceImageMetadata.Columns
            ) {
                throw new Error(
                    "Individual SEG frames have different geometry dimensions (Rows and Columns) " +
                        "respect to the source image reference frame. This is not yet supported. " +
                        "Aborting segmentation loading. "
                );
            }
            var imageIdIndex = imageIdMaps.indices[imageId];
            var labelmapImage = labelMapImages[imageIdIndex];
            var labelmap2DView = labelmapImage.getPixelData();
            var data = alignedPixelDataI.data;
            var indexCache = [];
            for (var j = 0, len = alignedPixelDataI.data.length; j < len; ++j) {
                if (data[j]) {
                    for (var x = j; x < len; ++x) {
                        if (data[x]) {
                            if (!overlapping && labelmap2DView[x] !== 0) {
                                overlapping = true;
                            }
                            labelmap2DView[x] = segmentIndex;
                            indexCache.push(x);
                        }
                    }
                    if (!segmentsOnFrame[imageIdIndex]) {
                        segmentsOnFrame[imageIdIndex] = [];
                    }
                    segmentsOnFrame[imageIdIndex].push(segmentIndex);
                    break;
                }
            }
            var segmentIndexObject = segmentsPixelIndices.get(segmentIndex);
            segmentIndexObject[imageIdIndex] = indexCache;
            segmentsPixelIndices.set(segmentIndex, segmentIndexObject);
        }
        resolve(overlapping);
    });
}

export { createLabelmapsFromBufferInternal, insertPixelDataPlanar };
