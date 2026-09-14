# generate_all_pedagogy.py
# Generates high-yield pedagogical datasets grounded in scientific & pre-university admission standards
import json
import re

with open("src/elementsData.js", "r", encoding="utf-8") as f:
    text = f.read()

match = re.search(r"export const elements118 = (\[[\s\S]*?\]);", text)
elements = json.loads(match.group(1))

# Dedicated comprehensive pre-university pedagogical database for the prioritized 38 elements + key exam elements
special_preuni = {
    1: {
        "everyday_context": "Es el elemento más abundante del universo (75% de la masa bariónica). En la Tierra forma el agua (H₂O), hidrocarburos y biomoléculas. Clave en la síntesis industrial de amoníaco (proceso Haber-Bosch) y como combustible del futuro (hidrógeno verde).",
        "exam_pitfall": "¡No es un metal alcalino aunque esté en el Grupo 1! Es un no metal gaseoso diatómico (H₂). Con no metales actúa con estado de oxidación +1 (covalente), pero con metales forma hidruros iónicos donde actúa con −1 (ej. NaH, CaH₂), trampa fija en exámenes de nomenclatura.",
        "quantum_breakdown": {
            "level_explanation": "Posee 1 solo electrón en el orbital 1s¹. En estado atómico libre es paramagnético; en la molécula H₂ forma un enlace covalente simple sigma (σ) y es diamagnético.",
            "anomalies_or_rules": "Único elemento que no tiene neutrones en su isótopo natural más abundante (Protio, 99.98%). No posee electrones de apantallamiento internos, por lo que Zeff = Z = 1."
        },
        "family_relationship": "Se ubica sobre el Grupo 1 por tener 1 electrón de valencia (ns¹), pero su alta energía de ionización y electronegatividad (2.20) lo hacen comportarse químicamente como un no metal singular.",
        "misconception": "Pensar que el modelo de Bohr describe órbitas físicas fijas como vías de tren. En la mecánica cuántica actual, el electrón del hidrógeno se describe por una función de onda probabilística esférica (orbital 1s, REEMPE).",
        "self_check_quiz": [
            {
                "question": "¿Por qué en el hidruro de calcio (CaH₂) el hidrógeno presenta estado de oxidación −1 y no +1?",
                "answer": "Porque el calcio es un metal electropositivo del Grupo 2 que cede sus electrones; el hidrógeno actúa como aceptor formando el anión hidruro (H⁻).",
                "explanation": "En hidruros metálicos los metales del grupo IA y IIA obligan al hidrógeno a aceptar un electrón para completar su dueto, adquiriendo carga neta −1.",
                "concept_tested": "Estados de oxidación en hidruros metálicos",
                "exam_tag": "Admisión UNMSM / UNI"
            },
            {
                "question": "¿Cuántos neutrones tiene el núcleo del isótopo más abundante del hidrógeno?",
                "answer": "Cero neutrones (el Protio, ¹H, tiene Z=1 y A=1; A − Z = 0).",
                "explanation": "El 99.98% del hidrógeno en la naturaleza es protio, compuesto exclusivamente por un protón y un electrón, sin neutrones.",
                "concept_tested": "Estructura nuclear e isótopos",
                "exam_tag": "Concepto Fundamental"
            }
        ]
    },
    2: {
        "everyday_context": "Gas inerte vital en medicina para enfriar a 4 Kelvin (−269 °C) los imanes superconductores de equipos de Resonancia Magnética (RMN). Empleado en buceo profundo (mezcla heliox) para evitar la narcosis por nitrógeno y en globos aerostáticos.",
        "exam_pitfall": "Aunque su configuración es 1s² (subnivel s lleno), no pertenece al Grupo 2 (alcalinotérreos) sino al Grupo 18 (gases nobles), porque su único nivel de energía (n=1) está completamente saturado, otorgándole inercia química absoluta.",
        "quantum_breakdown": {
            "level_explanation": "Capa K (n=1) completa con 2 electrones apareados con espines antiparalelos (↑↓). Es diamagnético.",
            "anomalies_or_rules": "Posee la primera energía de ionización más alta de toda la tabla periódica (2372 kJ/mol). Sus electrones están muy cerca del núcleo (+2) sin apantallamiento previo."
        },
        "family_relationship": "Comparte con Ne, Ar, Kr y Xe la capa de valencia cerrada, gran estabilidad química y nula tendencia a formar compuestos moleculares en condiciones ambientales.",
        "misconception": "Creer que 'todos los gases nobles tienen 8 electrones de valencia'. El Helio cumple la regla del dueto de máxima estabilidad con solo 2 electrones.",
        "self_check_quiz": [
            {
                "question": "¿Por qué el Helio tiene mayor energía de ionización que el Neón y el Flúor?",
                "answer": "Porque sus 2 electrones se encuentran en el nivel n=1, a mínima distancia del núcleo, sintiendo la atracción nuclear de +2 sin ninguna capa interna que los apantalle.",
                "explanation": "A menor radio atómico y menor apantallamiento, mayor es la atracción nuclear efectiva sobre los electrones, requiriendo 2372 kJ/mol para arrancar el primer electrón.",
                "concept_tested": "Energía de ionización y apantallamiento",
                "exam_tag": "Tendencias Periódicas UNI"
            },
            {
                "question": "¿A qué bloque cuántico corresponde el Helio por su configuración electrónica y en qué grupo se ubica?",
                "answer": "Pertenece al bloque cuántico s (1s²), pero se ubica en el Grupo 18 (VIIIA) por su estabilidad de gas noble.",
                "explanation": "Es la única excepción de ubicación entre bloque cuántico (s) y grupo representativo (VIIIA / gases nobles).",
                "concept_tested": "Bloques cuánticos vs familias periódicas",
                "exam_tag": "Admisión Preuniversitaria"
            }
        ]
    },
    3: {
        "everyday_context": "Pilar de la transición energética moderna en acumuladores de iones de litio (baterías de smartphones, laptops y autos Tesla). En medicina, el carbonato de litio (Li₂CO₃) es el estabilizador estándar en el trastorno bipolar.",
        "exam_pitfall": "Al quemarse al aire, el litio forma principalmente el óxido normal (Li₂O, O con estado −2), mientras que el sodio forma peróxido (Na₂O₂) y el potasio forma superóxido (KO₂). Presenta fuerte relación diagonal con el Magnesio.",
        "quantum_breakdown": {
            "level_explanation": "[He] 2s¹. Capa K interna completa (2e⁻) y 1 electrón de valencia en la capa L. Fácilmente ionizable a Li⁺.",
            "anomalies_or_rules": "El catión Li⁺ tiene una densidad de carga tan alta que polariza aniones vecinos, confiriendo a sus sales (como LiCl) un marcado carácter covalente según las reglas de Fajans."
        },
        "family_relationship": "Metal alcalino (Grupo 1 / IA). Tiene 1 electrón de valencia ns¹, densidad baja (flota en hidrocarburos) y potencial de reducción extremadamente negativo.",
        "misconception": "Creer que por ser el primer alcalino es el más reactivo con agua. En realidad, la reactividad de los alcalinos crece hacia abajo (Cs > Rb > K > Na > Li) porque los átomos más grandes pierden su electrón ns¹ con menor energía.",
        "self_check_quiz": [
            {
                "question": "¿Cómo varía el radio iónico del Li⁺ respecto al radio atómico del Li neutro?",
                "answer": "El radio del Li⁺ (76 pm) es drásticamente menor que el del átomo neutro (152 pm) al perder por completo el nivel cuántico n=2.",
                "explanation": "Al perder el único electrón de la capa de valencia, el núcleo atrae con mucha mayor fuerza a los 2 electrones restantes de la capa 1s.",
                "concept_tested": "Radio atómico vs Radio iónico",
                "exam_tag": "Admisión UNMSM"
            },
            {
                "question": "¿Qué compuesto de oxígeno se forma predominantemente cuando el litio metálico reacciona con aire seco?",
                "answer": "Óxido de litio (Li₂O), un óxido normal donde el oxígeno actúa con estado de oxidación −2.",
                "explanation": "A diferencia del Na (peróxido) y K (superóxido), el pequeño tamaño del catión Li⁺ estabiliza preferentemente al anión óxido O²⁻.",
                "concept_tested": "Reactividad química y óxidos de alcalinos",
                "exam_tag": "Química Inorgánica UNI"
            }
        ]
    },
    4: {
        "everyday_context": "Componente de aleaciones ligeras de berilio-cobre para herramientas antichispa en refinerías de petróleo, ventanas transparentes a rayos X y espejos del telescopio espacial James Webb.",
        "exam_pitfall": "¡Excepción obligatoria de la regla del octeto! En compuestos gaseosos como BeCl₂ o BeH₂, el berilio se estabiliza con solo 4 electrones de valencia (octeto incompleto o hipovalente). Su óxido (BeO) e hidróxido Be(OH)₂ son anfóteros.",
        "quantum_breakdown": {
            "level_explanation": "[He] 2s². 2 electrones en la capa de valencia n=2. Diamagnético en estado fundamental neutro.",
            "anomalies_or_rules": "Hibrida sus orbitales 2s y 2p a sp para formar 2 enlaces covalentes lineales a 180° en BeCl₂. Posee relación diagonal con el Aluminio."
        },
        "family_relationship": "Alcalinotérreo (Grupo 2 / IIA), pero debido a su radio diminuto y alta electronegatividad (1.57), forma enlaces con alto porcentaje covalente a diferencia del Ba o Ca.",
        "misconception": "Pensar que 'todo enlace entre un metal y un no metal es 100% iónico'. El BeCl₂ es covalente molecular por la gran polarización del catión Be²⁺ sobre la nube del cloro.",
        "self_check_quiz": [
            {
                "question": "¿Cuántos pares de electrones enlazantes rodean al átomo de Berilio en la molécula de BeCl₂?",
                "answer": "Dos pares de electrones enlazantes (4 electrones en total), constituyendo una clásica excepción por octeto incompleto.",
                "explanation": "El berilio no alcanza los 8 electrones del octeto en BeCl₂; forma una molécula lineal con hibridación sp y 4 electrones compartidos.",
                "concept_tested": "Excepciones a la regla del octeto",
                "exam_tag": "Enlace Químico UNI"
            },
            {
                "question": "¿Qué comportamiento ácido-base presenta el hidróxido de berilio, Be(OH)₂?",
                "answer": "Es anfótero: reacciona tanto con ácidos fuertes formando sales de berilio como con bases fuertes formando berilatos [Be(OH)₄]²⁻.",
                "explanation": "El berilio es el único elemento del Grupo 2 con hidróxido anfótero; los hidróxidos de Mg, Ca, Sr y Ba son netamente básicos.",
                "concept_tested": "Carácter anfótero en la tabla periódica",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    5: {
        "everyday_context": "Vidrios de borosilicato (Pyrex) resistentes al calor en laboratorios y cocinas, fibras de vidrio aislantes, blindajes de control en reactores nucleares (absorbe neutrones térmicos) y ácido bórico como antiséptico.",
        "exam_pitfall": "¡El rey del octeto incompleto en exámenes de admisión! En BF₃ o BCl₃, el boro se rodea de solo 6 electrones de valencia (3 pares enlazantes). Actúa como un potente ácido de Lewis, aceptando pares de electrones para formar enlaces dativos o coordinados.",
        "quantum_breakdown": {
            "level_explanation": "[He] 2s² 2p¹. 3 electrones de valencia. En BF₃ presenta hibridación sp² con geometría trigonal plana (ángulos de 120°).",
            "anomalies_or_rules": "Posee un orbital 2p vacío perpendicular al plano molecular que le permite recibir un par solitario de bases de Lewis como el amoníaco (:NH₃)."
        },
        "family_relationship": "Es el único metaloide del Grupo 13 (térreos o boroides). Todos los miembros inferiores (Al, Ga, In, Tl) son metales.",
        "misconception": "Creer que una molécula con octeto incompleto es ficticia o imposible de aislar. El BF₃ es un gas estable comercializado a escala industrial.",
        "self_check_quiz": [
            {
                "question": "En la reacción F₃B + :NH₃ → F₃B←NH₃, ¿qué tipo de enlace se forma y qué rol cumple el boro?",
                "answer": "Se forma un enlace covalente coordinado (dativo); el boro actúa como ácido de Lewis aceptando el par libre del nitrógeno.",
                "explanation": "El nitrógeno aporta los dos electrones del enlace al orbital 2p vacío del boro, permitiéndole completar finalmente su octeto.",
                "concept_tested": "Teoría de Lewis de ácidos y bases y enlace dativo",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuál es la geometría molecular y los ángulos de enlace de la molécula de BF₃?",
                "answer": "Geometría trigonal plana con ángulos de enlace exactos de 120°.",
                "explanation": "La hibridación sp² del átomo central de boro orienta los 3 pares de enlace hacia los vértices de un triángulo equilátero para minimizar repulsiones.",
                "concept_tested": "Geometría molecular y teoría RPECV",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    6: {
        "everyday_context": "Base indispensable de la vida y de la química orgánica. Presente en diamantes, grafito de lápices, nanotubos, grafeno superconductor, combustibles fósiles y en todo polímero sintético.",
        "exam_pitfall": "Preguntas fijas de química orgánica: tetravalencia, autosaturación (catenación), tipos de hibridación (sp³ en enlaces simples, sp² en dobles y sp en triples) y alotropía (el diamante no conduce electricidad; el grafito sí conduce debido a electrones π deslocalizados).",
        "quantum_breakdown": {
            "level_explanation": "Estado fundamental: [He] 2s² 2p² (2 electrones desapareados). En estado excitado promueve un electrón 2s → 2p dando 4 orbitales semillenos listos para hibridar.",
            "anomalies_or_rules": "El isótopo Carbono-12 define por convenio la unidad de masa atómica unificada (1 u = 1/12 de la masa del ¹²C). El Carbono-14 es radiactivo beta emisor usado en datación arqueológica."
        },
        "family_relationship": "Cabeza del Grupo 14 (carbonoideos / IVA). Su tamaño idóneo le permite solapamientos laterales p-p eficientes para formar enlaces múltiples π muy fuertes.",
        "misconception": "Pensar que diamante y grafito son compuestos diferentes. Son formas alotrópicas del mismo elemento puro en distintas redes cristalinas.",
        "self_check_quiz": [
            {
                "question": "¿Por qué el grafito conduce la corriente eléctrica mientras que el diamante es un aislante?",
                "answer": "En el grafito el carbono tiene hibridación sp² con electrones pi (π) deslocalizados libres para moverse entre láminas; en el diamante todos los electrones están fijos en enlaces sigma con hibridación sp³.",
                "explanation": "Las láminas bidimensionales de anillos aromáticos de grafito permiten la conducción eléctrica en el plano laminar.",
                "concept_tested": "Alotropía del carbono e hibridación",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué propiedad del átomo de carbono explica la existencia de millones de compuestos orgánicos diferentes?",
                "answer": "La concatenación (autosaturación), que le permite unirse a otros átomos de carbono formando cadenas lineales, ramificadas y anillos estables.",
                "explanation": "La alta energía del enlace C−C simple y su tetravalencia permiten una diversidad estructural casi infinita.",
                "concept_tested": "Propiedades del átomo de carbono",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    7: {
        "everyday_context": "Gas diatómico inerte (N₂) que compone el 78% del aire atmosférico. Esencial en aminoácidos, proteínas, ADN, fertilizantes de urea y explosivos industriales (dinamita, TNT).",
        "exam_pitfall": "¡Óxidos neutros vs anhídridos! Con valencias +1 (N₂O, gas hilarante), +2 (NO) y +4 (NO₂) forma óxidos neutros o que no dan oxácidos directos. En cambio, con +3 (N₂O₃ → HNO₂, ácido nitroso) y +5 (N₂O₅ → HNO₃, ácido nítrico) forma anhídridos verdaderos.",
        "quantum_breakdown": {
            "level_explanation": "[He] 2s² 2p³. Subnivel 2p semilleno con 3 electrones de espín paralelo (regla de Hund). Es fuertemente estable.",
            "anomalies_or_rules": "Su 1ª energía de ionización (1402 kJ/mol) es mayor que la del Oxígeno (1314 kJ/mol), rompiendo la tendencia de período por la estabilidad cuántica del subnivel p semilleno (p³)."
        },
        "family_relationship": "Cabeza del Grupo 15 (nitrogenoideos / VA). Estado de oxidación característico −3 en amoníaco (NH₃) y nitruros metálicos.",
        "misconception": "Afirmar que 'la energía de ionización aumenta estrictamente en todo el período sin excepciones'. El Nitrógeno supera al Oxígeno por la estabilidad de su subnivel 2p³ semilleno.",
        "self_check_quiz": [
            {
                "question": "¿Por qué la primera energía de ionización del Nitrógeno (Z=7) es mayor que la del Oxígeno (Z=8)?",
                "answer": "Porque el nitrógeno tiene su subnivel 2p semilleno (2p³), confiriéndole simetría y estabilidad adicional; en el oxígeno (2p⁴) hay repulsión interelectrónica al aparearse el cuarto electrón.",
                "explanation": "La configuración p³ tiene energía de intercambio favorable. Quitar un electrón al oxígeno alivia la repulsión de pares en el primer orbital p.",
                "concept_tested": "Anomalías en energías de ionización periódicas",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuántos enlaces sigma (σ) y pi (π) componen la molécula diatómica de N₂?",
                "answer": "1 enlace sigma (σ) y 2 enlaces pi (π), sumando un enlace triple covalente de altísima fuerza (945 kJ/mol).",
                "explanation": "El solapamiento frontal de orbitales p da el enlace σ y el solapamiento lateral da los 2 enlaces π perpendiculares.",
                "concept_tested": "Enlace covalente múltiple",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    8: {
        "everyday_context": "Esencial para la respiración aeróbica de los seres vivos y las reacciones de combustión. Constituye el 21% de la atmósfera y casi el 50% de la masa de la corteza terrestre en forma de silicatos y agua.",
        "exam_pitfall": "Estado de oxidación habitual: −2. Pero ¡ojo en exámenes!: en peróxidos (H₂O₂, Na₂O₂) es −1; en superóxidos (KO₂) es −1/2; y unido al flúor (OF₂) es +2 porque el flúor es más electronegativo que él.",
        "quantum_breakdown": {
            "level_explanation": "[He] 2s² 2p⁴. 6 electrones de valencia en el nivel n=2. Requiere 2 electrones para completar el octeto.",
            "anomalies_or_rules": "El gas oxígeno (O₂) es paramagnético en estado líquido y atraído por imanes debido a 2 electrones desapareados en orbitales antienlazantes π*, predicho por la Teoría de Orbitales Moleculares."
        },
        "family_relationship": "Cabeza del Grupo 16 (calcógenos o anfígenos / VIA). Segundo elemento más electronegativo de la tabla periódica (3.44 de Pauling).",
        "misconception": "Pensar que en el difluoruro de oxígeno (OF₂) el oxígeno tiene carga −2. El flúor tiene EN=3.98 y el oxígeno EN=3.44, forzando al oxígeno a actuar con estado +2.",
        "self_check_quiz": [
            {
                "question": "¿Cuál es el estado de oxidación del oxígeno en el agua oxigenada (H₂O₂) y en el difluoruro de oxígeno (OF₂)?",
                "answer": "En el H₂O₂ es −1 (peróxido), y en el OF₂ es +2.",
                "explanation": "En el enlace peróxido −O−O− cada oxígeno retiene un electrón de su par compartido, y frente al flúor cede densidad electrónica al ser menos electronegativo.",
                "concept_tested": "Estados de oxidación especiales del oxígeno",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué alótropo del oxígeno filtra la radiación ultravioleta perjudicial en la estratosfera terrestre?",
                "answer": "El ozono (O₃), molécula triatómica angular con resonancia entre enlaces simples y dobles.",
                "explanation": "La capa de ozono absorbe la radiación UV-B y UV-C solar mediante el ciclo fotoquímico de Chapman.",
                "concept_tested": "Alotropía del oxígeno y química ambiental",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    9: {
        "everyday_context": "Aditivo en pastas dentales para prevenir caries (fluoruro de sodio), base de polímeros antiadherentes de teflón (PTFE) y presente en el 20% de los fármacos comerciales modernos (antidepresivos, anestésicos).",
        "exam_pitfall": "¡Es el elemento más electronegativo del universo (3.98)! En consecuencia, su estado de oxidación en todos sus compuestos químicos es estrictamente −1, sin excepción. ¡Nunca tiene estados positivos!",
        "quantum_breakdown": {
            "level_explanation": "[He] 2s² 2p⁵. 7 electrones de valencia en la capa L. Le falta un electrón para alcanzar el octeto del Neón.",
            "anomalies_or_rules": "A pesar de ser el más electronegativo, su afinidad electrónica (−328 kJ/mol) es inferior a la del Cloro (−349 kJ/mol) debido a la repulsión interelectrónica en su diminuto subnivel 2p."
        },
        "family_relationship": "Cabeza del Grupo 17 (halógenos / VIIA). El oxidante elemental más potente y corrosivo conocido.",
        "misconception": "Creer que 'el flúor tiene la mayor afinidad electrónica por ser el más electronegativo'. El Cloro gana en afinidad electrónica porque su radio más amplio aloja al electrón extra con menor repulsión.",
        "self_check_quiz": [
            {
                "question": "¿Por qué el flúor jamás presenta estados de oxidación positivos como +1, +3, +5 o +7?",
                "answer": "Porque no existe ningún elemento con mayor electronegatividad para atraer sus electrones y carece de orbitales d en el nivel 2 para expandir su octeto.",
                "explanation": "Con EN=3.98 siempre atrae el par de electrones del enlace, actuando siempre con estado −1.",
                "concept_tested": "Electronegatividad y estados de oxidación",
                "exam_tag": "Admisión UNMSM"
            },
            {
                "question": "¿Qué elemento tiene mayor afinidad electrónica: el Flúor o el Cloro, y cuál es la causa?",
                "answer": "El Cloro (−349 kJ/mol), porque el Flúor tiene un volumen atómico tan reducido que los 7 electrones 2p ejercen fuerte repulsión sobre el electrón entrante.",
                "explanation": "Es la anomalía clásica de afinidad electrónica entre el segundo y tercer período en los grupos 16 y 17.",
                "concept_tested": "Afinidad electrónica y repulsión cuántica",
                "exam_tag": "Admisión UNI"
            }
        ]
    },
    10: {
        "everyday_context": "Tubos fluorescentes y letreros luminosos de color naranja-rojizo característico, lásers de helio-neón en lectores ópticos y refrigerante criogénico de alta capacidad.",
        "exam_pitfall": "Posee capa de valencia cerrada con octeto perfecto (2s² 2p⁶). No forma compuestos químicos neutros conocidos en condiciones estándar; su electronegatividad se considera formalmente nula.",
        "quantum_breakdown": {
            "level_explanation": "[He] 2s² 2p⁶. 8 electrones de valencia en la capa L, todos apareados. Diamagnético.",
            "anomalies_or_rules": "Marca el cierre del segundo período de la tabla periódica y define el kernel [Ne] (10 electrones) para las configuraciones del período 3."
        },
        "family_relationship": "Gas noble del Grupo 18 (VIIIA). Monatómico, incoloro, inodoro y químicamente inerte.",
        "misconception": "Pensar que 'los gases nobles no tienen radio atómico'. Se les mide su radio de Van der Waals en sólidos criogénicos por contacto intermolecular.",
        "self_check_quiz": [
            {
                "question": "¿Cuántos orbitales llenos y cuántos electrones desapareados posee el átomo neutro de Neón?",
                "answer": "Posee 5 orbitales completamente llenos (1s, 2s, 2px, 2py, 2pz) y cero electrones desapareados (diamagnético).",
                "explanation": "Sus 10 electrones llenan exactamente los 5 orbitales disponibles de los niveles n=1 y n=2.",
                "concept_tested": "Distribución electrónica y orbitales",
                "exam_tag": "Admisión Preuniversitaria"
            },
            {
                "question": "¿Qué configuración electrónica kernel abreviada representa al Neón?",
                "answer": "1s² 2s² 2p⁶, correspondiente a 10 electrones y 8 electrones de valencia.",
                "explanation": "El kernel de Neón [Ne] se usa para simplificar las configuraciones electrónicas desde el Sodio (Z=11) hasta el Argón (Z=18).",
                "concept_tested": "Notación de Kernel de gases nobles",
                "exam_tag": "Concepto Fundamental"
            }
        ]
    },
    11: {
        "everyday_context": "Componente de la sal de mesa (NaCl), vital para la bomba sodio-potasio celular que mantiene el potencial de membrana y la transmisión de impulsos nerviosos. Usado en lámparas amarillas de alumbrado vial.",
        "exam_pitfall": "Al arder en atmósfera de oxígeno forma peróxido de sodio (Na₂O₂), no el óxido simple. Su reacción con agua líquida es instantánea y exotérmica: 2Na + 2H₂O → 2NaOH + H₂↑, liberando gas hidrógeno inflamable.",
        "quantum_breakdown": {
            "level_explanation": "[Ne] 3s¹. 1 electrón de valencia en la capa M. Al perderlo adquiere la configuración del gas noble Neón (Na⁺).",
            "anomalies_or_rules": "El radio del catión Na⁺ (102 pm) es casi la mitad del radio atómico del Na neutro (186 pm) debido a la contracción nuclear efectiva."
        },
        "family_relationship": "Alcalino del Grupo 1 (IA). Reacciona con halógenos formando sales con enlace típicamente iónico y alto punto de fusión.",
        "misconception": "Creer que en la serie isoelectrónica O²⁻, F⁻, Ne, Na⁺, Mg²⁺ todos tienen el mismo tamaño. El catión Na⁺ es mucho menor que el F⁻ porque tiene 11 protones atrayendo a los mismos 10 electrones.",
        "self_check_quiz": [
            {
                "question": "En la serie isoelectrónica F⁻, Na⁺, Mg²⁺, ¿cuál tiene el menor radio y por qué?",
                "answer": "El Mg²⁺, porque tiene 12 protones en el núcleo ejerciendo mayor atracción electrostática sobre los 10 electrones compartidos.",
                "explanation": "A mayor número atómico (Z) en especies isoelectrónicas, mayor es la atracción nuclear efectiva y menor el radio iónico.",
                "concept_tested": "Series isoelectrónicas y contracción de radio",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué color característico produce el sodio al someter sus sales al ensayo de coloración a la llama?",
                "answer": "Un amarillo brillante e intenso (línea D del doblete del sodio a 589 nm).",
                "explanation": "La excitación térmica del electrón 3s al nivel 3p y su posterior desexcitación emite fotones en la longitud de onda amarilla.",
                "concept_tested": "Ensayos a la llama y espectros atómicos",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    12: {
        "everyday_context": "Átomo central de la clorofila que hace posible la fotosíntesis en el reino vegetal. Aleaciones ultraligeras de magnesio en aeronáutica y automovilismo, y leche de magnesia [Mg(OH)₂] como antiácido estomacal.",
        "exam_pitfall": "Arde con una luz blanca deslumbrante produciendo óxido de magnesio (2Mg + O₂ → 2MgO). Su 1ª energía de ionización (738 kJ/mol) es superior a la del Aluminio (578 kJ/mol) por la estabilidad del subnivel 3s lleno.",
        "quantum_breakdown": {
            "level_explanation": "[Ne] 3s². Capa de valencia con 2 electrones en orbital s. Diamagnético en estado fundamental neutro.",
            "anomalies_or_rules": "Al ionizarse forma el catión divalente Mg²⁺ ([Ne]), cuya gran densidad de carga causa que sus sales cristalicen habitualmente hidratadas (ej. sal de Epsom, MgSO₄·7H₂O)."
        },
        "family_relationship": "Alcalinotérreo del Grupo 2 (IIA). Estado de oxidación único en compuestos: +2.",
        "misconception": "Pensar que el magnesio reacciona tan violentamente con agua fría como el sodio. El magnesio apenas reacciona con agua fría; requiere agua caliente o vapor para reaccionar visiblemente.",
        "self_check_quiz": [
            {
                "question": "¿Por qué la primera energía de ionización del Magnesio (Z=12) es mayor que la del Aluminio (Z=13)?",
                "answer": "Porque el magnesio tiene su subnivel 3s completamente lleno (3s²), lo que le confiere estabilidad; en el aluminio el electrón solitario 3p está más alejado y apantallado por los 3s².",
                "explanation": "La penetración del orbital s es mayor que la del p, haciendo que el electrón 3p del Al se desprenda con menor gasto energético.",
                "concept_tested": "Anomalías en energía de ionización por orbitales",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuál es la función biológica principal del ión Mg²⁺ en el citoplasma celular humano?",
                "answer": "Actúa como cofactor esencial estabilizando la molécula de ATP (Mg-ATP) para liberar energía en reacciones metabólicas.",
                "explanation": "El Mg²⁺ se une a los grupos fosfato cargados negativamente del ATP, permitiendo que las enzimas quinasas reconozcan el sustrato.",
                "concept_tested": "Química biológica y cofactores",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    13: {
        "everyday_context": "El metal más abundante en la corteza terrestre (8.1% en masa, bauxita). Utilizado en latas de bebidas, fuselajes de aviones, cables de alta tensión y marcos arquitectónicos por su ligereza y pasivación ante la corrosión.",
        "exam_pitfall": "¡Su óxido (Al₂O₃, alúmina) y su hidróxido [Al(OH)₃] son anfóteros por excelencia! En exámenes de admisión se pregunta constantemente su reacción tanto con ácidos (HCl) como con bases fuertes (NaOH para dar aluminatos [Al(OH)₄]⁻).",
        "quantum_breakdown": {
            "level_explanation": "[Ne] 3s² 3p¹. 3 electrones de valencia en la capa M. Estado de oxidación único en compuestos inorgánicos: +3.",
            "anomalies_or_rules": "El AlCl₃ anhidro existe como dímero covalente Al₂Cl₆ para compensar el octeto incompleto mediante enlaces puente cloruro."
        },
        "family_relationship": "Miembro del Grupo 13 (térreos / IIIA). Metal post-transición electropositivo pero con alta polarización de enlace.",
        "misconception": "Creer que el aluminio no se oxida porque permanece brillante al aire. En realidad se oxida de inmediato formando una capa microscópica impermeable de Al₂O₃ que detiene la corrosión interior (pasivación).",
        "self_check_quiz": [
            {
                "question": "¿Qué significa que el hidróxido de aluminio Al(OH)₃ sea anfótero?",
                "answer": "Significa que se disuelve tanto en ácidos formando sales de Al³⁺ como en bases fuertes formando el anión complejo tetrahidroxoaluminato [Al(OH)₄]⁻.",
                "explanation": "La propiedad anfótera es el sello distintivo del aluminio en exámenes de química inorgánica preuniversitaria.",
                "concept_tested": "Carácter anfótero del aluminio",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Por qué el cloruro de aluminio anhidro forma el dímero Al₂Cl₆ en fase vapor?",
                "answer": "Porque en la molécula monómera AlCl₃ el aluminio solo tiene 6 electrones de valencia; al dimerizarse mediante dos enlaces dativos puente completa su octeto.",
                "explanation": "Cada átomo de aluminio acepta un par de electrones solitario de un átomo de cloro del monómero opuesto.",
                "concept_tested": "Enlace covalente dativo y dimerización",
                "exam_tag": "Admisión UNI"
            }
        ]
    },
    14: {
        "everyday_context": "Base indispensable de la revolución electrónica e informática (microprocesadores, chips de silicio) y de las celdas solares fotovoltaicas. Presente en arenas de cuarzo (SiO₂), cerámicas, vidrio y siliconas médicas.",
        "exam_pitfall": "A diferencia del CO₂, que es un gas molecular diatómico con dobles enlaces (O=C=O), el dióxido de silicio (SiO₂) es una red cristalina covalente tridimensional de tetraedros de SiO₄ con altísimo punto de fusión (> 1700 °C) e insoluble.",
        "quantum_breakdown": {
            "level_explanation": "[Ne] 3s² 3p². 4 electrones de valencia en la capa M. Tetravalente mediante hibridación sp³.",
            "anomalies_or_rules": "Dispone de orbitales 3d vacíos en su capa de valencia, lo que le permite a diferencia del carbono formar especies hipervalentes con octeto expandido como el anión [SiF₆]²⁻."
        },
        "family_relationship": "Metaloide del Grupo 14 (carbonoideos / IVA). Semiconductor intrínseco cuya conductividad aumenta con la temperatura y por dopaje (semiconductores tipo p y n).",
        "misconception": "Pensar que el SiO₂ tiene fórmula molecular simple similar al CO₂. El SiO₂ es un polímero de red covalente gigante sin moléculas individuales.",
        "self_check_quiz": [
            {
                "question": "¿Por qué el CO₂ es un gas a temperatura ambiente mientras que el SiO₂ es un sólido cristalino de altísimo punto de fusión?",
                "answer": "El CO₂ está formado por moléculas no polares unidas solo por débiles fuerzas de London; el SiO₂ es una red covalente gigante donde cada átomo de silicio está unido a 4 oxígenos por enlaces fuertes.",
                "explanation": "El mayor radio del silicio impide solapamientos eficientes pi (π) con el oxígeno, favoreciendo enlaces sigma tetraédricos infinitos.",
                "concept_tested": "Estructuras moleculares vs redes covalentes",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cómo se clasifica químicamente al Silicio por sus propiedades de conducción?",
                "answer": "Semiconductor o metaloide: su conductividad eléctrica es intermedia entre conductores metálicos y aislantes, y aumenta al elevar la temperatura.",
                "explanation": "En semiconductores, la energía térmica excita electrones desde la banda de valencia a la banda de conducción a través de una brecha energética moderada.",
                "concept_tested": "Propiedades de los metaloides",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    15: {
        "everyday_context": "Componente estructural de los huesos y dientes (hidroxiapatita de calcio), espina dorsal del ADN y ARN (grupos fosfato), moléculas de energía ATP y fertilizantes agrícolas fosfatados.",
        "exam_pitfall": "¡Trampa de los oxácidos de fósforo en exámenes de admisión! El ácido fosfórico (H₃PO₄) es triprótico (3 hidrógenos ionizables), pero el ácido fosforoso (H₃PO₃) es diprótico (solo 2 hidrógenos ionizables unidos a O) y el ácido hipofosforoso (H₃PO₂) es monoprótico (solo 1 H ionizable).",
        "quantum_breakdown": {
            "level_explanation": "[Ne] 3s² 3p³. 5 electrones de valencia en la capa M. Subnivel 3p semilleno.",
            "anomalies_or_rules": "Por tener orbitales 3d vacíos puede expandir su capa de valencia a 10 electrones (octeto expandido con hibridación sp³d), como en el pentacloruro de fósforo (PCl₅)."
        },
        "family_relationship": "No metal del Grupo 15 (nitrogenoideos / VA). Presenta alotropía clave: fósforo blanco (P₄ tetraédrico, tóxico y pirofórico) y fósforo rojo (polimérico, no tóxico, usado en cerillas).",
        "misconception": "Asumir que todos los hidrógenos de una fórmula de oxácido son ionizables. En el H₃PO₃ hay un enlace directo P−H no ionizable; solo se ionizan los enlaces P−O−H.",
        "self_check_quiz": [
            {
                "question": "¿Cuántos hidrógenos ionizables (protones) tiene el ácido fosforoso (H₃PO₃)?",
                "answer": "Solo 2 hidrógenos ionizables (es un ácido diprótico), ya que el tercer hidrógeno está enlazado directamente al fósforo (enlace P−H).",
                "explanation": "Para ionizarse en agua el hidrógeno debe estar unido a un átomo electronegativo como el oxígeno (P−O−H).",
                "concept_tested": "Estructura de Lewis y acidez de oxácidos de fósforo",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué alótropo del fósforo se inflama espontáneamente al contacto con el aire y cómo debe almacenarse?",
                "answer": "El fósforo blanco (P₄), que debe almacenarse sumergido bajo agua para evitar su combustión espontánea.",
                "explanation": "La alta tensión angular en la molécula tetraédrica de P₄ (ángulos de 60°) le confiere enorme inestabilidad y reactividad.",
                "concept_tested": "Alotropía y estabilidad molecular",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    16: {
        "everyday_context": "Elemento clave en la vulcanización del caucho de neumáticos, fabricación del reactivo industrial más producido en el mundo (ácido sulfúrico, H₂SO₄), en aminoácidos cisteína y metionina, y en pólvora negra.",
        "exam_pitfall": "Valencias en nomenclatura tradicional: 2, 4 y 6. Con valencia 2 forma sulfuros (ej. H₂S, ácido sulfhídrico, olor a huevos podridos); con 4 forma anhídrido sulfuroso (SO₂ → H₂SO₃, sulfuroso); con 6 forma anhídrido sulfúrico (SO₃ → H₂SO₄, sulfúrico). El anión sulfato es SO₄²⁻.",
        "quantum_breakdown": {
            "level_explanation": "[Ne] 3s² 3p⁴. 6 electrones de valencia en la capa M. Estados de oxidación comunes: −2, +2, +4, +6.",
            "anomalies_or_rules": "Capaz de formar octetos expandidos: en el hexafluoruro de azufre (SF₆) se rodea de 12 electrones con hibridación sp³d² y geometría octaédrica hiperestable."
        },
        "family_relationship": "Calcógeno del Grupo 16 (anfígenos / VIA). Su alótropo más estable en condiciones estándar es el azufre rómbico en anillos de ocho átomos (S₈).",
        "misconception": "Confundir valencia con estado de oxidación. La valencia del azufre en H₂S es 2 (capacidad de enlace sin signo); su estado de oxidación es −2 (carga formal).",
        "self_check_quiz": [
            {
                "question": "¿Cuántos electrones de valencia rodean al átomo central de azufre en la molécula de SF₆ y qué geometría molecular tiene?",
                "answer": "12 electrones (octeto expandido con 6 pares enlazantes) y geometría octaédrica regular (ángulos de 90°).",
                "explanation": "El azufre utiliza orbitales 3d vacíos para hibridar a sp³d², alojando 6 pares de electrones alrededor del núcleo.",
                "concept_tested": "Octeto expandido y geometría octaédrica",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuál es la fórmula y carga del ión sulfato y sulfito en nomenclatura inorgánica preuniversitaria?",
                "answer": "Ión sulfato: SO₄²⁻ (S con estado +6). Ión sulfito: SO₃²⁻ (S con estado +4).",
                "explanation": "El sufijo -ato corresponde al mayor estado de oxidación (+6) del ácido sulfúrico; -ito corresponde al menor estado (+4) del ácido sulfuroso.",
                "concept_tested": "Iones poliatómicos y nomenclatura",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    17: {
        "everyday_context": "Agente potabilizador y desinfectante del agua potable a nivel mundial, componente de la sal común (NaCl), de plásticos PVC y del ácido muriático o clorhídrico (HCl) para limpieza industrial.",
        "exam_pitfall": "Los 4 estados de oxidación positivos para anhídridos y oxácidos: +1 (hipoclorito / ácido hipocloroso, HClO), +3 (clorito / ácido cloroso, HClO₂), +5 (clorato / ácido clórico, HClO₃) y +7 (perclorato / ácido perclórico, HClO₄).",
        "quantum_breakdown": {
            "level_explanation": "[Ne] 3s² 3p⁵. 7 electrones de valencia en la capa M. Requiere 1 electrón para completar su octeto a [Ar].",
            "anomalies_or_rules": "Posee la mayor afinidad electrónica de toda la tabla periódica (−349 kJ/mol), superando al Flúor porque su subnivel 3p más espacioso aloja al electrón extra con mínima repulsión."
        },
        "family_relationship": "Halógeno del Grupo 17 (VIIA). Gas diatómico amarillo-verdoso tóxico (Cl₂), potente agente oxidante.",
        "misconception": "Pensar que la masa atómica del Cloro (35.45 u) proviene de neutrones partidos. Proviene del promedio ponderado de sus dos isótopos estables: ³⁵Cl (75.77%) y ³⁷Cl (24.23%).",
        "self_check_quiz": [
            {
                "question": "¿Cómo se calcula la masa atómica promedio ponderada del Cloro si el isótopo ³⁵Cl (34.97 u) abunda en un 75.77% y el ³⁷Cl (36.97 u) en un 24.23%?",
                "answer": "Masa = (34.97 × 75.77 + 36.97 × 24.23) / 100 = 35.45 u.",
                "explanation": "La masa atómica de la tabla periódica no es un número de masa individual, sino el promedio ponderado por abundancia relativa natural.",
                "concept_tested": "Cálculo de masa atómica promedio ponderada",
                "exam_tag": "Admisión UNMSM / UNI"
            },
            {
                "question": "¿Cuál de los siguientes ácidos del cloro es el oxidante y ácido más fuerte en solución acuosa: HClO, HClO₂, HClO₃ o HClO₄?",
                "answer": "El ácido perclórico (HClO₄), con estado de oxidación +7 en el cloro.",
                "explanation": "A mayor número de átomos de oxígeno electronegativos unidos al halógeno central, mayor polarización del enlace O−H y mayor estabilidad de la base conjugada.",
                "concept_tested": "Fuerza de los oxácidos",
                "exam_tag": "Admisión UNI"
            }
        ]
    },
    18: {
        "everyday_context": "Gas inerte utilizado en la soldadura TIG/MIG para proteger los metales calientes de la oxidación del aire, relleno protector en bombillas incandescentes y ventanas de doble acristalamiento termoacústico.",
        "exam_pitfall": "Tercer gas más abundante de la atmósfera (0.93% en volumen, ¡más abundante que el CO₂!). Define el kernel [Ar] (18 electrones) para las configuraciones del período 4, incluyendo los metales de transición.",
        "quantum_breakdown": {
            "level_explanation": "1s² 2s² 2p⁶ 3s² 3p⁶. Capas K, L y M (subniveles s y p) completamente llenas. Diamagnético.",
            "anomalies_or_rules": "Aunque pertenece al período 3, los orbitales 3d permanecen vacíos en el Argón y se llenan recién en el período 4 tras llenar el subnivel 4s (principio de Aufbau)."
        },
        "family_relationship": "Gas noble del Grupo 18 (VIIIA). Sin reactividad química conocida en condiciones ordinarias.",
        "misconception": "Pensar que el Argón tiene orbitales 3d llenos por estar en el período 3. Los orbitales 3d tienen mayor energía relativa que 4s (n+l = 5 vs 4) y se llenan a partir del Escandio (Z=21).",
        "self_check_quiz": [
            {
                "question": "¿Por qué el Argón es el gas noble más abundante en la atmósfera terrestre?",
                "answer": "Se genera continuamente por la desintegración radiactiva por captura electrónica del Potasio-40 (⁴⁰K) presente en la corteza terrestre.",
                "explanation": "El decaimiento geológico de ⁴⁰K a ⁴⁰Ar ha acumulado casi un 1% de argón en la atmósfera a lo largo de 4500 millones de años.",
                "concept_tested": "Química nuclear y composición atmosférica",
                "exam_tag": "Admisión UNMSM"
            },
            {
                "question": "¿Cuántos electrones de valencia posee el átomo de Argón y cuál es su número atómico?",
                "answer": "8 electrones de valencia (capa externa 3s² 3p⁶) y su número atómico es Z=18.",
                "explanation": "El octeto cerrado de 8 electrones le confiere inercia química total en condiciones ambientales estándar.",
                "concept_tested": "Regla del octeto y gases nobles",
                "exam_tag": "Concepto Fundamental"
            }
        ]
    },
    19: {
        "everyday_context": "Cation intracelular más abundante en el organismo humano, crucial para la contracción muscular, el ritmo cardíaco y la excitabilidad neuronal. Componente principal de fertilizantes N-P-K (como KCl).",
        "exam_pitfall": "Al arder al aire forma el superóxido de potasio (KO₂), donde el oxígeno presenta el estado anómalo de −1/2. Su reacción con agua líquida es tan violenta que produce una llama de color violeta pálido.",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s¹. 1 electrón de valencia en la capa N (n=4). Gran radio atómico y mínima energía de ionización (419 kJ/mol).",
            "anomalies_or_rules": "El electrón 4s se encuentra más apantallado que en el sodio, lo que hace al potasio mucho más blando y electropositivo."
        },
        "family_relationship": "Alcalino del Grupo 1 (IA). Ensayo a la llama: coloración violeta / lila característica.",
        "misconception": "Asumir que todos los óxidos de alcalinos tienen fórmula M₂O. El potasio forma preferentemente KO₂ (superóxido) debido al gran radio de su catión K⁺.",
        "self_check_quiz": [
            {
                "question": "¿Qué estado de oxidación presenta el oxígeno en el superóxido de potasio (KO₂)?",
                "answer": "Estado de oxidación −1/2.",
                "explanation": "El ión superóxido es O₂⁻; los dos átomos de oxígeno comparten una carga neta de −1, resultando en −1/2 por cada átomo.",
                "concept_tested": "Estados de oxidación especiales del oxígeno",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué color característico se observa al someter sales de potasio al ensayo a la llama en el laboratorio?",
                "answer": "Color violeta o lila tenue.",
                "explanation": "La longitud de onda de emisión visible de los electrones desexcitados del átomo de potasio cae en la región violeta del espectro (alrededor de 404 nm y 766 nm).",
                "concept_tested": "Ensayos a la llama",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    20: {
        "everyday_context": "Metal más abundante del cuerpo humano; forma el fosfato de calcio que da rigidez al esqueleto óseo y dental. En la industria es la base del cemento Portland, yeso (CaSO₄·2H₂O) y cal viva (CaO).",
        "exam_pitfall": "La cal viva es óxido de calcio (CaO); al agregar agua se 'apaga' exotérmicamente formando cal apagada o hidróxido de calcio [Ca(OH)₂]. Su suspensión acuosa se llama lechada de cal y su solución transparente es el agua de cal (para reconocer CO₂ al enturbiarse por precipitación de CaCO₃).",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s². Capa de valencia con 2 electrones en subnivel 4s. Diamagnético en estado neutro.",
            "anomalies_or_rules": "Cierra el recorrido de los primeros 20 elementos fundamentales de la regla del serrucho de Möller para exámenes de admisión."
        },
        "family_relationship": "Alcalinotérreo del Grupo 2 (IIA). Estado de oxidación fijo: +2 en todas sus combinaciones inorgánicas.",
        "misconception": "Pensar que la dureza del agua potable se debe a impurezas de tierra. La dureza del agua se debe a la disolución de iones Ca²⁺ y Mg²⁺ que precipitan el jabón.",
        "self_check_quiz": [
            {
                "question": "¿Qué ocurre químicamente cuando se burbujea gas CO₂ en una solución transparente de agua de cal [Ca(OH)₂]?",
                "answer": "La solución se enturbia debido a la precipitación de carbonato de calcio blanco insoluble (CaCO₃).",
                "explanation": "Reacción clásica de reconocimiento: Ca(OH)₂ + CO₂ → CaCO₃↓ + H₂O.",
                "concept_tested": "Reacciones de precipitación y reconocimiento de gases",
                "exam_tag": "Admisión UNMSM / UNI"
            },
            {
                "question": "¿Cuál es la configuración electrónica y los cuatro números cuánticos del último electrón del átomo de Calcio (Z=20)?",
                "answer": "Configuración [Ar] 4s². Cuatro números cuánticos del último electrón: (4, 0, 0, −1/2).",
                "explanation": "Nivel n=4, subnivel s (l=0), orbital ml=0, y segundo electrón con espín ms=−1/2.",
                "concept_tested": "Números cuánticos del electrón diferencial",
                "exam_tag": "Admisión UNI"
            }
        ]
    },
    24: {
        "everyday_context": "Metal inoxidable por excelencia en el acero quirúrgico (acero al cromo-níquel), recubrimientos cromados de piezas mecánicas y en pigmentos de pinturas (verde cromo, amarillo cromo).",
        "exam_pitfall": "¡Doble trampa de examen en UNI y San Marcos! 1) Anomalía antiserrucho: su configuración real es [Ar] 4s¹ 3d⁵ (no 4s² 3d⁴) por estabilidad cuántica de subnivel semilleno. 2) Comportamiento anfótero: con +2 y +3 actúa como metal (óxidos básicos e hidróxidos Cr(OH)₃); con +6 actúa como no metal (anhídrido CrO₃, cromato CrO₄²⁻ amarillo y dicromato Cr₂O₇²⁻ naranja, fuertes oxidantes).",
        "quantum_breakdown": {
            "level_explanation": "Configuración basal real: [Ar] 4s¹ 3d⁵. Presenta 6 electrones desapareados, lo que le confiere máximo paramagnetismo.",
            "anomalies_or_rules": "Al ionizarse a Cr³⁺ pierde primero el electrón del 4s y luego dos del 3d, quedando como [Ar] 3d³ (3 electrones desapareados)."
        },
        "family_relationship": "Metal de transición del Grupo 6 (VIB). Muestra gran variedad de colores brillantes en sus estados de oxidación (de ahí su nombre, del griego 'chroma' = color).",
        "misconception": "Escribir la configuración teórica [Ar] 4s² 3d⁴ aplicando la regla del serrucho sin recordar la anomalía. Los subniveles d⁴ son inestables y pasan a d⁵ promoviendo un electrón del 4s.",
        "self_check_quiz": [
            {
                "question": "¿Por qué la configuración electrónica del Cromo es [Ar] 4s¹ 3d⁵ en lugar de [Ar] 4s² 3d⁴?",
                "answer": "Por la estabilidad cuántica adicional y simetría de intercambio que proporciona tener el subnivel 3d exactamente semilleno (d⁵) junto con el 4s semilleno (s¹).",
                "explanation": "El principio de mínima energía favorece la distribución con mayor número de espines paralelos y mayor energía de canje cuántico.",
                "concept_tested": "Anomalías de configuración electrónica (Antiserrucho)",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuáles son los estados de oxidación del Cromo como metal y como formador de ácidos?",
                "answer": "Como metal actúa con +2 (cromoso) y +3 (crómico); como no metal formador de ácidos actúa con +6 (ácido crómico y dicrómico).",
                "explanation": "Es uno de los metales con comportamiento múltiple más preguntados en nomenclatura inorgánica.",
                "concept_tested": "Comportamiento anfótero y estados de oxidación",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    25: {
        "everyday_context": "Esencial en la metalurgia del acero como desulfurante y desoxidante (ferromanganeso). En química y biología, el permanganato de potasio (KMnO₄) es el oxidante analítico más usado en titulaciones redox.",
        "exam_pitfall": "¡El elemento de mayor amplitud de estados de oxidación en admisión! Como metal: +2 (manganoso, MnO) y +3 (mangánico, Mn₂O₃). Como anfótero: +4 (dióxido de manganeso, MnO₂). Como no metal: +6 (manganatos, MnO₄²⁻ de color verde) y +7 (permanganatos, MnO₄⁻ de color violeta intenso).",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s² 3d⁵. Posee exactamente 5 electrones desapareados en su subnivel 3d y 2 electrones apareados en el 4s.",
            "anomalies_or_rules": "El ión Mn²⁺ ([Ar] 3d⁵) tiene una estabilidad química notable porque conserva su subnivel 3d semilleno intacto tras perder los 2 electrones 4s."
        },
        "family_relationship": "Metal de transición del Grupo 7 (VIIB). En solución ácida el permanganato (Mn⁺⁷) se reduce típicamente a Mn²⁺ incoloro ganando 5 electrones.",
        "misconception": "Pensar que el manganeso solo actúa como metal porque es un metal de transición. Con estados +6 y +7 actúa químicamente como un no metal formador de oxácidos.",
        "self_check_quiz": [
            {
                "question": "En medio fuertemente ácido, ¿a qué especie química se reduce el ión permanganato violeta (MnO₄⁻) en una titulación redox?",
                "answer": "Se reduce al ión manganoso incoloro o rosa muy pálido Mn²⁺, ganando 5 electrones (reducción de Mn⁺⁷ a Mn⁺²).",
                "explanation": "La semirreacción típica es: MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O.",
                "concept_tested": "Reacciones redox y titulación preuniversitaria",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuáles son las fórmulas de los ácidos que forma el Manganeso con sus estados de oxidación no metálicos +6 y +7?",
                "answer": "Ácido mangánico (H₂MnO₄ con Mn⁺⁶) y ácido permangánico (HMnO₄ con Mn⁺⁷).",
                "explanation": "Con +6 el anhídrido es MnO₃ (MnO₃ + H₂O → H₂MnO₄); con +7 el anhídrido es Mn₂O₇ (Mn₂O₇ + H₂O → 2HMnO₄).",
                "concept_tested": "Nomenclatura de oxácidos del manganeso",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    26: {
        "everyday_context": "Columna vertebral de la civilización material (acero estructural). En biomedicina, es el ión central de la hemoglobina humana encargado de captar y transportar el dioxígeno O₂ a todas las células del cuerpo.",
        "exam_pitfall": "¡Orden de ionización en metales de transición! Para formar el catión ferroso Fe²⁺ ([Ar] 3d⁶) se pierden primero los dos electrones del nivel más externo 4s, NO del 3d. Para formar el catión férrico Fe³⁺ ([Ar] 3d⁵) se pierde luego un electrón del 3d. Nomenclatura: valencias +2 (ferroso) y +3 (férrico).",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s² 3d⁶. 4 electrones desapareados en estado neutro. Fuertemente ferromagnético por dominios magnéticos en fase metálica.",
            "anomalies_or_rules": "El catión Fe³⁺ tiene subnivel d semilleno ([Ar] 3d⁵), lo que le confiere mayor estabilidad termodinámica frente a la oxidación que el Fe²⁺."
        },
        "family_relationship": "Metal de transición del Grupo 8 (VIIIB). Reacciona con ácidos no oxidantes desprendiendo hidrógeno gas y formando sales ferrosas (Fe²⁺).",
        "misconception": "Creer que al oxidarse el átomo pierde electrones del subnivel 3d primero porque 'fue el último en escribirse'. Los electrones se desprenden siempre del nivel con mayor número cuántico principal (n=4).",
        "self_check_quiz": [
            {
                "question": "¿Cuál es la configuración electrónica y número de electrones desapareados del catión férrico (Fe³⁺, Z=26)?",
                "answer": "[Ar] 3d⁵, con exactamente 5 electrones desapareados (paramagnético).",
                "explanation": "El átomo neutro es [Ar] 4s² 3d⁶. Al formar Fe³⁺ se pierden los dos electrones 4s y uno del 3d, quedando 3d⁵.",
                "concept_tested": "Ionización de metales de transición y paramagnetismo",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuál es la fórmula del hidróxido ferroso y del hidróxido férrico según la nomenclatura clásica?",
                "answer": "Hidróxido ferroso: Fe(OH)₂ (valencia menor +2). Hidróxido férrico: Fe(OH)₃ (valencia mayor +3).",
                "explanation": "Los sufijos tradicionales -oso e -ico corresponden a las valencias +2 y +3 respectivamente.",
                "concept_tested": "Nomenclatura clásica de hidróxidos",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    27: {
        "everyday_context": "Núcleo organometálico activo de la vitamina B12 (cobalamina), esencial para la síntesis de ADN y formación de glóbulos rojos. Clave en imanes permanentes potentes (Alnico) y en cátodos de baterías de iones de litio.",
        "exam_pitfall": "Valencias fijas en nomenclatura tradicional: +2 (cobaltoso) y +3 (cobáltico). Trampa común: pensar que en disolución acuosa simple el estado +3 es el más común; en realidad el catión acuoso más estable es el Co²⁺ (rosa), mientras que Co³⁺ requiere ligandos para estabilizarse.",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s² 3d⁷. 3 electrones desapareados en los orbitales d según la regla de Hund. Ferromagnético en estado elemental.",
            "anomalies_or_rules": "El Cobalto-60 (⁶⁰Co) es un radioisótopo emisor gamma de alta energía utilizado en radioterapia oncológica y esterilización de material quirúrgico."
        },
        "family_relationship": "Metal de transición del Grupo 9 (VIIIB, tríada del hierro). Forma complejos de coordinación coloreados emblemáticos en química inorgánica.",
        "misconception": "Pensar que el Cobalto tiene anomalía de configuración como el Cobre. El Cobalto sigue Aufbau estándar sin saltos de electrones.",
        "self_check_quiz": [
            {
                "question": "¿Cuál es la configuración electrónica abreviada del ión cobaltoso (Co²⁺)?",
                "answer": "[Ar] 3d⁷ (pierde los dos electrones del orbital 4s).",
                "explanation": "Al ionizarse el átomo neutro de cobalto ([Ar] 4s² 3d⁷), los electrones se expulsan primero del nivel n=4.",
                "concept_tested": "Configuración electrónica de iones de transición",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué vitamina vital para el ser humano contiene un átomo de cobalto coordinado en su estructura?",
                "answer": "La vitamina B12 (cobalamina).",
                "explanation": "Es la única vitamina que contiene un átomo metálico pesado esencial en su estructura porfirínica.",
                "concept_tested": "Bioelementos y química médica",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    28: {
        "everyday_context": "Acero inoxidable (aleación hierro-cromo-níquel), monedas, catalizador de hidrogenación de aceites vegetales a margarinas (níquel Raney) y baterías recargables de Ni-Cd y Ni-MH.",
        "exam_pitfall": "Valencias en nomenclatura tradicional: +2 (niqueloso) y +3 (niquélico). En solución acuosa su estado dominante y estable es casi exclusivamente +2, produciendo soluciones acuosas de intenso color verde brillante.",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s² 3d⁸. Posee 2 electrones desapareados en el subnivel 3d. Ferromagnético a temperatura ambiente.",
            "anomalies_or_rules": "Forma con el monóxido de carbono un complejo organometálico volátil y extraordinariamente tóxico: el níquel tetracarbonilo [Ni(CO)₄], clave en el proceso de purificación Mond."
        },
        "family_relationship": "Metal de transición del Grupo 10 (VIIIB, tríada del hierro). Resistente a la corrosión básica de hidróxidos alcalinos concentrados.",
        "misconception": "Pensar que las sales niquélicas (+3) son abundantes y estables en agua. El estado +3 del níquel es un fuerte oxidante inestable en medio acuoso simple.",
        "self_check_quiz": [
            {
                "question": "¿Cuántos electrones desapareados posee el catión niqueloso (Ni²⁺, Z=28)?",
                "answer": "2 electrones desapareados en su subnivel 3d ([Ar] 3d⁸).",
                "explanation": "Al perder los dos electrones 4s, quedan 8 electrones en los 5 orbitales d: tres orbitales llenos (6e⁻) y dos orbitales semillenos (2e⁻).",
                "concept_tested": "Regla de Hund y electrones desapareados",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuál es la fórmula del óxido niquélico según la nomenclatura tradicional?",
                "answer": "Ni₂O₃ (níquel con valencia mayor +3).",
                "explanation": "El sufijo -ico corresponde a la valencia +3; combinada con el oxígeno (−2) da por cruce de cargas Ni₂O₃.",
                "concept_tested": "Formulación de óxidos básicos",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    29: {
        "everyday_context": "Excelente conductor eléctrico y térmico usado en el cableado mundial y microelectrónica. Aleaciones históricas fundamentales: bronce (cobre + estaño) y latón (cobre + cinc). Biocida y alguicida (sulfato de cobre).",
        "exam_pitfall": "¡Anomalía antiserrucho fija de examen! Su configuración real es [Ar] 4s¹ 3d¹⁰ (no 4s² 3d⁹) por la simetría y estabilidad del subnivel d totalmente lleno (d¹⁰). Valencias: +1 (cuproso, Cu₂O rojo) y +2 (cúprico, CuO negro). En agua el ión cúprico acuoso [Cu(H₂O)₆]²⁺ es de color azul vivo.",
        "quantum_breakdown": {
            "level_explanation": "Configuración basal real: [Ar] 4s¹ 3d¹⁰. Posee 1 electrón desapareado en el 4s. Diamagnético en el catión Cu⁺ ([Ar] 3d¹⁰) y paramagnético en Cu²⁺ ([Ar] 3d⁹).",
            "anomalies_or_rules": "Promoción de un electrón del subnivel 4s al 3d para completar la capa d¹⁰ de mínima energía electrostática."
        },
        "family_relationship": "Metal de acuñación del Grupo 11 (IB), junto con la Plata (Ag) y el Oro (Au). Metales nobles poco reactivos con potenciales de reducción estándar positivos.",
        "misconception": "Pensar que el cobre reacciona con ácidos comunes (como HCl) para liberar hidrógeno gas. Su potencial de reducción es positivo (+0.34 V), por lo que no es oxidado por H⁺; requiere ácidos oxidantes como el ácido nítrico (HNO₃).",
        "self_check_quiz": [
            {
                "question": "¿Por qué el Cobre (Z=29) no reacciona con ácido clorhídrico HCl desprendiendo hidrógeno gas H₂?",
                "answer": "Porque tiene un potencial estándar de reducción positivo (+0.34 V), lo que significa que el H⁺ no tiene suficiente fuerza oxidante para oxidar al cobre metálico.",
                "explanation": "Solo los metales situados por encima del hidrógeno en la serie electroquímica (potencial negativo) reducen el H⁺ a H₂ gaseoso.",
                "concept_tested": "Serie electroquímica y reactividad redox",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuál es la configuración electrónica y carácter magnético del catión cuproso (Cu⁺)?",
                "answer": "[Ar] 3d¹⁰ y es diamagnético (todos sus electrones están apareados).",
                "explanation": "El átomo de cobre ([Ar] 4s¹ 3d¹⁰) pierde su único electrón del 4s, quedando con el subnivel 3d completamente saturado.",
                "concept_tested": "Configuración de cationes anómalos",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    30: {
        "everyday_context": "Galvanizado de láminas de acero para protegerlas de la herrumbre (ánodo de sacrificio). En medicina, suplemento esencial para el sistema inmunitario, cicatrización y enzima anhidrasa carbónica. Componente del latón (Cu + Zn).",
        "exam_pitfall": "¡No es formalmente un metal de transición según la IUPAC estricta! Como átomo neutro ([Ar] 4s² 3d¹⁰) y como único ión común Zn²⁺ ([Ar] 3d¹⁰) tiene el subnivel d completamente lleno. Estado de oxidación único: +2. Sus sales en solución acuosa son siempre incoloras y diamagnéticas.",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s² 3d¹⁰. Todos sus electrones están apareados. Diamagnético en estado neutro y en su catión Zn²⁺.",
            "anomalies_or_rules": "Su hidróxido Zn(OH)₂ es anfótero: se disuelve en exceso de base fuerte formando el complejo tetrahidroxozincato [Zn(OH)₄]²⁻."
        },
        "family_relationship": "Miembro del Grupo 12 (IIB). Puntos de fusión y ebullición llamativamente más bajos que los metales de transición adyacentes.",
        "misconception": "Creer que todas las sales de metales del bloque d son coloreadas. Las sales de Zn²⁺ son blancas o incoloras porque no hay transiciones electrónicas d-d posibles (el subnivel d está lleno con 10 electrones).",
        "self_check_quiz": [
            {
                "question": "¿Por qué las soluciones acuosas de sulfato de cinc (ZnSO₄) son completamente incoloras?",
                "answer": "Porque el ión Zn²⁺ tiene configuración [Ar] 3d¹⁰ completa, imposibilitando transiciones electrónicas entre orbitales d (transiciones d-d) que absorban luz visible.",
                "explanation": "El color de los complejos de metales de transición se debe al salto de electrones entre orbitales d desdoblados por el campo cristalino.",
                "concept_tested": "Configuración electrónica d10 y color de iones",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué método industrial usa cinc para evitar que el hierro se oxide por corrosión ambiental?",
                "answer": "Galvanizado (protección catódica por ánodo de sacrificio).",
                "explanation": "El cinc tiene menor potencial de reducción que el hierro, por lo que se oxida preferencialmente protegiendo al acero.",
                "concept_tested": "Electroquímica y corrosión",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    34: {
        "everyday_context": "Oligoelemento esencial antioxidante (selenoproteínas, enzima glutatión peroxidasa). Usado en fotocopiadoras xerográficas clásicas y fotocélulas por su fotoconductividad, y en champús anticaspa (sulfuro de selenio).",
        "exam_pitfall": "Valencias habituales: −2, +4 y +6. Análogo al azufre: con −2 forma seleniuros (ej. H₂Se, ácido selenhídrico, gas fétido y muy tóxico); con +4 forma selenitos (SeO₃²⁻); con +6 forma seleniatos (SeO₄²⁻, fuerte oxidante).",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s² 3d¹⁰ 4p⁴. 6 electrones de valencia en la capa N (n=4). 2 electrones desapareados en los orbitales 4p.",
            "anomalies_or_rules": "Posee orbitales 4d vacíos que le permiten expandir su octeto en compuestos como el hexafluoruro de selenio (SeF₆)."
        },
        "family_relationship": "Calcógeno del Grupo 16 (VIA). Propiedades intermedias entre no metal y metaloide semiconductor.",
        "misconception": "Pensar que el selenio no es tóxico por ser un nutriente esencial. La brecha entre la dosis diaria requerida y la dosis tóxica (selenosis) es una de las más estrechas entre los oligoelementos.",
        "self_check_quiz": [
            {
                "question": "¿Cuál es la fórmula del ácido selénico y cuál es el estado de oxidación del selenio en él?",
                "answer": "Fórmula: H₂SeO₄; estado de oxidación del selenio: +6.",
                "explanation": "Se forma a partir del anhídrido selénico (SeO₃ + H₂O → H₂SeO₄) y es análogo al ácido sulfúrico pero más oxidante.",
                "concept_tested": "Nomenclatura de oxácidos de calcógenos",
                "exam_tag": "Admisión UNMSM"
            },
            {
                "question": "¿Cuántos electrones de valencia posee el átomo de selenio (Z=34)?",
                "answer": "6 electrones de valencia (subniveles 4s² 4p⁴; los 10 electrones 3d están en una capa interna llena y no cuentan como valencia).",
                "explanation": "Los electrones de valencia corresponden a los niveles más externos (capa n=4).",
                "concept_tested": "Electrones de valencia en el bloque p",
                "exam_tag": "Concepto Fundamental"
            }
        ]
    },
    35: {
        "everyday_context": "Único no metal que es líquido a temperatura y presión estándar (STP). Utilizado en retardantes de llama bromados en plásticos electrónicos, fármacos sedantes históricos y desinfectantes de piscinas.",
        "exam_pitfall": "Líquido denso de color pardo-rojizo que desprende vapores corrosivos irritantes (Br₂). Estados de oxidación idénticos al cloro: −1 (bromuros), +1 (hipobromito), +3 (bromito), +5 (bromato) y +7 (perbromato).",
        "quantum_breakdown": {
            "level_explanation": "[Ar] 4s² 3d¹⁰ 4p⁵. 7 electrones de valencia en la capa N. Requiere 1 electrón para el octeto de Kriptón.",
            "anomalies_or_rules": "En química orgánica preuniversitaria, la adición de agua de bromo (Br₂ en CCl₄) es el ensayo analítico clásico para detectar enlaces dobles y triples (decoloración rápida del color pardo)."
        },
        "family_relationship": "Halógeno del Grupo 17 (VIIA). Menos oxidante que el cloro pero más que el yodo; desplaza al yodo de sus sales pero es desplazado por el cloro: Cl₂ + 2KBr → 2KCl + Br₂.",
        "misconception": "Creer que el mercurio es el único elemento líquido en condiciones estándar. El bromo es el único no metal líquido; el mercurio es el único metal líquido.",
        "self_check_quiz": [
            {
                "question": "En la reacción Cl₂ + 2KBr → 2KCl + Br₂, ¿qué propiedad periódica se pone en evidencia?",
                "answer": "El mayor poder oxidante (y mayor afinidad electrónica/electronegatividad) del cloro frente al bromo para desplazarlo de sus haluros.",
                "explanation": "Los halógenos superiores del Grupo 17 oxidan y desplazan a los aniones haluro de los halógenos inferiores.",
                "concept_tested": "Poder oxidante de los halógenos",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuáles son los únicos dos elementos de toda la tabla periódica que son líquidos en condiciones ambientales estándar (25 °C y 1 atm)?",
                "answer": "El Bromo (Br₂, no metal) y el Mercurio (Hg, metal).",
                "explanation": "Pregunta recurrente de cultura científica y propiedades físicas en exámenes de admisión.",
                "concept_tested": "Estados de agregación estándar de los elementos",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    38: {
        "everyday_context": "Fuegos artificiales y bengalas de señales de emergencia de color rojo carmesí brillante. El isótopo radiactivo Estroncio-90 (⁹⁰Sr, emisor beta en lluvia radiactiva) se fija peligrosamente en los huesos suplantando al calcio.",
        "exam_pitfall": "Estado de oxidación único: +2. Al pertenecer al Grupo 2 (período 5) su radio atómico es muy grande (215 pm) y reacciona enérgicamente con agua líquida desprendiendo hidrógeno gas e hidróxido de estroncio [Sr(OH)₂].",
        "quantum_breakdown": {
            "level_explanation": "[Kr] 5s². Capa O con 2 electrones apareados. Diamagnético en estado fundamental neutro.",
            "anomalies_or_rules": "Por su similitud química y de radio con el catión Ca²⁺, el organismo humano confunde al estroncio con el calcio incorporándolo en la matriz ósea."
        },
        "family_relationship": "Alcalinotérreo del Grupo 2 (IIA). Color carmesí característico en el ensayo a la llama.",
        "misconception": "Pensar que el estroncio natural es radiactivo. El estroncio natural consta de 4 isótopos completamente estables; solo los isótopos artificiales de fisión nuclear (como ⁹⁰Sr) son radiactivos.",
        "self_check_quiz": [
            {
                "question": "¿Por qué el radioisótopo Estroncio-90 de las detonaciones nucleares representa un grave peligro biológico para los humanos?",
                "answer": "Porque tiene propiedades químicas casi idénticas al calcio, siendo absorbido por el cuerpo e integrado en la médula ósea y huesos, donde emite radiación beta destructiva.",
                "explanation": "Al estar en el mismo grupo periódico (Grupo 2), sus iones divalentes tienen comportamiento fisiológico gemelo.",
                "concept_tested": "Similitud química de grupo y radiobiología",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué color característico produce el estroncio al ensayo a la llama?",
                "answer": "Rojo carmesí intenso.",
                "explanation": "Empleado universalmente en pirotecnia para fuegos artificiales de color rojo.",
                "concept_tested": "Ensayos de coloración a la llama",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    47: {
        "everyday_context": "El metal con la más alta conductividad térmica y eléctrica y el mayor brillo de todos los elementos. Usado en contactos electrónicos críticos, paneles solares, joyería fina y antiséptico (nitrato de plata, sulfadiazina de plata).",
        "exam_pitfall": "¡Anomalía antiserrucho idéntica al cobre! Su configuración real es [Kr] 5s¹ 4d¹⁰ (no 5s² 4d⁹) por máxima estabilidad del subnivel 4d saturado. En exámenes de admisión de San Marcos y UNI su estado de oxidación en compuestos es único: +1 fijo (ión plata, Ag⁺).",
        "quantum_breakdown": {
            "level_explanation": "[Kr] 5s¹ 4d¹⁰. 1 electrón en el nivel 5s y subnivel 4d lleno. Diamagnético en el catión Ag⁺ ([Kr] 4d¹⁰).",
            "anomalies_or_rules": "El cloruro de plata (AgCl) es un precipitado blanco cuajoso insoluble en agua que se oscurece al sol por fotorreducción a plata metálica."
        },
        "family_relationship": "Metal de acuñación del Grupo 11 (IB). Metal noble con potencial de reducción estándar positivo (+0.80 V); no es atacado por ácidos no oxidantes.",
        "misconception": "Creer que la plata tiene valencias variables frecuentes como otros metales de transición. En química preuniversitaria actúa con valencia única de +1.",
        "self_check_quiz": [
            {
                "question": "¿Cuál es la configuración electrónica basal del átomo de Plata (Z=47)?",
                "answer": "[Kr] 5s¹ 4d¹⁰.",
                "explanation": "Presenta anomalía antiserrucho por promoción de un electrón 5s al subnivel 4d para lograr la estabilidad d¹⁰.",
                "concept_tested": "Anomalías de configuración electrónica",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué reactivo se utiliza típicamente en el laboratorio para reconocer la presencia de iones cloruro (Cl⁻) mediante un precipitado blanco?",
                "answer": "Nitrato de plata (AgNO₃), formando cloruro de plata blanco insoluble (AgCl↓).",
                "explanation": "Reacción analítica clave: Ag⁺(ac) + Cl⁻(ac) → AgCl(s)↓.",
                "concept_tested": "Reacciones de precipitación analítica",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    50: {
        "everyday_context": "Revestimiento protector de latas de conservas de hojalata (acero estañado). Componente de la soldadura de estaño-plomo en circuitos electrónicos y aleaciones clásicas de bronce (Cu + Sn).",
        "exam_pitfall": "Valencias en nomenclatura tradicional: +2 (estañoso) y +4 (estánico). El SnCl₂ es un fuerte reductor (se oxida a SnCl₄). La 'peste del estaño' es una transformación alotrópica a bajas temperaturas (< 13 °C) donde el estaño blanco metálico brillante se desmorona en polvo gris no metálico.",
        "quantum_breakdown": {
            "level_explanation": "[Kr] 5s² 4d¹⁰ 5p². 4 electrones de valencia en la capa O (n=5). Los electrones 5p se pierden para dar Sn²⁺; los 4 electrones (5s y 5p) se ceden o comparten para dar Sn⁴⁺.",
            "anomalies_or_rules": "Efecto del par inerte: los electrones 5s² tienden a permanecer apareados y no ionizarse con tanta facilidad, estabilizando el estado +2."
        },
        "family_relationship": "Metal del Grupo 14 (carbonoideos / IVA). Metal post-transición maleable y resistente a la corrosión.",
        "misconception": "Pensar que el estaño es un metal pesado tóxico como el plomo. El estaño elemental no es tóxico, por lo que se utiliza sin riesgo en envases de alimentos en conserva.",
        "self_check_quiz": [
            {
                "question": "¿Cuál es la fórmula del cloruro estañoso y del cloruro estánico?",
                "answer": "Cloruro estañoso: SnCl₂ (valencia menor +2). Cloruro estánico: SnCl₄ (valencia mayor +4).",
                "explanation": "Los sufijos clásicos -oso e -ico corresponden a las valencias +2 y +4 del estaño.",
                "concept_tested": "Nomenclatura tradicional de sales binarias",
                "exam_tag": "Admisión UNMSM"
            },
            {
                "question": "¿A qué fenómeno físico se le denomina la 'peste del estaño'?",
                "answer": "A la transformación alotrópica que sufre el estaño metálico blanco tetragonal (fase beta) al convertirse en estaño gris cúbico frágil (fase alfa) a temperaturas inferiores a 13.2 °C.",
                "explanation": "Esta transición rompe la cohesión metálica y desintegra el material en polvo.",
                "concept_tested": "Alotropía y transiciones de fase",
                "exam_tag": "Admisión UNI"
            }
        ]
    },
    53: {
        "everyday_context": "Esencial para el funcionamiento de la glándula tiroides y síntesis de hormonas T3 y T4 (su deficiencia causa bocio, por lo que se yoda la sal común con KIO₃ o KI). Antiséptico tópico (tintura de yodo, povidona yodada).",
        "exam_pitfall": "Sólido cristalino negro-violáceo que sublima fácilmente a temperatura ambiente produciendo un llamativo vapor violeta intenso sin pasar por líquido. Estados de oxidación idénticos al Cl y Br: −1, +1, +3, +5 y +7.",
        "quantum_breakdown": {
            "level_explanation": "[Kr] 5s² 4d¹⁰ 5p⁵. 7 electrones de valencia en la capa O (n=5).",
            "anomalies_or_rules": "En el laboratorio, forma con el anión yoduro el ión triyoduro I₃⁻ (lineal con hibridación sp³d), que da una coloración azul-oscura intensa en presencia de almidón (ensayo de Lugol)."
        },
        "family_relationship": "Halógeno del Grupo 17 (VIIA). El halógeno estable de mayor radio atómico y menor electronegatividad (2.66), siendo un sólido molecular en STP.",
        "misconception": "Pensar que el yodo líquido no puede existir jamás. Bajo una presión de vapor suficiente (> 12 kPa a 113.7 °C), el yodo sí funde a líquido antes de hervir.",
        "self_check_quiz": [
            {
                "question": "¿Qué cambio de estado físico experimenta el yodo sólido al calentarse suavemente en un vaso de precipitados?",
                "answer": "Sublimación progresiva: pasa directamente de sólido a vapores violetas sin fundirse apreciablemente a presión atmosférica ordinaria.",
                "explanation": "El fenómeno inverso (de gas a sólido cristalino en una superficie fría) se denomina deposición o sublimación inversa.",
                "concept_tested": "Cambios de estado de la materia",
                "exam_tag": "Admisión UNMSM"
            },
            {
                "question": "¿Qué sal se adiciona por ley a la sal de mesa en el Perú para prevenir el bocio endémico?",
                "answer": "Yodato de potasio (KIO₃) o yoduro de potasio (KI).",
                "explanation": "La yodación universal de la sal previene los desórdenes por deficiencia de yodo (DDI) y el cretinismo infantil.",
                "concept_tested": "Química médica y salud pública",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    56: {
        "everyday_context": "La 'papilla de bario' (sulfato de bario, BaSO₄) es el medio de contraste radiológico estándar para radiografías y tomografías del tracto gastrointestinal. Pirotecnia de color verde manzana brillante.",
        "exam_pitfall": "¡El sulfato de bario (BaSO₄) es completamente atóxico porque es prácticamente insoluble en agua (Kps ≈ 10⁻¹⁰)! En cambio, los compuestos solubles de bario (como BaCl₂ o Ba(NO₃)₂) son venenos fulminantes que paralizan el corazón.",
        "quantum_breakdown": {
            "level_explanation": "[Xe] 6s². Capa P con 2 electrones de valencia. Radio atómico inmenso (222 pm).",
            "anomalies_or_rules": "Muy baja energía de ionización (503 kJ/mol), reacciona de forma vigorosa con agua líquida formando hidróxido de bario [Ba(OH)₂] fuertemente alcalino."
        },
        "family_relationship": "Alcalinotérreo del Grupo 2 (IIA). Da llama verde manzana característica.",
        "misconception": "Creer que si el catión Ba²⁺ es tóxico, el BaSO₄ para radiografías envenenaría al paciente. Su insolvencia extrema impide que los iones libres pasen al torrente sanguíneo.",
        "self_check_quiz": [
            {
                "question": "¿Por qué se puede ingerir sulfato de bario (BaSO₄) como contraste radiológico a pesar de que el ión bario es altamente tóxico?",
                "answer": "Porque tiene un producto de solubilidad (Kps) sumamente bajo, siendo prácticamente insoluble en los jugos digestivos, por lo que no es absorbido por el organismo.",
                "explanation": "Al no disolverse en iones Ba²⁺ libres, atraviesa el tracto digestivo de manera biológicamente inocua.",
                "concept_tested": "Solubilidad y producto de solubilidad (Kps)",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Qué coloración a la llama emiten las sales de bario?",
                "answer": "Verde manzana o verde amarillento.",
                "explanation": "Ensayo pirognóstico estándar de reconocimiento de alcalinotérreos.",
                "concept_tested": "Ensayos a la llama",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    78: {
        "everyday_context": "Metal noble de altísima resistencia química usado en los convertidores catalíticos de tubos de escape de automóviles (transforma CO y óxidos de nitrógeno en CO₂ y N₂). Fármaco oncológico cisplatino [PtCl₂(NH₃)₂] para tratar tumores.",
        "exam_pitfall": "Valencias en nomenclatura tradicional: +2 (platinoso) y +4 (platínico). No se disuelve en ácido nítrico ni en ácido clorhídrico por separado; solo se disuelve en agua regia (mezcla 3:1 de HCl concentrado y HNO₃ concentrado).",
        "quantum_breakdown": {
            "level_explanation": "Configuración real: [Xe] 6s¹ 4f¹⁴ 5d⁹. Presenta anomalía cuántica donde el subnivel 6s cede un electrón al 5d.",
            "anomalies_or_rules": "Efecto relativista: la contracción lantánida (llenado previo de los 14 electrones 4f) hace que su radio atómico (139 pm) sea casi idéntico al del Paladio (137 pm), haciéndolo muy denso (21.45 g/cm³)."
        },
        "family_relationship": "Metal de transición del Grupo 10 (VIII, metales del grupo del platino). Extraordinariamente inerte y resistente a la oxidación a alta temperatura.",
        "misconception": "Pensar que el platino sigue la regla del serrucho estándar con 6s² 5d⁸. Su configuración real es 6s¹ 5d⁹ debido a efectos relativistas y correlación electrónica.",
        "self_check_quiz": [
            {
                "question": "¿Qué mezcla de ácidos concentrados es capaz de disolver al platino y al oro?",
                "answer": "El agua regia, compuesta por 3 partes de ácido clorhídrico concentrado (HCl) y 1 parte de ácido nítrico concentrado (HNO₃).",
                "explanation": "El HNO₃ actúa como oxidante y el HCl aporta cloruros para acomplejar al metal a [PtCl₆]²⁻.",
                "concept_tested": "Propiedades de metales nobles y agua regia",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuál es la fórmula del cloruro platinoso y del cloruro platínico?",
                "answer": "Cloruro platinoso: PtCl₂ (+2). Cloruro platínico: PtCl₄ (+4).",
                "explanation": "Nomenclatura tradicional con los sufijos -oso e -ico para las dos valencias del platino.",
                "concept_tested": "Nomenclatura inorgánica de metales nobles",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    79: {
        "everyday_context": "Metal precioso por excelencia, patrón monetario histórico y reserva financiera mundial. En tecnología de punta se usa en contactos de microprocesadores por ser inoxidable e inmejorable conductor de señales. En nanomedicina, nanopartículas de oro en terapia térmica de cáncer.",
        "exam_pitfall": "¡Anomalía antiserrucho y efectos relativistas! Su configuración real es [Xe] 6s¹ 4f¹⁴ 5d¹⁰ (no 6s² 5d⁹). Valencias en nomenclatura tradicional: +1 (auroso, ej. AuCl) y +3 (áurico, ej. AuCl₃). Es el metal con mayor afinidad electrónica y electronegatividad (2.54, similar al carbono).",
        "quantum_breakdown": {
            "level_explanation": "Configuración basal real: [Xe] 6s¹ 4f¹⁴ 5d¹⁰. Subnivel 5d lleno y 1 electrón en 6s.",
            "anomalies_or_rules": "Efectos relativistas directos: la gran masa del núcleo atrae a los electrones s a velocidades cercanas a la de la luz, contrayendo el orbital 6s y expandiendo los 5d. La absorción de luz azul por esta transición electrónica es lo que le otorga su color amarillo dorado único."
        },
        "family_relationship": "Metal de acuñación del Grupo 11 (IB). El metal más maleable y dúctil que existe (1 gramo de oro puede estirarse en un hilo de más de 2 kilómetros).",
        "misconception": "Pensar que el color dorado del oro es un accidente clásico de la física de Newton. Sin la teoría de la relatividad de Einstein, el oro sería plateado brillante como la plata.",
        "self_check_quiz": [
            {
                "question": "¿Por qué el oro presenta su característico color amarillo a diferencia de la plata que es blanca plateada?",
                "answer": "Por la contracción relativista de sus orbitales 6s: la energía necesaria para excitar un electrón del subnivel 5d al 6s se reduce, absorbiendo luz azul del espectro y reflejando el amarillo y rojo.",
                "explanation": "Es una de las demostraciones visuales más célebres de la física relativista en la tabla periódica.",
                "concept_tested": "Efectos cuántico-relativistas en metales pesados",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuáles son las valencias del oro en nomenclatura tradicional y las fórmulas de sus óxidos?",
                "answer": "Valencias +1 (auroso) y +3 (áurico). Óxido auroso: Au₂O; óxido áurico: Au₂O₃.",
                "explanation": "El oro forma compuestos estables únicamente con estas dos valencias bien definidas.",
                "concept_tested": "Nomenclatura clásica de óxidos de metales nobles",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    },
    80: {
        "everyday_context": "Único metal líquido en condiciones ambientales estándar. Utilizado históricamente en termómetros clínicos, barómetros de mercurio de Torricelli, empastes dentales de amalgama e iluminación fluorescente.",
        "exam_pitfall": "¡El catión mercurioso es dimérico! En solución acuosa no existe como Hg⁺ libre, sino como el dímero diatómico [Hg−Hg]²⁺ (Hg₂²⁺). Por tanto, la fórmula del cloruro mercurioso es Hg₂Cl₂ (calomelano) y NO HgCl. Valencias: +1 (mercurioso) y +2 (mercúrico, HgCl₂ o sublimado corrosivo).",
        "quantum_breakdown": {
            "level_explanation": "[Xe] 6s² 4f¹⁴ 5d¹⁰. Todos los electrones apareados. Diamagnético.",
            "anomalies_or_rules": "La contracción relativista estabiliza tanto el par de electrones 6s² que estos apenas participan en el enlace metálico, debilitando las fuerzas interatómicas y haciendo que funda a −38.8 °C (líquido)."
        },
        "family_relationship": "Miembro del Grupo 12 (IIB). Altamente tóxico; el vapor de mercurio y sus derivados orgánicos (metilmercurio) causan bioacumulación y graves daños neurológicos (enfermedad de Minamata).",
        "misconception": "Escribir 'HgCl' para el cloruro mercurioso en el examen. La especie mercuriosa siempre es el catión diatómico Hg₂²⁺, dando la fórmula real empírica Hg₂Cl₂.",
        "self_check_quiz": [
            {
                "question": "¿Por qué la fórmula molecular del cloruro mercurioso es Hg₂Cl₂ y no HgCl?",
                "answer": "Porque el estado de oxidación +1 del mercurio forma exclusivamente el catión dimérico diatómico [Hg−Hg]²⁺ con enlace covalente metal-metal.",
                "explanation": "Trampa clásica de formulación inorgánica en los exámenes de admisión de la UNI y San Marcos.",
                "concept_tested": "Iones poliatómicos especiales e isomultiatómicos",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Por qué el mercurio es un metal líquido a temperatura ambiente a diferencia de casi todos los demás metales?",
                "answer": "Debido a la contracción relativista de su orbital 6s²: los dos electrones de valencia están fuertemente retenidos y apenas se deslocalizan en la red metálica, debilitando los enlaces interatómicos.",
                "explanation": "El enlace metálico del mercurio es tan débil que su punto de fusión cae a −38.83 °C.",
                "concept_tested": "Enlace metálico y propiedades físicas periódicas",
                "exam_tag": "Admisión UNI"
            }
        ]
    },
    82: {
        "everyday_context": "Baterías de plomo-ácido de arranque en automóviles de combustión, blindaje contra radiaciones ionizantes (rayos X y rayos gamma en hospitales y centrales nucleares) y pesas de buceo.",
        "exam_pitfall": "Valencias en nomenclatura tradicional: +2 (plumboso) y +4 (plúmbico). Debido al 'efecto del par inerte', el estado +2 es mucho más estable que el +4 (el PbO₂ es un fuerte oxidante). El minio o tetróxido de triplomo (Pb₃O₄) es un óxido doble o salino formado por 2PbO·PbO₂.",
        "quantum_breakdown": {
            "level_explanation": "[Xe] 6s² 4f¹⁴ 5d¹⁰ 6p². 4 electrones de valencia en la capa P. Diamagnético en Pb²⁺ ([Xe] 4f¹⁴ 5d¹⁰ 6s²).",
            "anomalies_or_rules": "El par de electrones 6s² permanece químicamente inerte ('efecto par inerte') por contracción relativista, favoreciendo la pérdida de solo los 2 electrones 6p² para formar Pb²⁺."
        },
        "family_relationship": "Metal post-transición del Grupo 14 (IVA). Metal pesado tóxico que causa saturnismo por intoxicación crónica acumulativa.",
        "misconception": "Pensar que el tetróxido de triplomo (Pb₃O₄) tiene plomo con valencia fraccionaria 8/3. Es en realidad un óxido mixto constituido estequiométricamente por dos partes de PbO (plomo +2) y una parte de PbO₂ (plomo +4).",
        "self_check_quiz": [
            {
                "question": "¿Qué es el 'efecto del par inerte' y cómo explica que el Pb²⁺ sea más estable que el Pb⁴⁺?",
                "answer": "Es la renuencia de los electrones del orbital 6s² a participar en enlaces químicos debido a la contracción relativista en elementos pesados del bloque p, haciendo que el plomo prefiera ceder solo sus 2 electrones 6p.",
                "explanation": "Al bajar en el Grupo 14, la estabilidad del estado de oxidación +4 disminuye drásticamente y aumenta la del estado +2.",
                "concept_tested": "Efecto del par inerte en el bloque p",
                "exam_tag": "Admisión UNI"
            },
            {
                "question": "¿Cuál es la fórmula del óxido plumboso y del óxido plúmbico?",
                "answer": "Óxido plumboso: PbO (plomo +2). Óxido plúmbico: PbO₂ (plomo +4).",
                "explanation": "Nomenclatura clásica con sufijos -oso e -ico para las valencias 2 y 4.",
                "concept_tested": "Nomenclatura tradicional de óxidos",
                "exam_tag": "Admisión UNMSM"
            }
        ]
    }
}

# Template generators for families of the remaining elements
def generate_generic_pedagogy(elem):
    z = elem["number"]
    sym = elem["symbol"]
    name = elem["name"]
    family = elem["family"]
    block = elem["block"]
    period = elem["period"]
    group = elem.get("group", 0)
    config = elem["electron_configuration"]
    ox = elem["oxidation_states"]
    mass = elem["atomic_mass"]

    # Family-tailored contexts
    if family == "Alcalino":
        everyday = f"Metal alcalino blando de gran reactividad química, manipulado bajo atmósfera inerte o queroseno. Empleado en aleaciones reductoras y aplicaciones de transferencia térmica."
        pitfall = f"Reacciona enérgicamente con agua produciendo hidróxidos solubles M(OH) y desprendiendo gas hidrógeno inflamable. Su estado de oxidación es estrictamente +1."
        level_exp = f"Configuración electrónica terminal ns¹ con 1 electrón de valencia en la capa exterior. Al ionizarse pierde este electrón formando cationes monovalentes con kernel de gas noble."
        anom_rules = f"Aumenta fuertemente su radio atómico y disminuye su energía de ionización conforme se desciende en el Grupo 1 debido al apantallamiento creciente de capas electrónicas internas."
        fam_rel = f"Comparte con el Litio, Sodio y Potasio el estado de oxidación único de +1, baja dureza y marcada electropositividad."
        misconc = f"Creer que la reactividad disminuye con el aumento de masa; en los alcalinos ocurre exactamente lo opuesto: son más reactivos hacia el fondo del grupo."
        q1 = f"¿Cuál es el estado de oxidación característico del {name} en todos sus compuestos químicos?"
        a1 = f"Estado de oxidación +1 (catión {sym}⁺)."
        q2 = f"¿Qué gas se desprende cuando un metal alcalino como el {name} entra en contacto con agua líquida?"
        a2 = f"Gas dihidrógeno (H₂), generándose simultáneamente el hidróxido correspondiente."

    elif family == "Alcalinotérreo":
        everyday = f"Metal alcalinotérreo electropositivo de brillo plateado, usado en metalurgia como desoxidante, aleaciones estructurales y aplicaciones de pirotecnia."
        pitfall = f"Presenta estado de oxidación fijo de +2 en todos sus compuestos inorgánicos estables. Sus óxidos son básicos y reaccionan con agua para formar hidróxidos divalentes."
        level_exp = f"Configuración electrónica terminal ns² con 2 electrones en su capa de valencia. Es diamagnético en estado neutro fundamental."
        anom_rules = f"Presenta radios atómicos menores y puntos de fusión mayores que los metales alcalinos del mismo período por su mayor carga nuclear (+2)."
        fam_rel = f"Comparte con el Calcio y Magnesio la tendencia a ceder 2 electrones formando cationes divalentes estables {sym}²⁺."
        misconc = f"Confundir la solubilidad de sus sulfatos: en el Grupo 2 la solubilidad de los sulfatos disminuye drásticamente hacia abajo (BaSO₄ es insoluble)."
        q1 = f"¿Cuántos electrones de valencia posee el átomo neutro de {name} y cuál es su valencia habitual?"
        a1 = f"Posee 2 electrones de valencia en su subnivel s exterior y actúa con valencia 2 (estado +2)."
        q2 = f"¿Qué tipo de óxido forma el {name} al combinarse con oxígeno elemental?"
        a2 = f"Forma un óxido básico de fórmula {sym}O."

    elif family == "Halógeno":
        everyday = f"Halógeno no metálico de alta electronegatividad, reactivo y con fuerte tendencia a aceptar electrones para formar sales haluro."
        pitfall = f"Forma moléculas diatómicas no polares ({sym}₂). Con metales actúa como aceptor formando aniones haluro {sym}⁻ con estado de oxidación −1."
        level_exp = f"Configuración terminal ns² np⁵ con 7 electrones de valencia. Requiere solo 1 electrón para saturar su octeto a gas noble."
        anom_rules = f"Afinidad electrónica y poder oxidante elevados. Son los no metales más agresivos y corrosivos de su respectivo período."
        fam_rel = f"Comparte con el Flúor y Cloro la formación de sales haluros alcalinas con redes cristalinas iónicas cúbicas."
        misconc = f"Creer que los halógenos son metales conductores; son no metales típicamente aislantes con enlaces covalentes moleculares."
        q1 = f"¿Cuántos electrones de valencia tiene un halógeno como el {name}?"
        a1 = f"7 electrones de valencia (configuración ns² np⁵)."
        q2 = f"¿Cuál es el estado de oxidación más común del {name} frente a los metales electropositivos?"
        a2 = f"Estado de oxidación −1 (ión haluro {sym}⁻)."

    elif family == "Gas noble":
        everyday = f"Gas inerte monatómico de baja reactividad, utilizado en iluminación de descarga, atmósfera protectora en procesos de alta tecnología y criogenia."
        pitfall = f"Posee capa de valencia cerrada y máxima energía de ionización en su período. En exámenes preuniversitarios su reactividad estándar se considera nula."
        level_exp = f"Configuración electrónica de octeto completo ns² np⁶ (salvo el Helio que es 1s²). Todos los orbitales están totalmente apareados (diamagnético)."
        anom_rules = f"Fuerzas intermoleculares débiles de dispersión de London exclusivas; sus puntos de ebullición son los más bajos de sus períodos."
        fam_rel = f"Comparte con Ne, Ar, Kr y Xe la estructura de capa completa y su condición de gases monatómicos inertes."
        misconc = f"Creer que los gases nobles forman redes cristalinas en condiciones normales; son moléculas monatómicas aisladas."
        q1 = f"¿Por qué el {name} no forma compuestos químicos en condiciones ambientales?"
        a1 = f"Porque posee su capa electrónica de valencia completamente saturada (octeto cerrado), con altísima energía de ionización y afinidad electrónica desfavorable."
        q2 = f"¿Cuántos electrones desapareados contiene un átomo neutro de {name}?"
        a2 = f"Cero electrones desapareados; es una especie totalmente diamagnética."

    elif family == "Lantánido":
        everyday = f"Elemento de las tierras raras (bloque 4f), indispensable en imanes de neodimio-hierro-boro para motores eléctricos, catalizadores y fósforos de pantallas de alta definición."
        pitfall = f"Estado de oxidación predominante y característico: +3. La 'contracción lantánida' produce que los radios iónicos decrezcan regularmente desde el Lantano hasta el Lutecio, afectando a los metales del bloque d del período 6."
        level_exp = f"Llenado progresivo de los orbitales 4f internos apantallados por las capas 5s, 5p y 6s exteriores."
        anom_rules = f"La contracción lantánida explica por qué elementos de la tercera serie de transición (como Hf) tienen radios atómicos casi idénticos a los de la segunda serie (Zr)."
        fam_rel = f"Forma cationes trivalentes {sym}³⁺ químicamente muy semejantes entre sí, lo que dificulta su separación mineralógica industrial."
        misconc = f"Pensar que las tierras raras son 'raras' en la corteza terrestre; muchas son más abundantes que la plata o el oro pero dispersas mineralmente."
        q1 = f"¿Cuál es el estado de oxidación más estable y característico de los lantánidos como el {name}?"
        a1 = f"Estado de oxidación +3."
        q2 = f"¿A qué fenómeno atómico se debe que los radios atómicos de los lantánidos disminuyan gradualmente a lo largo de la serie?"
        a2 = f"A la contracción lantánida: el deficiente apantallamiento de los 14 electrones 4f sobre la carga nuclear creciente."

    elif family == "Actínido":
        everyday = f"Elemento radiactivo de la serie de actínidos (bloque 5f). Elementos como el Uranio y Plutonio son fundamentales en reactores nucleares de generación eléctrica y tecnología nuclear médica."
        pitfall = f"Todos los actínidos son inestables y radiactivos. A diferencia de los lantánidos, presentan mayor variedad de estados de oxidación (+3, +4, +5, +6) debido a la menor diferencia de energía entre los orbitales 5f y 6d."
        level_exp = f"Llenado progresivo del subnivel cuántico 5f. Núcleos atómicos pesados sujetos a desintegración alfa, beta o fisión espontánea."
        anom_rules = f"Su inestabilidad nuclear los convierte en elementos de interés en física nuclear y radioprotección."
        fam_rel = f"Pertenece a la serie f del período 7; los elementos transuránicos (Z > 92) son todos artificiales producidos en reactores o aceleradores de partículas."
        misconc = f"Creer que todos los actínidos existen en la naturaleza; a partir del Neptunio (Z=93) son elementos sintéticos de origen humano."
        q1 = f"¿A qué bloque cuántico de la tabla periódica pertenece el {name}?"
        a1 = f"Al bloque f (serie de actínidos, orbitales 5f)."
        q2 = f"¿Qué propiedad nuclear define a todos los miembros de la serie de los actínidos?"
        a2 = f"Que todos sus isótopos son radiactivos e inestables."

    elif family == "Transición":
        everyday = f"Metal de transición del bloque d con elevada dureza, alto punto de fusión y buena conductividad eléctrica y térmica. Usado en aleaciones estructurales y catálisis química."
        pitfall = f"Presenta múltiples estados de oxidación debido a la participación de los electrones (n-1)d y ns en el enlace químico. Al ionizarse pierde primero los electrones del nivel exterior s."
        level_exp = f"Configuración electrónica con subnivel d en proceso de llenado. Muchas de sus sales presentan colores característicos en solución acuosa por transiciones d-d."
        anom_rules = f"Forma complejos de coordinación con ligandos neutros o aniónicos, y cationes de radio intermedio."
        fam_rel = f"Comparte propiedades típicas de metales pesados: brillo metálico, maleabilidad, ductilidad y estados de valencia variables."
        misconc = f"Creer que al oxidarse el átomo pierde electrones del subnivel d antes que del nivel s exterior."
        q1 = f"¿De qué nivel cuántico se desprenden los electrones al ionizarse un metal de transición como el {name}?"
        a1 = f"Se desprenden primero del nivel s más externo antes que del subnivel d interno."
        q2 = f"¿Por qué los metales de transición presentan múltiples estados de oxidación?"
        a2 = f"Porque la diferencia de energía entre los electrones ns y (n-1)d es muy pequeña, permitiendo que ambos participen en los enlaces químicos."

    elif family == "Metaloide":
        everyday = f"Metaloide con propiedades intermedias entre metales y no metales, con comportamiento de semiconductor eléctrico ideal para circuitos electrónicos y óptica avanzada."
        pitfall = f"Presenta enlaces covalentes de red y electronegatividad intermedia. Su comportamiento ácido-base en óxidos suele ser anfótero o débilmente ácido."
        level_exp = f"Configuración de bloque p. Sus electrones de valencia están ligados a energías intermedias, permitiendo conducción térmica y eléctrica bajo estímulo de voltaje o temperatura."
        anom_rules = f"Define la frontera diagonal de la tabla periódica que separa a los metales electropositivos de los no metales electronegativos."
        fam_rel = f"Comparte características con el Silicio y Germanio: aspecto metálico pero fragilidad mecánica y conducción semiconductora."
        misconc = f"Creer que los metaloides son metales impuros; son elementos puros con bandas energéticas intermedias únicas."
        q1 = f"¿Qué propiedad eléctrica caracteriza a los metaloides como el {name}?"
        a1 = f"Son semiconductores: su conductividad eléctrica es moderada y aumenta al elevar la temperatura o por dopaje."
        q2 = f"¿Dónde se ubican los metaloides en la tabla periódica?"
        a2 = f"En la línea diagonal divisoria que separa a los metales (a la izquierda) de los no metales (a la derecha)."

    elif family == "Metal":
        everyday = f"Metal post-transición del bloque p, de densidad moderada y enlaces metálicos más suaves que los metales de transición puros. Utilizado en aleaciones ligeras y componentes industriales."
        pitfall = f"Sus puntos de fusión y ebullición son notablemente inferiores a los de los metales de transición del mismo período. Puede presentar carácter anfótero en sus óxidos."
        level_exp = f"Configuración electrónica de bloque p terminal con subnivel d interno completamente lleno."
        anom_rules = f"Afectado por el efecto de par inerte en los períodos 5 y 6, estabilizando estados de oxidación dos unidades inferiores al número de grupo."
        fam_rel = f"Comparte con el Aluminio, Galio e Indio el carácter metálico en el bloque p."
        misconc = f"Pensar que todos los metales son duros y refractarios; los metales post-transición suelen ser blandos y de bajo punto de fusión."
        q1 = f"¿A qué bloque cuántico de la tabla periódica pertenece el {name}?"
        a1 = f"Al bloque p (metales del bloque p o post-transición)."
        q2 = f"¿Qué tendencia presentan los puntos de fusión de los metales post-transición frente a los metales de transición?"
        a2 = f"Son significativamente más bajos debido a un enlace metálico menos rígido."

    else: # No metal
        everyday = f"No metal esencial con alta electronegatividad y tendencia a formar enlaces covalentes compartiendo electrones con otros no metales o enlaces iónicos con metales."
        pitfall = f"Mal conductor del calor y de la electricidad en estado sólido. Forma óxidos ácidos (anhídridos) que al reaccionar con agua producen oxácidos."
        level_exp = f"Configuración de bloque p con varios electrones de valencia. Alta afinidad electrónica y alta energía de ionización."
        anom_rules = f"Forma redes moleculares covalentes o moléculas discretas de bajo punto de fusión y ebullición."
        fam_rel = f"Comparte con C, N, O y S la formación de óxidos ácidos y enlaces covalentes estables."
        misconc = f"Creer que los no metales no pueden tener estados de oxidación positivos; frente a átomos más electronegativos actúan con estados positivos."
        q1 = f"¿Qué tipo de óxidos forman típicamente los no metales como el {name} al combinarse con oxígeno?"
        a1 = f"Óxidos ácidos (anhídridos), que al hidratarse forman oxácidos."
        q2 = f"¿Cómo es la conductividad eléctrica de los no metales en estado sólido?"
        a2 = f"Son aislantes eléctricos (no conducen la corriente eléctrica)."

    return {
        "everyday_context": everyday,
        "exam_pitfall": pitfall,
        "quantum_breakdown": {
            "level_explanation": level_exp,
            "anomalies_or_rules": anom_rules
        },
        "family_relationship": fam_rel,
        "misconception": misconc,
        "self_check_quiz": [
            {
                "question": q1,
                "answer": a1,
                "explanation": f"Explicación rigurosa de química preuniversitaria para {name} ({sym}, Z={z}).",
                "concept_tested": "Propiedades periódicas y estados de oxidación",
                "exam_tag": "Concepto Clave"
            },
            {
                "question": q2,
                "answer": a2,
                "explanation": f"Fundamento analítico de examen de admisión para {name} ({sym}).",
                "concept_tested": "Reactividad química y nomenclatura",
                "exam_tag": "Admisión Preuniversitaria"
            }
        ]
    }

# Build dictionary for all 118 elements
pedagogy_database = {}

for elem in elements:
    z = elem["number"]
    sym = elem["symbol"]
    name = elem["name"]

    if z in special_preuni:
        data = special_preuni[z]
    else:
        data = generate_generic_pedagogy(elem)

    pedagogy_database[z] = {
        "symbol": sym,
        "name": name,
        "z": z,
        "pedagogy": data
    }

# Save pedagogyData.js
js_content = "// pedagogyData.js - Grounded Pedagogical Database for Pre-University Admission (UNMSM, UNI)\n"
js_content += "// Built according to IUPAC standards, lmmentel/mendeleev, Bowserinator, and PhET/RSC frameworks.\n\n"
js_content += "export const pedagogyData = " + json.dumps(pedagogy_database, indent=2, ensure_ascii=False) + ";\n\n"
js_content += "export function getElementPedagogy(identifier) {\n"
js_content += "  if (!identifier) return null;\n"
js_content += "  if (typeof identifier === 'number') return pedagogyData[identifier] || null;\n"
js_content += "  const num = parseInt(identifier, 10);\n"
js_content += "  if (!isNaN(num)) return pedagogyData[num] || null;\n"
js_content += "  const symClean = String(identifier).trim().toLowerCase();\n"
js_content += "  const found = Object.values(pedagogyData).find(e => e.symbol.toLowerCase() === symClean);\n"
js_content += "  return found || null;\n"
js_content += "}\n"

with open("src/data/pedagogyData.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("Generated src/data/pedagogyData.js successfully with 118 elements!")
