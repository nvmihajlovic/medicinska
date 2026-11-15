import { createHash } from "node:crypto";
import sanitizeHtml from "sanitize-html";

type Translation = { title: string; excerpt: string; texts: (string | null)[] };
type TranslatedArticle = { hash: string; en: Translation; de: Translation };
type SourceArticle = { id: number; title: string; excerpt: string; content: string };

const translations: Record<number, TranslatedArticle> = {
  6652: {
    hash: "90c9fdb07cccbe4a7d9321d415485a10215b5275385dfa40ca63d57f2993fcd1",
    en: { title: "Welcome for first-year students", excerpt: "Reception details and class lists for first-year students.", texts: [] },
    de: { title: "Empfang der Schülerinnen und Schüler des ersten Jahrgangs", excerpt: "Informationen zum Empfang und Klassenlisten des ersten Jahrgangs.", texts: [] },
  },
  6824: {
    hash: "e91c8d4630470e23e0bb225e6cecb35e98378e146be89a96b9166386c03f0b16",
    en: {
      title: "First-year class assignments",
      excerpt: "Classes I4 (nurse educator) and I5 (healthcare caregiver) were assigned to one class during enrolment. First-year students will be welcomed on 1 September 2026 at 7:15 in the school gym.",
      texts: ["I1", "Download", "I2", "Download", "I3", "Download", "Classes I4 (nurse educator) and I5 (healthcare caregiver) were assigned to one class during enrolment. First-year students will be welcomed on 1 September 2026 at 7:15 in the school gym."],
    },
    de: {
      title: "Klasseneinteilung des ersten Jahrgangs",
      excerpt: "Die Klassen I4 (Pflegekraft und Erziehung) und I5 (Pflegeassistenz) wurden bei der Anmeldung einer gemeinsamen Klasse zugeteilt. Die Aufnahme der Schülerinnen und Schüler des ersten Jahrgangs findet am 1. September 2026 um 7:15 Uhr in der Schulsporthalle statt.",
      texts: ["I1", "Herunterladen", "I2", "Herunterladen", "I3", "Herunterladen", "Die Klassen I4 (Pflegekraft und Erziehung) und I5 (Pflegeassistenz) wurden bei der Anmeldung einer gemeinsamen Klasse zugeteilt. Die Aufnahme der Schülerinnen und Schüler des ersten Jahrgangs findet am 1. September 2026 um 7:15 Uhr in der Schulsporthalle statt."],
    },
  },
  6813: {
    hash: "d070c75351d8bdda0e7ca52065d7d515333c8d02d02b5796c37e6ebd7ea9618b",
    en: { title: "August examination schedule for the 2025/2026 school year", excerpt: "", texts: ["Examination schedule", "Download"] },
    de: { title: "Prüfungsplan für den Augusttermin im Schuljahr 2025/2026", excerpt: "", texts: ["Prüfungsplan", "Herunterladen"] },
  },
  6794: {
    hash: "b9a09ee07622f72ee9322ff454d48fdee20ad7a03055c3f121241a3109cef56b",
    en: {
      title: "Literary competitions during the school year",
      excerpt: "Sara Komarica's poem was selected from 1,200 entries in a competition for young Serbian poets. Marija Nikolić won third place in a literary competition organised by the Vranje Cultural Centre.",
      texts: ["Sara Komarica of class IV1 entered the “Best Young Poets of Serbia” competition for writers under 19. Her poem “Salvation” was selected from 1,200 poems and published in a collection of the 300 best poems by young Serbian authors under 19. Marija Nikolić of class IV2 entered the “Bora Stanković” Vranje Cultural Centre's literary competition with her poem “In the Shadow of Silk and Stone” and won third place among entrants from outside the city of Vranje. Serbian language and literature teacher Nataša Arambašić commends them for their poetic skill and motivation to write poetry."],
    },
    de: {
      title: "Literaturwettbewerbe im Schuljahr",
      excerpt: "Ein Gedicht von Sara Komarica wurde aus 1.200 Beiträgen eines Wettbewerbs für junge serbische Dichterinnen und Dichter ausgewählt. Marija Nikolić belegte bei einem Literaturwettbewerb des Kulturzentrums Vranje den dritten Platz.",
      texts: ["Sara Komarica aus der Klasse IV1 nahm am Wettbewerb „Die besten jungen Dichterinnen und Dichter Serbiens“ für unter 19-Jährige teil. Ihr Gedicht „Rettung“ wurde unter 1.200 Gedichten ausgewählt und in einer Sammlung der 300 besten Gedichte junger Autorinnen und Autoren unter 19 Jahren aus Serbien veröffentlicht. Marija Nikolić aus der Klasse IV2 nahm mit ihrem Gedicht „Im Schatten von Seide und Stein“ am Literaturwettbewerb des Kulturzentrums „Bora Stanković“ in Vranje teil und belegte den dritten Platz unter den Teilnehmenden außerhalb der Stadt Vranje. Die Lehrerin für serbische Sprache und Literatur Nataša Arambašić lobt sie für ihre dichterischen Fähigkeiten und ihre Motivation, Gedichte zu schreiben."],
    },
  },
  6786: {
    hash: "346d5f3d7d064b9ac23cea4665c6d1d6831ad552c0ba7a102993d3dafca09256",
    en: {
      title: "Serbian language and language culture competition",
      excerpt: "Anastasija Petković and Teodora Cvetkovski qualified for the national Serbian language and language culture competition in Tršić, where both placed fourth.",
      texts: ["During the school year, Anastasija Petković of class I3 and Teodora Cvetkovski of class IV2 qualified for the national Serbian language and language culture competition in Tršić on 24 May by placing first and second in the municipal and district competitions. Both students placed fourth with 17 points out of a possible 20. We congratulate them and wish graduating student Teodora continued success in achieving her goals, including admission to medical school, and Anastasija continued success in competitions and in representing our school.", "Serbian language and literature teachers Dragana Urošev and Nataša Arambašić."],
    },
    de: {
      title: "Wettbewerb für serbische Sprache und Sprachkultur",
      excerpt: "Anastasija Petković und Teodora Cvetkovski qualifizierten sich für den nationalen Wettbewerb für serbische Sprache und Sprachkultur in Tršić, wo beide den vierten Platz belegten.",
      texts: ["Im Laufe des Schuljahres qualifizierten sich Anastasija Petković aus der Klasse I3 und Teodora Cvetkovski aus der Klasse IV2 durch erste und zweite Plätze bei den Gemeinde- und Bezirkswettbewerben für den nationalen Wettbewerb für serbische Sprache und Sprachkultur am 24. Mai in Tršić. Beide Schülerinnen belegten mit 17 von maximal 20 Punkten den vierten Platz. Wir gratulieren ihnen und wünschen der Abschlussschülerin Teodora weiterhin Erfolg bei ihren Zielen, darunter der Aufnahme eines Medizinstudiums, und Anastasija weiterhin Erfolg bei Wettbewerben und bei der Vertretung unserer Schule.", "Lehrerinnen für serbische Sprache und Literatur Dragana Urošev und Nataša Arambašić."],
    },
  },
  6779: {
    hash: "bdfe289b7dfe630f07afddd1ce8638d8e515e0859aeb7ba42178368e0710c637",
    en: {
      title: "Youth Forum report",
      excerpt: "The Youth Forum introduced young people from Vojvodina to the European Union and the importance of participation in society. Ten students represented our school.",
      texts: [
        "The Youth Forum was designed as an interactive educational event to introduce young people from Vojvodina to how the European Union works and the importance of their participation in society. The forum was held at the OPENS Youth Centre, transformed for the occasion into a symbolic European Parliament. Teams of secondary school students from Novi Sad, Pančevo, Sombor, Bečej and Zrenjanin participated. Our school was represented by ten students, five each from the first and third years, accompanied by the school psychologist and educational specialist as mentors.",
        "Over two days, students joined different teams and took part in workshops, a simulation of the European Parliament and other activities, developing their skills in argumentation, critical thinking and active citizenship.",
        "They also had ample time to meet, socialise and exchange experiences.",
        "The organisers at the OPENS Youth Centre were excellent hosts, providing accommodation at the Ribarsko Ostrvo tourist complex, plentiful food, excellent working conditions and gifts for every participant.",
        "Our students returned with new knowledge, happy memories and new friendships.",
      ],
    },
    de: {
      title: "Bericht vom Youth Forum",
      excerpt: "Das Youth Forum vermittelte jungen Menschen aus der Vojvodina, wie die Europäische Union funktioniert und warum gesellschaftliche Beteiligung wichtig ist. Zehn Lernende vertraten unsere Schule.",
      texts: [
        "Das Youth Forum wurde als interaktive Bildungsveranstaltung konzipiert, um jungen Menschen aus der Vojvodina die Funktionsweise der Europäischen Union und die Bedeutung ihrer gesellschaftlichen Beteiligung näherzubringen. Das Forum fand im Jugendzentrum OPENS statt, das dafür symbolisch in ein Europäisches Parlament verwandelt wurde. Teams von Schülerinnen und Schülern aus Novi Sad, Pančevo, Sombor, Bečej und Zrenjanin nahmen teil. Unsere Schule vertraten zehn Lernende, je fünf aus dem ersten und dritten Jahrgang, begleitet von schulpsychologischen und pädagogischen Fachkräften.",
        "An zwei Tagen arbeiteten die Schülerinnen und Schüler in verschiedenen Teams und beteiligten sich an Workshops, einer Simulation des Europäischen Parlaments und weiteren Aktivitäten. Dabei stärkten sie ihre Fähigkeiten in Argumentation, kritischem Denken und aktiver gesellschaftlicher Teilhabe.",
        "Außerdem hatten sie genügend Zeit, sich kennenzulernen, miteinander Zeit zu verbringen und Erfahrungen auszutauschen.",
        "Die Veranstalter des Jugendzentrums OPENS waren hervorragende Gastgeber. Sie sorgten für Unterkunft in der Ferienanlage Ribarsko Ostrvo, reichliche Verpflegung, sehr gute Arbeitsbedingungen und Geschenke für alle Teilnehmenden.",
        "Unsere Schülerinnen und Schüler nahmen neue Erkenntnisse, schöne Erlebnisse und neue Freundschaften mit.",
      ],
    },
  },
  6774: {
    hash: "20a36b3cbc988f6c4986c09be70d9a2a9ec48ef1d6a23f6ace5931300fb5e54e",
    en: {
      title: "Military careers presentation",
      excerpt: "On 26 March 2026, class IV2 attended a presentation on military careers at the Pančevo Cultural Centre.",
      texts: ["On Thursday, 26 March 2026, students of class IV2 attended a military careers presentation at the Pančevo Cultural Centre, accompanied by teacher Mirjana Bondžić. Serbian Army Captain Siniša Stojčić spoke about opportunities to join the Serbian Army after secondary school and to continue education at the Military Academy. Afterwards, the graduating students visited an exhibition of Serbian Army weapons on the square and in the park in front of Pančevo City Hall."],
    },
    de: {
      title: "Vorstellung militärischer Berufe",
      excerpt: "Am 26. März 2026 besuchte die Klasse IV2 eine Veranstaltung über militärische Berufe im Kulturzentrum Pančevo.",
      texts: ["Am Donnerstag, dem 26. März 2026, besuchten die Schülerinnen und Schüler der Klasse IV2 in Begleitung der Lehrerin Mirjana Bondžić eine Veranstaltung über militärische Berufe im Kulturzentrum Pančevo. Hauptmann Siniša Stojčić von der serbischen Armee erläuterte Beschäftigungsmöglichkeiten nach der Sekundarschule und die Möglichkeit, die Ausbildung an der Militärakademie fortzusetzen. Anschließend besuchten die Abschlussklassen eine Waffenausstellung der serbischen Armee auf dem Platz und im Park vor der Stadtverwaltung von Pančevo."],
    },
  },
  6761: {
    hash: "bc894fe8ea8b6a51b2711277c80b5d3b87fc9c34b821278de78aac5e4b84e6f6",
    en: {
      title: "Presentation of the University of Novi Sad Faculty of Agriculture",
      excerpt: "Representatives of the Faculty of Agriculture introduced graduating students to study opportunities in Novi Sad.",
      texts: ["On Friday, 13 March 2026, lecturers and associates from the Department of Phytomedicine at the Faculty of Agriculture in Novi Sad met our graduating students during a civic education lesson. They presented the faculty, its study conditions and the University of Novi Sad, including the advantages of studying in the provincial capital. Faculty assistant Antonije Žunić and a doctoral student led the presentation. This began our work this school year to help students choose faculties and colleges for further education. We hope some of our graduates will choose to continue their education in Novi Sad at its Faculty of Agriculture."],
    },
    de: {
      title: "Vorstellung der Landwirtschaftlichen Fakultät der Universität Novi Sad",
      excerpt: "Vertreterinnen und Vertreter der Landwirtschaftlichen Fakultät stellten den Abschlussklassen Studienmöglichkeiten in Novi Sad vor.",
      texts: ["Am Freitag, dem 13. März 2026, stellten sich Lehrende und Mitarbeitende des Fachbereichs Phytomedizin der Landwirtschaftlichen Fakultät in Novi Sad im Unterricht zur politischen Bildung unseren Abschlussklassen vor. Sie präsentierten die Fakultät, die Studienbedingungen und die Universität Novi Sad sowie die Vorteile eines Studiums in der Hauptstadt unserer Provinz. Die Veranstaltung wurde vom Fakultätsassistenten Antonije Žunić und einer Doktorandin geleitet. Damit begannen wir in diesem Schuljahr, unsere Lernenden bei der Wahl einer Fakultät oder Hochschule für ihre weitere Ausbildung zu unterstützen. Wir hoffen, dass einige unserer Absolventinnen und Absolventen ihre Ausbildung an der Landwirtschaftlichen Fakultät in Novi Sad fortsetzen."],
    },
  },
  6744: {
    hash: "924ccc78c551283f462d7bee055ea45c7802d38e06d7f9b221b9569af8e118d2",
    en: {
      title: "Anti-bullying week",
      excerpt: "From 23 to 27 February 2026, students and teachers marked anti-bullying week with activities throughout the school.",
      texts: [
        "The last week of February, 23–27 February 2026, was dedicated to combating bullying at our school. Students and teachers marked the week with a different activity each day.",
        "On Monday, 23 February, a “Sweet Day” cake sale was hosted by students from classes I4 and IV4. All proceeds were earmarked to help graduating students fund their graduation celebration.",
        "Tuesday, 24 February, was devoted to making Pink Shirt Day posters and decorating the school. First- and second-year students contributed particularly during civic education lessons, with a strong spirit of teamwork and cooperation between students and teachers. While some decorated, others competed or cheered on their favourites at a charity volleyball tournament organised by the student parliament.",
        "Wednesday, 25 February, was Pink Shirt Day. The school turned pink as students and teachers wore pink shirts to mark this international day against bullying.",
        "Thursday, 26 February, was the most exciting day. Between lessons, the student parliament and Serbian language and literature teacher Dragana Urošev organised a talent competition called “I Have Talent”. Students and teachers performed nine musical acts and one ballet act. The jury had a difficult task, helped by audience votes. The jury comprised principal Svetlana Kalapiš as chair, teacher Vesna Bogdan, administrative employee Marija Tešić and former student Jana Cvetinović. While the jury deliberated, the presenters read messages of affection that students had placed in a box in the school corridor over the preceding weeks. The principal then announced the results. A group of graduating students from IV1 and IV3 won with the song “Rano”. Ognen, Dušan and Mateja from I2 placed second with “Crno i zlatno”; Sanja Đurić from II4 placed third with “Dozvola za ljubav”. The principal provided prizes for the first seven contestants: a trip to Timișoara for two, a day at the Hotel Tamiš spa for two, lunch for two at Poco Loco restaurant in Pančevo, a cake, cakes from Poco Loco and gifts from Golden Rose for sixth and seventh places.",
        "After the busy Thursday, Friday was reserved for reflection. During civic education and class teacher lessons, students wrote messages with good wishes for one another.",
      ],
    },
    de: {
      title: "Woche gegen Mobbing",
      excerpt: "Vom 23. bis 27. Februar 2026 gestalteten Schülerinnen, Schüler und Lehrkräfte an der Schule eine Woche gegen Mobbing.",
      texts: [
        "Die letzte Februarwoche, vom 23. bis 27. Februar 2026, war an unserer Schule dem Kampf gegen Mobbing gewidmet. Schülerinnen, Schüler und Lehrkräfte gestalteten jeden Tag eine besondere Aktivität.",
        "Am Montag, dem 23. Februar, organisierten Schülerinnen der Klassen I4 und IV4 einen „Süßen Tag“ mit Kuchenverkauf. Der gesamte Erlös sollte den Abschlussklassen bei der Finanzierung ihres Abschlussballs helfen.",
        "Am Dienstag, dem 24. Februar, wurden Plakate zum Pink Shirt Day erstellt und die Schule geschmückt. Besonders die ersten und zweiten Klassen beteiligten sich im Unterricht zur politischen Bildung. Dabei zeigte sich der Zusammenhalt und die Zusammenarbeit zwischen Lernenden und Lehrkräften. Während einige die Schule schmückten, spielten andere bei einem vom Schülerparlament organisierten Volleyball-Benefizturnier mit oder feuerten ihre Favoriten an.",
        "Der Mittwoch, 25. Februar, stand im Zeichen des Pink Shirt Day. Die Schule wurde rosa: Schülerinnen, Schüler und Lehrkräfte trugen rosa T-Shirts und setzten damit ein Zeichen zum internationalen Tag gegen Mobbing.",
        "Der Donnerstag, 26. Februar, war der spannendste Tag. Zwischen den Unterrichtsstunden organisierten das Schülerparlament und die Lehrerin für serbische Sprache und Literatur Dragana Urošev einen Talentwettbewerb mit dem Titel „Ich habe Talent“. Schülerinnen, Schüler und Lehrkräfte zeigten neun musikalische Beiträge und eine Ballettnummer. Die Jury hatte keine leichte Aufgabe und wurde bei ihrer Entscheidung durch die Stimmen des Publikums unterstützt. Ihr gehörten die Schulleiterin Svetlana Kalapiš als Vorsitzende, die Lehrerin Vesna Bogdan, die Verwaltungsmitarbeiterin Marija Tešić und die ehemalige Schülerin Jana Cvetinović an. Während die Jury beriet, lasen die Moderatoren Liebesbotschaften vor, die Lernende in den vorangegangenen Wochen in einer Box im Schulflur gesammelt hatten. Anschließend gab die Schulleiterin das Ergebnis bekannt. Eine Gruppe von Abschlussschülern aus IV1 und IV3 gewann mit dem Lied „Rano“. Ognen, Dušan und Mateja aus I2 belegten mit „Crno i zlatno“ den zweiten Platz, Sanja Đurić aus II4 mit „Dozvola za ljubav“ den dritten. Für die ersten sieben Teilnehmenden stellte die Schulleiterin Preise bereit: eine Reise nach Timișoara für zwei Personen, einen Tag im Spa des Hotels Tamiš für zwei, ein Mittagessen für zwei im Restaurant Poco Loco in Pančevo, eine Torte, Kuchen von Poco Loco und Geschenke von Golden Rose für den sechsten und siebten Platz.",
        "Nach dem ereignisreichen Donnerstag war der Freitag dem Rückblick gewidmet. Im Unterricht zur politischen Bildung und in den Klassenleiterstunden schrieben sich die Lernenden gegenseitig Nachrichten mit guten Wünschen.",
      ],
    },
  },
  6738: {
    hash: "82d68a1cdb3a0352f07452ff252b78d20688ff2bc2ba3240c05781edbd7e7dad",
    en: {
      title: "District English language competition",
      excerpt: "Five students represented our school at the district English competition in Vršac; Ana Krstevska qualified for the national competition.",
      texts: ["The district English language competition took place on Sunday, 8 March 2026, at the “Borislav Petrov-Braca” Gymnasium in Vršac. Five students from our school participated, accompanied by their teachers and mentors Maja Kolenović and Nataša Džamtoska. Ana Krstevska of class II2 was the only student to qualify for the national competition, scheduled for 10 May 2026 at the Faculty of Philology in Belgrade."],
    },
    de: {
      title: "Bezirkswettbewerb in englischer Sprache",
      excerpt: "Fünf Lernende vertraten unsere Schule beim Englischwettbewerb in Vršac; Ana Krstevska qualifizierte sich für den nationalen Wettbewerb.",
      texts: ["Der Bezirkswettbewerb in englischer Sprache fand am Sonntag, dem 8. März 2026, am Gymnasium „Borislav Petrov-Braca“ in Vršac statt. Fünf Schülerinnen und Schüler unserer Schule nahmen teil, begleitet von ihren Lehrerinnen und Mentorinnen Maja Kolenović und Nataša Džamtoska. Ana Krstevska aus der Klasse II2 qualifizierte sich als einzige für den nationalen Wettbewerb, der am 10. Mai 2026 an der Philologischen Fakultät in Belgrad stattfinden sollte."],
    },
  },
  6730: {
    hash: "bf412ac370b02fc60241393647baad0d8f2250695d170819e9d439811ff1ee86",
    en: {
      title: "School patron day celebration 2026",
      excerpt: "Our school celebrated Saint Sava's Day with a ceremony and a programme prepared by students and teachers.",
      texts: ["On 27 January 2026 our school celebrated its patron Saint Sava with a ceremony and the cutting of the traditional celebratory bread. The ceremony began with the Saint Sava hymn, followed by the cutting of the bread. Students and teachers of Serbian language and literature and music then presented a programme commemorating our first educator. We wish all students and educators a happy Saint Sava's Day."],
    },
    de: {
      title: "Feier des Schulpatrons 2026",
      excerpt: "Unsere Schule beging den Tag des heiligen Sava mit einer Feier und einem von Lernenden und Lehrkräften vorbereiteten Programm.",
      texts: ["Am 27. Januar 2026 feierte unsere Schule ihren Schutzpatron, den heiligen Sava, mit einer Festveranstaltung und dem Anschneiden des traditionellen Festbrots. Die Feier begann mit der Sankt-Sava-Hymne, gefolgt vom Anschneiden des Brots. Anschließend präsentierten die Schülerinnen und Schüler gemeinsam mit den Lehrkräften für serbische Sprache und Literatur sowie Musik ein Programm zum Gedenken an unseren ersten Aufklärer. Wir wünschen allen Lernenden und Lehrkräften einen frohen Sankt-Sava-Tag."],
    },
  },
  6727: {
    hash: "4c31c059673bc845c5760750691eca8e15440a2f09be373fd8d33ba9bbd18c52",
    en: {
      title: "Student's success in the “Energy Is All Around Us” competition",
      excerpt: "Anja Mrđen won second place in a multimedia presentation competition with the support of teacher Minodora Čoloka.",
      texts: ["Student Anja Mrđen successfully represented Medical School “Stevica Jovanović” of Pančevo at the final event of the “Energy Is All Around Us” competition in Novi Sad. Her multimedia presentation won ", "second place", " and was created with guidance from teacher Minodora Čoloka."],
    },
    de: {
      title: "Erfolg einer Schülerin beim Wettbewerb „Energie ist überall um uns“",
      excerpt: "Anja Mrđen belegte mit Unterstützung der Lehrerin Minodora Čoloka den zweiten Platz im Bereich Multimedia-Präsentationen.",
      texts: ["Die Schülerin Anja Mrđen vertrat die Medizinische Schule „Stevica Jovanović“ aus Pančevo erfolgreich bei der Abschlussveranstaltung des Wettbewerbs „Energie ist überall um uns“ in Novi Sad. Ihre Multimedia-Präsentation belegte ", "den zweiten Platz", " und entstand unter der Betreuung der Lehrerin Minodora Čoloka."],
    },
  },
  6709: {
    hash: "a694db5149f2118f4d09250288467e880a3cb89f038e54396c3631516abb02cf",
    en: {
      title: "New Year performance",
      excerpt: "Students and teachers organised a New Year performance in cooperation with the Zbrinjavanje care home.",
      texts: ["Our school has cooperated with the Zbrinjavanje care home for years, and this year we organised another New Year performance. Students from classes I5, III5 and III1 participated, together with colleagues Tamara Todorović, Jelena Stanojevski and Dragana Urošev."],
    },
    de: {
      title: "Neujahrsaufführung",
      excerpt: "Lernende und Lehrkräfte organisierten gemeinsam mit dem Pflegeheim Zbrinjavanje eine Neujahrsaufführung.",
      texts: ["Unsere Schule arbeitet seit Jahren mit dem Pflegeheim Zbrinjavanje zusammen. Deshalb organisierten wir auch in diesem Jahr eine Neujahrsaufführung. Schülerinnen und Schüler der Klassen I5, III5 und III1 sowie die Kolleginnen Tamara Todorović, Jelena Stanojevski und Dragana Urošev nahmen teil."],
    },
  },
  6704: {
    hash: "8c6277ac27c9249a9c3b6caade6eebe5f0013a77e565d27d5420e1909b9760c8",
    en: {
      title: "New Year gift distribution",
      excerpt: "Students and teacher Vanja Lazarević prepared a performance for the distribution of New Year gifts.",
      texts: ["Santa Claus visited our school this year and gave gifts to the children. Students from classes III4 and IV4 prepared the performance together with teacher Vanja Lazarević."],
    },
    de: {
      title: "Verteilung von Neujahrsgeschenken",
      excerpt: "Lernende und die Lehrerin Vanja Lazarević bereiteten eine Aufführung zur Verteilung von Neujahrsgeschenken vor.",
      texts: ["Der Weihnachtsmann besuchte in diesem Jahr unsere Schule und verteilte Geschenke an die Kinder. Schülerinnen und Schüler der Klassen III4 und IV4 bereiteten die Aufführung gemeinsam mit der Lehrerin Vanja Lazarević vor."],
    },
  },
  6701: {
    hash: "da5a590b06eabf00f513e81d522b3cec73204b245d033f6898cbce21653049ae",
    en: { title: "Humanitarian activities", excerpt: "The school humanitarian team organised two collection drives with support from students, parents and staff.", texts: ["Our school's humanitarian team carried out two activities with tremendous support from students, parents and all staff. We collected a substantial amount of new and used clothing and footwear, school supplies, hygiene products and sweets for children at Svratište and for visually impaired and blind people at Zbrinjavanje."] },
    de: { title: "Humanitäre Aktionen", excerpt: "Das humanitäre Team der Schule organisierte mit Unterstützung von Lernenden, Eltern und Beschäftigten zwei Sammelaktionen.", texts: ["Das humanitäre Team unserer Schule führte mit großer Unterstützung der Schülerinnen und Schüler, Eltern und aller Beschäftigten zwei Aktionen durch. Wir sammelten eine beträchtliche Menge neuer und gebrauchter Kleidung und Schuhe, Schulmaterial, Hygieneartikel und Süßigkeiten für Kinder bei Svratište und für sehbehinderte und blinde Menschen bei Zbrinjavanje."] },
  },
  6678: {
    hash: "1535051ed1a288bbcc270766ad4a27c97ae9a434c45b5bfc409df67b2800214b",
    en: { title: "Blood donation at our school again", excerpt: "The school held its first voluntary blood donation drive of the school year on 5 November 2025.", texts: ["On 5 November 2025, the first voluntary blood donation drive of the school year took place in the gym. Every year many students join the drive, continuing our school's longstanding cooperation with the Red Cross."] },
    de: { title: "Wieder Blutspende an unserer Schule", excerpt: "Am 5. November 2025 fand die erste freiwillige Blutspendeaktion des Schuljahres statt.", texts: ["Am 5. November 2025 fand in der Sporthalle die erste freiwillige Blutspendeaktion des Schuljahres statt. Jedes Jahr beteiligen sich viele Lernende und setzen damit die langjährige Zusammenarbeit unserer Schule mit dem Roten Kreuz fort."] },
  },
  6672: {
    hash: "afbcc983457c3860b373d66c28d33d88221bae491db2e8c8191487528463f376",
    en: { title: "Farewell to our dear teachers", excerpt: "Our school welcomed former teachers and said farewell to a colleague entering retirement.", texts: ["On 7 November 2025, former teachers Draga David and Jelena Đurović briefly joined our school's teachers' council. We are always sorry to say goodbye to someone who has spent years with us, but happy to see them enjoying retirement or a new workplace.", "At the teachers' council meeting on 26 December 2025, we said farewell to another colleague entering a well-earned retirement: teacher Ljiljana Marković, who left an indelible mark on our school."] },
    de: { title: "Abschied von unseren geschätzten Lehrerinnen", excerpt: "Unsere Schule begrüßte ehemalige Lehrerinnen und verabschiedete eine Kollegin in den Ruhestand.", texts: ["Am 7. November 2025 besuchten die ehemaligen Lehrerinnen Draga David und Jelena Đurović kurz die Lehrerkonferenz unserer Schule. Es fällt uns immer schwer, jemanden zu verabschieden, der viele Jahre mit uns verbracht hat; zugleich freuen wir uns, wenn diese Menschen ihren Ruhestand oder ihren neuen Arbeitsplatz genießen.", "Bei der Lehrerkonferenz am 26. Dezember 2025 verabschiedeten wir eine weitere Kollegin in den wohlverdienten Ruhestand: die Lehrerin Ljiljana Marković, die an unserer Schule bleibende Spuren hinterlassen hat."] },
  },
  6669: {
    hash: "7270dd160316c2a42a630a1b3d66c44eb530dc06b8277d28e458c9793d2d5614",
    en: { title: "Pedal against cancer", excerpt: "Our school supported the breast cancer awareness event held on the city quay.", texts: ["On 4 October 2025, the “Pedal against Cancer” event was again held on the city quay to raise awareness of breast cancer. As every year, our school was pleased to support this humanitarian initiative."] },
    de: { title: "In die Pedale gegen Krebs", excerpt: "Unsere Schule unterstützte die Veranstaltung zur Aufklärung über Brustkrebs am Stadtkai.", texts: ["Am 4. Oktober 2025 fand am Stadtkai erneut die Veranstaltung „In die Pedale gegen Krebs“ statt, um auf Brustkrebs aufmerksam zu machen. Wie jedes Jahr unterstützte unsere Schule diese humanitäre Aktion gern."] },
  },
  6643: {
    hash: "add7c3e64a10ebf16c297ef9096ddc1feacc1a86776f0dd8b79bf94fb9f2c37d",
    en: { title: "August resit examination schedule, 2024/2025", excerpt: "From 10 July to 22 August 2025 the school will be open from 08:00 to 12:00.", texts: ["From 10 July to 22 August 2025, the school will be open from 08:00 to 12:00.", "Svetlana Kalapiš."] },
    de: { title: "Plan der Nachprüfungen im Augusttermin 2024/2025", excerpt: "Vom 10. Juli bis zum 22. August 2025 ist die Schule von 08:00 bis 12:00 Uhr geöffnet.", texts: ["Vom 10. Juli bis zum 22. August 2025 ist die Schule von 08:00 bis 12:00 Uhr geöffnet.", "Svetlana Kalapiš."] },
  },
  6631: {
    hash: "1bcdb890b29096836bccfd25f9c7545bbea696f245ef470c3db1f4441761d5a3",
    en: { title: "Fruška Gora Marathon", excerpt: "Students walked approximately ten kilometres in the 48th Fruška Gora Marathon.", texts: ["On 27 April 2025, our students took part in a walk on Fruška Gora as part of the 48th Fruška Gora Marathon. They walked approximately ten kilometres along the Eastern Beginner's Marathon route."] },
    de: { title: "Fruška-Gora-Marathon", excerpt: "Lernende wanderten beim 48. Fruška-Gora-Marathon ungefähr zehn Kilometer.", texts: ["Am 27. April 2025 nahmen Lernende unserer Schule im Rahmen des 48. Fruška-Gora-Marathons an einer Wanderung auf der Fruška Gora teil. Sie wanderten ungefähr zehn Kilometer auf der östlichen Einsteigerstrecke."] },
  },
  6623: {
    hash: "e8f339d13478a289de881d6a297c7ced254cc58ff714a5b6858b496d298d2ca2",
    en: { title: "World Poetry Day", excerpt: "Poets and Pančevo students, including Anastasija Stanimirović from our school, marked World Poetry Day.", texts: ["On Friday, 21 March, World Poetry Day was marked in what has become a tradition, in cooperation with the Pančevo Cultural Centre, Literary Café and the Pančevo Association of Writers and Literary Translators. Poetry was read by renowned poets such as Ana Ristović, whose poems appear in secondary-school readers, local poets, participants in the Youth Centre's creative writing school and students from Pančevo schools. Among them was Anastasija Stanimirović of our class II3. She bravely presented her verses to her peers and to much more experienced participants. We hope this rewarding cooperation continues and that our students continue to nurture the written word."] },
    de: { title: "Welttag der Poesie", excerpt: "Dichterinnen und Dichter sowie Lernende aus Pančevo, darunter Anastasija Stanimirović unserer Schule, begingen den Welttag der Poesie.", texts: ["Am Freitag, dem 21. März, wurde in inzwischen guter Tradition gemeinsam mit dem Kulturzentrum Pančevo, dem Literaturcafé und dem Verband der Schriftsteller und Literaturübersetzer der Stadt Pančevo der Welttag der Poesie begangen. Bekannte Dichterinnen und Dichter wie Ana Ristović, deren Gedichte in Lesebüchern für die Sekundarschule stehen, lokale Autoren, Teilnehmende der Schreibschule des Jugendzentrums und Lernende aus Pančevo lasen Gedichte. Unter ihnen war Anastasija Stanimirović aus unserer Klasse II3. Sie stellte ihre Verse mutig Gleichaltrigen und viel erfahreneren Teilnehmenden vor. Wir hoffen, dass diese schöne Zusammenarbeit weitergeht und unsere Lernenden die Freude am geschriebenen Wort bewahren."] },
  },
  6608: {
    hash: "7f970fce718c7ee99ad20e326832ef3d6c48139963e48689ac8997263f998005",
    en: { title: "Blood donation 2025", excerpt: "Medical School students donated blood on 20 March 2025.", texts: ["On 20 March 2025, Medical School students donated blood for everyone who needs it during treatment. Thank you, dear students: you are our heroes of the day."] },
    de: { title: "Blutspende 2025", excerpt: "Lernende der Medizinischen Schule spendeten am 20. März 2025 Blut.", texts: ["Am 20. März 2025 spendeten Lernende der Medizinischen Schule Blut für alle, die es während ihrer Behandlung benötigen. Vielen Dank, liebe Schülerinnen und Schüler: Ihr seid unsere Helden des Tages."] },
  },
  6603: {
    hash: "569c850f101a48cdeea5658262b1795dea9c21b99854170698867cfddc2ec7f0",
    en: { title: "Cooperation with the Pančevo Red Cross", excerpt: "Teachers and Red Cross volunteers educate young people about voluntary blood donation.", texts: ["Ensuring an adequate blood supply requires ongoing work to encourage voluntary blood donation. Our colleagues Snežana Mihajlović and Mirjana Stokić have for years educated and encouraged students to donate. One of the first organisers was retired teacher Nada Silva Kovač, who passed her work and love of donation on to younger colleagues. This work began many years ago at the Pančevo Blood Transfusion Service, in cooperation with its wonderful staff and Dr Rada Railić Ristovska, whose example and support inspired us to encourage donation too. Initially the work was limited to our school; from 2018 it extended to other Pančevo secondary schools, when the Pančevo Red Cross took over organisation of voluntary blood donation in cooperation with the Novi Sad Blood Transfusion Institute. Since 2018, teachers Snežana Mihajlović and Mirjana Stokić, together with Jelena Trifunović and Pančevo Red Cross volunteers, have given talks in secondary schools in the municipality about encouraging and educating young people on voluntary blood donation. A warm approach, practical examples and basic information help address students' questions and fears. We are especially glad that our students continue to donate after secondary school: this shows that encouragement works and that donating blood is invaluable.", "Perhaps we cannot do great things, but we can do small things with great love. Become a blood donor and brighten your day and someone else's."] },
    de: { title: "Zusammenarbeit mit dem Roten Kreuz Pančevo", excerpt: "Lehrkräfte und Freiwillige des Roten Kreuzes informieren junge Menschen über die freiwillige Blutspende.", texts: ["Um ausreichende Blutvorräte sicherzustellen, muss die Bevölkerung kontinuierlich zur freiwilligen Blutspende motiviert werden. Unsere Kolleginnen Snežana Mihajlović und Mirjana Stokić motivieren und informieren seit Jahren Lernende. Zu den ersten Organisatorinnen gehörte die pensionierte Lehrerin Nada Silva Kovač, die ihre Arbeit und ihre Begeisterung für das Spenden an jüngere Kolleginnen weitergab. Die Motivationsarbeit begann vor vielen Jahren beim Bluttransfusionsdienst Pančevo in Zusammenarbeit mit dessen hervorragendem Team und Dr. Rada Railić Ristovska, die uns durch ihr Beispiel und ihre Unterstützung dazu anregten, selbst Menschen zu motivieren. Zunächst beschränkte sich die Arbeit auf unsere Schule. Seit 2018 umfasst sie auch andere weiterführende Schulen in Pančevo, nachdem das Rote Kreuz Pančevo die Organisation freiwilliger Blutspenden gemeinsam mit dem Bluttransfusionsinstitut Novi Sad übernommen hatte. Seit 2018 halten die Lehrerinnen Snežana Mihajlović und Mirjana Stokić gemeinsam mit Jelena Trifunović und Freiwilligen des Roten Kreuzes Pančevo an weiterführenden Schulen der Gemeinde Vorträge, um junge Menschen über die freiwillige Blutspende zu informieren und zu motivieren. Ein herzlicher Umgang, Beispiele aus der Praxis und grundlegende Informationen helfen, Fragen und Ängste abzubauen. Besonders freuen wir uns, dass unsere Lernenden auch nach dem Schulabschluss weiter Blut spenden: Das zeigt, dass die Motivation erfolgreich und Blutspenden unbezahlbar ist.", "Vielleicht können wir keine großen Dinge tun, aber kleine Dinge mit viel Liebe. Spende auch du Blut und verschönere damit deinen Tag und den anderer Menschen."] },
  },
  6585: {
    hash: "10d27adc1c6f85601fb7e37b9b0a0640038d0f261930f8e8c1d6d78e89273c46",
    en: { title: "Pink Shirt Day", excerpt: "Students and teachers wore pink and decorated the school to mark the day against bullying.", texts: ["This school year our school once again marked ", "“Pink Shirt Day", "”", " (Wednesday 2", "6", " February), ", "the popular name for the International Day against Bullying, with teachers and students wearing something pink or a pink symbol.", "Students' work, posters and signs about violence prevention were displayed at the entrance and in the corridors. Pink balloon flowers on the staircase added to the atmosphere. Teacher Vesna Bogdan and students were the main organisers of the decorations.", "We thank all teachers ", "and ", "all students who participated in the activities, as well as everyone who came to school wearing pink and helped the Medical School say a decisive NO to violence."] },
    de: { title: "Pink Shirt Day", excerpt: "Lernende und Lehrkräfte trugen Rosa und schmückten die Schule zum Tag gegen Mobbing.", texts: ["Auch in diesem Schuljahr beging unsere Schule den ", "„Pink Shirt Day", "“", " (Mittwoch, den 2", "6", ". Februar), ", "wie der internationale Tag gegen Mobbing genannt wird. Lehrkräfte und Lernende kamen in Rosa oder trugen ein rosa Zeichen.", "Am Eingang und in den Fluren hingen Arbeiten, Poster und Plakate der Lernenden zur Gewaltprävention. Rosa Blumen aus Luftballons im Treppenhaus verstärkten die Atmosphäre. Die Lehrerin Vesna Bogdan und die Lernenden organisierten die Dekoration.", "Wir danken allen Lehrkräften ", "und ", "allen Schülerinnen und Schülern, die sich an den Aktivitäten beteiligten, sowie allen, die in Rosa zur Schule kamen und dazu beitrugen, dass die Medizinische Schule entschieden NEIN zu Gewalt sagt."] },
  },
  6576: {
    hash: "1c25e75ccd77f939e9b94b9d1d412ddd96e9f5398bf3cbb0433ac5db6d415697",
    en: { title: "Humanitarian collection", excerpt: "The school collected clothing, toys, school supplies and hygiene products for local institutions.", texts: ["During the first term of 2024/2025, the school organised a humanitarian collection of clothing, toys, school supplies and personal hygiene products. We thank all colleagues and students who responded. The donations were sorted and distributed to the children's ward of Pančevo General Hospital, the Pančevo Red Cross, the Spomenak home for children and young people and the Zbrinjavanje home for people with visual impairments. A particularly memorable visit to Spomenak was organised by teachers Sanja Stojku and Anđela Andrejević with students Nađa Cakić II4, Andrea Dragojević II4 and Nikolina Hučka III4.", "The visit to the Zbrinjavanje home was also notable. It was organised by teacher Tamara Todorović and Dr Jelena Đurović with students Milica Lakićević II5, Emilija Todorov II5, Jelena Antić II5, Aleksa Petrović III1 and Vladan Savić III2.", "They prepared a cultural and entertainment programme in which the residents also participated."] },
    de: { title: "Humanitäre Sammelaktion", excerpt: "Die Schule sammelte Kleidung, Spielzeug, Schulmaterial und Hygieneartikel für örtliche Einrichtungen.", texts: ["Im ersten Halbjahr des Schuljahres 2024/2025 organisierte die Schule eine humanitäre Sammlung von Kleidung, Spielzeug, Schulmaterial und Körperpflegeartikeln. Wir danken allen Kolleginnen, Kollegen und Lernenden, die mitgemacht haben. Die Spenden wurden sortiert und an die Kinderabteilung des Allgemeinen Krankenhauses Pančevo, das Rote Kreuz Pančevo, das Kinder- und Jugendheim Spomenak und das Heim Zbrinjavanje für Menschen mit Sehbehinderung verteilt. Besonders eindrucksvoll war der Besuch im Heim Spomenak, den die Lehrerinnen Sanja Stojku und Anđela Andrejević mit den Schülerinnen Nađa Cakić II4, Andrea Dragojević II4 und Nikolina Hučka III4 organisierten.", "Auch der Besuch im Heim Zbrinjavanje war bemerkenswert. Die Lehrerin Tamara Todorović und die Ärztin Jelena Đurović organisierten ihn mit Milica Lakićević II5, Emilija Todorov II5, Jelena Antić II5, Aleksa Petrović III1 und Vladan Savić III2.", "Sie bereiteten ein Kultur- und Unterhaltungsprogramm vor, an dem auch die Bewohnerinnen und Bewohner teilnahmen."] },
  },
  6572: {
    hash: "43eff06a03856f30ea5cab78f48ebe69266efe80355fd2648889297b3f2ce1e0",
    en: { title: "Retirement farewell", excerpt: "", texts: [] },
    de: { title: "Verabschiedung in den Ruhestand", excerpt: "", texts: [] },
  },
  6555: {
    hash: "ebe69b78f02b54a36cb9df40c0aa51f94bbe5ab98176652eec0736fd6c924086",
    en: { title: "Humanitarian memorial tournament", excerpt: "Six teams participated in the “For Dušan” futsal memorial tournament.", texts: ["The “For Dušan” humanitarian futsal memorial tournament took place on 23 December 2024. Six teams participated, including two teams of Dušan's friends from his year group."] },
    de: { title: "Humanitäres Gedenkturnier", excerpt: "Sechs Mannschaften nahmen am Futsal-Gedenkturnier „Für Dušan“ teil.", texts: ["Das humanitäre Futsal-Gedenkturnier „Für Dušan“ fand am 23. Dezember 2024 statt. Sechs Mannschaften nahmen teil, darunter zwei Mannschaften mit Freunden aus Dušans Jahrgang."] },
  },
  6549: {
    hash: "0b84f8bf2a52e4b17cb99d16dd7f78ea53f07547479b32d534260469b515543a",
    en: { title: "Be part of a safe team", excerpt: "Students participated in a road safety campaign with workshops and first-aid demonstrations.", texts: ["On 6 December 2024, our students attended an activity in the “Be Part of a Safe Team” campaign organised by the Road Traffic Safety Agency of the Republic of Serbia to inform the public about appropriate conduct after a road accident. Students participated in discussions and workshops and used a simulator to see how dangerous using a phone while driving can be. They also learned the rules for riding the increasingly popular electric scooter. Volunteers and instructors from the Pančevo and Kovin Red Cross, our colleagues, demonstrated first-aid skills and appropriate conduct at an accident scene."] },
    de: { title: "Sei Teil eines sicheren Teams", excerpt: "Lernende nahmen an einer Verkehrssicherheitskampagne mit Workshops und Erste-Hilfe-Vorführungen teil.", texts: ["Am 6. Dezember 2024 nahmen Lernende unserer Schule an einer Aktion der Kampagne „Sei Teil eines sicheren Teams“ der Verkehrssicherheitsagentur der Republik Serbien teil. Sie soll die Bevölkerung über das richtige Verhalten bei einem Verkehrsunfall informieren. Die Lernenden beteiligten sich an Diskussionen und Workshops und erlebten mithilfe eines Simulators, wie gefährlich die Handynutzung beim Fahren ist. Sie lernten auch die Regeln für das Fahren mit immer beliebteren E-Scootern kennen. Freiwillige und Ausbilder des Roten Kreuzes Pančevo und Kovin sowie unsere Kolleginnen und Kollegen demonstrierten Erste Hilfe und das richtige Verhalten an einer Unfallstelle."] },
  },
  6542: {
    hash: "1b5678eb66a500d3fdc002876ecdcd835ffd471a11f526071792b30fee1328ac",
    en: { title: "Appearance on the programme “Buđenje”", excerpt: "A first television appearance on the programme “Buđenje” became an unforgettable experience.", texts: ["I once wrote that there are days, even Friday the thirteenth, when your heart and soul are full of happiness: somehow the energies of the universe align and a dream comes true. Then you go a step further and, together with two wonderful young people, help make their dream come true too. The highlight is talking about those dreams and much more on the wonderful programme “Buđenje”, in a relaxed and humorous tone about very delicate subjects, with my favourite television presenters Dejan and Dragana. They are the same in person as on television, which is rare in this world. Thank you to them and the entire TV Insajder team for making our first television appearance unforgettable.", "Open cookie settings to view the YouTube video."] },
    de: { title: "Auftritt in der Sendung „Buđenje“", excerpt: "Ein erster Fernsehauftritt in der Sendung „Buđenje“ wurde zu einem unvergesslichen Erlebnis.", texts: ["Ich schrieb einmal, dass es solche Tage gibt, sogar einen Freitag, den Dreizehnten, an denen Herz und Seele voller Glück sind: Irgendwie richten sich die Energien des Universums aus und ein Traum wird wahr. Dann geht man einen Schritt weiter und schafft es gemeinsam mit zwei wunderbaren jungen Menschen, auch ihren Traum wahr werden zu lassen. Der Höhepunkt ist, über diese Träume und vieles mehr in der großartigen Sendung „Buđenje“ zu sprechen, in entspannter und humorvoller Atmosphäre über sehr feine Themen, mit meinen liebsten Fernsehgesichtern Dejan und Dragana. Sie sind persönlich genauso wie im Fernsehen, was in dieser Welt selten ist. Danke an sie und das gesamte Team von TV Insajder, dass sie unseren ersten Fernsehauftritt unvergesslich gemacht haben.", "Öffnen Sie die Cookie-Einstellungen, um das YouTube-Video anzusehen."] },
  },
  6533: {
    hash: "83997df8a367c4f41102c1236d68b2577c9348cba8fee096cd55d658644d6c80",
    en: { title: "Regional cystic fibrosis conference", excerpt: "", texts: ["Cystic fibrosis", "Download"] },
    de: { title: "Regionale Konferenz über Mukoviszidose", excerpt: "", texts: ["Mukoviszidose", "Herunterladen"] },
  },
};

