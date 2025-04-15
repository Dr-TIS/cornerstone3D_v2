declare class MeasurementReport {
    static getSetupMeasurementData(MeasurementGroup: any): {
        defaultState: {
            sopInstanceUid: any;
            frameIndex: any;
            complete: boolean;
            finding: any;
            findingSites: any[];
        };
        findingGroup: any;
        findingSiteGroups: any[];
        NUMGroup: any;
        SCOORDGroup: any;
        ReferencedSOPSequence: any;
        ReferencedSOPInstanceUID: any;
        ReferencedFrameNumber: any;
    };
    static generateReport(
        toolState: any,
        metadataProvider: any,
        options: any
    ): any;
    static generateToolState(
        dataset: object,
        hooks?: {
            getToolClass: Function;
        }
    ): {};
    static registerTool(toolClass: any): void;
}
declare namespace MeasurementReport {
    let MEASUREMENT_BY_TOOLTYPE: {};
    let CORNERSTONE_TOOL_CLASSES_BY_UTILITY_TYPE: {};
    let CORNERSTONE_TOOL_CLASSES_BY_TOOL_TYPE: {};
}
export default MeasurementReport;
