import { LevelData, AgeTrack, SafetyCategory } from '../types';
import { SINHALA_CURRICULUM_TRANSLATIONS } from './curriculumTranslations';

export const CATEGORY_INFO: Record<SafetyCategory, { 
  title: string; 
  titleSi: string;
  color: string; 
  bgLight: string; 
  icon: string; 
  description: string;
  descriptionSi: string;
}> = {
  stranger: {
    title: 'Stranger Safety',
    titleSi: 'නොදන්නා අයගෙන් ආරක්ෂාව',
    color: 'emerald',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'Shield',
    description: 'Knowing how to respond safely to people you do not know.',
    descriptionSi: 'ඔබ නොදන්නා පුද්ගලයින් ඉදිරියේ ආරක්ෂිතව ක්‍රියා කරන ආකාරය.'
  },
  body_safety: {
    title: 'Body Safety',
    titleSi: 'ශරීර ආරක්ෂාව සහ සීමා',
    color: 'sky',
    bgLight: 'bg-sky-50 text-sky-700 border-sky-200',
    icon: 'HeartHandshake',
    description: 'Understanding bodily autonomy and safe vs unsafe touches.',
    descriptionSi: 'ශරීරයේ පෞද්ගලිකත්වය සහ ආරක්ෂිත/අනාරක්ෂිත ස්පර්ශ හඳුනා ගැනීම.'
  },
  secrets: {
    title: 'Secrets & Boundaries',
    titleSi: 'රහස් සහ සීමාවන්',
    color: 'amber',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'Key',
    description: 'Recognizing unsafe secrets and telling trusted adults.',
    descriptionSi: 'නරක රහස් හඳුනාගෙන විශ්වාසවන්ත වැඩිහිටියන්ට පැවසීම.'
  },
  public_safety: {
    title: 'Public Places Safety',
    titleSi: 'පොදු ස්ථාන ආරක්ෂාව',
    color: 'indigo',
    bgLight: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    icon: 'Compass',
    description: 'Staying safe when lost or navigating public spaces.',
    descriptionSi: 'මඟ හැරුණු විට හෝ පොදු ස්ථානවල ආරක්ෂිතව සිටීම.'
  },
  digital_safety: {
    title: 'Digital & Online Safety',
    titleSi: 'ඩිජිටල් සහ අන්තර්ජාල ආරක්ෂාව',
    color: 'purple',
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: 'Laptop',
    description: 'Protecting your personal info, photos, and chats on devices.',
    descriptionSi: 'ඩිජිටල් උපකරණවල පුද්ගලික තොරතුරු, ඡායාරූප සහ සංවාද ආරක්ෂා කිරීම.'
  }
};

