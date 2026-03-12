import { Calculator, Book, FlaskConical, Globe } from "lucide-react";

export const categories = [
  { id: "maths", name: "Maths", icon: "Calculator", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: "histoire_geo", name: "Histoire-Géo", icon: "Globe", color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "sciences", name: "Sciences Phy.", icon: "FlaskConical", color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: "svt", name: "SVT", icon: "Book", color: "text-green-500", bg: "bg-green-500/10" },
  { id: "philo", name: "Philosophie", icon: "Book", color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: "tech", name: "Technique/Info", icon: "Calculator", color: "text-gray-400", bg: "bg-gray-400/10" },
];

export const classes = [
  // GÉNÉRAL
  { id: "6eme", name: "6ème (Collège)", group: "Général" },
  { id: "5eme", name: "5ème (Collège)", group: "Général" },
  { id: "4eme", name: "4ème (Collège)", group: "Général" },
  { id: "3eme", name: "3ème (Collège)", group: "Général" },
  { id: "lycee_a", name: "Lycée : Série A (Littéraire)", group: "Général" },
  { id: "lycee_c", name: "Lycée : Série C (Maths-Physique)", group: "Général" },
  { id: "lycee_d", name: "Lycée : Série D (Sciences Naturelles)", group: "Général" },
  
  // TECHNIQUE INDUSTRIEL
  { id: "tech_e", name: "Série E (Génie Industriel)", group: "Technique Industriel" },
  { id: "tech_f1", name: "Série F1 (Construction Mécanique)", group: "Technique Industriel" },
  { id: "tech_f2", name: "Série F2 (Électronique)", group: "Technique Industriel" },
  { id: "tech_f3", name: "Série F3 (Électrotechnique)", group: "Technique Industriel" },
  { id: "tech_f4", name: "Série F4 (Génie Civil)", group: "Technique Industriel" },
  { id: "tech_h1", name: "Série H1 (Système d'Info. & Gestion Admin.)", group: "Technique Industriel" },
  { id: "tech_h2", name: "Série H2 (Système d'Info. & Gestion des Orga.)", group: "Technique Industriel" },
  { id: "tech_h3", name: "Série H3 (Système d'Info. & Numérique / Prog.)", group: "Technique Industriel" },
  { id: "tech_h4", name: "Série H4 (Maintenance des Systèmes Info.)", group: "Technique Industriel" },
  { id: "tech_h5", name: "Série H5 (Réseaux et Télécommunications)", group: "Technique Industriel" },

  // TECHNIQUE COMMERCIAL
  { id: "tech_g1", name: "Série G1 (Techniques Administratives)", group: "Technique Commercial" },
  { id: "tech_g2", name: "Série G2 (Techniques de Gestion / Compta.)", group: "Technique Commercial" },
  { id: "tech_g3", name: "Série G3 (Techniques de Commercialisation)", group: "Technique Commercial" },
  { id: "tech_bg", name: "Série BG (Bureautique et Gestion)", group: "Technique Commercial" }
];

export const getIconForCategory = (iconName: string) => {
  switch (iconName) {
    case "Calculator": return Calculator;
    case "Book": return Book;
    case "FlaskConical": return FlaskConical;
    case "Globe": return Globe;
    default: return Book;
  }
};

export const lessons = [
  // ... (keeping existing lessons but mapping classId correctly)
  {
    id: "col_maths_1",
    categoryId: "maths",
    classId: "3eme",
    title: "Théorème de Pythagore",
    image: "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&q=80",
    content: "Dans un triangle rectangle, le carré de la longueur de l'hypoténuse est égal à la somme des carrés des longueurs des deux autres côtés.",
    duration: "10 min",
    level: "3ème"
  },
  {
    id: "h1_admin_1",
    categoryId: "tech",
    classId: "tech_h1",
    title: "Techniques de Saisie Rapide",
    image: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=400&q=80",
    content: "Apprendre la dactylographie et l'organisation des documents administratifs numériques.",
    duration: "20 min",
    level: "Série H1"
  },
  {
    id: "h3_algo_1",
    categoryId: "tech",
    classId: "tech_h3",
    title: "Algorithmes de Tri",
    image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400&q=80",
    content: "Étude des tris par insertion, à bulles et quicksort pour optimiser vos programmes.",
    duration: "30 min",
    level: "Série H3"
  },
  {
    id: "bg_gestion_1",
    categoryId: "tech",
    classId: "tech_bg",
    title: "Gestion des Stocks",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
    content: "Méthodes FIFO et LIFO pour une gestion efficace des inventaires en entreprise.",
    duration: "25 min",
    level: "Série BG"
  },
  {
    id: "tech_ti_1",
    categoryId: "tech",
    classId: "tech_ti",
    title: "Structure de données : Listes",
    image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=400&q=80",
    content: "Introduction aux listes chaînées et aux tableaux dynamiques en programmation.",
    duration: "15 min",
    level: "Série TI"
  }
];

