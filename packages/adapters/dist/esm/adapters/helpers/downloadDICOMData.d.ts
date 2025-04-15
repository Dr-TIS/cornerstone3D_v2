interface DicomDataset {
    _meta?: unknown;
}
export declare function downloadDICOMData(
    bufferOrDataset: ArrayBuffer | DicomDataset,
    filename: string
): void;
export {};
