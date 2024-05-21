require("dotenv").config();

import { PrismaClient } from "@prisma/client";

import generateJWT from "./utilities/generateJWT";
import jwtAuthMiddleware from "./utilities/jwtAuthMiddleware";

import Router from "@koa/router";
import { hashPassword, verifyPassword } from "./passwordFunctions";
const prisma = new PrismaClient();

const router = new Router();
export default router;

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

router.get("/", async (ctx: any) => {
  ctx.body = "Hello World";
});

// Register route
router.post("/register", async (ctx: any) => {
  const { username, fullName, password, clinic } = ctx.request.body;
  console.log(ctx.request.body);

  if (!username || !password || !fullName || !clinic) {
    ctx.status = 400;
    ctx.body = "Username and password are required";
    return;
  }

  const hashedPassword = await hashPassword(password);
  console.log("hashed password");
  console.log(hashedPassword);

  const userA = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!userA) {
    const userB = await prisma.user.create({
      data: {
        username: username,
        fullName: fullName,
        password: hashedPassword,
        clinic: {
          connect: {
            name: clinic,
          },
        },
      },
    });
    ctx.status = 200;
    ctx.body = "User registered successfully";
  } else {
    ctx.status = 501;
    ctx.body = "User already Exist";
  }
});

router.post("/login", async (ctx: any) => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.status = 400;
    ctx.body = "Username and password are required";
    return;
  }

  let user = await prisma.user.findUnique({
    where: {
      username: username,
    },
    include: {
      clinic: true,
    },
  });

  if (!user) {
    ctx.status = 401;
    ctx.body = "Invalid username or password";
    return;
  }

  if (user.role === "DISABLED") {
    ctx.status = 404;
    ctx.body = "Contact Dr.Mustafa Alnoori to grant you access";
    return;
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    ctx.status = 401;
    ctx.body = "Invalid username or password";
    return;
  }

  const token = await generateJWT(user);
  user = { ...user, password: "nice try" };
  ctx.status = 200;
  ctx.body = {
    accessToken: token,
    userData: user,
    userAbilityRules: "all",
  };
});

//get patients
router.get("/patients/:user_id", jwtAuthMiddleware, async (ctx: any) => {
  const user_id = +ctx.params.user_id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    const itemsPerPage = parseInt(ctx.query.itemsPerPage) || 10; // Default to 10 items per page if not provided
    const page = parseInt(ctx.query.page) || 1;
    const q = ctx.query.q;
    const offset = (page - 1) * itemsPerPage;
    let whereCondition = {};

    if (q) {
      whereCondition = {
        OR: [
          {
            name: {
              contains: q, // Search for patients whose name contains the provided query string
              // mode: "insensitive", // Case-insensitive search
            },
          },
          // Add more fields to search here if needed
        ],
      };
    }
    if (user?.role === "PSYCHOLOGIST") {
      const [patients, totalPatients] = await Promise.all([
        prisma.patient.findMany({
          where: {
            AND: [
              whereCondition,
              {
                visits: {
                  some: {
                    therapyRequest: true,
                  },
                },
              },
            ],
          },
          orderBy: {
            createdAt: "desc",
          },
          take: itemsPerPage,
          skip: offset,
          include: {
            visits: true, // Filter visits where active is true
          },
        }),
        prisma.patient.count(),
      ]);

      ctx.body = {
        total: totalPatients,
        patients: patients,
      };
    } else {
      const [patients, totalPatients] = await Promise.all([
        prisma.patient.findMany({
          where: {
            AND: [whereCondition],
          },
          orderBy: {
            createdAt: "desc",
          },
          take: itemsPerPage,
          skip: offset,
          include: {
            visits: true, // Filter visits where active is true
          },
        }),
        prisma.patient.count(),
      ]);

      ctx.body = {
        total: totalPatients,
        patients: patients,
      };
    }
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
});

router.get("/search/:user_id", jwtAuthMiddleware, async (ctx: any) => {
  const { query } = ctx.params.query;
  const res = await prisma.patient.findMany({});
  ctx.body = res;
});

// get patient data
router.get(
  "/patient/:user_id/:patient_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    const user_id = +ctx.params.user_id;
    const patient_id = +ctx.params.patient_id;
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });

      if (!user) return (ctx.status = 404);

      if (user.role === "PSYCHOLOGIST") {
        const res = await prisma.patient.findUnique({
          where: {
            id: patient_id,
          },
          include: {
            visits: {
              where: {
                active: true,
              },
              include: {
                clinic: true,
              },
            },
            demographics: true,
          },
        });
        ctx.status = 200;
        ctx.body = res;
      } else {
        deactivateOldVisits();
        const res = await prisma.patient.findUnique({
          where: {
            id: patient_id,
          },
          include: {
            visits: {
              include: {
                clinic: true,
                prescription: true,
                tests: true,
                doctor: true,
              },
            },
            demographics: true,
            prescriptions: true,
            tests: true,
          },
        });
        ctx.status = 200;
        ctx.body = res;
      }
    } catch (error) {
      console.log(error);
      ctx.status = 500;
    }
  }
);

