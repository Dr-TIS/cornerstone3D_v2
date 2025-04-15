// This is a custom coding scheme defined to store some annotations from Cornerstone.
// Note: CodeMeaning is VR type LO, which means we only actually support 64 characters
// here this is fine for most labels, but may be problematic at some point.
var CORNERSTONEFREETEXT = "CORNERSTONEFREETEXT";

// Cornerstone specified coding scheme for storing findings
var CodingSchemeDesignator = "CORNERSTONEJS";
var CodingScheme = {
    CodingSchemeDesignator: CodingSchemeDesignator,
    codeValues: {
        CORNERSTONEFREETEXT: CORNERSTONEFREETEXT
    }
};

export { CodingScheme as default };
