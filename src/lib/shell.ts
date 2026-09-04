/**
 * The command set for the interactive shell.
 *
 * Output is built as structured tokens (not raw HTML) so the same
 * definitions can be rendered on the server (for the no-JS transcript)
 * and in the browser without any XSS surface. `echo` is the only command
 * that reflects user input, and its text goes through the same escaping
 * path as everything else.
 */
import {
  profile,
  education,
  experience,
  skills,
  projects,
  system,
} from '../data/site';

export type Seg = { t: string; c?: string };
export type Line = string | Seg[];

const s = (t: string, c?: string): Seg => ({ t, c });
const blank: Line = '';

/** `patrik@barsi.xyz:~$` as coloured segments. */
export function promptSegs(path = '~'): Seg[] {
  return [
    s(profile.handle, 'u'),
    s('@', 's'),
    s(profile.host, 'h'),
    s(':', 's'),
    s(path, 'p'),
    s('$ ', 's'),
  ];
}

export type CommandResult = { lines: Line[]; nav?: string; clear?: boolean };

type Command = {
  name: string;
  desc: string;
  aliases?: string[];
  hidden?: boolean;
  run: (args: string[]) => CommandResult;
};

const ok = (lines: Line[]): CommandResult => ({ lines });

/* ----------------------------------------------------------------
   individual command bodies
   ---------------------------------------------------------------- */

export function aboutLines(): Line[] {
  return [
    [s('ABOUT', 'c-heading')],
    blank,
    [s(`${profile.name} — ${profile.role}`, 'c-cmd')],
    [s(profile.location, 'c-dim')],
    blank,
    ...wrap(profile.summary),
    blank,
    [s('# ', 'c-comment'), s('type ', 'c-comment'), s('skills', 'c-key'), s(', ', 'c-comment'), s('projects', 'c-key'), s(' or ', 'c-comment'), s('experience', 'c-key'), s(' to dig in', 'c-comment')],
  ];
}

export function whoamiLines(): Line[] {
  return [
    [s(profile.name, 'c-cmd'), s('  ·  ', 'c-muted'), s(profile.role, 'c-dim')],
    [s(profile.tagline, 'c-muted')],
  ];
}

export function experienceLines(): Line[] {
  const out: Line[] = [[s('EXPERIENCE', 'c-heading')], blank];
  experience.forEach((job, i) => {
    if (i > 0) out.push(blank);
    out.push([
      s(job.role, 'c-cmd'),
      s(' @ ', 'c-muted'),
      s(job.company, 'c-accent'),
    ]);
    out.push([
      s(`${job.start} – ${job.end}`, 'c-num'),
      s('  ·  ', 'c-muted'),
      s(job.location, 'c-dim'),
    ]);
    job.highlights.forEach((h) => out.push([s('  › ', 'c-muted'), s(h, 'c-dim')]));
    out.push([s('  stack: ', 'c-muted'), s(job.stack.join(', '), 'c-flag')]);
  });
  return out;
}

export function educationLines(): Line[] {
  const out: Line[] = [[s('EDUCATION', 'c-heading')], blank];
  education.forEach((e, i) => {
    if (i > 0) out.push(blank);
    const current = e.end.toLowerCase() === 'present';
    out.push([
      s(e.degree, 'c-cmd'),
      ...(current ? [s('  (in progress)', 'c-ok')] : []),
    ]);
    out.push([s(`${e.school}, ${e.where}`, 'c-dim')]);
    out.push([s(`${e.start} – ${e.end}`, 'c-num')]);
    if (e.coursework.length) {
      out.push(blank);
      out.push([s('  relevant coursework:', 'c-muted')]);
      e.coursework.forEach((c) => out.push([s('  › ', 'c-muted'), s(c, 'c-dim')]));
    }
  });
  return out;
}

