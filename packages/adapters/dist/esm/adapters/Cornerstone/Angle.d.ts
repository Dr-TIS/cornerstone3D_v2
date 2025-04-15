export default Angle;
declare class Angle {
    static getMeasurementData(MeasurementGroup: any): {
        rAngle: any;
        toolType: string;
        handles: {
            start: {};
            middle: {};
            end: {};
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
declare namespace Angle {
    export { ANGLE as toolType };
    export { ANGLE as utilityToolType };
    export { TID300Angle as TID300Representation };
    export function isValidCornerstoneTrackingIdentifier(
        TrackingIdentifier: any
    ): boolean;
}
declare const ANGLE: "Angle";
declare const TID300Angle: any;
