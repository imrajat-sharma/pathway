import { useEffect, useMemo, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Clock3,
  Compass,
  ExternalLink,
  FileText,
  Filter,
  MapPin,
  Menu,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react'
import { categories, filterJobs, getJob, jobs, locations } from './data'
import type { Application, FilterState, Job } from './types'

type View = 'landing' | 'dashboard' | 'saved' | 'detail'

const defaultFilters: FilterState = { query: '', location: '', type: '', category: 'All roles' }

function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as T) : fallback
  } catch {
    return fallback
  }
}

function routeFromPath(pathname: string): { view: View; jobId?: string } {
  if (pathname.startsWith('/dashboard')) return { view: 'dashboard' }
  if (pathname.startsWith('/saved')) return { view: 'saved' }
  if (pathname.startsWith('/opportunities/')) return { view: 'detail', jobId: pathname.split('/').pop() }
  return { view: 'landing' }
}

function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button className="logo" onClick={onClick} aria-label="Go to Pathway home">
      <span className="logo-mark"><span /></span>
      <span>pathway</span>
    </button>
  )
}

function Header({ view, savedCount, onNavigate }: { view: View; savedCount: number; onNavigate: (path: string) => void }) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Logo onClick={() => onNavigate('/')} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <button className={view === 'dashboard' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('/dashboard')}>Discover</button>
          <button className={view === 'saved' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('/saved')}>Saved roles {savedCount > 0 && <span className="nav-count">{savedCount}</span>}</button>
          <button className="nav-link" onClick={() => onNavigate('/dashboard')}>Career guide</button>
        </nav>
        <div className="header-actions">
          <button className="icon-button notification-button" aria-label="View notifications"><span className="notification-dot" /><MoreHorizontal size={20} /></button>
          <button className="profile-button" onClick={() => onNavigate('/dashboard')}><span className="avatar avatar-small">AS</span><span className="profile-name">Aanya Shah</span><ChevronDown size={15} /></button>
          <button className="menu-button" aria-label="Open menu"><Menu size={21} /></button>
        </div>
      </div>
    </header>
  )
}

function MobileNav({ view, savedCount, onNavigate }: { view: View; savedCount: number; onNavigate: (path: string) => void }) {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <button className={view === 'landing' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => onNavigate('/')}><Compass size={19} /><span>Home</span></button>
      <button className={view === 'dashboard' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => onNavigate('/dashboard')}><Search size={19} /><span>Discover</span></button>
      <button className={view === 'saved' ? 'mobile-nav-item active' : 'mobile-nav-item'} onClick={() => onNavigate('/saved')}><span className="mobile-bookmark"><Bookmark size={19} />{savedCount > 0 && <b>{savedCount}</b>}</span><span>Saved</span></button>
      <button className="mobile-nav-item" onClick={() => onNavigate('/dashboard')}><UserRound size={19} /><span>Profile</span></button>
    </nav>
  )
}

function Button({ children, className = '', variant = 'primary', onClick, type = 'button', disabled = false }: { children: ReactNode; className?: string; variant?: 'primary' | 'secondary' | 'ghost' | 'dark'; onClick?: () => void; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} className={`button button-${variant} ${className}`} onClick={onClick} disabled={disabled}>{children}</button>
}

function SaveButton({ saved, onClick }: { saved: boolean; onClick: () => void }) {
  return <button className={saved ? 'save-button saved' : 'save-button'} onClick={onClick} aria-label={saved ? 'Remove from saved roles' : 'Save role'} aria-pressed={saved}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save'}</button>
}

function CompanyMark({ job, size = 'normal' }: { job: Job; size?: 'normal' | 'large' }) {
  return <span className={`company-mark ${size === 'large' ? 'company-mark-large' : ''}`} style={{ background: job.accent }}>{job.initials}</span>
}

function MatchBadge({ value }: { value: number }) {
  return <span className="match-badge"><Sparkles size={12} />{value}% match</span>
}

