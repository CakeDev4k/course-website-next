import { asc, desc, type SQLWrapper, type SQL, type AnyColumn} from "drizzle-orm";

export const sortBy = (column: AnyColumn | SQLWrapper,typeSort: "asc" | "desc"): SQL => {
	switch (typeSort) {
        case "asc":
            return asc(column)
        case "desc":
            return desc(column)
        default:
            throw new Error("Type of sort not declared");
        break;
    }
}