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
  console.log(patient_id);
  try {
    const res = await prisma.patient.findUnique({
      where: {
        id: patient_id,
      },
      include: {
        visits: true,
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

router.post(
  "/new-visit/:user_id/:patient_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    const patient_id = ctx.params.patient_id;
    const provider_id = ctx.params.user_id;
    const data = ctx.request.body;

    // const res = await prisma.visit.create()
    // console.log(res);
    console.log(provider_id);
    console.log(patient_id);
    ctx.status = 200;
  }
);

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
    familyHx,
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
            father_age,
            father_work,
            mother_dob,
            mother_age,
            mother_edu,
            mother_work,
            related,
            siblings,
            order,
            familyHx,
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

router.post("/upload/:user_id", jwtAuthMiddleware, async (ctx: any) => {});

router.get(
  "/patients/visits/:user_id/:visit_id",
  jwtAuthMiddleware,
  async (ctx: any) => {
    try {
      const visit_id = +ctx.params.visit_id;
      const res = await prisma.visit.findUnique({
        where: {
          id: visit_id,
        },
        include: {
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
