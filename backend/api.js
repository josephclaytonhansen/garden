const express = require("express")
const { Sequelize, Model, DataTypes, Op } = require("sequelize")
const path = require("path")

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
})

const router = express.Router()

class Vegetable extends Model {}
Vegetable.init(
  {
    name: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    harvestedAt: DataTypes.DATE,
  },
  { sequelize, modelName: "Vegetable" },
)

class VegetableType extends Model {}
VegetableType.init(
  {
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
  },
  { sequelize, modelName: "VegetableType" },
)

class Plant extends Model {}
Plant.init(
  {
    name: DataTypes.STRING,
    plantedAt: DataTypes.DATE,
    origin: DataTypes.STRING,
  },
  { sequelize, modelName: "Plant" },
)

class Location extends Model {}
Location.init(
  {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
  },
  { sequelize, modelName: "Location" },
)

class BugTreatment extends Model {}
BugTreatment.init(
  {
    type: DataTypes.STRING,
    date: DataTypes.DATE,
  },
  { sequelize, modelName: "BugTreatment" },
)

Vegetable.belongsTo(VegetableType, { foreignKey: "VegetableTypeId" })
VegetableType.hasMany(Vegetable, { foreignKey: "VegetableTypeId" })
VegetableType.belongsTo(Plant, { foreignKey: "plantId" })
Plant.hasOne(VegetableType, { foreignKey: "plantId" })
Plant.belongsTo(Location, { foreignKey: "locationId" })
Location.hasMany(Plant, { foreignKey: "locationId" })
BugTreatment.belongsTo(Location, { foreignKey: "locationId" })
Location.hasMany(BugTreatment, { foreignKey: "locationId" })

sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized successfully.")
  })
  .catch((err) => {
    console.error("Unable to create database:", err)
  })

router.get("/VegetableTypes", async (req, res) => {
  try {
    const types = await VegetableType.findAll()
    res.json(types)
  } catch (error) {
    console.error("Error fetching vegetable types:", error)
    res.status(500).json({ error: "Failed to fetch vegetable types" })
  }
})

router.post("/VegetableTypes/new", async (req, res) => {
  try {
    const { name, icon } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ error: "Name is required for vegetable type." })
    }
    const newType = await VegetableType.create({ name, icon })
    res.status(201).json(newType)
  } catch (error) {
    console.error("Error creating vegetable type:", error)
    res.status(500).json({ error: "Failed to create vegetable type" })
  }
})

router.post("/VegetableTypes/:id/edit", async (req, res) => {
  try {
    const { id } = req.params
    const { name, icon } = req.body
    const type = await VegetableType.findByPk(id)
    if (!type) {
      return res.status(404).json({ error: "Vegetable type not found" })
    }
    type.name = name || type.name
    type.icon = icon || type.icon
    await type.save()
    res.json(type)
  } catch (error) {
    console.error("Error updating vegetable type:", error)
    res.status(500).json({ error: "Failed to update vegetable type" })
  }
})

router.post("/attachVegetableTypeToPlant", async (req, res) => {
  try {
    const { plantId, vegetableTypeId } = req.body
    if (!plantId || !vegetableTypeId) {
      return res
        .status(400)
        .json({ error: "Plant ID and Vegetable Type ID are required." })
    }
    const plant = await Plant.findByPk(plantId)
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" })
    }
    const vegetableType = await VegetableType.findByPk(vegetableTypeId)
    if (!vegetableType) {
      return res.status(404).json({ error: "Vegetable type not found" })
    }
    vegetableType.plantId = plant.id
    await vegetableType.save()
    res.json(vegetableType)
  } catch (error) {
    console.error("Error attaching vegetable type to plant:", error)
    res.status(500).json({ error: "Failed to attach vegetable type to plant" })
  }
}
)

