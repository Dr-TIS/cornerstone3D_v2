export default CircleRoi;
declare class CircleRoi {
    static getMeasurementData(MeasurementGroup: any): {
        toolType: string;
        active: boolean;
        cachedStats: {
            area: any;
            radius: number;
            perimeter: number;
        };
        handles: {
            end: {
                highlight: boolean;
                active: boolean;
                x: any;
                y: any;
            };
            initialRotation: number;
            start: {
                highlight: boolean;
                active: boolean;
                x: any;
                y: any;
            };
            textBox: {
                hasMoved: boolean;
                movesIndependently: boolean;
                drawnIndependently: boolean;
                allowedOutsideImage: boolean;
                hasBoundingBox: boolean;
            };
        };
        invalidated: boolean;
        visible: boolean;
        sopInstanceUid: any;
        frameIndex: any;
        complete: boolean;
        finding: any;
        findingSites: any[];
    };
    static getTID300RepresentationArguments(tool: any): {
        area: any;
        perimeter: number;
        radius: any;
        points: any[];
        trackingIdentifierTextValue: string;
        finding: any;
        findingSites: any;
    };
}
declare namespace CircleRoi {
    export { CIRCLEROI as toolType };
    export { CIRCLEROI as utilityToolType };
    export { TID300Circle as TID300Representation };
    export function isValidCornerstoneTrackingIdentifier(
        TrackingIdentifier: any
    ): boolean;
}
declare const CIRCLEROI: "CircleRoi";
declare const TID300Circle: any;