export function newsTranslation(article: SourceArticle | undefined, locale: "en" | "de"): Translation | null {
  if (!article) return null;
  const translation = translations[article.id];
  if (!translation) return null;
  const hash = createHash("sha256").update(JSON.stringify([article.title, article.excerpt, article.content])).digest("hex");
  if (hash !== translation.hash) return null;
  if (article.id !== 6652) return translation[locale];
  const texts: (string | null)[] = [];
  let names = 0;
  sanitizeHtml(article.content, { textFilter: (text, tag) => {
    const value = text.trim();
    if (!value) return text;
    if (value === "У понедељак 1.9.2025. године у 7:10 часова одржаће се пријем ученика првог разреда.") {
      texts.push(locale === "en" ? "First-year students will be welcomed on Monday, 1 September 2025 at 7:10." : "Der Empfang der Schülerinnen und Schüler des ersten Jahrgangs findet am Montag, dem 1. September 2025, um 7:10 Uhr statt.");
    } else if (/^Списак ученика I[1-5]$/.test(value)) {
      texts.push(`${locale === "en" ? "Student list" : "Klassenliste"} ${value.slice(-2)}`);
    } else if (value === "Име" || value === "Презиме") {
      texts.push(value === "Име" ? (locale === "en" ? "First name" : "Vorname") : (locale === "en" ? "Surname" : "Nachname"));
    } else if (tag === "td") {
      texts.push(null);
      names++;
    } else {
      throw new Error("Недостаје превод текста списка ученика.");
    }
    return text;
  } });
  if (texts.length !== 292 || names !== 276) throw new Error("Списак ученика није у очекиваном облику.");
  return { ...translation[locale], texts };
}
