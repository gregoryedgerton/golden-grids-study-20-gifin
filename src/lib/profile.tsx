import { useId, useState } from "react";
import { GridBand, type Cell } from "../bands/bands";
import { ExpandedCell, type ExpandGroup } from "./expand";
import { Fit } from "./fit";
import { FactStrip, FactTile, PhotoCard } from "./cards";
import { Avatar, CompanyLogo, CoverPattern } from "./people";
import { Icon } from "../icons";
import { CONNECTED, EMAIL, ME, PAGES, assessmentHref, degree, fullName, member, profileHref, roleDates, roleRange, span, years, type Member, type Role, type Skill, framed } from "../content";
import { results, social, toggle } from "./store";
import { setFollowing, useFollowing } from "./post";

/**
 * The profile's squares. The reference's top card is a banner, a round photo
 * over it, the name, the headline, the place and the counts, with the buttons
 * beneath; here the card is a golden grid: the identity and its buttons in the
 * largest square, the cover beside it, and the counts as figures. Experience
 * and skills are grids too, the current role and the most endorsed skill in
 * the largest squares.
 */

const slug = (m: Member) => `${m.first}-${m.last}`.toLowerCase().normalize("NFD").replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

/** The identity square: the face, the name, the headline, the place and the buttons. */
export function Identity({ m, x, slotKey, onPanel, panel, preview }: { m: Member; x: ExpandGroup; slotKey: string; onPanel: (p: string | null) => void; panel: string | null; preview?: boolean }) {
  const Name = "p";
  void preview;
  const own = m.id === ME;
  const s = social.use();
  const following = useFollowing(m.id);
  const pending = Boolean(s.invited[m.id]);
  const connected = CONNECTED.has(m.id);
  const current = m.roles.find((r) => !r.end);
  const [more, setMore] = useState(false);
  const id = useId();
  return (
    <>
      <div className="box box--identity">
        <div className="identity__face"><Avatar m={m} size={128} frame={framed(m)} label={`${fullName(m)}${framed(m) ? ", open to work" : ""}`} /></div>
        <div className="identity__text">
          <Name className="identity__name">{fullName(m)}{m.pronouns && <span className="identity__pron"> · {m.pronouns}</span>}{!own && <span className="identity__degree"> · {degree(m.id)}</span>}</Name>
          <p className="identity__headline">{m.headline}</p>
          <p className="identity__place">{m.place} · <button className="textbtn textbtn--blue" {...x.triggerProps(slotKey)}>Contact info</button></p>
          {current && <p className="identity__current"><CompanyLogo name={current.company} size={24} />{current.company}</p>}
          {m.careerBreak && <p className="identity__current"><Icon name="clock" size={20} />Career break: {m.careerBreak}</p>}
        </div>
        <div className="identity__acts">
          {own ? (
            <>
              <button type="button" className="btn btn--blue" aria-expanded={panel === "open"} onClick={() => onPanel(panel === "open" ? null : "open")}>Open to</button>
              <a className="btn btn--outline" href={PAGES.edit}>Add profile section</a>
              <a className="btn btn--ghost" href={PAGES.edit}>Edit profile</a>
            </>
          ) : (
            <>
              {connected ? <button type="button" className="btn btn--blue" aria-expanded={panel === "message"} onClick={() => onPanel(panel === "message" ? null : "message")}><Icon name="send" size={16} />Message</button>
                : pending ? <button type="button" className="btn btn--outline" aria-expanded={panel === "pending"} onClick={() => onPanel(panel === "pending" ? null : "pending")}><Icon name="clock" size={16} />Pending</button>
                : <button type="button" className="btn btn--blue" aria-expanded={panel === "connect"} onClick={() => onPanel(panel === "connect" ? null : "connect")}><Icon name="plus" size={16} />Connect</button>}
              {!connected && <button type="button" className={`btn btn--outline${following ? " is-on" : ""}`} aria-pressed={following} onClick={() => setFollowing(m.id, !following)}>{following ? <><Icon name="check" size={16} />Following</> : <><Icon name="plus" size={16} />Follow</>}</button>}
              <span className="moremenu">
                <button type="button" className="btn btn--ghost" aria-expanded={more} aria-controls={`${id}more`} onClick={() => setMore(!more)}>More</button>
                {more && (
                  <ul className="menu menu--left" id={`${id}more`}>
                    {connected && <li><button type="button" onClick={() => { setFollowing(m.id, !following); setMore(false); }}><Icon name={following ? "close" : "plus"} size={18} />{following ? "Unfollow" : "Follow"}</button></li>}
                    <li><button type="button" onClick={() => { onPanel("recommend"); setMore(false); }}><Icon name="pencil" size={18} />Recommend</button></li>
                    <li><span><Icon name="link" size={18} />Save to PDF</span></li>
                    <li><span><Icon name="info" size={18} />Report or block</span></li>
                  </ul>
                )}
              </span>
            </>
          )}
        </div>
      </div>
      {x.isOpen(slotKey) && (
        <ExpandedCell id={x.panelId(slotKey)} title={`${fullName(m)}: contact info`} onClose={x.close} closeRef={x.closeRef}>
          <dl className="contact">
            <div><dt><Icon name="link" size={20} />Profile</dt><dd>gifin/in/{slug(m)}</dd></div>
            {own && <div><dt><Icon name="message" size={20} />Email</dt><dd>{EMAIL}</dd></div>}
            <div><dt><Icon name="people" size={20} />Connected</dt><dd>{own ? "This is you" : connected ? "You are connected" : pending ? "Invitation pending" : "Not connected"}</dd></div>
          </dl>
          <p className="note">Addresses here are the study's own and reach no one.</p>
        </ExpandedCell>
      )}
    </>
  );
}

