import { StrictMode, useEffect, useId, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Page } from "../lib/Page";
import { GridBand, deal, type Cell } from "../bands/bands";
import { Avatar } from "../lib/people";
import { Icon, type IconName } from "../icons";
import { ME, MEMBERS, PAGES, REFERENCE, followedAtStart, fullName, profileHref } from "../content";
import { applyTheme, me, resetAll, settings, social, shownName, type Settings } from "../lib/store";
import { setFollowing } from "../lib/post";
import { FactTile } from "../lib/cards";
import "../styles.css";

/**
 * Settings & Privacy, after the reference's: its own reduced header, the
 * categories in a left column, and in each a list of settings grouped under
 * headings, every row naming the setting and its current value. A row opens
 * in place to its control. The settings that change the study do so at once
 * and on every page: Dark mode, the feed's default sort, the profile frame,
 * follows and the reset. The home is a grid of the categories, and
 * Notifications is a grid of its kinds, each with its switch.
 *
 * The reference's Sign in & security category, its Verifications row and
 * notifications, and Get a copy of your data are left out: a page that looks
 * like it asks for an address, a password, a code or a download reads as
 * phishing to automated scanners (CLAUDE.md, Safe Browsing remediation).
 */
type CatId = "account" | "visibility" | "privacy" | "ads" | "notifications";
interface Row { id: string; label: string; value?: (s: Settings) => string; detail: () => ReactNode }
interface Cat { id: CatId; name: string; icon: IconName; blurb: string; groups: { title: string; rows: Row[] }[] }

const upd = (p: Partial<Settings>) => settings.set((s) => ({ ...s, ...p }));

