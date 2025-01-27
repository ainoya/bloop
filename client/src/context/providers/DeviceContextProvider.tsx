import { PropsWithChildren, useContext, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { DeviceContext, DeviceContextType } from '../deviceContext';
import { AnalyticsContext } from '../analyticsContext';
import { initializeSentry } from '../../utils/services';

type Props = {
  deviceContextValue: DeviceContextType;
};

export const DeviceContextProvider = ({
  children,
  deviceContextValue,
}: PropsWithChildren<Props>) => {
  const { isAnalyticsAllowed } = useContext(AnalyticsContext);

  useEffect(() => {
    deviceContextValue.invokeTauriCommand(
      isAnalyticsAllowed ? 'enable_telemetry' : 'disable_telemetry',
    );
    if (isAnalyticsAllowed && import.meta.env.SENTRY_DSN_FE) {
      initializeSentry(
        import.meta.env.SENTRY_DSN_FE,
        deviceContextValue.release,
      );
    } else {
      const client = Sentry.getCurrentHub().getClient();
      if (client) {
        client.close();
      }
    }
  }, [isAnalyticsAllowed, deviceContextValue.invokeTauriCommand]);

  return (
    <DeviceContext.Provider value={deviceContextValue}>
      {children}
    </DeviceContext.Provider>
  );
};
