import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import Header from './header'
import cn from 'classnames'

export const siteTitle : string = 'how2loveme'

export default function Layout(
    {
        children,
        edit,
        postHome,
    }: {
        children: React.ReactNode
        edit?: boolean
        postHome?: boolean
    }
) {
    return (
        <>
            <Head>
                <link rel="icon" href="/favicon.ico"/>
                <meta
                    name="description"
                    content="Learn how to build a personal website using Next.js"
                />
                <meta
                    property="og:image"
                    content={`https://og-image.vercel.app/${encodeURI(
                        siteTitle
                    )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle}/>
                <meta name="twitter:card" content="summary_large_image"/>
                <title>{siteTitle}</title>
            </Head>
            <Header edit={edit} />
            <main className={cn({
                "max-w-5xl px-4 mx-8 mt-12 mb-24": postHome,
            })}>{children}</main>
        </>
    )
}
