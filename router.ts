require("dotenv").config();

import { PrismaClient } from "@prisma/client";

import generateJWT from "./utilities/generateJWT";
import jwtAuthMiddleware from "./utilities/jwtAuthMiddleware";

import Router from "@koa/router";
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

// router.options("*", async (ctx: any, next: any) => {
//   ctx.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   ctx.set("Access-Control-Allow-Origin", "*");
//   ctx.set(
//     "Access-Control-Allow-Headers",
//     ctx.get("Access-Control-Request-Headers")
//   );
//   ctx.status = 204;
//   await next();
// });

router.get("/", async (ctx: any) => {
  ctx.body = "Hello World";
});

router.post("/login", async (ctx: any) => {
  const { username, password } = ctx.request.body;
  console.log("www");

  let user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (user && user.password === password) {
    const token = await generateJWT(user);
    user = { ...user, password: "nice try" };

    ctx.status = 200;
    ctx.body = {
      accessToken: token,
      userData: user,
      userAbilityRules: "all",
    };
  } else {
    ctx.body = "Wrong username or password";
    ctx.status = 401;
  }
});

router.get("/patients/:user_id", jwtAuthMiddleware, async (ctx: any) => {
  try {
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

    const [patients, totalPatients] = await Promise.all([
      prisma.patient.findMany({
        where: {
          AND: [
            whereCondition, // Include the constructed where condition
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        take: itemsPerPage,
        skip: offset,
        include: {
          visits: true,
        },
      }),
      prisma.patient.count(),
    ]);

    ctx.body = {
      total: totalPatients,
      patients: patients,
    };
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
});

router.get("/search/:user_id", jwtAuthMiddleware, async (ctx: any) => {
  const { query } = ctx.params.query;
  console.log(query);
  const res = await prisma.patient.findMany({});
  console.log(res);
  ctx.body = res;
});

router.get("/patients/:user_id/:patient_id", async (ctx: any) => {
  const patient_id = +ctx.params.patient_id;
  try {
    deactivateOldVisits();
    const res = await prisma.patient.findUnique({
      where: {
        id: patient_id,
      },
      include: {
        visits: {
          include: {
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
    ctx.body = res;
  } catch (error) {
    console.log(error);
    ctx.status = 500;
  }
});

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
          patient: true,
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
    father_age,
    father_work,
    mother_dob,
    mother_age,
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
      } = ctx.request.body;
      console.log("development");
      console.log(development);
      const res = await prisma.visit.create({
        data: {
          active: true,
          clinic: "Kadhimiya",
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
    console.log("father_dob");
    console.log(father_dob);

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
      console.log(res);
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
      } = ctx.request.body;
      console.log("family_hx");
      console.log(family_hx);

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
          management,
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
    console.log("delete");

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
        console.log(res);
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

//
router.post("/upload/:user_id", jwtAuthMiddleware, async (ctx: any) => {});

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

    console.log(`${oldVisits.length} old visits deactivated.`);
  } catch (error) {
    console.error("Error deactivating old visits:", error);
  }
}
