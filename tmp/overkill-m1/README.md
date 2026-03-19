# Overkill M3 Lite Prototype

Mobile-first browser prototype for the combat loop, growth loop, character selection, and mode selection slice.

## Included

- Four playable hunters: Cain, Dex, Ria, and Sera
- Virtual joystick movement
- Auto-attacks
- Dash button
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
- Mode select: Main Hunt and World Boss
- FTUE-style objective card and in-run objective tracker
- FTUE launch track with one-time milestone caches
- Scripted first-run event prompts during combat
- First-run cache reward and first-titan bounty messaging
- Unlock gates: Dex and World Boss unlock after the first titan kill, Ria after the second titan kill, Sera after the third titan kill
- Loot inventory with equip / salvage actions
- Hunter affinity on gear with Cain/Dex/Ria/Sera-specific synergies
- Two-piece and three-piece gear set bonuses
- Hunter-specific mutation pools during level-up
- Region selection with Red City / Iron Sanctuary presentation split
- Region-specific boss patterns and pacing
- Boss telegraphs and warning prompts for major titan attacks
- Screen shake and floating combat text for hits, breaks, and titan kills
- Title screen and short intro sequence before the base loop
- Season tab with one live season rule prototype
- Season pass track with claimable tier rewards
- Live contract missions with claimable short-session rewards
- World Boss-exclusive gene resource and Titanforged drops
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

## Run

From repo root:

```bash
cd tmp/overkill-m1
python3 -m http.server 8123
```

Then open:

- `http://127.0.0.1:8123/index.html`

## Controls

- Mobile: left virtual joystick to move, right `DASH` button to burst
- Desktop fallback: `WASD` or arrow keys, `Space` to dash

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
- `Launch Track`: first 30-minute reward ladder with guaranteed gear spikes
- `Set Bonuses`: Reaver / Signal / Ruin / Blink mini-sets across weapon, armor, and reactor
