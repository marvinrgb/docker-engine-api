export type DockerHubSearchResponse = {
  num_pages: number,
  num_results: number,
  page_size: number,
  page: number,
  query: string,
  results: Array<{
    name: string,
    description: string,
    pull_count: number,
    star_count: number,
    is_trusted: boolean,
    is_automated: boolean,
    is_official: boolean
  }>
}