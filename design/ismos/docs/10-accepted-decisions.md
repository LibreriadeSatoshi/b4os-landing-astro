# 10 Accepted decisions

*Settled. Every element of a complete design system, as decided in October 2026 by Dulce Villarreal. Items marked **ACCEPTED** were new and now apply alongside 01–09; **ACCEPTED · MODIFIED** were accepted with a change. Four proposals were rejected and are listed at the end. The illustrated version is the ISMOS System Review page.*

## 1 Foundations

### Color primitives · in the system

Eight colours in four roles, plus the named extensions. Hex values are exact.

### Surface, text and border roles · ACCEPTED

**Before.** Semantic tokens resolve per theme. Components use roles, never primitives.

> **ACCEPTED**
>
> Add two border roles the components need: `border-input` = Logwood 700 (6.09:1, passes the 3:1 control floor; Logwood 200 at 1.37:1 does not) and `border-strong` = Ink, for hover and selected edges.

### Status colors · ACCEPTED

**Before.** Only *alert* exists (Madder 800 text, Madder fill). There is no success, warning or info.

**Why it changed.** Adding the obvious green and red would bring back exactly what the brand removed: a second meaning for colour, and the red/green pair that about 1 in 12 men cannot separate. Madder and Weld already look alike to them. Any status set must work in black and white.

> **ACCEPTED**
>
> Four statuses built only from palette colours, each told apart three ways: **colour, shape of the container, and an icon + word**. Success leaves the red–green axis entirely (toward Indigo).
>
> | Status | Light: text / container | Hacker mode | Icon · word | Contrast |
> |---|---|---|---|---|
> | Info | Logwood 800 on a Logwood 50 panel, no border | Logwood 200 on Logwood | Square-i · NOTE | 7.93:1 |
> | Success | Indigo on Paper, 1.5 px Indigo border | Mauveine 200 on Ink | Check · DONE | 14.20:1 |
> | Warning | Ink on a Weld fill, 1.5 px Ink border | Ink on Weld | Triangle · CHECK THIS | 14.54:1 |
> | Error | Madder 800 on Paper, 2 px Madder 800 border | Madder on Ink | Triangle · ERROR | 7.59:1 |
>
> Never a green tick. Success is a word, as Part One already said; this only gives it a container.

### Typography · in the system

Literata for titles, IBM Plex Sans for everything read or pressed, IBM Plex Mono for labels, figures and code, Bricolage Grotesque for the wordmark only.

### Spacing scale · ACCEPTED

**Before.** Nine values: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96. "If a layout needs 20, it needs 16 or 24."

**Why it changed.** The scale is good for layout but mixes two jobs: distance between things and the size of things. Controls are 44 and 48 px tall, which are not on the scale, so people improvise. The jump from 64 to 96 leaves no step for mobile section spacing, and there is no step for optical offsets such as the 2 px focus offset already in use.

> **ACCEPTED**
>
> Keep the nine values exactly. Add three things around them:
>
> - **space-2** for optical offsets only (focus offset, icon nudge). Never for layout.
> - **A separate size scale** for controls: `size-control-sm` 32 (dense desktop tables only), `size-control` 44 (default, touch), `size-input` 48.
> - **Semantic aliases** so people pick by job, not by number: `inset-control` 12/16, `stack-related` 12, `stack-block` 24, `section` 48 desktop / 32 mobile, `section-opener` 96 desktop / 64 mobile.

### Radius · ACCEPTED

**Before.** 0 for blocks, images, bars, tables, documents. 4 for anything pressed or typed into. 8 is the maximum (modals, mobile sheets). Circle for avatars and teacher photos only. No pills.

> **ACCEPTED**
>
> Two named exceptions the components below need: the **radio** is a circle (platform convention, recognised instantly) and the **checkbox** is square, radius 0. Everything else stays on the scale.

### Elevation and shadows · ACCEPTED · MODIFIED

**Before.** One shadow today: `0 2px 8px rgba(0,0,0,.10)`, for anything floating.

**Why it changed.** One shadow cannot tell a menu from a modal. At 10% black it is almost invisible on a cheap bright screen, and on Ink (Hacker mode) every shadow disappears. Part One also forbids a third level in dark mode.

> **Change on acceptance:** level 3 (modal) is always on, in both themes; in Hacker mode it takes a 2 px Logwood 400 edge so it differs from level 2 without a third surface.

> **ACCEPTED · MODIFIED**
>
> Four levels, expressed mainly by **edges and a scrim**, not by shadow strength:
>
> | Level | Use | Light | Hacker mode |
> |---|---|---|---|
> | 0 · flat | Page, sections | Paper | Ink |
> | 1 · raised | Cards, inputs, tables | 1 px hairline, no shadow | Logwood + 1 px Logwood 700 |
> | 2 · overlay | Menus, popovers, toasts, tooltips | 1 px hairline + `shadow-float` 0 2px 8px rgba(0,0,0,.10) | Logwood + 1 px Logwood 400 edge, no shadow |
> | 3 · modal | Dialogs, drawers, sheets | `shadow-modal` 0 8px 24px rgba(0,0,0,.16) + scrim, **always on** | Logwood + **2 px** Logwood 400 edge + `shadow-modal` + scrim, **always on** |
>
> Hacker mode still has two surfaces (Ink, Logwood). Level 3 differs from level 2 by a 2 px edge (level 2 has 1 px) and the scrim, without a third surface.

