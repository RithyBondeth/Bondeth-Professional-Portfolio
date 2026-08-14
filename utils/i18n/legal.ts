import type { TLocale } from "@/utils/i18n";

export interface ILegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface ILegalResource {
  label: string;
  href: string;
}

export interface ILegalDocument {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  effectiveLabel: string;
  effectiveDate: string;
  contentsLabel: string;
  resourcesLabel: string;
  contactLabel: string;
  sections: ILegalSection[];
  resources: ILegalResource[];
}

interface ILegalDocuments {
  privacy: ILegalDocument;
  terms: ILegalDocument;
}

const en: ILegalDocuments = {
  privacy: {
    metaTitle: "Privacy Policy",
    metaDescription:
      "How Rithy Bondeth's portfolio collects, uses, and protects information from visitors, contact inquiries, and AI chatbot conversations.",
    eyebrow: "Legal · Privacy",
    title: "Privacy Policy",
    intro:
      "This policy explains what information this portfolio handles, why it is used, and which service providers help operate the website. It is written for visitors, prospective clients, collaborators, and chatbot users.",
    effectiveLabel: "Effective",
    effectiveDate: "August 14, 2026",
    contentsLabel: "On this page",
    resourcesLabel: "Provider policies",
    contactLabel: "Privacy questions",
    sections: [
      {
        id: "operator",
        title: "1. Who operates this website",
        paragraphs: [
          "This portfolio is operated by Rithy Bondeth, a software engineer based in Phnom Penh, Cambodia. For privacy questions or requests, use the email address listed at the end of this policy.",
        ],
      },
      {
        id: "information-collected",
        title: "2. Information that may be collected",
        bullets: [
          "Contact information you submit, including your name, email address, project type, and message.",
          "Chatbot messages and the recent conversation context needed to generate a response.",
          "Basic technical and usage information, such as requested pages, approximate location, device or browser type, performance data, and IP-derived security signals.",
          "Interaction events such as contact-form submissions and resume downloads. These events do not intentionally include the form's name, email address, or message.",
        ],
      },
      {
        id: "uses",
        title: "3. How information is used",
        bullets: [
          "To respond to inquiries and evaluate potential projects or collaborations.",
          "To provide, secure, rate-limit, troubleshoot, and improve the website and chatbot.",
          "To understand aggregate website performance and which public content is useful.",
          "To comply with applicable obligations and protect the website, its operator, and visitors from misuse.",
        ],
      },
      {
        id: "chatbot",
        title: "4. AI chatbot",
        paragraphs: [
          "When you send a message to Byte, the message and limited recent conversation history are transmitted to Mistral AI to generate a response. The portfolio does not intentionally save a separate, permanent chat history database.",
          "AI responses can be inaccurate. Do not submit passwords, payment information, confidential business material, health information, government identifiers, or other sensitive personal data.",
          "Mistral states that data submitted under a free API plan may be used for model training unless the account has opted out. Paid Scale-plan API input and output are not used for model training under Mistral's published controls. Mistral may still process data for service delivery, safety, abuse prevention, and legal compliance under its terms.",
        ],
      },
      {
        id: "contact-form",
        title: "5. Contact form and email",
        paragraphs: [
          "Contact-form details are sent through Resend to the portfolio owner's email inbox. Resend processes email addresses, message content, and delivery metadata to deliver the message. Your inquiry is used only to review and respond to the conversation, maintain appropriate business records, and protect against abuse.",
        ],
      },
      {
        id: "analytics",
        title: "6. Analytics, logs, and cookies",
        paragraphs: [
          "The website uses Vercel Web Analytics and Speed Insights. Vercel describes Web Analytics as cookieless and based on anonymized or aggregated data. Hosting infrastructure may also process request metadata and short-lived security information needed to deliver and protect the site.",
          "The website does not currently use advertising cookies. Embedded third-party content, such as a YouTube player, is loaded only after you choose to play it and may then be subject to that provider's cookies and policies.",
        ],
      },
      {
        id: "providers",
        title: "7. Service providers and disclosure",
        paragraphs: [
          "Information is shared only as needed with infrastructure and service providers that operate the website: Vercel for hosting, analytics, and performance monitoring; Mistral AI for chatbot responses; and Resend for contact-form email delivery. Information may also be disclosed when reasonably necessary to comply with law, enforce rights, investigate abuse, or protect safety.",
          "Personal information is not sold, and it is not used for third-party advertising by this portfolio.",
        ],
      },
      {
        id: "international",
        title: "8. International processing",
        paragraphs: [
          "These providers may process information in countries outside Cambodia, including the United States and European jurisdictions. Their privacy, security, and data-transfer terms govern their processing of that information.",
        ],
      },
      {
        id: "retention",
        title: "9. Retention",
        paragraphs: [
          "Contact inquiries and related correspondence are kept only as long as reasonably needed to respond, manage a potential or active professional relationship, maintain necessary records, or resolve disputes. Analytics, infrastructure logs, chatbot data, and email delivery records follow the applicable provider's retention settings and policies.",
        ],
      },
      {
        id: "security",
        title: "10. Security",
        paragraphs: [
          "Reasonable technical safeguards are used, including HTTPS, server-only API credentials, input validation, request limits, and restricted access to service accounts. No internet service can guarantee absolute security, so visitors should avoid submitting information that is not necessary for their inquiry.",
        ],
      },
      {
        id: "choices",
        title: "11. Your choices and requests",
        paragraphs: [
          "You may ask what personal information is held about you, request correction or deletion, object to certain processing, or withdraw a request by emailing the address below. A request may require reasonable identity verification. Some information may be retained where necessary for security, legal obligations, or legitimate record-keeping.",
        ],
      },
      {
        id: "children",
        title: "12. Children's privacy",
        paragraphs: [
          "This professional portfolio is not directed to children and does not knowingly solicit personal information from children. A parent or guardian who believes a child submitted personal information may request its deletion.",
        ],
      },
      {
        id: "changes",
        title: "13. Changes to this policy",
        paragraphs: [
          "This policy may be updated when the website, providers, or applicable requirements change. The effective date at the top of the page identifies the latest published version.",
        ],
      },
    ],
    resources: [
      { label: "Mistral AI privacy policy", href: "https://legal.mistral.ai/terms/privacy-policy" },
      {
        label: "Mistral AI data-training controls",
        href: "https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models",
      },
      { label: "Resend privacy policy", href: "https://resend.com/legal/privacy-policy" },
      {
        label: "Vercel Analytics privacy",
        href: "https://vercel.com/docs/analytics/privacy-policy",
      },
    ],
  },
  terms: {
    metaTitle: "Terms of Use",
    metaDescription:
      "Terms governing use of Rithy Bondeth's portfolio, contact form, public project information, and AI chatbot.",
    eyebrow: "Legal · Terms",
    title: "Terms of Use",
    intro:
      "These terms set expectations for using this portfolio, its public content, contact form, and AI assistant. By continuing to use the website, you agree to use it responsibly and in accordance with these terms.",
    effectiveLabel: "Effective",
    effectiveDate: "August 14, 2026",
    contentsLabel: "On this page",
    resourcesLabel: "Related policies",
    contactLabel: "Questions about these terms",
    sections: [
      {
        id: "purpose",
        title: "1. Purpose of the website",
        paragraphs: [
          "This website presents Rithy Bondeth's professional background, selected projects, services, writing, experiments, and contact information. It is provided for general informational and professional networking purposes.",
        ],
      },
      {
        id: "acceptable-use",
        title: "2. Acceptable use",
        bullets: [
          "Use the website, contact form, and chatbot only for lawful purposes.",
          "Do not attempt to bypass security controls, rate limits, or access restrictions.",
          "Do not introduce malicious code, automate abusive traffic, scrape the site excessively, or interfere with other visitors.",
          "Do not use the chatbot to generate unlawful, harmful, deceptive, infringing, or privacy-invasive material.",
          "Do not submit information that you do not have the right or permission to share.",
        ],
      },
      {
        id: "ai",
        title: "3. AI-generated responses",
        paragraphs: [
          "Byte is an AI assistant powered by Mistral AI. Its responses are automatically generated and may be incomplete, outdated, biased, or incorrect. Responses do not represent a binding statement, offer, guarantee, or commitment by Rithy Bondeth.",
          "Do not rely on chatbot output as legal, medical, financial, security, or other professional advice. Verify important information independently and contact Rithy Bondeth directly for authoritative information about availability, pricing, project scope, or professional arrangements.",
        ],
      },
      {
        id: "professional-engagements",
        title: "4. Inquiries and professional engagements",
        paragraphs: [
          "Submitting a contact form or exchanging messages does not create a client, employment, partnership, confidentiality, or other professional relationship. Any engagement requires a separate written agreement that defines scope, fees, responsibilities, ownership, confidentiality, and other applicable terms.",
        ],
      },
      {
        id: "content",
        title: "5. Portfolio content and intellectual property",
        paragraphs: [
          "Unless otherwise stated, the website's original writing, visual design, branding, illustrations, and source presentation are owned by Rithy Bondeth or used with permission. You may view and share links to public pages for personal, informational, recruitment, or evaluation purposes.",
          "You may not republish substantial portions, remove attribution, impersonate the owner, use the branding as your own, or commercially exploit website content without written permission. Product names, logos, and materials belonging to employers, clients, open-source projects, or other third parties remain the property of their respective owners.",
        ],
      },
      {
        id: "project-information",
        title: "6. Projects and confidential information",
        paragraphs: [
          "Project descriptions are limited to information suitable for public presentation. They may summarize collaborative work and do not claim sole authorship of every component. The absence of internal details is intentional and should not be treated as authorization to infer, request, or obtain confidential client, government, user, security, or infrastructure information.",
        ],
      },
      {
        id: "third-parties",
        title: "7. Third-party services and links",
        paragraphs: [
          "The website links to or uses third-party services, including Mistral AI, Vercel, Resend, GitHub, LinkedIn, and YouTube. Their availability, content, and data practices are controlled by those providers. A link does not imply endorsement of every statement, product, or policy on the destination website.",
        ],
      },
      {
        id: "availability",
        title: "8. Availability and changes",
        paragraphs: [
          "The website and its features are provided on an as-available basis. Features may be changed, rate-limited, suspended, or removed without notice for maintenance, security, cost, legal, or operational reasons. Public portfolio information may change as professional work evolves.",
        ],
      },
      {
        id: "disclaimer",
        title: "9. Disclaimer and limitation of liability",
        paragraphs: [
          "Reasonable care is taken to keep public information useful and accurate, but no warranty is made that the website will always be complete, current, secure, uninterrupted, or error-free. To the maximum extent permitted by applicable law, Rithy Bondeth is not liable for indirect, incidental, consequential, or special loss arising from use of, inability to use, or reliance on this website or its AI-generated content.",
          "Nothing in these terms excludes responsibility that cannot lawfully be excluded or limited.",
        ],
      },
      {
        id: "law",
        title: "10. Governing law",
        paragraphs: [
          "These terms are governed by the laws applicable in the Kingdom of Cambodia, without limiting any mandatory rights you may have under the law of your place of residence. Disputes should first be raised through the contact address below in an effort to resolve them informally.",
        ],
      },
      {
        id: "changes",
        title: "11. Changes to these terms",
        paragraphs: [
          "These terms may be updated as the website and its services change. The effective date identifies the current published version. Continued use after an update means the revised terms apply from their effective date.",
        ],
      },
    ],
    resources: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Mistral AI usage policy", href: "https://legal.mistral.ai/terms/usage-policy" },
    ],
  },
};

const km: ILegalDocuments = {
  privacy: {
    metaTitle: "គោលការណ៍ឯកជនភាព",
    metaDescription:
      "របៀបដែលគេហទំព័រផលប័ត្ររបស់ Rithy Bondeth ប្រមូល ប្រើ និងការពារព័ត៌មានពីអ្នកចូលមើល សារទំនាក់ទំនង និងការសន្ទនាជាមួយ AI។",
    eyebrow: "ផ្នែកច្បាប់ · ឯកជនភាព",
    title: "គោលការណ៍ឯកជនភាព",
    intro:
      "គោលការណ៍នេះពន្យល់អំពីព័ត៌មានដែលគេហទំព័រនេះដំណើរការ គោលបំណងនៃការប្រើប្រាស់ និងអ្នកផ្តល់សេវាដែលជួយដំណើរការគេហទំព័រ។ វាអនុវត្តចំពោះអ្នកចូលមើល អតិថិជនសក្តានុពល ដៃគូសហការ និងអ្នកប្រើជំនួយការ AI។",
    effectiveLabel: "មានប្រសិទ្ធភាពចាប់ពី",
    effectiveDate: "ថ្ងៃទី ១៤ ខែសីហា ឆ្នាំ ២០២៦",
    contentsLabel: "មាតិកាក្នុងទំព័រ",
    resourcesLabel: "គោលការណ៍របស់អ្នកផ្តល់សេវា",
    contactLabel: "សំណួរអំពីឯកជនភាព",
    sections: [
      {
        id: "operator",
        title: "១. អ្នកដំណើរការគេហទំព័រ",
        paragraphs: [
          "គេហទំព័រនេះដំណើរការដោយ Rithy Bondeth ជាវិស្វករសូហ្វវែរដែលមានមូលដ្ឋាននៅរាជធានីភ្នំពេញ ប្រទេសកម្ពុជា។ សម្រាប់សំណួរ ឬសំណើទាក់ទងនឹងឯកជនភាព សូមប្រើអ៊ីមែលនៅខាងចុងនៃគោលការណ៍នេះ។",
        ],
      },
      {
        id: "information-collected",
        title: "២. ព័ត៌មានដែលអាចត្រូវបានប្រមូល",
        bullets: [
          "ព័ត៌មានទំនាក់ទំនងដែលអ្នកផ្ញើ ដូចជា ឈ្មោះ អាសយដ្ឋានអ៊ីមែល ប្រភេទគម្រោង និងខ្លឹមសារសារ។",
          "សារដែលអ្នកផ្ញើទៅជំនួយការ AI និងបរិបទសន្ទនាថ្មីៗដែលចាំបាច់សម្រាប់បង្កើតចម្លើយ។",
          "ព័ត៌មានបច្ចេកទេស និងការប្រើប្រាស់មូលដ្ឋាន ដូចជា ទំព័រដែលបានស្នើ ទីតាំងប្រហាក់ប្រហែល ប្រភេទឧបករណ៍ ឬកម្មវិធីរុករក ទិន្នន័យដំណើរការ និងសញ្ញាសុវត្ថិភាពដែលទាញចេញពី IP។",
          "ព្រឹត្តិការណ៍ប្រើប្រាស់ ដូចជា ការផ្ញើទម្រង់ទំនាក់ទំនង និងការទាញយកប្រវត្តិរូប។ ព្រឹត្តិការណ៍ទាំងនេះមិនមានបំណងបញ្ចូលឈ្មោះ អ៊ីមែល ឬសាររបស់អ្នកទេ។",
        ],
      },
      {
        id: "uses",
        title: "៣. របៀបប្រើប្រាស់ព័ត៌មាន",
        bullets: [
          "ដើម្បីឆ្លើយតបសំណួរ និងវាយតម្លៃគម្រោង ឬកិច្ចសហការដែលអាចកើតមាន។",
          "ដើម្បីផ្តល់ សុវត្ថិភាព កំណត់អត្រាសំណើ ដោះស្រាយបញ្ហា និងកែលម្អគេហទំព័រ និងជំនួយការ AI។",
          "ដើម្បីយល់ពីដំណើរការសរុបរបស់គេហទំព័រ និងមាតិកាសាធារណៈដែលមានប្រយោជន៍។",
          "ដើម្បីអនុវត្តកាតព្វកិច្ចពាក់ព័ន្ធ និងការពារគេហទំព័រ អ្នកដំណើរការ និងអ្នកចូលមើលពីការប្រើប្រាស់មិនត្រឹមត្រូវ។",
        ],
      },
      {
        id: "chatbot",
        title: "៤. ជំនួយការ AI",
        paragraphs: [
          "នៅពេលអ្នកផ្ញើសារទៅ Byte សារ និងប្រវត្តិសន្ទនាថ្មីៗដែលមានកម្រិត នឹងត្រូវបញ្ជូនទៅ Mistral AI ដើម្បីបង្កើតចម្លើយ។ គេហទំព័រនេះមិនមានបំណងរក្សាទុកមូលដ្ឋានទិន្នន័យប្រវត្តិសន្ទនាអចិន្ត្រៃយ៍ដាច់ដោយឡែកទេ។",
          "ចម្លើយរបស់ AI អាចមិនត្រឹមត្រូវ។ សូមកុំផ្ញើពាក្យសម្ងាត់ ព័ត៌មានទូទាត់ ឯកសារអាជីវកម្មសម្ងាត់ ព័ត៌មានសុខភាព លេខសម្គាល់រដ្ឋាភិបាល ឬទិន្នន័យផ្ទាល់ខ្លួនរសើបផ្សេងទៀត។",
          "Mistral បញ្ជាក់ថា ទិន្នន័យក្រោមគម្រោង API ឥតគិតថ្លៃអាចត្រូវបានប្រើសម្រាប់បណ្តុះបណ្តាលម៉ូដែល លុះត្រាតែគណនីបានបិទជម្រើសនេះ។ Input និង output របស់គម្រោង Scale បង់តាមការប្រើប្រាស់ មិនត្រូវបានប្រើសម្រាប់បណ្តុះបណ្តាលតាមការគ្រប់គ្រងដែល Mistral បានផ្សព្វផ្សាយទេ។ Mistral នៅតែអាចដំណើរការទិន្នន័យសម្រាប់ផ្តល់សេវា សុវត្ថិភាព ការពារការរំលោភបំពាន និងអនុវត្តច្បាប់តាមលក្ខខណ្ឌរបស់ខ្លួន។",
        ],
      },
      {
        id: "contact-form",
        title: "៥. ទម្រង់ទំនាក់ទំនង និងអ៊ីមែល",
        paragraphs: [
          "ព័ត៌មានក្នុងទម្រង់ទំនាក់ទំនងត្រូវបានផ្ញើតាម Resend ទៅប្រអប់អ៊ីមែលរបស់ម្ចាស់គេហទំព័រ។ Resend ដំណើរការអាសយដ្ឋានអ៊ីមែល ខ្លឹមសារសារ និងទិន្នន័យបញ្ជូន ដើម្បីផ្ញើសារ។ សំណើរបស់អ្នកត្រូវបានប្រើសម្រាប់ពិនិត្យ និងឆ្លើយតប រក្សាកំណត់ត្រាអាជីវកម្មសមស្រប និងការពារការរំលោភបំពាន។",
        ],
      },
      {
        id: "analytics",
        title: "៦. ការវិភាគ កំណត់ហេតុ និង cookies",
        paragraphs: [
          "គេហទំព័រប្រើ Vercel Web Analytics និង Speed Insights។ Vercel ពិពណ៌នា Web Analytics ថាមិនប្រើ cookie និងផ្អែកលើទិន្នន័យអនាមិក ឬទិន្នន័យសរុប។ ហេដ្ឋារចនាសម្ព័ន្ធបង្ហោះអាចដំណើរការទិន្នន័យសំណើ និងព័ត៌មានសុវត្ថិភាពរយៈពេលខ្លី ដើម្បីផ្តល់ និងការពារគេហទំព័រ។",
          "បច្ចុប្បន្ន គេហទំព័រមិនប្រើ cookie ផ្សាយពាណិជ្ជកម្មទេ។ មាតិកាភាគីទីបី ដូចជា YouTube player ត្រូវបានផ្ទុកតែបន្ទាប់ពីអ្នកជ្រើសចាក់វីដេអូ ហើយបន្ទាប់មកអាចស្ថិតក្រោម cookie និងគោលការណ៍របស់អ្នកផ្តល់សេវានោះ។",
        ],
      },
      {
        id: "providers",
        title: "៧. អ្នកផ្តល់សេវា និងការបង្ហាញព័ត៌មាន",
        paragraphs: [
          "ព័ត៌មានត្រូវបានចែករំលែកតែក្នុងកម្រិតចាំបាច់ជាមួយអ្នកផ្តល់សេវា៖ Vercel សម្រាប់ការបង្ហោះ ការវិភាគ និងតាមដានដំណើរការ; Mistral AI សម្រាប់ចម្លើយជំនួយការ; និង Resend សម្រាប់ការផ្ញើអ៊ីមែលពីទម្រង់ទំនាក់ទំនង។ ព័ត៌មានក៏អាចត្រូវបានបង្ហាញនៅពេលចាំបាច់សមហេតុផល ដើម្បីអនុវត្តច្បាប់ ការពារសិទ្ធិ ស៊ើបអង្កេតការរំលោភបំពាន ឬការពារសុវត្ថិភាព។",
          "គេហទំព័រនេះមិនលក់ព័ត៌មានផ្ទាល់ខ្លួន និងមិនប្រើវាសម្រាប់ការផ្សាយពាណិជ្ជកម្មរបស់ភាគីទីបីទេ។",
        ],
      },
      {
        id: "international",
        title: "៨. ការដំណើរការទិន្នន័យអន្តរជាតិ",
        paragraphs: [
          "អ្នកផ្តល់សេវាទាំងនេះអាចដំណើរការព័ត៌មាននៅប្រទេសក្រៅកម្ពុជា រួមទាំងសហរដ្ឋអាមេរិក និងប្រទេសក្នុងតំបន់អឺរ៉ុប។ លក្ខខណ្ឌឯកជនភាព សុវត្ថិភាព និងការផ្ទេរទិន្នន័យរបស់ពួកគេ អនុវត្តចំពោះការដំណើរការនោះ។",
        ],
      },
      {
        id: "retention",
        title: "៩. រយៈពេលរក្សាទុក",
        paragraphs: [
          "សំណើទំនាក់ទំនង និងការឆ្លើយឆ្លងត្រូវបានរក្សាទុកតែក្នុងរយៈពេលដែលចាំបាច់សមហេតុផល ដើម្បីឆ្លើយតប គ្រប់គ្រងទំនាក់ទំនងវិជ្ជាជីវៈ រក្សាកំណត់ត្រាចាំបាច់ ឬដោះស្រាយវិវាទ។ ទិន្នន័យវិភាគ កំណត់ហេតុហេដ្ឋារចនាសម្ព័ន្ធ ទិន្នន័យ AI និងកំណត់ត្រាបញ្ជូនអ៊ីមែល អនុវត្តតាមការកំណត់ និងគោលការណ៍របស់អ្នកផ្តល់សេវាពាក់ព័ន្ធ។",
        ],
      },
      {
        id: "security",
        title: "១០. សុវត្ថិភាព",
        paragraphs: [
          "វិធានការបច្ចេកទេសសមហេតុផលត្រូវបានប្រើ រួមមាន HTTPS កូនសោ API នៅផ្នែកម៉ាស៊ីនមេ ការត្រួតពិនិត្យ input កំណត់អត្រាសំណើ និងការកម្រិតសិទ្ធិចូលប្រើគណនីសេវា។ សេវាអ៊ីនធឺណិតមិនអាចធានាសុវត្ថិភាពពេញលេញបានទេ ដូច្នេះសូមកុំផ្ញើព័ត៌មានដែលមិនចាំបាច់សម្រាប់សំណើរបស់អ្នក។",
        ],
      },
      {
        id: "choices",
        title: "១១. ជម្រើស និងសំណើរបស់អ្នក",
        paragraphs: [
          "អ្នកអាចស្នើសុំព័ត៌មានផ្ទាល់ខ្លួនដែលត្រូវបានរក្សាទុក ស្នើសុំកែតម្រូវ ឬលុប ជំទាស់នឹងការដំណើរការមួយចំនួន ឬដកសំណើរបស់អ្នក ដោយផ្ញើអ៊ីមែលទៅអាសយដ្ឋានខាងក្រោម។ អាចត្រូវការការផ្ទៀងផ្ទាត់អត្តសញ្ញាណសមហេតុផល។ ព័ត៌មានខ្លះអាចត្រូវបានរក្សាទុកសម្រាប់សុវត្ថិភាព កាតព្វកិច្ចច្បាប់ ឬកំណត់ត្រាចាំបាច់។",
        ],
      },
      {
        id: "children",
        title: "១២. ឯកជនភាពរបស់កុមារ",
        paragraphs: [
          "គេហទំព័រវិជ្ជាជីវៈនេះមិនផ្តោតលើកុមារ និងមិនមានបំណងស្នើសុំព័ត៌មានផ្ទាល់ខ្លួនពីកុមារទេ។ ឪពុកម្តាយ ឬអាណាព្យាបាលដែលជឿថាកុមារបានផ្ញើព័ត៌មាន អាចស្នើសុំលុបព័ត៌មាននោះ។",
        ],
      },
      {
        id: "changes",
        title: "១៣. ការកែប្រែគោលការណ៍",
        paragraphs: [
          "គោលការណ៍នេះអាចត្រូវបានកែប្រែនៅពេលគេហទំព័រ អ្នកផ្តល់សេវា ឬតម្រូវការពាក់ព័ន្ធផ្លាស់ប្តូរ។ កាលបរិច្ឆេទនៅខាងលើបង្ហាញកំណែចុងក្រោយដែលបានផ្សព្វផ្សាយ។",
        ],
      },
    ],
    resources: [
      { label: "គោលការណ៍ឯកជនភាព Mistral AI", href: "https://legal.mistral.ai/terms/privacy-policy" },
      {
        label: "ការគ្រប់គ្រងការប្រើទិន្នន័យរបស់ Mistral AI",
        href: "https://help.mistral.ai/en/articles/347617-do-you-use-my-user-data-to-train-your-artificial-intelligence-models",
      },
      { label: "គោលការណ៍ឯកជនភាព Resend", href: "https://resend.com/legal/privacy-policy" },
      {
        label: "ឯកជនភាព Vercel Analytics",
        href: "https://vercel.com/docs/analytics/privacy-policy",
      },
    ],
  },
  terms: {
    metaTitle: "លក្ខខណ្ឌប្រើប្រាស់",
    metaDescription:
      "លក្ខខណ្ឌសម្រាប់ការប្រើប្រាស់គេហទំព័រផលប័ត្រ ទម្រង់ទំនាក់ទំនង ព័ត៌មានគម្រោងសាធារណៈ និងជំនួយការ AI របស់ Rithy Bondeth។",
    eyebrow: "ផ្នែកច្បាប់ · លក្ខខណ្ឌ",
    title: "លក្ខខណ្ឌប្រើប្រាស់",
    intro:
      "លក្ខខណ្ឌទាំងនេះកំណត់ការរំពឹងទុកសម្រាប់ការប្រើប្រាស់គេហទំព័រ មាតិកាសាធារណៈ ទម្រង់ទំនាក់ទំនង និងជំនួយការ AI។ ដោយបន្តប្រើគេហទំព័រ អ្នកយល់ព្រមប្រើប្រាស់ដោយទទួលខុសត្រូវ និងស្របតាមលក្ខខណ្ឌទាំងនេះ។",
    effectiveLabel: "មានប្រសិទ្ធភាពចាប់ពី",
    effectiveDate: "ថ្ងៃទី ១៤ ខែសីហា ឆ្នាំ ២០២៦",
    contentsLabel: "មាតិកាក្នុងទំព័រ",
    resourcesLabel: "គោលការណ៍ពាក់ព័ន្ធ",
    contactLabel: "សំណួរអំពីលក្ខខណ្ឌ",
    sections: [
      {
        id: "purpose",
        title: "១. គោលបំណងនៃគេហទំព័រ",
        paragraphs: [
          "គេហទំព័រនេះបង្ហាញប្រវត្តិវិជ្ជាជីវៈ គម្រោងដែលបានជ្រើសរើស សេវាកម្ម អត្ថបទ ការពិសោធន៍ និងព័ត៌មានទំនាក់ទំនងរបស់ Rithy Bondeth។ វាត្រូវបានផ្តល់សម្រាប់ព័ត៌មានទូទៅ និងការភ្ជាប់បណ្តាញវិជ្ជាជីវៈ។",
        ],
      },
      {
        id: "acceptable-use",
        title: "២. ការប្រើប្រាស់ដែលអាចទទួលយកបាន",
        bullets: [
          "ប្រើគេហទំព័រ ទម្រង់ទំនាក់ទំនង និងជំនួយការ AI សម្រាប់គោលបំណងស្របច្បាប់តែប៉ុណ្ណោះ។",
          "កុំព្យាយាមរំលងវិធានការសុវត្ថិភាព កំណត់អត្រា ឬការកម្រិតសិទ្ធិចូលប្រើ។",
          "កុំបញ្ចូលកូដព្យាបាទ បង្កើតចរាចរណ៍ស្វ័យប្រវត្តិដែលរំលោភបំពាន ទាញយកទិន្នន័យលើសកម្រិត ឬរំខានអ្នកប្រើផ្សេងទៀត។",
          "កុំប្រើ AI ដើម្បីបង្កើតមាតិកាខុសច្បាប់ បង្កគ្រោះថ្នាក់ បោកបញ្ឆោត រំលោភសិទ្ធិ ឬឯកជនភាព។",
          "កុំផ្ញើព័ត៌មានដែលអ្នកគ្មានសិទ្ធិ ឬការអនុញ្ញាតក្នុងការចែករំលែក។",
        ],
      },
      {
        id: "ai",
        title: "៣. ចម្លើយដែលបង្កើតដោយ AI",
        paragraphs: [
          "Byte ជាជំនួយការ AI ដែលប្រើ Mistral AI។ ចម្លើយត្រូវបានបង្កើតដោយស្វ័យប្រវត្តិ ហើយអាចមិនពេញលេញ ហួសសម័យ លម្អៀង ឬខុស។ ចម្លើយមិនមែនជាសេចក្តីថ្លែងការណ៍ ការផ្តល់ជូន ការធានា ឬការប្តេជ្ញាចិត្តដែលមានកាតព្វកិច្ចពី Rithy Bondeth ទេ។",
          "កុំពឹងផ្អែកលើចម្លើយ AI ជាដំបូន្មានផ្នែកច្បាប់ វេជ្ជសាស្ត្រ ហិរញ្ញវត្ថុ សុវត្ថិភាព ឬវិជ្ជាជីវៈផ្សេងទៀត។ សូមផ្ទៀងផ្ទាត់ព័ត៌មានសំខាន់ដោយឯករាជ្យ និងទាក់ទង Rithy Bondeth ដោយផ្ទាល់សម្រាប់ព័ត៌មានផ្លូវការអំពីភាពទំនេរ តម្លៃ វិសាលភាពគម្រោង ឬកិច្ចព្រមព្រៀងវិជ្ជាជីវៈ។",
        ],
      },
      {
        id: "professional-engagements",
        title: "៤. សំណើ និងកិច្ចសហការវិជ្ជាជីវៈ",
        paragraphs: [
          "ការផ្ញើទម្រង់ទំនាក់ទំនង ឬការផ្លាស់ប្តូរសារ មិនបង្កើតទំនាក់ទំនងជាអតិថិជន ការងារ ដៃគូ ភាពសម្ងាត់ ឬទំនាក់ទំនងវិជ្ជាជីវៈផ្សេងទៀតទេ។ កិច្ចសហការណាមួយត្រូវការកិច្ចព្រមព្រៀងជាលាយលក្ខណ៍អក្សរដាច់ដោយឡែក ដែលកំណត់វិសាលភាព ថ្លៃសេវា ការទទួលខុសត្រូវ កម្មសិទ្ធិ ភាពសម្ងាត់ និងលក្ខខណ្ឌពាក់ព័ន្ធ។",
        ],
      },
      {
        id: "content",
        title: "៥. មាតិកា និងកម្មសិទ្ធិបញ្ញា",
        paragraphs: [
          "លុះត្រាតែមានការបញ្ជាក់ផ្សេង មាតិកាសរសេរ ការរចនា ម៉ាក ស្នាដៃគំនូរ និងការបង្ហាញកូដដើម ជាកម្មសិទ្ធិរបស់ Rithy Bondeth ឬប្រើដោយមានការអនុញ្ញាត។ អ្នកអាចមើល និងចែករំលែកតំណទៅទំព័រសាធារណៈសម្រាប់គោលបំណងផ្ទាល់ខ្លួន ព័ត៌មាន ការជ្រើសរើសបុគ្គលិក ឬវាយតម្លៃ។",
          "អ្នកមិនអាចផ្សព្វផ្សាយឡើងវិញនូវផ្នែកសំខាន់ៗ លុបប្រភព ធ្វើពុតជាម្ចាស់ ប្រើម៉ាកជារបស់ខ្លួន ឬទាញយកប្រយោជន៍ពាណិជ្ជកម្មដោយគ្មានការអនុញ្ញាតជាលាយលក្ខណ៍អក្សរ។ ឈ្មោះផលិតផល ឡូហ្គោ និងសម្ភារៈរបស់និយោជក អតិថិជន គម្រោង open-source ឬភាគីទីបី នៅតែជាកម្មសិទ្ធិរបស់ម្ចាស់រៀងៗខ្លួន។",
        ],
      },
      {
        id: "project-information",
        title: "៦. ព័ត៌មានគម្រោង និងព័ត៌មានសម្ងាត់",
        paragraphs: [
          "ការពិពណ៌នាគម្រោងត្រូវបានកម្រិតត្រឹមព័ត៌មានដែលសមស្របសម្រាប់បង្ហាញជាសាធារណៈ។ វាអាចសង្ខេបការងារជាក្រុម និងមិនអះអាងថាបានបង្កើតគ្រប់ផ្នែកតែម្នាក់ឯងទេ។ ការមិនបង្ហាញព័ត៌មានផ្ទៃក្នុងគឺដោយចេតនា ហើយមិនមែនជាការអនុញ្ញាតឱ្យទាយ ស្នើសុំ ឬទទួលយកព័ត៌មានសម្ងាត់របស់អតិថិជន រដ្ឋាភិបាល អ្នកប្រើ សុវត្ថិភាព ឬហេដ្ឋារចនាសម្ព័ន្ធទេ។",
        ],
      },
      {
        id: "third-parties",
        title: "៧. សេវា និងតំណភាគីទីបី",
        paragraphs: [
          "គេហទំព័រភ្ជាប់ ឬប្រើសេវាភាគីទីបី រួមមាន Mistral AI, Vercel, Resend, GitHub, LinkedIn និង YouTube។ ភាពអាចប្រើបាន មាតិកា និងការអនុវត្តទិន្នន័យរបស់ពួកគេ គ្រប់គ្រងដោយអ្នកផ្តល់សេវានីមួយៗ។ តំណមិនមានន័យថាគាំទ្ររាល់សេចក្តីថ្លែងការណ៍ ផលិតផល ឬគោលការណ៍នៅគេហទំព័រគោលដៅទេ។",
        ],
      },
      {
        id: "availability",
        title: "៨. ភាពអាចប្រើបាន និងការផ្លាស់ប្តូរ",
        paragraphs: [
          "គេហទំព័រ និងមុខងារត្រូវបានផ្តល់តាមភាពអាចប្រើបាន។ មុខងារអាចត្រូវបានផ្លាស់ប្តូរ កំណត់អត្រា ផ្អាក ឬដកចេញដោយគ្មានការជូនដំណឹង ដើម្បីថែទាំ សុវត្ថិភាព ការចំណាយ ច្បាប់ ឬប្រតិបត្តិការ។ ព័ត៌មានផលប័ត្រសាធារណៈអាចផ្លាស់ប្តូរតាមការវិវត្តនៃការងារវិជ្ជាជីវៈ។",
        ],
      },
      {
        id: "disclaimer",
        title: "៩. ការបដិសេធការធានា និងការកម្រិតទទួលខុសត្រូវ",
        paragraphs: [
          "មានការយកចិត្តទុកដាក់សមហេតុផលដើម្បីរក្សាព័ត៌មានឱ្យមានប្រយោជន៍ និងត្រឹមត្រូវ ប៉ុន្តែមិនធានាថាគេហទំព័រនឹងពេញលេញ ទាន់សម័យ មានសុវត្ថិភាព មិនដាច់ ឬគ្មានកំហុសជានិច្ចទេ។ ក្នុងកម្រិតអតិបរមាដែលច្បាប់អនុញ្ញាត Rithy Bondeth មិនទទួលខុសត្រូវចំពោះការខាតបង់ដោយប្រយោល ចៃដន្យ បន្តបន្ទាប់ ឬពិសេស ដែលកើតពីការប្រើប្រាស់ មិនអាចប្រើប្រាស់ ឬពឹងផ្អែកលើគេហទំព័រ ឬមាតិកា AI ទេ។",
          "គ្មានអ្វីក្នុងលក្ខខណ្ឌនេះលុបចោលការទទួលខុសត្រូវដែលច្បាប់មិនអនុញ្ញាតឱ្យលុប ឬកម្រិតឡើយ។",
        ],
      },
      {
        id: "law",
        title: "១០. ច្បាប់គ្រប់គ្រង",
        paragraphs: [
          "លក្ខខណ្ឌទាំងនេះស្ថិតក្រោមច្បាប់ដែលអនុវត្តនៅព្រះរាជាណាចក្រកម្ពុជា ដោយមិនកម្រិតសិទ្ធិចាំបាច់របស់អ្នកក្រោមច្បាប់នៃទីលំនៅរបស់អ្នក។ វិវាទគួរត្រូវបានលើកឡើងជាមុនតាមអាសយដ្ឋានទំនាក់ទំនងខាងក្រោម ដើម្បីព្យាយាមដោះស្រាយដោយមិនផ្លូវការ។",
        ],
      },
      {
        id: "changes",
        title: "១១. ការកែប្រែលក្ខខណ្ឌ",
        paragraphs: [
          "លក្ខខណ្ឌទាំងនេះអាចត្រូវបានកែប្រែតាមការផ្លាស់ប្តូរគេហទំព័រ និងសេវា។ កាលបរិច្ឆេទមានប្រសិទ្ធភាពបង្ហាញកំណែបច្ចុប្បន្ន។ ការបន្តប្រើប្រាស់ក្រោយការកែប្រែមានន័យថាលក្ខខណ្ឌថ្មីអនុវត្តចាប់ពីកាលបរិច្ឆេទរបស់វា។",
        ],
      },
    ],
    resources: [
      { label: "គោលការណ៍ឯកជនភាព", href: "/privacy" },
      { label: "គោលការណ៍ប្រើប្រាស់ Mistral AI", href: "https://legal.mistral.ai/terms/usage-policy" },
    ],
  },
};

const legalDocuments: Record<TLocale, ILegalDocuments> = { en, km };

export function getLegalDocument(lang: TLocale, type: keyof ILegalDocuments) {
  return legalDocuments[lang][type];
}
