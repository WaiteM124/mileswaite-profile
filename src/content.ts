export interface WorkLink {
  label: string;
  href: string;
}

export interface WorkItem {
  kicker?: string;
  title: string;
  summary: string;
  context?: string;
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
  engineeringHeading: string;
  engineering: string[];
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
  engineeringHeading: 'Engineering context',
  engineering: [
    'Twenty years of enterprise risk architecture and real-time systems now extend into current production AI work.',
    'Floating maxima under opacity is a conceptual stress-testing approach.',
    'Robust systems resist stress. Antifragile systems use evidence from stress and failure to strengthen evaluations, controls, and recovery paths through human engineering. Opacity means incomplete knowledge of future conditions rather than hidden system behaviour.',
  ],
  workHeading: 'Selected work',
  work: [
    {
      kicker: 'Flagship project',
      title: 'Autonomous Enterprise Decision Intelligence Platform',
      summary:
        'A multi-agent platform for investigating complex enterprise decisions. Specialist agents analyse independent business domains, critically review findings, and synthesise evidence into a structured recommendation for human decision-makers.',
      link: {
        label: 'Read the architecture and design case study',
        href: '/work/decision-intelligence/',
      },
    },
    {
      title: 'Self-Learning AP Automation',
      summary:
        'Non-PO invoices arrive without a purchase order to anchor their coding. The system retrieves similar historically coded lines, then uses specialist agents to assess the entity, VAT treatment, and cost centre. A separate reasoning step reviews agent disagreements before routing each line to automatic posting or human review. Agent flags can escalate a decision, but never override a human.',
      context:
        'Evaluation context: The system was evaluated on 11,118 real invoice lines from the LA Checkbook dataset. It achieved a 71.5% automation rate at 99.47% accuracy. Automation refers to work routed to automatic posting rather than manual review; the objective is dependable automation with explicit controls, not maximum automation at any cost.',
      link: {
        label: 'Repository',
        href: 'https://github.com/WaiteM124/ap-automation',
      },
    },
    {
      title: 'Governed ERP Automation',
      summary:
        'The platform lets employees query and operate a live ERP through natural-language Slack conversations. It supports AP/AR workflows including invoices, receipts, payments, journals, and credit notes. It can also chain multiple tool calls to investigate questions such as why invoices remain outstanding or calculate a customer’s net financial position.',
      context:
        'Architecture context: The 90+ tools are discrete ERP operations exposed to the agent — not 90+ autonomous agents. Consequential writes pass through middleware enforcing approval queues, idempotency, and audit logging. Humans approve controlled actions before execution, while distributed tracing connects each conversation, tool execution, and downstream API call for diagnosis and accountability.',
      link: {
        label: 'Related repository',
        href: 'https://github.com/WaiteM124/governed-agent-toolkit',
      },
    },
    {
      title: 'Enterprise RAG Assistant',
      summary:
        'The assistant gives consultants natural-language access to organisational knowledge without manually searching across documents. It combines keyword and semantic retrieval to find relevant material, then generates grounded answers. Separate tenant-specific collections keep each organisation’s data isolated.',
      context:
        'Evaluation context: The assistant serves 200+ active users across two tenants, with sub-three-second median latency. Its 9.1/10 score is the average result on a purpose-built 500+ question golden dataset, evaluated with RAGAS and validated through human review — not a score from a generic public benchmark. Releases are gated against the dataset, with low-scoring cases reviewed before changes are accepted.',
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
