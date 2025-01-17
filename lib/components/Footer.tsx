'use client'
import {track} from '@vercel/analytics'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {META} from '~/constants/metadata'

export default function Footer() {
	const pathname = usePathname()
	if (pathname !== '/loading')
		return (
			<footer className='absolute bottom-0 flex w-full items-center justify-center p-5 text-white'>
				<Link
					href={META.github}
					target='_blank'
					className='group border-r border-white pr-3 no-underline'>
					<button
						className='border-none bg-transparent p-0 text-lg font-thin text-white hover:bg-transparent hover:text-white'
						onClick={() => track('Visit GitHub')}>
						See code
					</button>
				</Link>
				<Link
					href={META.blog}
					target='_blank'
					className='group relative flex items-center pl-3 no-underline'>
					<button
						onClick={() => track('Visit blog')}
						className='border-none bg-transparent p-0 text-lg font-thin text-white hover:bg-transparent hover:text-white'>
						Learn more
					</button>
				</Link>
			</footer>
		)
}
