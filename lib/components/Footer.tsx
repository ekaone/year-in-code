import Graphite from './Graphite'

export default function Footer() {
	return (
		<footer>
			<h3 className='absolute bottom-2 left-0 z-10 flex w-full items-center justify-center gap-1 text-stone-200 md:bottom-5'>
				<span className='text-stone-400 dark:text-stone-600'>by</span>
				<Graphite />
			</h3>
		</footer>
	)
}