router.post("/detachVegetableTypeFromPlant", async (req, res) => {
  try {
    const { vegetableTypeId } = req.body
    if (!vegetableTypeId) {
      return res
        .status(400)
        .json({ error: "Vegetable Type ID is required." })
    }
    const vegetableType = await VegetableType.findByPk(vegetableTypeId)
    if (!vegetableType) {
      return res.status(404).json({ error: "Vegetable type not found" })
    }
    vegetableType.plantId = null
    await vegetableType.save()
    res.json(vegetableType)
  } catch (error) {
    console.error("Error detaching vegetable type from plant:", error)
    res.status(500).json({ error: "Failed to detach vegetable type from plant" })
  }
})

router.get("/VegetableTypes/:id", async (req, res) => {
  try {
    const { id } = req.params
    const type = await VegetableType.findByPk(id, {
      include: [{ model: Vegetable }, { model: Plant }],
    })
    if (!type) {
      return res.status(404).json({ error: "Vegetable type not found" })
    }
    res.json(type)
  } catch (error) {
    console.error("Error fetching vegetable type:", error)
    res.status(500).json({ error: "Failed to fetch vegetable type" })
  }
})

router.get("/VegetableTypes/:id/Vegetables", async (req, res) => {
  try {
    const { id } = req.params
    const type = await VegetableType.findByPk(id, {
      include: Vegetable,
    })
    if (!type) {
      return res.status(404).json({ error: "Vegetable type not found" })
    }
    res.json(type.Vegetables || [])
  } catch (error) {
    console.error("Error fetching vegetables for type:", error)
    res.status(500).json({ error: "Failed to fetch vegetables for this type" })
  }
})

router.post("/VegetableTypes/:id/delete", async (req, res) => {
  try {
    const { id } = req.params
    const type = await VegetableType.findByPk(id)
    if (!type) {
      return res.status(404).json({ error: "Vegetable type not found" })
    }
    await type.destroy()
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting vegetable type:", error)
    res.status(500).json({ error: "Failed to delete vegetable type" })
  }
})

router.get("/vegetables", async (req, res) => {
  try {
    const vegetables = await Vegetable.findAll({
      include: VegetableType,
    })
    res.json(vegetables)
  } catch (error) {
    console.error("Error fetching vegetables:", error)
    res.status(500).json({ error: "Failed to fetch vegetables" })
  }
})

router.post("/vegetables/new", async (req, res) => {
  try {
    const { name, rating, quantity, harvestedAt, VegetableTypeId } = req.body
    if (!name || !VegetableTypeId) {
      return res
        .status(400)
        .json({ error: "Name and VegetableTypeId are required." })
    }
    const newVegetable = await Vegetable.create({
      name,
      rating,
      quantity,
      harvestedAt,
      VegetableTypeId,
    })
    res.status(201).json(newVegetable)
  } catch (error) {
    console.error("Error creating vegetable:", error)
    res.status(500).json({ error: "Failed to create vegetable" })
  }
})

router.post("/vegetables/:id/edit", async (req, res) => {
  try {
    const { id } = req.params
    const { name, rating, quantity, harvestedAt, VegetableTypeId } = req.body
    const veg = await Vegetable.findByPk(id)
    if (!veg) {
      return res.status(404).json({ error: "Vegetable not found" })
    }
    veg.name = name || veg.name
    veg.rating = rating === undefined ? veg.rating : rating
    veg.quantity = quantity === undefined ? veg.quantity : quantity
    veg.harvestedAt = harvestedAt || veg.harvestedAt
    veg.VegetableTypeId = VegetableTypeId || veg.VegetableTypeId
    await veg.save()
    res.json(veg)
  } catch (error) {
    console.error("Error updating vegetable:", error)
    res.status(500).json({ error: "Failed to update vegetable" })
  }
})

router.get("/vegetables/:id", async (req, res) => {
  try {
    const { id } = req.params
    const veg = await Vegetable.findByPk(id, {
      include: VegetableType,
    })
    if (!veg) {
      return res.status(404).json({ error: "Vegetable not found" })
    }
    res.json(veg)
  } catch (error) {
    console.error("Error fetching vegetable:", error)
    res.status(500).json({ error: "Failed to fetch vegetable" })
  }
})

