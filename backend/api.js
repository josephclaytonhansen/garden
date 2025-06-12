const express = require("express");
const { Sequelize, Model, DataTypes, Op } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
});

const router = express.Router();

class Vegetable extends Model {}
Vegetable.init(
  {
    rating: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    harvestedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "Vegetable" },
);

class Plant extends Model {}
Plant.init(
  {
    name: DataTypes.STRING,
    plantedAt: DataTypes.DATE,
    origin: DataTypes.STRING,
    icon: DataTypes.STRING,
  },
  { sequelize, modelName: "Plant" },
);

class Location extends Model {}
Location.init(
  {
    name: DataTypes.STRING,
  },
  { sequelize, modelName: "Location" },
);

class BugTreatment extends Model {}
BugTreatment.init(
  {
    type: DataTypes.STRING,
    date: DataTypes.DATE,
  },
  { sequelize, modelName: "BugTreatment" },
);

Vegetable.belongsTo(Plant, { foreignKey: "plantId" });
Plant.belongsTo(Location, { foreignKey: "locationId" });
Plant.hasMany(Vegetable, { foreignKey: "plantId" });
Location.hasMany(Plant, { foreignKey: "locationId" });
BugTreatment.belongsTo(Location, { foreignKey: "locationId" });
Location.hasMany(BugTreatment, { foreignKey: "locationId" });

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("Database synchronized successfully.");
  })
  .catch((err) => {
    console.error("Unable to create database:", err);
  });

router.get("/vegetables", async (req, res) => {
  try {
    const vegetables = await Vegetable.findAll({
      include: Plant,
    });
    res.json(vegetables);
  } catch (error) {
    console.error("Error fetching vegetables:", error);
    res.status(500).json({ error: "Failed to fetch vegetables" });
  }
});

router.post("/vegetables/new", async (req, res) => {
  try {
    const { rating, quantity, harvestedAt, plantId } = req.body;

    const newVegetable = await Vegetable.create({
      rating,
      quantity,
      harvestedAt,
      plantId,
    });
    res.status(201).json(newVegetable);
  } catch (error) {
    console.error("Error creating vegetable:", error);
    res.status(500).json({ error: "Failed to create vegetable" });
  }
});

router.post("/vegetables/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, quantity, harvestedAt, plantId } = req.body; // Removed name
    const veg = await Vegetable.findByPk(id);
    if (!veg) {
      return res.status(404).json({ error: "Vegetable not found" });
    }
    veg.rating = rating === undefined ? veg.rating : rating;
    veg.quantity = quantity === undefined ? veg.quantity : quantity;
    veg.harvestedAt = harvestedAt || veg.harvestedAt;
    veg.plantId = plantId === undefined ? veg.plantId : plantId; // Update plantId
    await veg.save();
    res.json(veg);
  } catch (error) {
    console.error("Error updating vegetable:", error);
    res.status(500).json({ error: "Failed to update vegetable" });
  }
});

router.get("/vegetables/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const veg = await Vegetable.findByPk(id, {
      include: Plant, // Include associated Plant
    });
    if (!veg) {
      return res.status(404).json({ error: "Vegetable not found" });
    }
    res.json(veg);
  } catch (error) {
    console.error("Error fetching vegetable:", error);
    res.status(500).json({ error: "Failed to fetch vegetable" });
  }
});

router.post("/vegetables/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const veg = await Vegetable.findByPk(id);
    if (!veg) {
      return res.status(404).json({ error: "Vegetable not found" });
    }
    await veg.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting vegetable:", error);
    res.status(500).json({ error: "Failed to delete vegetable" });
  }
});

router.get("/harvest/:mmyy", async (req, res) => {
  try {
    const { mmyy } = req.params;
    const [month, year] = mmyy.split("-");
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const vegetables = await Vegetable.findAll({
      where: {
        harvestedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: Plant,
      order: [["harvestedAt", "DESC"]],
    });

    res.json(vegetables);
  } catch (error) {
    console.error("Error fetching harvest data:", error);
    res.status(500).json({ error: "Failed to fetch harvest data" });
  }
});

router.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.findAll({
      include: [Location, Vegetable], // Include associated Vegetables
    });
    res.json(plants);
  } catch (error) {
    console.error("Error fetching plants:", error);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
});

router.post("/plants/new", async (req, res) => {
  try {
    const { name, plantedAt, locationId, origin, icon } = req.body; // Added icon
    if (!name)
      return res.status(400).json({ error: "Plant name is required." });
    const newPlant = await Plant.create({
      name,
      plantedAt,
      locationId,
      origin,
      icon, // Use icon
    });
    res.status(201).json(newPlant);
  } catch (error) {
    console.error("Error creating plant:", error);
    res.status(500).json({ error: "Failed to create plant" });
  }
});

