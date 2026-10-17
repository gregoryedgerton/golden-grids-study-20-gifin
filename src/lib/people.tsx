import { useId, type CSSProperties } from "react";
import { initials, type Member, type Mood } from "../content";

const BASE = import.meta.env.BASE_URL;

/**
 * A member's avatar: a photograph of the fruit or vegetable itself, cropped
 * square (captures/avatars.py), with googly eyes on top. A member with no
 * photograph, or a reader who has none, gets their initials on a ground of
 * their own colour. A member who is open to work wears the reference's green
 * frame with the words along it, drawn as a ring and a curved line of type.
 */
export function Avatar({ m, size = 48, frame, label, mood }: { m: Pick<Member, "first" | "last" | "color"> & Partial<Pick<Member, "id" | "photo" | "eyes" | "mood">>; size?: number; frame?: "open" | "hiring"; label?: string; mood?: Mood }) {
  const id = useId().replace(/:/g, "");
  const text = initials(m);
  return (
    <span className={`avatar${frame ? ` avatar--${frame}` : ""}`} style={{ ["--size" as string]: `${size}px` } as CSSProperties} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <svg viewBox="0 0 100 100" focusable="false" aria-hidden="true">
        {m.photo ? (
          <>
            <clipPath id={`clip${id}`}><circle cx="50" cy="50" r="50" /></clipPath>
            <circle cx="50" cy="50" r="50" fill={m.color} />
            <image href={`${BASE}assets/s19-${m.photo}-avatar.jpg`} width="100" height="100" clipPath={`url(#clip${id})`} preserveAspectRatio="xMidYMid slice" />
          </>
        ) : (
          <>
            <circle cx="50" cy="50" r="50" fill={m.color} />
            <text x="50" y="50" dy="0.35em" textAnchor="middle" fill="#fff" fontSize={text.length > 1 ? 38 : 44} fontWeight="600" fontFamily="var(--font)">{text}</text>
          </>
        )}
        {frame && (
          <>
            <path id={`arc${id}`} d="M 9 50 A 41 41 0 0 0 91 50" fill="none" />
            <circle cx="50" cy="50" r="45" fill="none" stroke={frame === "open" ? "#3a7d30" : "#6a3fa5"} strokeWidth="10" strokeDasharray="160 400" strokeDashoffset="-42" />
            {size >= 56 && <text fontSize="9.5" fontWeight="700" fill="#fff" letterSpacing="0.6"><textPath href={`#arc${id}`} startOffset="50%" textAnchor="middle">{frame === "open" ? "#OPENTOWORK" : "#HIRING"}</textPath></text>}
          </>
        )}
      </svg>
      {m.photo && <Eyes at={m.eyes ?? [0.5, 0.45, 0.2, 0.24]} mood={mood ?? m.mood ?? "happy"} lid={m.color} seed={m.id ?? m.first} />}
    </span>
  );
}

/**
 * Googly eyes, drawn in CSS over the photograph so that they can move: the
 * pupils wobble about and the lids blink, each pair on its own clock. The
 * mood sets the resting look (lids, brows, where the pupils settle) to match
 * the post or comment beside the face. With reduced motion, from the system
 * or the study's tools, the eyes hold still in that resting look.
 */
function Eyes({ at: [x, y, s, gap], mood, lid, seed }: { at: [number, number, number, number]; mood: Mood; lid: string; seed: string }) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 997;
  const style = {
    "--ex": x, "--ey": y, "--es": s, "--eg": gap, "--lid-c": lid,
    "--d": `${-(h % 40) / 10}s`, "--t": `${2.6 + (h % 9) / 10}s`, "--b": `${4 + (h % 5)}s`,
  } as CSSProperties;
  return (
    <span className={`eyes eyes--${mood}`} style={style} aria-hidden="true">
      <span className="eye eye--l"><span className="eye__pupil" /><span className="eye__lid" /><span className="eye__low" /></span>
      <span className="eye eye--r"><span className="eye__pupil" /><span className="eye__lid" /><span className="eye__low" /></span>
    </span>
  );
}

/** A company's mark, drawn: its initials on a square of a colour from its name. */
export function CompanyLogo({ name, size = 48 }: { name: string; size?: number }) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  const letters = name.replace(/\(.*\)/, "").split(/\s+/).filter((w) => /^[A-Za-zÀ-ž]/.test(w) && !/^(of|the|and|a|an|led|by)$/i.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  return (
    <svg className="logo" viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="4" fill={`hsl(${h} 32% 92%)`} />
      <text x="24" y="24" dy="0.36em" textAnchor="middle" fontSize="18" fontWeight="700" fill={`hsl(${h} 45% 28%)`} fontFamily="var(--font)">{letters || "·"}</text>
    </svg>
  );
}

/** The default cover, drawn: a quiet field of lines in the member's colour, for a member with no photograph. */
export function CoverPattern({ color }: { color: string }) {
  return (
    <svg className="cover__pattern" viewBox="0 0 400 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <rect width="400" height="100" fill={color} opacity="0.18" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 40 - 60} 100 L${i * 40 + 40} 0`} stroke={color} strokeOpacity="0.28" strokeWidth="14" />)}
    </svg>
  );
}
