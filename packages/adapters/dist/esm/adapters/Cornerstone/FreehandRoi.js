import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    objectSpread2 as _objectSpread2,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import MeasurementReport from "./MeasurementReport.js";
import CORNERSTONE_4_TAG from "./cornerstone4Tag.js";

var TID300Polyline = utilities.TID300.Polyline;
var FreehandRoi = /*#__PURE__*/ (function () {
    function FreehandRoi() {
        _classCallCheck(this, FreehandRoi);
    }
    return _createClass(FreehandRoi, null, [
        {
            key: "getMeasurementData",
            value: function getMeasurementData(MeasurementGroup) {
                var _MeasurementReport$ge =
                        MeasurementReport.getSetupMeasurementData(
                            MeasurementGroup
                        ),
                    defaultState = _MeasurementReport$ge.defaultState,
                    SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
                    NUMGroup = _MeasurementReport$ge.NUMGroup;
                var state = _objectSpread2(
                    _objectSpread2({}, defaultState),
                    {},
                    {
                        toolType: FreehandRoi.toolType,
                        handles: {
                            points: [],
                            textBox: {
                                active: false,
                                hasMoved: false,
                                movesIndependently: false,
                                drawnIndependently: true,
                                allowedOutsideImage: true,
                                hasBoundingBox: true
                            }
                        },
                        cachedStats: {
                            area: NUMGroup
                                ? NUMGroup.MeasuredValueSequence.NumericValue
                                : 0
                        },
                        color: undefined,
                        invalidated: true
                    }
                );
                var GraphicData = SCOORDGroup.GraphicData;
                for (var i = 0; i < GraphicData.length; i += 2) {
                    state.handles.points.push({
                        x: GraphicData[i],
                        y: GraphicData[i + 1]
                    });
                }
                return state;
            }
        },
        {
            key: "getTID300RepresentationArguments",
            value: function getTID300RepresentationArguments(tool) {
                var handles = tool.handles,
                    finding = tool.finding,
                    findingSites = tool.findingSites,
                    _tool$cachedStats = tool.cachedStats,
                    cachedStats =
                        _tool$cachedStats === void 0 ? {} : _tool$cachedStats;
                var points = handles.points;
                var _cachedStats$area = cachedStats.area,
                    area = _cachedStats$area === void 0 ? 0 : _cachedStats$area,
                    _cachedStats$perimete = cachedStats.perimeter,
                    perimeter =
                        _cachedStats$perimete === void 0
                            ? 0
                            : _cachedStats$perimete;
                var trackingIdentifierTextValue =
                    "cornerstoneTools@^4.0.0:FreehandRoi";
                return {
                    points: points,
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
FreehandRoi.toolType = "FreehandRoi";
FreehandRoi.utilityToolType = "FreehandRoi";
FreehandRoi.TID300Representation = TID300Polyline;
FreehandRoi.isValidCornerstoneTrackingIdentifier = function (
    TrackingIdentifier
) {
    if (!TrackingIdentifier.includes(":")) {
        return false;
    }
    var _TrackingIdentifier$s = TrackingIdentifier.split(":"),
        _TrackingIdentifier$s2 = _slicedToArray(_TrackingIdentifier$s, 2),
        cornerstone4Tag = _TrackingIdentifier$s2[0],
        toolType = _TrackingIdentifier$s2[1];
    if (cornerstone4Tag !== CORNERSTONE_4_TAG) {
        return false;
    }
    return toolType === FreehandRoi.toolType;
};
MeasurementReport.registerTool(FreehandRoi);

export { FreehandRoi as default };
