/**
 * Client controller for the interactive shell on the home page.
 * Progressive enhancement: if this never runs, the server-rendered
 * transcript + top nav still give full access to every section.
 */
import {
  runCommand,
  linesToHtml,
  promptHtml,
  commandNames,
  escapeHtml,
} from '../lib/shell';
import { projects } from '../data/site';

document.documentElement.dataset.js = 'on';

const root = document.getElementById('shell');
if (root) init(root);

function init(root: HTMLElement) {
  const output = root.querySelector<HTMLElement>('[data-output]')!;
  const input = root.querySelector<HTMLInputElement>('[data-input]')!;
  const scroller = root.querySelector<HTMLElement>('[data-scroll]') ?? output;
  const promptEl = root.querySelector<HTMLElement>('[data-prompt]');
  if (promptEl) promptEl.innerHTML = promptHtml();

  const history: string[] = [];
  let hix = 0; // history index; == history.length means "new line"
  let draft = '';

  const completions = Array.from(
    new Set([...commandNames, ...projects.map((p) => p.slug)]),
  ).sort();

  const scrollDown = () => {
    scroller.scrollTop = scroller.scrollHeight;
  };

  function appendGroup(html: string) {
    const div = document.createElement('div');
    div.className = 'shell__group';
    div.innerHTML = html;
    output.appendChild(div);
    scrollDown();
  }

  function submit(raw: string) {
    const res = runCommand(raw);

    if (res.clear) {
      output.replaceChildren();
      return;
    }

    const echoed = `<div class="shell__echo">${promptHtml()}${escapeHtml(raw)}</div>`;
    const body = res.lines.length ? `<div class="shell__out">${linesToHtml(res.lines)}</div>` : '';
    appendGroup(echoed + body);

    if (res.nav) {
      const external = /^https?:\/\//.test(res.nav);
      window.setTimeout(() => {
        if (external) window.open(res.nav!, '_blank', 'noopener');
        else window.location.assign(res.nav!);
      }, 180);
    }
  }

  function complete() {
    const val = input.value;
    const parts = val.split(/\s+/);
    const last = parts[parts.length - 1] ?? '';
    if (!last) return;
    const matches = completions.filter((c) => c.startsWith(last.toLowerCase()));
    if (matches.length === 1) {
      parts[parts.length - 1] = matches[0];
      input.value = parts.join(' ') + (parts.length === 1 ? ' ' : '');
    } else if (matches.length > 1) {
      // common prefix
      let prefix = matches[0];
      for (const m of matches) {
        while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
      }
      if (prefix.length > last.length) {
        parts[parts.length - 1] = prefix;
        input.value = parts.join(' ');
      }
      appendGroup(
        `<div class="shell__echo">${promptHtml()}${escapeHtml(val)}</div>` +
          `<div class="shell__out"><div class="line"><span class="c-key">${matches
            .map(escapeHtml)
            .join('  ')}</span></div></div>`,
      );
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const raw = input.value;
      if (raw.trim()) {
        history.push(raw);
        if (history.length > 200) history.shift();
      }
      hix = history.length;
      draft = '';
      input.value = '';
      submit(raw);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hix > 0) {
        if (hix === history.length) draft = input.value;
        hix--;
        input.value = history[hix] ?? '';
        queueMicrotask(() => input.setSelectionRange(input.value.length, input.value.length));
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hix < history.length) {
        hix++;
        input.value = hix === history.length ? draft : history[hix] ?? '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      output.replaceChildren();
    }
  });

  // clicking anywhere in the window focuses the prompt (unless selecting text)
  root.addEventListener('mouseup', () => {
    if (!window.getSelection()?.toString()) input.focus();
  });
  input.focus();

  // discoverability chips under the window
  document.querySelectorAll<HTMLButtonElement>('.chip[data-cmd]').forEach((btn) => {
    btn.addEventListener('click', () => {
      input.value = btn.dataset.cmd ?? '';
      input.focus();
      submit(input.value);
      input.value = '';
    });
  });

  // run an initial command if requested via ?cmd= or #cmd
  const initial =
    new URLSearchParams(location.search).get('cmd') ||
    (location.hash.startsWith('#run:') ? decodeURIComponent(location.hash.slice(5)) : '');
  if (initial) submit(initial);
}
