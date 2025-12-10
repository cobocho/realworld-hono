// errors/custom-errors.ts
import { HTTPException } from 'hono/http-exception';
import { ContentfulStatusCode } from 'hono/utils/http-status';

import { HttpStatusCode } from '@shared/utils/response';

// 베이스 에러 클래스
export class AppError extends HTTPException {
  constructor(
    status: ContentfulStatusCode,
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(status, { message });
  }
}

// 검증 에러
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'VALIDATION_ERROR', details);
  }
}

// 데이터베이스 에러
export class DatabaseError extends AppError {
  constructor(message: string, details?: unknown) {
    super(
      HttpStatusCode.internalServerError,
      message,
      'DATABASE_ERROR',
      details
    );
  }
}

// 인증 에러
export class AuthenticationError extends AppError {
  constructor(message: string = '인증이 필요합니다') {
    super(401, message, 'AUTHENTICATION_ERROR');
  }
}

// 권한 에러
export class AuthorizationError extends AppError {
  constructor(message: string = '권한이 없습니다') {
    super(403, message, 'AUTHORIZATION_ERROR');
  }
}

// 리소스 없음 에러
export class NotFoundError extends AppError {
  constructor(resource: string = '리소스') {
    super(404, `${resource}를 찾을 수 없습니다`, 'NOT_FOUND');
  }
}

// 중복 에러
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT_ERROR');
  }
}

// 비즈니스 로직 에러
export class BusinessError extends AppError {
  constructor(message: string, details?: unknown) {
    super(422, message, 'BUSINESS_ERROR', details);
  }
}