function Radios<T extends string>({ name, value, options, onChange }: { name: string; value: T; options: [T, string, string?][]; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <fieldset className="radios">
      <legend className="visually-hidden">{name}</legend>
      {options.map(([v, label, hint]) => <label key={v}><input type="radio" name={id} checked={value === v} onChange={() => onChange(v)} /><span><strong>{label}</strong>{hint && <small>{hint}</small>}</span></label>)}
    </fieldset>
  );
}
function Switch({ label, on, onChange, hint }: { label: string; on: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return <label className="switch"><input type="checkbox" role="switch" checked={on} onChange={(e) => onChange(e.target.checked)} /><span>{label}{hint && <small>{hint}</small>}</span><span className="switch__state" aria-hidden="true">{on ? "On" : "Off"}</span></label>;
}
const Note = ({ children }: { children: ReactNode }) => <p className="note">{children}</p>;

function DarkMode() { const s = settings.use(); return <><p>Choose how your GIFin experience looks for this device.</p><Radios name="Dark mode" value={s.theme} options={[["light", "Always off"], ["dark", "Always on"], ["device", "Use device settings", "Follows your device's light or dark appearance"]]} onChange={(v) => { upd({ theme: v }); applyTheme(v); }} /></>; }
function FeedSort() { const s = settings.use(); return <><p>Choose how your feed is sorted when you open it.</p><Radios name="Feed sort" value={s.feedSort} options={[["top", "Top", "The posts most relevant to you first"], ["recent", "Recent", "The newest posts first"]]} onChange={(v) => upd({ feedSort: v })} /></>; }
function Language() { const s = settings.use(); const [msg, setMsg] = useState(""); return <><label className="label" htmlFor="lang">Select a language</label><select id="lang" value={s.language} onChange={(e) => { if (e.target.value === "English") { upd({ language: "English" }); setMsg(""); } else setMsg(`${e.target.value} is not available in this study; the pages stay in English.`); }}>{["English", "Español", "Français", "Deutsch", "Italiano", "日本語"].map((l) => <option key={l}>{l}</option>)}</select><p className="note" role="status">{msg}</p></>; }
function Unfollowed() {
  const s = social.use();
  const gone = MEMBERS.filter((m) => m.id !== ME && (m.id in s.follows ? !s.follows[m.id] : false) && followedAtStart(m.id));
  return gone.length ? <ul className="entries">{gone.map((m) => <li key={m.id}><Avatar m={m} size={48} /><div><a href={profileHref(m.id)}><strong>{fullName(m)}</strong></a><p className="note">{m.headline}</p></div><button type="button" className="btn btn--outline btn--small" onClick={() => setFollowing(m.id, true)}>Follow</button></li>)}</ul> : <Note>You haven't unfollowed anyone. Unfollow someone from a post's menu and they appear here.</Note>;
}
function CloseAccount() {
  const [step, setStep] = useState(0);
  const [why, setWhy] = useState("");
  if (step === 2) return <p role="status"><strong>Nothing was closed.</strong> This is a layout study; there is no account to close.</p>;
  if (step === 1) return <><p>Closing an account removes your profile, connections and posts. Are you sure?</p><p className="row"><button type="button" className="btn btn--blue" onClick={() => setStep(2)}>Close account</button><button type="button" className="btn btn--outline" onClick={() => setStep(0)}>Back</button></p></>;
  return <><p>Tell us why you're closing your account:</p><Radios name="Reason" value={why} options={[["duplicate", "I have a duplicate account"], ["too-many", "I'm getting too many emails"], ["value", "I'm not getting any value from my membership"], ["privacy", "I have a privacy concern"], ["other", "Other"]]} onChange={setWhy} /><p className="row"><button type="button" className="btn btn--blue" disabled={!why} onClick={() => setStep(1)}>Next</button></p></>;
}
function Viewing() {
  const s = settings.use(); const m = me.use();
  const preview = s.viewing === "name" ? `${fullName(m)} · ${m.headline}` : s.viewing === "characteristics" ? `Someone at ${m.roles[0]?.company ?? "a company"}` : "Anonymous GIFin Member";
  return <><p>Choose whether you're visible or viewing in private mode when you look at someone's profile.</p><Radios name="Profile viewing options" value={s.viewing} options={[["name", "Your name and headline"], ["characteristics", "Private profile characteristics"], ["private", "Private mode"]]} onChange={(v) => upd({ viewing: v })} /><p className="preview" role="status"><span className="label">What they see</span>{preview}</p></>;
}
function LastName() {
  const s = settings.use(); const m = me.use();
  return <><p>Choose how your last name appears to members who aren't your connections.</p><Radios name="Last name" value={s.lastName} options={[["full", "Your full last name"], ["initial", "Your last initial only"]]} onChange={(v) => upd({ lastName: v })} /><p className="preview" role="status"><span className="label">Members outside your network see</span>{shownName(m, s)}</p></>;
}
function Reset() {
  const [sure, setSure] = useState(false);
  return <><p>Clear everything this study keeps in your browser: your edits, posts, reactions, comments, follows, assessment results and settings.</p><p className="row">{!sure ? <button type="button" className="btn btn--outline" onClick={() => setSure(true)}>Reset the study</button> : <><button type="button" className="btn btn--blue" onClick={() => { resetAll(); location.reload(); }}>Yes, clear it</button><button type="button" className="btn btn--outline" onClick={() => setSure(false)}>Cancel</button></>}</p></>;
}
function Photos() { const s = settings.use(); return <Radios name="Showing profile photos" value={s.photos} options={[["everyone", "All GIFin members"], ["network", "Your network"], ["connections", "Your connections"]]} onChange={(v) => upd({ photos: v })} />; }
function Active() { const s = settings.use(); return <Radios name="Active status" value={s.activeStatus} options={[["connections", "Your connections only"], ["everyone", "All GIFin members"], ["nobody", "No one"]]} onChange={(v) => upd({ activeStatus: v })} />; }
function Invites() { const s = settings.use(); return <Radios name="Invitations" value={s.invitations} options={[["everyone", "Everyone on GIFin"], ["email", "Only people who know your email address"], ["nobody", "Only people in your Imported Contacts list"]]} onChange={(v) => upd({ invitations: v })} />; }
function AdSwitch({ a }: { a: string }) { const s = settings.use(); return <Switch label={`Use ${a.toLowerCase()} to personalise ads`} on={s.ads[a] !== false} onChange={(v) => upd({ ads: { ...s.ads, [a]: v } })} />; }
const toggleRow = (id: string, label: string, key: keyof Settings, hint?: string): Row => ({ id, label, value: (s) => (s[key] ? "On" : "Off"), detail: () => <SwitchFor k={key} label={label} hint={hint} /> });
function SwitchFor({ k, label, hint }: { k: keyof Settings; label: string; hint?: string }) { const s = settings.use(); return <Switch label={label} hint={hint} on={Boolean(s[k])} onChange={(v) => upd({ [k]: v } as Partial<Settings>)} />; }
const show = (id: string, label: string, text: string, value?: string): Row => ({ id, label, value: () => value ?? "", detail: () => <Note>{text}</Note> });

const ADS = ["Connections", "Location", "Demographics", "Companies you follow", "Groups", "Education", "Job information", "Employer"];
const KINDS: [string, string][] = [["job", "Searching for a job"], ["hiring", "Hiring someone"], ["connecting", "Connecting with others"], ["catchup", "Network catch-up updates"], ["posting", "Posting and commenting"], ["messaging", "Messaging"], ["groups", "Groups"], ["pages", "Pages"], ["events", "Attending events"], ["news", "News and reports"], ["profile", "Updating your profile"]];

const CATS: Cat[] = [
  { id: "account", name: "Account preferences", icon: "user", blurb: "Profile information, display, general preferences and account management.", groups: [
    { title: "Profile information", rows: [
      { id: "name", label: "Name, location, and industry", value: () => `${fullName(me.get())} · ${me.get().place}`, detail: () => <><p>Your name and location are edited with the rest of your intro.</p><p><a className="btn btn--outline" href={`${PAGES.edit}#intro`}>Edit your intro</a></p></> },
      show("demographic", "Personal demographic information", "Not collected in this study."),
    ] },
    { title: "Display", rows: [{ id: "dark", label: "Dark mode", value: (s) => ({ light: "Always off", dark: "Always on", device: "Use device settings" })[s.theme], detail: () => <DarkMode /> }] },
    { title: "General preferences", rows: [
      { id: "language", label: "Language", value: (s) => s.language, detail: () => <Language /> },
      toggleRow("autoplay", "Autoplay videos", "autoplay"),
      toggleRow("sounds", "Sound effects", "sounds"),
      { id: "photos", label: "Showing profile photos", value: (s) => ({ everyone: "All GIFin members", network: "Your network", connections: "Your connections" })[s.photos], detail: () => <Photos /> },
      { id: "feed", label: "Feed preferences", value: (s) => (s.feedSort === "top" ? "Top" : "Recent"), detail: () => <FeedSort /> },
      { id: "unfollowed", label: "People you unfollowed", detail: () => <Unfollowed /> },
    ] },
    { title: "Subscriptions", rows: [show("premium", "Upgrade for free", "GIFin Premium is shown for the reference's sake. Nothing can be bought.", "Try GIFin Premium")] },
    { title: "Account management", rows: [show("hibernate", "Hibernate account", "Hibernating is not available in this study."), { id: "close", label: "Close account", detail: () => <CloseAccount /> }] },
  ] },
  { id: "visibility", name: "Visibility", icon: "eye", blurb: "Who can see your profile, your network and your activity.", groups: [
    { title: "Visibility of your profile & network", rows: [
      { id: "viewing", label: "Profile viewing options", value: (s) => ({ name: "Your name and headline", characteristics: "Private profile characteristics", private: "Private mode" })[s.viewing], detail: () => <Viewing /> },
      { id: "public", label: "Edit your public profile", detail: () => <><p>Your public profile is the version of it others see.</p><p><a className="btn btn--outline" href={PAGES.profile}>View your profile</a></p></> },
      toggleRow("connections", "Who can see your connections", "connectionsVisible", "On: your connections can see your list of connections."),
      { id: "lastname", label: "Who can see your last name", value: (s) => (s.lastName === "full" ? "Full last name" : "Last initial"), detail: () => <LastName /> },
    ] },
    { title: "Visibility of your GIFin activity", rows: [
      { id: "active", label: "Manage active status", value: (s) => ({ connections: "Your connections only", everyone: "All GIFin members", nobody: "No one" })[s.activeStatus], detail: () => <Active /> },
      toggleRow("share", "Share profile updates with your network", "shareUpdates"),
    ] },
  ] },
  { id: "privacy", name: "Data privacy", icon: "shield", blurb: "Your data, who can reach you, messaging and job seeking.", groups: [
    { title: "How GIFin uses your data", rows: [
      { id: "reset", label: "Reset this study", detail: () => <Reset /> },
    ] },
    { title: "Who can reach you", rows: [{ id: "invites", label: "Invitations to connect", value: (s) => ({ everyone: "Everyone on GIFin", email: "Only people who know your email", nobody: "Only people in your Imported Contacts list" })[s.invitations], detail: () => <Invites /> }] },
    { title: "Messaging experience", rows: [toggleRow("receipts", "Read receipts and typing indicators", "readReceipts")] },
    { title: "Job seeking preferences", rows: [toggleRow("recruiters", "Signal your interest to recruiters", "recruiters"), { id: "open", label: "Open to work", value: () => (me.get().open ? "On" : "Off"), detail: () => <><p>Open to work is set on your profile.</p><p><a className="btn btn--outline" href={`${PAGES.edit}#open`}>Edit open to work</a></p></> }] },
  ] },
  { id: "ads", name: "Advertising data", icon: "ad", blurb: "Which parts of your profile may shape the ads you see.", groups: [
    { title: "Profile data for ad personalization", rows: ADS.map((a): Row => ({ id: `ad-${a}`, label: a, value: (s) => (s.ads[a] === false ? "Off" : "On"), detail: () => <AdSwitch a={a} /> })) },
  ] },
  { id: "notifications", name: "Notifications", icon: "bell", blurb: "What you're notified about, and where.", groups: [] },
];
const NOTIFICATIONS = CATS.find((c) => c.id === "notifications")!;
/** Every setting the categories hold, the kinds of notification among them: the figure in the home's sixth square. */
const SETTING_COUNT = CATS.reduce((n, c) => n + c.groups.reduce((m, g) => m + g.rows.length, 0), 0) + KINDS.length;

function CatHome({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  const hits = q.trim().length >= 2 ? CATS.flatMap((c) => c.groups.flatMap((g) => g.rows.filter((r) => r.label.toLowerCase().includes(q.trim().toLowerCase())).map((r) => ({ c, r })))).concat(KINDS.filter(([, l]) => l.toLowerCase().includes(q.trim().toLowerCase())).map(([k, l]) => ({ c: NOTIFICATIONS, r: { id: `n-${k}`, label: l, detail: () => null } }))) : [];
  return (
    <>
      <div className="wrap setsearch">
        <label htmlFor="setq" className="visually-hidden">Search settings</label>
        <span className="search__icon" aria-hidden="true"><Icon name="search" size={18} /></span>
        <input id="setq" type="search" placeholder="Search settings" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {q.trim().length >= 2 && (
        <section className="wrap scard" aria-label="Settings that match">
          <p className="note" role="status">{hits.length} {hits.length === 1 ? "setting matches" : "settings match"}</p>
          <ul className="minilist">{hits.map(({ c, r }) => <li key={c.id + r.id}><a href={`${PAGES.settings}?s=${c.id}#${r.id}`}>{r.label}</a> · <span className="note">{c.name}</span></li>)}</ul>
        </section>
      )}
    </>
  );
}

function Rows({ cat }: { cat: Cat }) {
  const s = settings.use();
  const [open, setOpen] = useState<string | null>(() => location.hash.slice(1) || null);
  useEffect(() => { if (open) document.getElementById(open)?.scrollIntoView({ block: "center" }); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  return (
    <>
      {cat.groups.map((g) => (
        <section key={g.title} className="scard setgroup" aria-labelledby={`${cat.id}-${g.title}`}>
          <h2 id={`${cat.id}-${g.title}`} className="card__title">{g.title}</h2>
          <ul className="setrows">
            {g.rows.map((r) => (
              <li key={r.id} id={r.id}>
                <button type="button" className="setrow" aria-expanded={open === r.id} aria-controls={`${r.id}-d`} onClick={() => setOpen(open === r.id ? null : r.id)}>
                  <span className="setrow__label">{r.label}</span>{r.value && <span className="setrow__value">{r.value(s)}</span>}<Icon name={open === r.id ? "up" : "arrow"} size={18} />
                </button>
                {open === r.id && <div className="setrow__detail" id={`${r.id}-d`}>{r.detail()}</div>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function Notifications() {
  const s = settings.use();
  const on = (k: string) => s.notifications[k] !== false;
  const cells = KINDS.map(([k, label]): Cell => () => (
    <div className={`box box--notif${on(k) ? " is-on" : ""}`} id={`n-${k}`}>
      <p className="box__label">{label}</p>
      <p className="notif__state">{on(k) ? "On" : "Off"}</p>
      <div className="box__foot"><Switch label={`Notify me about ${label.toLowerCase()}`} on={on(k)} onChange={(v) => upd({ notifications: { ...s.notifications, [k]: v } })} /></div>
    </div>
  ));
  // The twelfth square, where the reference's Verifications kind stood: how many kinds are on.
  const count = KINDS.filter(([k]) => on(k)).length;
  cells.push(() => <FactTile f={{ line: `${count}/${KINDS.length}`, label: "Kinds turned on", tone: "tile", spoken: `${count} of ${KINDS.length}` }} />);
  const groups = deal(cells, 3);
  return <>{groups.map((g, i) => <GridBand key={i} id={`notif-${i}`} title={i === 0 ? "Notifications you receive" : `Notifications you receive, part ${i + 1} of ${groups.length}`} sub={i === 0 ? "On GIFin, by push and by email. Turn a kind off and it stops in all three." : undefined} quiet={i > 0} variant={i + 1} cells={g} />)}</>;
}

function App() {
  const q0 = new URLSearchParams(location.search).get("s") as CatId | null;
  const cat = CATS.find((c) => c.id === q0);
  const [q, setQ] = useState("");
  const m = me.use();
  return (
    <Page current={PAGES.settings} source={[REFERENCE.settings]} header="settings">
      <div className="wrap settings">
        <nav className="setnav" aria-label="Settings">
          <p className="setnav__me"><Avatar m={m} size={48} /><span className="setnav__title">Settings</span></p>
          <ul>{CATS.map((c) => <li key={c.id}><a href={`${PAGES.settings}?s=${c.id}`} aria-current={cat?.id === c.id ? "page" : undefined}><Icon name={c.icon} size={20} />{c.name}</a></li>)}</ul>
          <p className="setnav__links"><span>Help Center</span> · <span>Professional Community Policies</span> · <span>Privacy Policy</span> · <span>Accessibility</span></p>
        </nav>
        <div className="setmain">
          {!cat ? (
            <>
              <h1 className="pagetitle">Settings</h1>
              <CatHome q={q} setQ={setQ} />
              {[CATS.slice(0, 3), CATS.slice(3)].map((row, n) => <GridBand key={n} id={`categories-${n + 1}`} title={n === 0 ? "Categories" : "More categories"} quiet variant={n + 1} lead={n === 1} cells={[...row.map((c): Cell => () => (
                <a className="box box--cat" href={`${PAGES.settings}?s=${c.id}`}>
                  <span className="cat__icon" aria-hidden="true"><Icon name={c.icon} size={36} /></span>
                  <span className="cat__name">{c.name}</span>
                  <span className="cat__blurb">{c.blurb}</span>
                </a>
              )), ...(n === 1 ? [() => <FactTile f={{ line: String(SETTING_COUNT), label: `Settings, in ${CATS.length} categories`, tone: "tile" }} />] : [])]} />)}
            </>
          ) : (
            <>
              <p className="setback"><a href={PAGES.settings}><Icon name="arrow" size={16} className="flip" />All settings</a></p>
              <h1 className="pagetitle">{cat.name}</h1>
              {cat.id === "notifications" ? <Notifications /> : <Rows cat={cat} />}
            </>
          )}
        </div>
      </div>
    </Page>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
