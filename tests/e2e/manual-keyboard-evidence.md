# Manual keyboard and assistive-technology evidence

Status: **not yet executed**. This file is a release-evidence template, not a claim that manual
validation has passed. Automation must not fill the result cells.

## Execution record

- Release commit: `________________`
- Operator: `________________`
- Date and timezone: `________________`
- Deployed URL or local build: `________________`
- Browser, version and operating system: `________________`
- Screen reader and version, if used: `________________`

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

## Sign-off

- Outcome: `PASS / FAIL / BLOCKED`
- Blocking issue links: `________________`
- Reviewer: `________________`
- Review date: `________________`