/** The panels the top card's buttons open, flat beneath the card. */
export function TopPanels({ m, panel, setPanel }: { m: Member; panel: string | null; setPanel: (p: string | null) => void }) {
  const s = social.use();
  const [note, setNote] = useState("");
  const [text, setText] = useState("");
  const [rec, setRec] = useState("");
  const [said, setSaid] = useState("");
  const id = useId();
  const thread = s.messages[m.id] ?? [];
  return (
    <div className="wrap toppanels">
      <p role="status" className="toppanels__said">{said}</p>
      {panel === "open" && (
        <div className="panel">
          <h2 className="panel__title">Open to</h2>
          <ul className="choices">
            <li><a href={`${PAGES.edit}#open`}><Icon name="briefcase" size={20} /><span><strong>Finding a new job</strong>Show recruiters and others that you're open to work</span></a></li>
            <li><span className="choices__show"><Icon name="hiring" size={20} /><span><strong>Hiring</strong>Share that you're hiring and attract candidates</span></span></li>
            <li><span className="choices__show"><Icon name="people" size={20} /><span><strong>Providing services</strong>Showcase services you offer</span></span></li>
          </ul>
        </div>
      )}
      {panel === "connect" && (
        <form className="panel" onSubmit={(e) => { e.preventDefault(); toggle("invited", m.id, true); setPanel(null); setSaid(`Invitation sent to ${fullName(m)}. Nothing leaves this browser.`); }}>
          <h2 className="panel__title">Add a note to your invitation?</h2>
          <label htmlFor={`${id}n`} className="label">A personal note (optional)</label>
          <textarea id={`${id}n`} rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} placeholder={`Ex: We know each other from…`} />
          <p className="composer__count">{note.length} / 200</p>
          <p className="row"><button type="submit" className="btn btn--blue">{note.trim() ? "Send" : "Send without a note"}</button><button type="button" className="btn btn--outline" onClick={() => setPanel(null)}>Cancel</button></p>
        </form>
      )}
      {panel === "pending" && (
        <div className="panel">
          <h2 className="panel__title">Invitation pending</h2>
          <p>{fullName(m)} hasn't answered yet.</p>
          <p className="row"><button type="button" className="btn btn--outline" onClick={() => { toggle("invited", m.id, false); setPanel(null); setSaid("Invitation withdrawn."); }}>Withdraw</button></p>
        </div>
      )}
      {panel === "message" && (
        <form className="panel" onSubmit={(e) => { e.preventDefault(); const t = text.trim(); if (!t) return; social.set((v) => ({ ...v, messages: { ...v.messages, [m.id]: [...(v.messages[m.id] ?? []), { text: t, at: Date.now() }] } })); setText(""); setSaid("Message added to the conversation. It stays in this browser."); }}>
          <h2 className="panel__title">Message {fullName(m)}</h2>
          {thread.length > 0 && <ul className="thread">{thread.map((t, i) => <li key={i}><span className="thread__me">You</span>{t.text}</li>)}</ul>}
          <label htmlFor={`${id}m`} className="visually-hidden">Write a message</label>
          <textarea id={`${id}m`} rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a message…" maxLength={2000} />
          <p className="row"><button type="submit" className="btn btn--blue" disabled={!text.trim()}>Send</button><button type="button" className="btn btn--outline" onClick={() => setPanel(null)}>Close</button><span className="note">Messages send nothing.</span></p>
        </form>
      )}
      {panel === "recommend" && (
        <form className="panel" onSubmit={(e) => { e.preventDefault(); setPanel(null); setRec(""); setSaid(`Recommendation sent to ${fullName(m)} for approval. Nothing leaves this browser.`); }}>
          <h2 className="panel__title">Recommend {fullName(m)}</h2>
          <label htmlFor={`${id}r`} className="label">Write your recommendation</label>
          <textarea id={`${id}r`} rows={4} value={rec} onChange={(e) => setRec(e.target.value)} maxLength={3000} />
          <p className="row"><button type="submit" className="btn btn--blue" disabled={!rec.trim()}>Send</button><button type="button" className="btn btn--outline" onClick={() => setPanel(null)}>Cancel</button></p>
        </form>
      )}
    </div>
  );
}

