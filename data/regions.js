// Curated starting collection, reviewed 2026-11-01. Not an exhaustive literature review.
// Atlas labels are coarse navigation groupings, not exact functional boundaries.
// Connections identify selected circuit partners, not a measured connectome or edge direction.
// Evidence labels apply to the accompanying claim and species, never to an entire region.
const source = (title, url) => ({ title, url });
const basics = source('NINDS · Brain Basics', 'https://www.ninds.nih.gov/health-information/public-education/brain-basics');
const cls = source('2023 · Complementary learning systems (computational study)', 'https://www.nature.com/articles/s41593-023-01382-9');
const basal = source('Neuroscience · Basal ganglia anatomy', 'https://www.ncbi.nlm.nih.gov/books/NBK10988/');

export const REGIONS = [
  {
    id: 'prefrontal', name: 'Prefrontal cortex', subtitle: 'Goals, working memory & flexible behavior', group: 'cortex', color: '#9d93cf',
    roles: ['Maintain goals and task rules', 'Plan and compare possible actions', 'Regulate attention and behavior'],
    overview: 'A heterogeneous collection of frontal areas that coordinates behavior using context, goals, and prior knowledge. Its subdivisions contribute differently to planning, working memory, social cognition, and emotion regulation.',
    learning: 'Helps discover useful rules, maintain relevant information, and adapt strategies. Learning changes population activity and interactions with the thalamus, hippocampus, and basal ganglia.',
    mechanisms: [
      { name: 'Training-related population changes', status: 'Supported', text: 'Primate recordings link working-memory training to more distributed prefrontal activation and altered temporal dynamics. This is evidence about a particular task, not a universal increase in memory capacity.' },
      { name: 'Recurrent activity and distributed maintenance', status: 'Hypothesis', text: 'Recurrent-network models explain how information can persist after input ends. Thalamic support, dynamic activity, and transient synaptic changes offer complementary mechanisms; no single account covers all tasks.' }
    ],
    connections: ['thalamus', 'hippocampus', 'striatum', 'parietal', 'anterior-cingulate'],
    questions: ['How are abstract rules separated from task-specific strategies?', 'Which learning rules let distributed circuits assign credit to useful representations?'],
    sources: [source('2019 · Working-memory training and prefrontal dynamics', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6452731/'), source('2017 · Thalamic support of attentional control (mice)', 'https://www.nature.com/articles/nature22073')],
    keywords: ['planning', 'executive function', 'working memory', 'rules', 'attention', 'emotion regulation', 'cognitive control'],
    atlasLabels: ['rostralmiddlefrontal', 'superiorfrontal', 'frontalpole']
  },
  {
    id: 'orbitofrontal', name: 'Orbitofrontal cortex', subtitle: 'Expected outcomes & hidden task states', group: 'cortex', color: '#b49ac5',
    roles: ['Represent expected outcomes', 'Update choices when circumstances change', 'Use context to interpret value'],
    overview: 'Frontal cortex above the eye sockets, with medial and lateral subdivisions. It helps decisions reflect the identity, value, and current relevance of possible outcomes.',
    learning: 'Especially relevant when the same cue means different things in different contexts, or when an outcome changes value. It interacts with memory and reinforcement-learning circuits.',
    mechanisms: [
      { name: 'Task-state representation', status: 'Supported', text: 'Human fMRI patterns contain information about hidden states in a structured decision task. Decoding identifies information in the measured signal; it does not establish a cellular learning rule.' },
      { name: 'Cognitive map of task space', status: 'Hypothesis', text: 'A proposed unifying account is that orbitofrontal cortex represents the current state of a task, enabling appropriate predictions. Value and sensory-outcome accounts make partly overlapping predictions.' }
    ],
    connections: ['amygdala', 'hippocampus', 'nucleus-accumbens', 'prefrontal'],
    questions: ['When are value and state representations distinguishable?', 'How does experience determine which hidden variables a task model includes?'],
    sources: [source('2016 · Human orbitofrontal task-state representations', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5044873/')],
    keywords: ['value', 'reward', 'reversal learning', 'state inference', 'emotion', 'decision'],
    atlasLabels: ['lateralorbitofrontal', 'medialorbitofrontal']
  },
  {
    id: 'premotor', name: 'Premotor cortex', subtitle: 'Preparing actions & learning sensorimotor mappings', group: 'cortex', color: '#928eb7',
    roles: ['Prepare movements', 'Link sensory cues to actions', 'Organize action sequences'],
    overview: 'Areas anterior to primary motor cortex contribute to action preparation and selection. Dorsal, ventral, and supplementary motor territories have distinct roles; the displayed atlas grouping is approximate.',
    learning: 'Practice changes the population activity linking cues and intended actions. Premotor and basal-ganglia circuits can change together as new mappings are learned.',
    mechanisms: [
      { name: 'Learned cue–action associations', status: 'Supported', text: 'Monkey recordings show evolving premotor and putamen activity during learning of arbitrary visual-to-movement mappings. Correlated changes do not establish which circuit teaches the other.' },
      { name: 'Preparation as an initial condition', status: 'Hypothesis', text: 'Dynamical accounts propose that preparation places the motor system in a state from which a suitable movement unfolds. How learning shapes these states across circuits remains unresolved.' }
    ],
    connections: ['motor', 'parietal', 'striatum', 'prefrontal', 'cerebellum'],
    questions: ['Where are newly learned cue–action mappings stored?', 'How do preparation and selection change as a skill becomes automatic?'],
    sources: [source('2005 · Premotor and putamen activity during associative learning', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1413509/')],
    keywords: ['movement preparation', 'motor learning', 'sequence', 'action selection', 'skill'],
    atlasLabels: ['caudalmiddlefrontal']
  },
  {
    id: 'motor', name: 'Primary motor cortex', subtitle: 'Voluntary movement & practiced skills', group: 'cortex', color: '#79a6c6',
    roles: ['Contribute descending movement commands', 'Coordinate muscle activity', 'Support skilled movement'],
    overview: 'Motor cortex participates in distributed control loops with spinal circuits, brainstem, basal ganglia, and cerebellum. Its activity reflects combinations of movement variables rather than a simple one-neuron/one-muscle code. The paracentral parcel also includes sensory territory.',
    learning: 'Motor practice changes synaptic connections and population activity. What is stored in motor cortex varies with the task and stage of learning.',
    mechanisms: [
      { name: 'Synapse formation and stabilization', status: 'Supported', text: 'Imaging in mice showed that learning a reaching skill rapidly forms dendritic spines and selectively stabilizes some of them. This is direct animal evidence for structural plasticity, not a complete account of human skill memory.' },
      { name: 'Reusable population patterns', status: 'Hypothesis', text: 'Skills may be learned by reshaping or reusing coordinated patterns of neural activity. The relative contributions of local synapses and changing input from other areas remain open.' }
    ],
    connections: ['premotor', 'somatosensory', 'cerebellum', 'thalamus', 'striatum', 'brainstem'],
    questions: ['Which changes are necessary for long-term retention of a skill?', 'How does a stable behavior survive ongoing synaptic and representational change?'],
    sources: [source('2009 · Synapse stabilization during motor learning (mice)', 'https://www.nature.com/articles/nature08389')],
    keywords: ['movement', 'motor learning', 'skill', 'practice', 'plasticity', 'muscle'],
    atlasLabels: ['precentral', 'paracentral']
  },
  {
    id: 'somatosensory', name: 'Somatosensory cortex', subtitle: 'Touch, body position & sensory discrimination', group: 'cortex', color: '#74b3bd',
    roles: ['Represent touch and vibration', 'Process body-position signals', 'Support tactile discrimination'],
    overview: 'The postcentral cortex contains organized representations of the body. Different subareas emphasize skin input, proprioception, or combinations useful for recognizing objects through touch.',
    learning: 'Experience can improve tactile discrimination. Improvement can involve altered sensory coding, attention, or how downstream areas read sensory signals; a larger cortical map is not required in every task.',
    mechanisms: [
      { name: 'Practice and tactile improvement', status: 'Supported', text: 'Human tactile-frequency training can improve performance and generalize between fingers without a detectable expansion of the trained finger’s cortical representation.' },
      { name: 'Map change as a learning mechanism', status: 'Mixed evidence', text: 'Some animal and human paradigms show map reorganization, whereas others show learning without measurable expansion. Task, measurement scale, and downstream readout all matter.' }
    ],
    connections: ['motor', 'parietal', 'thalamus', 'insula'],
    questions: ['When does learning alter sensory codes versus their readout?', 'What determines whether tactile learning generalizes across body locations?'],
    sources: [source('2003 · Tactile learning without detectable map expansion (humans)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6871959/')],
    keywords: ['touch', 'body', 'proprioception', 'perception', 'sensory learning', 'tactile'],
    atlasLabels: ['postcentral']
  },
  {
    id: 'parietal', name: 'Posterior parietal cortex', subtitle: 'Spatial attention & sensory-to-action transformations', group: 'cortex', color: '#69aeb4',
    roles: ['Direct attention in space', 'Integrate sensory and body information', 'Guide reaching and other actions'],
    overview: 'A broad collection of parietal areas supports spatial processing, multisensory integration, attention, and action. Inferior parietal territories also contribute to language and memory; functions differ across subregions.',
    learning: 'Perceptual decisions can improve by changing how sensory evidence is translated into choices. This provides an alternative to the idea that perceptual learning must occur only in sensory cortex.',
    mechanisms: [
      { name: 'Changing sensory-to-choice readout', status: 'Supported', text: 'In monkeys learning motion discrimination, responses changed in lateral intraparietal cortex while comparable learning-related changes were not found in the sampled motion area MT.' },
      { name: 'Evidence accumulation', status: 'Hypothesis', text: 'Some activity resembles accumulation of evidence toward a decision. Its causal role, relation to movement plans, and generality across tasks remain debated.' }
    ],
    connections: ['visual', 'somatosensory', 'premotor', 'prefrontal', 'posterior-cingulate'],
    questions: ['How much learning reflects attention, evidence weighting, or motor preparation?', 'Which parietal computations generalize across sensory modalities?'],
    sources: [source('2008 · Perceptual learning in sensory–motor cortex (monkeys)', 'https://www.nature.com/articles/nn2070')],
    keywords: ['space', 'attention', 'decision', 'evidence accumulation', 'reach', 'perception', 'multisensory'],
    atlasLabels: ['inferiorparietal', 'superiorparietal', 'supramarginal']
  },
  {
    id: 'visual', name: 'Visual cortex', subtitle: 'Visual features, shape & motion', group: 'cortex', color: '#79bfc2',
    roles: ['Extract orientation, color, and spatial features', 'Process shape and motion', 'Provide representations for visual recognition'],
    overview: 'Occipital areas form interacting stages of visual processing. V1 and extrastriate areas have different properties, and recognition also depends on temporal and parietal cortex. The displayed group combines several anatomical parcels.',
    learning: 'Visual experience changes discrimination and recognition. Learning may alter early feature coding, top-down influences, or downstream use of existing signals.',
    mechanisms: [
      { name: 'Experience-dependent tuning', status: 'Supported', text: 'One monkey orientation-training study found changes in V1 orientation coding around the trained orientation. The result is task-specific and does not establish that V1 is the sole site of learning.' },
      { name: 'Early sensory cortex as the learning locus', status: 'Mixed evidence', text: 'Other primate studies found little change in basic V1 receptive-field properties, or found learning effects in decision-related regions. Different visual tasks may recruit different mechanisms.' }
    ],
    connections: ['temporal', 'parietal', 'thalamus', 'basal-forebrain', 'parahippocampal'],
    questions: ['When are improvements explained by tuning versus readout?', 'How do prediction and attention interact with local plasticity?'],
    sources: [source('2001 · Orientation learning and V1 (monkeys)', 'https://www.nature.com/articles/35087601'), source('2001 · Experience and attention in V1', 'https://www.nature.com/articles/nn0501_519')],
    keywords: ['vision', 'visual interpretation', 'color', 'shape', 'motion', 'perceptual learning', 'prediction'],
    atlasLabels: ['cuneus', 'lateraloccipital', 'lingual', 'pericalcarine']
  },
  {
    id: 'auditory', name: 'Auditory cortex', subtitle: 'Sound features & learned acoustic significance', group: 'cortex', color: '#8fb9d1',
    roles: ['Analyze frequency and timing', 'Support perception of speech and music', 'Identify meaningful acoustic patterns'],
    overview: 'Primary and surrounding auditory areas analyze sound. Speech comprehension additionally recruits distributed temporal and frontal regions. The superior temporal parcel includes substantial nonprimary and association cortex.',
    learning: 'Experience can change the representation of behaviorally relevant frequencies and temporal patterns. Attention and neuromodulatory input influence which sounds become prioritized.',
    mechanisms: [
      { name: 'Neuromodulator-enabled reorganization', status: 'Supported', text: 'Pairing tones with nucleus basalis stimulation changed auditory cortical maps in rats. Artificial stimulation provides causal evidence for modulation of plasticity, but is not a complete model of natural human learning.' },
      { name: 'Learned predictive representations', status: 'Hypothesis', text: 'Auditory circuits may learn temporal regularities and compare incoming sounds with expectations. Several local and distributed mechanisms could produce such effects.' }
    ],
    connections: ['thalamus', 'temporal', 'language', 'basal-forebrain', 'amygdala'],
    questions: ['Which changes encode acoustic detail versus learned significance?', 'How do local plasticity and top-down predictions cooperate in speech learning?'],
    sources: [source('1998 · Nucleus basalis activity and cortical maps (rats)', 'https://pubmed.ncbi.nlm.nih.gov/9497289/'), source('1998 · Auditory temporal-processing plasticity', 'https://www.nature.com/articles/nn1298_727')],
    keywords: ['sound', 'hearing', 'speech', 'music', 'auditory learning', 'timing'],
    atlasLabels: ['superiortemporal', 'transversetemporal']
  },
  {
    id: 'temporal', name: 'Temporal association cortex', subtitle: 'Objects, faces & conceptual knowledge', group: 'cortex', color: '#a5a8ce',
    roles: ['Recognize objects and faces', 'Represent conceptual knowledge', 'Link perceptions with meaning'],
    overview: 'Ventral and lateral temporal territories contribute to visual recognition, semantic knowledge, and language. Category preferences and semantic functions vary across subdivisions and individuals.',
    learning: 'Repeated experience builds representations that generalize across views and situations. Interactions with the hippocampus may help integrate specific encounters into broader knowledge.',
    mechanisms: [
      { name: 'Anterior temporal contribution to semantics', status: 'Supported', text: 'Temporary disruption with TMS in humans slowed picture naming and word comprehension in a semantic task. This supports a causal contribution to semantic processing, not a complete account of knowledge acquisition.' },
      { name: 'Gradual abstraction across experiences', status: 'Hypothesis', text: 'Complementary-learning-system models propose gradual cortical extraction of shared structure from experiences. How this relates to distinct temporal cortical populations remains an active question.' }
    ],
    connections: ['visual', 'auditory', 'language', 'hippocampus', 'entorhinal'],
    questions: ['How are new concepts integrated without disrupting old knowledge?', 'Which representations are category-specific versus shared across modalities?'],
    sources: [source('2007 · Anterior temporal TMS and semantic processing (humans)', 'https://pubmed.ncbi.nlm.nih.gov/18056637/'), cls],
    keywords: ['object recognition', 'faces', 'meaning', 'semantic memory', 'concepts', 'generalization'],
    atlasLabels: ['bankssts', 'fusiform', 'inferiortemporal', 'middletemporal', 'temporalpole']
  },
  {
    id: 'language', name: 'Inferior frontal cortex', subtitle: 'Language, selection & structured sequences', group: 'cortex', color: '#a28cc2',
    roles: ['Contribute to language production and comprehension', 'Select and combine linguistic information', 'Support task-dependent control processes'],
    overview: 'Inferior frontal cortex contains neighboring populations with different functions. Language-selective areas, particularly on the left, sit near areas involved in more general control; a large anatomical parcel cannot distinguish them.',
    learning: 'Language learning involves changing representations and interactions across frontal, temporal, and memory systems. Artificial-grammar tasks isolate some learning processes but do not reproduce natural language acquisition in full.',
    mechanisms: [
      { name: 'Functionally distinct neighboring populations', status: 'Supported', text: 'Individual-subject human fMRI identifies language-selective regions with little response to several nonlanguage tasks. Anatomical overlap alone is insufficient evidence for a common computation.' },
      { name: 'Learning structured sequences', status: 'Hypothesis', text: 'Predictive, statistical, and rule-based models offer accounts of learning language structure. Their neural implementation and division of labor across circuits remain unsettled.' }
    ],
    connections: ['temporal', 'auditory', 'prefrontal', 'striatum', 'hippocampus'],
    questions: ['Which mechanisms are shared between language and other sequence learning?', 'How does learning reshape language-selective circuits across development?'],
    sources: [source('2011 · Functional specificity of human language regions', 'https://pubmed.ncbi.nlm.nih.gov/21885736/'), source('2004 · Artificial-grammar learning with fMRI', 'https://pubmed.ncbi.nlm.nih.gov/15072678/')],
    keywords: ['language', 'speech', 'grammar', 'syntax', 'sequence learning', 'Broca'],
    atlasLabels: ['parsopercularis', 'parsorbitalis', 'parstriangularis']
  },
  {
    id: 'insula', name: 'Insular cortex', subtitle: 'Body state, feelings & significant events', group: 'cortex', color: '#c09aac',
    roles: ['Integrate internal bodily signals', 'Contribute to taste and affective experience', 'Help identify behaviorally important events'],
    overview: 'The insula is folded beneath the frontal and temporal opercula. Posterior and anterior subdivisions differ in sensory, interoceptive, affective, and cognitive roles. It is part of distributed emotion and salience networks.',
    learning: 'Connects sensory events with their bodily consequences. Taste-aversion learning offers a tractable animal model for how experience changes the significance of a stimulus.',
    mechanisms: [
      { name: 'Plasticity in taste-aversion circuits', status: 'Supported', text: 'Manipulating potentiation and depression in the amygdala–insula pathway altered taste-aversion retention and extinction in rats. This is direct evidence in a specific animal circuit.' },
      { name: 'Predictions about bodily state', status: 'Hypothesis', text: 'Interoceptive-inference accounts propose that insular circuits combine predictions and bodily input to guide experience and action. Broad computational claims remain harder to isolate experimentally.' }
    ],
    connections: ['amygdala', 'anterior-cingulate', 'somatosensory', 'hypothalamus', 'orbitofrontal'],
    questions: ['Which signals reflect bodily input, expectation, or attention?', 'How do internal states change what is learned from the same external event?'],
    sources: [source('2016 · Insular LTP/LTD and taste-aversion extinction (rats)', 'https://pubmed.ncbi.nlm.nih.gov/28034786/')],
    keywords: ['emotion', 'feeling', 'body state', 'interoception', 'taste', 'pain', 'salience', 'aversion'],
    atlasLabels: ['insula']
  },
  {
    id: 'anterior-cingulate', name: 'Anterior cingulate cortex', subtitle: 'Outcomes, effort & behavioral adjustment', group: 'cortex', color: '#ba99be',
    roles: ['Use action–outcome history', 'Evaluate effort and behavioral demands', 'Contribute to monitoring and adjustment'],
    overview: 'Medial frontal cingulate territories participate in action, affect, and autonomic regulation. Dorsal and rostral subdivisions differ; no single function captures the entire region.',
    learning: 'Helps behavior incorporate recent outcomes and determine when to persist or change strategy. Its computations are often studied through reward, effort, conflict, and uncertainty tasks.',
    mechanisms: [
      { name: 'Using action–outcome history', status: 'Supported', text: 'Macaque lesion experiments implicate anterior cingulate cortex in guiding choices using the history of actions and outcomes. Simple error detection alone did not explain the observed deficit.' },
      { name: 'Control allocation and learning-rate adjustment', status: 'Hypothesis', text: 'Models propose that cingulate circuits estimate when control is worth its cost or when beliefs should change rapidly. Effort, surprise, and action-value signals can be difficult to separate.' }
    ],
    connections: ['prefrontal', 'insula', 'striatum', 'locus-coeruleus', 'amygdala'],
    questions: ['Which signals determine whether to persist, switch, or explore?', 'How do control-allocation and action-value accounts differ experimentally?'],
    sources: [source('2006 · Anterior cingulate and reinforcement-guided decisions', 'https://doi.org/10.1038/nn1724')],
    keywords: ['effort', 'error', 'conflict', 'emotion', 'control', 'learning rate', 'decision'],
    atlasLabels: ['caudalanteriorcingulate', 'rostralanteriorcingulate']
  },
  {
    id: 'posterior-cingulate', name: 'Posterior medial cortex', subtitle: 'Remembering, context & internally directed thought', group: 'cortex', color: '#a4b7bb',
    roles: ['Support episodic memory', 'Represent spatial and situational context', 'Contribute to internally directed cognition'],
    overview: 'This navigation group combines posterior cingulate, isthmus/retrosplenial territory, and precuneus. These are distinct areas within broader memory and default-network systems, not a single functional unit.',
    learning: 'Links stored experiences with contextual knowledge and current goals. Interactions with hippocampal and parietal systems help explain why memory is a network-level process.',
    mechanisms: [
      { name: 'Network contribution to episodic encoding', status: 'Supported', text: 'Posterior-cingulate stimulation during word encoding impaired later recall in human epilepsy patients and altered hippocampal activity. Effects depend on stimulation parameters and clinical context.' },
      { name: 'Context integration during consolidation', status: 'Hypothesis', text: 'Posterior medial networks may organize the context shared across experiences and support construction of internal models. A complete local learning rule has not been established.' }
    ],
    connections: ['hippocampus', 'parahippocampal', 'parietal', 'prefrontal'],
    questions: ['How do posterior cingulate, retrosplenial cortex, and precuneus differ during learning?', 'When does internal processing help versus interfere with new encoding?'],
    sources: [source('2019 · Posterior-cingulate stimulation and memory (humans)', 'https://pubmed.ncbi.nlm.nih.gov/31358651/')],
    keywords: ['memory', 'context', 'default mode', 'navigation', 'self', 'recollection', 'precuneus'],
    atlasLabels: ['isthmuscingulate', 'posteriorcingulate', 'precuneus']
  },
  {
    id: 'hippocampus', name: 'Hippocampal formation', subtitle: 'Experiences, relationships & spatial context', group: 'memory', color: '#d7af79',
    roles: ['Bind elements of an experience', 'Support episodic and relational memory', 'Represent spatial and contextual relationships'],
    overview: 'The dentate gyrus, CA fields, and subiculum form interacting circuits with distinct connectivity and physiology. The hippocampal formation is essential to many forms of new episodic memory, but learning also occurs in other brain systems.',
    learning: 'Rapidly links items, places, and events. Pattern separation, completion, and replay are useful candidate computations; their implementation differs across subfields and task conditions.',
    mechanisms: [
      { name: 'Ripple-associated activity and memory', status: 'Supported', text: 'Selectively disrupting hippocampal sharp-wave ripples after learning impaired spatial memory in rats. This supports a contribution of ripple-associated activity; it does not prove one exclusive function for replay.' },
      { name: 'Complementary learning systems', status: 'Hypothesis', text: 'Models propose that rapid hippocampal learning supports slower extraction of general structure by cortex. Replay, consolidation, and generalization are linked predictions, with substantial questions about timescales and information flow.' }
    ],
    connections: ['entorhinal', 'parahippocampal', 'prefrontal', 'posterior-cingulate', 'amygdala', 'locus-coeruleus'],
    questions: ['Which experiences are replayed, and what selects them?', 'How do subfields balance remembering distinct events with generalizing across them?'],
    sources: [source('2009 · Ripple suppression and spatial memory (rats)', 'https://pubmed.ncbi.nlm.nih.gov/19749750/'), cls],
    keywords: ['memory', 'episodic', 'replay', 'consolidation', 'generalization', 'CA1', 'CA3', 'dentate gyrus', 'subiculum', 'pattern separation'],
    atlasLabels: []
  },
  {
    id: 'entorhinal', name: 'Entorhinal cortex', subtitle: 'An interface between experience and memory', group: 'memory', color: '#c6b58c',
    roles: ['Exchange information with hippocampal circuits', 'Represent spatial relationships', 'Contribute to temporal and contextual organization'],
    overview: 'Medial temporal cortex with differentiated subregions and layers. It provides major input to, and receives output from, the hippocampal formation; it is not simply a passive relay.',
    learning: 'Contributes structured representations through which experiences can be organized. Spatial grid coding is well characterized in rodents, while broader abstract-map interpretations remain under investigation.',
    mechanisms: [
      { name: 'Grid-like spatial firing', status: 'Supported', text: 'Recordings in rats revealed medial entorhinal neurons firing at repeated locations arranged in a spatial grid. This demonstrates a coding pattern, not by itself the rule that learns it.' },
      { name: 'A reusable coordinate system', status: 'Hypothesis', text: 'Grid-related computations may provide a basis for navigation and potentially other structured relationships. Generalization from physical space to arbitrary concepts requires task-specific evidence.' }
    ],
    connections: ['hippocampus', 'parahippocampal', 'temporal', 'prefrontal'],
    questions: ['How are grid and nongrid codes learned and updated?', 'Which computations transfer from spatial navigation to abstract relationships?'],
    sources: [source('2005 · Entorhinal spatial grid cells (rats)', 'https://www.nature.com/articles/nature03721')],
    keywords: ['grid cells', 'space', 'memory', 'navigation', 'relational learning', 'context'],
    atlasLabels: ['entorhinal']
  },
  {
    id: 'parahippocampal', name: 'Parahippocampal cortex', subtitle: 'Scenes & the context of an experience', group: 'memory', color: '#b8ba95',
    roles: ['Process scenes and environmental layout', 'Represent contextual associations', 'Support navigation and contextual memory'],
    overview: 'Medial temporal cortex involved in contextual and scene-related processing. The functionally defined parahippocampal place area is not identical to the entire anatomical parcel.',
    learning: 'Helps link events to the environments in which they occur, providing contextual information to wider memory circuits.',
    mechanisms: [
      { name: 'Scene and layout sensitivity', status: 'Supported', text: 'Human fMRI identified a region preferentially responsive to scenes and coherent spatial layout. This is a functional response finding, not evidence that every parahippocampal neuron codes places.' },
      { name: 'Context representations for memory', status: 'Hypothesis', text: 'A candidate role is to supply contextual structure that helps disambiguate and retrieve episodes. How those representations are acquired and combined with hippocampal codes is unresolved.' }
    ],
    connections: ['visual', 'entorhinal', 'hippocampus', 'posterior-cingulate'],
    questions: ['How are visual layout and learned contextual associations separated?', 'How does familiar context influence encoding of a new event?'],
    sources: [source('1998 · A cortical representation of local visual environment (humans)', 'https://www.nature.com/articles/33402')],
    keywords: ['scene', 'context', 'place', 'navigation', 'memory', 'environment'],
    atlasLabels: ['parahippocampal']
  },
  {
    id: 'amygdala', name: 'Amygdala', subtitle: 'Learned significance, threat & reward', group: 'deep', color: '#d29b9e',
    roles: ['Learn the significance of cues', 'Coordinate responses to threats and rewards', 'Modulate emotionally salient memories'],
    overview: 'A collection of nuclei with distinct connections and cell populations. It participates in appetitive and aversive learning and is not a single fear or emotion center.',
    learning: 'Associates cues and contexts with outcomes that matter to the organism. Interactions with hippocampus, prefrontal cortex, and neuromodulators shape retention, expression, and updating.',
    mechanisms: [
      { name: 'Synaptic plasticity in associative memory', status: 'Supported', text: 'In rats, inducing depression or potentiation in an experimentally defined amygdala input pathway suppressed or reinstated an acquired conditioned response. This causally links synaptic changes to one engineered memory circuit.' },
      { name: 'Extinction as new learning', status: 'Hypothesis', text: 'Many accounts treat extinction as learning that competes with prior associations rather than erasing them. Which synapses change, and when original associations are modified, depend on circuit and protocol.' }
    ],
    connections: ['hippocampus', 'orbitofrontal', 'insula', 'hypothalamus', 'nucleus-accumbens'],
    questions: ['How are positive and negative significance represented across nuclei?', 'When does updating modify an old association versus create a competing memory?'],
    sources: [source('2014 · Engineering a memory with LTD and LTP (rats)', 'https://www.nature.com/articles/nature13294')],
    keywords: ['emotion', 'fear', 'threat', 'reward', 'conditioning', 'extinction', 'valence'],
    atlasLabels: []
  },
  {
    id: 'striatum', name: 'Dorsal striatum', subtitle: 'Caudate & putamen · actions, outcomes & habits', group: 'deep', color: '#b2a8a1',
    roles: ['Contribute to action selection', 'Learn action–outcome relationships', 'Support practiced skills and habits'],
    overview: 'The caudate and putamen receive extensive cortical and thalamic inputs and dopamine modulation. Different territories participate in partly distinct cognitive and sensorimotor loops.',
    learning: 'Experience changes how actions are selected from their consequences and cues. The balance between outcome-sensitive behavior and habits depends on training, task structure, and circuit engagement.',
    mechanisms: [
      { name: 'Dorsolateral contribution to habits', status: 'Supported', text: 'In rats, dorsolateral-striatal lesions preserved sensitivity to outcome devaluation after training that produced habits in controls. This supports a circuit contribution, not a strict human caudate/putamen dichotomy.' },
      { name: 'Dopamine-modulated credit assignment', status: 'Hypothesis', text: 'Reinforcement-learning accounts propose that dopamine gates plasticity at recently active corticostriatal synapses. Eligibility traces could bridge action–outcome delays, but a complete whole-circuit implementation is unresolved.' }
    ],
    connections: ['prefrontal', 'motor', 'premotor', 'dopamine-midbrain', 'pallidum', 'thalamus'],
    questions: ['How are specific actions credited when feedback is delayed?', 'How do goal-directed and habitual policies cooperate or compete?'],
    sources: [source('2004 · Dorsolateral striatal lesions and habit formation (rats)', 'https://people.duke.edu/~hy43/DLSejn04.pdf'), basal],
    keywords: ['basal ganglia', 'caudate', 'putamen', 'habit', 'skill', 'reinforcement learning', 'action'],
    atlasLabels: []
  },
  {
    id: 'nucleus-accumbens', name: 'Nucleus accumbens', subtitle: 'Motivation & reward-guided engagement', group: 'deep', color: '#c6ad82',
    roles: ['Translate reward-related cues into action', 'Modulate motivational vigor', 'Integrate value with current needs'],
    overview: 'A ventral striatal structure with core and shell subdivisions. It integrates inputs from cortical, limbic, and dopamine systems; its role extends beyond pleasure or reward detection.',
    learning: 'Learned cues can acquire the ability to invigorate approach. The circuit links prior associations to current motivation, so learning an association and expressing it should be distinguished.',
    mechanisms: [
      { name: 'Dopamine-dependent cue responses', status: 'Supported', text: 'In rats, blocking local dopamine receptors reduced cue-evoked excitation and reward seeking. This supports a role in motivational expression, not proof that dopamine represents pleasure.' },
      { name: 'Need-dependent valuation', status: 'Supported', text: 'Rat recordings show that food-cue dopamine responses depend on hunger and correlate with cue-driven seeking. The exact computation varies across task and accumbens subterritory.' }
    ],
    connections: ['dopamine-midbrain', 'amygdala', 'orbitofrontal', 'hippocampus', 'hypothalamus', 'pallidum'],
    questions: ['How are learning, motivation, and movement signals separated?', 'How do core and shell circuits change with current needs and experience?'],
    sources: [source('2014 · Dopamine and cued reward seeking (rats)', 'https://pubmed.ncbi.nlm.nih.gov/25339748/'), source('2016 · Need-dependent accumbens dopamine signals (rats)', 'https://pubmed.ncbi.nlm.nih.gov/26715366/')],
    keywords: ['motivation', 'reward', 'ventral striatum', 'dopamine', 'value', 'reinforcement'],
    atlasLabels: []
  },
  {
    id: 'pallidum', name: 'Globus pallidus', subtitle: 'Basal-ganglia regulation of action', group: 'deep', color: '#bda48e',
    roles: ['Regulate basal-ganglia output', 'Shape movement and action selection', 'Participate in recurrent control loops'],
    overview: 'The internal and external pallidal segments differ in targets and physiology. The internal segment is a major basal-ganglia output structure; the external segment participates in recurrent circuits, including with the subthalamic nucleus.',
    learning: 'Provides part of the circuit through which learned striatal and cortical signals influence action. Local plasticity and distinct cell classes complicate a simple relay interpretation.',
    mechanisms: [
      { name: 'Inhibitory circuit organization', status: 'Supported', text: 'Anatomical and physiological work establishes pallidal participation in inhibitory basal-ganglia loops. This describes circuit architecture and should not be read as a complete learning algorithm.' },
      { name: 'Action gating', status: 'Hypothesis', text: 'Simplified models interpret changing inhibition as permitting selected actions while suppressing alternatives. Real cell populations, concurrent pathways, and task dynamics exceed a simple go/stop switch.' }
    ],
    connections: ['striatum', 'thalamus', 'motor', 'brainstem'],
    questions: ['Which pallidal changes reflect learning rather than movement execution?', 'How do distinct pallidal cell types shape policy updating?'],
    sources: [basal],
    keywords: ['basal ganglia', 'globus pallidus', 'GPe', 'GPi', 'inhibition', 'action selection', 'subthalamic'],
    atlasLabels: []
  },
  {
    id: 'thalamus', name: 'Thalamus', subtitle: 'Sensory routing, cortical coordination & arousal', group: 'deep', color: '#8cb3ad',
    roles: ['Relay and regulate sensory information', 'Coordinate cortical interactions', 'Support attention and arousal'],
    overview: 'Many nuclei with distinct sensory, motor, cognitive, and arousal-related functions. Higher-order thalamic circuits contribute actively to cortical processing, beyond passive relaying.',
    learning: 'Shapes which information reaches and persists in cortical circuits. Thalamocortical interactions contribute to flexible rule use and offer routes for coordinating plasticity across regions.',
    mechanisms: [
      { name: 'Sustaining task representations', status: 'Supported', text: 'Mouse experiments found that mediodorsal thalamus supports prefrontal representations used for attentional control. The result pertains to specific nuclei and circuits, not all thalamic function.' },
      { name: 'Coordination of distributed learning', status: 'Hypothesis', text: 'Thalamic circuits may regulate effective cortical communication and thereby influence what is learned. How routing changes are coordinated with synaptic credit assignment is still open.' }
    ],
    connections: ['prefrontal', 'visual', 'auditory', 'somatosensory', 'motor', 'pallidum', 'cerebellum'],
    questions: ['How do different nuclei contribute to acquiring versus applying rules?', 'Can thalamic routing provide a teaching or credit-assignment signal?'],
    sources: [source('2017 · Thalamic amplification of cortical connectivity (mice)', 'https://www.nature.com/articles/nature22073')],
    keywords: ['attention', 'relay', 'routing', 'arousal', 'working memory', 'sensory', 'coordination'],
    atlasLabels: []
  },
  {
    id: 'hypothalamus', name: 'Hypothalamus', subtitle: 'Body regulation, needs & biological rhythms', group: 'deep', color: '#c3a184',
    roles: ['Regulate hunger, thirst, and temperature', 'Coordinate endocrine and autonomic responses', 'Contribute to sleep and daily rhythms'],
    overview: 'A collection of small nuclei linking internal physiological state with behavior and pituitary hormone regulation. Distinct cell populations control different aspects of homeostasis and motivation.',
    learning: 'Internal needs change which outcomes are valuable. Hypothalamic circuits also respond to external cues that anticipate changes in the body, connecting learned predictions to physiological regulation.',
    mechanisms: [
      { name: 'Anticipatory responses to food', status: 'Supported', text: 'In mice, sensory detection of food rapidly changed activity in AgRP and POMC feeding circuits before food was consumed. This demonstrates anticipatory regulation rather than only slow feedback from nutrients.' },
      { name: 'Learning to predict bodily needs', status: 'Hypothesis', text: 'Homeostatic and allostatic accounts propose that learned cues help prepare for future needs. The teaching signals and rules differ across cell types and behaviors.' }
    ],
    connections: ['brainstem', 'insula', 'amygdala', 'nucleus-accumbens', 'basal-forebrain'],
    questions: ['How do innate drives and learned expectations combine?', 'Which signals teach a circuit that a cue predicts restoration of a bodily need?'],
    sources: [source('2015 · Food cues rapidly modulate hypothalamic circuits (mice)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4373539/'), basics],
    keywords: ['hunger', 'thirst', 'temperature', 'hormones', 'sleep', 'circadian', 'stress', 'homeostasis'],
    atlasLabels: []
  },
  {
    id: 'basal-forebrain', name: 'Basal forebrain', subtitle: 'Attention, arousal & modulation of plasticity', group: 'deep', color: '#b4b994',
    roles: ['Modulate cortical attention and state', 'Supply widespread acetylcholine projections', 'Influence learning-related plasticity'],
    overview: 'Includes cholinergic, GABAergic, and glutamatergic populations distributed across several nuclei. Different projections target cortex and hippocampal systems; acetylcholine is only part of the story.',
    learning: 'Modulatory signals can change when sensory experience induces persistent circuit changes. These signals may reflect significance, behavioral demands, or reinforcement depending on the population and task.',
    mechanisms: [
      { name: 'Enabling cortical map plasticity', status: 'Supported', text: 'Pairing nucleus basalis stimulation with tones reorganized auditory cortical representations in rats. This establishes an experimental route for regulating plasticity without identifying one universal teaching signal.' },
      { name: 'Selective gating of learning', status: 'Hypothesis', text: 'Models propose that cholinergic signals adjust the balance of incoming evidence and internal expectations, or mark events for plasticity. Projection specificity and timescale are important unresolved variables.' }
    ],
    connections: ['visual', 'auditory', 'prefrontal', 'hippocampus', 'hypothalamus'],
    questions: ['How selective are modulation signals across cortical targets?', 'Does acetylcholine carry teaching information, change learning conditions, or both?'],
    sources: [source('1998 · Nucleus basalis and cortical map reorganization (rats)', 'https://pubmed.ncbi.nlm.nih.gov/9497289/')],
    keywords: ['acetylcholine', 'attention', 'arousal', 'plasticity', 'neuromodulation', 'nucleus basalis'],
    atlasLabels: []
  },
  {
    id: 'cerebellum', name: 'Cerebellum', subtitle: 'Coordination, prediction & adaptation', group: 'cerebellum', color: '#7cae9e',
    roles: ['Coordinate and time movements', 'Adapt behavior to prediction errors', 'Contribute to cognitive processing through cortical loops'],
    overview: 'Cerebellar cortex and deep nuclei form highly organized circuits. Different territories interact with motor and nonmotor cortical systems, so its function extends beyond balance and coordination.',
    learning: 'A central system for studying error-driven adaptation. Multiple plasticity sites and input signals contribute, and motor adaptation is not equivalent to every form of skill learning.',
    mechanisms: [
      { name: 'Climbing-fiber-associated teaching signals', status: 'Supported', text: 'In monkey eye-movement learning, Purkinje-cell complex spikes were linked to subsequent changes in simple-spike activity and behavior. This supports a teaching role in a specific circuit and task.' },
      { name: 'Internal models and predictive control', status: 'Hypothesis', text: 'Computational accounts propose that cerebellar circuits learn predictions useful for control. Whether a common learning principle explains motor and cognitive cerebellar functions remains unsettled.' }
    ],
    connections: ['motor', 'premotor', 'thalamus', 'brainstem', 'prefrontal'],
    questions: ['What is taught by climbing fibers in different tasks?', 'How are credit and timing distributed across cerebellar plasticity sites?'],
    sources: [source('2008 · Complex spikes, plasticity, and motor learning (monkeys)', 'https://www.nature.com/articles/nn.2197')],
    keywords: ['coordination', 'balance', 'timing', 'motor adaptation', 'prediction error', 'Purkinje', 'internal model'],
    atlasLabels: []
  },
  {
    id: 'dopamine-midbrain', name: 'Midbrain dopamine nuclei', subtitle: 'Substantia nigra & VTA · learning and motivation', group: 'brainstem', color: '#c7b17d',
    roles: ['Modulate striatal and cortical circuits', 'Signal aspects of reward prediction', 'Influence motivation and movement'],
    overview: 'This schematic group highlights substantia nigra pars compacta and the ventral tegmental area. Dopamine neurons are heterogeneous in targets and response properties. Substantia nigra pars reticulata is a distinct, mainly GABAergic output structure.',
    learning: 'Phasic dopamine activity can provide information related to better- or worse-than-expected outcomes. Its relationship to movement, motivation, and learning depends on the circuit.',
    mechanisms: [
      { name: 'Reward-prediction-error-like responses', status: 'Supported', text: 'Primate electrophysiology identified dopamine responses consistent with unexpected reward and reward omission. This foundational finding supports prediction-error models without implying that every dopamine neuron carries the same scalar signal.' },
      { name: 'Temporal-difference teaching signal', status: 'Hypothesis', text: 'Reinforcement-learning models interpret some dopamine activity as an error used to update future reward predictions. State representation, heterogeneous signals, and local receptor effects complicate the mapping.' }
    ],
    connections: ['striatum', 'nucleus-accumbens', 'prefrontal', 'amygdala', 'hippocampus'],
    questions: ['How are heterogeneous dopamine signals combined by target circuits?', 'How does a broad modulatory signal modify the synapses responsible for an outcome?'],
    sources: [source('1997 · A neural substrate of prediction and reward', 'https://pubmed.ncbi.nlm.nih.gov/9054347/'), source('2005 · Quantitative reward prediction errors (primates)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC1564381/')],
    keywords: ['dopamine', 'substantia nigra', 'VTA', 'prediction error', 'reward', 'reinforcement learning', 'credit assignment'],
    atlasLabels: []
  },
  {
    id: 'brainstem', name: 'Brainstem', subtitle: 'Life-sustaining control & brain state', group: 'brainstem', color: '#95aaa4',
    roles: ['Regulate breathing and cardiovascular activity', 'Support sleep–wake and arousal control', 'Route sensory, motor, and autonomic signals'],
    overview: 'The midbrain, pons, and medulla contain many distinct nuclei and pathways. This broad entry provides orientation; dopamine nuclei, locus coeruleus, and raphe are separately selectable schematic structures.',
    learning: 'Learning depends on bodily state, arousal, sensory input, and movement control. Brainstem circuits contribute to these conditions and to specific adaptive reflexes, rather than implementing a single general learning algorithm.',
    mechanisms: [
      { name: 'State-dependent circuit operation', status: 'Supported', text: 'Brainstem systems regulate arousal and basic physiology, changing the conditions in which cortical and subcortical processing occurs. This organizational fact does not specify a single synaptic learning mechanism.' },
      { name: 'Coordinated modulation across systems', status: 'Hypothesis', text: 'One systems-level question is whether distinct modulatory populations coordinate learning across timescales or optimize partially different objectives. This cannot be answered by treating the brainstem as one uniform area.' }
    ],
    connections: ['hypothalamus', 'cerebellum', 'thalamus', 'motor', 'locus-coeruleus', 'raphe', 'dopamine-midbrain'],
    questions: ['How do physiological state and learning demands jointly shape modulation?', 'Which adaptive changes are local to brainstem circuits versus inherited from upstream input?'],
    sources: [basics, source('NINDS · Understanding sleep', 'https://www.ninds.nih.gov/health-information/public-education/brain-basics/brain-basics-understanding-sleep')],
    keywords: ['breathing', 'heart rate', 'arousal', 'sleep', 'pons', 'medulla', 'midbrain', 'reflex'],
    atlasLabels: []
  },
  {
    id: 'locus-coeruleus', name: 'Locus coeruleus', subtitle: 'Noradrenaline, arousal & memory modulation', group: 'brainstem', color: '#a6b8c4',
    roles: ['Modulate arousal and attention', 'Respond to behaviorally significant events', 'Influence persistence of memories'],
    overview: 'A small pontine nucleus with widespread noradrenergic projections. Its neurons and projection targets are more differentiated than a single global alertness signal would suggest.',
    learning: 'Novelty and arousal can influence which experiences persist. Locus-coeruleus activity affects target-circuit plasticity, and its effects depend on timing, receptors, and brain state.',
    mechanisms: [
      { name: 'Novelty-related memory enhancement', status: 'Supported', text: 'Mouse experiments implicated locus-coeruleus activity in enhanced retention after novelty, with hippocampal dopamine-receptor involvement. This does not imply that all locus-coeruleus effects are dopaminergic or established in humans.' },
      { name: 'Adaptive gain and learning-rate control', status: 'Hypothesis', text: 'Computational accounts propose modulation of neural gain, exploration, or belief updating during change. These accounts overlap and need circuit-specific tests.' }
    ],
    connections: ['hippocampus', 'prefrontal', 'anterior-cingulate', 'thalamus', 'cerebellum'],
    questions: ['Which projection populations signal novelty, uncertainty, or action?', 'How does timing determine whether arousal strengthens or disrupts learning?'],
    sources: [source('2016 · Locus coeruleus and memory consolidation (mice)', 'https://www.nature.com/articles/nature19325')],
    keywords: ['noradrenaline', 'norepinephrine', 'novelty', 'arousal', 'attention', 'learning rate', 'neuromodulation'],
    atlasLabels: []
  },
  {
    id: 'raphe', name: 'Raphe nuclei', subtitle: 'Serotonin, behavioral persistence & state regulation', group: 'brainstem', color: '#b19db9',
    roles: ['Supply widespread serotonin modulation', 'Influence behavioral persistence and flexibility', 'Contribute to sleep, affect, and bodily regulation'],
    overview: 'A family of brainstem nuclei containing serotonergic and nonserotonergic cells. Dorsal, median, and caudal raphe populations have different projections and functions; serotonin is not simply a happiness signal.',
    learning: 'Serotonergic circuits can change how an organism waits, adapts, or responds to outcomes. Effects depend strongly on cell populations, receptor types, and task context.',
    mechanisms: [
      { name: 'Waiting for delayed rewards', status: 'Supported', text: 'Optogenetic activation of dorsal-raphe serotonin neurons increased waiting in a mouse delayed-reward task. This provides causal evidence for that behavior, not a universal account of serotonin function.' },
      { name: 'Confidence in future reward', status: 'Hypothesis', text: 'A Bayesian model interprets some waiting effects as increased expectation that reward will arrive. Reward probability and timing change the observed effect, leaving room for alternative computations.' }
    ],
    connections: ['prefrontal', 'striatum', 'hippocampus', 'amygdala', 'hypothalamus'],
    questions: ['How do serotonin populations differ in their roles during learning?', 'When does persistence reflect altered reward expectation versus action control?'],
    sources: [source('2014 · Serotonin-neuron activation and waiting (mice)', 'https://pubmed.ncbi.nlm.nih.gov/25155504/'), source('2018 · Reward probability, timing, and patience', 'https://www.nature.com/articles/s41467-018-04496-y')],
    keywords: ['serotonin', '5-HT', 'patience', 'waiting', 'mood', 'flexibility', 'neuromodulation'],
    atlasLabels: []
  }
];

export const LEARNING_PATHS = [
  {
    id: 'experience', title: 'Remember a new experience', subtitle: 'From a moment to useful knowledge',
    description: 'Explore a conceptual set of interacting systems involved in episodic learning and generalization. The steps are an explanatory tour, not a complete temporal sequence or a validated simulation.',
    steps: [
      { regionId: 'temporal', title: 'Represent what happened', text: 'Sensory and association cortex supply information about objects, people, and meanings. Representations are already shaped by past experience.' },
      { regionId: 'parahippocampal', title: 'Situate the experience', text: 'Context-related circuits contribute information about the scene and situation. Context can distinguish otherwise similar events.' },
      { regionId: 'hippocampus', title: 'Bind a distinct episode', text: 'Hippocampal circuits rapidly relate the elements of an event. Subfield-specific separation and completion are candidate computations, not a single established algorithm.' },
      { regionId: 'locus-coeruleus', title: 'Modulate what persists', text: 'Novelty and arousal can influence retention through modulatory pathways. This interacts with encoding rather than occurring at a fixed fourth step.' },
      { regionId: 'prefrontal', title: 'Integrate and use knowledge', text: 'Cortical–hippocampal interactions support using past experience for current goals. Complementary-learning-system models propose ways replay could support generalization over time.' }
    ]
  },
  {
    id: 'skill', title: 'Learn a movement', subtitle: 'Practice, feedback & a more reliable skill',
    description: 'Follow complementary contributions to motor learning. Adaptation, skill acquisition, and habit formation are related but distinct; these regions interact recurrently rather than as a fixed chain.',
    steps: [
      { regionId: 'parietal', title: 'Map the task into action space', text: 'Sensory and body-state information helps define the target and movement conditions. Improved performance may reflect better interpretation of that information.' },
      { regionId: 'premotor', title: 'Prepare an action', text: 'Premotor populations help link the current cue and goal to a candidate movement. New cue–action mappings evolve with experience.' },
      { regionId: 'motor', title: 'Practice the movement', text: 'Motor cortex participates in executing and refining the skill. Animal studies reveal lasting synaptic changes associated with practice.' },
      { regionId: 'cerebellum', title: 'Use feedback to adapt', text: 'Cerebellar loops can support learning from discrepancies between predicted and observed sensory consequences. Such adaptation explains part of motor learning, not all of it.' },
      { regionId: 'striatum', title: 'Shape selection over repetitions', text: 'Basal-ganglia circuits help actions become more effective and, under some conditions, habitual. Outcome-sensitive control can remain active alongside practiced routines.' }
    ]
  },
  {
    id: 'reward', title: 'Adapt when rewards change', subtitle: 'Prediction, feedback & credit assignment',
    description: 'Explore a reinforcement-learning interpretation of adaptive choice. The interpretation connects findings to candidate computations and does not imply a single brain-wide reward signal.',
    steps: [
      { regionId: 'orbitofrontal', title: 'Infer the current situation', text: 'A cue can have different meaning after the environment changes. Task-state representations may help determine which previous predictions still apply.' },
      { regionId: 'dopamine-midbrain', title: 'Evaluate an unexpected outcome', text: 'Some dopamine responses resemble reward prediction errors. Responses differ across populations, targets, and tasks.' },
      { regionId: 'striatum', title: 'Update action tendencies', text: 'Dopamine-modulated plasticity is a candidate route for changing future choices. Identifying the responsible action after delayed feedback remains a central credit-assignment problem.' },
      { regionId: 'nucleus-accumbens', title: 'Connect learning with motivation', text: 'Previously learned cues influence effort and engagement according to current needs. Knowing an outcome and being motivated to pursue it are distinguishable processes.' },
      { regionId: 'anterior-cingulate', title: 'Decide whether to persist or change', text: 'Action–outcome history and behavioral demands contribute to adjustment. Competing models emphasize value, control, uncertainty, or exploration.' }
    ]
  }
];
