import fs from "fs";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
interface OldUser {
  id: string;
  username: string;
  password: string;
  role: string;
}

interface OldVisit {
  id: string;
  chief_complaint: string;
  present_illness: string;
  suicide: string;
  family_hx: string;
  past_psychiatric_hx: string;
  past_medical_hx: string;
  forensic_hx: string;
  social_hx: string;
  drug_hx: string;
  substance: string;
  personal_hx: string;
  appearance: string;
  behavior: string;
  speech: string;
  mood: string;
  thought_form: string;
  thought_content: string;
  perception: string;
  cognitive_state: string;
  differential_diagnosis: string;
  management: string;
  lab_tests: string;
  notes: string;
  insight: string;
  provider_id: string;
  patient_id: string;
  createdAt: string;
  updatedAt: string;
}

interface OldPatient {
  id: string;
  Name: string;
  dob: number;
  gender: string;
  phone: string;
  marital_status: string;
  children: string;
  occupation: string;
  residence: string;
  education: string;
  creator_id: string;
  createdAt: string;
  updatedAt: string;
  visits: OldVisit[];
}

interface OldStructure {
  id: string;
  Name: string;
  dob: number;
  gender: string;
  phone: string;
  marital_status: string;
  children: string;
  occupation: string;
  residence: string;
  education: string;
  creator_id: string;
  createdAt: string;
  updatedAt: string;
  creator: OldUser;
  visits: OldVisit[];
}

interface NewUser {
  id: number;
  username: string;
  password: string;
  fullName: string;
  phone?: string;
  admin: boolean;
  avatar?: string;
  role: string;
  clinicId: number;
  createdAt: string;
  updatedAt: string;
}

interface NewVisit {
  id: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  active: boolean;
  duration?: number;
  follow_up: boolean;
  chief_complaint: {
    Complaint: string;
    Source?: string;
    Duration?: string;
    Referral?: string;
  };
  present_illness: {
    Notes: string;
  };
  examination: Record<string, any>;
  ddx: {
    DifferentialDiagnosis: string;
  };
  management: {
    managements: Array<{
      Use: string;
      Dose: string;
      Form: string;
      Name: string;
    }>;
  };
  ix: {
    investigations: Array<{
      name: string;
      result: string;
    }>;
  };
  consultations: {
    consultations: Array<{
      branch: string;
      result: string;
    }>;
  };
  prescriptionId?: number;
  therapyRequest?: boolean;
  therapyId?: number;
  notes: {
    Notes: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface NewPatient {
  id: number;
  doctorId: number;
  name: string;
  dob: string;
  gender: string;
  avatar?: string;
  phone?: string;
  father_dob?: string;
  mother_dob?: string;
  father_edu?: string;
  father_work?: string;
  mother_work?: string;
  mother_edu?: string;
  related?: boolean;
  siblings?: number;
  development?: Record<string, any>;
  order?: number;
  notes?: string;
  family_hx: {
    Other: string;
    Medical: string;
    Similar: string;
    Different: string;
  };
  past_hx: Record<string, any>;
  occupation_hx: Record<string, any>;
  forensic_hx: Record<string, any>;
  social_hx: Record<string, any>;
  personal_hx: Record<string, any>;
  visits: NewVisit[];
  prescriptions?: Array<any>;
  demographics?: Array<any>;
  tests?: Array<any>;
  createdAt: string;
  updatedAt: string;
}

const oldStructure = [
  {
    id: "664c4a7e0da82e78e102cf02",
    Name: "111",
    dob: 1983,
    gender: "female",
    phone: "",
    marital_status: "married",
    children: "11",
    occupation: "house wife",
    residence: "Baghdad",
    education: "primary school",
    creator_id: "660d4a08dfe57d8d66b8c6e9",
    createdAt: "2024-05-21T07:17:18.153Z",
    updatedAt: "2024-05-21T07:17:18.153Z",
    creator: {
      id: "660d4a08dfe57d8d66b8c6e9",
      username: "mohammed_samah",
      password: "9876",
      role: "resident",
    },
    visits: [
      {
        id: "664c4d7b0da82e78e102cf03",
        chief_complaint: "43 years old female presented with low mood ,",
        present_illness:
          "low mood,low, energy,, anhedonia, ,over thincking,, disturbed sleep,, disturbed appetite,",
        suicide: "",
        family_hx: "",
        past_psychiatric_hx: "negetive hx",
        past_medical_hx: "palpitation",
        forensic_hx: "",
        social_hx: "",
        drug_hx: "contraceptive pill take only",
        substance: "",
        personal_hx: "",
        appearance: "",
        behavior: "",
        speech: "",
        mood: "",
        thought_form: "",
        thought_content: "",
        perception: "",
        cognitive_state: "",
        differential_diagnosis: "Major Depressive Disorder",
        management: "escitalopram, 10mg , 1x1, ظهرا",
        lab_tests: "",
        notes: "",
        insight: "",
        provider_id: "660d4a08dfe57d8d66b8c6e9",
        patient_id: "664c4a7e0da82e78e102cf02",
        createdAt: "2024-05-21T07:30:03.628Z",
        updatedAt: "2024-05-21T07:30:03.628Z",
      },
      {
        id: "664ce6190da82e78e102cf04",
        chief_complaint: "",
        present_illness: "need TFT in the next visit ",
        suicide: "",
        family_hx: "",
        past_psychiatric_hx: "",
        past_medical_hx: "",
        forensic_hx: "",
        social_hx: "",
        drug_hx: "",
        substance: "",
        personal_hx: "",
        appearance: "",
        behavior: "",
        speech: "",
        mood: "",
        thought_form: "",
        thought_content: "",
        perception: "",
        cognitive_state: "",
        differential_diagnosis: "",
        management: "",
        lab_tests: "",
        notes: "",
        insight: "",
        provider_id: "660d4a08dfe57d8d66b8c6e9",
        patient_id: "664c4a7e0da82e78e102cf02",
        createdAt: "2024-05-21T18:21:13.868Z",
        updatedAt: "2024-05-21T18:21:13.868Z",
      },
    ],
  },
];

const newStructure = {
  id: 3,
  doctorId: 1,
  name: "ha",
  dob: "2000-01-01T00:00:00.000Z",
  gender: "Male",
  avatar: null,
  phone: null,
  father_dob: null,
  mother_dob: null,
  father_edu: null,
  father_work: null,
  mother_work: null,
  mother_edu: null,
  related: null,
  siblings: null,
  development: {
    selectedYear: [],
    selectedPeripartum: [],
  },
  order: null,
  notes: null,
  family_hx: {
    Other: "",
    Medical: "",
    Similar: "",
    Different: "",
  },
  past_hx: {},
  occupation_hx: {},
  forensic_hx: {},
  social_hx: {},
  personal_hx: {},
  createdAt: "2024-05-19T16:26:54.255Z",
  updatedAt: "2024-05-22T17:11:08.048Z",
  visits: [
    {
      id: 2,
      patientId: 3,
      doctorId: 1,
      clinicId: 1,
      active: false,
      duration: null,
      follow_up: false,
      chief_complaint: {
        Complaint: "hyperactivity",
      },
      present_illness: {
        Notes: "",
      },
      examination: {},
      ddx: {
        "Differential Diagnosis": "",
      },
      management: {
        managements: [
          {
            Use: "",
            Dose: "",
            Form: "",
            Name: "",
          },
        ],
      },
      ix: {
        investigations: [
          {
            name: "",
            result: "",
          },
        ],
      },
      consultations: {
        consultations: [
          {
            branch: "",
            result: "",
          },
        ],
      },
      prescriptionId: null,
      therapyRequest: null,
      therapyId: null,
      notes: {
        Notes: "",
      },
      createdAt: "2024-05-19T16:42:54.499Z",
      updatedAt: "2024-05-20T20:33:36.870Z",
    },
    {
      id: 3,
      patientId: 3,
      doctorId: 1,
      clinicId: 1,
      active: true,
      duration: null,
      follow_up: false,
      chief_complaint: {
        Source: "patient",
        Duration: "1 week",
        Referral: "w",
        Complaint: "hyperactivity",
      },
      present_illness: {
        Notes: "",
      },
      examination: {},
      ddx: {
        "Differential Diagnosis": "",
      },
      management: {
        managements: [
          {
            Use: "",
            Dose: "",
            Form: "",
            Name: "",
          },
        ],
      },
      ix: {
        investigations: [
          {
            name: "",
            result: "",
          },
        ],
      },
      consultations: {
        consultations: [
          {
            branch: "",
            result: "",
          },
        ],
      },
      prescriptionId: null,
      therapyRequest: null,
      therapyId: null,
      notes: {
        Notes: "",
      },
      createdAt: "2024-05-22T17:11:07.784Z",
      updatedAt: "2024-05-22T17:11:07.784Z",
    },
  ],
};

const mig = () => {
  oldStructure.forEach(async (element) => {
    const res = await prisma.patient.create({
      data: {
        name: element.Name,
        dob: element.dob + "-02-02T17:11:07.784Z",
        gender: element.gender === "male" ? "Male" : "Female",
        avatar: null,
        family_hx: { Other: "", Medical: "", Similar: "", Different: "" },
        past_hx: {},
        social_hx: {},
        occupation_hx: {},
        forensic_hx: {},
        personal_hx: {},
        doctor: {
          connectOrCreate: {
            where: {
              username: element.creator.username,
            },
            create: {
              fullName: element.creator.username,
              username: element.creator.username,
              password: element.creator.password,
              role: element.creator.role === "resident" ? "DOCTOR" : "DISABLED",
              admin: false,
              clinic: {
                connect: {
                  name: "Kadhimiya Center",
                },
              },
            },
          },
        },
        demographics: {
          create: {
            children: element.children,
            education: element.education,
            marital_status: element.marital_status,
            residence:
              element.residence === "baghdad" ? "بغداد" : element.residence,
            occupation: element.occupation,
          },
        },
        createdAt: element.createdAt,
        updatedAt: element.updatedAt,
        visits: {
          createMany: {
            data: element.visits.map((visit, index) => {
              return {
                active: false,
                chief_complaint: {
                  Source: "",
                  Duration: "",
                  Referral: "",
                  Complaint: visit.chief_complaint,
                },
                present_illness: { Course: visit.present_illness },
                updatedAt: visit.updatedAt,
                createdAt: visit.createdAt,
                consultations: {},
                duration: null,
                examination: {},
                ddx: {
                  "Differential Diagnosis": visit.differential_diagnosis,
                },
                follow_up: false,
                management: {
                  managements: [
                    {
                      Use: "",
                      Dose: "",
                      Form: "",
                      Name: visit.management,
                    },
                  ],
                },
                notes: { notes: visit.notes },
                clinicId: 2,
                doctorId: 9,
              };
            }),
          },
        },
      },
      include: {
        visits: true,
      },
    });
    console.log(res);
  });
};

// mig();

let responseClone: Response;
let arrayOfPatients: any[] = [];

const func = () => {
  fetch("https://psychiatry.azurewebsites.net/find/6507f518ff9709dd1c0fc42d", {
    method: "GET",
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MDdmNTE4ZmY5NzA5ZGQxYzBmYzQyZCIsInVzZXJuYW1lIjoibXVoYW1tZWQiLCJwYXNzd29yZCI6IjEyMzQiLCJyb2xlIjoicmVzaWRlbnQiLCJpYXQiOjE2OTU2MjQ5NTR9.1fov9ndm4o8xgBBQTX3gc8GMy8H8M_RJ_KHRUs3ZQak`,
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      responseClone = response.clone();
      return response.json();
    })
    .then(function (data) {
      fs.writeFile(
        "results.json",
        JSON.stringify(data, null, 2),
        (err: any) => {
          if (err) {
            console.error("Error writing to file", err);
          } else {
            console.log("Data successfully written to file");
          }
        }
      );
      arrayOfPatients = data;
    });
};

// func();

const migrateTo = () => {
  const readData = fs.readFileSync("results4.json", "utf8");
  arrayOfPatients = JSON.parse(readData);

  arrayOfPatients.forEach(async (element: any) => {
    await prisma.patient.create({
      data: {
        name: element.Name,
        dob: element.dob
          ? element.dob + "-02-02T17:11:07.784Z"
          : "1900-02-02T17:11:07.784Z",
        gender: element.gender === "male" ? "Male" : "Female",
        avatar: null,
        family_hx: { Other: "", Medical: "", Similar: "", Different: "" },
        past_hx: {},
        social_hx: {},
        occupation_hx: {},
        forensic_hx: {},
        personal_hx: {},
        doctor: {
          connect: {
            id: 1,
          },
        },
        demographics: {
          create: {
            children: element.children,
            education: element.education,
            marital_status: element.marital_status,
            residence:
              element.residence === "baghdad" ? "بغداد" : element.residence,
            occupation: element.occupation,
          },
        },
        createdAt: element.createdAt,
        updatedAt: element.updatedAt,
        visits: {
          createMany: {
            data: element.visits.map((visit: any) => {
              return {
                active: false,
                chief_complaint: {
                  Source: "",
                  Duration: "",
                  Referral: "",
                  Complaint: visit.chief_complaint,
                },
                present_illness: { Course: visit.present_illness },
                updatedAt: visit.updatedAt,
                createdAt: visit.createdAt,
                consultations: {},
                duration: null,
                examination: {},
                ddx: {
                  "Differential Diagnosis": visit.differential_diagnosis,
                },
                follow_up: false,
                management: {
                  managements: [
                    {
                      Use: "",
                      Dose: "",
                      Form: "",
                      Name: visit.management,
                    },
                  ],
                },
                notes: { notes: visit.notes },
                clinicId: 2,
                doctorId: 1,
              };
            }),
          },
        },
      },
      include: {
        visits: true,
      },
    });
  });
};

// migrateTo();
