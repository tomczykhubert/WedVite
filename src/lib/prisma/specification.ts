import { Base } from "@/types/base";

type Order<T extends Base> = {
  [K in keyof T]?: Direction.ASC | Direction.DESC;
};

type Filter<T extends Base> = {
  [K in keyof T]?: T[K];
};

export enum Direction {
  ASC = "asc",
  DESC = "desc",
}

export type Specification<T extends Base> = {
  where?: Filter<T>;
  orderBy?: Order<T> | { createdAt: Direction.DESC };
  take?: number;
  skip?: number;
  includeRelations?: boolean;
};

export function specificationToSearchParams<T extends Base>(
  specification?: Specification<T>
): URLSearchParams {
  const params = new URLSearchParams();
  if (specification?.where) {
    params.append("where", JSON.stringify(specification.where));
  }
  if (specification?.orderBy) {
    params.append("order", JSON.stringify(specification.orderBy));
  }
  if (specification?.take) {
    params.append("take", specification.take.toString());
  }
  if (specification?.skip) {
    params.append("skip", specification.skip.toString());
  }
  if (specification?.includeRelations) {
    params.append(
      "includeRelations",
      specification.includeRelations.toString()
    );
  }
  return params;
}

export function searchParamsToSpecification(
  searchParams: URLSearchParams
): Specification<Base> {
  const where = searchParams.get("where");
  const orderBy = searchParams.get("order");
  const take = searchParams.get("take");
  const skip = searchParams.get("skip");
  const includeRelations = searchParams.get("includeRelations");
  return {
    where: where ? JSON.parse(where) : undefined,
    orderBy: orderBy ? JSON.parse(orderBy) : undefined,
    take: take ? parseInt(take) : undefined,
    skip: skip ? parseInt(skip) : undefined,
    includeRelations: includeRelations === "true",
  };
}