export function skillsLines(): Line[] {
  const out: Line[] = [[s('SKILLS', 'c-heading')], blank];
  const pad = Math.max(...skills.map((g) => g.group.length)) + 2;
  skills.forEach((g) => {
    out.push([
      s((g.group + ':').padEnd(pad), 'c-key'),
      s(g.items.join('  ·  '), 'c-dim'),
    ]);
  });
  return out;
}

export function projectListLines(): Line[] {
  const out: Line[] = [
    [s('PROJECTS', 'c-heading')],
    blank,
    [s('# run ', 'c-comment'), s('open <name>', 'c-key'), s(' for details', 'c-comment')],
    blank,
  ];
  projects.forEach((p) => {
    out.push([
      s(p.slug.padEnd(32), 'c-accent'),
      s(p.kind, 'c-flag'),
    ]);
    out.push([s('  ' + p.summary, 'c-dim')]);
    out.push(blank);
  });
  out.pop();
  return out;
}

export function projectDetailLines(slug: string): Line[] {
  const p =
    projects.find((x) => x.slug === slug) ||
    projects.find((x) => x.slug.includes(slug) || x.name.toLowerCase().includes(slug.toLowerCase()));
  if (!p) {
    return [
      [s('open: ', 'c-err'), s(`no project matching "${slug}"`, 'c-dim')],
      [s('try: ', 'c-muted'), s(projects.map((x) => x.slug).join(', '), 'c-key')],
    ];
  }
  const out: Line[] = [
    [s(p.name, 'c-cmd')],
    [s(p.kind, 'c-flag')],
    blank,
    ...wrap(p.summary),
    blank,
  ];
  p.highlights.forEach((h) => out.push([s('  › ', 'c-muted'), s(h, 'c-dim')]));
  out.push(blank);
  out.push([s('  stack: ', 'c-muted'), s(p.stack.join(', '), 'c-flag')]);
  return out;
}

export function contactLines(): Line[] {
  return [
    [s('CONTACT', 'c-heading')],
    blank,
    [s('email     ', 'c-key'), s(profile.email, 'c-str')],
    [s('github    ', 'c-key'), s(profile.socials.github, 'c-str')],
    [s('linkedin  ', 'c-key'), s(profile.socials.linkedin, 'c-str')],
    [s('location  ', 'c-key'), s(profile.location, 'c-dim')],
    blank,
    [s('# links open in a new tab', 'c-comment')],
  ];
}

export function neofetchLines(): Line[] {
  const art = [
    '        :::::.        ',
    '     :::::::::::.     ',
    '   ::::::  `:::::.    ',
    '  ::::.       `:::.   ',
    '  ::::   ::::   :::   ',
    '  `:::.       .:::.   ',
    '   `:::::  .:::::.    ',
    '     `:::::::::::     ',
    '        `:::::        ',
  ];
  const info: Line[] = [
    [s(`${profile.handle}@${profile.host}`, 'c-accent')],
    [s('─'.repeat(18), 'c-muted')],
    [s('os      ', 'c-key'), s(system.os, 'c-dim')],
    [s('shell   ', 'c-key'), s(system.shell, 'c-dim')],
    [s('editor  ', 'c-key'), s(system.editor, 'c-dim')],
    [s('uptime  ', 'c-key'), s(system.uptime, 'c-dim')],
    [s('role    ', 'c-key'), s(profile.role, 'c-dim')],
    [s('langs   ', 'c-key'), s(skills[0].items.join(' '), 'c-dim')],
    [s('cpu     ', 'c-key'), s(system.cpu, 'c-dim')],
  ];
  const out: Line[] = [];
  const rows = Math.max(art.length, info.length);
  for (let i = 0; i < rows; i++) {
    const left = s((art[i] ?? ' '.repeat(22)), 'c-accent');
    const right = info[i];
    out.push(right ? [left, ...(right as Seg[])] : [left]);
  }
  return out;
}