### Opacity · ACCEPTED

**Before.** Not defined. The brand forbids opacity to soften a colour; the motif field is capped at 25%.

> **ACCEPTED**
>
> Only three opacity tokens, each with one job:
>
> | Token | Value | Only for |
> |---|---|---|
> | `opacity-motif` | 0.25 (maximum) | The motif field |
> | `opacity-scrim` | 0.48 Ink | Behind modals and drawers |
> | `opacity-pressed-overlay` | none | Not used: pressed states change colour, not opacity |
>
> Never on text, icons, disabled states, chart series or colour tints.

### Breakpoints · ACCEPTED

**Before.** 640 · 1 024 · 1 280, max content 1 200, margins 32 / 16.

**Why it changed.** The three numbers are fine, but nothing says what changes at each one, so every surface invents its own column count. Most students are on 360 px phones, and nothing names that range.

> **ACCEPTED**
>
> | Name | Range | Columns | Margin | Gutter | Typical device |
> |---|---|---|---|---|---|
> | `sm` | 0–639 | 4 | 16 | 16 | Phones (test at 360) |
> | `md` | 640–1 023 | 8 | 24 | 24 | Large phones landscape, tablets |
> | `lg` | 1 024–1 279 | 12 | 32 | 24 | Laptops |
> | `xl` | ≥ 1 280 | 12, max 1 200 centred | auto | 24 | Desktops |
>
> Plus a floor: everything reflows to 320 px with no horizontal scroll. Design mobile first; the course card stacks to one column below `md`.

### Z-index · ACCEPTED

**Before.** Not defined.

**Why it changed.** Without a scale every overlay picks 9999 and toasts end up under modals.

> **ACCEPTED**
>
> | Token | Value | Layer |
> |---|---|---|
> | `z-base` | 0 | Page content |
> | `z-sticky` | 100 | Sticky nav, bottom tab bar, lesson rail |
> | `z-dropdown` | 200 | Menus, select lists, popovers |
> | `z-scrim` | 300 | Scrim behind a modal or drawer |
> | `z-modal` | 400 | Dialogs, drawers, sheets |
> | `z-toast` | 500 | Toasts (above modals so a confirmation stays visible) |
> | `z-tooltip` | 600 | Tooltips |
>
> No other values. A component that needs a new layer is a design decision, not a number.

### Motion · ACCEPTED

**Before.** The brand forbids slide transitions, confetti, animating the mark, and anything that runs over 5 s without a pause. No durations exist.

**Why it changed.** Rules without values means each developer guesses, and guesses tend to be slow and bouncy. Students on low-end Android phones pay for every animation in battery and frames.

> **ACCEPTED**
>
> | Token | Value | Use |
> |---|---|---|
> | `motion-fast` | 120 ms | Colour and border changes: hover, press, focus |
> | `motion-base` | 200 ms | Menus, accordions, toasts in and out |
> | `motion-slow` | 280 ms | Modals, drawers, sheets |
> | `ease-standard` | cubic-bezier(.2,0,0,1) | Entering |
> | `ease-exit` | cubic-bezier(.4,0,1,1) | Leaving |
>
> - Animate only opacity and translate. Overlays move at most 8 px; drawers slide their own width.
> - No scale, bounce, spring, parallax or page transition. Nothing loops except the loading bar.
> - Reduced motion: every duration becomes 0, except a 120 ms cross-fade where a change would otherwise be missed.

### Iconography · ACCEPTED

**Before.** Today: 20 line icons drawn to the brand spec (24 grid, 2 px, butt caps, mitre joins, 0/45/90°, no fill), single ink, label by default.

**Why it changed.** The set is strict and consistent, but 20 icons do not cover a full platform (settings, filters, sort, menu, sharing, playback), the spec says "never import from a library", and Part Two lists "the icon set has not been drawn as files" as an open item. The geometry is also cold for a 25–40 audience: no curves at all.

> **ACCEPTED**
>
> **Adopt Iconoir as the single icon library.** MIT licence, about 1 600 icons on the site (1 383 regular icons in npm `iconoir@7.11.0`), one 24 px grid, one stroke weight, line style with gentle curves, packages for React, React Native, Vue, Flutter, Swift, CSS and Figma. It reads friendlier than the current set without becoming cartoonish, which suits learners aged 25 to 40.
>
> - **Keep from the brand rules:** line only, never filled; one ink (Ink on light, Paper on dark); label by default; 20 px minimum; never in a badge or tile; no emoji; no faces.
> - **Change:** Iconoir's own 1.5 px stroke with round caps replaces "2 px, butt caps, mitre, no curves". Mixing would look broken, so the switch is all or nothing.
> - **Configure once:** `<IconoirProvider iconProps={{ strokeWidth: 1.5, width: '1.5em', height: '1.5em' }}>`; 2 px stroke only at 48 px and above.
> - **Never use** icons that contradict the brand: graduation cap, trophy, medal, crown, star (ratings or streaks), rocket (hype).

