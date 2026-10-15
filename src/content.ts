/**
 * Every member, post, comment and question in the study. The members are
 * characters from Quentin Tarantino's films, under their own names, each
 * given the profile a professional network would ask of them: a headline, an
 * About, the work they held and the skills it took. What the films establish
 * (a job, a place, a turn in the story) is kept; the rest is new writing in
 * the study's own words, and no line of any film is quoted. Each member's
 * dates run in the years of their own film, so a profile's "Present" is that
 * film's year. Nothing is sent anywhere; what a reader changes stays in the
 * browser.
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
export const ME = "jackie";

export type FilmId = "rd" | "pf" | "jb" | "kb" | "dp" | "ib" | "ouatih" | "h8";
export const FILMS: Record<FilmId, { title: string; year: number; source: string }> = {
  rd: { title: "Reservoir Dogs", year: 1992, source: "https://en.wikipedia.org/wiki/Reservoir_Dogs" },
  pf: { title: "Pulp Fiction", year: 1994, source: "https://en.wikipedia.org/wiki/Pulp_Fiction" },
  jb: { title: "Jackie Brown", year: 1997, source: "https://en.wikipedia.org/wiki/Jackie_Brown" },
  kb: { title: "Kill Bill: Volume 1 and Volume 2", year: 2003, source: "https://en.wikipedia.org/wiki/Kill_Bill:_Volume_2" },
  dp: { title: "Death Proof", year: 2007, source: "https://en.wikipedia.org/wiki/Death_Proof" },
  ib: { title: "Inglourious Basterds", year: 2009, source: "https://en.wikipedia.org/wiki/Inglourious_Basterds" },
  ouatih: { title: "Once Upon a Time in Hollywood", year: 2019, source: "https://en.wikipedia.org/wiki/Once_Upon_a_Time_in_Hollywood" },
  h8: { title: "The Hateful Eight", year: 2015, source: "https://en.wikipedia.org/wiki/The_Hateful_Eight" },
};

export interface Role { title: string; company: string; type?: string; start: number; end?: number; place?: string; text?: string }
export interface School { school: string; field: string; years?: string }
export interface Skill { name: string; endorsements: number; by?: string[]; assessment?: AssessmentId }
export interface Rec { from: string; relation: string; text: string }
export interface Member {
  id: string;
  first: string;
  last: string;
  pronouns?: string;
  headline: string;
  place: string;
  about: string;
  /** The year the member's profile stands in: the year of their film's story. */
  year: number;
  film: FilmId;
  /** The avatar's ground. */
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
  /** A member who keeps a name off things: the profile shows only what the member allows. */
  limited?: boolean;
}

