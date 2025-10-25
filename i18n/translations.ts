
export const translations = {
    // App.tsx & General
    appTitle: {
        ar: "منصة تسجيل النصوص الصوتية",
        en: "Audio Transcription Recording Platform",
    },
    appDescription: {
        ar: "الرجاء ملء بيانات المتحدث ثم اضغط على \"ابدأ التسجيل\" لقراءة الفقرة أدناه.",
        en: "Please fill in the speaker information, then press 'Start Recording' to read the paragraph below.",
    },
    loggedInAs: {
        ar: "تسجيل الدخول كـ:",
        en: "Logged in as:",
    },
    logout: {
        ar: "تسجيل الخروج",
        en: "Logout",
    },
    completedRecordings: {
        ar: "عدد التسجيلات المكتملة:",
        en: "Completed Recordings:",
    },
    loading: {
        ar: "جاري التحميل...",
        en: "Loading...",
    },
    // Tabs
    recordTab: {
        ar: "تسجيل",
        en: "Record",
    },
    reviewTab: {
        ar: "مراجعة",
        en: "Review",
    },
    // Login.tsx
    loginTitle: {
        ar: "تسجيل الدخول",
        en: "Login",
    },
    loginDescription: {
        ar: "الرجاء إدخال بريدك الإلكتروني لمتابعة التسجيلات.",
        en: "Please enter your email to continue with your recordings.",
    },
    emailLabel: {
        ar: "البريد الإلكتروني",
        en: "Email Address",
    },
    emailPlaceholder: {
        ar: "user@example.com",
        en: "user@example.com",
    },
    loginButton: {
        ar: "دخول",
        en: "Login",
    },
    emailError: {
        ar: "الرجاء إدخال بريد إلكتروني صحيح.",
        en: "Please enter a valid email address.",
    },
    // SpeakerForm.tsx
    speakerInfoTitle: {
        ar: "بيانات المتحدث",
        en: "Speaker Information",
    },
    speakerIdLabel: {
        ar: "مُعرّف المتحدث (Speaker ID)",
        en: "Speaker ID",
    },
    placeOfBirthLabel: {
        ar: "مكان الميلاد (Place of Birth)",
        en: "Place of Birth",
    },
    genderLabel: {
        ar: "النوع (Gender)",
        en: "Gender",
    },
    genderMale: {
        ar: "ذكر",
        en: "Male",
    },
    genderFemale: {
        ar: "أنثى",
        en: "Female",
    },
    genderOther: {
        ar: "آخر",
        en: "Other",
    },
    ageLabel: {
        ar: "العمر (Age)",
        en: "Age",
    },
    // TranscriptDisplay.tsx
    transcriptTitle: {
        ar: "الفقرة النصية للتسجيل",
        en: "Transcript for Recording",
    },
    // Controls.tsx
    startRecording: {
        ar: "ابدأ التسجيل",
        en: "Start Recording",
    },
    stopAndSave: {
        ar: "إيقاف وحفظ",
        en: "Stop & Save",
    },
    nextParagraph: {
        ar: "الفقرة التالية",
        en: "Next Paragraph",
    },
    // Status Messages
    statusRecording: {
        ar: "جارٍ التسجيل... (الحد الأقصى 70 ثانية)",
        en: "Recording... (70 seconds max)",
    },
    statusProcessing: {
        ar: "يتم تحويل الملف...",
        en: "Processing file...",
    },
    statusSuccess: {
        ar: "تم الحفظ بنجاح! يمكنك مراجعة التسجيل في تبويب المراجعة.",
        en: "Saved successfully! You can review the recording in the Review tab.",
    },
    statusAutoStopped: {
        ar: "تم إيقاف التسجيل تلقائيًا بعد 70 ثانية.",
        en: "Recording stopped automatically after 70 seconds.",
    },
    statusMicError: {
        ar: "خطأ: الرجاء السماح بالوصول إلى الميكروفون.",
        en: "Error: Please allow microphone access.",
    },
    statusDurationError: {
        ar: "خطأ في حساب مدة الملف.",
        en: "Error calculating file duration.",
    },
    statusConversionError: {
        ar: "فشل تحويل الملف الصوتي.",
        en: "Failed to convert audio file.",
    },
    statusParagraphsError: {
        ar: "فشل تحميل الفقرات.",
        en: "Failed to load paragraphs.",
    },
    statusLoadingParagraphs: {
        ar: "جاري تحميل الفقرات...",
        en: "Loading paragraphs...",
    },
    statusReRecord: {
        ar: "الرجاء التسجيل مرة أخرى.",
        en: "Please record again.",
    },
    alertFillFields: {
        ar: "الرجاء ملء جميع حقول بيانات المتحدث.",
        en: "Please fill out all speaker information fields.",
    },
    recordingAccepted: {
        ar: "تم قبول التسجيل.",
        en: "Recording accepted.",
    },
    recordingRejected: {
        ar: "تم رفض التسجيل وحذفه.",
        en: "Recording rejected and deleted.",
    },
    // MetadataDisplay.tsx
    metadataTitle: {
        ar: "البيانات الوصفية والتنزيل",
        en: "Metadata & Downloads",
    },
    listenToRecording: {
        ar: "الاستماع إلى التسجيل",
        en: "Listen to Recording",
    },
    audioUnsupported: {
        ar: "متصفحك لا يدعم عنصر الصوت.",
        en: "Your browser does not support the audio element.",
    },
    downloadWav: {
        ar: "تحميل ملف WAV",
        en: "Download WAV",
    },
    downloadJson: {
        ar: "تحميل ملف JSON",
        en: "Download JSON",
    },
    reRecord: {
        ar: "إعادة التسجيل",
        en: "Re-record",
    },
    // ReviewTab.tsx
    reviewTabTitle: {
        ar: "مراجعة التسجيلات",
        en: "Review Recordings",
    },
    accept: {
        ar: "قبول",
        en: "Accept",
    },
    reject: {
        ar: "رفض",
        en: "Reject",
    },
    noRecordingsForReview: {
        ar: "لا توجد تسجيلات للمراجعة حاليًا.",
        en: "There are no recordings to review at the moment.",
    },
};
