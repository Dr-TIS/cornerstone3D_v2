import { data, normalizers } from "dcmjs";

var DicomMessage = data.DicomMessage,
    DicomMetaDictionary = data.DicomMetaDictionary;
var Normalizer = normalizers.Normalizer;
function getDatasetsFromImages(images, isMultiframe, options) {
    var datasets = [];
    if (isMultiframe) {
        var image = images[0];
        var arrayBuffer = image.data.byteArray.buffer;
        var dicomData = DicomMessage.readFile(arrayBuffer);
        var dataset = DicomMetaDictionary.naturalizeDataset(dicomData.dict);
        dataset._meta = DicomMetaDictionary.namifyDataset(dicomData.meta);
        datasets.push(dataset);
    } else {
        for (var i = 0; i < images.length; i++) {
            var _image = images[i];
            var _arrayBuffer = _image.data.byteArray.buffer;
            var _dicomData = DicomMessage.readFile(_arrayBuffer);
            var _dataset = DicomMetaDictionary.naturalizeDataset(
                _dicomData.dict
            );
            _dataset._meta = DicomMetaDictionary.namifyDataset(_dicomData.meta);
            datasets.push(_dataset);
        }
    }
    if (
        options !== null &&
        options !== void 0 &&
        options.SpecificCharacterSet
    ) {
        datasets.forEach(function (dataset) {
            return (dataset.SpecificCharacterSet =
                options.SpecificCharacterSet);
        });
    }
    return Normalizer.normalizeToDataset(datasets);
}

export { getDatasetsFromImages as default };
