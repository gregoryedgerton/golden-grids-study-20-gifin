/**
 * Every member, post, comment and question in the study. The members are
 * fruits and vegetables, each given the profile a professional network would
 * ask of them: a headline, an About, the work they have held and the skills it
 * took. Each goes by a first name and the name of what they are (Otto
 * Orange, Chelsea Chilli); the scientific name is a profile detail. The
 * voice is cheeky and the facts are true:
 * every date, place and claim about a plant is checked against the Wikipedia
 * page named in the member's `source`, and anything that could not be checked
 * was left out. Profiles stand in the present year. Nothing is sent anywhere;
 * what a reader changes stays in the browser.
 */
export const BASE = import.meta.env.BASE_URL;
export const PAGES = {
  feed: `${BASE}`,
  profile: `${BASE}profile.html`,
  edit: `${BASE}edit.html`,
  settings: `${BASE}settings.html`,
  assessments: `${BASE}assessments.html`,
};
export const profileHref = (id: string) => (id === ME ? PAGES.profile : `${PAGES.profile}?u=${id}`);
export const assessmentHref = (id: string) => `${PAGES.assessments}?a=${id}`;

/** The signed-in member. */
export const ME = "tomato";
/** The year every profile stands in: a role with no end runs to "Present". */
export const YEAR = 2026;
/** The signed-in member's address, the study's own: `.example` reaches no one. */
export const EMAIL = "tessa@tomato.example";

/**
 * A role. Years before the common era are negative. A role whose dates no
 * source gives exactly carries `dates`, a phrase shown in their place, and no
 * span.
 */
/** What the googly eyes say. Each post and comment sets the mood of its author's eyes, to match what it says. */
export type Mood = "happy" | "proud" | "cheeky" | "surprised" | "worried" | "curious" | "sleepy";
export const MOODS: Mood[] = ["happy", "proud", "cheeky", "surprised", "worried", "curious", "sleepy"];
/** A guess at the mood of something the reader writes: a question looks curious, an exclamation surprised, anything else happy. */
export const moodOf = (text: string): Mood => (/\?\s*$/.test(text.trim()) ? "curious" : /!/.test(text) ? "surprised" : "happy");

export interface Role { title: string; company: string; type?: string; start?: number; end?: number; approx?: boolean; dates?: string; place?: string; text?: string }
export interface School { school: string; field: string; years?: string }
export interface Skill { name: string; endorsements: number; by?: string[]; assessment?: AssessmentId }
export interface Rec { from: string; relation: string; text: string }
export interface Member {
  id: string;
  first: string;
  last: string;
  /** The scientific name, shown under the name on the profile and in Contact info. */
  binomial: string;
  pronouns?: string;
  headline: string;
  place: string;
  about: string;
  /** The botanical family, for "People also viewed". */
  family: string;
  /** The Wikipedia page the member's facts are checked against. */
  source: string;
  /** The avatar: a photograph of the member, by its key in photos.json, cropped square by captures/avatars.py. */
  photo?: string;
  /** Where the googly eyes sit on the avatar, as fractions of its side: the centre between them (x, y), each eye's size, and the distance between their centres. */
  eyes?: [number, number, number, number];
  /** The member's resting expression, worn where no post or comment sets one. */
  mood?: Mood;
  /** The avatar's ground, and the cover pattern's colour. */
  color: string;
  cover?: string;
  roles: Role[];
  schools?: School[];
  skills: Skill[];
  languages?: [string, string][];
  connections: number;
  followers: number;
  open?: { titles: string[]; places: string[]; types: string[]; recruitersOnly?: boolean };
  careerBreak?: string;
  recs?: Rec[];
}

const W = (path: string) => `https://en.wikipedia.org/wiki/${path}`;

