export type JobType = 'Internship' | 'Full-time' | 'Apprenticeship'

export type Job = {
  id: string
  title: string
  company: string
  initials: string
  accent: string
  location: string
  type: JobType
  salary: string
  posted: string
  category: string
  tags: string[]
  description: string
  responsibilities: string[]
  skills: string[]
  match: number
  featured?: boolean
}

export type Application = {
  jobId: string
  appliedAt: string
  status: 'In review' | 'Interview' | 'Offer'
}

export type FilterState = {
  query: string
  location: string
  type: string
  category: string
}
