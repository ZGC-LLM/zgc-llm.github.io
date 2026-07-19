# Manual UX, theme and assistive-technology evidence

Status: **not yet executed**. This file is a release-evidence template, not a claim that manual
validation has passed. Automation must not fill the result cells.

## Execution record

- Release commit: `________________`
- Operator: `________________`
- Date and timezone: `________________`
- Deployed URL or local build: `________________`
- Browser, version and operating system: `________________`
- Screen reader and version, if used: `________________`
- Viewports, color schemes and JavaScript setting: `________________`

## Keyboard checklist

| Scenario                                       | Expected result                                                        | Result  | Evidence / issue |
| ---------------------------------------------- | ---------------------------------------------------------------------- | ------- | ---------------- |
| First Tab on Chinese and English home pages    | Localized skip link is visible and Enter moves to `#main-content`      | Not run |                  |
| Desktop primary navigation                     | Every item has a visible focus indicator and logical focus order       | Not run |                  |
| Desktop Members submenu                        | Enter/Space opens; Escape closes and restores trigger focus            | Not run |                  |
| Mobile menu at 360px and 390px                 | Trigger and every action are at least 44×44px; Escape restores focus   | Not run |                  |
| Language switch on a dynamic route             | The equivalent locale route opens without losing the slug              | Not run |                  |
| Alliance and working-group participation pages | Unavailable application state is announced and cannot be activated     | Not run |                  |
| Chinese and English 404 recovery               | Recovery links are reachable, understandable and operable              | Not run |                  |
| 200% browser zoom at 1280px                    | Content reflows without overlap, clipping or horizontal page scrolling | Not run |                  |

## Assistive-technology checklist

| Scenario                      | Expected result                                                              | Result  | Evidence / issue |
| ----------------------------- | ---------------------------------------------------------------------------- | ------- | ---------------- |
| Landmarks and page title      | Page purpose, banner, navigation, main and contentinfo are announced clearly | Not run |                  |
| Heading navigation            | Exactly one H1 and a logical heading hierarchy                               | Not run |                  |
| Current navigation item       | Current page state is announced once, without duplicate current links        | Not run |                  |
| External source link          | New-window behavior and external destination are announced                   | Not run |                  |
| Application unavailable state | Status copy is understandable without color or visual position               | Not run |                  |

## Theme and progressive-enhancement checklist

Complete both light and dark checks for all 24 indexable routes and every meaningful state exercised
by the release journeys, including open navigation, focus, hover, unavailable actions, external links,
empty directories and 404 recovery. Attach route/state coverage rather than a representative screenshot
alone.

| Scenario                                            | Expected result                                                                         | Result  | Evidence / issue |
| --------------------------------------------------- | --------------------------------------------------------------------------------------- | ------- | ---------------- |
| All indexable pages in light and dark               | Text, controls, borders and status cues remain legible and meet WCAG 2.2 AA             | Not run |                  |
| Open, focus, hover, disabled and unavailable states | Every meaningful state is visible, distinguishable and understandable                   | Not run |                  |
| Initial paint on home, dynamic and 404 routes       | Correct system theme appears before content without a light/dark flash                  | Not run |                  |
| Live operating-system theme change                  | Open pages update once, keep content/focus and do not require a refresh                 | Not run |                  |
| JavaScript disabled                                 | Static content, desktop navigation, locale links and core destinations remain available | Not run |                  |
| Reduced-motion preference                           | Non-essential smooth scrolling and transitions are absent                               | Not run |                  |

## Sign-off

- Outcome: `PASS / FAIL / BLOCKED`
- Blocking issue links: `________________`
- Reviewer: `________________`
- Review date: `________________`
