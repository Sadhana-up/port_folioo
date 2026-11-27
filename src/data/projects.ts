export type ProjectLink =
  | { label: string; href: string; placeholder?: never }
  | { label: string; href?: never; placeholder: string }

export type ProjectShot = {
  src: string
  alt: string
  width: number
  height: number
  srcSet?: string
  status?: 'placeholder' | 'ready'
}

export type Project = {
  slug: string
  kicker: string
  title: string
  problem: string
  features?: string[]
  stack: string[]
  outcomes: string[]
  notes?: string[]
  links: ProjectLink[]
  image: ProjectShot
  gallery: ProjectShot[]
  video?: { src: string; poster: string }
  layout: 'feature' | 'compact'
  accent: 'coral' | 'blue' | 'yellow' | 'mint' | 'lilac' | 'pink'
}

export const projects: Project[] = [
  {
    slug: 'lucent',
    kicker: 'Flagship · AI product',
    title: 'Lucent: AI skincare advisor',
    problem:
      'Personalized skincare guidance that understands a person’s skin, not generic advice.',
    features: [
      'Computer-vision skin analysis',
      'Conversational AI with memory',
      'Skin profile building',
      'Ingredient auditing',
      'Personalized routines',
    ],
    stack: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'ShadCN UI',
      'FastAPI',
      'PostgreSQL',
      'Better Auth',
      'Google OAuth',
    ],
    outcomes: [
      'The CV work builds on my EfficientNet-B3 skin-lesion classifier: 83.33% validation accuracy on HAM10000, 9-class ISIC, Grad-CAM explainability.',
      'Model served through a FastAPI backend, paired with conversational AI, ingredient auditing, and personalized routines.',
    ],
    links: [
      { label: 'Live demo', placeholder: 'ADD LIVE LINK' },
      { label: 'GitHub', placeholder: 'ADD GITHUB LINK if public' },
    ],
    image: {
      src: '/projects/lucent/cover.webp',
      srcSet: '/projects/lucent/cover-800.webp 800w, /projects/lucent/cover.webp 1600w',
      alt: 'Lucent AI skincare advisor — screenshot placeholder',
      width: 1600,
      height: 900,
      status: 'placeholder',
    },
    gallery: [
      {
        src: '/projects/lucent/gallery-1.webp',
        srcSet: '/projects/lucent/gallery-1-800.webp 800w, /projects/lucent/gallery-1.webp 1200w',
        alt: 'Lucent skin analysis screen — screenshot placeholder',
        width: 1200,
        height: 800,
        status: 'placeholder',
      },
      {
        src: '/projects/lucent/gallery-2.webp',
        srcSet: '/projects/lucent/gallery-2-800.webp 800w, /projects/lucent/gallery-2.webp 1200w',
        alt: 'Lucent conversational routine screen — screenshot placeholder',
        width: 1200,
        height: 800,
        status: 'placeholder',
      },
      {
        src: '/projects/lucent/gallery-3.webp',
        srcSet: '/projects/lucent/gallery-3-800.webp 800w, /projects/lucent/gallery-3.webp 1200w',
        alt: 'Lucent ingredient audit screen — screenshot placeholder',
        width: 1200,
        height: 800,
        status: 'placeholder',
      },
    ],
    layout: 'feature',
    accent: 'coral',
  },
  {
    slug: 'memento',
    kicker: 'Private search · Local AI',
    title: 'Memento: private AI search for your digital footprint',
    problem:
      'Stop bookmarking things you’ll never find again. A private, AI-powered search engine for the pages you read.',
    features: [
      'Full-text index of the pages you read',
      'Local vector embeddings for semantic search',
      'LangGraph agent pipeline',
    ],
    stack: ['JavaScript', 'Local vector embeddings', 'LangGraph'],
    outcomes: [
      'Full-text indexes the pages you read, while local vector embeddings let you search by meaning.',
      'A LangGraph agent pipeline coordinates retrieval — private by design.',
    ],
    notes: ['[ADD MY ROLE]', '[ADD ONE MEASURABLE RESULT]'],
    links: [{ label: 'GitHub', href: 'https://github.com/Sadhana-up/Memento' }],
    image: {
      src: '/projects/memento/cover.webp',
      srcSet: '/projects/memento/cover-800.webp 800w, /projects/memento/cover.webp 1600w',
      alt: 'Memento private AI search — screenshot placeholder',
      width: 1600,
      height: 900,
      status: 'placeholder',
    },
    gallery: [
      {
        src: '/projects/memento/gallery-1.webp',
        srcSet: '/projects/memento/gallery-1-800.webp 800w, /projects/memento/gallery-1.webp 1200w',
        alt: 'Memento semantic search results — screenshot placeholder',
        width: 1200,
        height: 800,
        status: 'placeholder',
      },
      {
        src: '/projects/memento/gallery-2.webp',
        srcSet: '/projects/memento/gallery-2-800.webp 800w, /projects/memento/gallery-2.webp 1200w',
        alt: 'Memento reading history index — screenshot placeholder',
        width: 1200,
        height: 800,
        status: 'placeholder',
      },
    ],
    layout: 'feature',
    accent: 'blue',
  },
  {
    slug: 'java-treasure-game',
    kicker: 'Foundations',
    title: 'Java Treasure Find Game',
    problem:
      'A treasure-hunt game built with pure Java and a Swing UI.',
    features: ['OOP: classes, inheritance, encapsulation', 'Swing interface'],
    stack: ['Java', 'Swing'],
    outcomes: [
      'Practises classes, inheritance, and encapsulation in pure Java.',
      'Interactive Swing UI for the treasure-hunt game.',
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/Sadhana-up/Java_Treasure_Find_Game' }],
    image: {
      src: '/projects/java-treasure-game/cover.webp',
      srcSet: '/projects/java-treasure-game/cover-800.webp 800w, /projects/java-treasure-game/cover.webp 1600w',
      alt: 'Java Treasure Find Game — screenshot placeholder',
      width: 1600,
      height: 900,
      status: 'placeholder',
    },
    gallery: [],
    layout: 'compact',
    accent: 'mint',
  },
]
