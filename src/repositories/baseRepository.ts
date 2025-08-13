import prisma from "@/lib/prisma/prisma";
import { Direction, Specification } from "@/lib/prisma/specification";
import { Base } from "@/types/base";
import ID from "@/types/id";
import { Prisma, PrismaClient } from "@prisma/client";

export class BaseRepository<T extends Base, PrismaT> {
  protected prisma: PrismaClient;
  protected model: any;

  constructor(model: keyof PrismaClient) {
    this.prisma = prisma;
    this.model = this.prisma[model];
  }

  async create(item: T): Promise<T> {
    const created = await this.model.create({
      data: item as any,
    });

    return created as T;
  }

  async getAll(specification?: Specification<T>): Promise<T[]> {
    const items = await this.model.findMany({
      where: specification?.where,
      orderBy: specification?.orderBy ?? { createdAt: Direction.ASC },
      include: specification?.includeRelations
        ? this.getIncludeRelations()
        : undefined,
    });

    return items as T[];
  }

  async update(id: ID, data: Partial<T>): Promise<T> {
    const updated = await this.model.update({
      where: {
        id,
      },
      data,
    });
    return updated as T;
  }

  async delete(id: ID): Promise<void> {
    await this.model.delete({
      where: {
        id,
      },
    });
  }

  async getById(id: ID): Promise<T> {
    const item = await this.model.findUnique({
      where: {
        id,
      },
      include: this.getIncludeRelations(),
    });
    return item as T;
  }

  protected getIncludeRelations(): Record<string, boolean> | undefined {
    return undefined;
  }
}
