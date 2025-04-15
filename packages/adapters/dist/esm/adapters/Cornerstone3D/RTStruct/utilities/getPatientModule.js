function getPatientModule(imageId, metadataProvider) {
    var generalSeriesModule = metadataProvider.get(
        "generalSeriesModule",
        imageId
    );
    var generalStudyModule = metadataProvider.get(
        "generalStudyModule",
        imageId
    );
    var patientStudyModule = metadataProvider.get(
        "patientStudyModule",
        imageId
    );
    var patientModule = metadataProvider.get("patientModule", imageId);
    var patientDemographicModule = metadataProvider.get(
        "patientDemographicModule",
        imageId
    );
    return {
        Modality: generalSeriesModule.modality,
        PatientID: patientModule.patientId,
        PatientName: patientModule.patientName,
        PatientBirthDate: "",
        PatientAge: patientStudyModule.patientAge,
        PatientSex: patientDemographicModule.patientSex,
        PatientWeight: patientStudyModule.patientWeight,
        StudyDate: generalStudyModule.studyDate,
        StudyTime: generalStudyModule.studyTime,
        StudyID: "ToDo",
        AccessionNumber: generalStudyModule.accessionNumber
    };
}

export { getPatientModule as default };
