import { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { Octokit } from 'octokit'

const Page = () => {
  useEffect(() => {
    ppp()
  }, [])
  const ppp = async () => {
    const hi = await import('../api/kowaine').then((kowaine) =>
      kowaine.GitPost()
    )
    alert(hi.data['name'])
  }
  return (
    <h1>
      <span>'name'</span>
      {/*<span>{name}</span>*/}
    </h1>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_BLOG_TOKEN,
  })
  const res = ''
  return {
    props: {
      // name: res.data['name'],
      name: 'kungs',
    },
  }
}

export default Page