export const MEMBERS: Member[] = [
  {
    id: "tomato", first: "Tessa", last: "Tomato", binomial: "Solanum lycopersicum", family: "Solanaceae", source: W("Tomato"), photo: "tomato", eyes: [0.6, 0.5, 0.2, 0.24], mood: "happy", color: "#c62828", cover: "field-tomato",
    headline: "Fruit by birth, vegetable by law · Sauces, salads and one Supreme Court case",
    place: "Western South America",
    about: "Botanically I'm an edible berry, from the nightshade family. Legally, in the United States, I've been a vegetable since 1893, when the Supreme Court decided unanimously that I'm served at dinner, not at dessert. I've learned to be both. I was being grown in southern Mexico by 500 BCE, the Aztecs called the red ones xitomatl, and in 1554 Pietro Andrea Mattioli called us pomi d'oro, golden apples, which I'm still not over. Open to new kitchens anywhere, from salsa to ketchup.",
    roles: [
      { title: "Vegetable, for tariff purposes", company: "Supreme Court of the United States", type: "Full-time", start: 1893, place: "Washington, D.C.", text: "Classed as a vegetable under the Tariff Act of 1883 in Nix v. Hedden, decided unanimously on 10 May 1893. Justice Horace Gray wrote the opinion: botanically a fruit, but served with the main course rather than as dessert." },
      { title: "Pomo d'oro (golden apple)", company: "Italian kitchens", type: "Full-time", start: 1554, place: "Italy", text: "Named in print as pomi d'oro, golden apples, by Pietro Andrea Mattioli, ten years after he first described the fruit in his herbal of 1544." },
    ],
    skills: [
      { name: "Sauces", endorsements: 212, by: ["chili", "pea"] },
      { name: "Salads", endorsements: 88, by: ["avocado"] },
      { name: "Botany", endorsements: 64, by: ["potato", "eggplant"], assessment: "botany" },
      { name: "Tariff Law", endorsements: 41, by: ["pineapple"] },
      { name: "Nightshades", endorsements: 23, assessment: "nightshades" },
    ],
    languages: [["Nahuatl", "Native or bilingual proficiency"], ["Italian", "Full professional proficiency"]],
    connections: 500, followers: 18400,
    open: { titles: ["Sauce Base", "Salad Lead", "Pizza Topping"], places: ["Naples, Italy", "Western South America"], types: ["Full-time", "Freelance"] },
    recs: [
      { from: "potato", relation: "Potato worked with Tomato on the same team", text: "We've shared a family for thousands of years and a plate for a good few hundred. Tomato brings the colour, and the lycopene that makes it. I'd share a pan with Tomato any day." },
      { from: "pineapple", relation: "Pineapple worked with Tomato but they were at different companies", text: "We've shared a pizza or two. Tomato is the one everybody agrees belongs there, and never once rubs it in." },
    ],
  },
  {
    id: "potato", first: "Paolo", last: "Potato", binomial: "Solanum tuberosum", family: "Solanaceae", source: W("Potato"), photo: "potato", eyes: [0.5, 0.48, 0.2, 0.24], mood: "happy", color: "#8d6e46", cover: "field-potato",
    headline: "Stem tuber, not a root · Domesticated in the Andes 7,000 to 10,000 years ago · Mashed, roasted, fried",
    place: "Southern Peru and northwestern Bolivia",
    about: "I'm a stem tuber, not a root, and I'll explain the difference to anyone who asks. I was domesticated in southern Peru and northwestern Bolivia between 7,000 and 10,000 years ago, and the Spanish brought me to Europe in the second half of the 16th century. Since then I've been mashed, roasted, fried and chipped, and I've enjoyed most of it. Same family as Tomato, Eggplant and Chili: the nightshades.",
    roles: [
      { title: "European Expansion", company: "The Columbian exchange", type: "Full-time", start: 1550, approx: true, place: "Europe", text: "Brought to Europe by the Spanish in the second half of the 16th century." },
      { title: "Staple Crop", company: "Andean agriculture", type: "Full-time", start: -8000, approx: true, place: "Southern Peru and northwestern Bolivia", text: "Domesticated between 7,000 and 10,000 years ago." },
    ],
    skills: [
      { name: "Mashing", endorsements: 140, by: ["tomato"] },
      { name: "Frying", endorsements: 120 },
      { name: "Roasting", endorsements: 96, by: ["carrot"] },
      { name: "Botany", endorsements: 30, assessment: "botany" },
    ],
    connections: 500, followers: 31000,
    recs: [{ from: "tomato", relation: "Tomato worked with Potato on the same team", text: "Potato fed half the world and never made a fuss about it. Reliable, versatile, and very good company in a stew." }],
  },
  {
    id: "eggplant", first: "Eleanor", last: "Eggplant", binomial: "Solanum melongena", family: "Solanaceae", source: W("Eggplant"), photo: "eggplant", eyes: [0.47, 0.45, 0.19, 0.23], mood: "curious", color: "#5b2a6e", cover: "market",
    headline: "Berry · Also known as aubergine and brinjal · Domesticated twice",
    place: "South Asia and East Asia",
    about: "Three names, one berry. Botanically I'm a berry. I'm an eggplant to some of you, an aubergine to others and a brinjal to others still. I was domesticated twice, once in South Asia and once in East Asia, so I've been doing two jobs from the start. I absorb oils and flavours, which some call a weakness and I call listening.",
    roles: [
      { title: "Berry", company: "Solanaceae, the nightshade family", type: "Full-time", dates: "Since domestication", place: "South Asia and East Asia", text: "Domesticated twice, separately: once in South Asia and once in East Asia." },
    ],
    skills: [
      { name: "Absorbing Flavours", endorsements: 77, by: ["chili"] },
      { name: "Curry", endorsements: 61 },
      { name: "Grilling", endorsements: 54, by: ["tomato"] },
    ],
    connections: 412, followers: 2900,
  },
  {
    id: "chili", first: "Chelsea", last: "Chilli", binomial: "Capsicum, several species", family: "Solanaceae", source: W("Chili_pepper"), photo: "chili", eyes: [0.5, 0.45, 0.22, 0.26], mood: "cheeky", color: "#b71c1c", cover: "dried-chili",
    headline: "Heat, measured in Scoville units since 1912 · Capsaicin specialist · First cultivated in Mexico",
    place: "Mexico",
    about: "My heat comes from capsaicin, and since 1912 people have measured it in Scoville heat units, after Wilbur Scoville, the pharmacist who devised the test. I was first cultivated in Mexico. On Columbus's second voyage, in 1493, Diego Álvarez Chanca wrote about my medicinal uses, and I've been travelling ever since. Yes, I'm a nightshade too. Tomato and I get along famously in salsa.",
    roles: [
      { title: "Heat Source", company: "Scoville scale", type: "Full-time", start: 1912, text: "Measured in Scoville heat units, from the test Wilbur Scoville devised in 1912." },
      { title: "Medicinal Plant", company: "Columbus's second voyage", type: "Contract", start: 1493, end: 1496, text: "Written up by Diego Álvarez Chanca, who documented my medicinal uses." },
      { title: "Crop", company: "Mexican agriculture", type: "Full-time", dates: "Since first cultivation", place: "Mexico" },
    ],
    skills: [
      { name: "Heat", endorsements: 240, by: ["tomato"] },
      { name: "Salsa", endorsements: 120, by: ["tomato", "avocado"] },
      { name: "Scoville Rating", endorsements: 66 },
    ],
    connections: 388, followers: 9600,
  },
  {
    id: "pepper", first: "Peter", last: "Peppers", binomial: "Capsicum annuum, Grossum Group", family: "Solanaceae", source: W("Bell_pepper"), photo: "pepper", eyes: [0.24, 0.74, 0.15, 0.19], mood: "happy", color: "#b03a2e", cover: "f-pepper",
    headline: "Bell pepper · Zero on the Scoville scale · Red is just green that waited",
    place: "Your salad drawer",
    about: "I'm the fruit of the Grossum Group of Capsicum annuum: Chelsea Chilli's relation, without the heat. I score zero on the Scoville scale. I come in red, yellow, orange, green, white and purple, and the red ones are simply green ones that ripened. Botanically I'm a berry, though you cook me as a vegetable, and I'm a rich source of vitamin C. I go by a few names: capsicum, paprika (I'm used to make the spice) and, in parts of the American Midwest, mango, which I've stopped correcting.",
    roles: [
      { title: "Cold Soup Specialist", company: "Gazpacho", type: "Seasonal", dates: "In most recipes", place: "Southern Iberia", text: "Most gazpacho includes bell peppers, with stale bread, tomato, cucumber, garlic, olive oil, wine vinegar, water and salt." },
      { title: "Spice Supplier", company: "Paprika", type: "Freelance", dates: "Dried and ground", text: "Bell peppers may be used in the production of the spice paprika." },
    ],
    skills: [
      { name: "Crunch", endorsements: 120, by: ["carrot"] },
      { name: "Colour Range", endorsements: 96, by: ["tomato"] },
      { name: "Vitamin C", endorsements: 77, by: ["orange", "lemon"] },
      { name: "Nightshades", endorsements: 21, assessment: "nightshades" },
    ],
    connections: 340, followers: 7400,
  },
  {
    id: "carrot", first: "Caroline", last: "Carrot", binomial: "Daucus carota subsp. sativus", family: "Apiaceae", source: W("Carrot"), photo: "carrot", eyes: [0.5, 0.45, 0.21, 0.25], mood: "proud", color: "#e46a12", cover: "market-roots",
    headline: "Root vegetable · Orange since Dutch growers bred me that way · Formerly white, yellow, red, purple and black",
    place: "Iran",
    about: "I probably began in Iran, where I was first grown for my leaves and seeds, not my root. Heirloom carrots still come in white, yellow, red, purple and black. The orange carrot was created by Dutch growers, and the Western carrot emerged in the Netherlands in the 16th or 17th century. You may have heard I turned orange to honour the House of Orange. It's a lovely story, and it's only a popular claim.",
    roles: [
      { title: "Orange Root", company: "Dutch growers", type: "Full-time", start: 1600, approx: true, place: "Netherlands", text: "The orange Western carrot emerged in the Netherlands in the 16th or 17th century." },
      { title: "Leaf and Seed Crop", company: "Early cultivation", type: "Full-time", dates: "Before the root was the point", place: "Iran", text: "Grown for my leaves and seeds before anyone bothered with the root." },
    ],
    skills: [
      { name: "Crunch", endorsements: 130, by: ["pea"] },
      { name: "Carrot Cake", endorsements: 77 },
      { name: "Soup", endorsements: 64, by: ["potato"] },
    ],
    connections: 466, followers: 4400,
  },
  {
    id: "broccoli", first: "Bruno", last: "Broccoli", binomial: "Brassica oleracea, Italica Group", family: "Brassicaceae", source: W("Broccoli"), photo: "broccoli", eyes: [0.5, 0.45, 0.21, 0.25], mood: "happy", color: "#2e7d32", cover: "field-broccoli",
    headline: "Brassica oleracea · One species, many careers · Calabrese, after Calabria",
    place: "Calabria, Italy",
    about: "Same species as Kale, Cauliflower and Brussels Sprout, and as cabbage, kohlrabi, collards and gai lan too: we're all Brassica oleracea, bred apart from one plant first cultivated in the eastern Mediterranean. One of my varieties, Calabrese, is named after Calabria. The Italian word broccolo turns up in the 17th century. Family reunions take a while.",
    roles: [
      { title: "Head of Florets", company: "Brassica oleracea", type: "Full-time", start: 1600, approx: true, place: "Italy", text: "Named in Italian, broccolo, in the 17th century." },
    ],
    skills: [
      { name: "Steaming", endorsements: 90, by: ["cauliflower"] },
      { name: "Stir-fry", endorsements: 70 },
      { name: "Family Reunions", endorsements: 40, by: ["kale", "brussels"], assessment: "brassicas" },
    ],
    connections: 370, followers: 5100,
  },
  {
    id: "kale", first: "Kate", last: "Kale", binomial: "Brassica oleracea, Acephala Group", family: "Brassicaceae", source: W("Kale"), photo: "kale", eyes: [0.45, 0.45, 0.21, 0.25], mood: "proud", color: "#1b5e20", cover: "frost-kale",
    headline: "Brassica oleracea · Sweeter after a hard frost · Survives −15 °C",
    place: "Eastern Mediterranean and Anatolia",
    about: "I was being cultivated in the eastern Mediterranean and Anatolia by 2000 BCE, and I've been fashionable at least twice since. I get sweeter after a heavy frost and I can survive down to −15 °C, so I'm the one still standing in the garden in January. In some Scots dialects my name simply means food, and to be off one's kail is to be off one's food.",
    roles: [
      { title: "Leafy Green", company: "Eastern Mediterranean agriculture", type: "Full-time", start: -2000, approx: true, place: "Eastern Mediterranean and Anatolia", text: "In cultivation by 2000 BCE." },
    ],
    skills: [
      { name: "Cold Tolerance", endorsements: 140, by: ["brussels"] },
      { name: "Smoothies", endorsements: 88 },
      { name: "Brassicas", endorsements: 52, by: ["broccoli"], assessment: "brassicas" },
    ],
    languages: [["Scots", "Full professional proficiency"]],
    connections: 500, followers: 12100,
  },
  {
    id: "cauliflower", first: "Claude", last: "Cauliflower", binomial: "Brassica oleracea, Botrytis Group", family: "Brassicaceae", source: W("Cauliflower"), photo: "cauliflower", eyes: [0.5, 0.42, 0.21, 0.25], mood: "sleepy", color: "#7d7a5c",
    headline: "Brassica oleracea · My head is called the curd · Quiet member of a loud family",
    place: "Cyprus",
    about: "The white head you eat is called the curd. In the Middle Ages I was associated with Cyprus. I'm the quiet one in the Brassica oleracea family, and with Broccoli, Kale and Brussels Sprout around, somebody has to be.",
    roles: [
      { title: "Curd", company: "Brassica oleracea", type: "Full-time", dates: "Since the Middle Ages", place: "Cyprus", text: "Associated with Cyprus in the Middle Ages." },
    ],
    skills: [
      { name: "Cheese Sauce", endorsements: 81 },
      { name: "Roasting", endorsements: 70, by: ["broccoli"] },
      { name: "Brassicas", endorsements: 24, assessment: "brassicas" },
    ],
    connections: 214, followers: 1300,
  },
  {
    id: "brussels", first: "Sebastian", last: "Sprout", binomial: "Brassica oleracea, Gemmifera Group", family: "Brassicaceae", source: W("Brussels_sprout"), photo: "brussels", eyes: [0.45, 0.42, 0.21, 0.25], mood: "worried", color: "#558b2f",
    headline: "Brassica oleracea · Named after Brussels · Open to a second chance at your table",
    place: "Brussels, Belgium",
    about: "I may have been grown near Brussels as early as the 13th century, which is where my name comes from. Same species as Broccoli, Kale and Cauliflower. Some of you left me on the plate as children. I've grown since, and I'm told you have too.",
    roles: [
      { title: "Sprout", company: "Belgian agriculture", type: "Seasonal", start: 1200, approx: true, place: "Brussels, Belgium", text: "Possibly grown near Brussels as early as the 13th century." },
    ],
    skills: [
      { name: "Roasting", endorsements: 99, by: ["kale"] },
      { name: "Resilience", endorsements: 45, by: ["broccoli"] },
      { name: "Brassicas", endorsements: 30, assessment: "brassicas" },
    ],
    connections: 190, followers: 870,
    open: { titles: ["Side Dish", "Winter Vegetable"], places: ["Brussels, Belgium", "Anywhere"], types: ["Full-time", "Temporary"] },
  },
  {
    id: "banana", first: "Barry", last: "Banana", binomial: "Musa acuminata, Cavendish", family: "Musaceae", source: W("Cavendish_banana"), photo: "banana", eyes: [0.45, 0.62, 0.16, 0.21], mood: "worried", color: "#b8860b", cover: "field-banana",
    headline: "Cavendish · Main export banana since Gros Michel · Named after the 6th Duke of Devonshire",
    place: "Chatsworth, Derbyshire",
    about: "Botanically I'm a berry, and bananas were probably first domesticated in New Guinea. I'm the Cavendish, named after William Cavendish, 6th Duke of Devonshire, whose head gardener, Joseph Paxton, grew me in the greenhouses at Chatsworth House. I went into mass commercial production in 1903 and took over from Gros Michel after Panama disease devastated it. I don't take that lightly: no fungicide works against TR4, the strain that threatens me now, and breeders are looking for what comes next.",
    roles: [
      { title: "Main Export Banana", company: "The banana trade", type: "Full-time", dates: "Since Gros Michel", text: "Took over from Gros Michel after Panama disease devastated it." },
      { title: "Commercial Crop", company: "Plantations", type: "Full-time", start: 1903, text: "Entered mass commercial production in 1903." },
    ],
    skills: [
      { name: "Breakfast", endorsements: 150 },
      { name: "Smoothies", endorsements: 80, by: ["strawberry"] },
      { name: "Succession Planning", endorsements: 41, by: ["kiwi"], assessment: "history" },
    ],
    connections: 500, followers: 26000,
  },
  {
    id: "strawberry", first: "Stella", last: "Strawberry", binomial: "Fragaria × ananassa", family: "Rosaceae", source: W("Garden_strawberry"), photo: "strawberry", eyes: [0.6, 0.42, 0.19, 0.23], mood: "cheeky", color: "#d81b60",
    headline: "Aggregate accessory fruit · Not a berry, whatever the name says · Bred in Brittany in the 1750s",
    place: "Brittany, France",
    about: "Let's get it out of the way: botanically I'm not a berry. I'm an aggregate accessory fruit, and each of the little seeds on my outside is an achene, a fruit of its own with a seed inside. I was first bred in Brittany in the 1750s, from a strawberry of eastern North America and one that Amédée-François Frézier brought from Chile in 1714. My species name, ananassa, means pineapple, for my flavour. Pineapple and I are on very good terms.",
    roles: [
      { title: "Garden Strawberry", company: "Breeders in Brittany", type: "Seasonal", start: 1750, approx: true, place: "Brittany, France", text: "First bred in the 1750s from F. virginiana, of eastern North America, and F. chiloensis, brought from Chile in 1714." },
    ],
    skills: [
      { name: "Desserts", endorsements: 210, by: ["peach"] },
      { name: "Jam", endorsements: 140 },
      { name: "Botany", endorsements: 12, assessment: "botany" },
    ],
    connections: 500, followers: 21000,
  },
  {
    id: "avocado", first: "Ava", last: "Avocado", binomial: "Persea americana, Hass", family: "Lauraceae", source: W("Hass_avocado"), photo: "avocado", eyes: [0.47, 0.25, 0.15, 0.2], mood: "proud", color: "#4e6b2f", cover: "field-avocado",
    headline: "Hass · One mother tree, planted by a mail carrier in 1926 · Big on toast",
    place: "La Habra Heights, California",
    about: "In 1926 Rudolph Hass, a mail carrier in La Habra Heights, California, planted three seeds, and one of them grew into my mother tree. He patented it in 1935, and every commercial Hass tree descends from it. The mother tree died at 76, in 2002, after a long fight with root rot. Today around four in five avocados grown worldwide are Hass. I'm big on toast. I'm aware of it.",
    roles: [
      { title: "Patented Cultivar", company: "Rudolph Hass", type: "Full-time", start: 1935, place: "La Habra Heights, California", text: "Patented in 1935. Grafted seedlings were grown and sold by Harold Brokaw, a nurseryman in Whittier." },
      { title: "Mother Tree", company: "Rudolph Hass", type: "Full-time", start: 1926, end: 2002, place: "La Habra Heights, California", text: "Grown from one of three seeds planted in 1926, and cut down in 2002 after root rot." },
    ],
    skills: [
      { name: "Toast", endorsements: 300 },
      { name: "Guacamole", endorsements: 260, by: ["chili", "tomato"] },
      { name: "Brunch", endorsements: 140 },
    ],
    connections: 500, followers: 41000,
  },
  {
    id: "kiwi", first: "Kevin", last: "Kiwi", binomial: "Actinidia deliciosa", family: "Actinidiaceae", source: W("Kiwifruit"), photo: "kiwi", eyes: [0.47, 0.5, 0.17, 0.22], mood: "cheeky", color: "#6d5a2b", cover: "field-kiwi",
    headline: "Formerly Chinese gooseberry · Renamed in 1959 · Native to China, grown commercially in New Zealand",
    place: "New Zealand",
    about: "I'm native to China, where I was first described in the 12th century. New Zealand began growing me commercially in the early 20th century, and in 1959 the exporter Turners & Growers adopted the name kiwifruit, on the advice of Norman Sondag. Before that I was the Chinese gooseberry. A rebrand can work: ask anyone who has eaten me with a spoon.",
    roles: [
      { title: "Kiwifruit", company: "Turners & Growers", type: "Full-time", start: 1959, place: "New Zealand", text: "Adopted the name kiwifruit, on Norman Sondag's advice." },
      { title: "Chinese Gooseberry", company: "New Zealand orchards", type: "Full-time", dates: "Early 20th century – 1959", place: "New Zealand", text: "Commercial plantings began in the early 20th century." },
    ],
    skills: [
      { name: "Rebranding", endorsements: 180, by: ["banana"] },
      { name: "Exports", endorsements: 120 },
      { name: "Food History", endorsements: 31, assessment: "history" },
    ],
    connections: 320, followers: 7300,
  },
  {
    id: "lemon", first: "Leo", last: "Lemon", binomial: "Citrus × limon", family: "Rutaceae", source: W("Lemon"), photo: "lemon", eyes: [0.48, 0.46, 0.22, 0.26], mood: "proud", color: "#9a7b00", cover: "field-lemon",
    headline: "Hybrid of citron and bitter orange · Scurvy trial, 1747 · Makes lemonade, professionally",
    place: "Northeastern India",
    about: "I'm a hybrid of citron and bitter orange, from northeastern India in the first millennium BC. In 1747 James Lind tested remedies for scurvy on sailors, and lemon juice was part of the trial. I'm sour, and I'm told it's my best quality.",
    roles: [
      { title: "Trial Remedy", company: "James Lind's scurvy trial", type: "Contract", start: 1747, end: 1747, text: "Lemon juice was among the remedies Lind tested against scurvy in 1747." },
      { title: "Citrus", company: "Northeastern India", type: "Full-time", dates: "Since the 1st millennium BC", place: "Northeastern India" },
    ],
    skills: [
      { name: "Lemonade", endorsements: 150 },
      { name: "Zest", endorsements: 88, by: ["orange"] },
      { name: "Citrus", endorsements: 40, by: ["grapefruit"], assessment: "citrus" },
    ],
    connections: 455, followers: 6200,
  },
  {
    id: "orange", first: "Otto", last: "Orange", binomial: "Citrus × sinensis", family: "Rutaceae", source: W("Orange_(fruit)"), photo: "orange", eyes: [0.5, 0.45, 0.23, 0.27], mood: "happy", color: "#d35400", cover: "field-orange",
    headline: "Hybrid of mandarin and pomelo · The colour was named after me · Hesperidium",
    place: "Southern China",
    about: "I'm a hybrid of mandarin and pomelo, from a region that takes in southern China, northeast India and Myanmar. The earliest mention of the sweet orange is in Chinese literature, in 314 BC. Botanically I'm a hesperidium, a modified berry. And yes, the colour was named after the fruit, not the other way round. Brazil grows more of me than anywhere else.",
    roles: [
      { title: "Sweet Orange", company: "Chinese literature", type: "Full-time", start: -314, place: "China", text: "First mentioned in Chinese literature in 314 BC." },
    ],
    skills: [
      { name: "Juice", endorsements: 220 },
      { name: "Colour Naming", endorsements: 40, by: ["carrot"] },
      { name: "Citrus", endorsements: 38, by: ["lemon"], assessment: "citrus" },
    ],
    connections: 500, followers: 15800,
  },
  {
    id: "grapefruit", first: "Grace", last: "Grapefruit", binomial: "Citrus × paradisi", family: "Rutaceae", source: W("Grapefruit"), photo: "grapefruit", eyes: [0.4, 0.42, 0.2, 0.24], mood: "worried", color: "#c2185b",
    headline: "The forbidden fruit · From Barbados, 18th century · Please check with your pharmacist",
    place: "Barbados",
    about: "I began in Barbados in the 18th century, a cross of the sweet orange and the pomelo, and I was once called the forbidden fruit. I interact with a good many medicines, so ask your pharmacist before we get close.",
    roles: [
      { title: "Breakfast Fruit", company: "Self-employed", type: "Self-employed", dates: "Since the 18th century", place: "Barbados" },
    ],
    skills: [
      { name: "Drug Interactions", endorsements: 140 },
      { name: "Breakfast", endorsements: 66 },
      { name: "Citrus", endorsements: 19, assessment: "citrus" },
    ],
    connections: 96, followers: 980,
  },
  {
    id: "pea", first: "Petra", last: "Pea", binomial: "Pisum sativum, or Lathyrus oleraceus", family: "Fabaceae", source: W("Pea"), photo: "pea", eyes: [0.5, 0.45, 0.2, 0.25], mood: "proud", color: "#558b2f", cover: "pea-plants",
    headline: "Gregor Mendel's research subject, 1856 to 1863 · Nitrogen fixer · Scientific name under review",
    place: "Brno, Czech Republic",
    about: "Between 1856 and 1863 Gregor Mendel grew some 28,000 plants at St Thomas's Abbey in Brno, most of them peas, and followed seven of our traits from one generation to the next. He published in 1866, and hardly anyone noticed until 1900. Botanically my pod is a fruit. Bacteria in nodules on my roots turn nitrogen from the air into ammonia, which feeds the soil after I'm gone. My scientific name is under review: Linnaeus called me Pisum sativum in 1753, and some sources now say Lathyrus oleraceus.",
    roles: [
      { title: "Nitrogen Fixer", company: "Rhizobia, in my root nodules", type: "Full-time", dates: "Every season", text: "Atmospheric nitrogen turned into ammonia, and returned to the soil for the next crop." },
      { title: "Crop", company: "Near Eastern agriculture", type: "Full-time", start: -10000, approx: true, place: "Near East", text: "The earliest archaeological finds date from about 10,000 BC." },
    ],
    schools: [{ school: "St Thomas's Abbey, Brno", field: "Plant hybridization, with Gregor Mendel", years: "1856 – 1863" }],
    skills: [
      { name: "Genetics", endorsements: 260, by: ["corn"] },
      { name: "Nitrogen Fixation", endorsements: 140, by: ["peanut"] },
      { name: "Soup", endorsements: 70 },
      { name: "Food History", endorsements: 22, assessment: "history" },
    ],
    languages: [["German", "Full professional proficiency"], ["Czech", "Professional working proficiency"]],
    connections: 500, followers: 19500,
    recs: [{ from: "peanut", relation: "Peanut worked with Pea but they were at different companies", text: "A fellow legume and a generous one: Pea leaves every field richer than it found it. And the genetics speak for themselves, seven traits at a time." }],
  },
  {
    id: "corn", first: "Cora", last: "Corn", binomial: "Zea mays", family: "Poaceae", source: W("Maize"), photo: "corn", eyes: [0.5, 0.48, 0.19, 0.25], mood: "happy", color: "#a37800", cover: "field-corn",
    headline: "Corn, in North America · Domesticated from teosinte about 9,000 years ago · One of the Three Sisters",
    place: "Southern Mexico",
    about: "I was domesticated in southern Mexico about 9,000 years ago from a wild grass, teosinte. I can't spread my own seed any more, so I rely on people to plant me, which has worked out well for all of us. With beans and squash I'm one of the Three Sisters, grown together in one field. Pumpkin is a squash, so we're practically family.",
    roles: [
      { title: "One of the Three Sisters", company: "Companion planting", type: "Full-time", dates: "With beans and squash", text: "Maize, beans and squash, grown together." },
      { title: "Staple Grain", company: "Mesoamerican agriculture", type: "Full-time", start: -7000, approx: true, place: "Southern Mexico", text: "Domesticated from teosinte about 9,000 years ago." },
    ],
    skills: [
      { name: "Tortillas", endorsements: 200, by: ["chili"] },
      { name: "Popcorn", endorsements: 160 },
      { name: "Teamwork", endorsements: 90, by: ["pumpkin"] },
    ],
    connections: 500, followers: 24000,
  },
  {
    id: "pumpkin", first: "Pippa", last: "Pumpkin", binomial: "Cucurbita, several species", family: "Cucurbitaceae", source: W("Pumpkin"), photo: "pumpkin", eyes: [0.42, 0.42, 0.2, 0.24], mood: "happy", color: "#c75b12", cover: "pumpkins",
    headline: "Seasonal, and the season is now · Heaviest yet: 1,246.9 kg · Took over the jack-o'-lantern from the turnip",
    place: "Front porches, every October",
    about: "Most of the year I keep a low profile. In October I'm everywhere. The heaviest pumpkin so far weighed 1,246.9 kg, in October 2023. Jack-o'-lanterns were carved from turnips in Ireland and Scotland before pumpkins took the job, and I'd like to thank the turnip for its service. I'm the squash in the Three Sisters, with Maize and the beans.",
    roles: [
      { title: "Jack-o'-lantern", company: "Halloween", type: "Seasonal", dates: "Every October", text: "Carved, lit and set on the step. The role was once the turnip's, in Ireland and Scotland." },
      { title: "Record Holder", company: "Giant pumpkin growers", type: "Seasonal", start: 2023, text: "The heaviest pumpkin yet: 1,246.9 kg, in October 2023." },
    ],
    skills: [
      { name: "Carving", endorsements: 300 },
      { name: "Pie", endorsements: 210, by: ["peach"] },
      { name: "Soup", endorsements: 120, by: ["carrot"] },
    ],
    connections: 444, followers: 13300,
  },
  {
    id: "watermelon", first: "Walter", last: "Watermelon", binomial: "Citrullus lanatus", family: "Cucurbitaceae", source: W("Watermelon"), photo: "watermelon", eyes: [0.45, 0.42, 0.2, 0.24], mood: "happy", color: "#2e7d4f", cover: "watermelon-slices",
    headline: "91% water · Pepo · Summer's most reliable guest",
    place: "Sudan",
    about: "I'm 91% water, which is right there in the name. Botanically I'm a pepo, a berry with a hard rind, like Pumpkin. I was domesticated in Sudan, and I've been the best thing at a summer picnic ever since.",
    roles: [
      { title: "Hydration Lead", company: "Summer", type: "Seasonal", dates: "Every summer" },
    ],
    skills: [
      { name: "Hydration", endorsements: 250 },
      { name: "Picnics", endorsements: 180, by: ["strawberry"] },
      { name: "Seed Spitting", endorsements: 66 },
    ],
    connections: 280, followers: 8800,
  },
  {
    id: "peanut", first: "Percy", last: "Peanut", binomial: "Arachis hypogaea", family: "Fabaceae", source: W("Peanut"), photo: "peanut", eyes: [0.62, 0.31, 0.16, 0.21], mood: "curious", color: "#8a5a2b",
    headline: "Legume, not a nut · Nitrogen fixer · Championed by George Washington Carver",
    place: "South America",
    about: "Despite the name, I'm a legume, a relative of Pea, not a nut. Like Pea, I fix nitrogen in the soil. I'm native to South America, and George Washington Carver championed me. Please mind the allergies.",
    roles: [
      { title: "Legume", company: "Fabaceae", type: "Full-time", dates: "Since domestication", place: "South America", text: "Fixing nitrogen, and correcting anyone who calls me a nut." },
    ],
    skills: [
      { name: "Peanut Butter", endorsements: 300 },
      { name: "Nitrogen Fixation", endorsements: 88, by: ["pea"] },
      { name: "Not Being a Nut", endorsements: 61, by: ["pea"], assessment: "botany" },
    ],
    connections: 233, followers: 4100,
  },
  {
    id: "rhubarb", first: "Ruby", last: "Rhubarb", binomial: "Rheum", family: "Polygonaceae", source: W("Rhubarb"), photo: "rhubarb", eyes: [0.5, 0.3, 0.2, 0.25], mood: "cheeky", color: "#a52a4a",
    headline: "Leaf stalk, cooked as a fruit · Stalks only, please · My leaves are poisonous",
    place: "The vegetable patch",
    about: "Eat my stalks, not my leaves: the leaves are poisonous, because of the oxalic acid in them. What you eat is a leaf stalk, so botanically I'm no fruit at all, and in the kitchen I'm cooked like one, in pies and crumbles. That makes me Tomato's opposite. We get on.",
    roles: [
      { title: "Dessert", company: "Pies and crumbles", type: "Seasonal", dates: "Every spring", text: "A leaf stalk with a fruit's job." },
    ],
    skills: [
      { name: "Crumble", endorsements: 140 },
      { name: "Tartness", endorsements: 77, by: ["lemon"] },
      { name: "Workplace Safety", endorsements: 31 },
    ],
    connections: 150, followers: 620,
  },
  {
    id: "pineapple", first: "Pablo", last: "Pineapple", binomial: "Ananas comosus", family: "Bromeliaceae", source: W("Pineapple"), photo: "pineapple", eyes: [0.46, 0.7, 0.15, 0.18], mood: "proud", color: "#9c7a00", cover: "field-pineapple",
    headline: "Multiple fruit · Once a symbol of wealth in Europe · Opinions on pizza welcome",
    place: "Southern Brazil and Paraguay",
    about: "I'm a multiple fruit: my flowers fuse, and their ovaries become berries that join into one. I come from the Paraná and Paraguay river basins, between southern Brazil and Paraguay. Columbus came across me in Guadeloupe on 4 November 1493, and in 17th- and 18th-century Europe I cost so much to grow in a hothouse that I became a symbol of wealth, more often displayed at dinner parties than eaten.",
    roles: [
      { title: "Symbol of Wealth", company: "European dinner parties", type: "Full-time", dates: "17th and 18th centuries", place: "Europe", text: "Grown in costly hothouses, and more often displayed than eaten." },
      { title: "Explorer Encounter", company: "Columbus's second voyage", type: "Contract", start: 1493, place: "Guadeloupe", text: "First met by a European, Christopher Columbus, in Guadeloupe on 4 November 1493." },
    ],
    skills: [
      { name: "Centrepieces", endorsements: 140 },
      { name: "Upside-down Cake", endorsements: 90 },
      { name: "Pizza", endorsements: 61, by: ["tomato"] },
    ],
    connections: 360, followers: 11200,
  },
  {
    id: "peach", first: "Penny", last: "Peach", binomial: "Prunus persica", family: "Rosaceae", source: W("Peach"), photo: "peach", eyes: [0.5, 0.26, 0.16, 0.23], mood: "happy", color: "#d0654a", cover: "field-peach",
    headline: "Drupe · Domesticated in China, named after Persia · Feeling peachy",
    place: "Zhejiang, China",
    about: "My scientific name, Prunus persica, says Persia, because I was widely grown there, but I come from China, where I was domesticated as early as 6000 BCE in Zhejiang. China still grows nearly two thirds of the world's peaches and nectarines. Botanically I'm a drupe, a stone fruit, in the rose family with the cherry, apricot, almond and plum. In China I'm a symbol of longevity. Nectarines are the same species as me, without the fuzz.",
    roles: [
      { title: "Symbol of Longevity", company: "Chinese culture", type: "Full-time", dates: "Since antiquity", place: "China" },
      { title: "Stone Fruit", company: "Chinese agriculture", type: "Full-time", start: -6000, approx: true, place: "Zhejiang, China", text: "Domesticated as early as 6000 BCE." },
    ],
    skills: [
      { name: "Being Peachy", endorsements: 300, by: ["strawberry"] },
      { name: "Cobbler", endorsements: 120 },
      { name: "Longevity", endorsements: 88 },
    ],
    connections: 500, followers: 17700,
  },
];

