import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Tools } from "./tools";
import { StudyBanner, StudyDisclosure } from "./study";
import { Credits, useBarHeight } from "./modules";
import { Icon, type IconName } from "../icons";
import { Avatar } from "./people";
import { ASSESSMENTS, HEADER_NAV, MEMBERS, ME, PAGES, RAIL_LINKS, assessmentHref, fullName, profileHref } from "../content";
import { me, resetAll } from "./store";

/**
 * The shell, after the reference's signed-in app: a white bar with the mark,
 * a search field, and the global navigation as icons over their names (Home,
 * My Network, Jobs, Messaging, Notifications, Me), then For Business and the
 * premium offer. Home and the Me menu lead to the study's pages; the rest are
 * the reference's items, for show. Nothing in the shell or the disclosure leaves for the
 * reference: the disclosure names the pages it follows without linking them,
 * and says why. The Me menu has no Sign Out, as the study has no sign-in.
 */
function Search() {
  const [q, setQ] = useState("");
  const id = useId();
  const t = q.trim().toLowerCase();
  const people = t.length >= 2 ? MEMBERS.filter((m) => `${fullName(m)} ${m.binomial} ${m.headline}`.toLowerCase().includes(t)).slice(0, 5) : [];
  const tests = t.length >= 2 ? ASSESSMENTS.filter((a) => a.skill.toLowerCase().includes(t)).slice(0, 2) : [];
  const n = people.length + tests.length;
  return (
    <div className="search" role="search">
      <label className="visually-hidden" htmlFor={`${id}q`}>Search members and skill assessments</label>
      <span className="search__icon" aria-hidden="true"><Icon name="search" size={18} /></span>
      <input id={`${id}q`} type="search" placeholder="Search" value={q} autoComplete="off" aria-describedby={`${id}n`} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Escape") setQ(""); }} />
      <span id={`${id}n`} className="visually-hidden" role="status">{t.length >= 2 ? `${n} ${n === 1 ? "result" : "results"}` : ""}</span>
      {t.length >= 2 && (
        <div className="search__hits">
          {n === 0 && <p className="search__none">No members or assessments match “{q.trim()}”.</p>}
          {people.length > 0 && <p className="search__head">People</p>}
          <ul>{people.map((m) => <li key={m.id}><a href={profileHref(m.id)}><Avatar m={m} size={44} /><span><strong>{fullName(m)}</strong><small>{m.headline}</small></span></a></li>)}</ul>
          {tests.length > 0 && <p className="search__head">Skill assessments</p>}
          <ul>{tests.map((a) => <li key={a.id}><a href={assessmentHref(a.id)}><span className="search__icon2"><Icon name={a.icon} size={22} /></span><span><strong>{a.skill}</strong><small>Skill assessment · {a.questions.length} questions</small></span></a></li>)}</ul>
        </div>
      )}
    </div>
  );
}

function MeMenu() {
  const m = me.use();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (!open) return; const k = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); ref.current?.focus(); } }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [open]);
  return (
    <li className="gnav__me">
      <button type="button" ref={ref} className="gnav__item" aria-expanded={open} aria-controls="me-menu" onClick={() => setOpen(!open)}>
        <Avatar m={m} size={24} /><span className="gnav__label">Me <Icon name="chevron" size={14} /></span>
      </button>
      {open && (
        <div className="memenu" id="me-menu">
          <div className="memenu__who"><Avatar m={m} size={72} /><div><strong>{fullName(m)}</strong><p>{m.headline}</p></div></div>
          <p className="memenu__view"><a className="btn btn--outline btn--block" href={PAGES.profile}>View profile</a></p>
          <p className="memenu__h">Account</p>
          <ul>
            <li><a href={PAGES.edit}>Edit profile</a></li>
            <li><a href={PAGES.assessments}>Skill assessments</a></li>
            <li><span>Help</span></li>
            <li><span>Language</span></li>
          </ul>
          <p className="memenu__h">Manage</p>
          <ul><li><a href={`${PAGES.feed}#saved`}>Posts &amp; Activity</a></li><li><span>Job Posting Account</span></li><li><button type="button" className="memenu__btn" onClick={() => { resetAll(); location.assign(PAGES.feed); }}>Reset the demo</button></li></ul>
        </div>
      )}
    </li>
  );
}

function GlobalNav({ current }: { current: string }) {
  const ref = useBarHeight<HTMLElement>();
  return (
    <header className="gtop" ref={ref}>
      <div className="wrap gtop__row">
        <a className="mark" href={PAGES.feed} aria-label="GIFin home"><span className="mark__gif">GIF</span><span className="mark__in">in</span></a>
        <Search />
        <nav className="gnav" aria-label="Primary">
          <ul>
            {HEADER_NAV.map((n) => {
              const inner = <><span className="gnav__icon"><Icon name={n.icon as IconName} size={24} />{"count" in n && n.count ? <span className="gnav__count" aria-hidden="true">{n.count}</span> : null}</span><span className="gnav__label">{n.label}</span>{"count" in n && n.count ? <span className="visually-hidden">, {n.count} new</span> : null}</>;
              return <li key={n.id}>{"href" in n ? <a className="gnav__item" href={n.href} aria-current={n.href === current ? "page" : undefined}>{inner}</a> : <span className="gnav__item gnav__item--show">{inner}</span>}</li>;
            })}
            <MeMenu />
            <li className="gnav__biz"><span className="gnav__item gnav__item--show"><span className="gnav__icon"><Icon name="grid" size={24} /></span><span className="gnav__label">For Business <Icon name="chevron" size={14} /></span></span></li>
            <li className="gnav__premium"><span className="gnav__item gnav__item--show gnav__item--premium"><span className="gnav__label">Try GIFin Premium for $0</span></span></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

/** The app's three columns: a left rail, the main column and a right rail. */
export function Rails({ left, right, children }: { left?: ReactNode; right?: ReactNode; children: ReactNode }) {
  return (
    <div className={`wrap rails${left ? " rails--left" : ""}${right ? " rails--right" : ""}`}>
      {left && <aside className="rails__left" aria-label="Your profile and shortcuts">{left}</aside>}
      <div className="rails__main">{children}</div>
      {right && <aside className="rails__right" aria-label="Suggestions and news">{right}</aside>}
    </div>
  );
}

export function RailFooter() {
  return (
    <footer className="railfoot">
      <ul>{RAIL_LINKS.map((l) => <li key={l}><span>{l}</span></li>)}</ul>
      <p><span className="mark mark--small" aria-hidden="true"><span className="mark__gif">GIF</span><span className="mark__in">in</span></span> GIFin Corporation © 2026</p>
    </footer>
  );
}

export function Page({ current, source, children }: { current: string; source: { label: string }[]; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <StudyBanner />
      <Tools />
      <GlobalNav current={current} />
      <main id="content" className="app">{children}</main>
      <StudyDisclosure>
        <p>This page follows {source.map((s, i) => <span key={s.label}>{i > 0 && (i === source.length - 1 ? " and " : ", ")}{s.label}</span>)}, as the reference is known in October 2026; it was built without signing in.</p>
        <p><strong>Why nothing here links to LinkedIn.</strong> The pages this study follows are named but not linked. LinkedIn shows them only to its members, and a page styled after a service that links to that service's own pages can be flagged as phishing by automated scanners, as the site this study is published on was in October 2026, so the study does not link out to it. The addresses are listed in the study's repository.</p>
        <Credits />
      </StudyDisclosure>
    </>
  );
}

export { ME };
