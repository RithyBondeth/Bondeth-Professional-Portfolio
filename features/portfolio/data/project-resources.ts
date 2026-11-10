import type { Project, ProjectLink } from "@/features/portfolio/domain";

type RepositorySource = {
  repo: string;
  docs?: string;
  readmeSection?: string;
};

const sources: Readonly<Partial<Record<string, RepositorySource>>> = {
  askdb: { repo: "AskDB", readmeSection: "installation" },
  "cambodia-3d-map": { repo: "Cambodia-3D-Map", docs: "docs/PROJECT_NOTES.md" },
  "bondeth-studio": {
    repo: "Bondeth-Content-Studio",
    readmeSection: "getting-started",
  },
  "the-unbroken-debt": { repo: "The-Unbroken-Debt" },
  "angkor-architect": {
    repo: "Angkor-Architecture",
    readmeSection: "run-locally",
  },
  "bondeth-ai": { repo: "Bondeth-AI", docs: "docs/architecture.md" },
  "nexus-pc": { repo: "Nexus-PC", docs: "docs/phase-0-feasibility.md" },
  "visioncare-ai": {
    repo: "Visioncare-AI",
    docs: "Visioncare Platform/README.md",
  },
  "bondex-notch": { repo: "Bondex-Notch", docs: "bondex-notch-app/README.md" },
  "apsara-talent": { repo: "ApsaraTalent-Web" },
  "apsara-assistant": { repo: "Apsara-Assistant-Web" },
  "apsara-agentic": { repo: "Apsara-Agentic-Cli" },
  "apsara-elearning": { repo: "Apsara-Elearning-Web" },
  "apsara-wallet": { repo: "Apsara-Wallet-Web" },
  romlerk: { repo: "Romlerk-Mobile" },
  pdfflow: { repo: "PDFFlow", docs: "docs/architecture.md" },
  "reahu-generator": { repo: "Reahu-Generator" },
  "bondeth-world": {
    repo: "3D-Simulation-Portfolio",
    docs: "docs/architecture.md",
  },
  "code-hub": { repo: "Codehub-Frontend" },
  "apple-clone": { repo: "Next-Apple-Clone" },
  "tesla-clone": { repo: "React-Tesla-Clone" },
  "sabynews-clone": { repo: "React-SabayNews-Clone" },
};

export function getProjectResources(project: Project): ProjectLink[] {
  const source = sources[project.slug];
  if (project.visibility !== "public" || !source) return project.links;
  const url = `https://github.com/RithyBondeth/${source.repo}`;
  return [
    ...project.links.filter((link) => link.kind !== "repo"),
    { kind: "repo", url },
    {
      kind: "docs",
      url: source.docs
        ? `${url}/blob/HEAD/${encodeURI(source.docs)}`
        : `${url}#${source.readmeSection ?? "readme"}`,
    },
  ];
}
