import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    defineProperty as _defineProperty,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import MeasurementReport from "./MeasurementReport.js";

var _Angle;
var TID300CobbAngle = utilities.TID300.CobbAngle;
var MEASUREMENT_TYPE = "Angle";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(MEASUREMENT_TYPE);
var Angle = /*#__PURE__*/ (function () {
    function Angle() {
        _classCallCheck(this, Angle);
    }
    return _createClass(Angle, null, [
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
                            Angle.toolType
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
                        "Angle.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var start1 = worldToImageCoords(
                    referencedImageId,
                    handles.points[0]
                );
                var middle = worldToImageCoords(
                    referencedImageId,
                    handles.points[1]
                );
                var end = worldToImageCoords(
                    referencedImageId,
                    handles.points[2]
                );
                var point1 = {
                    x: start1[0],
                    y: start1[1]
                };
                var point2 = {
                    x: middle[0],
                    y: middle[1]
                };
                var point3 = point2;
                var point4 = {
                    x: end[0],
                    y: end[1]
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
_Angle = Angle;
_Angle.toolType = MEASUREMENT_TYPE;
_Angle.utilityToolType = MEASUREMENT_TYPE;
_Angle.TID300Representation = TID300CobbAngle;
_Angle.isValidCornerstoneTrackingIdentifier = function (TrackingIdentifier) {
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
MeasurementReport.registerTool(Angle);

export { Angle as default };
