'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { canOptimize } from '../lib/images'
import { courseGroupsFor, coursesInGroup } from '../lib/course-groups'
import { type Course, coursePath } from '../lib/site-config'

const PAGE_SIZE = 9

// /courses: the same category filter buttons as the homepage, above the course grid, 9 courses per page. The chosen
// category and page are kept in the address (?category=Hair+Dressing&page=2) so a filtered list can be shared; the
// page itself stays pre-built.
export function CourseList({ courses }: { courses: Course[] }) {
  const groups = courseGroupsFor(courses)
  const [active, setActive] = useState(0)
  const [page, setPage] = useState(1)
  const listRef = useRef<HTMLDivElement>(null)
  const inGroup = coursesInGroup(groups[active] ?? groups[0], courses)
  const totalPages = Math.max(1, Math.ceil(inGroup.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = inGroup.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const label = params.get('category')
    const index = label ? groups.findIndex((group) => group.label === label) : -1
    if (index > 0) setActive(index)
    const fromUrl = Number.parseInt(params.get('page') ?? '', 10)
    if (fromUrl > 1) setPage(fromUrl)
    // Only on first load; later changes come from the buttons.
  }, [])

  function updateUrl(index: number, nextPage: number) {
    const url = new URL(window.location.href)
    if (index === 0) url.searchParams.delete('category')
    else url.searchParams.set('category', groups[index].label)
    if (nextPage === 1) url.searchParams.delete('page')
    else url.searchParams.set('page', String(nextPage))
    window.history.replaceState(null, '', url)
  }

  // A new category starts again at page 1.
  function choose(index: number) {
    setActive(index)
    setPage(1)
    updateUrl(index, 1)
  }

  // Changing page goes back to the top of the list, so the new courses are in view.
  function goTo(nextPage: number) {
    setPage(nextPage)
    updateUrl(active, nextPage)
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    listRef.current?.scrollIntoView({ behavior, block: 'start' })
  }

  return <>
    <div ref={listRef} className="course-filters" role="group" aria-label="Filter courses by category">
      {groups.map((group, i) => <button type="button" key={group.label} aria-pressed={active === i} onClick={() => choose(i)}>{group.label}<span>{coursesInGroup(group, courses).length}</span></button>)}
    </div>
    {visible.length === 0
      ? <p className="all-courses-intro">No courses in this category yet. <button type="button" className="text-link" onClick={() => choose(0)}>Show all courses</button></p>
      : <div className="course-grid" aria-live="polite">
        {visible.map((course, index) => (
          <Link href={coursePath(course.slug)} className="course-card" key={course.slug} aria-label={`View details for ${course.title}`}>
            <div className="course-image">
              <Image src={course.image} unoptimized={!canOptimize(course.image)} alt={course.imageAlt ?? `${course.title} course`} fill sizes="(max-width: 600px) 90vw, (max-width: 900px) 45vw, 30vw" />
              <span>{String((currentPage - 1) * PAGE_SIZE + index + 1).padStart(2, '0')}</span>
            </div>
            <p className="card-tag">{course.category}</p>
            <h3>{course.title}</h3>
            {course.duration && <p className="course-duration">Duration: {course.duration}</p>}
            <p>{course.description}</p>
            <span className="course-card-action">View course <ArrowRight /></span>
          </Link>
        ))}
      </div>}
    {totalPages > 1 && <nav className="video-pagination" aria-label="Course pages">
      <button type="button" className="button button-light" onClick={() => goTo(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
      <span aria-live="polite">Page {currentPage} of {totalPages}</span>
      <button type="button" className="button button-dark" onClick={() => goTo(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    </nav>}
  </>
}
