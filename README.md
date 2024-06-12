# Bakery Inventory Manager

> _Maeve's Fine Baked Goods_ is having trouble keeping track of their raw materials and finished baked goods. You will be building an application for them that will allow them to track inventory of raw materials and manage their recipes that allow turning those raw materials into baked goods.

There are no user stories for deployment: it is expected that you will deploy the application to production after you finish a user story.

There are no user stories for logging: it is expected that you will add logging to the application with enough detail to help you diagnose issues in production.

<!-- TOC depthfrom:2 depthto:3 -->

- [Getting started](#getting-started)
  - [Running your application](#running-your-application)
  - [Running the tests](#running-the-tests)
- [Existing files](#existing-files)
  - [The root directory](#the-root-directory)
  - [Backend directory](#backend-directory)
  - [Frontend directory](#frontend-directory)
- [Project requirements](#project-requirements)
  - [Database schema](#database-schema)
  - [API routes](#api-routes)
  - [Frontend views](#frontend-views)
- [User stories](#user-stories)
  - [US-01 - Landing page](#us-01---landing-page)
  - [US-02 - List recipes](#us-02---list-recipes)
  - [US-03 - View recipe](#us-03---view-recipe)
  - [US-04 - Add ingredients to recipe](#us-04---add-ingredients-to-recipe)
  - [US-05 - Remove ingredients from recipe](#us-05---remove-ingredients-from-recipe)
  - [US-06 - Delete a recipe](#us-06---delete-a-recipe)
  - [US-07 - Bake recipe](#us-07---bake-recipe)
  - [US-08 - Create recipe](#us-08---create-recipe)
  - [US-09 - List ingredients](#us-09---list-ingredients)
  - [US-10 - View ingredient](#us-10---view-ingredient)
  - [US-11 - Create ingredient](#us-11---create-ingredient)
  - [US-12 - Edit ingredient](#us-12---edit-ingredient)
  - [US-13 - Delete an ingredient](#us-13---delete-an-ingredient)
- [Recommended Schedule](#recommended-schedule)
- [Rubric](#rubric)

<!-- /TOC -->

## Getting started

To get started on this project, fork and clone this repository. Keep in mind that you _will not be making a pull request to this repository._

### Installing and running your application

To install, run the following commands from your command line. Make sure you are in the root directory before running the commands.

```
npm run backend-install
npm run frontend-install
```

To start the project, you have a few different options. View the `package.json` in the root directory to see the scripts available to you.

For development purposes, you will likely want to open up a terminal tab, navigate to the `backend/` directory, and run `npm run dev`. In a different terminal tab you will want to navigate to the `frontend/` directory and run `npm start`.

### Database setup

Set up a new PostgreSQL database instance by following the instructions in the "PostgreSQL: Creating & Installing Databases" lesson.

Run `cp ./back-end/.env.sample ./back-end/.env` and update the `./back-end/.env` file with the connection URLs to your PostgreSQL database instance.

Navigate to the `backend` folder, where the `knexfile.js` file is located, and run the `npx knex` commands from there.

### Running the tests

To run the tests for the backend, you can use the `npm test` command from the root directory of this project.

## Existing files

As you work through the user stories listed later in this document, you will be writing code that allows your frontend and backend applications to talk to each other. You will also write code to allow your controllers and services to connect to, and query, your PostgreSQL database via [Knex](http://knexjs.org/).

The table below describes the folders in this starter repository:

| Folder/file path | Description                                                      |
| ---------------- | ---------------------------------------------------------------- |
| `./backend`      | The backend project, which runs on `localhost:5001` by default.  |
| `./frontend`     | The frontend project, which runs on `localhost:3000` by default. |

This starter code closely follows the best practices and patterns established in the Robust Server Structure module.

**Note**: Please do not submit a pull request to this repository with your solution.

### The root directory

The root directory (where this file is located) contains the instructions for your project, a `.gitignore` file, and a `package.json` file.

The `package.json` file includes a number of scripts which may be useful for building your project. Before beginning your project, make sure to look through the file.

### Backend directory

The backend directory contains a working server although there are no pre-written routes. The following files and folders are present within it:

#### Configuration files

The following files will aid in configuring your backend project:

- The `package.json` file includes a number of scripts which may be useful for building your project.

- The `.env.sample` file includes the environment variables you will need to complete your project. This file should be copied to a `.env` file and then the values should be replaced.

- The `knexfile.js` file includes configuration details for your [Knex](http://knexjs.org/) installation. Keep in mind that your connection will only work if you define a `DATABASE_URL` within your `.env` file.

#### `src/` directory

The `src/` directory includes two files and two directories.

The `app.js` and `server.js` file will aid in running your application. You will likely not need to make any edits to the `server.js` file, but you will need to make edits to the `app.js` file to add your routes and potentially other middleware.

##### `db/` directory

The `db/` directory contains a `connection.js` file. When you create migrations and seeds, they should appear within this directory under new directories with the same name.

##### `errors/` directory

The two files within this directory will handle errors for your server. They are both used within the `app.js` file.

In order to trigger the function within the `errorHandler` file, you will need to call the `next()` function within a route. An object should be passed into your `next()` function and should have the following shape, although the values should be replaced with appropriate error messages.

```javascript
next({ status: 500, message: "Your error message" });
```

#### `test/` directory

The only automated tests for this project are within this directory. Keep in mind that to run your tests, you must create a test database and provide its URL within your `.env` file.

### Frontend directory

The `frontend/` directory contains a standard React application. Keep in mind that [React Router](https://reactrouter.com/en/6.23.1) is already installed and that the `public/index.html` file includes [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/) and [Bootstrap Icons](https://icons.getbootstrap.com/).

## Project requirements

The following requirements are _not optional_ for this project. Some tests depend on these structures being in place.

### Database schema

The following two tables are required. You will also need to figure out some way to keep track of the ingredient quantity overall as well as each recipe's ingredients, which may require one or more additional tables.

#### `recipes` table

While you made include additional fields to this table, you must have the following fields.

| column name   | data type | description                                     |
| ------------- | --------- | ----------------------------------------------- |
| `id`          | `integer` | A unique ID for each recipe.                    |
| `title`       | `text`    | A title for the recipe.                         |
| `image_url`   | `text`    | A URL path to an image representing the recipe. |
| `description` | `text`    | A description of the recipe.                    |

#### `ingredients` table

While you made include additional fields to this table, you must have the following fields.

| column name | data type | description                      |
| ----------- | --------- | -------------------------------- |
| `id`        | `integer` | A unique ID for each ingredient. |
| `name`      | `text`    | The name of the ingredient.      |

#### Additional tables and fields

Keep in mind that, for recipes, you will need to keep track of the units for each recipe (e.g., "1 teaspoon of salt"). You will also need a way to keep track of the overall inventory of all ingredients on hand. Think through your overall database structure before you begin building.

#### Seed data

Your seed data should meet the following requirements:

1. Recipes: Include at least 2 recipes.

2. Ingredients: Each recipe should have at least 3 ingredients.

##### Compatibility Note

The tests utilize an in-memory SQLite database, while the development environment uses a PostgreSQL database. Ensure your seed file can handle both PostgreSQL (development) and SQLite (test) databases. The code should detect the database type and apply the appropriate commands for truncating tables and resetting primary keys.

##### Example Seed File

Below is an example seed file that meets the above requirements and handles both PostgreSQL and SQLite databases:

```js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const isPostgres = knex.client.config.client === 'pg';

  if (isPostgres) {
    // PostgreSQL specific: TRUNCATE TABLE with RESTART IDENTITY
    await knex.raw("TRUNCATE TABLE ingredients RESTART IDENTITY CASCADE");
  } else {
    // SQLite specific: DELETE all rows and reset the primary key sequence
    await knex('ingredients').del();
    await knex.raw('DELETE FROM sqlite_sequence WHERE name = ?', ['ingredients']);
  }

  // Inserts seed entries
  await knex('ingredients').insert([
    { name: "butter", unit: "cup", reserve_amount: 0 },
  ]);
};
```

### API routes

Your API layer should be written in Express and connect to your SQL database using Knex. It should include these routes.

| HTTP method | path                         | description                                                               |
| ----------- | ---------------------------- | ------------------------------------------------------------------------- |
| `GET`       | `/recipes`                   | Returns all recipes within the database.                                  |
| `POST`      | `/recipes`                   | Should create a new recipe and return that recipe with its ID.            |
| `GET`       | `/recipes/:recipeId`         | Returns a single recipe with the matching ID.                             |
| `DELETE`    | `/recipes/:recipeId`         | Should delete the specified recipe.                                       |
| `PUT`       | `/recipes/:recipeId/bake`    | "Bakes" the recipe with existing ingredients. See below for more details. |
| `GET`       | `/ingredients`               | Returns all ingredients within the database.                              |
| `POST`      | `/ingredients`               | Should create a new ingredient and return that ingredient with its ID.    |
| `GET`       | `/ingredients/:ingredientId` | Returns a single ingredient with the matching ID.                         |
| `PUT`       | `/ingredients/:ingredientId` | Updates the specified ingredient.                                         |
| `DELETE`    | `/ingredients/:ingredientId` | Should delete the specified ingredient.                                   |

#### Request and response payloads

Your requests and responses should include a `data` key before any data is sent to or from the server. For example, a response from the server to the `GET /recipes` route could look like the following:

```js
{
  data: [
    {
      id: 1,
      title: "Chocolate Chip Cookies",
      image_url: "...",
      description: "The best chocolate chip cookies you've ever had.",
    },
    // ...
  ];
}
```

If an error occurs, the `data` key _should not_ be present. See the `backend/src/errors/errorHandler.js` to see how errors should be returned.

### Frontend views

Your application should be written in React and should make requests to your API. It should have these screens.

| path                              | screen name       | description                                                                                                                                                                                              |
| --------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                               | Home              | You may design this page as you like. It should include links to other pages.                                                                                                                            |
| `/recipes`                        | Recipes           | Shows all recipes within the database.                                                                                                                                                                   |
| `/recipes/:recipeId`              | Recipe            | Shows a single recipe. This page should include a full list of ingredients, the ability to add ingredients, and a "Bake" button. See the user story below for more details on this page's functionality. |
| `/recipes/new`                    | Create Recipe     | Creates a new recipe.                                                                                                                                                                                    |
| `/ingredients`                    | Ingredients       | Lists all ingredients as well as their quantities.                                                                                                                                                       |
| `/ingredients/:ingredientId`      | Ingredient        | Shows an ingredient along with its quantity.                                                                                                                                                             |
| `/ingredients/:ingredientId/edit` | Edit Ingredient   | Allows for an ingredient to be edited.                                                                                                                                                                   |
| `/ingredients/new`                | Create Ingredient | Allows for the creation of a new ingredient.                                                                                                                                                             |

## User stories

### US-01 - Landing page

As an employee <br/>
I want to be able to easily navigate from the homepage<br/>
to perform the action I need to take in the moment.

#### Acceptance criteria

- The homepage (i.e., `/`) contains clear links for the following actions:
  - Viewing all recipes.
  - Viewing all ingredients.
  - Creating a new recipe.
  - Creating a new ingredient.

### US-02 - List recipes

As an employee<br/>
I want to be able to view a list of recipes<br/>
so that I can view a specific recipe.

#### Acceptance criteria

- The `/recipes` page should list all recipes. Recipes only need to include their `title` and `image_url`.
- The page should include the ability to click on a recipe to go to it's individual page.

### US-03 - View recipe

As an employee<br/>
I want to view a recipe's page<br/>
so that I can see detailed information about that recipe.

#### Acceptance criteria

- The `/recipes/:recipeId` page should show the recipe with all of its information, including all of its ingredients and amounts.
- A "Bake" button should appear on the page. If there are not enough ingredients in reserve to bake this recipe, it should be disabled.
  - If the "Bake" button is disabled, a list of missing ingredients should be included on the page.

### US-04 - Add ingredients to recipe

As an employee<br/>
I want to be able to add an ingredient to a recipe<br/>
so that I will be able to use the "Bake" button in the future.

#### Acceptance criteria

- On the `/recipes/:recipeId` page, there should be some kind of form where an individual can add an ingredient to the displayed recipe.
  - This should include a drop down list from all ingredients within the database.
  - When an ingredient is selected, an input field should appear that allows the user to enter in an amount for the recipe, somehow including the units as well.
- When the form is submitted, that ingredient should be added to the recipe. The page should update to display the new recipe and should clear the form.

### US-05 - Remove ingredients from recipe

As an employee<br/>
I want to be able to remove an ingredient from a recipe<br/>
so that I can keep my recipe updated with any changes.

#### Acceptance criteria

- On the `/recipes/:recipeId` page, there should be a button or link that allows for an ingredient to be removed. When that button is clicked, the relationship between the ingredient and the recipe is removed from the database.
- The page should visually update to show that the ingredient has been removed.

### US-06 - Delete a recipe

As an employee<br/>
I want to be able to remove a recipe from the database<br/>
so that I can keep the store's offerings current.

#### Acceptance criteria

- On the `/recipes/:recipeId` page, there should be a button that allows for the recipe to be deleted.
  - Before the recipe is deleted, a message should appear that asks the user to confirm that they wish to delete the recipe.
- When the recipe is deleted, that record should be deleted from the database. If other records depend on the recipe (e.g., a row within a join table), those records should be deleted as well.
- When the recipe is deleted, the user should be brought to the `/recipes` page.

### US-07 - Bake recipe

As an employee<br/>
I want to be able to record when a recipe is baked<br/>
so that I have an accurate representation of remaining ingredients.

#### Acceptance criteria

- When the "Bake" button is clicked on the `/recipes/:recipeId` page, each ingredient's quantity should be reduced by the recipe's specified amount.
- Upon successful completion, a message should appear confirming that the item was baked.
- If the item can be baked again, the "Bake" button is still enabled. Otherwise, it is disabled.

### US-08 - Create recipe

As an employee<br/>
I want to be able to create a new recipe<br/>
so that I can keep track of what the store bakes.

#### Acceptance criteria

- The `/recipes/new` page should include a form that allows for the creation of new recipes.
  - These recipes _do not_ need to include ingredients. Those can be added from the recipe's page.
- If the data entered within the form is invalid, an error message should be shown.
- When a recipe is successfully created, the user should be taken to that recipe's individual page.

### US-09 - List ingredients

As an employee<br/>
I want to be able to view a list of ingredients<br/>
so that I can view a specific ingredient.

#### Acceptance criteria

- The `/ingredients` page should list all ingredients. Ingredients on this page only need to display their `name`.
- The page should include the ability to click on a ingredient to go to it's individual page.

### US-10 - View ingredient

As an employee<br/>
I want to view a ingredient's page<br/>
so that I can see detailed information about that ingredient.

#### Acceptance criteria

- The `/ingredients/:ingredientId` page should show the ingredient with all of its information, including its units and the amount that is available in reserve.
- A list of recipes this ingredient appears within should appear on the page. Users should be able to click on a recipe to go to that recipe's individual page.

### US-11 - Create ingredient

As an employee<br/>
I want to be able to create a new ingredient<br/>
so that I can keep track of what the store has in stock.

#### Acceptance criteria

- The `/ingredients/new` page should include a form that allows for the creation of new ingredients. The amount currently on hand should also be recorded.
- If the data entered within the form is invalid, an error message should be shown.
- When a ingredient is successfully created, the user should be taken to that ingredient's individual page.

### US-12 - Edit ingredient

As an employee<br/>
I want to be able to edit an ingredient<br/>
so that I can keep each ingredient updated.

#### Acceptance criteria

- The `/ingredients/:ingredientId/edit` page should include a form that allows for ingredients to be updated. The total amount currently on hand should also be able to be updated.
- If the data entered within the form is invalid, an error message should be shown.
- When a ingredient is successfully updated, the user should be taken to that ingredient's individual page.

### US-13 - Delete an ingredient

As an employee<br/>
I want to be able to remove a ingredient from the database<br/>
so that I can keep the store's offerings current.

#### Acceptance criteria

- On the `/ingredients/:ingredientId` page, there should be a button that allows for the ingredient to be deleted.
  - If the ingredient is associated with any recipes, the button should not delete the ingredient but instead show an alert to the user. This alert should state that the user must delete the ingredient from recipes before deleting the ingredient.
- When the ingredient is deleted, that record should be deleted from the database. If other records depend on the ingredient (e.g., a row within a join table), those records should be deleted as well.
- When the ingredient is deleted, the user should be brought to the `/ingredients` page.

## Recommended Schedule

| Time frame        | Goals                                                                                                                                                                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Week 1, Mon-Tues  | Go through the final capstone lessons. Understand the final capstone requirements. Plan out your project, creating a Kanban board and schedule for your final capstone project. Deploy your application. Design the schema and pages for your household members. |
| Week 1, Wed-Fri   | Complete user stories 1 - 5.                                                                                                                                                                                                                                     |
| Week 2, Mon-Wed   | Re-deploy your application. Complete user stories 6 - 8.                                                                                                                                                                                                         |
| Week 2, Thurs-Fri | Complete user stories 9 - 10. Re-deploy your application.                                                                                                                                                                                                        |
| Week 3, Mon-Wed   | Complete any remaining users stories. Re-deploy your application.                                                                                                                                                                                                |
| Week 3, Thurs-Fri | Complete your README file and clean up your code. Submit your project.                                                                                                                                                                                           |

## Rubric

When your final capstone project is graded, your grader will use the above acceptance criteria and this rubric to assess your work.

1. Are all the tests passing?
2. Are all business rules enforced in UI, API, and (if possible) the database?
3. Do all API calls make use of an AbortController?
4. Do all API calls abort without error in the UI or console (e.g. click a submit button multiple times very quickly)?
5. Do all API calls in React handle errors and display the error message to the user?
6. Do all uses of key= in React loops use a unique value from the entity (key is never the array index)?
7. Are all functions calls using async/await wrapped in a valid asyncErrorBoundary or try/catch block?
8. Note two things that the student could improve upon.
9. Note two things that the student did well.

Your grader may leave additional feedback on your submission once it's reviewed.
