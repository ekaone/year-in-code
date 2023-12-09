import {Sequence} from 'remotion'

export default function Repos({
	from,
	text,
	repos
}: {
	from: number
	text: string
	repos: string[]
}) {
	return (
		<Sequence
			from={from}
			durationInFrames={30 * 5}>
			<div className='absolute flex h-full w-full flex-col items-center justify-center gap-5 bg-black'>
				<h2 className='mx-48 text-center text-white'>{text}</h2>
				<div className='flex gap-5'>REPOS {repos}</div>
			</div>
		</Sequence>
	)
}
