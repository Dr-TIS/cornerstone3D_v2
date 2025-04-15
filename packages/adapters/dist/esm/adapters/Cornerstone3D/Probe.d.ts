export default Probe;
declare class Probe {
    static getMeasurementData(
        MeasurementGroup: any,
        sopInstanceUIDToImageIdMap: any,
        imageToWorldCoords: any,
        metadata: any
    ): {
        description: any;
        sopInstanceUid: any;
        annotation: {
            annotationUID: any;
            metadata: {
                toolName: any;
                referencedImageId: any;
                FrameOfReferenceUID: any;
                label: string;
            };
            data: any;
        };
        finding: any;
        findingSites: any[];
    };
    static getTID300RepresentationArguments(
        tool: any,
        worldToImageCoords: any
    ): {
        points: any;
        trackingIdentifierTextValue: string;
        findingSites: any;
        finding: any;
    };
}
declare namespace Probe {
    export { PROBE as toolType };
    export { PROBE as utilityToolType };
    export { TID300Point as TID300Representation };
    export function isValidCornerstoneTrackingIdentifier(
        TrackingIdentifier: any
    ): boolean;
}
declare const PROBE: "Probe";
declare const TID300Point: any;
