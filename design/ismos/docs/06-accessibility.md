# 06 Accessibility

*Working. Minimums, not goals.*

Target: WCAG 2.2 Level AA on every screen and printed piece, and **AAA (7:1) for normal text wherever the palette allows it**. Every pair is measured with the WCAG relative-luminance formula, not judged. Students read this material on cheap screens in bright rooms, so where a pair is close, take the safer one.

## Accessibility upgrades · October 2026

1. **White on dark, never ghost white.** Text inside any dark container (Ink, Logwood, Indigo, Mauveine, Logwood 800) is white `#FFFFFF`. Off-white and ghost-white tints are retired: they read grey and are hard to read.
2. **Light text inside dark swatches.** Purple shades used as text on Ink are lifted: links and success use Mauveine 200 (12.47:1), muted text uses Logwood 200 (15.35:1). Mauveine, Indigo and Logwood 800 never appear as text on Ink.
3. **Heavier small text.** No Light weight anywhere (Literata display is now 400). Text under 16 px (`body-small`, `caption`) is Medium 500; labels stay Medium 500.
4. **AA everywhere, AAA as the aim.**

| Text role | Light | Hacker mode | Level |
|---|---|---|---|
| Body `text` | Ink on Paper 21.00:1 | White on Ink 21.00:1, on Logwood 15.96:1 | AAA |
| Muted `text-muted` | Logwood 800 on Paper 8.49:1, on Logwood 50 7.93:1 | Logwood 200 on Ink 15.35:1, on Logwood 11.67:1 | AAA |
| Link | Mauveine on Paper 8.76:1 | Mauveine 200 on Ink 12.47:1, on Logwood 9.48:1 | AAA |
| Error | Madder 800 on Paper 7.59:1 | Madder on Ink 7.89:1; on Logwood 6.00:1 | AAA · AA on Logwood |
| Success | Indigo on Paper 14.20:1 | Mauveine 200 on Ink 12.47:1 | AAA |
| Info | Logwood 800 on Logwood 50 7.93:1 | Logwood 200 on Logwood 11.67:1 | AAA |
| Warning | Ink on Weld 14.54:1 | Ink on Weld 14.54:1 | AAA |
| Large only | Logwood 600 on Paper 4.39:1 | — | AA large (24 px+) |

5. **Cues beyond colour.** Purples and blues are close for many colour-blind readers, so meaning always has a second cue: links are underlined, the current item has a weight change and a word (NOW), indicators carry a dot or underline, every status has an icon and a word, tags are words.

## Core principles

Four principles govern every decision in this section.

- **P · Perceivable.** Content reaches every sense in use: contrast, text alternatives, captions, no color-only meaning.
- **O · Operable.** Every action works by touch, keyboard, switch and voice. No time traps. Motion is optional.
- **U · Understandable.** Plain language, predictable navigation, errors named with a fix.
- **R · Robust.** Native controls and correct roles, so screen readers and assistive tech parse the UI.

### Color contrast · Minimums

- **4.5:1** · Standard text against its background. Body copy, labels, captions, placeholder text.
- **3:1** · Large text: 18 pt / 24 px regular, or 14 pt / 18.66 px bold and up.
- **3:1** · Essential graphics and UI components: icons, chart series, input borders, focus rings, control states.

### Contrast table · This palette

Ratios computed with the WCAG relative-luminance formula. The **Colour contrast** card in Components shows each pair with an Aa sample.

| Pair | Ratio | Minimum | Result |
|---|---|---|---|
| **Text on Paper** | | | |
| Ink | 21.00:1 | 4.5:1 | ✓ PASS |
| Logwood | 15.96:1 | 4.5:1 | ✓ PASS |
| Mauveine · links | 8.76:1 | 4.5:1 | ✓ PASS |
| Logwood 800 · captions | 8.49:1 | 4.5:1 | ✓ PASS |
| Logwood 600 · large only | 4.39:1 | 3:1 | ✓ PASS |
| Madder 800 · alert text | 7.59:1 | 4.5:1 | ✓ PASS |
| Madder | 2.66:1 | 4.5:1 | ✕ FAIL |
| Weld | 1.44:1 | 4.5:1 | ✕ FAIL |
| **Text on color** | | | |
| Ink on Weld | 14.54:1 | 4.5:1 | ✓ PASS |
| Ink on Madder | 7.89:1 | 4.5:1 | ✓ PASS |
| Paper on Mauveine | 8.76:1 | 4.5:1 | ✓ PASS |
| Paper on Logwood 800 | 8.49:1 | 4.5:1 | ✓ PASS |
| Paper on Indigo | 14.20:1 | 4.5:1 | ✓ PASS |
| Paper on Madder | 2.66:1 | 4.5:1 | ✕ FAIL |
| **Text on Ink · dark surfaces** | | | |
| White · body, code, headings | 21.00:1 | 4.5:1 | ✓ PASS · AAA |
| Logwood 200 · muted text | 15.35:1 | 4.5:1 | ✓ PASS · AAA |
| Mauveine 200 · links | 12.47:1 | 4.5:1 | ✓ PASS · AAA |
| Mauveine 200 on Logwood | 9.48:1 | 4.5:1 | ✓ PASS |
| Mauveine on Ink | 2.40:1 | 4.5:1 | ✕ FAIL |
| **Graphics · 3:1** | | | |
| Madder series on Paper | 2.66:1 | 3:1 | ✕ FAIL |
| Weld chip on Paper | 1.44:1 | 3:1 | ✕ FAIL |
| Logwood 700 edge on Ink | 3.45:1 | 3:1 | ✓ PASS |
| Mauveine 300 progress bar on Ink | 7.84:1 | 3:1 | ✓ PASS |
| Logwood 600 icon on Paper | 4.39:1 | 3:1 | ✓ PASS |

