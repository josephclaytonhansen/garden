# API Reference
## Location

*   **GET /locations**
    *   **Description:** Retrieves a list of all locations. Includes the count of associated plants and the latest bug treatment for each location.
    *   **Parameters:** None.
    *   **Response:** Array of Location objects.

*   **POST /locations/new**
    *   **Description:** Creates a new location.
    *   **Parameters:**
        *   **Body:**
            *   `name` (string, **required**): The name of the location.
            *   `description` (string, optional): A description of the location.
    *   **Response:** The newly created Location object.

*   **POST /locations/:id/edit**
    *   **Description:** Updates an existing location by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the location to update.
        *   **Body:**
            *   `name` (string, optional): The new name for the location.
            *   `description` (string, optional): The new description for the location.
    *   **Response:** The updated Location object.

*   **GET /locations/:id**
    *   **Description:** Retrieves details for a specific location by ID, including associated plants (with their vegetable types) and bug treatments.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the location to retrieve.
    *   **Response:** A Location object with nested Plant and BugTreatment data.

*   **GET /locations/:id/bug-treatments**
    *   **Description:** Retrieves a list of bug treatments associated with a specific location by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the location.
    *   **Response:** Array of BugTreatment objects.

*   **POST /locations/:id/delete**
    *   **Description:** Deletes a location by ID, including all associated plants (and their vegetable types) and bug treatments.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the location to delete.
    *   **Response:** Status 204 (No Content) on successful deletion.

## Plant

*   **GET /plants**
    *   **Description:** Retrieves a list of all plants, including their associated location and vegetable type.
    *   **Parameters:** None.
    *   **Response:** Array of Plant objects.

*   **POST /plants/new**
    *   **Description:** Creates a new plant.
    *   **Parameters:**
        *   **Body:**
            *   `name` (string, **required**): The name of the plant.
            *   `plantedAt` (date string, optional): The date the plant was planted.
            *   `locationId` (integer, optional): The ID of the location where the plant is located.
            *   `origin` (string, optional): The origin of the plant (e.g., seed source).
    *   **Response:** The newly created Plant object.

*   **POST /plants/:id/edit**
    *   **Description:** Updates an existing plant by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the plant to update.
        *   **Body:**
            *   `name` (string, optional): The new name for the plant.
            *   `plantedAt` (date string, optional): The new planted date.
            *   `locationId` (integer, optional): The new location ID.
            *   `origin` (string, optional): The new origin.
    *   **Response:** The updated Plant object.

*   **GET /plants/:id**
    *   **Description:** Retrieves details for a specific plant by ID, including its associated location and vegetable type.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the plant to retrieve.
    *   **Response:** A Plant object with nested Location and VegetableType data.

*   **GET /plants/:id/vegetabletype**
    *   **Description:** Retrieves the vegetable type associated with a specific plant by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the plant.
    *   **Response:** A VegetableType object or `null` if no type is associated.

*   **POST /plants/:id/delete**
    *   **Description:** Deletes a plant by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the plant to delete.
    *   **Response:** Status 204 (No Content) on successful deletion.

## VegetableType

*   **GET /VegetableTypes**
    *   **Description:** Retrieves a list of all vegetable types.
    *   **Parameters:** None.
    *   **Response:** Array of VegetableType objects.

*   **POST /VegetableTypes/new**
    *   **Description:** Creates a new vegetable type.
    *   **Parameters:**
        *   **Body:**
            *   `name` (string, **required**): The name of the vegetable type.
            *   `icon` (string, optional): An icon identifier for the type.
    *   **Response:** The newly created VegetableType object.

*   **POST /VegetableTypes/:id/edit**
    *   **Description:** Updates an existing vegetable type by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the vegetable type to update.
        *   **Body:**
            *   `name` (string, optional): The new name for the type.
            *   `icon` (string, optional): The new icon identifier.
    *   **Response:** The updated VegetableType object.

*   **GET /VegetableTypes/:id**
    *   **Description:** Retrieves details for a specific vegetable type by ID, including associated vegetables and plants.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the vegetable type to retrieve.
    *   **Response:** A VegetableType object with nested Vegetable and Plant data.

*   **GET /VegetableTypes/:id/Vegetables**
    *   **Description:** Retrieves a list of vegetables associated with a specific vegetable type by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the vegetable type.
    *   **Response:** Array of Vegetable objects.

*   **POST /VegetableTypes/:id/delete**
    *   **Description:** Deletes a vegetable type by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the vegetable type to delete.
    *   **Response:** Status 204 (No Content) on successful deletion.

*   **POST /attachVegetableTypeToPlant**
    *   **Description:** Attaches an existing vegetable type to an existing plant. This updates the `plantId` on the `VegetableType`.
    *   **Parameters:**
        *   **Body:**
            *   `plantId` (integer, **required**): The ID of the plant.
            *   `vegetableTypeId` (integer, **required**): The ID of the vegetable type to attach.
    *   **Response:** The updated VegetableType object.

