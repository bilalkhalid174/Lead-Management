import { PrismaClient, Status } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  await prisma.lead.createMany({
    data: [
      {
        name: "Ali Khan",
        email: "ali.khan@example.com",
        phone: "03001234567",
        company: "TechSoft",
        status: Status.NEW,
        notes: "Interested in CRM solution",
      },
      {
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
        phone: "03111234567",
        company: "BizCorp",
        status: Status.CONTACTED,
        notes: "Follow-up scheduled",
      },
      {
        name: "Usman Tariq",
        email: "usman.tariq@example.com",
        phone: "03221234567",
        company: "DevSolutions",
        status: Status.QUALIFIED,
        notes: "Budget approved",
      },
      {
        name: "Ayesha Malik",
        email: "ayesha.malik@example.com",
        phone: "03331234567",
        company: "MarketPro",
        status: Status.LOST,
        notes: "Chose competitor",
      },
      {
        name: "Bilal Hussain",
        email: "bilal.hussain@example.com",
        phone: "03441234567",
        company: "InnovateX",
        status: Status.CONVERTED,
        notes: "Successfully onboarded",
      },

      // remaining 10 entries

      {
        name: "Hassan Raza",
        email: "hassan.raza@example.com",
        phone: "03011223344",
        company: "AlphaTech",
        status: Status.NEW,
        notes: "Requested demo",
      },
      {
        name: "Fatima Noor",
        email: "fatima.noor@example.com",
        phone: "03122334455",
        company: "Bright Solutions",
        status: Status.CONTACTED,
        notes: "Waiting response",
      },
      {
        name: "Zain Ali",
        email: "zain.ali@example.com",
        phone: "03233445566",
        company: "CodeBase",
        status: Status.QUALIFIED,
        notes: "Decision pending",
      },
      {
        name: "Maryam Iqbal",
        email: "maryam.iqbal@example.com",
        phone: "03344556677",
        company: "NextGen",
        status: Status.LOST,
        notes: "Budget issue",
      },
      {
        name: "Ahmed Raza",
        email: "ahmed.raza@example.com",
        phone: "03455667788",
        company: "FutureTech",
        status: Status.CONVERTED,
        notes: "Closed successfully",
      },
      {
        name: "Sana Khan",
        email: "sana.khan@example.com",
        phone: "03099887766",
        company: "VisionSoft",
        status: Status.NEW,
        notes: "Cold lead",
      },
      {
        name: "Imran Ali",
        email: "imran.ali@example.com",
        phone: "03188776655",
        company: "TechWorld",
        status: Status.CONTACTED,
        notes: "Needs follow-up",
      },
      {
        name: "Nida Sheikh",
        email: "nida.sheikh@example.com",
        phone: "03277665544",
        company: "SoftHub",
        status: Status.QUALIFIED,
        notes: "High potential",
      },
      {
        name: "Omer Farooq",
        email: "omer.farooq@example.com",
        phone: "03366554433",
        company: "DevCore",
        status: Status.LOST,
        notes: "No response",
      },
      {
        name: "Kiran Malik",
        email: "kiran.malik@example.com",
        phone: "03455443322",
        company: "CloudNet",
        status: Status.CONVERTED,
        notes: "Converted successfully",
      },
    ],
  });

  console.log("✅ 15 Leads Seeded Successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });