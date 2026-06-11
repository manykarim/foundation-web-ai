---
title: Robot Framework + AI
domain: ai
metaTitle: Robot Framework + AI
metaDescription: Supercharge your Robot Framework with AI — you decide which parts. Optional, transparent, and model-agnostic.
navbar:
  title: AI
  links:
    - label: What You Can Do
      href: "#what-you-can-do"
    - label: Building Blocks
      href: "#building-blocks"
    - label: Two Ways In
      href: "#two-ways-in"
    - label: Get Started
      href: "#get-started"
showFooter: true
---

::content-hero
---
center-title: true
title: AI
title-size: small
variant: default
eyebrow: Robot Framework
---
::

::content-section{title="What You Can Do" width="narrow"}
Robot Framework works. It always has. AI is the optional upgrade — pick what helps, ignore the rest.

No lock-in. No mandatory cloud. Bring your own model — Copilot, Claude Code, a local LLM. Robot Framework doesn't care which.

What's possible today:

- **Write tests in plain language** — grounded in your real keywords, not guesses.
- **Find out why a test failed** — ask, and get a real answer.
- **Operate your project by asking** — run suites, list tags, inspect results, right from your IDE.
- **Refactor and review** — cleaner structure, explained so you learn it.
- **Make sense of results, fast** — failures first, noise last.

All of it optional. All of it transparent. You stay in the loop.
::

::content-section{title="Building Blocks" width="default"}
Several pieces do the heavy lifting. Use one, some, or all of them.

  :::content-row{list-type="wrapping" same-height}
    ::::content-card{styling="default"}
    ### Agent Skills

    Reusable instructions that teach an AI how to work with Robot Framework the right way. Think of them as recipes: writing keywords, structuring resources, analyzing results. Composable, shareable, and version-controlled alongside your code.
    ::::

    ::::content-card{styling="default"}
    ### MCP Server

    The Model Context Protocol connection between your AI assistant and a live Robot Framework session. It lets the AI actually run keywords, inspect state, and work with real execution context — not guess from documentation.
    ::::

    ::::content-card{styling="default"}
    ### RobotCode + AI Agents

    RobotCode, the editor tooling for VS Code, JetBrains, and any LSP-capable IDE, now ships chat plugins that let an AI agent drive your project through the robotcode command line — the way an experienced engineer would. The agent honors your robot.toml, profiles, and Python environment.
    ::::
  :::
::

::content-section{title="Two Ways In" width="default"}
There's more than one path, and they don't compete.

  :::content-row{list-type="wrapping" same-height}
    ::::content-card{styling="default"}
    ### MCP Server

    The MCP server gives an AI assistant a live, stateful session — ideal for interactive, REPL-style building and exploration. Your AI assistant talks to a real Robot Framework session and uses real keywords from your installed libraries.
    ::::

    ::::content-card{styling="default"}
    ### RobotCode Chat Plugins

    RobotCode's chat plugins let an agent operate your project through its own CLI — ideal when you want the AI working exactly the way your robot.toml, profiles, and environment already define things, inside the IDE you already use.
    ::::
  :::

Pick the one that fits the job. Both keep the AI grounded in your real project, not a plausible guess.
::

::content-section{title="The Fine Print" width="narrow"}
- **Optional by design.** Every feature here is something you choose. Robot Framework remains complete and proven without a single AI call.
- **You stay in the loop.** AI shows what it's doing and why. It assists — it doesn't take the wheel.
- **Your data, your rules.** Run local models for sensitive work. We provide the guardrails and setup recipes; you set the boundaries.
::

::content-section{title="Get Started" width="narrow"}
The tools are open source and waiting. Pick a use case that hurts today, try the matching piece, and grow from there.

Built by the community, for the community. Now with optional AI — because some of us asked nicely.

  :::content-row{list-type="wrapping"}
    ::::content-card{styling="unstyled"}
      ::::content-button
      ---
      button-style: primary
      href: https://robotframework.org/ai/
      label: Read the AI guide
      external: true
      ---
      :::
    ::::

    ::::content-card{styling="unstyled"}
      ::::content-button
      ---
      button-style: secondary
      href: https://github.com/robotframework/agent-skills
      label: Browse Agent Skills
      external: true
      ---
      :::
    ::::

    ::::content-card{styling="unstyled"}
      ::::content-button
      ---
      button-style: secondary
      href: https://github.com/robotframework/mcp
      label: Set up the MCP server
      external: true
      ---
      :::
    ::::
  :::
::
