# 07 Examples

*Working. The system on every surface. No fabric imagery for now: where a surface once took cloth, it takes Ink, Paper or a flat full-bleed colour block.*

## AI is the binding element

AI runs through every course. It builds the curriculum, the resources and the tools, and students learn through AI tools. It takes no colour, no icon, no badge and no mascot. It appears as a word: the AI label (Label component).

- IBM Plex Mono Regular, 11 px screen · 7.5 pt print · 24 px on slides, uppercase, letterspaced 0.14 em.
- Ink on light, Paper on dark or on a colour. Never Mauveine, never Weld.
- On the text column's margin, directly above or below what it describes. No chip, pill, box, border or coloured ground.
- **Required:** material built with AI; a tool that is itself an AI tool; a translation no person has read; a generated image, in its caption.
- **Not** on every page, in the navigation, the lockup or the footer, or on a course a person wrote.

## ISMOS.XYZ home

Belongs to every course. Navigation in Ink, full bleed, mark at 20 px; language switch always visible in Plex Mono. Primary button `action`, secondary Ink outline, `radius-4`. Courses appear as course cards; tags appear as a row of words to browse by. No imagery beyond the teacher photo on each card. **Never:** a gradient or rainbow rule, a photograph of a person as a hero or banner, a funding figure or logo wall above the courses, a countdown, a cookie wall over content, a chat bubble, the Foundation's name above the fold.

## Tag page

One page per tag, all with identical structure and one substitution: the tag. Header: a full-bleed Ink or Mauveine block with white type, or Paper with Ink type. The tag (*AI*) as a Plex Mono label, then a one-sentence Literata line on why it matters in an ordinary life. The body is Paper; the course list shows every course carrying that tag, live cohorts first, then open courses. AI label on the course list heading where the curriculum was built with AI.

## Course card

The most repeated component; five elements in a fixed order, plus the teacher. The only image is the teacher's photo (CourseCard component).

1. 6 px `bar`, 32 px wide
2. Tags: up to three, `label`, `text-muted`, separated by a middle dot (*AI · PRIVACY · FREEDOM TECH*)
3. Course title, Literata, two lines maximum, never truncated
4. One sentence of Plex Sans saying what the student will be able to do
5. Teacher (optional): a 32 px circle photo and the name, up to two teachers
6. Countable facts in Plex Mono behind a hairline: format (*Live cohort* or *Self-paced*), lessons, hours, languages

`radius-4`, 1 px `hairline` edge, no shadow. Hover: border darkens to Ink; nothing moves, lifts or scales. Height free, sized against the longest language. The whole card is the target, 44 px minimum. States: in progress (*2 of 5 · continue*), finished (*Finished · record available*), saved offline (*Saved for offline · 4 MB*). **Not on a card:** any image other than the teacher photo, difficulty or star rating, enrolment count, popular/new flag, tag chips.

**Course page.** Who teaches it, under the facts: a 64 px circle photo, the name, and one line on what they teach. The teacher's own class page opens with one 96 px photo.

## Course formats

ISMOS runs two formats. Both use the same card, player and record; only the facts line differs.

- **Live cohort:** taught in real time by a teacher, with a start date, a time with its zone (*Mondays · 18:00 UTC−5*), and a group. Facts: *Live cohort · 8 lessons · starts 9 March 2026*.
- **Self-paced (MOOC):** open any time, no group, same lessons. Facts: *Self-paced · 8 lessons · 6 h*.

Never rank one format above the other.

## Lesson player

A reading surface first. Colour appears twice: the progress bar and the current-lesson marker. Measure 60–70 characters, `body` 17/28. No imagery; diagrams only where they explain. Every lesson downloadable, with its weight shown. Hacker mode: `surface` ground, `surface-raised` rail, `hairline` borders. **Never:** streak counter, timer, time-since-last-lesson message, completion animation or sound, comparison to other students, a modal blocking the lesson, a locked lesson.

## Record of completion

