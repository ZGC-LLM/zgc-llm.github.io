import type { NewsEntry } from '@/types/content'
import type { Locale } from '@/i18n/locales'

// 只发布已经联盟确认的公开内容，不使用示例新闻填充正式页面。
export const NEWS_ENTRIES: readonly NewsEntry[] = [
  {
    body: [
      {
        text: '即日起，中关村自主大模型产业联盟正式发起“网络安全人员开放计划”，面向可信安全伙伴受邀、受控开放自主大模型在网络安全场景中的能力。计划以合法授权、防御优先、过程可审计为原则，不面向公众开放，而是面向可信防御者提供受控访问机制。',
        type: 'paragraph',
      },
      {
        text: '联盟希望帮助可信安全伙伴在合法授权与防御优先的前提下，提升漏洞挖掘、代码审计、补丁验证、安全测试、代码修复与安全研发效率，让先进大模型能力真正服务于网络安全防御体系建设。由联盟成员模型厂商提供模型能力与技术支持，联盟伙伴负责使用场景合规、目标授权、结果复核与漏洞处置。',
        type: 'paragraph',
      },
      { text: '开放对象', type: 'heading' },
      {
        items: [
          '有关网络安全部门及相关支撑单位',
          '安全研究机构、重点实验室与高校安全团队',
          '网络安全企业、软件安全服务商与基础设施安全团队',
          '经联盟审核通过的安全研究人员与开源基础设施维护者',
        ],
        type: 'list',
      },
      { text: '伙伴权益', type: 'heading' },
      {
        items: [
          '自主大模型能力与企业级技术接入支持，含额度与并发保障、接入与场景适配',
          '联盟闭门交流、联合评测与场景共创机会',
          '优秀成果的联合发布与行业传播支持',
        ],
        type: 'list',
      },
      { text: '准入原则', type: 'heading' },
      {
        items: [
          '受邀与验证：提交防御性使用场景说明，经联盟审核通过后开放访问',
          '合法授权、防御优先：仅限用于授权场景，异常调用与疑似违规通过审计和访问控制治理',
          '人工复核：模型输出为专家辅助而非最终结论，须经人工复核与工程验证后方可用于生产处置或对外披露；漏洞遵循负责任披露流程',
        ],
        type: 'list',
      },
      {
        text: '有意参与的企业、机构或个人，可通过下方申请表提交申请与防御性使用场景说明。提交后进入人工审核流程，通常在 3 个工作日内完成审核，结果将通过邮箱通知。',
        type: 'paragraph',
      },
    ],
    category: 'news',
    ctaHref: 'https://clouditera.feishu.cn/share/base/form/shrcnXSRHvrWPehplPdvFuB0juc',
    ctaLabel: '填写申请',
    date: '2026-07-03',
    description:
      '中关村自主大模型产业联盟发起“网络安全人员开放计划”，面向可信防御者受控开放自主大模型在网络安全场景的能力，坚持合法授权、防御优先、过程可审计。',
    published: true,
    slug: 'cybersecurity-open-program',
    title: '联盟发起“网络安全人员开放计划”',
  },
  {
    body: [
      {
        text: '中关村自主大模型产业联盟官方网站正式上线。网站围绕联盟“汇聚自主大模型力量，共建开放、安全、协同的产业生态”的定位，集中呈现联盟介绍、工作组、网络安全生态、成员伙伴与最新动态等内容。',
        type: 'paragraph',
      },
      { text: '网站提供的内容', type: 'heading' },
      {
        items: [
          '联盟介绍与发展定位',
          '工作组与网络安全生态的重点方向',
          '面向机构的生态共建与合作入口',
          '联盟动态与阶段进展的持续发布',
        ],
        type: 'list',
      },
      {
        text: '联盟持续发布经确认可公开的信息，成员与阶段成果内容将在完成公开授权后陆续更新。',
        type: 'paragraph',
      },
      {
        text: '欢迎相关机构通过官网“机构合作申请”了解参与方式，与联盟共建自主大模型产业生态。',
        type: 'paragraph',
      },
    ],
    category: 'news',
    date: '2026-07-17',
    description:
      '中关村自主大模型产业联盟官方网站正式上线，集中呈现联盟定位、重点工作、网络安全生态与机构合作入口。',
    featured: true,
    published: true,
    slug: 'alliance-website-launch',
    title: '联盟官方网站正式上线',
  },
]

export function getPublishedNews(entries: readonly NewsEntry[] = NEWS_ENTRIES): readonly NewsEntry[] {
  return entries
    .filter((entry) => entry.published)
    .sort((left: NewsEntry, right: NewsEntry) => right.date.localeCompare(left.date))
}

export function getPublishedNewsBySlug(slug: string): NewsEntry | undefined {
  return getPublishedNews().find((entry) => entry.slug === slug)
}

