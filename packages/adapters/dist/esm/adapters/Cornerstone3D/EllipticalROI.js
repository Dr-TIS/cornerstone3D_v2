import {
    createClass as _createClass,
    toConsumableArray as _toConsumableArray,
    defineProperty as _defineProperty,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { vec3 } from "gl-matrix";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import MeasurementReport from "./MeasurementReport.js";
import isValidCornerstoneTrackingIdentifier from "./isValidCornerstoneTrackingIdentifier.js";

var _EllipticalROI;
var TID300Ellipse = utilities.TID300.Ellipse;
var ELLIPTICALROI = "EllipticalROI";
var EPSILON = 1e-4;
var EllipticalROI = /*#__PURE__*/ (function () {
    function EllipticalROI() {
        _classCallCheck(this, EllipticalROI);
    }
    return _createClass(EllipticalROI, null, [
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
                            EllipticalROI.toolType
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
                var majorAxisStart = vec3.fromValues.apply(
                    vec3,
                    _toConsumableArray(pointsWorld[0])
                );
                var majorAxisEnd = vec3.fromValues.apply(
                    vec3,
                    _toConsumableArray(pointsWorld[1])
                );
                var minorAxisStart = vec3.fromValues.apply(
                    vec3,
                    _toConsumableArray(pointsWorld[2])
                );
                var minorAxisEnd = vec3.fromValues.apply(
                    vec3,
                    _toConsumableArray(pointsWorld[3])
                );
                var majorAxisVec = vec3.create();
                vec3.sub(majorAxisVec, majorAxisEnd, majorAxisStart);
                vec3.normalize(majorAxisVec, majorAxisVec);
                var minorAxisVec = vec3.create();
                vec3.sub(minorAxisVec, minorAxisEnd, minorAxisStart);
                vec3.normalize(minorAxisVec, minorAxisVec);
                var imagePlaneModule = metadata.get(
                    "imagePlaneModule",
                    referencedImageId
                );
                if (!imagePlaneModule) {
                    throw new Error(
                        "imageId does not have imagePlaneModule metadata"
                    );
                }
                var columnCosines = imagePlaneModule.columnCosines;
                var columnCosinesVec = vec3.fromValues(
                    columnCosines[0],
                    columnCosines[1],
                    columnCosines[2]
                );
                var projectedMajorAxisOnColVec = vec3.dot(
                    columnCosinesVec,
                    majorAxisVec
                );
                var projectedMinorAxisOnColVec = vec3.dot(
                    columnCosinesVec,
                    minorAxisVec
                );
                var absoluteOfMajorDotProduct = Math.abs(
                    projectedMajorAxisOnColVec
                );
                var absoluteOfMinorDotProduct = Math.abs(
                    projectedMinorAxisOnColVec
                );
                var ellipsePoints = [];
                if (Math.abs(absoluteOfMajorDotProduct - 1) < EPSILON) {
                    ellipsePoints = [
                        pointsWorld[0],
                        pointsWorld[1],
                        pointsWorld[2],
                        pointsWorld[3]
                    ];
                } else if (Math.abs(absoluteOfMinorDotProduct - 1) < EPSILON) {
                    ellipsePoints = [
                        pointsWorld[2],
                        pointsWorld[3],
                        pointsWorld[0],
                        pointsWorld[1]
                    ];
                } else {
                    console.warn("OBLIQUE ELLIPSE NOT YET SUPPORTED");
                }
                var state = defaultState;
                state.annotation.data = {
                    handles: {
                        points: _toConsumableArray(ellipsePoints),
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
                                : 0
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
                var rotation = data.initialRotation || 0;
                var referencedImageId = metadata.referencedImageId;
                if (!referencedImageId) {
                    throw new Error(
                        "EllipticalROI.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var top, bottom, left, right;
                if (rotation == 90 || rotation == 270) {
                    bottom = worldToImageCoords(
                        referencedImageId,
                        handles.points[2]
                    );
                    top = worldToImageCoords(
                        referencedImageId,
                        handles.points[3]
                    );
                    left = worldToImageCoords(
                        referencedImageId,
                        handles.points[0]
                    );
                    right = worldToImageCoords(
                        referencedImageId,
                        handles.points[1]
                    );
                } else {
                    top = worldToImageCoords(
                        referencedImageId,
                        handles.points[0]
                    );
                    bottom = worldToImageCoords(
                        referencedImageId,
                        handles.points[1]
                    );
                    left = worldToImageCoords(
                        referencedImageId,
                        handles.points[2]
                    );
                    right = worldToImageCoords(
                        referencedImageId,
                        handles.points[3]
                    );
                }
                var topBottomLength = Math.abs(top[1] - bottom[1]);
                var leftRightLength = Math.abs(left[0] - right[0]);
                var points = [];
                if (topBottomLength > leftRightLength) {
                    points.push({
                        x: top[0],
                        y: top[1]
                    });
                    points.push({
                        x: bottom[0],
                        y: bottom[1]
                    });
                    points.push({
                        x: left[0],
                        y: left[1]
                    });
                    points.push({
                        x: right[0],
                        y: right[1]
                    });
                } else {
                    points.push({
                        x: left[0],
                        y: left[1]
                    });
                    points.push({
                        x: right[0],
                        y: right[1]
                    });
                    points.push({
                        x: top[0],
                        y: top[1]
                    });
                    points.push({
                        x: bottom[0],
                        y: bottom[1]
                    });
                }
                var _ref =
                        cachedStats["imageId:".concat(referencedImageId)] || {},
                    area = _ref.area;
                return {
                    area: area,
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
_EllipticalROI = EllipticalROI;
_EllipticalROI.trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(ELLIPTICALROI);
_EllipticalROI.toolType = ELLIPTICALROI;
_EllipticalROI.utilityToolType = ELLIPTICALROI;
_EllipticalROI.TID300Representation = TID300Ellipse;
_EllipticalROI.isValidCornerstoneTrackingIdentifier =
    isValidCornerstoneTrackingIdentifier;
MeasurementReport.registerTool(EllipticalROI);

export { EllipticalROI as default };
