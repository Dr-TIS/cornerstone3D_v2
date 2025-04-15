import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    defineProperty as _defineProperty,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import MeasurementReport from "./MeasurementReport.js";
import { toArray } from "../helpers/toArray.js";
import "../helpers/downloadDICOMData.js";

var _Bidirectional;
var TID300Bidirectional = utilities.TID300.Bidirectional;
var BIDIRECTIONAL = "Bidirectional";
var LONG_AXIS = "Long Axis";
var SHORT_AXIS = "Short Axis";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(BIDIRECTIONAL);
var Bidirectional = /*#__PURE__*/ (function () {
    function Bidirectional() {
        _classCallCheck(this, Bidirectional);
    }
    return _createClass(Bidirectional, null, [
        {
            key: "getMeasurementData",
            value: function getMeasurementData(
                MeasurementGroup,
                sopInstanceUIDToImageIdMap,
                imageToWorldCoords,
                metadata
            ) {
                var _MeasurementReport$ge =
                        MeasurementReport.getSetupMeasurementData(
                            MeasurementGroup,
                            sopInstanceUIDToImageIdMap,
                            metadata,
                            Bidirectional.toolType
                        ),
                    defaultState = _MeasurementReport$ge.defaultState,
                    ReferencedFrameNumber =
                        _MeasurementReport$ge.ReferencedFrameNumber;
                var referencedImageId =
                    defaultState.annotation.metadata.referencedImageId;
                var ContentSequence = MeasurementGroup.ContentSequence;
                var longAxisNUMGroup = toArray(ContentSequence).find(function (
                    group
                ) {
                    return (
                        group.ConceptNameCodeSequence.CodeMeaning === LONG_AXIS
                    );
                });
                var longAxisSCOORDGroup = toArray(
                    longAxisNUMGroup.ContentSequence
                ).find(function (group) {
                    return group.ValueType === "SCOORD";
                });
                var shortAxisNUMGroup = toArray(ContentSequence).find(function (
                    group
                ) {
                    return (
                        group.ConceptNameCodeSequence.CodeMeaning === SHORT_AXIS
                    );
                });
                var shortAxisSCOORDGroup = toArray(
                    shortAxisNUMGroup.ContentSequence
                ).find(function (group) {
                    return group.ValueType === "SCOORD";
                });
                var worldCoords = [];
                [longAxisSCOORDGroup, shortAxisSCOORDGroup].forEach(function (
                    group
                ) {
                    var GraphicData = group.GraphicData;
                    for (var i = 0; i < GraphicData.length; i += 2) {
                        var point = imageToWorldCoords(referencedImageId, [
                            GraphicData[i],
                            GraphicData[i + 1]
                        ]);
                        worldCoords.push(point);
                    }
                });
                var state = defaultState;
                state.annotation.data = {
                    handles: {
                        points: [
                            worldCoords[0],
                            worldCoords[1],
                            worldCoords[2],
                            worldCoords[3]
                        ],
                        activeHandleIndex: 0,
                        textBox: {
                            hasMoved: false
                        }
                    },
                    cachedStats: _defineProperty(
                        {},
                        "imageId:".concat(referencedImageId),
                        {
                            length: longAxisNUMGroup.MeasuredValueSequence
                                .NumericValue,
                            width: shortAxisNUMGroup.MeasuredValueSequence
                                .NumericValue
                        }
                    ),
                    frameNumber: ReferencedFrameNumber
                };
                return state;
            }
        },
        {
            key: "getTID300RepresentationArguments",
            value: function getTID300RepresentationArguments(
                tool,
                worldToImageCoords
            ) {
                var data = tool.data,
                    finding = tool.finding,
                    findingSites = tool.findingSites,
                    metadata = tool.metadata;
                var _data$cachedStats = data.cachedStats,
                    cachedStats =
                        _data$cachedStats === void 0 ? {} : _data$cachedStats,
                    handles = data.handles;
                var referencedImageId = metadata.referencedImageId;
                if (!referencedImageId) {
                    throw new Error(
                        "Bidirectional.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var _ref =
                        cachedStats["imageId:".concat(referencedImageId)] || {},
                    length = _ref.length,
                    width = _ref.width;
                var points = handles.points;
                var firstPointPairs = [points[0], points[1]];
                var secondPointPairs = [points[2], points[3]];
                var firstPointPairsDistance = Math.sqrt(
                    Math.pow(firstPointPairs[0][0] - firstPointPairs[1][0], 2) +
                        Math.pow(
                            firstPointPairs[0][1] - firstPointPairs[1][1],
                            2
                        ) +
                        Math.pow(
                            firstPointPairs[0][2] - firstPointPairs[1][2],
                            2
                        )
                );
                var secondPointPairsDistance = Math.sqrt(
                    Math.pow(
                        secondPointPairs[0][0] - secondPointPairs[1][0],
                        2
                    ) +
                        Math.pow(
                            secondPointPairs[0][1] - secondPointPairs[1][1],
                            2
                        ) +
                        Math.pow(
                            secondPointPairs[0][2] - secondPointPairs[1][2],
                            2
                        )
                );
                var shortAxisPoints;
                var longAxisPoints;
                if (firstPointPairsDistance > secondPointPairsDistance) {
                    shortAxisPoints = firstPointPairs;
                    longAxisPoints = secondPointPairs;
                } else {
                    shortAxisPoints = secondPointPairs;
                    longAxisPoints = firstPointPairs;
                }
                var longAxisStartImage = worldToImageCoords(
                    referencedImageId,
                    shortAxisPoints[0]
                );
                var longAxisEndImage = worldToImageCoords(
                    referencedImageId,
                    shortAxisPoints[1]
                );
                var shortAxisStartImage = worldToImageCoords(
                    referencedImageId,
                    longAxisPoints[0]
                );
                var shortAxisEndImage = worldToImageCoords(
                    referencedImageId,
                    longAxisPoints[1]
                );
                return {
                    longAxis: {
                        point1: {
                            x: longAxisStartImage[0],
                            y: longAxisStartImage[1]
                        },
                        point2: {
                            x: longAxisEndImage[0],
                            y: longAxisEndImage[1]
                        }
                    },
                    shortAxis: {
                        point1: {
                            x: shortAxisStartImage[0],
                            y: shortAxisStartImage[1]
                        },
                        point2: {
                            x: shortAxisEndImage[0],
                            y: shortAxisEndImage[1]
                        }
                    },
                    longAxisLength: length,
                    shortAxisLength: width,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
_Bidirectional = Bidirectional;
_Bidirectional.toolType = BIDIRECTIONAL;
_Bidirectional.utilityToolType = BIDIRECTIONAL;
_Bidirectional.TID300Representation = TID300Bidirectional;
_Bidirectional.isValidCornerstoneTrackingIdentifier = function (
    TrackingIdentifier
) {
    if (!TrackingIdentifier.includes(":")) {
        return false;
    }
    var _TrackingIdentifier$s = TrackingIdentifier.split(":"),
        _TrackingIdentifier$s2 = _slicedToArray(_TrackingIdentifier$s, 2),
        cornerstone3DTag = _TrackingIdentifier$s2[0],
        toolType = _TrackingIdentifier$s2[1];
    if (cornerstone3DTag !== CORNERSTONE_3D_TAG) {
        return false;
    }
    return toolType === BIDIRECTIONAL;
};
MeasurementReport.registerTool(Bidirectional);

export { Bidirectional as default };
