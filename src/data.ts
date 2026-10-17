import type { FilterState, Job } from './types'

export const jobs: Job[] = [
  {
    id: 'figma-product-design',
    title: 'Product Design Intern',
    company: 'Figma',
    initials: 'Fi',
    accent: '#e8d8ff',
    location: 'San Francisco, CA',
    type: 'Internship',
    salary: '$32–38 / hour',
    posted: '2d ago',
    category: 'Design',
    tags: ['Figma', 'Prototyping', 'User research'],
    description: 'Help shape the tools that make it easier for teams to turn ideas into reality. You’ll work alongside product designers, researchers, and engineers on real features used by millions.',
    responsibilities: ['Partner with designers to explore and prototype new workflows', 'Turn customer insights into simple, thoughtful product experiences', 'Share your work early and often through critiques and design reviews'],
    skills: ['Figma', 'Interaction design', 'Visual design', 'Curiosity'],
    match: 96,
    featured: true,
  },
  {
    id: 'notion-brand-designer',
    title: 'Junior Brand Designer',
    company: 'Notion',
    initials: 'N',
    accent: '#e7f3ef',
    location: 'New York, NY · Hybrid',
    type: 'Full-time',
    salary: '$78k–92k / year',
    posted: '4d ago',
    category: 'Design',
    tags: ['Brand systems', 'Illustration', 'Figma'],
    description: 'Join a small, high-impact creative team making Notion feel unmistakably Notion everywhere people discover and use it.',
    responsibilities: ['Create brand assets across web, social, and product surfaces', 'Help maintain a living visual language system', 'Collaborate with writers and marketers on memorable campaigns'],
    skills: ['Brand design', 'Typography', 'Figma', 'Storytelling'],
    match: 91,
  },
  {
    id: 'linear-frontend-engineer',
    title: 'Frontend Engineer Intern',
    company: 'Linear',
    initials: 'L',
    accent: '#e6e9ff',
    location: 'Remote · Americas',
    type: 'Internship',
    salary: '$35–42 / hour',
    posted: '1w ago',
    category: 'Engineering',
    tags: ['React', 'TypeScript', 'GraphQL'],
    description: 'Build delightful, fast interfaces for the product teams use to do their best work. You’ll ship alongside a small, senior engineering team.',
    responsibilities: ['Build accessible, polished product experiences in React', 'Work closely with product and design from idea to launch', 'Improve the performance and quality of existing surfaces'],
    skills: ['React', 'TypeScript', 'CSS', 'Web fundamentals'],
    match: 89,
  },
  {
    id: 'airtable-growth',
    title: 'Growth Marketing Associate',
    company: 'Airtable',
    initials: 'At',
    accent: '#fff0d1',
    location: 'Austin, TX · Hybrid',
    type: 'Full-time',
    salary: '$66k–80k / year',
    posted: '1w ago',
    category: 'Marketing',
    tags: ['Content', 'Analytics', 'Lifecycle'],
    description: 'Help more people discover what is possible with Airtable. This is a chance to learn growth from a team that loves experiments and clear thinking.',
    responsibilities: ['Plan and measure experiments across the customer journey', 'Create content that makes complex ideas feel approachable', 'Partner with product marketing on launches'],
    skills: ['Copywriting', 'Analytics', 'Project management', 'Curiosity'],
    match: 84,
  },
  {
    id: 'duolingo-content',
    title: 'Content Strategy Fellow',
    company: 'Duolingo',
    initials: 'Du',
    accent: '#dff5e2',
    location: 'Pittsburgh, PA · Hybrid',
    type: 'Apprenticeship',
    salary: '$28–32 / hour',
    posted: '2w ago',
    category: 'Content',
    tags: ['Writing', 'Strategy', 'Education'],
    description: 'Make learning a little more fun for millions of people. You’ll help the content team turn language learning research into joyful daily lessons.',
    responsibilities: ['Write and edit lesson content for new language courses', 'Use learner insights to improve content quality', 'Work with linguists, artists, and learning scientists'],
    skills: ['Writing', 'Editing', 'Research', 'Empathy'],
    match: 82,
  },
  {
    id: 'headspace-people',
    title: 'People Operations Coordinator',
    company: 'Headspace',
    initials: 'H',
    accent: '#f8dfdf',
    location: 'Los Angeles, CA',
    type: 'Full-time',
    salary: '$64k–76k / year',
    posted: '3w ago',
    category: 'Operations',
    tags: ['People ops', 'Culture', 'Coordination'],
    description: 'Help create a workplace where people can do their best work. You’ll be the thoughtful, organized heart of a growing People team.',
    responsibilities: ['Coordinate onboarding and employee experience programs', 'Keep people processes clear, friendly, and organized', 'Support projects across culture, benefits, and operations'],
    skills: ['Organization', 'Communication', 'Notion', 'Empathy'],
    match: 78,
  },
]

export const categories = ['All roles', 'Design', 'Engineering', 'Marketing', 'Content', 'Operations']

export const locations = ['Anywhere', 'Remote', 'San Francisco', 'New York', 'Austin', 'Pittsburgh', 'Los Angeles']

export function getJob(id: string | undefined) {
  return jobs.find((job) => job.id === id)
}

export function filterJobs(allJobs: Job[], filters: FilterState) {
  const normalizedQuery = filters.query.trim().toLowerCase()
  return allJobs.filter((job) => {
    const matchesQuery = !normalizedQuery || [job.title, job.company, job.category, ...job.tags].join(' ').toLowerCase().includes(normalizedQuery)
    const matchesLocation = !filters.location || filters.location === 'Anywhere' || job.location.toLowerCase().includes(filters.location.toLowerCase())
    const matchesType = !filters.type || job.type === filters.type
    const matchesCategory = !filters.category || filters.category === 'All roles' || job.category === filters.category
    return matchesQuery && matchesLocation && matchesType && matchesCategory
  })
}