export const MEMBERS: Member[] = [
  {
    id: "jackie", first: "Jackie", last: "Brown", pronouns: "She/Her", year: 1997, film: "jb", color: "#7a3e9d", cover: "lax",
    headline: "Flight Attendant at Cabo Air · Cabin service, safety and international routes",
    place: "Los Angeles, California",
    about: "Flight attendant on the Los Angeles to Mexico route. On every flight I look after a full cabin: the safety briefing, the service, the customs paperwork, and the passengers who need more help than most. I keep calm when a day goes sideways and I plan three moves ahead. I'm planning a move to Madrid and I'm open to cabin crew and guest-service roles in Europe.",
    roles: [
      { title: "Flight Attendant", company: "Cabo Air", type: "Full-time", start: 1993, place: "Los Angeles, California", text: "Cabin service and safety on scheduled flights between Los Angeles and Mexico. Pre-flight checks, service, duty-free and customs declarations, and care of passengers travelling alone." },
    ],
    skills: [
      { name: "Customer Service", endorsements: 58, by: ["max", "ray"] },
      { name: "Negotiation", endorsements: 24, by: ["max"] },
      { name: "In-flight Safety", endorsements: 31, by: ["ray"] },
      { name: "Spanish", endorsements: 12, assessment: "spanish" },
      { name: "Planning", endorsements: 9 },
    ],
    languages: [["English", "Native or bilingual proficiency"], ["Spanish", "Professional working proficiency"]],
    connections: 412, followers: 455,
    open: { titles: ["Flight Attendant", "Cabin Crew Purser", "Guest Services Manager"], places: ["Los Angeles, California", "Madrid, Spain"], types: ["Full-time"] },
    recs: [
      { from: "max", relation: "Max worked with Jackie but they were at different companies", text: "I've written bail for a great many people in nineteen years. Jackie is the one I'd trust to keep her word, and the one who has thought three moves ahead before anyone else has thought of one." },
      { from: "ray", relation: "Ray worked with Jackie but they were at different companies", text: "Jackie is calm under pressure and exact about the details. I watched her manage a complicated handover at a busy shopping mall without raising her voice. Any airline would be lucky to have her." },
    ],
  },
  {
    id: "max", first: "Max", last: "Cherry", pronouns: "He/Him", year: 1997, film: "jb", color: "#3b6e8f",
    headline: "Owner, Max Cherry Bail Bonds · Nineteen years writing bail in Los Angeles",
    place: "Los Angeles, California",
    about: "I've written bail bonds in Los Angeles for nineteen years. A bond is a promise that someone will come back to court, and my job is to judge who will keep it. Most people do. Lately I've been thinking about what comes after this work.",
    roles: [{ title: "Owner", company: "Max Cherry Bail Bonds", type: "Self-employed", start: 1978, place: "Los Angeles, California", text: "Bail bonds for clients across Los Angeles County: underwriting, court dates, collateral and the occasional long night." }],
    skills: [
      { name: "Bail Bonds", endorsements: 44, by: ["jackie"] },
      { name: "Risk Assessment", endorsements: 27, by: ["ray"] },
      { name: "Courtroom Procedure", endorsements: 19 },
      { name: "Customer Service", endorsements: 12, by: ["jackie"] },
    ],
    languages: [["English", "Native or bilingual proficiency"]],
    connections: 238, followers: 241,
    recs: [{ from: "jackie", relation: "Jackie worked with Max but they were at different companies", text: "Max listens before he decides, and he tells you the truth even when it costs him. The most honest man in a business that doesn't expect it." }],
  },
  {
    id: "ray", first: "Ray", last: "Nicolette", pronouns: "He/Him", year: 1997, film: "jb", color: "#4d5b6b",
    headline: "Special Agent, Bureau of Alcohol, Tobacco and Firearms · Los Angeles field office",
    place: "Los Angeles, California",
    about: "Federal agent in Los Angeles working firearms trafficking cases with local police. Interested in interagency work, surveillance and the careful building of a case.",
    roles: [{ title: "Special Agent", company: "Bureau of Alcohol, Tobacco and Firearms", type: "Full-time", start: 1990, place: "Los Angeles, California", text: "Firearms trafficking investigations with the Los Angeles Police Department; surveillance, interviews and evidence." }],
    skills: [
      { name: "Investigations", endorsements: 52 },
      { name: "Surveillance", endorsements: 33 },
      { name: "Interviewing", endorsements: 21, by: ["jackie"] },
    ],
    connections: 301, followers: 318,
  },
  {
    id: "jules", first: "Jules", last: "Winnfield", pronouns: "He/Him", year: 1994, film: "pf", color: "#8a5a2b", cover: "desert",
    headline: "Between roles · Leaving Los Angeles to travel and decide what comes next",
    place: "Los Angeles, California",
    about: "Ten years with one employer in Los Angeles taught me composure, and how to talk a room down. After a morning that changed my mind about the work, I'm stepping away to travel and to work out what I'm meant to do next.",
    careerBreak: "Travel",
    roles: [{ title: "Associate", company: "Marsellus Wallace", type: "Full-time", start: 1984, end: 1994, place: "Los Angeles, California", text: "Field work for a private employer: collections, deliveries and the recovery of a client's property. Known for keeping difficult conversations short." }],
    skills: [
      { name: "Public Speaking", endorsements: 63, by: ["vincent", "wolfe"] },
      { name: "Conflict De-escalation", endorsements: 48, by: ["wolfe"] },
      { name: "Driving", endorsements: 12 },
    ],
    connections: 188, followers: 1240,
    recs: [{ from: "wolfe", relation: "Winston worked with Jules but they were at different companies", text: "When I arrived, Jules had already done the hard part: he had kept everyone calm. He takes direction, he asks good questions, and he means what he says." }],
  },
  {
    id: "vincent", first: "Vincent", last: "Vega", pronouns: "He/Him", year: 1994, film: "pf", color: "#2f3e46", cover: "amsterdam",
    headline: "Associate at Marsellus Wallace · Back in Los Angeles after three years in Amsterdam",
    place: "Los Angeles, California",
    about: "Back in Los Angeles after three years in Amsterdam, and still noticing the small differences. I enjoy good restaurants, long conversations about them, and dancing when the music is right.",
    roles: [
      { title: "Associate", company: "Marsellus Wallace", type: "Full-time", start: 1994, place: "Los Angeles, California" },
      { title: "Associate", company: "Marsellus Wallace", type: "Full-time", start: 1991, end: 1994, place: "Amsterdam, Netherlands", text: "Three years in Amsterdam on the employer's European business." },
    ],
    skills: [
      { name: "Dance", endorsements: 41, by: ["mia"] },
      { name: "European Travel", endorsements: 18 },
      { name: "Client Relations", endorsements: 9, by: ["jules"] },
    ],
    connections: 207, followers: 233,
  },
  {
    id: "mia", first: "Mia", last: "Wallace", pronouns: "She/Her", year: 1994, film: "pf", color: "#111111", cover: "tvcamera",
    headline: "Actress · Fox Force Five (television pilot)",
    place: "Los Angeles, California",
    about: "Actress. In Fox Force Five, a pilot about a team of five women secret agents, I played the team's knife expert, who also knew a great many old jokes. The pilot wasn't picked up. I'm back at auditions, and I'm still telling the jokes.",
    roles: [{ title: "Actress", company: "Fox Force Five (television pilot)", type: "Contract", start: 1993, end: 1993, place: "Los Angeles, California", text: "Series regular in the pilot: one of five agents, the knife expert, and the comic relief." }],
    skills: [
      { name: "Acting", endorsements: 56, by: ["vincent"] },
      { name: "Comedy", endorsements: 22 },
      { name: "Dance", endorsements: 19, by: ["vincent"] },
    ],
    connections: 344, followers: 2210,
  },
  {
    id: "butch", first: "Butch", last: "Coolidge", pronouns: "He/Him", year: 1994, film: "pf", color: "#6b2d2d", cover: "watch",
    headline: "Professional boxer, retired · Leaving Los Angeles",
    place: "Los Angeles, California",
    about: "Professional boxer. My last fight was my last fight. I'm leaving Los Angeles with Fabienne to start again somewhere quieter, and my father's gold watch is coming with me.",
    roles: [{ title: "Professional Boxer", company: "Self-employed", type: "Self-employed", start: 1980, end: 1994, place: "Los Angeles, California", text: "Professional bouts across California. Retired after a final fight in 1994." }],
    skills: [
      { name: "Boxing", endorsements: 77 },
      { name: "Endurance", endorsements: 30 },
      { name: "Motorcycle Riding", endorsements: 9 },
    ],
    connections: 156, followers: 980,
  },
  {
    id: "wolfe", first: "Winston", last: "Wolfe", pronouns: "He/Him", year: 1994, film: "pf", color: "#1f3b2d", cover: "lasky",
    headline: "Problem solver · Independent consultant, Los Angeles",
    place: "Los Angeles, California",
    about: "I solve problems, quickly. Clients call me when time matters more than anything else. I arrive with a plan, give clear instructions once, and leave the place as I found it, or cleaner.",
    roles: [{ title: "Independent Consultant", company: "Self-employed", type: "Self-employed", start: 1975, place: "Los Angeles, California", text: "Crisis response for private clients. Typical engagement: under one hour." }],
    skills: [
      { name: "Crisis Management", endorsements: 98, by: ["jules", "vincent"] },
      { name: "Time Management", endorsements: 64, by: ["jules"] },
      { name: "Clear Communication", endorsements: 40 },
    ],
    connections: 500, followers: 12400,
    recs: [{ from: "jules", relation: "Jules was a client of Winston's", text: "He was there faster than he said he'd be, told us exactly what to do and in what order, and was polite about all of it. I'd call him again." }],
  },
  {
    id: "pink", first: "Mr.", last: "Pink", year: 1992, film: "rd", color: "#c2185b", limited: true,
    headline: "Professional · Prefers to work under an alias",
    place: "Los Angeles, California",
    about: "I keep my name off things. Happy to talk about diners, coffee and the economics of the tip.",
    roles: [{ title: "Specialist", company: "Self-employed", type: "Freelance", start: 1985, place: "Los Angeles, California" }],
    skills: [{ name: "Negotiation", endorsements: 8 }, { name: "Punctuality", endorsements: 5 }],
    connections: 31, followers: 412,
  },
  {
    id: "beatrix", first: "Beatrix", last: "Kiddo", pronouns: "She/Her", year: 2004, film: "kb", color: "#d4a017", cover: "okinawa",
    headline: "Career break: parenting · Martial arts, swordsmanship and finishing what I start",
    place: "El Paso, Texas",
    about: "After four years away I'm spending this time with my daughter. I trained in martial arts in China under a demanding teacher, and I take on hard problems and see them through to the end.",
    careerBreak: "Parenting",
    roles: [{ title: "Field Operative", company: "An international team led by Bill", type: "Full-time", start: 1993, end: 1999, place: "Worldwide", text: "Left the team in 1999 to start a family." }],
    schools: [{ school: "The temple of Pai Mei", field: "Martial arts", years: "Training under Pai Mei" }],
    skills: [
      { name: "Martial Arts", endorsements: 88, by: ["hanzo"] },
      { name: "Swordsmanship", endorsements: 61, by: ["hanzo"] },
      { name: "Persistence", endorsements: 45 },
    ],
    languages: [["English", "Native or bilingual proficiency"], ["Japanese", "Limited working proficiency"], ["Mandarin", "Elementary proficiency"]],
    connections: 64, followers: 5300,
    recs: [{ from: "hanzo", relation: "Hanzō worked with Beatrix but they were at different companies", text: "She came a long way and asked for something I had sworn never to make again. I made it, and I do not regret it." }],
  },
  {
    id: "hanzo", first: "Hattori", last: "Hanzō", pronouns: "He/Him", year: 2003, film: "kb", color: "#37474f", cover: "katana",
    headline: "Owner and chef, a sushi bar in Okinawa · Retired swordsmith",
    place: "Okinawa, Japan",
    about: "I run a small sushi bar in Okinawa. For many years I made swords, and then I vowed to make no more. I kept that vow until a visitor gave me a reason to make one last sword, the finest I have made.",
    roles: [
      { title: "Owner and Chef", company: "Sushi bar, Okinawa", type: "Self-employed", start: 1975, place: "Okinawa, Japan" },
      { title: "Swordsmith", company: "Self-employed", type: "Self-employed", start: 1950, end: 1975, place: "Japan" },
    ],
    skills: [
      { name: "Swordsmithing", endorsements: 99, by: ["beatrix"] },
      { name: "Sushi", endorsements: 54 },
      { name: "Teaching", endorsements: 20 },
    ],
    languages: [["Japanese", "Native or bilingual proficiency"], ["English", "Professional working proficiency"]],
    connections: 42, followers: 8800,
  },
  {
    id: "kim", first: "Kim", last: "Mathis", pronouns: "She/Her", year: 2007, film: "dp", color: "#00796b", cover: "challenger",
    headline: "Stunt driver · Film and television",
    place: "Lebanon, Tennessee (on location)",
    about: "Stunt driver for film and television: precision driving, chases and car work. On location in Tennessee this month.",
    roles: [{ title: "Stunt Driver", company: "Freelance", type: "Freelance", start: 2001, place: "Los Angeles, California", text: "Precision and stunt driving on features and commercials." }],
    skills: [
      { name: "Stunt Driving", endorsements: 73, by: ["abernathy", "cliff"] },
      { name: "Precision Driving", endorsements: 41 },
      { name: "Vehicle Safety", endorsements: 22 },
    ],
    connections: 389, followers: 640,
  },
  {
    id: "abernathy", first: "Abernathy", last: "Ross", pronouns: "She/Her", year: 2007, film: "dp", color: "#ad1457", cover: "makeup",
    headline: "Makeup artist · Film and television",
    place: "Lebanon, Tennessee (on location)",
    about: "Makeup artist for film: character work, continuity, and the long days on set that both require.",
    roles: [{ title: "Makeup Artist", company: "Freelance", type: "Freelance", start: 2000, place: "Los Angeles, California" }],
    skills: [
      { name: "Makeup", endorsements: 66, by: ["kim"] },
      { name: "Continuity", endorsements: 31 },
      { name: "Special Effects Makeup", endorsements: 18 },
    ],
    connections: 276, followers: 302,
  },
  {
    id: "shosanna", first: "Shosanna", last: "Dreyfus", pronouns: "She/Her", year: 1944, film: "ib", color: "#b71c1c", cover: "cinema",
    headline: "Proprietor, Le Gamaar cinema, Paris · Known professionally as Emmanuelle Mimieux",
    place: "Paris, France",
    about: "I run a cinema in Paris with my projectionist, Marcel, and a collection of nitrate prints that we keep with great care. We programme what we love and keep the doors open.",
    roles: [{ title: "Proprietor", company: "Le Gamaar", type: "Self-employed", start: 1941, place: "Paris, France", text: "Programming, the box office and the running of a single-screen cinema." }],
    skills: [
      { name: "Cinema Management", endorsements: 39, by: ["marcel"] },
      { name: "Film Programming", endorsements: 27, by: ["hicox"] },
      { name: "Film Projection", endorsements: 14, by: ["marcel"], assessment: "projection" },
    ],
    languages: [["French", "Native or bilingual proficiency"], ["German", "Professional working proficiency"]],
    connections: 97, followers: 610,
    recs: [{ from: "marcel", relation: "Marcel reported directly to Shosanna", text: "She runs the house with courage and a clear head. I would follow her into any booth." }],
  },
  {
    id: "marcel", first: "Marcel", last: "", pronouns: "He/Him", year: 1944, film: "ib", color: "#4e342e", cover: "projector",
    headline: "Projectionist, Le Gamaar cinema, Paris",
    place: "Paris, France",
    about: "Projectionist. I run the booth, splice the reels and look after the prints, most of them on nitrate stock, which has to be handled with great care.",
    roles: [{ title: "Projectionist", company: "Le Gamaar", type: "Full-time", start: 1941, place: "Paris, France", text: "Two-projector booth: changeovers, splicing, print inspection and storage." }],
    skills: [
      { name: "Film Projection", endorsements: 44, by: ["shosanna"], assessment: "projection" },
      { name: "Film Splicing", endorsements: 21 },
      { name: "Print Inspection", endorsements: 12 },
    ],
    languages: [["French", "Native or bilingual proficiency"]],
    connections: 58, followers: 74,
  },
  {
    id: "hicox", first: "Archie", last: "Hicox", pronouns: "He/Him", year: 1944, film: "ib", color: "#5d4037", cover: "typewriter",
    headline: "Lieutenant, British Army · Film critic and author",
    place: "London, United Kingdom",
    about: "Before the war I wrote film criticism, and a book on the German director G. W. Pabst. I speak fluent German and I'm happy to talk about the silent cinema at any length.",
    roles: [
      { title: "Lieutenant", company: "British Army", type: "Full-time", start: 1939, place: "London, United Kingdom" },
      { title: "Film Critic", company: "Freelance", type: "Freelance", start: 1930, end: 1939, place: "London, United Kingdom", text: "Criticism for the film press, and a book on G. W. Pabst: Twenty-Four Frames into the Subconscious." },
    ],
    schools: [{ school: "University", field: "German" }],
    skills: [
      { name: "Film Criticism", endorsements: 36, by: ["shosanna"] },
      { name: "German", endorsements: 29 },
      { name: "Writing", endorsements: 25 },
    ],
    languages: [["English", "Native or bilingual proficiency"], ["German", "Full professional proficiency"]],
    connections: 211, followers: 1960,
  },
  {
    id: "bridget", first: "Bridget", last: "von Hammersmark", pronouns: "She/Her", year: 1944, film: "ib", color: "#6a1b9a", cover: "babelsberg",
    headline: "Actress · German cinema",
    place: "Berlin, Germany",
    about: "Actress in German film. Comfortable in front of a camera, in several languages and in a crowded room.",
    roles: [{ title: "Actress", company: "Freelance", type: "Freelance", start: 1932, place: "Berlin, Germany" }],
    skills: [{ name: "Acting", endorsements: 88 }, { name: "Languages", endorsements: 31 }, { name: "Discretion", endorsements: 17 }],
    languages: [["German", "Native or bilingual proficiency"], ["English", "Full professional proficiency"], ["Italian", "Limited working proficiency"]],
    connections: 470, followers: 15200,
  },
  {
    id: "rick", first: "Rick", last: "Dalton", pronouns: "He/Him", year: 1969, film: "ouatih", color: "#795548", cover: "hollywood",
    headline: "Actor · Jake Cahill in Bounty Law · Back from four pictures in Italy",
    place: "Los Angeles, California",
    about: "Actor. Jake Cahill on Bounty Law, guest roles across television westerns, and this year four pictures in Italy, the first a western, with a wife I met there. Represented by Marvin Schwarz.",
    roles: [
      { title: "Lead Actor", company: "Four pictures in Italy", type: "Contract", start: 1969, place: "Rome, Italy", text: "Six months in Italy: a western and three more pictures." },
      { title: "Guest Star", company: "Television", type: "Freelance", start: 1964, end: 1969, place: "Los Angeles, California", text: "Guest roles, most of them villains, on television westerns." },
      { title: "Lead Actor (Jake Cahill)", company: "Bounty Law", type: "Contract", start: 1959, end: 1963, place: "Los Angeles, California" },
    ],
    skills: [
      { name: "Acting", endorsements: 140, by: ["marvin", "cliff"] },
      { name: "Horse Riding", endorsements: 52, by: ["cliff"] },
      { name: "Westerns", endorsements: 47, assessment: "westerns" },
      { name: "Italian", endorsements: 6, assessment: "italian" },
    ],
    languages: [["English", "Native or bilingual proficiency"], ["Italian", "Elementary proficiency"]],
    connections: 500, followers: 22100,
    recs: [
      { from: "marvin", relation: "Marvin represented Rick", text: "Rick is a real professional and a better actor than he gives himself credit for. He took a risk on Italy, worked hard there, and came back with four pictures." },
      { from: "cliff", relation: "Cliff worked with Rick on the same team", text: "I doubled for Rick for years. He knows his lines, he hits his marks, and when a scene matters he gives it everything." },
    ],
  },
  {
    id: "cliff", first: "Cliff", last: "Booth", pronouns: "He/Him", year: 1969, film: "ouatih", color: "#33691e", cover: "karmannghia",
    headline: "Stunt performer · Stunt double, driver and right-hand man to Rick Dalton",
    place: "Los Angeles, California",
    about: "Stunt double, driver and assistant to Rick Dalton for years: fights, falls, horses and cars. War veteran. Looking for stunt work in Los Angeles. I live with my dog, Brandy.",
    roles: [{ title: "Stunt Double and Driver", company: "Rick Dalton", type: "Full-time", start: 1959, end: 1969, place: "Los Angeles, California", text: "Stunts for Bounty Law and Rick's later work; driving, errands and home repairs." }],
    skills: [
      { name: "Stunts", endorsements: 90, by: ["rick", "kim"] },
      { name: "Driving", endorsements: 77, by: ["rick"] },
      { name: "Dog Training", endorsements: 33 },
      { name: "Westerns", endorsements: 21, assessment: "westerns" },
    ],
    connections: 233, followers: 410,
    open: { titles: ["Stunt Performer", "Stunt Driver", "Stunt Coordinator"], places: ["Los Angeles, California"], types: ["Freelance", "Contract"] },
    recs: [{ from: "rick", relation: "Rick worked with Cliff on the same team", text: "The best stuntman in town and the best friend I have. I'd say so on any set." }],
  },
  {
    id: "marvin", first: "Marvin", last: "Schwarz", pronouns: "He/Him", year: 1969, film: "ouatih", color: "#1a237e",
    headline: "Agent, William Morris Agency · Representing actors in film and television",
    place: "Beverly Hills, California",
    about: "I represent actors. I watch a lot of their work, I tell them the truth about where their careers stand, and I show them where they could go next, including abroad.",
    roles: [{ title: "Agent", company: "William Morris Agency", type: "Full-time", start: 1955, place: "Beverly Hills, California" }],
    skills: [
      { name: "Talent Management", endorsements: 61, by: ["rick"] },
      { name: "Negotiation", endorsements: 55 },
      { name: "International Co-production", endorsements: 20 },
    ],
    connections: 500, followers: 3300,
  },
  {
    id: "ob", first: "O.B.", last: "Jackson", pronouns: "He/Him", year: 1877, film: "h8", color: "#5d6d3a", cover: "wyoming",
    headline: "Stagecoach driver · Wyoming Territory",
    place: "Red Rock, Wyoming Territory",
    about: "I drive stage in Wyoming Territory. I know the road to Red Rock in any weather, and I know where to stop when it turns bad.",
    roles: [{ title: "Stagecoach Driver", company: "Self-employed", type: "Self-employed", start: 1865, place: "Wyoming Territory" }],
    skills: [{ name: "Horsemanship", endorsements: 48 }, { name: "Navigation", endorsements: 26 }, { name: "Winter Driving", endorsements: 19, by: ["minnie"] }],
    connections: 37, followers: 52,
  },
  {
    id: "minnie", first: "Minnie", last: "Mink", pronouns: "She/Her", year: 1877, film: "h8", color: "#8d6e63", cover: "snowcabin",
    headline: "Proprietor, Minnie's Haberdashery · Wyoming Territory",
    place: "Wyoming Territory",
    about: "Minnie's Haberdashery sits on the road to Red Rock: coffee on, stew on the stove and a bed for travellers caught by the weather. Run with my husband, Sweet Dave.",
    roles: [{ title: "Proprietor", company: "Minnie's Haberdashery", type: "Self-employed", start: 1868, place: "Wyoming Territory" }],
    skills: [{ name: "Hospitality", endorsements: 40, by: ["ob"] }, { name: "Cooking", endorsements: 35, by: ["ob"] }, { name: "Bookkeeping", endorsements: 12 }],
    connections: 44, followers: 61,
  },
];

