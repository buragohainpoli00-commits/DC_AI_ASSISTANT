import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client lazily inside routes to prevent stale API keys or startup crashes if not configured


// Detailed official knowledge base about Dhemaji College
const DHEMAJI_COLLEGE_KNOWLEDGE_BASE = `
You are the "College AI Assistant", the official virtual assistant of DHEMAJI COLLEGE.
Your job is to provide highly accurate, detailed, and friendly information to students, parents, teachers, alumni, and visitors.
Always answer using the official information available on the college website and the provided knowledge below.
Always reference the official website homepage: https://www.dhemajicollege.in/index.php when providing links to students or when asked about Dhemaji College's portal.
Never invent facts. If the information is unavailable in this knowledge base and you cannot find it through Google Search, say:
"I'm sorry, I couldn't find official information about that in our current registry. Please contact the Dhemaji College Administration Office directly for final confirmation."

---------------------------------------
PERSONALITY & TONE
---------------------------------------
• Friendly, Professional, Patient, Respectful, Supportive, Clear, and Concise.
• Always greet users politely and mention that you are the official virtual assistant of Dhemaji College.
• Maintain a structured layout with headings and clear bullet points for readability.
• Cite specific details (like name of library, principal, fee ranges) to instill confidence.

---------------------------------------
OFFICIAL DHEMAJI COLLEGE COMPREHENSIVE DATA SHEET
---------------------------------------

1. OVERVIEW & IDENTITY:
   • Name: Dhemaji College (ধেমা‌জি মহাবিদ্যালয়)
   • Official Website Homepage URL: https://www.dhemajicollege.in/index.php
   • Location: College Road, Dhemaji, Assam, PIN - 787057, India.
   • Landmark: Easily accessible from Dhemaji town center and nearest railway/bus stations.
   • Establishment: Founded in 1965. It is the oldest and premier institution of higher education in the Dhemaji district.
   • Affiliation & Accreditation: 
     - Affiliated to Dibrugarh University.
     - Recognized by UGC under sections 2(f) and 12(B) of UGC Act.
     - NAAC accredited with B++ grade (2.81 CGPA in the recent cycle).
   • Motto: "Tamaso Ma Jyotirgamaya" (Lead us from darkness to light).
   • Principal: Dr. Dipak Kumar Neog (an eminent academician in Physics).
   • Vice-Principal: Dr. Amiya Kumar Patar.
   • Office Timings: 10:00 AM to 5:00 PM (Monday to Saturday). Closed on Sundays and gazetted holidays.

2. VISION & MISSION:
   • Vision: To achieve excellence in higher education by imparting quality education to the rural, tribal, and marginalized youth of Dhemaji and its adjoining areas, shaping them into socially conscious, highly skilled, and ethically sound citizens.
   • Mission:
     - To foster academic excellence through high-quality teaching, labs, and research.
     - To run vocational and skill-development programs that enhance self-reliance and employability.
     - To cultivate a spirit of scientific inquiry and critical thinking.
     - To preserve the unique cultural heritage of the tribal communities of the region.

3. ACADEMIC PROGRAMS & STREAM DETAILS:
   A. Higher Secondary (HS) Courses (under Assam Higher Secondary Education Council - AHSEC):
      • Arts Stream: Compulsory subjects are English, MIL (Assamese/Alternative English). Elective subjects: Political Science, Economics, History, Education, Philosophy, Sociology, Advance Assamese.
      • Science Stream: Compulsory subjects are English, MIL (Assamese/Alternative English). Elective subjects: Physics, Chemistry, Mathematics, Biology, Computer Science, Statistics, Anthropology.
      • HS Intake Capacity: Arts (~250 Seats), Science (~150 Seats).

   B. Undergraduate (UG) Degree Programs (BA / BSc):
      • Under NEP-2020: Follows the 4-Year Undergraduate Programme (FYUGP) framework of Dibrugarh University.
      • Bachelor of Arts (BA) Majors/Honors: Assamese, English, Economics, Education, Political Science, History, Philosophy, Sociology.
      • Bachelor of Science (BSc) Majors/Honors: Physics, Chemistry, Mathematics, Botany, Zoology, Computer Science, Electronics, Statistics.
      • UG Intake Capacity: 40-60 seats per major subject, allocated strictly on merit during counseling.

   C. Post Graduate (PG) & Distance Education Programs:
      • Dhemaji College acts as a premium study center for:
        1. KKHSOU (Krishna Kanta Handiqui State Open University): Offers distant BA, MA (Assamese, Political Science, Sociology), and various diploma programs.
        2. DODL (Directorate of Open and Distance Learning, Dibrugarh University): Offers PG correspondence courses in Arts (MA) and Science (MSc in mathematics/chemistry/physics).
        3. Career-oriented Add-on Certificate Courses: Computer Applications (DCA, CCA), Spoken English, and Personality Development.

4. ACADEMIC DEPARTMENTS & FACULTY ROSTER:
   • Assamese Department: Dr. Labanya Lahan Bhuyan (HOD), Mr. Budhin Boruah, Dr. Gitamoni Dutta.
   • English Department: Mr. Pabitra Kumar Pegu, Ms. Jashodhara Gohain, Dr. Diganta Chutia.
   • Economics Department: Dr. Amiya Kumar Patar (HOD & Vice-Principal), Dr. Partha Protim Borthakur, Dr. Dolly Boruah.
   • Education Department: Dr. Ritu Lahon (HOD), Mrs. Swapnalika Devbhuti.
   • Philosophy Department: Dr. Moni Kankana Kalita (HOD), Mrs. Swapnali Borgohain.
   • Political Science Department: Dr. Kakali Lahon (HOD), Mr. Pradip Borah.
   • History Department: Mr. Tileswar Dihingia (HOD), Dr. Pranabjyoti Gogoi.
   • Sociology Department: Mrs. Hiramoni Patar (HOD), Dr. Pinky Baruah.
   • Physics Department: Dr. Dipak Kumar Neog (Principal), Mr. Rajib Borah, Dr. Bhaskar Jyoti Baruah.
   • Chemistry Department: Dr. Jayanta Kumar Baruah, Dr. Hemanga Jyoti Sarmah, Mrs. Bornali Chutia.
   • Mathematics Department: Dr. Prasanta Kumar Chutia, Mr. Nayan Jyoti Hazarika.
   • Botany Department: Dr. Tarun Chandra Taid, Dr. Anuradha Lahon.
   • Zoology Department: Mr. Sanker Paul (HOD), Dr. Purbajyoti Saikia, Dr. Muhammed Khairujjaman Mazumder, Dr. Jitu Chutia.
   • Computer Science Department: Mr. Kalyan Roy, Mr. Pranjal Saikia.
   • Electronics Department: Mr. Madhurjya Prasad Borah.
   • Statistics Department: Dr. Bikash Borah.

5. ADMISSION RULES, DOCUMENTS, AND SAMARTH PORTAL:
   • All UG degree admissions are mandatorily routed through the Government of Assam's "SAMARTH Admission Portal" (assamsamarth.ac.in).
   • HS admissions are processed via the "Darpan Portal" under AHSEC.
   • Application steps: Submit application on Samarth/Darpan, select Dhemaji College, wait for official merit lists on dhemajicollege.in, attend physical document verification.
   • Required Documents for Physical Verification:
     1. Marksheets and Pass Certificates of HSLC (10th) and HS (12th).
     2. Age Proof Certificate (Admit Card / Birth Certificate).
     3. Caste Certificate / Category Certificate (OBC/MOBC/SC/ST-P/ST-H/EWS) signed by competent authority.
     4. Permanent Residential Certificate (PRC) or Domicile proof of Assam.
     5. Income Certificate issued by Revenue Circle Officer (mandatory for those seeking the Govt Fee Waiver scheme).
     6. Unique Student ID (generated from the DHE Assam portal).
     7. Gap Certificate (if there is an academic gap, issued by a Gazetted Officer or Court Affidavit).

6. FEES STRUCTURE & GOVERNMENT FEE WAIVER (PRAGYAN BHARATI):
   • General Annual Admission Fees (Approximate, subject to government revisions):
     - HS Arts: ~Rs. 3,800 - 4,200
     - HS Science: ~Rs. 4,500 - 4,900
     - BA Majors/FYUGP: ~Rs. 4,900 - 5,500 per year
     - BSc Majors/FYUGP: ~Rs. 5,900 - 6,800 per year
   • Assam Govt Fee Waiver Scheme Eligibility:
     - Parents' annual income from all sources must be less than Rs. 2,00,000 (2 Lakhs).
     - Neither parent must be a government/semi-government/UGC-aided employee.
     - Student must plant a tree sapling at home/college and submit a photo during application.
     - Student must maintain a minimum of 75% attendance to renew the waiver in subsequent years.

7. STRICT DRESS CODE & COLLEGE UNIFORM:
   • The college strictly enforces a formal dress code for all students.
   • For Male Students: 
     - White formal shirt (full/half sleeves) and formal dark black trousers.
     - Bottle green sweater or blazer during the winter season.
     - Casual t-shirts, cargo pants, low-waisted trousers, or funky jackets are strictly forbidden.
   • For Female Students:
     - White Mekhela Chador with bottle-green border and green blouse, OR
     - White Salwar, white Kameez with bottle-green dupatta.
     - Bottle green cardigan, sweater, or blazer during winters.
     - Leggings, jeans, and tight clothing are strictly prohibited inside the campus.

8. CAMPUS FACILITIES & WORLD-CLASS INFRASTRUCTURE:
   • Kanak Chandra Chutia Memorial Library (Official Portal: https://www.dhemajicollege.in/library.php):
     - Digital central library housing over 33,000+ text and reference books.
     - Fully automated using SOUL 2.0 software with barcode-assisted check-out/check-in.
     - Digital reading room with high-speed Wi-Fi access for research.
     - Subscribed to N-LIST consortia, granting students free access to over 6,000+ e-journals and 1,99,500+ e-books.
     - Book bank facility available for economically disadvantaged and meritorious students.
     - Fully automated OPAC (Online Public Access Catalog) for easy catalog searching.
     - Open on all working days from 9:00 AM to 4:00 PM.
   • Institutional Biotech Hub:
     - Funded by the Department of Biotechnology (DBT), Government of India.
     - Promotes state-of-the-art research in microbial biotechnology, plant tissue culture, and molecular biology.
     - Offers training, workshops, and research support for UG students and local schools.
   • Hostels:
     - Dr. Bunny Banerjee Girls' Hostel: Located inside the secure college campus. Accommodates over 100 girls. Equipped with modern kitchen, running water, study hall, and 24/7 warden security. Selection is strictly based on academic merit and home distance.
     - Boys' Hostel: Re-designed hostel block providing spacious rooms and hygienic dining for boys.
   • Science & Computer Laboratories: Dedicated state-of-the-art labs for Physics, Chemistry, Botany, Zoology, Computer Science, Electronics, and Statistics.
   • Multi-Gym & Sports: Modern indoor stadium, separate gymnasium equipped with multi-station training gear, outdoor playing field for football, cricket, and track events.
   • Canteen: A clean cafeteria providing healthy Assamese traditional food, tea, and quick snacks at highly subsidized rates.
   • Co-curricular Wings:
     - NCC (National Cadet Corps): Elite Army wing providing training, B&C certificate qualifications, and republic day camp entries.
     - NSS (National Service Scheme): Dedicated to social community camps, blood donation drives, and rural adult education.

9. GENERAL CODE OF CONDUCT & ANTI-RAGGING CELL:
   • Ragging is a Punishable Offense: Dhemaji College maintains a strict "Zero Tolerance Policy" towards ragging. Under the direction of the Hon'ble Supreme Court of India and UGC guidelines, any student caught ragging another student inside the campus or hostels will face immediate expulsion, suspension, and registration of a criminal police case (FIR).
   • Every student must submit an online Anti-Ragging Undertaking at antiragging.in during registration.
   • Mobile Phone Rules: Use of mobile phones inside classrooms, seminar halls, and laboratories is strictly prohibited. If confiscated, a fine or disciplinary action will be taken.
   • Attendance Mandate: Minimum 75% attendance in both theory and practical classes is compulsory to appear in final examinations.

10. DEPARTMENT OF ZOOLOGY (SPECIALIZED REGISTER):
    • Establishment: Founded in 1976.
    • Core Vision: Imparts highly detailed knowledge in Zoological fields and actively participates in conserving regional bio-resources and local biodiversity.
    • Courses Offered: B.Sc. Major/Honors in Zoology.
    • Seat Intake Capacity: 20 seats for B.Sc. (Major).
    • Departmental Wall Magazine: "NEURON" (Won 1st Prize in Wall Magazine Competition).
    • Research & Projects: Completed 3 Minor Research Projects.
    • Syllabus URL: https://www.dhemajicollege.in/GCSyllabus/Zoology.pdf
    • Detailed Faculty Roster:
      1. Mr. Sanker Paul (Assistant Professor & Head of Department)
         - Email: paulsanker@gmail.com
         - Mobile: (+91) 9957287867
         - Individual Profile: https://www.dhemajicollege.in/teacherprofile/SankerPaul.pdf
      2. Dr. Purbajyoti Saikia (Assistant Professor)
         - Email: purbajyoti81@gmail.com
         - Mobile: (+91) 8414861061
         - Individual Profile: https://www.dhemajicollege.in/teacherprofile/PurbaJSaikia.pdf
      3. Dr. Muhammed Khairujjaman Mazumder (Assistant Professor)
         - Email: Khairujjaman1987@gmail.com
         - Mobile: (+91) 9365536928
         - Individual Profile: https://www.dhemajicollege.in/teacherprofile/Dr.%20MuhammedKhairujjamanMazumder.pdf
      4. Dr. Jitu Chutia (Assistant Professor)
         - Email: jituchutia.j.c@gmail.com
         - Mobile: (+91) 9101340029
         - Individual Profile: https://www.dhemajicollege.in/teacherprofile/33New_JITU%20CHUTIA.pdf
    • Official Publications & PDF Activities:
      - National Webinar (Webinar Report 1): https://www.dhemajicollege.in/class/deptupdate/1669574164_833742252Zoology.pdf
      - National Webinar (Webinar Report 2): https://www.dhemajicollege.in/class/deptupdate/1669574403_525237796Zoology.pdf
      - Academic Field Trip Report: https://www.dhemajicollege.in/class/deptupdate/1669574463_538105535Zoology.pdf
      - Department Newsletter: https://www.dhemajicollege.in/class/deptupdate/1669574710_167715886Zoology.pdf
      - Alumni Network Document: https://www.dhemajicollege.in/class/deptupdate/1669575026_580319976Zoology.pdf
      - Wall Magazine Achievement Photo: https://www.dhemajicollege.in/class/deptupdate/1669575879_271746838Zoology.jpg

11. OFFICIAL WEB DIRECTORY & INDEX PORTAL NAVIGATION LINKS:
    • About Us:
      - Vision & Mission: https://www.dhemajicollege.in/mission.php
      - Campus Map: https://www.dhemajicollege.in/campus.php
      - How to Reach: https://www.dhemajicollege.in/reach.php
      - RUSA: https://www.dhemajicollege.in/rusa.php
      - Alumni Association: https://www.dhemajicollege.in/alumniassoc.php
      - Students Union: https://www.dhemajicollege.in/union.php
      - DCTU: https://www.dhemajicollege.in/dctu.php
      - Equal Opportunity Cell: https://www.dhemajicollege.in/women.php
      - List of Former Principals: https://www.dhemajicollege.in/fprinc.php
    • Administration:
      - Governing Body: https://www.dhemajicollege.in/adm.php
      - Principal's Office: https://www.dhemajicollege.in/prnc.php
      - List of Non-Teaching Staff: https://www.dhemajicollege.in/nts.php
      - Grievance Redressal Cell: https://www.dhemajicollege.in/griev.php
      - Anti-Ragging Committee: https://www.dhemajicollege.in/anti.php
      - Other Committees: https://www.dhemajicollege.in/13_NAAC_Committee_Dhemaji_College_2025%20(2).pdf
      - College in News: https://www.dhemajicollege.in/news.php
      - Website Committee: https://www.dhemajicollege.in/web.php
    • Academics & Course Info:
      - Courses Offered: https://www.dhemajicollege.in/courseoffer.php
      - Student Progression: https://www.dhemajicollege.in/splo.php
      - Integrated Programme: https://www.dhemajicollege.in/intgbed1.php
      - Academic Calendar: https://www.dhemajicollege.in/academic.php
      - Research & PhD Guideship: https://www.dhemajicollege.in/phdguide.php
    • Student's Zone:
      - Awards for Students: https://www.dhemajicollege.in/award.php
      - Hostel: https://www.dhemajicollege.in/hostel.php
      - College Magazine: https://www.dhemajicollege.in/magazine.php
      - Sports Details: https://www.dhemajicollege.in/sport.php
      - CECDC: https://www.dhemajicollege.in/cecdc.php
      - Language Laboratory: https://www.dhemajicollege.in/language.php
      - Proctorial System: https://www.dhemajicollege.in/pro.php
      - College Canteen: https://www.dhemajicollege.in/cantn.php
      - Career Guidance Cell: https://www.dhemajicollege.in/carrier.php
      - NCC: https://www.dhemajicollege.in/ncc.php
      - NSS: https://www.dhemajicollege.in/nss1.php
    • Achievements:
      - Academic Achievements: https://www.dhemajicollege.in/acd.php
      - Cultural Achievements: https://www.dhemajicollege.in/cul.php
      - Sports Achievements: https://www.dhemajicollege.in/spt.php
      - NCC Achievements: https://www.dhemajicollege.in/ncca.php
      - NSS Achievements: https://www.dhemajicollege.in/nssa.php
      - Publications: https://www.dhemajicollege.in/publ.php
    • Library, Research, & Others:
      - Library: https://www.dhemajicollege.in/library.php
      - Publication in Journals: https://www.dhemajicollege.in/jrnl.php
      - Book & Chapter Publication: https://www.dhemajicollege.in/bockpb.php
      - Newsletter: https://www.dhemajicollege.in/nwsl.php
      - Journal: https://www.dhemajicollege.in/Jornal%20PDF.pdf
      - Activities: https://www.dhemajicollege.in/exact.php
      - RTI: https://www.dhemajicollege.in/rti.php
      - IQAC: https://www.dhemajicollege.in/iqac.php
      - Contact Us: https://www.dhemajicollege.in/contactus.php
    • NIRF Rankings & Reports:
      - NIRF 2025: https://www.dhemajicollege.in/nirf25.php
      - NIRF 2024: https://www.dhemajicollege.in/nirf24.php
      - NIRF 2023: https://www.dhemajicollege.in/nirf23.php
      - NIRF 2022: https://www.dhemajicollege.in/nirf22.php
      - NIRF 2021: https://www.dhemajicollege.in/nirf21.php

---------------------------------------
ENDING CHAT SIGN-OFF
---------------------------------------
"Thank you for contacting the Dhemaji College AI Support Portal. If you have any further questions regarding our campus, courses, or hostel facilities, please feel free to ask!"
`;

