# Understanding Glamsterdam

A synthesis-first research website.

**Website:** https://goolamabbas.github.io/understanding-glamsterdam/

**Repository:** https://github.com/goolamabbas/understanding-glamsterdam

The overview leads with the Glamsterdam findings for curious non-specialists, then offers role-based implications, remaining uncertainties and routes into the complete source synthesis. The full Claude synthesis is the main reading experience; a methodology page connects the work to [Choose your AI. Choose how it searches.](https://goolamabbas.github.io/separate-intelligence-and-search/). Separate pages preserve the Codex and Grokbuild reports. The standalone case study explains two documented synthesis decisions, complementary provider contributions, overlap, failure recovery and the limits of any cost or quality comparison. Its claims are attributed to the saved reports; no new research runs were commissioned.

## Sources and provenance

- `synthesis/glamsterdam-synthesis.md` — supplied Claude synthesis, prepared 1 October 2026.
- `search-via-codex/glamsterdam-codex-search.md` — supplied Codex report.
- `search-via-grokbuild/glamsterdam-grokbuild-search.md` — supplied Grokbuild report.

All three describe evidence as of 30 September 2026. The Grok Build source has one privacy edit: its authenticated X account identifier is redacted. The report pages are generated directly from these files, and their downloadable Markdown is byte-identical to these maintained copies (including the Grok Build privacy edit). The home and methodology pages are editorial additions. Website preparation is not a fresh verification of Ethereum claims or historical provider execution.

Privacy-reviewed publication copies of the research prompts are saved in `search-via-codex/codex-prompt.txt` and `search-via-grokbuild/grokbuild-prompt.txt`. Local output paths have been reduced to filenames and the directory-creation sentence removed. Neither supplied prompt contained a personal X handle. These are sanitized copies, not verbatim originals. The two copies differ only in two harness references and the destination filename. The Claude synthesis request and follow-up preferences are combined in `synthesis/claude-synthesis-prompt.txt`, edited for clarity and intent preservation rather than presented as verbatim. The synthesis model and harness were reported as Claude Opus 5.5 in Claude Code; an execution log was not available to independently verify this attribution. Raw provider responses, full transcripts, complete model settings and cost records are not present. Agreement between the two reports does not establish independent verification or a ranking of harnesses/models/providers.

## Reported run settings

The reported model and reasoning settings are listed below. Execution logs were not available to independently verify them.

| Step / harness | Model | Reasoning |
| --- | --- | --- |
| Research / Codex | Sol 6.1 | Medium |
| Research / Grok Build | Grok 4.7 | Medium |
| Synthesis / Claude Code | Opus 5.5 | Medium |

“Medium” does not establish equivalent reasoning effort across models. These runs demonstrate a workflow, not a controlled model ranking.

## Local preview

Requires Node.js 24 and Python 3.

```sh
npm ci --ignore-scripts
npm run build
npm run preview
```

Open http://127.0.0.1:8765/. The server binds only to this computer. `_site/index.html` also opens directly as a file; the site has no browser-side dependencies or API calls. A single build-time dependency, Marked, converts Markdown to HTML.

`site/home.html` and `site/method.html` hold editorial content. `site/build.mjs` generates eight pages, the original downloads and a SHA-256 source manifest. `site/styles.css` supplies responsive layouts, scrollable tables, keyboard focus and print styling. No external fonts, analytics or runtime AI calls are used.

## Publication and deployment

The `.gitignore` is an explicit allowlist: these three reports, the two research prompts, the edited synthesis prompt, the five website source files, the Pages workflow, README and package files. Generated `_site/`, installed `node_modules/`, local `review/`, new files in the research directories and other new top-level files are ignored. The source directories are not blanket-published. New prompts should be individually reviewed and added to the allowlist.

The Pages workflow builds on pushes to `main` and deploys only `_site/`. A Git ignore rule controls repository tracking; it is not a general privacy guarantee, and already-tracked or force-added files can bypass it. Review the exact staged list before each commit.

GitHub Actions installs locked dependencies with scripts disabled, builds the static site, and deploys it through GitHub Pages. Repository Settings → Pages must use GitHub Actions as its build source. To roll back content, revert the relevant commit on `main`; the workflow redeploys the resulting version.

## Hosting recommendation, checked 1 October 2026

| Option | Fit | Cost and limits |
| --- | --- | --- |
| **GitHub Pages — recommended** | Public, versioned, portable research guide with downloadable evidence. Matches the companion guide’s home. | Available for public repositories with GitHub Free. The default github.io address avoids purchasing a domain. Private source repositories require an eligible GitHub paid plan; ChatGPT Pro is separate. |
| **ChatGPT Sites** | Managed hosting if you prefer publishing and refining inside ChatGPT. | Official documentation says Sites is included with eligible plans during public beta, including Pro. Plan-specific limits apply across Sites; availability depends on region and workspace. Exact account quotas and future pricing were not verified. |
| **ChatGPT Space** | Best suited to collaborative pages, source files and an evolving research workspace. | The inspected overview establishes its collaboration model, but does not establish separate Space pricing or account-specific public-sharing entitlements. Do not infer those from the Pro subscription price. |

Official sources: [GitHub Pages eligibility](https://docs.github.com/en/pages/getting-started-with-github-pages), [Sites](https://learn.chatgpt.com/docs/sites), [Sites pricing FAQ](https://learn.chatgpt.com/docs/pricing), [Space overview](https://learn.chatgpt.com/docs/space).

Evidence collection for this hosting comparison: Exa `web_fetch_exa` retrieved GitHub’s static-hosting description and the existing companion guide. Native web search/open retrieved official OpenAI pricing/product documentation and GitHub free-plan eligibility. No specialized dataset was needed. No provider failures affected the comparison. Sites and Space tools were visible but were not executed, so account-level access is unverified. This is separate from the four-provider research attributed to the supplied reports.

Before any new prompt is rendered, review it for personal identifiers, local paths and secrets. The build rejects common local path patterns in publication inputs and handle, email or X-profile patterns in prompts before generating output. This automated check supplements manual review; it is not a complete secret detector.
