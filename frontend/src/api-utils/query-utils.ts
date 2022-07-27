import { Filter } from "./models/filter-models";
import { Pagination, PaginationResponse } from "./models/pagination-models";

/**
 * Generate a Strapi GraphQL query.
 *
 * @param queryContent query string generated by {@linkcode entry} or {@linkcode collection}.
 * @returns a valid query for the Strapi GraphQL API.
 *
 * @see {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/graphql-api.html#queries Strapi GraphQL Documentation - Queries}
 */
export function query(queryContent: string): string {
  return `query { ${queryContent} }`;
}

/**
 * Generate a string with valid query syntax for querying a single entry from the Strapi GraphQL API.
 * Can also be used for generating a query string for a field that references a single entry.
 *
 * @param entityName
 * @param id only for top level entry (not for fields)!
 * @param fields string with the field's name or a query string generated by {@linkcode entry} or {@linkcode collection}.
 * @returns a valid query string for usage with {@linkcode query}.
 *
 * @see {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/graphql-api.html#fetch-a-single-entry Strapi GraphQL Documentation - Single Entry}
 */
export function entry(
  entityName: string,
  fields: string[],
  id?: number
): string {
  return `${entryName(entityName, id)} { ${data(fields)} }`;
}

/**
 * Generate a string with valid query syntax for querying collections from the Strapi GraphQL API.
 * Can also be used for generating a query string for a field that references a collection.
 *
 * @param entityName
 * @param fields string with the field's name or a query string generated by {@linkcode entry} or {@linkcode collection}.
 * @param filter for further information: {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/graphql-api.html#filters Strapi GraphQL Documentation - Filters}.
 * @param sort string or an array of strings which follow the form "<<field>>:<<asc||desc>>", e. g. "name:asc", for further information: {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/graphql-api.html#sorting Strapi GraphQL Documentation - Sorting}.
 * @param pagination for further information: {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/graphql-api.html#pagination Strapi GraphQL Documentation - Pagination}.
 * @param paginationResponse only for top level collections (not for fields)! returns pagination metadata in the response.
 * @returns a valid query string for usage with {@linkcode query}.
 *
 * @see {@link https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/graphql-api.html#fetch-multiple-entries Strapi GraphQL Documentation - Multiple Entries}.
 */
export function collection(
  entityName: string,
  fields: string[],
  filter?: {
    [fieldOrLogicalOperator: string]: Filter;
  },
  sort?: string | string[],
  pagination?: Pagination,
  paginationResponse?: PaginationResponse
): string {
  let paginationResponseString;
  if (paginationResponse) {
    paginationResponseString = Object.keys(paginationResponse)
      .filter((key) => (paginationResponse as { [key: string]: boolean })[key])
      .join(" ");
  }
  return `${collectionName(entityName, filter, pagination, sort)} { ${data(
    fields
  )} ${
    paginationResponse
      ? `meta { pagination { ${paginationResponseString} } }`
      : ""
  } }`;
}

function entryName(entityName: string, id?: number): string {
  return `${entityName}${id ? `(id: ${id})` : ""}`;
}

function collectionName(
  entityName: string,
  filter?: {
    [fieldOrLogicalOperator: string]: Filter;
  },
  pagination?: Pagination,
  sort?: string | string[]
): string {
  // removing quotes from JSON properties taken from: https://stackoverflow.com/questions/11233498/json-stringify-without-quotes-on-properties
  const filterString = JSON.stringify(filter)?.replace(/"([^"]+)":/g, "$1:");
  const paginationString = JSON.stringify(pagination)?.replace(
    /"([^"]+)":/g,
    "$1:"
  );
  const sortString = JSON.stringify(sort)?.replace(/"([^"]+)":/g, "$1:");

  const needsBraces = filter || pagination || sort;

  return `${entityName}${needsBraces ? "(" : ""}${
    filter ? `filters: ${filterString}, ` : ""
  }${pagination ? `pagination: ${paginationString}, ` : ""}${
    sort ? `sort: ${sortString}, ` : ""
  }${needsBraces ? ")" : ""}`;
}

function data(fields: string[]): string {
  return `data { id attributes { ${fields.join(" ")} } }`;
}