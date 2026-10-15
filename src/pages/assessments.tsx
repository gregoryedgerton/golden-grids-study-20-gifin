import { StrictMode, useEffect, useId, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Page, RailFooter, Rails } from "../lib/Page";
import { GridBand, type Cell } from "../bands/bands";
import { FactTile } from "../lib/cards";
import { Icon } from "../icons";
import { ASSESSMENTS, PAGES, PASS, PER_QUESTION, REFERENCE, assessment, assessmentHref, type Assessment } from "../content";
import { me, results } from "../lib/store";
import { Section } from "../lib/post";
import "../styles.css";

/**
 * Skill assessments, as the reference ran them until 2023: a list of
 * assessments, an introduction to each, a timed multiple-choice test taken in
 * one sitting, and a result that, when passed, puts a badge on the skill in
 * the member's profile. The reference's tests had fifteen questions; these
 * have six, each answer checked against the source named beside it. The
 * timer can be turned off before starting or during the test. Assessments are
 * squares, the recommended one largest; a result is a grid of its figures.
 */
const A = assessment(new URLSearchParams(location.search).get("a") ?? "");

function shuffle(n: number) { const a = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function Tile({ a, recommended }: { a: Assessment; recommended?: boolean }) {
  const r = results.use()[a.id];
  return (
    <a className={`box box--test${recommended ? " box--top" : ""}`} href={assessmentHref(a.id)}>
      <span className="test__icon" aria-hidden="true"><Icon name={a.icon} size={40} /></span>
      <span className="test__name">{a.skill}</span>
      <span className="test__blurb">{a.blurb}</span>
      <span className="test__meta">{a.questions.length} questions · {r ? (r.passed ? "Passed" : "Not passed yet") : "Not taken"}</span>
    </a>
  );
}

function List() {
  const m = me.use();
  const res = results.use();
  const [q, setQ] = useState("");
  const mine = new Set(m.skills.map((k) => k.assessment).filter(Boolean));
  const shown = ASSESSMENTS.filter((a) => a.skill.toLowerCase().includes(q.trim().toLowerCase()));
  const rec = [...shown].sort((a, b) => Number(mine.has(b.id)) - Number(mine.has(a.id)));
  const taken = ASSESSMENTS.filter((a) => res[a.id]);
  return (
    <>
      <div className="wrap titlerow">
        <h1 className="pagetitle">Skill assessments</h1>
        <p className="lede">Show what you know. Pass an assessment and a badge appears beside the skill on your profile; a result is private to you unless you choose to show it.</p>
      </div>
      <div className="wrap setsearch">
        <label htmlFor="aq" className="visually-hidden">Search skill assessments</label>
        <span className="search__icon" aria-hidden="true"><Icon name="search" size={18} /></span>
        <input id="aq" type="search" placeholder="Search skill assessments" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <p className="wrap note" role="status">{shown.length} {shown.length === 1 ? "assessment" : "assessments"}</p>
      {rec.length > 1 && <GridBand key={q} id="all" title="Recommended for you" sub="Assessments for the skills on your profile come first." variant={2} cells={rec.map((a, i): Cell => () => <Tile a={a} recommended={i === 0 && mine.has(a.id)} />)} />}
      {rec.length === 1 && <GridBand key={q} id="all" title="Assessment" variant={2} cells={[() => <Tile a={rec[0]} />, () => <FactTile f={{ line: String(rec[0].questions.length), label: "Questions", tone: "tile" }} />]} />}
      <section className="wrap scard" aria-labelledby="res-t">
        <h2 id="res-t" className="card__title">Your results</h2>
        {taken.length ? <ul className="entries entries--plain">{taken.map((a) => { const r = res[a.id]; return <li key={a.id}><div><strong>{a.skill}</strong><p className="note">{r.score} of {r.total} correct · {r.passed ? (r.show ? "Passed · badge shown on your profile" : "Passed · badge hidden") : "Not passed"}</p></div><a className="btn btn--outline btn--small" href={assessmentHref(a.id)}>{r.passed ? "View" : "Retake"}<span className="visually-hidden"> {a.skill}</span></a></li>; })}</ul> : <p className="note">Assessments you take show here.</p>}
      </section>
    </>
  );
}

type Stage = "intro" | "quiz" | "done";

function Test({ a }: { a: Assessment }) {
  const prev = results.use()[a.id];
  const [stage, setStage] = useState<Stage>(prev ? "done" : "intro");
  const [timer, setTimer] = useState(true);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [pick, setPick] = useState<number | null>(null);
  const [left, setLeft] = useState(PER_QUESTION);
  const [said, setSaid] = useState("");
  const [started, setStarted] = useState(0);
  const [took, setTook] = useState(0);
  const orders = useMemo(() => a.questions.map((q) => shuffle(q.options.length)), [a, stage === "quiz"]);  // eslint-disable-line react-hooks/exhaustive-deps
  const headRef = useRef<HTMLHeadingElement>(null);
  const id = useId();
  const q = a.questions[i];

  const next = (choice: number | null) => {
    const all = [...answers, choice];
    setAnswers(all); setPick(null); setLeft(PER_QUESTION);
    if (all.length === a.questions.length) {
      const score = all.filter((c, k) => c === a.questions[k].answer).length;
      const passed = score / a.questions.length >= PASS;
      setTook(Math.round((Date.now() - started) / 1000));
      results.set((r) => ({ ...r, [a.id]: { score, total: a.questions.length, passed, at: Date.now(), show: passed } }));
      setStage("done");
    } else { setI(i + 1); requestAnimationFrame(() => headRef.current?.focus()); }
  };

  useEffect(() => {
    if (stage !== "quiz" || !timer) return;
    if (left <= 0) { setSaid("Time's up for that question; it counts as unanswered."); next(pick); return; }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  if (stage === "intro") return (
    <section className="wrap scard testintro" aria-labelledby="ti">
      <p className="setback"><a href={PAGES.assessments}><Icon name="arrow" size={16} className="flip" />All assessments</a></p>
      <span className="test__icon" aria-hidden="true"><Icon name={a.icon} size={48} /></span>
      <h1 id="ti" className="pagetitle">{a.skill} assessment</h1>
      <p className="lede">{a.blurb}</p>
      <ul className="rules">
        <li><Icon name="info" size={20} />{a.questions.length} multiple-choice questions, one at a time</li>
        <li><Icon name="clock" size={20} />{mmss(PER_QUESTION)} for each question when the timer is on</li>
        <li><Icon name="badge" size={20} />Answer {Math.ceil(a.questions.length * PASS)} or more correctly to pass and earn a badge</li>
        <li><Icon name="eye" size={20} />Your result is private to you, and you choose whether the badge shows</li>
      </ul>
      <label className="switch"><input type="checkbox" role="switch" checked={timer} onChange={(e) => setTimer(e.target.checked)} /><span>Time each question<small>Turn this off to take the test at your own pace.</small></span><span className="switch__state" aria-hidden="true">{timer ? "On" : "Off"}</span></label>
      <p className="row"><button type="button" className="btn btn--blue" onClick={() => { setStage("quiz"); setI(0); setAnswers([]); setPick(null); setLeft(PER_QUESTION); setStarted(Date.now()); requestAnimationFrame(() => headRef.current?.focus()); }}>Start</button></p>
    </section>
  );

  if (stage === "quiz") return (
    <section className="wrap scard quiz" aria-labelledby={`${id}q`}>
      <div className="quiz__top">
        <p className="quiz__skill">{a.skill} assessment</p>
        <p className="quiz__step">Question {i + 1} of {a.questions.length}</p>
        {timer ? <p className="quiz__timer" role="timer" aria-live="off"><Icon name="clock" size={18} /><span>{mmss(left)}</span><span className="visually-hidden"> left on this question</span></p> : <p className="quiz__timer quiz__timer--off">Untimed</p>}
        {timer && <button type="button" className="textbtn" onClick={() => setTimer(false)}>Turn off the timer</button>}
      </div>
      <div className="quiz__bar" aria-hidden="true"><span style={{ width: `${(i / a.questions.length) * 100}%` }} /></div>
      {timer && <div className="quiz__clock" aria-hidden="true"><span style={{ width: `${(left / PER_QUESTION) * 100}%` }} className={left <= 15 ? "is-low" : ""} /></div>}
      <p className="visually-hidden" role="status">{said}</p>
      <h2 id={`${id}q`} className="quiz__q" ref={headRef} tabIndex={-1}>{q.q}</h2>
      <fieldset className="quiz__opts">
        <legend className="visually-hidden">Choose one answer</legend>
        {orders[i].map((o) => <label key={o} className={pick === o ? "is-on" : undefined}><input type="radio" name={`${id}o${i}`} checked={pick === o} onChange={() => setPick(o)} /><span>{q.options[o]}</span></label>)}
      </fieldset>
      <p className="row"><button type="button" className="btn btn--blue" disabled={pick == null} onClick={() => { setSaid(""); next(pick); }}>{i + 1 === a.questions.length ? "Submit" : "Next"}</button></p>
    </section>
  );

  const r = results.get()[a.id]!;
  return (
    <>
      <div className="wrap titlerow">
        <p className="setback"><a href={PAGES.assessments}><Icon name="arrow" size={16} className="flip" />All assessments</a></p>
        <h1 className="pagetitle">{r.passed ? `You passed the ${a.skill} assessment` : `You didn't pass the ${a.skill} assessment this time`}</h1>
      </div>
      <GridBand id="result" title="Your result" quiet lead variant={1}
        cells={[
          () => <FactTile f={{ line: `${r.score}/${r.total}`, spoken: `${r.score} of ${r.total}`, label: "Correct answers", body: r.passed ? "A badge now sits beside the skill on your profile." : `${Math.ceil(r.total * PASS)} correct answers pass. Read the answers below and try again.`, tone: r.passed ? "green" : "tile" }} />,
          () => (
            <div className="box box--badge">
              <span className={`badge__mark${r.passed ? " is-on" : ""}`} aria-hidden="true"><Icon name="badge" size={56} /></span>
              <p className="box__label">{r.passed ? "Badge earned" : "No badge yet"}</p>
              {r.passed ? <label className="switch"><input type="checkbox" role="switch" checked={r.show} onChange={(e) => results.set((x) => ({ ...x, [a.id]: { ...x[a.id], show: e.target.checked } }))} /><span>Show on my profile</span><span className="switch__state" aria-hidden="true">{r.show ? "On" : "Off"}</span></label>
                : <button type="button" className="btn btn--blue" onClick={() => { results.set((x) => { const n = { ...x }; delete n[a.id]; return n; }); setStage("intro"); }}>Retake</button>}
            </div>
          ),
          () => <FactTile f={{ line: `${Math.round((r.score / r.total) * 100)}%`, label: "Score", tone: "tile" }} />,
          () => <FactTile f={{ line: took ? mmss(took) : "—", spoken: took ? undefined : "not recorded", label: "Time taken", tone: "tile" }} />,
        ]} />
      {answers.length > 0 && (
        <section className="wrap scard" aria-labelledby="rev-t">
          <h2 id="rev-t" className="card__title">The answers</h2>
          <ol className="review">{a.questions.map((qq, k) => { const got = answers[k]; const ok = got === qq.answer; return (
            <li key={k} className={ok ? "is-right" : "is-wrong"}>
              <p className="review__q"><Icon name={ok ? "check" : "close"} size={18} /><strong>{qq.q}</strong></p>
              <p>{ok ? "Your answer, correct: " : got == null ? "Unanswered. The answer: " : `Your answer: ${qq.options[got]}. The answer: `}<strong>{qq.options[qq.answer]}</strong></p>
              <p className="note">{qq.why} <a href={qq.source}>Source</a></p>
            </li>
          ); })}</ol>
        </section>
      )}
      <p className="wrap row"><a className="btn btn--outline" href={PAGES.profile}>View your profile</a>{r.passed && <button type="button" className="btn btn--outline" onClick={() => { results.set((x) => { const n = { ...x }; delete n[a.id]; return n; }); setAnswers([]); setStage("intro"); }}>Retake</button>}<a className="btn btn--ghost" href={PAGES.assessments}>All assessments</a></p>
    </>
  );
}

function App() {
  return (
    <Page current={PAGES.assessments} source={[REFERENCE.assessments]}>
      <Rails right={<><Section title="About skill assessments"><p className="note">The reference retired its skill assessments in 2023 and removed the badges in 2024. This page rebuilds the feature as it worked: timed multiple-choice tests, a pass mark, and a badge beside the skill.</p></Section><RailFooter /></>}>
        {A ? <Test a={A} /> : <List />}
      </Rails>
    </Page>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
