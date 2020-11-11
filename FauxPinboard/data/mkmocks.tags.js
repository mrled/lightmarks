/* Make a list of mock tags
 *
 * The Pinboard API returns a JSON object where a tag is the key and the number of bookmarks tagged with it is the value.
 * I generated a list of 500 words like this:
 *    sort -R /usr/shrae/dict/words | head -n 500 > mkmocks.tags.js
 * Then I used vim macros to turn that into a nice JS array called mockTags.
 * I massaged some of the tags at the bottom
 * and added an empty tag at the top
 * to make sure my mock tags had all the special characters
 * and other characteristics that my own tags have.
 * (I didn't want to actually publish my own list of tags in this repo.)
 * From there, the code in this file turns it into a JSON string.
 * You can save that to a JSON file with something like
 *    node mkmocks.tags.js > mocks.tags.json
 */

const mockTags = [
  '',
  'ellipsoidal',
  'immiscibility',
  'northland',
  'skive',
  'tailward',
  'truthfulness',
  'laminarioid',
  'Pelasgi',
  'Crystolon',
  'preconsecration',
  'unappeasableness',
  'compactly',
  'blennorrhagic',
  'urbanize',
  'erotomaniac',
  'Autosyn',
  'paraph',
  'selvage',
  'innocence',
  'cometology',
  'pretenseful',
  'fastigated',
  'dromotropic',
  'bemaim',
  'dissert',
  'encystment',
  'trichloromethyl',
  'shakily',
  'unsalesmanlike',
  'anacidity',
  'optionally',
  'Coniogramme',
  'abuna',
  'nonpublic',
  'stain',
  'steever',
  'Joni',
  'appendicle',
  'Maorilander',
  'geoglyphic',
  'tahil',
  'suddenly',
  'hopvine',
  'pearmonger',
  'Medic',
  'nasoethmoidal',
  'Olea',
  'hypochnose',
  'slinger',
  'brickwork',
  'unroosting',
  'mall',
  'soli',
  'okthabah',
  'stero',
  'unprogressiveness',
  'jocu',
  'hideosity',
  'grape',
  'monosome',
  'defrost',
  'millionairism',
  'summercastle',
  'freeholder',
  'dearness',
  'sopranist',
  'loasaceous',
  'unperceptive',
  'cacographic',
  'boastless',
  'exequial',
  'untrotted',
  'Aurorian',
  'obomegoid',
  'donna',
  'Saho',
  'benchfellow',
  'fibrocalcareous',
  'canaille',
  'unwisdom',
  'kin',
  'upholsteress',
  'ventriculoscopy',
  'tremellineous',
  'pebble',
  'autophagy',
  'coltsfoot',
  'psychonomic',
  'dandyish',
  'overcharge',
  'crowbait',
  'peracid',
  'twinebush',
  'chytrid',
  'importer',
  'ungrouped',
  'gabi',
  'distaste',
  'pasigraphic',
  'phthisic',
  'overabstemiousness',
  'Sanguinaria',
  'ectomeric',
  'supervolute',
  'dreadable',
  'countableness',
  'panisc',
  'phenylation',
  'reviving',
  'featherhead',
  'Illaenus',
  'fuzzy',
  'fosterland',
  'coxcombess',
  'cothy',
  'withholdable',
  'deerstalker',
  'demographically',
  'disallowableness',
  'insubmission',
  'refluctuation',
  'bahera',
  'pinene',
  'hepatotomy',
  'wha',
  'disarticulation',
  'potamology',
  'dickcissel',
  'Neisserieae',
  'elaidic',
  'sear',
  'shandrydan',
  'Tarzan',
  'villagism',
  'contumaciousness',
  'Indigenismo',
  'nonequilibrium',
  'fum',
  'photophysicist',
  'nonrustable',
  'restrictedness',
  'hyperequatorial',
  'dethyroidism',
  'gypsywise',
  'blocklayer',
  'interspatial',
  'ludicroserious',
  'paragogize',
  'unturreted',
  'argentometric',
  'pook',
  'duplicident',
  'atmogenic',
  'hygrology',
  'misunderstandingly',
  'portiered',
  'subrelation',
  'scenite',
  'unioniform',
  'antipatharian',
  'rhabditiform',
  'monotropaceous',
  'carvacrol',
  'splanchnotomy',
  'norwester',
  'pacer',
  'oversteady',
  'unmodifiedness',
  'cholecystonephrostomy',
  'macrosporange',
  'epidermoid',
  'semigranulate',
  'sanctimonial',
  'nibbler',
  'bregma',
  'cottier',
  'antiphonally',
  'jerboa',
  'stealth',
  'granulitis',
  'pamper',
  'electrohydraulic',
  'plicated',
  'doctorhood',
  'remap',
  'buoyant',
  'Sicani',
  'botanical',
  'tonguer',
  'trews',
  'apostasy',
  'heautomorphism',
  'unmeaningly',
  'sizy',
  'Cryptozonia',
  'tesserarian',
  'vegetivorous',
  'caduciary',
  'unpureness',
  'wolfward',
  'hyperproduction',
  'eliquate',
  'lipocere',
  'Adonian',
  'unignominious',
  'sulfohydrate',
  'hydropath',
  'correlative',
  'barmbrack',
  'Varanus',
  'cinct',
  'Vishnu',
  'Pristipomidae',
  'drillmaster',
  'stealability',
  'proctorling',
  'paroemia',
  'overbitten',
  'confirmation',
  'unfordable',
  'pate',
  'unstintedly',
  'prepubis',
  'acerate',
  'glucosid',
  'permillage',
  'ulnare',
  'triregnum',
  'shipway',
  'implacentate',
  'bastioned',
  'amercement',
  'cystomyoma',
  'thrack',
  'misdecision',
  'transferably',
  'yellowy',
  'uniped',
  'ungalvanized',
  'shimper',
  'bandelet',
  'protutor',
  'dronish',
  'Aetosaurus',
  'kinetogenic',
  'snapwort',
  'telecode',
  'glaked',
  'bardash',
  'antefix',
  'bouto',
  'liparian',
  'babbler',
  'inamissible',
  'homoeochromatic',
  'Coccidiomorpha',
  'exteriorate',
  'Cephalanthus',
  'conceal',
  'hydrometeorology',
  'chambering',
  'psychorhythmical',
  'perjuredly',
  'psychologian',
  'qualifiedly',
  'boller',
  'macaroni',
  'praiseful',
  'Barcan',
  'mootworthy',
  'timelessly',
  'unmeditative',
  'Lepidodendron',
  'slightness',
  'persecutress',
  'whipship',
  'phrasal',
  'spermoblastic',
  'prepared',
  'saprogenic',
  'unhealably',
  'unsatisfied',
  'addlepated',
  'automat',
  'unshakably',
  'nonamotion',
  'valanced',
  'unexternality',
  'Gaviae',
  'comedienne',
  'disoccupy',
  'subheadwaiter',
  'hatlessness',
  'underage',
  'circumorbital',
  'presuffer',
  'curatage',
  'bandi',
  'inflammably',
  'piproid',
  'rodlike',
  'hypersplenism',
  'August',
  'katalyst',
  'subchief',
  'superjacent',
  'aplomb',
  'agrarian',
  'promythic',
  'Pygopodes',
  'bestraw',
  'laryngotomy',
  'counterflight',
  'barbone',
  'concretive',
  'preprovide',
  'tercelet',
  'heliostat',
  'Ubbenite',
  'aspen',
  'bromoaurate',
  'semeiology',
  'propulsor',
  'cytoclastic',
  'dewless',
  'Niobid',
  'dermahemia',
  'Akrabattine',
  'maidservant',
  'Troiades',
  'segregative',
  'signify',
  'discompose',
  'delay',
  'dermatagra',
  'toluate',
  'gasometry',
  'burroweed',
  'maze',
  'colorate',
  'enterogenous',
  'lacinulate',
  'nonregardance',
  'timberling',
  'authorling',
  'ovariocyesis',
  'finable',
  'Sanskritic',
  'noninfraction',
  'conturbation',
  'yodeler',
  'cardlike',
  'ignorantly',
  'nonretractation',
  'brandisite',
  'shapesmith',
  'impolite',
  'duvet',
  'aecidioform',
  'antimetathetic',
  'zooscopic',
  'admarginate',
  'fingerroot',
  'etiological',
  'cliquishly',
  'swatch',
  'yercum',
  'swelter',
  'standpatism',
  'unstooping',
  'Hagenia',
  'stimulant',
  'hemisect',
  'arthropodal',
  'hemadrometer',
  'ascensional',
  'menagerie',
  'shamateur',
  'scolopendrine',
  'hypoisotonic',
  'Casziel',
  'muta',
  'railwaydom',
  'periodontium',
  'undershapen',
  'camion',
  'unlogicalness',
  'myxadenoma',
  'unanswerable',
  'gastroenterocolitis',
  'nonaerating',
  'caffoline',
  'chytridiaceous',
  'swabber',
  'receptoral',
  'unwhelped',
  'historiographer',
  'Schnabelkanne',
  'coggle',
  'splenodynia',
  'rumbullion',
  'tipful',
  'skaitbird',
  'transference',
  'hemisphered',
  'wasted',
  'forkbeard',
  'staverwort',
  'adigranth',
  'scleromeninx',
  'bishopless',
  'blent',
  'overtruthfully',
  'sigher',
  'poimenics',
  'nonintuitive',
  'lupicide',
  'chirotherian',
  'petition',
  'stycerin',
  'eruditely',
  'foreshower',
  'incombustibly',
  'betowered',
  'handwrite',
  'ablastous',
  'neglective',
  'neuromerism',
  'debouch',
  'weeble',
  'cliche',
  'paperful',
  'immeasurability',
  'scraffle',
  'matax',
  'escritoire',
  'brombenzyl',
  'cowskin',
  'micropaleontology',
  'customable',
  'galvanothermy',
  'spiderling',
  'bathymetry',
  'picayunish',
  'haunching',
  'sigger',
  'Sham',
  'ungreased',
  'approvable',
  'retrobronchial',
  'swashbuckling',
  'kolkhoz',
  'telacoustic',
  'darting',
  'pewmate',
  'adhesively',
  'planching',
  'misandry',
  'gleamily',
  'comanic',
  'washrag',
  'versal',
  'escapage',
  'translade',
  'realienate',
  'arbitrager',
  'cuckoldom',
  'be_witch_ed_ness',
  'syne',
  'bull:hide',
  'mock:bird',
  'Raphaelism',
  'Kamares',
  'agistor',
  'sys/tilius',
  'fron/digerous',
  'piss',
  'gibel',
  'Diviner',
  'UnArticulate',
  'Ruralist',
  'BloodLetting',
  'Hurdies',
  'Ijore',
  'Puerer',
  'truth-like',
  'trans-muting',
  'mag-neton',
  'over_expenditure',
  'inhiate',
  'un_pounced',
  'fatuity',
  'curiate',
  'city.dom',
  'absolut.ist',
  '__oleosaccharum',
  'dis/appreciate',
  'pin/fall',
  'prostem:mate',
  'non:equivalent',
];

let mockTagsWithCount = {};
let countForThisIndex = 1;
const incrementAtIndex = [
  150,
  200,
  250,
  275,
  300,
  325,
  350,
  370,
  390,
  400,
  410,
  420,
  430,
  440,
  450,
];
mockTags.forEach((tag, idx) => {
  if (incrementAtIndex.indexOf(idx) > -1) {
    // Increment at the exact indexes prescribed above
    countForThisIndex += 1;
  } else if (idx > incrementAtIndex[incrementAtIndex.length - 1]) {
    // Increment for every index higher than the last element in the list above
    countForThisIndex += 1;
  }

  // Mock that a bunch of bookmarks have no tag at all
  const thisCount = tag === '' ? 1000 : countForThisIndex;

  mockTagsWithCount[tag] = thisCount;
});

console.log(JSON.stringify(mockTagsWithCount, null, 2));