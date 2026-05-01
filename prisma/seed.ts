//seed.ts

import { PrismaClient, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  // Create a seed user first
  const hashedPassword = await bcrypt.hash("jarwis174", 10);
  const user = await prisma.user.upsert({
    where: { email: "jarwis174@gmail.com" },
    update: {},
    create: {
      name: "jarwis2",
      email: "jarwis174@gmail.com",
      password: hashedPassword,
    },
  });

  await prisma.lead.createMany({
    data: [
      {
        name: "Zeeshan Haider",
        email: "zeeshan.haide@newmail.com",
        phone: "03009876543",
        company: "Nexus Systems",
        status: Status.NEW,
        notes: "Interested in cloud integration",
        userId: user.id,
      },
      {
        name: "Hiba Noor",
        email: "hiba.noo@provider.com",
        phone: "03119876543",
        company: "Stellar Apps",
        status: Status.CONTACTED,
        notes: "Initial call done",
        userId: user.id,
      },
      {
        name: "Kamran Akmal",
        email: "kamran.akml@techhub.com",
        phone: "03229876543",
        company: "DataStream",
        status: Status.QUALIFIED,
        notes: "Requirements finalized",
        userId: user.id,
      },
      {
        name: "Saba Qamar",
        email: "saba.qaar@creative.com",
        phone: "03339876543",
        company: "Design Studio",
        status: Status.LOST,
        notes: "Project delayed indefinitely",
        userId: user.id,
      },
      {
        name: "Faisal Queshi",
        email: "faisal.q@logistics.com",
        phone: "03449876543",
        company: "Swift Delivery",
        status: Status.CONVERTED,
        notes: "Annual contract signed",
        userId: user.id,
      },
      {
        name: "Amna Sheikh",
        email: "amn.s@healthplus.com",
        phone: "03017654321",
        company: "HealthPlus",
        status: Status.NEW,
        notes: "Needs medical portal",
        userId: user.id,
      },
      {
        name: "Waqas Ahmed",
        email: "waqs.ahmed@buildit.com",
        phone: "03127654321",
        company: "BuildIt Construction",
        status: Status.CONTACTED,
        notes: "Sent proposal via email",
        userId: user.id,
      },
      {
        name: "Rida Batool",
        email: "ria.b@education.com",
        phone: "03237654321",
        company: "EduTrack",
        status: Status.QUALIFIED,
        notes: "Stakeholder meeting next week",
        userId: user.id,
      },
      {
        name: "Saad Ali",
        email: "saad.ai@fintech.com",
        phone: "03347654321",
        company: "Prime Finance",
        status: Status.LOST,
        notes: "Pricing too high",
        userId: user.id,
      },
      {
        name: "Tayyaba Gul",
        email: "tayyab.g@fashion.com",
        phone: "03457654321",
        company: "Urban Wear",
        status: Status.CONVERTED,
        notes: "Payment received",
        userId: user.id,
      },
      {
        name: "Jawad Karim",
        email: "jawd.k@automotive.com",
        phone: "03091122334",
        company: "AutoDrive",
        status: Status.NEW,
        notes: "Inquiry from website",
        userId: user.id,
      },
      {
        name: "Mehwish Hayat",
        email: "mehwish.@media.com",
        phone: "03181122334",
        company: "Star Media",
        status: Status.CONTACTED,
        notes: "Left voicemail",
        userId: user.id,
      },
      {
        name: "Danish Taimoor",
        email: "danish.tq@realestate.com",
        phone: "03271122334",
        company: "Estate Masters",
        status: Status.QUALIFIED,
        notes: "Verification in progress",
        userId: user.id,
      },
      {
        name: "Mona Khan",
        email: "mona.ka@travels.com",
        phone: "03361122334",
        company: "Global Travels",
        status: Status.LOST,
        notes: "No longer interested",
        userId: user.id,
      },
      {
        name: "Salman Shahid",
        email: "salman.sf@security.com",
        phone: "03451122334",
        company: "Safe Guard",
        status: Status.CONVERTED,
        notes: "Full system deployed",
        userId: user.id,
      },
    ],
  });


}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });