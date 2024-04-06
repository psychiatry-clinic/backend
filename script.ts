import { PrismaClient, PrismaPromise } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const seedData = async () => {
  // Seed Clinics

  // const clinicA = await prisma.clinic.create({
  //   data: {
  //     name: "Clinic A",
  //     location: "Location A",
  //   },
  // });

  // const clinicB = await prisma.clinic.create({
  //   data: {
  //     name: "Clinic B",
  //     location: "Location B",
  //   },
  // });

  // const clinics = [clinicA, clinicB];

  // Seed Doctors
  const doctors = [];
  for (let i = 0; i < 5; i++) {
    const doctor = await prisma.doctor.create({
      data: {
        name: `Doctor ${i + 1}`,
        phone: `+123456789${i}`,
      },
    });
    doctors.push(doctor);
  }

  // Seed Psychologists
  const psychologists = [];
  for (let i = 0; i < 5; i++) {
    const psychologist = await prisma.psychologist.create({
      data: {
        name: `Psychologist ${i + 1}`,
        phone: `+987654321${i}`,
      },
    });
    psychologists.push(psychologist);
  }

  // Seed Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const username = `user${i}_${Date.now()}`; // Appending a unique timestamp to ensure uniqueness
    const user = await prisma.user.create({
      data: {
        username,
        password: "password",
        role: "DOCTOR",
        psychologistId:
          psychologists && psychologists.length > 0 && i >= 5
            ? psychologists[i - 6].id
            : null,
        clinic: "BaghdadTeachingHospital",
      },
    });
    users.push(user);
  }

  // Seed Patients
  const patients = [];
  for (let i = 0; i < 20; i++) {
    const patient = await prisma.patient.create({
      data: {
        name: `Patient ${i + 1}`,
        dob: 1999 + i,
        gender: Math.random() < 0.5 ? "Male" : "Female",
        phone: `+11234567${i}`,
      },
    });
    patients.push(patient);
  }

  // Seed Visits
  const visits = [];
  for (let i = 0; i < 30; i++) {
    const visit = await prisma.visit.create({
      data: {
        patientId: patients[Math.floor(Math.random() * 20)].id,
        doctorId: doctors[Math.floor(Math.random() * 5)].id,
        psychologistId: psychologists[Math.floor(Math.random() * 5)].id,
        clinic: "BaghdadTeachingHospital",
        duration: Math.floor(Math.random() * 106) + 15,
        chief_complaint: `Chief complaint ${i + 1}`,
        present_illness: `Present illness ${i + 1}`,
        // Add other fields here...
      },
    });
    visits.push(visit);
  }

  // Seed Tests
  const tests = [];
  for (let i = 0; i < 30; i++) {
    const test = await prisma.test.create({
      data: {
        name: `Test ${i + 1}`,
        type: ["Blood Test", "Urine Test", "MRI", "X-Ray"][
          Math.floor(Math.random() * 4)
        ],
        range: `Range for Test ${i + 1}`,
        value: `Value for Test ${i + 1}`,
        patientId: patients[Math.floor(Math.random() * 20)].id,
      },
    });
    tests.push(test);
  }

  // Seed Prescriptions
  const prescriptions = [];
  for (let i = 0; i < 20; i++) {
    const prescription = await prisma.prescription.create({
      data: {
        patientId: patients[Math.floor(Math.random() * 20)].id,
        doctorId: doctors[Math.floor(Math.random() * 5)].id,
        dosage: `Dosage for Prescription ${i + 1}`,
        instructions: `Instructions for Prescription ${i + 1}`,
      },
    });
    prescriptions.push(prescription);
  }

  // Seed Medications
  const medications = [];
  for (let i = 0; i < 30; i++) {
    const medication = await prisma.medication.create({
      data: {
        name: `Medication ${i + 1}`,
        description: `Description for Medication ${i + 1}`,
        available: Math.random() < 0.5,
        prescriptionId: prescriptions[Math.floor(Math.random() * 20)].id,
      },
    });
    medications.push(medication);
  }

  console.log("Data seeded successfully");
};

seedData()
  .catch((error) => {
    console.error("Error seeding data:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
