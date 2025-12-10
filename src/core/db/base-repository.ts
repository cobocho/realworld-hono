import { DatabaseError } from '@shared/error/errors';

export abstract class BaseRepository {
  protected async executeQuery<T>(
    operation: () => Promise<T>,
    errorContext?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (errorContext) {
        console.error(`${errorContext}:`, error);
      }
      if (error instanceof Error) {
        throw new DatabaseError('Database error', error);
      }
      throw new DatabaseError('Database error', error);
    }
  }

  // 자주 사용하는 패턴들을 메서드로 제공
  protected async findOne<T>(
    operation: () => Promise<T[]>,
    errorContext?: string
  ): Promise<T | null> {
    return this.executeQuery(async () => {
      const [result] = await operation();
      return result || null;
    }, errorContext);
  }

  protected async findMany<T>(
    operation: () => Promise<T[]>,
    errorContext?: string
  ): Promise<T[]> {
    return this.executeQuery(operation, errorContext);
  }

  protected async insertOne<T>(
    operation: () => Promise<T[]>,
    errorContext?: string
  ): Promise<T> {
    return this.executeQuery(async () => {
      const [result] = await operation();
      return result;
    }, errorContext);
  }

  protected async updateOne<T>(
    operation: () => Promise<T[]>,
    errorContext?: string
  ): Promise<T | null> {
    return this.executeQuery(async () => {
      const [result] = await operation();
      return result || null;
    }, errorContext);
  }

  protected async deleteOne<T>(
    operation: () => Promise<T[]>,
    errorContext?: string
  ): Promise<T | null> {
    return this.executeQuery(async () => {
      const [result] = await operation();
      return result || null;
    }, errorContext);
  }
}