### Dark and light theming · ACCEPTED · MODIFIED

**Before.** Light is the default (Paper ground). Hacker mode is the dark theme: Ink ground, white text and headings, Logwood cards with a Logwood 700 edge, Mauveine 200 links, Mauveine buttons, Weld focus. Every surface is checked in both themes and in every language it ships in.

> **Change on acceptance:** Hacker mode has its own section (03.2) and uses white text, never off-white.

> **ACCEPTED · MODIFIED**
>
> Follow the system setting by default (`prefers-color-scheme`), with a manual override in Settings: *Light · Hacker mode · Same as this device*.

### Hacker mode · ACCEPTED

**Before.** Hacker mode had no section of its own; its rules were spread across colour, ramps and accessibility.

> **ACCEPTED**
>
> A dedicated section, **03.2 Hacker mode**: shares, every role token with its contrast, two surfaces only, elevation by edge (level 3 with a 2 px Logwood 400 edge, always on), components, and the terminal sample. Text is **white**, never off-white or ghost white.

## 2 Components

### Buttons · ACCEPTED

**Before.** Today: primary (Ink, Paper type) and secondary (Ink outline), radius 4, 44 px.

**Why it changed.** Two variants force people to fake the rest: a text link styled as a button, a red button for delete, an icon floating with no target. There is no loading or pressed state.

> **ACCEPTED**
>
> | Variant | Look | Use |
> |---|---|---|
> | Primary | Ink fill, Paper type (Mauveine in Hacker mode) | One per view: the main action |
> | Secondary | 2 px Ink outline | Alternatives |
> | Tertiary · new | No border, Ink type, weight 600, underline on hover only | Low-emphasis actions next to a primary |
> | Destructive · new | 2 px Madder 800 outline, Madder 800 type | Delete, leave cohort. Always confirmed in a dialog |
> | Icon only · new | 44 px target, no container, visible tooltip on desktop, aria-label | Search, close, download only |
>
> - Sizes: `size-control` 44 (default). 32 only inside dense desktop tables.
> - Label: a verb and its object, four words at most, sized against the longest language.
> - Full width on phones for the single primary action.

### Inputs and textarea · ACCEPTED

**Before.** Today: label above, 48 px, 2 px Ink border, error = 2 px Madder 800 border + icon + message.

**Why it changed.** A 2 px Ink border on every field is heavy: a long form looks like a stack of boxes, and focus and error, both 2 px, are hard to tell apart from default. There is no helper text, no character count, no textarea.

> **ACCEPTED**
>
> - Default border 1.5 px `border-input` (Logwood 700, 6.09:1). Hover: Ink. Focus: 2 px Ink + 2 px Mauveine ring. Error: 2 px Madder 800 + icon + message.
> - Label always visible above; never a placeholder used as a label. "(optional)" written out, required is the default.
> - Helper text below in Logwood 800, 13 px. Error replaces helper text, never adds a second line.
> - Textarea: 4 lines minimum, grows with content, counter in Plex Mono `120 / 500`.
> - Inside of the field is Paper. Hacker mode: Ink with a Logwood 400 border.

### Checkbox, radio, toggle · ACCEPTED

**Before.** Not defined.

**Why it changed.** The brand allows circles only for avatars and bans pills, which rules out the usual radio and toggle. Inventing exotic shapes would cost recognition, which matters most for people new to digital forms.

> **ACCEPTED**
>
> - **Checkbox:** 20 px square, radius 0, 2 px Ink border; checked = Ink fill + Paper check. 44 px row target. Used in forms and multi-select filters.
> - **Radio:** 20 px circle (named exception), 2 px Ink border, 10 px Ink dot. Used for one choice from 2–5.
> - **Toggle:** square-cornered (radius 4) 44 × 24 track, 18 px square knob, and the word *On* / *Off* beside it, so state never depends on colour or knob position. Only for settings that apply instantly.
> - Hacker mode: white borders, Mauveine 200 checked fill with Ink check.

### Select, dropdown, combobox · ACCEPTED

**Before.** Not defined.

**Why it changed.** Custom dropdowns are the most common accessibility failure on the web and the slowest control on a cheap Android phone.

> **ACCEPTED**
>
> - **Select:** the native control on phones (system picker), styled to match an input on desktop. Up to 10 options.
> - **Combobox:** type-ahead for long lists (country, language, time zone). Shows "4 of 196 match".
> - **Dropdown menu:** level 2 overlay, radius 4, items 44 px, selected = check icon + weight 600, never a colour fill. Arrow keys move, Enter picks, Esc closes.
> - No multi-select chips: use a checkbox list.

### Slider, date picker · ACCEPTED

**Before.** Not defined.

**Why it changed.** Sliders are imprecise with a thumb and invisible to many screen-reader users. Date pickers are where the 03/04/26 ambiguity the brand bans comes back.

