export type StackCardData = {
  eyebrow: string
  title: string
  subtitle: string
  color: string
  points?: string[]
  note?: string
}

export type SkillGroup = {
  label: string
  color: string
  items: string[]
}

export type ContactLink = {
  label: string
  value: string
  href: string
}

export const journeyCards: StackCardData[] = [
  {
    eyebrow: '2024–2028 · Education',
    title: 'BSc Data Science',
    subtitle: 'Kathmandu University',
    color: 'var(--coral)',
    points: [
      'Third-year student in Nepal, working across mathematics, statistics, and AI.',
      'Hands-on coursework in Python, Java, and scikit-learn, plus independent ML projects.',
      'Focus: turning theory into working models and products.',
    ],
  },
  {
    eyebrow: 'June — ongoing · Experience',
    title: 'AI Developer',
    subtitle: 'Lucent AI Nepal',
    color: 'var(--blue)',
    points: [
      'Building the Lucent app: computer-vision skin analysis and a FastAPI backend.',
      'Working across model development, product iteration, and practical AI tooling.',
    ],
  },
]

export const skillGroups: SkillGroup[] = [
  {
    label: 'Languages',
    color: 'var(--coral)',
    items: ['Python', 'Java'],
  },
  {
    label: 'ML & AI',
    color: 'var(--yellow)',
    items: [
      'scikit-learn',
      'TensorFlow',
      'Keras',
      'Hugging Face Transformers',
      'CNNs',
      'RNNs',
      'Weka',
      'Orange',
    ],
  },
  {
    label: 'LLMs & Agents',
    color: 'var(--lilac)',
    items: ['LangChain', 'LangGraph', 'Google ADK'],
  },
  {
    label: 'Tools',
    color: 'var(--mint)',
    items: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'FastAPI',
      'PostgreSQL',
      'Google Colab',
      'Git & GitHub',
    ],
  },
]

export const about = {
  paragraph:
    'I’m Sadhana, a third-year BSc Data Science student at Kathmandu University (2024–2028), based in Nepal. I like mathematics, statistics, and AI — and I build ML products with them, from an AI skincare advisor to private semantic search.',
  facts: [
    { label: 'Based in', value: 'Nepal' },
    { label: 'Education', value: 'BSc Data Science, Kathmandu University · 2024–2028' },
    { label: 'Now', value: 'AI Developer at Lucent AI Nepal (June–ongoing)' },
    { label: 'Focus', value: 'Mathematics, statistics, and AI' },
    {
      label: 'Stack',
      value:
        'Python, scikit-learn, TensorFlow, Keras, Hugging Face, LangChain, LangGraph, Google ADK, FastAPI',
    },
  ],
  photo: {
    src: '/about/photo.webp',
    alt: 'Portrait placeholder — add a photo of Sadhana Uprety',
    width: 900,
    height: 1200,
    status: 'placeholder' as const,
  },
}

export const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    value: 'upretysadhana@gmail.com',
    href: 'mailto:upretysadhana@gmail.com?subject=Hello%20Sadhana',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/sadhana-uprety',
    href: 'https://www.linkedin.com/in/sadhana-uprety/',
  },
  {
    label: 'GitHub',
    value: 'github.com/Sadhana-up',
    href: 'https://github.com/Sadhana-up',
  },
]