export const member = (id: string) => MEMBERS.find((m) => m.id === id);
/** The green frame shows when a member is open to work and has let all members see it. */
export const framed = (m: Pick<Member, "open">) => (m.open && !m.open.recruitersOnly ? "open" as const : undefined);
export const fullName = (m: Pick<Member, "first" | "last">) => [m.first, m.last].filter(Boolean).join(" ");
export const initials = (m: Pick<Member, "first" | "last">) => (m.first[0] + (m.last[0] ?? "")).replace(/[^A-Za-zÀ-ž]/g, "").toUpperCase();

/** "4 yrs 2 mos" style durations, on whole years: a role's span as of the member's own year. */
export function span(r: Role, year: number) {
  const n = (r.end ?? year) - r.start;
  return n < 1 ? "Less than a year" : `${n} yr${n === 1 ? "" : "s"}`;
}

export type Reaction = "like" | "celebrate" | "support" | "love" | "insightful" | "funny";
export const REACTIONS: { id: Reaction; label: string; color: string }[] = [
  { id: "like", label: "Like", color: "#378fe9" },
  { id: "celebrate", label: "Celebrate", color: "#44712e" },
  { id: "support", label: "Support", color: "#715e86" },
  { id: "love", label: "Love", color: "#df704d" },
  { id: "insightful", label: "Insightful", color: "#915907" },
  { id: "funny", label: "Funny", color: "#1a707e" },
];