// 英文初稿覆盖层（enDraft，待人工校对）：按 slug 覆写 title/description/body/ctaLabel。
// 中文常量保持权威；缺失 slug 时 localizeNewsEntry 回退中文。
type NewsOverlay = Partial<Pick<NewsEntry, 'title' | 'description' | 'body' | 'ctaLabel'>>

const NEWS_EN: Readonly<Record<string, NewsOverlay>> = {
  'alliance-website-launch': {
    body: [
      {
        text: 'The official website of the Zhongguancun Self-Reliant Large Model Industry Alliance is now live. Centered on the Alliance positioning of “uniting the strength of self-reliant large models to build an open, secure and collaborative industry ecosystem”, the site presents the Alliance introduction, working groups, cybersecurity ecosystem, members and latest updates.',
        type: 'paragraph',
      },
      { text: 'What the site provides', type: 'heading' },
      {
        items: [
          'Alliance introduction and development positioning',
          'Priority directions of the working groups and the cybersecurity ecosystem',
          'An entry for institution-facing ecosystem co-building and cooperation',
          'Ongoing releases of Alliance updates and stage progress',
        ],
        type: 'list',
      },
      {
        text: 'The Alliance continues to publish information confirmed for public release; member and stage-result content will be updated gradually after public authorization is completed.',
        type: 'paragraph',
      },
      {
        text: 'Relevant institutions are welcome to learn about ways to participate via the website’s “Institutional Partnership” entry, and to build the self-reliant large-model industry ecosystem together with the Alliance.',
        type: 'paragraph',
      },
    ],
    description:
      'The official website of the Zhongguancun Self-Reliant Large Model Industry Alliance is now live, presenting the Alliance positioning, priority work, cybersecurity ecosystem and institutional cooperation entry.',
    title: 'The Alliance official website is now live',
  },
  'cybersecurity-open-program': {
    body: [
      {
        text: 'Effective immediately, the Zhongguancun Self-Reliant Large Model Industry Alliance officially launches the “Cybersecurity Professionals Open Program”, offering trusted security partners invited, controlled access to the capabilities of self-reliant large models in cybersecurity scenarios. The program follows the principles of lawful authorization, defense-first and auditable processes; it is not open to the public, but provides a controlled access mechanism to trusted defenders.',
        type: 'paragraph',
      },
      {
        text: 'The Alliance hopes to help trusted security partners — under the premises of lawful authorization and defense-first — improve efficiency in vulnerability discovery, code auditing, patch validation, security testing, code repair and secure development, putting advanced large-model capabilities to work for cyber-defense. Alliance member model vendors provide model capabilities and technical support, while Alliance partners are responsible for compliant use scenarios, target authorization, result review and vulnerability handling.',
        type: 'paragraph',
      },
      { text: 'Who it is open to', type: 'heading' },
      {
        items: [
          'Relevant cybersecurity departments and supporting units',
          'Security research institutions, key laboratories and university security teams',
          'Cybersecurity enterprises, software-security service providers and infrastructure-security teams',
          'Security researchers and open-source infrastructure maintainers approved by the Alliance',
        ],
        type: 'list',
      },
      { text: 'Partner benefits', type: 'heading' },
      {
        items: [
          'Access to self-reliant large-model capabilities and enterprise-grade technical support, including quota and concurrency guarantees, integration and scenario adaptation',
          'Closed-door exchange, joint evaluation and scenario co-creation opportunities within the Alliance',
          'Joint release and industry dissemination support for outstanding results',
        ],
        type: 'list',
      },
      { text: 'Admission principles', type: 'heading' },
      {
        items: [
          'Invitation and verification: submit a defensive use-scenario description; access is granted after Alliance review',
          'Lawful authorization, defense-first: use is limited to authorized scenarios; abnormal calls and suspected violations are governed through auditing and access control',
          'Human review: model output is expert assistance rather than a final conclusion, and must undergo human review and engineering validation before use in production handling or external disclosure; vulnerabilities follow a responsible-disclosure process',
        ],
        type: 'list',
      },
      {
        text: 'Interested enterprises, institutions or individuals can submit applications and defensive use-scenario descriptions via the form below. Submissions enter a manual review process, usually completed within 3 business days, with results notified by email.',
        type: 'paragraph',
      },
    ],
    ctaLabel: 'Submit application',
    description:
      'The Zhongguancun Self-Reliant Large Model Industry Alliance launches the “Cybersecurity Professionals Open Program”, giving trusted defenders controlled access to self-reliant large-model capabilities in cybersecurity scenarios, upholding lawful authorization, defense-first and auditable processes.',
    title: 'Alliance launches the “Cybersecurity Professionals Open Program”',
  },
}

/** 按 locale 解析新闻条目：en 覆盖存在则替换文本字段，否则回退中文。 */
export function localizeNewsEntry(entry: NewsEntry, locale: Locale): NewsEntry {
  if (locale === 'zh') return entry

  const overlay = NEWS_EN[entry.slug]

  return overlay ? { ...entry, ...overlay } : entry
}
