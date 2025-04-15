import {
    asyncToGenerator as _asyncToGenerator,
    regeneratorRuntime as _regeneratorRuntime,
    toConsumableArray as _toConsumableArray
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { data, normalizers, log } from "dcmjs";
import checkOrientation from "../helpers/checkOrientation.js";
import compareArrays from "../helpers/compareArrays.js";

var DicomMessage = data.DicomMessage,
    DicomMetaDictionary = data.DicomMetaDictionary;
var Normalizer = normalizers.Normalizer;
function generateToolState(_x, _x2, _x3) {
    return _generateToolState.apply(this, arguments);
}
function _generateToolState() {
    _generateToolState = _asyncToGenerator(
        /*#__PURE__*/ _regeneratorRuntime().mark(function _callee(
            imageIds,
            arrayBuffer,
            metadataProvider
        ) {
            var tolerance,
                dicomData,
                dataset,
                multiframe,
                imagePlaneModule,
                ImageOrientationPatient,
                validOrientations,
                pixelData,
                orientation,
                sopUIDImageIdIndexMap,
                orientationText,
                imageIdMaps,
                _args = arguments;
            return _regeneratorRuntime().wrap(function _callee$(_context) {
                while (1)
                    switch ((_context.prev = _context.next)) {
                        case 0:
                            tolerance =
                                _args.length > 3 && _args[3] !== undefined
                                    ? _args[3]
                                    : 1e-3;
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
                                imageIds[0]
                            );
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
                            validOrientations = [ImageOrientationPatient];
                            pixelData = getPixelData(multiframe);
                            orientation = checkOrientation(
                                multiframe,
                                validOrientations,
                                [
                                    imagePlaneModule.rows,
                                    imagePlaneModule.columns,
                                    imageIds.length
                                ],
                                tolerance
                            );
                            sopUIDImageIdIndexMap = imageIds.reduce(function (
                                acc,
                                imageId
                            ) {
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
                            {});
                            if (!(orientation !== "Planar")) {
                                _context.next = 15;
                                break;
                            }
                            orientationText = {
                                Perpendicular: "orthogonal",
                                Oblique: "oblique"
                            };
                            throw new Error(
                                "Parametric maps ".concat(
                                    orientationText[orientation],
                                    " to the acquisition plane of the source data are not yet supported."
                                )
                            );
                        case 15:
                            imageIdMaps = imageIds.reduce(
                                function (acc, curr, index) {
                                    acc.indices[curr] = index;
                                    acc.metadata[curr] = metadataProvider.get(
                                        "instance",
                                        curr
                                    );
                                    return acc;
                                },
                                {
                                    indices: {},
                                    metadata: {}
                                }
                            );
                            _context.next = 18;
                            return insertPixelDataPlanar(
                                pixelData,
                                multiframe,
                                imageIds,
                                metadataProvider,
                                tolerance,
                                sopUIDImageIdIndexMap,
                                imageIdMaps
                            );
                        case 18:
                            return _context.abrupt("return", {
                                pixelData: pixelData
                            });
                        case 19:
                        case "end":
                            return _context.stop();
                    }
            }, _callee);
        })
    );
    return _generateToolState.apply(this, arguments);
}
function insertPixelDataPlanar(
    sourcePixelData,
    multiframe,
    imageIds,
    metadataProvider,
    tolerance,
    sopUIDImageIdIndexMap,
    imageIdMaps
) {
    var targetPixelData = new sourcePixelData.constructor(
        sourcePixelData.length
    );
    var PerFrameFunctionalGroupsSequence =
            multiframe.PerFrameFunctionalGroupsSequence,
        Rows = multiframe.Rows,
        Columns = multiframe.Columns;
    var sliceLength = Columns * Rows;
    var numSlices = PerFrameFunctionalGroupsSequence.length;
    for (var i = 0; i < numSlices; i++) {
        var sourceSliceDataView = new sourcePixelData.constructor(
            sourcePixelData.buffer,
            i * sliceLength,
            sliceLength
        );
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
                "Image not present in stack, can't import frame : " + i + "."
            );
            continue;
        }
        var sourceImageMetadata = imageIdMaps.metadata[imageId];
        if (
            Rows !== sourceImageMetadata.Rows ||
            Columns !== sourceImageMetadata.Columns
        ) {
            throw new Error(
                "Parametric map have different geometry dimensions (Rows and Columns) " +
                    "respect to the source image reference frame. This is not yet supported."
            );
        }
        var imageIdIndex = imageIdMaps.indices[imageId];
        var byteOffset =
            sliceLength * imageIdIndex * targetPixelData.BYTES_PER_ELEMENT;
        var targetSliceDataView = new targetPixelData.constructor(
            targetPixelData.buffer,
            byteOffset,
            sliceLength
        );
        targetSliceDataView.set(sourceSliceDataView);
    }
    return targetPixelData;
}
function getPixelData(multiframe) {
    var TypedArrayClass;
    var data;
    if (multiframe.PixelData) {
        var _multiframe$PixelRepr;
        var validTypedArrays =
            multiframe.BitsAllocated === 16
                ? [Uint16Array, Int16Array]
                : [Uint32Array, Int32Array];
        TypedArrayClass =
            validTypedArrays[
                (_multiframe$PixelRepr = multiframe.PixelRepresentation) !==
                    null && _multiframe$PixelRepr !== void 0
                    ? _multiframe$PixelRepr
                    : 0
            ];
        data = multiframe.PixelData;
    } else if (multiframe.FloatPixelData) {
        TypedArrayClass = Float32Array;
        data = multiframe.FloatPixelData;
    } else if (multiframe.DoubleFloatPixelData) {
        TypedArrayClass = Float64Array;
        data = multiframe.DoubleFloatPixelData;
    }
    if (data === undefined) {
        log.error("This parametric map pixel data is undefined.");
    }
    if (Array.isArray(data)) {
        data = data[0];
    }
    return new TypedArrayClass(data);
}
function findReferenceSourceImageId(
    multiframe,
    frameSegment,
    imageIds,
    metadataProvider,
    tolerance,
    sopUIDImageIdIndexMap
) {
    var imageId = undefined;
    if (!multiframe) {
        return imageId;
    }
    var FrameOfReferenceUID = multiframe.FrameOfReferenceUID,
        PerFrameFunctionalGroupsSequence =
            multiframe.PerFrameFunctionalGroupsSequence,
        SourceImageSequence = multiframe.SourceImageSequence,
        ReferencedSeriesSequence = multiframe.ReferencedSeriesSequence;
    if (
        !PerFrameFunctionalGroupsSequence ||
        PerFrameFunctionalGroupsSequence.length === 0
    ) {
        return imageId;
    }
    var PerFrameFunctionalGroup =
        PerFrameFunctionalGroupsSequence[frameSegment];
    if (!PerFrameFunctionalGroup) {
        return imageId;
    }
    var frameSourceImageSequence = undefined;
    if (PerFrameFunctionalGroup.DerivationImageSequence) {
        var DerivationImageSequence =
            PerFrameFunctionalGroup.DerivationImageSequence;
        if (Array.isArray(DerivationImageSequence)) {
            if (DerivationImageSequence.length !== 0) {
                DerivationImageSequence = DerivationImageSequence[0];
            } else {
                DerivationImageSequence = undefined;
            }
        }
        if (DerivationImageSequence) {
            frameSourceImageSequence =
                DerivationImageSequence.SourceImageSequence;
            if (Array.isArray(frameSourceImageSequence)) {
                if (frameSourceImageSequence.length !== 0) {
                    frameSourceImageSequence = frameSourceImageSequence[0];
                } else {
                    frameSourceImageSequence = undefined;
                }
            }
        }
    } else if (SourceImageSequence && SourceImageSequence.length !== 0) {
        console.warn(
            "DerivationImageSequence not present, using SourceImageSequence assuming SEG has the same geometry as the source image."
        );
        frameSourceImageSequence = SourceImageSequence[frameSegment];
    }
    if (frameSourceImageSequence) {
        imageId = getImageIdOfSourceImageBySourceImageSequence(
            frameSourceImageSequence,
            sopUIDImageIdIndexMap
        );
    }
    if (imageId === undefined && ReferencedSeriesSequence) {
        var referencedSeriesSequence = Array.isArray(ReferencedSeriesSequence)
            ? ReferencedSeriesSequence[0]
            : ReferencedSeriesSequence;
        var ReferencedSeriesInstanceUID =
            referencedSeriesSequence.SeriesInstanceUID;
        imageId = getImageIdOfSourceImagebyGeometry(
            ReferencedSeriesInstanceUID,
            FrameOfReferenceUID,
            PerFrameFunctionalGroup,
            imageIds,
            metadataProvider,
            tolerance
        );
    }
    return imageId;
}
function getImageIdOfSourceImageBySourceImageSequence(
    SourceImageSequence,
    sopUIDImageIdIndexMap
) {
    var ReferencedSOPInstanceUID = SourceImageSequence.ReferencedSOPInstanceUID,
        ReferencedFrameNumber = SourceImageSequence.ReferencedFrameNumber;
    return ReferencedFrameNumber
        ? getImageIdOfReferencedFrame(
              ReferencedSOPInstanceUID,
              ReferencedFrameNumber,
              sopUIDImageIdIndexMap
          )
        : sopUIDImageIdIndexMap[ReferencedSOPInstanceUID];
}
function getImageIdOfSourceImagebyGeometry(
    ReferencedSeriesInstanceUID,
    FrameOfReferenceUID,
    PerFrameFunctionalGroup,
    imageIds,
    metadataProvider,
    tolerance
) {
    if (
        ReferencedSeriesInstanceUID === undefined ||
        PerFrameFunctionalGroup.PlanePositionSequence === undefined ||
        PerFrameFunctionalGroup.PlanePositionSequence[0] === undefined ||
        PerFrameFunctionalGroup.PlanePositionSequence[0]
            .ImagePositionPatient === undefined
    ) {
        return undefined;
    }
    for (
        var imageIdsIndex = 0;
        imageIdsIndex < imageIds.length;
        ++imageIdsIndex
    ) {
        var sourceImageMetadata = metadataProvider.get(
            "instance",
            imageIds[imageIdsIndex]
        );
        if (
            sourceImageMetadata === undefined ||
            sourceImageMetadata.ImagePositionPatient === undefined ||
            sourceImageMetadata.FrameOfReferenceUID !== FrameOfReferenceUID ||
            sourceImageMetadata.SeriesInstanceUID !==
                ReferencedSeriesInstanceUID
        ) {
            continue;
        }
        if (
            compareArrays(
                PerFrameFunctionalGroup.PlanePositionSequence[0]
                    .ImagePositionPatient,
                sourceImageMetadata.ImagePositionPatient,
                tolerance
            )
        ) {
            return imageIds[imageIdsIndex];
        }
    }
}
function getImageIdOfReferencedFrame(
    sopInstanceUid,
    frameNumber,
    sopUIDImageIdIndexMap
) {
    var imageId = sopUIDImageIdIndexMap[sopInstanceUid];
    if (!imageId) {
        return;
    }
    var imageIdFrameNumber = Number(imageId.split("frame=")[1]);
    return imageIdFrameNumber === frameNumber - 1 ? imageId : undefined;
}
var ParametricMapObj = {
    generateToolState: generateToolState
};

export { ParametricMapObj as ParametricMap, ParametricMapObj as default };
