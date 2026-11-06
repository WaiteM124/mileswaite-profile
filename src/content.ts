export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkItem {
  kicker?: string;
  title: string;
  summary: string;
  link?: WorkLink;
}

export interface ContactLink {
  text: string;
  href: string;
}

export interface ProfileContent {
  name: string;
  role: string;
  introduction: string;
  workHeading: string;
  work: WorkItem[];
  contactHeading: string;
  contact: ContactLink[];
}

export const profile: ProfileContent = {
  name: 'Miles Waite',
  role: 'Distinguished Frontier Engineer',
  introduction:
    'Building governed, evaluation-driven AI systems that reason over live enterprise data and take real actions under auditable human control.',
  workHeading: 'Selected work',
  work: [
    {
      kicker: 'Flagship project',
      title: 'Autonomous Enterprise Decision Intelligence Platform',
      summary:
        'A multi-agent platform for investigating complex enterprise decisions. Specialist agents analyse independent business domains, critically review findings, and synthesise evidence into a structured recommendation for human decision-makers.',
    },
    {
      title: 'Self-Learning AP Automation',
      summary: '71.5% automation at 99.47% accuracy across 11,118 invoice lines.',
      link: {
        label: 'Repository',
        href: 'https://github.com/WaiteM124/ap-automation',
      },
    },
    {
      title: 'Governed ERP Automation',
      summary: '90+ tools operating against a live ERP under human-in-the-loop governance.',
      link: {
        label: 'Related repository',
        href: 'https://github.com/WaiteM124/governed-agent-toolkit',
      },
    },
    {
      title: 'Enterprise RAG Assistant',
      summary: '200+ users and 9.1/10 accuracy on a 500+ question golden dataset.',
      link: {
        label: 'Reference implementation',
        href: 'https://github.com/WaiteM124/miles-rag',
      },
    },
  ],
  contactHeading: 'Contact',
  contact: [
    { text: 'waite.miles@proton.me', href: 'mailto:waite.miles@proton.me' },
    { text: 'LinkedIn', href: 'https://www.linkedin.com/in/miles-waite-46628a3b2/' },
    { text: 'GitHub', href: 'https://github.com/Milesy1' },
  ],
};
