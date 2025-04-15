import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    objectSpread2 as _objectSpread2,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import MeasurementReport from "./MeasurementReport.js";
import CORNERSTONE_4_TAG from "./cornerstone4Tag.js";

var TID300Point = utilities.TID300.Point;
var ARROW_ANNOTATE = "ArrowAnnotate";
var CORNERSTONEFREETEXT = "CORNERSTONEFREETEXT";
var ArrowAnnotate = /*#__PURE__*/ (function () {
    function ArrowAnnotate() {
        _classCallCheck(this, ArrowAnnotate);
    }
    return _createClass(ArrowAnnotate, null, [
        {
            key: "getMeasurementData",
            value: function getMeasurementData(MeasurementGroup) {
                var _MeasurementReport$ge =
                        MeasurementReport.getSetupMeasurementData(
                            MeasurementGroup
                        ),
                    defaultState = _MeasurementReport$ge.defaultState,
                    SCOORDGroup = _MeasurementReport$ge.SCOORDGroup,
                    findingGroup = _MeasurementReport$ge.findingGroup;
                var text = findingGroup.ConceptCodeSequence.CodeMeaning;
                var GraphicData = SCOORDGroup.GraphicData;
                var state = _objectSpread2(
                    _objectSpread2({}, defaultState),
                    {},
                    {
                        toolType: ArrowAnnotate.toolType,
                        active: false,
                        handles: {
                            start: {
                                x: GraphicData[0],
                                y: GraphicData[1],
                                highlight: true,
                                active: false
                            },
                            // Use a generic offset if the stored data doesn't have the endpoint, otherwise
                            // use the actual endpoint.
                            end: {
                                x:
                                    GraphicData.length == 4
                                        ? GraphicData[2]
                                        : GraphicData[0] + 20,
                                y:
                                    GraphicData.length == 4
                                        ? GraphicData[3]
                                        : GraphicData[1] + 20,
                                highlight: true,
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
                        text: text,
                        visible: true
                    }
                );
                return state;
            }
        },
        {
            key: "getTID300RepresentationArguments",
            value: function getTID300RepresentationArguments(tool) {
                var points = [tool.handles.start, tool.handles.end];
                var finding = tool.finding,
                    findingSites = tool.findingSites;
                var TID300RepresentationArguments = {
                    points: points,
                    trackingIdentifierTextValue:
                        "cornerstoneTools@^4.0.0:ArrowAnnotate",
                    findingSites: findingSites || []
                };

                // If freetext finding isn't present, add it from the tool text.
                if (!finding || finding.CodeValue !== CORNERSTONEFREETEXT) {
                    finding = {
                        CodeValue: CORNERSTONEFREETEXT,
                        CodingSchemeDesignator: "CST4",
                        CodeMeaning: tool.text
                    };
                }
                TID300RepresentationArguments.finding = finding;
                return TID300RepresentationArguments;
            }
        }
    ]);
})();
ArrowAnnotate.toolType = ARROW_ANNOTATE;
ArrowAnnotate.utilityToolType = ARROW_ANNOTATE;
ArrowAnnotate.TID300Representation = TID300Point;
ArrowAnnotate.isValidCornerstoneTrackingIdentifier = function (
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
    return toolType === ARROW_ANNOTATE;
};
MeasurementReport.registerTool(ArrowAnnotate);

export { ArrowAnnotate as default };
