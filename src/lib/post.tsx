import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { GridBand, type Cell } from "../bands/bands";
import { ExpandedCell, type ExpandGroup } from "./expand";
import { Fit } from "./fit";
import { FactStrip, PhotoCard, Pic } from "./cards";
import { Avatar } from "./people";
import { Icon, ReactionGlyph } from "../icons";
import { CONNECTED, ME, MEMBERS, POSTS, REACTIONS, STOCK, followedAtStart, fullName, member, profileHref, type Comment, type Member, type Post, type Reaction, framed } from "../content";
import { me, ownPosts, social, toggle, useMember, type OwnPost } from "./store";
import { photo } from "../photos";

/**
 * A post, as a golden grid. The reference sets a post as one card: the
 * author's line, the text, the picture, a line of counts and a bar of
 * actions. Here the picture (or the poll, the event, the milestone, or for a
 * post of words alone the words) takes the largest square, the words and the
 * author the next, and the counts of reactions and comments the smallest,
 * set as figures. Under the grid the action bar and its panels are flat:
 * Like with a picker of six reactions, Comment, Repost and Send each open in
 * the flow beneath the post, and a menu saves, hides or unfollows.
 */

const firstSentence = (t: string) => { const m = t.match(/^.*?[.?!](?=\s|$)/); return m ? m[0] : t; };

