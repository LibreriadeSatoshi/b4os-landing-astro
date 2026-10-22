# B4OS Bitcoin Sign

The ISMOS kit fonts are Latin subsets without the Bitcoin sign (U+20BF), so "₿OSS" and the "₿4OS" logo showed a missing-glyph box on systems that have no font with it.

These files hold only U+20BF, cut from IBM Plex Sans 6 (`@ibm/plex-sans`) with `pyftsubset` in weights 400, 500 and 600. They are renamed "B4OS Bitcoin Sign" because the SIL Open Font License reserves the name "Plex" for modified versions. License: `OFL.txt`.

`src/styles/global.css` declares them with `unicode-range: U+20BF` and puts the family first in `--font-sans` and `--font-serif`, so every other character still comes from the ISMOS fonts.
