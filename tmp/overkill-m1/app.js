(function () {
  const STORAGE_KEY = "overkill-m2-meta";
  const WORLD = 2800;
  const RUN_DURATION = 120;

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const titleOverlay = document.getElementById("titleOverlay");
  const titleEyebrow = document.getElementById("titleEyebrow");
  const titleSubtitle = document.getElementById("titleSubtitle");
  const titleBody = document.getElementById("titleBody");
  const titleStartButton = document.getElementById("titleStartButton");
  const titleSkipButton = document.getElementById("titleSkipButton");
  const introOverlay = document.getElementById("introOverlay");
  const introEyebrow = document.getElementById("introEyebrow");
  const introTitle = document.getElementById("introTitle");
  const introBody = document.getElementById("introBody");
  const introNextButton = document.getElementById("introNextButton");
  const introSkipButton = document.getElementById("introSkipButton");
  const deployOverlay = document.getElementById("deployOverlay");
  const deployPanel = document.getElementById("deployPanel");
  const deployEyebrow = document.getElementById("deployEyebrow");
  const deployTitle = document.getElementById("deployTitle");
  const deploySubtitle = document.getElementById("deploySubtitle");
  const deployBody = document.getElementById("deployBody");
  const chapterOverlay = document.getElementById("chapterOverlay");
  const chapterPanel = document.getElementById("chapterPanel");
  const chapterEyebrow = document.getElementById("chapterEyebrow");
  const chapterTitle = document.getElementById("chapterTitle");
  const chapterSubtitle = document.getElementById("chapterSubtitle");
  const chapterBody = document.getElementById("chapterBody");
  const chapterThreat = document.getElementById("chapterThreat");
  const chapterCommand = document.getElementById("chapterCommand");
  const baseOverlay = document.getElementById("baseOverlay");
  const basePanel = document.querySelector(".panel--base");
  const startRunButton = document.getElementById("startRunButton");
  const baseContent = document.getElementById("baseContent");
  const baseShowcase = document.getElementById("baseShowcase");
  const baseEyebrow = document.getElementById("baseEyebrow");
  const baseTitle = document.getElementById("baseTitle");
  const baseBody = document.getElementById("baseBody");
  const characterSelect = document.getElementById("characterSelect");
  const modeSelect = document.getElementById("modeSelect");
  const regionSelect = document.getElementById("regionSelect");
  const hunterLabel = document.getElementById("hunterLabel");
  const modeLabel = document.getElementById("modeLabel");
  const regionLabel = document.getElementById("regionLabel");
  const operationLabel = document.getElementById("operationLabel");
  const operationMap = document.getElementById("operationMap");
  const objectiveTitle = document.getElementById("objectiveTitle");
  const objectiveBody = document.getElementById("objectiveBody");
  const objectiveLabel = document.getElementById("objectiveLabel");
  const launchTrackLabel = document.getElementById("launchTrackLabel");
  const goldLabel = document.getElementById("goldLabel");
  const coreLabel = document.getElementById("coreLabel");
  const dataLabel = document.getElementById("dataLabel");
  const genesLabel = document.getElementById("genesLabel");
  const powerLabel = document.getElementById("powerLabel");
  const runsLabel = document.getElementById("runsLabel");
  const bestKillsLabel = document.getElementById("bestKillsLabel");
  const tabEquipment = document.getElementById("tabEquipment");
  const tabRelics = document.getElementById("tabRelics");
  const tabResearch = document.getElementById("tabResearch");
  const tabAscension = document.getElementById("tabAscension");
  const tabRecords = document.getElementById("tabRecords");
  const tabSeason = document.getElementById("tabSeason");
  const tabShop = document.getElementById("tabShop");
  const tabSettings = document.getElementById("tabSettings");
  const ftueTrack = document.getElementById("ftueTrack");
  const goldText = document.getElementById("goldText");
  const coreText = document.getElementById("coreText");
  const dataText = document.getElementById("dataText");
  const genesText = document.getElementById("genesText");
  const powerText = document.getElementById("powerText");
  const runsText = document.getElementById("runsText");
  const bestKillsText = document.getElementById("bestKillsText");

  const hud = document.querySelector(".hud");
  const controls = document.querySelector(".controls");
  const hpFill = document.getElementById("hpFill");
  const rageFill = document.getElementById("rageFill");
  const bossWrap = document.getElementById("bossWrap");
  const bossLabel = document.getElementById("bossLabel");
  const bossFill = document.getElementById("bossFill");
  const bossPartsText = document.getElementById("bossPartsText");
  const timerText = document.getElementById("timerText");
  const killsText = document.getElementById("killsText");
  const levelText = document.getElementById("levelText");
  const runObjectiveText = document.getElementById("runObjectiveText");
  const eventText = document.getElementById("eventText");
  const resourceLabel = document.getElementById("resourceLabel");

  const levelOverlay = document.getElementById("levelOverlay");
  const levelEyebrow = document.getElementById("levelEyebrow");
  const levelTitle = document.getElementById("levelTitle");
  const levelChoices = document.getElementById("levelChoices");
  const finishOverlay = document.getElementById("finishOverlay");
  const finishPanel = document.getElementById("finishPanel");
  const finishEyebrow = document.getElementById("finishEyebrow");
  const finishTitle = document.getElementById("finishTitle");
  const finishSubtitle = document.getElementById("finishSubtitle");
  const ultOverlay = document.getElementById("ultOverlay");
  const ultPanel = document.getElementById("ultPanel");
  const ultEyebrow = document.getElementById("ultEyebrow");
  const ultTitle = document.getElementById("ultTitle");
  const ultSubtitle = document.getElementById("ultSubtitle");

  const resultsOverlay = document.getElementById("resultsOverlay");
  const resultEyebrow = document.getElementById("resultEyebrow");
  const resultTitle = document.getElementById("resultTitle");
  const resultBody = document.getElementById("resultBody");
  const resultBonus = document.getElementById("resultBonus");
  const resultRewardStrip = document.getElementById("resultRewardStrip");
  const resultLootGrid = document.getElementById("resultLootGrid");
  const resultSeasonProgress = document.getElementById("resultSeasonProgress");
  const resultKills = document.getElementById("resultKills");
  const resultLevel = document.getElementById("resultLevel");
  const resultBoss = document.getElementById("resultBoss");
  const resultKillsLabel = document.getElementById("resultKillsLabel");
  const resultLevelLabel = document.getElementById("resultLevelLabel");
  const resultBossLabel = document.getElementById("resultBossLabel");
  const restartButton = document.getElementById("restartButton");
  const baseButton = document.getElementById("baseButton");

  const dashButton = document.getElementById("dashButton");
  const ultimateButton = document.getElementById("ultimateButton");
  const joystickBase = document.getElementById("joystickBase");
  const joystickThumb = document.getElementById("joystickThumb");

  const input = {
    moveX: 0,
    moveY: 0,
    keyboard: { up: false, down: false, left: false, right: false },
  };

  const visualEffects = [];
  const floatingTexts = [];
  const projectiles = [];
  const enemies = [];
  const xpOrbs = [];
  const orbitBlades = [];
  let audioContext = null;
  let cameraShake = { time: 0, power: 0 };
  let renderOffsetX = 0;
  let renderOffsetY = 0;

  const i18n = {
    en: {
      titleEyebrow: "MOBILE DEMO // VERTICAL SLICE",
      titleSubtitle: "Kill the god. Harvest the heart. Go back stronger.",
      titleBody:
        "Hyper-action mobile RPG prototype with hunter choice, region choice, boss kills, loot drops, and build spikes.",
      deployEyebrow: "DROP SEQUENCE // LIVE",
      chapterUnlockEyebrow: "CHAPTER UNLOCKED",
      chapterUnlockSubtitle: "NEW OPERATION OPEN",
      chapterUnlockBody: "{region} is now available on the operation map. Push the new front before the next titan mutates.",
      regionRedcityReward: "Payout: early gear spikes, Reaver set pieces, and fast route tempo.",
      regionRedcityThreat: "Threat: collapsing streets and feral swarm surges.",
      regionRedcityCommand: "Command: cut the lane open, build tempo, and rip the titan core free.",
      regionSanctuaryReward: "Payout: genes, precision defense drops, and Signal-aligned kit.",
      regionSanctuaryThreat: "Threat: machine cult fortifications and signal distortion.",
      regionSanctuaryCommand: "Command: break the outer line fast and secure a foothold before the archon stabilizes.",
      regionBlacktideReward: "Payout: abyss set pieces, Rift salvage, and high-end season gains.",
      regionBlacktideThreat: "Threat: abyss bloom pools and leviathan pressure from every angle.",
      regionBlacktideCommand: "Command: keep moving, deny the tide encirclement, and sever the spine before the flats drown you.",
      deployBodyHunt: "Sweep the lane, stack your spike, and break the titan before the route collapses.",
      deployBodyBoss: "Immediate titan pressure. Break weakpoints fast and bank genes before the lane closes.",
      deployBodyRift: "Hold the collapse longer. Expect denser waves, later failure, and richer salvage.",
      deployBodyGauntlet: "No titan. No pause. Hold the corridor against nonstop elites and cash out the overkill lane.",
      showcaseLabel: "HUNTER PROFILE",
      showcaseRoleLabel: "COMBAT LOOP",
      showcaseWeaponLabel: "WEAPON SIGNATURE",
      showcaseRegionLabel: "ACTIVE REGION",
      showcaseRewardLabel: "PRIME PAYOUT",
      showcaseBackdropHunt: "Field route // loot and tempo spike",
      showcaseBackdropBoss: "Boss route // genes and titanforged drops",
      showcaseBackdropRift: "Rift route // data and Riftcut salvage",
      showcaseBackdropGauntlet: "Gauntlet route // score pressure and overclocked loot",
      cainShowcaseRole: "Frontline berserker with self-sustain and execute pressure.",
      cainShowcaseWeapon: "Cleaver-class overkill blade",
      dexShowcaseRole: "Ranged suppression loop with drones and overdrive rhythm.",
      dexShowcaseWeapon: "Pulse rig and drone lattice",
      riaShowcaseRole: "Curse propagation, burst detonation, and boss melt setup.",
      riaShowcaseWeapon: "Hex focus and ruin prism",
      seraShowcaseRole: "Blink chaining assassin with reset-heavy execution lines.",
      seraShowcaseWeapon: "Twin blink blades and void marks",
      startSequence: "Start Sequence",
      skipToBase: "Skip To Base",
      next: "Next",
      skip: "Skip",
      enterBase: "Enter Base",
      hunter: "HUNTER",
      mode: "MODE",
      region: "REGION",
      gold: "GOLD",
      cores: "CORES",
      data: "DATA",
      genes: "GENES",
      power: "Power",
      runs: "Runs",
      bestKills: "Best Kills",
      objective: "OBJECTIVE",
      launchTrack: "LAUNCH TRACK",
      operationMap: "OPERATION MAP",
      operationBriefing: "FIELD BRIEFING",
      operationTarget: "TARGET",
      operationThreat: "THREAT",
      operationCommand: "COMMAND",
      operationReward: "PAYOUT",
      operationMode: "RECOMMENDED LOOP",
      operationHunter: "RECOMMENDED HUNTER",
      operationDeploy: "DEPLOY RECOMMENDED LOADOUT",
      operationDeployBody: "Apply the suggested hunter and loop for this chapter, then drop straight into the lane.",
      operationNodeClears: "{count} CLEARS",
      operationNodeUncleared: "UNCLEARED",
      operationNodeActive: "ACTIVE",
      operationNodeLocked: "LOCKED",
      operationNodeCleared: "LIVE",
      operationNodeNew: "NEW",
      operationChapter: "CH.{index}",
      tabEquipment: "Equipment",
      tabRelics: "Relics",
      tabResearch: "Research",
      tabAscension: "Ascension",
      tabRecords: "Records",
      tabSeason: "Season",
      tabShop: "Shop",
      tabSettings: "Settings",
      runOver: "RUN OVER",
      kills: "Kills",
      level: "Level",
      boss: "Boss",
      retryNow: "Retry Now",
      backToBase: "Back To Base",
      settings: "SETTINGS",
      shopLabel: "STORE LOOP",
      shopTitle: "Prototype monetization board",
      shopBody: "These offers are mockups only. They frame how a live mobile build would pace pass upgrades, starter conversion, and cosmetic upsell.",
      shopSeasonPassTitle: "Crimson Eclipse pass upgrade",
      shopSeasonPassBody: "Premium track focused on season XP acceleration, exclusive cosmetics, and a cleaner reward rail.",
      shopStarterTitle: "Starter blood cache",
      shopStarterBody: "Low-friction first purchase with gear tempo, cores, and an early power spike that still leaves the loop intact.",
      shopWeeklyTitle: "Weekly field supply",
      shopWeeklyBody: "Retention pack for daily check-ins: steady cores, data, and one extra push into the weekly grind.",
      shopSkinTitle: "Skin vault bundle",
      shopSkinBody: "Pure presentation layer: hunter showcase frames, finisher variants, and kill-flash color swaps.",
      shopPremiumNoteTitle: "Prototype-only checkout",
      shopPremiumNoteBody: "No real payments are wired in. This tab exists to show where live-service pressure and visual merchandising would sit.",
      starterCacheLabel: "STARTER PACK",
      cosmeticVaultLabel: "COSMETICS",
      premiumNoteLabel: "PREMIUM NOTE",
      shopPreviewLabel: "COSMETIC PREVIEW",
      shopPreviewTitle: "Identity-first upsell lane",
      shopPreviewBody: "These mock cosmetic cards sit above the offer rail to show how presentation items would sell after the power loop is already hooked.",
      shopPreviewBodyHunter: "Current spotlight hunter: {hunter}. Cosmetic previews shift with the selected hunter so the store feels tied to identity, not generic inventory.",
      shopPreviewFinisher: "Crimson finisher flare",
      shopPreviewFrame: "Signal frame kit",
      shopPreviewTrail: "Rift trail burst",
      shopPreviewFinisherHunter: "{hunter} finisher flare",
      shopPreviewFrameHunter: "{hunter} signal frame",
      shopPreviewTrailHunter: "{hunter} rift trail",
      shopOfferPassMeta: "Premium pass // reward acceleration",
      shopOfferStarterMeta: "First conversion // early tempo spike",
      shopOfferWeeklyMeta: "Retention pack // daily loop support",
      shopOfferSkinMeta: "Cosmetic bundle // identity-only sale",
      shopPreviewSkinOn: "Preview skin active",
      shopPreviewSkinOff: "Preview skin inactive",
      shopToggleSkinPreview: "Toggle skin preview",
      shopPreviewActiveBody: "The current hunter showcase, deploy card, and ult cut-in are now tinted with the cosmetic preview theme.",
      shopPreviewInactiveBody: "Cosmetic preview is off. Re-enable it to re-skin the showcase and combat presentation panels.",
      shopSkinPreviewEnabled: "{hunter} cosmetic preview live.",
      shopSkinPreviewDisabled: "{hunter} cosmetic preview cleared.",
      showcasePreviewSkin: "PREVIEW SKIN",
      deployPreviewLabel: "COSMETIC PREVIEW // LIVE",
      ultimatePreviewLabel: "COSMETIC PREVIEW // CUT-IN",
      finishPreviewLabel: "COSMETIC PREVIEW // FINISHER",
      shopSpotlightLabel: "OFFER SPOTLIGHT",
      openShop: "Open shop",
      shopJumpPassBody: "Season XP is already moving. This is where a premium pass upsell would naturally attach to the reward loop.",
      shopJumpStarterBody: "Early progression is still forming. A starter bundle would sit here as the first-conversion offer.",
      shopJumpWeeklyBody: "You are already deep in repeat runs. A weekly supply pack would reinforce the retention loop here.",
      shopJumpSkinBody: "The power loop is established. This is the point where a cosmetic bundle can sell on identity, not stats.",
      viewOffer: "View offer",
      previewOnly: "Preview only",
      noCheckout: "No checkout wired. Offer previewed in prototype mode.",
      settingsFeedbackTitle: "Prototype feedback controls",
      settingsFeedbackBody:
        "Tune the mobile feel here. Sound drives short synth cues, and vibration lands on dash, level-up, boss spawn, and finish moments.",
      language: "LANGUAGE",
      languageTitle: "Interface language",
      languageBody: "Switch the shell UI between English and Korean instantly.",
      english: "English",
      korean: "한국어",
      objectiveFirstBloodTitle: "First blood",
      objectiveFirstBloodBody: "Enter Main Hunt and survive long enough to meet the titan.",
      objectivePushTitle: "Push the prototype",
      objectivePushBody: "Swap hunters, rotate Hunt, World Boss, Rift, and Gauntlet, then tune the strongest route.",
      intro1Eyebrow: "PROLOGUE // 01",
      intro1Title: "The world already lost.",
      intro1Body: "Cities fell first. Then armies. Then physics. The only thing left to do is kill bigger.",
      intro2Eyebrow: "PROLOGUE // 02",
      intro2Title: "Every titan is a fuel source.",
      intro2Body: "You do not save the world here. You break a god, strip the heart, and rebuild yourself in the aftermath.",
      intro3Eyebrow: "PROLOGUE // 03",
      intro3Title: "Start violent. End impossible.",
      intro3Body: "Your first ten seconds must already feel powerful. Everything after that is escalation.",
      resultVictory: "Titan erased",
      resultVictoryGauntlet: "Corridor locked",
      resultDefeat: "Run collapsed",
      bossStateDead: "Dead",
      bossStateAlive: "Alive",
      bossStateNotSpawned: "Not spawned",
      languageChanged: "Language switched.",
      deployWorldBoss: "Deploy To World Boss",
      audio: "AUDIO",
      soundEffects: "Sound effects",
      soundOn: "Sound On",
      soundOff: "Sound Off",
      soundBodyOn: "Short synth cues are active.",
      soundBodyOff: "All prototype sound cues are muted.",
      soundToggleBody: "Toggle level-up, boss, dash, and finisher tones.",
      haptics: "HAPTICS",
      vibration: "Vibration",
      vibrationOn: "Vibration On",
      vibrationOff: "Vibration Off",
      vibrationBodyOn: "Browser vibration is enabled where supported.",
      vibrationBodyOff: "No vibration pulses will be sent.",
      vibrationToggleBody: "Toggle dash, level-up, boss spawn, and finisher haptics.",
      saveControl: "SAVE CONTROL",
      resetPrototypeLoop: "Reset the prototype loop",
      resetPrototypeBody: "Wipe the current save, replay the intro, and re-test the first 30 minutes from zero.",
      resetProgress: "Reset Progress",
      equippedLabel: "EQUIPPED {slot}",
      empty: "Empty",
      noItemEquipped: "No item equipped.",
      setBonuses: "SET BONUSES",
      twoThreeSpikeTitle: "Two-piece and three-piece spikes",
      twoThreeSpikeBody: "Matched hunter drops now form real mini-sets. Hit two pieces for a combat passive, then cap at three for a hard spike.",
      noSetActive: "NO SET ACTIVE",
      mixAndMatchTitle: "Mix and match for now",
      mixAndMatchBody: "Equip at least two pieces from the same hunter set to wake up a set bonus.",
      backpack: "BACKPACK",
      lootInventory: "Loot inventory",
      lootInventoryBody: "Runs now drop real gear. Equip upgrades and break down the junk for cores.",
      equipped: "Equipped",
      equipSlot: "Equip {slot}",
      itemActiveNextRun: "This item is active for the next run.",
      swapInNextRun: "Swap it in for the next run.",
      salvageAction: "Salvage {amount}",
      powerVsEquipped: "{delta} power vs equipped",
      powerStandalone: "+{power} power",
      lockedCharacter: "Locked: {rule}.",
      lockedMode: "Locked: kill one titan in Main Hunt.",
      lockedRegion: "Locked: defeat one titan to enter Iron Sanctuary.",
      relicLoadout: "RELIC LOADOUT",
      relicTapBody: "Tap any unlocked relic to equip or unequip it. Two relics can be active at once.",
      slotLabel: "Slot {index}: {name}",
      unlocked: "Unlocked",
      researchLabel: "RESEARCH",
      maxed: "Maxed",
      prototypeCapReached: "Prototype cap reached.",
      researchFor: "Research for {data} DATA",
      hunterAwakening: "HUNTER AWAKENING",
      awakenedActive: "Awakened // active on future runs",
      costGenes: "Cost // {genes} GENES",
      awakened: "Awakened",
      awakenHunter: "Awaken {name}",
      awakenedBody: "This hunter now enters runs with a unique ascension boost.",
      selectedHunterBody: "Selected hunter bonus will apply on the next run.",
      unlockSwapBody: "Unlock now and swap hunters to use it.",
      ascensionCore: "ASCENSION CORE",
      spendGenesTitle: "Spend genes from World Boss kills",
      spendGenesBody: "Ascension nodes only use genes. This is the permanent bridge between your boss farm and every future run.",
      geneBankLabel: "GENE BANK // {genes}",
      ascensionLabel: "ASCENSION",
      ascendFor: "Ascend for {genes} GENES",
      titanLimitReached: "Titan limit reached.",
      setActiveLabel: "SET ACTIVE // {count}/3",
      twoPieceLive: "2-piece live // {body}",
      twoPiece: "2-piece // {body}",
      threePieceLive: "3-piece live // {body}",
      threePiece: "3-piece // {body}",
      anyHunter: "ANY HUNTER",
      syncCain: "CAIN SYNC",
      syncDex: "DEX SYNC",
      syncRia: "RIA SYNC",
      syncSera: "SERA SYNC",
      statDamage: "DMG",
      statHp: "HP",
      statAttackSpeed: "ASPD",
      statRange: "RANGE",
      statLifesteal: "LIFESTEAL",
      statExecute: "EXECUTE",
      statRage: "RAGE",
      statDash: "DASH",
      statReward: "REWARD",
      statXp: "XP",
      statBoss: "BOSS",
      statSync: "SYNC +12%",
      slotWeapon: "Weapon",
      slotArmor: "Armor",
      slotReactor: "Reactor",
      modeHuntName: "Main Hunt",
      modeHuntBody: "Build from weak mobs into a late titan showdown.",
      modeBossName: "World Boss",
      modeBossBody: "Start under pressure. Boss arrives almost immediately with fewer adds.",
      modeRiftName: "Abyss Rift",
      modeRiftBody: "Longer collapse run. Denser waves, later titan, richer loot and data.",
      modeGauntletName: "Gauntlet",
      modeGauntletBody: "No titan showdown. Survive an elite-heavy corridor and cash out overclocked drops.",
      modeBossUnlockRule: "Unlocked after the first titan kill",
      modeRiftUnlockRule: "Unlocked after the second titan kill",
      modeGauntletUnlockRule: "Unlocked after the third titan kill",
      regionRedcityName: "Red City",
      regionSanctuaryName: "Iron Sanctuary",
      regionBlacktideName: "Black Tide",
      regionRedcityBossName: "APOSTATE TITAN",
      regionSanctuaryBossName: "SANCTUARY ARCHON",
      regionBlacktideBossName: "ABYSS LEVIATHAN",
      regionRedcityBody: "Collapsing streets, bio-mass stains, and feral swarm pressure.",
      regionSanctuaryBody: "Cold steel corridors, signal noise, and machine cult constructs.",
      regionBlacktideBody: "Black tide flats, abyss bloom pools, and leviathan pressure from every angle.",
      regionStarter: "Starter region",
      regionAfterFirstTitan: "Unlocked after first titan kill",
      regionAfterSeasonBreak: "Unlocked after the first season breakpoint clear",
      starterHunter: "Starter hunter",
      afterFirstTitanHunter: "Unlock after the first titan kill",
      afterSecondTitanHunter: "Unlock after the second titan kill",
      afterThirdTitanHunter: "Unlock after the third titan kill",
      starterRelic: "Starter relic",
      relicAfterFirstTitan: "Unlocked after first titan kill",
      relicAfterSecondTitan: "Unlocked after second titan kill",
      relicAfterThirdTitan: "Unlocked after third titan kill",
      relicAfterFourthTitan: "Unlocked after fourth titan kill",
      relicAfterSeason1: "Unlocked after the first season breakpoint clear",
      relicAfterSeason2: "Unlocked after the second season breakpoint clear",
      relicAfterSeason3: "Unlocked after the third season breakpoint clear",
      cainCardBody: "Close-range blood engine. High sustain, high overkill.",
      dexCardBody: "Mid-range suppression. Faster loop, safer boss pressure.",
      riaCardBody: "Curse marks, burst chains, and boss-breaking ritual spikes.",
      seraCardBody: "Blink assassin. Fast resets, tighter arcs, brutal execution chains.",
      cainBaseBody: "Dive into the pack, rip them apart, and snowball rage into a titan kill.",
      dexBaseBody: "Flood the lane with pulse fire and drones, then pin the boss down from range.",
      riaBaseBody: "Brand the pack, trigger ruin blooms, and watch the lane collapse in chained detonations.",
      seraBaseBody: "Blink through the front line, harvest low targets, and keep the kill chain hot enough to outrun the boss.",
      cainStartLabel: "Enter Red City",
      dexStartLabel: "Deploy To Sanctuary",
      riaStartLabel: "Cast Into Sanctuary",
      seraStartLabel: "Drop Into Red City",
      cainResource: "RAGE",
      dexResource: "OVERDRIVE",
      riaResource: "ECHO",
      seraResource: "MOMENTUM",
      baseBossSummary: "{body} World Boss mode starts almost immediately in {region} and pays out harder.",
      baseRiftSummary: "{body} Abyss Rift keeps the collapse open longer in {region} and pays out richer salvage.",
      baseGauntletSummary: "{body} Gauntlet strips out the titan in {region} and replaces it with nonstop elite pressure and overclocked loot.",
      baseRegionSummary: "{body} Current region: {regionBody}",
      baseBossTitle: "{hunter} vs {boss}",
      baseRegionTitle: "{hunter} in {region}",
      deployRift: "Dive Into Abyss Rift",
      deployGauntlet: "Lock Into Gauntlet",
      ftueClaimed: "CLAIMED",
      ftueReady: "READY TO CACHE",
      ftueProgress: "PROGRESS // {progress}",
      ftueLatestCache: "LATEST CACHE // {items}",
      ftueLaunchTitle: "Launch cache",
      ftueLaunchBody: "Finish any run once so the base starts feeding you real prototype rewards.",
      ftueLaunchReward: "Rare Launch Coil + 90 gold + 5 cores + 10 data",
      ftueLaunchProgress: "{count}/1 run",
      ftueLaunchSummary: "Launch cache opened: {item} + 90 gold / 5 cores / 10 data",
      ftueResearchTitle: "Wire the lab",
      ftueResearchBody: "Buy the first research node so the account loop starts mattering.",
      ftueResearchReward: "Rare Operator Mesh + 80 gold + 12 data",
      ftueResearchProgress: "{count}/1 research node",
      ftueResearchSummary: "Research cache opened: {item} + 80 gold / 12 data",
      ftueArmoryTitle: "Armory online",
      ftueArmoryBody: "Bring back three non-starter drops so the loot game actually opens up.",
      ftueArmoryReward: "Epic hunter weapon + 12 cores",
      ftueArmoryProgress: "{count}/3 dropped items",
      ftueArmorySummary: "Armory cache opened: {item} + 12 cores",
      ftueTitanTitle: "Titan package",
      ftueTitanBody: "Kill the first titan to unlock the real second layer of the prototype.",
      ftueTitanReward: "Dex starter weapon + 8 genes + 140 gold",
      ftueTitanProgress: "{count}/1 titan kill",
      ftueTitanSummary: "Titan package delivered: {item} + 140 gold / 8 genes",
      ftueGenomeTitle: "Genome bank",
      ftueGenomeBody: "Clear World Boss once so genes become a real permanent power lane.",
      ftueGenomeReward: "Epic Genome Cell + 14 genes",
      ftueGenomeProgress: "{count}/1 world boss clear",
      ftueGenomeSummary: "Genome bank primed: {item} + 14 genes",
      ftueSeasonTitle: "Crimson breakpoint",
      ftueSeasonBody: "Hit the first season breakpoint to prove the live-service loop is awake.",
      ftueSeasonReward: "Legendary Crimson Archive + 160 gold + 18 data",
      ftueSeasonProgress: "{count}/1 season clear",
      ftueSeasonSummary: "Crimson breakpoint cache: {item} + 160 gold / 18 data",
      objectiveFarmRelicsTitle: "Farm relic unlocks",
      objectiveFarmRelicsBody: "Kill {count} more titans to open deeper relic combos and harder loops.",
      passTier1Title: "Starter Blood Cache",
      passTier1Body: "+120 gold // +8 cores",
      passTier2Title: "Research Surge",
      passTier2Body: "+26 data // Launch-track friendly",
      passTier3Title: "Titan Wage",
      passTier3Body: "+10 genes // +140 gold",
      passTier4Title: "Eclipse Armory",
      passTier4Body: "Epic season reactor drop",
      passTier5Title: "Crimson Finish",
      passTier5Body: "Legendary archive cache // +180 gold // +20 data",
      contractRunsTitle: "Field Test Loop",
      contractRunsBody: "Complete 3 total runs.",
      contractTitansTitle: "Titan Harvest",
      contractTitansBody: "Kill 2 titans in any mode.",
      contractSalvageTitle: "Scrap Refinery",
      contractSalvageBody: "Salvage 2 dropped items.",
      contractRiftTitle: "Rift Lockdown",
      contractRiftBody: "Seal 2 Abyss Rift runs.",
      contractGauntletTitle: "Gauntlet Lock",
      contractGauntletBody: "Clear 2 Gauntlet runs.",
      resultEquipNow: "Equip now",
      resultEquippedNextRun: "Equipped for next run",
      resultAlreadyActive: "This drop is already active.",
      resultSwapNow: "Swap it in without leaving the result screen.",
      seasonHuntKills: "SEASON HUNT // KILLS",
      seasonHuntWeakpoints: "SEASON HUNT // WEAKPOINTS",
      seasonReachKills: "Reach {kills} kills in one run to fill the blood moon quota.",
      seasonBreakWeakpoint: "Break at least one titan weakpoint in the same run.",
      seasonBreakpointCleared: "SEASON BREAKPOINT CLEARED",
      seasonBreakpointProgress: "SEASON BREAKPOINT IN PROGRESS",
      seasonNoNewPassTier: "No new pass tiers unlocked this run.",
      seasonPassGain: "SEASON PASS // +{xp} XP",
      seasonTotalXp: "{xp} total XP",
      seasonLabel: "SEASON // {name}",
      seasonLiveBonus: "Current live bonus preview: attack tempo +{bonus}% during active blood echo streaks",
      seasonPassLabel: "SEASON PASS",
      seasonPassBody: "Runs, levels, and boss clears feed the pass. Claimable tiers convert seasonal momentum into guaranteed base rewards.",
      seasonClaimableWaiting: "{count} claimable tier(s) waiting",
      seasonNoTierReady: "No tier ready yet",
      liveContractsLabel: "LIVE CONTRACTS",
      liveContractsReady: "{count} contract reward(s) ready",
      liveContractsShort: "Short-session objectives live",
      liveContractsBody: "Contracts are the quick loop. They pay out sooner than the pass and reward short mobile sessions.",
      seasonBreakpointTitle: "Hit the season breakpoint",
      seasonRelicsLabel: "SEASON RELICS",
      seasonBreakpointClears: "Breakpoint clears: {count}",
      seasonNextUnlock: "Next unlock: {title}. {description}",
      seasonAllRelicsUnlocked: "All season relics unlocked for this prototype slice.",
      seasonTrackComplete: "SEASON RELIC TRACK COMPLETE",
      worldBossResourceLabel: "WORLD BOSS RESOURCE",
      genomeBank: "Genome bank: {genes}",
      worldBossResourceBody: "Genes only drop in World Boss mode. This is the mode's exclusive progression lane, alongside Titanforged drops with stronger boss stats.",
      worldBossExclusive: "WORLD BOSS EXCLUSIVE // Genes + Titanforged gear",
      riftResourceLabel: "ABYSS RIFT LANE",
      riftBank: "Rift seals: {count}",
      riftResourceBody: "Abyss Rift is the long salvage lane. It pays richer drops, more data, and mode-specific forged gear.",
      riftExclusive: "ABYSS RIFT EXCLUSIVE // RIFTCUT gear + salvage spikes",
      gauntletResourceLabel: "GAUNTLET CIRCUIT",
      gauntletBank: "Gauntlet clears: {count}",
      gauntletResourceBody: "Gauntlet is the score lane. No titan spawns here, just escalating elites, faster pass gains, and overclocked gear drops.",
      gauntletExclusive: "GAUNTLET EXCLUSIVE // Overclocked gear + pass spikes",
      gauntletRecordLabel: "GAUNTLET RECORD",
      gauntletRecordTitle: "Best lockdown: {score}",
      gauntletRecordBody: "Best kill-count score saved on this device. Use it as the local leaderboard until real ranking exists.",
      gauntletRecordEmpty: "No Gauntlet record yet. Clear one run to seed the local board.",
      gauntletBoardLabel: "LOCAL TOP RUNS",
      gauntletBoardEntry: "#{rank} // {hunter} // {region} // {score}",
      recordsLabel: "RECORDS",
      recordsTitle: "Prototype performance board",
      recordsBody: "This is the local progression readout: total runs, clear counts, and the current Gauntlet board.",
      regionRecordsLabel: "REGION PEAKS",
      regionRecordBody: "{region} // {kills} kills // {mode} // {hunter}",
      regionRecordEmpty: "{region} // no record yet",
      recordHuntBest: "Main Hunt best kills",
      recordBossBest: "World Boss best time",
      recordRiftBest: "Abyss Rift best kills",
      recordWorldBossWins: "World Boss clears",
      recordRiftWins: "Rift clears",
      recordGauntletWins: "Gauntlet clears",
      recordGauntletBest: "Best Gauntlet score",
      recordNoClear: "No clear yet",
      recentRunsLabel: "RECENT RUNS",
      recentRunsEmpty: "No runs logged yet.",
      runStateVictory: "CLEAR",
      runStateDefeat: "FAIL",
      recentRunEntry: "#{rank} // {mode} // {state} // {kills}K // LV {level} // {time} // {region} // {hunter}",
      huntRecordLine: " Main Hunt best kills {count}.",
      bossRecordLine: " World Boss best time {time}.",
      riftRecordLine: " Abyss Rift best kills {count}.",
      newModeRecordLine: " New mode record.",
      howItPlaysLabel: "HOW IT PLAYS",
      howItPlaysTitle: "Kill fast, stay hot",
      howItPlaysBody: "Every kill refreshes the blood echo timer. While active, your auto-attack rhythm accelerates and payouts creep upward, so the best loop is constant aggression.",
      claimReady: "CLAIM READY",
      claimedUpper: "CLAIMED",
      unlocksAtXp: "UNLOCKS AT {xp} XP",
      progressXp: "Progress // {current}/{target} XP",
      claimReward: "Claim reward",
      lockedSimple: "Locked",
      alreadyBanked: "Already banked.",
      sendCacheNow: "Send this cache to the base now.",
      earnMoreSeasonXp: "Earn more season XP from runs and boss kills.",
      liveContractLabel: "LIVE CONTRACT // {state}",
      contractReady: "READY",
      inProgress: "In progress",
      claimContract: "Claim contract",
      opsRewardBanked: "This ops reward is already banked.",
      cashOutNow: "Cash out this short-session reward now.",
      keepLooping: "Keep looping runs, boss kills, and salvage to clear it.",
      contractGauntletTitle: "Gauntlet Lock",
      contractGauntletBody: "Clear 2 Gauntlet runs.",
      worldBossInbound: "WORLD BOSS INBOUND",
      breakBothWeakpoints: "BREAK BOTH WEAKPOINTS",
      exposedCore: "{boss} // EXPOSED CORE",
      titanDown: "TITAN DOWN",
      surviveUntilTitan: "SURVIVE {seconds}s UNTIL TITAN",
      holdTheGauntlet: "HOLD THE CORRIDOR // {seconds}s LEFT",
      shatterTitanArmor: "SHATTER THE TITAN ARMOR",
      bloodRushEndRun: "BLOOD RUSH // END THE RUN",
      gauntletBurn: "GAUNTLET BURN // HOLD THE SCORE",
      gauntletRunComplete: "GAUNTLET LOCKED DOWN",
      runCompleteText: "RUN COMPLETE",
      firstRunCacheLine: "First run cache: +120 gold / +6 cores / +10 data",
      firstTitanBountyLine: "First titan kill bounty: +220 gold / +10 cores / +24 data",
      worldBossPayoutLine: "World Boss payout boosted by 35%",
      riftPayoutLine: "Abyss Rift payout boosted by 22%",
      gauntletPayoutLine: "Gauntlet payout boosted by 18%",
      gauntletLiveLine: "Gauntlet clear banked: +1 lockdown",
      genomeSampleLine: "Genome sample secured: +{genes} genes",
      seasonBreakpointBonusLine: "Season breakpoint cleared: +90 gold / +16 data",
      seasonRelicUnlockedLine: "Season relic unlocked: {title}",
      seasonPassTierReadyLine: "Season pass tier ready: {titles}",
      resultRecoveredLine: "{gold} gold, {cores} cores, {data} data, {genes} genes recovered.",
      resultSeasonXpLine: " Season XP +{xp}.",
      resultNewRelicLine: " New relic unlocked: {title}.",
      resultNewSeasonRelicLine: " Season relic unlocked: {title}.",
      resultLootLine: " Loot: {items}.",
      gauntletNewRecordLine: " New Gauntlet record: {score}.",
      gauntletScoreLine: " Gauntlet score {score}.",
      resultModeLabel: "MODE",
      resultModeHuntTitle: "Main Hunt sweep",
      resultModeHuntBody: "Standard field payout. Build tempo and lane control decide the run.",
      resultModeBossTitle: "World Boss harvest",
      resultModeBossBody: "Gene payout and Titanforged drops spike here. This is the permanent power lane.",
      resultModeRiftTitle: "Abyss Rift collapse",
      resultModeRiftBody: "Long-form salvage lane. More drops, more data, and denser collapse pressure.",
      resultModeGauntletTitle: "Gauntlet lockdown",
      resultModeGauntletBody: "Pure survival lane. No titan, only escalating elites, overclocked drops, and higher pass momentum.",
      bossStateCleared: "Cleared",
      hudKills: "KILLS {count}",
      hudLevel: "LV {level}",
      hudDashReady: "DASH",
      hudDashCooldown: "DASH {time}",
      hudUltReady: "{name}",
      hudUltCooldown: "{name} {time}",
      ultimateEyebrow: "ULTIMATE // CUT-IN",
      hudWeakpoints: "WEAKPOINTS {count}",
      hudCoreExposed: "CORE EXPOSED",
      ultCain: "BLOODLUST",
      ultDex: "ZERO",
      ultRia: "GOSPEL",
      ultSera: "FINAL",
      ultCainEvent: "BLOODLUST ONLINE. CAIN CLEAVES THE WHOLE SCREEN.",
      ultDexEvent: "ZERO FACTORY ONLINE. DRONE OVERDRIVE ENGAGED.",
      ultRiaEvent: "BLACK GOSPEL ONLINE. CURSE DETONATIONS CHAIN WIDE.",
      ultSeraEvent: "FINAL FRAME ONLINE. EXECUTION WINDOW WIDENS.",
      floatTitanDown: "TITAN DOWN",
      lootSourceHunt: "FIELD DROP",
      lootSourceBoss: "TITANFORGED",
      lootSourceRift: "RIFTCUT",
      lootSourceGauntlet: "OVERCLOCKED",
      eventIntroCain: "MOVE WITH THE LEFT PAD. CAIN ATTACKS AUTOMATICALLY.",
      eventIntroDex: "MOVE WITH THE LEFT PAD. DEX SUPPRESSES TARGETS FROM RANGE.",
      eventIntroRia: "MOVE WITH THE LEFT PAD. RIA TAGS TARGETS WITH CURSE MARKS.",
      eventIntroSera: "MOVE WITH THE LEFT PAD. SERA BLINKS INTO CLOSE KILLS AND STAYS HOT.",
      eventLevelCain: "GOOD. PRIORITIZE CAIN SYNC MUTATIONS FOR RAGE, EXECUTE, AND LIFESTEAL.",
      eventLevelDex: "GOOD. PRIORITIZE DEX SYNC MODULES FOR RANGE, BURST, AND OVERDRIVE.",
      eventLevelRia: "GOOD. PRIORITIZE RIA SYNC INVOCATIONS FOR BURSTS, CHAINS, AND BOSS MELTS.",
      eventLevelSera: "GOOD. PRIORITIZE SERA SYNC PATTERNS FOR EXECUTE, DASH RESETS, AND CHAIN SPEED.",
      eventElite: "ELITE CONTACT. BURST IT DOWN FOR A BIGGER POWER SPIKE.",
      eventBossSanctuary: "ARCHON ONLINE. STAY MOBILE, DODGE THE VOLLEYS, THEN BREAK THE WEAKPOINTS.",
      eventBossWorld: "WORLD BOSS LIVE. BREAK BOTH WEAKPOINTS TO EXPOSE THE CORE.",
      eventBossRift: "RIFT TITAN ONLINE. HOLD THE COLLAPSE, BREAK THE SHELL, THEN SEAL THE CORE.",
      eventBossTitan: "TITAN DESCENDING. SHATTER THE ARMOR, THEN CUT THE CORE.",
      eventArchonVolley: "ARCHON VOLLEY LOCKING IN. DODGE SIDEWAYS.",
      eventArchonRing: "SIGNAL RINGS EXPANDING. DON'T DRIFT CENTER.",
      eventArchonImpact: "ARCHON IMPACT MARKED. BREAK LINE NOW.",
      eventTitanRing: "TITAN RING CHARGE. DASH THROUGH THE GAP.",
      eventTitanLeap: "TITAN LEAP MARKED. LEAVE THE IMPACT ZONE.",
      riftCollapseInbound: "RIFT COLLAPSE INBOUND",
      holdTheRift: "HOLD THE RIFT {seconds}",
      collapseRiftArmor: "COLLAPSE THE RIFT ARMOR",
      sealRiftCore: "SEAL THE RIFT CORE",
      riftSealed: "RIFT SEALED",
      eventAbyssVolley: "ABYSS VOLLEY LOCKED. CUT OUTSIDE THE FAN.",
      eventAbyssRing: "TIDE RINGS EXPANDING. DON'T SIT ON THE CENTER LINE.",
      eventAbyssMortar: "ABYSS MORTAR MARKED. CLEAR ALL THREE BLACK ZONES.",
      finishEyebrowSanctuaryBoss: "WORLD BOSS // SANCTUARY",
      finishEyebrowSanctuaryHunt: "IRON SANCTUARY // FINISHER",
      finishTitleSanctuaryBoss: "ARCHON DISMANTLED",
      finishTitleSanctuaryHunt: "SANCTUARY TITAN SHATTERED",
      finishSubtitleSanctuary: "{boss} // signal spine cracked // archive harvested",
      finishEyebrowBlacktideBoss: "WORLD BOSS // BLACK TIDE",
      finishEyebrowBlacktideHunt: "BLACK TIDE // FINISHER",
      finishTitleBlacktideBoss: "LEVIATHAN DROWNED",
      finishTitleBlacktideHunt: "ABYSS LEVIATHAN SHORN",
      finishSubtitleBlacktide: "{boss} // abyss spine severed // tide bank drained",
      finishEyebrowRedcityBoss: "WORLD BOSS // RED CITY",
      finishEyebrowRedcityHunt: "RED CITY // FINISHER",
      finishTitleRedcityBoss: "APOSTATE PURGED",
      finishTitleRedcityHunt: "APOSTATE TITAN SUNDERED",
      finishSubtitleRedcity: "{boss} // heart ripped free // bloodline advanced",
      resetConfirm: "Reset all prototype progress and restart the FTUE?",
      shellEnglish: "UI shell in English",
      shellKorean: "UI shell in Korean",
      hunterCainName: "Cain",
      hunterDexName: "Dex",
      hunterRiaName: "Ria",
      hunterSeraName: "Sera",
    },
    ko: {
      titleEyebrow: "모바일 데모 // 버티컬 슬라이스",
      titleSubtitle: "신을 죽이고, 심장을 수확하고, 더 강해져 돌아와라.",
      titleBody:
        "헌터 선택, 지역 선택, 보스 처치, 루트 드랍, 빌드 스파이크를 담은 하이퍼 액션 모바일 RPG 프로토타입.",
      deployEyebrow: "출격 시퀀스 // 라이브",
      chapterUnlockEyebrow: "챕터 해금",
      chapterUnlockSubtitle: "신규 작전 개방",
      chapterUnlockBody: "작전 지도에서 {region}이 개방됐다. 다음 타이탄이 변이하기 전에 새 전선을 밀어붙여라.",
      regionRedcityReward: "보상: 초반 장비 스파이크, 리버 세트 조각, 빠른 템포 확보.",
      regionRedcityThreat: "위협: 붕괴한 도로와 야생 군체 돌입.",
      regionRedcityCommand: "명령: 라인을 찢고 템포를 쌓은 뒤 타이탄 코어를 적출해라.",
      regionSanctuaryReward: "보상: 유전자 회수, 정밀 방어 장비, 시그널 계열 파밍.",
      regionSanctuaryThreat: "위협: 기계 교단 요새화와 신호 왜곡.",
      regionSanctuaryCommand: "명령: 아콘이 안정화되기 전에 외곽 전선을 부수고 발판을 확보해라.",
      regionBlacktideReward: "보상: 심연 세트, 균열 분해물, 고점 시즌 보상.",
      regionBlacktideThreat: "위협: 심연 개화 수역과 전 방향 레비아탄 압박.",
      regionBlacktideCommand: "명령: 계속 움직이며 조수 포위를 끊고, 평원이 잠기기 전에 척추를 잘라라.",
      deployBodyHunt: "라인을 밀어붙여 스파이크를 쌓고, 루트가 닫히기 전에 타이탄을 부숴라.",
      deployBodyBoss: "보스 압박이 즉시 들어온다. 약점을 빠르게 깨고 유전자를 회수해라.",
      deployBodyRift: "붕괴를 더 오래 버텨라. 웨이브는 더 빽빽하고 보상은 더 크다.",
      deployBodyGauntlet: "타이탄은 없다. 끊임없이 몰려오는 엘리트를 버티며 학살 회랑을 봉쇄해라.",
      showcaseLabel: "헌터 프로필",
      showcaseRoleLabel: "전투 루프",
      showcaseWeaponLabel: "핵심 무장",
      showcaseRegionLabel: "현재 지역",
      showcaseRewardLabel: "주요 보상",
      showcaseBackdropHunt: "현장 루트 // 드랍과 템포 스파이크",
      showcaseBackdropBoss: "보스 루트 // 유전자와 타이탄단조 드랍",
      showcaseBackdropRift: "균열 루트 // 데이터와 균열단조 분해 보상",
      showcaseBackdropGauntlet: "학살 회랑 // 점수 압박과 오버클럭 드랍",
      cainShowcaseRole: "전열을 박살내며 버티는 광전사. 흡혈과 처형 압박이 강하다.",
      cainShowcaseWeapon: "클리버 계열 오버킬 대형 무기",
      dexShowcaseRole: "드론과 오버드라이브 리듬으로 라인을 잠그는 원거리 제압형.",
      dexShowcaseWeapon: "펄스 병기 리그와 드론 격자",
      riaShowcaseRole: "저주 전이, 폭발 연쇄, 보스 용해 세팅에 특화된 의식형.",
      riaShowcaseWeapon: "헥스 포커스와 루인 프리즘",
      seraShowcaseRole: "점멸 연계와 리셋을 굴리는 고속 처형 암살자.",
      seraShowcaseWeapon: "쌍점멸 블레이드와 보이드 표식",
      startSequence: "시작 시퀀스",
      skipToBase: "바로 베이스",
      next: "다음",
      skip: "건너뛰기",
      enterBase: "베이스 진입",
      hunter: "헌터",
      mode: "모드",
      region: "지역",
      gold: "골드",
      cores: "코어",
      data: "데이터",
      genes: "유전자",
      power: "전투력",
      runs: "런 수",
      bestKills: "최고 처치",
      objective: "목표",
      launchTrack: "런치 트랙",
      operationMap: "작전 지도",
      operationBriefing: "지역 브리핑",
      operationTarget: "표적",
      operationThreat: "위협",
      operationCommand: "지시",
      operationReward: "보상",
      operationMode: "추천 모드",
      operationHunter: "추천 헌터",
      operationDeploy: "추천 출격 시작",
      operationDeployBody: "이 챕터에 맞는 추천 헌터와 모드를 적용한 뒤 바로 전장으로 투입된다.",
      operationNodeClears: "{count}회 클리어",
      operationNodeUncleared: "미클리어",
      operationNodeActive: "선택",
      operationNodeLocked: "잠금",
      operationNodeCleared: "활성",
      operationNodeNew: "신규",
      operationChapter: "{index}장",
      tabEquipment: "장비",
      tabRelics: "리릭",
      tabResearch: "연구",
      tabAscension: "각성",
      tabRecords: "기록",
      tabSeason: "시즌",
      tabShop: "상점",
      tabSettings: "설정",
      runOver: "런 종료",
      kills: "처치",
      level: "레벨",
      boss: "보스",
      retryNow: "즉시 재도전",
      backToBase: "베이스 복귀",
      settings: "설정",
      shopLabel: "상점 루프",
      shopTitle: "프로토타입 수익 구조 보드",
      shopBody: "이 탭의 상품은 전부 더미다. 시즌 패스 업그레이드, 첫 결제 전환, 코스메틱 판매를 어디에 둘지 보여주는 용도다.",
      shopSeasonPassTitle: "붉은 월식 패스 업그레이드",
      shopSeasonPassBody: "시즌 XP 가속, 전용 코스메틱, 더 촘촘한 보상선을 중심으로 설계한 프리미엄 트랙이다.",
      shopStarterTitle: "스타터 혈흔 캐시",
      shopStarterBody: "첫 결제를 가볍게 여는 저가 패키지. 장비 템포와 코어를 주되 게임 루프를 깨지 않는다.",
      shopWeeklyTitle: "주간 전장 보급",
      shopWeeklyBody: "매일 접속할수록 가치가 올라가는 유지형 상품. 코어, 데이터, 주간 파밍 여유를 묶어 준다.",
      shopSkinTitle: "스킨 볼트 번들",
      shopSkinBody: "전투력과 무관한 외형 상품. 헌터 쇼케이스 프레임, 피니시 연출, 킬 플래시 색을 바꾼다.",
      shopPremiumNoteTitle: "프로토타입 전용 결제 더미",
      shopPremiumNoteBody: "실제 결제는 연결되어 있지 않다. 라이브 서비스에서 어느 자리에 BM이 들어갈지만 보여준다.",
      starterCacheLabel: "스타터 팩",
      cosmeticVaultLabel: "코스메틱",
      premiumNoteLabel: "프리미엄 안내",
      shopPreviewLabel: "코스메틱 프리뷰",
      shopPreviewTitle: "정체성 판매 구간",
      shopPreviewBody: "이 프리뷰 카드는 전투력 루프가 잡힌 뒤에 어떤 외형 상품을 위에 노출할지 보여주는 더미다.",
      shopPreviewBodyHunter: "현재 기준 헌터는 {hunter}이다. 코스메틱 프리뷰도 선택한 헌터에 맞춰 바뀌어, 상점이 단순 인벤토리보다 정체성 판매 화면처럼 보이게 한다.",
      shopPreviewFinisher: "붉은 피니시 플레어",
      shopPreviewFrame: "시그널 프레임 키트",
      shopPreviewTrail: "균열 궤적 버스트",
      shopPreviewFinisherHunter: "{hunter} 전용 피니시 플레어",
      shopPreviewFrameHunter: "{hunter} 시그널 프레임",
      shopPreviewTrailHunter: "{hunter} 균열 궤적",
      shopOfferPassMeta: "프리미엄 패스 // 보상 가속",
      shopOfferStarterMeta: "첫 결제 전환 // 초반 템포 상승",
      shopOfferWeeklyMeta: "유지형 상품 // 일일 루프 보강",
      shopOfferSkinMeta: "코스메틱 번들 // 정체성 판매",
      shopPreviewSkinOn: "미리보기 스킨 활성",
      shopPreviewSkinOff: "미리보기 스킨 비활성",
      shopToggleSkinPreview: "스킨 미리보기 전환",
      shopPreviewActiveBody: "현재 헌터의 쇼케이스, 출격 카드, 궁극 컷인이 코스메틱 프리뷰 톤으로 바뀐다.",
      shopPreviewInactiveBody: "코스메틱 프리뷰가 꺼져 있다. 다시 켜면 쇼케이스와 전투 연출 패널이 함께 바뀐다.",
      shopSkinPreviewEnabled: "{hunter} 코스메틱 프리뷰 적용.",
      shopSkinPreviewDisabled: "{hunter} 코스메틱 프리뷰 해제.",
      showcasePreviewSkin: "미리보기 스킨",
      deployPreviewLabel: "코스메틱 프리뷰 // 출격",
      ultimatePreviewLabel: "코스메틱 프리뷰 // 컷인",
      finishPreviewLabel: "코스메틱 프리뷰 // 피니시",
      shopSpotlightLabel: "추천 상품",
      openShop: "상점 열기",
      shopJumpPassBody: "이미 시즌 XP가 돌고 있다. 실제 서비스라면 이 지점에 프리미엄 패스 업셀이 가장 자연스럽게 붙는다.",
      shopJumpStarterBody: "초반 성장선이 아직 만들어지는 구간이다. 첫 결제 전환용 스타터 팩은 여기에 놓는 게 맞다.",
      shopJumpWeeklyBody: "반복 플레이 구간에 들어왔다. 여기서는 주간 보급형 상품이 리텐션 루프를 가장 자연스럽게 받친다.",
      shopJumpSkinBody: "전투력 루프는 이미 잡혔다. 이제는 수치보다 정체성을 파는 코스메틱 번들이 어울린다.",
      viewOffer: "상품 보기",
      previewOnly: "프리뷰 전용",
      noCheckout: "실제 결제는 없다. 프로토타입용 상품 프리뷰만 표시한다.",
      settingsFeedbackTitle: "프로토타입 피드백 제어",
      settingsFeedbackBody:
        "모바일 손맛을 여기서 조정한다. 사운드는 짧은 신스 효과음으로, 진동은 대시, 레벨업, 보스 등장, 피니시 순간에 들어간다.",
      language: "언어",
      languageTitle: "인터페이스 언어",
      languageBody: "쉘 UI를 영어와 한국어 사이에서 즉시 전환한다.",
      english: "English",
      korean: "한국어",
      objectiveFirstBloodTitle: "첫 피",
      objectiveFirstBloodBody: "메인 사냥에 들어가 타이탄을 만날 때까지 버텨라.",
      objectivePushTitle: "프로토타입 밀어붙이기",
      objectivePushBody: "헌터를 바꾸고 메인 사냥, 월드 보스, 균열, 학살 회랑을 돌며 최적 루프를 찾자.",
      intro1Eyebrow: "프롤로그 // 01",
      intro1Title: "세계는 이미 졌다.",
      intro1Body: "먼저 도시가 무너졌고, 그다음 군대가 사라졌고, 마지막엔 물리 법칙이 찢어졌다. 남은 건 더 큰 걸 죽이는 일뿐이다.",
      intro2Eyebrow: "프롤로그 // 02",
      intro2Title: "모든 타이탄은 연료다.",
      intro2Body: "여기서 세상을 구하는 건 아니다. 신을 부수고, 심장을 뜯어내고, 그걸로 자신을 다시 만든다.",
      intro3Eyebrow: "프롤로그 // 03",
      intro3Title: "시작은 난폭하게. 끝은 불가능하게.",
      intro3Body: "첫 10초부터 이미 강해야 한다. 그 이후는 전부 과잉 성장이다.",
      resultVictory: "타이탄 말살",
      resultVictoryGauntlet: "회랑 봉쇄",
      resultDefeat: "런 붕괴",
      bossStateDead: "처치",
      bossStateAlive: "생존",
      bossStateNotSpawned: "미등장",
      languageChanged: "언어가 변경됐다.",
      deployWorldBoss: "월드 보스 투입",
      audio: "오디오",
      soundEffects: "사운드 효과",
      soundOn: "사운드 켜짐",
      soundOff: "사운드 꺼짐",
      soundBodyOn: "짧은 신스 사운드가 활성화되어 있다.",
      soundBodyOff: "프로토타입 사운드가 모두 꺼져 있다.",
      soundToggleBody: "레벨업, 보스, 대시, 피니시 사운드를 전환한다.",
      haptics: "진동",
      vibration: "진동",
      vibrationOn: "진동 켜짐",
      vibrationOff: "진동 꺼짐",
      vibrationBodyOn: "브라우저가 지원하면 진동이 활성화된다.",
      vibrationBodyOff: "진동 신호를 보내지 않는다.",
      vibrationToggleBody: "대시, 레벨업, 보스 등장, 피니시 진동을 전환한다.",
      saveControl: "저장 관리",
      resetPrototypeLoop: "프로토타입 초기화",
      resetPrototypeBody: "현재 저장을 지우고 인트로부터 첫 30분 루프를 다시 검증한다.",
      resetProgress: "진행 초기화",
      equippedLabel: "장착 중 {slot}",
      empty: "비어 있음",
      noItemEquipped: "장착한 아이템이 없다.",
      setBonuses: "세트 효과",
      twoThreeSpikeTitle: "2피스 / 3피스 폭증",
      twoThreeSpikeBody: "같은 헌터 계열 드랍이 미니 세트를 이룬다. 2피스에서 패시브가 열리고, 3피스에서 큰 스파이크가 온다.",
      noSetActive: "활성 세트 없음",
      mixAndMatchTitle: "지금은 혼합 세팅",
      mixAndMatchBody: "같은 헌터 세트 장비를 최소 2개 맞추면 세트 효과가 깨어난다.",
      backpack: "백팩",
      lootInventory: "드랍 인벤토리",
      lootInventoryBody: "이제 런마다 실제 장비가 떨어진다. 좋은 건 장착하고, 나머지는 분해해 코어로 바꿔라.",
      equipped: "장착됨",
      equipSlot: "{slot} 장착",
      itemActiveNextRun: "이 아이템은 다음 런부터 적용된다.",
      swapInNextRun: "다음 런을 위해 지금 교체한다.",
      salvageAction: "{amount} 분해",
      powerVsEquipped: "현재 장비 대비 {delta} 전투력",
      powerStandalone: "+{power} 전투력",
      lockedCharacter: "잠금: {rule}.",
      lockedMode: "잠금: 메인 사냥에서 타이탄 1회 처치 필요.",
      lockedRegion: "잠금: 타이탄을 처치해야 철신 성역 진입 가능.",
      relicLoadout: "리릭 로드아웃",
      relicTapBody: "해금된 리릭을 눌러 장착 또는 해제할 수 있다. 최대 2개까지 활성화된다.",
      slotLabel: "{index}번 슬롯: {name}",
      unlocked: "해금됨",
      researchLabel: "연구",
      maxed: "최대",
      prototypeCapReached: "프로토타입 한도 도달.",
      researchFor: "{data} 데이터로 연구",
      hunterAwakening: "헌터 각성",
      awakenedActive: "각성 완료 // 이후 런부터 활성",
      costGenes: "비용 // {genes} 유전자",
      awakened: "각성 완료",
      awakenHunter: "{name} 각성",
      awakenedBody: "이 헌터는 이후 런부터 고유 각성 보너스를 받고 시작한다.",
      selectedHunterBody: "선택된 헌터라 다음 런부터 즉시 적용된다.",
      unlockSwapBody: "지금 해금하고 헌터를 바꿔 적용할 수 있다.",
      ascensionCore: "각성 코어",
      spendGenesTitle: "월드 보스 유전자를 사용",
      spendGenesBody: "각성 노드는 유전자만 사용한다. 이게 보스 파밍과 이후 모든 런을 연결하는 영구 성장 축이다.",
      geneBankLabel: "유전자 은행 // {genes}",
      ascensionLabel: "각성",
      ascendFor: "{genes} 유전자로 각성",
      titanLimitReached: "타이탄 한도 도달.",
      setActiveLabel: "세트 활성 // {count}/3",
      twoPieceLive: "2피스 활성 // {body}",
      twoPiece: "2피스 // {body}",
      threePieceLive: "3피스 활성 // {body}",
      threePiece: "3피스 // {body}",
      anyHunter: "모든 헌터",
      syncCain: "카인 동기화",
      syncDex: "덱스 동기화",
      syncRia: "리아 동기화",
      syncSera: "세라 동기화",
      statDamage: "공격력",
      statHp: "체력",
      statAttackSpeed: "공속",
      statRange: "사거리",
      statLifesteal: "흡혈",
      statExecute: "처형",
      statRage: "분노",
      statDash: "대시",
      statReward: "보상",
      statXp: "경험치",
      statBoss: "보스",
      statSync: "동기화 +12%",
      slotWeapon: "무기",
      slotArmor: "방어구",
      slotReactor: "리액터",
      modeHuntName: "메인 사냥",
      modeHuntBody: "약한 몹을 뚫고 후반 타이탄 결전까지 이어진다.",
      modeBossName: "월드 보스",
      modeBossBody: "처음부터 압박 상태로 시작한다. 잡몹은 적고 보스가 거의 즉시 등장한다.",
      modeRiftName: "심연 균열",
      modeRiftBody: "더 길게 버티는 붕괴 런. 웨이브는 더 빽빽하고 드랍과 데이터가 더 크다.",
      modeGauntletName: "학살 회랑",
      modeGauntletBody: "타이탄 없이 엘리트 압박만 이어진다. 버티고 오버클럭 드랍을 회수하라.",
      modeBossUnlockRule: "첫 타이탄 처치 후 해금",
      modeRiftUnlockRule: "두 번째 타이탄 처치 후 해금",
      modeGauntletUnlockRule: "세 번째 타이탄 처치 후 해금",
      regionRedcityName: "붉은 폐도",
      regionSanctuaryName: "철신 성역",
      regionBlacktideName: "검은 조수",
      regionRedcityBossName: "배교 타이탄",
      regionSanctuaryBossName: "성역 아콘",
      regionBlacktideBossName: "심연 레비아탄",
      regionRedcityBody: "붕괴한 도로, 생체 오염 얼룩, 야생 군체 압박.",
      regionSanctuaryBody: "차가운 금속 회랑, 신호 잡음, 기계 교단 구조체.",
      regionBlacktideBody: "검은 조수 평원, 심연 개화 수역, 전 방향에서 덮쳐오는 레비아탄 압박.",
      regionStarter: "시작 지역",
      regionAfterFirstTitan: "첫 타이탄 처치 후 해금",
      regionAfterSeasonBreak: "첫 시즌 브레이크포인트 클리어 후 해금",
      starterHunter: "시작 헌터",
      afterFirstTitanHunter: "첫 타이탄 처치 후 해금",
      afterSecondTitanHunter: "두 번째 타이탄 처치 후 해금",
      afterThirdTitanHunter: "세 번째 타이탄 처치 후 해금",
      starterRelic: "시작 리릭",
      relicAfterFirstTitan: "첫 타이탄 처치 후 해금",
      relicAfterSecondTitan: "두 번째 타이탄 처치 후 해금",
      relicAfterThirdTitan: "세 번째 타이탄 처치 후 해금",
      relicAfterFourthTitan: "네 번째 타이탄 처치 후 해금",
      relicAfterSeason1: "첫 시즌 브레이크포인트 클리어 후 해금",
      relicAfterSeason2: "두 번째 시즌 브레이크포인트 클리어 후 해금",
      relicAfterSeason3: "세 번째 시즌 브레이크포인트 클리어 후 해금",
      cainCardBody: "근접 혈광 엔진. 높은 유지력과 높은 오버킬.",
      dexCardBody: "중거리 제압형. 더 빠른 루프와 안정적인 보스 압박.",
      riaCardBody: "저주 표식, 연쇄 폭발, 보스 파괴 의식 스파이크.",
      seraCardBody: "점멸 암살자. 빠른 리셋, 좁은 궤적, 잔혹한 처형 연계.",
      cainBaseBody: "몹 무리에 파고들어 갈기갈기 찢고, 분노를 굴려 타이탄 처치까지 이어간다.",
      dexBaseBody: "펄스 사격과 드론으로 라인을 덮고, 원거리에서 보스를 고정 압박한다.",
      riaBaseBody: "무리에 표식을 새기고 파멸 개화를 터뜨려 연쇄 폭발로 라인을 붕괴시킨다.",
      seraBaseBody: "전열을 점멸로 관통하고 빈사 대상을 수확해 보스를 따돌릴 만큼 킬 체인을 유지한다.",
      cainStartLabel: "붉은 폐도 진입",
      dexStartLabel: "성역 투입",
      riaStartLabel: "성역 의식 개시",
      seraStartLabel: "붉은 폐도 강하",
      cainResource: "분노",
      dexResource: "오버드라이브",
      riaResource: "메아리",
      seraResource: "모멘텀",
      baseBossSummary: "{body} 월드 보스 모드는 {region}에서 거의 즉시 시작되고 보상도 더 세다.",
      baseRiftSummary: "{body} 심연 균열은 {region}의 붕괴를 더 오래 열어두고 더 좋은 분해 보상을 준다.",
      baseGauntletSummary: "{body} 학살 회랑은 {region}의 타이탄을 빼고 끊임없는 엘리트 압박과 오버클럭 드랍으로 바꿔버린다.",
      baseRegionSummary: "{body} 현재 지역: {regionBody}",
      baseBossTitle: "{hunter} vs {boss}",
      baseRegionTitle: "{hunter} // {region}",
      deployRift: "심연 균열 진입",
      deployGauntlet: "학살 회랑 진입",
      ftueClaimed: "수령 완료",
      ftueReady: "캐시 수령 가능",
      ftueProgress: "진행도 // {progress}",
      ftueLatestCache: "최신 캐시 // {items}",
      ftueLaunchTitle: "런치 캐시",
      ftueLaunchBody: "아무 런이나 한 번 끝내서 베이스가 실제 프로토타입 보상을 공급하게 만들어라.",
      ftueLaunchReward: "희귀 런치 코일 + 90 골드 + 5 코어 + 10 데이터",
      ftueLaunchProgress: "{count}/1 런",
      ftueLaunchSummary: "런치 캐시 개방: {item} + 90 골드 / 5 코어 / 10 데이터",
      ftueResearchTitle: "연구실 가동",
      ftueResearchBody: "첫 연구 노드를 구매해 계정 루프가 의미를 갖게 만들어라.",
      ftueResearchReward: "희귀 오퍼레이터 메쉬 + 80 골드 + 12 데이터",
      ftueResearchProgress: "{count}/1 연구 노드",
      ftueResearchSummary: "연구 캐시 개방: {item} + 80 골드 / 12 데이터",
      ftueArmoryTitle: "무기고 온라인",
      ftueArmoryBody: "시작 장비가 아닌 드랍 3개를 들고 와서 진짜 루트 파밍을 열어라.",
      ftueArmoryReward: "영웅 헌터 무기 + 12 코어",
      ftueArmoryProgress: "{count}/3 드랍 장비",
      ftueArmorySummary: "무기고 캐시 개방: {item} + 12 코어",
      ftueTitanTitle: "타이탄 패키지",
      ftueTitanBody: "첫 타이탄을 처치해 프로토타입의 진짜 두 번째 층을 해금해라.",
      ftueTitanReward: "덱스 시작 무기 + 8 유전자 + 140 골드",
      ftueTitanProgress: "{count}/1 타이탄 처치",
      ftueTitanSummary: "타이탄 패키지 지급: {item} + 140 골드 / 8 유전자",
      ftueGenomeTitle: "유전자 은행",
      ftueGenomeBody: "월드 보스를 한 번 클리어해 유전자가 진짜 영구 성장 축이 되게 만들어라.",
      ftueGenomeReward: "영웅 유전자 셀 + 14 유전자",
      ftueGenomeProgress: "{count}/1 월드 보스 클리어",
      ftueGenomeSummary: "유전자 은행 가동: {item} + 14 유전자",
      ftueSeasonTitle: "크림슨 브레이크포인트",
      ftueSeasonBody: "첫 시즌 브레이크포인트를 달성해 라이브 서비스 루프가 살아 있음을 증명해라.",
      ftueSeasonReward: "전설 크림슨 아카이브 + 160 골드 + 18 데이터",
      ftueSeasonProgress: "{count}/1 시즌 클리어",
      ftueSeasonSummary: "크림슨 브레이크포인트 캐시: {item} + 160 골드 / 18 데이터",
      objectiveFarmRelicsTitle: "리릭 해금 파밍",
      objectiveFarmRelicsBody: "타이탄을 {count}마리 더 잡아 더 깊은 리릭 조합과 상위 루프를 열어라.",
      passTier1Title: "스타터 블러드 캐시",
      passTier1Body: "+120 골드 // +8 코어",
      passTier2Title: "연구 가속",
      passTier2Body: "+26 데이터 // 런치 트랙 보조",
      passTier3Title: "타이탄 임금",
      passTier3Body: "+10 유전자 // +140 골드",
      passTier4Title: "이클립스 병기고",
      passTier4Body: "영웅 시즌 리액터 드랍",
      passTier5Title: "크림슨 피니시",
      passTier5Body: "전설 아카이브 캐시 // +180 골드 // +20 데이터",
      contractRunsTitle: "필드 테스트 루프",
      contractRunsBody: "총 3회 런을 완료하라.",
      contractTitansTitle: "타이탄 수확",
      contractTitansBody: "아무 모드에서나 타이탄 2마리를 처치하라.",
      contractSalvageTitle: "스크랩 정제소",
      contractSalvageBody: "드랍 아이템 2개를 분해하라.",
      contractRiftTitle: "균열 봉쇄",
      contractRiftBody: "심연 균열 런을 2회 봉인하라.",
      contractGauntletTitle: "회랑 봉쇄",
      contractGauntletBody: "학살 회랑 런을 2회 클리어하라.",
      resultEquipNow: "지금 장착",
      resultEquippedNextRun: "다음 런 장착 완료",
      resultAlreadyActive: "이 드랍은 이미 활성 상태다.",
      resultSwapNow: "결과 화면을 벗어나지 않고 바로 교체한다.",
      seasonHuntKills: "시즌 사냥 // 처치",
      seasonHuntWeakpoints: "시즌 사냥 // 약점",
      seasonReachKills: "한 런에서 {kills}킬을 달성해 블러드문 할당량을 채워라.",
      seasonBreakWeakpoint: "같은 런에서 타이탄 약점을 최소 1개 파괴해라.",
      seasonBreakpointCleared: "시즌 브레이크포인트 달성",
      seasonBreakpointProgress: "시즌 브레이크포인트 진행 중",
      seasonNoNewPassTier: "이번 런에서 새 패스 티어는 열리지 않았다.",
      seasonPassGain: "시즌 패스 // +{xp} XP",
      seasonTotalXp: "총 {xp} XP",
      seasonLabel: "시즌 // {name}",
      seasonLiveBonus: "현재 라이브 보너스 미리보기: 블러드 에코 유지 중 공격 템포 +{bonus}%",
      seasonPassLabel: "시즌 패스",
      seasonPassBody: "런, 레벨, 보스 처치가 패스를 채운다. 클레임 가능한 티어는 시즌 흐름을 확정 베이스 보상으로 바꾼다.",
      seasonClaimableWaiting: "클레임 가능한 티어 {count}개 대기 중",
      seasonNoTierReady: "지금 바로 받을 티어가 없다",
      liveContractsLabel: "라이브 계약",
      liveContractsReady: "계약 보상 {count}개 준비 완료",
      liveContractsShort: "짧은 세션 목표 활성",
      liveContractsBody: "계약은 짧은 루프용 보상선이다. 패스보다 빨리 지급되고 모바일 짧은 세션에 맞춘다.",
      seasonBreakpointTitle: "시즌 브레이크포인트 달성",
      seasonRelicsLabel: "시즌 리릭",
      seasonBreakpointClears: "브레이크포인트 클리어: {count}회",
      seasonNextUnlock: "다음 해금: {title}. {description}",
      seasonAllRelicsUnlocked: "이 프로토타입 구간의 시즌 리릭을 모두 해금했다.",
      seasonTrackComplete: "시즌 리릭 트랙 완료",
      worldBossResourceLabel: "월드 보스 전용 자원",
      genomeBank: "유전자 은행: {genes}",
      worldBossResourceBody: "유전자는 월드 보스 모드에서만 떨어진다. 타이탄포지드 장비와 함께 이 모드 전용 성장 축을 이룬다.",
      worldBossExclusive: "월드 보스 전용 // 유전자 + 타이탄포지드 장비",
      riftResourceLabel: "심연 균열 라인",
      riftBank: "균열 봉인 수: {count}",
      riftResourceBody: "심연 균열은 장기 분해 파밍 라인이다. 더 좋은 드랍, 더 많은 데이터, 전용 단조 장비를 준다.",
      riftExclusive: "심연 균열 전용 // 균열단조 장비 + 분해 스파이크",
      gauntletResourceLabel: "학살 회랑 회선",
      gauntletBank: "학살 회랑 클리어: {count}",
      gauntletResourceBody: "학살 회랑은 점수형 생존 라인이다. 타이탄은 나오지 않고, 엘리트 압박과 패스 효율, 오버클럭 장비만 남는다.",
      gauntletExclusive: "학살 회랑 전용 // 오버클럭 장비 + 패스 가속",
      gauntletRecordLabel: "학살 회랑 기록",
      gauntletRecordTitle: "최고 봉쇄 점수: {score}",
      gauntletRecordBody: "이 기기에 저장된 최고 처치 점수다. 실제 리더보드 전까지는 로컬 기록판으로 쓴다.",
      gauntletRecordEmpty: "아직 학살 회랑 기록이 없다. 한 번 클리어해서 로컬 기록판을 열어라.",
      gauntletBoardLabel: "로컬 상위 런",
      gauntletBoardEntry: "#{rank} // {hunter} // {region} // {score}",
      recordsLabel: "기록",
      recordsTitle: "프로토타입 성과 보드",
      recordsBody: "총 런 수, 모드별 클리어 수, 현재 학살 회랑 기록판을 모아 보여준다.",
      regionRecordsLabel: "지역별 최고 기록",
      regionRecordBody: "{region} // {kills}처치 // {mode} // {hunter}",
      regionRecordEmpty: "{region} // 아직 기록 없음",
      recordHuntBest: "메인 사냥 최고 처치",
      recordBossBest: "월드 보스 최고 시간",
      recordRiftBest: "심연 균열 최고 처치",
      recordWorldBossWins: "월드 보스 클리어",
      recordRiftWins: "균열 클리어",
      recordGauntletWins: "학살 회랑 클리어",
      recordGauntletBest: "최고 학살 회랑 점수",
      recordNoClear: "아직 기록 없음",
      recentRunsLabel: "최근 런",
      recentRunsEmpty: "아직 기록된 런이 없다.",
      runStateVictory: "클리어",
      runStateDefeat: "실패",
      recentRunEntry: "#{rank} // {mode} // {state} // {kills}처치 // LV {level} // {time} // {region} // {hunter}",
      huntRecordLine: " 메인 사냥 최고 처치 {count}.",
      bossRecordLine: " 월드 보스 최고 시간 {time}.",
      riftRecordLine: " 심연 균열 최고 처치 {count}.",
      newModeRecordLine: " 모드 신기록 갱신.",
      howItPlaysLabel: "플레이 방식",
      howItPlaysTitle: "빠르게 죽이고, 열기를 유지하라",
      howItPlaysBody: "적을 죽일 때마다 블러드 에코 타이머가 갱신된다. 활성 중에는 자동 공격 리듬이 빨라지고 보상도 조금씩 올라가므로 최적 루프는 끊임없는 공격이다.",
      claimReady: "보상 수령 가능",
      claimedUpper: "수령 완료",
      unlocksAtXp: "XP {xp}에서 해금",
      progressXp: "진행도 // {current}/{target} XP",
      claimReward: "보상 받기",
      lockedSimple: "잠금",
      alreadyBanked: "이미 저장된 보상이다.",
      sendCacheNow: "이 캐시를 지금 베이스로 보낸다.",
      earnMoreSeasonXp: "런과 보스 처치로 시즌 XP를 더 모아라.",
      liveContractLabel: "라이브 계약 // {state}",
      contractReady: "준비 완료",
      inProgress: "진행 중",
      claimContract: "계약 보상 받기",
      opsRewardBanked: "이 작전 보상은 이미 저장됐다.",
      cashOutNow: "이 짧은 세션 보상을 지금 회수한다.",
      keepLooping: "런, 보스 킬, 분해를 계속 돌려서 목표를 채워라.",
      worldBossInbound: "월드 보스 접근 중",
      breakBothWeakpoints: "양쪽 약점을 모두 파괴",
      exposedCore: "{boss} // 코어 노출",
      titanDown: "타이탄 격파",
      surviveUntilTitan: "타이탄까지 {seconds}초 생존",
      holdTheGauntlet: "회랑 유지 // {seconds}초 남음",
      shatterTitanArmor: "타이탄 장갑을 파쇄하라",
      bloodRushEndRun: "블러드 러시 // 런 마무리",
      gauntletBurn: "학살 회랑 // 점수를 지켜라",
      gauntletRunComplete: "학살 회랑 봉쇄 완료",
      runCompleteText: "런 완료",
      firstRunCacheLine: "첫 런 캐시: +120 골드 / +6 코어 / +10 데이터",
      firstTitanBountyLine: "첫 타이탄 처치 보상: +220 골드 / +10 코어 / +24 데이터",
      worldBossPayoutLine: "월드 보스 보상 35% 증폭",
      riftPayoutLine: "심연 균열 보상 22% 증폭",
      gauntletPayoutLine: "학살 회랑 보상 18% 증폭",
      gauntletLiveLine: "학살 회랑 클리어 적립: +1 봉쇄",
      genomeSampleLine: "유전자 샘플 확보: +{genes} 유전자",
      seasonBreakpointBonusLine: "시즌 브레이크포인트 보상: +90 골드 / +16 데이터",
      seasonRelicUnlockedLine: "시즌 리릭 해금: {title}",
      seasonPassTierReadyLine: "시즌 패스 준비 완료: {titles}",
      resultRecoveredLine: "{gold} 골드, {cores} 코어, {data} 데이터, {genes} 유전자 회수.",
      resultSeasonXpLine: " 시즌 XP +{xp}.",
      resultNewRelicLine: " 신규 리릭 해금: {title}.",
      resultNewSeasonRelicLine: " 시즌 리릭 해금: {title}.",
      resultLootLine: " 드랍: {items}.",
      gauntletNewRecordLine: " 학살 회랑 신기록: {score}.",
      gauntletScoreLine: " 학살 회랑 점수 {score}.",
      resultModeLabel: "모드",
      resultModeHuntTitle: "메인 사냥 정리",
      resultModeHuntBody: "기본 현장 보상 루프다. 빌드 템포와 라인 제어가 성패를 가른다.",
      resultModeBossTitle: "월드 보스 수확",
      resultModeBossBody: "유전자와 타이탄단조 드랍이 여기서 크게 튄다. 영구 성장의 핵심 라인이다.",
      resultModeRiftTitle: "심연 균열 붕괴",
      resultModeRiftBody: "장기 분해 파밍 라인이다. 드랍과 데이터가 더 크고 압박도 더 빽빽하다.",
      resultModeGauntletTitle: "학살 회랑 봉쇄",
      resultModeGauntletBody: "순수 생존 라인이다. 타이탄 없이 엘리트 압박, 오버클럭 드랍, 높은 패스 효율만 남는다.",
      bossStateCleared: "클리어",
      hudKills: "처치 {count}",
      hudLevel: "레벨 {level}",
      hudDashReady: "대시",
      hudDashCooldown: "대시 {time}",
      hudUltReady: "{name}",
      hudUltCooldown: "{name} {time}",
      ultimateEyebrow: "궁극기 // 컷인",
      hudWeakpoints: "약점 {count}",
      hudCoreExposed: "코어 노출",
      ultCain: "광란",
      ultDex: "제로",
      ultRia: "복음",
      ultSera: "종결",
      ultCainEvent: "광란 발동. 카인이 화면째 찢어버린다.",
      ultDexEvent: "제로 팩토리 발동. 드론 과부하 진입.",
      ultRiaEvent: "블랙 가스펠 발동. 저주 폭발이 넓게 연쇄된다.",
      ultSeraEvent: "파이널 프레임 발동. 처형 창이 크게 열린다.",
      floatTitanDown: "타이탄 격파",
      lootSourceHunt: "현장 드랍",
      lootSourceBoss: "타이탄단조",
      lootSourceRift: "균열단조",
      lootSourceGauntlet: "오버클럭",
      eventIntroCain: "왼쪽 패드로 이동한다. 카인은 자동으로 공격한다.",
      eventIntroDex: "왼쪽 패드로 이동한다. 덱스는 원거리에서 적을 제압한다.",
      eventIntroRia: "왼쪽 패드로 이동한다. 리아는 적에게 저주 표식을 남긴다.",
      eventIntroSera: "왼쪽 패드로 이동한다. 세라는 점멸로 마무리 킬을 잇고 열기를 유지한다.",
      eventLevelCain: "좋다. 카인은 분노, 처형, 흡혈 계열 변이를 우선하라.",
      eventLevelDex: "좋다. 덱스는 사거리, 버스트, 오버드라이브 모듈을 우선하라.",
      eventLevelRia: "좋다. 리아는 폭발, 연쇄, 보스 녹이기 계열 의식을 우선하라.",
      eventLevelSera: "좋다. 세라는 처형, 대시 리셋, 연쇄 속도 패턴을 우선하라.",
      eventElite: "엘리트 접촉. 빠르게 터뜨려 더 큰 파워 스파이크를 가져가라.",
      eventBossSanctuary: "아콘 가동. 계속 움직이며 탄막을 피하고 약점을 먼저 부숴라.",
      eventBossWorld: "월드 보스 활성. 양쪽 약점을 부숴 코어를 노출시켜라.",
      eventBossRift: "균열 타이탄 활성. 붕괴를 버티고 껍질을 부숴 코어를 봉인해라.",
      eventBossTitan: "타이탄 강하. 장갑을 깨고 코어를 베어라.",
      eventArchonVolley: "아콘 일제사격 조준 중. 옆으로 빠져라.",
      eventArchonRing: "신호 고리 확장 중. 중앙선에 오래 머물지 마라.",
      eventArchonImpact: "아콘 충돌 지점 고정. 전열에서 벗어나라.",
      eventTitanRing: "타이탄 고리 충전 중. 빈틈을 대시로 뚫어라.",
      eventTitanLeap: "타이탄 도약 표식. 착지 지점에서 벗어나라.",
      riftCollapseInbound: "균열 붕괴 접근",
      holdTheRift: "균열 유지 {seconds}",
      collapseRiftArmor: "균열 장갑 붕괴",
      sealRiftCore: "균열 코어 봉인",
      riftSealed: "균열 봉인 완료",
      eventAbyssVolley: "심연 일제사격 잠금. 부채꼴 바깥으로 빠져라.",
      eventAbyssRing: "조수 고리 확장 중. 안쪽 중심선에 오래 머물지 마라.",
      eventAbyssMortar: "심연 박격포 표식. 검은 원 3개를 모두 벗어나라.",
      finishEyebrowSanctuaryBoss: "월드 보스 // 철신 성역",
      finishEyebrowSanctuaryHunt: "철신 성역 // 피니시",
      finishTitleSanctuaryBoss: "성역 아콘 해체",
      finishTitleSanctuaryHunt: "성역 타이탄 분쇄",
      finishSubtitleSanctuary: "{boss} // 신호 척추 파손 // 기록 코어 회수",
      finishEyebrowBlacktideBoss: "월드 보스 // 검은 조수",
      finishEyebrowBlacktideHunt: "검은 조수 // 피니시",
      finishTitleBlacktideBoss: "레비아탄 수장",
      finishTitleBlacktideHunt: "심연 레비아탄 절단",
      finishSubtitleBlacktide: "{boss} // 심연 척추 절단 // 조수 저장고 고갈",
      finishEyebrowRedcityBoss: "월드 보스 // 붉은 폐도",
      finishEyebrowRedcityHunt: "붉은 폐도 // 피니시",
      finishTitleRedcityBoss: "배교체 정화",
      finishTitleRedcityHunt: "배교 타이탄 절개",
      finishSubtitleRedcity: "{boss} // 심장 적출 완료 // 혈계 강화",
      resetConfirm: "프로토타입 진행을 전부 초기화하고 FTUE부터 다시 시작할까?",
      shellEnglish: "UI를 영어로 표시",
      shellKorean: "UI를 한국어로 표시",
      hunterCainName: "카인",
      hunterDexName: "덱스",
      hunterRiaName: "리아",
      hunterSeraName: "세라",
    },
  };

  function lang() {
    return meta?.settings?.language === "ko" ? "ko" : "en";
  }

  function t(key) {
    return i18n[lang()][key] ?? i18n.en[key] ?? key;
  }

  function fmt(key, vars = {}) {
    return t(key).replace(/\{(\w+)\}/g, (_match, token) => String(vars[token] ?? ""));
  }

  function lt(value) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      if ("ko" in value || "en" in value) {
        return value[lang()] ?? value.en ?? value.ko ?? "";
      }
    }
    return value ?? "";
  }

  function localizeItemName(name) {
    if (lang() !== "ko") return name;
    if (!name) return "";

    const prefixMap = {
      COMMON: "일반",
      RARE: "희귀",
      EPIC: "영웅",
      LEGEND: "전설",
      Titanforged: "타이탄단조",
      Leviathanforged: "레비아탄단조",
      Collapseforged: "붕괴단조",
      Fracturecast: "균열주조",
      Undertow: "언더토우",
      Tideworn: "조수깃든",
    };

    const baseMap = {
      Cleaver: "클리버",
      Ripper: "리퍼",
      "Pulse Lance": "펄스 랜스",
      "Burst Carbine": "버스트 카빈",
      "Hex Lantern": "헥스 랜턴",
      "Ruin Censer": "루인 센서",
      "Twin Scythes": "트윈 사이드",
      "Phantom Blade": "팬텀 블레이드",
      "Tideglass Spear": "타이드글라스 스피어",
      "Red Plate": "레드 플레이트",
      "Bone Weave": "본 위브",
      "Titan Hide": "타이탄 하이드",
      "Signal Mesh": "시그널 메쉬",
      "Veil Mantle": "베일 맨틀",
      "Choir Wrap": "콰이어 랩",
      "Night Weave": "나이트 위브",
      "Ghost Mesh": "고스트 메쉬",
      "Abyss Shell": "어비스 셸",
      "Rage Reactor": "레이지 리액터",
      "Overdrive Cell": "오버드라이브 셀",
      "Kill Coil": "킬 코일",
      "Target Uplink": "타깃 업링크",
      "Echo Core": "에코 코어",
      "Ruin Prism": "루인 프리즘",
      "Reaper Relay": "리퍼 릴레이",
      "Void Mark": "보이드 마크",
      "Current Heart": "커런트 하트",
      "Riot Cleaver": "라이엇 클리버",
      "Hex Needle": "헥스 니들",
      "Blink Edge": "블링크 엣지",
      "Launch Coil": "런치 코일",
      "Operator Mesh": "오퍼레이터 메쉬",
      "Factory Pulse Lance": "팩토리 펄스 랜스",
      "Genome Cell": "유전체 셀",
      "Crimson Archive": "크림슨 아카이브",
      "Eclipse Relay": "이클립스 릴레이",
      "Moon Archive Plate": "문 아카이브 플레이트",
      "Junker Cleaver": "정크 클리버",
      "Street Plate": "스트리트 플레이트",
      "Scrap Reactor": "스크랩 리액터",
    };

    const direct = baseMap[name];
    if (direct) return direct;

    const parts = String(name).split(" ");
    if (parts.length >= 2 && prefixMap[parts[0]]) {
      const rest = parts.slice(1).join(" ");
      return `${prefixMap[parts[0]]} ${baseMap[rest] ?? rest}`;
    }

    for (const [prefix, translated] of Object.entries(prefixMap)) {
      if (String(name).startsWith(`${prefix} `)) {
        const rest = String(name).slice(prefix.length + 1);
        return `${translated} ${baseMap[rest] ?? rest}`;
      }
    }

    return baseMap[name] ?? name;
  }

  function slotTitle(slotId) {
    return t(`slot${slotId[0].toUpperCase()}${slotId.slice(1)}`);
  }

  function getCharacterCopy(id, field) {
    const table = {
      cain: {
        name: t("hunterCainName"),
        cardBody: t("cainCardBody"),
        baseBody: t("cainBaseBody"),
        startLabel: t("cainStartLabel"),
        resourceLabel: t("cainResource"),
        ultLabel: t("ultCain"),
        unlockRule: t("starterHunter"),
      },
      dex: {
        name: t("hunterDexName"),
        cardBody: t("dexCardBody"),
        baseBody: t("dexBaseBody"),
        startLabel: t("dexStartLabel"),
        resourceLabel: t("dexResource"),
        ultLabel: t("ultDex"),
        unlockRule: t("afterFirstTitanHunter"),
      },
      ria: {
        name: t("hunterRiaName"),
        cardBody: t("riaCardBody"),
        baseBody: t("riaBaseBody"),
        startLabel: t("riaStartLabel"),
        resourceLabel: t("riaResource"),
        ultLabel: t("ultRia"),
        unlockRule: t("afterSecondTitanHunter"),
      },
      sera: {
        name: t("hunterSeraName"),
        cardBody: t("seraCardBody"),
        baseBody: t("seraBaseBody"),
        startLabel: t("seraStartLabel"),
        resourceLabel: t("seraResource"),
        ultLabel: t("ultSera"),
        unlockRule: t("afterThirdTitanHunter"),
      },
    };
    return table[id]?.[field] ?? "";
  }

  function getCharacterName(id) {
    return getCharacterCopy(id, "name") || characterDefs[id]?.name || "";
  }

  function computeGauntletScore({ kills, level, victory }) {
    return Math.round(kills * 100 + level * 60 + (victory ? 500 : 0));
  }

  function updateGauntletBoard(entry) {
    const board = Array.isArray(meta.gauntletBoard) ? meta.gauntletBoard.slice() : [];
    board.push(entry);
    board.sort((a, b) => b.score - a.score);
    meta.gauntletBoard = board.slice(0, 3);
  }

  function getCharacterShowcase(id, field) {
    const table = {
      cain: {
        role: t("cainShowcaseRole"),
        weapon: t("cainShowcaseWeapon"),
        sigil: "C01",
      },
      dex: {
        role: t("dexShowcaseRole"),
        weapon: t("dexShowcaseWeapon"),
        sigil: "D02",
      },
      ria: {
        role: t("riaShowcaseRole"),
        weapon: t("riaShowcaseWeapon"),
        sigil: "R03",
      },
      sera: {
        role: t("seraShowcaseRole"),
        weapon: t("seraShowcaseWeapon"),
        sigil: "S04",
      },
    };
    return table[id]?.[field] ?? "";
  }

  function getCharacterSyncLabel(id) {
    const table = {
      cain: t("syncCain"),
      dex: t("syncDex"),
      ria: t("syncRia"),
      sera: t("syncSera"),
    };
    return table[id] ?? t("anyHunter");
  }

  function getModeShowcasePayout(id) {
    if (id === "boss") return t("showcaseBackdropBoss");
    if (id === "rift") return t("showcaseBackdropRift");
    if (id === "gauntlet") return t("showcaseBackdropGauntlet");
    return t("showcaseBackdropHunt");
  }

  function hasCosmeticPreview(characterId = meta.selectedCharacter) {
    return (meta.cosmeticPreview?.[characterId] ?? 0) > 0;
  }

  function getDeployBody(modeId) {
    if (modeId === "boss") return t("deployBodyBoss");
    if (modeId === "rift") return t("deployBodyRift");
    if (modeId === "gauntlet") return t("deployBodyGauntlet");
    return t("deployBodyHunt");
  }

  function getModeCopy(id, field) {
    const table = {
      hunt: { name: t("modeHuntName"), body: t("modeHuntBody"), unlockRule: "" },
      boss: {
        name: t("modeBossName"),
        body: t("modeBossBody"),
        unlockRule: t("modeBossUnlockRule"),
      },
      rift: {
        name: t("modeRiftName"),
        body: t("modeRiftBody"),
        unlockRule: t("modeRiftUnlockRule"),
      },
      gauntlet: {
        name: t("modeGauntletName"),
        body: t("modeGauntletBody"),
        unlockRule: t("modeGauntletUnlockRule"),
      },
    };
    return table[id]?.[field] ?? "";
  }

  function getRegionCopy(id, field) {
    const table = {
      redcity: {
        name: t("regionRedcityName"),
        bossName: t("regionRedcityBossName"),
        body: t("regionRedcityBody"),
        threat: t("regionRedcityThreat"),
        command: t("regionRedcityCommand"),
        reward: t("regionRedcityReward"),
        mode: getModeCopy("hunt", "name"),
        modeId: "hunt",
        hunter: getCharacterName("cain"),
        hunterId: "cain",
        unlockRule: t("regionStarter"),
      },
      sanctuary: {
        name: t("regionSanctuaryName"),
        bossName: t("regionSanctuaryBossName"),
        body: t("regionSanctuaryBody"),
        threat: t("regionSanctuaryThreat"),
        command: t("regionSanctuaryCommand"),
        reward: t("regionSanctuaryReward"),
        mode: getModeCopy("boss", "name"),
        modeId: "boss",
        hunter: getCharacterName("dex"),
        hunterId: "dex",
        unlockRule: t("regionAfterFirstTitan"),
      },
      blacktide: {
        name: t("regionBlacktideName"),
        bossName: t("regionBlacktideBossName"),
        body: t("regionBlacktideBody"),
        threat: t("regionBlacktideThreat"),
        command: t("regionBlacktideCommand"),
        reward: t("regionBlacktideReward"),
        mode: getModeCopy("rift", "name"),
        modeId: "rift",
        hunter: getCharacterName("ria"),
        hunterId: "ria",
        unlockRule: t("regionAfterSeasonBreak"),
      },
    };
    return table[id]?.[field] ?? "";
  }

  function getRelicUnlockRule(id) {
    const table = {
      "blood-idol": t("starterRelic"),
      "dash-fang": t("starterRelic"),
      "shock-core": t("relicAfterFirstTitan"),
      "orbit-shard": t("relicAfterSecondTitan"),
      "titan-spine": t("relicAfterThirdTitan"),
      "harvest-lens": t("relicAfterFourthTitan"),
      "crimson-crown": t("relicAfterSeason1"),
      "eclipse-coil": t("relicAfterSeason2"),
      "blood-archive": t("relicAfterSeason3"),
    };
    return table[id] ?? "";
  }

  function getPassTierCopy(id, field) {
    const table = {
      "tier-1": { title: t("passTier1Title"), body: t("passTier1Body") },
      "tier-2": { title: t("passTier2Title"), body: t("passTier2Body") },
      "tier-3": { title: t("passTier3Title"), body: t("passTier3Body") },
      "tier-4": { title: t("passTier4Title"), body: t("passTier4Body") },
      "tier-5": { title: t("passTier5Title"), body: t("passTier5Body") },
    };
    return table[id]?.[field] ?? "";
  }

  function getContractCopy(id, field) {
    const table = {
      "contract-runs": { title: t("contractRunsTitle"), body: t("contractRunsBody") },
      "contract-titans": { title: t("contractTitansTitle"), body: t("contractTitansBody") },
      "contract-salvage": { title: t("contractSalvageTitle"), body: t("contractSalvageBody") },
      "contract-rift": { title: t("contractRiftTitle"), body: t("contractRiftBody") },
      "contract-gauntlet": { title: t("contractGauntletTitle"), body: t("contractGauntletBody") },
    };
    return table[id]?.[field] ?? "";
  }

  const characterDefs = {
    cain: {
      id: "cain",
      name: "Cain",
      eyebrow: { en: "OVERKILL // BERSERKER", ko: "오버킬 // 광전사" },
      title: "Cain in the Red City",
      body: "Dive into the pack, rip them apart, and snowball rage into a titan kill.",
      resourceLabel: "RAGE",
      ultCooldown: 24,
      startLabel: "Enter Red City",
      attackStyle: "melee",
      color: "#78d2ff",
      rageColor: "#ff9b3a",
      base: {
        hp: 520,
        speed: 250,
        damage: 58,
        attackRange: 128,
        attackCooldown: 0.42,
        attackArc: Math.PI * 0.68,
        dashCooldown: 4.5,
      },
      passive: (player) => {
        player.executeBonus += 0.1;
      },
      cardBody: "Close-range blood engine. High sustain, high overkill.",
      unlockRule: "Starter hunter",
    },
    dex: {
      id: "dex",
      name: "Dex",
      eyebrow: { en: "OVERKILL // WEAPON ENGINEER", ko: "오버킬 // 병기 설계자" },
      title: "Dex in the Iron Sanctuary",
      body: "Flood the lane with pulse fire and drones, then pin the boss down from range.",
      resourceLabel: "OVERDRIVE",
      ultCooldown: 22,
      startLabel: "Deploy To Sanctuary",
      attackStyle: "ranged",
      color: "#82e8d2",
      rageColor: "#b2fff1",
      base: {
        hp: 420,
        speed: 235,
        damage: 34,
        attackRange: 360,
        attackCooldown: 0.18,
        attackArc: Math.PI * 0.2,
        dashCooldown: 3.8,
      },
      passive: (player) => {
        player.orbitCount += 1;
        player.projectileBurst = 1;
        player.rewardMultiplier += 0.08;
      },
      cardBody: "Mid-range suppression. Faster loop, safer boss pressure.",
      unlockRule: "Unlock after the first titan kill",
    },
    ria: {
      id: "ria",
      name: "Ria",
      eyebrow: { en: "OVERKILL // CURSE WITCH", ko: "오버킬 // 저주 마녀" },
      title: "Ria in the Iron Sanctuary",
      body: "Brand the pack, trigger ruin blooms, and watch the lane collapse in chained detonations.",
      resourceLabel: "ECHO",
      ultCooldown: 23,
      startLabel: "Cast Into Sanctuary",
      attackStyle: "hex",
      color: "#d88cff",
      rageColor: "#ff7dc5",
      base: {
        hp: 405,
        speed: 242,
        damage: 30,
        attackRange: 332,
        attackCooldown: 0.24,
        attackArc: Math.PI * 0.24,
        dashCooldown: 4,
      },
      passive: (player) => {
        player.hexChains = 1;
        player.curseThreshold = 3;
        player.curseBurstDamage += 8;
      },
      cardBody: "Curse marks, burst chains, and boss-breaking ritual spikes.",
      unlockRule: "Unlock after the second titan kill",
    },
    sera: {
      id: "sera",
      name: "Sera",
      eyebrow: { en: "OVERKILL // REAPER RUNNER", ko: "오버킬 // 사신 러너" },
      title: "Sera in the Red City",
      body: "Blink through the front line, harvest low targets, and keep the kill chain hot enough to outrun the boss.",
      resourceLabel: "MOMENTUM",
      ultCooldown: 20,
      startLabel: "Drop Into Red City",
      attackStyle: "blink",
      color: "#8cc8ff",
      rageColor: "#f7f1ff",
      base: {
        hp: 392,
        speed: 272,
        damage: 42,
        attackRange: 152,
        attackCooldown: 0.22,
        attackArc: Math.PI * 0.52,
        dashCooldown: 3.2,
      },
      passive: (player) => {
        player.executeBonus += 0.18;
        player.dashRefundOnKill += 0.34;
        player.killRushBonus += 0.16;
      },
      cardBody: "Blink assassin. Fast resets, tighter arcs, brutal execution chains.",
      unlockRule: "Unlock after the third titan kill",
    },
  };

  const modeDefs = {
    hunt: {
      id: "hunt",
      name: "Main Hunt",
      body: "Build from weak mobs into a late titan showdown.",
      duration: 120,
      bossTime: 75,
      hasBoss: true,
    },
    boss: {
      id: "boss",
      name: "World Boss",
      body: "Start under pressure. Boss arrives almost immediately with fewer adds.",
      duration: 95,
      bossTime: 4,
      hasBoss: true,
    },
    rift: {
      id: "rift",
      name: "Abyss Rift",
      body: "Longer collapse run with denser waves and richer salvage.",
      duration: 150,
      bossTime: 100,
      hasBoss: true,
    },
    gauntlet: {
      id: "gauntlet",
      name: "Gauntlet",
      body: "No titan. Escalating elite pressure and overclocked loot.",
      duration: 135,
      bossTime: 999,
      hasBoss: false,
    },
  };

  const regionDefs = {
    redcity: {
      id: "redcity",
      name: "Red City",
      body: "Collapsing streets, bio-mass stains, and feral swarm pressure.",
      unlockRule: "Starter region",
      palette: {
        bg: "#080c10",
        stain: "rgba(181, 32, 34, 0.11)",
        grid: "rgba(255,255,255,0.03)",
      },
      enemyColors: {
        grunt: "#d34f52",
        charger: "#ff7a57",
        shooter: "#f4c35a",
        elite: "#ffb35c",
        drifter: "#f0dd88",
        warden: "#ffd8a6",
      },
      bossName: "APOSTATE TITAN",
      bossColor: "#96503e",
      coreColor: "#ffd272",
      bossBurst: "rgba(255, 190, 110, 0.2)",
    },
    sanctuary: {
      id: "sanctuary",
      name: "Iron Sanctuary",
      body: "Cold steel corridors, signal noise, and machine cult constructs.",
      unlockRule: "Unlocked after first titan kill",
      palette: {
        bg: "#071114",
        stain: "rgba(58, 153, 159, 0.12)",
        grid: "rgba(180,245,240,0.04)",
      },
      enemyColors: {
        grunt: "#46b0c8",
        charger: "#7ee4f0",
        shooter: "#b8fff4",
        elite: "#8fd4ff",
        drifter: "#d9fffb",
        warden: "#e4ffff",
      },
      bossName: "SANCTUARY ARCHON",
      bossColor: "#3f7e90",
      coreColor: "#b8fff4",
      bossBurst: "rgba(120, 235, 255, 0.2)",
    },
    blacktide: {
      id: "blacktide",
      name: "Black Tide",
      body: "Black tide flats, abyss bloom pools, and leviathan pressure from every angle.",
      unlockRule: "Unlocked after the first season breakpoint clear",
      palette: {
        bg: "#050b10",
        stain: "rgba(64, 167, 176, 0.1)",
        grid: "rgba(128, 238, 228, 0.035)",
      },
      enemyColors: {
        grunt: "#4ac0b3",
        charger: "#89fff0",
        shooter: "#72d0ff",
        elite: "#b1f8ff",
        drifter: "#c4fff8",
        warden: "#ecfffb",
      },
      bossName: "ABYSS LEVIATHAN",
      bossColor: "#275865",
      coreColor: "#a9fff2",
      bossBurst: "rgba(130, 255, 236, 0.22)",
    },
  };

  const commonUpgradeDefs = [
    {
      id: "damage",
      title: { en: "Brutal Swing", ko: "난폭한 참격" },
      description: { en: "Heavy arc damage increases by 18.", ko: "넓게 휘두르는 자동 참격 피해가 18 증가한다." },
      apply: (player) => {
        player.damage += 18;
      },
    },
    {
      id: "range",
      title: { en: "Wider Arc", ko: "참격 궤적 확장" },
      description: { en: "Auto-slash radius increases by 22.", ko: "자동 참격 범위가 22 늘어난다." },
      apply: (player) => {
        player.attackRange += 22;
      },
    },
    {
      id: "speed",
      title: { en: "Frenzy Cartilage", ko: "광전 연골" },
      description: { en: "Attack speed increases by 14%.", ko: "공격 속도가 14% 상승한다." },
      apply: (player) => {
        player.attackCooldown *= 0.86;
      },
    },
    {
      id: "hp",
      title: { en: "Iron Spine", ko: "강철 척추" },
      description: { en: "Max HP increases by 140 and heal 70.", ko: "최대 체력이 140 증가하고 즉시 70 회복한다." },
      apply: (player) => {
        player.maxHp += 140;
        player.hp = Math.min(player.maxHp, player.hp + 70);
      },
    },
    {
      id: "explode",
      title: { en: "Shock Burst", ko: "충격 폭발" },
      description: { en: "Every 4 kills detonate nearby enemies.", ko: "처치 4회마다 주변 적이 한 번 더 폭발한다." },
      apply: (player) => {
        player.explosionKillsThreshold = Math.max(
          2,
          player.explosionKillsThreshold - 1,
        );
      },
    },
    {
      id: "dash",
      title: { en: "Reactor Dash", ko: "리액터 대시" },
      description: { en: "Dash cooldown reduced by 18%.", ko: "대시 재사용 대기시간이 18% 감소한다." },
      apply: (player) => {
        player.dashCooldown *= 0.82;
      },
    },
    {
      id: "radius",
      title: { en: "Overkill Field", ko: "오버킬 필드" },
      description: { en: "Slash width increases and enemies stagger longer.", ko: "참격 폭이 넓어지고 적 경직이 더 길어진다." },
      apply: (player) => {
        player.attackArc += 0.16;
        player.staggerPower += 14;
      },
    },
  ];

  const cainUpgradeDefs = [
    {
      id: "cain-lifesteal",
      title: { en: "Blood Engine", ko: "블러드 엔진" },
      description: { en: "Cain only. Gain 3% lifesteal and 40 max HP.", ko: "카인 전용. 흡혈 3%와 최대 체력 40을 얻는다." },
      apply: (player) => {
        player.lifesteal += 0.03;
        player.maxHp += 40;
        player.hp += 40;
      },
    },
    {
      id: "cain-rage",
      title: { en: "Rage Core", ko: "분노 핵" },
      description: { en: "Cain only. Rage gain rises by 35% and damage by 8.", ko: "카인 전용. 분노 수급이 35% 늘고 피해가 8 증가한다." },
      apply: (player) => {
        player.rageGainMultiplier += 0.35;
        player.damage += 8;
      },
    },
    {
      id: "cain-execute",
      title: { en: "Execution Edge", ko: "처형의 칼끝" },
      description: { en: "Cain only. Deal 35% more damage below half HP.", ko: "카인 전용. 체력이 절반 이하인 적에게 35% 추가 피해를 준다." },
      apply: (player) => {
        player.executeBonus += 0.35;
      },
    },
    {
      id: "cain-trail",
      title: { en: "Reaper Trail", ko: "사신의 궤적" },
      description: { en: "Cain only. Dashes carve a burning trail and hit harder.", ko: "카인 전용. 대시가 불타는 궤적을 남기고 타격도 더 세진다." },
      apply: (player) => {
        player.hasDashTrail = true;
        player.damage += 6;
      },
    },
  ];

  const dexUpgradeDefs = [
    {
      id: "dex-orbit",
      title: { en: "Orbit Drone", ko: "오비트 드론" },
      description: { en: "Dex only. Add one orbit drone and +6 damage.", ko: "덱스 전용. 공전 드론 1기를 추가하고 피해가 6 증가한다." },
      apply: (player) => {
        if (player.orbitCount < 4) player.orbitCount += 1;
        player.damage += 6;
      },
    },
    {
      id: "dex-burst",
      title: { en: "Burst Array", ko: "버스트 어레이" },
      description: { en: "Dex only. Extra burst shot and 8% fire rate.", ko: "덱스 전용. 추가 버스트 탄이 붙고 연사 속도가 8% 빨라진다." },
      apply: (player) => {
        player.projectileBurst += 1;
        player.attackCooldown *= 0.92;
      },
    },
    {
      id: "dex-overdrive",
      title: { en: "Overdrive Feed", ko: "오버드라이브 피드" },
      description: { en: "Dex only. Gain 10% XP, 10% rewards, and +18 range.", ko: "덱스 전용. 경험치와 보상이 10%씩 늘고 사거리가 18 증가한다." },
      apply: (player) => {
        player.xpMultiplier += 0.1;
        player.rewardMultiplier += 0.1;
        player.attackRange += 18;
      },
    },
    {
      id: "dex-targeting",
      title: { en: "Target Uplink", ko: "타깃 업링크" },
      description: { en: "Dex only. Boss damage +14% and range +24.", ko: "덱스 전용. 보스 피해가 14% 늘고 사거리가 24 증가한다." },
      apply: (player) => {
        player.bossDamageMultiplier += 0.14;
        player.attackRange += 24;
      },
    },
  ];

  const riaUpgradeDefs = [
    {
      id: "ria-bloom",
      title: { en: "Black Bloom", ko: "검은 개화" },
      description: { en: "Ria only. Curse bursts deal +18 damage and cover a wider circle.", ko: "리아 전용. 저주 폭발 피해가 18 늘고 범위가 더 넓어진다." },
      apply: (player) => {
        player.curseBurstDamage += 18;
        player.curseBurstRadius += 22;
      },
    },
    {
      id: "ria-lattice",
      title: { en: "Echo Lattice", ko: "에코 격자" },
      description: { en: "Ria only. One extra chain target and +18 range.", ko: "리아 전용. 연쇄 대상이 1명 늘고 사거리가 18 증가한다." },
      apply: (player) => {
        player.hexChains += 1;
        player.attackRange += 18;
      },
    },
    {
      id: "ria-threshold",
      title: { en: "Ruin Choir", ko: "파멸 합창" },
      description: { en: "Ria only. Curse pops one stack earlier and attack speed rises 8%.", ko: "리아 전용. 저주가 한 단계 빨리 터지고 공격 속도가 8% 오른다." },
      apply: (player) => {
        player.curseThreshold = Math.max(2, player.curseThreshold - 1);
        player.attackCooldown *= 0.92;
      },
    },
    {
      id: "ria-grave",
      title: { en: "Grave Chorus", ko: "묘지의 합창" },
      description: { en: "Ria only. Boss damage +18% and every burst yields more echo.", ko: "리아 전용. 보스 피해가 18% 늘고 폭발마다 메아리를 더 많이 얻는다." },
      apply: (player) => {
        player.bossDamageMultiplier += 0.18;
        player.curseEchoGain += 0.18;
      },
    },
  ];

  const seraUpgradeDefs = [
    {
      id: "sera-step",
      title: { en: "Shadow Step", ko: "섀도우 스텝" },
      description: { en: "Sera only. Dash cooldown falls 18% and blink strike range grows.", ko: "세라 전용. 대시 쿨이 18% 줄고 점멸 참격 사거리가 늘어난다." },
      apply: (player) => {
        player.dashCooldown *= 0.82;
        player.blinkStrikeRange += 28;
      },
    },
    {
      id: "sera-edge",
      title: { en: "Execution Script", ko: "처형 스크립트" },
      description: { en: "Sera only. Execute damage rises sharply and base damage +8.", ko: "세라 전용. 처형 피해가 크게 오르고 기본 피해가 8 증가한다." },
      apply: (player) => {
        player.executeBonus += 0.28;
        player.damage += 8;
      },
    },
    {
      id: "sera-rush",
      title: { en: "Afterimage Drive", ko: "잔상 드라이브" },
      description: { en: "Sera only. Kill rush lasts longer and attack speed rises 10%.", ko: "세라 전용. 킬 러시 유지시간이 늘고 공격 속도가 10% 상승한다." },
      apply: (player) => {
        player.killRushBonus += 0.08;
        player.attackCooldown *= 0.9;
      },
    },
    {
      id: "sera-lock",
      title: { en: "Reaper Lock", ko: "리퍼 락" },
      description: { en: "Sera only. Boss damage +16%, dash refund improves, range +18.", ko: "세라 전용. 보스 피해가 16% 늘고 대시 환급이 좋아지며 사거리가 18 증가한다." },
      apply: (player) => {
        player.bossDamageMultiplier += 0.16;
        player.dashRefundOnKill += 0.16;
        player.attackRange += 18;
      },
    },
  ];

  const gearSlots = [
    { id: "weapon", title: "Weapon" },
    { id: "armor", title: "Armor" },
    { id: "reactor", title: "Reactor" },
  ];

  const rarityDefs = {
    common: { label: "COMMON", mult: 1, salvageGold: 20, salvageCores: 1 },
    rare: { label: "RARE", mult: 1.45, salvageGold: 45, salvageCores: 2 },
    epic: { label: "EPIC", mult: 1.95, salvageGold: 80, salvageCores: 4 },
    legendary: { label: "LEGEND", mult: 2.6, salvageGold: 140, salvageCores: 7 },
  };

  const seasonDef = {
    id: "blood-moon",
    name: { en: "Crimson Eclipse", ko: "크림슨 이클립스" },
    ruleTitle: { en: "Blood Echo", ko: "블러드 에코" },
    ruleBody: {
      en: "Kills drop blood echoes. Each pickup raises attack tempo and payout, but the lane gets louder and hotter.",
      ko: "적을 처치하면 블러드 에코가 떨어진다. 주울수록 공격 템포와 보상이 같이 오르지만, 전장은 더 시끄럽고 더 위험해진다.",
    },
    missionTitle: { en: "Season Hunt", ko: "시즌 사냥" },
    missionBody: {
      en: "Kill 40 enemies and break one titan weakpoint in a single run.",
      ko: "한 번의 런에서 적 40마리를 처치하고 타이탄 약점 1개를 파괴하라.",
    },
    killTarget: 40,
    weakpointTarget: 1,
    rewardLabel: { en: "SEASON REWARD", ko: "시즌 보상" },
    rewardBody: { en: "Epic relic shard + crimson execution trail", ko: "영웅 리릭 조각 + 크림슨 처형 궤적" },
    passTiers: [
      {
        id: "tier-1",
        xp: 40,
        title: "Starter Blood Cache",
        body: "+120 gold // +8 cores",
        claim: (meta) => {
          meta.gold += 120;
          meta.cores += 8;
          return lang() === "ko" ? "시즌 패스 1단계: +120 골드 / +8 코어" : "Season Pass T1: +120 gold / +8 cores";
        },
      },
      {
        id: "tier-2",
        xp: 90,
        title: "Research Surge",
        body: "+26 data // Launch-track friendly",
        claim: (meta) => {
          meta.data += 26;
          return lang() === "ko" ? "시즌 패스 2단계: +26 데이터" : "Season Pass T2: +26 data";
        },
      },
      {
        id: "tier-3",
        xp: 150,
        title: "Titan Wage",
        body: "+10 genes // +140 gold",
        claim: (meta) => {
          meta.genes += 10;
          meta.gold += 140;
          return lang() === "ko" ? "시즌 패스 3단계: +10 유전자 / +140 골드" : "Season Pass T3: +10 genes / +140 gold";
        },
      },
      {
        id: "tier-4",
        xp: 230,
        title: "Eclipse Armory",
        body: "Epic season reactor drop",
        claim: (meta) => {
          const item = createRewardItem({
            slot: "reactor",
            rarity: "epic",
            name: "Eclipse Relay",
            affinity: "any",
            stats: { reward: 0.1, xp: 0.08, bossDamage: 0.08 },
          });
          return lang() === "ko" ? `시즌 패스 4단계: ${localizeItemName(item.name)}` : `Season Pass T4: ${item.name}`;
        },
      },
      {
        id: "tier-5",
        xp: 320,
        title: "Crimson Finish",
        body: "Legendary archive cache // +180 gold // +20 data",
        claim: (meta) => {
          meta.gold += 180;
          meta.data += 20;
          const item = createRewardItem({
            slot: "armor",
            rarity: "legendary",
            name: "Moon Archive Plate",
            affinity: "any",
            stats: { hp: 136, reward: 0.12, bossDamage: 0.08 },
          });
          return lang() === "ko" ? `시즌 패스 5단계: ${localizeItemName(item.name)} + 180 골드 / 20 데이터` : `Season Pass T5: ${item.name} + 180 gold / 20 data`;
        },
      },
    ],
  };

  const contractDefs = [
    {
      id: "contract-runs",
      title: "Field Test Loop",
      body: "Complete 3 total runs.",
      progress: () => ({ current: Math.min(meta.runs, 3), target: 3 }),
      isComplete: () => meta.runs >= 3,
      claim: (meta) => {
        meta.gold += 90;
        meta.data += 10;
        return lang() === "ko" ? "계약 완료: +90 골드 / +10 데이터" : "Contract cleared: +90 gold / +10 data";
      },
    },
    {
      id: "contract-titans",
      title: "Titan Harvest",
      body: "Kill 2 titans in any mode.",
      progress: () => ({ current: Math.min(meta.bossKills, 2), target: 2 }),
      isComplete: () => meta.bossKills >= 2,
      claim: (meta) => {
        meta.genes += 8;
        return lang() === "ko" ? "계약 완료: +8 유전자" : "Contract cleared: +8 genes";
      },
    },
    {
      id: "contract-salvage",
      title: "Scrap Refinery",
      body: "Salvage 2 dropped items.",
      progress: () => ({ current: Math.min(meta.salvageCount, 2), target: 2 }),
      isComplete: () => meta.salvageCount >= 2,
      claim: (meta) => {
        meta.cores += 10;
        meta.gold += 60;
        return lang() === "ko" ? "계약 완료: +10 코어 / +60 골드" : "Contract cleared: +10 cores / +60 gold";
      },
    },
    {
      id: "contract-rift",
      title: "Rift Lockdown",
      body: "Seal 2 Abyss Rift runs.",
      progress: () => ({ current: Math.min(meta.riftWins, 2), target: 2 }),
      isComplete: () => meta.riftWins >= 2,
      claim: (meta) => {
        meta.data += 22;
        meta.cores += 8;
        return lang() === "ko" ? "계약 완료: +22 데이터 / +8 코어" : "Contract cleared: +22 data / +8 cores";
      },
    },
    {
      id: "contract-gauntlet",
      title: "Gauntlet Lock",
      body: "Clear 2 Gauntlet runs.",
      progress: () => ({ current: Math.min(meta.gauntletWins, 2), target: 2 }),
      isComplete: () => meta.gauntletWins >= 2,
      claim: (meta) => {
        meta.cores += 14;
        meta.gold += 130;
        return lang() === "ko" ? "계약 완료: +14 코어 / +130 골드" : "Contract cleared: +14 cores / +130 gold";
      },
    },
  ];

  const lootPools = {
    weapon: [
      { name: "Cleaver", affinity: "cain", setId: "reaver", stats: { damage: 16, attackSpeed: 0.02 } },
      { name: "Ripper", affinity: "cain", setId: "reaver", stats: { damage: 12, executeBonus: 0.08 } },
      { name: "Pulse Lance", affinity: "dex", setId: "signal", stats: { damage: 14, range: 24 } },
      { name: "Burst Carbine", affinity: "dex", setId: "signal", stats: { damage: 12, attackSpeed: 0.05 } },
      { name: "Hex Lantern", affinity: "ria", setId: "ruin", stats: { damage: 11, range: 26 } },
      { name: "Ruin Censer", affinity: "ria", setId: "ruin", stats: { damage: 10, bossDamage: 0.08 } },
      { name: "Twin Scythes", affinity: "sera", setId: "blink", stats: { damage: 14, attackSpeed: 0.04 } },
      { name: "Phantom Blade", affinity: "sera", setId: "blink", stats: { damage: 12, executeBonus: 0.1 } },
      { name: "Tideglass Spear", affinity: "any", setId: "abyss", regions: ["blacktide"], stats: { damage: 13, range: 22, reward: 0.05 } },
    ],
    armor: [
      { name: "Red Plate", affinity: "cain", setId: "reaver", stats: { hp: 90 } },
      { name: "Bone Weave", affinity: "any", stats: { hp: 60, lifesteal: 0.01 } },
      { name: "Titan Hide", affinity: "cain", setId: "reaver", stats: { hp: 110, bossDamage: 0.04 } },
      { name: "Signal Mesh", affinity: "dex", setId: "signal", stats: { hp: 68, reward: 0.06, xp: 0.06 } },
      { name: "Veil Mantle", affinity: "ria", setId: "ruin", stats: { hp: 64, attackSpeed: 0.04 } },
      { name: "Choir Wrap", affinity: "ria", setId: "ruin", stats: { hp: 74, xp: 0.08 } },
      { name: "Night Weave", affinity: "sera", setId: "blink", stats: { hp: 58, attackSpeed: 0.05 } },
      { name: "Ghost Mesh", affinity: "sera", setId: "blink", stats: { hp: 66, reward: 0.08 } },
      { name: "Abyss Shell", affinity: "any", setId: "abyss", regions: ["blacktide"], stats: { hp: 82, reward: 0.06, bossDamage: 0.04 } },
    ],
    reactor: [
      { name: "Rage Reactor", affinity: "cain", setId: "reaver", stats: { rageGain: 0.12, dashReduction: 0.12 } },
      { name: "Overdrive Cell", affinity: "dex", setId: "signal", stats: { reward: 0.06, xp: 0.08 } },
      { name: "Kill Coil", affinity: "any", stats: { rageGain: 0.08, damage: 8 } },
      { name: "Target Uplink", affinity: "dex", setId: "signal", stats: { range: 28, bossDamage: 0.06 } },
      { name: "Echo Core", affinity: "ria", setId: "ruin", stats: { rageGain: 0.12, xp: 0.06 } },
      { name: "Ruin Prism", affinity: "ria", setId: "ruin", stats: { range: 20, reward: 0.08 } },
      { name: "Reaper Relay", affinity: "sera", setId: "blink", stats: { dashReduction: 0.14, damage: 6 } },
      { name: "Void Mark", affinity: "sera", setId: "blink", stats: { bossDamage: 0.08, reward: 0.06 } },
      { name: "Current Heart", affinity: "any", setId: "abyss", regions: ["blacktide"], stats: { xp: 0.08, reward: 0.08, bossDamage: 0.06 } },
    ],
  };

  const gearSetDefs = {
    reaver: {
      name: { en: "Reaver Frame", ko: "리버 프레임" },
      twoPiece: { en: "Rage gain +20% // lifesteal +2%", ko: "분노 수급 +20% // 흡혈 +2%" },
      threePiece: { en: "Damage +18 // boss damage +12%", ko: "피해 +18 // 보스 피해 +12%" },
      apply: (player, count) => {
        if (count >= 2) {
          player.rageGainMultiplier += 0.2;
          player.lifesteal += 0.02;
        }
        if (count >= 3) {
          player.damage += 18;
          player.bossDamageMultiplier += 0.12;
        }
      },
    },
    signal: {
      name: { en: "Signal Array", ko: "시그널 어레이" },
      twoPiece: { en: "XP +12% // reward +10%", ko: "경험치 +12% // 보상 +10%" },
      threePiece: { en: "Range +26 // extra burst line", ko: "사거리 +26 // 버스트 라인 +1" },
      apply: (player, count) => {
        if (count >= 2) {
          player.xpMultiplier += 0.12;
          player.rewardMultiplier += 0.1;
        }
        if (count >= 3) {
          player.attackRange += 26;
          player.projectileBurst += 1;
        }
      },
    },
    ruin: {
      name: { en: "Ruin Choir", ko: "파멸 합창" },
      twoPiece: { en: "Curse threshold -1 // burst damage +12", ko: "저주 발동 단계 -1 // 폭발 피해 +12" },
      threePiece: { en: "Extra hex chain // reward +8%", ko: "추가 연쇄 1회 // 보상 +8%" },
      apply: (player, count) => {
        if (count >= 2) {
          player.curseThreshold = Math.max(2, player.curseThreshold - 1);
          player.curseBurstDamage += 12;
        }
        if (count >= 3) {
          player.hexChains += 1;
          player.rewardMultiplier += 0.08;
        }
      },
    },
    blink: {
      name: { en: "Blink Verdict", ko: "블링크 버딕트" },
      twoPiece: { en: "Dash cooldown -16% // execute +8%", ko: "대시 쿨 -16% // 처형 피해 +8%" },
      threePiece: { en: "Dash refund on kill +20% // kill rush +8%", ko: "처치 시 대시 환급 +20% // 킬 러시 +8%" },
      apply: (player, count) => {
        if (count >= 2) {
          player.dashCooldown *= 0.84;
          player.executeBonus += 0.08;
        }
        if (count >= 3) {
          player.dashRefundOnKill += 0.2;
          player.killRushBonus += 0.08;
        }
      },
    },
    abyss: {
      name: { en: "Abyss Current", ko: "어비스 커런트" },
      twoPiece: { en: "Reward +10% // XP +10%", ko: "보상 +10% // 경험치 +10%" },
      threePiece: { en: "Boss damage +14% // blood echo cap +2", ko: "보스 피해 +14% // 블러드 에코 최대치 +2" },
      apply: (player, count) => {
        if (count >= 2) {
          player.rewardMultiplier += 0.1;
          player.xpMultiplier += 0.1;
        }
        if (count >= 3) {
          player.bossDamageMultiplier += 0.14;
          player.seasonStackCap += 2;
        }
      },
    },
  };

  const researchTracks = [
    {
      id: "combat",
      title: { en: "Combat Lab", ko: "전투 실험동" },
      description: { en: "Permanent attack tuning for every run.", ko: "모든 런에 적용되는 영구 화력 조정 노드." },
      maxLevel: 6,
      getCost: (level) => ({ data: 12 + level * 10 }),
      getEffect: (level) => `DMG +${level * 8}`,
    },
    {
      id: "recovery",
      title: { en: "Hemostasis", ko: "지혈 프로토콜" },
      description: { en: "Permanent health and sustain upgrades.", ko: "체력과 유지력을 올리는 영구 생존 노드." },
      maxLevel: 6,
      getCost: (level) => ({ data: 10 + level * 8 }),
      getEffect: (level) => `HP +${level * 35}`,
    },
    {
      id: "harvest",
      title: { en: "Harvest Matrix", ko: "수확 매트릭스" },
      description: { en: "More XP, better scrap, stronger post-run rewards.", ko: "경험치, 분해 수익, 런 종료 보상을 함께 끌어올린다." },
      maxLevel: 6,
      getCost: (level) => ({ data: 14 + level * 12 }),
      getEffect: (level) => `GAIN +${Math.round(level * 8)}%`,
    },
  ];

  const ascensionTracks = [
    {
      id: "overkill",
      title: { en: "Overkill Spine", ko: "오버킬 척추" },
      description: { en: "Turn clean titan genes into permanent strike power and harder boss breaks.", ko: "정제된 타이탄 유전자를 영구 화력과 강한 보스 파괴력으로 바꾼다." },
      maxLevel: 5,
      getCost: (level) => ({ genes: 6 + level * 4 }),
      getEffect: (level) =>
        `DMG +${level * 12} // BOSS +${Math.round(level * 8)}%`,
    },
    {
      id: "mobility",
      title: { en: "Blink Nerve", ko: "점멸 신경" },
      description: { en: "Faster repositioning, lower dash downtime, and more aggressive loop pace.", ko: "재배치 속도를 높이고 대시 공백을 줄여 전투 템포를 공격적으로 만든다." },
      maxLevel: 5,
      getCost: (level) => ({ genes: 5 + level * 4 }),
      getEffect: (level) =>
        `SPD +${level * 14} // DASH -${Math.round(level * 5)}%`,
    },
    {
      id: "genome",
      title: { en: "Titan Marrow", ko: "타이탄 골수" },
      description: { en: "Thicker health pool and stronger post-run harvest from every deployment.", ko: "출격마다 더 두꺼운 체력선과 더 큰 종료 보상을 확보한다." },
      maxLevel: 5,
      getCost: (level) => ({ genes: 7 + level * 5 }),
      getEffect: (level) =>
        `HP +${level * 55} // GAIN +${Math.round(level * 5)}%`,
    },
  ];

  const awakeningDefs = {
    cain: {
      title: { en: "Blood Covenant", ko: "혈계 계약" },
      cost: 18,
      description: { en: "Cain only. Rage gain surges, lifesteal climbs, and every overkill swing hits heavier.", ko: "카인 전용. 분노 수급이 급증하고 흡혈이 늘며, 오버킬 일격마다 더 무겁게 꽂힌다." },
    },
    dex: {
      title: { en: "Zero Factory", ko: "제로 팩토리" },
      cost: 20,
      description: { en: "Dex only. Start with an extra burst line, one more orbit drone, and richer salvage output.", ko: "덱스 전용. 추가 버스트 라인과 공전 드론으로 시작하고, 분해 수익도 더 좋아진다." },
    },
    ria: {
      title: { en: "Black Gospel", ko: "블랙 가스펠" },
      cost: 21,
      description: { en: "Ria only. Ruin chains spread farther and curse bursts trigger earlier and harder.", ko: "리아 전용. 파멸 연쇄가 더 멀리 뻗고 저주 폭발이 더 빠르고 더 세게 터진다." },
    },
    sera: {
      title: { en: "Final Frame", ko: "파이널 프레임" },
      cost: 22,
      description: { en: "Sera only. Kill resets sharpen, execute windows widen, and the rush stays online longer.", ko: "세라 전용. 처치 리셋이 더 날카로워지고 처형 창이 넓어지며 러시가 더 오래 유지된다." },
    },
  };

  const relicDefs = [
    {
      id: "blood-idol",
      title: { en: "Blood Idol", ko: "혈각 우상" },
      description: { en: "Start each run with +3% lifesteal.", ko: "매 런 시작 시 흡혈 3%를 얻는다." },
      unlockRule: "Starter relic",
      apply: (player) => {
        player.lifesteal += 0.03;
      },
    },
    {
      id: "dash-fang",
      title: { en: "Dash Fang", ko: "대시 송곳니" },
      description: { en: "Dash cooldown falls by 18% and leaves a reaper trail.", ko: "대시 쿨이 18% 줄고 사신의 궤적을 남긴다." },
      unlockRule: "Starter relic",
      apply: (player) => {
        player.dashCooldown *= 0.82;
        player.hasDashTrail = true;
      },
    },
    {
      id: "shock-core",
      title: { en: "Shock Core", ko: "쇼크 코어" },
      description: { en: "Kill explosions trigger faster and hit harder.", ko: "처치 폭발이 더 빨리 돌고 한 번에 더 세게 터진다." },
      unlockRule: "Unlocked after first titan kill",
      apply: (player) => {
        player.explosionKillsThreshold = Math.max(2, player.explosionKillsThreshold - 1);
        player.explosionDamageBonus += 18;
      },
    },
    {
      id: "orbit-shard",
      title: { en: "Orbit Shard", ko: "오비트 샤드" },
      description: { en: "Begin with one orbit blade and +8 damage.", ko: "공전 칼날 1개와 피해 8 증가 효과를 들고 시작한다." },
      unlockRule: "Unlocked after second titan kill",
      apply: (player) => {
        player.orbitCount += 1;
        player.damage += 8;
      },
    },
    {
      id: "titan-spine",
      title: { en: "Titan Spine", ko: "타이탄 척추" },
      description: { en: "Gain +100 max HP and deal 22% more damage to the boss core.", ko: "최대 체력 100을 얻고 보스 코어에 22% 추가 피해를 준다." },
      unlockRule: "Unlocked after third titan kill",
      apply: (player) => {
        player.maxHp += 100;
        player.hp += 100;
        player.bossDamageMultiplier += 0.22;
      },
    },
    {
      id: "harvest-lens",
      title: { en: "Harvest Lens", ko: "수확 렌즈" },
      description: { en: "Gain 25% more XP and 18% more post-run rewards.", ko: "경험치 25%와 런 종료 보상 18%를 추가로 얻는다." },
      unlockRule: "Unlocked after fourth titan kill",
      apply: (player) => {
        player.xpMultiplier += 0.25;
        player.rewardMultiplier += 0.18;
      },
    },
    {
      id: "crimson-crown",
      title: { en: "Crimson Crown", ko: "크림슨 크라운" },
      description: { en: "Start each run with a live blood echo streak already active.", ko: "매 런 시작 시 블러드 에코 연속 효과가 미리 켜진 상태로 시작한다." },
      unlockRule: "Unlocked after the first season breakpoint clear",
      apply: (player) => {
        player.seasonStacks = Math.max(player.seasonStacks, 3);
        player.seasonTimer = Math.max(player.seasonTimer, 5.5);
      },
    },
    {
      id: "eclipse-coil",
      title: { en: "Eclipse Coil", ko: "이클립스 코일" },
      description: { en: "Blood echo stacks cap higher and decay more slowly.", ko: "블러드 에코 최대치가 늘고 사라지는 속도가 느려진다." },
      unlockRule: "Unlocked after the second season breakpoint clear",
      apply: (player) => {
        player.seasonStackCap += 4;
        player.seasonDecayRate *= 0.72;
      },
    },
    {
      id: "blood-archive",
      title: { en: "Blood Archive", ko: "블러드 아카이브" },
      description: { en: "While a blood echo streak is active, titan rewards and boss damage rise.", ko: "블러드 에코가 유지되는 동안 타이탄 보상과 보스 피해가 함께 오른다." },
      unlockRule: "Unlocked after the third season breakpoint clear",
      apply: (player) => {
        player.rewardMultiplier += 0.12;
        player.bossDamageMultiplier += 0.12;
      },
    },
  ];

  let activeBaseTab = "equipment";
  let meta = loadMeta();
  ensureSelectionsUnlocked();
  let player = createPlayerFromMeta();
  let boss = null;
  let elapsed = 0;
  let spawnClock = 0;
  let pausedForLevel = false;
  let gameOver = false;
  let bossSpawned = false;
  let screen = "base";
  let animationId = 0;
  let lastTs = 0;
  let currentRewards = {
    gold: 0,
    cores: 0,
    data: 0,
    genes: 0,
    gauntletScore: 0,
    gauntletRecord: false,
    newRelic: null,
    newSeasonRelic: null,
    bonusLines: [],
    droppedItems: [],
    seasonProgress: null,
  };
  let runDuration = modeDefs.hunt.duration;
  let eventBanner = { text: "", timer: 0 };
  let runFlags = { intro: false, levelHint: false, eliteHint: false, bossHint: false };
  let finisher = { active: false, timer: 0 };
  let ultimateCutin = { active: false, timer: 0 };
  let deployIntro = { active: false, timer: 0 };
  let chapterUnlockIntro = { active: false, timer: 0 };
  const pendingRegionUnlocks = [];
  const introSlides = [1, 2, 3];
  let introIndex = 0;

  function renderShellLabels() {
    document.documentElement.lang = lang() === "ko" ? "ko" : "en";
    titleEyebrow.textContent = t("titleEyebrow");
    titleSubtitle.textContent = t("titleSubtitle");
    titleBody.textContent = t("titleBody");
    titleStartButton.textContent = t("startSequence");
    titleSkipButton.textContent = t("skipToBase");
    introSkipButton.textContent = t("skip");
    hunterLabel.textContent = t("hunter");
    modeLabel.textContent = t("mode");
    regionLabel.textContent = t("region");
    goldLabel.textContent = t("gold");
    coreLabel.textContent = t("cores");
    dataLabel.textContent = t("data");
    genesLabel.textContent = t("genes");
    powerLabel.textContent = t("power");
    runsLabel.textContent = t("runs");
    bestKillsLabel.textContent = t("bestKills");
    objectiveLabel.textContent = t("objective");
    launchTrackLabel.textContent = t("launchTrack");
    operationLabel.textContent = t("operationMap");
    tabEquipment.textContent = t("tabEquipment");
    tabRelics.textContent = t("tabRelics");
    tabResearch.textContent = t("tabResearch");
    tabAscension.textContent = t("tabAscension");
    tabRecords.textContent = t("tabRecords");
    tabSeason.textContent = t("tabSeason");
    tabShop.textContent = t("tabShop");
    tabSettings.textContent = t("tabSettings");
    resultEyebrow.textContent = t("runOver");
    resultKillsLabel.textContent = t("kills");
    resultLevelLabel.textContent = t("level");
    resultBossLabel.textContent = t("boss");
    restartButton.textContent = t("retryNow");
    baseButton.textContent = t("backToBase");
  }

  function getCurrentMode() {
    return modeDefs[meta.selectedMode] ?? modeDefs.hunt;
  }

  function getCurrentRegion() {
    return regionDefs[meta.selectedRegion] ?? regionDefs.redcity;
  }

  function isCharacterUnlocked(id) {
    if (id === "cain") return true;
    if (id === "dex") return meta.bossKills >= 1;
    if (id === "ria") return meta.bossKills >= 2;
    if (id === "sera") return meta.bossKills >= 3;
    return false;
  }

  function isModeUnlocked(id) {
    if (id === "hunt") return true;
    if (id === "boss") return meta.bossKills >= 1;
    if (id === "rift") return meta.bossKills >= 2;
    if (id === "gauntlet") return meta.bossKills >= 3;
    return false;
  }

  function isRegionUnlocked(id) {
    if (id === "redcity") return true;
    if (id === "sanctuary") return meta.bossKills >= 1;
    if (id === "blacktide") return meta.seasonClears >= 1;
    return false;
  }

  function ensureSelectionsUnlocked() {
    if (!isCharacterUnlocked(meta.selectedCharacter)) meta.selectedCharacter = "cain";
    if (!isModeUnlocked(meta.selectedMode)) meta.selectedMode = "hunt";
    if (!isRegionUnlocked(meta.selectedRegion)) meta.selectedRegion = "redcity";
  }

  function getTotalResearch() {
    return meta.research.combat + meta.research.recovery + meta.research.harvest;
  }

  function getNonStarterLootCount() {
    return meta.inventory.filter((item) => !String(item.id).startsWith("starter-")).length;
  }

  function createRewardItem({ slot, rarity, name, affinity = "any", stats = {}, setId = null }) {
    const item = {
      id: `reward-${meta.nextItemId}`,
      slot,
      rarity,
      name,
      affinity,
      stats,
      setId,
    };
    meta.nextItemId += 1;
    meta.inventory.push(item);
    return item;
  }

  function getClaimableSeasonPassTiers() {
    return seasonDef.passTiers.filter(
      (tier) => meta.seasonPassXp >= tier.xp && !meta.seasonPassClaims.includes(tier.id),
    );
  }

  function claimSeasonPassTier(id) {
    const tier = seasonDef.passTiers.find((entry) => entry.id === id);
    if (!tier) return;
    if (meta.seasonPassClaims.includes(id)) return;
    if (meta.seasonPassXp < tier.xp) return;
    const summary = tier.claim(meta);
    meta.seasonPassClaims.push(id);
    meta.lastFtueRewards = [summary];
    processFtueMilestones();
    saveMeta();
    renderBase();
  }

  function getClaimableContracts() {
    return contractDefs.filter(
      (contract) => contract.isComplete() && !meta.contractClaims.includes(contract.id),
    );
  }

  function claimContract(id) {
    const contract = contractDefs.find((entry) => entry.id === id);
    if (!contract) return;
    if (meta.contractClaims.includes(id)) return;
    if (!contract.isComplete()) return;
    const summary = contract.claim(meta);
    meta.contractClaims.push(id);
    meta.lastFtueRewards = [summary];
    processFtueMilestones();
    saveMeta();
    renderBase();
  }

  function createHunterGiftWeapon(characterId = meta.selectedCharacter) {
    const gifts = {
      cain: {
        slot: "weapon",
        rarity: "epic",
        name: "Riot Cleaver",
        affinity: "cain",
        stats: { damage: 34, lifesteal: 0.04, rageGain: 0.12 },
        setId: "reaver",
      },
      dex: {
        slot: "weapon",
        rarity: "epic",
        name: "Pulse Lance",
        affinity: "dex",
        stats: { damage: 28, range: 28, xp: 0.08 },
        setId: "signal",
      },
      ria: {
        slot: "weapon",
        rarity: "epic",
        name: "Hex Needle",
        affinity: "ria",
        stats: { damage: 24, range: 26, reward: 0.08 },
        setId: "ruin",
      },
      sera: {
        slot: "weapon",
        rarity: "epic",
        name: "Blink Edge",
        affinity: "sera",
        stats: { damage: 28, attackSpeed: 0.07, executeBonus: 0.1 },
        setId: "blink",
      },
    };
    return createRewardItem(gifts[characterId] ?? gifts.cain);
  }

  function getFtueMilestones() {
    return [
      {
        id: "launch-cache",
        title: t("ftueLaunchTitle"),
        body: t("ftueLaunchBody"),
        rewardText: t("ftueLaunchReward"),
        progressText: () => fmt("ftueLaunchProgress", { count: Math.min(meta.runs, 1) }),
        isComplete: () => meta.runs >= 1,
        claim: () => {
          meta.gold += 90;
          meta.cores += 5;
          meta.data += 10;
          const item = createRewardItem({
            slot: "reactor",
            rarity: "rare",
            name: "Launch Coil",
            affinity: "any",
            stats: { damage: 12, xp: 0.06, reward: 0.04 },
          });
          return fmt("ftueLaunchSummary", { item: localizeItemName(item.name) });
        },
      },
      {
        id: "first-research",
        title: t("ftueResearchTitle"),
        body: t("ftueResearchBody"),
        rewardText: t("ftueResearchReward"),
        progressText: () => fmt("ftueResearchProgress", { count: Math.min(getTotalResearch(), 1) }),
        isComplete: () => getTotalResearch() >= 1,
        claim: () => {
          meta.gold += 80;
          meta.data += 12;
          const item = createRewardItem({
            slot: "armor",
            rarity: "rare",
            name: "Operator Mesh",
            affinity: "any",
            stats: { hp: 90, reward: 0.04 },
          });
          return fmt("ftueResearchSummary", { item: localizeItemName(item.name) });
        },
      },
      {
        id: "armory-online",
        title: t("ftueArmoryTitle"),
        body: t("ftueArmoryBody"),
        rewardText: t("ftueArmoryReward"),
        progressText: () => fmt("ftueArmoryProgress", { count: Math.min(getNonStarterLootCount(), 3) }),
        isComplete: () => getNonStarterLootCount() >= 3,
        claim: () => {
          meta.cores += 12;
          const item = createHunterGiftWeapon(meta.selectedCharacter);
          return fmt("ftueArmorySummary", { item: localizeItemName(item.name) });
        },
      },
      {
        id: "first-titan-package",
        title: t("ftueTitanTitle"),
        body: t("ftueTitanBody"),
        rewardText: t("ftueTitanReward"),
        progressText: () => fmt("ftueTitanProgress", { count: Math.min(meta.bossKills, 1) }),
        isComplete: () => meta.bossKills >= 1,
        claim: () => {
          meta.gold += 140;
          meta.genes += 8;
          const item = createRewardItem({
            slot: "weapon",
            rarity: "rare",
            name: "Factory Pulse Lance",
            affinity: "dex",
            stats: { damage: 24, range: 24, xp: 0.06 },
            setId: "signal",
          });
          return fmt("ftueTitanSummary", { item: localizeItemName(item.name) });
        },
      },
      {
        id: "genome-bank",
        title: t("ftueGenomeTitle"),
        body: t("ftueGenomeBody"),
        rewardText: t("ftueGenomeReward"),
        progressText: () => fmt("ftueGenomeProgress", { count: Math.min(meta.worldBossWins, 1) }),
        isComplete: () => meta.worldBossWins >= 1,
        claim: () => {
          meta.genes += 14;
          const item = createRewardItem({
            slot: "reactor",
            rarity: "epic",
            name: "Genome Cell",
            affinity: "any",
            stats: { hp: 72, bossDamage: 0.12, reward: 0.08 },
          });
          return fmt("ftueGenomeSummary", { item: localizeItemName(item.name) });
        },
      },
      {
        id: "season-break",
        title: t("ftueSeasonTitle"),
        body: t("ftueSeasonBody"),
        rewardText: t("ftueSeasonReward"),
        progressText: () => fmt("ftueSeasonProgress", { count: Math.min(meta.seasonClears, 1) }),
        isComplete: () => meta.seasonClears >= 1,
        claim: () => {
          meta.gold += 160;
          meta.data += 18;
          const item = createRewardItem({
            slot: "armor",
            rarity: "legendary",
            name: "Crimson Archive",
            affinity: "any",
            stats: { hp: 128, bossDamage: 0.1, reward: 0.1 },
          });
          return fmt("ftueSeasonSummary", { item: localizeItemName(item.name) });
        },
      },
    ];
  }

  function processFtueMilestones() {
    const granted = [];
    for (const milestone of getFtueMilestones()) {
      if (meta.ftueClaims.includes(milestone.id)) continue;
      if (!milestone.isComplete()) continue;
      const summary = milestone.claim();
      meta.ftueClaims.push(milestone.id);
      granted.push(summary);
    }
    if (granted.length > 0) {
      meta.lastFtueRewards = granted.slice(-3);
    }
    return granted;
  }

  function renderFtueTrack() {
    const cards = getFtueMilestones()
      .map((milestone) => {
        const claimed = meta.ftueClaims.includes(milestone.id);
        const ready = !claimed && milestone.isComplete();
        const tone = claimed ? "legendary" : ready ? "epic" : "common";
        const label = claimed ? t("ftueClaimed") : ready ? t("ftueReady") : fmt("ftueProgress", { progress: milestone.progressText() });
        return `
          <article class="loot-card loot-card--${tone}">
            <span class="loot-card__label">${label}</span>
            <h2 class="loot-card__title">${milestone.title}</h2>
            <p class="loot-card__body">${milestone.body}</p>
            <p class="loot-card__body">${milestone.rewardText}</p>
          </article>
        `;
      })
      .join("");

    const notice = meta.lastFtueRewards.length > 0
      ? `<div class="ftue-track__notice">${fmt("ftueLatestCache", { items: meta.lastFtueRewards.join(" // ") })}</div>`
      : "";

    return `
      ${notice}
      <div class="ftue-track__grid">${cards}</div>
    `;
  }

  function getFtueObjective() {
    const nextMilestone = getFtueMilestones().find((milestone) => !meta.ftueClaims.includes(milestone.id));
    if (nextMilestone) {
      return {
        title: nextMilestone.title,
        body: `${nextMilestone.body} Reward: ${nextMilestone.rewardText}.`,
      };
    }
    if (meta.bossKills < 3) {
      return {
        title: t("objectiveFarmRelicsTitle"),
        body: fmt("objectiveFarmRelicsBody", { count: 3 - meta.bossKills }),
      };
    }
    return {
      title: t("objectivePushTitle"),
      body: t("objectivePushBody"),
    };
  }

  function pushEvent(text, duration = 3.2) {
    eventBanner.text = text;
    eventBanner.timer = duration;
  }

  function ensureAudioContext() {
    if (!meta.settings?.sound) return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioContext) audioContext = new Ctx();
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  function playTone(kind) {
    if (!meta.settings?.sound) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    let freq = 280;
    let duration = 0.08;
    let type = "sine";
    let volume = 0.03;

    if (kind === "dash") {
      freq = 220;
      duration = 0.05;
      type = "triangle";
    } else if (kind === "level") {
      freq = 520;
      duration = 0.11;
      type = "square";
      volume = 0.04;
    } else if (kind === "boss") {
      freq = 140;
      duration = 0.18;
      type = "sawtooth";
      volume = 0.05;
    } else if (kind === "finish") {
      freq = 660;
      duration = 0.22;
      type = "triangle";
      volume = 0.05;
    }

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (kind === "finish") {
      osc.frequency.exponentialRampToValueAtTime(420, now + duration);
    } else {
      osc.frequency.exponentialRampToValueAtTime(freq * 1.06, now + duration);
    }
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.start(now);
    osc.stop(now + duration);
  }

  function pulseVibration(pattern) {
    if (!meta.settings?.vibration) return;
    if (typeof navigator.vibrate !== "function") return;
    navigator.vibrate(pattern);
  }

  function defaultMeta() {
    const starters = createStarterInventory();
    return {
      seenIntro: false,
      gold: 0,
      cores: 0,
      data: 0,
      genes: 0,
      seasonClears: 0,
      seasonPassXp: 0,
      seasonPassClaims: [],
      contractClaims: [],
      worldBossWins: 0,
      riftWins: 0,
      huntBestKills: 0,
      bossBestTime: 0,
      riftBestKills: 0,
      regionRecords: {},
      regionClears: {},
      gauntletWins: 0,
      gauntletBest: 0,
      gauntletBoard: [],
      recentRuns: [],
      runs: 0,
      bestKills: 0,
      bossKills: 0,
      salvageCount: 0,
      selectedCharacter: "cain",
      selectedMode: "hunt",
      selectedRegion: "redcity",
      seenRegionUnlocks: ["redcity"],
      announcedRegionUnlocks: ["redcity"],
      cosmeticPreview: { cain: 0, dex: 0, ria: 0, sera: 0 },
      nextItemId: 4,
      inventory: starters.inventory,
      equippedGear: starters.equippedGear,
      research: { combat: 0, recovery: 0, harvest: 0 },
      ascension: { overkill: 0, mobility: 0, genome: 0 },
      awakenings: { cain: 0, dex: 0, ria: 0, sera: 0 },
      settings: { sound: true, vibration: true, language: "en" },
      unlockedRelics: ["blood-idol", "dash-fang"],
      equippedRelics: ["blood-idol", "dash-fang"],
      ftueClaims: [],
      lastFtueRewards: [],
    };
  }

  function loadMeta() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultMeta();
      const merged = { ...defaultMeta(), ...JSON.parse(raw) };
      merged.cosmeticPreview = {
        cain: 0,
        dex: 0,
        ria: 0,
        sera: 0,
        ...(merged.cosmeticPreview ?? {}),
      };
      merged.seenRegionUnlocks = Array.isArray(merged.seenRegionUnlocks)
        ? merged.seenRegionUnlocks
        : ["redcity"];
      merged.announcedRegionUnlocks = Array.isArray(merged.announcedRegionUnlocks)
        ? merged.announcedRegionUnlocks
        : ["redcity"];
      hydrateInventory(merged);
      return merged;
    } catch {
      return defaultMeta();
    }
  }

  function saveMeta() {
    ensureSelectionsUnlocked();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  }

  function createStarterInventory() {
    const inventory = [
      {
        id: "starter-weapon",
        slot: "weapon",
        rarity: "common",
        name: "Junker Cleaver",
        affinity: "any",
        stats: { damage: 12, attackSpeed: 0.01 },
      },
      {
        id: "starter-armor",
        slot: "armor",
        rarity: "common",
        name: "Street Plate",
        affinity: "any",
        stats: { hp: 70 },
      },
      {
        id: "starter-reactor",
        slot: "reactor",
        rarity: "common",
        name: "Scrap Reactor",
        affinity: "any",
        stats: { rageGain: 0.08, dashReduction: 0.06 },
      },
    ];

    return {
      inventory,
      equippedGear: {
        weapon: "starter-weapon",
        armor: "starter-armor",
        reactor: "starter-reactor",
      },
    };
  }

  function hydrateInventory(metaState) {
    if (!Array.isArray(metaState.inventory) || !metaState.equippedGear) {
      const starters = createStarterInventory();
      const legacy = metaState.gear ?? { blade: 0, armor: 0, reactor: 0 };
      metaState.inventory = starters.inventory.map((item) => {
        if (item.slot === "weapon") item.stats.damage += legacy.blade * 10;
        if (item.slot === "armor") item.stats.hp += legacy.armor * 65;
        if (item.slot === "reactor") {
          item.stats.rageGain += legacy.reactor * 0.08;
          item.stats.dashReduction += legacy.reactor * 0.05;
        }
        return item;
      });
      metaState.equippedGear = starters.equippedGear;
      metaState.nextItemId = 4;
    }

    if (typeof metaState.nextItemId !== "number") {
      metaState.nextItemId = metaState.inventory.length + 1;
    }

    if (!Array.isArray(metaState.gauntletBoard)) {
      metaState.gauntletBoard = [];
    }

    if (!Array.isArray(metaState.recentRuns)) {
      metaState.recentRuns = [];
    }

    if (typeof metaState.gauntletBest !== "number") {
      metaState.gauntletBest = 0;
    }

    if (typeof metaState.huntBestKills !== "number") {
      metaState.huntBestKills = 0;
    }

    if (typeof metaState.bossBestTime !== "number") {
      metaState.bossBestTime = 0;
    }

    if (typeof metaState.riftBestKills !== "number") {
      metaState.riftBestKills = 0;
    }

    if (!metaState.regionRecords || typeof metaState.regionRecords !== "object") {
      metaState.regionRecords = {};
    }

    if (!metaState.regionClears || typeof metaState.regionClears !== "object") {
      metaState.regionClears = {};
    }
  }

  function getEquippedItem(slot) {
    const id = meta.equippedGear?.[slot];
    return meta.inventory.find((item) => item.id === id) ?? null;
  }

  function getAffinityLabel(item) {
    if (!item || item.affinity === "any") return t("anyHunter");
    if (item.affinity === "cain") return t("syncCain");
    if (item.affinity === "dex") return t("syncDex");
    if (item.affinity === "ria") return t("syncRia");
    return t("syncSera");
  }

  function getSetName(setId) {
    if (!setId || !gearSetDefs[setId]) return null;
    return lt(gearSetDefs[setId].name);
  }

  function getAffinityMultiplier(item, characterId) {
    if (!item || item.affinity === "any") return 1;
    return item.affinity === characterId ? 1.12 : 1;
  }

  function getActiveSetCounts() {
    const counts = {};
    for (const slot of gearSlots) {
      const item = getEquippedItem(slot.id);
      if (!item?.setId) continue;
      counts[item.setId] = (counts[item.setId] ?? 0) + 1;
    }
    return counts;
  }

  function getEffectiveItemStats(item, characterId) {
    const stats = {};
    const mult = getAffinityMultiplier(item, characterId);
    for (const [key, value] of Object.entries(item.stats)) {
      if (key === "damage" || key === "hp" || key === "range") {
        stats[key] = Math.round(value * mult);
      } else {
        stats[key] = Number((value * mult).toFixed(3));
      }
    }
    return stats;
  }

  function formatPercent(value) {
    return `${Math.round(value * 100)}%`;
  }

  function describeItemStats(item, characterId = meta.selectedCharacter) {
    const effective = getEffectiveItemStats(item, characterId);
    const stats = [];
    if (effective.damage) stats.push(`${t("statDamage")} +${effective.damage}`);
    if (effective.hp) stats.push(`${t("statHp")} +${effective.hp}`);
    if (effective.attackSpeed) stats.push(`${t("statAttackSpeed")} +${formatPercent(effective.attackSpeed)}`);
    if (effective.range) stats.push(`${t("statRange")} +${effective.range}`);
    if (effective.lifesteal) stats.push(`${t("statLifesteal")} +${formatPercent(effective.lifesteal)}`);
    if (effective.executeBonus) stats.push(`${t("statExecute")} +${formatPercent(effective.executeBonus)}`);
    if (effective.rageGain) stats.push(`${t("statRage")} +${formatPercent(effective.rageGain)}`);
    if (effective.dashReduction) stats.push(`${t("statDash")} -${formatPercent(effective.dashReduction)}`);
    if (effective.reward) stats.push(`${t("statReward")} +${formatPercent(effective.reward)}`);
    if (effective.xp) stats.push(`${t("statXp")} +${formatPercent(effective.xp)}`);
    if (effective.bossDamage) stats.push(`${t("statBoss")} +${formatPercent(effective.bossDamage)}`);
    if (getAffinityMultiplier(item, characterId) > 1) stats.push(t("statSync"));
    if (item.setId && gearSetDefs[item.setId]) stats.push(gearSetDefs[item.setId].name);
    return stats.join(" // ");
  }

  function estimateItemPower(item, characterId = meta.selectedCharacter) {
    const stats = getEffectiveItemStats(item, characterId);
    let score = 0;
    score += stats.damage ? stats.damage * 1.6 : 0;
    score += stats.hp ? stats.hp * 0.24 : 0;
    score += stats.attackSpeed ? stats.attackSpeed * 260 : 0;
    score += stats.range ? stats.range * 0.5 : 0;
    score += stats.lifesteal ? stats.lifesteal * 900 : 0;
    score += stats.executeBonus ? stats.executeBonus * 260 : 0;
    score += stats.rageGain ? stats.rageGain * 220 : 0;
    score += stats.dashReduction ? stats.dashReduction * 220 : 0;
    score += stats.reward ? stats.reward * 180 : 0;
    score += stats.xp ? stats.xp * 180 : 0;
    score += stats.bossDamage ? stats.bossDamage * 260 : 0;
    return Math.round(score);
  }

  function getResultModeSummary(modeId) {
    if (modeId === "boss") {
      return {
        title: t("resultModeBossTitle"),
        body: t("resultModeBossBody"),
        tone: "boss",
      };
    }
    if (modeId === "rift") {
      return {
        title: t("resultModeRiftTitle"),
        body: t("resultModeRiftBody"),
        tone: "rift",
      };
    }
    if (modeId === "gauntlet") {
      return {
        title: t("resultModeGauntletTitle"),
        body: t("resultModeGauntletBody"),
        tone: "gauntlet",
      };
    }
    return {
      title: t("resultModeHuntTitle"),
      body: t("resultModeHuntBody"),
      tone: "hunt",
    };
  }

  function renderResultRewards() {
    const mode = getCurrentMode();
    const modeSummary = getResultModeSummary(mode.id);
    resultRewardStrip.innerHTML = `
      <article class="reward-chip reward-chip--mode reward-chip--${modeSummary.tone}">
        <span class="reward-chip__label">${t("resultModeLabel")}</span>
        <strong class="reward-chip__value">${getModeCopy(mode.id, "name")}</strong>
      </article>
      <article class="reward-chip">
        <span class="reward-chip__label">${t("gold").toUpperCase()}</span>
        <strong class="reward-chip__value">+${currentRewards.gold}</strong>
      </article>
      <article class="reward-chip">
        <span class="reward-chip__label">${t("cores").toUpperCase()}</span>
        <strong class="reward-chip__value">+${currentRewards.cores}</strong>
      </article>
      <article class="reward-chip">
        <span class="reward-chip__label">${t("data").toUpperCase()}</span>
        <strong class="reward-chip__value">+${currentRewards.data}</strong>
      </article>
      <article class="reward-chip">
        <span class="reward-chip__label">${t("genes").toUpperCase()}</span>
        <strong class="reward-chip__value">+${currentRewards.genes}</strong>
      </article>
    `;

    if (!currentRewards.droppedItems?.length) {
      resultLootGrid.innerHTML = `
        <article class="loot-card loot-card--${modeSummary.tone === "boss" ? "epic" : modeSummary.tone === "rift" ? "rare" : "common"} loot-card--${modeSummary.tone}">
          <span class="loot-card__label">${t("resultModeLabel")} // ${getModeCopy(mode.id, "name")}</span>
          <h2 class="loot-card__title">${modeSummary.title}</h2>
          <p class="loot-card__body">${modeSummary.body}</p>
        </article>
      `;
      return;
    }

    resultLootGrid.innerHTML = currentRewards.droppedItems
      .map((item, index) => {
        const rarity = rarityDefs[item.rarity];
        const slot = gearSlots.find((entry) => entry.id === item.slot);
        const equipped = meta.equippedGear[item.slot] === item.id;
        const current = getEquippedItem(item.slot);
        const delta = estimateItemPower(item, meta.selectedCharacter) - (current ? estimateItemPower(current, meta.selectedCharacter) : 0);
        const sourceLabel =
          item.sourceMode === "boss"
            ? t("lootSourceBoss")
            : item.sourceMode === "rift"
              ? t("lootSourceRift")
              : item.sourceMode === "gauntlet"
                ? t("lootSourceGauntlet")
              : t("lootSourceHunt");
        const toneClass =
          item.sourceMode === "boss"
            ? "loot-card--boss"
            : item.sourceMode === "rift"
              ? "loot-card--rift"
              : item.sourceMode === "gauntlet"
                ? "loot-card--gauntlet"
              : "loot-card--hunt";
        return `
          ${index === 0 ? `<article class="loot-card loot-card--${modeSummary.tone === "boss" ? "epic" : modeSummary.tone === "rift" ? "rare" : "common"} ${toneClass}">
            <span class="loot-card__label">${t("resultModeLabel")} // ${getModeCopy(mode.id, "name")}</span>
            <h2 class="loot-card__title">${modeSummary.title}</h2>
            <p class="loot-card__body">${modeSummary.body}</p>
          </article>` : ""}
          <article class="loot-card loot-card--${item.rarity} ${toneClass}">
            <span class="loot-card__label">${rarity.label} ${slot ? slotTitle(slot.id).toUpperCase() : slotTitle(item.slot).toUpperCase()} // ${getAffinityLabel(item)} // ${sourceLabel}</span>
            <h2 class="loot-card__title">${localizeItemName(item.name)}</h2>
            <p class="loot-card__body">${describeItemStats(item, meta.selectedCharacter)}</p>
            <p class="loot-card__body">${current ? fmt("powerVsEquipped", { delta: `${delta >= 0 ? "+" : ""}${delta}` }) : fmt("powerStandalone", { power: estimateItemPower(item, meta.selectedCharacter) })}</p>
            <button class="upgrade-button${equipped ? " is-equipped" : ""}" data-action="equip-result-item" data-id="${item.id}" type="button">
              <span class="upgrade-button__title">${equipped ? t("resultEquippedNextRun") : t("resultEquipNow")}</span>
              <span class="upgrade-button__body">${equipped ? t("resultAlreadyActive") : t("resultSwapNow")}</span>
            </button>
          </article>
        `;
      })
      .join("");
  }

  function renderSeasonResult() {
    const progress = currentRewards.seasonProgress;
    if (!progress) {
      resultSeasonProgress.innerHTML = "";
      return;
    }

    const unlockedText = currentRewards.seasonPassUnlocked?.length
      ? currentRewards.seasonPassUnlocked.map((tier) => getPassTierCopy(tier.id, "title") || tier.title).join(" // ")
      : t("seasonNoNewPassTier");

    resultSeasonProgress.innerHTML = `
      <article class="loot-card ${progress.completed ? "loot-card--legendary" : "loot-card--rare"}">
        <span class="loot-card__label">${t("seasonHuntKills")}</span>
        <h2 class="loot-card__title">${progress.kills}/${seasonDef.killTarget}</h2>
        <p class="loot-card__body">${fmt("seasonReachKills", { kills: seasonDef.killTarget })}</p>
      </article>
      <article class="loot-card ${progress.completed ? "loot-card--legendary" : "loot-card--rare"}">
        <span class="loot-card__label">${t("seasonHuntWeakpoints")}</span>
        <h2 class="loot-card__title">${progress.weakpoints}/${seasonDef.weakpointTarget}</h2>
        <p class="loot-card__body">${t("seasonBreakWeakpoint")}</p>
      </article>
      <article class="loot-card ${progress.completed ? "loot-card--legendary" : "loot-card--common"}">
        <span class="loot-card__label">${progress.completed ? t("seasonBreakpointCleared") : t("seasonBreakpointProgress")}</span>
        <h2 class="loot-card__title">${seasonDef.rewardLabel}</h2>
        <p class="loot-card__body">${seasonDef.rewardBody}</p>
      </article>
      <article class="loot-card ${currentRewards.seasonPassUnlocked?.length ? "loot-card--epic" : "loot-card--common"}">
        <span class="loot-card__label">${fmt("seasonPassGain", { xp: currentRewards.seasonPassGain ?? 0 })}</span>
        <h2 class="loot-card__title">${fmt("seasonTotalXp", { xp: meta.seasonPassXp })}</h2>
        <p class="loot-card__body">${unlockedText}</p>
      </article>
      ${renderShopSpotlightCard(getCurrentMode().id)}
    `;
  }

  function generateLootDrop({ victory, modeId }) {
    const slot = gearSlots[Math.floor(Math.random() * gearSlots.length)].id;
    const selectedCharacter = meta.selectedCharacter;
    const region = getCurrentRegion();
    const pool = lootPools[slot].filter(
      (entry) => !entry.regions || entry.regions.includes(region.id),
    );
    const favored = pool.filter(
      (entry) => entry.affinity === "any" || entry.affinity === selectedCharacter,
    );
    const sourcePool = Math.random() < 0.7 ? favored : pool;
    const base = sourcePool[Math.floor(Math.random() * sourcePool.length)];

    let rarity = "common";
    const roll = Math.random();
    if (modeId === "boss") {
      rarity = roll > 0.86 ? "legendary" : roll > 0.56 ? "epic" : roll > 0.18 ? "rare" : "common";
    } else if (modeId === "gauntlet") {
      rarity = roll > 0.9 ? "legendary" : roll > 0.58 ? "epic" : roll > 0.22 ? "rare" : "common";
    } else if (victory) {
      rarity = roll > 0.92 ? "legendary" : roll > 0.64 ? "epic" : roll > 0.28 ? "rare" : "common";
    } else {
      rarity = roll > 0.9 ? "epic" : roll > 0.5 ? "rare" : "common";
    }

    const rarityDef = rarityDefs[rarity];
    const stats = {};
    for (const [key, value] of Object.entries(base.stats)) {
      if (key === "damage" || key === "hp" || key === "range") {
        stats[key] = Math.round(value * rarityDef.mult);
      } else {
        stats[key] = Number((value * (1 + (rarityDef.mult - 1) * 0.7)).toFixed(3));
      }
    }

    const item = {
      id: `loot-${meta.nextItemId}`,
      slot,
      rarity,
      name: `${rarityDef.label} ${base.name}`,
      affinity: base.affinity,
      setId: base.setId ?? null,
      sourceMode: modeId,
      stats,
    };

    if (modeId === "boss") {
      item.name = region.id === "blacktide" ? `Leviathanforged ${base.name}` : `Titanforged ${base.name}`;
      if (slot === "weapon") {
        item.stats.damage = (item.stats.damage ?? 0) + 6;
        item.stats.bossDamage = Number(((item.stats.bossDamage ?? 0) + 0.08).toFixed(3));
      } else if (slot === "armor") {
        item.stats.hp = (item.stats.hp ?? 0) + 40;
        item.stats.bossDamage = Number(((item.stats.bossDamage ?? 0) + 0.05).toFixed(3));
      } else {
        item.stats.bossDamage = Number(((item.stats.bossDamage ?? 0) + 0.1).toFixed(3));
        item.stats.reward = Number(((item.stats.reward ?? 0) + 0.05).toFixed(3));
      }
    } else if (modeId === "rift") {
      item.name =
        region.id === "blacktide"
          ? `Undertow ${base.name}`
          : region.id === "sanctuary"
            ? `Fracturecast ${base.name}`
            : `Collapseforged ${base.name}`;
      if (slot === "weapon") {
        item.stats.damage = (item.stats.damage ?? 0) + 4;
        item.stats.range = (item.stats.range ?? 0) + 10;
      } else if (slot === "armor") {
        item.stats.hp = (item.stats.hp ?? 0) + 24;
        item.stats.reward = Number(((item.stats.reward ?? 0) + 0.05).toFixed(3));
      } else {
        item.stats.xp = Number(((item.stats.xp ?? 0) + 0.05).toFixed(3));
        item.stats.reward = Number(((item.stats.reward ?? 0) + 0.04).toFixed(3));
      }
    } else if (modeId === "gauntlet") {
      item.name =
        region.id === "blacktide"
          ? `Undercurrent ${base.name}`
          : region.id === "sanctuary"
            ? `Overclock Ward ${base.name}`
            : `Killchain ${base.name}`;
      if (slot === "weapon") {
        item.stats.damage = (item.stats.damage ?? 0) + 5;
        item.stats.attackSpeed = Number(((item.stats.attackSpeed ?? 0) + 0.04).toFixed(3));
      } else if (slot === "armor") {
        item.stats.hp = (item.stats.hp ?? 0) + 30;
        item.stats.reward = Number(((item.stats.reward ?? 0) + 0.05).toFixed(3));
      } else {
        item.stats.xp = Number(((item.stats.xp ?? 0) + 0.06).toFixed(3));
        item.stats.attackSpeed = Number(((item.stats.attackSpeed ?? 0) + 0.03).toFixed(3));
      }
    } else if (region.id === "blacktide") {
      item.name = `Tideworn ${base.name}`;
      if (slot === "weapon") {
        item.stats.range = (item.stats.range ?? 0) + 12;
      } else if (slot === "armor") {
        item.stats.reward = Number(((item.stats.reward ?? 0) + 0.04).toFixed(3));
      } else {
        item.stats.xp = Number(((item.stats.xp ?? 0) + 0.04).toFixed(3));
      }
    }

    meta.nextItemId += 1;
    return item;
  }

  function getRelic(id) {
    return relicDefs.find((item) => item.id === id);
  }

  function computePower() {
    let score = 100;
    for (const slot of gearSlots) {
      const item = getEquippedItem(slot.id);
      if (!item) continue;
      const stats = getEffectiveItemStats(item, meta.selectedCharacter);
      score += stats.damage ? stats.damage * 1.6 : 0;
      score += stats.hp ? stats.hp * 0.24 : 0;
      score += stats.attackSpeed ? stats.attackSpeed * 260 : 0;
      score += stats.range ? stats.range * 0.5 : 0;
      score += stats.lifesteal ? stats.lifesteal * 900 : 0;
      score += stats.executeBonus ? stats.executeBonus * 260 : 0;
      score += stats.rageGain ? stats.rageGain * 220 : 0;
      score += stats.dashReduction ? stats.dashReduction * 220 : 0;
      score += stats.reward ? stats.reward * 180 : 0;
      score += stats.xp ? stats.xp * 180 : 0;
      score += stats.bossDamage ? stats.bossDamage * 260 : 0;
    }
    score += meta.research.combat * 18;
    score += meta.research.recovery * 14;
    score += meta.research.harvest * 12;
    score += meta.ascension.overkill * 34;
    score += meta.ascension.mobility * 22;
    score += meta.ascension.genome * 26;
    score += (meta.awakenings[meta.selectedCharacter] ?? 0) * 58;
    score += meta.equippedRelics.filter(Boolean).length * 26;
    score += meta.bossKills * 28;
    for (const count of Object.values(getActiveSetCounts())) {
      if (count >= 2) score += 42;
      if (count >= 3) score += 76;
    }
    if (meta.selectedCharacter === "dex") score += 24;
    if (meta.selectedMode === "boss") score += 16;
    if (meta.selectedMode === "rift") score += 12;
    return score;
  }

  function createPlayerFromMeta() {
    const character = characterDefs[meta.selectedCharacter] ?? characterDefs.cain;
    const base = character.base;
    const nextPlayer = {
      characterId: character.id,
      attackStyle: character.attackStyle,
      color: character.color,
      rageColor: character.rageColor,
      shotColor: character.id === "ria" ? "rgba(216, 140, 255, 0.48)" : "rgba(130, 232, 210, 0.46)",
      x: 0,
      y: 0,
      radius: 20,
      hp: base.hp,
      maxHp: base.hp,
      speed: base.speed,
      damage: base.damage,
      attackRange: base.attackRange,
      attackCooldown: base.attackCooldown,
      attackTimer: 0,
      attackArc: base.attackArc,
      slashDuration: 0.12,
      slashFlash: 0,
      shotFlash: 0,
      projectileBurst: 0,
      hexChains: 0,
      curseThreshold: 4,
      curseBurstDamage: 30,
      curseBurstRadius: 110,
      curseEchoGain: 0,
      blinkStrikeRange: 84,
      dashRefundOnKill: 0,
      killRushTimer: 0,
      killRushBonus: 0,
      lastShotX: 0,
      lastShotY: 0,
      facingX: 1,
      facingY: 0,
      xp: 0,
      xpMultiplier: 1,
      level: 1,
      nextXp: 26,
      kills: 0,
      rage: 0,
      maxRage: 100,
      rageGainMultiplier: 1,
      rageModeTimer: 0,
      ultimateCooldown: 0,
      ultimateMaxCooldown: base.ultCooldown ?? 22,
      overdriveTimer: 0,
      dashCooldown: base.dashCooldown,
      dashTimer: 0,
      dashBurstTimer: 0,
      lifesteal: 0,
      executeBonus: 0,
      orbitCount: 0,
      explosionKillsThreshold: 4,
      explosionDamageBonus: 0,
      hasDashTrail: false,
      staggerPower: 26,
      bossDamageMultiplier: 1,
      rewardMultiplier: 1,
      seasonRewardBonus: 0,
      seasonStacks: 0,
      seasonStackCap: 10,
      seasonTimer: 0,
      seasonDecayRate: 2.4,
      seasonWeakpoints: 0,
      selectedUpgrades: [],
    };

    nextPlayer.damage += meta.research.combat * 8;
    nextPlayer.maxHp += meta.research.recovery * 35;
    nextPlayer.hp = nextPlayer.maxHp;
    nextPlayer.lifesteal += meta.research.recovery * 0.004;
    nextPlayer.xpMultiplier += meta.research.harvest * 0.08;
    nextPlayer.rewardMultiplier += meta.research.harvest * 0.08;
    nextPlayer.damage += meta.ascension.overkill * 12;
    nextPlayer.bossDamageMultiplier += meta.ascension.overkill * 0.08;
    nextPlayer.speed += meta.ascension.mobility * 14;
    nextPlayer.dashCooldown *= Math.max(0.72, 1 - meta.ascension.mobility * 0.05);
    nextPlayer.maxHp += meta.ascension.genome * 55;
    nextPlayer.hp = nextPlayer.maxHp;
    nextPlayer.xpMultiplier += meta.ascension.genome * 0.05;
    nextPlayer.rewardMultiplier += meta.ascension.genome * 0.05;

    if (meta.awakenings.cain && character.id === "cain") {
      nextPlayer.rageGainMultiplier += 0.35;
      nextPlayer.lifesteal += 0.04;
      nextPlayer.damage += 10;
    }
    if (meta.awakenings.dex && character.id === "dex") {
      nextPlayer.projectileBurst += 1;
      nextPlayer.orbitCount += 1;
      nextPlayer.rewardMultiplier += 0.08;
    }
    if (meta.awakenings.ria && character.id === "ria") {
      nextPlayer.hexChains += 1;
      nextPlayer.curseBurstDamage += 22;
      nextPlayer.curseThreshold = Math.max(2, nextPlayer.curseThreshold - 1);
    }
    if (meta.awakenings.sera && character.id === "sera") {
      nextPlayer.dashRefundOnKill += 0.25;
      nextPlayer.executeBonus += 0.18;
      nextPlayer.killRushBonus += 0.12;
    }

    for (const slot of gearSlots) {
      const item = getEquippedItem(slot.id);
      if (!item) continue;
      const stats = getEffectiveItemStats(item, character.id);
      if (stats.damage) nextPlayer.damage += stats.damage;
      if (stats.hp) {
        nextPlayer.maxHp += stats.hp;
        nextPlayer.hp += stats.hp;
      }
      if (stats.attackSpeed) {
        nextPlayer.attackCooldown *= Math.max(0.55, 1 - stats.attackSpeed);
      }
      if (stats.range) nextPlayer.attackRange += stats.range;
      if (stats.lifesteal) nextPlayer.lifesteal += stats.lifesteal;
      if (stats.executeBonus) nextPlayer.executeBonus += stats.executeBonus;
      if (stats.rageGain) nextPlayer.rageGainMultiplier += stats.rageGain;
      if (stats.dashReduction) {
        nextPlayer.dashCooldown = Math.max(
          2.2,
          nextPlayer.dashCooldown * (1 - stats.dashReduction),
        );
      }
      if (stats.reward) nextPlayer.rewardMultiplier += stats.reward;
      if (stats.xp) nextPlayer.xpMultiplier += stats.xp;
      if (stats.bossDamage) nextPlayer.bossDamageMultiplier += stats.bossDamage;
    }

    for (const [setId, count] of Object.entries(getActiveSetCounts())) {
      gearSetDefs[setId]?.apply(nextPlayer, count);
    }

    character.passive(nextPlayer);

    for (const relicId of meta.equippedRelics) {
      const relic = getRelic(relicId);
      if (relic) relic.apply(nextPlayer);
    }

    return nextPlayer;
  }

  function createEnemy(type, x, y) {
    const region = getCurrentRegion();
    if (type === "charger") {
      return {
        kind: "enemy",
        type,
        x,
        y,
        radius: 16,
        hp: 52,
        maxHp: 52,
        speed: 120,
        color: region.enemyColors.charger,
        touchDamage: 18,
        dashReady: 1.6,
        dashTimer: 1.6,
      };
    }

    if (type === "shooter") {
      return {
        kind: "enemy",
        type,
        x,
        y,
        radius: 15,
        hp: 44,
        maxHp: 44,
        speed: 78,
        color: region.enemyColors.shooter,
        touchDamage: 10,
        shotTimer: 1.8,
      };
    }

    if (type === "drifter") {
      return {
        kind: "enemy",
        type,
        x,
        y,
        radius: 17,
        hp: 56,
        maxHp: 56,
        speed: 92,
        color: region.enemyColors.drifter ?? region.enemyColors.shooter,
        touchDamage: 12,
        shotTimer: 1.5,
        orbitDir: Math.random() < 0.5 ? -1 : 1,
      };
    }

    if (type === "warden") {
      return {
        kind: "enemy",
        type,
        x,
        y,
        radius: 24,
        hp: 176,
        maxHp: 176,
        speed: 74,
        color: region.enemyColors.warden ?? region.enemyColors.elite,
        touchDamage: 20,
        shotTimer: 2.1,
        pulseTimer: 2.8,
        orbitDir: Math.random() < 0.5 ? -1 : 1,
      };
    }

    if (type === "elite") {
      return {
        kind: "enemy",
        type,
        x,
        y,
        radius: 28,
        hp: 220,
        maxHp: 220,
        speed: 64,
        color: region.enemyColors.elite,
        touchDamage: 32,
        pulseTimer: 2.2,
      };
    }

    return {
      kind: "enemy",
      type: "grunt",
      x,
      y,
      radius: 14,
      hp: 32,
      maxHp: 32,
      speed: 94,
      color: region.enemyColors.grunt,
      touchDamage: 14,
    };
  }

  function createBoss() {
    const region = getCurrentRegion();
    const isSanctuary = region.id === "sanctuary";
    const isBlacktide = region.id === "blacktide";
    return {
      kind: "boss",
      regionId: region.id,
      name: getRegionCopy(region.id, "bossName") || region.bossName,
      bodyColor: region.bossColor,
      coreColor: region.coreColor,
      projectileColor: isBlacktide ? "#a9fff2" : isSanctuary ? "#b8fff4" : "#ffcb70",
      projectileColorHot: isBlacktide ? "#dbfffb" : isSanctuary ? "#dffffb" : "#ffe5a1",
      x: player.x + 420,
      y: player.y - 120,
      radius: 62,
      hp: isBlacktide ? 1760 : isSanctuary ? 1680 : 1800,
      maxHp: isBlacktide ? 1760 : isSanctuary ? 1680 : 1800,
      speed: isBlacktide ? 46 : isSanctuary ? 42 : 48,
      shielded: true,
      bodyDamage: isBlacktide ? 16 : isSanctuary ? 14 : 18,
      ringTimer: isBlacktide ? 2.9 : isSanctuary ? 2.6 : 3.2,
      slamTimer: isBlacktide ? 5.8 : isSanctuary ? 6.4 : 5.5,
      volleyTimer: isBlacktide ? 2.1 : isSanctuary ? 2.3 : 9.9,
      warningVolley: false,
      warningRing: false,
      warningSlam: false,
      mortarTargets: [],
      weakpoints: [
        { id: "left", hp: 240, maxHp: 240, alive: true, ox: -74, oy: -44, radius: 24 },
        { id: "right", hp: 240, maxHp: 240, alive: true, ox: 74, oy: -44, radius: 24 },
      ],
    };
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function normalize(x, y) {
    const len = Math.hypot(x, y) || 1;
    return { x: x / len, y: y / len };
  }

  function worldToScreen(x, y) {
    return {
      x: x - player.x + window.innerWidth / 2,
      y: y - player.y + window.innerHeight / 2,
    };
  }

  function addEffect(x, y, radius, color, life) {
    visualEffects.push({ x, y, radius, color, life, maxLife: life });
  }

  function addFloatingText(x, y, text, color = "#fff4d8", life = 0.42, size = 16) {
    floatingTexts.push({ x, y, text: String(text), color, life, maxLife: life, size });
  }

  function shakeScreen(power = 8, duration = 0.16) {
    cameraShake.time = Math.max(cameraShake.time, duration);
    cameraShake.power = Math.max(cameraShake.power, power);
  }

  function hideUltimateCutin() {
    ultimateCutin = { active: false, timer: 0 };
    ultOverlay.classList.add("hidden");
  }

  function hideDeployIntro() {
    deployIntro = { active: false, timer: 0 };
    deployOverlay.classList.add("hidden");
  }

  function hideChapterUnlock() {
    chapterUnlockIntro = { active: false, timer: 0 };
    chapterOverlay.classList.add("hidden");
    if (screen === "base" && pendingRegionUnlocks.length > 0) {
      triggerChapterUnlock(pendingRegionUnlocks.shift());
    }
  }

  function triggerChapterUnlock(regionId) {
    const region = regionDefs[regionId];
    if (!region) return;
    chapterUnlockIntro = { active: true, timer: 1.9 };
    chapterPanel.dataset.region = regionId;
    chapterEyebrow.textContent = t("chapterUnlockEyebrow");
    chapterTitle.textContent = `${fmt("operationChapter", { index: Object.keys(regionDefs).indexOf(regionId) + 1 })} // ${getRegionCopy(regionId, "name") || region.name}`;
    chapterSubtitle.textContent = t("chapterUnlockSubtitle");
    chapterBody.textContent = fmt("chapterUnlockBody", {
      region: getRegionCopy(regionId, "name") || region.name,
    });
    chapterThreat.textContent = getRegionCopy(regionId, "threat");
    chapterCommand.textContent = getRegionCopy(regionId, "command");
    chapterOverlay.classList.remove("hidden");
  }

  function queueUnlockedRegionOverlays() {
    let mutated = false;
    for (const regionId of Object.keys(regionDefs)) {
      if (!isRegionUnlocked(regionId)) continue;
      if (meta.announcedRegionUnlocks.includes(regionId)) continue;
      meta.announcedRegionUnlocks.push(regionId);
      pendingRegionUnlocks.push(regionId);
      mutated = true;
    }
    if (mutated) saveMeta();
    if (screen === "base" && !chapterUnlockIntro.active && pendingRegionUnlocks.length > 0) {
      triggerChapterUnlock(pendingRegionUnlocks.shift());
    }
  }

  function triggerDeployIntro(character, mode, region) {
    deployIntro = { active: true, timer: 0.95 };
    deployPanel.dataset.region = region.id;
    deployPanel.dataset.hunter = character.id;
    deployPanel.dataset.preview = hasCosmeticPreview(character.id) ? "1" : "0";
    deployEyebrow.textContent = t("deployEyebrow");
    if (hasCosmeticPreview(character.id)) {
      deployEyebrow.textContent = t("deployPreviewLabel");
    }
    deployTitle.textContent = `${getCharacterName(character.id)} // ${getRegionCopy(region.id, "name") || region.name}`;
    deploySubtitle.textContent = `${getModeCopy(mode.id, "name")} // ${getRegionCopy(region.id, "bossName") || region.bossName}`;
    deployBody.textContent = getDeployBody(mode.id);
    deployOverlay.classList.remove("hidden");
  }

  function triggerUltimateCutin(characterId) {
    const toneClass =
      characterId === "dex"
        ? "ult-blue"
        : characterId === "ria"
          ? "ult-violet"
          : characterId === "sera"
            ? "ult-silver"
            : "ult-red";
    ultPanel.classList.remove("ult-red", "ult-blue", "ult-violet", "ult-silver");
    ultPanel.classList.add(toneClass);
    ultPanel.dataset.hunter = characterId;
    ultPanel.dataset.preview = hasCosmeticPreview(characterId) ? "1" : "0";
    ultEyebrow.textContent = hasCosmeticPreview(characterId) ? t("ultimatePreviewLabel") : t("ultimateEyebrow");
    ultTitle.textContent = getCharacterCopy(characterId, "ultLabel");
    ultSubtitle.textContent = getCharacterCopy(characterId, "baseBody");
    ultOverlay.classList.remove("hidden");
    ultimateCutin = { active: true, timer: 0.52 };
  }

  function triggerBossFinish(defeatedBoss) {
    const mode = getCurrentMode();
    const region = getCurrentRegion();
    const bossName = getRegionCopy(region.id, "bossName") || defeatedBoss.name;
    const characterId = meta.selectedCharacter;
    const previewLive = hasCosmeticPreview(characterId);
    finisher.active = true;
    finisher.timer = 1.05;
    finishPanel.classList.remove("finish-red", "finish-blue", "finish-green");
    finishPanel.dataset.hunter = characterId;
    finishPanel.dataset.preview = previewLive ? "1" : "0";
    if (region.id === "sanctuary") {
      finishPanel.classList.add("finish-blue");
      finishEyebrow.textContent = t(
        mode.id === "boss"
          ? "finishEyebrowSanctuaryBoss"
          : "finishEyebrowSanctuaryHunt",
      );
      finishTitle.textContent = t(
        mode.id === "boss"
          ? "finishTitleSanctuaryBoss"
          : "finishTitleSanctuaryHunt",
      );
      finishSubtitle.textContent = fmt("finishSubtitleSanctuary", {
        boss: bossName,
      });
    } else if (region.id === "blacktide") {
      finishPanel.classList.add("finish-green");
      finishEyebrow.textContent = t(
        mode.id === "boss"
          ? "finishEyebrowBlacktideBoss"
          : "finishEyebrowBlacktideHunt",
      );
      finishTitle.textContent = t(
        mode.id === "boss" ? "finishTitleBlacktideBoss" : "finishTitleBlacktideHunt",
      );
      finishSubtitle.textContent = fmt("finishSubtitleBlacktide", {
        boss: bossName,
      });
    } else {
      finishPanel.classList.add("finish-red");
      finishEyebrow.textContent = t(
        mode.id === "boss" ? "finishEyebrowRedcityBoss" : "finishEyebrowRedcityHunt",
      );
      finishTitle.textContent = t(
        mode.id === "boss" ? "finishTitleRedcityBoss" : "finishTitleRedcityHunt",
      );
      finishSubtitle.textContent = fmt("finishSubtitleRedcity", {
        boss: bossName,
      });
    }
    if (previewLive) {
      finishEyebrow.textContent = t("finishPreviewLabel");
    }
    playTone("finish");
    pulseVibration([40, 30, 60]);
    shakeScreen(18, 0.38);
    finishOverlay.classList.remove("hidden");
  }

  function gainXp(amount) {
    player.xp += amount * player.xpMultiplier;
    while (player.xp >= player.nextXp) {
      player.xp -= player.nextXp;
      player.level += 1;
      player.nextXp = Math.floor(player.nextXp * 1.3 + 10);
      playTone("level");
      pulseVibration(18);
      pausedForLevel = true;
      populateLevelChoices();
    }
  }

  function gainRage(amount) {
    player.rage = clamp(
      player.rage + amount * player.rageGainMultiplier,
      0,
      player.maxRage,
    );
    if (player.rage >= player.maxRage) {
      player.rage = 0;
      player.rageModeTimer = Math.max(player.rageModeTimer, 8);
      addEffect(player.x, player.y, 120, "rgba(255, 136, 40, 0.45)", 0.45);
      addFloatingText(player.x, player.y - 28, "RAGE MAX", "#ffbb70", 0.55, 18);
      shakeScreen(10, 0.2);
    }
  }

  function getCharacterUpgradeDefs(characterId) {
    if (characterId === "dex") return dexUpgradeDefs;
    if (characterId === "ria") return riaUpgradeDefs;
    if (characterId === "sera") return seraUpgradeDefs;
    return cainUpgradeDefs;
  }

  function pickUniqueUpgrades(source, count) {
    const picks = [];
    const pool = [...source];
    while (pool.length > 0 && picks.length < count) {
      const index = Math.floor(Math.random() * pool.length);
      picks.push(pool[index]);
      pool.splice(index, 1);
    }
    return picks;
  }

  function populateLevelChoices() {
    levelChoices.innerHTML = "";
    levelOverlay.classList.remove("hidden");
    const character = characterDefs[player.characterId] ?? characterDefs.cain;
    if (player.characterId === "dex") {
      levelEyebrow.textContent = lang() === "ko" ? "덱스 모듈 선택" : "DEX MUTATION SELECT";
      levelTitle.textContent = lang() === "ko" ? "오버드라이브 모듈을 고르세요" : "Choose an overdrive module";
    } else if (player.characterId === "ria") {
      levelEyebrow.textContent = lang() === "ko" ? "리아 의식 선택" : "RIA RITUAL SELECT";
      levelTitle.textContent = lang() === "ko" ? "파멸 의식을 고르세요" : "Choose a ruin invocation";
    } else if (player.characterId === "sera") {
      levelEyebrow.textContent = lang() === "ko" ? "세라 패턴 선택" : "SERA EXECUTION SELECT";
      levelTitle.textContent = lang() === "ko" ? "사신 패턴을 고르세요" : "Choose a reaper pattern";
    } else {
      levelEyebrow.textContent = lang() === "ko" ? "카인 변이 선택" : "CAIN MUTATION SELECT";
      levelTitle.textContent = lang() === "ko" ? "혈계 변이를 고르세요" : "Choose a blood mutation";
    }

    const characterPool = getCharacterUpgradeDefs(player.characterId);
    const commonPool = commonUpgradeDefs;
    let picks = [];

    if (player.level <= 3) {
      picks = [
        ...pickUniqueUpgrades(characterPool, 2),
        ...pickUniqueUpgrades(commonPool, 1),
      ];
    } else {
      picks = [
        ...pickUniqueUpgrades(characterPool, 1),
        ...pickUniqueUpgrades(commonPool, 2),
      ];
      if (Math.random() < 0.4) {
        picks = [
          ...pickUniqueUpgrades(characterPool, 2),
          ...pickUniqueUpgrades(commonPool, 1),
        ];
      }
    }

    picks = picks.slice(0, 3);

    for (const pick of picks) {
      const button = document.createElement("button");
      button.className = "choice-button";
      button.type = "button";
      const prefix =
        characterPool.includes(pick)
          ? `${getCharacterSyncLabel(character.id)} // `
          : lang() === "ko"
            ? "공용 // "
            : "CORE // ";
      button.innerHTML = `<span class="choice-button__title">${lt(pick.title)}</span><span class="choice-button__desc">${prefix}${lt(pick.description)}</span>`;
      button.addEventListener("click", () => {
        pick.apply(player);
        player.selectedUpgrades.push(pick.id);
        pausedForLevel = false;
        levelOverlay.classList.add("hidden");
      });
      levelChoices.appendChild(button);
    }
  }

  function spawnOrb(x, y, value = 8) {
    xpOrbs.push({ x, y, radius: 7, value, pull: 0 });
  }

  function killEnemy(enemy) {
    const idx = enemies.indexOf(enemy);
    if (idx >= 0) enemies.splice(idx, 1);

    addEffect(enemy.x, enemy.y, enemy.radius * 2.2, "rgba(255, 120, 90, 0.35)", 0.3);
    if (enemy.type === "elite" || enemy.type === "warden") {
      addFloatingText(enemy.x, enemy.y - 18, "ELITE DOWN", "#ffd270", 0.55, 16);
      shakeScreen(9, 0.16);
    }
    spawnOrb(enemy.x, enemy.y, enemy.type === "elite" || enemy.type === "warden" ? 26 : 8);
    player.kills += 1;
    gainRage(enemy.type === "elite" || enemy.type === "warden" ? 18 : 8);
    player.seasonStacks = Math.min(player.seasonStackCap, player.seasonStacks + 1);
    player.seasonTimer = 5;
    player.rewardMultiplier += 0.006;

    if (player.kills % player.explosionKillsThreshold === 0) {
      radialDamage(enemy.x, enemy.y, 110, 48 + player.explosionDamageBonus);
      addEffect(enemy.x, enemy.y, 120, "rgba(255, 170, 70, 0.32)", 0.28);
    }

    if (player.characterId === "sera") {
      player.dashTimer = Math.max(0, player.dashTimer - player.dashRefundOnKill);
      player.killRushTimer = Math.min(3.4, player.killRushTimer + 0.85);
      player.attackTimer = Math.min(player.attackTimer, player.attackCooldown * 0.4);
      addEffect(enemy.x, enemy.y, 76, "rgba(170, 214, 255, 0.24)", 0.18);
    }
  }

  function triggerCurseBurst(target) {
    radialDamage(target.x, target.y, player.curseBurstRadius, player.curseBurstDamage);
    addEffect(target.x, target.y, player.curseBurstRadius * 0.9, "rgba(216, 140, 255, 0.26)", 0.24);
    addFloatingText(target.x, target.y - 12, "RUIN", "#d88cff", 0.48, 16);
    shakeScreen(7, 0.14);
    gainRage(10 + player.curseEchoGain * 30);
  }

  function applyCharacterHitEffects(target) {
    if (player.characterId !== "ria") return;
    target.curseStacks = (target.curseStacks ?? 0) + 1;
    addEffect(target.x, target.y, target.radius * 1.1, "rgba(216, 140, 255, 0.18)", 0.12);
    if (target.curseStacks >= player.curseThreshold) {
      target.curseStacks = 0;
      triggerCurseBurst(target);
    }
  }

  function hitEnemy(target, baseDamage) {
    let damage = baseDamage;
    if (player.rageModeTimer > 0) damage *= 1.45;
    if (target.hp < target.maxHp * 0.5) damage *= 1 + player.executeBonus;

    target.hp -= damage;
    applyCharacterHitEffects(target);
    addEffect(target.x, target.y, target.radius * 1.4, "rgba(255, 225, 180, 0.28)", 0.15);
    addFloatingText(target.x, target.y - 8, Math.round(damage), "rgba(255, 244, 216, 0.95)", 0.34, 15);
    if (player.lifesteal > 0) {
      player.hp = Math.min(player.maxHp, player.hp + damage * player.lifesteal);
    }
    if (damage >= 70) shakeScreen(5, 0.08);
    if (target.hp <= 0) killEnemy(target);
  }

  function hitBossWeakpoint(point, damage) {
    point.hp -= damage * player.bossDamageMultiplier;
    addEffect(boss.x + point.ox, boss.y + point.oy, 70, "rgba(255, 208, 118, 0.4)", 0.18);
    addFloatingText(
      boss.x + point.ox,
      boss.y + point.oy - 12,
      Math.round(damage * player.bossDamageMultiplier),
      "#ffd88e",
      0.38,
      16,
    );
    if (point.hp <= 0 && point.alive) {
      point.alive = false;
      player.seasonWeakpoints += 1;
      gainRage(24);
      addEffect(boss.x + point.ox, boss.y + point.oy, 120, "rgba(255, 148, 57, 0.45)", 0.28);
      addFloatingText(boss.x + point.ox, boss.y + point.oy - 26, "BREAK", "#ffb45a", 0.6, 20);
      shakeScreen(12, 0.24);
      if (boss.weakpoints.every((item) => !item.alive)) {
        boss.shielded = false;
        addEffect(boss.x, boss.y, 180, "rgba(255, 211, 100, 0.3)", 0.4);
        addFloatingText(boss.x, boss.y - 34, "CORE EXPOSED", "#ffe08d", 0.7, 22);
        shakeScreen(15, 0.28);
      }
    }
  }

  function radialDamage(x, y, radius, damage) {
    for (const enemy of [...enemies]) {
      if (Math.hypot(enemy.x - x, enemy.y - y) <= radius) {
        hitEnemy(enemy, damage);
      }
    }
  }

  function getBossTargets() {
    if (!boss) return [];
    const targets = [];
    for (const weakpoint of boss.weakpoints) {
      if (weakpoint.alive) {
        targets.push({
          kind: "boss-weakpoint",
          x: boss.x + weakpoint.ox,
          y: boss.y + weakpoint.oy,
          radius: weakpoint.radius,
          ref: weakpoint,
        });
      }
    }
    if (!boss.shielded) {
      targets.push({ kind: "boss-body", x: boss.x, y: boss.y, radius: boss.radius });
    }
    return targets;
  }

  function performAttack() {
    let nearest = null;
    let nearestDistance = Infinity;

    for (const enemy of enemies) {
      const d = distance(player, enemy);
      if (d < nearestDistance && d <= player.attackRange) {
        nearestDistance = d;
        nearest = enemy;
      }
    }

    for (const target of getBossTargets()) {
      const d = distance(player, target);
      if (d < nearestDistance && d <= player.attackRange + 20) {
        nearestDistance = d;
        nearest = target;
      }
    }

    if (!nearest) return;

    const dir = normalize(nearest.x - player.x, nearest.y - player.y);
    player.facingX = dir.x;
    player.facingY = dir.y;

    if (player.attackStyle === "blink" && nearest.kind === "enemy") {
      const dashDistance = Math.max(0, Math.min(nearestDistance - 76, player.blinkStrikeRange));
      if (dashDistance > 0) {
        player.x = clamp(player.x + dir.x * dashDistance, -WORLD, WORLD);
        player.y = clamp(player.y + dir.y * dashDistance, -WORLD, WORLD);
        addEffect(player.x, player.y, 84, "rgba(170, 214, 255, 0.22)", 0.16);
      }
    }

    if (player.attackStyle === "ranged" || player.attackStyle === "hex") {
      player.shotFlash = player.slashDuration;
      player.lastShotX = nearest.x;
      player.lastShotY = nearest.y;

      if (nearest.kind === "enemy") {
        hitEnemy(nearest, player.damage);
      } else if (nearest.kind === "boss-weakpoint") {
        hitBossWeakpoint(
          nearest.ref,
          player.damage * (player.attackStyle === "hex" ? 1.26 : 1.18),
        );
      } else {
        boss.hp -=
          player.damage *
          player.bossDamageMultiplier *
          (player.attackStyle === "hex" ? 1.1 : 1);
        addEffect(
          boss.x,
          boss.y,
          70,
          player.attackStyle === "hex"
            ? "rgba(216, 140, 255, 0.24)"
            : "rgba(130, 232, 210, 0.24)",
          0.12,
        );
      }

      const chainCount =
        player.attackStyle === "hex" ? player.hexChains : player.projectileBurst;
      if (chainCount > 0) {
        const secondaryTargets = enemies
          .filter((enemy) => enemy !== nearest && distance(player, enemy) <= player.attackRange)
          .sort((a, b) => distance(player, a) - distance(player, b))
          .slice(0, chainCount);
        for (const enemy of secondaryTargets) {
          hitEnemy(enemy, player.damage * (player.attackStyle === "hex" ? 0.6 : 0.55));
        }
      }
      return;
    }

    player.slashFlash = player.slashDuration;

    for (const enemy of [...enemies]) {
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const d = Math.hypot(dx, dy);
      if (d > player.attackRange) continue;

      const direction = normalize(dx, dy);
      const dot = direction.x * player.facingX + direction.y * player.facingY;
      const angle = Math.acos(clamp(dot, -1, 1));
      if (angle <= player.attackArc / 2) hitEnemy(enemy, player.damage);
    }

    if (boss) {
      for (const target of getBossTargets()) {
        const dx = target.x - player.x;
        const dy = target.y - player.y;
        const d = Math.hypot(dx, dy);
        if (d > player.attackRange + target.radius) continue;

        const direction = normalize(dx, dy);
        const dot = direction.x * player.facingX + direction.y * player.facingY;
        const angle = Math.acos(clamp(dot, -1, 1));
        if (angle > player.attackArc / 2) continue;

        if (target.kind === "boss-weakpoint") {
          hitBossWeakpoint(target.ref, player.damage * 1.1);
        } else {
          boss.hp -= player.damage * player.bossDamageMultiplier;
          addEffect(boss.x, boss.y, 90, "rgba(255, 240, 180, 0.26)", 0.12);
        }
      }
    }
  }

  function spawnEnemyWave(dt) {
    const mode = getCurrentMode();
    const region = getCurrentRegion();
    if (mode.id === "hunt" && bossSpawned) return;

    spawnClock += dt;
    const cadence =
      mode.id === "boss"
        ? bossSpawned
          ? 1.55
          : 1.1
        : mode.id === "rift"
          ? elapsed < 36
            ? 0.58
            : elapsed < 88
              ? 0.42
              : 0.34
        : mode.id === "gauntlet"
          ? elapsed < 30
            ? 0.48
            : elapsed < 80
              ? 0.34
              : 0.26
        : elapsed < 30
          ? 0.75
          : elapsed < 70
            ? 0.55
            : 0.45;
    if (spawnClock < cadence) return;
    spawnClock = 0;

    const angle = rand(0, Math.PI * 2);
    const distanceFromPlayer = rand(360, 520);
    const x = player.x + Math.cos(angle) * distanceFromPlayer;
    const y = player.y + Math.sin(angle) * distanceFromPlayer;

    let type = "grunt";
    const shooterBias =
      mode.id === "gauntlet"
        ? region.id === "sanctuary"
          ? 0.42
          : 0.28
        : region.id === "sanctuary"
          ? 0.36
          : region.id === "blacktide"
            ? 0.18
            : 0.22;
    const chargerBias =
      mode.id === "gauntlet"
        ? region.id === "sanctuary"
          ? 0.16
          : 0.24
        : region.id === "sanctuary"
          ? 0.1
          : region.id === "blacktide"
            ? 0.14
            : 0.18;
    const drifterBias = region.id === "blacktide" ? 0.24 : 0;
    const wardenBias =
      region.id === "blacktide"
        ? mode.id === "boss"
          ? 0.08
          : mode.id === "rift"
            ? 0.16
            : mode.id === "gauntlet"
              ? 0.18
            : 0.12
        : 0;
    if (elapsed > 22 && Math.random() < shooterBias) type = "shooter";
    if (elapsed > 28 && Math.random() < drifterBias) type = "drifter";
    if (elapsed > 36 && Math.random() < chargerBias) type = "charger";
    if (elapsed > 46 && Math.random() < wardenBias) type = "warden";
    if (
      type === "grunt" &&
      elapsed > 42 &&
      Math.random() < (mode.id === "boss" ? 0.04 : mode.id === "rift" ? 0.12 : mode.id === "gauntlet" ? 0.22 : 0.08)
    ) {
      type = "elite";
    }

    enemies.push(createEnemy(type, clamp(x, -WORLD, WORLD), clamp(y, -WORLD, WORLD)));
  }

  function spawnBossIfNeeded() {
    const mode = getCurrentMode();
    const region = getCurrentRegion();
    if (mode.hasBoss === false) return;
    if (bossSpawned || elapsed < mode.bossTime) return;
    boss = createBoss();
    if (mode.id === "boss") {
      boss.hp = 2200 + meta.bossKills * 40;
      boss.maxHp = boss.hp;
      boss.ringTimer = 1.8;
      boss.slamTimer = 3.6;
    } else if (mode.id === "rift") {
      boss.hp = Math.floor(boss.hp * 1.22);
      boss.maxHp = boss.hp;
      boss.ringTimer *= 0.85;
      boss.slamTimer *= 0.88;
    }
    bossSpawned = true;
    bossLabel.textContent = getRegionCopy(region.id, "bossName") || boss.name;
    bossWrap.classList.remove("hidden");
    playTone("boss");
    pulseVibration([24, 24, 24]);
    shakeScreen(12, 0.22);
    addEffect(player.x + 320, player.y - 60, 200, region.bossBurst, 0.65);
  }

  function updateMovement(dt) {
    const keyboardX =
      (input.keyboard.right ? 1 : 0) - (input.keyboard.left ? 1 : 0);
    const keyboardY =
      (input.keyboard.down ? 1 : 0) - (input.keyboard.up ? 1 : 0);

    let moveX = input.moveX || keyboardX;
    let moveY = input.moveY || keyboardY;

    if (moveX !== 0 || moveY !== 0) {
      const dir = normalize(moveX, moveY);
      moveX = dir.x;
      moveY = dir.y;
      player.facingX = dir.x;
      player.facingY = dir.y;
    }

    const boost =
      (player.rageModeTimer > 0 ? 1.15 : 1) *
      (player.killRushTimer > 0 ? 1 + player.killRushBonus : 1);
    player.x = clamp(player.x + moveX * player.speed * boost * dt, -WORLD, WORLD);
    player.y = clamp(player.y + moveY * player.speed * boost * dt, -WORLD, WORLD);
  }

  function doDash() {
    if (pausedForLevel || gameOver || screen !== "run" || player.dashTimer > 0) return;
    let dirX = input.moveX;
    let dirY = input.moveY;
    if (!dirX && !dirY) {
      dirX = player.facingX || 1;
      dirY = player.facingY || 0;
    }

    const dir = normalize(dirX, dirY);
    player.x = clamp(player.x + dir.x * 180, -WORLD, WORLD);
    player.y = clamp(player.y + dir.y * 180, -WORLD, WORLD);
    player.dashTimer = player.dashCooldown;
    player.dashBurstTimer = 0.12;
    playTone("dash");
    pulseVibration(12);
    shakeScreen(6, 0.1);
    gainRage(10);
    addEffect(player.x, player.y, 110, "rgba(103, 211, 255, 0.28)", 0.24);

    if (player.hasDashTrail) {
      radialDamage(player.x, player.y, 95, 42);
      addEffect(player.x, player.y, 130, "rgba(255, 100, 73, 0.24)", 0.22);
    }
  }

  function doUltimate() {
    if (pausedForLevel || gameOver || screen !== "run" || player.ultimateCooldown > 0) return;
    triggerUltimateCutin(player.characterId);

    const eventKey =
      player.characterId === "dex"
        ? "ultDexEvent"
        : player.characterId === "ria"
          ? "ultRiaEvent"
          : player.characterId === "sera"
            ? "ultSeraEvent"
            : "ultCainEvent";

    player.ultimateCooldown = player.ultimateMaxCooldown;
    pushEvent(t(eventKey), 1.8);
    playTone("boss");
    pulseVibration([18, 24, 18]);
    shakeScreen(14, 0.24);

    if (player.characterId === "dex") {
      player.overdriveTimer = Math.max(player.overdriveTimer, 7);
      player.projectileBurst += 2;
      for (const enemy of [...enemies]
        .sort((a, b) => distance(player, a) - distance(player, b))
        .slice(0, 8)) {
        addEffect(enemy.x, enemy.y, 90, "rgba(130, 232, 210, 0.24)", 0.2);
        hitEnemy(enemy, player.damage * 1.9);
      }
      if (boss) {
        for (const target of getBossTargets()) {
          if (target.kind === "boss-weakpoint") hitBossWeakpoint(target.ref, player.damage * 1.4);
          else boss.hp -= player.damage * 1.8 * player.bossDamageMultiplier;
        }
      }
      return;
    }

    if (player.characterId === "ria") {
      for (const enemy of [...enemies]) {
        enemy.curseStacks = player.curseThreshold;
        triggerCurseBurst(enemy);
      }
      if (boss) {
        for (const target of getBossTargets()) {
          if (target.kind === "boss-weakpoint") hitBossWeakpoint(target.ref, player.damage * 1.35);
          else boss.hp -= player.damage * 1.7 * player.bossDamageMultiplier;
        }
        addEffect(boss.x, boss.y, 170, "rgba(216, 140, 255, 0.26)", 0.3);
      }
      return;
    }

    if (player.characterId === "sera") {
      player.killRushTimer = Math.max(player.killRushTimer, 5.5);
      player.dashTimer = 0;
      const targets = enemies
        .slice()
        .sort((a, b) => distance(player, a) - distance(player, b))
        .slice(0, 6);
      for (const enemy of targets) {
        player.x = enemy.x;
        player.y = enemy.y;
        addEffect(enemy.x, enemy.y, 84, "rgba(170, 214, 255, 0.24)", 0.18);
        hitEnemy(enemy, player.damage * 2.2);
      }
      if (boss) {
        for (const target of getBossTargets()) {
          if (target.kind === "boss-weakpoint") hitBossWeakpoint(target.ref, player.damage * 1.45);
          else boss.hp -= player.damage * 2.1 * player.bossDamageMultiplier;
        }
      }
      return;
    }

    player.rageModeTimer = Math.max(player.rageModeTimer, 8);
    player.hp = Math.min(player.maxHp, player.hp + 150);
    radialDamage(player.x, player.y, 190, player.damage * 1.8);
    addEffect(player.x, player.y, 180, "rgba(255, 136, 40, 0.34)", 0.28);
    if (boss) {
      for (const target of getBossTargets()) {
        if (target.kind === "boss-weakpoint") hitBossWeakpoint(target.ref, player.damage * 1.5);
        else boss.hp -= player.damage * 2 * player.bossDamageMultiplier;
      }
    }
  }

  function updatePlayer(dt) {
    updateMovement(dt);
    player.attackTimer -= dt;
    player.dashTimer -= dt;
    player.ultimateCooldown = Math.max(0, player.ultimateCooldown - dt);
    player.slashFlash -= dt;
    player.shotFlash -= dt;
    player.dashBurstTimer -= dt;
    player.rageModeTimer -= dt;
    player.killRushTimer -= dt;
    player.overdriveTimer = Math.max(0, player.overdriveTimer - dt);
    player.seasonTimer -= dt;

    if (player.seasonTimer <= 0 && player.seasonStacks > 0) {
      player.seasonStacks = Math.max(0, player.seasonStacks - dt * player.seasonDecayRate);
    }

    if (player.attackTimer <= 0) {
      performAttack();
      const rushMult = player.killRushTimer > 0 ? Math.max(0.68, 1 - player.killRushBonus) : 1;
      const seasonMult = Math.max(0.72, 1 - player.seasonStacks * 0.022);
      player.attackTimer = player.attackCooldown * rushMult * seasonMult;
    }

    orbitBlades.length = 0;
    const orbitCount = player.orbitCount + (player.overdriveTimer > 0 ? 2 : 0);
    for (let i = 0; i < orbitCount; i += 1) {
      const angle = elapsed * 2.7 + (Math.PI * 2 * i) / Math.max(1, orbitCount);
      const blade = {
        x: player.x + Math.cos(angle) * 84,
        y: player.y + Math.sin(angle) * 84,
        radius: 12,
      };
      orbitBlades.push(blade);
      for (const enemy of [...enemies]) {
        if (distance(blade, enemy) < blade.radius + enemy.radius + 6) {
          hitEnemy(enemy, 18 * dt * 8);
        }
      }
      if (boss && !boss.shielded && distance(blade, boss) < boss.radius + 26) {
        boss.hp -= 9 * dt * 8 * player.bossDamageMultiplier;
      }
    }
  }

  function updateEnemies(dt) {
    for (const enemy of [...enemies]) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const dir = normalize(dx, dy);

      if (enemy.type === "charger") {
        enemy.dashTimer -= dt;
        const speedMultiplier = enemy.dashTimer <= 0 ? 2.6 : 1;
        enemy.x += dir.x * enemy.speed * speedMultiplier * dt;
        enemy.y += dir.y * enemy.speed * speedMultiplier * dt;
        if (enemy.dashTimer <= -0.22) enemy.dashTimer = enemy.dashReady;
      } else if (enemy.type === "shooter") {
        const desiredDistance = 240;
        const d = Math.hypot(dx, dy);
        const sign = d > desiredDistance ? 1 : -1;
        enemy.x += dir.x * enemy.speed * sign * dt;
        enemy.y += dir.y * enemy.speed * sign * dt;
        enemy.shotTimer -= dt;
        if (enemy.shotTimer <= 0) {
          const shotDir = normalize(player.x - enemy.x, player.y - enemy.y);
          projectiles.push({
            x: enemy.x,
            y: enemy.y,
            vx: shotDir.x * 240,
            vy: shotDir.y * 240,
            radius: 5,
            life: 2.6,
            damage: 16,
            color: "#f6cb70",
          });
          enemy.shotTimer = 1.8;
        }
      } else if (enemy.type === "drifter") {
        const desiredDistance = 210;
        const d = Math.hypot(dx, dy);
        const radialSign = d > desiredDistance ? 1 : -1;
        const tangent = { x: -dir.y * enemy.orbitDir, y: dir.x * enemy.orbitDir };
        enemy.x += (dir.x * radialSign * 0.55 + tangent.x) * enemy.speed * dt;
        enemy.y += (dir.y * radialSign * 0.55 + tangent.y) * enemy.speed * dt;
        enemy.shotTimer -= dt;
        if (enemy.shotTimer <= 0) {
          for (const spread of [-0.22, 0.22]) {
            const baseAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x) + spread;
            projectiles.push({
              x: enemy.x,
              y: enemy.y,
              vx: Math.cos(baseAngle) * 225,
              vy: Math.sin(baseAngle) * 225,
              radius: 5,
              life: 2.9,
              damage: 14,
              color: "#9cf7ef",
            });
          }
          enemy.shotTimer = 1.5;
        }
      } else if (enemy.type === "warden") {
        const desiredDistance = 190;
        const d = Math.hypot(dx, dy);
        const radialSign = d > desiredDistance ? 1 : -1;
        const tangent = { x: -dir.y * enemy.orbitDir, y: dir.x * enemy.orbitDir };
        enemy.x += (dir.x * radialSign * 0.35 + tangent.x * 0.55) * enemy.speed * dt;
        enemy.y += (dir.y * radialSign * 0.35 + tangent.y * 0.55) * enemy.speed * dt;
        enemy.shotTimer -= dt;
        enemy.pulseTimer -= dt;
        if (enemy.shotTimer <= 0) {
          for (const spread of [-0.28, 0, 0.28]) {
            const baseAngle = Math.atan2(player.y - enemy.y, player.x - enemy.x) + spread;
            projectiles.push({
              x: enemy.x,
              y: enemy.y,
              vx: Math.cos(baseAngle) * 235,
              vy: Math.sin(baseAngle) * 235,
              radius: 6,
              life: 3.1,
              damage: 16,
              color: "#c4fff8",
            });
          }
          enemy.shotTimer = 2.1;
        }
        if (enemy.pulseTimer <= 0) {
          addEffect(enemy.x, enemy.y, 132, "rgba(116, 255, 236, 0.2)", 0.24);
          for (const other of [...enemies]) {
            if (other === enemy) continue;
            if (distance(enemy, other) < 120) {
              other.hp = Math.min(other.maxHp, other.hp + 12);
            }
          }
          if (distance(enemy, player) < 100) player.hp -= 20;
          enemy.pulseTimer = 2.8;
        }
      } else if (enemy.type === "elite") {
        enemy.x += dir.x * enemy.speed * dt;
        enemy.y += dir.y * enemy.speed * dt;
        enemy.pulseTimer -= dt;
        if (enemy.pulseTimer <= 0) {
          if (distance(enemy, player) < 90) player.hp -= 24;
          addEffect(enemy.x, enemy.y, 110, "rgba(255, 179, 92, 0.2)", 0.28);
          enemy.pulseTimer = 2.2;
        }
      } else {
        enemy.x += dir.x * enemy.speed * dt;
        enemy.y += dir.y * enemy.speed * dt;
      }

      if (distance(enemy, player) < enemy.radius + player.radius) {
        player.hp -= enemy.touchDamage * dt;
        gainRage(8 * dt);
      }
    }
  }

  function updateBoss(dt) {
    if (!boss) return;

    const dir = normalize(player.x - boss.x, player.y - boss.y);
    if (boss.regionId === "blacktide") {
      if (boss.volleyTimer < 0.5 && !boss.warningVolley) {
        pushEvent(t("eventAbyssVolley"), 1.1);
        boss.warningVolley = true;
      }
      if (boss.ringTimer < 0.58 && !boss.warningRing) {
        pushEvent(t("eventAbyssRing"), 1.1);
        boss.warningRing = true;
      }
      if (boss.slamTimer < 0.78 && !boss.warningSlam) {
        boss.mortarTargets = [
          { x: player.x, y: player.y },
          { x: player.x + 92, y: player.y - 46 },
          { x: player.x - 92, y: player.y + 46 },
        ];
        pushEvent(t("eventAbyssMortar"), 1.15);
        boss.warningSlam = true;
      }

      const currentDistance = distance(boss, player);
      const maintain = currentDistance > 280 ? 1 : -0.35;
      boss.x += dir.x * boss.speed * maintain * dt;
      boss.y += dir.y * boss.speed * maintain * dt;

      boss.ringTimer -= dt;
      boss.volleyTimer -= dt;
      boss.slamTimer -= dt;

      if (boss.volleyTimer <= 0) {
        const baseAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
        for (const spread of [-0.34, -0.17, 0, 0.17, 0.34]) {
          const angle = baseAngle + spread;
          projectiles.push({
            x: boss.x,
            y: boss.y,
            vx: Math.cos(angle) * 255,
            vy: Math.sin(angle) * 255,
            radius: 6,
            life: 3.3,
            damage: boss.shielded ? 15 : 23,
            color: boss.shielded ? boss.projectileColor : boss.projectileColorHot,
          });
        }
        boss.volleyTimer = boss.shielded ? 2.1 : 1.45;
        boss.warningVolley = false;
      }

      if (boss.ringTimer <= 0) {
        const shots = boss.shielded ? 12 : 16;
        for (let i = 0; i < shots; i += 1) {
          const angle = (Math.PI * 2 * i) / shots + elapsed * 0.7;
          projectiles.push({
            x: boss.x,
            y: boss.y,
            vx: Math.cos(angle) * (boss.shielded ? 118 : 146),
            vy: Math.sin(angle) * (boss.shielded ? 118 : 146),
            radius: 7,
            life: 4.4,
            damage: boss.shielded ? 12 : 19,
            color: boss.shielded ? boss.projectileColor : boss.projectileColorHot,
          });
        }
        boss.ringTimer = boss.shielded ? 2.9 : 2.1;
        boss.warningRing = false;
      }

      if (boss.slamTimer <= 0) {
        for (const target of boss.mortarTargets) {
          addEffect(target.x, target.y, 124, "rgba(74, 192, 179, 0.26)", 0.28);
          if (distance(target, player) < 96) player.hp -= boss.bodyDamage * 1.9;
        }
        boss.mortarTargets = [];
        boss.slamTimer = boss.shielded ? 5.8 : 4.4;
        boss.warningSlam = false;
      }

      if (distance(boss, player) < boss.radius + player.radius) {
        player.hp -= boss.bodyDamage * 0.85 * dt;
      }
    } else if (boss.regionId === "sanctuary") {
      if (boss.volleyTimer < 0.5 && !boss.warningVolley) {
        pushEvent(t("eventArchonVolley"), 1.1);
        boss.warningVolley = true;
      }
      if (boss.ringTimer < 0.55 && !boss.warningRing) {
        pushEvent(t("eventArchonRing"), 1.1);
        boss.warningRing = true;
      }
      if (boss.slamTimer < 0.65 && !boss.warningSlam) {
        pushEvent(t("eventArchonImpact"), 1.1);
        boss.warningSlam = true;
      }

      const currentDistance = distance(boss, player);
      const maintain = currentDistance > 310 ? 1 : -0.55;
      boss.x += dir.x * boss.speed * maintain * dt;
      boss.y += dir.y * boss.speed * maintain * dt;

      boss.ringTimer -= dt;
      boss.volleyTimer -= dt;
      boss.slamTimer -= dt;

      if (boss.volleyTimer <= 0) {
        const baseAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
        for (const spread of [-0.18, 0, 0.18]) {
          const angle = baseAngle + spread;
          projectiles.push({
            x: boss.x,
            y: boss.y,
            vx: Math.cos(angle) * 270,
            vy: Math.sin(angle) * 270,
            radius: 6,
            life: 3.2,
            damage: boss.shielded ? 16 : 24,
            color: boss.shielded ? boss.projectileColor : boss.projectileColorHot,
          });
        }
        boss.volleyTimer = boss.shielded ? 2.3 : 1.6;
        boss.warningVolley = false;
      }

      if (boss.ringTimer <= 0) {
        const shots = boss.shielded ? 6 : 8;
        for (let i = 0; i < shots; i += 1) {
          const angle = (Math.PI * 2 * i) / shots + elapsed * 0.55;
          projectiles.push({
            x: boss.x,
            y: boss.y,
            vx: Math.cos(angle) * 110,
            vy: Math.sin(angle) * 110,
            radius: 7,
            life: 4.2,
            damage: boss.shielded ? 13 : 20,
            color: boss.shielded ? boss.projectileColor : boss.projectileColorHot,
          });
        }
        boss.ringTimer = boss.shielded ? 2.7 : 1.9;
        boss.warningRing = false;
      }

      if (boss.slamTimer <= 0) {
        const dashDir = normalize(player.x - boss.x, player.y - boss.y);
        boss.x += dashDir.x * 70;
        boss.y += dashDir.y * 70;
        addEffect(boss.x, boss.y, 140, "rgba(120, 235, 255, 0.24)", 0.28);
        if (currentDistance < 190) player.hp -= boss.bodyDamage * 2.2;
        boss.slamTimer = boss.shielded ? 6 : 4.6;
        boss.warningSlam = false;
      }

      if (distance(boss, player) < boss.radius + player.radius - 8) {
        player.hp -= boss.bodyDamage * 0.7 * dt;
      }
    } else {
      if (boss.ringTimer < 0.58 && !boss.warningRing) {
        pushEvent(t("eventTitanRing"), 1.1);
        boss.warningRing = true;
      }
      if (boss.slamTimer < 0.7 && !boss.warningSlam) {
        pushEvent(t("eventTitanLeap"), 1.1);
        boss.warningSlam = true;
      }

      boss.x += dir.x * boss.speed * dt;
      boss.y += dir.y * boss.speed * dt;

      boss.ringTimer -= dt;
      boss.slamTimer -= dt;

      if (boss.ringTimer <= 0) {
        const shots = boss.shielded ? 10 : 14;
        for (let i = 0; i < shots; i += 1) {
          const angle = (Math.PI * 2 * i) / shots + elapsed * 0.4;
          projectiles.push({
            x: boss.x,
            y: boss.y,
            vx: Math.cos(angle) * 150,
            vy: Math.sin(angle) * 150,
            radius: 7,
            life: 4,
            damage: boss.shielded ? 14 : 22,
            color: boss.shielded ? boss.projectileColor : boss.projectileColorHot,
          });
        }
        boss.ringTimer = boss.shielded ? 3.2 : 2.2;
        boss.warningRing = false;
      }

      if (boss.slamTimer <= 0) {
        const jumpDir = normalize(player.x - boss.x, player.y - boss.y);
        boss.x += jumpDir.x * 110;
        boss.y += jumpDir.y * 110;
        addEffect(boss.x, boss.y, 160, "rgba(255, 98, 73, 0.26)", 0.32);
        if (distance(boss, player) < 150) player.hp -= boss.bodyDamage * 2;
        boss.slamTimer = boss.shielded ? 5.5 : 4.3;
        boss.warningSlam = false;
      }

      if (distance(boss, player) < boss.radius + player.radius + 4) {
        player.hp -= boss.bodyDamage * dt;
      }
    }

    if (boss.hp <= 0) {
      const defeatedBoss = boss;
      addEffect(defeatedBoss.x, defeatedBoss.y, 260, "rgba(255, 207, 116, 0.35)", 0.6);
      addEffect(defeatedBoss.x, defeatedBoss.y, 180, "rgba(255, 240, 180, 0.42)", 0.36);
      addEffect(defeatedBoss.x, defeatedBoss.y, 120, "rgba(255, 98, 73, 0.32)", 0.24);
      addFloatingText(defeatedBoss.x, defeatedBoss.y - 42, t("floatTitanDown"), "#ffe7a6", 0.8, 24);
      triggerBossFinish(defeatedBoss);
      boss = null;
      bossWrap.classList.add("hidden");
    }
  }

  function updateProjectiles(dt) {
    for (const projectile of [...projectiles]) {
      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.life -= dt;

      if (distance(projectile, player) < projectile.radius + player.radius) {
        player.hp -= projectile.damage;
        gainRage(9);
        projectile.life = -1;
        addEffect(projectile.x, projectile.y, 48, "rgba(255, 210, 130, 0.2)", 0.14);
        shakeScreen(4, 0.07);
      }

      if (projectile.life <= 0) {
        const idx = projectiles.indexOf(projectile);
        if (idx >= 0) projectiles.splice(idx, 1);
      }
    }
  }

  function updateXp() {
    for (const orb of [...xpOrbs]) {
      const d = distance(orb, player);
      if (d < 180) {
        const dir = normalize(player.x - orb.x, player.y - orb.y);
        orb.pull += 9;
        orb.x += dir.x * orb.pull * 0.016;
        orb.y += dir.y * orb.pull * 0.016;
      }
      if (d < orb.radius + player.radius + 6) {
        gainXp(orb.value);
        const idx = xpOrbs.indexOf(orb);
        if (idx >= 0) xpOrbs.splice(idx, 1);
      }
    }
  }

  function updateEffects(dt) {
    for (const fx of [...visualEffects]) {
      fx.life -= dt;
      if (fx.life <= 0) {
        const idx = visualEffects.indexOf(fx);
        if (idx >= 0) visualEffects.splice(idx, 1);
      }
    }

    for (const text of [...floatingTexts]) {
      text.life -= dt;
      text.y -= 34 * dt;
      if (text.life <= 0) {
        const idx = floatingTexts.indexOf(text);
        if (idx >= 0) floatingTexts.splice(idx, 1);
      }
    }

    if (cameraShake.time > 0) {
      cameraShake.time = Math.max(0, cameraShake.time - dt);
      cameraShake.power = Math.max(0, cameraShake.power - dt * 40);
    }
  }

  function renderBackground() {
    const region = getCurrentRegion();
    const deployGlow = deployIntro.active ? deployIntro.timer / 0.95 : 0;
    ctx.fillStyle = region.palette.bg;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const gridSize = 86;
    const cameraX = player.x - window.innerWidth / 2;
    const cameraY = player.y - window.innerHeight / 2;
    const startX = -((cameraX % gridSize) + gridSize) % gridSize;
    const startY = -((cameraY % gridSize) + gridSize) % gridSize;

    ctx.strokeStyle = region.palette.grid;
    ctx.lineWidth = 1;
    for (let x = startX; x < window.innerWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, window.innerHeight);
      ctx.stroke();
    }
    for (let y = startY; y < window.innerHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(window.innerWidth, y);
      ctx.stroke();
    }

    ctx.fillStyle = region.palette.stain;
    for (let i = 0; i < 8; i += 1) {
      const wx = Math.sin(i * 12.1) * 600 + (i - 4) * 260;
      const wy = Math.cos(i * 7.4) * 420 + (i - 3) * 220;
      const pos = worldToScreen(wx, wy);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 70 + (i % 3) * 18, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.globalAlpha = 0.2 + deployGlow * 0.12;
    if (region.id === "sanctuary") {
      ctx.fillStyle = "rgba(184, 255, 244, 0.18)";
      for (let i = 0; i < 4; i += 1) {
        const pos = worldToScreen(-920 + i * 460, -260 + (i % 2) * 180);
        ctx.fillRect(pos.x, pos.y, 54 + i * 10, 200 + i * 28);
      }
    } else if (region.id === "blacktide") {
      ctx.fillStyle = "rgba(169, 255, 242, 0.14)";
      for (let i = 0; i < 5; i += 1) {
        const pos = worldToScreen(-980 + i * 420, -180 + (i % 3) * 120);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y - 120);
        ctx.lineTo(pos.x + 74, pos.y + 40);
        ctx.lineTo(pos.x - 74, pos.y + 40);
        ctx.closePath();
        ctx.fill();
      }
    } else {
      ctx.fillStyle = "rgba(255, 176, 92, 0.12)";
      for (let i = 0; i < 5; i += 1) {
        const pos = worldToScreen(-980 + i * 430, -250 + (i % 2) * 160);
        ctx.beginPath();
        ctx.rect(pos.x, pos.y, 58 + i * 10, 180 + i * 26);
        ctx.fill();
      }
    }
    ctx.restore();

    if (deployGlow > 0) {
      ctx.save();
      ctx.globalAlpha = deployGlow * 0.34;
      const beamColor =
        region.id === "sanctuary"
          ? "rgba(120, 235, 255, 0.18)"
          : region.id === "blacktide"
            ? "rgba(110, 255, 228, 0.18)"
            : "rgba(255, 176, 92, 0.18)";
      ctx.fillStyle = beamColor;
      ctx.beginPath();
      ctx.moveTo(window.innerWidth * 0.5, 0);
      ctx.lineTo(window.innerWidth * 0.5 + 120, window.innerHeight * 0.55);
      ctx.lineTo(window.innerWidth * 0.5 - 120, window.innerHeight * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.restore();
    }
  }

  function renderEnemy(enemy) {
    const pos = worldToScreen(enemy.x, enemy.y);
    if (enemy.type === "warden") {
      ctx.strokeStyle = enemy.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, enemy.radius + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(196, 255, 248, 0.18)";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, enemy.radius - 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y - enemy.radius - 4);
      ctx.lineTo(pos.x + enemy.radius + 4, pos.y);
      ctx.lineTo(pos.x, pos.y + enemy.radius + 4);
      ctx.lineTo(pos.x - enemy.radius - 4, pos.y);
      ctx.closePath();
      ctx.stroke();
    } else if (enemy.type === "drifter") {
      ctx.strokeStyle = enemy.color;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, enemy.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "rgba(156, 247, 239, 0.24)";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, enemy.radius - 3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = enemy.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (enemy.curseStacks > 0) {
      ctx.strokeStyle = "rgba(216, 140, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, enemy.radius + 6 + enemy.curseStacks * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y + enemy.radius + 10, enemy.radius * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderBoss() {
    if (!boss) return;
    const pos = worldToScreen(boss.x, boss.y);
    ctx.fillStyle = boss.shielded ? boss.bodyColor : boss.coreColor;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, boss.radius, 0, Math.PI * 2);
    ctx.fill();

    for (const weakpoint of boss.weakpoints) {
      const wp = worldToScreen(boss.x + weakpoint.ox, boss.y + weakpoint.oy);
      ctx.fillStyle = weakpoint.alive ? boss.coreColor : "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, weakpoint.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderBossTelegraphs() {
    if (!boss) return;
    ctx.save();

    if (boss.regionId === "blacktide") {
      if (boss.volleyTimer < 0.5) {
        const baseAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
        const start = worldToScreen(boss.x, boss.y);
        ctx.strokeStyle = "rgba(169, 255, 242, 0.42)";
        ctx.lineWidth = 5;
        for (const spread of [-0.34, -0.17, 0, 0.17, 0.34]) {
          const endX = boss.x + Math.cos(baseAngle + spread) * 480;
          const endY = boss.y + Math.sin(baseAngle + spread) * 480;
          const end = worldToScreen(endX, endY);
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      }

      if (boss.ringTimer < 0.55) {
        const pos = worldToScreen(boss.x, boss.y);
        ctx.strokeStyle = "rgba(120, 235, 255, 0.3)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 110, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 170, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 230, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (boss.slamTimer < 0.75 && boss.mortarTargets.length > 0) {
        ctx.fillStyle = "rgba(74, 192, 179, 0.18)";
        ctx.strokeStyle = "rgba(169, 255, 242, 0.34)";
        ctx.lineWidth = 3;
        for (const target of boss.mortarTargets) {
          const pos = worldToScreen(target.x, target.y);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 96, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, 96, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    } else if (boss.regionId === "sanctuary") {
      if (boss.volleyTimer < 0.45) {
        const baseAngle = Math.atan2(player.y - boss.y, player.x - boss.x);
        ctx.strokeStyle = "rgba(184, 255, 244, 0.42)";
        ctx.lineWidth = 5;
        for (const spread of [-0.18, 0, 0.18]) {
          const endX = boss.x + Math.cos(baseAngle + spread) * 520;
          const endY = boss.y + Math.sin(baseAngle + spread) * 520;
          const start = worldToScreen(boss.x, boss.y);
          const end = worldToScreen(endX, endY);
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
      }

      if (boss.ringTimer < 0.5) {
        const pos = worldToScreen(boss.x, boss.y);
        ctx.strokeStyle = "rgba(184, 255, 244, 0.34)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 120, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 180, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (boss.slamTimer < 0.6) {
        const dashDir = normalize(player.x - boss.x, player.y - boss.y);
        const target = worldToScreen(boss.x + dashDir.x * 70, boss.y + dashDir.y * 70);
        ctx.fillStyle = "rgba(120, 235, 255, 0.18)";
        ctx.beginPath();
        ctx.arc(target.x, target.y, 120, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      if (boss.ringTimer < 0.55) {
        const pos = worldToScreen(boss.x, boss.y);
        ctx.strokeStyle = "rgba(255, 203, 112, 0.32)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 130, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 210, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (boss.slamTimer < 0.65) {
        const jumpDir = normalize(player.x - boss.x, player.y - boss.y);
        const target = worldToScreen(boss.x + jumpDir.x * 110, boss.y + jumpDir.y * 110);
        ctx.fillStyle = "rgba(255, 98, 73, 0.2)";
        ctx.beginPath();
        ctx.arc(target.x, target.y, 140, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function renderProjectiles() {
    for (const projectile of projectiles) {
      const pos = worldToScreen(projectile.x, projectile.y);
      ctx.fillStyle = projectile.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, projectile.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderPlayer() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deployGlow = deployIntro.active ? deployIntro.timer / 0.95 : 0;

    ctx.fillStyle = player.rageModeTimer > 0 ? player.rageColor : player.color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, player.radius, 0, Math.PI * 2);
    ctx.fill();

    if (deployGlow > 0) {
      ctx.strokeStyle =
        player.characterId === "dex"
          ? `rgba(120, 235, 255, ${0.18 + deployGlow * 0.28})`
          : player.characterId === "ria"
            ? `rgba(216, 140, 255, ${0.18 + deployGlow * 0.28})`
            : player.characterId === "sera"
              ? `rgba(187, 214, 255, ${0.18 + deployGlow * 0.28})`
              : `rgba(255, 146, 51, ${0.18 + deployGlow * 0.28})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 26 + (1 - deployGlow) * 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 42 + (1 - deployGlow) * 36, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (player.slashFlash > 0) {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(Math.atan2(player.facingY, player.facingX));
      ctx.fillStyle = player.rageModeTimer > 0
        ? "rgba(255, 146, 51, 0.34)"
        : "rgba(120, 210, 255, 0.28)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, player.attackRange, -player.attackArc / 2, player.attackArc / 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    if (player.shotFlash > 0) {
      const target = worldToScreen(player.lastShotX, player.lastShotY);
      ctx.strokeStyle = player.shotColor;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
    }

    for (const blade of orbitBlades) {
      const pos = worldToScreen(blade.x, blade.y);
      ctx.fillStyle = "rgba(255, 186, 84, 0.92)";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, blade.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (player.characterId === "ria") {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(elapsed * 0.9);
      const runeAlpha = 0.14 + Math.min(0.22, player.seasonStacks * 0.012);
      ctx.strokeStyle = `rgba(216, 140, 255, ${runeAlpha})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, -34);
      ctx.lineTo(30, 18);
      ctx.lineTo(-30, 18);
      ctx.closePath();
      ctx.stroke();
      ctx.rotate(-elapsed * 1.6);
      ctx.beginPath();
      ctx.arc(0, 0, 40 + Math.sin(elapsed * 6) * 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      if (player.shotFlash > 0 || player.seasonStacks > 0) {
        for (let i = 0; i < 3; i += 1) {
          const angle = elapsed * 1.8 + i * (Math.PI * 2 / 3);
          const px = centerX + Math.cos(angle) * 24;
          const py = centerY + Math.sin(angle) * 24;
          ctx.fillStyle = `rgba(255, 168, 231, ${0.18 + i * 0.04})`;
          ctx.beginPath();
          ctx.arc(px, py, 4 + i, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    if (player.dashBurstTimer > 0) {
      ctx.strokeStyle = "rgba(103, 211, 255, 0.4)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 34, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (player.killRushTimer > 0) {
      ctx.strokeStyle = "rgba(170, 214, 255, 0.34)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 28 + Math.sin(elapsed * 12) * 4, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (player.characterId === "sera") {
      const facingAngle = Math.atan2(player.facingY, player.facingX);
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(facingAngle);
      ctx.strokeStyle =
        player.killRushTimer > 0 ? "rgba(196, 220, 255, 0.42)" : "rgba(170, 214, 255, 0.2)";
      ctx.lineWidth = 3;
      for (const offset of [-18, -8, 2]) {
        ctx.beginPath();
        ctx.moveTo(-20 + offset, -18);
        ctx.lineTo(36 + offset, 0);
        ctx.lineTo(-20 + offset, 18);
        ctx.stroke();
      }
      ctx.restore();

      if (player.killRushTimer > 0 || player.dashBurstTimer > 0) {
        ctx.save();
        ctx.translate(centerX - player.facingX * 18, centerY - player.facingY * 18);
        ctx.rotate(facingAngle);
        ctx.fillStyle = "rgba(187, 214, 255, 0.14)";
        for (let i = 0; i < 3; i += 1) {
          ctx.beginPath();
          ctx.ellipse(-12 - i * 16, 0, 10 - i * 2, 18 - i * 3, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    if (player.overdriveTimer > 0) {
      ctx.strokeStyle = "rgba(130, 232, 210, 0.32)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38 + Math.sin(elapsed * 10) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function renderXp() {
    for (const orb of xpOrbs) {
      const pos = worldToScreen(orb.x, orb.y);
      ctx.fillStyle = "#8afacb";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderEffects() {
    for (const fx of visualEffects) {
      const pos = worldToScreen(fx.x, fx.y);
      const alpha = fx.life / fx.maxLife;
      ctx.fillStyle = fx.color.replace(/[\d.]+\)$/u, `${alpha})`);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, fx.radius * (1.3 - alpha * 0.3), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderFloatingTexts() {
    for (const text of floatingTexts) {
      const pos = worldToScreen(text.x, text.y);
      const alpha = text.life / text.maxLife;
      ctx.fillStyle = text.color.replace?.(/[\d.]+\)$/u, `${alpha})`) ?? text.color;
      ctx.font = `700 ${text.size}px Trebuchet MS, Segoe UI, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(text.text, pos.x, pos.y);
    }
  }

  function render() {
    renderOffsetX = cameraShake.time > 0 ? rand(-cameraShake.power, cameraShake.power) : 0;
    renderOffsetY = cameraShake.time > 0 ? rand(-cameraShake.power, cameraShake.power) : 0;
    ctx.save();
    ctx.translate(renderOffsetX, renderOffsetY);
    renderBackground();
    renderXp();
    for (const enemy of enemies) renderEnemy(enemy);
    renderBossTelegraphs();
    renderBoss();
    renderProjectiles();
    renderEffects();
    renderFloatingTexts();
    renderPlayer();
    ctx.restore();
  }

  function updateHud() {
    hpFill.style.width = `${(player.hp / player.maxHp) * 100}%`;
    rageFill.style.width = `${(player.rage / player.maxRage) * 100}%`;
    timerText.textContent = formatTime(Math.max(0, runDuration - elapsed));
    killsText.textContent = fmt("hudKills", { count: player.kills });
    levelText.textContent = fmt("hudLevel", { level: player.level });
    dashButton.textContent = player.dashTimer > 0 ? fmt("hudDashCooldown", { time: player.dashTimer.toFixed(1) }) : t("hudDashReady");
    const ultName = getCharacterCopy(player.characterId, "ultLabel");
    ultimateButton.textContent = player.ultimateCooldown > 0
      ? fmt("hudUltCooldown", { name: ultName, time: player.ultimateCooldown.toFixed(1) })
      : fmt("hudUltReady", { name: ultName });
    runObjectiveText.textContent = getRunObjectiveText();
    eventText.textContent = eventBanner.text || "";
    eventText.classList.toggle("hidden", eventBanner.timer <= 0);

    if (boss) {
      bossFill.style.width = `${(boss.hp / boss.maxHp) * 100}%`;
      const aliveCount = boss.weakpoints.filter((item) => item.alive).length;
      bossPartsText.textContent = boss.shielded ? fmt("hudWeakpoints", { count: aliveCount }) : t("hudCoreExposed");
    }
  }

  function updateFtueEvents(dt) {
    if (eventBanner.timer > 0) {
      eventBanner.timer -= dt;
      if (eventBanner.timer <= 0) {
        eventBanner.text = "";
      }
    }

    const mode = getCurrentMode();
    const firstRun = meta.runs === 0;

    if (firstRun && !runFlags.intro && elapsed > 2) {
      pushEvent(
        player.characterId === "dex"
          ? t("eventIntroDex")
          : player.characterId === "ria"
            ? t("eventIntroRia")
            : player.characterId === "sera"
              ? t("eventIntroSera")
          : t("eventIntroCain"),
      );
      runFlags.intro = true;
    }

    if (firstRun && !runFlags.levelHint && player.level >= 2) {
      pushEvent(
        player.characterId === "dex"
          ? t("eventLevelDex")
          : player.characterId === "ria"
            ? t("eventLevelRia")
            : player.characterId === "sera"
              ? t("eventLevelSera")
          : t("eventLevelCain"),
      );
      runFlags.levelHint = true;
    }

    if (firstRun && !runFlags.eliteHint && elapsed > 42) {
      pushEvent(t("eventElite"));
      runFlags.eliteHint = true;
    }

    if (!runFlags.bossHint && bossSpawned) {
      const region = getCurrentRegion();
      pushEvent(
        region.id === "sanctuary"
          ? t("eventBossSanctuary")
          : mode.id === "boss"
            ? t("eventBossWorld")
            : mode.id === "rift"
              ? t("eventBossRift")
            : t("eventBossTitan"),
        4.5,
      );
      runFlags.bossHint = true;
    }

    if (mode.id === "gauntlet" && !runFlags.bossHint && elapsed > 8) {
      pushEvent(t("gauntletBurn"), 3.8);
      runFlags.bossHint = true;
    }
  }

  function getRunObjectiveText() {
    const mode = getCurrentMode();
    const region = getCurrentRegion();
    const regionBossName = getRegionCopy(region.id, "bossName") || region.bossName;
    if (mode.id === "boss") {
      if (!bossSpawned) return t("worldBossInbound");
      if (boss && boss.shielded) return t("breakBothWeakpoints");
      if (boss) return fmt("exposedCore", { boss: regionBossName });
      return t("titanDown");
    }

    if (mode.id === "rift") {
      if (!bossSpawned) {
        const remaining = Math.max(0, Math.ceil(mode.bossTime - elapsed));
        return fmt("holdTheRift", { seconds: remaining });
      }
      if (boss && boss.shielded) return t("collapseRiftArmor");
      if (boss) return t("sealRiftCore");
      return t("riftSealed");
    }

    if (mode.id === "gauntlet") {
      const remaining = Math.max(0, Math.ceil(runDuration - elapsed));
      return bossSpawned ? t("gauntletBurn") : fmt("holdTheGauntlet", { seconds: remaining });
    }

    if (!bossSpawned) {
      const remaining = Math.max(0, Math.ceil(mode.bossTime - elapsed));
      return fmt("surviveUntilTitan", { seconds: remaining });
    }
    if (boss && boss.shielded) return t("shatterTitanArmor");
    if (boss) return t("bloodRushEndRun");
    return t("runCompleteText");
  }

  function formatTime(value) {
    const total = Math.ceil(value);
    const min = String(Math.floor(total / 60)).padStart(2, "0");
    const sec = String(total % 60).padStart(2, "0");
    return `${min}:${sec}`;
  }

  function unlockNextRelic() {
    const nextLocked = relicDefs.find(
      (item) =>
        !meta.unlockedRelics.includes(item.id) &&
        !["crimson-crown", "eclipse-coil", "blood-archive"].includes(item.id),
    );
    if (!nextLocked) return null;
    meta.unlockedRelics.push(nextLocked.id);
    if (meta.equippedRelics.filter(Boolean).length < 2) {
      const firstEmpty = meta.equippedRelics.findIndex((item) => !item);
      if (firstEmpty >= 0) meta.equippedRelics[firstEmpty] = nextLocked.id;
    }
    return nextLocked;
  }

  function unlockNextSeasonRelic() {
    const nextLocked = relicDefs.find(
      (item) =>
        ["crimson-crown", "eclipse-coil", "blood-archive"].includes(item.id) &&
        !meta.unlockedRelics.includes(item.id),
    );
    if (!nextLocked) return null;
    meta.unlockedRelics.push(nextLocked.id);
    return nextLocked;
  }

  function applyRunRewards(reason) {
    const victory = reason === "victory";
    const mode = getCurrentMode();
    const bossMode = mode.hasBoss !== false;
    const firstRun = meta.runs === 0;
    const firstTitanKill = victory && bossMode && meta.bossKills === 0;
    const rewardMult =
      player.rewardMultiplier *
      (mode.id === "boss" ? 1.35 : mode.id === "rift" ? 1.22 : mode.id === "gauntlet" ? 1.18 : 1);
    let gold = Math.floor((player.kills * 8 + player.level * 24 + (victory ? 180 : 45)) * rewardMult);
    let cores = Math.floor((Math.max(2, player.level + Math.floor(player.kills / 12)) + (victory ? 8 : 0)) * rewardMult);
    let data = Math.floor((player.level * 4 + (victory ? 20 : 6)) * rewardMult);
    let genes = 0;
    let gauntletScore = 0;
    let gauntletRecord = false;
    const bonusLines = [];
    const passXpGain = Math.floor(
      player.kills * 0.9 +
      player.level * 6 +
      (victory ? 20 : 8) +
      (mode.id === "boss" ? 18 : mode.id === "rift" ? 12 : mode.id === "gauntlet" ? 14 : 0),
    );
    const seasonProgress = {
      kills: Math.min(player.kills, seasonDef.killTarget),
      weakpoints: Math.min(player.seasonWeakpoints, seasonDef.weakpointTarget),
      completed:
        player.kills >= seasonDef.killTarget &&
        player.seasonWeakpoints >= seasonDef.weakpointTarget,
    };

    if (firstRun) {
      gold += 120;
      cores += 6;
      data += 10;
      bonusLines.push(t("firstRunCacheLine"));
    }

    if (firstTitanKill) {
      gold += 220;
      cores += 10;
      data += 24;
      bonusLines.push(t("firstTitanBountyLine"));
    }

    if (mode.id === "boss") {
      genes = Math.max(2, Math.floor(((victory ? 12 : 4) + player.level + player.kills / 20) * rewardMult));
      bonusLines.push(t("worldBossPayoutLine"));
      bonusLines.push(fmt("genomeSampleLine", { genes }));
    } else if (mode.id === "rift") {
      bonusLines.push(t("riftPayoutLine"));
    } else if (mode.id === "gauntlet") {
      bonusLines.push(t("gauntletPayoutLine"));
      gauntletScore = computeGauntletScore({ kills: player.kills, level: player.level, victory });
    }

    let newSeasonRelic = null;
    if (seasonProgress.completed) {
      gold += 90;
      data += 16;
      meta.seasonClears += 1;
      newSeasonRelic = unlockNextSeasonRelic();
      bonusLines.push(t("seasonBreakpointBonusLine"));
      if (newSeasonRelic) {
        bonusLines.push(fmt("seasonRelicUnlockedLine", { title: lt(newSeasonRelic.title) }));
      }
    }

    meta.seasonPassXp += passXpGain;
    const unlockedPassTiers = getClaimableSeasonPassTiers();
    if (unlockedPassTiers.length > 0) {
      bonusLines.push(
        fmt("seasonPassTierReadyLine", {
          titles: unlockedPassTiers
            .map((tier) => getPassTierCopy(tier.id, "title") || tier.title)
            .join(" / "),
        }),
      );
    }

    const dropCount =
      mode.id === "boss"
        ? victory
          ? 2
          : 1
        : mode.id === "rift"
          ? victory
            ? 3
            : 2
        : mode.id === "gauntlet"
          ? victory
            ? 2
            : 1
          : 1;
    const droppedItems = [];
    for (let i = 0; i < dropCount; i += 1) {
      const item = generateLootDrop({ victory, modeId: mode.id });
      meta.inventory.push(item);
      droppedItems.push(item);
    }

    meta.gold += gold;
    meta.cores += cores;
    meta.data += data;
    meta.genes += genes;
    meta.runs += 1;
    meta.bestKills = Math.max(meta.bestKills, player.kills);

    let newRelic = null;
    if (victory && bossMode) {
      meta.bossKills += 1;
      newRelic = unlockNextRelic();
    }
    if (victory) {
      meta.regionClears[meta.selectedRegion] = (meta.regionClears[meta.selectedRegion] ?? 0) + 1;
    }
    if (victory && mode.id === "boss") {
      meta.worldBossWins += 1;
      if (meta.bossBestTime === 0 || elapsed < meta.bossBestTime) {
        meta.bossBestTime = elapsed;
        bonusLines.push(t("newModeRecordLine"));
        bonusLines.push(fmt("bossRecordLine", { time: formatTime(elapsed) }));
      }
    }
    if (victory && mode.id === "rift") {
      meta.riftWins += 1;
      if (player.kills > meta.riftBestKills) {
        meta.riftBestKills = player.kills;
        bonusLines.push(t("newModeRecordLine"));
        bonusLines.push(fmt("riftRecordLine", { count: player.kills }));
      }
    }
    if (victory && mode.id === "gauntlet") {
      meta.gauntletWins += 1;
      bonusLines.push(t("gauntletLiveLine"));
      if (gauntletScore > meta.gauntletBest) {
        meta.gauntletBest = gauntletScore;
        gauntletRecord = true;
        bonusLines.push(fmt("gauntletNewRecordLine", { score: gauntletScore }));
      } else {
        bonusLines.push(fmt("gauntletScoreLine", { score: gauntletScore }));
      }
      updateGauntletBoard({
        score: gauntletScore,
        kills: player.kills,
        level: player.level,
        hunter: meta.selectedCharacter,
        region: meta.selectedRegion,
      });
    }
    if (mode.id === "hunt" && player.kills > meta.huntBestKills) {
      meta.huntBestKills = player.kills;
      bonusLines.push(t("newModeRecordLine"));
      bonusLines.push(fmt("huntRecordLine", { count: player.kills }));
    }

    const currentRegionRecord = meta.regionRecords?.[meta.selectedRegion];
    if (!currentRegionRecord || player.kills > currentRegionRecord.kills) {
      meta.regionRecords[meta.selectedRegion] = {
        kills: player.kills,
        mode: mode.id,
        hunter: meta.selectedCharacter,
      };
    }

    meta.recentRuns = [
      {
        mode: mode.id,
        region: meta.selectedRegion,
        hunter: meta.selectedCharacter,
        victory,
        kills: player.kills,
        level: player.level,
        time: elapsed,
      },
      ...(meta.recentRuns ?? []),
    ].slice(0, 5);

    const ftueLines = processFtueMilestones();
    bonusLines.push(...ftueLines);

    saveMeta();
    currentRewards = {
      gold,
      cores,
      data,
      genes,
      gauntletScore,
      gauntletRecord,
      newRelic,
      newSeasonRelic,
      bonusLines,
      droppedItems,
      seasonProgress,
      seasonPassGain: passXpGain,
      seasonPassUnlocked: unlockedPassTiers,
    };
  }

  function endRun(reason) {
    if (gameOver) return;
    gameOver = true;
    applyRunRewards(reason);
    resultsOverlay.classList.remove("hidden");
    finishOverlay.classList.add("hidden");
    hideUltimateCutin();
    renderShellLabels();
    const mode = getCurrentMode();
    resultTitle.textContent =
      reason === "victory"
        ? mode.id === "gauntlet"
          ? t("resultVictoryGauntlet")
          : t("resultVictory")
        : t("resultDefeat");
    resultBody.textContent =
      fmt("resultRecoveredLine", { gold: currentRewards.gold, cores: currentRewards.cores, data: currentRewards.data, genes: currentRewards.genes }) +
      fmt("resultSeasonXpLine", { xp: currentRewards.seasonPassGain }) +
      (mode.id === "gauntlet" ? fmt("gauntletScoreLine", { score: currentRewards.gauntletScore }) : "") +
      (currentRewards.newRelic ? fmt("resultNewRelicLine", { title: lt(currentRewards.newRelic.title) }) : "") +
      (currentRewards.newSeasonRelic ? fmt("resultNewSeasonRelicLine", { title: lt(currentRewards.newSeasonRelic.title) }) : "") +
      (currentRewards.droppedItems.length > 0
        ? fmt("resultLootLine", { items: currentRewards.droppedItems.map((item) => localizeItemName(item.name)).join(", ") })
        : "");
    if (currentRewards.bonusLines.length > 0) {
      resultBonus.textContent = currentRewards.bonusLines.join(" // ");
      resultBonus.classList.remove("hidden");
    } else {
      resultBonus.classList.add("hidden");
    }
    resultKills.textContent = String(player.kills);
    resultLevel.textContent = String(player.level);
    resultBoss.textContent =
      mode.id === "gauntlet" && reason === "victory"
        ? t("bossStateCleared")
        : reason === "victory"
          ? t("bossStateDead")
          : bossSpawned
            ? t("bossStateAlive")
            : t("bossStateNotSpawned");
    renderResultRewards();
    renderSeasonResult();
    renderBase();
    setGameVisibility(false);
    screen = "results";
  }

  function setGameVisibility(visible) {
    hud.classList.toggle("hidden", !visible);
    controls.classList.toggle("hidden", !visible);
  }

  function startRun() {
    ensureSelectionsUnlocked();
    const mode = getCurrentMode();
    const region = getCurrentRegion();
    const character = characterDefs[meta.selectedCharacter] ?? characterDefs.cain;
    player = createPlayerFromMeta();
    runDuration = mode.duration;
    enemies.length = 0;
    xpOrbs.length = 0;
    projectiles.length = 0;
    visualEffects.length = 0;
    floatingTexts.length = 0;
    orbitBlades.length = 0;
    boss = null;
    elapsed = 0;
    spawnClock = 0;
    pausedForLevel = false;
    gameOver = false;
    bossSpawned = false;
    eventBanner = { text: "", timer: 0 };
    runFlags = { intro: false, levelHint: false, eliteHint: false, bossHint: false };
    finisher = { active: false, timer: 0 };
    deployIntro = { active: false, timer: 0 };
    hideChapterUnlock();
    hideUltimateCutin();
    cameraShake = { time: 0, power: 0 };
    levelOverlay.classList.add("hidden");
    finishOverlay.classList.add("hidden");
    resultsOverlay.classList.add("hidden");
    resultBonus.classList.add("hidden");
    titleOverlay.classList.add("hidden");
    introOverlay.classList.add("hidden");
    baseOverlay.classList.add("hidden");
    bossWrap.classList.add("hidden");
    bossLabel.textContent = getRegionCopy(region.id, "bossName") || region.bossName;
    resultRewardStrip.innerHTML = "";
    resultLootGrid.innerHTML = "";
    resultSeasonProgress.innerHTML = "";
    triggerDeployIntro(character, mode, region);
    setGameVisibility(true);
    screen = "run";
  }

  function renderIntroSlide() {
    const slide = introSlides[introIndex] ?? introSlides[introSlides.length - 1];
    renderShellLabels();
    introEyebrow.textContent = t(`intro${slide}Eyebrow`);
    introTitle.textContent = t(`intro${slide}Title`);
    introBody.textContent = t(`intro${slide}Body`);
    introNextButton.textContent =
      introIndex >= introSlides.length - 1 ? t("enterBase") : t("next");
  }

  function showTitle() {
    renderShellLabels();
    renderBase();
    screen = "title";
    eventBanner = { text: "", timer: 0 };
    finisher = { active: false, timer: 0 };
    hideDeployIntro();
    hideChapterUnlock();
    hideUltimateCutin();
    titleOverlay.classList.remove("hidden");
    introOverlay.classList.add("hidden");
    baseOverlay.classList.add("hidden");
    resultsOverlay.classList.add("hidden");
    levelOverlay.classList.add("hidden");
    finishOverlay.classList.add("hidden");
    bossWrap.classList.add("hidden");
    setGameVisibility(false);
  }

  function finishIntro() {
    meta.seenIntro = true;
    saveMeta();
    showBase();
  }

  function showIntro() {
    introIndex = 0;
    renderIntroSlide();
    screen = "intro";
    eventBanner = { text: "", timer: 0 };
    finisher = { active: false, timer: 0 };
    hideDeployIntro();
    hideChapterUnlock();
    hideUltimateCutin();
    titleOverlay.classList.add("hidden");
    introOverlay.classList.remove("hidden");
    baseOverlay.classList.add("hidden");
    resultsOverlay.classList.add("hidden");
    levelOverlay.classList.add("hidden");
    finishOverlay.classList.add("hidden");
    bossWrap.classList.add("hidden");
    setGameVisibility(false);
  }

  function showBase() {
    renderBase();
    screen = "base";
    eventBanner = { text: "", timer: 0 };
    finisher = { active: false, timer: 0 };
    hideDeployIntro();
    hideChapterUnlock();
    hideUltimateCutin();
    titleOverlay.classList.add("hidden");
    introOverlay.classList.add("hidden");
    baseOverlay.classList.remove("hidden");
    resultsOverlay.classList.add("hidden");
    levelOverlay.classList.add("hidden");
    finishOverlay.classList.add("hidden");
    bossWrap.classList.add("hidden");
    resultRewardStrip.innerHTML = "";
    resultLootGrid.innerHTML = "";
    resultSeasonProgress.innerHTML = "";
    setGameVisibility(false);
    queueUnlockedRegionOverlays();
  }

  function renderEquipmentTab() {
    const selectedCharacter = meta.selectedCharacter;
    const setSummary = Object.entries(getActiveSetCounts())
      .map(([setId, count]) => {
        const set = gearSetDefs[setId];
        if (!set) return "";
        const activeBits = [];
        if (count >= 2) activeBits.push(fmt("twoPieceLive", { body: lt(set.twoPiece) }));
        else activeBits.push(fmt("twoPiece", { body: lt(set.twoPiece) }));
        if (count >= 3) activeBits.push(fmt("threePieceLive", { body: lt(set.threePiece) }));
        else activeBits.push(fmt("threePiece", { body: lt(set.threePiece) }));
        return `
          <article class="loot-card ${count >= 3 ? "loot-card--legendary" : count >= 2 ? "loot-card--epic" : "loot-card--common"}">
            <span class="loot-card__label">${fmt("setActiveLabel", { count })}</span>
            <h2 class="loot-card__title">${lt(set.name)}</h2>
            <p class="loot-card__body">${activeBits.join(" // ")}</p>
          </article>
        `;
      })
      .join("");
    const equippedCards = gearSlots
      .map((slot) => {
        const item = getEquippedItem(slot.id);
        return `
          <article class="base-card">
            <span class="base-card__label">${fmt("equippedLabel", { slot: slotTitle(slot.id).toUpperCase() })}</span>
            <h2 class="base-card__title">${item ? localizeItemName(item.name) : t("empty")}</h2>
            <p class="base-card__body">${item ? `${getAffinityLabel(item)}${getSetName(item.setId) ? ` // ${getSetName(item.setId)}` : ""} // ${describeItemStats(item, selectedCharacter)}` : t("noItemEquipped")}</p>
          </article>
        `;
      })
      .join("");

    const inventoryCards = meta.inventory
      .slice()
      .sort((a, b) => {
        const rarityOrder = ["common", "rare", "epic", "legendary"];
        return rarityOrder.indexOf(b.rarity) - rarityOrder.indexOf(a.rarity);
      })
      .map((item) => {
        const equipped = meta.equippedGear[item.slot] === item.id;
        const rarity = rarityDefs[item.rarity];
        const salvage = `${rarity.salvageGold}G / ${rarity.salvageCores}C`;
        const current = getEquippedItem(item.slot);
        const delta = estimateItemPower(item, selectedCharacter) - (current ? estimateItemPower(current, selectedCharacter) : 0);
        const deltaText = current
          ? fmt("powerVsEquipped", { delta: `${delta >= 0 ? "+" : ""}${delta}` })
          : fmt("powerStandalone", { power: estimateItemPower(item, selectedCharacter) });
        return `
          <article class="base-card">
            <span class="base-card__label">${rarity.label} ${slotTitle(item.slot).toUpperCase()} // ${getAffinityLabel(item)}${getSetName(item.setId) ? ` // ${getSetName(item.setId).toUpperCase()}` : ""}</span>
            <h2 class="base-card__title">${localizeItemName(item.name)}</h2>
            <p class="base-card__body">${describeItemStats(item, selectedCharacter)}</p>
            <span class="upgrade-meta">${deltaText}</span>
            <div class="button-row">
              <button class="upgrade-button${equipped ? " is-equipped" : ""}" data-action="equip-item" data-id="${item.id}" type="button">
                <span class="upgrade-button__title">${equipped ? t("equipped") : fmt("equipSlot", { slot: slotTitle(item.slot) })}</span>
                <span class="upgrade-button__body">${equipped ? t("itemActiveNextRun") : t("swapInNextRun")}</span>
              </button>
              <button class="secondary-button" data-action="salvage-item" data-id="${item.id}" type="button" ${equipped ? "disabled" : ""}>
                ${fmt("salvageAction", { amount: salvage })}
              </button>
            </div>
          </article>
        `;
      })
      .join("");

    return `
      <div class="upgrade-row">
        ${equippedCards}
      </div>
      <article class="base-card">
        <span class="base-card__label">${t("setBonuses")}</span>
        <h2 class="base-card__title">${t("twoThreeSpikeTitle")}</h2>
        <p class="base-card__body">${t("twoThreeSpikeBody")}</p>
      </article>
      <div class="loot-grid">
        ${setSummary || `<article class="loot-card loot-card--common"><span class="loot-card__label">${t("noSetActive")}</span><h2 class="loot-card__title">${t("mixAndMatchTitle")}</h2><p class="loot-card__body">${t("mixAndMatchBody")}</p></article>`}
      </div>
      <article class="base-card">
        <span class="base-card__label">${t("backpack")}</span>
        <h2 class="base-card__title">${t("lootInventory")}</h2>
        <p class="base-card__body">${t("lootInventoryBody")}</p>
      </article>
      <div class="upgrade-row">
        ${inventoryCards}
      </div>
    `;
  }

  function renderSelectors() {
    characterSelect.innerHTML = Object.values(characterDefs)
      .map(
        (character) => {
          const unlocked = isCharacterUnlocked(character.id);
          return `
          <button class="selector-button${meta.selectedCharacter === character.id ? " is-active" : ""}${unlocked ? "" : " is-locked"}" data-type="hunter" data-action="select-character" data-id="${character.id}" type="button" ${unlocked ? "" : "disabled"}>
            <span class="selector-button__title">${getCharacterName(character.id)}</span>
            <span class="selector-button__body">${unlocked ? getCharacterCopy(character.id, "cardBody") : fmt("lockedCharacter", { rule: getCharacterCopy(character.id, "unlockRule") })}</span>
          </button>
        `;
        },
      )
      .join("");

    modeSelect.innerHTML = Object.values(modeDefs)
      .map(
        (mode) => {
          const unlocked = isModeUnlocked(mode.id);
          return `
          <button class="selector-button${meta.selectedMode === mode.id ? " is-active" : ""}${unlocked ? "" : " is-locked"}" data-type="mode" data-action="select-mode" data-id="${mode.id}" type="button" ${unlocked ? "" : "disabled"}>
            <span class="selector-button__title">${getModeCopy(mode.id, "name")}</span>
            <span class="selector-button__body">${unlocked ? getModeCopy(mode.id, "body") : fmt("lockedCharacter", { rule: getModeCopy(mode.id, "unlockRule") || t("lockedMode") })}</span>
          </button>
        `;
        },
      )
      .join("");

    regionSelect.innerHTML = Object.values(regionDefs)
      .map((region) => {
        const unlocked = isRegionUnlocked(region.id);
        return `
          <button class="selector-button${meta.selectedRegion === region.id ? " is-active" : ""}${unlocked ? "" : " is-locked"}" data-type="region" data-action="select-region" data-id="${region.id}" type="button" ${unlocked ? "" : "disabled"}>
            <span class="selector-button__title">${getRegionCopy(region.id, "name") || region.name}</span>
            <span class="selector-button__body">${unlocked ? getRegionCopy(region.id, "body") : t("lockedRegion")}</span>
          </button>
        `;
      })
      .join("");
  }

  function renderOperationMap() {
    const activeRegion = getCurrentRegion();
    const nodes = Object.values(regionDefs)
      .map((region, index) => {
        const unlocked = isRegionUnlocked(region.id);
        const active = meta.selectedRegion === region.id;
        const isNew = unlocked && !(meta.seenRegionUnlocks ?? []).includes(region.id);
        const clearCount = meta.regionClears?.[region.id] ?? 0;
        const state = active
          ? t("operationNodeActive")
          : unlocked
            ? t("operationNodeCleared")
            : t("operationNodeLocked");
        return `
          <button class="operation-node${active ? " is-active" : ""}${unlocked ? "" : " is-locked"}${isNew ? " is-new" : ""}" data-action="select-region" data-id="${region.id}" type="button" ${unlocked ? "" : "disabled"}>
            <span class="operation-node__chapter">${fmt("operationChapter", { index: index + 1 })}</span>
            <strong class="operation-node__title">${getRegionCopy(region.id, "name") || region.name}</strong>
            <span class="operation-node__state">${state}${isNew ? ` // ${t("operationNodeNew")}` : ""}</span>
            <span class="operation-node__meta">${unlocked ? (clearCount > 0 ? fmt("operationNodeClears", { count: clearCount }) : t("operationNodeUncleared")) : "&nbsp;"}</span>
            <span class="operation-node__body">${unlocked ? getRegionCopy(region.id, "body") : getRegionCopy(region.id, "unlockRule")}</span>
          </button>
        `;
      })
      .join("");

    operationMap.innerHTML = `
      <div class="operation-map__nodes">
        ${nodes}
      </div>
      <article class="base-card operation-briefing" data-region="${activeRegion.id}">
        <span class="base-card__label">${t("operationBriefing")}</span>
        <h2 class="base-card__title">${getRegionCopy(activeRegion.id, "name") || activeRegion.name}</h2>
        <p class="base-card__body">${getRegionCopy(activeRegion.id, "body")}</p>
        <div class="operation-briefing__grid">
          <article class="showcase-chip">
            <span class="showcase-chip__label">${t("operationTarget")}</span>
            <strong class="showcase-chip__value">${getRegionCopy(activeRegion.id, "bossName") || activeRegion.bossName}</strong>
          </article>
          <article class="showcase-chip">
            <span class="showcase-chip__label">${t("operationThreat")}</span>
            <strong class="showcase-chip__value">${getRegionCopy(activeRegion.id, "threat")}</strong>
          </article>
          <article class="showcase-chip">
            <span class="showcase-chip__label">${t("operationCommand")}</span>
            <strong class="showcase-chip__value">${getRegionCopy(activeRegion.id, "command")}</strong>
          </article>
          <article class="showcase-chip">
            <span class="showcase-chip__label">${t("operationReward")}</span>
            <strong class="showcase-chip__value">${getRegionCopy(activeRegion.id, "reward")}</strong>
          </article>
          <button class="showcase-chip showcase-chip--interactive" data-action="apply-operation-mode" data-id="${getRegionCopy(activeRegion.id, "modeId")}" type="button">
            <span class="showcase-chip__label">${t("operationMode")}</span>
            <strong class="showcase-chip__value">${getRegionCopy(activeRegion.id, "mode")}</strong>
          </button>
          <button class="showcase-chip showcase-chip--interactive" data-action="apply-operation-hunter" data-id="${getRegionCopy(activeRegion.id, "hunterId")}" type="button">
            <span class="showcase-chip__label">${t("operationHunter")}</span>
            <strong class="showcase-chip__value">${getRegionCopy(activeRegion.id, "hunter")}</strong>
          </button>
        </div>
        <div class="operation-briefing__actions">
          <p class="base-card__body">${t("operationDeployBody")}</p>
          <button class="primary-button" data-action="deploy-operation" data-id="${activeRegion.id}" type="button">${t("operationDeploy")}</button>
        </div>
      </article>
    `;
  }

  function renderRelicsTab() {
    const equippedSet = new Set(meta.equippedRelics.filter(Boolean));
    const equipped = meta.equippedRelics
      .map((id, idx) => fmt("slotLabel", { index: idx + 1, name: id ? lt(getRelic(id).title) : t("empty") }))
      .join(" / ");

    return `
      <article class="base-card">
        <span class="base-card__label">${t("relicLoadout")}</span>
        <h2 class="base-card__title">${equipped}</h2>
        <p class="base-card__body">${t("relicTapBody")}</p>
      </article>
      <div class="relic-row">
        ${relicDefs
          .map((relic) => {
            const unlocked = meta.unlockedRelics.includes(relic.id);
            const equippedClass = equippedSet.has(relic.id) ? " is-equipped" : "";
            return `
              <button class="relic-button${equippedClass}" data-action="toggle-relic" data-id="${relic.id}" type="button" ${unlocked ? "" : "disabled"}>
                <span class="relic-button__title">${lt(relic.title)}</span>
                <span class="relic-meta">${unlocked ? t("unlocked") : getRelicUnlockRule(relic.id)}</span>
                <span class="relic-button__body">${lt(relic.description)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    `;
  }

  function renderResearchTab() {
    return researchTracks
      .map((track) => {
        const level = meta.research[track.id];
        const capped = level >= track.maxLevel;
        const cost = capped ? null : track.getCost(level + 1);
        return `
          <article class="base-card">
            <span class="base-card__label">${t("researchLabel")}</span>
            <h2 class="base-card__title">${lt(track.title)} LV ${level}</h2>
            <p class="base-card__body">${lt(track.description)}</p>
            <span class="upgrade-meta">${track.getEffect(level)}</span>
            <button class="upgrade-button" data-action="upgrade-research" data-id="${track.id}" type="button">
              <span class="upgrade-button__title">${capped ? t("maxed") : fmt("researchFor", { data: cost.data })}</span>
              <span class="upgrade-button__body">${capped ? t("prototypeCapReached") : track.getEffect(level + 1)}</span>
            </button>
          </article>
        `;
      })
      .join("");
  }

  function renderAscensionTab() {
    const awakeningCards = Object.values(characterDefs)
      .filter((character) => isCharacterUnlocked(character.id))
      .map((character) => {
        const awakening = awakeningDefs[character.id];
        const unlocked = meta.awakenings[character.id] > 0;
        return `
          <article class="base-card">
            <span class="base-card__label">${t("hunterAwakening")}</span>
            <h2 class="base-card__title">${getCharacterName(character.id)} // ${lt(awakening.title)}</h2>
            <p class="base-card__body">${lt(awakening.description)}</p>
            <span class="upgrade-meta">${unlocked ? t("awakenedActive") : fmt("costGenes", { genes: awakening.cost })}</span>
            <button class="upgrade-button${unlocked ? " is-equipped" : ""}" data-action="upgrade-awakening" data-id="${character.id}" type="button">
              <span class="upgrade-button__title">${unlocked ? t("awakened") : fmt("awakenHunter", { name: getCharacterName(character.id) })}</span>
              <span class="upgrade-button__body">${unlocked ? t("awakenedBody") : character.id === meta.selectedCharacter ? t("selectedHunterBody") : t("unlockSwapBody")}</span>
            </button>
          </article>
        `;
      })
      .join("");

    return `
      <article class="base-card">
        <span class="base-card__label">${t("ascensionCore")}</span>
        <h2 class="base-card__title">${t("spendGenesTitle")}</h2>
        <p class="base-card__body">${t("spendGenesBody")}</p>
        <span class="upgrade-meta">${fmt("geneBankLabel", { genes: meta.genes })}</span>
      </article>
      ${awakeningCards}
      ${ascensionTracks
        .map((track) => {
          const level = meta.ascension[track.id];
          const capped = level >= track.maxLevel;
          const cost = capped ? null : track.getCost(level + 1);
          return `
            <article class="base-card">
              <span class="base-card__label">${t("ascensionLabel")}</span>
              <h2 class="base-card__title">${lt(track.title)} LV ${level}</h2>
              <p class="base-card__body">${lt(track.description)}</p>
              <span class="upgrade-meta">${track.getEffect(level)}</span>
              <button class="upgrade-button" data-action="upgrade-ascension" data-id="${track.id}" type="button">
                <span class="upgrade-button__title">${capped ? t("maxed") : fmt("ascendFor", { genes: cost.genes })}</span>
                <span class="upgrade-button__body">${capped ? t("titanLimitReached") : track.getEffect(level + 1)}</span>
              </button>
            </article>
          `;
        })
        .join("")}
    `;
  }

  function renderSeasonTab() {
    const activeBonus = Math.round(player.seasonStacks * 2.2);
    const nextSeasonRelic = relicDefs.find(
      (item) =>
        ["crimson-crown", "eclipse-coil", "blood-archive"].includes(item.id) &&
        !meta.unlockedRelics.includes(item.id),
    );
    const claimableTiers = new Set(getClaimableSeasonPassTiers().map((tier) => tier.id));
    const claimableContracts = new Set(getClaimableContracts().map((contract) => contract.id));
    const passCards = seasonDef.passTiers
      .map((tier) => {
        const claimed = meta.seasonPassClaims.includes(tier.id);
        const unlocked = meta.seasonPassXp >= tier.xp;
        const stateLabel = claimed
          ? t("claimedUpper")
          : unlocked
            ? t("claimReady")
            : fmt("unlocksAtXp", { xp: tier.xp });
        return `
          <article class="base-card">
            <span class="base-card__label">${t("seasonPassLabel")} // ${stateLabel}</span>
            <h2 class="base-card__title">${getPassTierCopy(tier.id, "title") || tier.title}</h2>
            <p class="base-card__body">${getPassTierCopy(tier.id, "body") || tier.body}</p>
            <span class="upgrade-meta">${fmt("progressXp", { current: Math.min(meta.seasonPassXp, tier.xp), target: tier.xp })}</span>
            <button class="upgrade-button${claimed ? " is-equipped" : ""}" data-action="claim-pass-tier" data-id="${tier.id}" type="button" ${claimableTiers.has(tier.id) ? "" : "disabled"}>
              <span class="upgrade-button__title">${claimed ? t("claimedUpper") : unlocked ? t("claimReward") : t("lockedSimple")}</span>
              <span class="upgrade-button__body">${claimed ? t("alreadyBanked") : unlocked ? t("sendCacheNow") : t("earnMoreSeasonXp")}</span>
            </button>
          </article>
        `;
      })
      .join("");
    const contractCards = contractDefs
      .map((contract) => {
        const claimed = meta.contractClaims.includes(contract.id);
        const complete = contract.isComplete();
        const progress = contract.progress();
        return `
          <article class="base-card">
            <span class="base-card__label">${fmt("liveContractLabel", { state: claimed ? t("claimedUpper") : complete ? t("contractReady") : `${progress.current}/${progress.target}` })}</span>
            <h2 class="base-card__title">${getContractCopy(contract.id, "title") || contract.title}</h2>
            <p class="base-card__body">${getContractCopy(contract.id, "body") || contract.body}</p>
            <button class="upgrade-button${claimed ? " is-equipped" : ""}" data-action="claim-contract" data-id="${contract.id}" type="button" ${claimableContracts.has(contract.id) ? "" : "disabled"}>
              <span class="upgrade-button__title">${claimed ? t("claimedUpper") : complete ? t("claimContract") : t("inProgress")}</span>
              <span class="upgrade-button__body">${claimed ? t("opsRewardBanked") : complete ? t("cashOutNow") : t("keepLooping")}</span>
            </button>
          </article>
        `;
      })
      .join("");
    return `
      <article class="base-card">
        <span class="base-card__label">${fmt("seasonLabel", { name: lt(seasonDef.name).toUpperCase() })}</span>
        <h2 class="base-card__title">${lt(seasonDef.ruleTitle)}</h2>
        <p class="base-card__body">${lt(seasonDef.ruleBody)}</p>
        <span class="upgrade-meta">${fmt("seasonLiveBonus", { bonus: activeBonus })}</span>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("seasonPassLabel")}</span>
        <h2 class="base-card__title">${fmt("seasonTotalXp", { xp: meta.seasonPassXp })}</h2>
        <p class="base-card__body">${t("seasonPassBody")}</p>
        <span class="upgrade-meta">${claimableTiers.size > 0 ? fmt("seasonClaimableWaiting", { count: claimableTiers.size }) : t("seasonNoTierReady")}</span>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("liveContractsLabel")}</span>
        <h2 class="base-card__title">${claimableContracts.size > 0 ? fmt("liveContractsReady", { count: claimableContracts.size }) : t("liveContractsShort")}</h2>
        <p class="base-card__body">${t("liveContractsBody")}</p>
      </article>
      <div class="upgrade-row">
        ${contractCards}
      </div>
      <div class="upgrade-row">
        ${passCards}
      </div>
      <article class="base-card">
        <span class="base-card__label">${lt(seasonDef.missionTitle).toUpperCase()}</span>
        <h2 class="base-card__title">${t("seasonBreakpointTitle")}</h2>
        <p class="base-card__body">${lt(seasonDef.missionBody)}</p>
        <span class="upgrade-meta">${lt(seasonDef.rewardLabel)} // ${lt(seasonDef.rewardBody)}</span>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("seasonRelicsLabel")}</span>
        <h2 class="base-card__title">${fmt("seasonBreakpointClears", { count: meta.seasonClears })}</h2>
        <p class="base-card__body">${nextSeasonRelic ? fmt("seasonNextUnlock", { title: lt(nextSeasonRelic.title), description: lt(nextSeasonRelic.description) }) : t("seasonAllRelicsUnlocked")}</p>
        <span class="upgrade-meta">${nextSeasonRelic ? getRelicUnlockRule(nextSeasonRelic.id) : t("seasonTrackComplete")}</span>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("worldBossResourceLabel")}</span>
        <h2 class="base-card__title">${fmt("genomeBank", { genes: meta.genes })}</h2>
        <p class="base-card__body">${t("worldBossResourceBody")}</p>
        <span class="upgrade-meta">${t("worldBossExclusive")}</span>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("riftResourceLabel")}</span>
        <h2 class="base-card__title">${fmt("riftBank", { count: meta.riftWins })}</h2>
        <p class="base-card__body">${t("riftResourceBody")}</p>
        <span class="upgrade-meta">${t("riftExclusive")}</span>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("gauntletResourceLabel")}</span>
        <h2 class="base-card__title">${fmt("gauntletBank", { count: meta.gauntletWins })}</h2>
        <p class="base-card__body">${t("gauntletResourceBody")}</p>
        <span class="upgrade-meta">${t("gauntletExclusive")}</span>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("howItPlaysLabel")}</span>
        <h2 class="base-card__title">${t("howItPlaysTitle")}</h2>
        <p class="base-card__body">${t("howItPlaysBody")}</p>
      </article>
      <div class="upgrade-row">
        ${renderShopSpotlightCard()}
      </div>
    `;
  }

  function renderRecordsTab() {
    const gauntletBoard = (meta.gauntletBoard ?? [])
      .map((entry, index) => fmt("gauntletBoardEntry", {
        rank: index + 1,
        hunter: getCharacterName(entry.hunter),
        region: getRegionCopy(entry.region, "name") || entry.region,
        score: entry.score,
      }))
      .join("<br />");
    const regionRecords = Object.keys(regionDefs)
      .map((regionId) => {
        const regionName = getRegionCopy(regionId, "name") || regionId;
        const entry = meta.regionRecords?.[regionId];
        if (!entry) return t("regionRecordEmpty").replace("{region}", regionName);
        return fmt("regionRecordBody", {
          region: regionName,
          kills: entry.kills,
          mode: getModeCopy(entry.mode, "name") || entry.mode,
          hunter: getCharacterName(entry.hunter),
        });
      })
      .join("<br />");
    const recentRuns = (meta.recentRuns ?? [])
      .map((entry, index) => fmt("recentRunEntry", {
        rank: index + 1,
        mode: getModeCopy(entry.mode, "name") || entry.mode,
        state: entry.victory ? t("runStateVictory") : t("runStateDefeat"),
        kills: entry.kills,
        level: entry.level,
        time: formatTime(entry.time),
        region: getRegionCopy(entry.region, "name") || entry.region,
        hunter: getCharacterName(entry.hunter),
      }))
      .join("<br />");

    return `
      <article class="base-card">
        <span class="base-card__label">${t("recordsLabel")}</span>
        <h2 class="base-card__title">${t("recordsTitle")}</h2>
        <p class="base-card__body">${t("recordsBody")}</p>
      </article>
      <div class="results-grid results-grid--base">
        <div class="result-card">
          <span class="result-card__label">${t("runs")}</span>
          <strong class="result-card__value">${meta.runs}</strong>
        </div>
        <div class="result-card">
          <span class="result-card__label">${t("bestKills")}</span>
          <strong class="result-card__value">${meta.bestKills}</strong>
        </div>
        <div class="result-card">
          <span class="result-card__label">${t("recordHuntBest")}</span>
          <strong class="result-card__value">${meta.huntBestKills}</strong>
        </div>
        <div class="result-card">
          <span class="result-card__label">${t("recordBossBest")}</span>
          <strong class="result-card__value">${meta.bossBestTime > 0 ? formatTime(meta.bossBestTime) : t("recordNoClear")}</strong>
        </div>
        <div class="result-card">
          <span class="result-card__label">${t("recordRiftBest")}</span>
          <strong class="result-card__value">${meta.riftBestKills}</strong>
        </div>
        <div class="result-card">
          <span class="result-card__label">${t("recordWorldBossWins")}</span>
          <strong class="result-card__value">${meta.worldBossWins}</strong>
        </div>
        <div class="result-card">
          <span class="result-card__label">${t("recordRiftWins")}</span>
          <strong class="result-card__value">${meta.riftWins}</strong>
        </div>
        <div class="result-card">
          <span class="result-card__label">${t("recordGauntletWins")}</span>
          <strong class="result-card__value">${meta.gauntletWins}</strong>
        </div>
        <div class="result-card">
          <span class="result-card__label">${t("recordGauntletBest")}</span>
          <strong class="result-card__value">${meta.gauntletBest}</strong>
        </div>
      </div>
      <article class="base-card">
        <span class="base-card__label">${t("gauntletRecordLabel")}</span>
        <h2 class="base-card__title">${fmt("gauntletRecordTitle", { score: meta.gauntletBest })}</h2>
        <p class="base-card__body">${meta.gauntletBest > 0 ? t("gauntletRecordBody") : t("gauntletRecordEmpty")}</p>
        <span class="upgrade-meta">${t("gauntletBoardLabel")}</span>
        <p class="base-card__body">${gauntletBoard || t("gauntletRecordEmpty")}</p>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("regionRecordsLabel")}</span>
        <h2 class="base-card__title">${t("regionRecordsLabel")}</h2>
        <p class="base-card__body">${regionRecords}</p>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("recentRunsLabel")}</span>
        <h2 class="base-card__title">${t("recentRunsLabel")}</h2>
        <p class="base-card__body">${recentRuns || t("recentRunsEmpty")}</p>
      </article>
    `;
  }

  function renderShopTab() {
    const hunterId = meta.selectedCharacter;
    const hunterName = getCharacterName(hunterId);
    const previewLive = hasCosmeticPreview(hunterId);
    const offers = [
      {
        id: "season-pass",
        label: t("seasonPassLabel"),
        title: t("shopSeasonPassTitle"),
        body: t("shopSeasonPassBody"),
        meta: t("shopOfferPassMeta"),
      },
      {
        id: "starter-cache",
        label: t("starterCacheLabel"),
        title: t("shopStarterTitle"),
        body: t("shopStarterBody"),
        meta: t("shopOfferStarterMeta"),
      },
      {
        id: "weekly-supply",
        label: t("liveContractsLabel"),
        title: t("shopWeeklyTitle"),
        body: t("shopWeeklyBody"),
        meta: t("shopOfferWeeklyMeta"),
      },
      {
        id: "skin-vault",
        label: t("cosmeticVaultLabel"),
        title: t("shopSkinTitle"),
        body: t("shopSkinBody"),
        meta: t("shopOfferSkinMeta"),
      },
    ];

    return `
      <article class="base-card">
        <span class="base-card__label">${t("shopLabel")}</span>
        <h2 class="base-card__title">${t("shopTitle")}</h2>
        <p class="base-card__body">${t("shopBody")}</p>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("shopPreviewLabel")}</span>
        <h2 class="base-card__title">${t("shopPreviewTitle")}</h2>
        <p class="base-card__body">${t("shopPreviewBody")}</p>
        <p class="base-card__body">${fmt("shopPreviewBodyHunter", { hunter: hunterName })}</p>
        <span class="upgrade-meta">${previewLive ? t("shopPreviewSkinOn") : t("shopPreviewSkinOff")}</span>
        <div class="loot-grid shop-preview-grid" data-hunter="${hunterId}">
          <article class="loot-card loot-card--legendary shop-preview-card shop-preview-card--finisher">
            <span class="loot-card__label">${t("premiumNoteLabel")}</span>
            <h2 class="loot-card__title">${fmt("shopPreviewFinisherHunter", { hunter: hunterName })}</h2>
          </article>
          <article class="loot-card loot-card--rare shop-preview-card shop-preview-card--frame">
            <span class="loot-card__label">${t("cosmeticVaultLabel")}</span>
            <h2 class="loot-card__title">${fmt("shopPreviewFrameHunter", { hunter: hunterName })}</h2>
          </article>
          <article class="loot-card loot-card--epic shop-preview-card shop-preview-card--trail">
            <span class="loot-card__label">${t("riftResourceLabel")}</span>
            <h2 class="loot-card__title">${fmt("shopPreviewTrailHunter", { hunter: hunterName })}</h2>
          </article>
        </div>
        <button class="upgrade-button${previewLive ? " is-equipped" : ""}" data-action="toggle-skin-preview" data-id="${hunterId}" type="button">
          <span class="upgrade-button__title">${t("shopToggleSkinPreview")}</span>
          <span class="upgrade-button__body">${previewLive ? t("shopPreviewActiveBody") : t("shopPreviewInactiveBody")}</span>
        </button>
      </article>
      <div class="upgrade-row">
        ${offers
          .map(
            (offer) => `
              <article class="base-card shop-offer shop-offer--${offer.id}">
                <span class="base-card__label">${offer.label}</span>
                <h2 class="base-card__title">${offer.title}</h2>
                <p class="base-card__body">${offer.body}</p>
                <span class="upgrade-meta">${offer.meta}</span>
                <button class="upgrade-button" data-action="preview-shop" data-id="${offer.id}" type="button">
                  <span class="upgrade-button__title">${t("viewOffer")}</span>
                  <span class="upgrade-button__body">${t("previewOnly")}</span>
                </button>
              </article>
            `,
          )
          .join("")}
      </div>
      <article class="base-card">
        <span class="base-card__label">${t("premiumNoteLabel")}</span>
        <h2 class="base-card__title">${t("shopPremiumNoteTitle")}</h2>
        <p class="base-card__body">${t("shopPremiumNoteBody")}</p>
        <span class="upgrade-meta">${t("noCheckout")}</span>
      </article>
    `;
  }

  function getShopSpotlight(modeId = getCurrentMode().id) {
    if (getClaimableSeasonPassTiers().length > 0 || meta.seasonPassXp >= 40) {
      return {
        id: "season-pass",
        label: t("seasonPassLabel"),
        title: t("shopSeasonPassTitle"),
        body: t("shopJumpPassBody"),
      };
    }
    if (meta.runs < 4 || getNonStarterLootCount() < 4) {
      return {
        id: "starter-cache",
        label: t("starterCacheLabel"),
        title: t("shopStarterTitle"),
        body: t("shopJumpStarterBody"),
      };
    }
    if (modeId === "rift" || modeId === "gauntlet") {
      return {
        id: "weekly-supply",
        label: t("liveContractsLabel"),
        title: t("shopWeeklyTitle"),
        body: t("shopJumpWeeklyBody"),
      };
    }
    return {
      id: "skin-vault",
      label: t("cosmeticVaultLabel"),
      title: t("shopSkinTitle"),
      body: t("shopJumpSkinBody"),
    };
  }

  function renderShopSpotlightCard(modeId = getCurrentMode().id) {
    const offer = getShopSpotlight(modeId);
    return `
      <article class="loot-card loot-card--epic">
        <span class="loot-card__label">${t("shopSpotlightLabel")} // ${offer.label}</span>
        <h2 class="loot-card__title">${offer.title}</h2>
        <p class="loot-card__body">${offer.body}</p>
        <button class="upgrade-button" data-action="jump-shop" data-id="${offer.id}" type="button">
          <span class="upgrade-button__title">${t("openShop")}</span>
          <span class="upgrade-button__body">${t("previewOnly")}</span>
        </button>
      </article>
    `;
  }

  function renderSettingsTab() {
    const soundOn = meta.settings.sound;
    const vibrationOn = meta.settings.vibration;
    const languageKo = lang() === "ko";
    return `
      <article class="base-card">
        <span class="base-card__label">${t("settings")}</span>
        <h2 class="base-card__title">${t("settingsFeedbackTitle")}</h2>
        <p class="base-card__body">${t("settingsFeedbackBody")}</p>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("language")}</span>
        <h2 class="base-card__title">${t("languageTitle")}</h2>
        <p class="base-card__body">${t("languageBody")}</p>
        <div class="button-row">
          <button class="upgrade-button${languageKo ? "" : " is-equipped"}" data-action="set-language" data-id="en" type="button">
            <span class="upgrade-button__title">${t("english")}</span>
            <span class="upgrade-button__body">${t("shellEnglish")}</span>
          </button>
          <button class="upgrade-button${languageKo ? " is-equipped" : ""}" data-action="set-language" data-id="ko" type="button">
            <span class="upgrade-button__title">${t("korean")}</span>
            <span class="upgrade-button__body">${t("shellKorean")}</span>
          </button>
        </div>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("audio")}</span>
        <h2 class="base-card__title">${t("soundEffects")}</h2>
        <p class="base-card__body">${soundOn ? t("soundBodyOn") : t("soundBodyOff")}</p>
        <button class="upgrade-button${soundOn ? " is-equipped" : ""}" data-action="toggle-setting" data-id="sound" type="button">
          <span class="upgrade-button__title">${soundOn ? t("soundOn") : t("soundOff")}</span>
          <span class="upgrade-button__body">${t("soundToggleBody")}</span>
        </button>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("haptics")}</span>
        <h2 class="base-card__title">${t("vibration")}</h2>
        <p class="base-card__body">${vibrationOn ? t("vibrationBodyOn") : t("vibrationBodyOff")}</p>
        <button class="upgrade-button${vibrationOn ? " is-equipped" : ""}" data-action="toggle-setting" data-id="vibration" type="button">
          <span class="upgrade-button__title">${vibrationOn ? t("vibrationOn") : t("vibrationOff")}</span>
          <span class="upgrade-button__body">${t("vibrationToggleBody")}</span>
        </button>
      </article>
      <article class="base-card">
        <span class="base-card__label">${t("saveControl")}</span>
        <h2 class="base-card__title">${t("resetPrototypeLoop")}</h2>
        <p class="base-card__body">${t("resetPrototypeBody")}</p>
        <button class="secondary-button" data-action="reset-save" type="button">
          ${t("resetProgress")}
        </button>
      </article>
    `;
  }

  function renderBaseShowcase(character, mode, region) {
    const hunterName = getCharacterName(character.id);
    const regionName = getRegionCopy(region.id, "name") || region.name;
    const bossName = getRegionCopy(region.id, "bossName") || region.bossName;
    const previewSkin = hasCosmeticPreview(character.id);
    return `
      <span class="base-showcase__eyebrow">${t("showcaseLabel")}</span>
      <h2 class="base-showcase__title">${hunterName}</h2>
      <p class="base-showcase__subtitle">${bossName} // ${getModeCopy(mode.id, "name")} // ${regionName}</p>
      ${previewSkin ? `<span class="base-showcase__preview">${t("showcasePreviewSkin")}</span>` : ""}
      <div class="base-showcase__art">
        <div class="base-showcase__horizon"></div>
        <div class="base-showcase__shard base-showcase__shard--a"></div>
        <div class="base-showcase__shard base-showcase__shard--b"></div>
        <div class="base-showcase__weapon"></div>
        <div class="base-showcase__portrait">
          <div class="base-showcase__portrait-ring"></div>
          <div class="base-showcase__portrait-core"></div>
        </div>
        <div class="base-showcase__sigil">${getCharacterShowcase(character.id, "sigil")}</div>
      </div>
      <div class="base-showcase__grid">
        <article class="showcase-chip">
          <span class="showcase-chip__label">${t("showcaseRoleLabel")}</span>
          <strong class="showcase-chip__value">${getCharacterShowcase(character.id, "role")}</strong>
        </article>
        <article class="showcase-chip">
          <span class="showcase-chip__label">${t("showcaseWeaponLabel")}</span>
          <strong class="showcase-chip__value">${getCharacterShowcase(character.id, "weapon")}</strong>
        </article>
        <article class="showcase-chip">
          <span class="showcase-chip__label">${t("showcaseRegionLabel")}</span>
          <strong class="showcase-chip__value">${regionName}</strong>
        </article>
        <article class="showcase-chip">
          <span class="showcase-chip__label">${t("showcaseRewardLabel")}</span>
          <strong class="showcase-chip__value">${getModeShowcasePayout(mode.id)}</strong>
        </article>
      </div>
    `;
  }

  function renderBase() {
    renderShellLabels();
    const character = characterDefs[meta.selectedCharacter] ?? characterDefs.cain;
    const mode = getCurrentMode();
    const region = getCurrentRegion();
    const regionName = getRegionCopy(region.id, "name") || region.name;
    const bossName = getRegionCopy(region.id, "bossName") || region.bossName;
    const hunterName = getCharacterName(character.id);
    const objective = getFtueObjective();

    baseOverlay.dataset.region = region.id;
    basePanel.dataset.region = region.id;
    baseShowcase.dataset.region = region.id;
    baseShowcase.dataset.hunter = character.id;
    baseShowcase.dataset.preview = hasCosmeticPreview(character.id) ? "1" : "0";
    baseShowcase.innerHTML = renderBaseShowcase(character, mode, region);

    goldText.textContent = String(meta.gold);
    coreText.textContent = String(meta.cores);
    dataText.textContent = String(meta.data);
    genesText.textContent = String(meta.genes);
    powerText.textContent = String(computePower());
    runsText.textContent = String(meta.runs);
    bestKillsText.textContent = String(meta.bestKills);
    baseEyebrow.textContent = lt(character.eyebrow);
    baseTitle.textContent =
      mode.id === "boss"
        ? fmt("baseBossTitle", { hunter: hunterName, boss: bossName })
        : fmt("baseRegionTitle", { hunter: hunterName, region: regionName });
    baseBody.textContent =
      mode.id === "boss"
        ? fmt("baseBossSummary", { body: getCharacterCopy(character.id, "baseBody"), region: regionName })
        : mode.id === "rift"
          ? fmt("baseRiftSummary", { body: getCharacterCopy(character.id, "baseBody"), region: regionName })
          : mode.id === "gauntlet"
            ? fmt("baseGauntletSummary", { body: getCharacterCopy(character.id, "baseBody"), region: regionName })
        : fmt("baseRegionSummary", { body: getCharacterCopy(character.id, "baseBody"), regionBody: getRegionCopy(region.id, "body") });
    startRunButton.textContent =
      mode.id === "boss"
        ? t("deployWorldBoss")
        : mode.id === "rift"
          ? t("deployRift")
          : mode.id === "gauntlet"
            ? t("deployGauntlet")
          : getCharacterCopy(character.id, "startLabel");
    resourceLabel.textContent = getCharacterCopy(character.id, "resourceLabel");
    objectiveTitle.textContent = objective.title;
    objectiveBody.textContent = objective.body;
    ftueTrack.innerHTML = renderFtueTrack();

    renderSelectors();
    renderOperationMap();

    for (const button of baseOverlay.querySelectorAll(".tab-button")) {
      button.classList.toggle("is-active", button.dataset.tab === activeBaseTab);
    }

    if (activeBaseTab === "equipment") {
      baseContent.innerHTML = renderEquipmentTab();
    } else if (activeBaseTab === "relics") {
      baseContent.innerHTML = renderRelicsTab();
    } else if (activeBaseTab === "ascension") {
      baseContent.innerHTML = renderAscensionTab();
    } else if (activeBaseTab === "records") {
      baseContent.innerHTML = renderRecordsTab();
    } else if (activeBaseTab === "season") {
      baseContent.innerHTML = renderSeasonTab();
    } else if (activeBaseTab === "shop") {
      baseContent.innerHTML = renderShopTab();
    } else if (activeBaseTab === "settings") {
      baseContent.innerHTML = renderSettingsTab();
    } else {
      baseContent.innerHTML = renderResearchTab();
    }
  }

  function equipItem(id) {
    const item = meta.inventory.find((entry) => entry.id === id);
    if (!item) return;
    meta.equippedGear[item.slot] = item.id;
    saveMeta();
    renderBase();
  }

  function salvageItem(id) {
    const item = meta.inventory.find((entry) => entry.id === id);
    if (!item) return;
    if (meta.equippedGear[item.slot] === item.id) return;
    const rarity = rarityDefs[item.rarity];
    meta.gold += rarity.salvageGold;
    meta.cores += rarity.salvageCores;
    meta.salvageCount += 1;
    meta.inventory = meta.inventory.filter((entry) => entry.id !== id);
    processFtueMilestones();
    saveMeta();
    renderBase();
  }

  function equipResultItem(id) {
    equipItem(id);
    renderResultRewards();
  }

  function tryUpgradeResearch(id) {
    const track = researchTracks.find((item) => item.id === id);
    if (!track) return;
    const current = meta.research[id];
    if (current >= track.maxLevel) return;
    const cost = track.getCost(current + 1);
    if (meta.data < cost.data) return;
    meta.data -= cost.data;
    meta.research[id] += 1;
    processFtueMilestones();
    saveMeta();
    renderBase();
  }

  function tryUpgradeAscension(id) {
    const track = ascensionTracks.find((item) => item.id === id);
    if (!track) return;
    const current = meta.ascension[id];
    if (current >= track.maxLevel) return;
    const cost = track.getCost(current + 1);
    if (meta.genes < cost.genes) return;
    meta.genes -= cost.genes;
    meta.ascension[id] += 1;
    saveMeta();
    renderBase();
  }

  function tryUpgradeAwakening(id) {
    const awakening = awakeningDefs[id];
    if (!awakening || meta.awakenings[id] > 0) return;
    if (meta.genes < awakening.cost) return;
    meta.genes -= awakening.cost;
    meta.awakenings[id] = 1;
    saveMeta();
    renderBase();
  }

  function toggleRelic(id) {
    if (!meta.unlockedRelics.includes(id)) return;
    const index = meta.equippedRelics.indexOf(id);
    if (index >= 0) {
      meta.equippedRelics[index] = null;
    } else {
      const firstEmpty = meta.equippedRelics.findIndex((item) => !item);
      if (firstEmpty >= 0) {
        meta.equippedRelics[firstEmpty] = id;
      } else {
        meta.equippedRelics[0] = id;
      }
    }
    meta.equippedRelics = meta.equippedRelics.slice(0, 2);
    saveMeta();
    renderBase();
  }

  function selectCharacter(id) {
    if (!characterDefs[id] || !isCharacterUnlocked(id)) return;
    meta.selectedCharacter = id;
    saveMeta();
    renderBase();
  }

  function selectMode(id) {
    if (!modeDefs[id] || !isModeUnlocked(id)) return;
    meta.selectedMode = id;
    saveMeta();
    renderBase();
  }

  function selectRegion(id) {
    if (!regionDefs[id] || !isRegionUnlocked(id)) return;
    meta.selectedRegion = id;
    if (!meta.seenRegionUnlocks.includes(id)) {
      meta.seenRegionUnlocks.push(id);
    }
    saveMeta();
    renderBase();
  }

  function applyRecommendedMode(id) {
    if (!modeDefs[id] || !isModeUnlocked(id)) return;
    meta.selectedMode = id;
    saveMeta();
    pushEvent(`${t("operationMode")} // ${getModeCopy(id, "name")}`, 1.2);
    renderBase();
  }

  function applyRecommendedHunter(id) {
    if (!characterDefs[id] || !isCharacterUnlocked(id)) return;
    meta.selectedCharacter = id;
    saveMeta();
    pushEvent(`${t("operationHunter")} // ${getCharacterName(id)}`, 1.2);
    renderBase();
  }

  function deployRecommendedOperation(regionId) {
    if (!regionDefs[regionId] || !isRegionUnlocked(regionId)) return;
    const modeId = getRegionCopy(regionId, "modeId");
    const hunterId = getRegionCopy(regionId, "hunterId");
    meta.selectedRegion = regionId;
    if (!meta.seenRegionUnlocks.includes(regionId)) {
      meta.seenRegionUnlocks.push(regionId);
    }
    if (modeDefs[modeId] && isModeUnlocked(modeId)) {
      meta.selectedMode = modeId;
    }
    if (characterDefs[hunterId] && isCharacterUnlocked(hunterId)) {
      meta.selectedCharacter = hunterId;
    }
    saveMeta();
    startRun();
  }

  function toggleSetting(id) {
    if (!(id in meta.settings)) return;
    meta.settings[id] = !meta.settings[id];
    if (id === "sound" && meta.settings.sound) {
      ensureAudioContext();
      playTone("level");
    }
    if (id === "vibration" && meta.settings.vibration) {
      pulseVibration(12);
    }
    saveMeta();
    renderBase();
  }

  function setLanguage(id) {
    if (!["en", "ko"].includes(id)) return;
    meta.settings.language = id;
    const currentRegion = getCurrentRegion();
    bossLabel.textContent = getRegionCopy(currentRegion.id, "bossName") || currentRegion.bossName;
    if (boss) {
      boss.name = getRegionCopy(boss.regionId, "bossName") || boss.name;
      bossLabel.textContent = boss.name;
    }
    saveMeta();
    pushEvent(t("languageChanged"), 1.2);
    renderBase();
  }

  function previewShopOffer(id) {
    if (id === "skin-vault") {
      pushEvent(
        `${fmt("shopPreviewFinisherHunter", { hunter: getCharacterName(meta.selectedCharacter) })} // ${t("previewOnly")}`,
        2.4,
      );
      return;
    }
    const offerTitleKeyById = {
      "season-pass": "shopSeasonPassTitle",
      "starter-cache": "shopStarterTitle",
      "weekly-supply": "shopWeeklyTitle",
    };
    const offerKey = offerTitleKeyById[id];
    if (!offerKey) return;
    pushEvent(`${t(offerKey)} // ${t("previewOnly")}`, 2.4);
  }

  function toggleSkinPreview(characterId) {
    if (!characterDefs[characterId]) return;
    const next = hasCosmeticPreview(characterId) ? 0 : 1;
    meta.cosmeticPreview[characterId] = next;
    saveMeta();
    pushEvent(
      fmt(next ? "shopSkinPreviewEnabled" : "shopSkinPreviewDisabled", {
        hunter: getCharacterName(characterId),
      }),
      2.2,
    );
    renderBase();
  }

  function jumpToShop(id) {
    activeBaseTab = "shop";
    showBase();
    previewShopOffer(id);
  }

  function resetProgress() {
    if (!window.confirm(t("resetConfirm"))) return;
    meta = defaultMeta();
    activeBaseTab = "equipment";
    currentRewards = {
      gold: 0,
      cores: 0,
      data: 0,
      genes: 0,
      gauntletScore: 0,
      gauntletRecord: false,
      newRelic: null,
      newSeasonRelic: null,
      bonusLines: [],
      droppedItems: [],
      seasonProgress: null,
      seasonPassGain: 0,
      seasonPassUnlocked: [],
    };
    player = createPlayerFromMeta();
    ensureSelectionsUnlocked();
    saveMeta();
    showTitle();
  }

  function step(timestamp) {
    const dt = Math.min(0.033, (timestamp - lastTs) / 1000 || 0.016);
    lastTs = timestamp;

    if (screen === "run" && !pausedForLevel && !gameOver) {
      if (deployIntro.active) {
        deployIntro.timer -= dt;
        if (deployIntro.timer <= 0) hideDeployIntro();
      }
      if (finisher.active) {
        finisher.timer -= dt;
        updateEffects(dt);
        if (finisher.timer <= 0) {
          finisher.active = false;
          finishOverlay.classList.add("hidden");
          endRun("victory");
        }
      } else {
        if (ultimateCutin.active) {
          ultimateCutin.timer -= dt;
          if (ultimateCutin.timer <= 0) hideUltimateCutin();
        }
        elapsed += dt;
        updatePlayer(dt);
        spawnEnemyWave(dt);
        spawnBossIfNeeded();
        updateFtueEvents(dt);
        updateEnemies(dt);
        updateBoss(dt);
        updateProjectiles(dt);
        updateXp();
        updateEffects(dt);

        if (player.hp <= 0) {
          player.hp = 0;
          endRun("defeat");
        }
        if (elapsed >= runDuration && !gameOver) {
          endRun(boss ? "defeat" : "victory");
        }
      }
    }

    if (screen !== "run" && chapterUnlockIntro.active) {
      chapterUnlockIntro.timer -= dt;
      if (chapterUnlockIntro.timer <= 0) hideChapterUnlock();
    }

    if (screen !== "run" && eventBanner.timer > 0) {
      eventBanner.timer -= dt;
      if (eventBanner.timer <= 0) eventBanner.text = "";
    }

    render();
    updateHud();
    animationId = requestAnimationFrame(step);
  }

  function setJoystick(pointerX, pointerY) {
    const rect = joystickBase.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = pointerX - centerX;
    const dy = pointerY - centerY;
    const max = rect.width * 0.32;
    const length = Math.hypot(dx, dy);
    const clamped = Math.min(length, max);
    const dir = normalize(dx, dy);

    joystickThumb.style.transform = `translate(${dir.x * clamped}px, ${dir.y * clamped}px)`;
    input.moveX = length > 10 ? dir.x : 0;
    input.moveY = length > 10 ? dir.y : 0;
  }

  function releaseJoystick() {
    joystickThumb.style.transform = "translate(0px, 0px)";
    input.moveX = 0;
    input.moveY = 0;
  }

  joystickBase.addEventListener("pointerdown", (event) => {
    joystickBase.setPointerCapture(event.pointerId);
    setJoystick(event.clientX, event.clientY);
  });
  joystickBase.addEventListener("pointermove", (event) => {
    if (event.buttons === 0) return;
    setJoystick(event.clientX, event.clientY);
  });
  joystickBase.addEventListener("pointerup", releaseJoystick);
  joystickBase.addEventListener("pointercancel", releaseJoystick);

  dashButton.addEventListener("click", doDash);
  ultimateButton.addEventListener("click", doUltimate);
  startRunButton.addEventListener("click", startRun);
  restartButton.addEventListener("click", startRun);
  baseButton.addEventListener("click", showBase);
  titleStartButton.addEventListener("click", showIntro);
  titleSkipButton.addEventListener("click", finishIntro);
  introNextButton.addEventListener("click", () => {
    if (introIndex >= introSlides.length - 1) {
      finishIntro();
      return;
    }
    introIndex += 1;
    renderIntroSlide();
  });
  introSkipButton.addEventListener("click", finishIntro);
  chapterOverlay.addEventListener("click", hideChapterUnlock);

  baseOverlay.addEventListener("click", (event) => {
    const tabButton = event.target.closest("[data-tab]");
    if (tabButton) {
      activeBaseTab = tabButton.dataset.tab;
      renderBase();
      return;
    }

    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;

    const { action, id } = actionButton.dataset;
    if (action === "equip-item") equipItem(id);
    if (action === "salvage-item") salvageItem(id);
    if (action === "upgrade-research") tryUpgradeResearch(id);
    if (action === "upgrade-ascension") tryUpgradeAscension(id);
    if (action === "upgrade-awakening") tryUpgradeAwakening(id);
    if (action === "claim-pass-tier") claimSeasonPassTier(id);
    if (action === "claim-contract") claimContract(id);
    if (action === "preview-shop") previewShopOffer(id);
    if (action === "toggle-skin-preview") toggleSkinPreview(id);
    if (action === "jump-shop") jumpToShop(id);
    if (action === "set-language") setLanguage(id);
    if (action === "toggle-setting") toggleSetting(id);
    if (action === "reset-save") resetProgress();
    if (action === "toggle-relic") toggleRelic(id);
    if (action === "select-character") selectCharacter(id);
    if (action === "select-mode") selectMode(id);
    if (action === "select-region") selectRegion(id);
    if (action === "apply-operation-mode") applyRecommendedMode(id);
    if (action === "apply-operation-hunter") applyRecommendedHunter(id);
    if (action === "deploy-operation") deployRecommendedOperation(id);
  });

  resultsOverlay.addEventListener("click", (event) => {
    const actionButton = event.target.closest("[data-action]");
    if (!actionButton) return;
    const { action, id } = actionButton.dataset;
    if (action === "equip-result-item") equipResultItem(id);
    if (action === "jump-shop") jumpToShop(id);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "w" || event.key === "ArrowUp") input.keyboard.up = true;
    if (event.key === "s" || event.key === "ArrowDown") input.keyboard.down = true;
    if (event.key === "a" || event.key === "ArrowLeft") input.keyboard.left = true;
    if (event.key === "d" || event.key === "ArrowRight") input.keyboard.right = true;
    if (event.code === "Space") doDash();
    if (event.code === "KeyF") doUltimate();
  });

  window.addEventListener("keyup", (event) => {
    if (event.key === "w" || event.key === "ArrowUp") input.keyboard.up = false;
    if (event.key === "s" || event.key === "ArrowDown") input.keyboard.down = false;
    if (event.key === "a" || event.key === "ArrowLeft") input.keyboard.left = false;
    if (event.key === "d" || event.key === "ArrowRight") input.keyboard.right = false;
  });

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
  renderBase();
  if (meta.seenIntro) {
    showBase();
  } else {
    showTitle();
  }
  cancelAnimationFrame(animationId);
  animationId = requestAnimationFrame(step);
})();
