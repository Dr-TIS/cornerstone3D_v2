var codeMeaningEquals = function codeMeaningEquals(codeMeaningName) {
    return function (contentItem) {
        return (
            contentItem.ConceptNameCodeSequence.CodeMeaning === codeMeaningName
        );
    };
};

export { codeMeaningEquals };