export interface Comment { id: string; author: string; ago: string; text: string; likes: number }
export interface Post {
  id: string;
  author: string;
  ago: string;
  /** Minutes since posting, for the Recent sort. */
  minutes: number;
  kind: "photo" | "text" | "poll" | "event" | "milestone";
  text: string;
  photo?: string;
  poll?: { question: string; options: { label: string; votes: number }[]; left: string };
  event?: { title: string; when: string; place: string; going: number };
  milestone?: { title: string; detail: string };
  reactions: Partial<Record<Reaction, number>>;
  reposts: number;
  comments: Comment[];
}

const c = (id: string, author: string, ago: string, text: string, likes = 0): Comment => ({ id, author, ago, text, likes });

export const POSTS: Post[] = [
  {
    id: "rick-italy", author: "rick", ago: "2h", minutes: 120, kind: "photo", photo: "tabernas",
    text: "Back in Los Angeles after six months in Italy: four pictures, the first a western shot in Rome and Spain, and I came home married. Marvin Schwarz told me to go, and he was right.\n\nIf you've been thinking about work abroad, the westerns being made in Italy and Spain are serious productions with serious crews. Learn a little Italian first. I'm still learning.",
    reactions: { like: 812, celebrate: 304, love: 61, insightful: 27 }, reposts: 46,
    comments: [
      c("c1", "marvin", "1h", "Told you. Welcome home, Rick.", 38),
      c("c2", "cliff", "1h", "Six months, four pictures, one wedding. Glad I was there for all of it.", 52),
      c("c3", "bridget", "45m", "Congratulations. The Roman studios are wonderful places to work.", 11),
    ],
  },
  {
    id: "pink-tipping", author: "pink", ago: "4h", minutes: 240, kind: "poll",
    text: "A question for the network, since it came up over breakfast. Should a tip at a diner be expected, or earned?",
    poll: { question: "Should a tip at a diner be expected, or earned?", options: [{ label: "Always expected", votes: 412 }, { label: "Only when the service is good", votes: 688 }, { label: "Never: it belongs in the price", votes: 97 }, { label: "It depends on the city", votes: 335 }], left: "2d left" },
    reactions: { like: 140, funny: 88, insightful: 19 }, reposts: 12,
    comments: [
      c("c1", "max", "3h", "Nineteen years in a service business. Tip.", 64),
      c("c2", "jackie", "3h", "Spoken like someone who has never worked a full cabin. Tip.", 91),
      c("c3", "minnie", "2h", "Coffee's included at the Haberdashery. Kindness is always welcome.", 17),
    ],
  },
  {
    id: "max-nineteen", author: "max", ago: "6h", minutes: 360, kind: "text",
    text: "Nineteen years writing bail bonds. Some things I've learned:\n\nMost people come back to court. The ones who don't usually told you so at the start, if you were listening. The job is reading people, not paperwork.\n\nLately I've been asking myself whether I want to do it for another nineteen. I don't know the answer yet, and I've decided that's all right.",
    reactions: { like: 96, support: 41, insightful: 33 }, reposts: 4,
    comments: [
      c("c1", "jackie", "5h", "You read people better than anyone I know. Whatever you decide.", 22),
      c("c2", "ray", "4h", "The courts would miss you.", 7),
    ],
  },
  {
    id: "mia-pilot", author: "mia", ago: "8h", minutes: 480, kind: "photo", photo: "tvcamera",
    text: "Fox Force Five wasn't picked up. I played the team's knife expert, who also knew a great many old jokes.\n\nWhat I'm keeping from the pilot: a small cast becomes a team in a week if everyone listens, and a joke lands better the second time you tell it. Back to auditions on Monday.",
    reactions: { like: 402, support: 120, funny: 76 }, reposts: 9,
    comments: [
      c("c1", "vincent", "7h", "Tell the one about the tomatoes.", 58),
      c("c2", "bridget", "6h", "Pilots are cruel. The next part will come.", 14),
    ],
  },
  {
    id: "hanzo-sword", author: "hanzo", ago: "1d", minutes: 1440, kind: "photo", photo: "katana",
    text: "Many years ago I promised I would make no more swords. This year I broke that promise once, for a visitor whose reason I could not refuse. It is the finest sword I have made.\n\nSome work is worth a broken vow. The sushi bar is open as usual.",
    reactions: { like: 1530, insightful: 210, love: 96 }, reposts: 64,
    comments: [
      c("c1", "beatrix", "20h", "It is the finest work I have ever held. Thank you.", 304),
    ],
  },
  {
    id: "kim-challenger", author: "kim", ago: "1d", minutes: 1500, kind: "photo", photo: "challenger",
    text: "On a break from a shoot in Lebanon, Tennessee, we test-drove a white 1970 Dodge Challenger, the same model as the car in Vanishing Point. It drives exactly as well as you'd hope.",
    reactions: { like: 233, celebrate: 41, love: 30 }, reposts: 5,
    comments: [
      c("c1", "abernathy", "22h", "And somebody had to stay behind with the seller.", 40),
      c("c2", "cliff", "18h", "Good car. Treat her right.", 12),
    ],
  },
  {
    id: "wolfe-rules", author: "wolfe", ago: "1d", minutes: 1620, kind: "text",
    text: "Three rules for anyone who handles a crisis for a living.\n\n1. Arrive sooner than you're expected.\n2. Give instructions once, in order, and politely.\n3. Leave the client with a clean car and a clear head.\n\nThe rest is details, and the details are the job.",
    reactions: { like: 2210, insightful: 1080, celebrate: 96 }, reposts: 310,
    comments: [
      c("c1", "jules", "1d", "Saved our morning. Recommended without reservation.", 120),
      c("c2", "vincent", "1d", "He was very polite about it.", 77),
    ],
  },
  {
    id: "vincent-twist", author: "vincent", ago: "2d", minutes: 2880, kind: "photo", photo: "jukebox",
    text: "Back in LA after three years in Amsterdam. Last night I took my employer's wife to dinner, at her request, at Jack Rabbit Slim's, a 1950s place where the waiters dress as the stars of the decade. We entered the twist contest, and we won.",
    reactions: { like: 330, celebrate: 210, funny: 25 }, reposts: 7,
    comments: [c("c1", "mia", "2d", "We did win.", 140)],
  },
  {
    id: "shosanna-reopen", author: "shosanna", ago: "2d", minutes: 3000, kind: "event",
    text: "Our doors open again on Monday after a short closure: a week of French silent comedy, a new print each night. Marcel has been in the booth all week.",
    event: { title: "Le Gamaar reopens: a week of French silent comedy", when: "Monday, 8:00 PM", place: "Le Gamaar, Paris", going: 86 },
    reactions: { like: 140, love: 32 }, reposts: 6,
    comments: [
      c("c1", "marcel", "2d", "The prints are checked and the reels are on the shelf.", 19),
      c("c2", "hicox", "1d", "I'd come if I could get leave.", 8),
    ],
  },
  {
    id: "beatrix-break", author: "beatrix", ago: "3d", minutes: 4320, kind: "milestone",
    text: "Four years away, and now a break of my own choosing. I'm spending it with my daughter.",
    milestone: { title: "Started a career break", detail: "Parenting" },
    reactions: { like: 980, support: 412, love: 380 }, reposts: 22,
    comments: [c("c1", "hanzo", "3d", "Rest well.", 66)],
  },
  {
    id: "jules-leaving", author: "jules", ago: "3d", minutes: 4400, kind: "photo", photo: "desert",
    text: "Today is my last day. After ten years with one employer in Los Angeles, I'm leaving to travel and to find out what I'm meant to do next.\n\nI don't know where I'll be next month. I know why I'm going.",
    reactions: { like: 1104, support: 380, celebrate: 260 }, reposts: 41,
    comments: [
      c("c1", "wolfe", "3d", "Good luck, Jules.", 90),
      c("c2", "vincent", "3d", "You'll be back.", 31),
    ],
  },
  {
    id: "cliff-stunts", author: "cliff", ago: "4d", minutes: 5760, kind: "photo", photo: "karmannghia",
    text: "Looking for stunt work in Los Angeles. Years as Rick Dalton's double: fights, falls, horses and cars, and I drove for him too. Rick's back from Italy and doing fine. My turn.",
    reactions: { like: 410, support: 160 }, reposts: 19,
    comments: [
      c("c1", "rick", "4d", "Best stuntman in town, and I'd say so on any set.", 88),
      c("c2", "kim", "3d", "Driving work on our next picture? Send me your reel.", 24),
    ],
  },
  {
    id: "ob-blizzard", author: "ob", ago: "5d", minutes: 7200, kind: "photo", photo: "stagecoach",
    text: "Blizzard coming down on the Red Rock road. We'll lay over at Minnie's Haberdashery until it passes. Passengers, bring your coats inside.",
    reactions: { like: 77, support: 12 }, reposts: 2,
    comments: [c("c1", "minnie", "5d", "Coffee's on and the stew is hot.", 15)],
  },
  {
    id: "hicox-pabst", author: "hicox", ago: "5d", minutes: 7400, kind: "text",
    text: "Before the war I wrote a book on G. W. Pabst, Twenty-Four Frames into the Subconscious. People ask where to begin with German silent film.\n\nStart with Pabst's pictures from the late 1920s, watch them twice, and on the second viewing watch only the cutting.",
    reactions: { like: 210, insightful: 140 }, reposts: 18,
    comments: [c("c1", "shosanna", "4d", "We would happily programme a Pabst week.", 21)],
  },
  {
    id: "butch-watch", author: "butch", ago: "6d", minutes: 8640, kind: "photo", photo: "watch",
    text: "Retired from professional boxing. My last fight was my last fight. Leaving Los Angeles with Fabienne, and taking my father's watch.",
    reactions: { like: 520, support: 98, celebrate: 75 }, reposts: 8,
    comments: [c("c1", "cliff", "6d", "Boxers make good stuntmen. Look me up.", 14)],
  },
  {
    id: "marcel-booth", author: "marcel", ago: "1w", minutes: 10080, kind: "photo", photo: "projector",
    text: "What I check before the first reel: the print for torn perforations, the gate for dust, the cue marks at the end of each reel, and the fire shutter. Nitrate burns fast, so nothing that can light comes into the booth.",
    reactions: { like: 180, insightful: 120 }, reposts: 11,
    comments: [c("c1", "shosanna", "1w", "Thank you, Marcel.", 9)],
  },
  {
    id: "jackie-madrid", author: "jackie", ago: "1w", minutes: 10200, kind: "photo", photo: "madrid",
    text: "Planning a move to Madrid. I'm looking for cabin crew and guest-service roles in Europe; if you're hiring, or you know someone who is, I'd be glad to hear from you.",
    reactions: { like: 260, support: 140, celebrate: 44 }, reposts: 15,
    comments: [
      c("c1", "max", "1w", "Madrid will be lucky to have you.", 30),
      c("c2", "ray", "6d", "Let me know when you land.", 12),
    ],
  },
];