*   **POST /detachVegetableTypeFromPlant**
    *   **Description:** Detaches a vegetable type from its currently associated plant. This sets the `plantId` on the `VegetableType` to `null`.
    *   **Parameters:**
        *   **Body:**
            *   `vegetableTypeId` (integer, **required**): The ID of the vegetable type to detach.
    *   **Response:** The updated VegetableType object.

*   **POST /attachPlantToLocation**
    *   **Description:** Attaches an existing plant to an existing location. This updates the `locationId` on the `Plant`.
    *   **Parameters:**
        *   **Body:**
            *   `plantId` (integer, **required**): The ID of the plant to attach.
            *   `locationId` (integer, **required**): The ID of the location.
    *   **Response:** The updated Plant object.

## Vegetable

*   **GET /vegetables**
    *   **Description:** Retrieves a list of all vegetables, including their associated vegetable type.
    *   **Parameters:** None.
    *   **Response:** Array of Vegetable objects.

*   **POST /vegetables/new**
    *   **Description:** Creates a new vegetable entry.
    *   **Parameters:**
        *   **Body:**
            *   `name` (string, **required**): The name of the vegetable.
            *   `rating` (integer, optional): A rating for the harvest.
            *   `quantity` (integer, optional): The quantity harvested.
            *   `harvestedAt` (date string, optional): The date of harvest.
            *   `VegetableTypeId` (integer, **required**): The ID of the associated vegetable type.
    *   **Response:** The newly created Vegetable object.

*   **POST /vegetables/:id/edit**
    *   **Description:** Updates an existing vegetable entry by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the vegetable entry to update.
        *   **Body:**
            *   `name` (string, optional): The new name.
            *   `rating` (integer, optional): The new rating.
            *   `quantity` (integer, optional): The new quantity.
            *   `harvestedAt` (date string, optional): The new harvest date.
            *   `VegetableTypeId` (integer, optional): The new vegetable type ID.
    *   **Response:** The updated Vegetable object.

*   **GET /vegetables/:id**
    *   **Description:** Retrieves details for a specific vegetable entry by ID, including its associated vegetable type.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the vegetable entry to retrieve.
    *   **Response:** A Vegetable object with nested VegetableType data.

*   **POST /vegetables/:id/delete**
    *   **Description:** Deletes a vegetable entry by ID.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the vegetable entry to delete.
    *   **Response:** Status 204 (No Content) on successful deletion.

## Harvest

*   **GET /harvest/:mmyy**
    *   **Description:** Retrieves all vegetables harvested within a specific month and year.
    *   **Parameters:**
        *   **URL:**
            *   `mmyy` (string, **required**): The month and year in `MM-YYYY` format (e.g., `07-2024`).
    *   **Response:** Array of Vegetable objects harvested in the specified month.

## BugTreatment

*   **GET /bug-treatments**
    *   **Description:** Retrieves a list of all bug treatments, including their associated location.
    *   **Parameters:** None.
    *   **Response:** Array of BugTreatment objects.

*   **POST /bug-treatments/new**
    *   **Description:** Creates a new bug treatment entry.
    *   **Parameters:**
        *   **Body:**
            *   `type` (string, **required**): The type of bug treatment.
            *   `date` (date string, **required**): The date of the treatment.
            *   `locationId` (integer, **required**): The ID of the location where the treatment was applied.
    *   **Response:** The newly created BugTreatment object.

*   **GET /bug-treatments/recent**
    *   **Description:** Retrieves the most recent bug treatment for each location.
    *   **Parameters:** None.
    *   **Response:** Array of BugTreatment objects (one per location, representing the latest treatment).

*   **GET /bug-treatments/:id**
    *   **Description:** Retrieves details for a specific bug treatment entry by ID, including its associated location.
    *   **Parameters:**
        *   **URL:**
            *   `id` (integer, **required**): The ID of the bug treatment entry to retrieve.
    *   **Response:** A BugTreatment object with nested Location data.

*   **POST /detachPlantFromLocation**
    *   **Description:** Detaches a plant from its currently associated location. This sets the `locationId` on the `Plant` to `null`.
    *   **Parameters:**
        *   **Body:**
            *   `plantId` (integer, **required**): The ID of the plant to detach.
    *   **Response:** The updated Plant object.

*   **POST /attachBugTreatmentToLocation**
    *   **Description:** Attaches an existing bug treatment to an existing location. This updates the `locationId` on the `BugTreatment`.
    *   **Parameters:**
        *   **Body:**
            *   `bugTreatmentId` (integer, **required**): The ID of the bug treatment to attach.
            *   `locationId` (integer, **required**): The ID of the location.
    *   **Response:** The updated BugTreatment object.

*   **POST /detachBugTreatmentFromLocation**
    *   **Description:** Detaches a bug treatment from its currently associated location. This sets the `locationId` on the `BugTreatment` to `null`.
    *   **Parameters:**
        *   **Body:**
            *   `bugTreatmentId` (integer, **required**): The ID of the bug treatment to detach.
    *   **Response:** The updated BugTreatment object.
