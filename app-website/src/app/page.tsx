// src/app/page.tsx
"use client"; // Enable client-side rendering for state management
import React, { useState, useEffect } from "react";
import GrokTile from "../components/GrokTile";
import GrokTileViewer from "../components/GrokTileViewer";
import { ChatData } from "@/types/chatData";

export default function Home() {
  const [tiles, setTiles] = useState<ChatData[]>([]);
  const [selectedTile, setSelectedTile] = useState<ChatData | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    const extensionInstalled = (window as any).grokExtensionInstalled === true;

    if (extensionInstalled) {
      const handleMessage = (event: MessageEvent) => {
        if (event.source !== window || !event.data) {
          return;
        }
        switch (event.data.type) {
          case "chatDataResponse":
            if (event.data.data) {
              setTiles(event.data.data);
            } else {
              console.warn("No data received from extension.");
            }
            break;
          case "deleteChatResponse":
            window.postMessage({ type: "getChatData" }, "*");
            break;
          default:
            console.warn(`Unhandled message type: ${event.data.type}`);
        }
      };

      window.addEventListener("message", handleMessage);
      window.postMessage({ type: "getChatData" }, "*");

      return () => {
        window.removeEventListener("message", handleMessage);
      };
    } else {
      setIsTestMode(true);
      setTiles(getTestData());
    }
  }, []);

  const onDelete = (tile: ChatData) => {
    if (isTestMode) {
      // Handle deletion locally in test mode
      setTiles(tiles.filter((t) => t.id !== tile.id));
    } else {
      // Use extension for deletion if available
      window.postMessage({ type: "deleteChat", data: tile }, "*");
    }
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-8 flex flex-col items-center relative">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((tile) => (
          <GrokTile
            key={tile.id}
            chatData={tile}
            onDelete={() => onDelete(tile)}
            onClick={() => setSelectedTile(tile)}
          />
        ))}
      </div>
      {selectedTile && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          onClick={() => setSelectedTile(null)}
        >
          <div className="" onClick={(e) => e.stopPropagation()}>
            <GrokTileViewer chatData={selectedTile} />
          </div>
        </div>
      )}
      <footer className="mt-auto text-center text-sm text-[#8b949e] py-4">
        View and manage your exports.
      </footer>
    </main>
  );
}