router.post("/vegetables/:id/delete", async (req, res) => {
  try {
    const { id } = req.params
    const veg = await Vegetable.findByPk(id)
    if (!veg) {
      return res.status(404).json({ error: "Vegetable not found" })
    }
    await veg.destroy()
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting vegetable:", error)
    res.status(500).json({ error: "Failed to delete vegetable" })
  }
})

router.get("/harvest/:mmyy", async (req, res) => {
  try {
    const { mmyy } = req.params
    const [monthStr, yearStr] = mmyy.split("-")
    const month = parseInt(monthStr, 10)
    const year = parseInt(yearStr, 10)

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return res
        .status(400)
        .json({ error: "Invalid month-year format. Use MM-YYYY." })
    }

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    const vegetables = await Vegetable.findAll({
      where: {
        harvestedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      include: VegetableType,
      order: [["harvestedAt", "DESC"]],
    })
    res.json(vegetables)
  } catch (error) {
    console.error("Error fetching harvest data:", error)
    res.status(500).json({ error: "Failed to fetch harvest data" })
  }
})

router.get("/plants", async (req, res) => {
  try {
    const plants = await Plant.findAll({
      include: [Location, VegetableType],
    })
    res.json(plants)
  } catch (error) {
    console.error("Error fetching plants:", error)
    res.status(500).json({ error: "Failed to fetch plants" })
  }
})

router.post("/plants/new", async (req, res) => {
  try {
    const { name, plantedAt, locationId, origin } = req.body
    if (!name)
      return res.status(400).json({ error: "Plant name is required." })
    const newPlant = await Plant.create({
      name,
      plantedAt,
      locationId,
      origin,
    })
    res.status(201).json(newPlant)
  } catch (error) {
    console.error("Error creating plant:", error)
    res.status(500).json({ error: "Failed to create plant" })
  }
})

router.post("/plants/:id/edit", async (req, res) => {
  try {
    const { id } = req.params
    const { name, plantedAt, locationId, origin } = req.body
    const plantToEdit = await Plant.findByPk(id)
    if (!plantToEdit) {
      return res.status(404).json({ error: "Plant not found" })
    }
    plantToEdit.name = name || plantToEdit.name
    plantToEdit.plantedAt = plantedAt || plantToEdit.plantedAt
    plantToEdit.locationId =
      locationId === undefined ? plantToEdit.locationId : locationId
    plantToEdit.origin = origin || plantToEdit.origin
    await plantToEdit.save()
    res.json(plantToEdit)
  } catch (error) {
    console.error("Error updating plant:", error)
    res.status(500).json({ error: "Failed to update plant" })
  }
})

router.get("/plants/:id", async (req, res) => {
  try {
    const { id } = req.params
    const plantDetail = await Plant.findByPk(id, {
      include: [Location, VegetableType],
    })
    if (!plantDetail) {
      return res.status(404).json({ error: "Plant not found" })
    }
    res.json(plantDetail)
  } catch (error) {
    console.error("Error fetching plant:", error)
    res.status(500).json({ error: "Failed to fetch plant" })
  }
})

router.get("/plants/:id/vegetabletype", async (req, res) => {
  try {
    const { id } = req.params
    const plantDetail = await Plant.findByPk(id, {
      include: VegetableType,
    })

    if (!plantDetail) {
      return res.status(404).json({ error: "Plant not found" })
    }

    res.json(plantDetail.VegetableType || null)
  } catch (error) {
    console.error("Error fetching vegetable types for plant:", error)
    res
      .status(500)
      .json({ error: "Failed to fetch vegetable type for this plant" })
  }
})

router.post("/plants/:id/delete", async (req, res) => {
  try {
    const { id } = req.params
    const plantToDelete = await Plant.findByPk(id)
    if (!plantToDelete) {
      return res.status(404).json({ error: "Plant not found" })
    }
    await plantToDelete.destroy()
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting plant:", error)
    res.status(500).json({ error: "Failed to delete plant" })
  }
})

