export interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  title: string;
  description?: string;
  questions: FAQQuestion[];
}

export const faqCategories: FAQCategory[] = [
  {
    id: '1',
    title: 'Getting Started',
    description: 'Basic questions about activation, pairing, and first-time setup.',
    questions: [
      {
        id: '1.1',
        question: 'How do I set up the device for the first time?',
        answer: `1. Power on the device.
2. Open the companion app and follow the pairing instructions.
3. Select your preferred AI companion or scenario to begin.

**Placeholder Suggestion:**
- Add a simple onboarding flow diagram (3–4 steps).
- Add short looping animation of "device pairing" (abstract graphics only).`,
      },
      {
        id: '1.2',
        question: 'Do I need the app to use the device?',
        answer: `Yes. The companion app enables:
- Pairing
- AI-driven rhythm generation
- Scenario selection
- Personalized learning`,
      },
      {
        id: '1.3',
        question: 'Does the device require an internet connection?',
        answer: `- Internet is required **only for AI companion features, updates, and cloud syncing**.
- Once connected, rhythmic motion may continue offline for some modes.`,
      },
      {
        id: '1.4',
        question: "What's included in the box?",
        answer: `- The device
- Charging cable
- Quick start card
- Warranty information

**Placeholder:** product photo (neutral, non-explicit).`,
      },
    ],
  },
  {
    id: '2',
    title: 'AI Companions & Modes',
    description: 'Explains behavior, personalization, and companion selection.',
    questions: [
      {
        id: '2.1',
        question: 'What are AI companions?',
        answer: `AI companions are personality-driven digital characters who influence rhythm style, pacing, and session dynamics.
Each companion offers a distinct interaction style, emotional tone, and motion profile.`,
      },
      {
        id: '2.2',
        question: "What's the difference between AI companions and Real-Character Avatars?",
        answer: `- **AI companions**: Fully synthetic personalities designed to guide rhythm patterns.
- **Real-character avatars**: Based on real performers through licensed partnerships.
  These characters include personality traits modeled after the actor.`,
      },
      {
        id: '2.3',
        question: 'Will more companions be available in the future?',
        answer: 'Yes. Additional AI companions and licensed real-character avatars will be offered as optional upgrades.',
      },
      {
        id: '2.4',
        question: 'How do companions influence the rhythm?',
        answer: `Companions affect:
- Tempo curve
- Stroke patterns
- Emotional pacing
- Scenario interpretation

**Placeholder Suggested Visual:**
- A waveform or abstract animation showing how "companion personality" shapes rhythm.`,
      },
      {
        id: '2.5',
        question: 'Can I preview a companion before buying?',
        answer: `Yes — the website offers a **Rhythm Simulator Preview** where you can try different companions and scenarios.
This preview does not control the actual device.`,
      },
    ],
  },
  {
    id: '3',
    title: 'Adaptive Rhythm Engine',
    description: 'How the AI learns and generates motion.',
    questions: [
      {
        id: '3.1',
        question: 'What is the AI Rhythm Engine?',
        answer: `A pattern-learning system trained on expert movement data and scenario styles.
It generates dynamic, evolving motion tailored to your preferences.`,
      },
      {
        id: '3.2',
        question: 'Does the system learn from me?',
        answer: 'Yes — over time the engine adapts to your usage patterns to create more natural, intuitive rhythm profiles.',
      },
      {
        id: '3.3',
        question: 'What kind of data does the system use for learning?',
        answer: `Only **motion-related feedback** such as:
- Timing
- Duration
- Preferred rhythm intensity
- Scenario engagement

It does **not** collect personal identity or sensitive content.`,
      },
      {
        id: '3.4',
        question: 'Is the AI learning stored locally or in the cloud?',
        answer: 'Preference learning occurs primarily **on-device or encrypted**, depending on your settings.',
      },
      {
        id: '3.5',
        question: 'Can I reset the learned preferences?',
        answer: 'Yes. A reset button will be available in the app settings.',
      },
    ],
  },
  {
    id: '4',
    title: 'Using the Device',
    description: 'Basic usage, cleaning, charging, and troubleshooting.',
    questions: [
      {
        id: '4.1',
        question: 'How long does the battery last?',
        answer: `Typical usage: **X–Y hours** depending on intensity.
(Actual number will be updated once hardware is finalized.)`,
      },
      {
        id: '4.2',
        question: 'How do I clean the device?',
        answer: `The inner and outer components are designed for easy cleaning.

**Placeholder:**
- Add a neutral, abstract cleaning diagram
- Include step-by-step sanitation instructions once hardware is finalized`,
      },
      {
        id: '4.3',
        question: 'What materials is the device made from?',
        answer: `Medical-grade silicone and high-durability polymers.
Designed for safety and long-term use.`,
      },
      {
        id: '4.4',
        question: 'Can I manually control the device?',
        answer: 'Yes — manual mode will be available as a simple fallback option inside the app.',
      },
      {
        id: '4.5',
        question: 'Does the device get warm during use?',
        answer: 'A temperature-stabilized motor prevents overheating under normal operation.',
      },
      {
        id: '4.6',
        question: 'How quiet is the device?',
        answer: 'It uses a low-noise motion system designed for discretion.',
      },
      {
        id: '4.7',
        question: 'Why is my device not moving after pairing?',
        answer: `Possible reasons:
- Low battery
- App not connected
- Simulator mode active instead of real control

Try restarting the device and reconnecting.`,
      },
    ],
  },
  {
    id: '5',
    title: 'Troubleshooting',
    description: 'Connectivity, app issues, firmware, etc.',
    questions: [
      {
        id: '5.1',
        question: "The app can't find my device",
        answer: `Try:
1. Ensure Bluetooth is on
2. Restart the device
3. Restart the app
4. Move closer than 1 meter`,
      },
      {
        id: '5.2',
        question: 'Motion feels inconsistent or delayed',
        answer: `May occur if:
- Network is unstable
- AI mode is generating new patterns
- Battery is low

Check connection and try Manual Mode for calibration.`,
      },
      {
        id: '5.3',
        question: 'Firmware update failed',
        answer: 'Restart the device and app; the updater will retry automatically.',
      },
    ],
  },
  {
    id: '6',
    title: 'Privacy & Security',
    description: 'Key privacy concerns and transparency.',
    questions: [
      {
        id: '6.1',
        question: 'What data do you collect?',
        answer: `Only:
- Device motion feedback
- Anonymous usage patterns
- Optional companion preferences

No personal identity information is collected.`,
      },
      {
        id: '6.2',
        question: 'Are conversations with AI companions stored?',
        answer: 'No. AI interactions are processed securely and are not permanently stored unless you explicitly opt-in.',
      },
      {
        id: '6.3',
        question: 'Is the packaging discreet?',
        answer: 'Yes — all packaging is plain and unbranded.',
      },
      {
        id: '6.4',
        question: 'Do real-character avatars use authorized likenesses?',
        answer: 'Yes. All real-character avatars are created through **formal licensing agreements**.',
      },
    ],
  },
  {
    id: '7',
    title: 'Shipping & Orders',
    questions: [
      {
        id: '7.1',
        question: 'Do you ship internationally?',
        answer: 'Yes — worldwide shipping is included in the price.',
      },
      {
        id: '7.2',
        question: 'Is the packaging discreet?',
        answer: 'Always. No branding or product category appears on the box.',
      },
      {
        id: '7.3',
        question: 'How long does shipping take?',
        answer: 'Typically 7–14 business days depending on region.',
      },
      {
        id: '7.4',
        question: 'How do I track my order?',
        answer: 'Tracking information will be emailed after dispatch.',
      },
    ],
  },
  {
    id: '8',
    title: 'Warranty & Support',
    questions: [
      {
        id: '8.1',
        question: 'What is the warranty period?',
        answer: 'Your device is covered by a **1-year hardware warranty**.',
      },
      {
        id: '8.2',
        question: 'What does the warranty cover?',
        answer: 'Manufacturing defects, motor issues, and electronic failures under normal use.',
      },
      {
        id: '8.3',
        question: 'What is not covered?',
        answer: `- Damage from misuse
- Unauthorized modifications
- Non-standard accessories`,
      },
      {
        id: '8.4',
        question: 'How do I request support?',
        answer: `You can contact support via the app or email:
**support@example.com** (placeholder)`,
      },
    ],
  },
  {
    id: '9',
    title: 'Pricing & Subscriptions',
    questions: [
      {
        id: '9.1',
        question: 'What do I get for the $69 launch price?',
        answer: `- The device
- Companion app access
- AI Rhythm Engine
- 5 AI companions (3 standard + 2 launch bonus)
- 1 licensed real-character avatar (2 years included)
- Free worldwide discreet shipping
- All taxes included`,
      },
      {
        id: '9.2',
        question: 'Will AI companions cost money in the future?',
        answer: 'Some advanced companions or licensed avatars may be optional paid upgrades.',
      },
      {
        id: '9.3',
        question: 'What happens after the included 2-year avatar/companion subscription?',
        answer: `You may renew if you want to continue using premium companions.
Core AI features and standard companions will remain available.`,
      },
    ],
  },
  {
    id: '10',
    title: 'Virtual Rhythm Simulator (Preview Feature)',
    questions: [
      {
        id: '10.1',
        question: 'What is the Rhythm Simulator?',
        answer: `A visual preview of the AI Rhythm Engine showing abstract motion patterns.
It does not control the actual device.`,
      },
      {
        id: '10.2',
        question: "Why doesn't the website preview match the final experience?",
        answer: `The preview only demonstrates rhythm logic.
The real device uses higher-resolution motor control and adaptive models.`,
      },
      {
        id: '10.3',
        question: 'Does the simulator use the real algorithm?',
        answer: `Currently mock data is shown.
Once the algorithm service is stable, the simulator will connect to live AI rhythm previews.`,
      },
    ],
  },
  {
    id: '11',
    title: 'Safety',
    questions: [
      {
        id: '11.1',
        question: 'Is the device safe to use?',
        answer: 'Yes. It uses medical-grade materials and temperature-safe motor control.',
      },
      {
        id: '11.2',
        question: 'Are there recommended usage limits?',
        answer: `Moderation is recommended.
Full safety guidelines will be available once hardware validation is finalized.

**Placeholder:** add a simple infographic later.`,
      },
    ],
  },
  {
    id: '12',
    title: 'Miscellaneous',
    questions: [
      {
        id: '12.1',
        question: 'Will there be a companion app for iOS and Android?',
        answer: 'Yes, a cross-platform app is planned.',
      },
      {
        id: '12.2',
        question: 'Can I use the device without creating an account?',
        answer: 'Yes — anonymous mode will be available.',
      },
      {
        id: '12.3',
        question: 'Can I export or delete my data?',
        answer: 'Yes. Data control tools will be available in the app.',
      },
    ],
  },
];