router.post("/plants/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, plantedAt, locationId, origin, icon } = req.body; // Added icon
    const plantToEdit = await Plant.findByPk(id);
    if (!plantToEdit) {
      return res.status(404).json({ error: "Plant not found" });
    }
    plantToEdit.name = name || plantToEdit.name;
    plantToEdit.plantedAt = plantedAt || plantToEdit.plantedAt;
    plantToEdit.locationId =
      locationId === undefined ? plantToEdit.locationId : locationId;
    plantToEdit.origin = origin || plantToEdit.origin;
    plantToEdit.icon = icon || plantToEdit.icon; // Update icon
    await plantToEdit.save();
    res.json(plantToEdit);
  } catch (error) {
    console.error("Error updating plant:", error);
    res.status(500).json({ error: "Failed to update plant" });
  }
});

router.get("/plants/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const plantDetail = await Plant.findByPk(id, {
      include: [Location, Vegetable], // Include associated Vegetables
    });
    if (!plantDetail) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json(plantDetail);
  } catch (error) {
    console.error("Error fetching plant:", error);
    res.status(500).json({ error: "Failed to fetch plant" });
  }
});

router.post("/plants/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    const plantToDelete = await Plant.findByPk(id);
    if (!plantToDelete) {
      return res.status(404).json({ error: "Plant not found" });
    }
    await plantToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting plant:", error);
    res.status(500).json({ error: "Failed to delete plant" });
  }
});

router.post("/attachPlantToLocation", async (req, res) => {
  try {
    const { plantId, locationId } = req.body;
    if (!plantId || !locationId) {
      return res
        .status(400)
        .json({ error: "Plant ID and Location ID are required." });
    }
    const plant = await Plant.findByPk(plantId);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    plant.locationId = location.id;
    await plant.save();
    res.json(plant);
  } catch (error) {
    console.error("Error attaching plant to location:", error);
    res.status(500).json({ error: "Failed to attach plant to location" });
  }
});

router.post("/detachPlantFromLocation", async (req, res) => {
  try {
    const { plantId } = req.body;
    if (!plantId) {
      return res.status(400).json({ error: "Plant ID is required." });
    }
    const plant = await Plant.findByPk(plantId);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    plant.locationId = null;
    await plant.save();
    res.json(plant);
  } catch (error) {
    console.error("Error detaching plant from location:", error);
    res.status(500).json({ error: "Failed to detach plant from location" });
  }
});

router.get("/bug-treatments", async (req, res) => {
  try {
    const treatments = await BugTreatment.findAll({
      include: Location,
      order: [["date", "DESC"]],
    });
    res.json(treatments);
  } catch (error) {
    console.error("Error fetching bug treatments:", error);
    res.status(500).json({ error: "Failed to fetch bug treatments" });
  }
});

router.post("/bug-treatments/new", async (req, res) => {
  try {
    const { type, date, locationId } = req.body;
    if (!type || !date || locationId === undefined) {
      return res
        .status(400)
        .json({ error: "Type, date, and locationId are required." });
    }
    const newTreatment = await BugTreatment.create({ type, date, locationId });
    res.status(201).json(newTreatment);
  } catch (error) {
    console.error("Error creating bug treatment:", error);
    res.status(500).json({ error: "Failed to create bug treatment" });
  }
});

router.get("/bug-treatments/recent", async (req, res) => {
  try {
    const treatments = await sequelize.query(
      `SELECT bt.*, l.name as LocationName
         FROM BugTreatments bt
         INNER JOIN Locations l ON bt.locationId = l.id
         WHERE bt.date = (
           SELECT MAX(date)
           FROM BugTreatments
           WHERE locationId = bt.locationId
         )
         ORDER BY bt.date DESC`,
      {
        mapToModel: true,
        model: BugTreatment,
      },
    );

    const result = treatments.map((t) => {
      const treatmentJson = t.toJSON();
      if (treatmentJson.LocationName) {
        treatmentJson.Location = {
          id: t.locationId,
          name: treatmentJson.LocationName,
        };
        delete treatmentJson.LocationName;
      }
      return treatmentJson;
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching recent bug treatments:", error);
    res.status(500).json({ error: "Failed to fetch recent bug treatments" });
  }
});

router.get("/bug-treatments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const treatment = await BugTreatment.findByPk(id, {
      include: Location,
    });
    if (!treatment) {
      return res.status(404).json({ error: "Bug treatment not found" });
    }
    res.json(treatment);
  } catch (error) {
    console.error("Error fetching bug treatment:", error);
    res.status(500).json({ error: "Failed to fetch bug treatment" });
  }
});

