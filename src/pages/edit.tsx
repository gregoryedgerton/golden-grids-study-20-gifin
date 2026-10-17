import { StrictMode, useId, useRef, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Page, Rails } from "../lib/Page";
import { TopCard } from "../lib/profile";
import { Pic } from "../lib/cards";
import { photo } from "../photos";
import { Icon } from "../icons";
import { COVERS, ME, PAGES, REFERENCE, YEAR, member, roleDates, type Member, type Role } from "../content";
import { me } from "../lib/store";
import "../styles.css";

/**
 * Editing the profile, after the reference's edit forms: Intro (name,
 * pronouns, headline, place, cover), About, Open to work, Experience, Skills
 * and Languages. The reference opens each form in a dialog over the profile;
 * here each is a section of one page, and the profile's top card stands
 * above them as a live preview, changing as the reader types. Each section
 * saves on its own, to this browser, and says what is unsaved.
 */
type Draft = Member;
const COLORS = ["#c62828", "#0a66c2", "#057642", "#b24020", "#37474f", "#915907"];
const PRONOUNS = ["", "She/Her", "He/Him", "They/Them"];
const TYPES = ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship", "Seasonal"];
const WORK = ["Full-time", "Part-time", "Contract", "Temporary", "Freelance"];
const LEVELS = ["Elementary proficiency", "Limited working proficiency", "Professional working proficiency", "Full professional proficiency", "Native or bilingual proficiency"];
const SKILL_IDEAS = ["Customer Service", "Negotiation", "In-flight Safety", "Spanish", "Planning", "Hospitality", "First Aid", "Leadership", "Conflict Resolution", "Event Planning", "Italian"];

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

function Block({ id, title, dirty, saved, onSave, onDiscard, children, sub }: { id: string; title: string; sub?: string; dirty: boolean; saved: string; onSave: () => void; onDiscard: () => void; children: ReactNode }) {
  return (
    <form className="wrap scard editblock" id={id} aria-labelledby={`${id}-t`} noValidate onSubmit={(e) => { e.preventDefault(); onSave(); }}>
      <header className="editblock__head">
        <div><h2 id={`${id}-t`} className="card__title">{title}</h2>{sub && <p className="note">{sub}</p>}</div>
        <p className={`editblock__state${dirty ? " is-dirty" : ""}`} role="status">{dirty ? "Unsaved changes" : saved}</p>
      </header>
      {children}
      <p className="row editblock__acts"><button type="submit" className="btn btn--blue" disabled={!dirty}>Save</button><button type="button" className="btn btn--outline" disabled={!dirty} onClick={onDiscard}>Discard</button></p>
    </form>
  );
}

