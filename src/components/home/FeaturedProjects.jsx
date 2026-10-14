import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { EASE_OUT, riseInView } from '../../utils/motion'
import { projectsData } from '../../data/projects'
import { getConstructionMedia } from '../../data/constructionMedia'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import SectionTitle from '../common/SectionTitle'
import Louvres from '../common/Louvres'
import ConstructionReveal from '../projects/ConstructionReveal'

const pad = (n) => String(n).padStart(2, '0')

const facts = (project) => [
  project.projectInfo?.totalLogements && { value: project.projectInfo.totalLogements, label: 'Logements' },
  project.projectInfo?.configuration && { value: project.projectInfo.configuration, label: 'Configuration' },
  project.projectInfo?.surfaces && { value: project.projectInfo.surfaces, label: 'Surfaces' }
].filter(Boolean)

const SceneLinks = ({ href }) => (
  <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 pointer-events-auto">
    <Link to={href} className="group nav-underline inline-flex items-center gap-3 text-white text-sm uppercase tracking-[0.25em]">
      Découvrir la résidence
      <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
    <Link to={`${href}/visite-3d`} className="nav-underline text-brand-blue hover:text-white transition-colors duration-500 text-sm uppercase tracking-[0.25em]">
      Visite 3D
    </Link>
  </div>
)

const SceneText = ({ project, index, total }) => (
  <>
    <p className="flex items-center gap-4 text-brand-sage text-xs uppercase tracking-[0.35em]">
      <span className="text-white">{pad(index + 1)}</span>
      <span className="h-px w-10 bg-brand-sage/50" />
      <span>{pad(total)}</span>
      <span className="ml-2">{project.city} · {project.status}</span>
    </p>
    <h3 className="mt-5 text-5xl md:text-6xl xl:text-7xl text-white leading-[0.95] tracking-tight">
      {project.name.replace(/^Résidences?\s/, '')}
      <span className="block text-base md:text-lg mt-3 tracking-[0.3em] uppercase text-brand-sage font-light">
        {project.name.match(/^Résidences?/)?.[0]}
      </span>
    </h3>
    <dl className="mt-8 grid grid-cols-3 gap-3 md:gap-4 max-w-md border-t border-white/15 pt-5">
      {facts(project).map((f) => (
        <div key={f.label}>
          <dt className="text-[10px] uppercase tracking-[0.12em] md:tracking-[0.25em] text-brand-sage/80">{f.label}</dt>
          <dd className="mt-1 text-sm md:text-base text-white">{f.value}</dd>
        </div>
      ))}
    </dl>
  </>
)

// Small framed shot overlapping the main image: hover (or tap) plays the
// construction film, from the land to the handover.
const ConstructionInset = ({ project, href, className = '', style }) => (
  <motion.div className={`construction-inset group absolute ${className}`} style={style}>
    <p className="hidden lg:block absolute -top-7 left-0 text-[10px] uppercase tracking-[0.3em] text-white/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
      Du terrain à la livraison
    </p>
    <div className="absolute inset-0 overflow-hidden rounded-sm shadow-2xl shadow-black/50 ring-1 ring-white/15">
      <ConstructionReveal
        href={href}
        cover={project.images[1]?.src ?? project.images[0].src}
        alt={`${project.name}, du chantier à la livraison`}
        media={getConstructionMedia(project.slug)}
        name={project.name}
      />
    </div>
  </motion.div>
)

