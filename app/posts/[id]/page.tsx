import Layout from '../../../components/layout'
import { getAllPostIds, getPostData } from '../../../lib/posts'
import Head from 'next/head'
import Date from '../../../components/date'
import utilStyles from '../../../styles/utils.module.css'
import styles from '../github-markdown.module.css'

export default async function Post({ params }: { params: { id: string } }) {
  const postData: {
    title: string
    date: string
    contentHtml: string
  } = await getPostData(params.id)
  return (
    <>
      <Head>
        <title>{postData.title}</title>
        <meta
          name={'viewport'}
          content={'width=device-width, initial-scale=1'}
        />
        <link rel={'stylesheet'} href={'github-markdown.css'} />
      </Head>
      <article className={`mx-auto max-w-7xl px-6 lg:px-8`}>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        <div
          className={`${styles['markdown-body']}`}
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </>
  )
}
