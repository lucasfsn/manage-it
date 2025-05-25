import { UserSummaryDto } from '@/app/shared/dto/user-summary.model';

export interface MessageDto {
  readonly id: string;
  readonly content: string;
  readonly sender: UserSummaryDto;
  readonly createdAt: string;
}

export interface MessagePayload {
  readonly content: string;
  readonly token: string;
}
