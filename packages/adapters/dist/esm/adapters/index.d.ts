import * as Enums from "./enums";
import * as helpers from "./helpers";
declare const adaptersSR: {
    Cornerstone: {
        Length: typeof import("./Cornerstone/Length").default;
        FreehandRoi: typeof import("./Cornerstone/FreehandRoi").default;
        Bidirectional: typeof import("./Cornerstone/Bidirectional").default;
        EllipticalRoi: typeof import("./Cornerstone/EllipticalRoi").default;
        CircleRoi: typeof import("./Cornerstone/CircleRoi").default;
        ArrowAnnotate: typeof import("./Cornerstone/ArrowAnnotate").default;
        MeasurementReport: typeof import("./Cornerstone/MeasurementReport").default;
        CobbAngle: typeof import("./Cornerstone/CobbAngle").default;
        Angle: typeof import("./Cornerstone/Angle").default;
        RectangleRoi: typeof import("./Cornerstone/RectangleRoi").default;
    };
    Cornerstone3D: {
        Bidirectional: typeof import("./Cornerstone3D/Bidirectional").default;
        CobbAngle: typeof import("./Cornerstone3D/CobbAngle").default;
        Angle: typeof import("./Cornerstone3D/Angle").default;
        Length: typeof import("./Cornerstone3D/Length").default;
        CircleROI: typeof import("./Cornerstone3D/CircleROI").default;
        EllipticalROI: typeof import("./Cornerstone3D/EllipticalROI").default;
        RectangleROI: typeof import("./Cornerstone3D/RectangleROI").default;
        ArrowAnnotate: typeof import("./Cornerstone3D/ArrowAnnotate").default;
        Probe: typeof import("./Cornerstone3D/Probe").default;
        PlanarFreehandROI: typeof import("./Cornerstone3D/PlanarFreehandROI").default;
        UltrasoundDirectional: typeof import("./Cornerstone3D/UltrasoundDirectional").default;
        MeasurementReport: typeof import("./Cornerstone3D/MeasurementReport").default;
        CodeScheme: {
            CodingSchemeDesignator: string;
            codeValues: {
                CORNERSTONEFREETEXT: string;
            };
        };
        CORNERSTONE_3D_TAG: string;
    };
};
declare const adaptersSEG: {
    Cornerstone: {
        Segmentation: typeof import("./Cornerstone/Segmentation");
    };
    Cornerstone3D: {
        Segmentation: typeof import("./Cornerstone3D/Segmentation");
    };
    VTKjs: {
        Segmentation: typeof import("./VTKjs/Segmentation").default;
    };
};
declare const adaptersPMAP: {
    Cornerstone: {
        ParametricMap: {
            generateToolState: (
                imageIds: any,
                arrayBuffer: any,
                metadataProvider: any,
                tolerance?: number
            ) => Promise<{
                pixelData: any;
            }>;
        };
    };
    Cornerstone3D: {
        ParametricMap: typeof import("./Cornerstone3D/ParametricMap");
    };
};
declare const adaptersRT: {
    Cornerstone3D: {
        RTSS: typeof import("./Cornerstone3D/RTStruct");
    };
};
export { adaptersSR, adaptersSEG, adaptersPMAP, adaptersRT, Enums, helpers };