router.post("/attachPlantToLocation", async (req, res) => {
  try {
    const { plantId, locationId } = req.body
    if (!plantId || !locationId) {
      return res
        .status(400)
        .json({ error: "Plant ID and Location ID are required." })
    }
    const plant = await Plant.findByPk(plantId)
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" })
    }
    const location = await Location.findByPk(locationId)
    if (!location) {
      return res.status(404).json({ error: "Location not found" })
    }
    plant.locationId = location.id
    await plant.save()
    res.json(plant)
  } catch (error) {
    console.error("Error attaching plant to location:", error)
    res.status(500).json({ error: "Failed to attach plant to location" })
  }
}
)

router.post("/detachPlantFromLocation", async (req, res) => {
  try {
    const { plantId } = req.body
    if (!plantId) {
      return res.status(400).json({ error: "Plant ID is required." })
    }
    const plant = await Plant.findByPk(plantId)
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" })
    }
    plant.locationId = null
    await plant.save()
    res.json(plant)
  } catch (error) {
    console.error("Error detaching plant from location:", error)
    res.status(500).json({ error: "Failed to detach plant from location" })
  }
}
)

router.get("/bug-treatments", async (req, res) => {
  try {
    const treatments = await BugTreatment.findAll({
      include: Location,
      order: [["date", "DESC"]],
    })
    res.json(treatments)
  } catch (error) {
    console.error("Error fetching bug treatments:", error)
    res.status(500).json({ error: "Failed to fetch bug treatments" })
  }
})

router.post("/bug-treatments/new", async (req, res) => {
  try {
    const { type, date, locationId } = req.body
    if (!type || !date || locationId === undefined) {
      return res
        .status(400)
        .json({ error: "Type, date, and locationId are required." })
    }
    const newTreatment = await BugTreatment.create({ type, date, locationId })
    res.status(201).json(newTreatment)
  } catch (error) {
    console.error("Error creating bug treatment:", error)
    res.status(500).json({ error: "Failed to create bug treatment" })
  }
})

