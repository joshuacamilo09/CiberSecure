import { Injectable, NotFoundException } from '@nestjs/common';
import { UserHistoryQueryDto } from './dto/user-history-query.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: { name: string; email: string; passwordHash: string }) {
    return this.prisma.user.create({
      data,
    });
  }

  async getProfile(userId: string) {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.sanitizeUser(user);
  }

  async getHistory(userId: string, query: UserHistoryQueryDto) {
    const [profile, analyses, chats] = await Promise.all([
      this.getProfile(userId),
      this.getAnalyses(userId, query),
      this.getChats(userId, query),
    ]);

    return {
      profile,
      analyses,
      chats,
    };
  }

  async getAnalyses(userId: string, query: UserHistoryQueryDto) {
    const { skip, take, page, limit } = this.getPagination(query);

    const [items, total] = await Promise.all([
      this.prisma.analysisRequest.findMany({
        where: { userId },
        include: {
          evidences: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.analysisRequest.count({
        where: { userId },
      }),
    ]);

    return this.paginated(items, total, page, limit);
  }

  async getChats(userId: string, query: UserHistoryQueryDto) {
    const { skip, take, page, limit } = this.getPagination(query);

    const [items, total] = await Promise.all([
      this.prisma.chatSession.findMany({
        where: { userId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { startedAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.chatSession.count({
        where: { userId },
      }),
    ]);

    return this.paginated(items, total, page, limit);
  }

  private sanitizeUser(user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private getPagination(query: UserHistoryQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;
    const take = limit;

    return { page, limit, skip, take };
  }

  private paginated<T>(items: T[], total: number, page: number, limit: number) {
    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
