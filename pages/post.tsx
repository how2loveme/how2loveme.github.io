import { GetStaticProps } from 'next'
import { Octokit } from 'octokit'
import { useRouter } from 'next/router'
import { useLayoutEffect } from 'react'

export default function Post({ name }: { name?: string }) {
  const router = useRouter()
  useLayoutEffect(() => {
    router.replace(`/posts/${name}`.replace('.md', ''), undefined, {
      shallow: true,
    })
  })
  return (
    <h1>
      <span>{name}</span>
    </h1>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_BLOG_TOKEN,
  })
  const res = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: 'how2loveme',
      repo: 'how2loveme.github.io',
      path: 'posts/docker-aws2.md',
      //           message: 'my commit message4',
      //           committer: {
      //             name: 'how2loveme',
      //             email: 'kimjinsub01@naver.com',
      //           },
      //           content: btoa(`---
      // title: 'Two Forms of Pre-rendering4'
      // date: '2022-01-01'
      // ---
      //
      // Next.js has two forms of pre-rendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.
      //
      // - **Static Generation** is the pre-rendering method that generates the HTML at **build time**. The pre-rendered HTML is then _reused_ on each request.
      // - **Server-side Rendering** is the pre-rendering method that generates the HTML on **each request**.
      //
      // Importantly, Next.js lets you **choose** which pre-rendering form to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.
      //
      //       `),
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )
  return {
    props: {
      name: res.data['name'],
    },
  }
}
