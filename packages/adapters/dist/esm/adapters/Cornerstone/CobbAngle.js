import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    objectSpread2 as _objectSpread2,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import MeasurementReport from "./MeasurementReport.js";
import CORNERSTONE_4_TAG from "./cornerstone4Tag.js";

var TID300CobbAngle = utilities.TID300.CobbAngle;
var COBB_ANGLE = "CobbAngle";
var CobbAngle = /*#__PURE__*/ (function () {
    function CobbAngle() {
        _classCallCheck(this, CobbAngle);
    }
    return _createClass(CobbAngle, null, [
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
                    var state = _objectSpread2(
                        _objectSpread2({}, defaultState),
                        {},
                        {
                            rAngle: NUMGroup.MeasuredValueSequence.NumericValue,
                            toolType: CobbAngle.toolType,
                            handles: {
                                start: {},
                                end: {},
                                start2: {
                                    highlight: true,
                                    drawnIndependently: true
                                },
                                end2: {
                                    highlight: true,
                                    drawnIndependently: true
                                },
                                textBox: {
                                    hasMoved: false,
                                    movesIndependently: false,
                                    drawnIndependently: true,
                                    allowedOutsideImage: true,
                                    hasBoundingBox: true
                                }
                            }
                        }
                    );
                    var _SCOORDGroup$GraphicD = _slicedToArray(
                        SCOORDGroup.GraphicData,
                        8
                    );
                    state.handles.start.x = _SCOORDGroup$GraphicD[0];
                    state.handles.start.y = _SCOORDGroup$GraphicD[1];
                    state.handles.end.x = _SCOORDGroup$GraphicD[2];
                    state.handles.end.y = _SCOORDGroup$GraphicD[3];
                    state.handles.start2.x = _SCOORDGroup$GraphicD[4];
                    state.handles.start2.y = _SCOORDGroup$GraphicD[5];
                    state.handles.end2.x = _SCOORDGroup$GraphicD[6];
                    state.handles.end2.y = _SCOORDGroup$GraphicD[7];
                    return state;
                }
        },
        {
            key: "getTID300RepresentationArguments",
            value: function getTID300RepresentationArguments(tool) {
                var handles = tool.handles,
                    finding = tool.finding,
                    findingSites = tool.findingSites;
                var point1 = handles.start;
                var point2 = handles.end;
                var point3 = handles.start2;
                var point4 = handles.end2;
                var rAngle = tool.rAngle;
                var trackingIdentifierTextValue =
                    "cornerstoneTools@^4.0.0:CobbAngle";
                return {
                    point1: point1,
                    point2: point2,
                    point3: point3,
                    point4: point4,
                    rAngle: rAngle,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
CobbAngle.toolType = COBB_ANGLE;
CobbAngle.utilityToolType = COBB_ANGLE;
CobbAngle.TID300Representation = TID300CobbAngle;
CobbAngle.isValidCornerstoneTrackingIdentifier = function (TrackingIdentifier) {
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
    return toolType === COBB_ANGLE;
};
MeasurementReport.registerTool(CobbAngle);

export { CobbAngle as default };