export function TopCard({ m, panel, setPanel, preview }: { m: Member; panel: string | null; setPanel: (p: string | null) => void; preview?: boolean }) {
  const cells: Cell[] = [
    (x, key) => <Identity m={m} x={x} slotKey={key} panel={panel} onPanel={setPanel} preview={preview} />,
    (x, key) => m.cover ? <PhotoCard k={m.cover} title={`${fullName(m)}'s cover photograph`} x={x} slotKey={key} /> : <div className="box box--cover"><CoverPattern color={m.color} /></div>,
    () => <FactTile f={{ line: m.connections >= 500 ? "500+" : String(m.connections), label: "Connections", tone: "tile", spoken: m.connections >= 500 ? "more than 500" : undefined }} />,
    (_x, _k, flat) => { const f = { line: m.followers.toLocaleString("en-US"), label: "Followers", tone: "tile" as const }; return flat ? <FactStrip f={f} /> : <FactTile f={f} />; },
  ];
  return <GridBand id="top" title={preview ? "Preview of your top card" : `${fullName(m)}, profile`} quiet lead variant={1} cells={cells} />;
}

function RoleBox({ r, x, slotKey }: { r: Role; x: ExpandGroup; slotKey: string }) {
  const title = `${r.title}, ${r.company}`;
  return (
    <>
      <div className="box box--role">
        <CompanyLogo name={r.company} size={48} />
        <p className="role__title">{r.title}</p>
        <p className="role__company">{r.company}{r.type && <span className="role__type"> · {r.type}</span>}</p>
        <p className="role__dates">{roleRange(r)}{!r.dates && r.start !== undefined && <span className="role__span"> · {span(r)}</span>}</p>
        {r.place && <p className="role__place">{r.place}</p>}
        {r.text && <div className="box__body"><Fit as="div" className="fit--body" min={12} max={18}><p>{r.text}</p></Fit></div>}
        {r.text && <div className="box__foot"><button className="more" aria-label={`More: ${title}`} {...x.triggerProps(slotKey)}>…see more</button></div>}
      </div>
      {x.isOpen(slotKey) && (
        <ExpandedCell id={x.panelId(slotKey)} title={title} onClose={x.close} closeRef={x.closeRef}>
          <div className="cell__prose"><p><strong>{r.title}</strong>, {r.company}{r.type ? ` · ${r.type}` : ""}</p><p>{roleDates(r)}{r.place ? ` · ${r.place}` : ""}</p><p>{r.text}</p></div>
        </ExpandedCell>
      )}
    </>
  );
}