> **ACCEPTED**
>
> - **Slider:** only for non-critical, continuous values (hours per week, text size). 6 px track (the bar), 20 px square thumb, the value always written in Plex Mono beside it, plus − / + buttons for exact steps.
> - **Date:** native picker on phones. On desktop, a text field that accepts "4 March 2026" with a calendar grid; weeks start on Monday; always shows the time zone for cohort times (`18:00 UTC−5`). Never numeric-only dates.

### Cards · in the system

The course card: 6 px Mauveine bar (32 px wide), up to three tags, Literata title (two lines, never truncated), one sentence, facts in Plex Mono behind a hairline. Radius 4, hairline edge, no shadow, no image except the teacher photo (32 px circle, with the name). Hover: border to Ink.

### Navigation bar (web) · in the system

Ink, full bleed, mark at 20 px, wordmark, four links, language switch always visible in Plex Mono, Sign in at the right. Sticky at `z-sticky`.

### Sidebar, drawer, bottom tab bar, menu · ACCEPTED

**Before.** Only the lesson rail and "four tabs at most" exist.

**Why it changed.** The rail's current-lesson marker risks becoming a coloured left border, which the brand bans. Drawers and bottom bars on phones need rules for safe areas and the back gesture.

> **ACCEPTED**
>
> - **Sidebar (lesson rail):** 280 px, Paper, hairline on the inner edge. Current lesson: weight 600, Logwood 50 fill, and the Plex Mono word *NOW*; finished lessons show a check icon. No coloured side stripe.
> - **Drawer (phones):** from the start edge, 85% width up to 320 px, level 3 with scrim; closes on Esc, scrim tap, swipe and the Android back button. Focus is trapped while open.
> - **Bottom tab bar (app):** 4 tabs max, icon + word always, 56 px + bottom safe area. Active tab: Ink icon, weight 600 and a 2 px Ink rule above; inactive: Logwood 800.
> - **Menu:** the dropdown menu above, opened from a "More" icon button.

### Tabs, accordion, breadcrumbs, pagination · ACCEPTED

**Before.** Not defined.

**Why it changed.** Numbered pagination hides how much is left, which breaks "always the denominator". Breadcrumbs are rarely needed on a shallow site.

> **ACCEPTED**
>
> - **Tabs:** up to 5, text only, active = weight 600 + 2 px Ink underline; scroll horizontally on phones. Arrow keys move between tabs.
> - **Accordion:** 48 px rows, hairline between, chevron at the end rotates 180° (120 ms). Several may be open. For FAQs and lesson notes, never for primary content.
> - **Breadcrumbs:** web only, from depth 3: *Courses / Freedom Tech / Run your own node*. The last item is plain text.
> - **Pagination:** lists use "Load more" with the count, *24 of 240 courses*. Tables on desktop use Previous / Next words plus page numbers in Plex Mono.

### Table · in the system

Header in Plex Mono uppercase labels over a 2 px Ink rule, 1 px hairline rows, optional Logwood 50 zebra, numbers right-aligned and tabular, every figure with its denominator.

### Dividers · in the system

Three weights only: 1 px hairline (rows), 2 px Ink (closes a heading), 6 px Mauveine bar (opens a section, tops a card). No dotted or double rules.

### List, avatar · ACCEPTED

**Before.** Lists are not defined. Avatars: circle only. People may not appear in imagery.

**Why it changed.** A community platform needs to show who is in a cohort, but the brand rules out photos of students.

> **ACCEPTED**
>
> - **List row:** 56 px minimum, title in Plex Sans 15/600, secondary line in Logwood 800 13, trailing figure in Plex Mono, hairline between rows. The whole row is the target.
> - **Avatar:** initials in Plex Mono 500 on a Logwood 100 circle (18.09:1), sizes 24 / 32 / 48. Students never have a photo. A teacher's photo may appear on the course card (32 px), the course page (64 px) and their own class page (96 px): circle, full colour, with consent.

### Alert and banner · in the system

Built from the status set above. Inline alert: inside the content, next to what it is about. Banner: full width at the top of the page, for site-wide notices, dismissible. Never for offline (it has its own screen) and never for marketing.

### Badge, chip, tag · ACCEPTED

**Before.** Tags: course tags (Plex Mono label) and the boxed status tag (colour + icon + word). No coloured chips, no notification dots, no rating badges.

> **ACCEPTED**
>
> - **Filter toggle** (for search): a secondary button that shows a check icon and weight 600 when on. Radius 4, never a pill.
> - **Counts** are written in Plex Mono beside a label, *Discussion (3)*, never a red dot.

### Toast, modal, dialog, tooltip, popover · ACCEPTED

**Before.** Not defined, beyond "no modal that blocks the lesson" and "offline is never a toast".

**Why it changed.** Overlays are where interfaces start nagging: ratings, email capture, streak reminders. They need rules about when they are allowed, not only how they look.

