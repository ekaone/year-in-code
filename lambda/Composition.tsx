'use client'
import 'devicon'
import {Composition as RemotionComposition} from 'remotion'
import '../app/styles.css'
import Video from '../lib/components/Video'
import {Stats} from '../lib/types/github'
import {Manifest} from '../lib/types/video'
import {COMPOSITION_NAME} from './config'

export default function Composition() {
	return (
		<RemotionComposition
			id={COMPOSITION_NAME}
			component={Video}
			durationInFrames={12 * 30 * 5}
			fps={30}
			height={720}
			width={1280}
			defaultProps={{
				video: {} as Manifest,
				stats: {} as Stats
			}}
		/>
	)
}
