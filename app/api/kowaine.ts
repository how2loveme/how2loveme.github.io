import { Octokit } from 'octokit'

const Kowaine = {
  GitPost: async () => {
    const octokit = new Octokit({
      // auth: process.env.NEXT_PUBLIC_BLOG_TOKEN,
    })
    return await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
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
    })
  },
}

export const { GitPost } = Kowaine