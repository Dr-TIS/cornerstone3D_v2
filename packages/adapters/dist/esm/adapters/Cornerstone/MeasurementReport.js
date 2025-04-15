import {
    createClass as _createClass,
    classCallCheck as _classCallCheck
} from "../../_virtual/_rollupPluginBabelHelpers.js";
import { utilities, derivations, normalizers, data } from "dcmjs";
import { toArray } from "../helpers/toArray.js";
import { codeMeaningEquals } from "../helpers/codeMeaningEquals.js";
import "../helpers/downloadDICOMData.js";

var TID1500 = utilities.TID1500,
    addAccessors = utilities.addAccessors;
var StructuredReport = derivations.StructuredReport;
var Normalizer = normalizers.Normalizer;
var TID1500MeasurementReport = TID1500.TID1500MeasurementReport,
    TID1501MeasurementGroup = TID1500.TID1501MeasurementGroup;
var DicomMetaDictionary = data.DicomMetaDictionary;
var FINDING = {
    CodingSchemeDesignator: "DCM",
    CodeValue: "121071"
};
var FINDING_SITE = {
    CodingSchemeDesignator: "SCT",
    CodeValue: "363698007"
};
var FINDING_SITE_OLD = {
    CodingSchemeDesignator: "SRT",
    CodeValue: "G-C0E3"
};
var codeValueMatch = function codeValueMatch(group, code, oldCode) {
    var ConceptNameCodeSequence = group.ConceptNameCodeSequence;
    if (!ConceptNameCodeSequence) {
        return;
    }
    var CodingSchemeDesignator = ConceptNameCodeSequence.CodingSchemeDesignator,
        CodeValue = ConceptNameCodeSequence.CodeValue;
    return (
        (CodingSchemeDesignator == code.CodingSchemeDesignator &&
            CodeValue == code.CodeValue) ||
        (oldCode &&
            CodingSchemeDesignator == oldCode.CodingSchemeDesignator &&
            CodeValue == oldCode.CodeValue)
    );
};
function getTID300ContentItem(
    tool,
    toolType,
    ReferencedSOPSequence,
    toolClass
) {
    var args = toolClass.getTID300RepresentationArguments(tool);
    args.ReferencedSOPSequence = ReferencedSOPSequence;
    var TID300Measurement = new toolClass.TID300Representation(args);
    return TID300Measurement;
}
function getMeasurementGroup(toolType, toolData, ReferencedSOPSequence) {
    var toolTypeData = toolData[toolType];
    var toolClass =
        MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE[toolType];
    if (
        !toolTypeData ||
        !toolTypeData.data ||
        !toolTypeData.data.length ||
        !toolClass
    ) {
        return;
    }

    // Loop through the array of tool instances
    // for this tool
    var Measurements = toolTypeData.data.map(function (tool) {
        return getTID300ContentItem(
            tool,
            toolType,
            ReferencedSOPSequence,
            toolClass
        );
    });
    return new TID1501MeasurementGroup(Measurements);
}
var MeasurementReport = /*#__PURE__*/ (function () {
    function MeasurementReport() {
        _classCallCheck(this, MeasurementReport);
    }
    return _createClass(MeasurementReport, null, [
        {
            key: "getSetupMeasurementData",
            value: function getSetupMeasurementData(MeasurementGroup) {
                var ContentSequence = MeasurementGroup.ContentSequence;
                var contentSequenceArr = toArray(ContentSequence);
                var findingGroup = contentSequenceArr.find(function (group) {
                    return codeValueMatch(group, FINDING);
                });
                var findingSiteGroups =
                    contentSequenceArr.filter(function (group) {
                        return codeValueMatch(
                            group,
                            FINDING_SITE,
                            FINDING_SITE_OLD
                        );
                    }) || [];
                var NUMGroup = contentSequenceArr.find(function (group) {
                    return group.ValueType === "NUM";
                });
                var SCOORDGroup = toArray(NUMGroup.ContentSequence).find(
                    function (group) {
                        return group.ValueType === "SCOORD";
                    }
                );
                var ReferencedSOPSequence =
                    SCOORDGroup.ContentSequence.ReferencedSOPSequence;
                var ReferencedSOPInstanceUID =
                        ReferencedSOPSequence.ReferencedSOPInstanceUID,
                    ReferencedFrameNumber =
                        ReferencedSOPSequence.ReferencedFrameNumber;
                var defaultState = {
                    sopInstanceUid: ReferencedSOPInstanceUID,
                    frameIndex: ReferencedFrameNumber || 1,
                    complete: true,
                    finding: findingGroup
                        ? addAccessors(findingGroup.ConceptCodeSequence)
                        : undefined,
                    findingSites: findingSiteGroups.map(function (fsg) {
                        return addAccessors(fsg.ConceptCodeSequence);
                    })
                };
                if (defaultState.finding) {
                    defaultState.description = defaultState.finding.CodeMeaning;
                }
                var findingSite =
                    defaultState.findingSites && defaultState.findingSites[0];
                if (findingSite) {
                    defaultState.location =
                        (findingSite[0] && findingSite[0].CodeMeaning) ||
                        findingSite.CodeMeaning;
                }
                return {
                    defaultState: defaultState,
                    findingGroup: findingGroup,
                    findingSiteGroups: findingSiteGroups,
                    NUMGroup: NUMGroup,
                    SCOORDGroup: SCOORDGroup,
                    ReferencedSOPSequence: ReferencedSOPSequence,
                    ReferencedSOPInstanceUID: ReferencedSOPInstanceUID,
                    ReferencedFrameNumber: ReferencedFrameNumber
                };
            }
        },
        {
            key: "generateReport",
            value: function generateReport(
                toolState,
                metadataProvider,
                options
            ) {
                // ToolState for array of imageIDs to a Report
                // Assume Cornerstone metadata provider has access to Study / Series / Sop Instance UID

                var allMeasurementGroups = [];
                var firstImageId = Object.keys(toolState)[0];
                if (!firstImageId) {
                    throw new Error("No measurements provided.");
                }

                /* Patient ID
      Warning - Missing attribute or value that would be needed to build DICOMDIR - Patient ID
      Warning - Missing attribute or value that would be needed to build DICOMDIR - Study Date
      Warning - Missing attribute or value that would be needed to build DICOMDIR - Study Time
      Warning - Missing attribute or value that would be needed to build DICOMDIR - Study ID
       */
                var generalSeriesModule = metadataProvider.get(
                    "generalSeriesModule",
                    firstImageId
                );

                //const sopCommonModule = metadataProvider.get('sopCommonModule', firstImageId);

                // NOTE: We are getting the Series and Study UIDs from the first imageId of the toolState
                // which means that if the toolState is for multiple series, the report will have the incorrect
                // SeriesInstanceUIDs
                var studyInstanceUID = generalSeriesModule.studyInstanceUID,
                    seriesInstanceUID = generalSeriesModule.seriesInstanceUID;

                // Loop through each image in the toolData
                Object.keys(toolState).forEach(function (imageId) {
                    var sopCommonModule = metadataProvider.get(
                        "sopCommonModule",
                        imageId
                    );
                    var frameNumber = metadataProvider.get(
                        "frameNumber",
                        imageId
                    );
                    var toolData = toolState[imageId];
                    var toolTypes = Object.keys(toolData);
                    var ReferencedSOPSequence = {
                        ReferencedSOPClassUID: sopCommonModule.sopClassUID,
                        ReferencedSOPInstanceUID: sopCommonModule.sopInstanceUID
                    };
                    if (
                        Normalizer.isMultiframeSOPClassUID(
                            sopCommonModule.sopClassUID
                        )
                    ) {
                        ReferencedSOPSequence.ReferencedFrameNumber =
                            frameNumber;
                    }

                    // Loop through each tool type for the image
                    var measurementGroups = [];
                    toolTypes.forEach(function (toolType) {
                        var group = getMeasurementGroup(
                            toolType,
                            toolData,
                            ReferencedSOPSequence
                        );
                        if (group) {
                            measurementGroups.push(group);
                        }
                    });
                    allMeasurementGroups =
                        allMeasurementGroups.concat(measurementGroups);
                });
                var _MeasurementReport = new TID1500MeasurementReport(
                    {
                        TID1501MeasurementGroups: allMeasurementGroups
                    },
                    options
                );

                // TODO: what is the correct metaheader
                // http://dicom.nema.org/medical/Dicom/current/output/chtml/part10/chapter_7.html
                // TODO: move meta creation to happen in derivations.js
                var fileMetaInformationVersionArray = new Uint8Array(2);
                fileMetaInformationVersionArray[1] = 1;
                var derivationSourceDataset = {
                    StudyInstanceUID: studyInstanceUID,
                    SeriesInstanceUID: seriesInstanceUID
                    //SOPInstanceUID: sopInstanceUID, // TODO: Necessary?
                    //SOPClassUID: sopClassUID,
                };
                var _meta = {
                    FileMetaInformationVersion: {
                        Value: [fileMetaInformationVersionArray.buffer],
                        vr: "OB"
                    },
                    //MediaStorageSOPClassUID
                    //MediaStorageSOPInstanceUID: sopCommonModule.sopInstanceUID,
                    TransferSyntaxUID: {
                        Value: ["1.2.840.10008.1.2.1"],
                        vr: "UI"
                    },
                    ImplementationClassUID: {
                        Value: [DicomMetaDictionary.uid()],
                        // TODO: could be git hash or other valid id
                        vr: "UI"
                    },
                    ImplementationVersionName: {
                        Value: ["dcmjs"],
                        vr: "SH"
                    }
                };
                var _vrMap = {
                    PixelData: "OW"
                };
                derivationSourceDataset._meta = _meta;
                derivationSourceDataset._vrMap = _vrMap;
                var report = new StructuredReport([derivationSourceDataset]);
                var contentItem = _MeasurementReport.contentItem(
                    derivationSourceDataset
                );

                // Merge the derived dataset with the content from the Measurement Report
                report.dataset = Object.assign(report.dataset, contentItem);
                report.dataset._meta = _meta;
                report.dataset.SpecificCharacterSet = "ISO_IR 192";
                return report;
            }

            /**
             * Generate Cornerstone tool state from dataset
             * @param {object} dataset dataset
             * @param {object} hooks
             * @param {function} hooks.getToolClass Function to map dataset to a tool class
             * @returns
             */
        },
        {
            key: "generateToolState",
            value: function generateToolState(dataset) {
                var hooks =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : {};
                // For now, bail out if the dataset is not a TID1500 SR with length measurements
                if (
                    dataset.ContentTemplateSequence.TemplateIdentifier !==
                    "1500"
                ) {
                    throw new Error(
                        "This package can currently only interpret DICOM SR TID 1500"
                    );
                }
                var REPORT = "Imaging Measurements";
                var GROUP = "Measurement Group";
                var TRACKING_IDENTIFIER = "Tracking Identifier";

                // Identify the Imaging Measurements
                var imagingMeasurementContent = toArray(
                    dataset.ContentSequence
                ).find(codeMeaningEquals(REPORT));

                // Retrieve the Measurements themselves
                var measurementGroups = toArray(
                    imagingMeasurementContent.ContentSequence
                ).filter(codeMeaningEquals(GROUP));

                // For each of the supported measurement types, compute the measurement data
                var measurementData = {};
                var cornerstoneToolClasses =
                    MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE;
                var registeredToolClasses = [];
                Object.keys(cornerstoneToolClasses).forEach(function (key) {
                    registeredToolClasses.push(cornerstoneToolClasses[key]);
                    measurementData[key] = [];
                });
                measurementGroups.forEach(function (measurementGroup) {
                    var measurementGroupContentSequence = toArray(
                        measurementGroup.ContentSequence
                    );
                    var TrackingIdentifierGroup =
                        measurementGroupContentSequence.find(function (
                            contentItem
                        ) {
                            return (
                                contentItem.ConceptNameCodeSequence
                                    .CodeMeaning === TRACKING_IDENTIFIER
                            );
                        });
                    var TrackingIdentifierValue =
                        TrackingIdentifierGroup.TextValue;
                    var toolClass = hooks.getToolClass
                        ? hooks.getToolClass(
                              measurementGroup,
                              dataset,
                              registeredToolClasses
                          )
                        : registeredToolClasses.find(function (tc) {
                              return tc.isValidCornerstoneTrackingIdentifier(
                                  TrackingIdentifierValue
                              );
                          });
                    if (toolClass) {
                        var measurement =
                            toolClass.getMeasurementData(measurementGroup);
                        console.log("=== ".concat(toolClass.toolType, " ==="));
                        console.log(measurement);
                        measurementData[toolClass.toolType].push(measurement);
                    }
                });

                // NOTE: There is no way of knowing the cornerstone imageIds as that could be anything.
                // That is up to the consumer to derive from the SOPInstanceUIDs.
                return measurementData;
            }
        },
        {
            key: "registerTool",
            value: function registerTool(toolClass) {
                MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE[
                    toolClass.utilityToolType
                ] = toolClass;
                MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE[
                    toolClass.toolType
                ] = toolClass;
                MeasurementReport.MEASUREMENT_BY_TOOLTYPE[toolClass.toolType] =
                    toolClass.utilityToolType;
            }
        }
    ]);
})();
MeasurementReport.MEASUREMENT_BY_TOOLTYPE = {};
MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE = {};
MeasurementReport.CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE = {};

export { MeasurementReport as default };
