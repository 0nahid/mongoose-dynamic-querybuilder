import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    if (!this.query?.searchTerm) {
      return this;
    }
    const searchTerm: string = this.query?.searchTerm as string;

     // Skip search if search term resembles an ObjectId or is boolean
    if (searchTerm.match(/^[0-9a-fA-F]{24}$/) || searchTerm === "true" || searchTerm === "false") {
      return this;
    }
    
    const searchRegex = new RegExp(searchTerm, "i");
    const orFilter: FilterQuery<T>[] = searchableFields
      .map((field) => {
        if (field !== "category" && !searchTerm.match(/^[0-9a-fA-F]{24}$/)) {
          // Exclude fields that are not 'category' and don't resemble ObjectIds
          return { [field]: searchRegex } as FilterQuery<T>;
        } else {
          return {} as FilterQuery<T>; // Return an empty filter for other fields
        }
      })
      .filter((filter) => Object.keys(filter).length > 0); // Filter out empty filters

    this.modelQuery = this.modelQuery.find({
      $or: orFilter.length > 0 ? orFilter : [{}], // Ensure at least one filter exists
    });

    return this;
  }

  filter() {
    const excludeFields = [
      "searchTerm",
      "sort",
      "limit",
      "page",
      "fields",
      "skipLimit",
    ];

    const queryObj = Object.fromEntries(
      Object.entries(this.query).filter(([key]) => !excludeFields.includes(key))
    );

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    return this;
  }

  sort() {
    const sort =
      (this.query?.sort as string)?.split(",")?.join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  paginate() {
    const skipLimit = this.query?.skipLimit as string | undefined;

    if (skipLimit?.toUpperCase() === "YES") {
      return this;
    }

    const page = Number(this.query?.page) || 1;
    const limit = Number(this.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this.query?.fields as string)?.split(",")?.join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const filter = this.modelQuery.getFilter();
    const count = await this.modelQuery.model.countDocuments(filter);
    return count;
  }
}

export = QueryBuilder;
