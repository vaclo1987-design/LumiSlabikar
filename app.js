(() => {
  const STORAGE_KEY = "lumi-viki-state-v1";
  const POSE_BASE = "assets/poses/";
  const ALPHABET_CARD_BASE = "assets/alphabet/";
  const TASK_IMAGE_BASE = "assets/tasks/";
  const TOPBAR_LUMI_IMAGE = "assets/icons/lumi-listen-complete-v2.png";
  const SYLLABLE_RECORDING_PAUSES_MS = [300, 500];
  const REMOVED_PROFILE_NAMES = new Set(["emka", "gregi"]);
  const AUDIO_DB_NAME = "lumi-alphabet-audio-v1";
  const AUDIO_STORE_NAME = "recordings";
  const MAX_RECORDING_MS = 4500;
  const PRONUNCIATION_PASS_SCORE = 60;

  const poses = {
    hovori: `${POSE_BASE}lumi_hovori.png`,
    pokojny: `${POSE_BASE}lumi_pokojny.png`,
    tesi: `${POSE_BASE}lumi_tesi_sa.png`,
    ok: `${POSE_BASE}lumi_ok_transparent.png`,
    chyba: `${POSE_BASE}lumi_smutny_transparent.png`,
    rozmysla: `${POSE_BASE}lumi_rozmysla_transparent.png`,
    ukazuje: `${POSE_BASE}lumi_ukazuje_transparent.png`,
    pocuva: `${POSE_BASE}lumi_pokojny.png`,
    tlieska: `${POSE_BASE}lumi_tlieska_transparent.png`,
    spi: `${POSE_BASE}lumi_pokojny.png`,
    cita: `${POSE_BASE}lumi_pokojny.png`,
    smutny: `${POSE_BASE}lumi_smutny_transparent.png`,
    smeje: `${POSE_BASE}lumi_tesi_sa.png`,
    skolak: `${POSE_BASE}lumi_hovori.png`,
    detektiv: `${POSE_BASE}lumi_rozmysla_transparent.png`,
  };

  const profileAvatars = [
    { id: "hovori", label: "Lumi máva", src: poses.hovori },
    { id: "pokojny", label: "Pokojný Lumi", src: poses.pokojny },
    { id: "tesi", label: "Lumi sa teší", src: poses.tesi },
    { id: "ok", label: "Lumi ukazuje OK", src: poses.ok },
    { id: "rozmysla", label: "Lumi rozmýšľa", src: poses.rozmysla },
    { id: "ukazuje", label: "Lumi ukazuje", src: poses.ukazuje },
    { id: "smutny", label: "Smutný Lumi", src: poses.smutny },
    { id: "tlieska", label: "Lumi tlieska", src: poses.tlieska },
  ];

  const objectBank = {
    autobus: { label: "autobus", letter: "A", image: `${TASK_IMAGE_BASE}autobus.png`, memoryImage: "assets/memory/autobus.jpg", place: "VONKU", emoji: "🚌" },
    banan: { label: "banán", letter: "B", image: `${TASK_IMAGE_BASE}banan.png`, memoryImage: "assets/memory/banan.jpg", place: "DOMA", emoji: "🍌" },
    ceruzka: { label: "ceruzka", letter: "C", image: `${TASK_IMAGE_BASE}ceruzka.png`, memoryImage: "assets/memory/ceruzka.jpg", place: "V ŠKOLE", emoji: "✏️" },
    duha: { label: "dúha", letter: "D", memoryImage: "assets/memory/duha.jpg", place: "VONKU", emoji: "🌈" },
    futbal: { label: "futbal", letter: "F", memoryImage: "assets/memory/futbal.jpg", place: "VONKU", emoji: "⚽" },
    gastan: { label: "gaštan", letter: "G", memoryImage: "assets/memory/gastan.jpg", place: "VONKU", emoji: "●" },
    had: { label: "had", letter: "H", memoryImage: "assets/memory/had.jpg", place: "VONKU", emoji: "〰" },
    dom: { label: "dom", letter: "D", image: `${TASK_IMAGE_BASE}dom.jpg`, place: "DOMA", emoji: "🏠" },
    macka: { label: "mačka", letter: "M", image: `${TASK_IMAGE_BASE}macka.jpg`, place: "DOMA", emoji: "🐱" },
    pes: { label: "pes", letter: "P", place: "DOMA", emoji: "🐶" },
    sova: { label: "sova", letter: "S", place: "VONKU", emoji: "🦉" },
    vlak: { label: "vlak", letter: "V", image: `${TASK_IMAGE_BASE}vlak.jpg`, place: "VONKU", emoji: "🚂" },
    skola: { label: "škola", letter: "Š", place: "V ŠKOLE", emoji: "🏫" },
    tabula: { label: "tabuľa", letter: "T", place: "V ŠKOLE", emoji: "▰" },
    oko: { label: "oko", letter: "O", place: "DOMA", emoji: "👁️" },
    lopta: { label: "lopta", letter: "L", place: "VONKU", emoji: "⚽" },
    kvet: { label: "kvet", letter: "K", place: "VONKU", emoji: "🌼" },
    elektricka: { label: "električka", letter: "E", memoryImage: "assets/memory/elektricka.jpg", place: "VONKU", emoji: "🚋" },
    ucho: { label: "ucho", letter: "U", place: "DOMA", emoji: "👂" },
    rak: { label: "rak", letter: "R", place: "VONKU", emoji: "🦀" },
  };

  const alphabet = [
    { letter: "A", word: "ananás", card: `${ALPHABET_CARD_BASE}card-a.jpg`, active: true },
    { letter: "B", word: "balón", card: `${ALPHABET_CARD_BASE}card-b.jpg`, active: true },
    { letter: "C", word: "citrón", card: `${ALPHABET_CARD_BASE}card-c.jpg`, active: true },
    { letter: "Č", word: "čokoláda", card: `${ALPHABET_CARD_BASE}card-c-makcen.jpg`, active: true },
    { letter: "D", word: "dom", card: `${ALPHABET_CARD_BASE}card-d.jpg`, active: true },
    { letter: "Ď", word: "ďateľ", card: `${ALPHABET_CARD_BASE}card-d-makke.jpg`, active: true },
    { letter: "DZ", word: "hrdza", card: `${ALPHABET_CARD_BASE}card-dz.jpg`, active: true },
    { letter: "DŽ", word: "džús", card: `${ALPHABET_CARD_BASE}card-dz-makcen.jpg`, active: true },
    { letter: "E", word: "električka", card: `${ALPHABET_CARD_BASE}card-e.jpg`, active: true },
    { letter: "F", word: "fúrik", card: `${ALPHABET_CARD_BASE}card-f.jpg`, active: true },
    { letter: "G", word: "gombík", card: `${ALPHABET_CARD_BASE}card-g.jpg`, active: true },
    { letter: "H", word: "hojdačka", card: `${ALPHABET_CARD_BASE}card-h.jpg`, active: true },
    { letter: "CH", word: "chobotnica", card: `${ALPHABET_CARD_BASE}card-ch.jpg`, active: true },
    { letter: "I", word: "ihla", card: `${ALPHABET_CARD_BASE}card-i.jpg`, active: true },
    { letter: "J", word: "jahoda", card: `${ALPHABET_CARD_BASE}card-j.jpg`, active: true },
    { letter: "K", word: "kolotoč", card: `${ALPHABET_CARD_BASE}card-k.jpg`, active: true },
    { letter: "L", word: "lampa", card: `${ALPHABET_CARD_BASE}card-l.jpg`, active: true },
    { letter: "Ľ", word: "ľad", card: `${ALPHABET_CARD_BASE}card-l-makke.jpg`, active: true },
    { letter: "M", word: "most", card: `${ALPHABET_CARD_BASE}card-m.jpg`, active: true },
    { letter: "N", word: "nanuk", card: `${ALPHABET_CARD_BASE}card-n.jpg`, active: true },
    { letter: "Ň", word: "ňufák", card: `${ALPHABET_CARD_BASE}card-n-makke.jpg`, active: true },
    { letter: "O", word: "oko", card: `${ALPHABET_CARD_BASE}card-o.jpg`, active: true },
    { letter: "P", word: "papagáj", card: `${ALPHABET_CARD_BASE}card-p.jpg`, active: true },
    { letter: "Q", word: "", card: `${ALPHABET_CARD_BASE}card-q.jpg`, letterOnly: true, active: true },
    { letter: "R", word: "raketa", card: `${ALPHABET_CARD_BASE}card-r.jpg`, active: true },
    { letter: "S", word: "slimák", card: `${ALPHABET_CARD_BASE}card-s.jpg`, active: true },
    { letter: "Š", word: "šašo", card: `${ALPHABET_CARD_BASE}card-s-makcen.jpg`, active: true },
    { letter: "T", word: "televízor", card: `${ALPHABET_CARD_BASE}card-t.jpg`, active: true },
    { letter: "Ť", word: "ťava", card: `${ALPHABET_CARD_BASE}card-t-makke.jpg`, active: true },
    { letter: "U", word: "umývadlo", card: `${ALPHABET_CARD_BASE}card-u.jpg`, active: true },
    { letter: "V", word: "vrana", card: `${ALPHABET_CARD_BASE}card-v.jpg`, active: true },
    { letter: "W", word: "web", card: `${ALPHABET_CARD_BASE}card-w.jpg`, active: true },
    { letter: "X", word: "xylofón", card: `${ALPHABET_CARD_BASE}card-x.jpg`, active: true },
    { letter: "Y", word: "yety", card: `${ALPHABET_CARD_BASE}card-y.jpg`, active: true },
    { letter: "Z", word: "zips", card: `${ALPHABET_CARD_BASE}card-z.jpg`, active: true },
    { letter: "Ž", word: "žaba", card: `${ALPHABET_CARD_BASE}card-z-makcen.jpg`, active: true },
  ];

  const lessons = [
    {
      order: 1,
      type: "TapHotspot",
      title: "Nájdi A, B a C",
      skill: "orientácia",
      free: true,
      lights: 1,
      pose: "ukazuje",
      intro: "Ahoj. Nájdi kartičky s písmenami A, B a C.",
      prompt: "Ťukni na A, B a C.",
      items: ["autobus", "banan", "ceruzka", "duha", "elektricka", "futbal"],
      targets: ["autobus", "banan", "ceruzka"],
      alphabetCards: true,
      compactCards: true,
      shuffleItems: true,
    },
    {
      order: 2,
      type: "SelectOne",
      title: "Kto čo robí?",
      skill: "veta",
      free: true,
      lights: 2,
      pose: "pocuva",
      intro: "Pozri sa. Vyber vetu, ktorá sedí.",
      prompt: "Vyber vetu, ktorá sedí.",
      visualImage: `${TASK_IMAGE_BASE}beziace-dieta.jpg`,
      choices: [
        { label: "Dieťa beží.", correct: true },
        { label: "Dieťa spí.", correct: false },
      ],
    },
    {
      order: 3,
      type: "SelectOne",
      title: "Smiešna veta",
      skill: "slovná zásoba",
      free: true,
      lights: 2,
      pose: "smeje",
      intro: "V školskej taške mám...",
      prompt: "V školskej taške mám...",
      visualImage: `${TASK_IMAGE_BASE}skolska-taska.jpg`,
      choices: [
        { label: "ceruzku", image: `${TASK_IMAGE_BASE}ceruzka.png`, correct: true },
        { label: "vlak", image: `${TASK_IMAGE_BASE}vlak.jpg`, correct: false, funny: true },
        { label: "mačku", image: `${TASK_IMAGE_BASE}macka.jpg`, correct: false, funny: true },
      ],
    },
    {
      order: 4,
      type: "MatchPairs",
      title: "Nájdi dvojicu",
      skill: "zrakové párovanie",
      free: true,
      lights: 2,
      pose: "detektiv",
      intro: "Nájdi rovnaké obrázky. Pexeso.",
      prompt: "Otoč karty a nájdi páry.",
      pairs: ["autobus", "banan", "ceruzka", "duha", "elektricka", "futbal", "gastan", "had"],
    },
    {
      order: 5,
      type: "OddOneOut",
      title: "Čo je iné?",
      skill: "zrakové rozlišovanie",
      free: true,
      lights: 2,
      pose: "rozmysla",
      intro: "Jeden obrázok je iný. Ťukni naň.",
      prompt: "Jeden sem nepatrí.",
      choices: [
        { label: "auto", image: `${TASK_IMAGE_BASE}auto.jpg`, correct: false },
        { label: "vlak", image: `${TASK_IMAGE_BASE}vlak.jpg`, correct: false },
        { label: "autobus", image: `${TASK_IMAGE_BASE}autobus.png`, correct: false },
        { label: "banán", image: `${TASK_IMAGE_BASE}banan.png`, correct: true },
      ],
    },
    {
      order: 6,
      type: "PatternComplete",
      title: "Pokračuj vo vzore",
      skill: "vzory",
      free: true,
      lights: 2,
      pose: "ukazuje",
      intro: "Pozri na vzor. Doplň, čo ide ďalej.",
      prompt: "Čo ide ďalej?",
      sequence: ["●", "■", "●", "■", "●", "?"],
      choices: [
        { label: "■", correct: true },
        { label: "●", correct: false },
        { label: "▲", correct: false },
      ],
    },
    {
      order: 7,
      type: "PhonemeStart",
      title: "Počujem na začiatku",
      skill: "prvá hláska",
      free: true,
      lights: 3,
      pose: "pocuva",
      intro: "Počúvaj slovo. Aký zvuk je prvý?",
      prompt: "Ktorý zvuk je prvý?",
      word: "autobus",
      object: "autobus",
      correct: "A",
      choices: ["A", "O", "M"],
    },
    {
      order: 8,
      type: "PhonemeStart",
      title: "Vyber prvý zvuk",
      skill: "prvá hláska",
      free: true,
      lights: 3,
      pose: "pocuva",
      intro: "Počúvaj pozorne. Vyber prvý zvuk.",
      prompt: "Ktorý zvuk je prvý?",
      word: "banán",
      object: "banan",
      correct: "B",
      choices: ["B", "P", "D"],
    },
    {
      order: 9,
      type: "SilentPhonemeStart",
      title: "Tichá hra",
      skill: "abstrakcia",
      lights: 3,
      pose: "rozmysla",
      intro: "Nepoviem slovo. Povedz si ho v hlave.",
      prompt: "Povedz si obrázok v hlave.",
      object: "ceruzka",
      correct: "C",
      choices: ["C", "S", "Z"],
    },
    {
      order: 10,
      type: "MultiStart",
      title: "Lov na začiatok",
      skill: "prvá hláska",
      lights: 3,
      pose: "detektiv",
      intro: "Hľadáme slová na začiatku. Vyber správne.",
      prompt: "Hľadáme M.",
      target: "M",
      items: ["macka", "autobus", "ceruzka", "dom", "vlak", "banan"],
      correct: ["macka"],
    },
    {
      order: 11,
      type: "HintPanel",
      title: "Nájdi písmeno",
      skill: "nápoveda",
      lights: 2,
      pose: "ukazuje",
      intro: "Klikni na abecedu. Nájdeš písmeno.",
      prompt: "Nájdi písmeno M.",
      target: "M",
    },
    {
      order: 12,
      type: "DragMatch",
      title: "Prilož písmeno",
      skill: "písmeno a obrázok",
      lights: 3,
      pose: "ukazuje",
      intro: "Vyber písmeno a potom obrázok.",
      prompt: "Vyber písmeno a potom obrázok.",
      pairs: [
        { letter: "A", object: "autobus" },
        { letter: "B", object: "banan" },
        { letter: "C", object: "ceruzka" },
      ],
    },
    {
      order: 13,
      type: "ReverseHint",
      title: "Rýchla nápoveda",
      skill: "nápovedné obrázky",
      lights: 2,
      pose: "detektiv",
      intro: "Nájdi obrázok, ktorý patrí k písmenu.",
      prompt: "Ktorý obrázok patrí k B?",
      letter: "B",
      correct: "banan",
      items: ["autobus", "banan", "ceruzka"],
    },
    {
      order: 14,
      type: "MarkKnownLetters",
      title: "Zber písmen",
      skill: "sebareflexia",
      lights: 2,
      pose: "skolak",
      intro: "Označ písmená, ktoré už poznáš.",
      prompt: "Označ písmená, ktoré už poznáš.",
      letters: ["A", "B", "C", "M", "S", "O", "E", "L", "P", "T"],
    },
    {
      order: 15,
      type: "BlendTwoSounds",
      title: "Spoj zvuky",
      skill: "čítanie bez písmen",
      lights: 3,
      pose: "cita",
      intro: "Počúvaj: S. A. Spolu?",
      prompt: "S + A",
      sounds: ["S", "A"],
      correct: "SA",
      choices: ["SA", "SO", "MA"],
    },
    {
      order: 16,
      type: "BlendTwoSounds",
      title: "Viac samohlások",
      skill: "sluchová syntéza",
      lights: 3,
      pose: "cita",
      intro: "Počúvaj a vyber správnu slabiku.",
      prompt: "S + O",
      sounds: ["S", "O"],
      correct: "SO",
      choices: ["SA", "SE", "SO", "SU"],
    },
    {
      order: 17,
      type: "BlendTwoSounds",
      title: "Iná spoluhláska",
      skill: "sluchová syntéza",
      lights: 3,
      pose: "cita",
      intro: "Počúvaj: M. A. Spolu?",
      prompt: "M + A",
      sounds: ["M", "A"],
      correct: "MA",
      choices: ["MA", "MO", "SA"],
    },
    {
      order: 18,
      type: "BubbleSyllables",
      title: "Bubliny slabík",
      skill: "automatizácia",
      lights: 3,
      pose: "cita",
      intro: "Chytaj slabiku, ktorú počuješ.",
      prompt: "Chyť správnu slabiku.",
      sounds: ["S", "U"],
      correct: "SU",
      choices: ["SA", "SU", "MU", "ME"],
    },
    {
      order: 19,
      type: "BuildSyllable",
      title: "Dve kartičky",
      skill: "prvé slabiky",
      lights: 4,
      pose: "cita",
      intro: "Spoj dve písmená. Čo vzniklo?",
      prompt: "Postav MA.",
      target: "MA",
      letters: ["M", "A", "S", "O"],
    },
    {
      order: 20,
      type: "Checkpoint",
      title: "Čo už viem",
      skill: "diagnostika",
      lights: 5,
      pose: "tlieska",
      intro: "Skús krátky test. Ukáž, čo už vieš.",
      prompt: "Krátky mix úloh.",
      checks: [
        { label: "Prvá hláska", emoji: "👂" },
        { label: "Nápoveda", emoji: "A" },
        { label: "Pexeso", emoji: "★" },
        { label: "S + A", emoji: "SA" },
        { label: "M + A", emoji: "MA" },
        { label: "Slabika", emoji: "▣" },
      ],
    },
  ];

  const levels = [
    {
      id: "pripravne",
      number: 1,
      title: "Prípravné obdobie",
      subtitle: "Svet plný zábavy",
      lessonOrders: [1, 2, 3, 4, 5],
      icon: "🌳",
      iconLabel: "Spoznávame sa",
    },
    {
      id: "slabikar-1",
      number: 2,
      title: "Šlabikárové obdobie 1",
      subtitle: "Prvé zvuky a písmená",
      lessonOrders: [6, 7, 8, 9, 10],
      icon: "🎨",
      iconLabel: "Opisujeme",
    },
    {
      id: "slabikar-2",
      number: 3,
      title: "Šlabikárové obdobie 2",
      subtitle: "Písmená, obrázky a nápovedy",
      lessonOrders: [11, 12, 13, 14, 15],
      icon: "👂",
      iconLabel: "Trénujeme ušká",
    },
    {
      id: "slabikar-3",
      number: 4,
      title: "Šlabikárové obdobie 3",
      subtitle: "Slabiky a záverečné precvičenie",
      lessonOrders: [16, 17, 18, 19, 20],
      icon: "A",
      iconLabel: "Objavujeme písmená",
    },
  ];

  const surprises = [
    { object: "autobus", task: "A" },
    { object: "banan", task: "B" },
    { object: "ceruzka", task: "C" },
    { object: "dom", task: "B" },
    { object: "macka", task: "A" },
    { object: "skola", task: "B" },
    { object: "sova", task: "C" },
    { object: "vlak", task: "A" },
    { object: "lopta", task: "B" },
    { object: "kvet", task: "C" },
  ];

  const FULL_GLOW_LIGHTS = lessons.reduce((total, lesson) => total + lesson.lights, 0) + surprises.length;

  const praise = ["Správne.", "To sedí.", "Výborne.", "Áno, to je ono."];
  const mistakes = ["Nie. Skús ešte raz.", "To nesedí.", "Pozri sa na nápovedu.", "Skús to pomaly."];
  const funny = ["To by bol zvláštny objav.", "To sa často nevidí.", "Zaujímavá voľba."];

  let state = loadState();
  let screen = "home";
  let activeLevelId = levels[0].id;
  let activeLesson = null;
  let rewardLesson = null;
  let rewardLightsEarned = 0;
  let lastLine = "Vitaj. Vyber si level a môžeme začať.";
  let alphabetGoal = null;
  let audioCtx = null;
  let speechPauseTimer = null;
  let speechSequenceId = 0;
  let lastSpeechSequence = null;
  let currentLumiPose = "hovori";
  let lumiAnimationTimer = null;
  let selectedProfileAvatar = profileAvatars[0].src;
  let selectedReflectionLetter = alphabet[0];
  let activeAlphabetDetail = null;
  let alphabetScrollPosition = 0;
  let pronunciationListening = false;
  let selectedPatternAvailable = false;
  let parentAudioLetter = alphabet[0];
  let audioDatabasePromise = null;
  let microphoneStream = null;
  let microphoneStreamPromise = null;
  let microphoneReleaseRequested = false;
  let activeRecording = null;
  let recordingStartPending = false;
  let recordedAudioPlayer = null;
  let recordedAudioUrl = "";
  let lastRecordedAudio = null;

  const app = document.getElementById("app");
  const welcomeScreen = document.getElementById("welcomeScreen");
  const enterAppButton = document.getElementById("enterAppButton");
  const profilePill = document.getElementById("profilePill");
  const profilePillAvatar = document.getElementById("profilePillAvatar");
  const profilePillName = document.getElementById("profilePillName");
  const lightPill = document.getElementById("lightPill");
  const lumiPose = document.getElementById("lumiPose");
  const lumiLine = document.getElementById("lumiLine");
  const repeatButton = document.getElementById("repeatButton");
  const volumeRange = document.getElementById("volumeRange");
  const alphabetModal = document.getElementById("alphabetModal");
  const alphabetSheet = document.getElementById("alphabetSheet");
  const alphabetGrid = document.getElementById("alphabetGrid");
  const alphabetBrowseView = document.getElementById("alphabetBrowseView");
  const alphabetReflectionView = document.getElementById("alphabetReflectionView");
  const alphabetDetail = document.getElementById("alphabetDetail");
  const alphabetDetailCard = document.getElementById("alphabetDetailCard");
  const alphabetTitle = document.getElementById("alphabetTitle");
  const alphabetEyebrow = document.getElementById("alphabetEyebrow");
  const closeAlphabetButton = document.getElementById("closeAlphabetButton");
  const openReflectionButton = document.getElementById("openReflectionButton");
  const reflectionLetterGrid = document.getElementById("reflectionLetterGrid");
  const pronunciationLetter = document.getElementById("pronunciationLetter");
  const pronunciationScore = document.getElementById("pronunciationScore");
  const pronunciationScoreOutput = document.getElementById("pronunciationScoreOutput");
  const pronunciationStatus = document.getElementById("pronunciationStatus");
  const microphoneButton = document.getElementById("microphoneButton");
  const microphoneButtonLabel = document.getElementById("microphoneButtonLabel");
  const parentModal = document.getElementById("parentModal");
  const parentContent = document.getElementById("parentContent");
  const profileModal = document.getElementById("profileModal");
  const profileForm = document.getElementById("profileForm");
  const profileNameInput = document.getElementById("profileNameInput");
  const profileAvatarGrid = document.getElementById("profileAvatarGrid");
  const profileEditorTitle = document.getElementById("profileEditorTitle");
  const profileLightsCount = document.getElementById("profileLightsCount");
  const resetProfileButton = document.getElementById("resetProfileButton");
  const toast = document.getElementById("toast");

  function defaultState() {
    return {
      activeProfileId: "hugi",
      fullUnlocked: false,
      volume: 0.8,
      profiles: [
        {
          id: "hugi",
          name: "Hugi",
          avatar: poses.skolak,
          lights: 42,
          completed: [1, 2, 3, 4, 5],
          knownLetters: ["A", "B", "M"],
          pronunciationLetters: [],
          surprisesDone: [],
        },
      ],
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const defaults = defaultState();
      const loadedProfiles = Array.isArray(parsed.profiles) && parsed.profiles.length
        ? parsed.profiles.map((profile, index) => ({
            ...profile,
            id: profile.id || `profil_${index + 1}`,
            name: String(profile.name || `Profil ${index + 1}`).slice(0, 24),
            avatar: normalizeAvatar(profile.avatar, index),
            coins: undefined,
            lights: Number(profile.lights ?? profile.coins) || 0,
            completed: Array.isArray(profile.completed) ? profile.completed : [],
            knownLetters: Array.isArray(profile.knownLetters) ? profile.knownLetters : [],
            pronunciationLetters: Array.isArray(profile.pronunciationLetters) ? profile.pronunciationLetters : [],
            surprisesDone: Array.isArray(profile.surprisesDone) ? profile.surprisesDone : [],
          }))
        : defaults.profiles;
      const filteredProfiles = loadedProfiles.filter(
        (profile) => !REMOVED_PROFILE_NAMES.has(profile.name.trim().toLocaleLowerCase("sk-SK")),
      );
      const activeProfile =
        filteredProfiles.find((profile) => profile.id === parsed.activeProfileId) ||
        filteredProfiles[0] ||
        defaults.profiles[0];
      return {
        ...defaults,
        ...parsed,
        activeProfileId: activeProfile.id,
        profiles: [activeProfile],
      };
    } catch {
      return defaultState();
    }
  }

  function normalizeAvatar(avatar, index = 0) {
    if (profileAvatars.some((item) => item.src === avatar)) return avatar;
    const legacy = String(avatar || "");
    if (legacy.includes("smeje") || legacy.includes("tlieska")) return poses.tesi;
    if (legacy.includes("smutny") || legacy.includes("chyba")) return poses.smutny;
    if (legacy.includes("rozmysla") || legacy.includes("detektiv")) return poses.rozmysla;
    if (legacy.includes("ukazuje")) return poses.ukazuje;
    if (legacy.includes("ok")) return poses.ok;
    return profileAvatars[index % profileAvatars.length].src;
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    updateTopbar();
  }

  function currentProfile() {
    return state.profiles[0];
  }

  function resetCurrentProfile() {
    const profile = currentProfile();
    profile.completed = [];
    profile.lights = 0;
    profile.knownLetters = [];
    profile.pronunciationLetters = [];
    profile.surprisesDone = [];
    saveState();
  }

  function updateTopbar() {
    const profile = currentProfile();
    profilePillName.textContent = profile.name;
    profilePillAvatar.src = profile.avatar;
    profilePill.setAttribute("aria-label", `Upraviť profil ${profile.name}`);
    lightPill.textContent = profile.lights;
    document.documentElement.style.setProperty("--profile-light", String(profileLightLevel(profile)));
    volumeRange.value = String(state.volume ?? 0.8);
  }

  function profileLightLevel(profile) {
    return Math.min(1, Math.max(0, (Number(profile?.lights) || 0) / FULL_GLOW_LIGHTS));
  }

  function profileLightPercent(profile) {
    return Math.round(profileLightLevel(profile) * 100);
  }

  function lightWord(count) {
    if (count === 1) return "svetielko";
    if (count >= 2 && count <= 4) return "svetielka";
    return "svetielok";
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function sample(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function shuffled(list) {
    const result = [...list];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  }

  function setLumi(text, pose = "skolak", speakNow = false) {
    lastLine = text;
    lastSpeechSequence = null;
    lumiLine.textContent = text;
    currentLumiPose = pose;
    lumiPose.src = TOPBAR_LUMI_IMAGE;
    animateLumi(pose, speakNow);
    if (speakNow) speak(text);
  }

  function animateLumi(pose = currentLumiPose, speaking = false) {
    const panel = lumiPose.closest(".topbar-lumi");
    window.clearTimeout(lumiAnimationTimer);
    lumiPose.classList.remove("lumi-speaking", "lumi-idle", "lumi-pop");
    panel?.classList.remove("lumi-celebrating");
    void lumiPose.offsetWidth;

    if (["tesi", "smeje", "tlieska", "ok"].includes(pose)) {
      lumiPose.classList.add("lumi-pop");
      panel?.classList.add("lumi-celebrating");
      lumiAnimationTimer = window.setTimeout(() => {
        lumiPose.classList.remove("lumi-pop");
        panel?.classList.remove("lumi-celebrating");
        lumiPose.classList.add("lumi-idle");
      }, 900);
      return;
    }

    lumiPose.classList.add(speaking || ["hovori", "cita"].includes(pose) ? "lumi-speaking" : "lumi-idle");
  }

  function settleLumiAnimation() {
    const panel = lumiPose.closest(".topbar-lumi");
    if (panel?.classList.contains("lumi-celebrating")) return;
    lumiPose.classList.remove("lumi-speaking");
    lumiPose.classList.add("lumi-idle");
  }

  function speak(text) {
    lastLine = text;
    lastSpeechSequence = null;
    lastRecordedAudio = null;
    if (!("speechSynthesis" in window)) {
      showToast(text);
      return;
    }
    cancelSpeechPlayback();
    animateLumi(currentLumiPose, true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "sk-SK";
    utterance.volume = Number(state.volume ?? 0.8);
    utterance.rate = 0.9;
    utterance.onend = settleLumiAnimation;
    utterance.onerror = settleLumiAnimation;
    window.speechSynthesis.speak(utterance);
  }

  function cancelSpeechPlayback() {
    speechSequenceId += 1;
    window.clearTimeout(speechPauseTimer);
    speechPauseTimer = null;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    stopRecordedAudioPlayback();
  }

  function speakSoundsWithPause(sounds, pausesMs, ending = "") {
    const line = `${sounds.join(". ")}.${ending ? ` ${ending}` : ""}`;
    const recordings = ending ? [...sounds, ending] : [...sounds];
    lastLine = line;
    lastSpeechSequence = {
      sounds: [...sounds],
      pausesMs: Array.isArray(pausesMs) ? [...pausesMs] : pausesMs,
      ending,
    };
    lastRecordedAudio = null;
    lumiLine.textContent = line;
    if (!("speechSynthesis" in window)) {
      showToast(line);
      return;
    }

    cancelSpeechPlayback();
    animateLumi(currentLumiPose, true);
    const sequenceId = speechSequenceId;
    let index = 0;

    const playNext = () => {
      if (sequenceId !== speechSequenceId || index >= recordings.length) return;
      const utterance = new SpeechSynthesisUtterance(recordings[index]);
      utterance.lang = "sk-SK";
      utterance.volume = Number(state.volume ?? 0.8);
      utterance.rate = 0.9;
      utterance.onend = () => {
        index += 1;
        if (index < recordings.length && sequenceId === speechSequenceId) {
          const pauseMs = Array.isArray(pausesMs)
            ? pausesMs[index - 1] ?? pausesMs[pausesMs.length - 1] ?? 0
            : pausesMs;
          speechPauseTimer = window.setTimeout(playNext, pauseMs);
        } else {
          settleLumiAnimation();
        }
      };
      utterance.onerror = settleLumiAnimation;
      window.speechSynthesis.speak(utterance);
    };

    playNext();
  }

  function openAudioDatabase() {
    if (audioDatabasePromise) return audioDatabasePromise;
    audioDatabasePromise = new Promise((resolve, reject) => {
      if (!("indexedDB" in window)) {
        reject(new Error("Úložisko nahrávok nie je v tomto prehliadači dostupné."));
        return;
      }
      const request = window.indexedDB.open(AUDIO_DB_NAME, 1);
      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(AUDIO_STORE_NAME)) {
          database.createObjectStore(AUDIO_STORE_NAME, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("Nahrávky sa nepodarilo otvoriť."));
    });
    return audioDatabasePromise;
  }

  function audioRecordId(kind, letter) {
    return `${kind}:${letter}`;
  }

  function isCurrentAlphabetRecording(record) {
    if (record?.kind !== "alphabet") return true;
    const item = alphabet.find((entry) => entry.letter === record.letter);
    return Boolean(item) && String(record.word || "") === String(item.word || "");
  }

  async function getAudioRecord(kind, letter) {
    const database = await openAudioDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(AUDIO_STORE_NAME, "readonly")
        .objectStore(AUDIO_STORE_NAME)
        .get(audioRecordId(kind, letter));
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error("Nahrávku sa nepodarilo načítať."));
    });
  }

  async function getAllAudioRecords() {
    const database = await openAudioDatabase();
    return new Promise((resolve, reject) => {
      const request = database.transaction(AUDIO_STORE_NAME, "readonly")
        .objectStore(AUDIO_STORE_NAME)
        .getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error || new Error("Nahrávky sa nepodarilo načítať."));
    });
  }

  async function saveAudioRecord(kind, item, blob, features = null) {
    const database = await openAudioDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(AUDIO_STORE_NAME, "readwrite");
      transaction.objectStore(AUDIO_STORE_NAME).put({
        id: audioRecordId(kind, item.letter),
        kind,
        letter: item.letter,
        word: item.word,
        blob,
        features,
        updatedAt: Date.now(),
      });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Nahrávku sa nepodarilo uložiť."));
    });
  }

  async function deleteAudioRecordsForLetter(letter) {
    const database = await openAudioDatabase();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(AUDIO_STORE_NAME, "readwrite");
      const store = transaction.objectStore(AUDIO_STORE_NAME);
      store.delete(audioRecordId("alphabet", letter));
      store.delete(audioRecordId("pattern", letter));
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error || new Error("Nahrávky sa nepodarilo odstrániť."));
    });
  }

  function stopRecordedAudioPlayback() {
    if (recordedAudioPlayer) {
      recordedAudioPlayer.pause();
      recordedAudioPlayer.removeAttribute("src");
      recordedAudioPlayer = null;
    }
    if (recordedAudioUrl) {
      URL.revokeObjectURL(recordedAudioUrl);
      recordedAudioUrl = "";
    }
  }

  async function playAudioBlob(blob) {
    cancelSpeechPlayback();
    recordedAudioUrl = URL.createObjectURL(blob);
    recordedAudioPlayer = new Audio(recordedAudioUrl);
    recordedAudioPlayer.volume = Number(state.volume ?? 0.8);
    recordedAudioPlayer.onended = () => {
      stopRecordedAudioPlayback();
      settleLumiAnimation();
    };
    recordedAudioPlayer.onerror = () => {
      stopRecordedAudioPlayback();
      settleLumiAnimation();
      showToast("Nahrávku sa nepodarilo prehrať.");
    };
    animateLumi(currentLumiPose, true);
    await recordedAudioPlayer.play();
  }

  async function playStoredRecording(kind, item, remember = false) {
    try {
      const record = await getAudioRecord(kind, item.letter);
      if (!record?.blob || !isCurrentAlphabetRecording(record)) return false;
      if (remember) lastRecordedAudio = { kind, letter: item.letter };
      await playAudioBlob(record.blob);
      return true;
    } catch {
      return false;
    }
  }

  async function ensureMicrophoneStream() {
    const activeStream = microphoneStream?.getAudioTracks().some((track) => track.readyState === "live");
    if (activeStream) {
      microphoneReleaseRequested = false;
      microphoneStream.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
      return microphoneStream;
    }
    if (microphoneStreamPromise) return microphoneStreamPromise;
    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      throw new Error("Mikrofónové nahrávanie nie je v tomto prehliadači dostupné.");
    }
    microphoneReleaseRequested = false;
    microphoneStreamPromise = navigator.mediaDevices.getUserMedia({ audio: true });
    try {
      microphoneStream = await microphoneStreamPromise;
      if (microphoneReleaseRequested) {
        microphoneStream.getAudioTracks().forEach((track) => {
          track.enabled = false;
        });
        throw new Error("Nahrávanie bolo zrušené.");
      }
      return microphoneStream;
    } finally {
      microphoneStreamPromise = null;
    }
  }

  function releaseMicrophoneStream() {
    microphoneReleaseRequested = true;
    microphoneStream?.getTracks().forEach((track) => track.stop());
    microphoneStream = null;
  }

  function pauseMicrophoneStream() {
    microphoneReleaseRequested = true;
    microphoneStream?.getAudioTracks().forEach((track) => {
      track.enabled = false;
    });
  }

  function supportedRecordingMimeType() {
    return ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"]
      .find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || "";
  }

  async function startAudioRecording({ item, kind, purpose, onStateChange, onComplete, onError }) {
    if (activeRecording || recordingStartPending) return;
    recordingStartPending = true;
    try {
      const stream = await ensureMicrophoneStream();
      if (activeRecording) return;
      const mimeType = supportedRecordingMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const session = {
        recorder,
        chunks: [],
        item,
        kind,
        purpose,
        cancelled: false,
        timer: null,
        onStateChange,
        onComplete,
        onError,
      };
      activeRecording = session;
      recorder.ondataavailable = (event) => {
        if (event.data.size) session.chunks.push(event.data);
      };
      recorder.onerror = () => {
        session.cancelled = true;
        pauseMicrophoneStream();
        session.onError?.(new Error("Nahrávanie sa prerušilo."));
      };
      recorder.onstop = async () => {
        window.clearTimeout(session.timer);
        if (activeRecording === session) activeRecording = null;
        pauseMicrophoneStream();
        session.onStateChange?.(false);
        if (session.cancelled) return;
        const blob = new Blob(session.chunks, { type: recorder.mimeType || "audio/webm" });
        if (!blob.size) {
          session.onError?.(new Error("Nahrávka je prázdna."));
          return;
        }
        try {
          await session.onComplete?.(blob, session);
        } catch (error) {
          session.onError?.(error);
        }
      };
      recorder.start();
      session.timer = window.setTimeout(() => stopAudioRecording(), MAX_RECORDING_MS);
      session.onStateChange?.(true);
    } catch (error) {
      onStateChange?.(false);
      onError?.(error);
    } finally {
      recordingStartPending = false;
    }
  }

  function stopAudioRecording() {
    if (activeRecording?.recorder.state === "recording") activeRecording.recorder.stop();
  }

  function cancelAudioRecording(purpose = null) {
    if (!activeRecording || (purpose && activeRecording.purpose !== purpose)) return;
    activeRecording.cancelled = true;
    stopAudioRecording();
  }

  async function extractAudioFeatures(blob) {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") await audioCtx.resume();
    const audioBuffer = await audioCtx.decodeAudioData((await blob.arrayBuffer()).slice(0));
    const source = audioBuffer.getChannelData(0);
    const targetRate = 8000;
    const step = audioBuffer.sampleRate / targetRate;
    const samples = new Float32Array(Math.max(1, Math.floor(source.length / step)));
    for (let index = 0; index < samples.length; index += 1) {
      samples[index] = source[Math.min(source.length - 1, Math.floor(index * step))];
    }

    let peak = 0;
    for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
    const threshold = Math.max(0.008, peak * 0.08);
    let start = 0;
    let end = samples.length - 1;
    while (start < end && Math.abs(samples[start]) < threshold) start += 1;
    while (end > start && Math.abs(samples[end]) < threshold) end -= 1;
    const padding = Math.round(targetRate * 0.06);
    start = Math.max(0, start - padding);
    end = Math.min(samples.length - 1, end + padding);
    const duration = (end - start + 1) / targetRate;
    if (peak < 0.012 || duration < 0.12) throw new Error("Nahrávka je príliš tichá alebo krátka.");

    const frameSize = 256;
    const hop = 128;
    const availableFrames = Math.max(1, Math.floor((end - start - frameSize) / hop) + 1);
    const frameCount = Math.min(42, availableFrames);
    const vectors = [];
    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const sourceFrame = availableFrames === 1
        ? 0
        : Math.round((frameIndex / (frameCount - 1)) * (availableFrames - 1));
      const offset = start + sourceFrame * hop;
      const bands = Array(12).fill(0);
      let rms = 0;
      let crossings = 0;
      let previous = samples[offset] || 0;
      for (let index = 0; index < frameSize; index += 1) {
        const value = samples[offset + index] || 0;
        rms += value * value;
        if ((value >= 0) !== (previous >= 0)) crossings += 1;
        previous = value;
      }
      rms = Math.sqrt(rms / frameSize);
      for (let bin = 2; bin < frameSize / 2; bin += 1) {
        let real = 0;
        let imaginary = 0;
        for (let index = 0; index < frameSize; index += 1) {
          const windowed = (samples[offset + index] || 0) * (0.5 - 0.5 * Math.cos((2 * Math.PI * index) / (frameSize - 1)));
          const angle = (2 * Math.PI * bin * index) / frameSize;
          real += windowed * Math.cos(angle);
          imaginary -= windowed * Math.sin(angle);
        }
        const power = real * real + imaginary * imaginary;
        const band = Math.min(11, Math.floor((Math.log(bin) / Math.log(frameSize / 2)) * 12));
        bands[band] += power;
      }
      const spectrum = bands.map((value) => Math.log1p(value));
      const magnitude = Math.sqrt(spectrum.reduce((sum, value) => sum + value * value, 0)) || 1;
      vectors.push([
        ...spectrum.map((value) => value / magnitude),
        crossings / frameSize,
        Math.min(1, rms * 8),
      ]);
    }
    return { duration, vectors };
  }

  function featureVectorDistance(left, right) {
    const length = Math.min(left.length, right.length);
    let total = 0;
    for (let index = 0; index < length; index += 1) {
      const difference = left[index] - right[index];
      total += difference * difference;
    }
    return Math.sqrt(total / Math.max(1, length));
  }

  function compareAudioFeatures(reference, attempt) {
    const left = reference.vectors;
    const right = attempt.vectors;
    const previous = Array(right.length + 1).fill(Number.POSITIVE_INFINITY);
    previous[0] = 0;
    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      const current = Array(right.length + 1).fill(Number.POSITIVE_INFINITY);
      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        const cost = featureVectorDistance(left[leftIndex - 1], right[rightIndex - 1]);
        current[rightIndex] = cost + Math.min(previous[rightIndex], current[rightIndex - 1], previous[rightIndex - 1]);
      }
      for (let index = 0; index < current.length; index += 1) previous[index] = current[index];
    }
    const averageDistance = previous[right.length] / Math.max(left.length, right.length, 1);
    const spectralScore = Math.exp(-averageDistance * 4.2);
    const durationRatio = Math.max(0.01, attempt.duration / Math.max(reference.duration, 0.01));
    const durationScore = Math.exp(-Math.abs(Math.log(durationRatio)) * 1.35);
    return Math.round(Math.max(0, Math.min(1, spectralScore * 0.82 + durationScore * 0.18)) * 100);
  }

  function sfx(kind) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const now = audioCtx.currentTime;
      const volume = Number(state.volume ?? 0.8) * 0.12;
      const freq = kind === "ok" ? 740 : kind === "light" ? 980 : 220;
      osc.type = kind === "wrong" ? "triangle" : "sine";
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      return;
    }
  }

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 1600);
  }

  function enterApplication() {
    if (!welcomeScreen || welcomeScreen.classList.contains("leaving")) return;
    enterAppButton.disabled = true;
    const profile = currentProfile();
    screen = "home";
    activeLesson = null;
    alphabetGoal = null;
    render();
    setLumi(`Vitaj ${profile.name}. Vyber si level a môžeme začať.`, "hovori");
    welcomeScreen.classList.add("leaving");
    document.body.classList.remove("welcome-active");
    window.setTimeout(() => {
      welcomeScreen.remove();
      const firstLevel = document.querySelector("[data-level]");
      (firstLevel || app).focus({ preventScroll: true });
    }, 600);
  }

  function setScreen(next, lesson = null) {
    screen = next;
    activeLesson = lesson;
    alphabetGoal = null;
    render();
    app.focus({ preventScroll: true });
  }

  function render() {
    updateTopbar();
    if (screen === "home") renderHome();
    if (screen === "map") renderMap();
    if (screen === "lesson") renderLesson(activeLesson);
    if (screen === "surprise") renderSurprises();
    if (screen === "reward") renderReward();
  }

  function getLevel(levelId = activeLevelId) {
    return levels.find((level) => level.id === levelId) || levels[0];
  }

  function lessonsForLevel(level = getLevel()) {
    return level.lessonOrders
      .map((order) => lessons.find((lesson) => lesson.order === order))
      .filter(Boolean);
  }

  function levelForLesson(lesson) {
    return levels.find((level) => level.lessonOrders.includes(lesson?.order)) || levels[0];
  }

  function levelCompletion(profile, level) {
    const total = level.lessonOrders.length;
    const completed = level.lessonOrders.filter((order) => profile.completed.includes(order)).length;
    return {
      completed,
      total,
      percent: total ? Math.round((completed / total) * 100) : 0,
    };
  }

  function renderHome() {
    const profile = currentProfile();
    const continueLevel = levels.find((level) => levelCompletion(profile, level).percent < 100) || levels[levels.length - 1];
    const levelCards = levels
      .map((level) => {
        const progress = levelCompletion(profile, level);
        const status = progress.completed === progress.total
          ? "complete"
          : progress.completed > 0
            ? "in-progress"
            : "unopened";
        return `
          <button class="level-card level-card-${status}" type="button" data-level="${level.id}">
            <span class="level-marker" aria-label="${escapeHtml(level.iconLabel)}">
              <span class="level-picture ${level.icon === "A" ? "level-picture-letter" : ""}" aria-hidden="true">${level.icon}</span>
              <span class="level-number" aria-label="Level ${level.number}">${level.number}</span>
            </span>
            <span class="level-card-copy">
              <strong>${escapeHtml(level.title)}</strong>
              <small>${escapeHtml(level.subtitle)}</small>
              <span class="level-progress-meta">
                <span>${progress.completed} / ${progress.total} splnených úloh</span>
                <b>${progress.percent} %</b>
              </span>
              <progress class="level-slider" max="${progress.total}" value="${progress.completed}" aria-label="${escapeHtml(level.title)}: ${progress.completed} z ${progress.total} splnených úloh"></progress>
            </span>
            <span class="level-arrow" aria-hidden="true">›</span>
          </button>
        `;
      })
      .join("");

    app.innerHTML = `
      <section class="screen profile-screen home-screen">
        <div class="hero-stage home-hero-stage">
          <img class="home-side-stars home-side-stars-left" src="assets/home/home-stars-left.png" alt="" aria-hidden="true" />
          <img class="home-decor-sky" src="assets/home/home-clouds-stars-tall.png" alt="" aria-hidden="true" />
          <img class="home-decor-scenery" src="assets/home/home-learning-scenery.png" alt="" aria-hidden="true" />
          <img class="home-main-lumi" src="assets/poses/lumi_mava_home.png" alt="Lumi máva" />
          <div class="hero-copy home-welcome-cloud">
            <h1>Ahoj!</h1>
            <button class="primary-button home-continue-button" id="continueButton" type="button">POKRAČUJ</button>
          </div>
          <img class="home-side-stars home-side-stars-right" src="assets/home/home-stars-right.png" alt="" aria-hidden="true" />
        </div>
        <div class="home-level-panel">
          <div class="level-list">
            <div class="level-list-head">
              <p class="eyebrow">Moje levely</p>
              <h2>Vyber si obdobie</h2>
            </div>
            ${levelCards}
          </div>
          <div class="home-corner-actions" aria-label="Ďalšie možnosti">
            <button class="icon-button" id="surpriseButton" type="button" aria-label="Lumikové prekvapenia">
              <span aria-hidden="true">★</span>
            </button>
            <button class="icon-button" id="parentButton" type="button" aria-label="Rodičovská zóna">
              <span aria-hidden="true">⚿</span>
            </button>
          </div>
        </div>
      </section>
    `;

    app.querySelectorAll("[data-level]").forEach((button) => {
      button.addEventListener("click", () => {
        activeLevelId = button.dataset.level;
        const level = getLevel();
        setLumi(`Vybral si ${level.title}.`, "skolak", true);
        setScreen("map");
      });
    });
    document.getElementById("continueButton").addEventListener("click", () => {
      activeLevelId = continueLevel.id;
      setLumi(`Pokračujeme v leveli ${continueLevel.title}.`, "skolak", true);
      setScreen("map");
    });
    document.getElementById("surpriseButton").addEventListener("click", () => setScreen("surprise"));
    document.getElementById("parentButton").addEventListener("click", () => showParentModal());
  }

  function renderProfileAvatars() {
    profileAvatarGrid.innerHTML = profileAvatars
      .map(
        (avatar) => `
          <label class="avatar-option ${avatar.src === selectedProfileAvatar ? "selected" : ""}">
            <input type="radio" name="profileAvatar" value="${avatar.src}" ${avatar.src === selectedProfileAvatar ? "checked" : ""} />
            <img src="${avatar.src}" alt="${escapeHtml(avatar.label)}" />
            <span>${escapeHtml(avatar.label)}</span>
          </label>
        `,
      )
      .join("");

    profileAvatarGrid.querySelectorAll('input[name="profileAvatar"]').forEach((input) => {
      input.addEventListener("change", () => {
        selectedProfileAvatar = input.value;
        profileAvatarGrid.querySelectorAll(".avatar-option").forEach((option) => option.classList.remove("selected"));
        input.closest(".avatar-option").classList.add("selected");
      });
    });
  }

  function openProfileEditor() {
    const profile = currentProfile();
    selectedProfileAvatar = normalizeAvatar(profile.avatar);
    profileEditorTitle.textContent = "Upraviť profil";
    profileNameInput.value = profile.name;
    profileLightsCount.textContent = profile.lights;
    renderProfileAvatars();
    profileModal.classList.add("show");
    profileModal.setAttribute("aria-hidden", "false");
    window.setTimeout(() => {
      profileNameInput.focus();
      profileNameInput.select();
    }, 0);
  }

  function closeProfileEditor() {
    profileModal.classList.remove("show");
    profileModal.setAttribute("aria-hidden", "true");
  }

  function renderMap() {
    const profile = currentProfile();
    const level = getLevel();
    const levelLessons = lessonsForLevel(level);
    const progress = levelCompletion(profile, level);
    const steps = levelLessons
      .map((lesson, index) => {
        const done = profile.completed.includes(lesson.order);
        const locked = !state.fullUnlocked && lesson.order > 8;
        return `
          <button class="world-step ${done ? "done" : ""} ${locked ? "locked" : ""}" type="button" data-step="${lesson.order}">
            <span class="number">${index + 1}</span>
            <strong>${escapeHtml(lesson.title)}</strong>
            <small>${escapeHtml(lesson.skill)}</small>
          </button>
        `;
      })
      .join("");

    app.innerHTML = `
      <section class="screen map-screen">
        <div class="screen-title">
          <div>
            <p class="eyebrow">Level ${level.number}</p>
            <h1>${escapeHtml(level.title)}</h1>
            <p>${escapeHtml(level.subtitle)}</p>
          </div>
          <div class="level-map-actions">
            <button class="soft-button listen-style-button" id="backToLevelsButton" type="button">Levely</button>
            <div class="progress-card">
              <div class="progress-label">
                <span>Splnené úlohy</span>
                <span>${progress.completed} / ${progress.total}</span>
              </div>
              <div class="progress-track" style="--value:${progress.percent}%"><span></span></div>
            </div>
          </div>
        </div>
        <div class="world-grid level-exercise-grid">${steps}</div>
      </section>
    `;

    document.getElementById("backToLevelsButton").addEventListener("click", () => setScreen("home"));
    app.querySelectorAll("[data-step]").forEach((button) => {
      button.addEventListener("click", () => {
        const lesson = lessons.find((item) => item.order === Number(button.dataset.step));
        const locked = !state.fullUnlocked && lesson.order > 8;
        if (locked) {
          showParentModal(lesson);
          return;
        }
        setLumi(lesson.intro, lesson.pose, true);
        setScreen("lesson", lesson);
      });
    });
  }

  function renderLesson(lesson) {
    if (!lesson) {
      setScreen("map");
      return;
    }
    const level = levelForLesson(lesson);
    const levelLessons = lessonsForLevel(level);
    const lessonIndex = levelLessons.findIndex((item) => item.order === lesson.order);
    activeLevelId = level.id;
    app.innerHTML = `
      <section class="screen lesson-screen">
        <div class="lesson-body">
          <section class="task-card lesson-workspace">
            <header class="lesson-workspace-head">
              <button class="soft-button listen-style-button" id="backToMapButton" type="button">Cvičenia</button>
              <div class="task-title">
                <p class="eyebrow">Level ${level.number} · Cvičenie ${lessonIndex + 1} / ${levelLessons.length}</p>
                <h1>${escapeHtml(lesson.title)}</h1>
                <p>${escapeHtml(lesson.skill)}</p>
              </div>
            </header>
            <div class="lesson-task-content" id="taskMount"></div>
          </section>
        </div>
      </section>
    `;

    document.getElementById("backToMapButton").addEventListener("click", () => setScreen("map"));
    renderTask(lesson);
  }

  function objectMarkup(id) {
    const object = objectBank[id];
    if (!object) return "";
    if (object.image) return `<img src="${object.image}" alt="" /><span>${escapeHtml(object.label)}</span>`;
    return `<span class="emoji" aria-hidden="true">${object.emoji}</span><span>${escapeHtml(object.label)}</span>`;
  }

  function alphabetCardMarkup(id) {
    const object = objectBank[id];
    const item = alphabet.find((entry) => entry.letter === object?.letter);
    if (!item?.card) return objectMarkup(id);
    return `<img class="task-alphabet-card" src="${item.card}" alt="" />`;
  }

  function memoryObjectMarkup(id) {
    const object = objectBank[id];
    if (!object) return "";
    if (!object.memoryImage) return objectMarkup(id);
    return `<img class="memory-object-image" src="${object.memoryImage}" alt="" /><span class="memory-label">${escapeHtml(object.label)}</span>`;
  }

  function choiceVisualMarkup(choice) {
    if (choice.image) return `<img class="choice-image" src="${choice.image}" alt="" />`;
    if (choice.emoji) return `<span class="picture" aria-hidden="true">${choice.emoji}</span>`;
    return "";
  }

  function renderTask(lesson) {
    alphabetGoal = null;
    const mount = document.getElementById("taskMount");
    if (lesson.type === "TapHotspot") renderTapHotspot(mount, lesson);
    if (lesson.type === "SelectOne") renderSelectOne(mount, lesson);
    if (lesson.type === "MatchPairs") renderMatchPairs(mount, lesson);
    if (lesson.type === "OddOneOut") renderOddOneOut(mount, lesson);
    if (lesson.type === "PatternComplete") renderPatternComplete(mount, lesson);
    if (lesson.type === "PhonemeStart" || lesson.type === "SilentPhonemeStart") renderPhonemeStart(mount, lesson);
    if (lesson.type === "MultiStart") renderMultiStart(mount, lesson);
    if (lesson.type === "HintPanel") renderHintPanel(mount, lesson);
    if (lesson.type === "DragMatch") renderDragMatch(mount, lesson);
    if (lesson.type === "ReverseHint") renderReverseHint(mount, lesson);
    if (lesson.type === "MarkKnownLetters") renderMarkKnownLetters(mount, lesson);
    if (lesson.type === "BlendTwoSounds" || lesson.type === "BubbleSyllables") renderBlend(mount, lesson);
    if (lesson.type === "BuildSyllable") renderBuildSyllable(mount, lesson);
    if (lesson.type === "Checkpoint") renderCheckpoint(mount, lesson);
  }

  function renderTapHotspot(mount, lesson) {
    const found = new Set();
    const items = lesson.shuffleItems ? shuffled(lesson.items) : lesson.items;
    mount.innerHTML = `
      <div class="task-board">
        <div class="scene task-options ${lesson.alphabetCards ? "alphabet-card-scene" : ""} ${lesson.compactCards ? "compact-card-scene" : ""}">
          ${items
            .map((id) => {
              const object = objectBank[id];
              const label = object ? `${object.letter} ako ${object.label}` : id;
              const markup = lesson.alphabetCards ? alphabetCardMarkup(id) : objectMarkup(id);
              return `<button class="object-card" type="button" data-object="${id}" aria-label="${escapeHtml(label)}">${markup}</button>`;
            })
            .join("")}
        </div>
      </div>
    `;
    mount.querySelectorAll("[data-object]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.object;
        if (lesson.targets.includes(id)) {
          found.add(id);
          button.classList.add("found");
          sfx("ok");
          setLumi("Správne.", "ok", true);
          if (found.size === lesson.targets.length) completeLesson(lesson);
        } else {
          sfx("wrong");
          setLumi("To nesedí. Skús inú vec.", "rozmysla", true);
        }
      });
    });
  }

  function renderSelectOne(mount, lesson) {
    mount.innerHTML = `
      <div class="task-board">
        <div class="task-visual" aria-hidden="true">
          ${lesson.visualImage ? `<img src="${lesson.visualImage}" alt="" />` : `<span class="picture">${lesson.visual || ""}</span>`}
        </div>
        <div class="choice-grid task-options">
          ${lesson.choices
            .map(
              (choice, index) => `
                <button class="choice-button ${choice.image ? "has-image" : ""}" type="button" data-index="${index}">
                  ${choiceVisualMarkup(choice)}
                  <span>${escapeHtml(choice.label)}</span>
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
    `;
    mount.querySelectorAll("[data-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const choice = lesson.choices[Number(button.dataset.index)];
        if (choice.correct) {
          button.classList.add("correct");
          sfx("ok");
          setLumi(sample(praise), "tlieska", true);
          completeLesson(lesson);
        } else {
          button.classList.add("wrong");
          sfx("wrong");
          setLumi(choice.funny ? sample(funny) : sample(mistakes), "rozmysla", true);
        }
      });
    });
  }

  function renderMatchPairs(mount, lesson) {
    const deck = lesson.pairs
      .flatMap((id) => [id, id])
      .sort(() => Math.random() - 0.5)
      .map((id, index) => ({ id, index, matched: false }));
    let open = [];
    let matched = 0;
    mount.innerHTML = `
      <div class="task-board">
        <div class="memory-grid task-options">
          ${deck.map((card) => `<button class="memory-card" type="button" data-card="${card.index}" aria-label="Zakrytá karta"><span class="face"><img src="${poses.spi}" alt="" /></span></button>`).join("")}
        </div>
      </div>
    `;
    mount.querySelectorAll("[data-card]").forEach((button) => {
      button.addEventListener("click", () => {
        const card = deck[Number(button.dataset.card)];
        if (card.matched || open.includes(card.index) || open.length === 2) return;
        button.classList.add("open");
        button.innerHTML = `<span class="face">${memoryObjectMarkup(card.id)}</span>`;
        button.setAttribute("aria-label", objectBank[card.id]?.label || "Odkrytá karta");
        open.push(card.index);
        if (open.length === 2) {
          const [a, b] = open.map((idx) => deck[idx]);
          window.setTimeout(() => {
            if (a.id === b.id) {
              a.matched = true;
              b.matched = true;
              matched += 1;
              sfx("ok");
              setLumi(sample(praise), "tlieska", true);
              mount.querySelectorAll(".memory-card.open").forEach((item) => item.classList.add("correct"));
              if (matched === lesson.pairs.length) completeLesson(lesson);
            } else {
              sfx("wrong");
              setLumi("Skús ešte raz.", "rozmysla", true);
              open.forEach((idx) => {
                const cardButton = mount.querySelector(`[data-card="${idx}"]`);
                cardButton.classList.remove("open");
                cardButton.innerHTML = `<span class="face"><img src="${poses.spi}" alt="" /></span>`;
                cardButton.setAttribute("aria-label", "Zakrytá karta");
              });
            }
            open = [];
          }, 620);
        }
      });
    });
  }

  function renderOddOneOut(mount, lesson) {
    mount.innerHTML = `
      <div class="task-board">
        <div class="choice-grid task-options">
          ${lesson.choices
            .map(
              (choice, index) => `
                <button class="choice-button ${choice.image ? "has-image" : ""}" type="button" data-index="${index}">
                  ${choiceVisualMarkup(choice)}
                  <span>${escapeHtml(choice.label)}</span>
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
    `;
    bindCorrectChoice(mount, lesson, lesson.choices);
  }

  function renderPatternComplete(mount, lesson) {
    mount.innerHTML = `
      <div class="task-board">
        <div class="pattern-row">
          ${lesson.sequence.map((item) => `<div class="choice-button">${item}</div>`).join("")}
        </div>
        <div class="choice-grid pattern-choice-grid task-options">
          ${lesson.choices.map((choice, index) => `<button class="choice-button" type="button" data-index="${index}">${choice.label}</button>`).join("")}
        </div>
      </div>
    `;
    bindCorrectChoice(mount, lesson, lesson.choices);
  }

  function renderPhonemeStart(mount, lesson) {
    const object = objectBank[lesson.object];
    mount.innerHTML = `
      <div class="task-board">
        <div class="object-card">${objectMarkup(lesson.object)}</div>
        <div class="secondary-row">
          <button class="primary-button" id="sayWordButton" type="button">${lesson.type === "SilentPhonemeStart" ? "V hlave" : "Počúvaj"}</button>
          <button class="soft-button" type="button" id="openAlphabetTask">Abeceda</button>
        </div>
        <div class="letter-choice-grid task-options">
          ${lesson.choices.map((letter) => `<button class="choice-button" type="button" data-letter="${letter}">${letter}</button>`).join("")}
        </div>
      </div>
    `;
    document.getElementById("sayWordButton").addEventListener("click", () => {
      if (lesson.type === "SilentPhonemeStart") {
        setLumi("Povedz si slovo potichu.", "rozmysla", true);
      } else {
        setLumi(object.label, "pocuva", true);
      }
    });
    document.getElementById("openAlphabetTask").addEventListener("click", openAlphabet);
    mount.querySelectorAll("[data-letter]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.letter === lesson.correct) {
          button.classList.add("correct");
          sfx("ok");
          setLumi(`${sample(praise)} ${object.label} sa začína na ${lesson.correct}.`, "tlieska", true);
          completeLesson(lesson);
        } else {
          button.classList.add("wrong");
          sfx("wrong");
          setLumi(sample(mistakes), "rozmysla", true);
        }
      });
    });
  }

  function renderMultiStart(mount, lesson) {
    const chosen = new Set();
    mount.innerHTML = `
      <div class="task-board">
        <div class="object-grid task-options">
          ${lesson.items.map((id) => `<button class="object-card" type="button" data-object="${id}">${objectMarkup(id)}</button>`).join("")}
        </div>
      </div>
    `;
    mount.querySelectorAll("[data-object]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.object;
        if (lesson.correct.includes(id)) {
          chosen.add(id);
          button.classList.add("correct");
          sfx("ok");
          if (chosen.size === lesson.correct.length) completeLesson(lesson);
        } else {
          button.classList.add("wrong");
          sfx("wrong");
          setLumi(sample(mistakes), "rozmysla", true);
        }
      });
    });
  }

  function renderHintPanel(mount, lesson) {
    alphabetGoal = { lesson, letter: lesson.target };
    mount.innerHTML = `
      <div class="task-board">
        <div class="choice-button"><span class="picture">${lesson.target}</span></div>
        <div class="task-options">
          <button class="primary-button" id="hintAlphabetButton" type="button">Abeceda</button>
        </div>
      </div>
    `;
    document.getElementById("hintAlphabetButton").addEventListener("click", openAlphabet);
  }

  function renderDragMatch(mount, lesson) {
    let selected = "";
    const matched = new Set();
    mount.innerHTML = `
      <div class="task-board">
        <div class="task-options match-options">
          <div class="letter-choice-grid">
            ${lesson.pairs.map((pair) => `<button class="choice-button" type="button" data-pick-letter="${pair.letter}">${pair.letter}</button>`).join("")}
          </div>
          <div class="object-grid">
            ${lesson.pairs.map((pair) => `<button class="object-card" type="button" data-match-object="${pair.object}">${objectMarkup(pair.object)}</button>`).join("")}
          </div>
        </div>
      </div>
    `;
    mount.querySelectorAll("[data-pick-letter]").forEach((button) => {
      button.addEventListener("click", () => {
        selected = button.dataset.pickLetter;
        mount.querySelectorAll("[data-pick-letter]").forEach((item) => item.classList.remove("correct"));
        button.classList.add("correct");
      });
    });
    mount.querySelectorAll("[data-match-object]").forEach((button) => {
      button.addEventListener("click", () => {
        const pair = lesson.pairs.find((item) => item.object === button.dataset.matchObject);
        if (pair.letter === selected) {
          matched.add(pair.object);
          button.classList.add("correct");
          sfx("ok");
          if (matched.size === lesson.pairs.length) completeLesson(lesson);
        } else {
          button.classList.add("wrong");
          sfx("wrong");
          setLumi("Najprv vyber správne písmeno.", "rozmysla", true);
        }
      });
    });
  }

  function renderReverseHint(mount, lesson) {
    mount.innerHTML = `
      <div class="task-board">
        <div class="choice-button"><span class="picture">${lesson.letter}</span></div>
        <div class="object-grid task-options">
          ${lesson.items.map((id) => `<button class="object-card" type="button" data-object="${id}">${objectMarkup(id)}</button>`).join("")}
        </div>
      </div>
    `;
    mount.querySelectorAll("[data-object]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.object === lesson.correct) {
          button.classList.add("correct");
          sfx("ok");
          completeLesson(lesson);
        } else {
          button.classList.add("wrong");
          sfx("wrong");
          setLumi(sample(mistakes), "rozmysla", true);
        }
      });
    });
  }

  function renderMarkKnownLetters(mount, lesson) {
    const profile = currentProfile();
    const selected = new Set(profile.knownLetters || []);
    mount.innerHTML = `
      <div class="task-board">
        <div class="letter-choice-grid task-options">
          ${lesson.letters
            .map((letter) => {
              const item = alphabet.find((entry) => entry.letter === letter);
              return `
                <button
                  class="choice-button known-letter-card ${selected.has(letter) ? "correct" : ""}"
                  type="button"
                  data-known="${letter}"
                  aria-label="${escapeHtml(item ? `${item.letter} ako ${item.word}` : letter)}"
                >
                  ${item?.card ? `<img src="${item.card}" alt="" />` : `<span class="known-letter">${letter}</span>`}
                </button>
              `;
            })
            .join("")}
        </div>
        <button class="primary-button" id="knownDoneButton" type="button">Hotovo</button>
      </div>
    `;
    mount.querySelectorAll("[data-known]").forEach((button) => {
      button.addEventListener("click", () => {
        const letter = button.dataset.known;
        if (selected.has(letter)) {
          selected.delete(letter);
          button.classList.remove("correct");
        } else {
          selected.add(letter);
          button.classList.add("correct");
        }
        profile.knownLetters = [...selected];
        saveState();
      });
    });
    document.getElementById("knownDoneButton").addEventListener("click", () => completeLesson(lesson));
  }

  function renderBlend(mount, lesson) {
    mount.innerHTML = `
      <div class="task-board">
        <div class="secondary-row">
          <button class="primary-button" id="playSoundsButton" type="button">Počúvaj</button>
          <button class="soft-button" type="button" id="openAlphabetBlend">Abeceda</button>
        </div>
        <div class="letter-choice-grid task-options">
          ${lesson.choices.map((choice) => `<button class="choice-button" type="button" data-syllable="${choice}">${choice}</button>`).join("")}
        </div>
      </div>
    `;
    document.getElementById("playSoundsButton").addEventListener("click", () => {
      setLumi(`${lesson.sounds.join(". ")}. Spolu?`, "pocuva", false);
      speakSoundsWithPause(lesson.sounds, SYLLABLE_RECORDING_PAUSES_MS, "Spolu?");
    });
    document.getElementById("openAlphabetBlend").addEventListener("click", openAlphabet);
    mount.querySelectorAll("[data-syllable]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.syllable === lesson.correct) {
          button.classList.add("correct");
          sfx("ok");
          setLumi(`${sample(praise)} Vzniklo ${lesson.correct}.`, "tlieska", true);
          completeLesson(lesson);
        } else {
          button.classList.add("wrong");
          sfx("wrong");
          setLumi(sample(mistakes), "rozmysla", true);
        }
      });
    });
  }

  function renderBuildSyllable(mount, lesson) {
    let built = "";
    mount.innerHTML = `
      <div class="task-board">
        <div class="choice-button" id="builtSyllable"><span class="picture">?</span></div>
        <div class="letter-choice-grid task-options">
          ${lesson.letters.map((letter) => `<button class="choice-button" type="button" data-letter-card="${letter}">${letter}</button>`).join("")}
        </div>
        <button class="soft-button" id="clearBuildButton" type="button">Znova</button>
      </div>
    `;
    const display = document.getElementById("builtSyllable");
    mount.querySelectorAll("[data-letter-card]").forEach((button) => {
      button.addEventListener("click", () => {
        if (built.length >= 2) return;
        built += button.dataset.letterCard;
        display.innerHTML = `<span class="picture">${built}</span>`;
        if (built.length === 2) {
          if (built === lesson.target) {
            button.classList.add("correct");
            sfx("ok");
            setLumi(`Áno. ${lesson.target}.`, "tlieska", true);
            completeLesson(lesson);
          } else {
            sfx("wrong");
            setLumi("Ešte nie. Skús znova.", "rozmysla", true);
          }
        }
      });
    });
    document.getElementById("clearBuildButton").addEventListener("click", () => {
      built = "";
      display.innerHTML = `<span class="picture">?</span>`;
    });
  }

  function renderCheckpoint(mount, lesson) {
    const done = new Set();
    mount.innerHTML = `
      <div class="task-board">
        <div class="checkpoint-grid task-options">
          ${lesson.checks
            .map(
              (check, index) => `
              <button class="checkpoint-card" type="button" data-check="${index}">
                <span class="emoji">${check.emoji}</span>
                <span>${escapeHtml(check.label)}</span>
              </button>
            `,
            )
            .join("")}
        </div>
        <div class="reward-box hidden" id="checkpointResult">
          <strong>Pozri, čo už vieš</strong>
          <span>Najviac sa oplatí zopakovať slabiky S + samohláska a M + A.</span>
        </div>
      </div>
    `;
    mount.querySelectorAll("[data-check]").forEach((button) => {
      button.addEventListener("click", () => {
        done.add(button.dataset.check);
        button.classList.add("correct");
        sfx("ok");
        if (done.size >= lesson.checks.length) {
          document.getElementById("checkpointResult").classList.remove("hidden");
          setLumi("Výborne. Svet plný zábavy je hotový.", "tlieska", true);
          completeLesson(lesson);
        }
      });
    });
  }

  function bindCorrectChoice(mount, lesson, choices) {
    mount.querySelectorAll("[data-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const choice = choices[Number(button.dataset.index)];
        if (choice.correct) {
          button.classList.add("correct");
          sfx("ok");
          setLumi(sample(praise), "tlieska", true);
          completeLesson(lesson);
        } else {
          button.classList.add("wrong");
          sfx("wrong");
          setLumi(sample(mistakes), "rozmysla", true);
        }
      });
    });
  }

  function completeLesson(lesson) {
    const profile = currentProfile();
    rewardLightsEarned = 0;
    if (!profile.completed.includes(lesson.order)) {
      profile.completed.push(lesson.order);
      profile.completed.sort((a, b) => a - b);
      profile.lights += lesson.lights;
      rewardLightsEarned = lesson.lights;
      saveState();
    }
    rewardLesson = lesson;
    window.setTimeout(() => {
      sfx("light");
      setScreen("reward");
    }, 420);
  }

  function renderReward() {
    const profile = currentProfile();
    const lesson = rewardLesson || lessons[0];
    const earned = rewardLightsEarned;
    const level = levelForLesson(lesson);
    const levelLessons = lessonsForLevel(level);
    activeLevelId = level.id;
    const next = levelLessons.find((item) => item.order === lesson.order + 1);
    const canContinue = next && (state.fullUnlocked || next.order <= 8);
    app.innerHTML = `
      <section class="screen">
        <div class="hero-stage">
          <img src="${poses.smeje}" alt="Lumi sa teší" />
          <div class="hero-copy">
            <p class="eyebrow">Odmena</p>
            <h1>Výborne!</h1>
            <p>${earned
              ? `${escapeHtml(profile.name)} získava ${earned} ${lightWord(earned)} a rozžiaruje svoj Svet plný zábavy.`
              : `${escapeHtml(profile.name)} si úspešne zopakoval túto úlohu.`}</p>
            <div class="secondary-row">
              <button class="primary-button" id="rewardMapButton" type="button">Späť na cvičenia</button>
              ${canContinue ? `<button class="soft-button" id="nextLessonButton" type="button">Ďalšie cvičenie</button>` : ""}
            </div>
          </div>
        </div>
      </section>
    `;
    setLumi(earned ? `Výborne. Získal si ${earned} ${lightWord(earned)}.` : "Výborne. Úlohu si zvládol znova.", "smeje", true);
    document.getElementById("rewardMapButton").addEventListener("click", () => setScreen("map"));
    const nextButton = document.getElementById("nextLessonButton");
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        setLumi(next.intro, next.pose, true);
        setScreen("lesson", next);
      });
    }
  }

  function renderSurprises() {
    const profile = currentProfile();
    app.innerHTML = `
      <section class="screen lesson-screen">
        <div class="screen-title">
          <div>
            <p class="eyebrow">Minihra</p>
            <h1>Lumikové prekvapenia</h1>
            <p>Odkry okienko a splň jednu krátku úlohu.</p>
          </div>
          <button class="soft-button listen-style-button" id="surpriseMapButton" type="button">Levely</button>
        </div>
        <div class="lesson-body">
          <section class="task-card">
            <div class="surprise-grid">
              ${surprises
                .map(
                  (item, index) => `
                  <button class="surprise-card ${profile.surprisesDone.includes(index) ? "correct open" : ""}" type="button" data-surprise="${index}">
                    <span class="face">${profile.surprisesDone.includes(index) ? objectMarkup(item.object) : `<img src="${poses.spi}" alt="" />`}</span>
                  </button>
                `,
                )
                .join("")}
            </div>
          </section>
          <aside class="side-card">
            <div class="reward-box" id="surpriseTask">
              <strong>Vyber okienko</strong>
              <span>Lumi odkryje obrázok.</span>
            </div>
          </aside>
        </div>
      </section>
    `;
    document.getElementById("surpriseMapButton").addEventListener("click", () => setScreen("home"));
    app.querySelectorAll("[data-surprise]").forEach((button) => {
      button.addEventListener("click", () => openSurprise(Number(button.dataset.surprise), button));
    });
    setLumi("Vyber okienko s prekvapením.", "detektiv", false);
  }

  function openSurprise(index, button) {
    const profile = currentProfile();
    const item = surprises[index];
    const object = objectBank[item.object];
    button.classList.add("open");
    button.innerHTML = `<span class="face">${objectMarkup(item.object)}</span>`;
    const task = document.getElementById("surpriseTask");
    if (item.task === "A") {
      task.innerHTML = `
        <strong>Čo vidíš?</strong>
        <span>Povedz slovo nahlas.</span>
        <button class="primary-button" id="surpriseDone" type="button">Povedal som</button>
      `;
    }
    if (item.task === "B") {
      task.innerHTML = `
        <strong>Kam to patrí?</strong>
        <span>${escapeHtml(object.label)}</span>
        <div class="choice-grid">
          ${["DOMA", "VONKU", "V ŠKOLE"].map((place) => `<button class="choice-button" type="button" data-place="${place}">${place}</button>`).join("")}
        </div>
      `;
    }
    if (item.task === "C") {
      const choices = [object.letter, "S", "M", "A"].filter((letter, idx, arr) => arr.indexOf(letter) === idx).slice(0, 3);
      task.innerHTML = `
        <strong>Začiatok slova</strong>
        <span>${escapeHtml(object.label)}</span>
        <div class="letter-choice-grid">
          ${choices.map((letter) => `<button class="choice-button" type="button" data-letter="${letter}">${letter}</button>`).join("")}
        </div>
      `;
    }
    setLumi(item.task === "A" ? "Čo vidíš?" : item.task === "B" ? "Patrí to domov, von alebo do školy?" : "Vyber písmeno na začiatku.", "ukazuje", true);

    const doneButton = document.getElementById("surpriseDone");
    if (doneButton) {
      doneButton.addEventListener("click", () => finishSurprise(index));
    }
    task.querySelectorAll("[data-place]").forEach((choice) => {
      choice.addEventListener("click", () => {
        if (choice.dataset.place === object.place) {
          choice.classList.add("correct");
          finishSurprise(index);
        } else {
          choice.classList.add("wrong");
          setLumi(sample(mistakes), "rozmysla", true);
        }
      });
    });
    task.querySelectorAll("[data-letter]").forEach((choice) => {
      choice.addEventListener("click", () => {
        if (choice.dataset.letter === object.letter) {
          choice.classList.add("correct");
          finishSurprise(index);
        } else {
          choice.classList.add("wrong");
          setLumi(sample(mistakes), "rozmysla", true);
        }
      });
    });
  }

  function finishSurprise(index) {
    const profile = currentProfile();
    const newlyCompleted = !profile.surprisesDone.includes(index);
    if (newlyCompleted) {
      profile.surprisesDone.push(index);
      profile.lights += 1;
      saveState();
    }
    sfx("ok");
    setLumi(sample(praise), "tlieska", true);
    showToast(newlyCompleted ? "+1 svetielko" : "Toto svetielko už svieti.");
  }

  async function playAlphabetItem(item, includeWord = true) {
    if (!item) return;
    lastRecordedAudio = null;
    const line = includeWord && !item.letterOnly
      ? `${item.letter} ako ${item.word}.`
      : `${item.letter}.`;
    setLumi(line, "ukazuje", false);
    const recordingKind = includeWord ? "alphabet" : "pattern";
    if (await playStoredRecording(recordingKind, item, true)) return;
    lastRecordedAudio = null;
    if (!includeWord || item.letterOnly) {
      speakSoundsWithPause([item.letter], [100]);
      return;
    }
    speakSoundsWithPause([item.letter], [100], `ako ${item.word}.`);
  }

  function openAlphabetDetail(item) {
    activeAlphabetDetail = item;
    alphabetScrollPosition = alphabetSheet.scrollTop;
    alphabetDetailCard.innerHTML = item.card
      ? `<img src="${item.card}" alt="${escapeHtml(item.word ? `${item.letter} ako ${item.word}` : item.letter)}" />`
      : `<span class="alphabet-detail-letter">${item.letter}</span>`;
    alphabetDetailCard.setAttribute(
      "aria-label",
      `Prehrať znova: ${item.word ? `${item.letter} ako ${item.word}` : item.letter}`,
    );
    alphabetDetail.classList.remove("hidden");
    alphabetDetail.setAttribute("aria-hidden", "false");
    alphabetSheet.classList.add("detail-open");
    alphabetSheet.scrollTop = 0;
    document.getElementById("closeAlphabetDetailButton").focus({ preventScroll: true });
  }

  function closeAlphabetDetail() {
    const wasOpen = Boolean(activeAlphabetDetail);
    activeAlphabetDetail = null;
    alphabetDetail.classList.add("hidden");
    alphabetDetail.setAttribute("aria-hidden", "true");
    alphabetSheet.classList.remove("detail-open");
    if (wasOpen) alphabetSheet.scrollTop = alphabetScrollPosition;
  }

  function renderAlphabet() {
    alphabetGrid.innerHTML = alphabet
      .map(
        (item) => `
        <button
          class="letter-tile ${item.card ? "has-card" : ""} ${item.active ? "" : "inactive"}"
          type="button"
          data-alphabet="${item.letter}"
          aria-label="${escapeHtml(item.word ? `${item.letter} ako ${item.word}` : item.letter)}"
        >
          ${
            item.card
              ? `<img class="alphabet-card-image" src="${item.card}" alt="" />`
              : item.letterOnly
                ? `<span class="letter letter-only">${item.letter}</span>`
                : `
                <span class="letter">${item.letter}</span>
                ${item.image ? `<img src="${item.image}" alt="" />` : `<span class="emoji" aria-hidden="true">${item.emoji || item.letter}</span>`}
                <span>${escapeHtml(item.word)}</span>
              `
          }
        </button>
      `,
      )
      .join("");
    alphabetGrid.querySelectorAll("[data-alphabet]").forEach((button) => {
      button.addEventListener("click", () => {
        const item = alphabet.find((entry) => entry.letter === button.dataset.alphabet);
        alphabetGrid.querySelectorAll(".letter-tile").forEach((tile) => tile.classList.remove("correct", "wrong"));
        button.classList.add("correct");
        playAlphabetItem(item);
        if (alphabetGoal && item.letter === alphabetGoal.letter) {
          closeAlphabet();
          completeLesson(alphabetGoal.lesson);
        } else if (alphabetGoal) {
          button.classList.add("wrong");
          setLumi("Pozri ešte raz. Hľadáme iné písmeno.", "rozmysla", true);
        } else {
          openAlphabetDetail(item);
        }
      });
    });
  }

  function updatePronunciationScore(score) {
    const normalizedScore = Math.max(0, Math.min(100, Number(score) || 0));
    const passed = normalizedScore >= PRONUNCIATION_PASS_SCORE;
    pronunciationScore.value = String(normalizedScore);
    pronunciationScore.style.setProperty("--pronunciation-progress", `${normalizedScore}%`);
    pronunciationScore.classList.toggle("passed", passed);
    pronunciationScoreOutput.value = `${normalizedScore} %`;
    pronunciationScoreOutput.textContent = `${normalizedScore} %`;
    pronunciationScoreOutput.classList.toggle("passed", passed);
  }

  function resetPronunciationScore(message = "Vyber písmeno a stlač mikrofón.") {
    updatePronunciationScore(0);
    pronunciationStatus.textContent = message;
  }

  function markReflectionLetterLearned(letter) {
    const profile = currentProfile();
    const learnedLetters = new Set(profile.pronunciationLetters || []);
    if (learnedLetters.has(letter)) return;
    learnedLetters.add(letter);
    profile.pronunciationLetters = [...learnedLetters];
    saveState();
  }

  async function selectReflectionLetter(item) {
    if (!item || pronunciationListening) return;
    selectedReflectionLetter = item;
    pronunciationLetter.textContent = item.letter;
    reflectionLetterGrid.querySelectorAll("[data-reflection-letter]").forEach((button) => {
      const selected = button.dataset.reflectionLetter === item.letter;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    selectedPatternAvailable = false;
    microphoneButton.disabled = true;
    resetPronunciationScore(`Pripravujem hodnotenie písmena ${item.letter}...`);
    try {
      const pattern = await getAudioRecord("pattern", item.letter);
      if (selectedReflectionLetter !== item) return;
      selectedPatternAvailable = Boolean(pattern?.blob && pattern?.features);
      microphoneButton.disabled = !selectedPatternAvailable;
      pronunciationStatus.textContent = selectedPatternAvailable
        ? `Písmeno ${item.letter} je pripravené na hodnotenie.`
        : `Pre písmeno ${item.letter} ešte chýba rečový vzor v rodičovskej zóne.`;
    } catch {
      pronunciationStatus.textContent = "Uložené rečové vzory sa nepodarilo načítať.";
    }
  }

  function renderReflectionAlphabet() {
    const learnedLetters = new Set(currentProfile().pronunciationLetters || []);
    reflectionLetterGrid.innerHTML = alphabet
      .map(
        (item) => {
          const learned = learnedLetters.has(item.letter);
          return `
          <button
            class="reflection-letter ${learned ? "learned" : ""} ${item.letter === selectedReflectionLetter.letter ? "selected" : ""}"
            type="button"
            data-reflection-letter="${item.letter}"
            aria-pressed="${item.letter === selectedReflectionLetter.letter}"
            aria-label="Vybrať písmeno ${item.letter}${learned ? ", naučené" : ""}"
          >${item.letter}</button>
        `;
        },
      )
      .join("");
    reflectionLetterGrid.querySelectorAll("[data-reflection-letter]").forEach((button) => {
      button.addEventListener("click", () => {
        selectReflectionLetter(alphabet.find((item) => item.letter === button.dataset.reflectionLetter));
      });
    });
    selectReflectionLetter(selectedReflectionLetter);
  }

  function setMicrophoneState(listening) {
    pronunciationListening = listening;
    microphoneButton.classList.toggle("listening", listening);
    microphoneButton.setAttribute("aria-pressed", String(listening));
    microphoneButtonLabel.textContent = listening ? "ZASTAVIŤ" : "MIKROFÓN";
    microphoneButton.disabled = listening ? false : !selectedPatternAvailable;
    reflectionLetterGrid.querySelectorAll("button").forEach((button) => {
      button.disabled = listening;
    });
  }

  function stopPronunciationAssessment() {
    cancelAudioRecording("reflection");
    setMicrophoneState(false);
  }

  async function startPronunciationAssessment() {
    if (pronunciationListening) {
      stopAudioRecording();
      return;
    }
    if (!selectedPatternAvailable) {
      pronunciationStatus.textContent = `Najprv nahraj rečový vzor pre ${selectedReflectionLetter.letter} v rodičovskej zóne.`;
      return;
    }
    cancelSpeechPlayback();
    const assessedItem = selectedReflectionLetter;
    await startAudioRecording({
      item: assessedItem,
      kind: "attempt",
      purpose: "reflection",
      onStateChange: (recording) => {
        setMicrophoneState(recording);
        if (recording) {
          pronunciationStatus.textContent = `Počúvam písmeno ${assessedItem.letter}...`;
          setLumi("Počúvam ťa.", "pocuva", false);
        } else {
          pronunciationStatus.textContent = "Porovnávam nahrávku s rečovým vzorom...";
        }
      },
      onComplete: async (blob) => {
        const pattern = await getAudioRecord("pattern", assessedItem.letter);
        if (!pattern?.features) throw new Error("Rečový vzor sa nepodarilo načítať.");
        const attemptFeatures = await extractAudioFeatures(blob);
        const score = compareAudioFeatures(pattern.features, attemptFeatures);
        updatePronunciationScore(score);
        if (score >= PRONUNCIATION_PASS_SCORE) {
          markReflectionLetterLearned(assessedItem.letter);
          const learnedButton = reflectionLetterGrid.querySelector(`[data-reflection-letter="${assessedItem.letter}"]`);
          learnedButton?.classList.add("learned");
          learnedButton?.setAttribute("aria-label", `Vybrať písmeno ${assessedItem.letter}, naučené`);
          pronunciationStatus.textContent = score >= 80
            ? "Výborne. Výslovnosť sa zhoduje so vzorom."
            : "Dobre. Písmeno je naučené.";
          sfx("ok");
          setLumi("Výborne. Výslovnosť sa podarila.", "tesi", true);
        } else {
          pronunciationStatus.textContent = "Výslovnosť sa zatiaľ nezhoduje. Skús písmeno vysloviť ešte raz.";
          setLumi("Skús písmeno vysloviť ešte raz.", "rozmysla", true);
        }
      },
      onError: (error) => {
        setMicrophoneState(false);
        pronunciationStatus.textContent = error?.message || "Nahrávanie sa nepodarilo. Skús to znova.";
      },
    });
  }

  function showAlphabetBrowse() {
    stopPronunciationAssessment();
    pauseMicrophoneStream();
    cancelSpeechPlayback();
    closeAlphabetDetail();
    alphabetBrowseView.classList.remove("hidden");
    alphabetReflectionView.classList.add("hidden");
    openReflectionButton.classList.remove("hidden");
    alphabetEyebrow.textContent = "Nápoveda";
    alphabetTitle.textContent = "Abeceda";
    closeAlphabetButton.setAttribute("aria-label", "Späť k úlohe");
  }

  function openAlphabetReflection() {
    closeAlphabetDetail();
    renderReflectionAlphabet();
    alphabetBrowseView.classList.add("hidden");
    alphabetReflectionView.classList.remove("hidden");
    openReflectionButton.classList.add("hidden");
    alphabetEyebrow.textContent = "Reflexia";
    alphabetTitle.textContent = "Čo už viem";
    closeAlphabetButton.setAttribute("aria-label", "Späť na abecedu");
    closeAlphabetButton.focus({ preventScroll: true });
  }

  function openAlphabet() {
    showAlphabetBrowse();
    renderAlphabet();
    alphabetModal.classList.add("show");
    alphabetModal.setAttribute("aria-hidden", "false");
  }

  function closeAlphabet() {
    stopPronunciationAssessment();
    pauseMicrophoneStream();
    cancelSpeechPlayback();
    closeAlphabetDetail();
    alphabetModal.classList.remove("show");
    alphabetModal.setAttribute("aria-hidden", "true");
  }

  function alphabetRecordingPrompt(item) {
    return item.letterOnly || !item.word ? item.letter : `${item.letter} ako ${item.word}`;
  }

  function updateParentAudioSelection() {
    const selectedLetter = document.getElementById("parentAudioSelectedLetter");
    const alphabetPrompt = document.getElementById("parentAlphabetPrompt");
    const patternPrompt = document.getElementById("parentPatternPrompt");
    if (!selectedLetter || !alphabetPrompt || !patternPrompt) return;
    selectedLetter.textContent = parentAudioLetter.letter;
    alphabetPrompt.textContent = `Nahraj: „${alphabetRecordingPrompt(parentAudioLetter)}“`;
    patternPrompt.textContent = `Vyslov iba písmeno „${parentAudioLetter.letter}“.`;
    document.querySelectorAll("[data-parent-audio-letter]").forEach((button) => {
      const selected = button.dataset.parentAudioLetter === parentAudioLetter.letter;
      button.classList.toggle("selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
  }

  async function refreshParentAudioStudio(message = "") {
    const summary = document.getElementById("parentAudioSummary");
    const status = document.getElementById("parentAudioStatus");
    if (!summary || !status) return;
    try {
      const recordings = await getAllAudioRecords();
      const alphabetLetters = new Set(
        recordings
          .filter((record) => record.kind === "alphabet" && isCurrentAlphabetRecording(record))
          .map((record) => record.letter),
      );
      const patternLetters = new Set(recordings.filter((record) => record.kind === "pattern").map((record) => record.letter));
      summary.innerHTML = `
        <span><b>${alphabetLetters.size}/${alphabet.length}</b> nahrávok Abecedy</span>
        <span><b>${patternLetters.size}/${alphabet.length}</b> rečových vzorov</span>
      `;
      document.querySelectorAll("[data-parent-audio-letter]").forEach((button) => {
        const letter = button.dataset.parentAudioLetter;
        const hasAlphabet = alphabetLetters.has(letter);
        const hasPattern = patternLetters.has(letter);
        button.classList.toggle("has-alphabet", hasAlphabet);
        button.classList.toggle("has-pattern", hasPattern);
        button.setAttribute(
          "aria-label",
          `${letter}. Nahrávka Abecedy ${hasAlphabet ? "je uložená" : "chýba"}. Rečový vzor ${hasPattern ? "je uložený" : "chýba"}.`,
        );
      });
      const hasSelectedAlphabet = alphabetLetters.has(parentAudioLetter.letter);
      const hasSelectedPattern = patternLetters.has(parentAudioLetter.letter);
      document.getElementById("playParentAlphabetButton").disabled = !hasSelectedAlphabet;
      document.getElementById("playParentPatternButton").disabled = !hasSelectedPattern;
      document.getElementById("deleteParentLetterAudioButton").disabled = !hasSelectedAlphabet && !hasSelectedPattern;
      status.textContent = message || `Vybrané písmeno ${parentAudioLetter.letter}.`;
      updateParentAudioSelection();
    } catch (error) {
      status.textContent = error?.message || "Úložisko nahrávok nie je dostupné.";
    }
  }

  function setParentAudioRecordingState(kind, recording) {
    const alphabetButton = document.getElementById("recordParentAlphabetButton");
    const patternButton = document.getElementById("recordParentPatternButton");
    const letterButtons = document.querySelectorAll("[data-parent-audio-letter]");
    if (!alphabetButton || !patternButton) return;
    alphabetButton.disabled = recording && kind !== "alphabet";
    patternButton.disabled = recording && kind !== "pattern";
    alphabetButton.textContent = recording && kind === "alphabet" ? "ZASTAVIŤ" : "NAHRAŤ";
    patternButton.textContent = recording && kind === "pattern" ? "ZASTAVIŤ" : "NAHRAŤ";
    alphabetButton.classList.toggle("recording", recording && kind === "alphabet");
    patternButton.classList.toggle("recording", recording && kind === "pattern");
    letterButtons.forEach((button) => {
      button.disabled = recording;
    });
  }

  async function toggleParentAudioRecording(kind) {
    if (activeRecording) {
      if (activeRecording.purpose === "parent" && activeRecording.kind === kind) stopAudioRecording();
      return;
    }
    const item = parentAudioLetter;
    const status = document.getElementById("parentAudioStatus");
    cancelSpeechPlayback();
    await startAudioRecording({
      item,
      kind,
      purpose: "parent",
      onStateChange: (recording) => {
        setParentAudioRecordingState(kind, recording);
        if (recording && status) {
          status.textContent = kind === "alphabet"
            ? `Nahrávam „${alphabetRecordingPrompt(item)}“...`
            : `Nahrávam rečový vzor ${item.letter}...`;
        } else if (status) {
          status.textContent = "Spracúvam nahrávku...";
        }
      },
      onComplete: async (blob) => {
        const features = kind === "pattern" ? await extractAudioFeatures(blob) : null;
        await saveAudioRecord(kind, item, blob, features);
        sfx("ok");
        await refreshParentAudioStudio(
          kind === "alphabet"
            ? `Nahrávka Abecedy pre ${item.letter} je uložená.`
            : `Rečový vzor pre ${item.letter} je uložený.`,
        );
      },
      onError: (error) => {
        setParentAudioRecordingState(kind, false);
        if (status) status.textContent = error?.message || "Nahrávanie sa nepodarilo.";
      },
    });
  }

  async function playParentAudio(kind) {
    const status = document.getElementById("parentAudioStatus");
    const played = await playStoredRecording(kind, parentAudioLetter, false);
    if (status) status.textContent = played ? "Prehrávam uloženú nahrávku." : "Táto nahrávka ešte chýba.";
  }

  function bindParentAudioStudio() {
    document.querySelectorAll("[data-parent-audio-letter]").forEach((button) => {
      button.addEventListener("click", () => {
        if (activeRecording) return;
        parentAudioLetter = alphabet.find((item) => item.letter === button.dataset.parentAudioLetter) || alphabet[0];
        refreshParentAudioStudio();
      });
    });
    document.getElementById("recordParentAlphabetButton").addEventListener("click", () => toggleParentAudioRecording("alphabet"));
    document.getElementById("recordParentPatternButton").addEventListener("click", () => toggleParentAudioRecording("pattern"));
    document.getElementById("playParentAlphabetButton").addEventListener("click", () => playParentAudio("alphabet"));
    document.getElementById("playParentPatternButton").addEventListener("click", () => playParentAudio("pattern"));
    document.getElementById("deleteParentLetterAudioButton").addEventListener("click", async () => {
      if (!window.confirm(`Odstrániť obe nahrávky pre písmeno ${parentAudioLetter.letter}?`)) return;
      await deleteAudioRecordsForLetter(parentAudioLetter.letter);
      await refreshParentAudioStudio(`Nahrávky pre ${parentAudioLetter.letter} boli odstránené.`);
    });
    refreshParentAudioStudio();
  }

  function showParentModal(lesson = null) {
    const title = lesson ? `Krok ${lesson.order} je v plnej verzii.` : "Rodičovská zóna";
    const resetButton = state.activeProfileId
      ? `<button class="soft-button" id="resetProgressButton" type="button">Vynulovať aktuálny profil</button>`
      : "";
    parentContent.innerHTML = `
      <div class="task-board">
        <div class="reward-box">
          <strong>${escapeHtml(title)}</strong>
          <span>Zdarma sú kroky 1 až 8 a minihra. Kroky 9 až 20 sa odomknú po rodičovskom potvrdení.</span>
        </div>
        <div class="parent-grid">
          <div class="reward-box">
            <strong>3 zariadenia</strong>
            <span>Pripravené pre Google konto a licenčný server.</span>
            <div class="hint-list">
              <div class="hint-mini"><span>1</span><span>Tablet doma</span></div>
              <div class="hint-mini"><span>2</span><span>Školský tablet</span></div>
              <div class="hint-mini"><span>3</span><span>Rezerva</span></div>
              <div class="hint-mini"><span>4</span><span>Vyžaduje odhlásenie</span></div>
            </div>
          </div>
          <div class="reward-box">
            <strong>Odomknúť demo</strong>
            <span>Podrž tlačidlo 3 sekundy.</span>
            <button class="hold-button" id="holdUnlockButton" type="button">Podržať</button>
          </div>
        </div>
        <section class="parent-audio-studio" aria-labelledby="parentAudioTitle">
          <div class="parent-audio-head">
            <div>
              <p class="eyebrow">Nahrávky</p>
              <h3 id="parentAudioTitle">Abeceda a rečové vzory</h3>
            </div>
            <div class="parent-audio-summary" id="parentAudioSummary" aria-live="polite"></div>
          </div>
          <div class="parent-audio-layout">
            <div class="parent-audio-letter-grid" aria-label="Písmená pre nahrávanie">
              ${alphabet
                .map(
                  (item) => `
                    <button
                      class="parent-audio-letter ${item.letter === parentAudioLetter.letter ? "selected" : ""}"
                      type="button"
                      data-parent-audio-letter="${item.letter}"
                      aria-pressed="${item.letter === parentAudioLetter.letter}"
                    >
                      <span>${item.letter}</span>
                      <span class="audio-letter-indicators" aria-hidden="true"><i></i><i></i></span>
                    </button>
                  `,
                )
                .join("")}
            </div>
            <div class="parent-audio-controls">
              <div class="parent-audio-selected" id="parentAudioSelectedLetter">${parentAudioLetter.letter}</div>
              <div class="parent-recording-row">
                <div>
                  <strong>Nahrávka Abecedy</strong>
                  <span id="parentAlphabetPrompt">Nahraj: „${escapeHtml(alphabetRecordingPrompt(parentAudioLetter))}“</span>
                </div>
                <div class="parent-recording-actions">
                  <button class="soft-button" id="playParentAlphabetButton" type="button" disabled>PREHRAŤ</button>
                  <button class="primary-button" id="recordParentAlphabetButton" type="button">NAHRAŤ</button>
                </div>
              </div>
              <div class="parent-recording-row">
                <div>
                  <strong>Rečový vzor</strong>
                  <span id="parentPatternPrompt">Vyslov iba písmeno „${parentAudioLetter.letter}“.</span>
                </div>
                <div class="parent-recording-actions">
                  <button class="soft-button" id="playParentPatternButton" type="button" disabled>PREHRAŤ</button>
                  <button class="primary-button" id="recordParentPatternButton" type="button">NAHRAŤ</button>
                </div>
              </div>
              <p class="parent-audio-status" id="parentAudioStatus" role="status" aria-live="polite">Vyber písmeno.</p>
              <button class="soft-button delete-audio-button" id="deleteParentLetterAudioButton" type="button" disabled>ODSTRÁNIŤ NAHRÁVKY PÍSMENA</button>
            </div>
          </div>
        </section>
        ${resetButton}
      </div>
    `;
    parentModal.classList.add("show");
    parentModal.setAttribute("aria-hidden", "false");
    bindHoldUnlock();
    bindParentAudioStudio();
    const resetProgressButton = document.getElementById("resetProgressButton");
    if (resetProgressButton) {
      resetProgressButton.addEventListener("click", () => {
        resetCurrentProfile();
        closeParent();
        setLumi("Profil je vynulovaný.", "skolak", true);
        render();
      });
    }
  }

  function bindHoldUnlock() {
    const button = document.getElementById("holdUnlockButton");
    let timer = null;
    let start = 0;
    const stop = () => {
      window.clearInterval(timer);
      timer = null;
      button.style.setProperty("--hold", "0%");
    };
    const startHold = () => {
      start = Date.now();
      timer = window.setInterval(() => {
        const value = Math.min(100, ((Date.now() - start) / 3000) * 100);
        button.style.setProperty("--hold", `${value}%`);
        if (value >= 100) {
          stop();
          state.fullUnlocked = true;
          saveState();
          closeParent();
          setLumi("Svet plný zábavy je odomknutý.", "tlieska", true);
          setScreen("map");
        }
      }, 50);
    };
    button.addEventListener("pointerdown", startHold);
    button.addEventListener("pointerup", stop);
    button.addEventListener("pointerleave", stop);
    button.addEventListener("pointercancel", stop);
  }

  function closeParent() {
    cancelAudioRecording("parent");
    pauseMicrophoneStream();
    stopRecordedAudioPlayback();
    parentModal.classList.remove("show");
    parentModal.setAttribute("aria-hidden", "true");
  }

  document.getElementById("homeButton").addEventListener("click", () => setScreen("home"));
  profilePill.addEventListener("click", openProfileEditor);
  document.getElementById("alphabetButton").addEventListener("click", openAlphabet);
  closeAlphabetButton.addEventListener("click", () => {
    if (!alphabetReflectionView.classList.contains("hidden")) {
      showAlphabetBrowse();
      return;
    }
    closeAlphabet();
  });
  openReflectionButton.addEventListener("click", openAlphabetReflection);
  document.getElementById("closeAlphabetDetailButton").addEventListener("click", closeAlphabetDetail);
  alphabetDetailCard.addEventListener("click", () => playAlphabetItem(activeAlphabetDetail));
  microphoneButton.addEventListener("click", startPronunciationAssessment);
  document.getElementById("closeParentButton").addEventListener("click", closeParent);
  alphabetModal.addEventListener("click", (event) => {
    if (event.target === alphabetModal) closeAlphabet();
  });
  parentModal.addEventListener("click", (event) => {
    if (event.target === parentModal) closeParent();
  });
  document.getElementById("closeProfileButton").addEventListener("click", closeProfileEditor);
  document.getElementById("cancelProfileButton").addEventListener("click", closeProfileEditor);
  profileModal.addEventListener("click", (event) => {
    if (event.target === profileModal) closeProfileEditor();
  });
  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = profileNameInput.value.trim();
    if (!name) {
      profileNameInput.focus();
      showToast("Napíš meno profilu.");
      return;
    }

    const profile = currentProfile();
    profile.name = name.slice(0, 24);
    profile.avatar = selectedProfileAvatar;
    saveState();
    closeProfileEditor();
    setLumi("Profil je upravený.", "ok", true);
    render();
  });
  resetProfileButton.addEventListener("click", () => {
    resetCurrentProfile();
    closeProfileEditor();
    setLumi("Profil je vynulovaný. Začíname od začiatku.", "skolak", true);
    showToast("Profil a všetky splnené úlohy sú vynulované.");
    render();
  });
  repeatButton.addEventListener("click", () => {
    if (lastRecordedAudio) {
      const item = alphabet.find((entry) => entry.letter === lastRecordedAudio.letter);
      if (item) {
        playStoredRecording(lastRecordedAudio.kind, item, true);
        return;
      }
    }
    if (lastSpeechSequence) {
      const { sounds, pausesMs, ending } = lastSpeechSequence;
      speakSoundsWithPause(sounds, pausesMs, ending);
      return;
    }
    speak(lastLine);
  });
  volumeRange.addEventListener("input", () => {
    state.volume = Number(volumeRange.value);
    saveState();
  });
  window.addEventListener("beforeunload", releaseMicrophoneStream);

  if (welcomeScreen && enterAppButton) {
    const welcomeDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 50 : 4500;
    window.setTimeout(() => {
      enterAppButton.disabled = false;
      enterAppButton.focus({ preventScroll: true });
    }, welcomeDelay);
    enterAppButton.addEventListener("click", enterApplication);
  }

  updateTopbar();
  animateLumi("hovori");
  render();
})();