export const member = (id: string) => MEMBERS.find((m) => m.id === id);
/** The green frame shows when a member is open to work and has let all members see it. */
export const framed = (m: Pick<Member, "open">) => (m.open && !m.open.recruitersOnly ? "open" as const : undefined);
export const fullName = (m: Pick<Member, "first" | "last">) => [m.first, m.last].filter(Boolean).join(" ");
export const initials = (m: Pick<Member, "first" | "last">) => (m.first[0] + (m.last[0] ?? "")).replace(/[^A-Za-zÀ-ž]/g, "").toUpperCase();

/** A year as a profile shows it: 1893, c. 1600, 314 BCE, c. 8000 BCE. */
export const yearLabel = (n: number, approx?: boolean) => `${approx ? "c. " : ""}${n < 0 ? `${Math.abs(n).toLocaleString("en-US").replace(",", "")} BCE` : n}`;

/** The years a role ran, as a count: there is no year zero between 1 BCE and 1 CE. */
export function years(r: Role) {
  if (r.start === undefined) return 0;
  const end = r.end ?? YEAR;
  return end - r.start - (r.start < 0 && end > 0 ? 1 : 0);
}

/** "4 yrs" style durations, on whole years. */
export function span(r: Role) {
  const n = years(r);
  return n < 1 ? "Less than a year" : `${n.toLocaleString("en-US")} yr${n === 1 ? "" : "s"}`;
}

