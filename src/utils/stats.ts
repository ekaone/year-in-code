import {request} from 'graphql-request'
import {DEC2023, JAN2023} from '~/constants/dates'
import {COMMON_LANGUAGES} from '~/constants/misc'
import {GITHUB_GRAPHQL_API} from '~/constants/urls'
import {Language, Repo, User} from '~/types/github'

import {
	CONTRIBUTIONS,
	FOLLOWS,
	STARS,
	TOP_LANGUAGES,
	TOP_REPOS,
	USER_HIGHLIGHTS
} from './queries'

/**
 * Gets and serializes all user stats
 * @returns username, commits, top repos, etc
 */
export async function getUserStats(token: string): Promise<User | null> {
	const [highlights, languages, repositories, follows, stars, contributions] =
		await Promise.all([
			getHighlights(token),
			getTopLanguages(token),
			getTopRepsitories(token),
			getTopFollows(token),
			getStars(token),
			getContributionHistory(token)
		])

	// Combine objects
	const userStats = {
		...highlights,
		topLanguages: languages,
		topRepos: repositories,
		topFollows: follows,
		stars: stars,
		contributionsHistory: contributions
	}

	return userStats
}

/**
 * Get user developer highlights
 * @returns total commits, pulls, reviews, etc
 */
export async function getHighlights(token: string) {
	const payload: any = await request(
		GITHUB_GRAPHQL_API,
		USER_HIGHLIGHTS,
		{
			start: JAN2023,
			end: DEC2023
		},
		{
			Authorization: `Bearer ${token}`
		}
	)

	if (!payload || !payload || !payload.viewer) return null

	const collection = payload.viewer.contributionsCollection
	const highlights: User = {
		username: payload.viewer.login,
		fullName: payload.viewer.name,
		avatarUrl: payload.viewer.avatarUrl,
		commits: collection.totalCommitContributions,
		contributions: collection.contributionCalendar.totalContributions,
		pulls: collection.totalPullRequestContributions,
		repos: collection.totalRepositoriesWithContributedCommits,
		reviews: collection.totalPullRequestReviewContributions
	}

	return highlights
}

/**
 * Fetch languages of most-contributed-to repos
 * @returns array of languages with name, logo color, etc
 */
export async function getTopLanguages(token: string): Promise<Language[]> {
	const payload: any = await request(
		GITHUB_GRAPHQL_API,
		TOP_LANGUAGES,
		{
			start: JAN2023,
			end: DEC2023
		},
		{
			Authorization: `Bearer ${token}`
		}
	)

	if (!payload || !payload || !payload.viewer) return null

	let languages = payload.viewer.topRepositories.nodes
		.reduce((repos, repo) => {
			if (!repo || !repo.primaryLanguage) return [...repos]

			// Get language logo colour
			let color = repo.primaryLanguage.color

			// Get language name
			let commonName = repo.primaryLanguage.name

			// Translate the given name to one compatible with the icon library
			let name = commonName.toLowerCase()
			if (COMMON_LANGUAGES.has(name)) name = COMMON_LANGUAGES.get(name)

			// Only add unique languages
			if (repos && repos.some(r => r.name == name)) return [...repos]
			return [...repos, {name, commonName, color}]
		}, [])
		.slice(0, 5)

	return languages
}

/**
 * Get top repositories
 * @returns top 5 repositories with their meta data
 */
export async function getTopRepsitories(token: string): Promise<Repo[]> {
	const payload: any = await request(GITHUB_GRAPHQL_API, TOP_REPOS, undefined, {
		Authorization: `Bearer ${token}`
	})

	if (!payload || !payload || !payload.viewer) return null

	const data =
		payload.viewer.contributionsCollection.commitContributionsByRepository

	// Filtering data to specific data points
	let repos = []
	data.map((repo, i) => {
		repos[i] = {
			name: repo.repository.name,
			nameWithOwner: repo.repository.nameWithOwner,
			avatarUrl: repo.repository.owner.avatarUrl,
			isPrivate: repo.repository.isPrivate,
			url: repo.repository.url,
			stars: repo.repository.stargazerCount,
			contributions: repo.contributions.totalCount
		}
	})

	return repos
}

/**
 * Get user's latest followers/following
 * @returns total followers and following, latest 3 followers and following
 */
export async function getTopFollows(token: string) {
	const payload: any = await request(GITHUB_GRAPHQL_API, FOLLOWS, undefined, {
		Authorization: `Bearer ${token}`
	})

	if (!payload || !payload || !payload.viewer) return null

	const follows = {
		followers: {
			totalCount: payload.viewer.followers.totalCount,
			latest: payload.viewer.followers.nodes
		},
		following: {
			totalCount: payload.viewer.following.totalCount,
			latest: payload.viewer.following.nodes
		}
	}

	return follows
}

/**
 * Get total stars given and recieved
 * @returns total stars given and received
 */
export async function getStars(token: string) {
	const payload: any = await request(GITHUB_GRAPHQL_API, STARS, undefined, {
		Authorization: `Bearer ${token}`
	})

	if (!payload || !payload || !payload.viewer) return null

	const stars = {
		given: payload.viewer.starredRepositories.totalCount,
		received: payload.viewer.repositories.nodes.reduce((prev, curr) => {
			return prev + curr.stargazers.totalCount
		}, 0)
	}

	return stars
}

/**
 * Get contribution history
 * @returns contribution count for each day of the year
 */
export async function getContributionHistory(token: string) {
	const payload: any = await request(
		GITHUB_GRAPHQL_API,
		CONTRIBUTIONS,
		{
			start: JAN2023,
			end: DEC2023
		},
		{
			Authorization: `Bearer ${token}`
		}
	)

	if (!payload || !payload || !payload.viewer) return null

	const weeks = payload.viewer.contributionsCollection.contributionCalendar.weeks

	return weeks
}
