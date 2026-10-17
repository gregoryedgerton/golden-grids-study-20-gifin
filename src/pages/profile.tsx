import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Page, RailFooter, Rails } from "../lib/Page";
import { GridBand, type Cell } from "../bands/bands";
import { FactTile, TextTile } from "../lib/cards";
import { Avatar, CompanyLogo } from "../lib/people";
import { SeeMore, Tabs } from "../lib/modules";
import { Experience, Skills, TopCard, TopPanels, profileUrl } from "../lib/profile";
import { FollowButton, Section } from "../lib/post";
import { Icon } from "../icons";
import { CONNECTED, ME, MEMBERS, PAGES, POSTS, REFERENCE, fullName, member, profileHref } from "../content";
import { me, ownPosts, social, useMember } from "../lib/store";
import "../styles.css";

/**
 * A profile, after the reference's: the top card, then (for the member's own
 * profile) Open to work and the private analytics, About, Featured, Activity,
 * Experience, Education, Skills, Recommendations, Languages and Interests,
 * with a right rail of the profile's address and the people also viewed.
 * `?u=` chooses a member; without it the page is the signed-in member's own,
 * as they have edited it.
 */
/** A passage cut at a word, with an ellipsis, for a square that shows the start of a post. */
const clip = (t: string, n: number) => (t.length <= n ? t : `${t.slice(0, t.lastIndexOf(" ", n))}…`);
const ID = (() => { const u = new URLSearchParams(location.search).get("u"); return u && member(u) ? u : ME; })();

function OpenToWork() {
  const m = me.use();
  if (!m.open) return null;
  return (
    <section className="wrap scard opencard" aria-labelledby="open-title">
      <div>
        <h2 id="open-title" className="opencard__title">Open to work</h2>
        <p>{m.open.titles.join(", ")} roles</p>
        <p className="note">{m.open.places.join(" · ")} · {m.open.types.join(", ")} · Visible to all GIFin members</p>
      </div>
      <a className="iconbtn" href={`${PAGES.edit}#open`} aria-label="Edit open to work preferences"><Icon name="pencil" size={20} /></a>
    </section>
  );
}

