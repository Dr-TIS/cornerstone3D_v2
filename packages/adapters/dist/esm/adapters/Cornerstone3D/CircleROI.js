import {
    createClass as _createClass,
    defineProperty as _defineProperty,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import MeasurementReport from "./MeasurementReport.js";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import isValidCornerstoneTrackingIdentifier from "./isValidCornerstoneTrackingIdentifier.js";

var _CircleROI;
var TID300Circle = utilities.TID300.Circle;
var CIRCLEROI = "CircleROI";
var CircleROI = /*#__PURE__*/ (function () {
    function CircleROI() {
        _classCallCheck(this, CircleROI);
    }
    return _createClass(CircleROI, null, [
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
                            CircleROI.toolType
                        ),
                    defaultState = _MeasurementReport$ge.defaultState,
                    NUMGroup = _MeasurementReport$ge.NUMGroup,
                    SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
                    ReferencedFrameNumber =
                        _MeasurementReport$ge.ReferencedFrameNumber;
                var referencedImageId =
                    defaultState.annotation.metadata.referencedImageId;
                var GraphicData = SCOORDGroup.GraphicData;
                var pointsWorld = [];
                for (var i = 0; i < GraphicData.length; i += 2) {
                    var worldPos = imageToWorldCoords(referencedImageId, [
                        GraphicData[i],
                        GraphicData[i + 1]
                    ]);
                    pointsWorld.push(worldPos);
                }
                var state = defaultState;
                state.annotation.data = {
                    handles: {
                        points: [].concat(pointsWorld),
                        activeHandleIndex: 0,
                        textBox: {
                            hasMoved: false
                        }
                    },
                    cachedStats: _defineProperty(
                        {},
                        "imageId:".concat(referencedImageId),
                        {
                            area: NUMGroup
                                ? NUMGroup.MeasuredValueSequence.NumericValue
                                : 0,
                            radius: 0,
                            perimeter: 0
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
                        "CircleROI.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var center = worldToImageCoords(
                    referencedImageId,
                    handles.points[0]
                );
                var end = worldToImageCoords(
                    referencedImageId,
                    handles.points[1]
                );
                var points = [];
                points.push({
                    x: center[0],
                    y: center[1]
                });
                points.push({
                    x: end[0],
                    y: end[1]
                });
                var _ref =
                        cachedStats["imageId:".concat(referencedImageId)] || {},
                    area = _ref.area,
                    radius = _ref.radius;
                var perimeter = 2 * Math.PI * radius;
                return {
                    area: area,
                    perimeter: perimeter,
                    radius: radius,
                    points: points,
                    trackingIdentifierTextValue:
                        this.trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
_CircleROI = CircleROI;
_CircleROI.trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(CIRCLEROI);
_CircleROI.toolType = CIRCLEROI;
_CircleROI.utilityToolType = CIRCLEROI;
_CircleROI.TID300Representation = TID300Circle;
_CircleROI.isValidCornerstoneTrackingIdentifier =
    isValidCornerstoneTrackingIdentifier;
MeasurementReport.registerTool(CircleROI);

export { CircleROI as default };
