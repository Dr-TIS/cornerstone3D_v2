import { utilities } from "@cornerstonejs/tools";
import {
    generateRTSSFromAnnotations,
    generateRTSSFromSegmentations
} from "./RTSS";
declare const generateContourSetsFromLabelmap: typeof utilities.contours.generateContourSetsFromLabelmap;
export {
    generateContourSetsFromLabelmap,
    generateRTSSFromAnnotations,
    generateRTSSFromSegmentations
};
