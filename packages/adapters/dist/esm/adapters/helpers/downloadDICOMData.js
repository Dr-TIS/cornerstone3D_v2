import { data } from "dcmjs";
import { Buffer } from "buffer";

var datasetToDict = data.datasetToDict;
function downloadDICOMData(bufferOrDataset, filename) {
    var blob;
    if (bufferOrDataset instanceof ArrayBuffer) {
        blob = new Blob([bufferOrDataset], {
            type: "application/dicom"
        });
    } else {
        if (!bufferOrDataset._meta) {
            throw new Error("Dataset must have a _meta property");
        }
        var buffer = Buffer.from(datasetToDict(bufferOrDataset).write());
        blob = new Blob([buffer], {
            type: "application/dicom"
        });
    }
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

export { downloadDICOMData };