export function ago(at: number) {
  const m = Math.max(0, Math.round((Date.now() - at) / 60000));
  if (m < 1) return "Now";
  if (m < 60) return `${m}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  if (m < 10080) return `${Math.floor(m / 1440)}d`;
  return `${Math.floor(m / 10080)}w`;
}

export function useFollowing(id: string) {
  const s = social.use();
  return id in s.follows ? s.follows[id] : followedAtStart(id);
}
export function setFollowing(id: string, on: boolean) {
  social.set((s) => ({ ...s, follows: { ...s.follows, [id]: on } }));
}

export function FollowButton({ id, compact }: { id: string; compact?: boolean }) {
  const on = useFollowing(id);
  const m = member(id)!;
  return (
    <button type="button" className={`textbtn textbtn--blue${on ? " is-on" : ""}`} aria-pressed={on} aria-label={`${on ? "Following" : "Follow"} ${fullName(m)}`} onClick={() => setFollowing(id, !on)}>
      {on ? <><Icon name="check" size={16} />{compact ? "" : "Following"}</> : <><Icon name="plus" size={16} />Follow</>}
    </button>
  );
}

/** The author's square: avatar, name, headline, time and visibility, and Follow. */
function AuthorBox({ m, when, own }: { m: Member; when: string; own?: boolean }) {
  return (
    <div className="box box--author">
      <a className="author__face" href={profileHref(m.id)} tabIndex={-1} aria-hidden="true"><Avatar m={m} size={64} frame={framed(m)} /></a>
      <div className="author__text">
        <p className="author__name"><a href={profileHref(m.id)}>{fullName(m)}</a>{!own && <span className="author__degree"> · {CONNECTED.has(m.id) ? "1st" : "2nd"}</span>}</p>
        <p className="author__headline">{m.headline}</p>
        <p className="author__when">{when} · <Icon name="globe" size={14} /><span className="visually-hidden">Visible to anyone</span></p>
      </div>
      {!own && <div className="author__follow"><FollowButton id={m.id} /></div>}
    </div>
  );
}

/** The words of a post, with "…more" opening the whole of them. */
function TextBox({ text, x, slotKey, title, lead }: { text: string; x: ExpandGroup; slotKey: string; title: string; lead?: boolean }) {
  const paras = text.split("\n\n");
  return (
    <>
      <div className={`box box--words${lead ? " box--lead" : ""}`}>
        {/* Three lengths of the same post; the square's size picks one, and nothing is cut. "…more" opens all of it. */}
        <div className="visually-hidden">{paras.map((p, i) => <p key={i}>{p}</p>)}</div>
        <div className="box__body words words--all" aria-hidden="true"><Fit as="div" className="fit--body fit--words" min={12} max={lead ? 28 : 20}>{paras.map((p, i) => <p key={i}>{p}</p>)}</Fit></div>
        <div className="box__body words words--para" aria-hidden="true"><Fit as="div" className="fit--body fit--words" min={12} max={lead ? 28 : 20}><p>{paras[0]}</p></Fit></div>
        <div className="box__body words words--line" aria-hidden="true"><Fit as="div" className="fit--body fit--words" min={12} max={lead ? 28 : 20}><p>{firstSentence(paras[0])}</p></Fit></div>
        <div className="box__foot"><button className="more" aria-label={`Read all of the post: ${title}`} {...x.triggerProps(slotKey)}>…more</button></div>
      </div>
      {x.isOpen(slotKey) && (
        <ExpandedCell id={x.panelId(slotKey)} title={title} onClose={x.close} closeRef={x.closeRef}>
          <div className="cell__prose">{paras.map((p, i) => <p key={i}>{p.split("\n").map((l, j) => <span key={j}>{l}{j < p.split("\n").length - 1 && <br />}</span>)}</p>)}</div>
        </ExpandedCell>
      )}
    </>
  );
}

function Poll({ post }: { post: Post }) {
  const s = social.use();
  const voted = s.votes[post.id];
  const poll = post.poll!;
  const total = poll.options.reduce((n, o) => n + o.votes, 0) + (voted != null ? 1 : 0);
  const vote = (i: number | null) => social.set((v) => { const votes = { ...v.votes }; if (i == null) delete votes[post.id]; else votes[post.id] = i; return { ...v, votes }; });
  return (
    <div className="box box--poll" role="group" aria-label={`Poll: ${poll.question}`}>
      <p className="poll__q">{poll.question}</p>
      <p className="poll__note">The author can see how you vote.</p>
      <ul className="poll__options">
        {poll.options.map((o, i) => {
          const n = o.votes + (voted === i ? 1 : 0);
          const pct = Math.round((n / total) * 100);
          return (
            <li key={o.label}>
              {voted == null
                ? <button type="button" className="poll__opt" onClick={() => vote(i)}>{o.label}</button>
                : <span className={`poll__bar${voted === i ? " is-mine" : ""}`}><span className="poll__fill" style={{ width: `${pct}%` }} /><span className="poll__label">{o.label}{voted === i && <Icon name="check" size={16} />}</span><span className="poll__pct">{pct}%</span></span>}
            </li>
          );
        })}
      </ul>
      <p className="poll__foot"><span role="status">{total.toLocaleString("en-US")} votes · {poll.left}</span>{voted != null && <button type="button" className="textbtn" onClick={() => vote(null)}>Undo</button>}</p>
    </div>
  );
}

function EventBox({ post }: { post: Post }) {
  const s = social.use();
  const on = Boolean(s.going[post.id]);
  const e = post.event!;
  return (
    <div className="box box--event">
      <p className="event__when"><Icon name="calendar" size={20} />{e.when}</p>
      <p className="event__title">{e.title}</p>
      <p className="event__place">{e.place}</p>
      <p className="event__going">{(e.going + (on ? 1 : 0)).toLocaleString("en-US")} attendees</p>
      <p className="event__act"><button type="button" className={`btn ${on ? "btn--outline" : "btn--blue"}`} aria-pressed={on} onClick={() => toggle("going", post.id)}>{on ? <><Icon name="check" size={16} />Attending</> : "Attend"}</button></p>
    </div>
  );
}

function Milestone({ post, onCongrats }: { post: Post; onCongrats: () => void }) {
  const ms = post.milestone!;
  return (
    <div className="box box--milestone">
      <span className="milestone__icon" aria-hidden="true"><Icon name="badge" size={40} /></span>
      <p className="milestone__title">{ms.title}</p>
      <p className="milestone__detail">{ms.detail}</p>
      <p className="milestone__act"><button type="button" className="btn btn--outline" onClick={onCongrats}>Say congratulations</button></p>
    </div>
  );
}

/** One feed item, as the reader sees it: a catalogue post, or one of their own. */
export interface Item { post: Post; own?: OwnPost; repostOf?: Post }

export function itemFromOwn(o: OwnPost): Item {
  const repostOf = o.repostOf ? POSTS.find((p) => p.id === o.repostOf) : undefined;
  return {
    own: o, repostOf,
    post: { id: o.id, author: ME, ago: ago(o.at), minutes: (Date.now() - o.at) / 60000, kind: o.photo ? "photo" : "text", photo: o.photo, text: o.text, reactions: {}, reposts: 0, comments: [] },
  };
}

type Panel = "comments" | "repost" | "send" | null;

export function PostBand({ item, index }: { item: Item; index: number }) {
  const { post, own, repostOf } = item;
  const author = useMember(post.author)!;
  const meNow = me.use();
  const s = social.use();
  const [panel, setPanel] = useState<Panel>(null);
  const [picker, setPicker] = useState(false);
  const [menu, setMenu] = useState(false);
  const [said, setSaid] = useState("");
  const [draft, setDraft] = useState("");
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const base = useId();
  const mine = s.reactions[post.id];
  const counts = { ...post.reactions } as Record<Reaction, number>;
  if (mine) counts[mine] = (counts[mine] ?? 0) + 1;
  const total = Object.values(counts).reduce((n, v) => n + (v ?? 0), 0);
  const top = REACTIONS.filter((r) => counts[r.id]).sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0)).slice(0, 3);
  const added = s.comments[post.id] ?? [];
  // The reader's own comments come first, newest at the top, as the reference shows them.
  const comments = [...[...added].reverse(), ...post.comments];
  const title = `Post by ${fullName(author)}`;

  useEffect(() => { if (panel === "comments") commentRef.current?.focus(); }, [panel]);

  const react = (r: Reaction | null) => {
    social.set((v) => { const reactions = { ...v.reactions }; if (!r || reactions[post.id] === r) delete reactions[post.id]; else reactions[post.id] = r; return { ...v, reactions }; });
    setPicker(false);
  };
  const addComment = () => {
    const t = draft.trim(); if (!t) return;
    const cm: Comment = { id: `mine-${Date.now()}`, author: ME, ago: "Now", text: t, likes: 0 };
    social.set((v) => ({ ...v, comments: { ...v.comments, [post.id]: [...(v.comments[post.id] ?? []), cm] } }));
    setDraft(""); setSaid("Your comment was added.");
  };

  if (s.hidden[post.id]) {
    return (
      <section className="band band--hidden" aria-label={`${title}, hidden`}>
        <div className="wrap hiddenpost"><p>Post removed from your feed. You'll see fewer posts like this.</p><button type="button" className="btn btn--outline" onClick={() => toggle("hidden", post.id, false)}>Undo</button></div>
      </section>
    );
  }

  const hasMedia = post.kind !== "text";
  const words: Cell = (x, key) => <TextBox text={post.text} x={x} slotKey={key} title={title} lead={!hasMedia && !repostOf} />;
  const lead: Cell =
    post.kind === "photo" && post.photo ? (x, key) => <PhotoCard k={post.photo!} title={`${title}: the photograph`} x={x} slotKey={key} />
    : post.kind === "poll" ? () => <Poll post={post} />
    : post.kind === "event" ? () => <EventBox post={post} />
    : post.kind === "milestone" ? () => <Milestone post={post} onCongrats={() => { setDraft(`Congratulations, ${author.first}!`); setPanel("comments"); }} />
    : words;
  const cells: Cell[] = [];
  if (repostOf) {
    const orig = member(repostOf.author)!;
    cells.push(() => (
      <div className="box box--repost">
        <p className="repost__by"><Avatar m={orig} size={28} /> <a href={profileHref(orig.id)}>{fullName(orig)}</a></p>
        {repostOf.photo && <div className="repost__pic"><Pic k={repostOf.photo} sizes="40vw" /></div>}
        <div className="box__body"><Fit as="div" className="fit--body" min={12} max={20}><p>{repostOf.text.split("\n\n")[0]}</p></Fit></div>
      </div>
    ));
    if (post.text) cells.push(words);
  } else {
    cells.push(lead);
    if (hasMedia) cells.push(words);
  }
  cells.push(() => <AuthorBox m={author} when={post.ago} own={post.author === ME} />);
  // One square of counts: the reactions as the figure, the comments and reposts beneath it.
  cells.push((_x, _k, flat) => {
    const f = { line: total.toLocaleString("en-US"), label: total === 1 ? "Reaction" : "Reactions", tone: "tile" as const };
    const rest = `${comments.length.toLocaleString("en-US")} ${comments.length === 1 ? "comment" : "comments"} · ${post.reposts.toLocaleString("en-US")} ${post.reposts === 1 ? "repost" : "reposts"}`;
    return flat ? <FactStrip f={f} /> : (
      <div className="box box--figure">
        <p className="figure__glyphs" role="img" aria-label={top.length ? `Mostly ${top.map((r) => r.label).join(", ")}` : "No reactions yet"}>{top.map((r) => <ReactionGlyph key={r.id} id={r.id} color={r.color} />)}</p>
        <div className="box__fit"><Fit as="p" className="fit--display fit--num" min={12} max={80} ariaLabel={`${f.line} ${f.label.toLowerCase()}`}>{f.line}</Fit></div>
        <p className="figure__rest">{rest}</p>
      </div>
    );
  });

  const saved = Boolean(s.saved[post.id]);
  const following = s.follows[post.author] ?? followedAtStart(post.author);
  const context = repostOf ? `${fullName(meNow)} reposted this` : !following && post.author !== ME ? "Suggested" : null;

  const before = (
    <div className="post__top">
      <p className="post__context">{context}</p>
      <div className="post__menu">
        <button type="button" className="iconbtn" aria-expanded={menu} aria-controls={`${base}menu`} aria-label={`More actions for the ${title.toLowerCase()}`} onClick={() => setMenu(!menu)}><Icon name="more" size={20} stroke={3} /></button>
        {post.author !== ME && <button type="button" className="iconbtn" aria-label={`Hide the ${title.toLowerCase()}`} onClick={() => toggle("hidden", post.id, true)}><Icon name="close" size={20} /></button>}
        {menu && (
          <ul className="menu" id={`${base}menu`}>
            <li><button type="button" onClick={() => { toggle("saved", post.id); setMenu(false); setSaid(saved ? "Removed from your saved items." : "Saved. Find it under Saved items on your profile card."); }}><Icon name="bookmark" size={18} filled={saved} />{saved ? "Unsave" : "Save"}</button></li>
            <li><button type="button" onClick={() => { const url = `${location.origin}${location.pathname}#post-${post.id}`; navigator.clipboard?.writeText(url).then(() => setSaid("Link copied to the clipboard."), () => setSaid(`Link: ${url}`)); setMenu(false); }}><Icon name="link" size={18} />Copy link to post</button></li>
            {post.author !== ME && <li><button type="button" onClick={() => { setFollowing(post.author, !following); setMenu(false); setSaid(following ? `You unfollowed ${fullName(author)}.` : `You're following ${fullName(author)}.`); }}><Icon name={following ? "close" : "plus"} size={18} />{following ? `Unfollow ${fullName(author)}` : `Follow ${fullName(author)}`}</button></li>}
            {post.author !== ME && <li><button type="button" onClick={() => toggle("hidden", post.id, true)}><Icon name="eye" size={18} />Not interested</button></li>}
            {own && <li><button type="button" onClick={() => ownPosts.set((l) => l.filter((o) => o.id !== own.id))}><Icon name="trash" size={18} />Delete post</button></li>}
          </ul>
        )}
      </div>
    </div>
  );

  const after = (
    <div className="post__social">
      <div className="actions" role="group" aria-label={`Actions for the ${title.toLowerCase()}`}>
        <span className="actions__like">
          <button type="button" className={`action${mine ? " is-on" : ""}`} aria-pressed={Boolean(mine)} onClick={() => react(mine ? null : "like")} style={mine ? { color: REACTIONS.find((r) => r.id === mine)!.color } : undefined}>
            {mine ? <ReactionGlyph id={mine} color={REACTIONS.find((r) => r.id === mine)!.color} size={20} /> : <Icon name="like" size={20} />}
            <span>{mine ? REACTIONS.find((r) => r.id === mine)!.label : "Like"}</span>
          </button>
          <button type="button" className="action action--more" aria-expanded={picker} aria-controls={`${base}picker`} aria-label="Choose a reaction" onClick={() => setPicker(!picker)}><Icon name="chevron" size={16} /></button>
          {picker && (
            <span className="picker" id={`${base}picker`} role="group" aria-label="Reactions">
              {REACTIONS.map((r) => <button key={r.id} type="button" className="picker__r" aria-pressed={mine === r.id} aria-label={r.label} title={r.label} onClick={() => react(r.id)}><ReactionGlyph id={r.id} color={r.color} size={32} /></button>)}
            </span>
          )}
        </span>
        <button type="button" className={`action${panel === "comments" ? " is-open" : ""}`} aria-expanded={panel === "comments"} onClick={() => setPanel(panel === "comments" ? null : "comments")}><Icon name="comment" size={20} /><span>Comment</span></button>
        <button type="button" className={`action${panel === "repost" ? " is-open" : ""}`} aria-expanded={panel === "repost"} onClick={() => setPanel(panel === "repost" ? null : "repost")}><Icon name="repost" size={20} /><span>Repost</span></button>
        <button type="button" className={`action${panel === "send" ? " is-open" : ""}`} aria-expanded={panel === "send"} onClick={() => setPanel(panel === "send" ? null : "send")}><Icon name="send" size={20} /><span>Send</span></button>
      </div>
      <p className="post__said" role="status">{said}</p>
      {panel === "comments" && (
        <div className="panel">
          <form className="commentform" onSubmit={(e) => { e.preventDefault(); addComment(); }}>
            <Avatar m={meNow} size={40} />
            <label className="visually-hidden" htmlFor={`${base}c`}>Add a comment</label>
            <textarea id={`${base}c`} ref={commentRef} rows={2} placeholder="Add a comment…" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={1250} />
            <button type="submit" className="btn btn--blue" disabled={!draft.trim()}>Comment</button>
          </form>
          <CommentList postId={post.id} comments={comments} onReply={(name) => { setDraft(`${name} `); commentRef.current?.focus(); }} />
        </div>
      )}
      {panel === "repost" && <RepostPanel post={post} onDone={(t) => { setPanel(null); setSaid(t); }} />}
      {panel === "send" && <SendPanel post={post} onDone={(t) => { setPanel(null); setSaid(t); }} />}
    </div>
  );

  return (
    <div className="postwrap" id={`post-${post.id}`}>
      <GridBand id={`p-${post.id}`} title={title} quiet variant={index} lead={index % 3 === 1} cells={cells} before={before} after={after} />
    </div>
  );
}

