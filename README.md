GIFcommit00021

# Layout study — LinkedIn, as GIFin

**Live:** [`https://gregoryedgerton.github.io/golden-grids-study-20-linkedin/`](https://gregoryedgerton.github.io/golden-grids-study-20-linkedin/)

An unaffiliated layout study. It rebuilds the signed-in application of
[linkedin.com](https://www.linkedin.com/) (the feed, a profile, the editing of
one's own profile, Settings & Privacy and the skill assessments) as stacked
golden grids under a parody name, GIFin. Its twenty-four members are fruits
and vegetables, each with the profile a professional network would ask of it
and a pair of googly eyes that match what it writes. The voice is cheeky and
the facts are true. The emphasis is interaction: nearly everything on the
pages answers back, and what the reader does is kept in their browser and sent
nowhere. None of the reference's sentences, photographs or marks is
reproduced. Built with
[Golden Grids](https://github.com/gregoryedgerton/golden-grids) from the
[study template](https://github.com/gregoryedgerton/golden-grids-study-template).

## Reference

The reference shows its feed, settings and full profiles only to members, and
the study does not sign in to anyone's account. The pages are built from the
application's known structure, read on 2026-10-15 and 2026-10-16; no screenshot of the
reference is kept. The reference retired its skill assessments in 2023 and
removed the badges in 2024 (its help page, "Skill Assessments - no longer
available"); the study rebuilds the feature as it worked.

- **The feed:** a white bar with the mark, a search field and the global
  navigation as icons over names (Home, My Network, Jobs, Messaging,
  Notifications, Me, For Business, the premium offer); the member's card and
  shortcuts in a left rail; Start a post; the posts, each an author line, text,
  a picture, a line of counts and an action bar (Like with six reactions,
  Comment, Repost, Send); suggestions to follow and the network's news in a
  right rail.
- **A profile:** the top card (banner, round photograph, name, pronouns,
  headline, place, Contact info, the current company, connections, Open to,
  Add profile section), Open to work, private Analytics, About with Top skills,
  Activity, Experience, Education, Skills with endorsements, Recommendations
  received and given, Languages and Interests; People also viewed.
- **Editing:** the reference's dialogs for the intro (with a headline of up to
  220 characters), About (2,600), Open to work, a position and skills.
- **Settings & Privacy:** a reduced header, six categories (Account
  preferences, Sign in & security, Visibility, Data privacy, Advertising data,
  Notifications), each a list of settings with their current values.
- **Skill assessments:** a list, an introduction, timed multiple-choice
  questions taken in one sitting, and a result that adds a badge to the skill.

**Register:** a warm grey ground `#f4f2ee`, white cards with 8px corners and a
faint ring for an edge, ink at 90% and 60% black, the blue `#0a66c2` of the
buttons and links, pill buttons, the system face, and green for open to work.
The reference has a dark mode of its own; the study's follows the device, or
the Dark mode setting in Settings, which applies on every page.

## Approach

The reference sets each post as one card and each profile section as a column
of rows. The study sets them as golden grids:

- **A post is a grid.** Its picture (or its poll, event or milestone; for a
  post of words alone, the words) takes the largest square; the words and the
  author take the next; and the reactions, with the comments and reposts
  beneath them, are a figure in the smallest. Under the grid the action bar
  and its panels are flat, in the flow of the page: the reaction picker, the
  comments with a composer, Repost (instantly or with thoughts), Send to
  connections, and a menu to save, copy a link, unfollow or hide.
- **The profile's top card is a grid:** the identity and its buttons in the
  largest square, the cover beside it, the connections and followers as
  figures. Experience puts the current role in the largest square; Skills are
  ordered by endorsements, so the most endorsed skill is the largest square.
- **The editing page puts the top card above the forms as a live preview**,
  changing as the reader types; each form saves on its own.
- **Settings** is a grid of its six categories on its home page, a list of
  rows that open in place within a category, and a grid of the kinds of
  notification, each with its switch.
- **Assessments** are squares, the one for a skill on the reader's profile
  largest, and a result is a grid of its figures beside the badge.

Long lists are dealt into bands as evenly as possible (`deal()` in
`src/bands/bands.tsx`); no band is left with a single square.

| Page | Band | Cells |
| --- | --- | --- |
| Feed | Each post | the picture, poll, event or milestone; the words; the author; the counts |
| Profile | Top card | identity and buttons, cover, connections, followers |
| | Analytics (own) | profile views, post impressions, search appearances |
| | Activity | the member's posts, cut at a word |
| | Experience | the roles, current first, with figures where there is one role |
| | Skills | up to five skills, most endorsed first |
| Edit profile | Preview | the top card, live |
| Settings | Home | the six categories, in two bands of three |
| | Notifications | twelve kinds in three bands of four, each with a switch |
| Skill assessments | List | the five assessments, the one for a profile skill first |
| | Result | correct answers, the badge, the score, the time taken |

Flat modules stay flat: the navigation and search, the rails, the composer,
the action bar and its panels, the profile's prose sections, the forms, the
settings rows, the quiz and the answer review.

**What answers back.** Like and the six reactions; comments, with likes and
replies; votes in a poll; Attend on an event; Say congratulations on a
milestone; Repost and Repost with your thoughts; Send to connections; save,
copy a link, unfollow, hide and undo; Start a post with an audience and a
photograph; Follow and Following everywhere; Connect with a note, Pending and
Withdraw; Message; Recommend; Endorse; Contact info; Open to; the feed's Top
and Recent; the search's suggestions of members and assessments. On the
editing page every field changes the preview at once, with required fields,
character limits and year checks. In Settings, Dark mode, the feed's default
sort, the last-name setting (with what others see), the profile viewing
options (with what others see), email addresses, sessions, two-step
verification, every notification and advertising switch, Close account in
three steps that close nothing, a data request that requests nothing, and a
reset that clears everything the study keeps. In an assessment, the timer
(which can be turned off before or during the test), shuffled answers, a pass
mark, a review of every answer with its source, and a badge the reader can show
or hide on the profile.

## Content and provenance

- **The members** are twenty-four fruits and vegetables, from Tomato to Peach.
  Each one's surname is its genus, so the nightshades (Tomato, Potato,
  Eggplant) are all Solanum and the brassicas (Broccoli, Kale, Cauliflower,
  Brussels Sprout) all Brassica; Pea's is shown as under review, because its
  genus is disputed.
- **The facts are true; the jokes are the study's.** Every date, place, person
  and number in a member's profile, posts and comments is checked against the
  Wikipedia page the disclosure names for that member, and anything that could
  not be checked was cut. The jokes turn a plant's history into a career:
  Tomato has been a "Vegetable, for tariff purposes" at the Supreme Court of
  the United States since 1893, the year of Nix v. Hedden; Pea's education is
  St Thomas's Abbey, Brno, 1856 to 1863, with Gregor Mendel. Years before the
  common era are shown as BCE, and a role whose dates no source gives exactly
  carries a phrase in their place.
- **The signed-in member** is Tomato, a fruit by birth and a vegetable by law,
  open to work in any kitchen.
- **Assessment answers** are each checked against the Wikipedia page named
  beside them in the review.
- **Googly eyes.** Every avatar is a photograph of the fruit or vegetable
  itself, with googly eyes drawn over it in CSS, so no person's face appears.
  Each post and comment sets its author's mood (happy, proud, cheeky,
  surprised, worried, curious or sleepy) to match what it says: Banana is
  worried about the disease that threatens it, Brussels Sprout nervous in an
  open letter, Tomato winks. The reader's own comments and posts get a mood
  from what they type, a question curious and an exclamation surprised. The
  pupils wobble and the lids blink, each pair on its own clock, in the
  member's own colour; with reduced motion, from the system or the study's
  tools, the eyes hold still in the mood's resting look.
- **Photographs** are in [`src/photos.json`](src/photos.json), each with its
  author, licence, page and alt text, all from Wikimedia Commons under CC BY,
  CC BY-SA or CC0 or in the public domain. The avatars are photographs of the
  produce; the covers and the posts' pictures are its fields, trees and
  markets. [`captures/hunt.py`](captures/hunt.py) found the candidates,
  [`captures/pick.py`](captures/pick.py) downloaded and recorded them, and
  [`captures/avatars.py`](captures/avatars.py) cut the avatars square.
- **Icons and reaction glyphs** are the study's own drawings. **Text** is the
  study's own.

## Notes for review

Observations for whoever reviews this study, recorded without a verdict.
Whether the layout suits the page is assessed separately, after every study
has been reviewed.

- **The cast was replaced.** The study was first built with characters from
  Quentin Tarantino's films and withdrawn before review as weak source
  material; the pages and their interactions stayed, and the members, posts,
  questions and photographs were replaced.
- **Built without the reference on screen.** The signed-in application cannot
  be read without an account; its structure is the known one, and details such
  as exact spacing are the study's.
- **A post's counts share a square.** At first the reactions and the comments
  were two figures; in a five-square post the smallest squares were about 75px
  in the feed's middle column, too small for a figure and its label, so they
  were merged.
- **Panels are in the flow.** The reference opens the reaction picker, menus,
  Send, Repost and the edit forms over the page; here they open beneath what
  opened them. Only the Me menu and the search suggestions hang from the
  header.
- **Phones.** The reference's mobile app has a bottom tab bar; the study keeps
  the top navigation, which scrolls sideways, because a fixed bar would be
  floating interface.
- **Skill assessments** have six questions where the reference had fifteen,
  and a pass mark of seventy per cent where the reference's badge went to the
  top thirty per cent of takers.
- **Accessibility.** `captures/scan.cjs` reports no overflow, no fitted line
  under 12px and no axe violations in Chrome and WebKit at 390, 820 and 1440,
  light and dark, on all five pages and their variants. `captures/cells.cjs`
  opens every expandable square at 390 in WebKit and Chrome. The timer can be
  turned off. The googly eyes are hidden from assistive technology; the mood
  they show is always in the words beside them. No screen-reader user has
  tested it.

## Disclosure

Every page says it is a study in three places, all read from
[`src/study.json`](src/study.json): the page's metadata, a sticky notice at the
top, and "About this layout study", the last element on the page.

## Running it

```bash
npm install
npm run dev
NODE_PATH=<a node_modules with playwright> node captures/scan.cjs http://localhost:5173/ index profile "profile?u=avocado" edit settings "settings?s=account" assessments "assessments?a=botany"
```

Pushing to `main` deploys to GitHub Pages.