function lsLines(): Line[] {
  return [
    [
      s('about.txt      ', 'c-accent'),
      s('experience.log  ', 'c-accent'),
      s('education.md', 'c-accent'),
    ],
    [
      s('skills.json     ', 'c-accent'),
      s('projects/        ', 'c-key'),
      s('contact.vcf', 'c-accent'),
    ],
  ];
}

export function helpLines(): Line[] {
  const out: Line[] = [
    [s('Available commands', 'c-heading')],
    blank,
  ];
  registry
    .filter((c) => !c.hidden)
    .forEach((c) => {
      out.push([s('  ' + c.name.padEnd(12), 'c-key'), s(c.desc, 'c-dim')]);
    });
  out.push(blank);
  out.push([
    s('  tips  ', 'c-muted'),
    s('Tab', 'c-flag'),
    s(' completes · ', 'c-muted'),
    s('↑ ↓', 'c-flag'),
    s(' history · ', 'c-muted'),
    s('cd <section>', 'c-flag'),
    s(' opens a full page', 'c-muted'),
  ]);
  return out;
}

/* ----------------------------------------------------------------
   helpers
   ---------------------------------------------------------------- */

/** naive word wrap so long paragraphs read well in the transcript */
function wrap(text: string, width = 78): Line[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > width) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines.map((l) => [s(l, 'c-dim')]);
}

const SECTION_ROUTES: Record<string, string> = {
  about: '/',
  experience: '/experience',
  work: '/experience',
  education: '/experience',
  skills: '/skills',
  projects: '/projects',
  contact: '/contact',
  shell: '/shell',
  home: '/',
  '~': '/',
  '..': '/',
};

/* ----------------------------------------------------------------
   registry
   ---------------------------------------------------------------- */

export const registry: Command[] = [
  { name: 'help', desc: 'list every command', aliases: ['?', 'commands'], run: () => ok(helpLines()) },
  { name: 'about', desc: 'who I am', aliases: ['bio'], run: () => ok(aboutLines()) },
  { name: 'whoami', desc: 'the one-line version', run: () => ok(whoamiLines()) },
  {
    name: 'experience',
    desc: 'work history',
    aliases: ['work', 'xp'],
    run: () => ok(experienceLines()),
  },
  { name: 'education', desc: 'degree & coursework', aliases: ['edu'], run: () => ok(educationLines()) },
  { name: 'skills', desc: 'languages & tools', aliases: ['stack'], run: () => ok(skillsLines()) },
  {
    name: 'projects',
    desc: 'things I have built',
    aliases: ['ls projects'],
    run: () => ok(projectListLines()),
  },
  {
    name: 'open',
    desc: 'open <project> — project details',
    run: (args) =>
      args.length
        ? ok(projectDetailLines(args.join(' ')))
        : ok([
            [s('usage: ', 'c-warn'), s('open <project>', 'c-dim')],
            [s(projects.map((p) => '  ' + p.slug).join('\n'), 'c-key')],
          ]),
  },
  { name: 'contact', desc: 'how to reach me', aliases: ['email'], run: () => ok(contactLines()) },
  {
    name: 'github',
    desc: 'open my GitHub',
    run: () => ({ lines: [[s('opening ', 'c-muted'), s(profile.socials.github, 'c-str')]], nav: profile.socials.github }),
  },
  {
    name: 'linkedin',
    desc: 'open my LinkedIn',
    run: () => ({ lines: [[s('opening ', 'c-muted'), s(profile.socials.linkedin, 'c-str')]], nav: profile.socials.linkedin }),
  },
  { name: 'neofetch', desc: 'system summary', aliases: ['sysinfo'], run: () => ok(neofetchLines()) },
  { name: 'ls', desc: 'list sections', run: (a) => (a[0] === 'projects' ? ok(projectListLines()) : ok(lsLines())) },
  { name: 'clear', desc: 'clear the screen', aliases: ['cls'], run: () => ({ lines: [], clear: true }) },
  {
    name: 'cd',
    desc: 'cd <section> — jump to a full page',
    run: (args) => {
      const target = (args[0] ?? '').toLowerCase().replace(/\/+$/, '');
      const route = SECTION_ROUTES[target];
      if (!target || target === '~' || target === 'home') return { lines: [], nav: '/' };
      if (route) return { lines: [[s('cd ', 'c-muted'), s(route, 'c-str')]], nav: route };
      return ok([[s('cd: ', 'c-err'), s(`no such section: ${target}`, 'c-dim')]]);
    },
  },
  { name: 'pwd', desc: 'print working directory', hidden: true, run: () => ok([[s('/home/patrik', 'c-dim')]]) },
  {
    name: 'date',
    desc: 'current date',
    hidden: true,
    run: () => ok([[s(new Date().toString(), 'c-dim')]]),
  },
  {
    name: 'echo',
    desc: 'echo <text>',
    hidden: true,
    run: (args) => ok([[s(args.join(' '), 'c-dim')]]),
  },
  {
    name: 'sudo',
    desc: 'nice try',
    hidden: true,
    run: () => ok([[s('patrik is not in the sudoers file. This incident will be reported.', 'c-err')]]),
  },
  {
    name: 'exit',
    desc: 'leave the shell',
    hidden: true,
    run: () => ok([[s("there's no exit — you live here now. try ", 'c-muted'), s('help', 'c-key')]]),
  },
];

