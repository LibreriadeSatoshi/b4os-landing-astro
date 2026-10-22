# CourseCard

The most repeated component on the platform. Five elements in a fixed order, plus the teacher. The only image a card may carry is the teacher's photo.

1. `.ism-bar`: 6 px `bar`, 32 px wide
2. Tags: up to three, `.ism-label`, separated by a middle dot (*AI · PRIVACY · FREEDOM TECH*)
3. Title: `.ism-card__title`, Literata, two lines maximum, never truncated
4. One sentence: `.ism-card__text`, what the student will be able to do
5. Teacher (optional): `.ism-card__teacher`, a 32 px circle photo (`.ism-avatar`) and the teacher's name, `body-small` 15/24 at 500. Up to two teachers. Self-paced courses show the teacher who wrote it.
6. Facts: `.ism-card__facts`, Plex Mono behind a hairline (lessons, hours, languages), or the state (*2 of 5 · continue*, *Finished · record available*, *Saved for offline · 4 MB*)

- **Teacher photo:** circle, full colour, head and shoulders on a plain background, 1 px `hairline` ring, no filter, frame or badge. Shared with the teacher's written consent. Alt is empty because the name sits beside it. No photo, or data saver on: initials in Plex Mono 500 on a Logwood 100 circle (`.ism-avatar--initials`).
- `radius-4`, 1 px `hairline` edge, no shadow. Hover: border to `text`; nothing moves.
- The whole card is the link; height free.
- **Don't:** any image other than the teacher photo, a student photo, ratings, enrolment counts, *new* or *popular* flags, tag chips.
