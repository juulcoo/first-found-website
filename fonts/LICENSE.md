# Fonts in this directory

All three families are licensed under the SIL Open Font License 1.1
(full text in `OFL.txt`), which permits redistribution as part of a
website — including self-hosting, which is exactly what we do here.

| Family        | Weights used  | Upstream                                          |
|---------------|---------------|---------------------------------------------------|
| Archivo       | 500–800       | https://fonts.google.com/specimen/Archivo         |
| Inter         | 400–600       | https://fonts.google.com/specimen/Inter           |
| IBM Plex Mono | 400, 500      | https://fonts.google.com/specimen/IBM+Plex+Mono   |

Archivo and Inter are variable fonts: each family ships one file per
subset, and the separate `@font-face` blocks in `fonts.css` pin the
weight axis. That's why there are 18 blocks but only 8 files.

Subsets are limited to `latin` and `latin-ext` — enough for Dutch and
English, and it keeps the payload small.
