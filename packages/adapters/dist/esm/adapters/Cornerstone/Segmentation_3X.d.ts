export default Segmentation;
export type BrushData = {
    toolState: any;
    segments: any[];
};
declare namespace Segmentation {
    export { generateSegmentation };
    export { generateToolState };
}
declare function generateSegmentation(
    images: object[],
    brushData: BrushData,
    options?: {
        includeSliceSpacing: boolean;
    }
): type;
declare function generateToolState(
    imageIds: string[],
    arrayBuffer: ArrayBuffer,
    metadataProvider: any
): any;
