import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    defineProperty as _defineProperty,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import MeasurementReport from "./MeasurementReport.js";

var _CobbAngle;
var TID300CobbAngle = utilities.TID300.CobbAngle;
var MEASUREMENT_TYPE = "CobbAngle";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(MEASUREMENT_TYPE);
var CobbAngle = /*#__PURE__*/ (function () {
    function CobbAngle() {
        _classCallCheck(this, CobbAngle);
    }
    return _createClass(CobbAngle, null, [
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
                            CobbAngle.toolType
                        ),
                    defaultState = _MeasurementReport$ge.defaultState,
                    NUMGroup = _MeasurementReport$ge.NUMGroup,
                    SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
                    ReferencedFrameNumber =
                        _MeasurementReport$ge.ReferencedFrameNumber;
                var referencedImageId =
                    defaultState.annotation.metadata.referencedImageId;
                var GraphicData = SCOORDGroup.GraphicData;
                var worldCoords = [];
                for (var i = 0; i < GraphicData.length; i += 2) {
                    var point = imageToWorldCoords(referencedImageId, [
                        GraphicData[i],
                        GraphicData[i + 1]
                    ]);
                    worldCoords.push(point);
                }
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
                            angle: NUMGroup
                                ? NUMGroup.MeasuredValueSequence.NumericValue
                                : null
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
                        "CobbAngle.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var start1 = worldToImageCoords(
                    referencedImageId,
                    handles.points[0]
                );
                var end1 = worldToImageCoords(
                    referencedImageId,
                    handles.points[1]
                );
                var start2 = worldToImageCoords(
                    referencedImageId,
                    handles.points[2]
                );
                var end2 = worldToImageCoords(
                    referencedImageId,
                    handles.points[3]
                );
                var point1 = {
                    x: start1[0],
                    y: start1[1]
                };
                var point2 = {
                    x: end1[0],
                    y: end1[1]
                };
                var point3 = {
                    x: start2[0],
                    y: start2[1]
                };
                var point4 = {
                    x: end2[0],
                    y: end2[1]
                };
                var _ref =
                        cachedStats["imageId:".concat(referencedImageId)] || {},
                    angle = _ref.angle;
                return {
                    point1: point1,
                    point2: point2,
                    point3: point3,
                    point4: point4,
                    rAngle: angle,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
_CobbAngle = CobbAngle;
_CobbAngle.toolType = MEASUREMENT_TYPE;
_CobbAngle.utilityToolType = MEASUREMENT_TYPE;
_CobbAngle.TID300Representation = TID300CobbAngle;
_CobbAngle.isValidCornerstoneTrackingIdentifier = function (
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
    return toolType === MEASUREMENT_TYPE;
};
MeasurementReport.registerTool(CobbAngle);

export { CobbAngle as default };
