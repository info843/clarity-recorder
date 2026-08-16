// CLARITY Universal Candidate App — participant legal information v1.3
// UI copy only. The inviting organisation remains responsible for providing
// any controller-specific legal basis, retention period and contact details.

export const CANDIDATE_LEGAL_VERSION = 'universal-candidate-notice-v1.3';
export const CANDIDATE_LEGAL_UPDATED_AT = '2026-08-15';
export const CANDIDATE_LEGAL_LANGUAGES = Object.freeze(['en','de','es','fr','it','pt','nl','pl','tr','ar']);

const CONTENT = {
  en: {
    participation: {
      title: 'CLARITY – Information on Participation, Data Processing and AI Analysis',
      intro: 'You have been invited by an organisation to complete a CLARITY interview, assessment or another structured workflow. This notice explains the technical process and supplements the privacy information supplied by the inviting organisation.',
      sections: [
        ['1. Roles and responsibility', 'The inviting organisation determines the purpose of the workflow, the applicable legal basis, who may access the result and how it is used. CLARITY generally processes the data on that organisation’s instructions to provide the CLARITY Decision Intelligence Platform. Questions about an application, employment decision, retention period or deletion should normally be addressed first to the inviting organisation.'],
        ['2. Data used in the workflow', 'Depending on the selected module and mode, the workflow may process your name, contact and reference details; link, device, time and status data; uploaded documents; written answers and chat messages; voice and video recordings; transcripts; technical security logs; and AI-assisted analyses, summaries, indicators, scores and reports. Only data required for the configured workflow should be collected.'],
        ['3. Audio, video and device permissions', 'Audio modes require microphone access. Video modes require camera and microphone access. The App asks for the relevant device permission before recording. Recordings may be used for secure capture, transcription, structured analysis, report creation and delivery to the inviting organisation. CLARITY does not use these recordings for facial recognition, biometric identification or hidden emotion recognition as part of the described workflow.'],
        ['4. How AI is used', 'AI may help transcribe and structure answers, identify job- or skill-related signals, summarise content and prepare reports. Outputs can be incomplete, inaccurate or dependent on context. They are decision-support information, not a factual guarantee or an independent final decision.'],
        ['5. Human oversight and significant decisions', 'CLARITY does not make the final decision on hiring, rejection, promotion, suitability or another similarly significant outcome. The inviting organisation must use appropriately qualified people to interpret the output, consider relevant context, avoid automatic over-reliance and disregard or override the output where appropriate.'],
        ['6. Results and authorised access', 'After completion, the inviting organisation may receive the structured result, report, transcript, submitted documents, media assets and technical completion status in CLARITY Workspace. Access should be limited to authorised persons and used only for the stated purpose. CLARITY does not sell participant data or disclose it for third-party advertising.'],
        ['7. Storage and deletion', 'Data is retained only for the period required for delivery, security, traceability, contractual obligations or applicable law. The exact period is set by the inviting organisation and its agreement with CLARITY. Media should generally not be kept longer than necessary; reports and transcripts may follow a different approved retention period.'],
        ['8. Your choices and rights', 'Depending on applicable law, you may have rights of access, correction, deletion, restriction, objection, portability and review of a decision. Contact the inviting organisation for its identity, legal basis, exact retention period and rights process. CLARITY supports valid requests in its role as technical service provider. If you do not wish to continue or cannot use a required recording mode, contact the inviting organisation before starting.'],
        ['9. Confirmation', 'By continuing, you confirm that this information was available to you and that you understand the described workflow. This confirmation does not replace the inviting organisation’s obligation to identify and document an appropriate legal basis. Microphone and camera processing are confirmed separately when required.']
      ]
    },
    privacy: {
      title: 'CLARITY Cookie, Privacy and AI Notice',
      intro: 'This notice describes the privacy and technical storage used by the CLARITY Universal Candidate App. It applies to the candidate link you opened and should be read together with information from the inviting organisation.',
      sections: [
        ['1. Essential technical storage', 'The Candidate App uses strictly necessary browser storage, session identifiers and security tokens to verify the invitation, keep the workflow on the correct step, prevent duplicate processing and recover safely after a temporary connection problem. These technologies are required to provide the requested service. The candidate workflow does not use advertising cookies or third-party behavioural advertising.'],
        ['2. Data controller and processor', 'The inviting organisation is generally the controller for the candidate workflow because it defines the purpose and use of the results. CLARITY generally acts as its processor and platform provider. In limited cases CLARITY may process security, service-integrity or legal-compliance data under its own responsibilities.'],
        ['3. Purposes of processing', 'Data is processed to authenticate the link, maintain security, provide the selected module, capture answers or uploads, transcribe media where applicable, generate structured analysis and reports, publish authorised results to CLARITY Workspace, provide technical support and maintain an audit trail.'],
        ['4. AI transparency', 'The workflow tells you when AI supports transcription, analysis or report preparation. AI output may include summaries, competence-related indications or scores. It must be interpreted in context and reviewed by a responsible person. It must not be treated as the sole basis for a significant employment or similar decision.'],
        ['5. Recipients and service providers', 'Information may be available to authorised users of the inviting organisation and to contracted technical providers needed for hosting, media processing, transcription, security, analysis or report delivery. Access is limited by role and purpose. Data is not supplied to advertisers.'],
        ['6. International processing', 'Technical providers may process data in more than one country. Where data is transferred across applicable legal areas, the inviting organisation and CLARITY must use the required contractual, organisational and technical safeguards. The inviting organisation can provide details relevant to its workflow.'],
        ['7. Security and reliability', 'CLARITY uses access controls, scoped links and tokens, encrypted transport, status and audit records, and idempotent recovery controls intended to reduce unauthorised access and duplicate processing. No online system can guarantee absolute security; suspected incidents should be reported promptly to the inviting organisation or CLARITY support.'],
        ['8. Retention, rights and contact', 'The inviting organisation specifies the legal basis, exact retention period and primary privacy contact. Depending on the law that applies, you may request access, correction, deletion, restriction, objection, portability or human review. Start with the organisation that invited you; CLARITY assists it with valid technical requests.'],
        ['9. Notice version', 'This App records the notice version and language confirmed with the workflow. Material changes require a new version. The current version is 1.3, dated 15 August 2026.']
      ]
    }
  },
  de: {
    participation: {
      title: 'CLARITY – Informationen zur Teilnahme, Datenverarbeitung und KI-Analyse',
      intro: 'Sie wurden von einer Organisation zu einem CLARITY Interview, Assessment oder einem anderen strukturierten Workflow eingeladen. Diese Hinweise erläutern den technischen Ablauf und ergänzen die Datenschutzinformationen der einladenden Organisation.',
      sections: [
        ['1. Rollen und Verantwortung', 'Die einladende Organisation bestimmt Zweck, Rechtsgrundlage, zugriffsberechtigte Personen und die spätere Verwendung der Ergebnisse. CLARITY verarbeitet die Daten grundsätzlich im Auftrag dieser Organisation, um die CLARITY Decision Intelligence Platform bereitzustellen. Fragen zu Bewerbung, Personalentscheidung, Aufbewahrung oder Löschung richten Sie in der Regel zuerst an die einladende Organisation.'],
        ['2. Im Workflow verarbeitete Daten', 'Je nach Modul und Modus können Name, Kontakt- und Referenzangaben, Link-, Geräte-, Zeit- und Statusdaten, hochgeladene Dokumente, schriftliche Antworten und Chats, Sprach- und Videoaufnahmen, Transkripte, technische Sicherheitsprotokolle sowie KI-gestützte Analysen, Zusammenfassungen, Hinweise, Scores und Reports verarbeitet werden. Es sollen nur die für den konfigurierten Workflow erforderlichen Daten erhoben werden.'],
        ['3. Audio, Video und Gerätefreigaben', 'Audiomodi benötigen das Mikrofon. Videomodi benötigen Kamera und Mikrofon. Die App fragt die jeweilige Gerätefreigabe vor der Aufnahme ab. Aufnahmen können zur sicheren Erfassung, Transkription, strukturierten Analyse, Reporterstellung und Bereitstellung an die einladende Organisation verwendet werden. Im beschriebenen Workflow nutzt CLARITY sie nicht für Gesichtserkennung, biometrische Identifizierung oder verdeckte Emotionserkennung.'],
        ['4. Einsatz von KI', 'KI kann Antworten transkribieren und strukturieren, arbeits- oder kompetenzbezogene Signale ableiten, Inhalte zusammenfassen und Reports vorbereiten. Ergebnisse können unvollständig, fehlerhaft oder kontextabhängig sein. Sie sind Informationen zur Entscheidungsunterstützung, keine Tatsachengarantie und keine eigenständige Endentscheidung.'],
        ['5. Menschliche Aufsicht und bedeutsame Entscheidungen', 'CLARITY trifft nicht die endgültige Entscheidung über Einstellung, Ablehnung, Beförderung, Eignung oder eine vergleichbar bedeutsame Folge. Die einladende Organisation muss qualifizierte Personen einsetzen, die Ergebnisse im Kontext prüfen, automatische Überbewertung vermeiden und Ausgaben bei Bedarf verwerfen oder übersteuern.'],
        ['6. Ergebnisse und berechtigter Zugriff', 'Nach Abschluss kann die einladende Organisation strukturierte Ergebnisse, Reports, Transkripte, eingereichte Dokumente, Medien und den technischen Abschlussstatus im CLARITY Workspace erhalten. Der Zugriff soll auf berechtigte Personen beschränkt und nur für den angegebenen Zweck genutzt werden. CLARITY verkauft keine Teilnehmerdaten und gibt sie nicht für Werbung Dritter weiter.'],
        ['7. Speicherung und Löschung', 'Daten werden nur so lange aufbewahrt, wie dies für Leistungserbringung, Sicherheit, Nachvollziehbarkeit, vertragliche Pflichten oder geltendes Recht erforderlich ist. Die konkrete Dauer bestimmt die einladende Organisation im Rahmen ihrer Vereinbarung mit CLARITY. Medien sollen grundsätzlich nicht länger als nötig gespeichert werden; für Reports und Transkripte kann eine andere genehmigte Frist gelten.'],
        ['8. Wahlmöglichkeiten und Rechte', 'Je nach anwendbarem Recht können Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Übertragbarkeit und Überprüfung einer Entscheidung bestehen. Die Identität des Verantwortlichen, Rechtsgrundlage, konkrete Aufbewahrungsfrist und das Rechteverfahren erfragen Sie bei der einladenden Organisation. CLARITY unterstützt berechtigte Anfragen als technischer Dienstleister. Wenn Sie nicht fortfahren oder einen erforderlichen Aufnahmemodus nicht nutzen möchten, wenden Sie sich vor dem Start an die einladende Organisation.'],
        ['9. Bestätigung', 'Mit dem Fortfahren bestätigen Sie, dass diese Informationen verfügbar waren und Sie den beschriebenen Ablauf verstanden haben. Die Bestätigung ersetzt nicht die Pflicht der einladenden Organisation, eine geeignete Rechtsgrundlage festzulegen und zu dokumentieren. Mikrofon- und Kameraverarbeitung werden bei Bedarf separat bestätigt.']
      ]
    },
    privacy: {
      title: 'CLARITY Cookie-, Datenschutz- und KI-Hinweise',
      intro: 'Diese Hinweise beschreiben Datenschutz und technische Speicherung der CLARITY Universal Candidate App. Sie gelten für den geöffneten Teilnehmerlink und sind zusammen mit den Informationen der einladenden Organisation zu lesen.',
      sections: [
        ['1. Erforderliche technische Speicherung', 'Die Candidate App verwendet ausschließlich erforderliche Browserspeicher, Sitzungskennungen und Sicherheitstoken, um die Einladung zu prüfen, den richtigen Ablaufschritt zu speichern, doppelte Verarbeitung zu verhindern und nach kurzfristigen Verbindungsproblemen sicher fortzufahren. Diese Technologien sind für den angeforderten Dienst notwendig. Im Teilnehmerworkflow werden keine Werbe-Cookies oder verhaltensbasierte Drittwerbung eingesetzt.'],
        ['2. Verantwortlicher und Auftragsverarbeiter', 'Die einladende Organisation ist für den Teilnehmerworkflow grundsätzlich Verantwortlicher, da sie Zweck und Ergebnisverwendung festlegt. CLARITY handelt grundsätzlich als Auftragsverarbeiter und Plattformanbieter. In begrenzten Fällen kann CLARITY Sicherheits-, Dienstintegritäts- oder Compliance-Daten in eigener Verantwortung verarbeiten.'],
        ['3. Verarbeitungszwecke', 'Daten werden verarbeitet, um den Link zu authentifizieren, Sicherheit zu gewährleisten, das gewählte Modul bereitzustellen, Antworten oder Uploads zu erfassen, Medien gegebenenfalls zu transkribieren, strukturierte Analysen und Reports zu erstellen, berechtigte Ergebnisse im CLARITY Workspace bereitzustellen, technischen Support zu leisten und einen Prüfpfad zu führen.'],
        ['4. KI-Transparenz', 'Der Workflow weist darauf hin, wenn KI Transkription, Analyse oder Reporterstellung unterstützt. KI-Ausgaben können Zusammenfassungen, kompetenzbezogene Hinweise oder Scores enthalten. Sie müssen im Kontext interpretiert und von einer verantwortlichen Person geprüft werden. Sie dürfen nicht alleinige Grundlage einer bedeutsamen Personal- oder vergleichbaren Entscheidung sein.'],
        ['5. Empfänger und Dienstleister', 'Informationen können berechtigten Nutzern der einladenden Organisation und beauftragten technischen Dienstleistern für Hosting, Medienverarbeitung, Transkription, Sicherheit, Analyse oder Reportbereitstellung zugänglich sein. Zugriffe sind nach Rolle und Zweck zu begrenzen. Daten werden nicht an Werbetreibende weitergegeben.'],
        ['6. Internationale Verarbeitung', 'Technische Dienstleister können Daten in mehreren Ländern verarbeiten. Bei Übermittlungen zwischen Rechtsräumen müssen die einladende Organisation und CLARITY die erforderlichen vertraglichen, organisatorischen und technischen Schutzmaßnahmen einsetzen. Workflowbezogene Einzelheiten stellt die einladende Organisation bereit.'],
        ['7. Sicherheit und Zuverlässigkeit', 'CLARITY nutzt Zugriffskontrollen, zweckgebundene Links und Token, verschlüsselte Übertragung, Status- und Auditdaten sowie idempotente Wiederherstellungskontrollen, um unberechtigten Zugriff und doppelte Verarbeitung zu reduzieren. Kein Onlinesystem kann absolute Sicherheit garantieren; Verdachtsfälle sollen unverzüglich an die einladende Organisation oder den CLARITY Support gemeldet werden.'],
        ['8. Aufbewahrung, Rechte und Kontakt', 'Die einladende Organisation nennt Rechtsgrundlage, konkrete Aufbewahrungsfrist und primären Datenschutzkontakt. Je nach anwendbarem Recht können Sie Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Übertragbarkeit oder menschliche Überprüfung verlangen. Wenden Sie sich zuerst an die einladende Organisation; CLARITY unterstützt sie bei berechtigten technischen Anfragen.'],
        ['9. Version der Hinweise', 'Die App protokolliert die bestätigte Version und Sprache der Hinweise. Wesentliche Änderungen erhalten eine neue Version. Aktuell gilt Version 1.3 vom 15. August 2026.']
      ]
    }
  },
  es: {
    participation: {
      title: 'CLARITY – Información sobre la participación, el tratamiento de datos y el análisis con IA',
      intro: 'Una organización le ha invitado a realizar una entrevista, una evaluación u otro flujo estructurado de CLARITY. Este aviso explica el proceso técnico y complementa la información de privacidad facilitada por la organización invitante.',
      sections: [
        ['1. Funciones y responsabilidad', 'La organización invitante determina la finalidad, la base jurídica, las personas autorizadas y el uso posterior de los resultados. CLARITY trata normalmente los datos siguiendo sus instrucciones para prestar la CLARITY Decision Intelligence Platform. Las consultas sobre candidatura, decisión laboral, conservación o eliminación deben dirigirse primero a la organización invitante.'],
        ['2. Datos utilizados', 'Según el módulo y el modo, pueden tratarse datos de identidad y contacto, referencias, datos del enlace, dispositivo, hora y estado, documentos cargados, respuestas escritas y chats, grabaciones de voz y vídeo, transcripciones, registros de seguridad y análisis, resúmenes, indicadores, puntuaciones e informes asistidos por IA. Solo deben recogerse los datos necesarios para el flujo configurado.'],
        ['3. Audio, vídeo y permisos', 'Los modos de audio requieren micrófono; los de vídeo, cámara y micrófono. La App solicita el permiso antes de grabar. Las grabaciones pueden utilizarse para capturar, transcribir, analizar de forma estructurada, crear informes y entregarlos a la organización invitante. En este flujo CLARITY no las utiliza para reconocimiento facial, identificación biométrica ni reconocimiento oculto de emociones.'],
        ['4. Uso de la IA', 'La IA puede transcribir y estructurar respuestas, identificar señales relacionadas con el puesto o las competencias, resumir contenido y preparar informes. Los resultados pueden ser incompletos, inexactos o depender del contexto. Apoyan la decisión, pero no garantizan hechos ni constituyen una decisión final independiente.'],
        ['5. Supervisión humana', 'CLARITY no adopta la decisión final sobre contratación, rechazo, promoción, idoneidad u otro efecto similar. La organización invitante debe asignar personas cualificadas para interpretar el resultado, considerar el contexto, evitar la confianza automática y descartar o modificar el resultado cuando corresponda.'],
        ['6. Resultados y acceso', 'Al finalizar, la organización puede recibir en CLARITY Workspace el resultado estructurado, informe, transcripción, documentos, medios y estado técnico. El acceso debe limitarse a personas autorizadas y a la finalidad indicada. CLARITY no vende datos de participantes ni los facilita para publicidad de terceros.'],
        ['7. Conservación', 'Los datos se conservan solo durante el tiempo necesario para la prestación, seguridad, trazabilidad, obligaciones contractuales o ley aplicable. La duración concreta la establece la organización invitante y su acuerdo con CLARITY. Los medios no deben guardarse más de lo necesario; informes y transcripciones pueden tener otro plazo aprobado.'],
        ['8. Opciones y derechos', 'Según la ley aplicable, puede tener derechos de acceso, rectificación, supresión, limitación, oposición, portabilidad y revisión. Solicite a la organización invitante su identidad como responsable, base jurídica, plazo y procedimiento. CLARITY presta apoyo técnico. Si no desea continuar o no puede usar el modo de grabación requerido, contacte con la organización antes de comenzar.'],
        ['9. Confirmación', 'Al continuar confirma que esta información estaba disponible y que comprende el flujo descrito. Esta confirmación no sustituye la obligación de la organización de definir y documentar una base jurídica adecuada. El micrófono y la cámara se confirman por separado cuando son necesarios.']
      ]
    },
    privacy: {
      title: 'Aviso de cookies, privacidad e IA de CLARITY',
      intro: 'Este aviso describe la privacidad y el almacenamiento técnico de la CLARITY Universal Candidate App. Se aplica al enlace de participante abierto y debe leerse junto con la información de la organización invitante.',
      sections: [
        ['1. Almacenamiento técnico esencial', 'La App utiliza únicamente almacenamiento esencial del navegador, identificadores de sesión y tokens de seguridad para verificar la invitación, mantener el paso correcto, evitar duplicados y recuperar el proceso tras una interrupción. Son necesarios para prestar el servicio. El flujo de participantes no utiliza cookies publicitarias ni publicidad comportamental de terceros.'],
        ['2. Responsable y encargado', 'La organización invitante suele ser responsable porque define la finalidad y el uso de los resultados. CLARITY suele actuar como encargado y proveedor de plataforma. En casos limitados puede tratar datos de seguridad, integridad del servicio o cumplimiento bajo responsabilidad propia.'],
        ['3. Finalidades', 'Los datos se tratan para autenticar el enlace, mantener la seguridad, prestar el módulo, capturar respuestas o cargas, transcribir medios, generar análisis e informes, publicar resultados autorizados en CLARITY Workspace, prestar soporte y conservar trazabilidad.'],
        ['4. Transparencia de IA', 'El flujo indica cuándo la IA apoya la transcripción, el análisis o el informe. Puede producir resúmenes, indicadores o puntuaciones. Deben interpretarse en contexto y revisarse por una persona responsable; no deben ser la única base de una decisión laboral significativa.'],
        ['5. Destinatarios', 'La información puede ser accesible a usuarios autorizados de la organización y a proveedores contratados de alojamiento, medios, transcripción, seguridad, análisis o informes. El acceso se limita por función y finalidad. No se entregan datos a anunciantes.'],
        ['6. Tratamiento internacional', 'Los proveedores técnicos pueden tratar datos en varios países. Cuando haya transferencias entre jurisdicciones, deben aplicarse las garantías contractuales, organizativas y técnicas exigidas. La organización invitante puede facilitar los detalles de su flujo.'],
        ['7. Seguridad', 'CLARITY utiliza controles de acceso, enlaces y tokens limitados, transporte cifrado, registros de estado y auditoría y recuperación idempotente para reducir accesos no autorizados y duplicados. Ningún sistema en línea garantiza seguridad absoluta; comunique cualquier sospecha a la organización o al soporte de CLARITY.'],
        ['8. Conservación, derechos y contacto', 'La organización indica la base jurídica, el plazo exacto y el contacto de privacidad. Según la ley, puede solicitar acceso, rectificación, supresión, limitación, oposición, portabilidad o revisión humana. Contacte primero con la organización; CLARITY le presta apoyo técnico.'],
        ['9. Versión', 'La App registra la versión y el idioma confirmados. Los cambios sustanciales requieren una nueva versión. La versión actual es la 1.3, de 15 de agosto de 2026.']
      ]
    }
  },
  fr: {
    participation: {
      title: 'CLARITY – Informations sur la participation, le traitement des données et l’analyse par IA',
      intro: 'Une organisation vous a invité à un entretien, une évaluation ou un autre parcours structuré CLARITY. Cette notice explique le processus technique et complète les informations de confidentialité fournies par l’organisation invitante.',
      sections: [
        ['1. Rôles et responsabilité', 'L’organisation invitante détermine la finalité, la base juridique, les personnes autorisées et l’utilisation des résultats. CLARITY traite généralement les données selon ses instructions afin de fournir la CLARITY Decision Intelligence Platform. Adressez d’abord à l’organisation les questions concernant candidature, décision, conservation ou suppression.'],
        ['2. Données utilisées', 'Selon le module et le mode, le parcours peut traiter identité, coordonnées, référence, données de lien, appareil, heure et statut, documents téléchargés, réponses et chats, enregistrements audio et vidéo, transcriptions, journaux de sécurité et analyses, synthèses, indicateurs, scores et rapports assistés par IA. Seules les données nécessaires au parcours configuré doivent être collectées.'],
        ['3. Audio, vidéo et autorisations', 'Les modes audio utilisent le microphone; les modes vidéo utilisent caméra et microphone. L’App demande l’autorisation avant l’enregistrement. Les médias peuvent servir à la capture, transcription, analyse structurée, création du rapport et transmission à l’organisation. CLARITY ne les utilise pas dans ce parcours pour la reconnaissance faciale, l’identification biométrique ou la reconnaissance cachée des émotions.'],
        ['4. Utilisation de l’IA', 'L’IA peut transcrire et structurer les réponses, identifier des signaux liés au poste ou aux compétences, résumer le contenu et préparer des rapports. Les résultats peuvent être incomplets, inexacts ou dépendre du contexte. Ils soutiennent la décision sans garantir les faits ni constituer une décision finale autonome.'],
        ['5. Contrôle humain', 'CLARITY ne prend pas la décision finale d’embauche, de refus, de promotion, d’aptitude ou toute conséquence comparable. L’organisation doit confier l’interprétation à des personnes qualifiées, tenir compte du contexte, éviter la confiance automatique et écarter ou modifier le résultat si nécessaire.'],
        ['6. Résultats et accès', 'Après la fin, l’organisation peut recevoir dans CLARITY Workspace le résultat structuré, le rapport, la transcription, les documents, les médias et le statut technique. L’accès doit être limité aux personnes autorisées et à la finalité annoncée. CLARITY ne vend pas les données des participants et ne les transmet pas à des fins publicitaires.'],
        ['7. Conservation', 'Les données sont conservées uniquement le temps nécessaire à la prestation, la sécurité, la traçabilité, aux obligations contractuelles ou au droit applicable. La durée exacte est fixée par l’organisation et son accord avec CLARITY. Les médias ne devraient pas être conservés plus longtemps que nécessaire; rapports et transcriptions peuvent suivre une autre durée approuvée.'],
        ['8. Choix et droits', 'Selon le droit applicable, vous pouvez disposer de droits d’accès, rectification, effacement, limitation, opposition, portabilité et réexamen. Demandez à l’organisation son identité de responsable, la base juridique, la durée et la procédure. CLARITY apporte un soutien technique. Si vous ne souhaitez pas continuer ou ne pouvez pas utiliser le mode requis, contactez l’organisation avant de commencer.'],
        ['9. Confirmation', 'En continuant, vous confirmez que ces informations étaient disponibles et que vous comprenez le parcours. Cette confirmation ne remplace pas l’obligation de l’organisation de définir et documenter une base juridique appropriée. Le microphone et la caméra font l’objet d’une confirmation distincte si nécessaire.']
      ]
    },
    privacy: {
      title: 'Notice CLARITY relative aux cookies, à la confidentialité et à l’IA',
      intro: 'Cette notice décrit la confidentialité et le stockage technique de la CLARITY Universal Candidate App. Elle s’applique au lien participant ouvert et doit être lue avec les informations de l’organisation invitante.',
      sections: [
        ['1. Stockage technique essentiel', 'L’App utilise uniquement un stockage navigateur essentiel, des identifiants de session et des jetons de sécurité pour vérifier l’invitation, conserver la bonne étape, éviter les doublons et reprendre après une interruption. Ils sont nécessaires au service demandé. Le parcours candidat n’utilise pas de cookies publicitaires ni de publicité comportementale tierce.'],
        ['2. Responsable et sous-traitant', 'L’organisation invitante est généralement responsable du traitement car elle définit la finalité et l’utilisation des résultats. CLARITY agit généralement comme sous-traitant et fournisseur de plateforme. Dans des cas limités, CLARITY peut traiter des données de sécurité, d’intégrité du service ou de conformité sous sa propre responsabilité.'],
        ['3. Finalités', 'Les données servent à authentifier le lien, assurer la sécurité, fournir le module, saisir réponses ou fichiers, transcrire les médias, générer analyses et rapports, publier les résultats autorisés dans CLARITY Workspace, fournir une assistance et conserver une piste d’audit.'],
        ['4. Transparence de l’IA', 'Le parcours indique quand l’IA soutient transcription, analyse ou rapport. Elle peut produire synthèses, indicateurs ou scores. Ils doivent être interprétés dans leur contexte et contrôlés par une personne responsable; ils ne doivent pas être l’unique fondement d’une décision professionnelle importante.'],
        ['5. Destinataires', 'Les informations peuvent être accessibles aux utilisateurs autorisés de l’organisation et aux prestataires contractuels nécessaires à l’hébergement, aux médias, à la transcription, à la sécurité, à l’analyse ou aux rapports. L’accès est limité par rôle et finalité. Les données ne sont pas fournies aux annonceurs.'],
        ['6. Traitement international', 'Des prestataires peuvent traiter les données dans plusieurs pays. Lors de transferts entre juridictions, les garanties contractuelles, organisationnelles et techniques requises doivent être utilisées. L’organisation peut fournir les détails propres à son parcours.'],
        ['7. Sécurité', 'CLARITY utilise contrôles d’accès, liens et jetons ciblés, transport chiffré, journaux d’état et d’audit et reprise idempotente pour réduire accès non autorisés et doublons. Aucun système en ligne ne garantit une sécurité absolue; signalez rapidement tout soupçon à l’organisation ou au support CLARITY.'],
        ['8. Conservation, droits et contact', 'L’organisation indique la base juridique, la durée exacte et le contact de confidentialité. Selon le droit applicable, vous pouvez demander accès, rectification, effacement, limitation, opposition, portabilité ou contrôle humain. Contactez d’abord l’organisation; CLARITY fournit l’assistance technique.'],
        ['9. Version', 'L’App enregistre la version et la langue confirmées. Toute modification substantielle exige une nouvelle version. La version actuelle est 1.3, datée du 15 août 2026.']
      ]
    }
  },
  it: {
    participation: {
      title: 'CLARITY – Informazioni sulla partecipazione, sul trattamento dei dati e sull’analisi tramite IA',
      intro: 'Un’organizzazione l’ha invitata a un colloquio, assessment o altro percorso strutturato CLARITY. Questa informativa descrive il processo tecnico e integra le informazioni privacy fornite dall’organizzazione invitante.',
      sections: [
        ['1. Ruoli e responsabilità', 'L’organizzazione invitante stabilisce finalità, base giuridica, persone autorizzate e uso dei risultati. CLARITY tratta normalmente i dati secondo le sue istruzioni per fornire la CLARITY Decision Intelligence Platform. Le domande su candidatura, decisione, conservazione o cancellazione vanno rivolte prima all’organizzazione.'],
        ['2. Dati utilizzati', 'Secondo modulo e modalità, possono essere trattati identità, contatti, riferimento, dati di link, dispositivo, ora e stato, documenti caricati, risposte e chat, registrazioni audio/video, trascrizioni, log di sicurezza e analisi, sintesi, indicatori, punteggi e report assistiti dall’IA. Devono essere raccolti solo i dati necessari al percorso configurato.'],
        ['3. Audio, video e permessi', 'Le modalità audio richiedono il microfono; quelle video, videocamera e microfono. L’App chiede il permesso prima della registrazione. I media possono essere usati per acquisizione, trascrizione, analisi strutturata, report e consegna all’organizzazione. CLARITY non li usa in questo percorso per riconoscimento facciale, identificazione biometrica o riconoscimento nascosto delle emozioni.'],
        ['4. Uso dell’IA', 'L’IA può trascrivere e strutturare le risposte, individuare segnali relativi al ruolo o alle competenze, riassumere contenuti e preparare report. I risultati possono essere incompleti, inesatti o dipendere dal contesto. Supportano la decisione, ma non garantiscono i fatti né costituiscono una decisione finale autonoma.'],
        ['5. Supervisione umana', 'CLARITY non decide in via definitiva assunzione, rifiuto, promozione, idoneità o effetti simili. L’organizzazione deve incaricare persone qualificate di interpretare l’output, considerare il contesto, evitare affidamento automatico e ignorare o modificare il risultato quando opportuno.'],
        ['6. Risultati e accesso', 'Al termine, l’organizzazione può ricevere in CLARITY Workspace risultato, report, trascrizione, documenti, media e stato tecnico. L’accesso deve essere limitato a persone autorizzate e alla finalità indicata. CLARITY non vende i dati dei partecipanti né li comunica per pubblicità di terzi.'],
        ['7. Conservazione', 'I dati sono conservati solo quanto necessario per erogazione, sicurezza, tracciabilità, obblighi contrattuali o legge applicabile. La durata esatta è stabilita dall’organizzazione e dal suo accordo con CLARITY. I media non dovrebbero restare più del necessario; report e trascrizioni possono seguire un periodo diverso approvato.'],
        ['8. Scelte e diritti', 'Secondo la legge applicabile, può avere diritti di accesso, rettifica, cancellazione, limitazione, opposizione, portabilità e riesame. Chieda all’organizzazione identità del titolare, base giuridica, periodo e procedura. CLARITY fornisce supporto tecnico. Se non desidera continuare o non può usare la modalità richiesta, contatti l’organizzazione prima dell’avvio.'],
        ['9. Conferma', 'Continuando conferma che le informazioni erano disponibili e di comprendere il percorso. La conferma non sostituisce l’obbligo dell’organizzazione di definire e documentare una base giuridica adeguata. Microfono e videocamera sono confermati separatamente quando necessari.']
      ]
    },
    privacy: {
      title: 'Informativa CLARITY su cookie, privacy e IA',
      intro: 'Questa informativa descrive privacy e archiviazione tecnica della CLARITY Universal Candidate App. Si applica al link del partecipante aperto e va letta con le informazioni dell’organizzazione invitante.',
      sections: [
        ['1. Archiviazione tecnica essenziale', 'L’App usa solo archiviazione essenziale del browser, identificativi di sessione e token di sicurezza per verificare l’invito, mantenere la fase corretta, evitare duplicazioni e riprendere dopo un’interruzione. Sono necessari al servizio. Il percorso candidato non usa cookie pubblicitari né pubblicità comportamentale di terzi.'],
        ['2. Titolare e responsabile', 'L’organizzazione è normalmente titolare perché definisce finalità e uso dei risultati. CLARITY agisce normalmente come responsabile e fornitore della piattaforma. In casi limitati può trattare dati di sicurezza, integrità o conformità sotto la propria responsabilità.'],
        ['3. Finalità', 'I dati servono ad autenticare il link, garantire sicurezza, offrire il modulo, acquisire risposte o file, trascrivere media, generare analisi e report, pubblicare risultati autorizzati in CLARITY Workspace, fornire supporto e conservare una traccia di audit.'],
        ['4. Trasparenza dell’IA', 'Il percorso indica quando l’IA supporta trascrizione, analisi o report. Può produrre sintesi, indicatori o punteggi. Vanno interpretati nel contesto e verificati da una persona responsabile; non devono costituire l’unica base di una decisione lavorativa significativa.'],
        ['5. Destinatari', 'Le informazioni possono essere accessibili agli utenti autorizzati dell’organizzazione e ai fornitori contrattuali necessari per hosting, media, trascrizione, sicurezza, analisi o report. L’accesso è limitato per ruolo e finalità. I dati non sono forniti agli inserzionisti.'],
        ['6. Trattamento internazionale', 'I fornitori tecnici possono trattare dati in più paesi. Per trasferimenti tra ordinamenti devono essere applicate le garanzie contrattuali, organizzative e tecniche richieste. L’organizzazione può fornire dettagli sul proprio percorso.'],
        ['7. Sicurezza', 'CLARITY usa controlli di accesso, link e token limitati, trasporto cifrato, log di stato e audit e recupero idempotente per ridurre accessi non autorizzati e duplicazioni. Nessun sistema online garantisce sicurezza assoluta; segnalare sospetti all’organizzazione o al supporto CLARITY.'],
        ['8. Conservazione, diritti e contatto', 'L’organizzazione indica base giuridica, durata esatta e contatto privacy. Secondo la legge può chiedere accesso, rettifica, cancellazione, limitazione, opposizione, portabilità o riesame umano. Contatti prima l’organizzazione; CLARITY offre assistenza tecnica.'],
        ['9. Versione', 'L’App registra versione e lingua confermate. Modifiche sostanziali richiedono una nuova versione. La versione attuale è 1.3 del 15 agosto 2026.']
      ]
    }
  },
  pt: {
    participation: {
      title: 'CLARITY – Informação sobre participação, tratamento de dados e análise por IA',
      intro: 'Uma organização convidou-o a realizar uma entrevista, assessment ou outro fluxo estruturado CLARITY. Este aviso explica o processo técnico e complementa a informação de privacidade da organização convidante.',
      sections: [
        ['1. Funções e responsabilidade', 'A organização convidante define finalidade, base jurídica, pessoas autorizadas e uso dos resultados. A CLARITY trata normalmente os dados segundo as suas instruções para fornecer a CLARITY Decision Intelligence Platform. Questões sobre candidatura, decisão, retenção ou eliminação devem ser dirigidas primeiro à organização.'],
        ['2. Dados utilizados', 'Consoante o módulo e modo, podem ser tratados identidade, contactos, referência, dados de ligação, dispositivo, hora e estado, documentos, respostas e chats, gravações de voz e vídeo, transcrições, registos de segurança e análises, resumos, indicadores, pontuações e relatórios assistidos por IA. Só devem ser recolhidos os dados necessários ao fluxo configurado.'],
        ['3. Áudio, vídeo e permissões', 'Modos de áudio exigem microfone; modos de vídeo exigem câmara e microfone. A App pede a permissão antes da gravação. Os meios podem ser usados para captura, transcrição, análise estruturada, relatório e entrega à organização. A CLARITY não os usa neste fluxo para reconhecimento facial, identificação biométrica ou reconhecimento oculto de emoções.'],
        ['4. Utilização da IA', 'A IA pode transcrever e estruturar respostas, identificar sinais relacionados com a função ou competências, resumir conteúdos e preparar relatórios. Os resultados podem ser incompletos, imprecisos ou dependentes do contexto. Apoiam a decisão, mas não garantem factos nem constituem uma decisão final autónoma.'],
        ['5. Supervisão humana', 'A CLARITY não toma a decisão final sobre contratação, rejeição, promoção, adequação ou efeito semelhante. A organização deve atribuir pessoas qualificadas para interpretar o resultado, considerar o contexto, evitar confiança automática e ignorar ou alterar o resultado quando adequado.'],
        ['6. Resultados e acesso', 'Após a conclusão, a organização pode receber no CLARITY Workspace o resultado, relatório, transcrição, documentos, meios e estado técnico. O acesso deve limitar-se a pessoas autorizadas e à finalidade indicada. A CLARITY não vende dados de participantes nem os fornece para publicidade de terceiros.'],
        ['7. Retenção', 'Os dados são conservados apenas pelo período necessário para prestação, segurança, rastreabilidade, obrigações contratuais ou lei. A duração concreta é definida pela organização e pelo acordo com a CLARITY. Os meios não devem ser guardados além do necessário; relatórios e transcrições podem ter outro prazo aprovado.'],
        ['8. Opções e direitos', 'Consoante a lei, pode ter direitos de acesso, correção, apagamento, limitação, oposição, portabilidade e revisão. Solicite à organização a identidade do responsável, base jurídica, prazo e procedimento. A CLARITY presta apoio técnico. Se não quiser continuar ou não puder usar o modo de gravação exigido, contacte a organização antes do início.'],
        ['9. Confirmação', 'Ao continuar confirma que estas informações estavam disponíveis e que compreende o fluxo. A confirmação não substitui a obrigação da organização de definir e documentar uma base jurídica adequada. Microfone e câmara são confirmados separadamente quando necessários.']
      ]
    },
    privacy: {
      title: 'Aviso da CLARITY sobre cookies, privacidade e IA',
      intro: 'Este aviso descreve a privacidade e o armazenamento técnico da CLARITY Universal Candidate App. Aplica-se ao link de participante aberto e deve ser lido com a informação da organização convidante.',
      sections: [
        ['1. Armazenamento técnico essencial', 'A App usa apenas armazenamento essencial do navegador, identificadores de sessão e tokens de segurança para verificar o convite, manter a etapa correta, evitar duplicações e recuperar após uma interrupção. São necessários ao serviço. O fluxo de participantes não usa cookies publicitários nem publicidade comportamental de terceiros.'],
        ['2. Responsável e subcontratante', 'A organização é geralmente responsável porque define a finalidade e o uso dos resultados. A CLARITY atua geralmente como subcontratante e fornecedor da plataforma. Em casos limitados, pode tratar dados de segurança, integridade do serviço ou conformidade sob responsabilidade própria.'],
        ['3. Finalidades', 'Os dados servem para autenticar o link, manter a segurança, fornecer o módulo, captar respostas ou ficheiros, transcrever meios, gerar análises e relatórios, publicar resultados autorizados no CLARITY Workspace, prestar suporte e manter um registo de auditoria.'],
        ['4. Transparência da IA', 'O fluxo indica quando a IA apoia transcrição, análise ou relatório. Pode produzir resumos, indicadores ou pontuações. Devem ser interpretados no contexto e revistos por uma pessoa responsável; não devem ser a única base de uma decisão laboral significativa.'],
        ['5. Destinatários', 'As informações podem estar acessíveis a utilizadores autorizados da organização e a prestadores contratados necessários para alojamento, meios, transcrição, segurança, análise ou relatórios. O acesso é limitado por função e finalidade. Os dados não são fornecidos a anunciantes.'],
        ['6. Tratamento internacional', 'Prestadores técnicos podem tratar dados em vários países. Em transferências entre jurisdições devem ser aplicadas as garantias contratuais, organizacionais e técnicas exigidas. A organização pode fornecer os detalhes do seu fluxo.'],
        ['7. Segurança', 'A CLARITY usa controlos de acesso, links e tokens limitados, transporte cifrado, registos de estado e auditoria e recuperação idempotente para reduzir acessos não autorizados e duplicações. Nenhum sistema online garante segurança absoluta; comunique suspeitas à organização ou ao suporte CLARITY.'],
        ['8. Retenção, direitos e contacto', 'A organização indica base jurídica, prazo exato e contacto de privacidade. Consoante a lei, pode pedir acesso, correção, apagamento, limitação, oposição, portabilidade ou revisão humana. Contacte primeiro a organização; a CLARITY presta apoio técnico.'],
        ['9. Versão', 'A App regista a versão e o idioma confirmados. Alterações substanciais exigem nova versão. A versão atual é 1.3, de 15 de agosto de 2026.']
      ]
    }
  },
  nl: {
    participation: {
      title: 'CLARITY – Informatie over deelname, gegevensverwerking en AI-analyse',
      intro: 'Een organisatie heeft u uitgenodigd voor een CLARITY-interview, assessment of andere gestructureerde workflow. Deze kennisgeving legt het technische proces uit en vult de privacy-informatie van de uitnodigende organisatie aan.',
      sections: [
        ['1. Rollen en verantwoordelijkheid', 'De uitnodigende organisatie bepaalt doel, rechtsgrond, bevoegde personen en gebruik van de resultaten. CLARITY verwerkt gegevens doorgaans volgens haar instructies om het CLARITY Decision Intelligence Platform te leveren. Vragen over sollicitatie, besluit, bewaartermijn of verwijdering richt u eerst aan de organisatie.'],
        ['2. Gebruikte gegevens', 'Afhankelijk van module en modus kunnen identiteit, contact, referentie, link-, apparaat-, tijd- en statusgegevens, documenten, antwoorden en chats, audio/video, transcripties, beveiligingslogs en AI-ondersteunde analyses, samenvattingen, indicatoren, scores en rapporten worden verwerkt. Alleen noodzakelijke gegevens voor de geconfigureerde workflow horen te worden verzameld.'],
        ['3. Audio, video en toestemmingen', 'Audiomodi vereisen de microfoon; videomodi camera en microfoon. De App vraagt toestemming vóór opname. Media kunnen worden gebruikt voor vastlegging, transcriptie, gestructureerde analyse, rapportage en levering aan de organisatie. CLARITY gebruikt ze in deze workflow niet voor gezichtsherkenning, biometrische identificatie of verborgen emotieherkenning.'],
        ['4. Gebruik van AI', 'AI kan antwoorden transcriberen en structureren, functie- of vaardigheidssignalen herkennen, inhoud samenvatten en rapporten voorbereiden. Uitkomsten kunnen onvolledig, onnauwkeurig of contextafhankelijk zijn. Ze ondersteunen een besluit, maar garanderen geen feiten en vormen geen zelfstandige eindbeslissing.'],
        ['5. Menselijk toezicht', 'CLARITY neemt niet de uiteindelijke beslissing over aanname, afwijzing, promotie, geschiktheid of een vergelijkbaar effect. De organisatie moet bevoegde mensen inzetten om de output te interpreteren, context mee te wegen, automatische overwaardering te vermijden en de uitkomst zo nodig te negeren of aan te passen.'],
        ['6. Resultaten en toegang', 'Na afronding kan de organisatie in CLARITY Workspace het resultaat, rapport, transcript, documenten, media en technische status ontvangen. Toegang moet beperkt blijven tot bevoegde personen en het genoemde doel. CLARITY verkoopt geen deelnemersgegevens en deelt ze niet voor reclame van derden.'],
        ['7. Bewaring', 'Gegevens worden alleen bewaard zolang nodig voor levering, veiligheid, traceerbaarheid, contractuele verplichtingen of wetgeving. De exacte termijn wordt bepaald door de organisatie en haar overeenkomst met CLARITY. Media horen niet langer dan nodig te worden bewaard; rapporten en transcripties kunnen een andere goedgekeurde termijn hebben.'],
        ['8. Keuzes en rechten', 'Afhankelijk van de wet kunt u rechten hebben op inzage, correctie, verwijdering, beperking, bezwaar, overdraagbaarheid en herbeoordeling. Vraag de organisatie naar de verwerkingsverantwoordelijke, rechtsgrond, termijn en procedure. CLARITY biedt technische ondersteuning. Wilt u niet doorgaan of kunt u de vereiste opnamemodus niet gebruiken, neem dan vóór de start contact op.'],
        ['9. Bevestiging', 'Door verder te gaan bevestigt u dat deze informatie beschikbaar was en dat u de workflow begrijpt. Dit vervangt niet de plicht van de organisatie om een passende rechtsgrond vast te stellen en vast te leggen. Microfoon en camera worden apart bevestigd indien vereist.']
      ]
    },
    privacy: {
      title: 'CLARITY-kennisgeving over cookies, privacy en AI',
      intro: 'Deze kennisgeving beschrijft privacy en technische opslag in de CLARITY Universal Candidate App. Zij geldt voor de geopende deelnemerslink en moet samen met de informatie van de uitnodigende organisatie worden gelezen.',
      sections: [
        ['1. Essentiële technische opslag', 'De App gebruikt alleen noodzakelijke browseropslag, sessie-id’s en beveiligingstokens om de uitnodiging te verifiëren, de juiste stap te bewaren, dubbele verwerking te voorkomen en na een storing veilig te herstellen. Dit is nodig voor de dienst. De deelnemersworkflow gebruikt geen advertentiecookies of gedragsadvertenties van derden.'],
        ['2. Verantwoordelijke en verwerker', 'De uitnodigende organisatie is doorgaans verwerkingsverantwoordelijke omdat zij doel en gebruik bepaalt. CLARITY treedt meestal op als verwerker en platformaanbieder. In beperkte gevallen kan CLARITY beveiligings-, integriteits- of compliancegegevens onder eigen verantwoordelijkheid verwerken.'],
        ['3. Doeleinden', 'Gegevens worden gebruikt om de link te authenticeren, veiligheid te bewaken, de module te leveren, antwoorden of bestanden vast te leggen, media te transcriberen, analyses en rapporten te genereren, bevoegde resultaten in CLARITY Workspace te publiceren, ondersteuning te bieden en een auditspoor te bewaren.'],
        ['4. AI-transparantie', 'De workflow meldt wanneer AI transcriptie, analyse of rapportage ondersteunt. AI kan samenvattingen, indicatoren of scores produceren. Die moeten in context en door een verantwoordelijke persoon worden beoordeeld; zij mogen niet de enige basis zijn voor een belangrijk arbeidsbesluit.'],
        ['5. Ontvangers', 'Informatie kan toegankelijk zijn voor bevoegde gebruikers van de organisatie en contractuele leveranciers voor hosting, media, transcriptie, beveiliging, analyse of rapportage. Toegang is beperkt naar rol en doel. Gegevens worden niet aan adverteerders verstrekt.'],
        ['6. Internationale verwerking', 'Technische leveranciers kunnen gegevens in meerdere landen verwerken. Bij overdrachten tussen rechtsgebieden moeten vereiste contractuele, organisatorische en technische waarborgen worden toegepast. De organisatie kan workflowspecifieke details geven.'],
        ['7. Veiligheid', 'CLARITY gebruikt toegangscontrole, beperkte links en tokens, versleuteld transport, status- en auditlogs en idempotent herstel om onbevoegde toegang en dubbele verwerking te beperken. Geen online systeem garandeert absolute veiligheid; meld vermoedens aan de organisatie of CLARITY-support.'],
        ['8. Bewaring, rechten en contact', 'De organisatie geeft rechtsgrond, exacte termijn en privacycontact. Afhankelijk van de wet kunt u inzage, correctie, verwijdering, beperking, bezwaar, overdraagbaarheid of menselijke herbeoordeling vragen. Neem eerst contact op met de organisatie; CLARITY biedt technische hulp.'],
        ['9. Versie', 'De App registreert de bevestigde versie en taal. Materiële wijzigingen krijgen een nieuwe versie. De huidige versie is 1.3 van 15 augustus 2026.']
      ]
    }
  },
  pl: {
    participation: {
      title: 'CLARITY – Informacje o udziale, przetwarzaniu danych i analizie AI',
      intro: 'Organizacja zaprosiła Państwa do rozmowy, assessmentu lub innego uporządkowanego procesu CLARITY. Niniejsza informacja opisuje proces techniczny i uzupełnia informacje o prywatności przekazane przez organizację zapraszającą.',
      sections: [
        ['1. Role i odpowiedzialność', 'Organizacja zapraszająca określa cel, podstawę prawną, osoby upoważnione i sposób wykorzystania wyników. CLARITY zazwyczaj przetwarza dane zgodnie z jej instrukcjami, dostarczając CLARITY Decision Intelligence Platform. Pytania o kandydaturę, decyzję, przechowywanie lub usunięcie należy najpierw kierować do organizacji.'],
        ['2. Wykorzystywane dane', 'Zależnie od modułu i trybu mogą być przetwarzane dane identyfikacyjne, kontaktowe i referencyjne, dane linku, urządzenia, czasu i statusu, dokumenty, odpowiedzi i czaty, nagrania audio/wideo, transkrypcje, logi bezpieczeństwa oraz analizy, podsumowania, wskaźniki, wyniki i raporty wspierane przez AI. Należy zbierać wyłącznie dane niezbędne dla skonfigurowanego procesu.'],
        ['3. Audio, wideo i uprawnienia', 'Tryb audio wymaga mikrofonu, a wideo kamery i mikrofonu. App prosi o dostęp przed nagrywaniem. Media mogą służyć do zapisu, transkrypcji, ustrukturyzowanej analizy, raportu i przekazania organizacji. CLARITY nie używa ich w tym procesie do rozpoznawania twarzy, identyfikacji biometrycznej ani ukrytego rozpoznawania emocji.'],
        ['4. Wykorzystanie AI', 'AI może transkrybować i porządkować odpowiedzi, wskazywać sygnały związane z rolą lub kompetencjami, podsumowywać treść i przygotowywać raporty. Wyniki mogą być niepełne, niedokładne lub zależne od kontekstu. Wspierają decyzję, ale nie gwarantują faktów i nie są niezależną decyzją końcową.'],
        ['5. Nadzór człowieka', 'CLARITY nie podejmuje ostatecznej decyzji o zatrudnieniu, odrzuceniu, awansie, przydatności ani podobnym skutku. Organizacja musi zapewnić kompetentne osoby, które zinterpretują wynik, uwzględnią kontekst, unikną automatycznego polegania i w razie potrzeby odrzucą lub zmienią wynik.'],
        ['6. Wyniki i dostęp', 'Po zakończeniu organizacja może otrzymać w CLARITY Workspace wynik, raport, transkrypcję, dokumenty, media i status techniczny. Dostęp powinien być ograniczony do osób upoważnionych i wskazanego celu. CLARITY nie sprzedaje danych uczestników ani nie udostępnia ich do reklam osób trzecich.'],
        ['7. Przechowywanie', 'Dane są przechowywane tylko tak długo, jak jest to konieczne do świadczenia usługi, bezpieczeństwa, rozliczalności, obowiązków umownych lub prawnych. Dokładny okres ustala organizacja i jej umowa z CLARITY. Media nie powinny być przechowywane dłużej niż trzeba; raporty i transkrypcje mogą mieć inny zatwierdzony okres.'],
        ['8. Wybory i prawa', 'Zależnie od prawa mogą przysługiwać prawa dostępu, sprostowania, usunięcia, ograniczenia, sprzeciwu, przenoszenia i ponownej oceny. Organizacja poda administratora, podstawę, okres i procedurę. CLARITY wspiera technicznie. Jeśli nie chcą Państwo kontynuować lub nie mogą użyć wymaganego trybu nagrania, należy skontaktować się z organizacją przed startem.'],
        ['9. Potwierdzenie', 'Kontynuując, potwierdzają Państwo dostępność informacji i zrozumienie procesu. Nie zastępuje to obowiązku organizacji do określenia i udokumentowania właściwej podstawy prawnej. Mikrofon i kamera są potwierdzane osobno, gdy są potrzebne.']
      ]
    },
    privacy: {
      title: 'Informacja CLARITY o plikach cookie, prywatności i AI',
      intro: 'Niniejsza informacja opisuje prywatność i pamięć techniczną CLARITY Universal Candidate App. Dotyczy otwartego linku uczestnika i powinna być czytana z informacjami organizacji zapraszającej.',
      sections: [
        ['1. Niezbędna pamięć techniczna', 'App używa tylko koniecznej pamięci przeglądarki, identyfikatorów sesji i tokenów bezpieczeństwa do weryfikacji zaproszenia, zachowania etapu, zapobiegania duplikatom i bezpiecznego wznowienia po przerwie. Są one niezbędne do usługi. Proces uczestnika nie używa reklamowych cookies ani reklamy behawioralnej osób trzecich.'],
        ['2. Administrator i podmiot przetwarzający', 'Organizacja jest zwykle administratorem, ponieważ określa cel i użycie wyników. CLARITY działa zwykle jako podmiot przetwarzający i dostawca platformy. W ograniczonych przypadkach może przetwarzać dane bezpieczeństwa, integralności usługi lub zgodności na własną odpowiedzialność.'],
        ['3. Cele', 'Dane służą uwierzytelnieniu linku, bezpieczeństwu, świadczeniu modułu, rejestracji odpowiedzi lub plików, transkrypcji mediów, tworzeniu analiz i raportów, publikacji uprawnionych wyników w CLARITY Workspace, wsparciu i ścieżce audytu.'],
        ['4. Przejrzystość AI', 'Proces informuje, kiedy AI wspiera transkrypcję, analizę lub raport. Może tworzyć podsumowania, wskaźniki lub wyniki. Muszą być interpretowane w kontekście i sprawdzane przez odpowiedzialną osobę; nie mogą stanowić jedynej podstawy istotnej decyzji zawodowej.'],
        ['5. Odbiorcy', 'Informacje mogą być dostępne dla upoważnionych użytkowników organizacji i zakontraktowanych dostawców hostingu, mediów, transkrypcji, bezpieczeństwa, analiz lub raportów. Dostęp ogranicza rola i cel. Dane nie są przekazywane reklamodawcom.'],
        ['6. Przetwarzanie międzynarodowe', 'Dostawcy techniczni mogą przetwarzać dane w kilku krajach. Przy transferach między jurysdykcjami należy stosować wymagane zabezpieczenia umowne, organizacyjne i techniczne. Organizacja może podać szczegóły swojego procesu.'],
        ['7. Bezpieczeństwo', 'CLARITY stosuje kontrolę dostępu, ograniczone linki i tokeny, szyfrowany transport, logi statusu i audytu oraz idempotentne odzyskiwanie, aby ograniczać nieuprawniony dostęp i duplikaty. Żaden system online nie gwarantuje pełnego bezpieczeństwa; podejrzenia należy zgłaszać organizacji lub wsparciu CLARITY.'],
        ['8. Przechowywanie, prawa i kontakt', 'Organizacja podaje podstawę prawną, dokładny okres i kontakt ds. prywatności. Zależnie od prawa można żądać dostępu, korekty, usunięcia, ograniczenia, sprzeciwu, przeniesienia lub oceny przez człowieka. Najpierw należy skontaktować się z organizacją; CLARITY wspiera technicznie.'],
        ['9. Wersja', 'App zapisuje potwierdzoną wersję i język. Istotne zmiany wymagają nowej wersji. Aktualna wersja to 1.3 z 15 sierpnia 2026 r.']
      ]
    }
  },
  tr: {
    participation: {
      title: 'CLARITY – Katılım, veri işleme ve yapay zekâ analizi hakkında bilgi',
      intro: 'Bir kuruluş sizi CLARITY mülakatı, değerlendirmesi veya başka bir yapılandırılmış iş akışına davet etti. Bu bildirim teknik süreci açıklar ve davet eden kuruluşun gizlilik bilgisini tamamlar.',
      sections: [
        ['1. Roller ve sorumluluk', 'Davet eden kuruluş amacı, hukuki dayanağı, yetkili kişileri ve sonuçların kullanımını belirler. CLARITY genellikle CLARITY Decision Intelligence Platform hizmetini sağlamak için kuruluşun talimatları doğrultusunda veri işler. Başvuru, karar, saklama veya silme soruları önce kuruluşa yöneltilmelidir.'],
        ['2. Kullanılan veriler', 'Modül ve moda göre kimlik, iletişim ve referans, bağlantı, cihaz, zaman ve durum verileri, belgeler, yanıtlar ve sohbetler, ses/video kayıtları, transkriptler, güvenlik günlükleri ve YZ destekli analizler, özetler, göstergeler, puanlar ve raporlar işlenebilir. Yalnızca yapılandırılmış akış için gerekli veriler toplanmalıdır.'],
        ['3. Ses, video ve izinler', 'Ses modları mikrofon; video modları kamera ve mikrofon ister. App kayıttan önce izin ister. Medya yakalama, transkripsiyon, yapılandırılmış analiz, rapor ve kuruluşa teslim için kullanılabilir. CLARITY bu akışta bunları yüz tanıma, biyometrik kimlik veya gizli duygu tanıma için kullanmaz.'],
        ['4. YZ kullanımı', 'YZ yanıtları yazıya dökebilir ve yapılandırabilir, rol veya beceri sinyalleri belirleyebilir, içeriği özetleyebilir ve rapor hazırlayabilir. Çıktılar eksik, hatalı veya bağlama bağlı olabilir. Kararı destekler; olgusal garanti ya da bağımsız nihai karar değildir.'],
        ['5. İnsan gözetimi', 'CLARITY işe alma, reddetme, terfi, uygunluk veya benzer önemli sonuç hakkında nihai karar vermez. Kuruluş, çıktıyı yorumlayacak, bağlamı değerlendirecek, otomatik güveni önleyecek ve gerektiğinde çıktıyı yok sayacak veya değiştirecek yetkin kişiler görevlendirmelidir.'],
        ['6. Sonuçlar ve erişim', 'Tamamlandıktan sonra kuruluş CLARITY Workspace içinde sonuç, rapor, transkript, belgeler, medya ve teknik durumu alabilir. Erişim yetkili kişiler ve belirtilen amaçla sınırlı olmalıdır. CLARITY katılımcı verilerini satmaz veya üçüncü taraf reklamları için paylaşmaz.'],
        ['7. Saklama', 'Veriler yalnızca hizmet, güvenlik, izlenebilirlik, sözleşme veya hukuk için gereken süre boyunca tutulur. Kesin süre kuruluş ve CLARITY ile yaptığı sözleşme tarafından belirlenir. Medya gerekenden uzun tutulmamalı; rapor ve transkriptler için başka onaylı süre uygulanabilir.'],
        ['8. Seçenekler ve haklar', 'Uygulanabilir hukuka göre erişim, düzeltme, silme, sınırlama, itiraz, taşınabilirlik ve yeniden inceleme haklarınız olabilir. Sorumlu, hukuki dayanak, süre ve süreç için kuruluşa başvurun. CLARITY teknik destek sağlar. Devam etmek istemiyor veya gerekli kayıt modunu kullanamıyorsanız başlamadan önce kuruluşla iletişime geçin.'],
        ['9. Onay', 'Devam ederek bilgilerin erişilebilir olduğunu ve akışı anladığınızı onaylarsınız. Bu, kuruluşun uygun hukuki dayanak belirleme ve belgeleme yükümlülüğünün yerine geçmez. Mikrofon ve kamera gerektiğinde ayrıca onaylanır.']
      ]
    },
    privacy: {
      title: 'CLARITY Çerez, Gizlilik ve Yapay Zekâ Bildirimi',
      intro: 'Bu bildirim CLARITY Universal Candidate App gizlilik ve teknik depolamasını açıklar. Açılan katılımcı bağlantısı için geçerlidir ve davet eden kuruluşun bilgileriyle birlikte okunmalıdır.',
      sections: [
        ['1. Zorunlu teknik depolama', 'App daveti doğrulamak, doğru adımı korumak, mükerrer işlemeyi önlemek ve kesintiden sonra güvenli devam etmek için yalnızca zorunlu tarayıcı depolaması, oturum kimlikleri ve güvenlik tokenları kullanır. Bunlar hizmet için gereklidir. Katılımcı akışında reklam çerezleri veya üçüncü taraf davranışsal reklamları kullanılmaz.'],
        ['2. Veri sorumlusu ve işleyen', 'Amaç ve sonuç kullanımını belirlediği için kuruluş genellikle veri sorumlusudur. CLARITY genellikle veri işleyen ve platform sağlayıcısıdır. Sınırlı durumlarda güvenlik, hizmet bütünlüğü veya uyum verilerini kendi sorumluluğunda işleyebilir.'],
        ['3. Amaçlar', 'Veriler bağlantıyı doğrulamak, güvenliği sağlamak, modülü sunmak, yanıt veya dosya almak, medyayı yazıya dökmek, analiz ve rapor üretmek, yetkili sonuçları CLARITY Workspace’e yayınlamak, destek ve denetim izi sağlamak için işlenir.'],
        ['4. YZ şeffaflığı', 'Akış, YZ’nin transkripsiyon, analiz veya raporu desteklediği zamanı açıklar. Özet, gösterge veya puan üretebilir. Bunlar bağlam içinde yorumlanmalı ve sorumlu kişi tarafından incelenmelidir; önemli bir iş kararının tek dayanağı olmamalıdır.'],
        ['5. Alıcılar', 'Bilgiler kuruluşun yetkili kullanıcılarına ve barındırma, medya, transkripsiyon, güvenlik, analiz veya rapor için gerekli sözleşmeli sağlayıcılara açılabilir. Erişim rol ve amaçla sınırlıdır. Veriler reklamcılara verilmez.'],
        ['6. Uluslararası işleme', 'Teknik sağlayıcılar verileri birden fazla ülkede işleyebilir. Hukuk alanları arasındaki aktarımlarda gerekli sözleşmesel, örgütsel ve teknik güvenceler uygulanmalıdır. Kuruluş kendi akışına ilişkin ayrıntıları verebilir.'],
        ['7. Güvenlik', 'CLARITY yetkisiz erişim ve mükerrer işlemi azaltmak için erişim kontrolleri, kapsamlı bağlantı ve tokenlar, şifreli aktarım, durum ve denetim günlükleri ve idempotent kurtarma kullanır. Hiçbir çevrimiçi sistem mutlak güvenlik garanti etmez; şüpheleri kuruluşa veya CLARITY desteğine bildirin.'],
        ['8. Saklama, haklar ve iletişim', 'Kuruluş hukuki dayanağı, kesin süreyi ve gizlilik irtibatını belirtir. Hukuka göre erişim, düzeltme, silme, sınırlama, itiraz, taşınabilirlik veya insan incelemesi isteyebilirsiniz. Önce kuruluşla iletişim kurun; CLARITY teknik yardım sağlar.'],
        ['9. Sürüm', 'App onaylanan sürüm ve dili kaydeder. Önemli değişiklikler yeni sürüm gerektirir. Geçerli sürüm 15 Ağustos 2026 tarihli 1.3’tür.']
      ]
    }
  },
  ar: {
    participation: {
      title: 'CLARITY – معلومات حول المشاركة ومعالجة البيانات والتحليل بالذكاء الاصطناعي',
      intro: 'دعتك مؤسسة إلى مقابلة أو تقييم أو مسار منظم آخر عبر CLARITY. يشرح هذا الإشعار العملية التقنية ويكمل معلومات الخصوصية التي تقدمها المؤسسة الداعية.',
      sections: [
        ['1. الأدوار والمسؤولية', 'تحدد المؤسسة الداعية الغرض والأساس القانوني والأشخاص المخولين وكيفية استخدام النتائج. تعالج CLARITY البيانات عادةً وفق تعليماتها لتقديم CLARITY Decision Intelligence Platform. ينبغي توجيه الأسئلة المتعلقة بالطلب أو القرار أو مدة الاحتفاظ أو الحذف أولاً إلى المؤسسة.'],
        ['2. البيانات المستخدمة', 'بحسب الوحدة والوضع قد تُعالج بيانات الهوية والاتصال والمرجع والرابط والجهاز والوقت والحالة، والمستندات، والإجابات والمحادثات، وتسجيلات الصوت والفيديو، والنصوص، وسجلات الأمان، والتحليلات والملخصات والمؤشرات والدرجات والتقارير المدعومة بالذكاء الاصطناعي. يجب جمع البيانات اللازمة فقط للمسار المحدد.'],
        ['3. الصوت والفيديو والأذونات', 'تحتاج أوضاع الصوت إلى الميكروفون، وتحتاج أوضاع الفيديو إلى الكاميرا والميكروفون. تطلب App الإذن قبل التسجيل. قد تُستخدم الوسائط للالتقاط والنسخ والتحليل المنظم وإعداد التقرير وتسليمه للمؤسسة. لا تستخدمها CLARITY في هذا المسار للتعرف على الوجه أو الهوية البيومترية أو التعرف الخفي على المشاعر.'],
        ['4. استخدام الذكاء الاصطناعي', 'قد يساعد الذكاء الاصطناعي في نسخ الإجابات وتنظيمها وتحديد مؤشرات مرتبطة بالدور أو المهارات وتلخيص المحتوى وإعداد التقارير. قد تكون المخرجات ناقصة أو غير دقيقة أو مرتبطة بالسياق. هي دعم للقرار وليست ضماناً للحقائق أو قراراً نهائياً مستقلاً.'],
        ['5. الإشراف البشري', 'لا تتخذ CLARITY القرار النهائي بشأن التوظيف أو الرفض أو الترقية أو الملاءمة أو أثر مماثل. يجب على المؤسسة تكليف أشخاص مؤهلين بتفسير المخرجات ومراعاة السياق وتجنب الاعتماد الآلي وتجاهل النتيجة أو تعديلها عند الحاجة.'],
        ['6. النتائج والوصول', 'بعد الإكمال قد تتلقى المؤسسة في CLARITY Workspace النتيجة والتقرير والنص والمستندات والوسائط والحالة التقنية. يجب قصر الوصول على المخولين والغرض المحدد. لا تبيع CLARITY بيانات المشاركين ولا تقدمها لإعلانات طرف ثالث.'],
        ['7. الاحتفاظ', 'تُحتفظ البيانات فقط للمدة اللازمة لتقديم الخدمة أو الأمان أو التتبع أو الالتزامات التعاقدية أو القانون. تحدد المؤسسة والاتفاق مع CLARITY المدة الدقيقة. لا ينبغي الاحتفاظ بالوسائط أطول من اللازم، وقد تطبق مدة معتمدة مختلفة على التقارير والنصوص.'],
        ['8. الخيارات والحقوق', 'بحسب القانون قد تكون لك حقوق الوصول والتصحيح والحذف والتقييد والاعتراض والنقل والمراجعة. اطلب من المؤسسة هوية المتحكم والأساس القانوني والمدة والإجراء. تقدم CLARITY الدعم التقني. إذا لم ترغب في المتابعة أو تعذر استخدام وضع التسجيل المطلوب فاتصل بالمؤسسة قبل البدء.'],
        ['9. التأكيد', 'بالمتابعة تؤكد أن هذه المعلومات كانت متاحة وأنك تفهم المسار. لا يحل ذلك محل التزام المؤسسة بتحديد أساس قانوني مناسب وتوثيقه. يتم تأكيد الميكروفون والكاميرا بصورة منفصلة عند الحاجة.']
      ]
    },
    privacy: {
      title: 'إشعار CLARITY بشأن ملفات الارتباط والخصوصية والذكاء الاصطناعي',
      intro: 'يصف هذا الإشعار الخصوصية والتخزين التقني في CLARITY Universal Candidate App. ينطبق على رابط المشارك المفتوح ويُقرأ مع معلومات المؤسسة الداعية.',
      sections: [
        ['1. التخزين التقني الضروري', 'تستخدم App فقط تخزين المتصفح الضروري ومعرّفات الجلسة ورموز الأمان للتحقق من الدعوة وحفظ الخطوة الصحيحة ومنع التكرار والاستئناف الآمن بعد الانقطاع. هذه التقنيات ضرورية للخدمة. لا يستخدم مسار المشارك ملفات ارتباط إعلانية أو إعلانات سلوكية لطرف ثالث.'],
        ['2. المتحكم والمعالج', 'تكون المؤسسة عادةً متحكمة لأنها تحدد الغرض واستخدام النتائج. تعمل CLARITY عادةً كمعالج ومزود للمنصة. في حالات محدودة قد تعالج بيانات الأمان أو سلامة الخدمة أو الامتثال تحت مسؤوليتها الخاصة.'],
        ['3. الأغراض', 'تُعالج البيانات لمصادقة الرابط والحفاظ على الأمان وتقديم الوحدة والتقاط الإجابات أو الملفات ونسخ الوسائط وإنشاء التحليلات والتقارير ونشر النتائج المخولة في CLARITY Workspace وتقديم الدعم وحفظ سجل التدقيق.'],
        ['4. شفافية الذكاء الاصطناعي', 'يوضح المسار متى يدعم الذكاء الاصطناعي النسخ أو التحليل أو التقرير. قد ينتج ملخصات أو مؤشرات أو درجات. يجب تفسيرها في السياق ومراجعتها من شخص مسؤول، وألا تكون الأساس الوحيد لقرار وظيفي مهم.'],
        ['5. المستلمون', 'قد تتاح المعلومات لمستخدمي المؤسسة المخولين ولمزودي الخدمات المتعاقدين اللازمين للاستضافة أو الوسائط أو النسخ أو الأمان أو التحليل أو التقارير. يقتصر الوصول حسب الدور والغرض. لا تقدم البيانات للمعلنين.'],
        ['6. المعالجة الدولية', 'قد يعالج المزودون التقنيون البيانات في عدة دول. عند النقل بين الولايات القانونية يجب تطبيق الضمانات التعاقدية والتنظيمية والتقنية المطلوبة. تستطيع المؤسسة تقديم التفاصيل الخاصة بمسارها.'],
        ['7. الأمان', 'تستخدم CLARITY ضوابط الوصول والروابط والرموز محددة النطاق والنقل المشفر وسجلات الحالة والتدقيق والاستعادة الآمنة لتقليل الوصول غير المصرح والتكرار. لا يضمن أي نظام متصل أماناً مطلقاً؛ أبلغ المؤسسة أو دعم CLARITY عن أي اشتباه.'],
        ['8. الاحتفاظ والحقوق والاتصال', 'تحدد المؤسسة الأساس القانوني والمدة الدقيقة وجهة اتصال الخصوصية. بحسب القانون يمكنك طلب الوصول أو التصحيح أو الحذف أو التقييد أو الاعتراض أو النقل أو المراجعة البشرية. ابدأ بالمؤسسة؛ وتقدم CLARITY المساعدة التقنية.'],
        ['9. الإصدار', 'تسجل App إصدار الإشعار ولغته اللذين تم تأكيدهما. تتطلب التغييرات الجوهرية إصداراً جديداً. الإصدار الحالي 1.3 بتاريخ 15 أغسطس 2026.']
      ]
    }
  }
};

function normalizeLocale(value = 'en') {
  const code = String(value || 'en').toLowerCase().split(/[-_]/)[0];
  return CANDIDATE_LEGAL_LANGUAGES.includes(code) ? code : 'en';
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getCandidateLegalBundle(locale = 'en') {
  const language = normalizeLocale(locale);
  return {
    language,
    direction: language === 'ar' ? 'rtl' : 'ltr',
    version: CANDIDATE_LEGAL_VERSION,
    updatedAt: CANDIDATE_LEGAL_UPDATED_AT,
    documents: clone(CONTENT[language] || CONTENT.en)
  };
}