function getTestData(): ChatData[] {
  const testData: ChatData[] = [
    {
      id: "chat-001",
      title: "Inquiry on Machine Learning Basics",
      responses: [
        "What is machine learning and how can I get started?",
        "Machine learning is a subset of artificial intelligence that enables systems to learn from data and improve performance over time without explicit programming. It involves algorithms that can identify patterns and make decisions based on input data. Common types include supervised learning, where models are trained on labeled data, unsupervised learning for finding hidden patterns in unlabeled data, and reinforcement learning, which focuses on decision-making through rewards and penalties. To get started, begin with understanding basic concepts like data preprocessing, model training, and evaluation metrics such as accuracy, precision, and recall.",
        "Can you recommend some resources for beginners?",
        "For beginners, I recommend starting with Andrew Ng's Machine Learning course on Coursera, which provides a solid foundation in both theory and practical applications. Additionally, the book 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow' by Aurélien Géron offers hands-on tutorials and code examples. Online platforms like Kaggle provide datasets and competitions to practice, while fast.ai offers free courses with a focus on deep learning using PyTorch.",
        "What are some common algorithms I should learn first?",
        "Start with linear regression for regression tasks, which models the relationship between variables using a straight line. Logistic regression is useful for binary classification problems. Decision trees are intuitive for both classification and regression, splitting data based on feature values. Then, move to ensemble methods like random forests, which combine multiple decision trees to improve accuracy and reduce overfitting. Support vector machines are effective for high-dimensional data classification.",
        "How important is programming knowledge in machine learning?",
        "Programming knowledge is essential in machine learning as it allows you to implement algorithms, manipulate data, and build models. Python is the most popular language due to its simplicity and extensive libraries like NumPy for numerical computations, Pandas for data analysis, and Scikit-learn for machine learning tools. Familiarity with version control using Git and environments like Jupyter Notebooks will also enhance your workflow.",
        "Tell me about data preprocessing steps.",
        "Data preprocessing is crucial for model performance and includes handling missing values by imputation or removal, encoding categorical variables using techniques like one-hot encoding, scaling features with standardization or normalization to ensure equal contribution, and splitting data into training and testing sets to evaluate model generalization. Feature engineering, such as creating new variables from existing ones, can also significantly improve results.",
        "What tools are commonly used for machine learning projects?",
        "Common tools include Python libraries like TensorFlow and Keras for deep learning, PyTorch for flexible neural network building, and Scikit-learn for classical algorithms. For data visualization, Matplotlib and Seaborn are popular. Cloud platforms like Google Colab provide free GPU access, while AWS SageMaker or Google AI Platform offer scalable infrastructure for larger projects.",
        "How do I evaluate a machine learning model?",
        "Model evaluation depends on the task: for classification, use metrics like accuracy, precision, recall, F1-score, and ROC-AUC. For regression, mean squared error (MSE), root mean squared error (RMSE), and R-squared are standard. Cross-validation techniques, such as k-fold, help assess performance on unseen data. Confusion matrices visualize classification errors, and learning curves detect underfitting or overfitting.",
        "What are some real-world applications of machine learning?",
        "Machine learning powers recommendation systems on platforms like Netflix and Amazon, fraud detection in banking, autonomous vehicles using computer vision, natural language processing in chatbots and translators, and predictive maintenance in manufacturing. In healthcare, it's used for disease diagnosis from medical images and personalized treatment recommendations based on patient data.",
        "Can you explain overfitting and how to prevent it?",
        "Overfitting occurs when a model learns noise in the training data rather than underlying patterns, leading to poor generalization on new data. To prevent it, use regularization techniques like L1 or L2 penalties, dropout in neural networks, early stopping during training, and data augmentation to increase dataset variety. Simplifying the model architecture and gathering more diverse training data also help.",
      ],
    },
    {
      id: "chat-002",
      title: "Discussion on Climate Change Impacts",
      responses: [
        "Explain climate change and its main impacts.",
        "Climate change refers to long-term shifts in temperature and weather patterns, primarily driven by human activities such as burning fossil fuels, deforestation, and industrial processes that release greenhouse gases like carbon dioxide and methane. These gases trap heat in the atmosphere, leading to global warming. Main impacts include rising sea levels due to melting polar ice caps and glaciers, which threaten coastal communities with increased flooding and erosion.",
        "What are some mitigation strategies?",
        "Mitigation strategies aim to reduce greenhouse gas emissions and include transitioning to renewable energy sources like solar, wind, and hydroelectric power to replace fossil fuels. Enhancing energy efficiency in buildings, transportation, and industries through better insulation, electric vehicles, and smart grids is crucial. Implementing carbon pricing mechanisms, such as taxes or cap-and-trade systems, incentivizes emission reductions. Reforestation and sustainable agriculture practices also play key roles in sequestering carbon.",
        "How does climate change affect biodiversity?",
        "Climate change disrupts ecosystems by altering habitats, leading to species migration, extinction risks, and loss of biodiversity. Warmer temperatures shift plant and animal ranges poleward or to higher elevations, while ocean acidification from absorbed CO2 harms marine life like coral reefs and shellfish. Extreme weather events, such as droughts and wildfires, destroy habitats, and changing precipitation patterns affect food and water availability for wildlife.",
        "What role do governments play in addressing climate change?",
        "Governments set policies and regulations to limit emissions, such as the Paris Agreement's commitments to keep global warming below 2°C. They invest in research and development for clean technologies, provide subsidies for renewables, and enforce environmental standards. International cooperation through organizations like the UN facilitates knowledge sharing and funding for developing countries. National adaptation plans help build resilience against impacts like sea-level rise and extreme weather.",
        "Tell me about adaptation measures.",
        "Adaptation measures involve adjusting to current and future climate impacts, such as building sea walls and levees to protect against flooding, developing drought-resistant crops for agriculture, and improving water management systems like reservoirs and efficient irrigation. Urban planning incorporates green infrastructure, like parks and permeable surfaces, to reduce heat islands and manage stormwater. Early warning systems for extreme weather events save lives and reduce economic losses.",
        "How is climate change linked to human health?",
        "Climate change exacerbates health risks through heatwaves causing heat-related illnesses, increased air pollution worsening respiratory conditions, and the spread of vector-borne diseases like malaria and dengue due to expanded mosquito habitats. Extreme weather events lead to injuries, mental health issues, and food insecurity from disrupted agriculture. Vulnerable populations, including the elderly, children, and low-income communities, are disproportionately affected.",
        "What are the economic consequences of climate change?",
        "Economic consequences include damages from natural disasters like hurricanes and floods, costing billions in repairs and lost productivity. Agriculture yields decline due to changing weather, leading to higher food prices. Insurance premiums rise with increased risks, and tourism suffers in affected areas like ski resorts or coral reefs. However, transitioning to a green economy creates jobs in renewables and efficiency sectors.",
        "Can individuals make a difference in combating climate change?",
        "Individuals can contribute by reducing personal carbon footprints through energy-efficient appliances, using public transport or cycling, and adopting plant-based diets to lower methane emissions from livestock. Supporting sustainable products, recycling, and conserving water are effective. Advocacy for policy changes, voting for environmentally conscious leaders, and participating in community initiatives amplify impact.",
        "What progress has been made globally?",
        "Global progress includes the adoption of the Paris Agreement by nearly all countries, with many setting net-zero emission targets by 2050. Renewable energy capacity has surged, with solar and wind becoming cost-competitive. Deforestation rates have slowed in some regions due to conservation efforts. However, emissions continue to rise, and challenges remain in equitable transition and meeting financial commitments to developing nations.",
        "How does ocean warming contribute to climate change effects?",
        "Ocean warming absorbs over 90% of excess heat, leading to thermal expansion that contributes to sea-level rise. It disrupts marine ecosystems, causing coral bleaching and shifts in fish populations, affecting fisheries and food security. Warmer waters intensify hurricanes and typhoons by providing more energy. Acidification impairs shell formation in marine organisms, impacting the food chain from plankton to whales.",
      ],
    },
    {
      id: "chat-003",
      title: "Advice on Productivity Techniques",
      responses: [
        "What are some effective productivity techniques?",
        "Effective productivity techniques include the Pomodoro method, which involves working in focused 25-minute intervals followed by 5-minute breaks to maintain concentration and prevent burnout. The Eisenhower Matrix helps prioritize tasks by categorizing them based on urgency and importance, allowing you to focus on what truly matters. Time blocking schedules specific times for tasks, reducing decision fatigue and ensuring dedicated focus periods.",
        "Any additional tips for maintaining a routine?",
        "Maintaining a consistent routine involves setting daily goals, starting with the most challenging tasks during peak energy hours, and using tools like calendars or apps such as Todoist for reminders. Minimize distractions by creating a dedicated workspace, turning off notifications, and employing website blockers during work sessions. Regular reviews of progress, perhaps weekly, help adjust strategies and celebrate achievements.",
        "How can I deal with procrastination?",
        "To combat procrastination, break tasks into smaller, manageable steps to reduce overwhelm, and use the two-minute rule: if a task takes less than two minutes, do it immediately. Set specific deadlines and accountability measures, like sharing goals with a colleague or using apps that track habits. Reward yourself after completing tasks to build positive associations, and reflect on underlying reasons for delay, such as fear of failure.",
        "What role does goal setting play in productivity?",
        "Goal setting provides direction and motivation, using frameworks like SMART (Specific, Measurable, Achievable, Relevant, Time-bound) to create clear objectives. Breaking long-term goals into short-term milestones tracks progress and maintains momentum. Regularly revisiting and adjusting goals ensures alignment with changing priorities, while visualizing success can enhance commitment and focus.",
        "Tell me about tools and apps for productivity.",
        "Popular tools include Trello or Asana for project management with visual boards and task assignments, Notion for integrated notes, databases, and wikis, and Focus@Will for background music designed to boost concentration. Time tracking apps like RescueTime monitor usage patterns, while Habitica gamifies habit building. Choose tools that fit your workflow to avoid overwhelming yourself with too many options.",
        "How important is work-life balance for productivity?",
        "Work-life balance is crucial as it prevents exhaustion and sustains long-term productivity. Incorporate regular breaks, exercise, and hobbies to recharge. Set boundaries, like designated work hours, and prioritize sleep for cognitive function. Mindfulness practices, such as meditation, reduce stress and improve focus, ensuring you remain effective without sacrificing well-being.",
        "What techniques help with focus and concentration?",
        "Techniques for focus include mindfulness meditation to train attention, the Feynman technique of explaining concepts simply to deepen understanding, and environmental adjustments like natural lighting and ergonomic setups. Batching similar tasks reduces context switching, and the 4-7-8 breathing method can quickly calm the mind. Limiting multitasking preserves mental energy for deep work.",
        "How can I improve my time management skills?",
        "Improve time management by auditing your current usage with logs, identifying time sinks, and applying the 80/20 rule (Pareto Principle) to focus on high-impact activities. Delegate or outsource non-essential tasks, and use techniques like the ABC method to rank priorities. Continuous learning through books like 'Getting Things Done' by David Allen provides advanced strategies.",
        "What are some strategies for team productivity?",
        "For teams, foster clear communication with regular check-ins and tools like Slack or Microsoft Teams. Implement agile methodologies with sprints and retrospectives for iterative progress. Encourage collaboration through shared goals and recognition of contributions. Training in time management and providing resources for work-life balance enhance overall team efficiency.",
        "How does physical health affect productivity?",
        "Physical health directly impacts productivity through energy levels, cognitive function, and mood. Regular exercise boosts endorphins and improves focus, while a balanced diet provides sustained energy without crashes. Adequate sleep enhances memory consolidation and problem-solving. Hydration and posture also play roles in maintaining alertness and preventing fatigue-related errors.",
      ],
    },
    {
      id: "chat-004",
      title: "Overview of Quantum Computing",
      responses: [
        "Tell me about quantum computing.",
        "Quantum computing harnesses principles of quantum mechanics, such as superposition, where qubits can represent multiple states simultaneously, and entanglement, linking qubits for instantaneous correlations. This enables solving complex problems exponentially faster than classical computers for tasks like factoring large numbers or simulating molecular interactions. Unlike classical bits (0 or 1), qubits allow parallel computations, but quantum systems are fragile and require error correction.",
        "What are its current applications?",
        "Current applications are emerging in cryptography, where quantum algorithms like Shor's could break RSA encryption, prompting post-quantum cryptography development. In drug discovery, quantum simulations model molecular behaviors accurately for faster pharmaceutical design. Optimization problems in logistics and finance benefit from quantum annealing, as seen with D-Wave systems. Machine learning enhancements through quantum neural networks are also being explored.",
        "Who are the leading companies in quantum computing?",
        "Leading companies include IBM with its Quantum Experience platform and superconducting qubits, Google achieving quantum supremacy with Sycamore processor, and Microsoft developing topological qubits for stability. IonQ uses trapped ions for scalable systems, while Rigetti focuses on hybrid quantum-classical computing. Governments and institutions like China's USTC and the EU's Quantum Flagship also drive advancements.",
        "What challenges does quantum computing face?",
        "Challenges include qubit decoherence, where quantum states collapse due to environmental interference, requiring cryogenic temperatures and isolation. Error rates are high, necessitating quantum error correction codes that consume many qubits. Scalability to thousands of qubits is difficult, and developing practical algorithms beyond proofs-of-concept remains ongoing. High costs and specialized expertise limit accessibility.",
        "How does quantum computing differ from classical computing?",
        "Quantum computing differs by using qubits that exploit superposition and entanglement for parallel processing, solving certain problems like optimization and simulation more efficiently. Classical computing relies on binary bits and sequential operations, excelling in general tasks but struggling with exponential complexity. Quantum computers are not replacements but complements, best for specific intractable problems.",
        "What is quantum supremacy?",
        "Quantum supremacy is the milestone where a quantum computer performs a calculation infeasible for classical supercomputers in reasonable time. Google claimed it in 2019 with a task taking 200 seconds on their quantum processor versus 10,000 years classically, though debated. It demonstrates potential but doesn't imply practical superiority yet, as real-world applications require error-corrected, scalable systems.",
        "Tell me about quantum algorithms.",
        "Key quantum algorithms include Grover's for unstructured search, speeding up database queries quadratically, and Shor's for factoring integers, threatening current encryption. Quantum approximate optimization algorithm (QAOA) tackles combinatorial problems, while variational quantum eigensolver (VQE) aids in chemistry simulations. These leverage quantum parallelism but require hybrid approaches with classical computers for noise mitigation.",
        "What hardware approaches are there in quantum computing?",
        "Hardware approaches include superconducting circuits (IBM, Google) for fast operations at near-absolute zero, trapped ions (IonQ) for high fidelity and connectivity, photonic systems using light for room-temperature operation, and topological qubits (Microsoft) for inherent error resistance. Each has trade-offs in scalability, coherence time, and gate speed, with no clear winner yet.",
        "How is quantum computing impacting AI?",
        "Quantum computing enhances AI by accelerating training of machine learning models through faster linear algebra operations, like matrix inversions in quantum versions of support vector machines. It enables better optimization in neural networks and handles high-dimensional data more efficiently. Quantum-inspired algorithms also improve classical AI, but full integration awaits mature quantum hardware.",
        "What future developments can we expect?",
        "Future developments include achieving fault-tolerant quantum computing with logical qubits, enabling longer computations. Increased qubit counts and better connectivity will allow more complex algorithms. Integration with cloud services democratizes access, while standards for quantum-safe cryptography emerge. Breakthroughs in materials science may extend coherence times, paving the way for practical applications in the next decade.",
      ],
    },
    {
      id: "chat-005",
      title: "Tips for Healthy Eating Habits",
      responses: [
        "How can I develop healthy eating habits?",
        "Developing healthy eating habits starts with balancing macronutrients—proteins for muscle repair, carbohydrates for energy, and fats for hormone production—while incorporating a rainbow of fruits and vegetables for vitamins and minerals. Practice portion control using smaller plates and mindful eating to recognize hunger cues. Stay hydrated with at least eight glasses of water daily, and limit processed foods high in sugars, salts, and unhealthy fats.",
        "How to sustain them long-term?",
        "To sustain habits long-term, set realistic goals and track progress with a food journal or app like MyFitnessPal. Meal prepping ensures healthy options are readily available, reducing impulse choices. Involve family or friends for support, and allow occasional treats to prevent burnout. Educate yourself on nutrition labels to make informed decisions, and consult professionals for personalized plans.",
        "What are some nutritious meal ideas?",
        "Nutritious meals include a breakfast of oatmeal with berries, nuts, and yogurt for fiber and antioxidants; lunch as a grilled chicken salad with mixed greens, avocado, and vinaigrette for lean protein and healthy fats; dinner of baked salmon, quinoa, and steamed broccoli for omega-3s and complex carbs. Snacks like apple slices with almond butter provide sustained energy without spikes.",
        "How does diet affect mental health?",
        "Diet influences mental health through nutrient intake: omega-3 fatty acids in fish support brain function and reduce depression risk, while complex carbs in whole grains stabilize mood via serotonin production. Antioxidants from fruits combat oxidative stress, and gut-healthy foods like yogurt with probiotics link to better emotional regulation. Deficiencies in vitamins like B12 can lead to fatigue and anxiety.",
        "What role does exercise play in healthy eating?",
        "Exercise complements healthy eating by increasing metabolism, building muscle mass which burns more calories, and improving insulin sensitivity for better nutrient utilization. It enhances mood through endorphins, encouraging consistent habits. Pairing workouts with proper fueling, like carbs before and protein after, optimizes performance and recovery, creating a synergistic effect for overall health.",
        "Tell me about common dietary myths.",
        "Common myths include carbs being inherently bad—complex carbs are essential for energy; all fats are unhealthy—avocados and nuts provide beneficial ones; detox diets cleanse the body—livers and kidneys naturally detoxify; eating after 8 PM causes weight gain—total calories matter more than timing; and gluten-free is healthier for all—only necessary for those with intolerances or celiac disease.",
        "How can I manage cravings effectively?",
        "Manage cravings by identifying triggers like stress or boredom and addressing them with alternatives like walking or hobbies. Opt for healthier swaps, such as fruit for sweets or nuts for chips. Ensure balanced meals to stabilize blood sugar, preventing spikes that fuel cravings. Hydration often masks as hunger, so drink water first. Mindful practices help distinguish emotional from physical hunger.",
        "What are the benefits of plant-based diets?",
        "Plant-based diets reduce chronic disease risks like heart disease and diabetes through high fiber, antioxidants, and lower saturated fats. They promote weight management with lower calorie density and support environmental sustainability by reducing resource use. Improved digestion from fiber-rich foods and potential longevity benefits are noted, though careful planning ensures adequate protein, iron, and B12 intake.",
        "How important is reading nutrition labels?",
        "Reading nutrition labels is vital for informed choices, revealing hidden sugars, sodium, and additives. Check serving sizes to avoid underestimating intake, prioritize whole ingredients over long lists, and compare products for better options. Understanding daily values helps meet nutritional needs, while spotting allergens protects health. It empowers control over diet quality and portion awareness.",
        "What strategies help with grocery shopping for healthy eating?",
        "Strategies include making a list based on planned meals to avoid impulse buys, shopping the perimeter for fresh produce, meats, and dairy while limiting inner aisles for processed items. Choose whole grains over refined, opt for low-sodium canned goods, and buy seasonal produce for freshness and cost savings. Read labels for informed decisions, and shop on a full stomach to resist temptations.",
      ],
    },
    {
      id: "chat-006",
      title: "History of the Roman Empire",
      responses: [
        "What is the history of the Roman Empire?",
        "The Roman Empire originated from the Roman Republic, which was established around 509 BCE after the overthrow of the monarchy. It expanded through conquests, reaching its peak under Emperor Trajan in the 2nd century CE, encompassing territories from Britain to the Middle East. Key periods include the Principate, initiated by Augustus in 27 BCE, focusing on imperial rule disguised as republican governance, and the Dominate from the 3rd century, marked by absolute monarchy. The empire's fall in the West occurred in 476 CE with the deposition of Romulus Augustulus, while the Eastern Byzantine Empire persisted until 1453.",
        "Who were some key emperors?",
        "Key emperors include Augustus, who founded the empire and ushered in the Pax Romana, a period of relative peace and prosperity lasting about 200 years. Trajan expanded the empire to its greatest extent and is remembered for public works. Hadrian consolidated borders, building Hadrian's Wall in Britain. Marcus Aurelius, a philosopher-emperor, faced invasions and wrote 'Meditations.' Constantine the Great legalized Christianity and moved the capital to Constantinople, shifting the empire's focus eastward.",
        "What caused the fall of the Western Roman Empire?",
        "The fall of the Western Roman Empire resulted from a combination of internal and external factors, including economic decline due to overreliance on slave labor and inflation, political instability with frequent usurpations and weak leadership, military overextension straining resources, and barbarian invasions by groups like the Visigoths, who sacked Rome in 410 CE, and the Vandals. The deposition of the last emperor by Odoacer in 476 CE marked the conventional end.",
        "How did Roman culture influence the world?",
        "Roman culture profoundly influenced the world through advancements in law, with the Twelve Tables and Justinian's Code forming the basis of many legal systems. Architecture featured innovations like arches, domes, and concrete, seen in structures such as the Colosseum and Pantheon. Latin evolved into Romance languages, and literature by authors like Virgil and Cicero shaped Western thought. Engineering feats, including aqueducts and roads, facilitated trade and communication, while the spread of Christianity under Roman rule globalized the religion.",
        "Tell me about Roman military strategies.",
        "Roman military strategies emphasized discipline, organization, and engineering. Legions, composed of professional soldiers, used formations like the testudo for protection against projectiles. They built fortified camps during campaigns and employed siege warfare with machines like ballistae and battering rams. Divide-and-conquer tactics subdued enemies, and a network of roads enabled rapid troop movements. Training focused on endurance and combat skills, contributing to Rome's dominance.",
        "What was daily life like in ancient Rome?",
        "Daily life in ancient Rome varied by social class: patricians enjoyed luxuries in villas, attending banquets and theater, while plebeians lived in insulae apartments, working as artisans or farmers. Meals included bread, olives, and wine; public baths served as social hubs. Education for boys involved rhetoric and grammar, and entertainment featured gladiatorial games and chariot races at the Circus Maximus. Slavery was integral, with slaves performing household and labor duties.",
        "How did the Roman Empire contribute to science and technology?",
        "Contributions to science and technology included advancements in engineering, such as the arch and vault in architecture, and hydraulic systems in aqueducts. Medicine progressed with Galen’s anatomical studies and emphasis on diet and exercise. Astronomy benefited from Ptolemy’s geocentric model. Practical innovations like the watermill for grinding grain and hypocaust heating systems improved daily life. Roman roads, built with layered construction, facilitated trade and military efficiency.",
        "What role did religion play in Roman society?",
        "Religion in Roman society was polytheistic, with gods like Jupiter, Mars, and Venus worshipped through rituals and festivals. The state religion integrated with politics, where emperors were deified posthumously. Household gods (Lares) protected families, and augurs interpreted omens for decisions. The adoption of Christianity under Constantine marked a shift, leading to its establishment as the official religion by Theodosius I in 380 CE, influencing moral and legal frameworks.",
        "How is the Roman Empire studied today?",
        "The Roman Empire is studied through archaeology, excavating sites like Pompeii preserved by Vesuvius' eruption, revealing artifacts and structures. Historiography analyzes texts by Tacitus, Suetonius, and Livy for insights into events and figures. Epigraphy examines inscriptions on monuments, while numismatics studies coins for economic and political history. Modern technologies like GIS mapping and DNA analysis enhance understanding of trade routes and migrations.",
        "What lessons can we learn from the Roman Empire?",
        "Lessons from the Roman Empire include the importance of adaptable governance, as rigid structures contributed to decline, and the risks of overexpansion straining resources. Civic infrastructure investments, like roads and public works, foster prosperity. The integration of diverse cultures promoted stability but required inclusive policies. Finally, the transition from republic to empire warns of power concentration leading to corruption and instability.",
      ],
    },
    {
      id: "chat-007",
      title: "Basics of Stock Investing",
      responses: [
        "What are the basics of stock investing?",
        "Stock investing involves purchasing shares of companies, representing ownership stakes, to potentially earn returns through price appreciation and dividends. Key concepts include understanding stock exchanges like NYSE or NASDAQ, where shares are traded. Investors analyze fundamentals such as earnings, revenue, and P/E ratios, or use technical analysis of price charts. Diversification across sectors reduces risk, and long-term strategies like buy-and-hold contrast with short-term trading.",
        "How do I choose stocks to invest in?",
        "Choosing stocks requires research: evaluate company financials, including balance sheets for assets and liabilities, income statements for profitability, and cash flow for liquidity. Consider industry trends, competitive advantages (moats), and management quality. Use tools like stock screeners to filter by criteria such as market cap or growth rates. Value investing seeks undervalued stocks, while growth investing targets high-potential companies.",
        "What is the difference between stocks and bonds?",
        "Stocks represent equity ownership, offering potential high returns but with volatility and no guaranteed income, while bonds are debt instruments where investors lend money to issuers for fixed interest payments and principal repayment at maturity. Stocks may pay dividends, but bonds provide predictable income. Risk-wise, bonds are generally safer, especially government ones, but offer lower returns compared to stocks' growth potential.",
        "How does diversification work in investing?",
        "Diversification spreads investments across various assets, sectors, and geographies to mitigate risk; if one stock underperforms, others may compensate. Achieve it through mutual funds or ETFs that hold multiple securities. Asset allocation, such as 60% stocks and 40% bonds, balances growth and stability. Rebalancing periodically maintains desired ratios, ensuring the portfolio aligns with risk tolerance and goals.",
        "What are common investment strategies?",
        "Common strategies include value investing, identifying undervalued stocks based on metrics like low P/E; growth investing, focusing on companies with high earnings growth; dividend investing, selecting stocks with consistent payouts for income; and index investing, tracking market indices like S&P 500 via low-cost funds for broad exposure. Momentum trading buys rising stocks, while contrarian approaches bet against market trends.",
        "How do taxes affect stock investments?",
        "Taxes impact investments through capital gains taxes on profits from sold stocks: short-term (held under a year) at ordinary income rates, long-term at lower rates. Dividends are taxed as qualified (lower rate) or ordinary. Tax-advantaged accounts like IRAs defer or eliminate taxes. Losses can offset gains, reducing liability. Understanding rules and consulting advisors optimizes after-tax returns.",
        "What tools can I use for stock research?",
        "Tools for research include financial websites like Yahoo Finance or Morningstar for data and analysis; brokerage platforms such as TD Ameritrade or Robinhood for real-time quotes and charts; screening tools like Finviz for filtering stocks; and apps like Seeking Alpha for news and opinions. Fundamental analysis software like Excel models ratios, while technical tools like TradingView aid chart analysis.",
        "How risky is stock investing?",
        "Stock investing carries market risk from price fluctuations, company-specific risk from business failures, and systemic risks like recessions. Volatility measures price swings, with beta indicating sensitivity to market moves. Mitigation involves research, diversification, and long-term horizons, as historical data shows stocks outperform other assets over decades despite short-term losses.",
        "What is compound interest in investing?",
        "Compound interest in investing refers to earnings on both initial principal and accumulated returns, exponentially growing wealth over time. For stocks, it applies through reinvested dividends and capital gains. Starting early maximizes benefits due to time's effect; for example, regular contributions to a diversified portfolio can significantly amplify retirement savings through compounding.",
        "How do I start investing with a small amount?",
        "Start with small amounts via fractional shares offered by brokers like Fidelity, allowing purchases of partial stocks. Use robo-advisors like Betterment for automated, low-fee portfolios based on goals. Begin with index funds or ETFs for diversification without high minimums. Educate yourself through free resources, set a budget, and consistently invest via dollar-cost averaging to build over time.",
      ],
    },
    {
      id: "chat-008",
      title: "Tips for Learning a New Language",
      responses: [
        "What are tips for learning a new language?",
        "Effective tips include immersion through surrounding yourself with the language via media, conversations, and apps like Duolingo for daily practice. Set specific goals, such as vocabulary targets or fluency levels, and use spaced repetition systems (SRS) like Anki for retention. Consistent practice, even 15-30 minutes daily, builds habits, while focusing on listening, speaking, reading, and writing balances skills.",
        "How important is immersion in language learning?",
        "Immersion is crucial as it simulates native environments, accelerating acquisition by forcing practical use. Methods include watching films without subtitles, listening to podcasts, or traveling to countries where the language is spoken. It enhances pronunciation, idioms, and cultural nuances, making learning intuitive rather than rote, though combining with structured lessons prevents gaps in grammar.",
        "What apps are best for language learning?",
        "Top apps include Duolingo for gamified lessons, Babbel for conversational focus with speech recognition, Memrise for mnemonic-based vocabulary, and Rosetta Stone for immersive simulations. HelloTalk connects learners with natives for exchanges, while Tandem offers similar tandem learning. Choose based on goals: interactive for beginners, advanced for fluency.",
        "How can I improve my speaking skills?",
        "Improve speaking by practicing with language partners via apps or clubs, recording yourself for self-review, and shadowing native speakers to mimic intonation. Start with simple sentences, gradually increasing complexity, and focus on common phrases. Overcoming fear through consistent exposure builds confidence, while feedback from tutors refines accuracy.",
        "What role does grammar play in language learning?",
        "Grammar provides structure, enabling correct sentence formation and comprehension. Learn rules contextually through examples rather than isolation to avoid overwhelm. Resources like grammar books or online courses explain concepts, but practice via writing and speaking solidifies understanding. Balancing with vocabulary ensures practical communication.",
        "How do I maintain motivation while learning?",
        "Maintain motivation by tracking progress with journals, setting rewards for milestones, and varying activities to prevent boredom. Join communities for support and accountability, visualize benefits like travel or career advancement, and adjust methods if stalled. Short, achievable sessions sustain momentum over intensive, sporadic efforts.",
        "What are common mistakes to avoid?",
        "Avoid relying solely on translation, which hinders thinking in the target language; instead, use monolingual dictionaries. Don't neglect listening and speaking for reading/writing focus. Perfectionism stalls practice—embrace errors as learning opportunities. Inconsistent practice leads to forgetting, so prioritize regularity over intensity.",
        "How can reading help in language learning?",
        "Reading exposes vocabulary in context, improves comprehension, and familiarizes grammar structures. Start with graded readers or children's books, progressing to newspapers or novels. Active reading—noting unknowns and reviewing—enhances retention. It builds passive skills transferable to active use, enriching cultural knowledge.",
        "What about cultural aspects in language learning?",
        "Cultural aspects deepen understanding, as languages reflect societal norms, idioms, and humor. Engage through films, music, cuisine, and festivals to contextualize words. This fosters empathy and accurate usage, avoiding faux pas. Resources like cultural podcasts or exchange programs integrate learning holistically.",
        "How long does it take to become fluent?",
        "Fluency timelines vary by factors like native language similarity, dedication, and methods: 600-750 hours for related languages (e.g., Spanish for English speakers), 2200+ for distant ones (e.g., Mandarin). Consistent immersion shortens time, with basic conversational skills in months, full fluency in years. Define fluency personally—conversational vs. professional.",
      ],
    },
    {
      id: "chat-009",
      title: "Overview of Space Exploration",
      responses: [
        "Give an overview of space exploration.",
        "Space exploration encompasses human and robotic efforts to investigate outer space, beginning with the Space Race in the 1950s-1970s between the US and USSR. Milestones include Sputnik 1 (1957), first satellite; Yuri Gagarin's orbit (1961); Apollo 11's Moon landing (1969). Modern eras feature ISS collaboration, Mars rovers like Perseverance, and private ventures by SpaceX and Blue Origin advancing reusable rockets and tourism.",
        "What are key milestones in space exploration?",
        "Key milestones: 1957 Sputnik launch initiated the space age; 1961 Gagarin's flight as first human in space; 1969 Apollo 11 Moon landing; 1976 Viking 1's Mars landing; 1990 Hubble Space Telescope deployment revolutionizing astronomy; 1998 ISS construction began; 2012 Curiosity rover on Mars; 2020 Perseverance with Ingenuity helicopter; 2021 James Webb Space Telescope launch for deeper universe views.",
        "Who are major players in current space exploration?",
        "Major players include NASA (US) for Artemis Moon program; ESA (Europe) for collaborative missions; Roscosmos (Russia) for Soyuz launches; CNSA (China) with Tianwen-1 Mars mission and Tiangong station; ISRO (India) for Chandrayaan lunar probes. Private companies: SpaceX with Starship for Mars; Blue Origin for orbital tourism; Boeing and Northrop Grumman for NASA contracts.",
        "What technologies are advancing space exploration?",
        "Advancing technologies include reusable rockets reducing costs (Falcon 9); ion thrusters for efficient deep-space propulsion; AI and robotics for autonomous operations (rovers); 3D printing for in-space manufacturing; advanced life support systems for long-duration missions; and telescopes like JWST with infrared capabilities unveiling early universe secrets.",
        "How does space exploration benefit Earth?",
        "Benefits include technological spin-offs like GPS, satellite communications, and medical imaging from space tech. Earth observation satellites monitor climate, disasters, and resources. Scientific discoveries advance materials science and biology. International cooperation fosters peace, while inspiring STEM education and economic growth through jobs in aerospace.",
        "What are future plans for Mars exploration?",
        "Future Mars plans involve NASA's Artemis as stepping stone, with crewed missions in 2030s; SpaceX's Starship aiming for colonization; ESA's ExoMars rover for life search; China's sample return missions. Challenges include radiation protection, life support, and propulsion for 6-9 month journeys. International partnerships may pool resources for sustainable habitats.",
        "Tell me about the International Space Station.",
        "The ISS is a habitable satellite orbiting Earth since 1998, built by NASA, Roscosmos, ESA, JAXA, and CSA. It serves as a microgravity lab for research in biology, physics, and astronomy, hosting crews of 6-7 for 6-month rotations. Experiments advance medicine (e.g., protein crystals) and technology. It's a symbol of cooperation, with plans for commercial successors post-2030.",
        "What role do private companies play?",
        "Private companies democratize access: SpaceX provides launches and crew transport to ISS; Blue Origin develops landers; Virgin Galactic offers suborbital tourism. They innovate rapidly, lowering costs through reusability and competition. Partnerships with governments accelerate programs, like NASA's Commercial Crew, shifting focus to deep space while privatizing low-Earth orbit.",
        "How is space exploration addressing environmental concerns?",
        "Addressing concerns involves sustainable practices: mitigating space debris through deorbiting guidelines; using green propellants; and designing satellites for end-of-life disposal. Earth-focused missions track deforestation, pollution, and climate change. Long-term, resource utilization on Moon/Mars reduces Earth dependency, while international treaties promote peaceful, equitable exploration.",
        "What challenges remain in space exploration?",
        "Challenges include high costs, requiring funding innovations; human health risks like radiation and bone loss in long missions; technical hurdles in propulsion for faster travel; ethical issues in commercialization and colonization; and geopolitical tensions affecting cooperation. Advancing AI, materials, and biology will mitigate these for sustainable expansion.",
      ],
    },
    {
      id: "chat-010",
      title: "Mental Health Strategies",
      responses: [
        "What are mental health strategies?",
        "Mental health strategies encompass practices to maintain or improve psychological well-being, including mindfulness meditation to reduce stress, regular exercise for endorphin release, and balanced nutrition supporting brain function. Building social connections fosters support, while setting boundaries prevents burnout. Professional help, like therapy, addresses specific issues, emphasizing proactive self-care.",
        "How can mindfulness help with mental health?",
        "Mindfulness cultivates present-moment awareness, reducing anxiety by interrupting rumination and promoting acceptance. Techniques like breathing exercises or apps (Headspace) enhance focus and emotional regulation. Research shows it lowers cortisol, improves sleep, and boosts resilience, making it effective for managing depression, PTSD, and daily stressors.",
        "What role does exercise play in mental health?",
        "Exercise releases endorphins and serotonin, alleviating depression and anxiety symptoms. Aerobic activities like running improve mood, while yoga combines physicality with mindfulness for stress relief. Regular routines enhance self-esteem, sleep quality, and cognitive function, with even moderate walks yielding benefits. It's a natural complement to therapy.",
        "How important is sleep for mental health?",
        "Sleep is vital, regulating mood, cognition, and stress responses; chronic deprivation increases risks of depression, anxiety, and impaired judgment. Aim for 7-9 hours nightly, maintaining consistent schedules and environments free of screens. Techniques like cognitive behavioral therapy for insomnia (CBT-I) address issues, ensuring restorative rest supports emotional stability.",
        "What are ways to build resilience?",
        "Build resilience through positive thinking, reframing challenges as opportunities; developing problem-solving skills; and nurturing support networks for perspective. Self-compassion reduces self-criticism, while hobbies provide fulfillment. Learning from setbacks fosters growth mindset, with resources like resilience training programs enhancing adaptability to adversity.",
        "How can diet affect mental health?",
        "Diet influences mental health via nutrients: omega-3s in fish support brain health, reducing depression; complex carbs stabilize blood sugar for steady mood; antioxidants in fruits combat inflammation linked to anxiety. Gut microbiome, affected by fiber-rich foods, connects to brain via gut-brain axis. Avoiding excessive sugar/caffeine prevents crashes.",
        "What strategies help with stress management?",
        "Stress management strategies include time management with prioritization and delegation; relaxation techniques like progressive muscle relaxation; and journaling to process emotions. Nature exposure lowers cortisol, while hobbies provide breaks. Professional tools like biofeedback or apps track triggers, enabling proactive coping.",
        "How do social connections impact mental health?",
        "Social connections provide emotional support, reducing isolation-linked depression. Quality relationships offer validation and advice, buffering stress. Community involvement boosts belonging, while toxic ties harm well-being. Nurture through regular interactions, active listening, and vulnerability, with online groups supplementing in-person bonds.",
        "When should I seek professional help?",
        "Seek professional help for persistent symptoms like prolonged sadness, anxiety interfering with daily life, or thoughts of harm. Changes in sleep, appetite, or withdrawal signal need. Therapists offer tools like CBT for reframing thoughts; psychiatrists manage medications. Early intervention prevents escalation, with hotlines providing immediate support.",
        "What are self-care practices for mental health?",
        "Self-care practices include setting boundaries to protect energy; engaging in enjoyable activities like reading or baths; practicing gratitude journaling for positivity; and digital detoxes to reduce overstimulation. Personalized routines, assessed regularly, ensure sustainability, complementing professional care for holistic well-being.",
      ],
    },
  ];

  return testData;
}
