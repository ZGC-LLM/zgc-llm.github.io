import Link from 'next/link'
import type { ReactElement } from 'react'

import { CORE_MODULES, SITE_NAME } from '@/config/site'

export default function HomePage(): ReactElement {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <Link className="flex items-center gap-3" href="/">
            <span
              aria-hidden="true"
              className="grid size-10 place-items-center rounded-xl bg-cyan-400 font-semibold text-slate-950"
            >
              Z
            </span>
            <span className="max-w-64 text-sm font-semibold tracking-wide sm:text-base">
              {SITE_NAME}
            </span>
          </Link>
          <nav
            aria-label="主导航"
            className="hidden items-center gap-8 text-sm text-slate-300 md:flex"
          >
            <a className="transition hover:text-white" href="#about">
              联盟介绍
            </a>
            <a className="transition hover:text-white" href="#modules">
              网站模块
            </a>
            <Link
              className="rounded-full border border-white/20 px-4 py-2 transition hover:border-cyan-300 hover:text-cyan-200"
              href="/admin"
            >
              管理后台
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_55%)]"
          />
          <div className="mx-auto grid max-w-7xl gap-14 px-6 py-24 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-36">
            <div>
              <p className="mb-6 text-sm font-medium tracking-[0.24em] text-cyan-300">
                ZGCLLM · OFFICIAL WEBSITE
              </p>
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl">
                汇聚自主大模型力量，连接产业创新生态
              </h1>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                {SITE_NAME}
                官方网站项目已完成基础初始化，将承载联盟展示、工作组协作、成员服务、入盟申请与新闻发布。
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                  href="#modules"
                >
                  查看建设范围
                </a>
                <Link
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:border-white/50"
                  href="/admin"
                >
                  进入内容后台
                </Link>
              </div>
            </div>

            <div className="grid content-center gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm text-slate-400">正式主域名</p>
                <p className="mt-2 text-xl font-medium text-cyan-200">www.zgcllm.org.cn</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="text-sm text-slate-400">品牌保护域名</p>
                <p className="mt-2 text-base font-medium">zgcllm.cn · zgcllm.net</p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-white/[0.03]" id="about">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <p className="max-w-4xl text-2xl leading-10 text-slate-200 sm:text-3xl">
              项目采用 Next.js、Payload CMS 与
              PostgreSQL，一套代码同时支持高性能官网、内容管理后台和后续申请审核流程。
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8" id="modules">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-medium tracking-[0.2em] text-cyan-300">CORE MODULES</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              首期六个核心模块
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {CORE_MODULES.map((module, index) => (
              <article className="bg-slate-950 p-7" key={module.slug}>
                <p className="text-sm font-medium text-cyan-300">0{index + 1}</p>
                <h3 className="mt-8 text-xl font-semibold">{module.title}</h3>
                <p className="mt-3 leading-7 text-slate-400">{module.description}</p>
                <code className="mt-6 block text-xs text-slate-500">{module.path}</code>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}
          </p>
          <p>项目初始化版本 · 内容与功能持续建设中</p>
        </div>
      </footer>
    </div>
  )
}
