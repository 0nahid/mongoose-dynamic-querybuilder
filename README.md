mongoose-dynamic-querybuilder, a utility library for building dynamic queries with Mongoose.

## Installation

`npm i mongoose-dynamic-querybuilder
`

`yarn add mongoose-dynamic-querybuilder
`

## Usage

```jsx
import QueryBuilder from "mongoose-dynamic-querybuilder";

// Example usage with Mongoose model
const userQuery = new QueryBuilder(User.find({}), req.query);

const [data, totalData] = await Promise.all([
  userQuery
    .filter()
    .search(["email", "username", "profile.fullname"]) // to make dynamic search use like ['']
    .sort()
    .paginate()
    .fields().modelQuery,
  userQuery.countTotal(),
]);
```

## API

### `new QueryBuilder(query, queryParams)`

Creates a new instance of QueryBuilder.

- `query`: Mongoose query instance.
- `queryParams`: Object containing query parameters.

### Methods

- `.filter()`: Apply filters based on query parameters.
- `.search(fields)`: Perform a search on specified fields.
- `.sort()`: Apply sorting based on query parameters.
- `.paginate()`: Paginate the results.
- `.fields()`: Select fields to be returned in the query.
- `.modelQuery`: Get the final Mongoose model query.
- `.countTotal()`: Count the total number of documents without pagination.

## Examples

- Search any fields:

  ```
  GET <http://localhost:5000/api/v1/users?searchTerm=nahid>

  ```

- Pagination (default: page=1, limit=10):

  ```
  GET <http://localhost:5000/api/v1/users?page=1&limit=10>

  ```

- Get only specific fields:

  ```
  GET <http://localhost:5000/api/v1/users?fields=password,email>

  ```

- Sort in descending order:

  ```
  GET <http://localhost:5000/api/v1/users?sort=-username>

  ```

## What's new?

- Added support for dynamic search on specific fields.
- Added support for selecting specific fields to be returned in the query.
- Added support for counting the total number of documents with all filters without pagination.
- Added support for search with objectId
