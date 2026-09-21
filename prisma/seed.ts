import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with Divine Adesiyan's profile and articles...");

  // Clear existing records
  await prisma.post.deleteMany({});
  await prisma.timelineEvent.deleteMany({});
  await prisma.workspaceItem.deleteMany({});

  const articles = [
    {
      slug: "architecting-intelligent-vendor-failover-fintech",
      title: "Architecting Intelligent Vendor Auto-Switching in High-Throughput Fintech",
      excerpt:
        "How we designed zero-downtime automated failover routing between telecom and bill payment providers at Konga, maximizing transaction success rates for 50k+ active users.",
      content: `
<p>In digital financial infrastructure, provider unreliability is an inevitability. When processing millions in utility payments, airtime, and data recharges, vendor downtime directly erodes customer trust and transaction throughput.</p>

<h2>The Multi-Provider Routing Dilemma</h2>
<p>Integrating tier-1 telco aggregators like Sochitel and Baxi provided cost-competitive routing, but manual failovers during latency spikes or API degraded states proved unsustainable. We needed an autonomous engine capable of assessing vendor health in real-time.</p>

<blockquote>
"Resilience in financial systems isn't achieved by hoping upstream vendors never fail; it is achieved by architecting for graceful, automated degradation and instant recovery."
</blockquote>

<h2>Circuit Breakers and Dynamic Health Scoring</h2>
<p>We engineered a state-driven vendor routing middleware backed by Redis. Providers are evaluated across sliding 60-second windows measuring failure rates, response times, and HTTP status codes.</p>

<pre><code class="language-typescript">interface VendorHealthScore {
  vendorId: string;
  successRate: number;
  averageLatencyMs: number;
  circuitState: "CLOSED" | "OPEN" | "HALF_OPEN";
}

async function resolveOptimalVendor(category: string): Promise&lt;string&gt; {
  const vendors = await redis.zrevrangebyscore(\`vendors:health:\${category}\`, "+inf", "-inf");
  for (const vendorId of vendors) {
    const isAvailable = await checkCircuitStatus(vendorId);
    if (isAvailable) return vendorId;
  }
  throw new Error("All vendor gateways currently unavailable");
}
</code></pre>

<p>When an active vendor's error threshold exceeds 5%, the circuit breaker trips to OPEN, automatically diverting inflight transactions to secondary failover nodes without dropping user requests.</p>

<figure>
  <img src="/24.jpg" alt="Fintech transaction routing architecture" class="rounded-xl w-full object-cover max-h-96 shadow-md my-4" />
  <figcaption class="text-xs text-muted-foreground text-center mt-2">Vendor auto-switching topology with distributed circuit breakers and Redis health tracking</figcaption>
</figure>

<h2>Impact on Operational Metrics</h2>
<p>By coupling Golang microservices with Redis caching and asynchronous reconciliation queues, we achieved a 30% improvement in API response times and maintained a 99.9% transaction success rate across peak shopping campaigns.</p>
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
<p>High-traffic enterprise applications often struggle with write amplification and blocking I/O when synchronous operations attempt to handle notifications, PDF receipts, and third-party webhooks concurrently.</p>

<h2>Decoupling the Critical Request Path</h2>
<p>During our backend restructuring at Konga, we segregated synchronous transaction verification from downstream async tasks. When a customer executes a bill payment, the HTTP request cycle only commits the core database state and enqueues a lightweight job payload into Redis.</p>

<blockquote>
"If an operation does not need to happen before returning an HTTP 200 to the client, it belongs on a background queue."
</blockquote>

<p>Here is how our transaction scheduler coordinates asynchronous workers:</p>

<pre><code class="language-typescript">import { Queue, Worker } from "bullmq";

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
</code></pre>

<figure>
  <img src="/25.jpg" alt="Redis queue worker architecture" class="rounded-xl w-full object-cover max-h-96 shadow-md my-4" />
  <figcaption class="text-xs text-muted-foreground text-center mt-2">Distributed job queuing architecture deployed on containerized multi-cloud infrastructure</figcaption>
</figure>

<h2>Results in Production</h2>
<p>Offloading secondary computations to dedicated worker pools deployed on Azure and Huawei Cloud reduced CPU starvation on main API instances and slashed p95 latencies by more than half.</p>
      `.trim(),
      coverImage: "/25.jpg",
      category: "Architecture",
      tags: ["Redis", "Architecture", "Docker", "Node.js"],
      readTime: "5 min read",
      status: "published",
      featured: true,
      isSyndicated: false,
      createdAt: new Date("2024-11-08T14:00:00Z"),
      publishedAt: new Date("2024-11-08T14:00:00Z"),
    },
    {
      slug: "scaling-fintech-engineering-lessons-learned",
      title: "Lessons from 8+ Years Building Scalable African Fintech & Edtech",
      excerpt:
        "Reflections from scaling payments at Konga, building real estate payment engines at Respay, and delivering edtech platforms under high uptime SLAs.",
      content: `
<p>Over the last eight years, building software across Nigeria and international ecosystems has taught me that architectural elegance must always serve operational reliability. Whether building food delivery dispatch at AMATnow, real estate rent automation at Respay, or core payment engines at Konga, the fundamentals remain consistent.</p>

<h2>1. Treat Data Contracts as Immutable</h2>
<p>Breaking changes in internal microservice APIs propagate failures downstream. Always version endpoints, enforce strict typing with TypeScript and Protocol Buffers, and implement schema validation at system boundaries.</p>

<h2>2. Observability Over Intuition</h2>
<p>Logs are necessary, but structured telemetry, distributed tracing, and real-time alert thresholds identify silent failures before customers report them.</p>

<blockquote>
"Software is never finished; it evolves through constant iteration, measurement, and ruthless simplification."
</blockquote>

<figure>
  <img src="/32.jpg" alt="Software development workspace" class="rounded-xl w-full object-cover max-h-96 shadow-md my-4" />
  <figcaption class="text-xs text-muted-foreground text-center mt-2">Continuous delivery and architectural refactoring across distributed engineering teams</figcaption>
</figure>
      `.trim(),
      coverImage: "/32.jpg",
      category: "Personal Blog",
      tags: ["Leadership", "Fintech", "Career", "Mentorship"],
      readTime: "7 min read",
      status: "published",
      featured: true,
      isSyndicated: true,
      syndicationPlatform: "Substack",
      syndicationUrl: "https://substack.com/@luisthedev",
      syndicatedTime: "3 minutes ago",
      createdAt: new Date("2024-10-30T16:00:00Z"),
      publishedAt: new Date("2024-10-30T16:00:00Z"),
    },
    {
      slug: "rebuilding-enterprise-bill-payment-engine",
      title: "Rebuilding an Enterprise Bill Payment Engine for Core Banking Integration",
      excerpt:
        "How we restructured our payment processing core to interface directly with Core Banking Applications (CBA) with automated reconciliation.",
      content: `
<p>Enterprise bill payment platforms require stringent reconciliation mechanisms. Integrating directly with Core Banking Applications (CBA) demanded automated ledger balancing, idempotency keys, and scheduled batch reconciliation.</p>
<p>We achieved zero manual reconciliation discrepancies across 50,000+ monthly active users through structured event logging and automated audit trails.</p>
      `.trim(),
      coverImage: "/33.jpg",
      category: "Writing",
      tags: ["Fintech", "CBA", "Golang", "PHP"],
      readTime: "6 min read",
      status: "published",
      featured: false,
      isSyndicated: true,
      syndicationPlatform: "Substack",
      syndicationUrl: "https://substack.com/@luisthedev",
      syndicatedTime: "2 hours ago",
      createdAt: new Date("2024-10-22T09:00:00Z"),
      publishedAt: new Date("2024-10-22T09:00:00Z"),
    },
    {
      slug: "automated-transaction-schedulers-recurring-payments",
      title: "Designing Fault-Tolerant Transaction Schedulers for Recurring Payments",
      excerpt:
        "Building automated crons and distributed lock managers to execute user savings and recurring billing without double-charging.",
      content: `
<p>Recurring payments present subtle race conditions in distributed environments. Multiple worker instances can inadvertently process the same subscription renewal if lock acquisition fails.</p>
<p>Using Redis Redlock algorithms and idempotent transaction tokens, we ensured strict once-and-only-once execution guarantees across all recurring payment workflows.</p>
      `.trim(),
      coverImage: "/24.jpg",
      category: "Tech",
      tags: ["Redis", "DistributedSystems", "Fintech"],
      readTime: "5 min read",
      status: "published",
      featured: false,
      isSyndicated: true,
      syndicationPlatform: "Medium",
      syndicationUrl: "https://medium.com/@luisthedev",
      syndicatedTime: "5 hours ago",
      createdAt: new Date("2024-10-18T11:00:00Z"),
      publishedAt: new Date("2024-10-18T11:00:00Z"),
    },
    {
      slug: "nextjs-tailwind-react-native-design-systems",
      title: "Unified Design Systems: From Next.js Web to React Native Mobile",
      excerpt:
        "Techniques for sharing design tokens, component architecture, and API consumers between web applications and cross-platform mobile apps.",
      content: `
<p>Maintaining visual consistency across responsive web platforms and React Native mobile clients requires intentional abstraction. By centralizing design tokens in Tailwind and TypeScript types in shared modules, engineering velocity increases dramatically.</p>
      `.trim(),
      coverImage: "/25.jpg",
      category: "Tech",
      tags: ["Next.js", "React Native", "TailwindCSS", "TypeScript"],
      readTime: "4 min read",
      status: "published",
      featured: false,
      isSyndicated: true,
      syndicationPlatform: "Personal Blog",
      syndicationUrl: null,
      syndicatedTime: "1 day ago",
      createdAt: new Date("2024-10-12T13:00:00Z"),
      publishedAt: new Date("2024-10-12T13:00:00Z"),
    },
  ];

  for (const post of articles) {
    await prisma.post.create({ data: post });
  }

  // Real timeline events from Divine Adesiyan's resume & luisdev.ng platforms
  const timelineEvents = [
    {
      year: 2026,
      category: "milestone",
      title: "Co-founder @ MyInvite",
      description:
        "Co-founded streamlined event management and ticketing platform (from April 2026), implementing high-throughput QR attendee check-ins, automated ticket verification, and compliant payment gateway integrations.",
      link: "https://myinvite.ng",
      order: 1,
    },
    {
      year: 2026,
      category: "milestone",
      title: "Main Founder & Director @ Luis Dev Limited",
      description:
        "Founded and directing premier Nigerian software engineering and technology consulting agency (from Feb 2026). Leading full-stack engineering, business technology strategy, and AI automation for enterprise clients.",
      link: "https://luisdev.ng",
      order: 2,
    },
    {
      year: 2026,
      category: "project",
      title: "MyInvite — Event Management & QR Ticketing",
      description:
        "High-performance event management application utilizing instant QR-based attendee check-ins, fraud-resistant ticketing, and secure multi-channel payment gateway integrations.",
      link: "https://myinvite.ng",
      order: 3,
    },
    {
      year: 2026,
      category: "project",
      title: "Luis Dev Limited Platform & Consulting Agency",
      description:
        "Full-stack software engineering and business technology consulting agency platform showcasing services, product incubator, and architectural advisory discovery calls.",
      link: "https://luisdev.ng",
      order: 4,
    },
    {
      year: 2026,
      category: "project",
      title: "Agrobod — Agritech Supply Chain Platform",
      description:
        "Tech-driven agritech platform bridging farmers and businesses through supply chain transparency, verified product quality assurance, and direct farm-to-door delivery.",
      link: "https://agrobod.ng",
      order: 5,
    },
    {
      year: 2026,
      category: "project",
      title: "Kairos — Corporate Legal Advisory Platform",
      description:
        "Modern corporate legal platform providing strategic counsel and advisory services across M&A, Real Estate, Corporate Governance, and Dispute Resolution.",
      link: "https://kairos-kohl-psi.vercel.app",
      order: 6,
    },
    {
      year: 2026,
      category: "project",
      title: "Alliance — B2B2C Marketplace Aggregator",
      description:
        "Robust B2B2C marketplace aggregation platform featuring seamless point-of-sale (POS) systems, live inventory synchronization modules, and white-label multi-tenant storefronts.",
      link: "https://luisdev.ng#products",
      order: 7,
    },
    {
      year: 2026,
      category: "project",
      title: "Artisan — Tailor & Fashion Digital Marketplace",
      description:
        "Dedicated independent digital marketplace tailored specifically for fashion designers, tailors, and beauty professionals to manage clients, track orders, and scale operations.",
      link: "https://luisdev.ng#products",
      order: 8,
    },
    {
      year: 2024,
      category: "milestone",
      title: "Senior Backend Engineer @ Konga Online Shopping",
      description:
        "Engineered high-availability Golang and PHP microservices, rebuilt enterprise Bill Payment engine, and delivered 50% throughput gain with Redis caching under 99.9% uptime SLAs.",
      order: 1,
    },
    {
      year: 2024,
      category: "project",
      title: "Konga Savings Platform & Bulk Engines",
      description:
        "Led end-to-end design and launch of the Savings Platform (loyalty rewards, fixed savings, targeted savings) and corporate Bulk Data/Airtime engines.",
      order: 2,
    },
    {
      year: 2023,
      category: "milestone",
      title: "Full Stack Engineer @ Hostville Nigeria",
      description:
        "Spearheaded revamps for Edclearn Edtech platform with Symfony, CodeIgniter, and Laravel, delivering 99% uptime and AWS containerized microservices.",
      order: 1,
    },
    {
      year: 2022,
      category: "project",
      title: "Respay Real Estate Platform @ Newage Solutions",
      description:
        "Engineered core frontend modules for Respay with React, Redux, and Tailwind CSS, automating rent payments, fee processing, and reducing page load times by 20%.",
      order: 1,
    },
    {
      year: 2022,
      category: "project",
      title: "Mobile Apps & The Connected Awards Launch",
      description:
        "Built cross-platform mobile features with React Native at Famesify and engineered the launch voting platform for The Connected Awards at Techtrend Africa.",
      order: 2,
    },
    {
      year: 2022,
      category: "achievement",
      title: "B.Sc. Computer Science & Education",
      description:
        "Graduated from the University of Ilorin with honors in Computer Science & Education.",
      order: 3,
    },
    {
      year: 2021,
      category: "milestone",
      title: "Senior Backend Developer & Mentorship @ Xcityworld",
      description:
        "Architected scalable Laravel APIs, background worker queues, and mentored engineering cohorts in software architecture best practices.",
      order: 1,
    },
    {
      year: 2020,
      category: "project",
      title: "AMATnow Food Delivery Ecosystem @ KPIE",
      description:
        "Engineered real-time order dispatch, driver coordination, and payment integrations boosted by 25% with Redis async job processors.",
      order: 1,
    },
    {
      year: 2017,
      category: "milestone",
      title: "Full Stack Web Developer @ Codeforum",
      description:
        "Began professional engineering journey building scalable web applications with PHP, JavaScript, and Laravel.",
      order: 1,
    },
  ];

  for (const event of timelineEvents) {
    await prisma.timelineEvent.create({ data: event });
  }

  // Real Workspace & Competencies from Resume & Incubator
  const workspaceItems = [
    {
      category: "daily_hardware",
      name: "Apple MacBook Pro M3 & Dual Monitors",
      description: "Primary workstation configured for high-performance microservices development",
      icon: "laptop",
      order: 1,
    },
    {
      category: "daily_hardware",
      name: "Mechanical Keyboard & Ergonomic Peripherals",
      description: "Tactile setup tailored for long coding and technical writing sessions",
      icon: "keyboard",
      order: 2,
    },
    {
      category: "daily_software",
      name: "Golang & Node.js (NestJS, Express)",
      description: "Core backend runtimes for high-throughput APIs and microservices",
      icon: "code",
      order: 1,
    },
    {
      category: "daily_software",
      name: "PHP (Laravel, Symfony, CodeIgniter)",
      description: "Robust enterprise web applications and API frameworks",
      icon: "terminal",
      order: 2,
    },
    {
      category: "daily_software",
      name: "Docker, Azure & Huawei Cloud",
      description: "Containerized deployment pipelines with 99.9% uptime SLAs",
      icon: "cloud",
      order: 3,
    },
    {
      category: "favorite_tools",
      name: "Redis (Cache, Queues, Crons, Redlock)",
      description: "High-speed caching, worker queues, and distributed locks",
      icon: "database",
      order: 1,
    },
    {
      category: "favorite_tools",
      name: "PostgreSQL & MySQL",
      description: "Relational persistence, optimized schemas, and transaction isolation",
      icon: "database",
      order: 2,
    },
    {
      category: "software",
      name: "React JS, React Native & Next.js",
      description: "Modern frontend and cross-platform mobile application development",
      icon: "layers",
      order: 1,
    },
    {
      category: "software",
      name: "TypeScript & Tailwind CSS v4",
      description: "Type-safe styling and component architecture",
      icon: "code",
      order: 2,
    },
    {
      category: "github",
      name: "Luis Dev Limited (luisdev.ng)",
      description: "Software engineering, digital transformation, and business tech consulting agency",
      icon: "globe",
      order: 1,
    },
    {
      category: "github",
      name: "MyInvite (myinvite.ng)",
      description: "High-throughput QR ticketing & modern event management platform",
      icon: "calendar",
      order: 2,
    },
    {
      category: "github",
      name: "luisthe-dev (LuisThe___Dev)",
      description: "Open source contributions, developer utilities, and web experiments",
      icon: "git-branch",
      order: 3,
    },
    {
      category: "resources",
      name: "Fintech Systems Design & Core Banking",
      description: "Automated reconciliation, vendor failover, and high-concurrency schedulers",
      icon: "book",
      order: 1,
    },
  ];

  for (const item of workspaceItems) {
    await prisma.workspaceItem.create({ data: item });
  }

  console.log("Database seeded successfully with Divine Adesiyan's profile!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
