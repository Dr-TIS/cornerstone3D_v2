import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    objectSpread2 as _objectSpread2,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import MeasurementReport from "./MeasurementReport.js";
import CORNERSTONE_4_TAG from "./cornerstone4Tag.js";

var TID300Length = utilities.TID300.Length;
var LENGTH = "Length";
var Length = /*#__PURE__*/ (function () {
    function Length() {
        _classCallCheck(this, Length);
    }
    return _createClass(Length, null, [
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
                            length: NUMGroup.MeasuredValueSequence.NumericValue,
                            toolType: Length.toolType,
                            handles: {
                                start: {},
                                end: {},
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
                        4
                    );
                    state.handles.start.x = _SCOORDGroup$GraphicD[0];
                    state.handles.start.y = _SCOORDGroup$GraphicD[1];
                    state.handles.end.x = _SCOORDGroup$GraphicD[2];
                    state.handles.end.y = _SCOORDGroup$GraphicD[3];
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
                var distance = tool.length;
                var trackingIdentifierTextValue =
                    "cornerstoneTools@^4.0.0:Length";
                return {
                    point1: point1,
                    point2: point2,
                    distance: distance,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
Length.toolType = LENGTH;
Length.utilityToolType = LENGTH;
Length.TID300Representation = TID300Length;
Length.isValidCornerstoneTrackingIdentifier = function (TrackingIdentifier) {
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
    return toolType === LENGTH;
};
MeasurementReport.registerTool(Length);

export { Length as default };
