export default Bidirectional;
declare class Bidirectional {
    static getMeasurementData(MeasurementGroup: any): {
        sopInstanceUid: any;
        frameIndex: any;
        toolType: string;
        active: boolean;
        handles: {
            start: {
                x: any;
                y: any;
                drawnIndependently: boolean;
                allowedOutsideImage: boolean;
                active: boolean;
                highlight: boolean;
                index: number;
            };
            end: {
                x: any;
                y: any;
                drawnIndependently: boolean;
                allowedOutsideImage: boolean;
                active: boolean;
                highlight: boolean;
                index: number;
            };
            perpendicularStart: {
                x: any;
                y: any;
                drawnIndependently: boolean;
                allowedOutsideImage: boolean;
                active: boolean;
                highlight: boolean;
                index: number;
            };
            perpendicularEnd: {
                x: any;
                y: any;
                drawnIndependently: boolean;
                allowedOutsideImage: boolean;
                active: boolean;
                highlight: boolean;
                index: number;
            };
            textBox: {
                highlight: boolean;
                hasMoved: boolean;
                active: boolean;
                movesIndependently: boolean;
                drawnIndependently: boolean;
                allowedOutsideImage: boolean;
                hasBoundingBox: boolean;
                x: number;
                y: number;
            };
        };
        invalidated: boolean;
        isCreating: boolean;
        longestDiameter: string;
        shortestDiameter: string;
        toolName: string;
        visible: boolean;
        finding: any;
        findingSites: any[];
    };
    static getTID300RepresentationArguments(tool: any): {
        longAxis: {
            point1: any;
            point2: any;
        };
        shortAxis: {
            point1: any;
            point2: any;
        };
        longAxisLength: any;
        shortAxisLength: any;
        trackingIdentifierTextValue: string;
        finding: any;
        findingSites: any;
    };
}
declare namespace Bidirectional {
    export { BIDIRECTIONAL as toolType };
    export { BIDIRECTIONAL as utilityToolType };
    export { TID300Bidirectional as TID300Representation };
    export function isValidCornerstoneTrackingIdentifier(
        TrackingIdentifier: any
    ): boolean;
}
declare const BIDIRECTIONAL: "Bidirectional";
declare const TID300Bidirectional: any;
