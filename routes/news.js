const router = require("express").Router();
const User = require("../models/User");
const New = require("../models/New");

//CREATE POST
router.post("/", async (req, res) => {
  const newNew = new New(req.body);
  try {
    const savedNew = await newNew.save();
    res.status(200).json(savedNew);
  } catch (err) {
    res.status(500).json(err);
    return;
  }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const news = await New.findById(req.params.id);
    if (news.username === req.body.username) {
      try {
        const updatedNew = await New.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedNew);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can update only your mews!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const news = await New.findById(req.params.id);
    if (news.username === req.body.username) {
      try {
        await news.delete();
        res.status(200).json("New has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(401).json("You can delete only your news!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET POST
router.get("/:id", async (req, res) => {
  try {
    const news = await New.findById(req.params.id);
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL POSTS
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  try {
    let news;
    if (username) {
      news = await New.find({ username });
    } else if (catName) {
      news = await New.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      news = await New.find();
    }
    res.status(200).json(news);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