> **ACCEPTED**
>
> - **Toast:** only to confirm what the person just did ("Saved for offline · 4 MB"), with Undo where possible. Bottom centre, above the tab bar, 5 s, paused on hover or focus, `role="status"`. Never for errors.
> - **Modal / dialog:** only for a decision that must happen now (delete, leave a cohort, unsaved changes). Max 560 px, radius 8, level 3, scrim, focus trapped, Esc closes, a visible Close. Buttons name the action: *Delete download* / *Keep it*.
> - **Tooltip:** desktop only, names an icon button, never holds essential information. Ink with Paper type, 13 px, radius 4.
> - **Popover:** the learning use: a term defined in place. Tapping an underlined term in a lesson shows a 2-line definition, so jargon is "defined once, in plain words" without leaving the lesson.

### Progress, spinner, skeleton · ACCEPTED

**Before.** Progress bar exists: 6 px Mauveine on a track, count as a figure. The mark may never be a spinner.

**Why it changed.** A spinning circle on a slow 3G connection says nothing about how long to wait, and it is a circle, which the brand avoids.

> **ACCEPTED**
>
> - **Determinate first:** downloads show megabytes, *1.2 of 4 MB*.
> - **Loading bar instead of a spinner:** a 32 px Mauveine segment moving along the 6 px track (1.2 s loop). Inside buttons, three 4 px squares. Reduced motion: no movement, the word *Loading* only.
> - **Skeleton:** static Logwood 100 blocks in the shape of the real layout, no shimmer. After 2 s add a sentence, "Loading lesson 3"; after 10 s offer the saved lessons and Try again.

### Empty, error, loading screens · ACCEPTED

**Before.** Copy rules exist (what is true, then a next step with a number). No screen layouts.

> **ACCEPTED**
>
> One layout for all three: a Literata H2 that states the situation, one sentence, one primary button, one secondary link. No illustration, no mascot, no sad face, no error code in front of a student (the code goes in a "Details" disclosure for support).

## 3 States

### Focus · in the system

2 px outline at 2 px offset: Mauveine on light (8.76:1), Weld in Hacker mode (14.54:1). Visible on every control, never removed, shown only for keyboard (`:focus-visible`).

### Hover · in the system

Borders darken to Ink; links turn Logwood 800; nothing moves, lifts or scales. 120 ms.

### Active and selected · in the system

Weight and position change as well as colour: tab weight 600 + 2 px Ink rule; menu item check icon + 600; never a filled icon.

### Pressed and disabled · ACCEPTED

**Before.** Pressed: Ink buttons turn Logwood 950, secondary buttons fill Logwood 50; no scale. Disabled: Logwood 100 fill and Logwood 600 text (3.78:1).

> **ACCEPTED**
>
> Prefer not to disable. A disabled "Continue" does not say why; keep it enabled and show what is missing when pressed. Disable only when an action is truly impossible, and say why next to it.

### Loading · ACCEPTED

**Before.** Not defined.

> **ACCEPTED**
>
> - Button: keeps its width, label becomes the -ing verb ("Saving"), three squares animate, `aria-busy="true"`, a second press does nothing.
> - Page: skeleton, then a sentence after 2 s, then saved lessons and Try again after 10 s.
> - Never block the whole screen for a background save.

### Error (input) · ACCEPTED

**Before.** 2 px Madder 800 border, Alert icon, message tied with `aria-describedby`.

**Why it changed.** The rules say how errors look, not when they appear. Validating on every keystroke tells people they are wrong before they have finished typing.

> **ACCEPTED**
>
> - Validate on leaving the field and on submit, never while typing. Once a field shows an error, re-check it as they type so the error clears as soon as it is fixed.
> - The message names the fix: *Add a domain ending, e.g. ana@ismos.org*, never "Invalid input".
> - Forms with more than three fields show a summary at the top on submit, linking to each field, and move focus to it.

### Mobile long-press · ACCEPTED

**Before.** Not defined; the brand requires a single-tap alternative for every gesture.

> **ACCEPTED**
>
> - Long-press is only a shortcut to the same menu the "More" button opens (download, save, share a lesson). Never the only way.
> - 500 ms, light haptic when the menu opens.
> - Never for destructive actions and never to reveal hidden features.

## 4 Patterns

### Document layouts · in the system

Letter and A4, 8 columns, 20 mm margins (13 mm foot), 5 mm gutter. Header: number, Literata title, Plex Mono kicker, 2 px Ink rule. Footer: hairline then Plex Mono lines. Every page fits both papers. The printable Guideline follows the framework 01–09.

### Data tables and lists · in the system

Tables for comparing figures across rows (desktop, reports). Lists for everything a student scans on a phone. Tables turn into stacked lists below `md`; no horizontal-scrolling tables on phones except code.

### Web page layout · in the system

12 columns, max 1 200 px, reading column 680 px (7 of 12). Navigation, then the page head (bar, tag, title, lead, facts), then content. Full-bleed colour blocks may break the grid; type never does.

### Forms and validation · ACCEPTED

**Before.** Not defined as a pattern.

> **ACCEPTED**
>
> - One column, labels above, fields sized to their expected content (a postcode field is short).
> - Ask only what is needed now. Every question says why if the reason is not obvious.
> - Primary action at the end, named for what happens: *Join the cohort*, not Submit.
> - Validation as in States. Never clear what someone typed after an error.
> - Save drafts locally for long forms; a dropped connection must not lose the text.

