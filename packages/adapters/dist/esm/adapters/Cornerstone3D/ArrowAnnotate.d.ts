export default ArrowAnnotate;
declare class ArrowAnnotate {
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
        points: {
            x: any;
            y: any;
        }[];
        trackingIdentifierTextValue: string;
        findingSites: any;
    };
}
declare namespace ArrowAnnotate {
    export { ARROW_ANNOTATE as toolType };
    export { ARROW_ANNOTATE as utilityToolType };
    export { TID300Point as TID300Representation };
    export function isValidCornerstoneTrackingIdentifier(
        TrackingIdentifier: any
    ): boolean;
}
declare const ARROW_ANNOTATE: "ArrowAnnotate";
declare const TID300Point: any;
