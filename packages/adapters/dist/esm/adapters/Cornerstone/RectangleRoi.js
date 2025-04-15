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
var RectangleRoi = /*#__PURE__*/ (function () {
    function RectangleRoi() {
        _classCallCheck(this, RectangleRoi);
    }
    return _createClass(RectangleRoi, null, [
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
                        toolType: RectangleRoi.toolType,
                        handles: {
                            start: {},
                            end: {},
                            textBox: {
                                active: false,
                                hasMoved: false,
                                movesIndependently: false,
                                drawnIndependently: true,
                                allowedOutsideImage: true,
                                hasBoundingBox: true
                            },
                            initialRotation: 0
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
                var _SCOORDGroup$GraphicD = _slicedToArray(
                    SCOORDGroup.GraphicData,
                    6
                );
                state.handles.start.x = _SCOORDGroup$GraphicD[0];
                state.handles.start.y = _SCOORDGroup$GraphicD[1];
                _SCOORDGroup$GraphicD[2];
                _SCOORDGroup$GraphicD[3];
                state.handles.end.x = _SCOORDGroup$GraphicD[4];
                state.handles.end.y = _SCOORDGroup$GraphicD[5];
                return state;
            }
        },
        {
            key: "getTID300RepresentationArguments",
            value: function getTID300RepresentationArguments(tool) {
                var finding = tool.finding,
                    findingSites = tool.findingSites,
                    _tool$cachedStats = tool.cachedStats,
                    cachedStats =
                        _tool$cachedStats === void 0 ? {} : _tool$cachedStats,
                    handles = tool.handles;
                var start = handles.start,
                    end = handles.end;
                var points = [
                    start,
                    {
                        x: start.x,
                        y: end.y
                    },
                    end,
                    {
                        x: end.x,
                        y: start.y
                    }
                ];
                var area = cachedStats.area,
                    perimeter = cachedStats.perimeter;
                var trackingIdentifierTextValue =
                    "cornerstoneTools@^4.0.0:RectangleRoi";
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
RectangleRoi.toolType = "RectangleRoi";
RectangleRoi.utilityToolType = "RectangleRoi";
RectangleRoi.TID300Representation = TID300Polyline;
RectangleRoi.isValidCornerstoneTrackingIdentifier = function (
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
    return toolType === RectangleRoi.toolType;
};
MeasurementReport.registerTool(RectangleRoi);

export { RectangleRoi as default };
