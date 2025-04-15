import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    objectSpread2 as _objectSpread2,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import MeasurementReport from "./MeasurementReport.js";
import CORNERSTONE_4_TAG from "./cornerstone4Tag.js";

var TID300Ellipse = utilities.TID300.Ellipse;
var ELLIPTICALROI = "EllipticalRoi";
var EllipticalRoi = /*#__PURE__*/ (function () {
    function EllipticalRoi() {
        _classCallCheck(this, EllipticalRoi);
    }
    return _createClass(EllipticalRoi, null, [
        {
            key: "getMeasurementData",
            value:
                // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
                function getMeasurementData(MeasurementGroup) {
                    var _MeasurementReport$ge =
                            MeasurementReport.getSetupMeasurementData(
                                MeasurementGroup
                            ),
                        defaultState = _MeasurementReport$ge.defaultState,
                        NUMGroup = _MeasurementReport$ge.NUMGroup,
                        SCOORDGroup = _MeasurementReport$ge.SCOORDGroup;
                    var GraphicData = SCOORDGroup.GraphicData;
                    var majorAxis = [
                        {
                            x: GraphicData[0],
                            y: GraphicData[1]
                        },
                        {
                            x: GraphicData[2],
                            y: GraphicData[3]
                        }
                    ];
                    var minorAxis = [
                        {
                            x: GraphicData[4],
                            y: GraphicData[5]
                        },
                        {
                            x: GraphicData[6],
                            y: GraphicData[7]
                        }
                    ];

                    // Calculate two opposite corners of box defined by two axes.

                    var minorAxisLength = Math.sqrt(
                        Math.pow(minorAxis[0].x - minorAxis[1].x, 2) +
                            Math.pow(minorAxis[0].y - minorAxis[1].y, 2)
                    );
                    var minorAxisDirection = {
                        x: (minorAxis[1].x - minorAxis[0].x) / minorAxisLength,
                        y: (minorAxis[1].y - minorAxis[0].y) / minorAxisLength
                    };
                    var halfMinorAxisLength = minorAxisLength / 2;

                    // First end point of major axis + half minor axis vector
                    var corner1 = {
                        x:
                            majorAxis[0].x +
                            minorAxisDirection.x * halfMinorAxisLength,
                        y:
                            majorAxis[0].y +
                            minorAxisDirection.y * halfMinorAxisLength
                    };

                    // Second end point of major axis - half of minor axis vector
                    var corner2 = {
                        x:
                            majorAxis[1].x -
                            minorAxisDirection.x * halfMinorAxisLength,
                        y:
                            majorAxis[1].y -
                            minorAxisDirection.y * halfMinorAxisLength
                    };
                    var state = _objectSpread2(
                        _objectSpread2({}, defaultState),
                        {},
                        {
                            toolType: EllipticalRoi.toolType,
                            active: false,
                            cachedStats: {
                                area: NUMGroup
                                    ? NUMGroup.MeasuredValueSequence
                                          .NumericValue
                                    : 0
                            },
                            handles: {
                                end: {
                                    x: corner1.x,
                                    y: corner1.y,
                                    highlight: false,
                                    active: false
                                },
                                initialRotation: 0,
                                start: {
                                    x: corner2.x,
                                    y: corner2.y,
                                    highlight: false,
                                    active: false
                                },
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
                var start = handles.start,
                    end = handles.end;
                var area = cachedStats.area;
                var halfXLength = Math.abs(start.x - end.x) / 2;
                var halfYLength = Math.abs(start.y - end.y) / 2;
                var points = [];
                var center = {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2
                };
                if (halfXLength > halfYLength) {
                    // X-axis major
                    // Major axis
                    points.push({
                        x: center.x - halfXLength,
                        y: center.y
                    });
                    points.push({
                        x: center.x + halfXLength,
                        y: center.y
                    });
                    // Minor axis
                    points.push({
                        x: center.x,
                        y: center.y - halfYLength
                    });
                    points.push({
                        x: center.x,
                        y: center.y + halfYLength
                    });
                } else {
                    // Y-axis major
                    // Major axis
                    points.push({
                        x: center.x,
                        y: center.y - halfYLength
                    });
                    points.push({
                        x: center.x,
                        y: center.y + halfYLength
                    });
                    // Minor axis
                    points.push({
                        x: center.x - halfXLength,
                        y: center.y
                    });
                    points.push({
                        x: center.x + halfXLength,
                        y: center.y
                    });
                }
                var trackingIdentifierTextValue =
                    "cornerstoneTools@^4.0.0:EllipticalRoi";
                return {
                    area: area,
                    points: points,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
EllipticalRoi.toolType = ELLIPTICALROI;
EllipticalRoi.utilityToolType = ELLIPTICALROI;
EllipticalRoi.TID300Representation = TID300Ellipse;
EllipticalRoi.isValidCornerstoneTrackingIdentifier = function (
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
    return toolType === ELLIPTICALROI;
};
MeasurementReport.registerTool(EllipticalRoi);

export { EllipticalRoi as default };