// get patient visits
router.get(
  "/patients/visits/:user_id/:visit_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    try {
      deactivateOldVisits();
      const visit_id = +ctx.params.visit_id;
      const res = await prisma.visit.findUnique({
        where: {
          id: visit_id,
        },
        include: {
          patient: {
            include: {
              demographics: true,
            },
          },
          clinic: true,
          therapy: true,
          prescription: true,
          tests: true,
          doctor: true,
        },
      });
      if (res) {
        ctx.body = res;
        ctx.status = 200;
      } else {
        ctx.status = 404;
      }
    } catch (error) {
      ctx.status = 500;
      console.log(error);
    }
  }
);

// get suggestions
router.get("/suggestions/:user_id", jwtAuthMiddleware, async (ctx: any) => {
  try {
    const res = await prisma.suggestions.findMany();
    ctx.body = res;
    ctx.status = 200;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
});

// post suggestions
router.post(
  "/suggestions-edit/:user_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    try {
      const newSuggestion = ctx.request.body;
      // const res = await prisma.suggestions.findMany();
      const res = await prisma.suggestions.findFirst({
        where: {
          text: newSuggestion,
        },
      });
      if (!res) {
        const result = await prisma.suggestions.create({
          data: {
            text: newSuggestion,
            color: "#000",
            order: 1,
            field: {
              connect: {
                id: 1,
              },
            },
          },
        });
        ctx.body = result;
        ctx.status = 200;
      } else {
        ctx.body = "already exist";
      }
    } catch (error) {
      console.log(error);
      ctx.status = 500;
    }
  }
);

// post new patient
router.post("/patients-new/:user_id", jwtAuthMiddleware, async (ctx: any) => {
  const creator_id = +ctx.params.user_id;
  const {
    name,
    dob,
    gender,
    phone,
    avatar,
    father_dob,
    father_edu,
    father_work,
    mother_dob,
    mother_edu,
    mother_work,
    related,
    siblings,
    order,
    family_hx,
    notes,
    marital_status,
    children,
    residence,
    occupation,
    education,
  } = ctx.request.body;

  if (creator_id) {
    const user = await prisma.user.findUnique({
      where: {
        id: creator_id,
      },
    });
    if (user?.role === "DOCTOR") {
      try {
        const res = await prisma.patient.create({
          data: {
            doctor: {
              connect: {
                id: creator_id,
              },
            },
            name,
            dob,
            gender,
            phone,
            avatar,
            father_dob,
            father_edu,
            father_work,
            mother_dob,
            mother_edu,
            mother_work,
            related,
            siblings,
            order,
            family_hx,
            notes,
            demographics: {
              create: {
                marital_status,
                children,
                residence,
                occupation,
                education,
              },
            },
          },
        });
        ctx.body = res;
        ctx.status = 200;
      } catch (error) {
        console.log(error);
        ctx.status = 500;
      }
    } else {
      ctx.status = 403;
      return;
    }
  }
});

// create new visit
router.post(
  "/visits-new/:user_id/:patient_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    try {
      const creator_id = +ctx.params.user_id;
      const patient_id = +ctx.params.patient_id;
      const {
        chief_complaint,
        present_illness,
        examination,
        ddx,
        ix,
        consultations,
        management,
        notes,
        social_hx,
        family_hx,
        past_hx,
        occupation_hx,
        forensic_hx,
        personal_hx,
        development,
        follow_up,
        clinicId,
      } = ctx.request.body;

      const res = await prisma.visit.create({
        data: {
          active: true,
          patient: {
            connect: {
              id: patient_id,
            },
          },
          doctor: {
            connect: {
              id: creator_id,
            },
          },
          clinic: {
            connect: {
              id: clinicId,
            },
          },
          follow_up,
          chief_complaint,
          present_illness,
          examination,
          consultations,
          ddx,
          ix,
          management,
          notes,
        },
      });

      const res2 = await prisma.patient.update({
        where: {
          id: patient_id,
        },
        data: {
          social_hx,
          family_hx,
          past_hx,
          occupation_hx,
          forensic_hx,
          personal_hx,
          development,
        },
      });

      // ctx.body = res;
      ctx.status = 200;
    } catch (error) {
      console.log(error);
      ctx.status = 500;
    }
  }
);

