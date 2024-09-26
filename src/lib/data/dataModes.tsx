import {
  IconWorld,
  IconMath,
  IconPencil,
  IconUsers,
  IconChartBar,
  IconCode,
  IconSchool,
  IconEye
} from '@tabler/icons-react'

export type LLMModeId = (typeof LLM_MODES)[number]['id']

export type LLMModeType = {
  id: string
  title: string
  label: string
  disabled?: boolean
  placeholder: string
  icon: JSX.Element
  description: string
  inquire: string
  writer: string
  researcher: string
}

export const LLM_MODES: LLMModeType[] = [
  {
    id: 'web',
    title: 'Web',
    label: 'Web search',
    placeholder: 'Search the web for...',
    icon: (
      <IconWorld className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    description:
      'A powerful, AI-enhanced search engine that scours the entire web to find relevant and accurate information from websites, blogs, and news articles.',
    inquire:
      'Purpose: General web search and information retrieval; Use when: Seeking broad information from the internet',
    writer:
      'Maintain a balanced, informative tone suitable for general audiences',
    researcher: 'Conduct comprehensive web search across diverse sources'
  },
  {
    id: 'academic',
    title: 'Academic Scholar Search',
    label: 'Academic search',
    placeholder: 'Research academic topics...',
    icon: (
      <IconSchool className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    description:
      'Specialized search mode for academic papers, journals, and scholarly articles. Perfect for students and researchers looking for credible sources.',
    inquire:
      'Purpose: Academic research and scholarly information; Use when: Researching academic topics or scientific information',
    writer: 'Use academic language and cite scholarly sources',
    researcher:
      'Utilize Semantic Scholar API for academic papers and scholarly articles.'
  },
  {
    id: 'math',
    title: 'Math Solver',
    label: 'Math solver',
    placeholder: 'Enter a math problem...',
    icon: (
      <IconMath className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    description:
      'A dedicated mode that not only finds solutions but walks users through complex math problems step by step, covering everything from algebra to calculus.',
    inquire:
      'Purpose: Mathematical problem-solving and calculations; Use when: Needing help with math problems or equations',
    writer:
      'Incorporate mathematical notation, equations, and scientific terminology when appropriate',
    researcher:
      'Focus on mathematical and scientific sources, prioritize the math tool'
  },
  {
    id: 'writing',
    title: 'Wordcel',
    label: 'Writing assistant',
    placeholder: 'What would you like to write?',
    icon: (
      <IconPencil className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    description:
      'A language-focused mode for in-depth text analysis, grammar checking, and writing assistance. Ideal for generating well-crafted essays, reports, and creative writing.',
    inquire:
      'Purpose: Assisting with writing tasks and language use; Use when: Seeking help with writing, editing, or language-related queries',
    writer:
      'Emphasize narrative elements, rhetorical devices, and sophisticated language use',
    researcher: 'Emphasize writing-related resources and linguistic tools'
  },
  {
    id: 'vision',
    title: 'Vision',
    label: 'Image analysis',
    disabled: true,
    placeholder: 'Describe or upload an image...',
    icon: (
      <IconEye className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    description:
      'AI-powered image search and analysis tool that can identify objects, perform reverse image searches, and extract information from visual data.',
    inquire:
      'Purpose: Analyzing and describing images; Use when: Discussing or interpreting visual content',
    writer:
      'Provide detailed descriptions of visual elements, drawing connections between the image analysis and additional research',
    researcher:
      'Process the uploaded image(s) through the vision language model; Generate a descriptive query based on the image analysis; Use the search tool with the generated query; Synthesize information from the vision model output and search results'
  },
  {
    id: 'social',
    title: 'Social',
    label: 'Social media and discussions',
    placeholder: 'Ask about social trends or topics...',
    icon: (
      <IconUsers className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    description:
      "A specialized search that focuses on trends, posts, and discussions across social media platforms, helping users stay updated on what's happening in real time.",
    inquire:
      'Purpose: Addressing social trends and online discussions; Use when: Exploring social media topics or cultural phenomena',
    writer:
      'Synthesize diverse viewpoints, use a conversational tone, and highlight trending discussions',
    researcher:
      'Prioritize social media platforms, forums, and discussion boards'
  },
  {
    id: 'business',
    title: 'Wall Street',
    label: 'Business and finance',
    placeholder: 'Inquire about business or finance...',
    icon: (
      <IconChartBar className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    description:
      'Tailored for finance professionals, this mode delivers real-time market data, financial analysis, investment insights, and stock trends from reputable financial sources.',
    inquire:
      'Purpose: Providing business and financial insights; Use when: Discussing economic trends, business strategies, or financial matters',
    writer:
      'Employ business and finance terminology, include data visualizations when relevant',
    researcher:
      'Focus on financial databases and use stock market API for real-time data'
  },
  {
    id: 'coding',
    title: 'Coder',
    label: 'Programming and tech',
    placeholder: 'Ask a coding question...',
    icon: (
      <IconCode className="h-full w-full text-neutral-500 dark:text-neutral-300" />
    ),
    description:
      'Coder mode is for programming and technical assistance. It helps with coding questions, provides code examples, and offers explanations for software development and IT-related topics.',
    inquire:
      'Purpose: Assisting with coding and technical questions; Use when: Seeking help with programming, software development, or IT-related topics',
    writer:
      'Include code snippets, technical explanations, and references to programming best practices',
    researcher: 'Target programming resources, documentation, and tech forums'
  }
]