router.post("/attachBugTreatmentToLocation", async (req, res) => {
  try {
    const { bugTreatmentId, locationId } = req.body;
    if (!bugTreatmentId || !locationId) {
      return res
        .status(400)
        .json({ error: "Bug Treatment ID and Location ID are required." });
    }
    const treatment = await BugTreatment.findByPk(bugTreatmentId);
    if (!treatment) {
      return res.status(404).json({ error: "Bug treatment not found" });
    }
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    treatment.locationId = location.id;
    await treatment.save();
    res.json(treatment);
  } catch (error) {
    console.error("Error attaching bug treatment to location:", error);
    res
      .status(500)
      .json({ error: "Failed to attach bug treatment to location" });
  }
});

router.post("/detachBugTreatmentFromLocation", async (req, res) => {
  try {
    const { bugTreatmentId } = req.body;
    if (!bugTreatmentId) {
      return res.status(400).json({ error: "Bug Treatment ID is required." });
    }
    const treatment = await BugTreatment.findByPk(bugTreatmentId);
    if (!treatment) {
      return res.status(404).json({ error: "Bug treatment not found" });
    }
    treatment.locationId = null;
    await treatment.save();
    res.json(treatment);
  } catch (error) {
    console.error("Error detaching bug treatment from location:", error);
    res
      .status(500)
      .json({ error: "Failed to detach bug treatment from location" });
  }
});

router.get("/locations", async (req, res) => {
  try {
    const locations = await Location.findAll({
      include: [
        { model: Plant, attributes: ["id", "name", "icon"], include: [Vegetable] },
        {
          model: BugTreatment,
          attributes: ["id", "type", "date"],
          limit: 1,
          order: [["date", "DESC"]],
        },
      ],
    });
    res.json(locations);
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

router.post("/locations/new", async (req, res) => {
  try {
    const { name } = req.body; // Removed description
    if (!name)
      return res.status(400).json({ error: "Location name is required." });
    const newLocation = await Location.create({ name }); // Removed description
    res.status(201).json(newLocation);
  } catch (error) {
    console.error("Error creating location:", error);
    res.status(500).json({ error: "Failed to create location" });
  }
});

router.post("/locations/:id/edit", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body; // Removed description
    const loc = await Location.findByPk(id);
    if (!loc) {
      return res.status(404).json({ error: "Location not found" });
    }
    loc.name = name || loc.name;
    await loc.save();
    res.json(loc);
  } catch (error) {
    console.error("Error updating location:", error);
    res.status(500).json({ error: "Failed to update location" });
  }
});

router.get("/locations/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const loc = await Location.findByPk(id, {
      include: [
        { model: Plant, include: [Vegetable] },
        { model: BugTreatment, order: [["date", "DESC"]] },
      ],
    });
    if (!loc) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(loc);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ error: "Failed to fetch location" });
  }
});

router.get("/locations/:id/bug-treatments", async (req, res) => {
  try {
    const { id } = req.params;
    const locationExists = await Location.findByPk(id);
    if (!locationExists) {
      return res.status(404).json({ error: "Location not found" });
    }
    const treatments = await BugTreatment.findAll({
      where: { locationId: id },
      order: [["date", "DESC"]],
    });
    res.json(treatments);
  } catch (error) {
    console.error("Error fetching bug treatments for location:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch bug treatments for this location" });
  }
});

router.post("/locations/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;

    const loc = await Location.findByPk(id, {
      include: [
        {
          model: Plant, include: [Vegetable]
        },
        { model: BugTreatment },
      ],
    });
    if (!loc) {
      return res.status(404).json({ error: "Location not found" });
    }
    const deletionPromises = [];

    if (loc.Plants) {
      for (const plant of loc.Plants) {
        if (plant.Vegetables) {
          plant.Vegetables.forEach(veg => deletionPromises.push(veg.destroy()));
        }
        deletionPromises.push(plant.destroy());
      }
    }

    if (loc.BugTreatments) {
      loc.BugTreatments.forEach((treatment) => {
        deletionPromises.push(treatment.destroy());
      });
    }

    await Promise.all(deletionPromises);

    await loc.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ error: "Failed to delete location" });
  }
});

module.exports = router;
