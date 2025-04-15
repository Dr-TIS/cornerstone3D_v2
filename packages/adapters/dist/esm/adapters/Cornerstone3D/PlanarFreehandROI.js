import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    defineProperty as _defineProperty,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import MeasurementReport from "./MeasurementReport.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import { vec3 } from "gl-matrix";

var _PlanarFreehandROI;
var TID300Polyline = utilities.TID300.Polyline;
var PLANARFREEHANDROI = "PlanarFreehandROI";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(PLANARFREEHANDROI);
var closedContourThreshold = 1e-5;
var PlanarFreehandROI = /*#__PURE__*/ (function () {
    function PlanarFreehandROI() {
        _classCallCheck(this, PlanarFreehandROI);
    }
    return _createClass(PlanarFreehandROI, null, [
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
                            PlanarFreehandROI.toolType
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
                var distanceBetweenFirstAndLastPoint = vec3.distance(
                    worldCoords[worldCoords.length - 1],
                    worldCoords[0]
                );
                var isOpenContour = true;
                if (distanceBetweenFirstAndLastPoint < closedContourThreshold) {
                    worldCoords.pop();
                    isOpenContour = false;
                }
                var points = [];
                if (isOpenContour) {
                    points.push(
                        worldCoords[0],
                        worldCoords[worldCoords.length - 1]
                    );
                }
                var state = defaultState;
                state.annotation.data = {
                    contour: {
                        polyline: worldCoords,
                        closed: !isOpenContour
                    },
                    handles: {
                        points: points,
                        activeHandleIndex: null,
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
                var _data$contour = data.contour,
                    polyline = _data$contour.polyline,
                    closed = _data$contour.closed;
                var isOpenContour = closed !== true;
                var referencedImageId = metadata.referencedImageId;
                if (!referencedImageId) {
                    throw new Error(
                        "PlanarFreehandROI.getTID300RepresentationArguments: referencedImageId is not defined"
                    );
                }
                var points = polyline.map(function (worldPos) {
                    return worldToImageCoords(referencedImageId, worldPos);
                });
                if (!isOpenContour) {
                    var firstPoint = points[0];
                    points.push([firstPoint[0], firstPoint[1]]);
                }
                var _ref =
                        data.cachedStats[
                            "imageId:".concat(referencedImageId)
                        ] || {},
                    area = _ref.area,
                    areaUnit = _ref.areaUnit,
                    modalityUnit = _ref.modalityUnit,
                    perimeter = _ref.perimeter,
                    mean = _ref.mean,
                    max = _ref.max,
                    stdDev = _ref.stdDev;
                return {
                    points: points,
                    area: area,
                    areaUnit: areaUnit,
                    perimeter: perimeter,
                    modalityUnit: modalityUnit,
                    mean: mean,
                    max: max,
                    stdDev: stdDev,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
_PlanarFreehandROI = PlanarFreehandROI;
_PlanarFreehandROI.toolType = PLANARFREEHANDROI;
_PlanarFreehandROI.utilityToolType = PLANARFREEHANDROI;
_PlanarFreehandROI.TID300Representation = TID300Polyline;
_PlanarFreehandROI.isValidCornerstoneTrackingIdentifier = function (
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
    return toolType === PLANARFREEHANDROI;
};
MeasurementReport.registerTool(PlanarFreehandROI);

export { PlanarFreehandROI as default };