export const NEWS = [
  { title: "Italian westerns draw American TV actors", ago: "2h ago", readers: 4210 },
  { title: "Repertory cinemas bring back silent comedy", ago: "5h ago", readers: 1382 },
  { title: "Stunt performers push for screen credit", ago: "1d ago", readers: 2907 },
  { title: "Small carriers add routes to Mexico", ago: "1d ago", readers: 1116 },
  { title: "Winter travel advisory for Wyoming roads", ago: "3d ago", readers: 512 },
  { title: "Sushi bars spread beyond Japan", ago: "4d ago", readers: 864 },
];

export const SUGGESTIONS = ["wolfe", "hicox", "bridget"];

/** Who the signed-in member is connected to; everyone else is a second- or third-degree connection. */
export const CONNECTED = new Set(["max", "ray", "jules", "vincent", "mia", "butch", "rick", "cliff", "marvin", "kim", "abernathy", "shosanna", "marcel", "beatrix", "hanzo"]);
/** Second-degree: someone a connection knows. */
export const SECOND = new Set(["wolfe", "hicox", "bridget", "ob", "minnie"]);
export const degree = (id: string) => (id === ME ? "" : CONNECTED.has(id) ? "1st" : SECOND.has(id) ? "2nd" : "3rd+");
/** Followed at the start: every connection, and nobody else. */
export const followedAtStart = (id: string) => CONNECTED.has(id);

