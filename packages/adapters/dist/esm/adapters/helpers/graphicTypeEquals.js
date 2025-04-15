var graphicTypeEquals = function graphicTypeEquals(graphicType) {
    return function (contentItem) {
        return contentItem && contentItem.GraphicType === graphicType;
    };
};

export { graphicTypeEquals };