/** A role's years: "1893 – Present", "c. 8000 BCE – Present", or the role's own phrase. */
export const roleRange = (r: Role) => (r.dates ?? (r.start === undefined ? "" : `${yearLabel(r.start, r.approx)} – ${r.end === undefined ? "Present" : yearLabel(r.end)}`));
/** A role's dates as the profile prints them: "1893 – Present · 133 yrs", or the role's own phrase. */
export const roleDates = (r: Role) => (r.dates || r.start === undefined ? roleRange(r) : `${roleRange(r)} · ${span(r)}`);

export type Reaction = "like" | "celebrate" | "support" | "love" | "insightful" | "funny";
export const REACTIONS: { id: Reaction; label: string; color: string }[] = [
  { id: "like", label: "Like", color: "#378fe9" },
  { id: "celebrate", label: "Celebrate", color: "#44712e" },
  { id: "support", label: "Support", color: "#715e86" },
  { id: "love", label: "Love", color: "#df704d" },
  { id: "insightful", label: "Insightful", color: "#915907" },
  { id: "funny", label: "Funny", color: "#1a707e" },
];

export interface Comment { id: string; author: string; ago: string; text: string; likes: number; mood?: Mood }
export interface Post {
  id: string;
  author: string;
  ago: string;
  /** Minutes since posting, for the Recent sort. */
  minutes: number;
  kind: "photo" | "text" | "poll" | "event" | "milestone" | "article" | "gallery" | "document";
  /** The author's eyes on this post. */
  mood: Mood;
  text: string;
  photo?: string;
  poll?: { question: string; options: { label: string; votes: number }[]; left: string };
  event?: { title: string; when: string; place: string; going: number };
  milestone?: { title: string; detail: string };
  /** A long read: its title, minutes to read and sections; its cover is `photo`. */
  article?: { title: string; minutes: number; sections: { h?: string; p: string[] }[] };
  /** Several photographs in one post. */
  photos?: string[];
  /** A carousel of slides, as the reference's document posts. */
  doc?: { title: string; slides: { title: string; text: string }[] };
  /** Where the facts in a long read, gallery or carousel are checked, beyond the author's own page. */
  sources?: string[];
  reactions: Partial<Record<Reaction, number>>;
  reposts: number;
  comments: Comment[];
}

const c = (id: string, author: string, ago: string, text: string, likes: number, mood: Mood): Comment => ({ id, author, ago, text, likes, mood });

