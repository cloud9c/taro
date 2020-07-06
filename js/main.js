import * as THREE from 'https://threejs.org/build/three.module.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import {Entity, Component, System} from './ECS.js'
// import * as GAMEOBJECT from './GameObject.js'

let scene, renderer, camera;
let lastTimestamp = 0, dt;
// const gameObjects = {};
let config;
let peer, connections = [], serverID, peerID, hosting, nickname;
const assets = {};

const wordList = ['ability', 'able', 'aboard', 'about', 'above', 'accept', 'accident', 'according', 'account', 'accurate', 'acres', 'across', 'act', 'action', 'active', 'activity', 'actual', 'actually', 'add', 'addition', 'additional', 'adjective', 'adult', 'adventure', 'advice', 'affect', 'afraid', 'after', 'afternoon', 'again', 'against', 'age', 'ago', 'agree', 'ahead', 'aid', 'air', 'airplane', 'alike', 'alive', 'all', 'allow', 'almost', 'alone', 'along', 'aloud', 'alphabet', 'already', 'also', 'although', 'am', 'among', 'amount', 'ancient', 'angle', 'angry', 'animal', 'announced', 'another', 'answer', 'ants', 'any', 'anybody', 'anyone', 'anything', 'anyway', 'anywhere', 'apart', 'apartment', 'appearance', 'apple', 'applied', 'appropriate', 'are', 'area', 'arm', 'army', 'around', 'arrange', 'arrangement', 'arrive', 'arrow', 'art', 'article', 'as', 'aside', 'ask', 'asleep', 'at', 'ate', 'atmosphere', 'atom', 'atomic', 'attached', 'attack', 'attempt', 'attention', 'audience', 'author', 'automobile', 'available', 'average', 'avoid', 'aware', 'away', 'baby', 'back', 'bad', 'badly', 'bag', 'balance', 'ball', 'balloon', 'band', 'bank', 'bar', 'bare', 'bark', 'barn', 'base', 'baseball', 'basic', 'basis', 'basket', 'bat', 'battle', 'be', 'bean', 'bear', 'beat', 'beautiful', 'beauty', 'became', 'because', 'become', 'becoming', 'bee', 'been', 'before', 'began', 'beginning', 'begun', 'behavior', 'behind', 'being', 'believed', 'bell', 'belong', 'below', 'belt', 'bend', 'beneath', 'bent', 'beside', 'best', 'bet', 'better', 'between', 'beyond', 'bicycle', 'bigger', 'biggest', 'bill', 'birds', 'birth', 'birthday', 'bit', 'bite', 'black', 'blank', 'blanket', 'blew', 'blind', 'block', 'blood', 'blow', 'blue', 'board', 'boat', 'body', 'bone', 'book', 'border', 'born', 'both', 'bottle', 'bottom', 'bound', 'bow', 'bowl', 'box', 'boy', 'brain', 'branch', 'brass', 'brave', 'bread', 'break', 'breakfast', 'breath', 'breathe', 'breathing', 'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'broad', 'broke', 'broken', 'brother', 'brought', 'brown', 'brush', 'buffalo', 'build', 'building', 'built', 'buried', 'burn', 'burst', 'bus', 'bush', 'business', 'busy', 'but', 'butter', 'buy', 'by', 'cabin', 'cage', 'cake', 'call', 'calm', 'came', 'camera', 'camp', 'can', 'canal', 'cannot', 'cap', 'capital', 'captain', 'captured', 'car', 'carbon', 'card', 'care', 'careful', 'carefully', 'carried', 'carry', 'case', 'cast', 'castle', 'cat', 'catch', 'cattle', 'caught', 'cause', 'cave', 'cell', 'cent', 'center', 'central', 'century', 'certain', 'certainly', 'chain', 'chair', 'chamber', 'chance', 'change', 'changing', 'chapter', 'character', 'characteristic', 'charge', 'chart', 'check', 'cheese', 'chemical', 'chest', 'chicken', 'chief', 'child', 'children', 'choice', 'choose', 'chose', 'chosen', 'church', 'circle', 'circus', 'citizen', 'city', 'class', 'classroom', 'claws', 'clay', 'clean', 'clear', 'clearly', 'climate', 'climb', 'clock', 'close', 'closely', 'closer', 'cloth', 'clothes', 'clothing', 'cloud', 'club', 'coach', 'coal', 'coast', 'coat', 'coffee', 'cold', 'collect', 'college', 'colony', 'color', 'column', 'combination', 'combine', 'come', 'comfortable', 'coming', 'command', 'common', 'community', 'company', 'compare', 'compass', 'complete', 'completely', 'complex', 'composed', 'composition', 'compound', 'concerned', 'condition', 'congress', 'connected', 'consider', 'consist', 'consonant', 'constantly', 'construction', 'contain', 'continent', 'continued', 'contrast', 'control', 'conversation', 'cook', 'cookies', 'cool', 'copper', 'copy', 'corn', 'corner', 'correct', 'correctly', 'cost', 'cotton', 'could', 'count', 'country', 'couple', 'courage', 'course', 'court', 'cover', 'cow', 'cowboy', 'crack', 'cream', 'create', 'creature', 'crew', 'crop', 'cross', 'crowd', 'cry', 'cup', 'curious', 'current', 'curve', 'customs', 'cut', 'cutting', 'daily', 'damage', 'dance', 'danger', 'dangerous', 'dark', 'darkness', 'date', 'daughter', 'dawn', 'day', 'dead', 'deal', 'dear', 'death', 'decide', 'declared', 'deep', 'deeply', 'deer', 'definition', 'degree', 'depend', 'depth', 'describe', 'desert', 'design', 'desk', 'detail', 'determine', 'develop', 'development', 'diagram', 'diameter', 'did', 'die', 'differ', 'difference', 'different', 'difficult', 'difficulty', 'dig', 'dinner', 'direct', 'direction', 'directly', 'dirt', 'dirty', 'disappear', 'discover', 'discovery', 'discuss', 'discussion', 'disease', 'dish', 'distance', 'distant', 'divide', 'division', 'do', 'doctor', 'does', 'dog', 'doing', 'doll', 'dollar', 'done', 'donkey', 'door', 'dot', 'double', 'doubt', 'down', 'dozen', 'draw', 'drawn', 'dream', 'dress', 'drew', 'dried', 'drink', 'drive', 'driven', 'driver', 'driving', 'drop', 'dropped', 'drove', 'dry', 'duck', 'due', 'dug', 'dull', 'during', 'dust', 'duty', 'each', 'eager', 'ear', 'earlier', 'early', 'earn', 'earth', 'easier', 'easily', 'east', 'easy', 'eat', 'eaten', 'edge', 'education', 'effect', 'effort', 'egg', 'eight', 'either', 'electric', 'electricity', 'element', 'elephant', 'eleven', 'else', 'empty', 'end', 'enemy', 'energy', 'engine', 'engineer', 'enjoy', 'enough', 'enter', 'entire', 'entirely', 'environment', 'equal', 'equally', 'equator', 'equipment', 'escape', 'especially', 'essential', 'establish', 'even', 'evening', 'event', 'eventually', 'ever', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'evidence', 'exact', 'exactly', 'examine', 'example', 'excellent', 'except', 'exchange', 'excited', 'excitement', 'exciting', 'exclaimed', 'exercise', 'exist', 'expect', 'experience', 'experiment', 'explain', 'explanation', 'explore', 'express', 'expression', 'extra', 'eye', 'face', 'facing', 'fact', 'factor', 'factory', 'failed', 'fair', 'fairly', 'fall', 'fallen', 'familiar', 'family', 'famous', 'far', 'farm', 'farmer', 'farther', 'fast', 'fastened', 'faster', 'fat', 'father', 'favorite', 'fear', 'feathers', 'feature', 'fed', 'feed', 'feel', 'feet', 'fell', 'fellow', 'felt', 'fence', 'few', 'fewer', 'field', 'fierce', 'fifteen', 'fifth', 'fifty', 'fight', 'fighting', 'figure', 'fill', 'film', 'final', 'finally', 'find', 'fine', 'finest', 'finger', 'finish', 'fire', 'fireplace', 'firm', 'first', 'fish', 'five', 'fix', 'flag', 'flame', 'flat', 'flew', 'flies', 'flight', 'floating', 'floor', 'flow', 'flower', 'fly', 'fog', 'folks', 'follow', 'food', 'foot', 'football', 'for', 'force', 'foreign', 'forest', 'forget', 'forgot', 'forgotten', 'form', 'former', 'fort', 'forth', 'forty', 'forward', 'fought', 'found', 'four', 'fourth', 'fox', 'frame', 'free', 'freedom', 'frequently', 'fresh', 'friend', 'friendly', 'frighten', 'frog', 'from', 'front', 'frozen', 'fruit', 'fuel', 'full', 'fully', 'fun', 'function', 'funny', 'fur', 'furniture', 'further', 'future', 'gain', 'game', 'garage', 'garden', 'gas', 'gasoline', 'gate', 'gather', 'gave', 'general', 'generally', 'gentle', 'gently', 'get', 'getting', 'giant', 'gift', 'girl', 'give', 'given', 'giving', 'glad', 'glass', 'globe', 'go', 'goes', 'gold', 'golden', 'gone', 'good', 'goose', 'got', 'government', 'grabbed', 'grade', 'gradually', 'grain', 'grandfather', 'grandmother', 'graph', 'grass', 'gravity', 'gray', 'great', 'greater', 'greatest', 'greatly', 'green', 'grew', 'ground', 'group', 'grow', 'grown', 'growth', 'guard', 'guess', 'guide', 'gulf', 'gun', 'habit', 'had', 'hair', 'half', 'halfway', 'hall', 'hand', 'handle', 'handsome', 'hang', 'happen', 'happened', 'happily', 'happy', 'harbor', 'hard', 'harder', 'hardly', 'has', 'hat', 'have', 'having', 'hay', 'he', 'headed', 'heading', 'health', 'heard', 'hearing', 'heart', 'heat', 'heavy', 'height', 'held', 'hello', 'help', 'helpful', 'her', 'herd', 'here', 'herself', 'hidden', 'hide', 'high', 'higher', 'highest', 'highway', 'hill', 'him', 'himself', 'his', 'history', 'hit', 'hold', 'hole', 'hollow', 'home', 'honor', 'hope', 'horn', 'horse', 'hospital', 'hot', 'hour', 'house', 'how', 'however', 'huge', 'human', 'hundred', 'hung', 'hungry', 'hunt', 'hunter', 'hurried', 'hurry', 'hurt', 'husband', 'ice', 'idea', 'identity', 'if', 'ill', 'image', 'imagine', 'immediately', 'importance', 'important', 'impossible', 'improve', 'in', 'inch', 'include', 'including', 'income', 'increase', 'indeed', 'independent', 'indicate', 'individual', 'industrial', 'industry', 'influence', 'information', 'inside', 'instance', 'instant', 'instead', 'instrument', 'interest', 'interior', 'into', 'introduced', 'invented', 'involved', 'iron', 'is', 'island', 'it', 'its', 'itself', 'jack', 'jar', 'jet', 'job', 'join', 'joined', 'journey', 'joy', 'judge', 'jump', 'jungle', 'just', 'keep', 'kept', 'key', 'kids', 'kill', 'kind', 'kitchen', 'knew', 'knife', 'know', 'knowledge', 'known', 'label', 'labor', 'lack', 'lady', 'laid', 'lake', 'lamp', 'land', 'language', 'large', 'larger', 'largest', 'last', 'late', 'later', 'laugh', 'law', 'lay', 'layers', 'lead', 'leader', 'leaf', 'learn', 'least', 'leather', 'leave', 'leaving', 'led', 'left', 'leg', 'length', 'lesson', 'let', 'letter', 'level', 'library', 'lie', 'life', 'lift', 'light', 'like', 'likely', 'limited', 'line', 'lion', 'lips', 'liquid', 'list', 'listen', 'little', 'live', 'living', 'load', 'local', 'locate', 'location', 'log', 'lonely', 'long', 'longer', 'look', 'loose', 'lose', 'loss', 'lost', 'lot', 'loud', 'love', 'lovely', 'low', 'lower', 'luck', 'lucky', 'lunch', 'lungs', 'lying', 'machine', 'machinery', 'mad', 'made', 'magic', 'magnet', 'mail', 'main', 'mainly', 'major', 'make', 'making', 'man', 'managed', 'manner', 'manufacturing', 'many', 'map', 'mark', 'market', 'married', 'mass', 'massage', 'master', 'material', 'mathematics', 'matter', 'may', 'maybe', 'me', 'meal', 'mean', 'means', 'meant', 'measure', 'meat', 'medicine', 'meet', 'melted', 'member', 'memory', 'men', 'mental', 'merely', 'met', 'metal', 'method', 'mice', 'middle', 'might', 'mighty', 'mile', 'military', 'milk', 'mill', 'mind', 'mine', 'minerals', 'minute', 'mirror', 'missing', 'mission', 'mistake', 'mix', 'mixture', 'model', 'modern', 'molecular', 'moment', 'money', 'monkey', 'month', 'mood', 'moon', 'more', 'morning', 'most', 'mostly', 'mother', 'motion', 'motor', 'mountain', 'mouse', 'mouth', 'move', 'movement', 'movie', 'moving', 'mud', 'muscle', 'music', 'musical', 'must', 'my', 'myself', 'mysterious', 'nails', 'name', 'nation', 'national', 'native', 'natural', 'naturally', 'nature', 'near', 'nearby', 'nearer', 'nearest', 'nearly', 'necessary', 'neck', 'needed', 'needle', 'needs', 'negative', 'neighbor', 'neighborhood', 'nervous', 'nest', 'never', 'new', 'news', 'newspaper', 'next', 'nice', 'night', 'nine', 'no', 'nobody', 'nodded', 'noise', 'none', 'noon', 'nor', 'north', 'nose', 'not', 'note', 'noted', 'nothing', 'notice', 'noun', 'now', 'number', 'numeral', 'nuts', 'object', 'observe', 'obtain', 'occasionally', 'occur', 'ocean', 'of', 'off', 'offer', 'office', 'officer', 'official', 'oil', 'old', 'older', 'oldest', 'on', 'once', 'one', 'only', 'onto', 'open', 'operation', 'opinion', 'opportunity', 'opposite', 'or', 'orange', 'orbit', 'order', 'ordinary', 'organization', 'organized', 'origin', 'original', 'other', 'ought', 'our', 'ourselves', 'out', 'outer', 'outline', 'outside', 'over', 'own', 'owner', 'oxygen', 'pack', 'package', 'page', 'paid', 'pain', 'paint', 'pair', 'palace', 'pale', 'pan', 'paper', 'paragraph', 'parallel', 'parent', 'park', 'part', 'particles', 'particular', 'particularly', 'partly', 'parts', 'party', 'pass', 'passage', 'past', 'path', 'pattern', 'pay', 'peace', 'pen', 'pencil', 'people', 'per', 'percent', 'perfect', 'perfectly', 'perhaps', 'period', 'person', 'personal', 'pet', 'phrase', 'physical', 'piano', 'pick', 'picture', 'pictured', 'pie', 'piece', 'pig', 'pile', 'pilot', 'pine', 'pink', 'pipe', 'pitch', 'place', 'plain', 'plan', 'plane', 'planet', 'planned', 'planning', 'plant', 'plastic', 'plate', 'plates', 'play', 'pleasant', 'please', 'pleasure', 'plenty', 'plural', 'plus', 'pocket', 'poem', 'poet', 'poetry', 'point', 'pole', 'police', 'policeman', 'political', 'pond', 'pony', 'pool', 'poor', 'popular', 'population', 'porch', 'port', 'position', 'positive', 'possible', 'possibly', 'post', 'pot', 'potatoes', 'pound', 'pour', 'powder', 'power', 'powerful', 'practical', 'practice', 'prepare', 'present', 'president', 'press', 'pressure', 'pretty', 'prevent', 'previous', 'price', 'pride', 'primitive', 'principal', 'principle', 'printed', 'private', 'prize', 'probably', 'problem', 'process', 'produce', 'product', 'production', 'program', 'progress', 'promised', 'proper', 'properly', 'property', 'protection', 'proud', 'prove', 'provide', 'public', 'pull', 'pupil', 'pure', 'purple', 'purpose', 'push', 'put', 'putting', 'quarter', 'queen', 'question', 'quick', 'quickly', 'quiet', 'quietly', 'quite', 'rabbit', 'race', 'radio', 'railroad', 'rain', 'raise', 'ran', 'ranch', 'range', 'rapidly', 'rate', 'rather', 'raw', 'rays', 'reach', 'read', 'reader', 'ready', 'real', 'realize', 'rear', 'reason', 'recall', 'receive', 'recent', 'recently', 'recognize', 'record', 'red', 'refer', 'refused', 'region', 'regular', 'related', 'relationship', 'religious', 'remain', 'remarkable', 'remember', 'remove', 'repeat', 'replace', 'replied', 'report', 'represent', 'require', 'research', 'respect', 'rest', 'result', 'return', 'review', 'rhyme', 'rhythm', 'rice', 'rich', 'ride', 'riding', 'right', 'ring', 'rise', 'rising', 'river', 'road', 'roar', 'rock', 'rocket', 'rocky', 'rod', 'roll', 'roof', 'room', 'root', 'rope', 'rose', 'rough', 'round', 'route', 'row', 'rubbed', 'rubber', 'rule', 'ruler', 'run', 'running', 'rush', 'sad', 'saddle', 'safe', 'safety', 'said', 'sail', 'sale', 'salmon', 'salt', 'same', 'sand', 'sang', 'sat', 'satellites', 'satisfied', 'save', 'saved', 'saw', 'say', 'scale', 'scared', 'scene', 'school', 'science', 'scientific', 'scientist', 'score', 'screen', 'sea', 'search', 'season', 'seat', 'second', 'secret', 'section', 'see', 'seed', 'seeing', 'seems', 'seen', 'seldom', 'select', 'selection', 'sell', 'send', 'sense', 'sent', 'sentence', 'separate', 'series', 'serious', 'serve', 'service', 'sets', 'setting', 'settle', 'settlers', 'seven', 'several', 'shade', 'shadow', 'shake', 'shaking', 'shall', 'shallow', 'shape', 'share', 'sharp', 'she', 'sheep', 'sheet', 'shelf', 'shells', 'shelter', 'shine', 'shinning', 'ship', 'shirt', 'shoe', 'shoot', 'shop', 'shore', 'short', 'shorter', 'shot', 'should', 'shoulder', 'shout', 'show', 'shown', 'shut', 'sick', 'sides', 'sight', 'sign', 'signal', 'silence', 'silent', 'silk', 'silly', 'silver', 'similar', 'simple', 'simplest', 'simply', 'since', 'sing', 'single', 'sink', 'sister', 'sit', 'sitting', 'situation', 'six', 'size', 'skill', 'skin', 'sky', 'slabs', 'slave', 'sleep', 'slept', 'slide', 'slight', 'slightly', 'slip', 'slipped', 'slope', 'slow', 'slowly', 'small', 'smaller', 'smallest', 'smell', 'smile', 'smoke', 'smooth', 'snake', 'snow', 'so', 'soap', 'social', 'society', 'soft', 'softly', 'soil', 'solar', 'sold', 'soldier', 'solid', 'solution', 'solve', 'some', 'somebody', 'somehow', 'someone', 'something', 'sometime', 'somewhere', 'son', 'song', 'soon', 'sort', 'sound', 'source', 'south', 'southern', 'space', 'speak', 'special', 'species', 'specific', 'speech', 'speed', 'spell', 'spend', 'spent', 'spider', 'spin', 'spirit', 'spite', 'split', 'spoken', 'sport', 'spread', 'spring', 'square', 'stage', 'stairs', 'stand', 'standard', 'star', 'stared', 'start', 'state', 'statement', 'station', 'stay', 'steady', 'steam', 'steel', 'steep', 'stems', 'step', 'stepped', 'stick', 'stiff', 'still', 'stock', 'stomach', 'stone', 'stood', 'stop', 'stopped', 'store', 'storm', 'story', 'stove', 'straight', 'strange', 'stranger', 'straw', 'stream', 'street', 'strength', 'stretch', 'strike', 'string', 'strip', 'strong', 'stronger', 'struck', 'structure', 'struggle', 'stuck', 'student', 'studied', 'studying', 'subject', 'substance', 'success', 'successful', 'such', 'sudden', 'suddenly', 'sugar', 'suggest', 'suit', 'sum', 'summer', 'sun', 'sunlight', 'supper', 'supply', 'support', 'suppose', 'sure', 'surface', 'surprise', 'surrounded', 'swam', 'sweet', 'swept', 'swim', 'swimming', 'swing', 'swung', 'syllable', 'symbol', 'system', 'table', 'tail', 'take', 'taken', 'tales', 'talk', 'tall', 'tank', 'tape', 'task', 'taste', 'taught', 'tax', 'tea', 'teach', 'teacher', 'team', 'tears', 'teeth', 'telephone', 'television', 'tell', 'temperature', 'ten', 'tent', 'term', 'terrible', 'test', 'than', 'thank', 'that', 'thee', 'them', 'themselves', 'then', 'theory', 'there', 'therefore', 'these', 'they', 'thick', 'thin', 'thing', 'think', 'third', 'thirty', 'this', 'those', 'thou', 'though', 'thought', 'thousand', 'thread', 'three', 'threw', 'throat', 'through', 'throughout', 'throw', 'thrown', 'thumb', 'thus', 'thy', 'tide', 'tie', 'tight', 'tightly', 'till', 'time', 'tin', 'tiny', 'tip', 'tired', 'title', 'to', 'tobacco', 'today', 'together', 'told', 'tomorrow', 'tone', 'tongue', 'tonight', 'too', 'took', 'tool', 'top', 'topic', 'torn', 'total', 'touch', 'toward', 'tower', 'town', 'toy', 'trace', 'track', 'trade', 'traffic', 'trail', 'train', 'transportation', 'trap', 'travel', 'treated', 'tree', 'triangle', 'tribe', 'trick', 'tried', 'trip', 'troops', 'tropical', 'trouble', 'truck', 'trunk', 'truth', 'try', 'tube', 'tune', 'turn', 'twelve', 'twenty', 'twice', 'two', 'type', 'typical', 'uncle', 'under', 'underline', 'understanding', 'unhappy', 'union', 'unit', 'universe', 'unknown', 'unless', 'until', 'unusual', 'up', 'upon', 'upper', 'upward', 'us', 'use', 'useful', 'using', 'usual', 'usually', 'valley', 'valuable', 'value', 'vapor', 'variety', 'various', 'vast', 'vegetable', 'verb', 'vertical', 'very', 'vessels', 'victory', 'view', 'village', 'visit', 'visitor', 'voice', 'volume', 'vote', 'vowel', 'voyage', 'wagon', 'wait', 'walk', 'wall', 'want', 'war', 'warm', 'warn', 'was', 'wash', 'waste', 'watch', 'water', 'wave', 'way', 'we', 'weak', 'wealth', 'wear', 'weather', 'week', 'weigh', 'weight', 'welcome', 'well', 'went', 'were', 'west', 'western', 'wet', 'whale', 'what', 'whatever', 'wheat', 'wheel', 'when', 'whenever', 'where', 'wherever', 'whether', 'which', 'while', 'whispered', 'whistle', 'white', 'who', 'whole', 'whom', 'whose', 'why', 'wide', 'widely', 'wife', 'wild', 'will', 'willing', 'win', 'wind', 'window', 'wing', 'winter', 'wire', 'wise', 'wish', 'with', 'within', 'without', 'wolf', 'women', 'won', 'wonder', 'wonderful', 'wood', 'wooden', 'wool', 'word', 'wore', 'work', 'worker', 'world', 'worried', 'worry', 'worse', 'worth', 'would', 'wrapped', 'write', 'writer', 'writing', 'written', 'wrong', 'wrote', 'yard', 'year', 'yellow', 'yes', 'yesterday', 'yet', 'you', 'young', 'younger', 'your', 'yourself', 'youth', 'zero', 'zebra', 'zipper', 'zoo', 'zulu'];

function init() {
	let geo, mat, mesh, entity;

	//html stuff
	document.getElementById('c').style.filter = 'brightness(' + (+config['brightness'] + 50)/100 + ')'

	document.getElementById('log').textContent = 'Server Code: ' + serverID;
	document.getElementById('launcher').remove();
	document.getElementById('loading').remove();
	document.getElementById('game').style.display = '';

	// scene = new THREE.Scene();
	// scene.background = new THREE.Color(0x0080ff);

	// let aspectRatio = window.innerWidth / window.innerHeight;
	// if (config['aspectRatio'] != 'native') {
	// 	const configRatio = config['aspectRatio'].split(":");
	// 	aspectRatio = configRatio[0]/configRatio[1];
	// }

	// camera = new THREE.PerspectiveCamera(+config['fov'], aspectRatio, 1, +config['renderDistance']);

	// renderer = new THREE.WebGLRenderer({
	// 	canvas: canvas,
	// 	precision: config['shadowPrecision'],
	// 	antialias: config['antiAliasing'] === 'true',
	// 	powerPreference: config['powerPreference'],

	// });
	// renderer.setSize(window.innerWidth, window.innerHeight);
	// renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE[config['shadowMap']];
	// renderer.physicallyCorrectLights = config['physicallyCorrectLights'] === 'true';
	// renderer.toneMapping = THREE[config['toneMap']]

	// renderer.setPixelRatio(+config['resolution']);

	// const maxFiltering = renderer.capabilities.getMaxAnisotropy();
	// const filterLevels = document.querySelector('select[name=textureFiltering]').children;
	// for (let i = filterLevels.length - 1; i >= 0; i--) {
	// 	const element = filterLevels[i];
	// 	if (element.value > maxFiltering) {
	// 		element.remove();
	// 	}
	// }

	System.init(config);

	// lighting
	const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
	hemiLight.color.setHSL(0.6, 1, 0.6);
	hemiLight.groundColor.setHSL(0.095, 1, 0.75);
	hemiLight.position.set(0, 100, 0);
	// scene.add(hemiLight);
	entity = new Entity;
	entity.addComponent('Object3D', hemiLight);

	const dirLight = new THREE.DirectionalLight(0xffffff, 1);
	dirLight.color.setHSL(0.1, 1, 0.95);
	dirLight.position.set(-1, 1.75, 1);
	dirLight.position.multiplyScalar(100);

	dirLight.castShadow = true;

	dirLight.shadow.mapSize.width = 2048;
	dirLight.shadow.mapSize.height = 2048;

	var d = 50;

	dirLight.shadow.camera.left = -d;
	dirLight.shadow.camera.right = d;
	dirLight.shadow.camera.top = d;
	dirLight.shadow.camera.bottom = -d;

	dirLight.shadow.camera.far = 3500;
	dirLight.shadow.bias = -0.0001;

	entity = new Entity;
	entity.addComponent('Object3D', dirLight);

	// floor
	geo = new THREE.PlaneBufferGeometry(200, 200);
	mat = new THREE.MeshPhongMaterial({
		color: 0x718E3E
	});
	mesh = new THREE.Mesh(geo, mat);
	mesh.position.y = 0;
	mesh.rotation.x = -Math.PI / 2;
	mesh.receiveShadow = true;

	entity = new Entity;
	entity.addComponent('Object3D', mesh);

	const gridHelper = new THREE.GridHelper(1000, 1000, 0x0000ff, 0x808080);

	entity = new Entity;
	entity.addComponent('Object3D', gridHelper);

	//player
	// gameObjects['player'] = new GAMEOBJECT.Player();

	geo = new THREE.BoxGeometry( 1, 1, 1 );
	mat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
	mesh = new THREE.Mesh( geo, mat );
	mesh.position.set(0, 3, 0)
	entity = new Entity;
	entity.addComponent('Object3D', mesh);

	System.camera.init(mesh);
	System.input.init();
	System.movement.init();
	System.render.init();

	window.requestAnimationFrame(gameLoop);
}

function loadGame(event) {
	if (!event.path[1].reportValidity())
		return;

	document.getElementById('join-button').removeEventListener('click', loadGame);
	document.getElementById('host-button').removeEventListener('click', loadGame);
	document.getElementById('launcher').style.display = 'none';
	document.getElementById('loading').style.display = 'flex';

	hosting = event.target.id === 'host-button';
	nickname = document.getElementsByClassName('nickname')[+hosting].value;
	localStorage.setItem('nickname', nickname);
	serverID = document.getElementById('join').value.replace(/\s/g, '');

	const manager = new THREE.LoadingManager();
	const modelLoader = new GLTFLoader(manager);
	const models = ['player.glb'];

	if (config['displayMode'] === 'fullscreen') {
		document.body.requestFullscreen();
	}

	for (const model of models) {
		modelLoader.load('assets/models/' + model, gltf => {
			assets[model] = gltf;
		});
	}

	manager.onProgress = (url, itemsLoaded, itemsTotal) => {
		document.getElementById('loading-info').textContent = 'Loading: ' + url;
		document.getElementById('bar-percentage').style.width = itemsLoaded / itemsTotal * 100 + '%';
	}

	manager.onLoad = () => {
		document.getElementById('loading-info').textContent = 'Connecting to server...';

		newPeer();

		window.addEventListener('beforeunload', (event) => {
			event.preventDefault();
			localStorage.setItem('config', JSON.stringify(config));
			event.returnValue = '';
		});

		window.addEventListener('unload', () => {
			peer.destroy();
		})
	}
}

function addNewConnection(conn) {
	const id = conn.peer;

	if (id === peerID || connections.hasOwnProperty(id))
		return;

	conn.on('open', () => {
		if (connections.hasOwnProperty(id))
			return;
		if (id === serverID) {
			init();
		}
		connections[id] = [conn];
		gameObjects[id] = new GAMEOBJECT.OtherPlayer(id);
		conn.send({
			type: 'overhead',
			id: peerID,
			nickname: nickname
		})
	});

	conn.on('data', (data) => {
		if (gameObjects.hasOwnProperty(data.id)) {
			const object = gameObjects[id];
			switch (data.type) {
				case 'update':
					const pos = data.pos;
					object.pos.set(pos.x, pos.y, pos.z);
					object.rotationY = data.rotationY;
					object.animationName = data.animationName;
					object.animationDir = data.animationDir;
					break;
				case 'overhead':
					object.addOverhead(data.nickname);
					break;
			}
		} else {
			switch (data.type) {
				case 'playerList':
					const playerList = data.playerList;
					for (const player of playerList)
						addNewConnection(peer.connect(player));
					break;
			}
		}
	});

	conn.on('error', (err) => {
		const conn = peer.connect(id);
		addNewConnection(conn);
	})

	conn.on('close', () => {
		const id = conn.peer;
		if (gameObjects[id]) {
			gameObjects[id].delete();
			delete gameObjects[id];
		}
		delete connections[id];
	})
}

function newPeer() {
	const options = {
		secure: true,
		host: 'peerjs-cloud9c.herokuapp.com',
	}

	if (hosting) {
		let id = '';
		for (let i = 0; i < 3; i++) {
			id += wordList.splice(Math.floor(Math.random() * wordList.length), 1).toString();
		}
		peer = new Peer(id, options);
	} else {
		peer = new Peer(options);
	}

	peer.on('open', (id) => {
		peerID = id;
		if (hosting) {
			serverID = id;
			init();
		} else {
			const conn = peer.connect(serverID);
			addNewConnection(conn);
		}
	});

	peer.on('connection', addNewConnection);

	peer.on('error', (err) => { //TODO, add all errors
		if (err.type === 'unavailable-id')
			newPeer();
	});

	peer.on('disconnected', () => {
		peer.reconnect();
	});
}

function gameLoop(timestamp) {
	timestamp /= 1000;
	dt = timestamp - lastTimestamp;
	lastTimestamp = timestamp;

	System.camera.update();
	System.movement.update();
	System.render.update();
	System.input.update();

	// for (const property in gameObjects) {
	// 	gameObjects[property].update();
	// }

	// renderer.render(scene, camera);
	window.requestAnimationFrame(gameLoop);
};

function applyChanges(name) {
	const player = gameObjects['player'];
	switch(name) {
		case 'mouseSensitivity':
			player.sensitivityX = config['mouseSensitivity'] / 1400;
			player.sensitivityY = config['mouseSensitivity'] / 1400;
			break;
		case 'mouseInvert':
			if (config['mouseInvert'] === 'true')
				player.sensitivityY *= -1;
			break;
		case 'resolution':
			renderer.setPixelRatio(+config['resolution']);
			break;
		case 'brightness':
			document.getElementById('c').style.filter = 'brightness(' + (+config['brightness'] + 50)/100 + ')';
			break;
		case 'fov':
			camera.fov = +config['fov'];
			break;
		case 'aspectRatio':
			let aspectRatio = window.innerWidth / window.innerHeight;
			if (config['aspectRatio'] != 'native') {
				const configRatio = config['aspectRatio'].split(":");
				aspectRatio = configRatio[0]/configRatio[1];
			}
			camera.aspect = aspectRatio;
			break;
		case 'renderDistance':
			camera.far = +config['renderDistance'];
			scene.fog = new THREE.Fog(new THREE.Color(0x0080ff), +config['renderDistance'] - 4, +config['renderDistance']);
			break;
	}
	camera.updateProjectionMatrix();
}

window.addEventListener('load', () => {
	const oldNickname = localStorage.getItem('nickname');
	if (oldNickname !== null) {
		document.getElementsByClassName('nickname')[0].value = oldNickname;
		document.getElementsByClassName('nickname')[1].value = oldNickname;
	}

	const oldConfig = localStorage.getItem('config');
	if (oldConfig !== null) {
		config = JSON.parse(oldConfig);
	} else {
		config = {};
	}

	document.getElementById('join-button').addEventListener('click', loadGame);
	document.getElementById('host-button').addEventListener('click', loadGame);
	document.getElementById('next-button').addEventListener('click', () => {
		document.getElementById('splash-page').style.display = 'none';
		document.getElementById('host-submit').style.display = 'block';
	})

	for (const element of document.getElementById('menu-sidebar').children) {
		element.addEventListener('click', () => {
			document.querySelector('.setting-label[data-selected]').removeAttribute('data-selected');
			document.querySelector('.setting[data-selected]').removeAttribute('data-selected');
			element.setAttribute('data-selected', '');
			document.querySelector('.setting[data-setting=' + element.getAttribute('data-setting') + ']').setAttribute('data-selected', '');
		})
	}

	for (const element of document.querySelectorAll('.setting input:not([type=number]), .setting select')) {
		if (oldConfig === null || oldConfig.hasOwnProperty(element.name)) {
			element.value = element.getAttribute('data-default');
			config[element.name] = element.getAttribute('data-default');
		} else {
			element.value = config[element.name];
		}

		switch (element.type) {
			case 'range':	
				const percent = 100 * (element.value - element.getAttribute('min')) / (element.getAttribute('max') - element.getAttribute('min'));
				element.style.background = 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ' + percent + '%, rgba(255,255,255,0.4) ' + percent + '%, rgba(255,255,255,0.4) 100%)';
				element.nextElementSibling.value = element.value;
				element.addEventListener('input', function() {
					const percent = 100 * (this.value - this.getAttribute('min')) / (this.getAttribute('max') - this.getAttribute('min'));
					this.style.background = 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ' + percent + '%, rgba(255,255,255,0.4) ' + percent + '%, rgba(255,255,255,0.4) 100%)'
					this.nextElementSibling.value = this.value;
					config[this.name] = this.value;

					// const player = gameObjects['player'];
					applyChanges(this.name);
				});
				break;
			case 'text':
				element.addEventListener('keydown', function(event) {
					const key = event.code;

					if (key === 'Tab')
						return;

					const controls = document.querySelectorAll('input[type=text]');
					for (const control of controls) {
						if (control.value === key) {
							control.value = '';
							config[control.name] = '';
						}
					}
					this.value = key;
					config[this.name] = key;
					this.blur();
					// gameObjects['player'].controls[this.name] = key;
					applyChanges(this.name);
				});
				element.nextElementSibling.addEventListener('click', () => {
					element.value = '';
					config[element.name] = '';
					applyChanges(element.name);
				});
				break;
			default:
				element.addEventListener('input', function() {
					config[this.name] = this.value;
					applyChanges(this.name);
				});	
		}
	}

	document.getElementById('restore-defaults').addEventListener('click', () => {
		for (const element of document.querySelectorAll('.setting[data-selected] input:not([type=number]), .setting select')) {
			const dataDefault = element.getAttribute('data-default');

			if (element.type === 'range') {
				const percent = 100 * (dataDefault - element.getAttribute('min')) / (element.getAttribute('max') - element.getAttribute('min'));
				element.style.background = 'linear-gradient(to right, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.8) ' + percent + '%, rgba(255,255,255,0.4) ' + percent + '%, rgba(255,255,255,0.4) 100%)';
				element.nextElementSibling.value = dataDefault;
			}

			element.value = dataDefault
			config[element.name] = dataDefault;
			applyChanges(element.name);
		}
	});
});

export {scene, renderer, camera, lastTimestamp, dt, config, assets, peerID, connections};