### Search and filters · ACCEPTED

**Before.** Not defined.

> **ACCEPTED**
>
> - One search field at the top of Courses, with the AI tutor offered under the results.
> - Results always state the count: *12 of 27 courses*.
> - Filters: Tags, Format (live cohort or self-paced), Language, Length (under 2 h, 2–6 h, longer), Available offline. Checkbox lists on desktop; a bottom sheet with "Show 12 courses" on phones.
> - No sort by popularity or rating. Default order: live cohorts starting soonest, then the suggested course sequence.
> - No results: say so, show the nearest match and the total.

### Onboarding · ACCEPTED

**Before.** Not defined.

**Why it changed.** Carousels and personality quizzes delay the first lesson and are the first thing people skip.

> **ACCEPTED**
>
> - Three questions at most, each skippable: language, which topics interest you (tags), download over Wi-Fi only.
> - No tour, no carousel, no notifications prompt.
> - The first lesson opens within 60 seconds of arriving. Most are nine minutes.

### Settings screens · ACCEPTED

**Before.** Not defined.

> **ACCEPTED**
>
> | Group | Contains |
> |---|---|
> | Language | Interface language, lesson language |
> | Reading | Text size (system by default), Light / Hacker mode / Same as this device, transcripts |
> | Offline and data | Download over Wi-Fi only, storage used in MB, remove all downloads |
> | Notifications | Off by default; cohort reminders only after joining a cohort |
> | Account | Email, sign-in methods, export my data, delete my account |
>
> Toggles apply instantly with a toast; no Save button on settings.

### Error handling and permissions · ACCEPTED

**Before.** Copy rules exist for errors.

> **ACCEPTED**
>
> - Ask for a permission at the moment it is needed, with the reason first: notifications only after joining a cohort ("We'll remind you an hour before each class"), storage only when downloading.
> - If refused, keep working and explain once where to turn it on. Never ask again unprompted.
> - Errors: what happened, whose fault it is not, one next step with a number. If it was our fault, say so.
> - Log the technical code for support, behind a "Details" disclosure.

## 5 Platform rules

### Touch targets · in the system

44 × 44 pt on iOS, 48 × 48 dp on Android, 8 dp between targets. The whole course card is a target. Icon buttons keep a 44 px target even when the icon is 24.

### Safe areas · in the system

All fixed bars add `env(safe-area-inset-*)`: the bottom tab bar adds the bottom inset, sticky headers the top, drawers the start edge. Content never sits under a notch, home indicator or Android gesture bar.

### Responsive grid · ACCEPTED

**Before.** 12 columns and three breakpoints exist.

> **ACCEPTED**
>
> Use the four named ranges from Breakpoints with their column counts. Components span columns, not pixels: a course card is 4 of 4 on `sm`, 4 of 8 on `md`, 4 of 12 on `lg`. The reading column is 7 of 12 on desktop and full width on phones.

### Keyboard navigation · ACCEPTED

**Before.** "Every action works by keyboard; tab order matches the visual order."

> **ACCEPTED**
>
> - A "Skip to content" link first on every page.
> - Tab moves between components; arrow keys move inside one (tabs, menus, radio groups, the lesson rail), with roving focus.
> - Esc closes the top overlay and returns focus to what opened it.
> - Lesson player shortcuts: N next lesson, P previous, / search, ? lists all shortcuts. Single-key shortcuts can be turned off (WCAG 2.1.4).

### Gestures and haptics · ACCEPTED

**Before.** "Every multi-finger or path gesture has a single-tap alternative. No action depends on shaking the device."

> **ACCEPTED**
>
> - Allowed gestures: swipe to close a drawer or sheet, pull to refresh lists, swipe between lessons (optional, with Next / Previous buttons always visible).
> - Haptics: light impact on toggle and long-press, success notification when a download finishes. None on errors, none on wrong answers.
> - Respect the system setting for haptics and reduced motion.

### iOS and Android conventions · ACCEPTED

**Before.** Not defined.

> **ACCEPTED**
>
> | Topic | iOS | Android |
> |---|---|---|
> | Back | Edge swipe and the top-left back arrow | System back closes the top overlay first, then goes back |
> | Pickers | Native date and select wheels | Native Material pickers |
> | Share | System share sheet | System share sheet |
> | Navigation | Bottom tab bar | Bottom tab bar (same order) |
> | Pressed state | Brand pressed colour, no system highlight | Brand pressed colour instead of the ripple |
> | Type | Brand faces; Dynamic Type sizes | Brand faces; sp units |
>
> The brand look is the same on both; behaviour follows each platform.

## 6 Accessibility

### Contrast ratios · in the system

Body text 4.5:1, large text 3:1, icons, borders, focus rings and control states 3:1. Every pair is in the contrast table; FAIL rows are banned for their use (Madder text on Paper 2.66:1, Weld on Paper 1.44:1, Mauveine on Ink 2.40:1).

### Focus indicators · in the system

2 px Mauveine (light) or Weld (Hacker mode) outline, 2 px offset, never removed.

