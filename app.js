import express from "express";
import prisma from "./db.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", async (req, res, next) => {
  const { search, sort = "newest", page = 1 } = req.query;

  const where = {};

  if (search) {
    where.title = {
      contains: search,
    };
  }

  let orderBy = { createdAt: "desc" };
  if (sort === "oldest") {
    orderBy = { createdAt: "asc" };
  }

  const perPage = 10;
  const pageNum = Number(page);
  const skip = (pageNum - 1) * perPage;

  const [announcements, total] = await Promise.all([
    prisma.announcement.findMany({
      where,
      orderBy,
      skip,
      take: perPage,
    }),
    prisma.announcement.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  res.status(200).render("index", {
    queryData: {
      search,
      sort,
    },
    announcements,
    pagination: {
      currentPage: pageNum,
      limit: perPage,
      total,
      totalPages,
    },
  });
});

app.get("/announcements", (req, res, next) => {
  res.status(200).render("new", { data: {}, errors: {} });
});

app.post("/announcements", async (req, res, next) => {
  const { title, description, price, category, contactInfo } = req.body;
  const errors = {};

  if (!title || title.trim().length < 5) {
    errors.title = "Назва має бути не менше 5 символів";
  }

  if (!description || description.trim().length < 10) {
    errors.description = "Опис має бути не менше 10 символів";
  }

  if (!price || isNaN(price) || Number(price) <= 0) {
    errors.price = "Ціна має бути додатним числом";
  }

  const validCategories = ["sale", "service", "job", "other"];
  if (!validCategories.includes(category)) {
    errors.category = "Оберіть категорію";
  }

  if (!contactInfo || contactInfo.trim().length < 5) {
    errors.contactInfo = "Контактна інформація має бути не менше 5 символів";
  }

  if (Object.keys(errors).length > 0) {
    return res.render("new", {
      errors,
      data: req.body,
    });
  }

  const announcement = await prisma.announcement.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      category,
      contactInfo,
    },
  });

  res.status(303).redirect("/");
});

app.get("/announcements/:id", async (req, res, next) => {
  if (!req.params.id || isNaN(req.params.id || Number(req.params.id) < 0)) {
    res.status(404).render("404");
  }

  const announcement = await prisma.announcement.findUnique({
    where: {
      id: Number(req.params.id),
    },
  });

  if (!announcement) {
    res.status(404).render("404");
  }

  res.status(200).render("announcement", { ann: announcement });
});

app.delete("/announcements/:id", async (req, res, next) => {
  await prisma.announcement.delete({
    where: { id: Number(req.params.id) },
  });

  res.status(204).end();
});

app.use((req, res) => {
  res.status(404).render("404");
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running: <http://localhost>:${PORT}`);
});
