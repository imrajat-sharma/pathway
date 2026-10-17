import { describe, expect, it } from 'vitest'
import { filterJobs, jobs } from './data'

describe('filterJobs', () => {
  it('returns every opportunity with the default filters', () => {
    expect(filterJobs(jobs, { query: '', location: '', type: '', category: 'All roles' })).toHaveLength(jobs.length)
  })

  it('matches a role by title, company, or skill', () => {
    expect(filterJobs(jobs, { query: 'react', location: '', type: '', category: 'All roles' }).map((job) => job.id)).toEqual(['linear-frontend-engineer'])
    expect(filterJobs(jobs, { query: 'Notion', location: '', type: '', category: 'All roles' }).map((job) => job.id)).toEqual(['notion-brand-designer'])
  })

  it('combines location, work type, and category filters', () => {
    const result = filterJobs(jobs, { query: '', location: 'Remote', type: 'Internship', category: 'Engineering' })
    expect(result.map((job) => job.id)).toEqual(['linear-frontend-engineer'])
  })

  it('returns no matches for an impossible combination', () => {
    expect(filterJobs(jobs, { query: '', location: 'Austin', type: 'Internship', category: 'Design' })).toEqual([])
  })
})
