import MeasurementReport from "./MeasurementReport";
import Length from "./Length";
import FreehandRoi from "./FreehandRoi";
import Bidirectional from "./Bidirectional";
import EllipticalRoi from "./EllipticalRoi";
import CircleRoi from "./CircleRoi";
import ArrowAnnotate from "./ArrowAnnotate";
import CobbAngle from "./CobbAngle";
import Angle from "./Angle";
import RectangleRoi from "./RectangleRoi";
import * as Segmentation from "./Segmentation";
declare const CornerstoneSR: {
    Length: typeof Length;
    FreehandRoi: typeof FreehandRoi;
    Bidirectional: typeof Bidirectional;
    EllipticalRoi: typeof EllipticalRoi;
    CircleRoi: typeof CircleRoi;
    ArrowAnnotate: typeof ArrowAnnotate;
    MeasurementReport: typeof MeasurementReport;
    CobbAngle: typeof CobbAngle;
    Angle: typeof Angle;
    RectangleRoi: typeof RectangleRoi;
};
declare const CornerstoneSEG: {
    Segmentation: typeof Segmentation;
};
declare const CornerstonePMAP: {
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
export { CornerstoneSR, CornerstoneSEG, CornerstonePMAP };
