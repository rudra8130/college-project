const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const colleges = [
  { name: "IIT Bombay", wikiTitle: "Indian_Institute_of_Technology_Bombay", location: "Mumbai, Maharashtra", fees: 250000, rating: 4.8, established: 1958, type: "Government" },
  { name: "IIT Delhi", wikiTitle: "Indian_Institute_of_Technology_Delhi", location: "New Delhi", fees: 245000, rating: 4.8, established: 1961, type: "Government" },
  { name: "BITS Pilani", wikiTitle: "Birla_Institute_of_Technology_and_Science,_Pilani", location: "Pilani, Rajasthan", fees: 450000, rating: 4.5, established: 1964, type: "Private" },
  { name: "NIT Trichy", wikiTitle: "National_Institute_of_Technology,_Tiruchirappalli", location: "Tiruchirappalli, Tamil Nadu", fees: 150000, rating: 4.4, established: 1964, type: "Government" },
  { name: "VIT Vellore", wikiTitle: "Vellore_Institute_of_Technology", location: "Vellore, Tamil Nadu", fees: 220000, rating: 4.1, established: 1984, type: "Private" },
  { name: "Delhi Technological University", wikiTitle: "Delhi_Technological_University", location: "New Delhi", fees: 180000, rating: 4.3, established: 1941, type: "Government" },
  { name: "Manipal Institute of Technology", wikiTitle: "Manipal_Institute_of_Technology", location: "Manipal, Karnataka", fees: 400000, rating: 4.0, established: 1957, type: "Private" },
  { name: "SRM Institute of Science and Technology", wikiTitle: "SRM_Institute_of_Science_and_Technology", location: "Chennai, Tamil Nadu", fees: 300000, rating: 3.8, established: 1985, type: "Private" },
  { name: "Jadavpur University", wikiTitle: "Jadavpur_University", location: "Kolkata, West Bengal", fees: 20000, rating: 4.5, established: 1955, type: "Government" },
  { name: "Anna University", wikiTitle: "Anna_University", location: "Chennai, Tamil Nadu", fees: 60000, rating: 4.0, established: 1978, type: "Government" },
  { name: "Amity University", wikiTitle: "Amity_University", location: "Noida, Uttar Pradesh", fees: 280000, rating: 3.6, established: 2005, type: "Private" },
  { name: "Thapar Institute", wikiTitle: "Thapar_Institute_of_Engineering_and_Technology", location: "Patiala, Punjab", fees: 380000, rating: 4.2, established: 1956, type: "Private" },
  { name: "NIT Warangal", wikiTitle: "National_Institute_of_Technology,_Warangal", location: "Warangal, Telangana", fees: 155000, rating: 4.4, established: 1959, type: "Government" },
  { name: "IIIT Hyderabad", wikiTitle: "International_Institute_of_Information_Technology,_Hyderabad", location: "Hyderabad, Telangana", fees: 350000, rating: 4.6, established: 1998, type: "Deemed" },
  { name: "Lovely Professional University", wikiTitle: "Lovely_Professional_University", location: "Phagwara, Punjab", fees: 190000, rating: 3.5, established: 2005, type: "Private" },
  { name: "PES University", wikiTitle: "PES_University", location: "Bangalore, Karnataka", fees: 320000, rating: 4.0, established: 1972, type: "Private" },
  { name: "COEP Technological University", wikiTitle: "College_of_Engineering,_Pune", location: "Pune, Maharashtra", fees: 90000, rating: 4.3, established: 1854, type: "Government" },
  { name: "IIT Kanpur", wikiTitle: "Indian_Institute_of_Technology_Kanpur", location: "Kanpur, Uttar Pradesh", fees: 248000, rating: 4.8, established: 1959, type: "Government" },
  { name: "IIT Kharagpur", wikiTitle: "Indian_Institute_of_Technology_Kharagpur", location: "Kharagpur, West Bengal", fees: 245000, rating: 4.7, established: 1951, type: "Government" },
  { name: "IIT Madras", wikiTitle: "Indian_Institute_of_Technology_Madras", location: "Chennai, Tamil Nadu", fees: 250000, rating: 4.9, established: 1959, type: "Government" },
];

const companies = ["TCS", "Infosys", "Wipro", "Google", "Microsoft", "Amazon", "Goldman Sachs", "Deloitte", "Accenture", "JP Morgan"];
const courseTemplates = [
  { name: "B.Tech Computer Science", duration: "4 years" },
  { name: "B.Tech Electronics", duration: "4 years" },
  { name: "B.Tech Mechanical", duration: "4 years" },
  { name: "MBA", duration: "2 years" },
];
const reviewTexts = [
  "Great faculty and infrastructure, placement support is solid.",
  "Campus life is good but fees are on the higher side.",
  "Strong alumni network, helped me get my first job.",
  "Labs could be better equipped, but overall decent experience.",
  "Excellent placements this year, avg package went up significantly.",
];

function rand(arr, n) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchWikiImage(title) {
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.thumbnail?.source || null;
  } catch {
    return null;
  }
}

async function main() {
  console.log("Seeding started...");
  for (const c of colleges) {
    const college = await prisma.college.create({ data: c });

    const numCourses = randInt(2, 3);
    for (const course of rand(courseTemplates, numCourses)) {
      await prisma.course.create({
        data: {
          name: course.name,
          duration: course.duration,
          fees: c.fees,
          collegeId: college.id,
        },
      });
    }

    for (const year of [2023, 2024]) {
      await prisma.placement.create({
        data: {
          year,
          avgPackage: randInt(400000, 1800000),
          highestPackage: randInt(2000000, 6000000),
          companies: rand(companies, randInt(3, 6)),
          collegeId: college.id,
        },
      });
    }

    const numReviews = randInt(3, 5);
    for (let i = 0; i < numReviews; i++) {
      await prisma.review.create({
        data: {
          rating: randInt(3, 5),
          text: reviewTexts[randInt(0, reviewTexts.length - 1)],
          author: `Student${randInt(100, 999)}`,
          collegeId: college.id,
        },
      });
    }
  }
  console.log("Seeding done! 20 colleges added with courses, placements, reviews.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });