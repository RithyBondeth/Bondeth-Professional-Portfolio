import type { ProjectCaseStudy } from "@/features/portfolio/domain";
import type { Locale } from "@/shared/i18n";

function note(problem: string, title: string, body: string): ProjectCaseStudy {
  return { problem, decisions: [{ title, body }] };
}

/** Short case studies for projects without an existing long-form write-up. */
export const projectNotes: Readonly<
  Partial<Record<string, Record<Locale, ProjectCaseStudy>>>
> = {
  askdb: {
    en: note(
      "A plain-language database question is easy to ask, but a generated SQL statement can be wrong or unsafe to run.",
      "Validate before running",
      "AskDB checks SQL with SQLGlot and executes it in a read-only session. The repair loop can retry failed statements, and an execution-accuracy harness compares query results with expected answers.",
    ),
    km: note(
      "ការសួរសំណួរអំពីមូលដ្ឋានទិន្នន័យជាភាសាធម្មតាមានភាពងាយស្រួល ប៉ុន្តែ SQL ដែលបង្កើតដោយ AI អាចខុស ឬមិនមានសុវត្ថិភាពក្នុងការដំណើរការ។",
      "ផ្ទៀងផ្ទាត់មុនដំណើរការ",
      "AskDB ពិនិត្យ SQL ដោយ SQLGlot ហើយដំណើរការក្នុងសម័យតភ្ជាប់សម្រាប់តែអាន។ វាអាចកែសំណួរដែលបរាជ័យ ហើយតេស្តវាយតម្លៃប្រៀបធៀបលទ្ធផលនឹងចម្លើយរំពឹងទុក។",
    ),
  },
  "cambodia-3d-map": {
    en: note(
      "A street map can tell you where to turn without giving you much sense of the surrounding terrain or landmarks.",
      "Combine map data with a 3D navigation view",
      "MapLibre draws terrain and building footprints. Custom Three.js models mark Angkor Wat and Independence Monument, and navigation switches to a GPS-driven chase camera with route arrows.",
    ),
    km: note(
      "ផែនទីផ្លូវអាចប្រាប់ថាត្រូវបត់នៅទីណា ប៉ុន្តែពិបាកបង្ហាញទិដ្ឋភាពសណ្ឋានដី និងទីតាំងសម្គាល់ជុំវិញ។",
      "ផ្សំទិន្នន័យផែនទីជាមួយការណែនាំផ្លូវ 3D",
      "MapLibre បង្ហាញសណ្ឋានដី និងគ្រោងអគារ។ Three.js បន្ថែមគំរូអង្គរវត្ត និងវិមានឯករាជ្យ។ ពេលណែនាំផ្លូវ កាមេរ៉ាតាមទីតាំង GPS ហើយបង្ហាញព្រួញលើផ្លូវ។",
    ),
  },
  "bondeth-studio": {
    en: note(
      "Planning a series, writing scripts, recording voice-over, and rendering different aspect ratios are separate jobs for educators making explainer videos.",
      "Make each stage editable",
      "The pipeline keeps plans, scenes, and settings in structured files. Creators can adjust the script or scene before generating narration and rendering vertical or landscape video in Remotion.",
    ),
    km: note(
      "អ្នកផលិតវីដេអូអប់រំត្រូវរៀបផែនការ សរសេរស្គ្រីប ថតសំឡេង និងបង្កើតវីដេអូសម្រាប់ទំហំផ្សេងៗ។",
      "អនុញ្ញាតឱ្យកែតាមដំណាក់កាល",
      "ប្រព័ន្ធរក្សាទុកផែនការ ឈុត និងការកំណត់ក្នុងឯកសារមានរចនាសម្ព័ន្ធ។ អ្នកបង្កើតអាចកែស្គ្រីប ឬឈុត មុនបង្កើតសំឡេង និងវីដេអូបញ្ឈរ ឬផ្ដេកដោយ Remotion។",
    ),
  },
  "the-unbroken-debt": {
    en: note(
      "A browser horror game needs to preserve immersion while making inventory, navigation, and performance manageable.",
      "Put the interface inside the story",
      "The character’s satchel and sketchbook hold inventory, maps, and notes. The Babylon.js renderer adjusts resolution to respond to frame-time pressure without adding a permanent overlay.",
    ),
    km: note(
      "ហ្គេមភ័យរន្ធត់ក្នុងកម្មវិធីរុករកត្រូវរក្សាអារម្មណ៍ក្នុងសាច់រឿង ខណៈអ្នកលេងត្រូវគ្រប់គ្រងសម្ភារៈ និងរកផ្លូវ។",
      "បញ្ចូលផ្ទាំងបញ្ជាទៅក្នុងសាច់រឿង",
      "កាបូប និងសៀវភៅគំនូររបស់តួអង្គផ្ទុកសម្ភារៈ ផែនទី និងកំណត់ចំណាំ។ Babylon.js សម្រួលកម្រិតបង្ហាញតាមរយៈពេលគូររូប។",
    ),
  },
  "angkor-architect": {
    en: note(
      "A city-builder inspired by Angkor needs water to affect planning, rather than treating canals as decoration.",
      "Simulate water across elevations",
      "A grid-based water simulation models flow and pressure. Workers and barges use A* pathfinding, and saves stay in the browser with a JSON export option.",
    ),
    km: note(
      "ហ្គេមសាងសង់ទីក្រុងដែលបំផុសគំនិតពីសម័យអង្គរ ត្រូវឱ្យទឹកមានឥទ្ធិពលលើផែនការសាងសង់។",
      "ក្លែងធ្វើលំហូរទឹកតាមកម្ពស់ដី",
      "ប្រព័ន្ធគណនាលំហូរ និងសម្ពាធទឹកលើក្រឡា។ កម្មករ និងទូកប្រើ A* សម្រាប់រកផ្លូវ ហើយទិន្នន័យហ្គេមរក្សាក្នុងកម្មវិធីរុករក និងអាចនាំចេញជា JSON។",
    ),
  },
  "bondeth-ai": {
    en: note(
      "Khmer speakers often switch between Khmer and English in one conversation, making voice workflows designed for a single language harder to use.",
      "Use a bilingual, self-hosted workspace",
      "The Next.js workspace connects to a FastAPI backend that coordinates speech engines. The project documents which capabilities are implemented separately from its original proposal.",
    ),
    km: note(
      "អ្នកនិយាយភាសាខ្មែរច្រើនប្តូររវាងខ្មែរ និងអង់គ្លេសក្នុងការសន្ទនាតែមួយ ធ្វើឱ្យឧបករណ៍សំឡេងសម្រាប់ភាសាតែមួយពិបាកប្រើ។",
      "បង្កើតផ្ទាំងការងារពីរភាសាដែលអាចដំឡើងដោយខ្លួនឯង",
      "ផ្ទាំង Next.js ភ្ជាប់សេវា FastAPI ដែលសម្របសម្រួលម៉ាស៊ីនសំឡេង។ ឯកសារគម្រោងបែងចែកមុខងារដែលបានអនុវត្តពីសំណើដើម។",
    ),
  },
  "nexus-pc": {
    en: note(
      "Importing a Windows game on Android and launching it through a compatibility layer are different engineering problems.",
      "Keep the experimental runtime opt-in",
      "The standard app validates game folders and ZIPs for a local library. Wine and Box64 run only in the experimental build; the recorded device experiments do not establish general game compatibility.",
    ),
    km: note(
      "ការនាំចូលហ្គេម Windows លើ Android និងការដំណើរការវាតាមស្រទាប់ភាពត្រូវគ្នា ជាបញ្ហាបច្ចេកទេសពីរផ្សេងគ្នា។",
      "ទុកស្រទាប់ដំណើរការជាជម្រើសសាកល្បង",
      "កម្មវិធីធម្មតាផ្ទៀងផ្ទាត់ថត និង ZIP សម្រាប់បណ្ណាល័យក្នុងម៉ាស៊ីន។ Wine និង Box64 មានតែក្នុងកំណែសាកល្បង ហើយលទ្ធផលលើឧបករណ៍សាកល្បងមិនធានាភាពត្រូវគ្នាទូទៅទេ។",
    ),
  },
  "visioncare-ai": {
    en: note(
      "An image classifier should not assign an eye condition to an upload that is not an eye.",
      "Validate the input before classification",
      "The capstone uses one model to check whether the upload shows an eye, then a second model to classify it. The repository documents VGG16 and ResNet18 experiments. It is an academic prototype.",
    ),
    km: note(
      "ម៉ូដែលចាត់ថ្នាក់មិនគួរផ្តល់លទ្ធផលអំពីស្ថានភាពភ្នែកលើរូបភាពដែលមិនមែនជាភ្នែកទេ។",
      "ផ្ទៀងផ្ទាត់រូបភាពមុនចាត់ថ្នាក់",
      "គម្រោងសិក្សានេះប្រើម៉ូដែលមួយសម្រាប់ពិនិត្យរូបភាពភ្នែក និងម៉ូដែលទីពីរសម្រាប់ចាត់ថ្នាក់។ ឃ្លាំងកូដកត់ត្រាការពិសោធន៍ VGG16 និង ResNet18។",
    ),
  },
  romlerk: {
    en: note(
      "Capturing an idea is quick; turning it into a task you can find later takes more effort.",
      "Keep capture and planning in the same app",
      "Romlerk combines notes, task lists, and reminders in a local-first Flutter app, with AI assistance for shaping a rough note into an actionable item.",
    ),
    km: note(
      "ការកត់គំនិតធ្វើបានលឿន ប៉ុន្តែការបម្លែងវាទៅជាកិច្ចការដែលអាចរកឃើញពេលក្រោយចំណាយពេលបន្ថែម។",
      "ដាក់ការកត់ត្រា និងផែនការក្នុងកម្មវិធីតែមួយ",
      "Romlerk រួមបញ្ចូលកំណត់ចំណាំ បញ្ជីកិច្ចការ និងការរំលឹកក្នុង Flutter ដោយផ្តោតលើការប្រើទិន្នន័យក្នុងម៉ាស៊ីន។ AI ជួយបម្លែងកំណត់ចំណាំទៅជាកិច្ចការ។",
    ),
  },
  "bondeth-world": {
    en: note(
      "A 3D portfolio can give visitors a sense of place, but it can also delay access to the work they came to see.",
      "Keep the content available while the world loads",
      "Visitors can browse portfolio content while the React Three Fiber scene loads. The experience uses scroll-driven camera scenes to lead into work, AI, and contact.",
    ),
    km: note(
      "ផលប័ត្រ 3D អាចផ្តល់អារម្មណ៍ដូចទៅដល់ទីកន្លែងមួយ ប៉ុន្តែការផ្ទុកអាចពន្យារការមើលស្នាដៃ។",
      "បង្ហាញមាតិកាខណៈពិភព 3D កំពុងផ្ទុក",
      "អ្នកទស្សនាអាចអានមាតិកាខណៈឈុត React Three Fiber កំពុងផ្ទុក។ កាមេរ៉ាផ្លាស់ទីតាមការរំកិលទំព័រទៅកាន់ស្នាដៃ AI និងទំនាក់ទំនង។",
    ),
  },
  "debc-website": {
    en: note(
      "The committee needs a public destination for policy documents, announcements, and service information.",
      "Organize content around public information",
      "The public site brings news, resources, and government service information together. This profile covers the public website only.",
    ),
    km: note(
      "គណៈកម្មាធិការត្រូវការកន្លែងសាធារណៈសម្រាប់ឯកសារគោលនយោបាយ សេចក្តីជូនដំណឹង និងព័ត៌មានសេវា។",
      "រៀបចំមាតិកាជុំវិញព័ត៌មានសាធារណៈ",
      "គេហទំព័ររួមបញ្ចូលព័ត៌មាន ឯកសារ និងព័ត៌មានសេវារដ្ឋ។ ករណីសិក្សានេះពិពណ៌នាតែគេហទំព័រសាធារណៈ។",
    ),
  },
  "informal-economy": {
    en: note(
      "Informal economy workers need to understand registration and find the correct entry point, often from a phone.",
      "Provide Khmer registration information at the entry point",
      "The public-facing platform explains registration and leads people to the service. Internal workflows and registrant data are outside this profile.",
    ),
    km: note(
      "អ្នកធ្វើការក្នុងសេដ្ឋកិច្ចក្រៅប្រព័ន្ធត្រូវយល់ពីការចុះឈ្មោះ និងរកច្រកចូលសេវា ជាញឹកញាប់តាមទូរស័ព្ទ។",
      "ផ្តល់ព័ត៌មានចុះឈ្មោះជាភាសាខ្មែរ",
      "វេទិកាសាធារណៈពន្យល់ពីការចុះឈ្មោះ និងនាំអ្នកប្រើទៅកាន់សេវា។ ករណីសិក្សានេះមិនរួមបញ្ចូលដំណើរការផ្ទៃក្នុង ឬទិន្នន័យអ្នកចុះឈ្មោះទេ។",
    ),
  },
  "cambodia-investment-platform": {
    en: note(
      "Founders, small businesses, investors, and the public come to the investment platform with different questions.",
      "Use the landing page to explain the financing offer",
      "The site introduces the platform and its audiences before sending visitors to their next step. This case study covers public-facing content.",
    ),
    km: note(
      "ស្ថាបនិក អាជីវកម្មខ្នាតតូច អ្នកវិនិយោគ និងសាធារណជនមកកាន់វេទិកាដោយមានសំណួរផ្សេងគ្នា។",
      "ប្រើទំព័រដំបូងដើម្បីពន្យល់អំពីហិរញ្ញប្បទាន",
      "គេហទំព័រណែនាំអំពីវេទិកា និងក្រុមអ្នកប្រើប្រាស់ មុននាំពួកគេទៅជំហានបន្ទាប់។ ករណីសិក្សានេះនិយាយពីមាតិកាសាធារណៈ។",
    ),
  },
  "code-hub": {
    en: note(
      "Freelance project work, courses, articles, and conversations need a shared place where visitors can find them.",
      "Separate the React site from the API",
      "The React frontend uses Vite. A separate NestJS API provides account access and endpoints for content, comments, and messaging.",
    ),
    km: note(
      "ស្នាដៃឯករាជ្យ វគ្គសិក្សា អត្ថបទ និងការសន្ទនាត្រូវការកន្លែងរួមសម្រាប់អ្នកទស្សនាស្វែងរក។",
      "បំបែកគេហទំព័រ React ពី API",
      "ផ្នែកខាងមុខប្រើ React និង Vite។ NestJS API ដាច់ដោយឡែកផ្តល់ការចូលគណនី និងចំណុចតភ្ជាប់សម្រាប់មាតិកា មតិយោបល់ និងសារ។",
    ),
  },
  "apple-clone": {
    en: note(
      "The exercise was to recreate the pacing of a product landing page across mobile and desktop.",
      "Build the layout around product sections",
      "The Next.js implementation uses Tailwind CSS to adapt the navigation and product sections across screen sizes.",
    ),
    km: note(
      "លំហាត់នេះបង្កើតលំនាំបង្ហាញផលិតផលឡើងវិញសម្រាប់ទូរស័ព្ទ និងកុំព្យូទ័រ។",
      "រៀបប្លង់តាមផ្នែកផលិតផល",
      "កម្មវិធី Next.js ប្រើ Tailwind CSS ដើម្បីសម្រួលម៉ឺនុយ និងផ្នែកផលិតផលតាមទំហំអេក្រង់។",
    ),
  },
  "tesla-clone": {
    en: note(
      "The exercise was to make a full-screen product showcase work as a responsive web page.",
      "Reuse the same section pattern",
      "The React and Tailwind implementation uses a repeatable section for product imagery, headings, and actions across the page.",
    ),
    km: note(
      "លំហាត់នេះបង្កើតទំព័របង្ហាញផលិតផលពេញអេក្រង់ ដែលអាចសម្របតាមទំហំឧបករណ៍។",
      "ប្រើលំនាំផ្នែកដដែលឡើងវិញ",
      "កម្មវិធី React និង Tailwind ប្រើផ្នែកដែលអាចប្រើឡើងវិញសម្រាប់រូបភាព ចំណងជើង និងប៊ូតុងតាមទំព័រ។",
    ),
  },
  "sabynews-clone": {
    en: note(
      "A dense news page needs to remain readable with real Khmer headlines and different screen widths.",
      "Build reusable editorial sections",
      "The React implementation uses styled-components to compose navigation, category blocks, and news cards.",
    ),
    km: note(
      "ទំព័រព័ត៌មានដែលមានមាតិកាច្រើនត្រូវអានបានងាយ ទោះចំណងជើងជាភាសាខ្មែរមានប្រវែងខុសគ្នា និងទំហំអេក្រង់ប្រែប្រួល។",
      "បង្កើតផ្នែកព័ត៌មានដែលអាចប្រើឡើងវិញ",
      "កម្មវិធី React ប្រើ styled-components ដើម្បីរៀបចំម៉ឺនុយ ផ្នែកតាមប្រភេទ និងកាតព័ត៌មាន។",
    ),
  },
  "bondeth-vlog": {
    en: note(
      "The early portfolio needed a single place to show projects, skills, and writing.",
      "Use the animated identity as an introduction",
      "The animated 3D logo introduces the site, while the content is split into sections visitors can browse independently.",
    ),
    km: note(
      "ផលប័ត្រដំបូងត្រូវការកន្លែងតែមួយសម្រាប់បង្ហាញគម្រោង ជំនាញ និងអត្ថបទ។",
      "ប្រើឡូហ្គោមានចលនាសម្រាប់ការណែនាំ",
      "ឡូហ្គោ 3D មានចលនាណែនាំគេហទំព័រ ហើយមាតិកាត្រូវបានបែងចែកជាផ្នែកដែលអាចមើលដោយឡែក។",
    ),
  },
};
