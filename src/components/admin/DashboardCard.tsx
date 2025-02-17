interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

export default function DashboardCard({ title, children }: DashboardCardProps) {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-700">
        <h3 className="text-lg font-medium leading-6 text-white">{title}</h3>
      </div>
      <div className="bg-gray-800 rounded-b-lg">
        {children}
      </div>
    </div>
  );
} 