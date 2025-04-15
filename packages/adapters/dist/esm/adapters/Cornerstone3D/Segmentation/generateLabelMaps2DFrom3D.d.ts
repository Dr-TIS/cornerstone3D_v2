declare function generateLabelMaps2DFrom3D(labelmap3D: any): {
    scalarData: number[];
    dimensions: number[];
    segmentsOnLabelmap: number[];
    labelmaps2D: {
        segmentsOnLabelmap: number[];
        pixelData: number[];
        rows: number;
        columns: number;
    }[];
};
export { generateLabelMaps2DFrom3D };