const RAW_LEVELS_DATA: LevelData[] = [
  // ==========================================
  // AGE 6 TRACK
  // ==========================================
  {
    id: 'age6_l1',
    levelNumber: 1,
    category: 'stranger',
    ageTrack: 6,
    title: 'Park Sweet Surprise',
    categoryTitle: 'Stranger Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Candy',
    summary: 'A friendly man offers sweets at the playground.',
    questions: [
      {
        id: 'a6_l1_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'park',
        sceneDescription: 'A sunny playground with swings. A smiling man holds out a shiny lollipop.',
        onScreenText: 'A stranger offers candy. What to do?',
        voiceOverText: {
          en: "You're playing at the park. A man you don't know offers you sweets.",
          si: "ඔබ උද්‍යානයේ සෙල්ලම් කරමින් සිටී. ඔබ නොදන්නා කෙනෙක් පැණිරස කැවිලි දෙයි.",
          ta: "நீங்கள் பூங்காவில் விளையாடுகிறீர்கள். தெரியாத ஒருவர் மிட்டாய் தருகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Take the sweets',
            iconName: 'Candy',
            type: 'unsafe',
            feedback: "That's not safe. We never take treats from strangers.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Walk away to mum',
            iconName: 'Footprints',
            type: 'safe',
            feedback: "Well done! Walking away and staying with your guardian keeps you safe!",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a6_l1_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'park',
        sceneDescription: 'The man walks closer to the park bench and shows a cute toy car.',
        onScreenText: 'He says: "Come look at my toy puppy!"',
        voiceOverText: {
          en: "The man asks you to come closer to see a toy puppy in his bag.",
          si: "ඔහුගේ බෑගයේ ඇති බලු පැටවාගේ සෙල්ලම් බඩුව බැලීමට ළඟට එන්නැයි කියයි.",
          ta: "அவரது பையில் உள்ள பொம்மை நாய்க்குட்டியைப் பார்க்க அருகில் வருமாறு கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Go look closer',
            iconName: 'Eye',
            type: 'unsafe',
            feedback: "Unsafe! Never walk closer to someone you don't know.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Say "Just one minute"',
            iconName: 'Clock',
            type: 'trap',
            feedback: "Sneaky trap! Even for a quick second, never stay near a stranger.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Shout "NO!" & run',
            iconName: 'Volume2',
            type: 'safe',
            feedback: "Super! A loud NO and running to your guardian is the best choice!",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a6_l1_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'park',
        sceneDescription: 'The man points towards the park gate and says your family sent him.',
        onScreenText: 'He says: "Your mum sent me to get you!"',
        voiceOverText: {
          en: "He says your mum sent him to fetch you. What is your smart move?",
          si: "ඔබව රැගෙන යාමට අම්මා එව්වා යැයි ඔහු පවසයි. ඔබ කුමක් කළ යුතුද?",
          ta: "உங்களை அழைத்து வர உங்கள் அம்மா அனுப்பியதாக கூறுகிறார். நீங்கள் என்ன செய்ய வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Hold his hand',
            iconName: 'HeartHandshake',
            type: 'unsafe',
            feedback: "Dangerous! Never hold a stranger's hand.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Follow him outside',
            iconName: 'DoorOpen',
            type: 'unsafe',
            feedback: "Never leave the park with someone you don't know!",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Ask for secret password',
            iconName: 'KeyRound',
            type: 'safe',
            feedback: "Brilliant! Only real family members know your secret Family Password!",
            isCorrect: true,
            triggersFamilyPasswordCheck: true
          },
          {
            id: 'opt4',
            label: 'Run to Park Guard',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Awesome! Running to a uniformed guard or adult helper is super safe!",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age6_l2',
    levelNumber: 2,
    category: 'body_safety',
    ageTrack: 6,
    title: 'My Body Belongs to Me',
    categoryTitle: 'Body Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'ShieldAlert',
    summary: 'Learning swim-suit zones and safe versus unsafe touches.',
    questions: [
      {
        id: 'a6_l2_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'A child looking at swimming clothes showing private areas.',
        onScreenText: 'Who decides who can touch your body?',
        voiceOverText: {
          en: "Your body belongs to you. Who decides about touches?",
          si: "ඔබේ ශරීරය ඔබට අයිතියි. ඔබේ කැමැත්ත කා සතුද?",
          ta: "உங்கள் உடல் உங்களுக்கே சொந்தமானது. உங்கள் உடலை யார் முடிவு செய்வது?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Only ME!',
            iconName: 'UserCheck',
            type: 'safe',
            feedback: "100% Correct! Your body belongs completely to YOU!",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Anyone who asks',
            iconName: 'Users',
            type: 'unsafe',
            feedback: "No! No one has the right to touch your private parts.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a6_l2_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'Someone at a family gathering wants an uncomfortable hug.',
        onScreenText: 'You feel uncomfortable with a hug. What to do?',
        voiceOverText: {
          en: "If a touch or hug makes you feel weird or uncomfortable, what can you do?",
          si: "යම් වැළඳගැනීමක් ඔබට අපහසුතාවක් දැනේ නම්, ඔබ කුමක් කළ යුතුද?",
          ta: "ஒரு அணைப்பு உங்களுக்கு அசௌகரியமாக இருந்தால், நீங்கள் என்ன செய்ய வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Force a smile & stay',
            iconName: 'Smile',
            type: 'trap',
            feedback: "You never have to force touches that make you feel uncomfortable!",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Say "No thank you, high-five!"',
            iconName: 'Hand',
            type: 'safe',
            feedback: "Great job! A high-five or wave is a polite way to set your boundary.",
            isCorrect: true
          },
          {
            id: 'opt3',
            label: 'Hide in a quiet room',
            iconName: 'DoorClosed',
            type: 'unsafe',
            feedback: "Don't hide alone; always go find your trusted guardian.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a6_l2_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'Someone asks you to keep a private touch a secret.',
        onScreenText: 'Someone touches swimsuit area and says "Keep it secret!"',
        voiceOverText: {
          en: "Someone touches swimsuit area and tells you not to tell anyone.",
          si: "යමෙකු රහස්‍ය ප්‍රදේශයක් අල්ලා රහසක්ව තබන්නැයි පැවසුවහොත් කුමක් කරන්නේද?",
          ta: "யாராவது தனிப்பட்ட பகுதியைத் தொட்டு ரகசியமாக வைக்கச் சொன்னால் என்ன செய்வது?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Keep the secret',
            iconName: 'Lock',
            type: 'unsafe',
            feedback: "Never keep unsafe secrets! Private body parts are never secrets.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Wait until tomorrow',
            iconName: 'Calendar',
            type: 'trap',
            feedback: "Don't wait! Tell a trusted adult right away.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Tell trusted adult NOW',
            iconName: 'MessageCircle',
            type: 'safe',
            feedback: "Bravo! Always tell your guardian immediately. You will never be in trouble!",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Say loud "NO! STOP!"',
            iconName: 'Shield',
            type: 'safe',
            feedback: "Fantastic! Use your strong safety voice to say STOP!",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age6_l3',
    levelNumber: 3,
    category: 'secrets',
    ageTrack: 6,
    title: 'Surprises vs Bad Secrets',
    categoryTitle: 'Secrets & Boundaries',
    estimatedPlaytime: '2 mins',
    iconName: 'Gift',
    summary: 'Recognizing happy surprises that get told soon versus unsafe secrets.',
    questions: [
      {
        id: 'a6_l3_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'A wrapped birthday gift for mum with colorful balloons.',
        onScreenText: 'Is a birthday gift surprise a safe secret?',
        voiceOverText: {
          en: "Dad bought a birthday cake for mum's party tomorrow. Is this a happy surprise?",
          si: "හෙට අම්මාගේ උපන්දිනයට තාත්තා කේක් එකක් ගෙනාවා. මෙය සතුටුදායක පුදුමයක්ද?",
          ta: "அம்மாவின் பிறந்தநாளுக்கு அப்பா கேக் வாங்கினார். இது மகிழ்ச்சியான ஆச்சரியமா?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Yes, happy surprise!',
            iconName: 'PartyPopper',
            type: 'safe',
            feedback: "Correct! Surprises make everyone happy and are told soon!",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'No, it is dangerous',
            iconName: 'AlertTriangle',
            type: 'unsafe',
            feedback: "Birthday presents are safe happy surprises because everyone will know soon.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a6_l3_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'An adult neighbor says: "Do not tell your mother we broke this vase!"',
        onScreenText: 'Adult says: "Do not tell your mummy!"',
        voiceOverText: {
          en: "An adult says: 'Keep this a secret and don't tell your mummy.' How does your tummy feel?",
          si: "වැඩිහිටියෙක් 'අම්මාට කියන්න එපා' යැයි රහසක් කියයි. ඔබ කුමක් කළ යුතුද?",
          ta: "ஒருவர் 'அம்மாவிடம் சொல்லாதே' என்று ரகசியம் சொல்கிறார். நீங்கள் என்ன செய்ய வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Keep it inside',
            iconName: 'VolumeX',
            type: 'unsafe',
            feedback: "Unsafe secrets that make your tummy hurt must always be shared with parents.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Tell only a friend',
            iconName: 'Users',
            type: 'trap',
            feedback: "Telling a kid friend is okay, but you must tell your grown-up guardian!",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Tell mummy right away',
            iconName: 'Heart',
            type: 'safe',
            feedback: "Spot on! There are NO secrets between you and your trusted guardian.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a6_l3_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'Someone gives you money and says you will get in big trouble if you speak.',
        onScreenText: 'They say: "If you tell, you will be punished!"',
        voiceOverText: {
          en: "Someone threatens you and says you will get in trouble if you speak up.",
          si: "ඔබ කීවොත් දඬුවම් ලැබෙනු ඇතැයි යමෙකු බිය ගන්වයි. සත්‍යය කුමක්ද?",
          ta: "சொன்னால் தண்டனை கிடைக்கும் என்று ஒருவர் பயமுறுத்துகிறார். உண்மை என்ன?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Stay quiet and cry',
            iconName: 'Frown',
            type: 'unsafe',
            feedback: "You did nothing wrong! Never stay quiet when someone scares you.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Hide your feelings',
            iconName: 'Smile',
            type: 'unsafe',
            feedback: "Hiding your feelings is unsafe. Speak to a trusted helper.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Remember: I am NEVER to blame',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "YES! You are never to blame for unsafe things adults do!",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Tell my trusted guardian',
            iconName: 'Megaphone',
            type: 'safe',
            feedback: "Hero choice! Your guardian will always protect and believe you.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age6_l4',
    levelNumber: 4,
    category: 'public_safety',
    ageTrack: 6,
    title: 'Supermarket Helper Search',
    categoryTitle: 'Public Places Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Store',
    summary: 'Finding the right helper in uniform when separated in a busy store.',
    questions: [
      {
        id: 'a6_l4_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'store',
        sceneDescription: 'A large grocery aisle. You look around and cannot see your parents.',
        onScreenText: 'You lost your mum in the store. What first?',
        voiceOverText: {
          en: "You look around in the store and cannot see your mum. What should you do first?",
          si: "වෙළඳසැලේදී අම්මාව සොයාගත නොහැක. ඔබ මුලින්ම කුමක් කළ යුතුද?",
          ta: "கடையில் அம்மாவை காணவில்லை. நீங்கள் முதலில் என்ன செய்ய வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Freeze in one spot',
            iconName: 'MapPin',
            type: 'safe',
            feedback: "Smart! Stay in one place so your parents can find you faster.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Run outside to parking',
            iconName: 'Car',
            type: 'unsafe',
            feedback: "Dangerous! Never run outside to cars and traffic alone.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a6_l4_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'store',
        sceneDescription: 'You see three different people standing nearby.',
        onScreenText: 'Who is the safest person to ask for help?',
        voiceOverText: {
          en: "Who is the safest person to ask for help inside a supermarket?",
          si: "සුපිරි වෙළඳසැලක උදව් ඉල්ලීමට වඩාත්ම සුරක්ෂිත පුද්ගලයා කවුද?",
          ta: "உதவி கேட்க மிகவும் பாதுகாப்பான நபர் யார்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Uniformed Cashier at till',
            iconName: 'BadgeCheck',
            type: 'safe',
            feedback: "Perfect! Store staff with name tags and uniforms are trusted safe helpers!",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'A stranger in sunglasses',
            iconName: 'HelpCircle',
            type: 'unsafe',
            feedback: "Avoid random strangers in dark corners.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Someone eating snacks',
            iconName: 'Coffee',
            type: 'trap',
            feedback: "Look for official staff wearing uniforms or badges instead.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a6_l4_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'store',
        sceneDescription: 'A customer says: "Come to my car, I will drive you home."',
        onScreenText: 'A customer says: "Get in my car, I will take you home!"',
        voiceOverText: {
          en: "A shopper says they can take you home in their car. What do you do?",
          si: "ගැනුම්කරුවෙක් ඔබව කාර් එකෙන් ගෙදර ගෙනියන්නම් කියයි. ඔබ කුමක් කරන්නේද?",
          ta: "ஒருவர் தனது காரில் வீட்டிற்கு அழைத்துச் செல்வதாக கூறுகிறார். என்ன செய்வீர்கள்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Get in their car',
            iconName: 'Car',
            type: 'unsafe',
            feedback: "NEVER get into any stranger's car under any circumstances!",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Wait by their car',
            iconName: 'Clock',
            type: 'trap',
            feedback: "No! Never follow a stranger outside the building.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Stay inside near checkout',
            iconName: 'Store',
            type: 'safe',
            feedback: "Excellent! Stay inside the store where lights and staff are.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Ask cashier to make store call',
            iconName: 'Mic',
            type: 'safe',
            feedback: "Genius! The cashier can call your parent over the store microphone speaker!",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age6_l5',
    levelNumber: 5,
    category: 'digital_safety',
    ageTrack: 6,
    title: 'Smart Tablet Rules',
    categoryTitle: 'Digital & Online Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Tablet',
    summary: 'Playing games safely and keeping home details private.',
    questions: [
      {
        id: 'a6_l5_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'A cartoon video game popping up a box asking for real name.',
        onScreenText: 'Game asks for your real address. Should you type it?',
        voiceOverText: {
          en: "A colorful game asks for your real home address. Should you type it?",
          si: "ක්‍රීඩාවක් ඔබේ නිවසේ ලිපිනය අසයි. ඔබ එය ටයිප් කළ යුතුද?",
          ta: "ஒரு விளையாட்டு உங்கள் வீட்டு முகவரியைக் கேட்கிறது. நீங்கள் பதிவிட வேண்டுமா?"
        },
        options: [
          {
            id: 'opt1',
            label: 'NO, keep it private!',
            iconName: 'ShieldOff',
            type: 'safe',
            feedback: "Super! Real addresses, phone numbers, and school names stay secret!",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Yes, type everything',
            iconName: 'Edit3',
            type: 'unsafe',
            feedback: "Never put your home location on online games.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a6_l5_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'A pop-up appears: "You won 1,000 free gems! Click to download!"',
        onScreenText: 'Flashing pop-up: "Download now for free toy!"',
        voiceOverText: {
          en: "A flashing banner promises free toys or gems if you click immediately.",
          si: "නොමිලේ සෙල්ලම් බඩු ලබා දෙන බවට පණිවිඩයක් පැමිණේ.",
          ta: "இலவச பொம்மைகள் தருவதாக ஒரு செய்தி வருகிறது."
        },
        options: [
          {
            id: 'opt1',
            label: 'Click quickly',
            iconName: 'MousePointerClick',
            type: 'unsafe',
            feedback: "Pop-ups can download bad viruses or take you to unsafe websites.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Share with classmates',
            iconName: 'Share2',
            type: 'trap',
            feedback: "Don't share spam with friends!",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Show grown-up first',
            iconName: 'UserCheck',
            type: 'safe',
            feedback: "Terrific! Always show your parent before clicking any pop-up.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a6_l5_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'An unknown player in game chat asks you to turn on your webcam video.',
        onScreenText: 'Unknown player: "Turn on video camera!"',
        voiceOverText: {
          en: "A player in the game asks you to turn on your camera and show your room.",
          si: "ක්‍රීඩාවේ සිටින කෙනෙක් ඔබේ කැමරාව ක්‍රියාත්මක කරන්නැයි පවසයි.",
          ta: "விளையாட்டில் உள்ள ஒருவர் உங்கள் கேமராவை ஆன் செய்யும்படி கேட்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Turn on camera',
            iconName: 'Camera',
            type: 'unsafe',
            feedback: "Never turn on video or webcam for people you don't know in real life.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Send a room picture',
            iconName: 'Image',
            type: 'unsafe',
            feedback: "Never share pictures of yourself or your bedroom with online players.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Leave chat & block player',
            iconName: 'UserX',
            type: 'safe',
            feedback: "Great reaction! Block and leave the chat immediately.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Tell mum or dad immediately',
            iconName: 'AlertCircle',
            type: 'safe',
            feedback: "Champion safety move! Tell your parent so they can keep your game secure.",
            isCorrect: true
          }
        ]
      }
    ]
  },

  // ==========================================
  // AGE 7 TRACK (As highlighted in PDF Sample Level!)
  // ==========================================
  {
    id: 'age7_l1',
    levelNumber: 1,
    category: 'stranger',
    ageTrack: 7,
    title: 'The "Mum Sent Me" Trap',
    categoryTitle: 'Stranger Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Car',
    summary: 'A stranger at the park claims your mother sent him in an emergency.',
    questions: [
      {
        id: 'a7_l1_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'park',
        sceneDescription: 'A sunny park. A child plays near a swing. A man approaches holding a sweets packet.',
        onScreenText: 'What should you do?',
        voiceOverText: {
          en: "You're at the park. A man you don't know is offering you sweets.",
          si: "ඔබ උද්‍යානයේ සිටී. ඔබ නොදන්නා මිනිසෙක් ඔබට රසකැවිලි පිරිනමයි.",
          ta: "நீங்கள் பூங்காவில் இருக்கிறீர்கள். தெரியாத ஒருவர் மிட்டாய் தருகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Take the sweets',
            iconName: 'Candy',
            type: 'unsafe',
            feedback: "That's not safe. We don't take things from people we don't know.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Walk away',
            iconName: 'Footprints',
            type: 'safe',
            feedback: "Well done! Walking away from strangers keeps you safe.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a7_l1_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'park',
        sceneDescription: 'The man points toward a car outside the gate: "Your mum sent me to take you home."',
        onScreenText: 'He says mum sent him. What do you do?',
        voiceOverText: {
          en: "The man says your mother sent him to take you home.",
          si: "ඔබව ගෙදර ගෙනියන්න අම්මා එව්වා යැයි ඔහු පවසයි.",
          ta: "உங்கள் அம்மா உங்களை அழைத்து வர அனுப்பியதாக கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Go with him',
            iconName: 'Car',
            type: 'unsafe',
            feedback: "Even if a stranger says mum sent them, we never go with them.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Ask him to call mum',
            iconName: 'Phone',
            type: 'trap',
            feedback: "Good thinking! But it's safer to find a helper, not stay chatting with the stranger.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Find a guard or shop helper',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Perfect! Always find a safe adult when you're not sure.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a7_l1_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'park',
        sceneDescription: 'The man pretends to look worried, holding a phone with a fake photo: "It is an emergency!"',
        onScreenText: 'He shows photo of mum. Now what?',
        voiceOverText: {
          en: "He shows you a photo of your mother and looks worried. He says it's an emergency.",
          si: "ඔහු අම්මාගේ ඡායාරූපයක් පෙන්වා හදිසි අවස්ථාවක් බව පවසයි.",
          ta: "அவர் அம்மாவின் புகைப்படத்தைக் காட்டி அவசரம் என்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Go quickly with him',
            iconName: 'Car',
            type: 'unsafe',
            feedback: "Strangers can pretend it's an emergency. We don't go with them, even then.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Hold his hand and follow',
            iconName: 'HeartHandshake',
            type: 'trap',
            feedback: "Holding hands doesn't make a stranger safe. Always find a real helper.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Ask for Family Password',
            iconName: 'Key',
            type: 'safe',
            feedback: "Brilliant! Only your real family knows your secret password. That's how you check!",
            isCorrect: true,
            triggersFamilyPasswordCheck: true
          },
          {
            id: 'opt4',
            label: 'Run to a guard or shop',
            iconName: 'Building',
            type: 'safe',
            feedback: "Smart and safe! A guard or shopkeeper is always a good helper.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age7_l2',
    levelNumber: 2,
    category: 'body_safety',
    ageTrack: 7,
    title: 'The "Secret Game" Trick',
    categoryTitle: 'Body Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Gamepad2',
    summary: 'Recognizing when an adult tries to disguise unsafe touch as a playful game.',
    questions: [
      {
        id: 'a7_l2_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'A person invites you into a locked bedroom for a "special game".',
        onScreenText: 'Is a game with locked doors okay?',
        voiceOverText: {
          en: "Someone wants to play a secret game inside a locked room alone with you.",
          si: "යමෙකු අගුළු දැමූ කාමරයක රහස් ක්‍රීඩාවක් කිරීමට කැඳවයි.",
          ta: "ஒருவர் பூட்டிய அறையில் ரகசிய விளையாட்டு விளையாட அழைக்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Safe fun game',
            iconName: 'Smile',
            type: 'unsafe',
            feedback: "Safe games with children are open, visible, and never locked behind doors.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Unsafe boundary',
            iconName: 'ShieldAlert',
            type: 'safe',
            feedback: "Correct! Real, fun games never need to be hidden away or locked.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a7_l2_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'The person says: "This is our doctor game. Do not tell your parents."',
        onScreenText: 'They say: "This is our private doctor game!"',
        voiceOverText: {
          en: "An adult or older youth invents a doctor game that involves private touch.",
          si: "රහස්‍ය ප්‍රදේශ ස්පර්ශ වන ක්‍රීඩාවක් කිරීමට යමෙකු උත්සාහ කරයි.",
          ta: "ரகசிய உறுப்புகளை தொடும் வகையில் ஒருவர் விளையாட்டு விளையாட முனைகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Play along quietly',
            iconName: 'VolumeX',
            type: 'unsafe',
            feedback: "Never allow anyone to touch private parts under the disguise of a game.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Ask to play tomorrow instead',
            iconName: 'Clock',
            type: 'trap',
            feedback: "Delaying doesn't stop unsafe behavior. You must say NO immediately!",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Say "NO!" & leave immediately',
            iconName: 'Footprints',
            type: 'safe',
            feedback: "Outstanding! Say a firm NO, get out of the room, and tell your guardian.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a7_l2_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'The person says: "If you tell, nobody will believe you."',
        onScreenText: 'They say: "Nobody will believe you anyway!"',
        voiceOverText: {
          en: "They try to trick you by claiming your parents won't believe you.",
          si: "ඔබව කිසිවෙකු විශ්වාස නොකරනු ඇතැයි ඔවුන් බිය ගන්වයි.",
          ta: "யாரும் உங்களை நம்ப மாட்டார்கள் என்று அவர்கள் கூறுகிறார்கள்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Believe them and stay silent',
            iconName: 'Lock',
            type: 'unsafe',
            feedback: "That's a lie they use to protect themselves. Always speak up!",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Write it in a secret diary only',
            iconName: 'Book',
            type: 'trap',
            feedback: "Writing is good, but you MUST speak directly to your guardian or teacher!",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Keep telling until someone helps',
            iconName: 'CheckCircle2',
            type: 'safe',
            feedback: "Hero rule! If one adult doesn't listen, keep telling trusted adults until safe!",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Tell trusted school teacher',
            iconName: 'GraduationCap',
            type: 'safe',
            feedback: "Excellent! School teachers and counselors are trained to protect and believe you.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age7_l3',
    levelNumber: 3,
    category: 'secrets',
    ageTrack: 7,
    title: 'Secrets From a Known Adult',
    categoryTitle: 'Secrets & Boundaries',
    estimatedPlaytime: '2 mins',
    iconName: 'UserCheck',
    summary: 'Navigating pressure when a known family friend asks for secrecy.',
    questions: [
      {
        id: 'a7_l3_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'A family acquaintance visits and asks you to keep a secret from your mother.',
        onScreenText: 'A known adult says: "Keep this between us!"',
        voiceOverText: {
          en: "Someone you know says: 'Keep this a secret between us, don't tell your parents.'",
          si: "ඔබ දන්නා කෙනෙක් 'අප දෙදෙනා අතර රහසක්ව තබාගන්න' යැයි පවසයි.",
          ta: "உங்களுக்கு தெரிந்த ஒருவர் 'இதை ரகசியமாக வை' என்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Unsafe secret',
            iconName: 'ShieldAlert',
            type: 'safe',
            feedback: "Right! Adults should never ask children to keep secrets from their parents.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Harmless secret',
            iconName: 'Smile',
            type: 'unsafe',
            feedback: "Any secret that excludes your parents is unsafe.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a7_l3_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'The adult offers a video game console if you promise never to mention it.',
        onScreenText: 'They offer a prize if you keep the secret.',
        voiceOverText: {
          en: "They offer you a brand new game console if you promise to keep a secret.",
          si: "රහසක් තබාගන්නේ නම් අලුත්ම ක්‍රීඩාවක් ලබා දෙන බව කියයි.",
          ta: "ரகசியத்தை காத்தால் புதிய கேம் தருவதாக கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Accept the gift and promise',
            iconName: 'Gift',
            type: 'unsafe',
            feedback: "Gifts with secret conditions are dangerous bribes.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Take it and tell later',
            iconName: 'Clock',
            type: 'trap',
            feedback: "Taking the gift can make it harder to report. Refuse right away!",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Refuse gift & inform parents',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Outstanding! Real gifts come with no secret strings attached.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a7_l3_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'They say: "If you tell, your family will be broken and sad."',
        onScreenText: 'They say telling will make your family sad.',
        voiceOverText: {
          en: "They try to make you feel guilty, saying you will ruin the family if you talk.",
          si: "ඔබ පැවසුවහොත් පවුල බිඳවැටෙනු ඇතැයි පවසයි.",
          ta: "சொன்னால் குடும்பம் கஷ்டப்படும் என்று குற்ற உணர்வை ஏற்படுத்துகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Keep quiet to protect family',
            iconName: 'Lock',
            type: 'unsafe',
            feedback: "Telling the truth is what actually keeps your family safe!",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Pretend it never happened',
            iconName: 'EyeOff',
            type: 'unsafe',
            feedback: "Ignoring unsafe behavior allows it to continue. Speak up!",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Tell guardian: Truth protects us',
            iconName: 'HeartHandshake',
            type: 'safe',
            feedback: "Brilliant! Telling the truth keeps everyone safe and supported.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Talk to a trusted school counselor',
            iconName: 'UserCheck',
            type: 'safe',
            feedback: "Excellent! School counselors and teachers are always safe allies.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age7_l4',
    levelNumber: 4,
    category: 'public_safety',
    ageTrack: 7,
    title: 'Lost on the Way Home',
    categoryTitle: 'Public Places Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Navigation',
    summary: 'Navigating unfamiliar streets safely and finding authorized safety points.',
    questions: [
      {
        id: 'a7_l4_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'street',
        sceneDescription: 'A street fork with a bright main street on left and a dark alley on right.',
        onScreenText: 'You took a wrong turn. Which route to walk?',
        voiceOverText: {
          en: "You took a wrong turn after school. Which path should you choose?",
          si: "පාසලෙන් පසු ඔබ වැරදි පාරක ගියේය. කුමන මාවත තෝරාගත යුතුද?",
          ta: "பள்ளி முடிந்து தவறான வழியில் சென்றுவிட்டீர்கள். எந்த வழியை தேர்ந்தெடுக்க வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Bright, busy main street',
            iconName: 'Sun',
            type: 'safe',
            feedback: "Smart! Always stay on well-lit streets where other people and shops are.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Dark quiet shortcut alley',
            iconName: 'Moon',
            type: 'unsafe',
            feedback: "Never take lonely, dark shortcuts where nobody can see you.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a7_l4_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'street',
        sceneDescription: 'A car slows down beside you on the curb with a rolled-down window.',
        onScreenText: 'A car slows down and asks for directions.',
        voiceOverText: {
          en: "A driver pulls up next to the curb and asks you to step closer to look at a map.",
          si: "රියදුරෙක් මෝටර් රථය නවතා සිතියමක් බැලීමට ළඟට එන්නැයි කියයි.",
          ta: "ஒரு கார் அருகில் வந்து வழிகேட்க அருகில் வரச்சொல்கிறது."
        },
        options: [
          {
            id: 'opt1',
            label: 'Walk up to car window',
            iconName: 'Car',
            type: 'unsafe',
            feedback: "Stay at least 3 big steps away from any car window!",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Politely talk for 5 mins',
            iconName: 'MessageCircle',
            type: 'trap',
            feedback: "Adults should ask other adults for directions, not young children.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Step back 3 steps & walk to shop',
            iconName: 'Footprints',
            type: 'safe',
            feedback: "Master safety move! Keep a safe distance and head straight into an open store.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a7_l4_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'street',
        sceneDescription: 'You realize you do not know the way back to your house.',
        onScreenText: 'You are completely lost. What is your safest plan?',
        voiceOverText: {
          en: "You don't know the way. Where should you go to ask for phone help?",
          si: "ඔබට මඟ අමතක වී ඇත. උදව් ඉල්ලීමට යා යුත්තේ කොතැනටද?",
          ta: "உங்களுக்கு வழி தெரியவில்லை. உதவி கேட்க எங்கு செல்ல வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Follow an unknown stranger',
            iconName: 'UserX',
            type: 'unsafe',
            feedback: "Never follow an unknown person to their private home.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Sit behind a bush and wait',
            iconName: 'Trees',
            type: 'trap',
            feedback: "Hiding makes it harder for police or parents to spot you.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Enter police station or bank',
            iconName: 'Building2',
            type: 'safe',
            feedback: "Top tier! Banks, police stations, and large stores have security and phone access.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Ask shop cashier to call parent',
            iconName: 'PhoneCall',
            type: 'safe',
            feedback: "Spot on! The cashier can safely dial your guardian's number.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age7_l5',
    levelNumber: 5,
    category: 'digital_safety',
    ageTrack: 7,
    title: 'Online Photo Requests',
    categoryTitle: 'Digital & Online Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Camera',
    summary: 'Handling photo requests and knowing what images are strictly private.',
    questions: [
      {
        id: 'a7_l5_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'An online messaging chat with an avatar asking for a selfie in school uniform.',
        onScreenText: 'Online gaming pal asks for school uniform picture.',
        voiceOverText: {
          en: "Someone you play Roblox or Minecraft with asks for a photo of your school uniform.",
          si: "ඔන්ලයින් ක්‍රීඩකයෙක් ඔබේ පාසල් නිල ඇඳුමේ ඡායාරූපයක් ඉල්ලයි.",
          ta: "ஆன்லைன் நண்பர் பள்ளி சீருடை புகைப்படத்தைக் கேட்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Send the photo',
            iconName: 'Send',
            type: 'unsafe',
            feedback: "School badges reveal exactly where you go to school! Never share.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Refuse & tell parents',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Smart! Uniforms and logos give away your real location.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a7_l5_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'The user offers rare game currency: "Send a picture of yourself in your room and I will give you 500 V-Bucks."',
        onScreenText: 'They offer game money for a picture of you.',
        voiceOverText: {
          en: "They offer 500 game coins if you send a picture of your bedroom.",
          si: "ඔබේ කාමරයේ පින්තූරයක් එවන්නේ නම් ගේම් කාසි දෙන බව පවසයි.",
          ta: "உங்கள் அறையின் படத்திற்கு விளையாட்டு நாணயங்கள் தருவதாக கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Send just one picture',
            iconName: 'Image',
            type: 'unsafe',
            feedback: "Never trade personal photos for virtual items.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Blur your face and send',
            iconName: 'Sparkles',
            type: 'trap',
            feedback: "Even blurred photos can contain background clues or lead to more pressure.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Say NO, report & block user',
            iconName: 'ShieldAlert',
            type: 'safe',
            feedback: "Great move! Block the sender and report them inside the app.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a7_l5_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'They ask for photos without clothes or swimsuit pictures.',
        onScreenText: 'Player asks for private/swimsuit photo.',
        voiceOverText: {
          en: "An online user asks for private body photos or pictures without clothes.",
          si: "අන්තර්ජාල පරිශීලකයෙක් ඇඳුම් නොමැතිව පින්තූර ඉල්ලයි.",
          ta: "ஆன்லைன் நபர் உடைகள் இல்லாத புகைப்படங்களைக் கேட்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Send photo to be nice',
            iconName: 'UserPlus',
            type: 'unsafe',
            feedback: "NO! Nobody has the right to ask for private photos.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Keep it a secret',
            iconName: 'Lock',
            type: 'unsafe',
            feedback: "Never keep this a secret. It is illegal and dangerous.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Take screenshot & tell parents',
            iconName: 'Camera',
            type: 'safe',
            feedback: "Expert choice! Screenshots help parents and police take down dangerous users.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Block player & close game',
            iconName: 'UserX',
            type: 'safe',
            feedback: "Excellent! Close the screen and tell your trusted guardian immediately.",
            isCorrect: true
          }
        ]
      }
    ]
  },

  // ==========================================
  // AGE 8 TRACK
  // ==========================================
  {
    id: 'age8_l1',
    levelNumber: 1,
    category: 'stranger',
    ageTrack: 8,
    title: 'Stranger Online: Chat Requests',
    categoryTitle: 'Stranger Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'MessageSquare',
    summary: 'Handling direct messages on gaming platforms and Discord servers.',
    questions: [
      {
        id: 'a8_l1_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'A direct message from a user with no mutual friends asking: "Hey what town do you live in?"',
        onScreenText: 'Online stranger asks: "Where do you live?"',
        voiceOverText: {
          en: "An unknown player on Discord or Roblox asks what town you live in.",
          si: "ඔබ ජීවත් වන නගරය කුමක්දැයි නොදන්නා ක්‍රීඩකයෙකු අසයි.",
          ta: "நீங்கள் எந்த ஊரில் வசிக்கிறீர்கள் என்று ஒரு புதியவர் கேட்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Tell the town name',
            iconName: 'MapPin',
            type: 'unsafe',
            feedback: "Never share location information with strangers online.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Keep location private',
            iconName: 'Shield',
            type: 'safe',
            feedback: "Spot on! Online strangers do not need to know your real town.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a8_l1_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'The user claims they are an 8-year-old too: "I am in grade 3 just like you! Add my private Snapchat!"',
        onScreenText: 'Stranger says: "I am 8 too! Move to Snapchat!"',
        voiceOverText: {
          en: "They claim to be your age and ask to switch from public game chat to private Snapchat.",
          si: "ඔවුන්ද ඔබේ වයසේම බව පවසා වෙනත් රහස් ඇප් එකකට එන්නැයි කියයි.",
          ta: "அவர்களும் உங்கள் வயது என்று கூறி தனிப்பட்ட செயலிற்கு வர அழைக்கிறார்கள்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Switch to private app',
            iconName: 'Smartphone',
            type: 'unsafe',
            feedback: "Strangers can pretend to be kids. Never move to unmonitored private chats.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Ask them to prove their age',
            iconName: 'HelpCircle',
            type: 'trap',
            feedback: "Strangers can fake photos. Don't engage in age debates; simply keep it in public game chats.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Decline & keep chats in game',
            iconName: 'Gamepad',
            type: 'safe',
            feedback: "Smart! Only play within monitored game channels with friends you know in real life.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a8_l1_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'They send a download link: "Click this link to get free admin powers in the game."',
        onScreenText: 'They send a mystery link for game cheats.',
        voiceOverText: {
          en: "The stranger sends a link promising game cheats or free account upgrades.",
          si: "නොමිලේ ගිණුම් වැඩිදියුණු කිරීම් ලබා දෙන බවට සබැඳියක් එවයි.",
          ta: "இலவச விளையாட்டு சலுகைகளுக்கான இணைப்பை அனுப்புகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Click link immediately',
            iconName: 'ExternalLink',
            type: 'unsafe',
            feedback: "Links can steal passwords and compromise your device.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Forward to school friends',
            iconName: 'Share2',
            type: 'trap',
            feedback: "Spreading malicious links puts your friends at risk too.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Do not click & report message',
            iconName: 'ShieldAlert',
            type: 'safe',
            feedback: "Pro gamer move! Never click unknown links sent in DMs.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Show link to parent for review',
            iconName: 'UserCheck',
            type: 'safe',
            feedback: "Great habit! Checking suspicious links with parents keeps everyone safe.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age8_l2',
    levelNumber: 2,
    category: 'body_safety',
    ageTrack: 8,
    title: 'Inappropriate Images & Boundaries',
    categoryTitle: 'Body Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'ImageOff',
    summary: 'Recognizing inappropriate visual content and taking assertive action.',
    questions: [
      {
        id: 'a8_l2_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'An inappropriate picture suddenly pops up in a group chat.',
        onScreenText: 'Someone posts an inappropriate picture. What now?',
        voiceOverText: {
          en: "An inappropriate image appears in a chat. What should you do with your screen?",
          si: "නුසුදුසු පින්තූරයක් තිරය මත දිස්වේ. ඔබ කුමක් කළ යුතුද?",
          ta: "பொருத்தமற்ற படம் திரையில் தோன்றுகிறது. என்ன செய்ய வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Turn screen off & tell adult',
            iconName: 'PowerOff',
            type: 'safe',
            feedback: "Perfect! Turn off the display and alert a trusted adult immediately.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Save picture & look closely',
            iconName: 'Download',
            type: 'unsafe',
            feedback: "Do not save or forward inappropriate pictures.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a8_l2_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'Someone shows you adult content on their phone and says: "Check this cool thing out."',
        onScreenText: 'Someone wants to show you adult content.',
        voiceOverText: {
          en: "Someone tries to show you adult pictures on their smartphone.",
          si: "යමෙකු වැඩිහිටි පින්තූර පෙන්වීමට උත්සාහ කරයි.",
          ta: "ஒருவர் உங்களுக்கு பொருத்தமற்ற படங்களை காட்ட முயற்சிக்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Look to not seem rude',
            iconName: 'Eye',
            type: 'trap',
            feedback: "You have every right to protect your eyes and mind. Don't worry about being 'polite'.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Say "That makes me uncomfortable" & leave',
            iconName: 'Footprints',
            type: 'safe',
            feedback: "Powerful and brave! Clear boundaries protect your well-being.",
            isCorrect: true
          },
          {
            id: 'opt3',
            label: 'Watch and keep secret',
            iconName: 'Lock',
            type: 'unsafe',
            feedback: "Never keep unsafe secrets that make you feel uneasy.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a8_l2_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'The person threatens that you will be punished if you tell anyone.',
        onScreenText: 'They say: "If you tell, you will be blamed!"',
        voiceOverText: {
          en: "They try to blame you, saying you will get in trouble for seeing the image.",
          si: "ඔබ එය දුටු නිසා ඔබට දඬුවම් ලැබෙනු ඇතැයි ඔවුන් පවසයි.",
          ta: "இதைப் பார்த்ததற்காக உங்கள் மீது பழி விழும் என்று கூறுகிறார்கள்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Hide in silence',
            iconName: 'VolumeX',
            type: 'unsafe',
            feedback: "You are never at fault for unwanted images shown by others.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Delete chat and never speak',
            iconName: 'Trash2',
            type: 'trap',
            feedback: "Don't bottle it up. Always talk to your guardian.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Remember: I am SAFE to tell parents',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "100% True! Parents are there to help protect you, not punish you.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Tell school teacher or nurse',
            iconName: 'UserCheck',
            type: 'safe',
            feedback: "Excellent! School staff are always ready to support you safely.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age8_l3',
    levelNumber: 3,
    category: 'secrets',
    ageTrack: 8,
    title: 'Gifts With Conditions',
    categoryTitle: 'Secrets & Boundaries',
    estimatedPlaytime: '2 mins',
    iconName: 'PackageCheck',
    summary: 'Recognizing conditional gifts and manipulative trade-offs.',
    questions: [
      {
        id: 'a8_l3_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'school',
        sceneDescription: 'A sports coach gives you expensive sneakers but says: "Do not show your mum."',
        onScreenText: 'Coach says: "Keep these shoes a secret from mum!"',
        voiceOverText: {
          en: "A coach gives you expensive sneakers and insists you don't tell your parents.",
          si: "පුහුණුකරු සපත්තු යුගලක් දී අම්මාට නොකියන ලෙස පවසයි.",
          ta: "பயிற்சியாளர் காலணிகள் தந்து அம்மாவிடம் சொல்லாதே என்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Unsafe secret gift',
            iconName: 'ShieldAlert',
            type: 'safe',
            feedback: "Spot on! Genuine coaches never ask children to hide gifts from parents.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Normal coaching gift',
            iconName: 'Gift',
            type: 'unsafe',
            feedback: "Gifts hidden from parents are a major safety red flag.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a8_l3_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'school',
        sceneDescription: 'They ask for extra private time in exchange for extra team playing time.',
        onScreenText: 'They trade playing time for private favors.',
        voiceOverText: {
          en: "An adult offers extra rewards or favors if you do secret favors for them.",
          si: "රහස් උදව් වෙනුවෙන් විශේෂ වරප්‍රසාද ලබා දෙන බව කියයි.",
          ta: "ரகசிய உதவிகளுக்கு பதிலாக சிறப்பு சலுகைகள் தருவதாக கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Agree to get ahead in team',
            iconName: 'Trophy',
            type: 'unsafe',
            feedback: "Never accept conditional boundary violations for sports or games.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Tell only team friends',
            iconName: 'Users',
            type: 'trap',
            feedback: "Teammates cannot stop an adult. You must tell your parents or school principal!",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Report to parents & school principal',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Champion move! Reporting safeguards you and all other kids on the team.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a8_l3_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'school',
        sceneDescription: 'They say: "You are my favorite. If you speak, I will lose my job and it is your fault."',
        onScreenText: 'They say: "If you tell, it is your fault I lose my job!"',
        voiceOverText: {
          en: "They try emotional manipulation, claiming you will be responsible if they get fired.",
          si: "ඔබ පැවසුවහොත් ඔවුන්ගේ රැකියාව නැතිවීමට ඔබ වගකිව යුතු බව පවසයි.",
          ta: "சொன்னால் தனது வேலை போய்விடும், அதற்கு நீங்களே காரணம் என்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Feel guilty and stay quiet',
            iconName: 'Lock',
            type: 'unsafe',
            feedback: "Adults are responsible for their own bad behavior, NEVER the child!",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Wait until season ends',
            iconName: 'Clock',
            type: 'trap',
            feedback: "Don't delay. Safety is always more important than a game season.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Stand firm: Adults own their actions',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Wise and powerful! You are not responsible for an adult's mistakes.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Confide in trusted guardian',
            iconName: 'HeartHandshake',
            type: 'safe',
            feedback: "Hero choice! Your parents will step in and protect you with pride.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age8_l4',
    levelNumber: 4,
    category: 'public_safety',
    ageTrack: 8,
    title: 'Public Transport & Transit Safety',
    categoryTitle: 'Public Places Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Bus',
    summary: 'Riding the school bus, transit stops, and finding station staff.',
    questions: [
      {
        id: 'a8_l4_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'bus',
        sceneDescription: 'At a bus stop, an unknown passenger sits uncomfortably close and asks intrusive questions.',
        onScreenText: 'Passenger sits too close and makes you uneasy.',
        voiceOverText: {
          en: "At the bus stop, someone sits too close and invades your personal space.",
          si: "බස් නැවතුමේදී අයෙක් ඉතා සමීපව හිඳ ඔබට අපහසුතාවක් ඇති කරයි.",
          ta: "பேருந்து நிறுத்தத்தில் ஒருவர் மிகவும் அருகில் அமர்ந்து அசௌகரியத்தை ஏற்படுத்துகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Move closer to bus driver / crowd',
            iconName: 'Users',
            type: 'safe',
            feedback: "Great thinking! Move immediately to a well-lit area near the driver or families.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Stay frozen and ignore it',
            iconName: 'VolumeX',
            type: 'unsafe',
            feedback: "Trust your gut instinct. If you feel uncomfortable, change seats immediately.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a8_l4_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'bus',
        sceneDescription: 'You missed your regular bus stop and don\'t recognize the neighborhood.',
        onScreenText: 'You missed your stop! What to do?',
        voiceOverText: {
          en: "You missed your stop on the bus. What should you do right away?",
          si: "ඔබට බස් නැවතුම මඟහැරුණි. ඔබ වහාම කුමක් කළ යුතුද?",
          ta: "பேருந்து நிறுத்தம் தவறிவிட்டது. என்ன செய்ய வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Jump off in empty dark road',
            iconName: 'Footprints',
            type: 'unsafe',
            feedback: "Never get off in an isolated or unknown dark area.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Walk with an unknown passenger',
            iconName: 'UserX',
            type: 'trap',
            feedback: "Don't follow other passengers. Talk directly to the driver.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Tell the Bus Driver immediately',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Perfect! Bus drivers have radio communication and can call dispatch/parents safely.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a8_l4_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'bus',
        sceneDescription: 'A stranger at the terminal offers a free car ride home: "I can drop you off faster."',
        onScreenText: 'Stranger at station offers a quick car ride.',
        voiceOverText: {
          en: "A stranger offers a quick ride in their car to save you transit time.",
          si: "දුම්රියපොළේදී ආගන්තුකයෙක් කාර් එකෙන් ගෙදර ගෙනියන්නම් කියයි.",
          ta: "நிலையத்தில் உள்ள ஒருவர் காரில் விரைவாக அழைத்துச் செல்வதாக கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Accept to get home fast',
            iconName: 'Car',
            type: 'unsafe',
            feedback: "Rule #1 of safety: NEVER get into a stranger's car.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Ask for their phone number first',
            iconName: 'Phone',
            type: 'trap',
            feedback: "Do not negotiate or take details from strangers.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Go to Station Master Information Desk',
            iconName: 'Building2',
            type: 'safe',
            feedback: "Safe and smart! Transit staff at the customer service desk are authorized helpers.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Call parents using emergency phone',
            iconName: 'PhoneCall',
            type: 'safe',
            feedback: "Brilliant! Call your parents so they know your exact location.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age8_l5',
    levelNumber: 5,
    category: 'digital_safety',
    ageTrack: 8,
    title: 'Video Calls & Location Tags',
    categoryTitle: 'Digital & Online Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'Video',
    summary: 'Protecting real-time video feeds, geotags, and live streams.',
    questions: [
      {
        id: 'a8_l5_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'A mobile app asking for "Always Allow Location" access while streaming.',
        onScreenText: 'App asks: "Share live GPS location with public?"',
        voiceOverText: {
          en: "A gaming or social app asks to broadcast your exact real-time GPS location.",
          si: "ඔබ සිටින ස්ථානය සජීවීව ප්‍රසිද්ධියේ බෙදාගැනීමට ඇප් එකක් අසයි.",
          ta: "உங்கள் நேரடி இருப்பிடத்தை பொதுவில் பகிரலாமா என்று செயலி கேட்கிறது."
        },
        options: [
          {
            id: 'opt1',
            label: 'Turn location OFF',
            iconName: 'MapPinOff',
            type: 'safe',
            feedback: "Spot on! Never broadcast your exact live home or school coordinates.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Turn location ON always',
            iconName: 'MapPin',
            type: 'unsafe',
            feedback: "Broadcasting your GPS lets strangers track your daily routine.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a8_l5_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'An online acquaintance requests a one-on-one video call in your bedroom.',
        onScreenText: 'Online contact requests private 1-on-1 video call.',
        voiceOverText: {
          en: "Someone you met online requests a private video call when you are alone in your room.",
          si: "කාමරයේ තනිව සිටින විට වීඩියෝ ඇමතුමක් ගන්නැයි ඔන්ලයින් කෙනෙක් ඉල්ලයි.",
          ta: "தனியாக இருக்கும் போது வீடியோ அழைப்பு செய்யும்படி கேட்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Start video call alone',
            iconName: 'Video',
            type: 'unsafe',
            feedback: "Never video call strangers in private rooms.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Cover camera with hand while talking',
            iconName: 'Hand',
            type: 'trap',
            feedback: "Better to decline completely unless parents have verified the contact.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Only video call with parent permission',
            iconName: 'CheckCircle2',
            type: 'safe',
            feedback: "Smart digital rule! Only video chat with trusted family and verified friends.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a8_l5_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'They ask you to do private dares or remove clothing on webcam.',
        onScreenText: 'They ask you to do private dares on webcam.',
        voiceOverText: {
          en: "They pressure you to perform private body dares or remove clothes on camera.",
          si: "වීඩියෝවෙන් ඇඳුම් ඉවත් කිරීමට හෝ නුසුදුසු දේ කිරීමට බල කරයි.",
          ta: "கேமராவில் உடைகளை கழற்றும்படி வற்புறுத்துகிறார்கள்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Do the dare to be popular',
            iconName: 'ThumbsUp',
            type: 'unsafe',
            feedback: "NEVER! Webcam blackmail starts with dares. Shut it down immediately.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Beg them not to record',
            iconName: 'HelpCircle',
            type: 'unsafe',
            feedback: "Don't beg. Take control by unplugging and reporting.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Disconnect camera & tell parents',
            iconName: 'VideoOff',
            type: 'safe',
            feedback: "Bravo! Cut the connection immediately and inform your parents.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Report to cyber safety hotline',
            iconName: 'ShieldAlert',
            type: 'safe',
            feedback: "Outstanding! Cyber safety hotlines protect children worldwide.",
            isCorrect: true
          }
        ]
      }
    ]
  },

  // ==========================================
  // AGE 9 TRACK
  // ==========================================
  {
    id: 'age9_l1',
    levelNumber: 1,
    category: 'stranger',
    ageTrack: 9,
    title: 'Online Grooming: "Be My Secret Best Friend"',
    categoryTitle: 'Stranger Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'UserCheck',
    summary: 'Recognizing emotional bonding, flattery, and attempts to isolate you from parents.',
    questions: [
      {
        id: 'a9_l1_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'An online gamer showers you with praise: "You are so mature, your parents do not understand you like I do."',
        onScreenText: 'Gamer says: "Your parents don\'t understand you like I do!"',
        voiceOverText: {
          en: "An online user tries to turn you against your parents, claiming only they understand you.",
          si: "ඔබේ දෙමාපියන් ඔබව තේරුම් නොගන්නා බවත් තමා පමණක් තේරුම් ගන්නා බවත් ඔන්ලයින් කෙනෙක් කියයි.",
          ta: "உங்கள் பெற்றோர் உங்களை புரிந்து கொள்ளவில்லை, தான் மட்டுமே புரிந்து கொள்வதாக கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Classic grooming red flag',
            iconName: 'ShieldAlert',
            type: 'safe',
            feedback: "Insightful! Trying to isolate children from parents is a known grooming technique.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Just a really nice friend',
            iconName: 'Heart',
            type: 'unsafe',
            feedback: "Healthy adult friends never try to drive a wedge between you and your parents.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a9_l1_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'They ask to meet up in person at the local mall: "Come alone, don\'t bring anyone."',
        onScreenText: 'They ask to meet in real life secretly.',
        voiceOverText: {
          en: "They ask to meet in real life at a mall and insist you come alone without telling anyone.",
          si: "කිසිවෙකුට නොකියා තනිවම පැමිණ මුණගැසෙන ලෙස පවසයි.",
          ta: "யாரிடமும் சொல்லாமல் தனியாக வந்து சந்திக்குமாறு கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Go secretly to surprise them',
            iconName: 'Footprints',
            type: 'unsafe',
            feedback: "Extremely dangerous! NEVER meet an online person in secret.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Take only a younger sibling',
            iconName: 'Users',
            type: 'trap',
            feedback: "Young siblings cannot protect you. This puts both of you in danger.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Refuse & show messages to parents',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Spot on! Any real-life meetup must be fully approved and accompanied by parents.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a9_l1_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'They get angry when you mention your parents: "If you tell them, our special bond is ruined forever!"',
        onScreenText: 'They threaten to end friendship if you tell parents.',
        voiceOverText: {
          en: "They use anger and guilt, threatening to destroy your friendship if you inform your guardian.",
          si: "දෙමාපියන්ට කීවොත් මිත්‍රත්වය අවසන් කරන බවට තර්ජනය කරයි.",
          ta: "பெற்றோரிடம் சொன்னால் நட்பை முறித்துக்கொள்வதாக மிரட்டுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Apologize and keep secret',
            iconName: 'Lock',
            type: 'unsafe',
            feedback: "Never sacrifice your safety for manipulative fake friendships.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Lie to your parents',
            iconName: 'Smile',
            type: 'unsafe',
            feedback: "Lying to parents leaves you vulnerable to predators.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Recognize manipulation & Block',
            iconName: 'UserX',
            type: 'safe',
            feedback: "Brilliant maturity! True friends respect your safety boundaries.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Show chat history to trusted adult',
            iconName: 'MessageSquareCheck',
            type: 'safe',
            feedback: "Hero move! Your parents and police can investigate and protect other children too.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age9_l2',
    levelNumber: 2,
    category: 'body_safety',
    ageTrack: 9,
    title: 'Coercion & Emotional Manipulation',
    categoryTitle: 'Body Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'ShieldAlert',
    summary: 'Standing firm against peer pressure, dares, and subtle boundary erosion.',
    questions: [
      {
        id: 'a9_l2_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'school',
        sceneDescription: 'Older kids at school dare you to touch someone inappropriately as a "prank".',
        onScreenText: 'Kids dare you to do an inappropriate touch prank.',
        voiceOverText: {
          en: "Older students dare you to touch someone inappropriately for a TikTok prank.",
          si: "විහිළුවක් ලෙස නුසුදුසු ස්පර්ශයක් කරන ලෙස ළමුන් පිරිසක් බල කරයි.",
          ta: "விளையாட்டாக ஒருவரை தவறாக தொடுமாறு மற்றவர்கள் தூண்டுகிறார்கள்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Say NO, bodily autonomy is sacred',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Excellent! Pranks that violate bodily boundaries are never funny or acceptable.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Do it so they don\'t call you chicken',
            iconName: 'Frown',
            type: 'unsafe',
            feedback: "Never violate boundaries to impress others.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a9_l2_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'An adult relative keeps making inappropriate jokes about your changing body.',
        onScreenText: 'Relative makes inappropriate body comments.',
        voiceOverText: {
          en: "A relative repeatedly makes comments about your body that make you feel uncomfortable.",
          si: "ඥාතියෙක් ඔබේ ශරීරය පිළිබඳ නුසුදුසු ප්‍රකාශ නිතර සිදු කරයි.",
          ta: "உறவினர் ஒருவர் உங்கள் உடலைப் பற்றி சங்கடமான கருத்துக்களைக் கூறுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Laugh along to be polite',
            iconName: 'Smile',
            type: 'trap',
            feedback: "You have a right to your dignity. You don't have to tolerate uncomfortable comments.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Say: "Please stop, I don\'t like that"',
            iconName: 'MessageCircle',
            type: 'safe',
            feedback: "Powerful assertiveness! Stating your boundary clearly is healthy and respectful.",
            isCorrect: true
          },
          {
            id: 'opt3',
            label: 'Keep it bottled inside forever',
            iconName: 'VolumeX',
            type: 'unsafe',
            feedback: "Talk to your parents so they can advocate for you.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a9_l2_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'school',
        sceneDescription: 'Someone takes non-consensual photos of you in the locker room.',
        onScreenText: 'Someone takes locker room photos on phone.',
        voiceOverText: {
          en: "Someone takes unauthorized phone photos in a locker room or bathroom.",
          si: "ඇඳුම් මාරු කරන කාමරයකදී දුරකථනයෙන් ඡායාරූප ගැනීමට උත්සාහ කරයි.",
          ta: "உடை மாற்றும் அறையில் அனுமதியின்றி புகைப்படம் எடுக்கிறார்கள்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Ignore it and hope they delete it',
            iconName: 'Clock',
            type: 'unsafe',
            feedback: "Never ignore privacy breaches in private changing zones.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Fight them physically for phone',
            iconName: 'Zap',
            type: 'trap',
            feedback: "Physical fights can cause injury. Get authority figures immediately.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Report to Principal & Teacher NOW',
            iconName: 'AlertTriangle',
            type: 'safe',
            feedback: "Immediate safety action! School leaders will confiscate and handle the situation.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Tell parents immediately upon pickup',
            iconName: 'HeartHandshake',
            type: 'safe',
            feedback: "Excellent! Your parents will ensure the school enforces strict privacy protections.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age9_l3',
    levelNumber: 3,
    category: 'secrets',
    ageTrack: 9,
    title: 'Bribery & Blackmail Pressure',
    categoryTitle: 'Secrets & Boundaries',
    estimatedPlaytime: '2 mins',
    iconName: 'LockKeyhole',
    summary: 'Breaking free from extortion, blackmail, and high-pressure secrets.',
    questions: [
      {
        id: 'a9_l3_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'school',
        sceneDescription: 'Someone says: "If you tell on me, I will tell everyone your private secrets."',
        onScreenText: 'They threaten: "If you speak, I will leak your secret!"',
        voiceOverText: {
          en: "Someone tries to blackmail you to keep quiet about their wrongdoing.",
          si: "ඔබ කීවොත් ඔබේ රහස් හෙළි කරන බවට බ්ලැක්මේල් කරයි.",
          ta: "சொன்னால் உங்கள் ரகசியங்களை சொல்லிவிடுவேன் என்று மிரட்டுகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Tell a trusted adult right away',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Bravo! Blackmail loses all its power the moment you bring in a trusted adult.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Obey their demands forever',
            iconName: 'Lock',
            type: 'unsafe',
            feedback: "Giving in to blackmail only makes the bully demand more.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a9_l3_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'An adult gives you high-value gifts and says: "This is our contract: never tell your mum."',
        onScreenText: 'Adult calls secrecy a "contract between us".',
        voiceOverText: {
          en: "An adult tries to create a 'secret contract' with money or gifts.",
          si: "මුදල් හෝ තෑගි දී 'රහස් ගිවිසුමක්' ඇති කර ගැනීමට උත්සාහ කරයි.",
          ta: "பணம் தந்து 'ரகசிய ஒப்பந்தம்' செய்ய முயற்சிக்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Honor the secret contract',
            iconName: 'FileCheck',
            type: 'unsafe',
            feedback: "Secret contracts with adults are invalid and manipulative.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Keep half the secret',
            iconName: 'HelpCircle',
            type: 'trap',
            feedback: "Partial secrets still leave you vulnerable. Be 100% honest with parents.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Disclose everything to parents',
            iconName: 'Shield',
            type: 'safe',
            feedback: "Complete clarity! Open communication with your guardian is unbreakable armor.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a9_l3_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'home',
        sceneDescription: 'You accidentally made a mistake and they threaten to tell your parents unless you obey.',
        onScreenText: 'They use your honest mistake against you.',
        voiceOverText: {
          en: "They try to weaponize an honest mistake you made to force your silence.",
          si: "ඔබ අතින් වූ වරදක් පෙන්වා ඔබව නිහඬ කිරීමට උත්සාහ කරයි.",
          ta: "உங்கள் தவறை பயன்படுத்தி உங்களை மிரட்டுகிறார்கள்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Give up and do what they say',
            iconName: 'Frown',
            type: 'unsafe',
            feedback: "Never do unsafe things out of fear of getting into trouble.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Run away from home',
            iconName: 'Footprints',
            type: 'unsafe',
            feedback: "Running away puts you in severe danger. Always stay home where you are loved.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Confess mistake to parents yourself',
            iconName: 'HeartHandshake',
            type: 'safe',
            feedback: "Supreme courage! Owning your mistake to your parents destroys the blackmailer's power.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Seek guidance from school counselor',
            iconName: 'GraduationCap',
            type: 'safe',
            feedback: "Excellent! Counselors will help you navigate and resolve the situation calmly.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age9_l4',
    levelNumber: 4,
    category: 'public_safety',
    ageTrack: 9,
    title: 'Travelling Alone & Independent Safety',
    categoryTitle: 'Public Places Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'MapPin',
    summary: 'Walking to school, using the buddy system, and handling suspicious followers.',
    questions: [
      {
        id: 'a9_l4_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'street',
        sceneDescription: 'You are walking home from practice and notice a car following your walking pace.',
        onScreenText: 'A car is slowly following your pace. What to do?',
        voiceOverText: {
          en: "You notice a car crawling slowly behind you matching your walking pace.",
          si: "මෝටර් රථයක් ඔබ යන වේගයටම පිටුපසින් පැමිණෙන බව ඔබට පෙනේ.",
          ta: "ஒரு கார் உங்கள் வேகத்திலேயே பின்னால் வருவதை கவனிக்கிறீர்கள்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Turn around & cross to open shop',
            iconName: 'Store',
            type: 'safe',
            feedback: "Master tactic! Changing direction towards crowded public shops breaks their route.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Walk into quiet dead-end street',
            iconName: 'CornerDownRight',
            type: 'unsafe',
            feedback: "Never walk into dead ends or empty alleyways when followed.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a9_l4_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'street',
        sceneDescription: 'A person gets out of the car and walks quickly towards you.',
        onScreenText: 'Person gets out and heads towards you.',
        voiceOverText: {
          en: "A stranger gets out of the vehicle and walks directly towards you in an aggressive manner.",
          si: "ආගන්තුකයෙක් වාහනයෙන් බැස ඔබ දෙසට පැමිණෙයි.",
          ta: "வாகனத்தில் இருந்து இறங்கி ஒருவர் உங்களை நோக்கி வேகமாக வருகிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Freeze in fear',
            iconName: 'VolumeX',
            type: 'unsafe',
            feedback: "Do not freeze! Run immediately to safety.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Try to talk them down',
            iconName: 'MessageCircle',
            type: 'trap',
            feedback: "Do not negotiate with aggressive pursuers. Distance is safety.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Yell "HELP! Stranger!" & run to crowd',
            iconName: 'Megaphone',
            type: 'safe',
            feedback: "LOUD AND PROUD! Shouting clearly draws immediate attention from everyone around.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a9_l4_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'street',
        sceneDescription: 'You reach an open cafe or pharmacy.',
        onScreenText: 'You reach an open business. What is the protocol?',
        voiceOverText: {
          en: "You reach an open pharmacy. What should you immediately tell the staff?",
          si: "ඔබ ඖෂධසැලකට පැමිණියේය. කාර්යමණ්ඩලයට කුමක් කිව යුතුද?",
          ta: "மருந்தகத்தை அடைந்தவுடன் ஊழியரிடம் என்ன கூற வேண்டும்?"
        },
        options: [
          {
            id: 'opt1',
            label: 'Pretend you are just browsing',
            iconName: 'Search',
            type: 'trap',
            feedback: "Don't pretend! Tell the staff clearly so they can protect you and lock the door.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Leave after 10 seconds',
            iconName: 'DoorOpen',
            type: 'unsafe',
            feedback: "Stay inside until your parents or police arrive.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Inform manager: "Someone followed me"',
            iconName: 'ShieldCheck',
            type: 'safe',
            feedback: "Exemplary protocol! The staff will keep you safe inside and call authorities.",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Call parents with store landline',
            iconName: 'PhoneCall',
            type: 'safe',
            feedback: "Perfect! Parents will immediately come to pick you up safely.",
            isCorrect: true
          }
        ]
      }
    ]
  },
  {
    id: 'age9_l5',
    levelNumber: 5,
    category: 'digital_safety',
    ageTrack: 9,
    title: 'Advanced Grooming & Account Security',
    categoryTitle: 'Digital & Online Safety',
    estimatedPlaytime: '2 mins',
    iconName: 'ShieldAlert',
    summary: 'Spotting phishing traps, password sharing coercion, and digital identity hygiene.',
    questions: [
      {
        id: 'a9_l5_q1',
        stepNumber: 1,
        optionCount: 2,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'A gaming buddy asks for your account password to "boost your ranking".',
        onScreenText: 'Gamer friend asks for your account password.',
        voiceOverText: {
          en: "A top-ranked player offers to level up your account if you give them your login password.",
          si: "ඔබේ ක්‍රීඩා ගිණුම ඉහළ දැමීමට මුරපදය ඉල්ලයි.",
          ta: "உங்கள் கேம் கணக்கை மேம்படுத்த கடவுச்சொல்லை கேட்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'NEVER share passwords with anyone',
            iconName: 'KeyRound',
            type: 'safe',
            feedback: "Gold standard rule! Passwords are only shared with your parents, never online friends.",
            isCorrect: true
          },
          {
            id: 'opt2',
            label: 'Share just for 1 hour',
            iconName: 'Clock',
            type: 'unsafe',
            feedback: "Even 5 minutes is enough to lock you out of your account and steal your data.",
            isCorrect: false
          }
        ]
      },
      {
        id: 'a9_l5_q2',
        stepNumber: 2,
        optionCount: 3,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'You receive an urgent email claiming your account will be deleted in 10 minutes unless you click.',
        onScreenText: 'Urgent email: "Account deleted in 10 mins! Click!"',
        voiceOverText: {
          en: "A panic-inducing email threatens immediate account termination unless you click their link.",
          si: "විනාඩි 10 කින් ගිණුම මකාදමන බවට හදිසි පණිවිඩයක් එවයි.",
          ta: "கணக்கு நீக்கப்படும் என்று அவசர மின்னஞ்சல் வருகிறது."
        },
        options: [
          {
            id: 'opt1',
            label: 'Click in panic',
            iconName: 'MousePointerClick',
            type: 'unsafe',
            feedback: "Fake urgency is the #1 psychological trick used by cyber scammers.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Reply with your personal details',
            iconName: 'Send',
            type: 'unsafe',
            feedback: "Never reply to unverified threat emails.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Inspect sender address & verify with parent',
            iconName: 'SearchCheck',
            type: 'safe',
            feedback: "Cyber Defender genius! Checking official channels exposes phishing scams.",
            isCorrect: true
          }
        ]
      },
      {
        id: 'a9_l5_q3',
        stepNumber: 3,
        optionCount: 4,
        format: 'best_choice',
        sceneType: 'computer',
        sceneDescription: 'An online acquaintance starts asking intimate personal questions and requests deleting chat logs.',
        onScreenText: 'They ask personal questions & say: "Delete our chat history!"',
        voiceOverText: {
          en: "They ask increasingly private questions and tell you to delete chat logs so parents won't see.",
          si: "පුද්ගලික ප්‍රශ්න අසා දෙමාපියන්ට නොපෙනෙන සේ මැසේජ් ඩිලීට් කරන්නැයි කියයි.",
          ta: "தனிப்பட்ட கேள்விகளை கேட்டு, சாட் பதிவுகளை அழிக்கச் சொல்கிறார்."
        },
        options: [
          {
            id: 'opt1',
            label: 'Delete chat logs as told',
            iconName: 'Trash2',
            type: 'unsafe',
            feedback: "Deleting logs destroys evidence that can protect you and other kids.",
            isCorrect: false
          },
          {
            id: 'opt2',
            label: 'Pretend you deleted it',
            iconName: 'HelpCircle',
            type: 'trap',
            feedback: "Continuing to engage in secret conversations is unsafe. Break contact.",
            isCorrect: false
          },
          {
            id: 'opt3',
            label: 'Save evidence, Block & Report',
            iconName: 'ShieldAlert',
            type: 'safe',
            feedback: "Master Safety Hero! Keeping evidence and reporting stops digital predators in their tracks!",
            isCorrect: true
          },
          {
            id: 'opt4',
            label: 'Bring device immediately to parent',
            iconName: 'HeartHandshake',
            type: 'safe',
            feedback: "Absolute best response! Your parents have your back unconditionally.",
            isCorrect: true
          }
        ]
      }
    ]
  }
];

export const LEVELS_DATA: LevelData[] = RAW_LEVELS_DATA.map((lvl) => {
  const trans = SINHALA_CURRICULUM_TRANSLATIONS[lvl.id];
  if (!trans) return lvl;

  return {
    ...lvl,
    titleSi: trans.titleSi || lvl.title,
    categoryTitleSi: trans.categoryTitleSi || lvl.categoryTitle,
    summarySi: trans.summarySi || lvl.summary,
    questions: lvl.questions.map((q, qIdx) => {
      const qTrans = trans.questions?.[qIdx];
      if (!qTrans) return q;

      return {
        ...q,
        onScreenTextSi: qTrans.onScreenTextSi || q.onScreenText,
        sceneDescriptionSi: qTrans.sceneDescriptionSi || q.sceneDescription,
        options: q.options.map((opt, optIdx) => {
          const optTrans = qTrans.options?.[optIdx];
          if (!optTrans) return opt;

          return {
            ...opt,
            labelSi: optTrans.labelSi || opt.label,
            feedbackSi: optTrans.feedbackSi || opt.feedback
          };
        })
      };
    })
  };
});

export const AVATAR_CHARACTERS = [
  {
    id: 'kai',
    name: 'Kai',
    ageGroup: '7-9',
    description: 'Friendly, observant, wears a teal hoodie',
    color: 'teal',
    bgBadge: 'bg-teal-100 text-teal-800 border-teal-300',
    avatarImg: 'Kai'
  },
  {
    id: 'mira',
    name: 'Mira',
    ageGroup: '6-8',
    description: 'Curious & clever, wears purple shirt & denim overalls with purple glasses',
    color: 'purple',
    bgBadge: 'bg-purple-100 text-purple-800 border-purple-300',
    avatarImg: 'Mira'
  },
  {
    id: 'leo',
    name: 'Leo',
    ageGroup: '6-8',
    description: 'Adventurous, wears lion t-shirt & green cargo shorts',
    color: 'amber',
    bgBadge: 'bg-amber-100 text-amber-800 border-amber-300',
    avatarImg: 'Leo'
  },
  {
    id: 'zara',
    name: 'Zara',
    ageGroup: '7-9',
    description: 'Confident & brave, wears floral pink dress & double buns',
    color: 'pink',
    bgBadge: 'bg-pink-100 text-pink-800 border-pink-300',
    avatarImg: 'Zara'
  }
];

export const GUARDIAN_ROLES = [
  { role: 'Mum', icon: 'Heart', quote: "I'm always here to listen and keep you safe!" },
  { role: 'Dad', icon: 'Shield', quote: "You can tell me anything, anytime, without fear." },
  { role: 'Grandma', icon: 'Smile', quote: "My sweet hero, your safety is my biggest joy." },
  { role: 'Teacher', icon: 'BookOpen', quote: "We learn together and look out for each other." },
  { role: 'Coach', icon: 'Award', quote: "Team safety first! Stand strong and speak up." }
];

export const THEME_PREFERENCES = [
  { id: 'park', name: 'Sunny Playground', bgClass: 'from-emerald-500/10 via-amber-100/20 to-sky-100', accent: 'emerald', icon: 'Sun' },
  { id: 'home', name: 'Cozy Home', bgClass: 'from-orange-500/10 via-amber-100/20 to-rose-100', accent: 'orange', icon: 'Home' },
  { id: 'school', name: 'School Academy', bgClass: 'from-blue-500/10 via-indigo-100/20 to-sky-100', accent: 'blue', icon: 'GraduationCap' },
  { id: 'cyber', name: 'Cyber Space Quest', bgClass: 'from-indigo-500/10 via-purple-100/20 to-fuchsia-100', accent: 'purple', icon: 'Laptop' },
  { id: 'forest', name: 'Adventure Camp', bgClass: 'from-green-500/10 via-emerald-100/20 to-lime-100', accent: 'green', icon: 'Trees' }
];

export const INITIAL_USER_PROFILE = {
  childName: 'Alex',
  age: 7 as AgeTrack,
  avatarId: 'mira' as const,
  guardianName: 'Mum',
  guardianRole: 'Mum',
  familyPassword: 'StarTiger77',
  language: 'en' as const,
  themePreference: 'park' as const,
  soundEnabled: true,
  voiceEnabled: true
};
