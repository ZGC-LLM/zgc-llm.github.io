import { resolve, type Localized } from '@/i18n/localized'
import type { Locale } from '@/i18n/locales'
import type { CybersecurityEcosystem } from '@/types/content'

// 双语内容：中文权威，英文为初稿（enDraft，待人工校对）。经 getCybersecurityEcosystem(locale) 访问。
const ECOSYSTEM: Localized<CybersecurityEcosystem> = {
  en: {
    actions: [
      {
        description:
          'As the entry point for professional users, upgrade one-off benefit campaigns into a long-term user network: application review, benefit distribution, needs collection, tiered operations and accumulation of outstanding cases.',
        title: 'Run the Cybersecurity Professionals Open Program on an ongoing basis',
      },
      {
        description:
          'Open applications to security enterprises, labs, universities and professional researchers, offering closed-door exchange, benchmark/cyber-range testing, enterprise-grade model access and joint result releases.',
        title: 'Launch the cybersecurity ecosystem co-building program',
      },
      {
        description:
          'Around real offense-defense, competition tasks, cyber mapping and dynamic ranges, build structured tasks for long-horizon work: task definition, environment tools, agent execution traces, decision processes, result adjudication and expert review — moving agents from demonstration to production.',
        title: 'Build an in-depth data and task system',
      },
      {
        description:
          'Around the needs of the cybersecurity industry, establish model validation and application mechanisms: trusted closed testing, professional validation and product-scenario deployment.',
        title: 'Establish validation and application mechanisms for the cybersecurity industry',
      },
    ],
    contribution: [
      'Authorized desensitized data',
      'Real offense-defense tasks',
      'Ranges and competitions',
      'Vulnerability environments',
      'Expert labeling and review',
      'New-model test feedback',
      'Security product integration',
      'Real business scenarios',
      'Domestic software and open-source security',
    ],
    cycle: [
      'Model release',
      'Professional validation',
      'Scenario deployment',
      'Data accumulation',
      'Model enhancement',
      'Industry promotion',
    ],
    governanceBoundaries: [
      'No disclosure of unauthorized sensitive materials or data; partners are not required to hand over raw data.',
      'No disclosure of high-risk capabilities or actionable attack details.',
      'Data compliance and public release of results require governance review and authorization confirmation.',
    ],
    openPrinciples: ['Vendor-neutral', 'Equal participation', 'Governable security', 'Continuous evolution'],
    resources: [
      {
        description:
          'Connecting self-reliant large models, APIs, tokens, computing resources and dedicated technical support.',
        title: 'Models and computing power',
      },
      {
        description:
          'Connecting university labs and expert teams to build benchmarks, dynamic ranges and real-task evaluation systems.',
        title: 'Academia and evaluation',
      },
      {
        description:
          'Connecting security enterprises, competitions, ranges, open-source communities and offense-defense teams to form a continuous source of real tasks and in-depth data.',
        title: 'Data and tasks',
      },
      {
        description:
          'Connecting security researchers, offense-defense teams, university faculty and students, and professional developers into a stable testing, feedback and co-creation network.',
        title: 'Professional talent',
      },
      {
        description:
          'Connecting security products, enterprise business, domestic software and key industries to bring model capabilities into real business scenarios.',
        title: 'Industry scenarios',
      },
      {
        description:
          'Connecting model release channels, industry media, professional communities and result platforms to promote and deploy new model capabilities professionally for the cybersecurity industry.',
        title: 'Release and outreach',
      },
    ],
    summary:
      'Leveraging the Alliance to connect professional users, real scenarios, in-depth data, capability evaluation and industry deployment, continuously moving agents from demonstration to production and jointly building a vendor-neutral, governable and continuously evolving self-reliant cybersecurity large-model ecosystem.',
    title: 'Cybersecurity Ecosystem',
  },
  zh: {
    cycle: ['模型发布', '专业验证', '场景落地', '数据沉淀', '模型增强', '行业推广'],
    resources: [
      { description: '连接自主大模型、API、Token、算力资源与专项技术支持。', title: '模型与算力' },
      {
        description: '连接高校实验室与专家团队，建设 Benchmark、动态靶场与真实任务评测体系。',
        title: '学术与评测',
      },
      {
        description: '连接安全企业、赛事、靶场、开源社区与攻防团队，形成持续的真实任务与深度数据来源。',
        title: '数据与任务',
      },
      {
        description: '连接安全研究员、攻防团队、高校师生与专业开发者，形成稳定的测试、反馈与共创网络。',
        title: '专业人才',
      },
      {
        description: '连接安全产品、企业业务、国产软件与重点行业，推动模型能力进入真实业务场景。',
        title: '产业场景',
      },
      {
        description: '连接模型发布渠道、行业媒体、专业社区与成果平台，推动新模型能力面向网络安全行业专业传播与落地。',
        title: '发布与传播',
      },
    ],
    actions: [
      {
        description:
          '作为专业用户入口，将一次性权益活动升级为长期用户网络：申请审核、权益发放、需求收集、分层运营与优秀案例沉淀。',
        title: '持续运营网络安全人员开放计划',
      },
      {
        description:
          '面向安全企业、实验室、高校与专业研究人员开放申请，提供闭门交流、Benchmark/靶场测试、企业级模型接入与联合成果发布。',
        title: '发布网络安全生态共建计划',
      },
      {
        description:
          '围绕真实攻防、赛事任务、网络测绘与动态靶场，面向长程任务建设结构化任务：任务定义、环境工具、Agent 执行轨迹、决策过程、结果判定与专家复核，推动智能体从示范走向生产环境。',
        title: '建设深度数据与任务体系',
      },
      {
        description: '围绕网络安全行业需求，建立模型验证与应用机制：可信内测、专业验证与产品场景落地。',
        title: '建立面向网络安全行业的验证与应用机制',
      },
    ],
    contribution: [
      '授权脱敏数据',
      '真实攻防任务',
      '靶场与赛事',
      '漏洞环境',
      '专家标注与复核',
      '新模型测试反馈',
      '安全产品接入',
      '真实业务场景',
      '国产软件与开源安全',
    ],
    governanceBoundaries: [
      '不披露未经授权的敏感材料与数据；伙伴不被强制交付原始数据。',
      '不公开高风险能力或可操作的攻击细节。',
      '数据合规与成果公开需经治理评审与授权确认。',
    ],
    openPrinciples: ['厂商中立', '对等参与', '安全可治理', '持续演进'],
    summary:
      '依托联盟连接专业用户、真实场景、深度数据、能力评测与产业落地，持续推动智能体从示范走向生产环境，共建厂商中立、安全可治理、可持续演进的自主网络安全大模型生态。',
    title: '网络安全生态',
  },
}

export function getCybersecurityEcosystem(locale: Locale): CybersecurityEcosystem {
  return resolve(ECOSYSTEM, locale)
}

/** 中文权威常量：向后兼容既有引用与单测。 */
export const CYBERSECURITY_ECOSYSTEM: CybersecurityEcosystem = ECOSYSTEM.zh
