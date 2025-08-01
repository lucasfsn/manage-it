import { UserSummaryDto } from '@/app/shared/dto/user-summary.dto';

export interface NotificationDto {
  readonly id: string;
  readonly user: UserSummaryDto;
  readonly message: string;
  readonly date: string;
  readonly projectId: string;
  readonly taskId?: string;
}
