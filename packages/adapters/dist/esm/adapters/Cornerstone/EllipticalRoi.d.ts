export default EllipticalRoi;
declare class EllipticalRoi {
    static getMeasurementData(MeasurementGroup: any): {
        toolType: string;
        active: boolean;
        cachedStats: {
            area: any;
        };
        handles: {
            end: {
                x: any;
                y: any;
                highlight: boolean;
                active: boolean;
            };
            initialRotation: number;
            start: {
                x: number;
                y: number;
                highlight: boolean;
                active: boolean;
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
        points: {
            x: number;
            y: number;
        }[];
        trackingIdentifierTextValue: string;
        finding: any;
        findingSites: any;
    };
}
declare namespace EllipticalRoi {
    export { ELLIPTICALROI as toolType };
    export { ELLIPTICALROI as utilityToolType };
    export { TID300Ellipse as TID300Representation };
    export function isValidCornerstoneTrackingIdentifier(
        TrackingIdentifier: any
    ): boolean;
}
declare const ELLIPTICALROI: "EllipticalRoi";
declare const TID300Ellipse: any;