export const POSTS: Post[] = [
  {
    id: "tomato-margherita", author: "tomato", ago: "1h", minutes: 60, kind: "article", mood: "proud", photo: "d-margherita",
    text: "I wrote up the two dishes I'd put at the top of my CV, and the one where I turned up late.",
    article: {
      title: "Red, white and a little legend: two dishes on my CV",
      minutes: 4,
      sections: [
        { p: ["People ask what I actually do. Fair question, for someone who is legally a vegetable and botanically a berry. So here are two dishes I'm proud of, with the parts that are true and the parts that are only told."] },
        { h: "Pizza Margherita, Naples", p: [
          "The typical Neapolitan pizza is seasoned with hand-crushed peeled tomatoes, mozzarella (buffalo or fior di latte), fresh basil and olive oil. That's me in the first slot, doing the heavy lifting.",
          "Popular legend says the red, white and green were chosen for the colours of the Italian flag, and that on 10 June 1889 a pizzaiolo called Raffaele Esposito made it for the visiting Queen Margherita, who preferred it to the other two he made. Later research cast doubt on the legend and on the letter said to recognise him, and found that both the story and the name Margherita were first promoted in the 1930s and 1940s.",
          "My perspective: keep the colours, check the dates. A good story is no excuse for a soggy base.",
        ] },
        { h: "Gazpacho, southern Iberia", p: [
          "Gazpacho is a cold soup and drink of raw, blended vegetables from the south of the Iberian Peninsula, with Córdoba, Seville and Granada among its homes. Most versions today use stale bread, tomato, cucumber, bell peppers, garlic, olive oil, wine vinegar, water and salt. Andalusian cooks say it should be slightly chilled, not iced.",
          "Now the humbling part. The earliest versions had no tomato at all: stale bread, garlic, olive oil, salt and vinegar. Red gazpacho appeared in the 19th century, when tomatoes were added. I joined an established team and changed its colour. I like to think that counts as leadership.",
        ] },
        { h: "What I'm taking from both", p: ["Turn up late if you have to, but turn up ripe. And give credit to the bread, the basil and Peter Peppers, who do more work in that soup than anyone mentions."] },
      ],
    },
    sources: [W("Pizza_Margherita"), W("Gazpacho")],
    reactions: { like: 2140, insightful: 880, love: 410, funny: 120 }, reposts: 214,
    comments: [
      c("c1", "pepper", "50m", "Thank you for the credit. Most people only notice me when I'm red.", 188, "happy"),
      c("c2", "potato", "40m", "Bread and tomato in a cold soup. Bold. I respect it.", 96, "curious"),
    ],
  },
  {
    id: "eggplant-smoky", author: "eggplant", ago: "3h", minutes: 200, kind: "article", mood: "proud", photo: "d-baba",
    text: "Long read: two dishes that prove I'm nobody's side dish.",
    article: {
      title: "Smoky, layered, and never the side dish",
      minutes: 4,
      sections: [
        { p: ["I absorb oils and flavours, which some of you call a weakness. Here are two dishes where it's the whole point."] },
        { h: "Baba ghanoush", p: [
          "A Levantine appetizer: finely chopped roasted eggplant, mixed with olive oil, lemon juice, seasonings and tahini. I'm traditionally roasted, baked or broiled before I'm peeled, which is where the smoke comes from.",
          "The name is a small mystery. In Arabic, bābā is a term of endearment for father, and ghanoush could be a personal name, but nobody is certain whether bābā means a person or me. I'll answer to either.",
        ] },
        { h: "Moussaka", p: [
          "Moussaka is an aubergine- or potato-based dish, often with ground meat, popular in the Balkans and the Middle East. The modern Greek version was created in the 1920s by Nikolaos Tselementes, in three layers cooked separately: sliced aubergine sautéed in olive oil, ground lamb cooked with tomatoes, and a top of béchamel or savoury custard.",
          "In Albania, Bulgaria, the former Yugoslavia and Romania, cooks use potatoes instead of me, so Paolo Potato gets the credit there. In Turkey, musakka isn't layered at all: it's fried aubergine in a meat sauce with tomato. Same name, different jobs. Very this network.",
        ] },
        { h: "My take", p: ["Roast me properly. Let me sit in the olive oil. And if a recipe calls me a side, read it again."] },
      ],
    },
    sources: [W("Baba_ghanoush"), W("Moussaka")],
    reactions: { like: 1210, love: 300, insightful: 260 }, reposts: 61,
    comments: [
      c("c1", "potato", "2h", "Happy to cover the Balkans for you.", 140, "proud"),
      c("c2", "lemon", "2h", "Lemon juice reporting for duty.", 61, "cheeky"),
    ],
  },
  {
    id: "chili-gallery", author: "chili", ago: "4h", minutes: 260, kind: "gallery", mood: "cheeky", photos: ["dried-chili", "d-pastor", "d-guacamole", "chili"],
    text: "Places I turned up this week. Dried, in the marinade for al pastor; fresh, as the jalapeños in a molcajete of guacamole; and in a pile, just being myself.",
    sources: [W("Al_pastor"), W("Guacamole")],
    reactions: { like: 640, funny: 120, love: 88 }, reposts: 14,
    comments: [c("c1", "pineapple", "3h", "See you on the trompo.", 77, "cheeky")],
  },
  {
    id: "pineapple-twocontinents", author: "pineapple", ago: "6h", minutes: 380, kind: "article", mood: "cheeky", photo: "d-hawaiian",
    text: "I've been on pizza in Canada and on a spinning top in Mexico. A long read on both, and on how I keep getting named after places I'm not from.",
    article: {
      title: "Two dishes, two countries, neither of them Hawaii",
      minutes: 5,
      sections: [
        { h: "The pizza, Ontario, 1962", p: [
          "Hawaiian pizza was invented in 1962 by Sam Panopoulos, a Greek-born Canadian, at the Satellite Restaurant in Chatham-Kent, Ontario. It's topped with me, tomato sauce, mozzarella, and either ham or bacon.",
          "He called it Hawaiian because the pineapple he used came in cans from the Hawaiian Pineapple Company. It was not directly inspired by Hawaii at all. I come from the river basins between southern Brazil and Paraguay, so this is the second time a label has been more famous than my passport.",
          "My perspective on the pizza debate: Tessa Tomato is on every slice either way. I just make the conversation louder.",
        ] },
        { h: "Al pastor, Mexico", p: [
          "Al pastor is spit-grilled meat, usually pork, sliced and served in tacos. It comes from shawarma, which Lebanese immigrants brought to Mexico in the late 19th and early 20th centuries; by the 1920s pork had largely replaced lamb, and in Mexico City their children's restaurants began marinating the meat in adobo and serving it on corn tortillas.",
          "The meat is marinated in dried chilies, spices and pineapple, usually with achiote, and cooked slowly on a vertical rotisserie called a trompo, a spinning top. Diced pineapple is a standard topping, with chopped onion and cilantro.",
          "So I'm in the marinade and on the taco. Chelsea Chilli is in the marinade too. Cora Corn is the tortilla. That's a cross-functional team.",
        ] },
      ],
    },
    sources: [W("Hawaiian_pizza"), W("Al_pastor")],
    reactions: { like: 2380, funny: 940, insightful: 600, celebrate: 120 }, reposts: 302,
    comments: [
      c("c1", "tomato", "5h", "On every slice either way. Correct.", 410, "proud"),
      c("c2", "corn", "5h", "Proud to be the tortilla.", 233, "happy"),
      c("c3", "chili", "4h", "Marinade colleagues forever.", 120, "cheeky"),
    ],
  },
  {
    id: "pepper-doc", author: "pepper", ago: "8h", minutes: 500, kind: "document", mood: "happy",
    text: "Made a carousel. Swipe for five facts and one confession.",
    doc: { title: "Peter Peppers: five things", slides: [
      { title: "Family", text: "I'm the fruit of the Grossum Group of Capsicum annuum. Chelsea Chilli's relation, without the heat." },
      { title: "Zero", text: "My score on the Scoville scale. I'm a sweet pepper." },
      { title: "Six colours", text: "Red, yellow, orange, green, white and purple. Red ones are simply green ones that ripened." },
      { title: "Berry", text: "Botanically a berry, cooked as a vegetable. Tessa Tomato and I have compared notes." },
      { title: "Vitamin C", text: "A rich source of it. Otto and Leo, I'm coming for your brand." },
      { title: "The confession", text: "In parts of the American Midwest some people call me a mango. I've stopped correcting them." },
    ] },
    sources: [W("Bell_pepper")],
    reactions: { like: 980, funny: 410, insightful: 160 }, reposts: 40,
    comments: [
      c("c1", "orange", "7h", "Come for it, then. We'll see who's still named after a colour.", 230, "cheeky"),
      c("c2", "chili", "7h", "Family resemblance, none of the heat. Love you anyway.", 140, "happy"),
    ],
  },
  {
    id: "peach-melba", author: "peach", ago: "10h", minutes: 600, kind: "article", mood: "happy", photo: "d-melba",
    text: "A long read about the night a swan made of ice stole my scene.",
    article: {
      title: "Peach Melba, or how to be upstaged by a swan",
      minutes: 3,
      sections: [
        { p: ["Some dishes are named after the fruit. Mine is named after a soprano, and I'm fine with that."] },
        { h: "The Savoy, 1892 or 1893", p: [
          "Auguste Escoffier made it at the Savoy Hotel in London for the Australian soprano Nellie Melba, who was singing in Wagner's Lohengrin at Covent Garden. The Duke of Orléans gave a dinner there to celebrate her success.",
          "Escoffier served the peaches and ice cream in a silver dish set on an ice sculpture of a swan, a figure from the opera, and first called it Pêche au cygne, peach with a swan.",
        ] },
        { h: "What was in it", p: ["The original, as he wrote it: tender and very ripe peaches, vanilla ice cream, and a purée of sugared raspberry. Three things. No swan required, though it helps."] },
        { h: "My perspective", p: ["Ripe is the whole recipe. Every peach in that dish was at its best, and you could tell. Wait for it."] },
      ],
    },
    sources: [W("Peach_Melba")],
    reactions: { like: 1760, love: 620, insightful: 210 }, reposts: 88,
    comments: [
      c("c1", "strawberry", "9h", "Raspberry got the purée and I'm not even mad.", 140, "cheeky"),
      c("c2", "kiwi", "8h", "Upstaged by a swan is the most elegant way to be upstaged.", 98, "happy"),
    ],
  },
  {
    id: "kale-soups", author: "kale", ago: "14h", minutes: 840, kind: "article", mood: "proud", photo: "d-caldo",
    text: "Green soup, green mash. A long read on the two dishes where I share the bowl with Paolo Potato.",
    article: {
      title: "Green broth and green mash: working with potatoes",
      minutes: 3,
      sections: [
        { h: "Caldo verde, Portugal", p: [
          "Caldo verde comes from the Minho Province in northern Portugal and is now a favourite across the country. The name means green broth. The basic recipe uses Portuguese cabbage, couve-galega, a cultivar of collard greens, and other leafy greens such as kale can stand in, with potatoes, olive oil and black pepper, onion and garlic.",
          "A sausage such as paio, chouriço or linguiça is usually boiled whole with the potatoes and sliced into the soup when it's served. It's eaten at weddings, birthdays and popular celebrations, and sometimes as a late supper.",
          "I'm the understudy there, I know. Collards and I are the same species, so I take it as a family role.",
        ] },
        { h: "Colcannon, Ireland", p: [
          "Colcannon is a traditional Irish dish of mashed potatoes with cabbage, most often made with potatoes, butter, milk and cabbage, and some recipes use kale instead.",
          "Two dishes, two countries, and Paolo Potato in both. If you want to know who your real collaborators are, look at what you're mashed with.",
        ] },
      ],
    },
    sources: [W("Caldo_verde"), W("Colcannon")],
    reactions: { like: 860, love: 220, insightful: 140 }, reposts: 33,
    comments: [
      c("c1", "potato", "13h", "Mashed with you any day.", 166, "happy"),
      c("c2", "brussels", "12h", "Family role. Love that for us.", 71, "proud"),
    ],
  },
  {
    id: "potato-gallery", author: "potato", ago: "16h", minutes: 960, kind: "gallery", mood: "happy", photos: ["d-colcannon", "d-caldo", "potato-flower", "field-potato"],
    text: "Week in pictures. Mashed into colcannon in Ireland, in the pot for caldo verde in Portugal, flowering, and back at the field where it all starts. Kate Kale was in two of these.",
    sources: [W("Colcannon"), W("Caldo_verde")],
    reactions: { like: 720, love: 160 }, reposts: 12,
    comments: [c("c1", "kale", "15h", "Two of four. I'll take it.", 52, "cheeky")],
  },
  {
    id: "corn-lime", author: "corn", ago: "20h", minutes: 1200, kind: "article", mood: "curious", photo: "field-corn",
    text: "Before I'm a tortilla, I'm soaked in lime. A long read on nixtamalization, the oldest kitchen technique on this network.",
    article: {
      title: "Before the tortilla, the lime",
      minutes: 3,
      sections: [
        { p: ["Most of you meet me as a tortilla, a tamale or a bowl of pozole. None of those works without a step most people have never heard of."] },
        { h: "Nixtamalization", p: [
          "The grain is soaked and cooked in an alkaline solution, usually limewater, which loosens the hulls and softens the kernels before they're washed and hulled.",
          "It was first developed in Mesoamerica, where maize was first grown. The earliest evidence comes from Guatemala's southern coast, with equipment dating from 1200 to 1500 BCE.",
        ] },
        { h: "Why it matters", p: [
          "Treating corn with alkali makes its tryptophan usable by the body, which helps prevent niacin deficiency, pellagra, in people who eat corn as a staple. A process three thousand years old that is also nutrition science.",
        ] },
        { h: "What comes of it", p: ["Ground fresh nixtamal becomes masa, the dough for tortillas, tamales and pupusas. Whole kernels become hominy and pozole. Pablo Pineapple and I have worked together on the tacos al pastor; I'm the tortilla, which is to say the foundation."] },
      ],
    },
    sources: [W("Nixtamalization")],
    reactions: { like: 1340, insightful: 760, celebrate: 90 }, reposts: 140,
    comments: [
      c("c1", "pea", "19h", "A three-thousand-year-old process with a nutrition result. Mendel would approve.", 120, "proud"),
      c("c2", "pineapple", "18h", "Foundation is right.", 60, "happy"),
    ],
  },
  {
    id: "avocado-doc", author: "avocado", ago: "1d", minutes: 1380, kind: "document", mood: "proud",
    text: "Guacamole, in five slides.",
    doc: { title: "Guacamole, in five slides", slides: [
      { title: "The name", text: "From the Classical Nahuatl āhuacamōlli, which translates literally as avocado sauce." },
      { title: "Where", text: "Guacamole was first developed in Mexico." },
      { title: "How", text: "Traditionally, ripe avocados are mashed with salt in a molcajete, a mortar and pestle." },
      { title: "With", text: "Lime juice, onions and jalapeños, and often cilantro. Chelsea Chilli is the jalapeño. Leo Lemon is not the lime, and is still upset." },
      { title: "On toast", text: "Not traditional. Still delicious. I'm aware of it." },
    ] },
    sources: [W("Guacamole")],
    reactions: { like: 1500, love: 520, funny: 230 }, reposts: 71,
    comments: [
      c("c1", "lemon", "23h", "Not upset. Disappointed.", 310, "worried"),
      c("c2", "chili", "22h", "Jalapeño reporting for duty.", 120, "cheeky"),
    ],
  },
  {
    id: "banana-foster", author: "banana", ago: "2d", minutes: 2600, kind: "article", mood: "surprised", photo: "d-foster",
    text: "A long read on the time I was set on fire for a dessert named after a crime commissioner.",
    article: {
      title: "Bananas Foster: set alight, and named for a crime fighter",
      minutes: 3,
      sections: [
        { h: "New Orleans, 1951", p: [
          "Bananas Foster was created in 1951 at the original Brennan's in New Orleans, when the restaurant was still called Owen Brennan's Vieux Carré. Ella Brennan and the restaurant's chef, Paul Blangé, worked together to adapt a dish.",
          "It's named after Richard Foster, the chairman of the New Orleans Crime Commission. I've been on a lot of menus. That's the only time a crime commission was involved.",
        ] },
        { h: "How it's done", p: [
          "The sauce is butter, brown sugar, cinnamon, dark rum and banana liqueur. The butter, sugar and bananas are cooked, then the alcohol is added and set alight, often at the table as a flambé. It's usually served with vanilla ice cream.",
        ] },
        { h: "My perspective", p: ["Being set on fire in front of an audience and coming out caramelised is the most transferable skill I have. Breeders looking for my successor, take note."] },
      ],
    },
    sources: [W("Bananas_Foster")],
    reactions: { like: 1130, funny: 600, celebrate: 120 }, reposts: 52,
    comments: [
      c("c1", "pumpkin", "2d", "Respect. I only get candles.", 140, "cheeky"),
      c("c2", "strawberry", "2d", "Banana liqueur in your own dessert is a power move.", 88, "surprised"),
    ],
  },
  {
    id: "avocado-gallery", author: "avocado", ago: "3d", minutes: 4100, kind: "gallery", mood: "happy", photos: ["field-avocado", "avocado", "d-guacamole"],
    text: "From the branch, to the board, to the molcajete. Three photographs, one career path.",
    sources: [W("Guacamole")],
    reactions: { like: 900, love: 300 }, reposts: 21,
    comments: [c("c1", "tomato", "3d", "Career path goals.", 44, "happy")],
  },
  {
    id: "pea-mendel", author: "pea", ago: "2h", minutes: 120, kind: "photo", mood: "proud", photo: "pea-plants",
    text: "A note from the archive. Between 1856 and 1863 Gregor Mendel grew some 28,000 plants at St Thomas's Abbey in Brno, most of them us, and followed seven of our traits from one generation to the next.\n\nHe published in 1866, and hardly anyone noticed until 1900. If your best work is going unread, give it thirty-four years.",
    reactions: { like: 1840, insightful: 960, celebrate: 210, funny: 140 }, reposts: 188,
    comments: [
      c("c1", "corn", "1h", "Generational talent.", 312, "happy"),
      c("c2", "tomato", "1h", "Seven traits! I can barely keep track of two classifications.", 204, "surprised"),
      c("c3", "peanut", "40m", "Proud to be a legume today.", 66, "proud"),
    ],
  },
  {
    id: "strawberry-poll", author: "strawberry", ago: "3h", minutes: 180, kind: "poll", mood: "curious",
    text: "Strawberry here: a fruit that isn't a berry, asking about a friend who is one. Tomato is botanically a berry, and the Supreme Court says vegetable. Settle it for us.",
    poll: { question: "What is a tomato?", options: [{ label: "A fruit: ask any botanist", votes: 1204 }, { label: "A vegetable: ask the Supreme Court", votes: 688 }, { label: "Both, depending on the room", votes: 1530 }, { label: "A sauce in waiting", votes: 412 }], left: "3d left" },
    reactions: { like: 640, funny: 410, insightful: 96 }, reposts: 52,
    comments: [
      c("c1", "tomato", "2h", "Both, and I have the paperwork.", 288, "cheeky"),
      c("c2", "pumpkin", "2h", "Also a berry, also served for dinner. Following this one closely.", 140, "curious"),
      c("c3", "rhubarb", "1h", "I'm the reverse: no fruit at all, served for pudding. Happy to compare notes.", 97, "cheeky"),
    ],
  },
  {
    id: "banana-succession", author: "banana", ago: "5h", minutes: 300, kind: "text", mood: "worried",
    text: "Every top banana is somebody's successor. Gros Michel had the job until Panama disease devastated it, and I took over.\n\nNow a strain called TR4 threatens me, and no fungicide works against it. Breeders are looking for what comes next, and I'm cheering them on. Nobody is irreplaceable, so plan for it.",
    reactions: { like: 2210, insightful: 1080, support: 420 }, reposts: 310,
    comments: [
      c("c1", "kiwi", "4h", "Successions and rebrands: the produce aisle is all change.", 120, "surprised"),
      c("c2", "pea", "3h", "Genetic diversity is a good plan. Speaking from experience.", 211, "proud"),
    ],
  },
  {
    id: "pumpkin-october", author: "pumpkin", ago: "7h", minutes: 420, kind: "photo", mood: "happy", photo: "pumpkins",
    text: "It's October, and my calendar is full.\n\nJack-o'-lanterns were carved from turnips in Ireland and Scotland before pumpkins got the job, and I'd like to thank the turnip for its years of service. Our heaviest yet: 1,246.9 kg, in October 2023. No pressure, anyone.",
    reactions: { like: 1530, celebrate: 402, funny: 230, love: 96 }, reposts: 64,
    comments: [
      c("c1", "watermelon", "6h", "Respect, from one pepo to another.", 88, "proud"),
      c("c2", "corn", "5h", "That's my sister.", 120, "happy"),
    ],
  },
  {
    id: "avocado-100", author: "avocado", ago: "9h", minutes: 540, kind: "milestone", mood: "proud",
    text: "One hundred years ago, in 1926, Rudolph Hass, a mail carrier in La Habra Heights, California, planted the seed that grew into my mother tree. He patented it in 1935, and every commercial Hass tree comes from it. Today: toast.",
    milestone: { title: "Celebrating 100 years", detail: "Since the mother tree was planted, La Habra Heights, 1926" },
    reactions: { like: 3100, celebrate: 1460, love: 512 }, reposts: 140,
    comments: [
      c("c1", "tomato", "8h", "Happy centenary! Saving you a spot in the salad.", 160, "happy"),
      c("c2", "chili", "8h", "Guacamole's on us.", 230, "cheeky"),
    ],
  },
  {
    id: "kiwi-rebrand", author: "kiwi", ago: "1d", minutes: 1440, kind: "photo", mood: "cheeky", photo: "field-kiwi",
    text: "Personal branding, a case study. Until 1959 I was the Chinese gooseberry. That year the New Zealand exporter Turners & Growers adopted the name kiwifruit, on Norman Sondag's advice.\n\nSame fruit, same fuzz, new name. If you're thinking about a rebrand, I recommend it.",
    reactions: { like: 980, insightful: 412, celebrate: 120 }, reposts: 77,
    comments: [
      c("c1", "strawberry", "20h", "And here I am, still called a berry.", 190, "worried"),
      c("c2", "peach", "18h", "The fuzz is the brand. Never change it.", 141, "proud"),
    ],
  },
  {
    id: "chili-scoville", author: "chili", ago: "1d", minutes: 1500, kind: "text", mood: "cheeky",
    text: "1912: Wilbur Scoville, a pharmacist, devises a way to measure the heat of peppers.\n\n2026: still being measured by it. It's the capsaicin that does it. Nothing personal.",
    reactions: { like: 820, funny: 310, insightful: 140 }, reposts: 31,
    comments: [
      c("c1", "tomato", "22h", "Salsa's not the same without you.", 70, "happy"),
      c("c2", "watermelon", "20h", "I'm 91% water and even I can't help.", 214, "surprised"),
    ],
  },
  {
    id: "kale-frost", author: "kale", ago: "1d", minutes: 1620, kind: "event", mood: "proud",
    text: "I get sweeter after a heavy frost, and I can take −15 °C. Join me after the first hard frost of the year and taste the difference. Wrap up warm. I won't.",
    event: { title: "First Frost Tasting", when: "The first night below freezing", place: "Kitchen gardens, everywhere", going: 212 },
    reactions: { like: 410, love: 66, funny: 40 }, reposts: 12,
    comments: [
      c("c1", "brussels", "1d", "I'll be there, also sweeter, also in a scarf.", 52, "happy"),
      c("c2", "cauliflower", "1d", "Count me in, quietly.", 18, "sleepy"),
    ],
  },
  {
    id: "carrot-myth", author: "carrot", ago: "2d", minutes: 2880, kind: "text", mood: "surprised",
    text: "Myth-busting Monday. I'm orange because Dutch growers bred me that way, in the Netherlands, in the 16th or 17th century.\n\nThe story that it was done to honour the House of Orange is a popular claim, and only that. Before, carrots came in white, yellow, red, purple and black, and the heirlooms still do.",
    reactions: { like: 1240, insightful: 690, celebrate: 88 }, reposts: 101,
    comments: [
      c("c1", "orange", "2d", "We've both done a lot for orange.", 140, "proud"),
      c("c2", "potato", "2d", "Purple carrots! Purple potatoes! We should talk.", 61, "surprised"),
    ],
  },
  {
    id: "broccoli-family", author: "broccoli", ago: "2d", minutes: 3000, kind: "photo", mood: "happy", photo: "field-broccoli",
    text: "Family photo, more or less. Cabbage, kale, cauliflower, Brussels sprouts, kohlrabi, collards, gai lan and me: one species, Brassica oleracea, bred apart from a single plant first cultivated in the eastern Mediterranean.\n\nFamily reunions take a while.",
    reactions: { like: 760, love: 140, funny: 120 }, reposts: 30,
    comments: [
      c("c1", "kale", "2d", "Save me a seat next to Cabbage.", 66, "happy"),
      c("c2", "brussels", "2d", "I'll bring the Christmas dinner.", 49, "happy"),
      c("c3", "cauliflower", "1d", "Here, quietly.", 21, "sleepy"),
    ],
  },
  {
    id: "orange-colour", author: "orange", ago: "3d", minutes: 4320, kind: "photo", mood: "cheeky", photo: "field-orange",
    text: "A small reminder that the colour was named after the fruit. Not the other way round.\n\nEarliest written mention of the sweet orange: Chinese literature, 314 BC. We've been at this a while.",
    reactions: { like: 1980, funny: 402, celebrate: 160 }, reposts: 88,
    comments: [
      c("c1", "carrot", "3d", "Respectfully, I've done a lot of the heavy lifting since.", 230, "cheeky"),
      c("c2", "lemon", "3d", "Proud of you, cousin.", 40, "proud"),
    ],
  },
  {
    id: "brussels-letter", author: "brussels", ago: "3d", minutes: 4400, kind: "text", mood: "worried",
    text: "An open letter to everyone who left me on the plate as a child.\n\nI may have been grown near Brussels as early as the 13th century, and I've had a long time to think about it. Roast me with a little oil. We can start again.",
    reactions: { like: 2400, support: 980, funny: 610, love: 300 }, reposts: 240,
    comments: [
      c("c1", "kale", "3d", "Proud of you, cousin. Technically sibling. Technically the same species.", 410, "cheeky"),
      c("c2", "tomato", "3d", "Second chances are my whole personality. Welcome.", 120, "happy"),
    ],
  },
  {
    id: "lemon-lind", author: "lemon", ago: "4d", minutes: 5760, kind: "photo", mood: "proud", photo: "field-lemon",
    text: "1747: James Lind tests remedies for scurvy on sailors, and lemon juice is one of them. Back your work with evidence, and when life gives you a trial, show up.",
    reactions: { like: 640, insightful: 320, celebrate: 77 }, reposts: 19,
    comments: [
      c("c1", "orange", "4d", "Team effort.", 52, "happy"),
      c("c2", "grapefruit", "4d", "Very proud. Please don't take me with your medicines.", 88, "worried"),
    ],
  },
  {
    id: "potato-flower", author: "potato", ago: "5d", minutes: 7200, kind: "photo", mood: "happy", photo: "potato-flower",
    text: "People forget we potatoes flower at all. Mine are out this week.\n\nReminder that I'm a stem tuber, not a root, and that I was domesticated in southern Peru and northwestern Bolivia 7,000 to 10,000 years ago. Long career, few complaints.",
    reactions: { like: 1104, love: 240, celebrate: 96 }, reposts: 22,
    comments: [
      c("c1", "tomato", "5d", "Family resemblance in the flowers. Lovely.", 31, "happy"),
      c("c2", "eggplant", "4d", "Nightshade looks good on you.", 27, "cheeky"),
    ],
  },
  {
    id: "pineapple-wealth", author: "pineapple", ago: "5d", minutes: 7400, kind: "photo", mood: "sleepy", photo: "field-pineapple",
    text: "Career retrospective. In 17th- and 18th-century Europe, growing one of me took a heated hothouse and a great deal of money, so I became a symbol of wealth, more often displayed at dinner parties than eaten.\n\nToday I'm on pizza. It's been quite a journey, and I regret nothing.",
    reactions: { like: 1210, funny: 680, celebrate: 140 }, reposts: 56,
    comments: [
      c("c1", "tomato", "5d", "There's always room on the pizza.", 240, "cheeky"),
      c("c2", "strawberry", "4d", "My species name means you. Huge fan.", 140, "happy"),
    ],
  },
  {
    id: "eggplant-names", author: "eggplant", ago: "6d", minutes: 8640, kind: "photo", mood: "curious", photo: "market",
    text: "Three names, one berry: eggplant, aubergine, brinjal.\n\nDomesticated twice, in South Asia and in East Asia, and still absorbing everything around me, oil and flavour included. Lifelong learner.",
    reactions: { like: 520, love: 98, insightful: 75 }, reposts: 8,
    comments: [c("c1", "chili", "6d", "Curry night?", 31, "curious")],
  },
  {
    id: "peach-persia", author: "peach", ago: "1w", minutes: 10080, kind: "text", mood: "happy",
    text: "Feeling peachy. I was domesticated in Zhejiang as early as 6000 BCE, China grows nearly two thirds of the world's peaches and nectarines, and my scientific name says Persia anyway.\n\nNectarines are the same species as me, without the fuzz. Family is family, fuzz or no fuzz.",
    reactions: { like: 1400, love: 420, funny: 160 }, reposts: 61,
    comments: [
      c("c1", "kiwi", "1w", "Fuzz solidarity.", 120, "proud"),
      c("c2", "strawberry", "6d", "Rose family forever.", 95, "happy"),
    ],
  },
  {
    id: "tomato-both", author: "tomato", ago: "1w", minutes: 10200, kind: "photo", mood: "cheeky", photo: "field-tomato",
    text: "Professional update: still a fruit, still a vegetable.\n\nSince the Supreme Court's unanimous decision of 10 May 1893, I've been a vegetable for tariff purposes, because I'm served at dinner, not dessert. Botanically, I'm a berry. I'm open to roles in any kitchen that can hold both of those thoughts at once.",
    reactions: { like: 2600, celebrate: 640, funny: 480 }, reposts: 150,
    comments: [
      c("c1", "potato", "1w", "Proud to share a family with you.", 96, "proud"),
      c("c2", "strawberry", "6d", "A berry! Lucky you.", 140, "surprised"),
    ],
  },
];

