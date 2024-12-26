import { RxStompConfig } from '@stomp/rx-stomp';
import { environment } from '../../environments/environment';

export const rxStompConfig: RxStompConfig = {
  brokerURL: `${environment.socketUrl}?token=${encodeURIComponent(
    `Bearer ${localStorage.getItem(environment.storageKeys.TOKEN)}`
  )}`,
  reconnectDelay: 1000,
};
