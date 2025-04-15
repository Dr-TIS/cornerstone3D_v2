import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    defineProperty as _defineProperty,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import CORNERSTONE_3D_TAG from "./cornerstone3DTag.js";
import MeasurementReport from "./MeasurementReport.js";

var _RectangleROI;
var TID300Polyline = utilities.TID300.Polyline;
var TOOLTYPE = "RectangleROI";
var trackingIdentifierTextValue = ""
    .concat(CORNERSTONE_3D_TAG, ":")
    .concat(TOOLTYPE);
var RectangleROI = /*#__PURE__*/ (function () {
    function RectangleROI() {
        _classCallCheck(this, RectangleROI);
    }
    return _createClass(RectangleROI, null, [
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
                            RectangleROI.toolType
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
                            worldCoords[3],
                            worldCoords[2]
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
                var corners = handles.points.map(function (point) {
                    return worldToImageCoords(referencedImageId, point);
                });
                var area = cachedStats.area,
                    perimeter = cachedStats.perimeter;
                return {
                    points: [
                        corners[0],
                        corners[1],
                        corners[3],
                        corners[2],
                        corners[0]
                    ],
                    area: area,
                    perimeter: perimeter,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
_RectangleROI = RectangleROI;
_RectangleROI.toolType = TOOLTYPE;
_RectangleROI.utilityToolType = TOOLTYPE;
_RectangleROI.TID300Representation = TID300Polyline;
_RectangleROI.isValidCornerstoneTrackingIdentifier = function (
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
    return toolType === TOOLTYPE;
};
MeasurementReport.registerTool(RectangleROI);

export { RectangleROI as default };