// edit patient
router.post(
  "/patients-edit/:user_id/:patient_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    const {
      name,
      dob,
      gender,
      phone,
      avatar,
      father_dob,
      father_edu,
      father_work,
      mother_dob,
      mother_edu,
      mother_work,
      related,
      siblings,
      order,
      family_hx,
      notes,
      demographics_id,
      marital_status,
      children,
      residence,
      occupation,
      education,
    } = ctx.request.body;

    const patient_id = ctx.params.patient_id;

    try {
      const res = await prisma.patient.update({
        where: {
          id: +patient_id,
        },
        data: {
          name,
          dob,
          gender,
          phone,
          avatar,
          father_dob: new Date(Date.UTC(father_dob, 0, 1)),
          father_edu,
          father_work,
          mother_dob: new Date(Date.UTC(mother_dob, 0, 1)),
          mother_edu,
          mother_work,
          related,
          siblings,
          order,
          family_hx,
          notes,
          demographics: {
            update: {
              where: {
                id: demographics_id,
              },
              data: {
                marital_status,
                children,
                residence,
                occupation,
                education,
              },
            },
          },
        },
      });
      ctx.status = 200;
    } catch (error) {
      console.log(error);
      ctx.status = 500;
    }
  }
);

// edit visit
router.post(
  "/visits-edit/:user_id/:visit_id/:patient_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    try {
      const id = +ctx.params.visit_id;
      const patient_id = +ctx.params.patient_id;
      const {
        chief_complaint,
        present_illness,
        examination,
        ddx,
        notes,
        consultations,
        ix,
        management,
        social_hx,
        family_hx,
        personal_hx,
        forensic_hx,
        occupation_hx,
        past_hx,
        development,
        therapyRequest,
        follow_up,
      } = ctx.request.body;

      const res = await prisma.visit.update({
        where: {
          id: id,
        },
        data: {
          chief_complaint,
          present_illness,
          examination,
          ddx,
          consultations,
          notes,
          ix,
          therapyRequest,
          management,
          follow_up,
          patient: {
            update: {
              where: {
                id: patient_id,
              },
              data: {
                family_hx,
                forensic_hx,
                occupation_hx,
                social_hx,
                personal_hx,
                past_hx,
                development,
              },
            },
          },
        },
      });
      ctx.status = 200;
    } catch (error) {
      ctx.status = 500;
      console.log(error);
    }
  }
);

// delete patient
router.delete(
  "/patient-delete/:user_id/:patient_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    try {
      const user_id = +ctx.params.user_id;
      const patient_id = +ctx.params.patient_id;
      const user = await prisma.user.findUnique({
        where: {
          id: user_id,
        },
      });
      if (user && user.role === "ADMIN") {
        const res = await prisma.patient.delete({
          where: {
            id: patient_id,
          },
        });
        ctx.status = 201;
      } else {
        ctx.status = 404;
      }
    } catch (error) {
      console.log(error);
      ctx.status = 500;
    }
  }
);

// upload
router.post("/upload/:user_id", jwtAuthMiddleware, async (ctx: any) => {});

// therapy
router.post(
  "/therapy/:user_id/:visit_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    try {
      const user_id = +ctx.params.user_id;
      const visit_id = +ctx.params.visit_id;
      const { notes, clinicId } = ctx.request.body;
      // Check if therapy notes already exist for the visit
      let therapy = await prisma.therapy.findUnique({
        where: {
          id: visit_id,
        },
      });

      if (therapy) {
        // If therapy notes exist, update them
        therapy.notes = notes;
        await prisma.therapy.update({
          where: {
            id: therapy.id,
          },
          data: {
            notes: notes,
          },
        });
        ctx.status = 200;
      } else {
        // If therapy notes don't exist, create them
        therapy = await prisma.therapy.create({
          data: {
            Visit: {
              connect: {
                id: visit_id,
              },
            },
            psychologist: {
              connect: {
                id: user_id,
              },
            },
            notes: notes,
            clinic: {
              connect: {
                id: clinicId,
              },
            },
          },
        });
        if (therapy) {
          ctx.status = 200;
        }
      }

      ctx.status = 200;
      ctx.body = {
        success: true,
        data: therapy,
      };
    } catch (error) {
      ctx.status = 500;
      ctx.body = {
        success: false,
        error: "Internal Server Error",
      };
    }
  }
);

// deactivate visits
async function deactivateOldVisits() {
  try {
    const hours = process.env.TIME ? (+process.env.TIME as number) : 1;
    const eightHoursAgo = new Date(Date.now() - hours * 60 * 60 * 1000); // 8 hours ago
    const oldVisits = await prisma.visit.findMany({
      where: {
        createdAt: {
          lt: eightHoursAgo,
        },
        active: true,
      },
    });

    for (const visit of oldVisits) {
      await prisma.visit.update({
        where: {
          id: visit.id,
        },
        data: {
          active: false,
        },
      });
    }
  } catch (error) {
    console.error("Error deactivating old visits:", error);
  }
}