export const quizzes = [
  {
    id: "q_6eme_1",
    classId: "6eme",
    subject: "Maths",
    title: "Les Bases du Calcul",
    questions: [
      {
        question: "Combien font 15 + 27 ?",
        options: ["32", "42", "45", "52"],
        correctAnswer: 1
      },
      {
        question: "Quel est le résultat de 4 x 8 ?",
        options: ["24", "28", "32", "36"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "q_3eme_1",
    classId: "3eme",
    subject: "Maths",
    title: "Objectif Brevet : Pythagore",
    questions: [
      {
        question: "Dans un triangle rectangle, l'hypoténuse est le côté...",
        options: ["Le plus petit", "Le plus grand", "Adjacent à l'angle droit"],
        correctAnswer: 1
      },
      {
        question: "Si AC² = AB² + BC², alors le triangle ABC est rectangle en :",
        options: ["A", "B", "C"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "q_h1_1",
    classId: "tech_h1",
    subject: "Bureautique",
    title: "Gestion Administrative",
    questions: [
      {
        question: "Quel logiciel est principalement utilisé pour le traitement de texte ?",
        options: ["Excel", "Word", "PowerPoint", "Access"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "q_h3_1",
    classId: "tech_h3",
    subject: "Programmation",
    title: "Bases du C++",
    questions: [
      {
        question: "Quel symbole termine une instruction en C++ ?",
        options: [".", ":", ";", "!"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "q_h5_1",
    classId: "tech_h5",
    subject: "Réseaux",
    title: "Protocoles IP",
    questions: [
      {
        question: "Quelle est l'adresse de loopback standard en IPv4 ?",
        options: ["192.168.1.1", "127.0.0.1", "8.8.8.8"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "q_bg_1",
    classId: "tech_bg",
    subject: "Gestion",
    title: "Organisation d'Entreprise",
    questions: [
      {
        question: "Qui est au sommet de la hiérarchie dans une SA ?",
        options: ["Le DG", "Le Conseil d'Administration", "Les employés"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "q_f1_1",
    classId: "tech_f1",
    subject: "Mécanique",
    title: "Dessin Technique",
    questions: [
      {
        question: "Quel type de trait est utilisé pour les contours vus ?",
        options: ["Trait continu fort", "Trait interrompu fin", "Trait mixte fin"],
        correctAnswer: 0
      }
    ]
  },
  {
    id: "q_f2_1",
    classId: "tech_f2",
    subject: "Génie Électrique",
    title: "L'Oscilloscope",
    questions: [
      {
        question: "Que mesure-t-on sur l'axe horizontal d'un oscilloscope ?",
        options: ["La tension", "Le temps", "La fréquence"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "q_g1_1",
    classId: "tech_g1",
    subject: "Gestion",
    title: "Correspondance Administrative",
    questions: [
      {
        question: "Quelle est la formule de politesse standard pour une autorité ?",
        options: ["Cordialement", "Bien à vous", "Veuillez agréer, Monsieur..."],
        correctAnswer: 2
      }
    ]
  }
];

export const progressData = [
  { subject: "Maths", score: 17, color: "bg-emerald-400" },
  { subject: "Histoire", score: 12, color: "bg-amber-500" },
  { subject: "Sciences", score: 8, color: "bg-red-500" },
  { subject: "Géographie", score: 15, color: "bg-green-500" }
];