### Color-blind safety · in the system

Never colour alone: colour + icon + word for every state. Tags are told apart by their words, never colour. The status set also differs by container shape. Charts label lines directly.

### Screen reader and ARIA · in the system

Native elements first. Labels, roles and states on every control; errors linked with `aria-describedby`; progress as `progressbar`; toasts `role="status"`; dialogs `aria-modal` with a labelled title; `lang` on every passage.

### Minimum text size · ACCEPTED

**Before.** Nothing in the interface below 13 px; print 8 pt; slides 24 px.

> **ACCEPTED**
>
> The label style is 11 px, which breaks the 13 px rule. Keep 11 px on desktop, where it is uppercase Plex Mono with wide spacing, and use **12 px on phones**. Never use the label style for anything a student must read to act.

### Reduced motion · ACCEPTED

**Before.** "Respect Reduce Motion."

> **ACCEPTED**
>
> - All durations go to 0; changes that would be missed get a 120 ms cross-fade.
> - The loading bar stops and shows the word *Loading*.
> - Accordions open instantly; drawers appear without sliding.
> - Swipe between lessons still works; the content does not slide with the finger.

### Dynamic type and text scaling · ACCEPTED

**Before.** "Type follows the system size up to 200% with no clipping."

> **ACCEPTED**
>
> - Web: sizes in rem, line heights unitless, containers grow; no fixed heights on anything with text.
> - iOS: map body 17 → `.body` (the iOS default is also 17 pt), caption → `.footnote`, h1 → `.title1`.
> - At 200%: cards stack to one column, the tab bar shows icons with labels below and wraps, tables become lists.
> - Test every release at 200% with the longest string in any language.

## 7 Content

### Voice and tone · ACCEPTED

**Before.** The senior engineer who never stopped teaching the intro class. Second person, plain verbs, the useful thing first, warm not casual.

> **ACCEPTED**
>
> **Human, warm, direct. A calm instructor talking to one person. Not a brochure.** Now its own section, **05 Voice and tone**. Prestige means clarity, not decoration.
>
> - Write like you speak. If you wouldn't say it out loud, cut it.
> - Abstract is allowed. Keep it human: tie big ideas to a feeling, a person, or a moment.
> - Short sentences. Vary length. Follow a long sentence with a short one.
> - Rhythm: fragments and triplets. End on a punchy line.
> - Speak to “you.” Never “learners” or “users.”
> - Lower the barrier. Tell the reader they don't need prior knowledge.
> - No geographic or demographic labels. Write to the person, not the category.
> - One idea per sentence. One promise per paragraph.
> - Close with an action or a reassurance. Never a slogan.

### Dates, numbers, currency · in the system

4 March 2026 / 4 de marzo de 2026. 18:00 UTC−5. 1 240 with a thin space. Always a denominator: 87% of 240. Metric units. Currency named in full on first use. Never invent or round up a number.

### Capitalization · in the system

Sentence case for headings, buttons and labels. Uppercase only in the Plex Mono label. ISMOS and ISMOS.XYZ always in capitals. Tags in title case, as words, never abbreviated.

### Button labels and microcopy · ACCEPTED

**Before.** A verb and its object, four words at most.

> **ACCEPTED**
>
> A shared verb list so the same action has the same word everywhere:
>
> | Action | EN | ES | Not |
> |---|---|---|---|
> | Begin | Start the course | Comenzar el curso | Begin your journey |
> | Resume | Continue lesson 3 | Continuar la lección 3 | Keep the streak alive |
> | Keep | Save for later | Guardar para después | Bookmark it! |
> | Offline | Download for offline | Descargar sin conexión | Get it now |
> | Finish | Mark as done | Marcar como hecha | Complete! |
> | Remove | Delete download | Eliminar descarga | OK |
> | Leave | Leave the cohort | Salir del grupo | Unsubscribe |
> | Record | Get your record | Obtener tu constancia | Claim your certificate |

### UI error messages · ACCEPTED

**Before.** Three parts: what happened, whose fault it is not, what to do next.

> **ACCEPTED**
>
> | Situation | Message |
> |---|---|
> | Connection lost | The connection dropped, so this lesson stopped loading. Your place is saved. Four lessons are already on this phone. |
> | Server error | Something on our side stopped working. It is not your connection. Try again in a minute; your answers are saved. |
> | Code expired | That code has expired. Codes last 10 minutes. Get a new code. |
> | Storage full | This phone is out of space. The lesson needs 4 MB. Remove a download in Settings, or read it online. |
> | Wrong answer | That is not the right one. The words have to be in the order you wrote them; lesson 3 explains why. |
> | Page not found | This page isn't here. All 27 courses are on the course list. |

## 8 Documentation

### Brand do and don't · in the system

Section 04 Rules and 04.1 Do and do not: the mark's eight failures, never-lists by layer (colour, type, devices, icons, images), paired examples with failure counts, and the test.

### Per-component do and don't · ACCEPTED

**Before.** Each component README has guidelines, but not a consistent do/don't block.

