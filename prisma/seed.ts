/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import "dotenv/config";

const rawUrl = process.env.DATABASE_URL || "";
const connectionString = rawUrl
  .replace("&channel_binding=require", "")
  .replace("?channel_binding=require&", "?")
  .replace("?channel_binding=require", "");

const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database with Divine Adesiyan's authentic profile and CV data...");

  // 1. Seed or update Admin User
  const adminEmail = "divinegiftadesiyan@gmail.com";
  const rawAdminPassword = process.env.ADMIN_PASSWORD || "admin";
  const passwordHash = await bcrypt.hash(rawAdminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      name: "Divine Adesiyan",
    },
    create: {
      email: adminEmail,
      passwordHash,
      name: "Divine Adesiyan",
    },
  });

  // 2. Clear existing records for full fresh sync
  // await prisma.post.deleteMany({});
  // await prisma.timelineEvent.deleteMany({});
  // await prisma.workspaceItem.deleteMany({});
  // await prisma.competency.deleteMany({});
  // await prisma.socialLink.deleteMany({});
  // await prisma.siteSetting.deleteMany({});

  // 3. Centralized Site Settings (Editable via Admin)
  const siteSettings = [
    {
      key: "hero_headline",
      value: "Divine Adesiyan",
    },
    {
      key: "hero_badge_text",
      value: "Co-Founder @ MyInvite • Technical Product Manager @ Fieldbase • Senior Backend Lead",
    },
    {
      key: "hero_subheadline",
      value: "Technical Product Manager, Systems Architect & Full Stack Engineer",
    },
    {
      key: "hero_bio",
      value: "8+ years of engineering leadership building resilient systems across high-throughput fintech, edtech, e-commerce, and enterprise SaaS. Specializing in high-throughput microservices, Redis caching topologies, and distributed architectures.",
    },
    {
      key: "about_headline",
      value: "Architecting resilient systems, leading cross-functional squads, and scaling distributed platforms.",
    },
    {
      key: "about_bio",
      value: "Technical Product and Project Manager with 8+ years of cross-functional experience steering product strategy, technical architecture, and end-to-end execution across high-throughput fintech, edtech, e-commerce, and enterprise SaaS platforms. Proven track record bridging technical engineering depth with product discovery, PRD authoring, backlog prioritization, and iterative user-driven rollouts. Adept at orchestrating Agile squads to launch resilient microservices architectures, scale transactional engines to 50k+ active users, reduce API response times by 70%, and optimize operational throughput while aligning engineering velocity with measurable business KPIs.",
    },
    {
      key: "smtp_host",
      value: "",
    },
    {
      key: "smtp_port",
      value: "587",
    },
    {
      key: "smtp_user",
      value: "",
    },
    {
      key: "smtp_pass",
      value: "",
    },
    {
      key: "smtp_from",
      value: "Divine Adesiyan <divinegiftadesiyan@gmail.com>",
    },
    {
      key: "smtp_secure",
      value: "false",
    },
  ];

  for (const _setting of siteSettings) {
    // await prisma.siteSetting.create({ data: setting });
  }

  // 4. Verified Social Links (from CV)
  const socialLinks = [
    {
      platform: "github",
      label: "GitHub",
      url: "https://github.com/luisthe-dev",
      icon: "github",
      order: 1,
      isEnabled: true,
    },
    {
      platform: "linkedin",
      label: "LinkedIn",
      url: "https://linkedin.com/in/divinegiftadesiyan",
      icon: "linkedin",
      order: 2,
      isEnabled: true,
    },
    {
      platform: "x",
      label: "X (Twitter)",
      url: "https://x.com/luisthe___dev",
      icon: "twitter",
      order: 3,
      isEnabled: true,
    },
    {
      platform: "substack",
      label: "Substack",
      url: "https://substack.com/@luisthedev",
      icon: "substack",
      order: 4,
      isEnabled: true,
    },
    {
      platform: "medium",
      label: "Medium",
      url: "https://medium.com/@luisthedev",
      icon: "medium",
      order: 5,
      isEnabled: true,
    },
    {
      platform: "email",
      label: "Email",
      url: "mailto:divinegiftadesiyan@gmail.com",
      icon: "mail",
      order: 6,
      isEnabled: true,
    },
  ];

  for (const _link of socialLinks) {
    // await prisma.socialLink.create({ data: link });
  }

  // 5. Core Competencies & Technical Skills (from CV)
  const competencies = [
    {
      category: "Backend Engineering",
      skills: [
        "PHP (Laravel, Symfony, CodeIgniter)",
        "Golang",
        "Node.js (Express.js, NestJS)",
        "RESTful APIs",
        "Microservices Architecture",
        "gRPC",
      ],
      order: 1,
    },
    {
      category: "Frontend & Mobile",
      skills: [
        "React.js",
        "React Native",
        "TypeScript",
        "Next.js",
        "Redux",
        "Vue.js",
        "Tailwind CSS",
      ],
      order: 2,
    },
    {
      category: "Databases & Caching",
      skills: [
        "MySQL",
        "PostgreSQL",
        "Redis (Caching, Queues, Crons, Background Workers)",
        "Database Indexing & Query Tuning",
      ],
      order: 3,
    },
    {
      category: "Cloud & DevOps",
      skills: [
        "AWS Cloud",
        "Microsoft Azure",
        "Huawei Cloud",
        "Docker & Containerization",
        "CI/CD Pipelines",
        "Git Workflows",
      ],
      order: 4,
    },
    {
      category: "Product Management & Systems Architecture",
      skills: [
        "System Design & High Availability",
        "Agile / Scrum Frameworks",
        "Product Lifecycle Management (PLM)",
        "PRD & Feature Specifications",
        "Backlog Prioritization & Sprint Planning",
        "Team Leadership & Mentorship",
      ],
      order: 5,
    },
  ];

  for (const _comp of competencies) {
    // await prisma.competency.create({ data: comp });
  }

  // 6. Timeline Events: Experience, Education, and Certifications from CVs
  const timelineEvents = [
    // --- Experience / Leadership ---
    {
      year: 2026,
      period: "Apr 2026 – Present",
      category: "experience",
      title: "Co-Founder & Head of Product",
      organization: "MyInvite",
      location: "Lagos, Nigeria",
      description:
        "Define product vision, end-to-end user flows, and milestone roadmap for the MyInvite event ticketing and registration platform. Lead cross-functional execution aligning technical system architecture with organizer referral economics and organic user acquisition strategies.",
      link: "https://myinvite.ng",
      order: 1,
    },
    {
      year: 2025,
      period: "Dec 2025 – Present",
      category: "experience",
      title: "Technical Product Manager / Backend Engineer",
      organization: "Fieldbase Services Limited",
      location: "Lagos, Nigeria",
      description:
        "Oversee technical delivery and architecture for core service modules, ensuring alignment with project timelines and quality standards. Coordinate cross-functional technical workflows to optimize infrastructure performance, operational reliability, and sprint velocity.",
      link: null,
      order: 2,
    },
    {
      year: 2023,
      period: "Jul 2023 – Dec 2025",
      category: "experience",
      title: "Senior Backend Engineer & Product Lead",
      organization: "Konga Group / Konga Online Shopping",
      location: "Lagos, Nigeria",
      description:
        "Engineered and optimized core backend microservices using Golang, PHP (Laravel), Express.js, and NestJS, achieving a 30% improvement in API performance for 50k+ active users. Rebuilt and restructured enterprise Bill Payment engine, deployed to Core Banking Application (CBA). Architected intelligent vendor auto-switching logic (Sochitel, Baxi) with Redis circuit breakers for near-zero downtime. Led end-to-end design and rollout of Savings Platform and automated Transaction Scheduler.",
      link: "https://konga.com",
      order: 3,
    },
    {
      year: 2023,
      period: "Apr 2023 – Sept 2023",
      category: "experience",
      title: "Full Stack Engineer",
      organization: "Hostville Nigeria",
      location: "Lagos, Nigeria",
      description:
        "Spearheaded platform overhaul for Edclearn (EdTech), delivering 99% uptime with Symfony, CodeIgniter, and Laravel. Designed and optimized RESTful APIs backed by Redis caching and background crons on AWS for fast data retrieval and async execution.",
      link: null,
      order: 4,
    },
    {
      year: 2021,
      period: "Nov 2021 – Dec 2022",
      category: "experience",
      title: "Lead Frontend Engineer (React)",
      organization: "The Connected Awards & Techtrend Africa",
      location: "Ibadan, Nigeria",
      description:
        "Architected inaugural version of tech recognition platform, engineering public nomination workflows, voting modules, and real-time winner dashboards. Integrated dynamic REST APIs and implemented technical SEO for maximum reach.",
      link: null,
      order: 5,
    },
    {
      year: 2022,
      period: "Jul 2022 – Nov 2022",
      category: "experience",
      title: "React JS Developer",
      organization: "Newage Solutions",
      location: "Ibadan, Nigeria",
      description:
        "Contributed to Respay (Real Estate SaaS platform), automating rent payments, fee processing, and service dispatch workflows. Built responsive UI components with Redux and Tailwind CSS, reducing page load latency by 20%.",
      link: null,
      order: 6,
    },
    {
      year: 2022,
      period: "Feb 2022 – Aug 2022",
      category: "experience",
      title: "Contract React Native Developer & Sub-Team Lead",
      organization: "Famesify",
      location: "Abuja, Nigeria",
      description:
        "Built cross-platform mobile features using React Native and Firebase, implementing real-time data sync and secure authentication. Led a development sub-team in Agile sprints while applying mobile SEO and app store optimization.",
      link: null,
      order: 7,
    },
    {
      year: 2021,
      period: "Mar 2021 – Jul 2022",
      category: "experience",
      title: "Senior PHP Backend Developer",
      organization: "Renager & Xcityworld",
      location: "Lagos / Ilorin, Nigeria",
      description:
        "Architected scalable Laravel APIs, background worker queues, and Redis caching layers for high-throughput enterprise systems. Mentored junior engineers and bootcamp cohorts in software architecture best practices and clean code guidelines.",
      link: null,
      order: 8,
    },
    {
      year: 2020,
      period: "Oct 2020 – Feb 2021",
      category: "experience",
      title: "Full Stack Web Developer",
      organization: "KPIE Industries",
      location: "Lagos, Nigeria",
      description:
        "Engineered core backend microservices for AMATnow (food delivery ecosystem), handling order dispatch, real-time payment processing, and driver routing. Boosted application response speeds by 25% utilizing Redis caching and async background workers.",
      link: null,
      order: 9,
    },
    {
      year: 2020,
      period: "Mar 2020 – Jun 2022",
      category: "experience",
      title: "Contract Full Stack Web Developer",
      organization: "Flinoid Texvo",
      location: "Nigeria",
      description:
        "Built tailored, high-performance web solutions using Laravel and PHP while managing Git workflows across development squads.",
      link: null,
      order: 10,
    },
    {
      year: 2017,
      period: "Jan 2017 – Mar 2020",
      category: "experience",
      title: "Full Stack Web Developer",
      organization: "Codeforum",
      location: "Ibadan, Nigeria",
      description:
        "Promoted after completing internship; developed web interfaces and backend services using PHP, JavaScript, and Laravel. Standardized internal Git version control practices and mentored junior development cohorts.",
      link: null,
      order: 11,
    },

    // --- Education / Schooling ---
    {
      year: 2026,
      period: "Oct 2026 – Oct 2027",
      category: "schooling",
      title: "Master of Business Administration (MBA)",
      organization: "Rome Business School",
      location: "Rome / Online",
      description:
        "Advanced executive leadership, strategic operations, and technology management.",
      link: null,
      order: 1,
    },
    {
      year: 2018,
      period: "2018 – 2023",
      category: "schooling",
      title: "Bachelor of Technology (B.Tech), Computer Science & Education",
      organization: "University of Ilorin",
      location: "Ilorin, Nigeria",
      description:
        "Core computer science curriculum including distributed algorithms, data structures, database design, software engineering methodologies, and educational technology.",
      link: null,
      order: 2,
    },
    {
      year: 2016,
      period: "2016 – 2018",
      category: "schooling",
      title: "National Diploma (ND), Computer Science",
      organization: "Federal School of Statistics",
      location: "Nigeria",
      description:
        "Foundational training in computer systems, programming fundamentals, numerical analysis, and statistics.",
      link: null,
      order: 3,
    },

    // --- Certifications ---
    {
      year: 2022,
      period: "Certified",
      category: "certification",
      title: "SQL Fundamentals Certification",
      organization: "Sololearn",
      location: "Online",
      description: "Advanced relational query design, subqueries, indexing, and joins.",
      link: null,
      order: 1,
    },
    {
      year: 2022,
      period: "Certified",
      category: "certification",
      title: "PHP Certification",
      organization: "Sololearn",
      location: "Online",
      description: "Object-oriented PHP, security best practices, and backend web development.",
      link: null,
      order: 2,
    },
    {
      year: 2021,
      period: "Certified",
      category: "certification",
      title: "HTML & CSS Fundamentals",
      organization: "Sololearn",
      location: "Online",
      description: "Semantic HTML5, responsive layout architecture, and CSS styling.",
      link: null,
      order: 3,
    },
  ];

  for (const _event of timelineEvents) {
    // await prisma.timelineEvent.create({ data: event });
  }

  // 7. Workspace Items
  const workspaceItems = [
    {
      category: "hardware",
      name: "Apple MacBook Pro M-Series",
      description: "Configured for local Docker microservices and high-throughput compilation",
      icon: "laptop",
      order: 1,
    },
    {
      category: "hardware",
      name: "UltraWide Dual Monitor Display",
      description: "High-density screen real estate for concurrent code inspection and metrics monitoring",
      icon: "monitor",
      order: 2,
    },
    {
      category: "hardware",
      name: "Mechanical Keyboard & Ergonomic Peripherals",
      description: "Tactile key switches calibrated for long architecture and coding sessions",
      icon: "keyboard",
      order: 3,
    },
    {
      category: "software",
      name: "VS Code / Cursor & Warp Terminal",
      description: "Core IDE environment tuned with strict TypeScript, Golang, and PHP extensions",
      icon: "terminal",
      order: 1,
    },
    {
      category: "software",
      name: "Postman, Bruno & Insomnia",
      description: "API testing, automated contract testing, and webhook simulation",
      icon: "send",
      order: 2,
    },
    {
      category: "software",
      name: "TablePlus & Redis Insight",
      description: "Direct GUI inspection for PostgreSQL, MySQL, and distributed Redis key spaces",
      icon: "database",
      order: 3,
    },
    {
      category: "cloud_services",
      name: "AWS, Azure & Huawei Cloud",
      description: "Multi-cloud hosting, container orchestration, and serverless compute",
      icon: "cloud",
      order: 1,
    },
    {
      category: "cloud_services",
      name: "Docker Containerization & GitHub Actions",
      description: "Reproducible microservice builds, automated testing, and zero-downtime deployment",
      icon: "layers",
      order: 2,
    },
    {
      category: "cloud_services",
      name: "Neon PostgreSQL & Upstash Redis",
      description: "Serverless relational storage with automated pooling and distributed low-latency caching",
      icon: "database",
      order: 3,
    },
  ];

  for (const _item of workspaceItems) {
    // await prisma.workspaceItem.create({ data: item });
  }

  // 8. Published High-Impact Articles
  const articles = [
    {
      slug: "architecting-intelligent-vendor-failover-fintech",
      title: "Architecting Intelligent Vendor Auto-Switching in High-Throughput Fintech",
      excerpt:
        "How we designed zero-downtime automated failover routing between telecom and bill payment providers at Konga, maximizing transaction success rates for 50k+ active users.",
      content: `
In digital financial infrastructure, provider unreliability is an inevitability. When processing millions in utility payments, airtime, and data recharges, vendor downtime directly erodes customer trust and transaction throughput.

## The Multi-Provider Routing Dilemma

Integrating tier-1 telco aggregators like Sochitel and Baxi provided cost-competitive routing, but manual failovers during latency spikes or API degraded states proved unsustainable. We needed an autonomous engine capable of assessing vendor health in real-time.

> "Resilience in financial systems isn't achieved by hoping upstream vendors never fail; it is achieved by architecting for graceful, automated degradation and instant recovery."

## Circuit Breakers and Dynamic Health Scoring

We engineered a state-driven vendor routing middleware backed by Redis. Providers are evaluated across sliding 60-second windows measuring failure rates, response times, and HTTP status codes.

\`\`\`typescript
interface VendorHealthScore {
  vendorId: string;
  successRate: number;
  averageLatencyMs: number;
  circuitState: "CLOSED" | "OPEN" | "HALF_OPEN";
}

async function resolveOptimalVendor(category: string): Promise<string> {
  const vendors = await redis.zrevrangebyscore(\`vendors:health:\${category}\`, "+inf", "-inf");
  for (const vendorId of vendors) {
    const isAvailable = await checkCircuitStatus(vendorId);
    if (isAvailable) return vendorId;
  }
  throw new Error("All vendor gateways currently unavailable");
}
\`\`\`

When an active vendor's error threshold exceeds 5%, the circuit breaker trips to OPEN, automatically diverting inflight transactions to secondary failover nodes without dropping user requests.

## Impact on Operational Metrics

By coupling Golang microservices with Redis caching and asynchronous reconciliation queues, we achieved a 30% improvement in API response times and maintained a 99.9% transaction success rate across peak shopping campaigns.
      `.trim(),
      coverImage: "/24.jpg",
      category: "Tech",
      tags: ["Golang", "Fintech", "Microservices", "Redis"],
      readTime: "6 min read",
      status: "published",
      featured: true,
      isSyndicated: false,
      createdAt: new Date("2024-11-15T10:00:00Z"),
      publishedAt: new Date("2024-11-15T10:00:00Z"),
    },
    {
      slug: "optimizing-redis-caching-background-workers",
      title: "Optimizing Microservices Throughput by 50% Using Redis & Worker Queues",
      excerpt:
        "A practical guide to decoupling transactional writes from asynchronous batch jobs, reducing latency and infrastructure overhead in enterprise microservices.",
      content: `
High-traffic enterprise applications often struggle with write amplification and blocking I/O when synchronous operations attempt to handle notifications, PDF receipts, and third-party webhooks concurrently.

## Decoupling the Critical Request Path

During our backend restructuring at Konga, we segregated synchronous transaction verification from downstream async tasks. When a customer executes a bill payment, the HTTP request cycle only commits the core database state and enqueues a lightweight job payload into Redis.

> "If an operation does not need to happen before returning an HTTP 200 to the client, it belongs on a background queue."

Here is how our transaction scheduler coordinates asynchronous workers:

\`\`\`typescript
import { Queue, Worker } from "bullmq";

export const transactionQueue = new Queue("transactions", {
  connection: redisConnection,
});

export const worker = new Worker(
  "transactions",
  async (job) => {
    const { transactionId, accountId, amount } = job.data;
    await syncCoreBankingApplication(transactionId);
    await dispatchCustomerNotification(accountId, amount);
  },
  { concurrency: 25 }
);
\`\`\`

## Results and Takeaways

Decoupling the critical path reduced peak response latency from 1.8s down to 320ms, while enabling our background workers to absorb traffic bursts smoothly without overwhelming downstream services.
      `.trim(),
      coverImage: "/24.jpg",
      category: "Architecture",
      tags: ["Redis", "Distributed Systems", "Performance", "Queues"],
      readTime: "5 min read",
      status: "published",
      featured: true,
      isSyndicated: false,
      createdAt: new Date("2024-10-20T14:30:00Z"),
      publishedAt: new Date("2024-10-20T14:30:00Z"),
    },
    {
      slug: "building-myinvite-qr-ticketing-architecture",
      title: "Engineering MyInvite: QR Ticketing and Offline Verification at Scale",
      excerpt:
        "Designing cryptographic offline-verifiable QR passes, high-concurrency seat reservation locks, and organizer referral economics for live events.",
      content: `
When attendees queue up outside a live concert or conference, cellular networks frequently saturate. If your event ticketing platform relies exclusively on synchronous internet pings to validate digital tickets at the turnstiles, long queues and frustrated attendees are guaranteed.

## Cryptographically Signed Offline Passes

At MyInvite, we solved this problem by architecting asymmetric HMAC-signed QR tokens. The gate scanner caches the organizer's public key locally on device. When a ticket QR code is presented, the scanner validates the signature offline in under 40 milliseconds.

\`\`\`typescript
import { createHmac } from "crypto";

export function generateEventTicketPass(ticketId: string, eventId: string, secret: string) {
  const payload = \`\${ticketId}:\${eventId}:\${Date.now()}\`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return \`\${payload}.\${signature}\`;
}
\`\`\`

## High-Concurrency Distributed Reservation Locks

During high-demand ticket drops, thousands of users compete for limited tier allocations within seconds. To prevent overbooking, we implemented atomic Redis Redlock distributed locks with 10-minute hold expirations.

This architecture ensures zero double-allocations while giving purchasers adequate time to complete checkout seamlessly.
      `.trim(),
      coverImage: "/24.jpg",
      category: "Product",
      tags: ["System Design", "Event Tech", "Security", "Crypto"],
      readTime: "7 min read",
      status: "published",
      featured: true,
      isSyndicated: true,
      syndicationPlatform: "Substack",
      syndicationUrl: "https://substack.com/@luisthedev",
      syndicatedTime: "Published on Substack",
      createdAt: new Date("2024-09-05T09:00:00Z"),
      publishedAt: new Date("2024-09-05T09:00:00Z"),
    },
  ];

  for (const _article of articles) {
    // await prisma.post.create({ data: article });
  }

  console.log("Database seeded successfully with all authentic CV data, competencies, and articles!");
}

main()
  .catch((e: unknown) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