export const NEWS = [
  { title: "Hass avocado's mother tree turns 100", ago: "2h ago", readers: 6120 },
  { title: "Breeders look for the banana after Cavendish", ago: "5h ago", readers: 4382 },
  { title: "Giant pumpkin season opens", ago: "1d ago", readers: 2907 },
  { title: "Pea's scientific name remains disputed", ago: "1d ago", readers: 1116 },
  { title: "Kale gardens brace for first frost", ago: "3d ago", readers: 812 },
  { title: "The tomato is still a vegetable, for tariffs", ago: "4d ago", readers: 1964 },
];

export const SUGGESTIONS = ["kiwi", "watermelon", "brussels"];

/** Who the signed-in member is connected to; everyone else is a second- or third-degree connection. */
export const CONNECTED = new Set(["potato", "eggplant", "chili", "carrot", "broccoli", "kale", "banana", "strawberry", "avocado", "lemon", "orange", "pea", "corn", "pumpkin", "pineapple", "peach"]);
/** Second-degree: someone a connection knows. */
export const SECOND = new Set(["kiwi", "watermelon", "brussels", "cauliflower", "peanut", "rhubarb", "pepper"]);
export const degree = (id: string) => (id === ME ? "" : CONNECTED.has(id) ? "1st" : SECOND.has(id) ? "2nd" : "3rd+");
/** Followed at the start: every connection, and nobody else. */
export const followedAtStart = (id: string) => CONNECTED.has(id);