const lookup: Record<string, Command> = {};
for (const cmd of registry) {
  lookup[cmd.name] = cmd;
  cmd.aliases?.forEach((a) => {
    if (!a.includes(' ')) lookup[a] = cmd;
  });
}

export const commandNames = Array.from(
  new Set(registry.flatMap((c) => [c.name, ...(c.aliases ?? [])])),
).filter((n) => !n.includes(' '));

export function runCommand(input: string): CommandResult & { input: string; unknown?: boolean } {
  const trimmed = input.trim();
  if (!trimmed) return { input, lines: [] };
  const [head, ...rest] = trimmed.split(/\s+/);
  let name = head.toLowerCase();
  let args = rest;

  // allow "ls projects" and "cat about" style
  if (name === 'cat' && rest[0]) {
    const map: Record<string, string> = {
      'about.txt': 'about',
      'about': 'about',
      'skills.json': 'skills',
      'experience.log': 'experience',
      'education.md': 'education',
      'contact.vcf': 'contact',
    };
    name = map[rest[0].toLowerCase()] ?? rest[0].toLowerCase();
    args = rest.slice(1);
  }

  const cmd = lookup[name];
  if (!cmd) {
    return {
      input,
      unknown: true,
      lines: [
        [s(`${head}: command not found`, 'c-err')],
        [s('type ', 'c-muted'), s('help', 'c-key'), s(' for the list', 'c-muted')],
      ],
    };
  }
  return { input, ...cmd.run(args) };
}

/* ----------------------------------------------------------------
   rendering
   ---------------------------------------------------------------- */

const ESC: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};
export const escapeHtml = (t: string) => t.replace(/[&<>"']/g, (ch) => ESC[ch]);

export function lineToHtml(line: Line): string {
  if (typeof line === 'string') {
    return `<div class="line">${line ? escapeHtml(line) : '&nbsp;'}</div>`;
  }
  const inner = line
    .map((seg) => {
      const t = escapeHtml(seg.t);
      return seg.c ? `<span class="${seg.c}">${t}</span>` : t;
    })
    .join('');
  return `<div class="line">${inner || '&nbsp;'}</div>`;
}

export function linesToHtml(lines: Line[]): string {
  return lines.map(lineToHtml).join('');
}

export function promptHtml(path = '~'): string {
  return `<span class="prompt">${promptSegs(path)
    .map((seg) => `<span class="${seg.c}">${escapeHtml(seg.t)}</span>`)
    .join('')}</span>`;
}
