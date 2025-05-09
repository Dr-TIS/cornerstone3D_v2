declare class Bidirectional {
    static toolType: string;
    static utilityToolType: string;
    static TID300Representation: any;
    static isValidCornerstoneTrackingIdentifier: (
        TrackingIdentifier: any
    ) => boolean;
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
        longAxis: {
            point1: {
                x: any;
                y: any;
            };
            point2: {
                x: any;
                y: any;
            };
        };
        shortAxis: {
            point1: {
                x: any;
                y: any;
            };
            point2: {
                x: any;
                y: any;
            };
        };
        longAxisLength: any;
        shortAxisLength: any;
        trackingIdentifierTextValue: string;
        finding: any;
        findingSites: any;
    };
}
export default Bidirectional;
