# Overkill M3 Lite Prototype

Mobile-first browser prototype for the combat loop, growth loop, character selection, and mode selection slice.

## Included

- Four playable hunters: Cain, Dex, Ria, and Sera
- Virtual joystick movement
- Auto-attacks
- Dash button plus a hunter-specific ultimate button
- Short deployment overlay when entering a run
- Region-themed base background treatment and hunter showcase art panel
- Hunter-specific ultimate cut-in overlay during live combat
- Enemy waves with grunt / charger / shooter / elite
- Boss with weakpoint break flow
- Level-up mutation choices
- End-of-run rewards
- End-of-run reward cards with visible loot drops
- End-of-run quick equip buttons for dropped items
- Base screen with gear upgrades
- Relic loadout with unlock progression
- Research upgrades that affect the next run
- Character select: Cain, Dex, Ria, and Sera
- Mode select: Main Hunt, World Boss, Abyss Rift, and Gauntlet
- FTUE-style objective card and in-run objective tracker
- FTUE launch track with one-time milestone caches
- Scripted first-run event prompts during combat
- First-run cache reward and first-titan bounty messaging
- Unlock gates: Dex and World Boss unlock after the first titan kill, Ria after the second titan kill, Sera after the third titan kill
- Loot inventory with equip / salvage actions
- Hunter affinity on gear with Cain/Dex/Ria/Sera-specific synergies
- Two-piece and three-piece gear set bonuses
- Hunter-specific mutation pools during level-up
- Region selection with Red City / Iron Sanctuary / Black Tide presentation split
- Region-specific boss patterns and pacing, including the new Black Tide Leviathan mortar/fan/ring set
- Black Tide-exclusive drops and the new Abyss Current mini-set
- Black Tide-exclusive `drifter` enemy that orbits and fires twin volleys
- Black Tide-exclusive `warden` elite that heals nearby enemies and throws triple spreads
- Boss telegraphs and warning prompts for major titan attacks
- Screen shake and floating combat text for hits, breaks, and titan kills
- Run-start drop beam / aura effect during the first second of combat
- Title screen and short intro sequence before the base loop
- Season tab with one live season rule prototype
- Season pass track with claimable tier rewards
- Live contract missions with claimable short-session rewards
- Shop tab with BM mock cards for pass upgrade, starter pack, weekly supply, and cosmetics
- Result and Season surfaces now include contextual shop spotlight cards that jump back into the Shop tab
- Cosmetic previews in Shop now shift with the currently selected hunter
- Skin preview toggle now re-themes the base showcase plus deploy/ultimate presentation panels for the selected hunter
- Boss finisher overlay also inherits the active skin preview theme
- Base hub now includes an operation map with chapter-like region progression and new-region badges
- Newly unlocked regions now trigger a short chapter-unlock overlay when returning to base
- Chapter unlock overlays now include region-specific threat and command briefing text
- Operation map now shows a persistent region briefing card for the currently selected chapter
- World Boss-exclusive gene resource and Titanforged drops
- Abyss Rift-exclusive contract/resource lane with tracked seal count
- Gauntlet-exclusive contract/resource lane with tracked lockdown clears
- Gauntlet local record board with best score and top 3 saved runs
- Ascension tab that spends genes on permanent upgrades
- Character-specific awakening nodes purchased with genes
- Boss finisher overlay before rewards resolve
- Region and world-boss-specific finisher variants
- Result screen season mission progress and breakpoint bonus
- Season-exclusive relic unlock track tied to breakpoint clears
- Settings tab with live sound and vibration toggles
- English / Korean toggle in Settings, expanded across shell UI, result flow, season tab, FTUE track, and in-run prompts
- Save reset button for replaying the FTUE from zero
- Local save via browser storage
- Dedicated Records tab for local clears, mode-specific bests, region peaks, recent 5-run history, and Gauntlet top runs

## Run

From repo root:

```bash
cd tmp/overkill-m1
python3 -m http.server 8123
```

Then open:

- `http://127.0.0.1:8123/index.html`

## Controls

- Mobile: left virtual joystick to move, right `DASH` plus `ULT` buttons
- Desktop fallback: `WASD` or arrow keys, `Space` to dash, `F` to fire ultimate

## Loop

0. Start from the title screen, then pass through the intro briefing
1. Enter run
2. Kill enemies and level up
3. Break the titan
4. Collect gold / cores / data
5. Equip dropped gear, salvage junk, then upgrade relics and research
6. Re-enter stronger

## M3 Lite Additions

- `Cain`: melee berserker with rage snowball
- `Dex`: ranged engineer with faster burst fire
- `Ria`: curse witch with chained burst detonations
- `Sera`: blink assassin with dash refunds and execution chains
- `Main Hunt`: classic wave build-up into the titan
- `World Boss`: faster boss spawn with heavier payout
- `Abyss Rift`: longer collapse run with denser waves and richer salvage
- `Gauntlet`: no titan, only escalating elite pressure and overclocked loot
- `Abyss Rift Drops`: `Collapseforged`, `Fracturecast`, and `Undertow` prefixes by region
- `Gauntlet Drops`: `Killchain`, `Overclock Ward`, and `Undercurrent` prefixes by region
- `Launch Track`: first 30-minute reward ladder with guaranteed gear spikes
- `Set Bonuses`: Reaver / Signal / Ruin / Blink mini-sets across weapon, armor, and reactor
- `Operation Briefing`: region cards now show target, threat, command, and payout previews before deployment
- `Recommended Loop`: operation map briefing also suggests the best-fit mode for each region
- `Recommended Hunter`: operation map briefing also calls out the strongest hunter fit for each region
- `One-tap Prep`: recommended mode and hunter chips on the operation map now apply selection state directly
- `Direct Deploy`: operation map briefing can now apply the recommended setup and start the run immediately
- `Chapter Progress`: operation nodes now show persistent region clear counts
- `Region Medals`: operation nodes now award bronze / silver / gold seals at 1 / 5 / 10 clears
- `Showcase Sync`: the base hunter showcase now mirrors current region medal and recommended setup state
- `Smart CTA`: the main deploy button now switches to a highlighted recommended-deploy state when the current loadout matches the region recommendation
- `Deploy Sync`: the run-start deployment overlay now also switches to a recommended-deploy briefing when the current loadout is aligned
- `Live Sync`: recommended deploys now grant a short opening tempo/damage spike and an in-run banner during the first second
- `Recommended Aura`: aligned deploys also render a short hunter-colored opening aura around the player
- `First Kill Sync`: the first kill during that opening window now pops a dedicated recommended-deploy floating callout
- `Weakpoint Sync`: the first titan weakpoint break on an aligned deploy now triggers its own breach callout and event spike
- `Telegraph Sync`: aligned deploys now tint weakpoints and boss telegraphs with a stronger hunter-coded breach highlight
- `Route Summary`: result flow now grades recommended deploys across first kill, weakpoint break, and clear state
- `Finisher Sync`: full route execution now upgrades the boss finisher overlay with a hunter-tinted recommended-route presentation
- `Field Archive`: a new Logs tab now collects hunter briefs, chapter files, boss reports, and season directives as progression unlocks them