function App() {
  const m = useMember(ID)!;
  const own = ID === ME;
  const s = social.use();
  const mine = ownPosts.use();
  const [panel, setPanel] = useState<string | null>(null);
  const posts = POSTS.filter((p) => p.author === ID);
  const given = MEMBERS.flatMap((x) => (x.recs ?? []).filter((r) => r.from === ID).map((r) => ({ ...r, to: x.id })));
  const viewed = MEMBERS.filter((x) => x.id !== ID && x.id !== ME).sort((a, b) => Number(b.family === m.family) - Number(a.family === m.family)).slice(0, 5);
  const interests = MEMBERS.filter((x) => x.id !== ID && (s.follows[x.id] ?? CONNECTED.has(x.id)) && x.followers > 1000).slice(0, 4);
  const companies = [...new Set(m.roles.map((r) => r.company))].filter((c) => !/self-employed|freelance/i.test(c));

  const activity: Cell[] = [
    ...(own ? mine.filter((o) => !o.repostOf).map((o): Cell => () => <TextTile title={clip(o.text, 110)} body="Your post · in this browser" href={`${PAGES.feed}#post-${o.id}`} label="Your post in the feed" />) : []),
    ...posts.map((p): Cell => () => <TextTile title={clip(p.text.split("\n\n")[0], 110)} body={`${p.ago} · ${Object.values(p.reactions).reduce((n, v) => n + (v ?? 0), 0).toLocaleString("en-US")} reactions · ${p.comments.length} comments`} href={`${PAGES.feed}#post-${p.id}`} label={`Post by ${fullName(m)} in the feed`} />),
  ].slice(0, 4);
  if (activity.length === 1) activity.push(() => <FactTile f={{ line: m.followers.toLocaleString("en-US"), label: "Followers", tone: "tile" }} />);

  const right = (
    <>
      {own && (
        <section className="railcard" aria-label="Profile language and public address">
          <div className="railrow"><div><h2 className="railcard__title">Profile language</h2><p className="note">English</p></div></div>
          <div className="railrow"><div><h2 className="railcard__title">Public profile &amp; URL</h2><p className="note">{profileUrl(m)}</p></div></div>
        </section>
      )}
      <Section title="People also viewed">
        <ul className="suggest">{viewed.map((v) => (
          <li key={v.id}><a href={profileHref(v.id)} tabIndex={-1} aria-hidden="true"><Avatar m={v} size={64} /></a><div><a href={profileHref(v.id)}><strong>{fullName(v)}</strong></a><p>{v.headline}</p>{!CONNECTED.has(v.id) && <FollowButton id={v.id} />}</div></li>
        ))}</ul>
      </Section>
      <RailFooter />
    </>
  );

  return (
    <Page current={own ? PAGES.profile : ""} source={[REFERENCE.profile]}>
      <Rails right={right}>
        <h1 className="visually-hidden">{own ? `Your profile: ${fullName(m)}` : `${fullName(m)}'s profile`}</h1>
        <TopCard m={m} panel={panel} setPanel={setPanel} />
        <TopPanels m={m} panel={panel} setPanel={setPanel} />
        {own && <OpenToWork />}
        {own && (
          <GridBand id="analytics" title="Analytics" sub="Private to you" variant={3}
            cells={[
              () => <FactTile f={{ line: "47", label: "Profile views", body: "Discover who's viewed your profile.", tone: "tile" }} />,
              () => <FactTile f={{ line: "312", label: "Post impressions", body: "Check out who's engaging with your posts.", tone: "tile" }} />,
              () => <FactTile f={{ line: "19", label: "Search appearances", body: "See how often you appear in search results.", tone: "tile" }} />,
            ]} />
        )}
        <section className="wrap scard" aria-labelledby="about-title">
          <h2 id="about-title" className="card__title">About</h2>
          <SeeMore text={m.about} />
          <p className="topskills"><Icon name="badge" size={18} /><span><strong>Top skills</strong>{m.skills.slice(0, 3).map((k) => k.name).join(" • ")}</span></p>
        </section>
        {activity.length > 0 && <GridBand id="activity" title="Activity" sub={`${m.followers.toLocaleString("en-US")} followers`} variant={5} cells={activity} aside={own ? { href: PAGES.feed, label: "Create a post" } : undefined} />}
        <Experience m={m} />
        {m.schools && (
          <section className="wrap scard" aria-labelledby="edu-title">
            <h2 id="edu-title" className="card__title">Education</h2>
            <ul className="entries">{m.schools.map((sc) => <li key={sc.school}><CompanyLogo name={sc.school} size={48} /><div><strong>{sc.school}</strong><p>{sc.field}</p>{sc.years && <p className="note">{sc.years}</p>}</div></li>)}</ul>
          </section>
        )}
        <Skills m={m} />
        <section className="wrap scard" aria-labelledby="rec-title">
          <h2 id="rec-title" className="card__title">Recommendations</h2>
          <Tabs label="Recommendations" tabs={[
            { id: "rec", label: "Received", body: m.recs?.length ? <ul className="recs">{m.recs.map((r) => { const f = member(r.from)!; return <li key={r.from}><Avatar m={f} size={64} /><div><a href={profileHref(f.id)}><strong>{fullName(f)}</strong></a><p className="note">{f.headline}</p><p className="note">{r.relation}</p><p>{r.text}</p></div></li>; })}</ul> : <p className="note">No recommendations received yet.</p> },
            { id: "giv", label: "Given", body: given.length ? <ul className="recs">{given.map((r) => { const t = member(r.to)!; return <li key={r.to}><Avatar m={t} size={64} /><div><a href={profileHref(t.id)}><strong>{fullName(t)}</strong></a><p className="note">{t.headline}</p><p>{r.text}</p></div></li>; })}</ul> : <p className="note">No recommendations given yet.</p> },
          ]} />
        </section>
        {m.languages && (
          <section className="wrap scard" aria-labelledby="lang-title">
            <h2 id="lang-title" className="card__title">Languages</h2>
            <ul className="entries entries--plain">{m.languages.map(([l, p]) => <li key={l}><div><strong>{l}</strong><p className="note">{p}</p></div></li>)}</ul>
          </section>
        )}
        <section className="wrap scard" aria-labelledby="int-title">
          <h2 id="int-title" className="card__title">Interests</h2>
          <Tabs label="Interests" tabs={[
            { id: "voices", label: "Top Voices", body: interests.length ? <ul className="entries">{interests.map((v) => <li key={v.id}><Avatar m={v} size={64} /><div><a href={profileHref(v.id)}><strong>{fullName(v)}</strong></a><p className="note">{v.headline}</p><p className="note">{v.followers.toLocaleString("en-US")} followers</p><FollowButton id={v.id} /></div></li>)}</ul> : <p className="note">Nobody followed yet.</p> },
            { id: "companies", label: "Companies", body: companies.length ? <ul className="entries">{companies.map((c) => <li key={c}><CompanyLogo name={c} size={48} /><div><strong>{c}</strong></div></li>)}</ul> : <p className="note">No companies followed.</p> },
          ]} />
        </section>
      </Rails>
    </Page>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
