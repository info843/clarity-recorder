export const PRODUCT_MANIFEST = Object.freeze({
  cv_analysis: Object.freeze({
    icon: 'CV',
    title: { de: 'CLARITY CV-Analyse', en: 'CLARITY CV Analysis' },
    description: {
      de: 'Strukturierter Upload- und Analyseprozess für Lebensläufe.',
      en: 'Structured upload and analysis workflow for CVs.'
    },
    steps: ['profile', 'consent', 'upload', 'analysis', 'completion'],
    media: false,
    executable: true
  }),
  video_presentation: Object.freeze({
    icon: 'VP',
    title: { de: 'CLARITY Video-Vorstellung', en: 'CLARITY Video Presentation' },
    description: {
      de: 'Persönliche Videoeinreichung als Ergänzung zum Lebenslauf.',
      en: 'Personal video submission as an addition to the CV.'
    },
    steps: ['profile', 'consent', 'preflight', 'recording', 'submission', 'completion'],
    media: true,
    executable: true
  }),
  snapshot: Object.freeze({
    icon: 'SN',
    title: { de: 'CLARITY Snapshot', en: 'CLARITY Snapshot' },
    description: {
      de: 'Kompakter strukturierter Kurzcheck.',
      en: 'Compact structured screening workflow.'
    },
    steps: ['profile', 'consent', 'questions', 'analysis', 'completion'],
    media: false,
    executable: true,
    releaseScope: 'chat_only'
  }),
  assessment: Object.freeze({
    icon: 'AS',
    title: { de: 'CLARITY Assessment', en: 'CLARITY Assessment' },
    description: {
      de: 'Strukturierter Assessment-Flow. Q10 ist in Chat, Audio, Video, Audio + Chat und Video + Chat freigegeben.',
      en: 'Structured assessment workflow. Q10 is released for chat, audio, video, Audio + Chat and Video + Chat.'
    },
    steps: ['profile', 'consent', 'questions', 'analysis', 'completion'],
    media: false,
    executable: true,
    releaseScope: 'q10_chat_audio_video_audio_chat_video_chat'
  }),
  interview: Object.freeze({
    icon: 'IV',
    title: { de: 'CLARITY Interview', en: 'CLARITY Interview' },
    description: {
      de: 'Strukturiertes Interview. Chat Q10 und Audio Q10 sind freigegeben; Video und Mix folgen auf derselben technischen Basis.',
      en: 'Structured Interview. Chat Q10 and Audio Q10 are released; video and mix follow on the same technical foundation.'
    },
    steps: ['profile', 'consent', 'interview', 'analysis', 'completion'],
    media: true,
    executable: true,
    releaseScope: 'q10_chat_audio'
  }),
  ai_literacy: Object.freeze({
    icon: 'AI',
    title: { de: 'AI Literacy & Qualification', en: 'AI Literacy & Qualification' },
    description: {
      de: 'Training, Wissenstest, Report und Zertifikat in einem dokumentierten Prozess.',
      en: 'Training, knowledge test, report and certificate in one documented process.'
    },
    steps: ['profile', 'consent', 'training', 'knowledge_test', 'result', 'evidence'],
    media: false,
    executable: true
  })
});

export function getProductManifest(productKey) {
  return PRODUCT_MANIFEST[String(productKey || '').toLowerCase()] || null;
}