// Desktop: a pinned scene. The building first shows through a narrow window
// beside its name, then the window opens to full bleed as the visitor scrolls.
const PinnedScene = ({ project, index, total }) => {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const href = `/nos-signatures/${project.slug}`
  const flip = index % 2 === 1

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ['start end', 'start start'] })

  // Window → full bleed. Text side keeps a wide margin until the image opens.
  const near = useTransform(p, [0, 0.55], reduced ? [0, 0] : [14, 0])
  const far = useTransform(p, [0, 0.55], reduced ? [0, 0] : [54, 0])
  const left = flip ? near : far
  const right = flip ? far : near
  const clipPath = useMotionTemplate`inset(${near}% ${right}% ${near}% ${left}%)`
  const scale = useTransform(p, [0, 1], reduced ? [1, 1] : [1.25, 1.02])
  const shade = useTransform(p, [0.3, 0.6], [0, 1])
  const insetY = useTransform(p, [0, 1], reduced ? ['0%', '0%'] : ['30%', '-40%'])
  const textY = useTransform(p, [0, 1], reduced ? ['0%', '0%'] : ['6%', '-6%'])

  return (
    <section ref={ref} className="relative h-[230vh]" aria-label={project.name}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
          <motion.img
            src={project.images[0].src}
            alt={project.images[0].alt}
            className="w-full h-full object-cover"
            style={{ scale }}
            loading="lazy"
          />
          <motion.div
            className={`absolute inset-0 ${flip ? 'bg-gradient-to-l' : 'bg-gradient-to-r'} from-[#0d1721] via-[#0d1721]/75 via-45% to-transparent to-75% opacity-(--o)`}
            // CSS variable rather than `opacity`, see Louvres
            style={{ '--o': shade }}
          />
          <Louvres progress={enter} count={7} />
        </motion.div>

        <motion.div
          className={`relative z-30 h-full max-w-7xl mx-auto px-10 flex items-center pointer-events-none ${flip ? 'justify-end' : ''}`}
          style={{ y: textY }}
        >
          <motion.div className="max-w-xl" {...riseInView(0, 0.4)}>
            <SceneText project={project} index={index} total={total} />
            <SceneLinks href={href} />
          </motion.div>
        </motion.div>

        <ConstructionInset
          project={project}
          href={href}
          className={`z-40 w-[22vw] max-w-[340px] aspect-[4/3] bottom-[10vh] ${flip ? 'left-[6vw]' : 'right-[6vw]'}`}
          style={{ y: insetY }}
        />
      </div>
    </section>
  )
}

// Mobile: no pinning. Each building opens through the louvres as it enters.
const StackedScene = ({ project, index, total }) => {
  const href = `/nos-signatures/${project.slug}`
  const [seen, setSeen] = useState(false)

  return (
    <article className="px-5 py-14">
      <motion.div
        className="relative aspect-[4/5] overflow-hidden rounded-sm"
        onViewportEnter={() => setSeen(true)}
        viewport={{ once: true, amount: 0.35 }}
      >
        <motion.img
          src={project.images[0].src}
          alt={project.images[0].alt}
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={seen ? { scale: 1 } : undefined}
          transition={{ duration: 1.8, ease: EASE_OUT }}
          loading="lazy"
        />
        <Louvres play={seen} count={7} duration={1} />
        <ConstructionInset project={project} href={href} className="z-30 w-[46%] aspect-[4/3] right-3 -bottom-px" />
      </motion.div>
      <motion.div className="mt-8" {...riseInView(0, 0.3)}>
        <SceneText project={project} index={index} total={total} />
        <SceneLinks href={href} />
      </motion.div>
    </article>
  )
}

const FeaturedProjects = () => {
  const desktop = useMediaQuery('(min-width: 1024px)')
  const Scene = desktop ? PinnedScene : StackedScene
  const total = projectsData.length

  return (
    <section className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-10 grid md:grid-cols-12 gap-6 items-end mb-10 md:mb-20">
        <SectionTitle
          tag="Réalisations"
          title="Nos Résidences d'Exception"
          center={false}
          className="md:col-span-7 !mb-0"
        />
        <motion.p className="md:col-span-4 md:col-start-9 text-brand-sage leading-relaxed" {...riseInView(0.2)}>
          Découvrez nos projets qui redéfinissent l'art de vivre à Alger
        </motion.p>
      </div>

      {projectsData.map((project, i) => (
        <Scene key={project.id} project={project} index={i} total={total} />
      ))}

      <motion.div className="text-center mt-16 md:mt-24" {...riseInView(0.1)}>
        <Link
          to="/nos-signatures"
          className="group nav-underline text-brand-blue hover:text-white transition-colors duration-500 inline-flex items-center gap-2"
        >
          Voir toutes nos résidences
          <svg className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}

export default FeaturedProjects