export function Experience({ m }: { m: Member }) {
  const cells: Cell[] = m.roles.map((r): Cell => (x, key) => <RoleBox r={r} x={x} slotKey={key} />);
  const total = m.roles.reduce((n, r) => n + years(r), 0);
  if (cells.length < 3 && total > 0) cells.push(() => <FactTile f={{ line: total.toLocaleString("en-US"), label: total === 1 ? "Year of experience" : "Years of experience", tone: "tile" }} />);
  if (cells.length < 3) cells.push(() => <FactTile f={{ line: String(m.roles.length), label: m.roles.length === 1 ? "Role" : "Roles", tone: "tile" }} />);
  return <GridBand id="experience" title="Experience" variant={2} cells={cells} />;
}

function SkillBox({ m, k, rank }: { m: Member; k: Skill; rank: number }) {
  const own = m.id === ME;
  const s = social.use();
  const r = results.use();
  const key = `${m.id}/${k.name}`;
  const mine = Boolean(s.endorsed[key]);
  const n = k.endorsements + (mine ? 1 : 0);
  const res = k.assessment ? r[k.assessment] : undefined;
  const badge = own && res?.passed && res.show;
  return (
    <div className={`box box--skill${rank === 0 ? " box--top" : ""}`}>
      <div className="box__fit"><Fit as="p" className="fit--title" min={13} max={rank === 0 ? 56 : 40}>{k.name}</Fit></div>
      {badge && <p className="skill__badge"><Icon name="badge" size={18} />Passed GIFin Skill Assessment</p>}
      <p className="skill__count"><Icon name="people" size={16} />{n} {n === 1 ? "endorsement" : "endorsements"}</p>
      {k.by && k.by.length > 0 && <p className="skill__by">Endorsed by {k.by.map((b) => fullName(member(b)!)).join(" and ")}</p>}
      <div className="box__foot">
        {own ? (k.assessment && !badge ? <a className="textbtn textbtn--blue" href={assessmentHref(k.assessment)}>Take the {k.name} assessment</a> : null)
          : <button type="button" className={`btn btn--outline btn--small${mine ? " is-on" : ""}`} aria-pressed={mine} aria-label={`${mine ? "Endorsed" : "Endorse"} ${fullName(m)} for ${k.name}`} onClick={() => toggle("endorsed", key)}>{mine ? <><Icon name="check" size={16} />Endorsed</> : "Endorse"}</button>}
      </div>
    </div>
  );
}

export function Skills({ m }: { m: Member }) {
  const s = social.use();
  const ranked = [...m.skills].sort((a, b) => (b.endorsements + (s.endorsed[`${m.id}/${b.name}`] ? 1 : 0)) - (a.endorsements + (s.endorsed[`${m.id}/${a.name}`] ? 1 : 0)));
  const top = ranked.slice(0, 5);
  const cells: Cell[] = top.map((k, i): Cell => () => <SkillBox m={m} k={k} rank={i} />);
  if (cells.length < 2) cells.push(() => <FactTile f={{ line: String(m.skills.length), label: "Skills", tone: "tile" }} />);
  return <GridBand id="skills" title="Skills" sub={m.id === ME ? "Ordered by endorsements. Pass a skill assessment to show a badge on a skill." : "Ordered by endorsements."} variant={4} cells={cells} aside={m.id === ME ? { href: PAGES.assessments, label: "Skill assessments" } : undefined} />;
}

export const profileUrl = (m: Member) => `gifin/in/${slug(m)}`;
export { profileHref };
