'use client'

import {TwitterIcon} from 'lucide-react'
import Link from 'next/link'
import {DOMAIN} from '~/constants/metadata'
import {Profile} from '~/types/profile'

export default function TwitterButton({profile}: {profile: Profile}) {
	const body = 'Year in Code by Graphite'
	const url = DOMAIN.PROD + profile.user_name
	return (
		<Link
			href={`https://twitter.com/intent/tweet?text=${body}&url=${url}`}
			target='_blank'>
			<button className='p-2'>
				<TwitterIcon className='h-5 w-5' />
			</button>
		</Link>
	)
}
