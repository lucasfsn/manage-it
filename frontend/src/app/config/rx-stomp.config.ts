import { TOKEN_KEY } from '@/app/core/constants/local-storage.constants';
import { environment } from '@/environments/environment';
import { RxStompConfig } from '@stomp/rx-stomp';

export const rxStompConfig: RxStompConfig = {
  brokerURL: `${environment.socketUrl}?token=${encodeURIComponent(
    `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
  )}`,
  reconnectDelay: 1000,
};
