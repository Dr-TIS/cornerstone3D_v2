export default CobbAngle;
declare class CobbAngle {
    static getMeasurementData(MeasurementGroup: any): {
        rAngle: any;
        toolType: string;
        handles: {
            start: {};
            end: {};
            start2: {
                highlight: boolean;
                drawnIndependently: boolean;
            };
            end2: {
                highlight: boolean;
                drawnIndependently: boolean;
            };
            textBox: {
                hasMoved: boolean;
                movesIndependently: boolean;
                drawnIndependently: boolean;
                allowedOutsideImage: boolean;
                hasBoundingBox: boolean;
            };
        };
        sopInstanceUid: any;
        frameIndex: any;
        complete: boolean;
        finding: any;
        findingSites: any[];
    };
    static getTID300RepresentationArguments(tool: any): {
        point1: any;
        point2: any;
        point3: any;
        point4: any;
        rAngle: any;
        trackingIdentifierTextValue: string;
        finding: any;
        findingSites: any;
    };
}
declare namespace CobbAngle {
    export { COBB_ANGLE as toolType };
    export { COBB_ANGLE as utilityToolType };
    export { TID300CobbAngle as TID300Representation };
    export function isValidCornerstoneTrackingIdentifier(
        TrackingIdentifier: any
    ): boolean;
}
declare const COBB_ANGLE: "CobbAngle";
declare const TID300CobbAngle: any;
