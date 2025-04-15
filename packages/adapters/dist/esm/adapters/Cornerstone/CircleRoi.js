import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    objectSpread2 as _objectSpread2,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import MeasurementReport from "./MeasurementReport.js";
import CORNERSTONE_4_TAG from "./cornerstone4Tag.js";

var TID300Circle = utilities.TID300.Circle;
var CIRCLEROI = "CircleRoi";
var CircleRoi = /*#__PURE__*/ (function () {
    function CircleRoi() {
        _classCallCheck(this, CircleRoi);
    }
    return _createClass(CircleRoi, null, [
        {
            key: "getMeasurementData",
            /** Gets the measurement data for cornerstone, given DICOM SR measurement data. */
            value: function getMeasurementData(MeasurementGroup) {
                var _MeasurementReport$ge =
                        MeasurementReport.getSetupMeasurementData(
                            MeasurementGroup
                        ),
                    defaultState = _MeasurementReport$ge.defaultState,
                    NUMGroup = _MeasurementReport$ge.NUMGroup,
                    SCOORDGroup = _MeasurementReport$ge.SCOORDGroup;
                var GraphicData = SCOORDGroup.GraphicData;
                var center = {
                    x: GraphicData[0],
                    y: GraphicData[1]
                };
                var end = {
                    x: GraphicData[2],
                    y: GraphicData[3]
                };
                var state = _objectSpread2(
                    _objectSpread2({}, defaultState),
                    {},
                    {
                        toolType: CircleRoi.toolType,
                        active: false,
                        cachedStats: {
                            area: NUMGroup
                                ? NUMGroup.MeasuredValueSequence.NumericValue
                                : 0,
                            // Dummy values to be updated by cornerstone
                            radius: 0,
                            perimeter: 0
                        },
                        handles: {
                            end: _objectSpread2(
                                _objectSpread2({}, end),
                                {},
                                {
                                    highlight: false,
                                    active: false
                                }
                            ),
                            initialRotation: 0,
                            start: _objectSpread2(
                                _objectSpread2({}, center),
                                {},
                                {
                                    highlight: false,
                                    active: false
                                }
                            ),
                            textBox: {
                                hasMoved: false,
                                movesIndependently: false,
                                drawnIndependently: true,
                                allowedOutsideImage: true,
                                hasBoundingBox: true
                            }
                        },
                        invalidated: true,
                        visible: true
                    }
                );
                return state;
            }

            /**
             * Gets the TID 300 representation of a circle, given the cornerstone representation.
             *
             * @param {Object} tool
             * @returns
             */
        },
        {
            key: "getTID300RepresentationArguments",
            value: function getTID300RepresentationArguments(tool) {
                var _tool$cachedStats = tool.cachedStats,
                    cachedStats =
                        _tool$cachedStats === void 0 ? {} : _tool$cachedStats,
                    handles = tool.handles,
                    finding = tool.finding,
                    findingSites = tool.findingSites;
                var center = handles.start,
                    end = handles.end;
                var area = cachedStats.area,
                    radius = cachedStats.radius;
                var perimeter = 2 * Math.PI * radius;
                var points = [];
                points.push(center);
                points.push(end);
                var trackingIdentifierTextValue =
                    "cornerstoneTools@^4.0.0:CircleRoi";
                return {
                    area: area,
                    perimeter: perimeter,
                    radius: radius,
                    points: points,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
CircleRoi.toolType = CIRCLEROI;
CircleRoi.utilityToolType = CIRCLEROI;
CircleRoi.TID300Representation = TID300Circle;
CircleRoi.isValidCornerstoneTrackingIdentifier = function (TrackingIdentifier) {
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
    return toolType === CIRCLEROI;
};
MeasurementReport.registerTool(CircleRoi);

export { CircleRoi as default };
