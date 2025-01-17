'use client'

import {createClientComponentClient} from '@supabase/auth-helpers-nextjs'
import {track} from '@vercel/analytics'
import {LogOutIcon} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {Database} from '~/types/supabase'
import Tooltip from './Tooltip'

export default function SignOutButton() {
	const supabase = createClientComponentClient<Database>()
	const router = useRouter()

	// Sign out
	async function handleSignOut() {
		track('Signout')
		const {error} = await supabase.auth.signOut()
		if (error) toast.error(error.message)
		else router.push('/')
	}

	return (
		<Tooltip body='Sign out'>
			<button
				onClick={handleSignOut}
				className='group rounded-md bg-transparent p-2 text-lg text-black hover:bg-black hover:text-white'>
				<LogOutIcon className='h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5' />
			</button>
		</Tooltip>
	)
}