function CommentList({ postId, comments, onReply }: { postId: string; comments: Comment[]; onReply: (name: string) => void }) {
  const s = social.use();
  const [all, setAll] = useState(false);
  const shown = all ? comments : comments.slice(0, 3);
  return (
    <>
      <ul className="comments">
        {shown.map((c) => {
          const a = c.author === ME ? me.get() : member(c.author)!;
          const key = `${postId}/${c.id}`;
          const liked = Boolean(s.likedComments[key]);
          return (
            <li key={c.id} className="comment">
              <a href={profileHref(a.id)} tabIndex={-1} aria-hidden="true"><Avatar m={a} size={40} /></a>
              <div className="comment__body">
                <p className="comment__head"><a href={profileHref(a.id)}><strong>{fullName(a)}</strong></a><span className="comment__ago">{c.ago}</span></p>
                <p className="comment__headline">{a.headline}</p>
                <p className="comment__text">{c.text}</p>
                <p className="comment__acts">
                  <button type="button" className="textbtn" aria-pressed={liked} onClick={() => toggle("likedComments", key)}>{liked ? "Liked" : "Like"}</button>
                  {c.likes + (liked ? 1 : 0) > 0 && <span className="comment__likes">{c.likes + (liked ? 1 : 0)}</span>}
                  <span aria-hidden="true">|</span>
                  <button type="button" className="textbtn" onClick={() => onReply(fullName(a))}>Reply<span className="visually-hidden"> to {fullName(a)}</span></button>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {comments.length > 3 && !all && <button type="button" className="textbtn" onClick={() => setAll(true)}>Load {comments.length - 3} more {comments.length - 3 === 1 ? "comment" : "comments"}</button>}
    </>
  );
}

function RepostPanel({ post, onDone }: { post: Post; onDone: (t: string) => void }) {
  const [thoughts, setThoughts] = useState(false);
  const [text, setText] = useState("");
  const id = useId();
  const go = (t: string) => {
    ownPosts.set((l) => [{ id: `own-${Date.now()}`, text: t, audience: "anyone", at: Date.now(), repostOf: post.id }, ...l]);
    onDone(t ? "Reposted with your thoughts. It's at the top of your feed." : "Reposted. It's at the top of your feed.");
  };
  return (
    <div className="panel panel--repost">
      {!thoughts ? (
        <ul className="choices">
          <li><button type="button" onClick={() => setThoughts(true)}><Icon name="pencil" size={20} /><span><strong>Repost with your thoughts</strong>Create a new post with this post attached</span></button></li>
          <li><button type="button" onClick={() => go("")}><Icon name="repost" size={20} /><span><strong>Repost</strong>Instantly bring this post to others' feeds</span></button></li>
        </ul>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); go(text.trim()); }}>
          <label htmlFor={`${id}t`} className="label">Your thoughts</label>
          <textarea id={`${id}t`} rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder="Start writing or use @ to mention people" maxLength={3000} />
          <p className="row"><button type="submit" className="btn btn--blue" disabled={!text.trim()}>Post</button><button type="button" className="btn btn--outline" onClick={() => setThoughts(false)}>Back</button></p>
        </form>
      )}
    </div>
  );
}

function SendPanel({ post, onDone }: { post: Post; onDone: (t: string) => void }) {
  const [q, setQ] = useState("");
  const [to, setTo] = useState<string[]>([]);
  const [msg, setMsg] = useState("");
  const id = useId();
  const people = MEMBERS.filter((m) => CONNECTED.has(m.id) && m.id !== post.author && fullName(m).toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <form className="panel panel--send" onSubmit={(e) => {
      e.preventDefault(); if (!to.length) return;
      social.set((v) => ({ ...v, sent: { ...v.sent, [`${post.id}-${Date.now()}`]: { to, at: Date.now() } } }));
      const names = to.map((t) => fullName(member(t)!));
      onDone(`Sent to ${names.length > 2 ? `${names[0]} and ${names.length - 1} others` : names.join(" and ")}. Nothing leaves this browser.`);
    }}>
      <label htmlFor={`${id}q`} className="label">Send to your connections</label>
      <input id={`${id}q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a name" autoComplete="off" />
      <fieldset className="sendlist">
        <legend className="visually-hidden">Connections</legend>
        {people.slice(0, 6).map((m) => (
          <label key={m.id} className="sendlist__row"><Avatar m={m} size={36} /><span><strong>{fullName(m)}</strong><small>{m.headline}</small></span><input type="checkbox" checked={to.includes(m.id)} onChange={() => setTo((v) => (v.includes(m.id) ? v.filter((i) => i !== m.id) : [...v, m.id]))} /></label>
        ))}
        {!people.length && <p className="note">No connection by that name.</p>}
      </fieldset>
      <label htmlFor={`${id}m`} className="label">Message (optional)</label>
      <textarea id={`${id}m`} rows={2} value={msg} onChange={(e) => setMsg(e.target.value)} maxLength={500} />
      <p className="row"><button type="submit" className="btn btn--blue" disabled={!to.length}>Send{to.length > 1 ? ` to ${to.length}` : ""}</button><span className="note">Messages send nothing.</span></p>
    </form>
  );
}

/** Start a post: the reference's box at the top of the feed, opened in place. */
export function Composer({ onPosted }: { onPosted: (id: string) => void }) {
  const meNow = me.use();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [pic, setPic] = useState<string | null>(null);
  const [aud, setAud] = useState<OwnPost["audience"]>("anyone");
  const ref = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  const post = () => {
    const t = text.trim(); if (!t) return;
    const pid = `own-${Date.now()}`;
    ownPosts.set((l) => [{ id: pid, text: t, photo: pic ?? undefined, audience: aud, at: Date.now() }, ...l]);
    setText(""); setPic(null); setOpen(false); onPosted(pid);
  };
  return (
    <section className="composer" aria-label="Start a post">
      {!open ? (
        <>
          <div className="composer__row">
            <a href={profileHref(ME)} tabIndex={-1} aria-hidden="true"><Avatar m={meNow} size={48} frame={framed(meNow)} /></a>
            <button type="button" className="composer__start" onClick={() => setOpen(true)}>Start a post</button>
          </div>
          <div className="composer__kinds">
            <button type="button" className="kind" onClick={() => { setOpen(true); setPic(STOCK[0]); }}><Icon name="image" size={22} className="kind--media" />Media</button>
            <span className="kind kind--show"><Icon name="briefcase" size={22} className="kind--job" />Job</span>
            <span className="kind kind--show"><Icon name="pencil" size={22} className="kind--article" />Write article</span>
          </div>
        </>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); post(); }} className="composer__form">
          <div className="composer__who">
            <Avatar m={meNow} size={48} />
            <div><strong>{fullName(meNow)}</strong>
              <label className="composer__aud"><span className="visually-hidden">Who can see this post</span>
                <select value={aud} onChange={(e) => setAud(e.target.value as OwnPost["audience"])}><option value="anyone">Post to Anyone</option><option value="connections">Connections only</option></select>
              </label>
            </div>
          </div>
          <label htmlFor={`${id}t`} className="visually-hidden">What do you want to talk about?</label>
          <textarea id={`${id}t`} ref={ref} rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="What do you want to talk about?" maxLength={3000} />
          <p className="composer__count" aria-live="polite">{text.length.toLocaleString("en-US")} / 3,000</p>
          <fieldset className="composer__pics">
            <legend>Add a photograph</legend>
            <label className={`pickpic${pic === null ? " is-on" : ""}`}><input type="radio" name={`${id}pic`} checked={pic === null} onChange={() => setPic(null)} /><span className="pickpic__none">None</span></label>
            {STOCK.map((k) => (
              <label key={k} className={`pickpic${pic === k ? " is-on" : ""}`}><input type="radio" name={`${id}pic`} checked={pic === k} onChange={() => setPic(k)} /><span className="pickpic__img"><Pic k={k} sizes="96px" /></span><span className="visually-hidden">{photo(k).alt}</span></label>
            ))}
          </fieldset>
          <p className="row"><button type="submit" className="btn btn--blue" disabled={!text.trim()}>Post</button><button type="button" className="btn btn--outline" onClick={() => setOpen(false)}>Cancel</button><span className="note">Your post stays in this browser.</span></p>
        </form>
      )}
    </section>
  );
}

export function Section({ title, children, aside, id }: { title: string; children: ReactNode; aside?: ReactNode; id?: string }) {
  const h = useId();
  return (
    <section className="railcard" aria-labelledby={`${h}t`} id={id}>
      <header className="railcard__head"><h2 id={`${h}t`}>{title}</h2>{aside}</header>
      {children}
    </section>
  );
}
