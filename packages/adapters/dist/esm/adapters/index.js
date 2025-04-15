import {
    CornerstoneSR,
    CornerstoneSEG,
    CornerstonePMAP
} from "./Cornerstone/index.js";
import {
    Cornerstone3DSR,
    Cornerstone3DSEG,
    Cornerstone3DPMAP,
    Cornerstone3DRT
} from "./Cornerstone3D/index.js";
import { VTKjsSEG } from "./VTKjs/index.js";
import "./enums/Events.js";
import "./helpers/downloadDICOMData.js";

var adaptersSR = {
    Cornerstone: CornerstoneSR,
    Cornerstone3D: Cornerstone3DSR
};
var adaptersSEG = {
    Cornerstone: CornerstoneSEG,
    Cornerstone3D: Cornerstone3DSEG,
    VTKjs: VTKjsSEG
};
var adaptersPMAP = {
    Cornerstone: CornerstonePMAP,
    Cornerstone3D: Cornerstone3DPMAP
};
var adaptersRT = {
    Cornerstone3D: Cornerstone3DRT
};

export { adaptersPMAP, adaptersRT, adaptersSEG, adaptersSR };
