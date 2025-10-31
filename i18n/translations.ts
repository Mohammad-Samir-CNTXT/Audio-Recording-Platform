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
    skipParagraph: {
        ar: "تخطّي",
        en: "Skip",
    },
    // Status Messages
    statusRecording: {
        ar: "التسجيل جاري الآن... تحدث بوضوح.",
        en: "Recording now... Please speak clearly.",
    },
    statusProcessing: {
        ar: "نقوم بإنهاء ملفك الصوتي، قد يستغرق هذا لحظات. من فضلك لا تغلق الصفحة.",
        en: "Finalizing your audio, this may take a moment. Please don't close the page.",
    },
    statusSuccess: {
        ar: "تم الحفظ بنجاح! يمكن للمراجعين الآن رؤية تسجيلك.",
        en: "Saved successfully! Reviewers can now see your recording.",
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
    statusNoNewParagraphs: {
        ar: "رائع! لقد قمت بتسجيل جميع الفقرات المتاحة.",
        en: "Great! You have recorded all available paragraphs."
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
    reviewTabTitleWithCount: {
        ar: "مراجعة التسجيلات ({count})",
        en: "Review Recordings ({count})",
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
    // Admin Dashboard
    adminDashboardTab: {
        ar: "لوحة التحكم",
        en: "Admin Dashboard",
    },
    adminDashboardTitle: {
        ar: "إدارة المستخدمين",
        en: "User Management",
    },
    userEmail: {
        ar: "البريد الإلكتروني",
        en: "User Email",
    },
    userRole: {
        ar: "الدور",
        en: "Role",
    },
    roleAdmin: {
        ar: "مدير",
        en: "Admin",
    },
    roleReviewer: {
        ar: "مراجع",
        en: "Reviewer",
    },
    roleVoiceActor: {
        ar: "ممثل صوتي",
        en: "Voice Actor",
    },
    noUsersFound: {
        ar: "لم يتم العثور على مستخدمين.",
        en: "No users found."
    },
    addUserSectionTitle: {
        ar: "إضافة مستخدم جديد",
        en: "Add New User",
    },
    addUserButton: {
        ar: "إضافة مستخدم",
        en: "Add User",
    },
    emailExistsError: {
        ar: "هذا البريد الإلكتروني مسجل بالفعل.",
        en: "This email already exists.",
    },
    userAddedSuccess: {
        ar: "تمت إضافة المستخدم بنجاح.",
        en: "User added successfully.",
    },
    selectRolePrompt: {
        ar: "اختر دورًا...",
        en: "Select a role...",
    },
    invalidEmailError: {
        ar: "الرجاء إدخال بريد إلكتروني صالح.",
        en: "Please enter a valid email.",
    },
    roleRequiredError: {
        ar: "الرجاء اختيار دور للمستخدم.",
        en: "Please select a role for the user.",
    },
    remaining: {
        ar: "{seconds} ثانية متبقية",
        en: "{seconds}s remaining"
    },
    exportDataTitle: {
        ar: "تصدير البيانات",
        en: "Export Data",
    },
    exportDataDescription: {
        ar: "تنزيل جميع التسجيلات المقبولة وبياناتها الوصفية في ملف JSON واحد.",
        en: "Download all accepted recordings and their metadata as a single JSON file.",
    },
    exportDataButton: {
        ar: "تصدير البيانات",
        en: "Export Data",
    },
    adminStatsTitle: {
        ar: "إحصائيات المشروع",
        en: "Project Statistics",
    },
    totalUsersStat: {
        ar: "إجمالي المستخدمين",
        en: "Total Users",
    },
    pendingRecordingsStat: {
        ar: "تسجيلات قيد المراجعة",
        en: "Pending Recordings",
    },
    acceptedRecordingsStat: {
        ar: "تسجيلات مقبولة",
        en: "Accepted Recordings",
    },
    exportingData: {
        ar: "جاري التصدير...",
        en: "Exporting...",
    }
};