FAIL rows are banned for that use. Results carry icon + word, not color alone.

## Color, motion, mobile

### Don't rely solely on color

Color never carries state or meaning alone. Every state pairs color with text and an icon, or a shape change.

- **Don't · border only.** An Email field marked only by a Madder border.
- **Do · border + icon + text.** A 2 px Madder 800 border, the Alert icon and *Error: add a domain ending, e.g. ana@ismos.org*. See the TextField component.

- Invalid fields: 2 px Madder 800 border, Alert icon, and an error message tied to the field (`aria-describedby` / accessibility hint).
- Answers and streaks: **✓ CORRECT** · **✕ WRONG** · **☆ STREAK**. Icon and word every time.
- Links in text are underlined. Charts use labels or patterns, not a color key alone.
- Selected tabs and toggles change shape or weight as well as color.

### Motion & orientation

- **Respect Reduce Motion.** When the system setting is on, replace slides, parallax, zooms and auto-play with instant changes or a short cross-fade. Nothing essential depends on animation. `iOS · UIAccessibility.isReduceMotionEnabled` · `SwiftUI · @Environment(\.accessibilityReduceMotion)` · `Android · ANIMATOR_DURATION_SCALE = 0` · `Web · prefers-reduced-motion`
- **No flashing.** Nothing flashes more than three times per second.
- **Pause control.** Any motion that runs longer than 5 s gets a pause or stop control.
- **Free orientation.** Screens rotate freely between portrait and landscape. Lock only when the function demands it (camera capture, a card scanner, a landscape-only game) and state the reason in the spec. `iOS · all orientations in Info.plist` · `Android · no fixed screenOrientation`
- **Reflow.** Layouts reflow to 320 CSS px wide with no horizontal scroll and no lost content.

### Mobile app accessibility basics · iOS & Android

- **Touch targets.** Minimum 44 × 44 pt on iOS, 48 × 48 dp on Android, with 8 dp spacing between targets.
- **Screen readers.** Every control has a label, role and state. Decorative images are hidden from assistive tech. `VoiceOver · accessibilityLabel` · `TalkBack · contentDescription`
- **Text scaling.** Type follows the system size up to 200% with no clipping or truncation of essential text. `iOS · Dynamic Type` · `Android · sp units`
- **Focus order.** Reading and focus order match the visual order. Focus lands on the new content after a screen or modal opens.
- **Dark and high-contrast modes.** Dark mode uses Hacker mode (03.2). Honor Increase Contrast and High contrast text: swap Logwood 600/700 for 800+ and add borders.
- **Gestures.** Every multi-finger or path gesture has a single-tap alternative. No action depends on shaking the device.
- **Time limits.** Users can extend, adjust or turn off time limits, including quiz timers.
- **Test.** Each release is checked with VoiceOver and TalkBack on, text at max size, Reduce Motion on, and both orientations.

## Keyboard

- Every action works by keyboard. Tab order matches the visual order.
- `:focus-visible` takes a 2 px `focus` outline at 2 px offset: Mauveine on light, Weld in Hacker mode. Never removed.
- Interactive icons and the whole course card take a 44 px target.

## Screen reader

- Native controls and correct roles. Every control has a label, role and state.
- Errors are tied to their field with `aria-describedby`. Progress uses `role="progressbar"` with min, max and current values.
- Decorative images and the mark beside the wordmark are hidden from assistive tech; a mark standing alone is labelled *ISMOS*.
- Set `lang` on every page and every passage in the other language.
