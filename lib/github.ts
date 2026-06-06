export async function getGitHubStats() {
  const res = await fetch('https://api.github.com/users/SiD-20s', {
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error('GitHub API request failed')
  return res.json()
}