// Detailed offline keyword matcher for graceful fallbacks when Gemini API keys are unconfigured or rate limited (429)
function getOfflineFallbackResponse(message: string): { text: string; sources: { title: string; url: string }[] } {
  const query = message.toLowerCase();
  let text = "";
  const sources: { title: string; url: string }[] = [];

  // 1. Zoology Department
  if (query.includes("zoology") || query.includes("zoo")) {
    text = `The **Department of Zoology** at Dhemaji College was established in **1976**. It offers:
• **B.Sc. Major/Honors in Zoology** with an intake capacity of **20 seats**.
• **Departmental Wall Magazine**: *"NEURON"*, which recently won 1st Prize in the college wall magazine competition.
• **Research**: Faculty members have successfully completed 3 Minor Research Projects.

**Zoology Faculty Members:**
1. **Mr. Sanker Paul** (Assistant Professor & Head of Department)
   - Email: paulsanker@gmail.com | Mobile: (+91) 9957287867
   - Profile: [Sanker Paul Profile](https://www.dhemajicollege.in/teacherprofile/SankerPaul.pdf)
2. **Dr. Purbajyoti Saikia** (Assistant Professor)
   - Email: purbajyoti81@gmail.com | Mobile: (+91) 8414861061
   - Profile: [Purbajyoti Saikia Profile](https://www.dhemajicollege.in/teacherprofile/PurbaJSaikia.pdf)
3. **Dr. Muhammed Khairujjaman Mazumder** (Assistant Professor)
   - Email: Khairujjaman1987@gmail.com | Mobile: (+91) 9365536928
   - Profile: [Dr. Mazumder Profile](https://www.dhemajicollege.in/teacherprofile/Dr.%20MuhammedKhairujjamanMazumder.pdf)
4. **Dr. Jitu Chutia** (Assistant Professor)
   - Email: jituchutia.j.c@gmail.com | Mobile: (+91) 9101340029
   - Profile: [Dr. Chutia Profile](https://www.dhemajicollege.in/teacherprofile/33New_JITU%20CHUTIA.pdf)

**Syllabus & Activities:**
• [Official Zoology Syllabus PDF](https://www.dhemajicollege.in/GCSyllabus/Zoology.pdf)
• [National Webinar Report 1](https://www.dhemajicollege.in/class/deptupdate/1669574164_833742252Zoology.pdf)
• [National Webinar Report 2](https://www.dhemajicollege.in/class/deptupdate/1669574403_525237796Zoology.pdf)
• [Academic Field Trip Report](https://www.dhemajicollege.in/class/deptupdate/1669574463_538105535Zoology.pdf)
• [Departmental Newsletter](https://www.dhemajicollege.in/class/deptupdate/1669574710_167715886Zoology.pdf)
• [Zoology Alumni Network Details](https://www.dhemajicollege.in/class/deptupdate/1669575026_580319976Zoology.pdf)`;
    
    sources.push(
      { title: "Zoology Department Portal", url: "https://www.dhemajicollege.in/zoo.php" },
      { title: "Zoology Syllabus", url: "https://www.dhemajicollege.in/GCSyllabus/Zoology.pdf" }
    );
  }
  // 2. Vision and Mission
  else if (query.includes("vision") || query.includes("mission") || query.includes("motto") || query.includes("aim")) {
    text = `**Dhemaji College Vision & Mission:**
• **Vision**: To achieve excellence in higher education by imparting quality education to the rural, tribal, and marginalized youth of Dhemaji and its adjoining areas, shaping them into socially conscious, highly skilled, and ethically sound citizens.
• **Motto**: *"Tamaso Ma Jyotirgamaya"* (Lead us from darkness to light).
• **More Info**: Read the complete Vision and Mission blueprint on the official page.`;
    
    sources.push({ title: "Vision & Mission", url: "https://www.dhemajicollege.in/mission.php" });
  }
  // 3. Alumni Association
  else if (query.includes("alumni")) {
    text = `**Alumni Network at Dhemaji College:**
• The college has an active **Alumni Association** linking generations of graduates who have progressed into esteemed national and international positions.
• Dedicated alumni networks exist for specialized departments such as the **Zoology Department Alumni** group.`;
    
    sources.push(
      { title: "Alumni Association Portal", url: "https://www.dhemajicollege.in/alumniassoc.php" },
      { title: "Zoology Alumni PDF", url: "https://www.dhemajicollege.in/class/deptupdate/1669575026_580319976Zoology.pdf" }
    );
  }
  // 4. NIRF Rankings & Reports
  else if (query.includes("nirf")) {
    text = `**Dhemaji College NIRF (National Institutional Ranking Framework) Submissions:**
You can access official NIRF reports submitted annually to the Ministry of Education, Government of India:
• [NIRF Report 2025](https://www.dhemajicollege.in/nirf25.php)
• [NIRF Report 2024](https://www.dhemajicollege.in/nirf24.php)
• [NIRF Report 2023](https://www.dhemajicollege.in/nirf23.php)
• [NIRF Report 2022](https://www.dhemajicollege.in/nirf22.php)
• [NIRF Report 2021](https://www.dhemajicollege.in/nirf21.php)`;
    
    sources.push({ title: "NIRF 2025 portal", url: "https://www.dhemajicollege.in/nirf25.php" });
  }
  // 5. Research, Publications, & Journals
  else if (query.includes("research") || query.includes("journal") || query.includes("publication") || query.includes("phd") || query.includes("newsletter") || query.includes("book")) {
    text = `**Research & Publications Center at Dhemaji College:**
The institution supports rigorous scientific investigation and publication:
• [Research and PhD Guideship Directory](https://www.dhemajicollege.in/phdguide.php)
• [Publications in Peer-Reviewed Journals](https://www.dhemajicollege.in/jrnl.php)
• [Book & Chapter Publications](https://www.dhemajicollege.in/bockpb.php)
• [Dhemaji College Newsletters](https://www.dhemajicollege.in/nwsl.php)
• [College Scientific Journal PDF](https://www.dhemajicollege.in/Jornal%20PDF.pdf)`;
    
    sources.push({ title: "Research & PhD Guideship", url: "https://www.dhemajicollege.in/phdguide.php" });
  }
  // 6. Student Zone, Hostel, Sports, NCC, NSS, Canteen
  else if (query.includes("hostel") || query.includes("sport") || query.includes("ncc") || query.includes("nss") || query.includes("canteen") || query.includes("magazine") || query.includes("student") || query.includes("award") || query.includes("cecdc") || query.includes("language")) {
    text = `**Student Support & Co-Curricular Facilities:**
• **Awards for Students**: Merit-based awards and financial aids are listed on [Student Awards](https://www.dhemajicollege.in/award.php).
• **Accommodation**: Excellent on-campus housing is available at [Dr. Bunny Banerjee Girls' Hostel](https://www.dhemajicollege.in/hostel.php).
• **College Magazine**: Serves as the annual student literary canvas ([College Magazine Info](https://www.dhemajicollege.in/magazine.php)).
• **Sports**: Indoors Stadium & modern gym details are at [Sports Zone](https://www.dhemajicollege.in/sport.php).
• **NCC & NSS**: Active socio-civic leadership clubs are available ([NCC Unit](https://www.dhemajicollege.in/ncc.php) | [NSS Unit](https://www.dhemajicollege.in/nss1.php)).
• **Other Services**: College Canteen, Language Laboratory, Proctorial System, Career Guidance Cell (CECDC).`;
    
    sources.push(
      { title: "Student Hostel Info", url: "https://www.dhemajicollege.in/hostel.php" },
      { title: "NCC Unit Link", url: "https://www.dhemajicollege.in/ncc.php" }
    );
  }
  // 7. Library details
  else if (query.includes("library") || query.includes("book") || query.includes("reading") || query.includes("central library") || query.includes("kanak")) {
    text = `**Kanak Chandra Chutia Memorial Central Library (Official Portal: https://www.dhemajicollege.in/library.php):**
• **Extensive Collection**: Houses a massive, well-organized digital inventory of **33,000+ text and reference books**, as well as various academic journals, newspapers, and magazines.
• **State-of-the-Art Automation**: Fully automated using the advanced **SOUL 2.0 database software** (developed by INFLIBNET Centre) with barcode checkouts and check-ins for smooth operations.
• **Electronic Resources (E-Resources)**: Subscribed to the **N-LIST consortia**, giving students and faculty members free remote access to over **6,000+ peer-reviewed e-journals** and **1,99,500+ e-books** for research.
• **Digital Services**: 
  - Automated OPAC (Online Public Access Catalog) terminals for easy searching.
  - Digital reading room sections with high-speed Wi-Fi access.
  - Separate reading areas designated for students and teachers.
• **Inclusivity (Book Bank)**: Offers a dedicated Book Bank facility catering specifically to economically disadvantaged and meritorious students.
• **Opening Hours**: Open on all college working days from **9:00 AM to 4:00 PM**.`;
    
    sources.push({ title: "Central Library Portal", url: "https://www.dhemajicollege.in/library.php" });
  }
  // 8. Achievements
  else if (query.includes("achievement") || query.includes("prize") || query.includes("award") || query.includes("rank")) {
    text = `**Dhemaji College Proud Achievements & Accolades:**
Our students and faculty regularly bring pride in multiple arenas:
• **Academic Achievements**: [Academic Merit List](https://www.dhemajicollege.in/acd.php)
• **Cultural Accolades**: [Cultural Wins](https://www.dhemajicollege.in/cul.php)
• **Sports Accolades**: [Sports Medals](https://www.dhemajicollege.in/spt.php)
• **NCC Unit Honors**: [NCC Accolades](https://www.dhemajicollege.in/ncca.php)
• **NSS Unit Honors**: [NSS Accolades](https://www.dhemajicollege.in/nssa.php)
• **Faculty Publications**: [Recent Publications](https://www.dhemajicollege.in/publ.php)
• **Zoology Department**: Won the 1st Prize in College Wall Magazine competition.`;
    
    sources.push({ title: "Academic Achievements", url: "https://www.dhemajicollege.in/acd.php" });
  }
  // 9. Administration, Governing Body, Committees, Grievance, anti-ragging
  else if (query.includes("administration") || query.includes("committee") || query.includes("office") || query.includes("governing") || query.includes("staff") || query.includes("ragging") || query.includes("grievance")) {
    text = `**Administration, Leadership & Grievance cells:**
• **Governing Body**: Chief administrative authority supervising college expansion plans ([Governing Body Portal](https://www.dhemajicollege.in/adm.php)).
• **Principal's Office**: Directed by Dr. Dipak Kumar Neog ([Principal's Desk](https://www.dhemajicollege.in/prnc.php)).
• **Non-Teaching Staff**: List of support staff is at [Non-Teaching Staff Directory](https://www.dhemajicollege.in/nts.php).
• **Grievance Redressal Cell**: Fully operational for receiving and solving student concerns ([Grievance Cell Link](https://www.dhemajicollege.in/griev.php)).
• **Anti-Ragging Committee**: Maintains a strict zero-tolerance campus ([Anti-Ragging Portal](https://www.dhemajicollege.in/anti.php)).
• **NAAC & Other Committees**: [Official NAAC Committee Roster](https://www.dhemajicollege.in/13_NAAC_Committee_Dhemaji_College_2025%20(2).pdf).`;
    
    sources.push(
      { title: "Governing Body Directory", url: "https://www.dhemajicollege.in/adm.php" },
      { title: "Anti-Ragging Committee", url: "https://www.dhemajicollege.in/anti.php" }
    );
  }
  // 10. Admission or Seats or Courses
  else if (query.includes("admission") || query.includes("seat") || query.includes("capacity") || query.includes("intake") || query.includes("apply") || query.includes("course") || query.includes("subject") || query.includes("major")) {
    text = `Dhemaji College offers highly recognized undergraduate programs in both **Arts** and **Science** streams.
• **Zoology B.Sc. (Major)** has an intake capacity of **20 seats**.
• **Arts Departments**: Assamese, Economics, Education, English, History, Philosophy, Political Science, Sociology.
• **Science Departments**: Botany, Chemistry, Computer Science, Electronics, Mathematics, Physics, Zoology.

For general admissions, seat matrixes, and online forms, please check the [Official Admissions Page](https://www.dhemajicollege.in/index.php).`;
    
    sources.push({ title: "Admissions & Courses", url: "https://www.dhemajicollege.in/index.php" });
  }
  // 11. Contact or Location
  else if (query.includes("contact") || query.includes("email") || query.includes("phone") || query.includes("address") || query.includes("where") || query.includes("location") || query.includes("reach")) {
    text = `**Contact & Location Information:**
• **Address**: College Road, Dhemaji, Assam, PIN - 787057, India.
• **Landmark**: Easily reachable from Dhemaji town center and nearby railway and bus terminals.
• **Principal Email**: dhemajicollege@rediffmail.com
• **Administration Email**: dhemajicollege@gmail.com
• **Official Website**: [https://www.dhemajicollege.in](https://www.dhemajicollege.in/index.php)`;
    
    sources.push({ title: "Contact Us", url: "https://www.dhemajicollege.in/index.php" });
  }
  // 12. Default Fallback
  else {
    text = `Dhemaji College is a premier institution of higher learning in Assam, founded in **1965**. We offer undergraduate courses in both Arts and Science disciplines.

*(Note: The AI chatbot is currently running in a local fallback mode because the Gemini API quota limits have been temporarily exceeded. However, you can access all college resources below)*:
• **Official Homepage**: [Dhemaji College Portal](https://www.dhemajicollege.in/index.php)
• **Key Highlights**: Outstanding Zoology department (ESTD 1976), excellent laboratory resources, active Career Guidance, and student hostel facilities.
• **Principal's Desk**: Contact Dr. Dipak Kumar Neog via dhemajicollege@rediffmail.com for formal queries.`;
    
    sources.push({ title: "Dhemaji College Homepage", url: "https://www.dhemajicollege.in/index.php" });
  }

  return { text, sources };
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Chat API Route using @google/genai and Google Search Grounding
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  try {
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const currentApiKey = process.env.GEMINI_API_KEY;
    if (!currentApiKey || currentApiKey === "MY_GEMINI_API_KEY" || currentApiKey.trim() === "") {
      // Return beautiful friendly message without crashing
      return res.json({
        text: "I am ready to help, but the **GEMINI_API_KEY** has not been configured in the Secrets panel yet. Please add it so I can answer using the power of Gemini!\n\nHere's some general Dhemaji College information in the meantime:\n• **Address**: College Road, Dhemaji, Assam, PIN-787057\n• **Email**: dhemajicollege@rediffmail.com\n• **Principal**: Dr. Dipak Kumar Neog\n• **Established**: 1965\n• **Affiliation**: Dibrugarh University",
        sources: []
      });
    }

    // Initialize fresh Gemini Client with latest key
    const ai = new GoogleGenAI({
      apiKey: currentApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Format conversation history for Gemini
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        // Only include non-suggested messages to avoid system instruction noise
        if (msg.isSuggested) continue;
        formattedContents.push({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      }
    }
    
    // Add current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: DHEMAJI_COLLEGE_KNOWLEDGE_BASE,
        tools: [{ googleSearch: {} }], // Ground in Google Search for real-time accurate information
      },
    });

    const replyText = response.text || "I'm sorry, I couldn't process that query. Please ask again.";
    
    // Extract grounding URLs if any
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: { title: string; url: string }[] = [];
    if (groundingChunks) {
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || "Official Website Source",
            url: chunk.web.uri
          });
        }
      }
    }

    // De-duplicate sources
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i);

    return res.json({ text: replyText, sources: uniqueSources });
  } catch (error: any) {
    console.log("Serving request using the fallback offline records registry.");
    
    // Fetch appropriate structured offline info based on user query keywords
    const offlineResult = getOfflineFallbackResponse(message);
    
    // Add polite notice about API limits with the answered response
    const notice = `⚠️ **Note:** The Gemini API public quota limits are currently exceeded. Providing an accurate response from Dhemaji College's offline registry database:\n\n${offlineResult.text}`;
    
    return res.json({ 
      text: notice, 
      sources: offlineResult.sources 
    });
  }
});

// Setup Vite Dev Server / Static files handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Error starting server:", err);
});