function Field({ label, error, hint, children, id, count }: { label: string; error?: string; hint?: string; children: ReactNode; id: string; count?: string }) {
  return (
    <div className={`field${error ? " field--error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      <p className="field__row">{error ? <span className="field__error" id={`${id}-e`}><Icon name="info" size={16} />{error}</span> : hint ? <span className="note" id={`${id}-h`}>{hint}</span> : <span />}{count && <span className="note">{count}</span>}</p>
    </div>
  );
}

function Chips({ items, onRemove, label }: { items: string[]; onRemove: (i: number) => void; label: string }) {
  return <ul className="echips" aria-label={label}>{items.map((t, i) => <li key={t}>{t}<button type="button" aria-label={`Remove ${t}`} onClick={() => onRemove(i)}><Icon name="close" size={14} /></button></li>)}</ul>;
}

function App() {
  const saved = me.use();
  const [d, setD] = useState<Draft>(saved);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const id = useId();
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((x) => ({ ...x, [k]: v }));
  const commit = (block: string, keys: (keyof Draft)[]) => {
    me.set((m) => { const n = { ...m }; for (const k of keys) (n as Record<string, unknown>)[k] = d[k]; return n; });
    setNotes((n) => ({ ...n, [block]: "Saved to this browser." }));
  };
  const discard = (keys: (keyof Draft)[]) => setD((x) => { const n = { ...x }; for (const k of keys) (n as Record<string, unknown>)[k] = saved[k]; return n; });
  const dirty = (keys: (keyof Draft)[]) => keys.some((k) => !same(d[k], saved[k]));
  const focusFirst = (ids: string[]) => requestAnimationFrame(() => { const first = ids.map((i) => document.getElementById(i)).find(Boolean); first?.focus(); });

  // Intro
  const INTRO: (keyof Draft)[] = ["first", "last", "pronouns", "headline", "place", "cover", "color"];
  const saveIntro = () => {
    const e: Record<string, string> = {};
    if (!d.first.trim()) e.first = "Enter a first name.";
    if (!d.headline.trim()) e.headline = "Enter a headline.";
    if (d.headline.length > 220) e.headline = "Keep the headline to 220 characters.";
    if (!d.place.trim()) e.place = "Enter a location.";
    setErrs((x) => ({ ...Object.fromEntries(Object.entries(x).filter(([k]) => !["first", "last", "headline", "place"].includes(k))), ...e }));
    if (Object.keys(e).length) { focusFirst(Object.keys(e).map((k) => `${id}${k}`)); return; }
    commit("intro", INTRO);
  };

  // Open to work
  const [title, setTitle] = useState("");
  const [placeAdd, setPlaceAdd] = useState("");
  const open = d.open;
  const setOpen = (o: Draft["open"]) => set("open", o);

  // Experience
  const blank: Role = { title: "", company: "", type: "Full-time", start: YEAR, place: "" };
  const [role, setRole] = useState<{ at: number | null; r: Role; current: boolean } | null>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const saveRole = () => {
    if (!role) return;
    const r = role.r; const e: Record<string, string> = {};
    if (!r.title.trim()) e.rtitle = "Enter a title.";
    if (!r.company.trim()) e.rcompany = "Enter a company or organisation.";
    if (!r.start || r.start < 1 || r.start > YEAR) e.rstart = `Enter a start year between 1 and ${YEAR}.`;
    if (!role.current && (!r.end || r.end < (r.start ?? 0))) e.rend = "The end year can't be before the start year.";
    if (!role.current && r.end && r.end > YEAR) e.rend = `Enter an end year no later than ${YEAR}.`;
    setErrs(e);
    if (Object.keys(e).length) { focusFirst(Object.keys(e).map((k) => `${id}${k}`)); return; }
    const next: Role = { ...r, end: role.current ? undefined : r.end, approx: undefined, dates: undefined };
    set("roles", role.at == null ? [next, ...d.roles] : d.roles.map((x, i) => (i === role.at ? next : x)));
    setRole(null);
  };

  // Skills and languages
  const [skill, setSkill] = useState("");
  const addSkill = () => {
    const t = skill.trim(); if (!t) return;
    if (d.skills.some((k) => k.name.toLowerCase() === t.toLowerCase())) { setErrs({ skill: `${t} is already on your profile.` }); return; }
    set("skills", [...d.skills, { name: t, endorsements: 0 }]); setSkill(""); setErrs({});
  };
  const [lang, setLang] = useState("");
  const [level, setLevel] = useState(LEVELS[2]);

  const err = (k: string) => errs[k];
  const described = (k: string) => (errs[k] ? { "aria-invalid": true as const, "aria-describedby": `${id}${k}-e` } : {});

  return (
    <Page current={PAGES.profile} source={[REFERENCE.edit, REFERENCE.profile]}>
      <Rails right={
        <nav className="railcard editnav" aria-label="Sections">
          <h2 className="railcard__title">Edit profile</h2>
          <ul>{[["intro", "Intro"], ["about", "About"], ["open", "Open to work"], ["experience", "Experience"], ["skills", "Skills"], ["languages", "Languages"]].map(([h, l]) => <li key={h}><a href={`#${h}`}>{l}</a></li>)}</ul>
          <p><a className="btn btn--outline btn--block" href={PAGES.profile}>View profile</a></p>
          <p><button type="button" className="textbtn" onClick={() => { const orig = JSON.parse(JSON.stringify(member(ME)!)); me.set(orig); setD(orig); setNotes({ all: "Profile restored." }); }}>Restore the original profile</button></p>
          <p className="note" role="status">{notes.all}</p>
        </nav>
      }>
        <h1 className="pagetitle wrap">Edit profile</h1>
        <p className="wrap lede">The top card below is a preview: it changes as you type. Save each section to keep it; everything is kept in this browser.</p>
        <TopCard m={d} panel={null} setPanel={() => {}} preview />

        <Block id="intro" title="Intro" sub="* Indicates required" dirty={dirty(INTRO)} saved={notes.intro ?? ""} onSave={saveIntro} onDiscard={() => { discard(INTRO); setErrs({}); }}>
          <div className="fields fields--2">
            <Field id={`${id}first`} label="First name*" error={err("first")}><input id={`${id}first`} value={d.first} onChange={(e) => set("first", e.target.value)} {...described("first")} autoComplete="given-name" /></Field>
            <Field id={`${id}last`} label="Last name" error={err("last")}><input id={`${id}last`} value={d.last} onChange={(e) => set("last", e.target.value)} {...described("last")} autoComplete="family-name" /></Field>
          </div>
          <Field id={`${id}pron`} label="Pronouns"><select id={`${id}pron`} value={d.pronouns ?? ""} onChange={(e) => set("pronouns", e.target.value || undefined)}>{PRONOUNS.map((p) => <option key={p} value={p}>{p || "Please select"}</option>)}</select></Field>
          <Field id={`${id}headline`} label="Headline*" error={err("headline")} count={`${d.headline.length}/220`}><textarea id={`${id}headline`} rows={2} value={d.headline} onChange={(e) => set("headline", e.target.value)} {...described("headline")} /></Field>
          <Field id={`${id}place`} label="Location*" error={err("place")}><input id={`${id}place`} value={d.place} onChange={(e) => set("place", e.target.value)} {...described("place")} /></Field>
          <fieldset className="pickset">
            <legend>Cover photograph</legend>
            {COVERS.map((k) => <label key={k} className={`pickpic${d.cover === k ? " is-on" : ""}`}><input type="radio" name={`${id}cover`} checked={d.cover === k} onChange={() => set("cover", k)} /><span className="pickpic__img"><Pic k={k} sizes="96px" /></span><span className="visually-hidden">{photo(k).alt}</span></label>)}
            <label className={`pickpic${!d.cover ? " is-on" : ""}`}><input type="radio" name={`${id}cover`} checked={!d.cover} onChange={() => set("cover", undefined)} /><span className="pickpic__none">Pattern</span></label>
          </fieldset>
          <fieldset className="pickset">
            <legend>Colour, for your eyelids and the pattern cover</legend>
            {COLORS.map((c) => <label key={c} className={`swatchpick${d.color === c ? " is-on" : ""}`}><input type="radio" name={`${id}color`} checked={d.color === c} onChange={() => set("color", c)} /><span style={{ background: c }} /><span className="visually-hidden">Colour {c}</span></label>)}
          </fieldset>
        </Block>

        <Block id="about" title="About" sub="Write about your years of experience, your field or your skills." dirty={dirty(["about"])} saved={notes.about ?? ""} onSave={() => { if (d.about.length > 2600) { setErrs({ about: "Keep About to 2,600 characters." }); return; } commit("about", ["about"]); }} onDiscard={() => discard(["about"])}>
          <Field id={`${id}about`} label="About" error={err("about")} count={`${d.about.length.toLocaleString("en-US")}/2,600`}><textarea id={`${id}about`} rows={6} value={d.about} onChange={(e) => set("about", e.target.value)} {...described("about")} /></Field>
        </Block>

        <Block id="open" title="Open to work" sub="Show recruiters and others that you're open to new roles." dirty={dirty(["open"])} saved={notes.open ?? ""} onSave={() => commit("open", ["open"])} onDiscard={() => discard(["open"])}>
          <label className="switch"><input type="checkbox" role="switch" checked={Boolean(open)} onChange={(e) => setOpen(e.target.checked ? { titles: [], places: [d.place], types: ["Full-time"] } : undefined)} /><span>Show that I'm open to work</span></label>
          {open && (
            <>
              <Field id={`${id}title`} label="Job titles (up to 5)" hint="Press Add after each title.">
                <span className="addrow"><input id={`${id}title`} value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (title.trim() && open.titles.length < 5) { setOpen({ ...open, titles: [...open.titles, title.trim()] }); setTitle(""); } } }} />
                  <button type="button" className="btn btn--outline" disabled={!title.trim() || open.titles.length >= 5} onClick={() => { setOpen({ ...open, titles: [...open.titles, title.trim()] }); setTitle(""); }}>Add</button></span>
              </Field>
              <Chips label="Job titles" items={open.titles} onRemove={(i) => setOpen({ ...open, titles: open.titles.filter((_, j) => j !== i) })} />
              <Field id={`${id}oplace`} label="Locations">
                <span className="addrow"><input id={`${id}oplace`} value={placeAdd} onChange={(e) => setPlaceAdd(e.target.value)} />
                  <button type="button" className="btn btn--outline" disabled={!placeAdd.trim()} onClick={() => { setOpen({ ...open, places: [...open.places, placeAdd.trim()] }); setPlaceAdd(""); }}>Add</button></span>
              </Field>
              <Chips label="Locations" items={open.places} onRemove={(i) => setOpen({ ...open, places: open.places.filter((_, j) => j !== i) })} />
              <fieldset className="checks"><legend>Employment types</legend>{WORK.map((w) => <label key={w}><input type="checkbox" checked={open.types.includes(w)} onChange={() => setOpen({ ...open, types: open.types.includes(w) ? open.types.filter((x) => x !== w) : [...open.types, w] })} />{w}</label>)}</fieldset>
              <fieldset className="checks"><legend>Who can see you're open</legend>
                <label><input type="radio" name={`${id}vis`} checked={!open.recruitersOnly} onChange={() => setOpen({ ...open, recruitersOnly: false })} /><span><strong>All GIFin members</strong> · adds the #OPENTOWORK frame to your photo</span></label>
                <label><input type="radio" name={`${id}vis`} checked={Boolean(open.recruitersOnly)} onChange={() => setOpen({ ...open, recruitersOnly: true })} /><span><strong>Recruiters only</strong> · no frame</span></label>
              </fieldset>
            </>
          )}
        </Block>

        <Block id="experience" title="Experience" dirty={dirty(["roles"])} saved={notes.experience ?? ""} onSave={() => commit("experience", ["roles"])} onDiscard={() => { discard(["roles"]); setRole(null); }}>
          <ul className="editroles">
            {d.roles.map((r, i) => (
              <li key={`${r.title}${i}`}>
                <div><strong>{r.title}</strong><p>{r.company}{r.type ? ` · ${r.type}` : ""}</p><p className="note">{roleDates(r)}</p></div>
                <span className="row"><button type="button" className="iconbtn" aria-label={`Edit ${r.title}, ${r.company}`} onClick={() => { setRole({ at: i, r: { ...r }, current: !r.end }); requestAnimationFrame(() => roleRef.current?.querySelector("input")?.focus()); }}><Icon name="pencil" size={18} /></button>
                  <button type="button" className="iconbtn" aria-label={`Delete ${r.title}, ${r.company}`} onClick={() => set("roles", d.roles.filter((_, j) => j !== i))}><Icon name="trash" size={18} /></button></span>
              </li>
            ))}
          </ul>
          {!role && <p><button type="button" className="btn btn--outline" onClick={() => { setRole({ at: null, r: blank, current: true }); requestAnimationFrame(() => roleRef.current?.querySelector("input")?.focus()); }}><Icon name="plus" size={16} />Add position</button></p>}
          {role && (
            <div className="subform" ref={roleRef} role="group" aria-label={role.at == null ? "Add position" : "Edit position"}>
              <div className="fields fields--2">
                <Field id={`${id}rtitle`} label="Title*" error={err("rtitle")}><input id={`${id}rtitle`} value={role.r.title} onChange={(e) => setRole({ ...role, r: { ...role.r, title: e.target.value } })} {...described("rtitle")} /></Field>
                <Field id={`${id}rcompany`} label="Company or organisation*" error={err("rcompany")}><input id={`${id}rcompany`} value={role.r.company} onChange={(e) => setRole({ ...role, r: { ...role.r, company: e.target.value } })} {...described("rcompany")} /></Field>
                <Field id={`${id}rtype`} label="Employment type"><select id={`${id}rtype`} value={role.r.type} onChange={(e) => setRole({ ...role, r: { ...role.r, type: e.target.value } })}>{TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
                <Field id={`${id}rplace`} label="Location"><input id={`${id}rplace`} value={role.r.place ?? ""} onChange={(e) => setRole({ ...role, r: { ...role.r, place: e.target.value } })} /></Field>
                <Field id={`${id}rstart`} label="Start year*" error={err("rstart")}><input id={`${id}rstart`} inputMode="numeric" value={role.r.start || ""} onChange={(e) => setRole({ ...role, r: { ...role.r, start: Number(e.target.value.replace(/\D/g, "").slice(0, 4)) } })} {...described("rstart")} /></Field>
                <Field id={`${id}rend`} label="End year" error={err("rend")}><input id={`${id}rend`} inputMode="numeric" disabled={role.current} value={role.current ? "" : role.r.end || ""} onChange={(e) => setRole({ ...role, r: { ...role.r, end: Number(e.target.value.replace(/\D/g, "").slice(0, 4)) } })} {...described("rend")} /></Field>
              </div>
              <label className="checkline"><input type="checkbox" checked={role.current} onChange={(e) => setRole({ ...role, current: e.target.checked })} />I am currently working in this role</label>
              <Field id={`${id}rtext`} label="Description" count={`${(role.r.text ?? "").length}/2,000`}><textarea id={`${id}rtext`} rows={3} maxLength={2000} value={role.r.text ?? ""} onChange={(e) => setRole({ ...role, r: { ...role.r, text: e.target.value } })} /></Field>
              <p className="row"><button type="button" className="btn btn--blue" onClick={saveRole}>{role.at == null ? "Add to the list" : "Update the list"}</button><button type="button" className="btn btn--outline" onClick={() => { setRole(null); setErrs({}); }}>Cancel</button><span className="note">Then Save the section.</span></p>
            </div>
          )}
        </Block>

        <Block id="skills" title="Skills" sub="Skills are ordered by endorsements on your profile." dirty={dirty(["skills"])} saved={notes.skills ?? ""} onSave={() => commit("skills", ["skills"])} onDiscard={() => discard(["skills"])}>
          <ul className="editskills">{d.skills.map((k, i) => <li key={k.name}><span><strong>{k.name}</strong><span className="note"> · {k.endorsements} {k.endorsements === 1 ? "endorsement" : "endorsements"}</span></span><button type="button" className="iconbtn" aria-label={`Remove ${k.name}`} onClick={() => set("skills", d.skills.filter((_, j) => j !== i))}><Icon name="trash" size={18} /></button></li>)}</ul>
          <Field id={`${id}skill`} label="Add a skill" error={err("skill")} hint={`${d.skills.length} of 50`}>
            <span className="addrow"><input id={`${id}skill`} list={`${id}ideas`} value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} {...described("skill")} />
              <button type="button" className="btn btn--outline" disabled={!skill.trim() || d.skills.length >= 50} onClick={addSkill}>Add</button></span>
            <datalist id={`${id}ideas`}>{SKILL_IDEAS.filter((s) => !d.skills.some((k) => k.name === s)).map((s) => <option key={s} value={s} />)}</datalist>
          </Field>
        </Block>

        <Block id="languages" title="Languages" dirty={dirty(["languages"])} saved={notes.languages ?? ""} onSave={() => commit("languages", ["languages"])} onDiscard={() => discard(["languages"])}>
          <ul className="editskills">{(d.languages ?? []).map(([l, p], i) => (
            <li key={l}><span><strong>{l}</strong></span>
              <label className="visually-hidden" htmlFor={`${id}lv${i}`}>Proficiency in {l}</label>
              <select id={`${id}lv${i}`} value={p} onChange={(e) => set("languages", (d.languages ?? []).map((x, j) => (j === i ? [x[0], e.target.value] as [string, string] : x)))}>{LEVELS.map((v) => <option key={v}>{v}</option>)}</select>
              <button type="button" className="iconbtn" aria-label={`Remove ${l}`} onClick={() => set("languages", (d.languages ?? []).filter((_, j) => j !== i))}><Icon name="trash" size={18} /></button></li>
          ))}</ul>
          <div className="fields fields--2">
            <Field id={`${id}lang`} label="Language"><input id={`${id}lang`} value={lang} onChange={(e) => setLang(e.target.value)} /></Field>
            <Field id={`${id}level`} label="Proficiency"><select id={`${id}level`} value={level} onChange={(e) => setLevel(e.target.value)}>{LEVELS.map((v) => <option key={v}>{v}</option>)}</select></Field>
          </div>
          <p><button type="button" className="btn btn--outline" disabled={!lang.trim() || (d.languages ?? []).some(([l]) => l.toLowerCase() === lang.trim().toLowerCase())} onClick={() => { set("languages", [...(d.languages ?? []), [lang.trim(), level]]); setLang(""); }}><Icon name="plus" size={16} />Add language</button></p>
        </Block>
      </Rails>
    </Page>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
