import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Page, RailFooter, Rails } from "../lib/Page";
import { Composer, FollowButton, PostBand, Section, itemFromOwn, type Item } from "../lib/post";
import { Avatar, CoverPattern } from "../lib/people";
import { Pic } from "../lib/cards";
import { Icon } from "../icons";
import { NEWS, PAGES, POSTS, REFERENCE, SUGGESTIONS, fullName, member, profileHref, framed } from "../content";
import { me, ownPosts, results, settings, social } from "../lib/store";
import "../styles.css";

/**
 * The feed, after the reference's signed-in home: the member's card and
 * shortcuts in a left rail, Start a post and the feed in the middle, and
 * suggestions to follow and the network's news in a right rail. Each post is
 * a golden grid (see `lib/post.tsx`); the rails and the composer are flat.
 */
function ProfileCard() {
  const m = me.use();
  const s = social.use();
  const r = results.use();
  const saved = Object.keys(s.saved).length;
  const going = Object.keys(s.going).length;
  const badges = Object.values(r).filter((x) => x.passed && x.show).length;
  return (
    <section className="railcard profilecard" aria-label="Your profile">
      <div className="profilecard__cover">{m.cover ? <Pic k={m.cover} sizes="240px" /> : <CoverPattern color={m.color} />}</div>
      <a className="profilecard__face" href={PAGES.profile} tabIndex={-1} aria-hidden="true"><Avatar m={m} size={96} frame={framed(m)} /></a>
      <p className="profilecard__name"><a href={PAGES.profile}>{fullName(m)}</a></p>
      <p className="profilecard__headline">{m.headline}</p>
      <p className="profilecard__place">{m.place}</p>
      <ul className="profilecard__stats">
        <li><a href={`${PAGES.profile}#analytics`}><span>Profile viewers</span><strong>47</strong></a></li>
        <li><a href={`${PAGES.profile}#analytics`}><span>Post impressions</span><strong>312</strong></a></li>
        <li><a href={PAGES.assessments}><span>Skill badges</span><strong>{badges}</strong></a></li>
      </ul>
      <p className="profilecard__premium"><span><Icon name="premium" size={16} /> Try GIFin Premium for $0</span></p>
      <ul className="profilecard__links" id="saved">
        <li><a href="#saved-items"><Icon name="bookmark" size={18} />Saved items<span className="profilecard__n">{saved}</span></a></li>
        <li><span><Icon name="people" size={18} />Groups</span></li>
        <li><a href="#events"><Icon name="calendar" size={18} />Events<span className="profilecard__n">{going}</span></a></li>
      </ul>
    </section>
  );
}

function SavedAndEvents() {
  const s = social.use();
  const saved = POSTS.filter((p) => s.saved[p.id]);
  const going = POSTS.filter((p) => s.going[p.id]);
  return (
    <>
      <section className="railcard" id="saved-items" aria-label="Saved items">
        <h2 className="railcard__title">Saved items</h2>
        {saved.length ? <ul className="minilist">{saved.map((p) => <li key={p.id}><a href={`#post-${p.id}`}>{fullName(member(p.author)!)}: {p.text.slice(0, 60)}…</a></li>)}</ul> : <p className="note">Save a post from its ⋯ menu and it shows here.</p>}
      </section>
      <section className="railcard" id="events" aria-label="Your events">
        <h2 className="railcard__title">Events</h2>
        {going.length ? <ul className="minilist">{going.map((p) => <li key={p.id}><a href={`#post-${p.id}`}>{p.event!.title}</a> · {p.event!.when}</li>)}</ul> : <p className="note">Events you attend show here.</p>}
      </section>
    </>
  );
}

function News() {
  const [all, setAll] = useState(false);
  return (
    <Section title="GIFin News" aside={<Icon name="info" size={18} />}>
      <p className="railcard__sub">Top stories</p>
      <ul className="news">{(all ? NEWS : NEWS.slice(0, 4)).map((n) => <li key={n.title}><span className="news__title">{n.title}</span><span className="news__meta">{n.ago} · {n.readers.toLocaleString("en-US")} readers</span></li>)}</ul>
      <button type="button" className="textbtn" aria-expanded={all} onClick={() => setAll(!all)}>{all ? "Show less" : "Show more"}<Icon name="chevron" size={16} /></button>
    </Section>
  );
}

function AddToFeed() {
  return (
    <Section title="Add to your feed" aside={<Icon name="info" size={18} />}>
      <ul className="suggest">
        {SUGGESTIONS.map((id) => { const m = member(id)!; return (
          <li key={id}>
            <a href={profileHref(id)} tabIndex={-1} aria-hidden="true"><Avatar m={m} size={64} /></a>
            <div><a href={profileHref(id)}><strong>{fullName(m)}</strong></a><p>{m.headline}</p><FollowButton id={id} /></div>
          </li>
        ); })}
      </ul>
    </Section>
  );
}

function Feed() {
  const own = ownPosts.use();
  const st = settings.use();
  const [sort, setSort] = useState(st.feedSort);
  const [said, setSaid] = useState("");
  useEffect(() => setSort(st.feedSort), [st.feedSort]);
  const items: Item[] = useMemo(() => {
    const mine = own.map(itemFromOwn);
    const all = [...mine, ...POSTS.map((post) => ({ post }))];
    return sort === "recent" ? all.sort((a, b) => a.post.minutes - b.post.minutes) : all;
  }, [own, sort]);
  return (
    <>
      <Composer onPosted={() => { setSaid("Your post is at the top of your feed."); requestAnimationFrame(() => document.querySelector(".postwrap")?.scrollIntoView({ block: "start" })); }} />
      <p className="visually-hidden" role="status">{said}</p>
      <div className="feedsort">
        <hr aria-hidden="true" />
        <label>Sort by:
          <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}><option value="top">Top</option><option value="recent">Recent</option></select>
        </label>
      </div>
      <h1 className="visually-hidden">Your feed</h1>
      {items.map((it, i) => <PostBand key={it.post.id} item={it} index={i} />)}
      <p className="feedend">You're all caught up.</p>
    </>
  );
}

function App() {
  return (
    <Page current={PAGES.feed} source={[REFERENCE.feed]}>
      <Rails left={<><ProfileCard /><SavedAndEvents /></>} right={<><AddToFeed /><News /><RailFooter /></>}>
        <Feed />
      </Rails>
    </Page>
  );
}
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
