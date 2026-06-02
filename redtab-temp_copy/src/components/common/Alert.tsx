import { Alert as DSAlert, type AlertProps as DSAlertProps } from '@redtabhq/design-system';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends Omit<DSAlertProps, 'variant'> {
  type: AlertType;
}

export function Alert({ type, ...props }: AlertProps) {
  return <DSAlert variant={type} {...props} />;
}
