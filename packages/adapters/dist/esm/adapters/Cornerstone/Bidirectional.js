import {
    slicedToArray as _slicedToArray,
    createClass as _createClass,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities } from "dcmjs";
import MeasurementReport from "./MeasurementReport.js";
import CORNERSTONE_4_TAG from "./cornerstone4Tag.js";
import { toArray } from "../helpers/toArray.js";
import "../helpers/downloadDICOMData.js";

var TID300Bidirectional = utilities.TID300.Bidirectional;
var BIDIRECTIONAL = "Bidirectional";
var LONG_AXIS = "Long Axis";
var SHORT_AXIS = "Short Axis";
var FINDING = "121071";
var FINDING_SITE = "G-C0E3";
var Bidirectional = /*#__PURE__*/ (function () {
    function Bidirectional() {
        _classCallCheck(this, Bidirectional);
    }
    return _createClass(Bidirectional, null, [
        {
            key: "getMeasurementData",
            value:
                // TODO: this function is required for all Cornerstone Tool Adapters, since it is called by MeasurementReport.
                function getMeasurementData(MeasurementGroup) {
                    var ContentSequence = MeasurementGroup.ContentSequence;
                    var findingGroup = toArray(ContentSequence).find(function (
                        group
                    ) {
                        return (
                            group.ConceptNameCodeSequence.CodeValue === FINDING
                        );
                    });
                    var findingSiteGroups = toArray(ContentSequence).filter(
                        function (group) {
                            return (
                                group.ConceptNameCodeSequence.CodeValue ===
                                FINDING_SITE
                            );
                        }
                    );
                    var longAxisNUMGroup = toArray(ContentSequence).find(
                        function (group) {
                            return (
                                group.ConceptNameCodeSequence.CodeMeaning ===
                                LONG_AXIS
                            );
                        }
                    );
                    var longAxisSCOORDGroup = toArray(
                        longAxisNUMGroup.ContentSequence
                    ).find(function (group) {
                        return group.ValueType === "SCOORD";
                    });
                    var shortAxisNUMGroup = toArray(ContentSequence).find(
                        function (group) {
                            return (
                                group.ConceptNameCodeSequence.CodeMeaning ===
                                SHORT_AXIS
                            );
                        }
                    );
                    var shortAxisSCOORDGroup = toArray(
                        shortAxisNUMGroup.ContentSequence
                    ).find(function (group) {
                        return group.ValueType === "SCOORD";
                    });
                    var ReferencedSOPSequence =
                        longAxisSCOORDGroup.ContentSequence
                            .ReferencedSOPSequence;
                    var ReferencedSOPInstanceUID =
                            ReferencedSOPSequence.ReferencedSOPInstanceUID,
                        ReferencedFrameNumber =
                            ReferencedSOPSequence.ReferencedFrameNumber;

                    // Long axis

                    var longestDiameter = String(
                        longAxisNUMGroup.MeasuredValueSequence.NumericValue
                    );
                    var shortestDiameter = String(
                        shortAxisNUMGroup.MeasuredValueSequence.NumericValue
                    );
                    var bottomRight = {
                        x: Math.max(
                            longAxisSCOORDGroup.GraphicData[0],
                            longAxisSCOORDGroup.GraphicData[2],
                            shortAxisSCOORDGroup.GraphicData[0],
                            shortAxisSCOORDGroup.GraphicData[2]
                        ),
                        y: Math.max(
                            longAxisSCOORDGroup.GraphicData[1],
                            longAxisSCOORDGroup.GraphicData[3],
                            shortAxisSCOORDGroup.GraphicData[1],
                            shortAxisSCOORDGroup.GraphicData[3]
                        )
                    };
                    var state = {
                        sopInstanceUid: ReferencedSOPInstanceUID,
                        frameIndex: ReferencedFrameNumber || 1,
                        toolType: Bidirectional.toolType,
                        active: false,
                        handles: {
                            start: {
                                x: longAxisSCOORDGroup.GraphicData[0],
                                y: longAxisSCOORDGroup.GraphicData[1],
                                drawnIndependently: false,
                                allowedOutsideImage: false,
                                active: false,
                                highlight: false,
                                index: 0
                            },
                            end: {
                                x: longAxisSCOORDGroup.GraphicData[2],
                                y: longAxisSCOORDGroup.GraphicData[3],
                                drawnIndependently: false,
                                allowedOutsideImage: false,
                                active: false,
                                highlight: false,
                                index: 1
                            },
                            perpendicularStart: {
                                x: shortAxisSCOORDGroup.GraphicData[0],
                                y: shortAxisSCOORDGroup.GraphicData[1],
                                drawnIndependently: false,
                                allowedOutsideImage: false,
                                active: false,
                                highlight: false,
                                index: 2
                            },
                            perpendicularEnd: {
                                x: shortAxisSCOORDGroup.GraphicData[2],
                                y: shortAxisSCOORDGroup.GraphicData[3],
                                drawnIndependently: false,
                                allowedOutsideImage: false,
                                active: false,
                                highlight: false,
                                index: 3
                            },
                            textBox: {
                                highlight: false,
                                hasMoved: true,
                                active: false,
                                movesIndependently: false,
                                drawnIndependently: true,
                                allowedOutsideImage: true,
                                hasBoundingBox: true,
                                x: bottomRight.x + 10,
                                y: bottomRight.y + 10
                            }
                        },
                        invalidated: false,
                        isCreating: false,
                        longestDiameter: longestDiameter,
                        shortestDiameter: shortestDiameter,
                        toolName: "Bidirectional",
                        visible: true,
                        finding: findingGroup
                            ? findingGroup.ConceptCodeSequence
                            : undefined,
                        findingSites: findingSiteGroups.map(function (fsg) {
                            return fsg.ConceptCodeSequence;
                        })
                    };
                    return state;
                }
        },
        {
            key: "getTID300RepresentationArguments",
            value: function getTID300RepresentationArguments(tool) {
                var _tool$handles = tool.handles,
                    start = _tool$handles.start,
                    end = _tool$handles.end,
                    perpendicularStart = _tool$handles.perpendicularStart,
                    perpendicularEnd = _tool$handles.perpendicularEnd;
                var shortestDiameter = tool.shortestDiameter,
                    longestDiameter = tool.longestDiameter,
                    finding = tool.finding,
                    findingSites = tool.findingSites;
                var trackingIdentifierTextValue =
                    "cornerstoneTools@^4.0.0:Bidirectional";
                return {
                    longAxis: {
                        point1: start,
                        point2: end
                    },
                    shortAxis: {
                        point1: perpendicularStart,
                        point2: perpendicularEnd
                    },
                    longAxisLength: longestDiameter,
                    shortAxisLength: shortestDiameter,
                    trackingIdentifierTextValue: trackingIdentifierTextValue,
                    finding: finding,
                    findingSites: findingSites || []
                };
            }
        }
    ]);
})();
Bidirectional.toolType = BIDIRECTIONAL;
Bidirectional.utilityToolType = BIDIRECTIONAL;
Bidirectional.TID300Representation = TID300Bidirectional;
Bidirectional.isValidCornerstoneTrackingIdentifier = function (
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
    return toolType === BIDIRECTIONAL;
};
MeasurementReport.registerTool(Bidirectional);

export { Bidirectional as default };
