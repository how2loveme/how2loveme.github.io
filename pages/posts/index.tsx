import Layout from '../../components/layout'
import {getAllPostIds, getPostData, getSortedPostsData} from '../../lib/posts'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticProps, GetStaticPaths } from 'next'

export default function Post({
                                 allPostsData
                             }: {
    allPostsData: {
        date: string
        title: string
        id: string
    }[]
}) {
    return (
        <Layout>
            <Head>
                <title>{"post"}</title>
            </Head>
            <ul style={{listStyle: "circle"}}>
                {allPostsData.map((post, index) => {
                    return <li key={post.id||index}><a href={`/posts/${post.id}`}>{`${post.title}`}</a>{` / ${post.date}`}</li>
                })}
            </ul>
        </Layout>
    )
}

export const getStaticProps: GetStaticProps = async () => {
    const allPostsData = getSortedPostsData()
    return {
        props: {
            allPostsData
        }
    }
}