Says what a person did, not what they now are. Never *certificate* or *diploma*. A4 and Letter landscape, one page, printed on white Paper `#FFFFFF`. The course's tags in `logwood-800`; no colour block or border. The sentence (name, verb, course, date) in Literata. Figures in Plex Mono with denominators: 8 of 8. Verification by a short public URL printed as text: no QR code, no seal. Disclaimer verbatim at 11 px / 8.5 pt: *This record describes work completed on ISMOS.XYZ. It is not a qualification, a licence or an accreditation, and ISMOS does not present it as one. Anyone can verify it at the address above.* In every language, the agreed term from 05.1 (Spanish: *constancia de finalización*).

## Mobile app

Body stays 17 px; nothing below 13 px. Every target 44 px. Four tabs at most, each with an icon and a word. App icon: the mark in Paper on Ink, no rounded container of our own. No imagery in the app beyond teacher photos on course cards and course pages: it costs data and adds nothing. With data saver on, teacher photos fall back to initials. Offline is a state with its own screen, never a red banner or a toast. Show download sizes before a student commits. No push notification about inactivity. Test on a 360 px screen, a year-old Android, 3G and the longest string in any language.

## Social · 1:1, 4:5, OG

Mark top left, text bottom left, address beneath the text, all on the margin. Ground: Ink, Paper, or a full-bleed Mauveine or Indigo block. 15 words maximum on the image. Title in Literata or body in Plex Sans, never both; address in Plex Mono. Safe area 4% inset, clear of the lowest 14%. One file per language, never two languages on one image. **Never:** quotation-mark graphics, a portrait, a mark in a colour, a mark inside a circle, text with no mark and no address, emoji, hashtag stacks, a funding figure as headline.

## X, Nostr and Discord

Avatar: the mark in Paper on Ink, square. Banner: flat Ink, no type. Name: ISMOS. Bio: what ISMOS teaches, then the promise; no emoji, flags or hashtags. Discord: #welcome, #announcements, #help, then one channel per main tag (for example #ai, #bitcoin, #privacy) and one per live cohort; channel names lowercase and hyphenated; roles Student, Teacher and Ambassador, all in the same role colour; no levelling bot, XP or rank names; no custom emoji made from the mark.

## Email

600 px, one column. Header: mark at 18 px, wordmark, the course's first tag right. Ink and white only; tags appear as words. Literata for the subject line, Plex Sans body with Georgia and system fallbacks. One Ink button per email, with the URL also written out. The reader's language only, with a link to the other versions. Every email has a plain-text part. **Never:** countdowns, *last chance*, *we noticed you haven't*, open-tracking presented as engagement, guilt about an unfinished lesson.

## Slides · 1920 × 1080

Nothing below 24 px. Titles Literata 72–96 px; body Plex Sans 32–40 px. 96 px margin on all sides. Two grounds per deck at most: Paper for content, a full-bleed Mauveine or Indigo block for openers, Ink for quotations. Two consecutive full-bleed openers is one too many. Six lines at most, no sub-bullets. Footer: address left, slide number right, Plex Mono; not on openers. Without the fonts: Georgia for titles, the system sans for body, and the hex values in 03. **Never:** clip art, stock illustration, emoji, a photo of a person, transitions, a logo on every slide.

## Print flier

A4 or Letter portrait, 15 mm margin. Body 10.5 pt minimum, nothing below 8 pt. A colour block fills the top quarter, or the sheet is plain. Facts in Plex Mono, one per line, above the address. Address at the foot above a 2 px Ink rule. One sheet per language. Always produce a one-colour version. **The photocopy test:** print in black and white, photocopy the copy, pin it up; if the address still reads and the course and its tags read from the words, it passes.

## Conference booth

ISMOS at an event, read from five metres away. Back wall: a full-bleed Ink or Mauveine block, the stacked lockup at the top in white, one line in Literata (no more than eight words), the address ISMOS.XYZ in Plex Mono at the foot, all on one margin. Side panels: the course tags, white on Ink, used as wayfinding. Table and screens follow the platform. Minimum type: 60 mm cap height for the line, 30 mm for tags. **Never:** a photo of a person, a funding figure, a QR code as the only way in (always print the address), giveaways with the mark cropped or recoloured.