router.get("/bug-treatments/recent", async (req, res) => {
  try {
    const treatments = await sequelize.query(
      `SELECT bt.*, l.name as LocationName, l.description as LocationDescription
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
    )

    const result = treatments.map((t) => {
      const treatmentJson = t.toJSON()
      if (treatmentJson.LocationName) {
        treatmentJson.Location = {
          id: t.locationId,
          name: treatmentJson.LocationName,
          description: treatmentJson.LocationDescription,
        }
        delete treatmentJson.LocationName
        delete treatmentJson.LocationDescription
      }
      return treatmentJson
    })

    res.json(result)
  } catch (error) {
    console.error("Error fetching recent bug treatments:", error)
    res.status(500).json({ error: "Failed to fetch recent bug treatments" })
  }
})

router.get("/bug-treatments/:id", async (req, res) => {
  try {
    const { id } = req.params
    const treatment = await BugTreatment.findByPk(id, {
      include: Location,
    })
    if (!treatment) {
      return res.status(404).json({ error: "Bug treatment not found" })
    }
    res.json(treatment)
  } catch (error) {
    console.error("Error fetching bug treatment:", error)
    res.status(500).json({ error: "Failed to fetch bug treatment" })
  }
})

router.post("/attachBugTreatmentToLocation", async (req, res) => {
  try {
    const { bugTreatmentId, locationId } = req.body
    if (!bugTreatmentId || !locationId) {
      return res
        .status(400)
        .json({ error: "Bug Treatment ID and Location ID are required." })
    }
    const treatment = await BugTreatment.findByPk(bugTreatmentId)
    if (!treatment) {
      return res.status(404).json({ error: "Bug treatment not found" })
    }
    const location = await Location.findByPk(locationId)
    if (!location) {
      return res.status(404).json({ error: "Location not found" })
    }
    treatment.locationId = location.id
    await treatment.save()
    res.json(treatment)
  } catch (error) {
    console.error("Error attaching bug treatment to location:", error)
    res.status(500).json({ error: "Failed to attach bug treatment to location" })
  }
}
)

router.post("/detachBugTreatmentFromLocation", async (req, res) => {
  try {
    const { bugTreatmentId } = req.body
    if (!bugTreatmentId) {
      return res.status(400).json({ error: "Bug Treatment ID is required." })
    }
    const treatment = await BugTreatment.findByPk(bugTreatmentId)
    if (!treatment) {
      return res.status(404).json({ error: "Bug treatment not found" })
    }
    treatment.locationId = null
    await treatment.save()
    res.json(treatment)
  } catch (error) {
    console.error("Error detaching bug treatment from location:", error)
    res.status(500).json({ error: "Failed to detach bug treatment from location" })
  }
}
)

router.get("/locations", async (req, res) => {
  try {
    const locations = await Location.findAll({
      include: [
        { model: Plant, attributes: ["id", "name"] },
        {
          model: BugTreatment,
          attributes: ["id", "type", "date"],
          limit: 1,
          order: [["date", "DESC"]],
        },
      ],
    })
    res.json(locations)
  } catch (error) {
    console.error("Error fetching locations:", error)
    res.status(500).json({ error: "Failed to fetch locations" })
  }
})

router.post("/locations/new", async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name)
      return res.status(400).json({ error: "Location name is required." })
    const newLocation = await Location.create({ name, description })
    res.status(201).json(newLocation)
  } catch (error) {
    console.error("Error creating location:", error)
    res.status(500).json({ error: "Failed to create location" })
  }
})

router.post("/locations/:id/edit", async (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    const loc = await Location.findByPk(id)
    if (!loc) {
      return res.status(404).json({ error: "Location not found" })
    }
    loc.name = name || loc.name
    loc.description = description || loc.description
    await loc.save()
    res.json(loc)
  } catch (error) {
    console.error("Error updating location:", error)
    res.status(500).json({ error: "Failed to update location" })
  }
})

router.get("/locations/:id", async (req, res) => {
  try {
    const { id } = req.params
    const loc = await Location.findByPk(id, {
      include: [
        { model: Plant, include: [VegetableType] },
        { model: BugTreatment, order: [["date", "DESC"]] },
      ],
    })
    if (!loc) {
      return res.status(404).json({ error: "Location not found" })
    }
    res.json(loc)
  } catch (error) {
    console.error("Error fetching location:", error)
    res.status(500).json({ error: "Failed to fetch location" })
  }
})

router.get("/locations/:id/bug-treatments", async (req, res) => {
  try {
    const { id } = req.params
    const locationExists = await Location.findByPk(id)
    if (!locationExists) {
      return res.status(404).json({ error: "Location not found" })
    }
    const treatments = await BugTreatment.findAll({
      where: { locationId: id },
      order: [["date", "DESC"]],
    })
    res.json(treatments)
  } catch (error) {
    console.error("Error fetching bug treatments for location:", error)
    res
      .status(500)
      .json({ error: "Failed to fetch bug treatments for this location" })
  }
})

router.post("/locations/:id/delete", async (req, res) => {
  try {
    const { id } = req.params

    const loc = await Location.findByPk(id, {
      include: [
        {
          model: Plant,
          include: [VegetableType],
        },
        { model: BugTreatment },
      ],
    })
    if (!loc) {
      return res.status(404).json({ error: "Location not found" })
    }
    const deletionPromises = []

    if (loc.Plants) {
      for (const plant of loc.Plants) {
        if (plant.VegetableType) {
          deletionPromises.push(plant.VegetableType.destroy())
        }
        deletionPromises.push(plant.destroy())
      }
    }

    if (loc.BugTreatments) {
      loc.BugTreatments.forEach((treatment) => {
        deletionPromises.push(treatment.destroy())
      })
    }

    await Promise.all(deletionPromises)

    await loc.destroy()
    res.status(204).send()
  } catch (error) {
    console.error("Error deleting location:", error)
    res.status(500).json({ error: "Failed to delete location" })
  }
})

module.exports = router