/** Photographs a member may attach to a new post. */
export const STOCK = ["madrid", "palms", "lasky", "coffee", "galley", "diner"];

export type AssessmentId = "projection" | "westerns" | "spanish" | "italian" | "chases";
export interface Question { q: string; options: string[]; answer: number; why: string; source: string }
export interface Assessment { id: AssessmentId; skill: string; blurb: string; icon: "reel" | "hat" | "plane" | "cup" | "car"; questions: Question[] }

const W = (path: string) => `https://en.wikipedia.org/wiki/${path}`;
const Wk = (word: string) => `https://en.wiktionary.org/wiki/${encodeURIComponent(word)}#${word === "Cinecittà" ? "Italian" : /[àèìòù]|grazie|buongiorno|arrivederci|prego|caffè|favore/.test(word) ? "Italian" : "Spanish"}`;

export const ASSESSMENTS: Assessment[] = [
  {
    id: "projection", skill: "Film Projection", icon: "reel",
    blurb: "35mm prints, reels, changeovers and the film base: what a projectionist knows before the house lights go down.",
    questions: [
      { q: "How many perforations along each edge does a standard 35mm motion-picture frame span?", options: ["Two", "Four", "Six", "Eight"], answer: 1, why: "The standard frame is four perforations tall on each edge, which gives sixteen frames to a foot of film.", source: W("35_mm_movie_film") },
      { q: "At 24 frames a second, about how long does a standard 1,000-foot reel of 35mm film run?", options: ["About 5 minutes", "About 11 minutes", "About 22 minutes", "About 45 minutes"], answer: 1, why: "Sixteen frames a foot makes 16,000 frames; at 24 a second that is a little over eleven minutes.", source: W("Reel") },
      { q: "Why was nitrate film handled with special care in the booth?", options: ["It scratches more easily than other film", "It is highly flammable", "It fades within a year", "It is sensitive to sound"], answer: 1, why: "Cellulose nitrate is highly flammable, which is why booths were built to contain a fire.", source: W("Nitrocellulose") },
      { q: "What replaced cellulose nitrate as the base of motion-picture film from 1948?", options: ["Glass", "Cellulose triacetate", "Paper", "Rubber"], answer: 1, why: "Kodak introduced cellulose triacetate safety film in 1948, and nitrate 35mm film stopped being made in 1951.", source: W("Cellulose_acetate_film") },
      { q: "In a two-projector booth, what tells the projectionist that a reel is about to end?", options: ["A bell in the reel", "Cue marks in the upper right corner of the picture", "A countdown on the soundtrack", "The house lights"], answer: 1, why: "A pair of cue marks, small dots in the upper right of the frame, signals the projectionist to start the second projector and then to change over.", source: W("Cue_mark") },
      { q: "What does the 35 in 35mm refer to?", options: ["The nominal width of the film", "The height of each frame", "The length of a reel in metres", "The diameter of the reel's hub"], answer: 0, why: "It names the nominal width of the film strip, which is in fact a little under 35 millimetres.", source: W("35_mm_movie_film") },
    ],
  },
  {
    id: "westerns", skill: "Westerns", icon: "hat",
    blurb: "From John Ford to the Italian westerns of the 1960s: the films, the directors, the music and the places they were shot.",
    questions: [
      { q: "Which 1964 film began Sergio Leone's Dollars Trilogy?", options: ["A Fistful of Dollars", "For a Few Dollars More", "The Good, the Bad and the Ugly", "Once Upon a Time in the West"], answer: 0, why: "A Fistful of Dollars (1964) was followed by For a Few Dollars More (1965) and The Good, the Bad and the Ugly (1966).", source: W("Dollars_Trilogy") },
      { q: "Who wrote the music for all three films of the Dollars Trilogy?", options: ["Nino Rota", "Ennio Morricone", "Bernard Herrmann", "Elmer Bernstein"], answer: 1, why: "Ennio Morricone scored all three; on the first he was credited under the name Dan Savio.", source: W("Dollars_Trilogy") },
      { q: "In which Spanish province were many Italian westerns shot?", options: ["Almería", "Seville", "Barcelona", "Asturias"], answer: 0, why: "The Tabernas desert and the coast of Almería stood in for the American Southwest and Mexico.", source: W("Spaghetti_Western") },
      { q: "Who directed the Italian western Django (1966)?", options: ["Sergio Leone", "Sergio Corbucci", "Sergio Sollima", "Damiano Damiani"], answer: 1, why: "Django was directed, produced and co-written by Sergio Corbucci.", source: W("Django_(1966_film)") },
      { q: "Where did John Ford shoot much of Stagecoach (1939), the first of many westerns he made there?", options: ["Death Valley", "Monument Valley", "Yosemite Valley", "The Grand Canyon"], answer: 1, why: "Stagecoach was the first of Ford's westerns shot in Monument Valley, on the Arizona–Utah border.", source: W("Stagecoach_(1939_film)") },
      { q: "In which Rome studio were many Italian westerns of 1964 to 1978 made?", options: ["Cinecittà", "Babelsberg", "Pinewood", "Barrandov"], answer: 0, why: "Most were made on low budgets at Cinecittà and on location in southern Italy and Spain.", source: W("Spaghetti_Western") },
    ],
  },
  {
    id: "spanish", skill: "Spanish", icon: "plane",
    blurb: "The Spanish a traveller needs between the gate and the street: signs, bags, tickets and asking the way.",
    questions: [
      { q: "On a sign in a Spanish airport, salida means:", options: ["Arrivals", "Exit", "Gate", "Baggage"], answer: 1, why: "Salida is the way out; llegadas are arrivals and puerta is a gate.", source: Wk("salida") },
      { q: "Which word means luggage?", options: ["Equipaje", "Aduana", "Billete", "Asiento"], answer: 0, why: "Equipaje is luggage; aduana is customs, billete a ticket and asiento a seat.", source: Wk("equipaje") },
      { q: "How do you ask where the gate is?", options: ["¿Dónde está la puerta?", "¿Cuánto cuesta la puerta?", "¿Cuándo es la puerta?", "¿Quién es la puerta?"], answer: 0, why: "Dónde asks where; cuánto asks how much, cuándo when and quién who.", source: Wk("dónde") },
      { q: "Aduana is:", options: ["Customs", "A taxi rank", "Departures", "A waiting room"], answer: 0, why: "La aduana is customs, where declarations are made.", source: Wk("aduana") },
      { q: "The polite, formal word for 'you' to one person is:", options: ["Tú", "Usted", "Vosotros", "Ellos"], answer: 1, why: "Usted is formal; tú is familiar, vosotros is the plural used in Spain, and ellos means 'they'.", source: Wk("usted") },
      { q: "In Spain, a plane or train ticket is usually called:", options: ["Un billete", "Una multa", "Una entrada", "Un recibo"], answer: 0, why: "In Spain it is un billete (in much of Latin America, un boleto); una entrada is a ticket to a show, una multa a fine.", source: Wk("billete") },
    ],
  },
  {
    id: "italian", skill: "Italian", icon: "cup",
    blurb: "Greetings, thanks and a coffee: the Italian an actor needs on a first morning at a Roman studio.",
    questions: [
      { q: "Grazie means:", options: ["Please", "Thank you", "Excuse me", "Good night"], answer: 1, why: "Grazie is thank you; per favore is please.", source: Wk("grazie") },
      { q: "Which greeting do you use in the morning?", options: ["Buonanotte", "Buongiorno", "Arrivederci", "Prego"], answer: 1, why: "Buongiorno is good morning or good day; buonanotte is good night.", source: Wk("buongiorno") },
      { q: "Arrivederci means:", options: ["Goodbye", "Welcome", "Good luck", "See you tomorrow"], answer: 0, why: "Arrivederci is goodbye; a domani is see you tomorrow.", source: Wk("arrivederci") },
      { q: "Prego can mean:", options: ["You're welcome", "I'm sorry", "Hurry up", "Good evening"], answer: 0, why: "Prego answers grazie, and also means 'please, go ahead'.", source: Wk("prego") },
      { q: "How do you ask for one coffee, please?", options: ["Un caffè, per favore", "Due caffè, grazie", "Un caffè, arrivederci", "Il caffè, prego"], answer: 0, why: "Un caffè, per favore: one coffee, please.", source: Wk("per favore") },
      { q: "Cinecittà, the large film studio in Rome, means:", options: ["Cinema City", "City of Light", "Studio of Rome", "New Cinema"], answer: 0, why: "Cinecittà is Italian for Cinema City; it is the largest film studio in Europe.", source: W("Cinecittà") },
    ],
  },
  {
    id: "chases", skill: "Car Chases on Film", icon: "car",
    blurb: "The cars and the cities of the chases stunt drivers study: Bullitt, The French Connection, Vanishing Point and more.",
    questions: [
      { q: "In Vanishing Point (1971), the driver is delivering which car?", options: ["A black 1977 Pontiac Trans Am", "A white 1970 Dodge Challenger R/T", "A green 1968 Ford Mustang", "A red 1969 Dodge Charger"], answer: 1, why: "Kowalski is delivering a white 1970 Dodge Challenger R/T 440 Magnum.", source: W("Vanishing_Point_(1971_film)") },
      { q: "In Vanishing Point, the car is to be delivered from Denver to:", options: ["Los Angeles", "Las Vegas", "San Francisco", "Phoenix"], answer: 2, why: "He has to get it to San Francisco by Monday.", source: W("Vanishing_Point_(1971_film)") },
      { q: "In Bullitt (1968), the detective's Ford Mustang is pursued by:", options: ["A Dodge Charger", "A Chevrolet Camaro", "A Pontiac GTO", "A Plymouth Barracuda"], answer: 0, why: "Two hitmen in a Dodge Charger follow him, and the chase runs through the streets of San Francisco.", source: W("Bullitt") },
      { q: "The car chase in The French Connection (1971) follows:", options: ["A runaway truck", "An elevated subway train", "A ferry", "A motorcycle"], answer: 1, why: "Popeye commandeers a car to chase a gunman who has boarded an elevated subway train in Brooklyn.", source: W("The_French_Connection_(film)") },
      { q: "In Smokey and the Bandit (1977), the Bandit drives:", options: ["A black 1977 Pontiac Trans Am", "A white 1970 Dodge Challenger", "A yellow 1973 Ford Pinto", "A black 1968 Dodge Charger"], answer: 0, why: "The Bandit drives a black 1977 Pontiac Trans Am as a blocker for the truck.", source: W("Smokey_and_the_Bandit") },
      { q: "Which city's streets carry the chase in Bullitt?", options: ["Los Angeles", "San Francisco", "Chicago", "New York"], answer: 1, why: "The chase runs through San Francisco and out to Brisbane.", source: W("Bullitt") },
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

export const RAIL_LINKS = ["About", "Accessibility", "Help Center", "Privacy & Terms", "Ad Choices", "Advertising", "Business Services", "Get the GIFin app"];

export const REFERENCE = {
  feed: { label: "the LinkedIn feed (signed-in home)", url: "https://www.linkedin.com/feed/" },
  profile: { label: "a LinkedIn member profile", url: "https://www.linkedin.com/" },
  edit: { label: "editing one's own LinkedIn profile", url: "https://www.linkedin.com/" },
  settings: { label: "LinkedIn's Settings & Privacy", url: "https://www.linkedin.com/mypreferences/d/categories/account" },
  assessments: { label: "LinkedIn's Skill Assessments, retired in 2023", url: "https://www.linkedin.com/help/learning/answer/a1690529" },
};