function JobCard({ job, saved, onSave, onOpen }: { job: Job; saved: boolean; onSave: () => void; onOpen: () => void }) {
  return (
    <article className="job-card" onClick={onOpen} tabIndex={0} onKeyDown={(event) => { if (event.key === 'Enter') onOpen() }}>
      <div className="job-card-top"><CompanyMark job={job} /><button className={saved ? 'card-save saved' : 'card-save'} onClick={(event) => { event.stopPropagation(); onSave() }} aria-label={saved ? `Remove ${job.title} from saved roles` : `Save ${job.title}`}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'} /></button></div>
      <div className="job-card-heading"><div><h3>{job.title}</h3><p>{job.company}</p></div><MatchBadge value={job.match} /></div>
      <div className="job-card-meta"><span><MapPin size={14} />{job.location}</span><span><Clock3 size={14} />{job.type}</span></div>
      <div className="job-card-footer"><span className="salary">{job.salary}</span><span>{job.posted}</span></div>
      <div className="job-tags">{job.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
    </article>
  )
}

function LandingPage({ onNavigate, savedIds, onSave }: { onNavigate: (path: string) => void; savedIds: string[]; onSave: (id: string) => void }) {
  const featured = jobs.slice(0, 3)
  return (
    <main className="landing-page">
      <section className="landing-hero section-container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" />A kinder way to find work</div>
          <h1>Find work that<br /><em>moves you forward.</em></h1>
          <p className="hero-subtitle">Pathway helps you discover opportunities that fit your strengths, your season, and the life you want to build.</p>
          <div className="hero-actions"><Button onClick={() => onNavigate('/dashboard')}>Explore opportunities <ArrowRight size={17} /></Button><button className="text-link" onClick={() => onNavigate('/dashboard')}>See how it works <span>↗</span></button></div>
          <div className="hero-proof"><div className="avatar-stack"><span className="mini-avatar mini-one">JM</span><span className="mini-avatar mini-two">RK</span><span className="mini-avatar mini-three">+</span></div><span>Joined by <strong>12,000+</strong> early-career builders</span></div>
        </div>
        <div className="hero-visual" aria-label="A preview of the Pathway opportunity dashboard">
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <div className="hero-note note-top"><span className="note-icon mint"><Check size={14} /></span><div><strong>Good fit found</strong><small>Based on your strengths</small></div></div>
          <div className="hero-profile-card"><div className="profile-card-top"><span className="sun-mark">✦</span><span className="tiny-label">YOUR NEXT CHAPTER</span><MoreHorizontal size={18} /></div><div className="profile-scribble">Make room<br /><span>for good work.</span></div><div className="profile-card-bottom"><span className="line-decoration" /><span className="tiny-label">AANYA SHAH · 2024</span></div></div>
          <div className="hero-note note-bottom"><span className="note-icon peach"><TrendingUp size={15} /></span><div><strong>4 new matches</strong><small>Worth a closer look today</small></div></div>
          <span className="hero-star star-one">✦</span><span className="hero-star star-two">✶</span>
        </div>
      </section>
      <section className="trust-strip"><div className="section-container trust-inner"><span>People finding their next chapter at</span><div className="company-wordmarks"><b>figma</b><b>notion</b><b>linear</b><b>vercel</b><b>airtable</b></div></div></section>
      <section className="landing-featured section-container"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" />Made for your momentum</div><h2>Opportunities with<br /><em>room to grow.</em></h2></div><button className="arrow-link" onClick={() => onNavigate('/dashboard')}>Browse all roles <ArrowRight size={17} /></button></div><div className="featured-grid">{featured.map((job) => <JobCard key={job.id} job={job} saved={savedIds.includes(job.id)} onSave={() => onSave(job.id)} onOpen={() => onNavigate(`/opportunities/${job.id}`)} />)}</div></section>
      <section className="landing-bottom section-container"><div className="bottom-quote"><span className="quote-mark">“</span><blockquote>The best career advice I got was to stop asking ‘what looks good?’ and start asking ‘what feels like me?’</blockquote><span className="quote-author">— Maya, product designer at Notion</span></div><div className="bottom-stat"><span className="stat-number">84<span>%</span></span><p>of Pathway members feel more confident about their next step.</p><span className="stat-detail">From our 2024 member survey <ArrowUpRight /></span></div></section>
    </main>
  )
}

function SidebarFilters({ filters, onChange, onClear }: { filters: FilterState; onChange: (next: Partial<FilterState>) => void; onClear: () => void }) {
  return <aside className="filter-sidebar"><div className="filter-heading"><span><SlidersHorizontal size={16} />Filters</span><button onClick={onClear}>Clear all</button></div><div className="filter-group"><label htmlFor="category-filter">Category</label><div className="select-wrap"><select id="category-filter" value={filters.category} onChange={(event) => onChange({ category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select><ChevronDown size={15} /></div></div><div className="filter-group"><label htmlFor="location-filter">Location</label><div className="select-wrap"><select id="location-filter" value={filters.location} onChange={(event) => onChange({ location: event.target.value })}><option value="">Anywhere</option>{locations.slice(1).map((location) => <option key={location}>{location}</option>)}</select><ChevronDown size={15} /></div></div><div className="filter-group"><label>Work arrangement</label><div className="check-list">{['Internship', 'Full-time', 'Apprenticeship'].map((type) => <label className="check-row" key={type}><input type="checkbox" checked={filters.type === type} onChange={() => onChange({ type: filters.type === type ? '' : type })} /><span className="custom-check"><Check size={12} /></span>{type}<small>{jobs.filter((job) => job.type === type).length}</small></label>)}</div></div><div className="filter-tip"><Sparkles size={17} /><p><strong>Try a feeling.</strong><br />Search for “creative”, “learn”, or “remote” to find roles that match your energy.</p></div></aside>
}

function DashboardPage({ filters, onChange, onClear, savedIds, onSave, onOpen }: { filters: FilterState; onChange: (next: Partial<FilterState>) => void; onClear: () => void; savedIds: string[]; onSave: (id: string) => void; onOpen: (id: string) => void }) {
  const filtered = useMemo(() => filterJobs(jobs, filters), [filters])
  const submitSearch = (event: FormEvent<HTMLFormElement>) => event.preventDefault()
  return (
    <main className="dashboard-page page-container"><div className="dashboard-welcome"><div><div className="eyebrow"><span className="eyebrow-line" />Tuesday, October 8</div><h1>Good morning, Aanya <span className="wave">✦</span></h1><p>Here are a few places your strengths could take you next.</p></div><div className="profile-progress"><span className="progress-ring">72%</span><span><strong>Profile strength</strong><small>Almost there — finish your profile <ArrowRight size={13} /></small></span></div></div><form className="dashboard-search" onSubmit={submitSearch}><div className="search-field"><Search size={19} /><input aria-label="Search opportunities" placeholder="Search by role, skill, or company" value={filters.query} onChange={(event) => onChange({ query: event.target.value })} /><kbd>⌘ K</kbd></div><button className="search-filter-button" type="button" aria-label="Open filters"><Filter size={17} /></button><Button type="submit">Search <ArrowRight size={16} /></Button></form><div className="dashboard-body"><SidebarFilters filters={filters} onChange={onChange} onClear={onClear} /><section className="results-area"><div className="results-header"><div><span className="results-count">{filtered.length} opportunities</span><h2>Worth a closer look <span>✦</span></h2></div><div className="sort-control"><span>Sort by</span><button>Best match <ChevronDown size={14} /></button></div></div>{filtered.length > 0 ? <div className="results-grid">{filtered.map((job) => <JobCard key={job.id} job={job} saved={savedIds.includes(job.id)} onSave={() => onSave(job.id)} onOpen={() => onOpen(job.id)} />)}</div> : <EmptySearch onClear={onClear} />}</section></div></main>
  )
}

function EmptySearch({ onClear }: { onClear: () => void }) {
  return <div className="empty-state"><span className="empty-icon"><Search size={22} /></span><h3>No opportunities found</h3><p>Try a broader search or clear a filter to see more possibilities.</p><Button variant="secondary" onClick={onClear}>Clear filters</Button></div>
}

function SavedPage({ savedIds, appliedIds, onSave, onOpen, onNavigate }: { savedIds: string[]; appliedIds: string[]; onSave: (id: string) => void; onOpen: (id: string) => void; onNavigate: (path: string) => void }) {
  const savedJobs = jobs.filter((job) => savedIds.includes(job.id))
  return <main className="saved-page page-container"><div className="page-title-row"><div><div className="eyebrow"><span className="eyebrow-line" />Your shortlist</div><h1>Saved with intention.</h1><p>Keep the roles that spark something. Come back when you’re ready.</p></div><div className="saved-count-circle"><strong>{savedJobs.length}</strong><span>saved<br />roles</span></div></div>{savedJobs.length > 0 ? <div className="saved-layout"><section><div className="saved-toolbar"><span>{savedJobs.length} {savedJobs.length === 1 ? 'role' : 'roles'} saved</span><button><SlidersHorizontal size={15} /> Recently saved <ChevronDown size={14} /></button></div><div className="saved-list">{savedJobs.map((job) => <div className="saved-list-item" key={job.id}><JobCard job={job} saved onSave={() => onSave(job.id)} onOpen={() => onOpen(job.id)} />{appliedIds.includes(job.id) && <span className="applied-label"><CheckCircle2 size={14} /> Application sent</span>}</div>)}</div></section><aside className="saved-aside"><div className="aside-illustration"><span>✦</span><span>↗</span><span>☼</span></div><h3>Your future self is rooting for you.</h3><p>Small steps count. When a role feels right, you can apply in under two minutes.</p><Button variant="dark" onClick={() => onNavigate('/dashboard')}>Find more roles <ArrowRight size={16} /></Button></aside></div> : <div className="empty-saved"><div className="empty-saved-art"><Bookmark size={34} /></div><h2>A blank page is a good beginning.</h2><p>Save roles that feel like a possibility and they’ll live here, ready when you are.</p><Button onClick={() => onNavigate('/dashboard')}>Explore opportunities <ArrowRight size={16} /></Button></div>}</main>
}

function DetailPage({ job, saved, applied, onSave, onApply, onOpen }: { job: Job; saved: boolean; applied: boolean; onSave: () => void; onApply: () => void; onOpen: (id: string) => void }) {
  const related = jobs.filter((item) => item.id !== job.id && item.category === job.category).slice(0, 2)
  return <main className="detail-page page-container"><button className="back-link" onClick={() => window.history.back()}><ChevronLeft size={17} />Back to opportunities</button><div className="detail-layout"><section className="detail-main"><div className="detail-hero"><div className="detail-title-row"><CompanyMark job={job} size="large" /><div><div className="detail-kicker">{job.category} <span>·</span> {job.posted}</div><h1>{job.title}</h1><p>{job.company} <span>·</span> {job.location}</p></div></div><div className="detail-actions"><SaveButton saved={saved} onClick={onSave} /><Button onClick={onApply} disabled={applied}>{applied ? <><CheckCircle2 size={16} />Application sent</> : <>Apply now <ExternalLink size={15} /></>}</Button></div></div><div className="detail-meta-strip"><div><span className="meta-icon"><MapPin size={15} /></span><span><small>Location</small><strong>{job.location.split(' · ')[0]}</strong></span></div><div><span className="meta-icon"><BriefcaseBusiness size={15} /></span><span><small>Employment</small><strong>{job.type}</strong></span></div><div><span className="meta-icon"><TrendingUp size={15} /></span><span><small>Compensation</small><strong>{job.salary}</strong></span></div></div><div className="detail-section"><h2>About the role</h2><p>{job.description}</p></div><div className="detail-section"><h2>What you’ll do</h2><ul className="detail-list">{job.responsibilities.map((item) => <li key={item}><Check size={16} />{item}</li>)}</ul></div><div className="detail-section"><h2>What we’re looking for</h2><div className="skill-pills">{job.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div><div className="detail-section company-note"><span className="note-icon mint"><Sparkles size={16} /></span><div><h3>A note from Pathway</h3><p>Great work is more than a job title. Use this conversation to learn if the team, pace, and purpose feel right for you too.</p></div></div></section><aside className="detail-aside"><div className="apply-card"><div className="apply-card-heading"><span className="apply-spark">✦</span><span>YOUR PATHWAY MATCH</span></div><strong className="match-score">{job.match}%</strong><h3>This role feels like a strong next step.</h3><p>Based on your skills, interests, and the kind of work you’ve said you want to do.</p><div className="match-bar"><span style={{ width: `${job.match}%` }} /></div><div className="match-detail"><span><Check size={14} />{job.skills[0]} experience</span><span><Check size={14} />Values alignment</span><span><Check size={14} />Growth potential</span></div><Button className="full-button" onClick={onApply} disabled={applied}>{applied ? 'Application sent' : 'Apply in 2 minutes'} <ArrowRight size={16} /></Button><small className="no-pressure">No cover letter required · You’re in control</small></div><div className="share-card"><span><FileText size={17} />Know someone who’d love this?</span><button>Share role <ArrowRight size={14} /></button></div></aside></div>{related.length > 0 && <section className="related-section"><div className="section-heading compact"><div><div className="eyebrow"><span className="eyebrow-line" />Keep exploring</div><h2>More roles like this</h2></div><button className="arrow-link" onClick={() => onOpen(related[0].id)}>See all <ArrowRight size={17} /></button></div><div className="related-grid">{related.map((item) => <JobCard key={item.id} job={item} saved={false} onSave={() => undefined} onOpen={() => onOpen(item.id)} />)}</div></section>}</main>
}

function ApplyModal({ job, onClose, onSubmit }: { job: Job; onClose: () => void; onSubmit: () => void }) {
  const [note, setNote] = useState('')
  const submit = (event: FormEvent) => { event.preventDefault(); onSubmit() }
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="apply-modal" role="dialog" aria-modal="true" aria-labelledby="apply-title"><button className="modal-close" onClick={onClose} aria-label="Close application form"><X size={18} /></button><div className="modal-top"><CompanyMark job={job} /><span>Quick application</span></div><h2 id="apply-title">Take the next small step.</h2><p className="modal-intro">You’re applying for <strong>{job.title}</strong> at {job.company}. No perfect words required — just a little context about why this role caught your eye.</p><form onSubmit={submit}><label htmlFor="application-note">A note to the team <span>Optional</span></label><textarea id="application-note" placeholder="What are you excited to learn or bring to this role?" value={note} onChange={(event) => setNote(event.target.value)} /><div className="modal-footer"><span><CheckCircle2 size={15} />Your profile will be shared securely</span><Button type="submit">Send application <ArrowRight size={16} /></Button></div></form></section></div>
}

export default function App() {
  const initialRoute = routeFromPath(window.location.pathname)
  const [route, setRoute] = useState(initialRoute)
  const [savedIds, setSavedIds] = useState<string[]>(() => readStored('pathway-saved', ['figma-product-design']))
  const [applications, setApplications] = useState<Application[]>(() => readStored('pathway-applications', []))
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [applicationJob, setApplicationJob] = useState<Job | null>(null)

  useEffect(() => { window.localStorage.setItem('pathway-saved', JSON.stringify(savedIds)) }, [savedIds])
  useEffect(() => { window.localStorage.setItem('pathway-applications', JSON.stringify(applications)) }, [applications])
  useEffect(() => { const handlePopState = () => setRoute(routeFromPath(window.location.pathname)); window.addEventListener('popstate', handlePopState); return () => window.removeEventListener('popstate', handlePopState) }, [])

  const navigate = (path: string) => { window.history.pushState({}, '', path); setRoute(routeFromPath(path)); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleSave = (id: string) => setSavedIds((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id])
  const updateFilters = (next: Partial<FilterState>) => setFilters((current) => ({ ...current, ...next }))
  const clearFilters = () => setFilters(defaultFilters)
  const openApply = (job: Job) => setApplicationJob(job)
  const submitApplication = () => { if (!applicationJob) return; setApplications((current) => current.some((application) => application.jobId === applicationJob.id) ? current : [...current, { jobId: applicationJob.id, appliedAt: new Date().toISOString(), status: 'In review' }]); setApplicationJob(null) }
  const currentJob = getJob(route.jobId)

  return <><Header view={route.view} savedCount={savedIds.length} onNavigate={navigate} />{route.view === 'landing' && <LandingPage onNavigate={navigate} savedIds={savedIds} onSave={toggleSave} />}{route.view === 'dashboard' && <DashboardPage filters={filters} onChange={updateFilters} onClear={clearFilters} savedIds={savedIds} onSave={toggleSave} onOpen={(id) => navigate(`/opportunities/${id}`)} />}{route.view === 'saved' && <SavedPage savedIds={savedIds} appliedIds={applications.map((item) => item.jobId)} onSave={toggleSave} onOpen={(id) => navigate(`/opportunities/${id}`)} onNavigate={navigate} />}{route.view === 'detail' && currentJob && <DetailPage job={currentJob} saved={savedIds.includes(currentJob.id)} applied={applications.some((item) => item.jobId === currentJob.id)} onSave={() => toggleSave(currentJob.id)} onApply={() => openApply(currentJob)} onOpen={(id) => navigate(`/opportunities/${id}`)} />}{route.view === 'detail' && !currentJob && <div className="not-found page-container"><h1>This opportunity moved on.</h1><p>Let’s find another one that feels right.</p><Button onClick={() => navigate('/dashboard')}>Browse opportunities</Button></div>}<MobileNav view={route.view} savedCount={savedIds.length} onNavigate={navigate} />{applicationJob && <ApplyModal job={applicationJob} onClose={() => setApplicationJob(null)} onSubmit={submitApplication} />}</>
}