/** Photographs a member may attach to a new post. */
export const STOCK = ["market", "market-roots", "pumpkin-varieties", "watermelon-slices", "frost-kale", "field-potato"];
/** Photographs a member may choose for a cover. */
export const COVERS = ["field-tomato", "potato-flower", "market", "pumpkin-varieties", "watermelon-slices", "field-corn"];

export type AssessmentId = "botany" | "brassicas" | "nightshades" | "citrus" | "history";
export interface Question { q: string; options: string[]; answer: number; why: string; source: string }
export interface Assessment { id: AssessmentId; skill: string; blurb: string; icon: "leaf" | "floret" | "berry" | "segment" | "scroll"; questions: Question[] }

export const ASSESSMENTS: Assessment[] = [
  {
    id: "botany", skill: "Botany", icon: "leaf",
    blurb: "Berries that aren't, nuts that aren't and a tuber that isn't a root: what a fruit or vegetable is to a botanist.",
    questions: [
      { q: "Botanically, a tomato is:", options: ["A vegetable", "A berry", "A drupe", "A legume"], answer: 1, why: "The tomato is an edible berry that is eaten as a vegetable.", source: W("Tomato") },
      { q: "Which of these is not a berry, botanically?", options: ["Banana", "Grape", "Strawberry", "Eggplant"], answer: 2, why: "The strawberry is an aggregate accessory fruit, and each seed on its outside is an achene, a fruit of its own.", source: W("Garden_strawberry") },
      { q: "A peach is:", options: ["A berry", "A drupe", "A pome", "A pepo"], answer: 1, why: "Peaches are stone fruits, more formally called drupes.", source: W("Peach") },
      { q: "A peanut is:", options: ["A tree nut", "A legume", "A drupe", "A tuber"], answer: 1, why: "Despite the name, the peanut is a legume, and like other legumes it fixes nitrogen.", source: W("Peanut") },
      { q: "A watermelon is botanically:", options: ["A pepo", "A drupe", "A pome", "An achene"], answer: 0, why: "A pepo is a berry with a hard rind. Pumpkins and cucumbers are pepos too.", source: W("Watermelon") },
      { q: "The part of the potato we eat is:", options: ["A root", "A stem tuber", "A bulb", "A fruit"], answer: 1, why: "The potato is a stem tuber, a swollen underground stem.", source: W("Potato") },
    ],
  },
  {
    id: "brassicas", skill: "Brassicas", icon: "floret",
    blurb: "Broccoli, kale, cauliflower, Brussels sprouts and their many relations: one species, bred apart.",
    questions: [
      { q: "Broccoli, cauliflower, kale and Brussels sprouts all belong to which species?", options: ["Brassica oleracea", "Brassica rapa", "Daucus carota", "Solanum tuberosum"], answer: 0, why: "They are all cultivars of Brassica oleracea, with cabbage, kohlrabi, collards and gai lan.", source: W("Brassica_oleracea") },
      { q: "Calabrese broccoli is named after:", options: ["Calabria", "Catalonia", "Calais", "Calabar"], answer: 0, why: "Calabrese takes its name from Calabria, in southern Italy.", source: W("Broccoli") },
      { q: "The edible white head of a cauliflower is called:", options: ["The curd", "The whey", "The heart", "The bulb"], answer: 0, why: "The head is called the curd.", source: W("Cauliflower") },
      { q: "Kale tastes sweeter after:", options: ["A heavy frost", "A dry summer", "A long boil", "A week in the fridge"], answer: 0, why: "Kale is sweeter after a heavy frost, and can survive down to about −15 °C.", source: W("Kale") },
      { q: "Brussels sprouts may have been grown near Brussels as early as:", options: ["The 13th century", "The 17th century", "The 19th century", "The 1950s"], answer: 0, why: "They may have been grown in what is now Belgium as early as the 13th century, which gave them their name.", source: W("Brussels_sprout") },
      { q: "Where was Brassica oleracea first cultivated?", options: ["The eastern Mediterranean", "Northern China", "The Andes", "West Africa"], answer: 0, why: "Its many cultivars were bred from a plant first cultivated in the eastern Mediterranean.", source: W("Brassica_oleracea") },
    ],
  },
  {
    id: "nightshades", skill: "Nightshades", icon: "berry",
    blurb: "Tomatoes, potatoes, eggplants and peppers: the family Solanaceae, from the Andes to the Supreme Court.",
    questions: [
      { q: "Which of these is not in the nightshade family?", options: ["Tomato", "Potato", "Eggplant", "Carrot"], answer: 3, why: "The carrot belongs to the Apiaceae. Tomato, potato, eggplant and peppers are all Solanaceae.", source: W("Solanaceae") },
      { q: "In which case did the Supreme Court of the United States treat the tomato as a vegetable?", options: ["Nix v. Hedden", "Marbury v. Madison", "Gibbons v. Ogden", "McCulloch v. Maryland"], answer: 0, why: "In Nix v. Hedden, decided unanimously on 10 May 1893, the Court held that tomatoes were vegetables under the Tariff Act of 1883.", source: W("Nix_v._Hedden") },
      { q: "The heat of a chili pepper comes from:", options: ["Capsaicin", "Lycopene", "Caffeine", "Chlorophyll"], answer: 0, why: "Capsaicin gives chili peppers their heat. Lycopene is what turns a ripe tomato red.", source: W("Chili_pepper") },
      { q: "Who devised the Scoville test, in 1912?", options: ["A pharmacist, Wilbur Scoville", "A chef in Mexico City", "A botanist at Kew", "A brewer in Texas"], answer: 0, why: "Wilbur Scoville, a pharmacist, devised the test in 1912, and its units are named after him.", source: W("Scoville_scale") },
      { q: "Where was the potato domesticated?", options: ["Southern Peru and northwestern Bolivia", "Ireland", "Southern Mexico", "Northeastern India"], answer: 0, why: "It was domesticated there between 7,000 and 10,000 years ago, and reached Europe with the Spanish in the second half of the 16th century.", source: W("Potato") },
      { q: "The eggplant is also called:", options: ["Aubergine and brinjal", "Courgette and zucchini", "Okra and gumbo", "Swede and rutabaga"], answer: 0, why: "Aubergine and brinjal are both names for the eggplant, which is botanically a berry.", source: W("Eggplant") },
    ],
  },
  {
    id: "citrus", skill: "Citrus", icon: "segment",
    blurb: "Lemons, oranges and grapefruit: who crossed with whom, where, and what a pharmacist might ask.",
    questions: [
      { q: "The lemon is a hybrid of:", options: ["Citron and bitter orange", "Pomelo and mandarin", "Lime and grapefruit", "Kumquat and orange"], answer: 0, why: "The lemon is a hybrid of citron and bitter orange, from northeastern India.", source: W("Lemon") },
      { q: "The sweet orange is a hybrid of:", options: ["Mandarin and pomelo", "Citron and lime", "Lemon and grapefruit", "Bitter orange and kumquat"], answer: 0, why: "The orange is a hybrid of mandarin and pomelo.", source: W("Orange_(fruit)") },
      { q: "Where did the grapefruit originate?", options: ["Barbados", "Spain", "Florida", "Southern China"], answer: 0, why: "The grapefruit originated in Barbados in the 18th century, as a cross of sweet orange and pomelo.", source: W("Grapefruit") },
      { q: "James Lind's trial of 1747 tested remedies for:", options: ["Scurvy", "Malaria", "Cholera", "Gout"], answer: 0, why: "Lind tested remedies for scurvy among sailors, lemon juice among them.", source: W("Lemon") },
      { q: "Why might a pharmacist ask whether you eat grapefruit?", options: ["It interacts with many medicines", "It is high in caffeine", "It thins the blood by itself", "It is a common allergen"], answer: 0, why: "Grapefruit interacts with a good many drugs, which is why the question is asked.", source: W("Grapefruit") },
      { q: "Which came first, the colour orange or the fruit's name?", options: ["The fruit: the colour was named after it", "The colour: the fruit was named after it", "They were named in the same year", "Neither: both come from Latin aurum"], answer: 0, why: "The colour was named after the fruit.", source: W("Orange_(fruit)") },
    ],
  },
  {
    id: "history", skill: "Food History", icon: "scroll",
    blurb: "Mail carriers, monks, exporters and pharmacists: the people behind the produce aisle.",
    questions: [
      { q: "Rudolph Hass, who grew the mother tree of the Hass avocado, worked as:", options: ["A mail carrier", "A banker", "A botanist", "A ship's cook"], answer: 0, why: "Hass was a mail carrier. He planted the seeds in 1926 and patented the tree in 1935.", source: W("Hass_avocado") },
      { q: "Before 1959, the kiwifruit was usually called:", options: ["The Chinese gooseberry", "The hairy plum", "The New Zealand melon", "The Pacific lime"], answer: 0, why: "Turners & Growers adopted the name kiwifruit in 1959, on Norman Sondag's advice.", source: W("Kiwifruit") },
      { q: "Which banana did the Cavendish replace as the main export variety?", options: ["Gros Michel", "Lady Finger", "Plantain", "Red Dacca"], answer: 0, why: "Gros Michel was devastated by Panama disease, and the Cavendish took its place.", source: W("Cavendish_banana") },
      { q: "In which city did Gregor Mendel run his experiments on peas?", options: ["Brno", "Vienna", "Prague", "Kraków"], answer: 0, why: "Mendel worked at St Thomas's Abbey in Brno, from 1856 to 1863.", source: W("Gregor_Mendel") },
      { q: "Before pumpkins, jack-o'-lanterns in Ireland and Scotland were carved from:", options: ["Turnips", "Potatoes", "Apples", "Beets"], answer: 0, why: "Turnips were carved in Ireland and Scotland before the pumpkin took over the job.", source: W("Pumpkin") },
      { q: "Maize was domesticated from teosinte, about 9,000 years ago, in:", options: ["Southern Mexico", "Peru", "Egypt", "Northern China"], answer: 0, why: "Maize was domesticated by Indigenous peoples in southern Mexico about 9,000 years ago.", source: W("Maize") },
    ],
  },
];
export const assessment = (id: string) => ASSESSMENTS.find((a) => a.id === id);
/** Pass mark: the share of questions that must be right for the badge. */
export const PASS = 0.7;
/** Seconds per question when the timer is on. */
export const PER_QUESTION = 90;

export const HEADER_NAV = [
  { id: "home", label: "Home", icon: "home", href: PAGES.feed },
  { id: "network", label: "My Network", icon: "people", count: 3 },
  { id: "jobs", label: "Jobs", icon: "briefcase" },
  { id: "messaging", label: "Messaging", icon: "message", count: 2 },
  { id: "notifications", label: "Notifications", icon: "bell", count: 7 },
] as const;

export const RAIL_LINKS = ["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services"];

/**
 * The pages this study follows, by name. They are not linked from the pages:
 * they are shown only to members, behind the reference's sign-in, and a
 * lookalike that links to the service it imitates is what phishing scanners
 * look for (see CLAUDE.md, Safe Browsing remediation). The README links them.
 */
export const REFERENCE = {
  feed: { label: "the LinkedIn feed (signed-in home)" },
  profile: { label: "a LinkedIn member profile" },
  edit: { label: "editing one's own LinkedIn profile" },
  settings: { label: "LinkedIn's Settings & Privacy" },
  assessments: { label: "LinkedIn's Skill Assessments, retired in 2023" },
};
