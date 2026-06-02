type Props = { environment: string };

export default function EnvironmentBadge({ environment }: Props) {
  const classes =
    environment === 'production'
      ? 'bg-green-100 text-green-800'
      : environment === 'development'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {environment}
    </span>
  );
}