> **ACCEPTED**
>
> Every component page ends with the same three-part block:
>
> | Do | Don't | Why |
> |---|---|---|
> | Name the button for its action: *Delete download* | *OK*, *Submit*, *Yes* | The label is what a screen reader reads |
> | One primary button per view | Two Ink buttons side by side | The eye needs one answer |
> | Show the count: *5 of 8* | *62%* alone | Always the denominator |

### Props and API spec · ACCEPTED

**Before.** `index.d.ts` exists as a format, but no components are coded.

> **ACCEPTED**
>
> Every component documents its props in one table and one TypeScript interface. Example:
>
> ```
> interface ButtonProps {
>   variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive'; // default 'primary'
>   size?: 'default' | 'compact';     // compact = 32 px, dense desktop tables only
>   icon?: IconName;                  // an Iconoir name, shown before the label
>   iconOnly?: boolean;               // requires ariaLabel; search, close, download only
>   ariaLabel?: string;
>   loading?: boolean;                // keeps width, label becomes the -ing verb
>   disabled?: boolean;               // prefer explaining over disabling
>   href?: string;                    // renders an <a> with button styling
>   children: string;                 // a verb and its object, max four words
> }
> ```

### Anatomy · in the system

Section 01.1: the mark, the lockup and its proportions, clear space, sizes, the book motif, tags, the six devices, required and optional parts. Components show anatomy in their previews.

### Contribution and deprecation · ACCEPTED

**Before.** "File exceptions and changes as a comment on this system. Decide it once, write it into its section."

> **ACCEPTED**
>
> - **Contribute:** comment with the problem, the proposal and one real screen it fixes. The owner marks it *Proposal* (like the boxes on this page), tests it on a 360 px phone in every shipped language, then accepts or declines within one minor version.
> - **Deprecate:** mark the token or component *Deprecated* with its replacement named, keep it for one minor version, remove it in the next major. Code warns in development when a deprecated token is used.

## 9 Code and sync

### Icon dev notes · ACCEPTED

**Before.** Icons are SVG, `currentColor`, `aria-hidden` when a word sits beside them, `aria-label` on the button when they stand alone. 44 px target when interactive.

> **ACCEPTED**
>
> ```
> npm i iconoir-react
> import { IconoirProvider, BookStack } from 'iconoir-react';
>
> <IconoirProvider iconProps={{ strokeWidth: 1.5, width: '1.5em', height: '1.5em' }}>
>   <BookStack aria-hidden /> Courses
> </IconoirProvider>
> ```

### Font loading · ACCEPTED

**Before.** Self-hosted WOFF2 Latin subsets in `fonts/` (Literata, IBM Plex Sans, IBM Plex Mono, Bricolage Grotesque), all SIL Open Font License, embeddable in offline packages.

> **ACCEPTED**
>
> - `font-display: swap`; preload only Plex Sans and Literata regular.
> - Fallback metrics with `size-adjust` so the page does not jump when fonts arrive on 3G.
> - Offline packages embed the four files (about 340 KB total) once, not per lesson.

### Tokens as code · ACCEPTED

**Before.** `tokens.json` is the single source: colours per theme, type styles, spacing, radius, shadow, borders, layout. It compiles to CSS custom properties.

> **ACCEPTED**
>
> Add the proposed families to `tokens.json` (status, elevation, opacity, z-index, motion, breakpoints, control sizes) and build platform outputs with Style Dictionary: CSS variables, a TypeScript object, iOS Swift and Android XML from the same file.

### Coded component library · ACCEPTED

**Before.** Today: a CSS layer (`bundle.css`, `ism-*` classes) with static previews.

**Why it changed.** Teachers making handouts need plain HTML and CSS; the platform needs real components with behaviour (focus traps, keyboard). One package cannot serve both well.

> **ACCEPTED**
>
> - **Two layers.** `@ismos/css`: class-based styles any HTML page can use (teachers, email, static pages). `@ismos/react`: accessible components built on those classes, with behaviour from a headless library such as React Aria.
> - Mobile app: the same tokens through Style Dictionary; components rebuilt natively, matched by screenshot tests.

### Figma-to-code sync · ACCEPTED

**Before.** No Figma file is connected to this system.

> **ACCEPTED**
>
> - `tokens.json` in code is the source of truth; Figma follows it, never the other way.
> - Sync tokens into Figma Variables with Tokens Studio on each release.
> - Components in Figma carry the same names and props as the code; a change starts as a proposal here, ships in code, then is mirrored in Figma.

### Visual regression and a11y tests · ACCEPTED

**Before.** Previews are checked by hand.

> **ACCEPTED**
>
> - Playwright screenshots of every component preview in 2 themes × every language × 360 px and 1 280 px, compared on every pull request.
> - axe-core on every preview and key page; any serious issue blocks the merge.
> - A contrast script that checks every text token pair in both themes against 4.5:1 / 3:1 and fails the build on a regression.
> - Keyboard tests for each overlay: opens, traps focus, Esc closes, focus returns.

## Rejected

Not adopted: Auth flows · i18n and RTL · Versioning and changelog · npm distribution. Their open questions are listed in 09 Release.