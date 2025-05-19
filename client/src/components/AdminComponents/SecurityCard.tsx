
const SecurityCard = ({ icon: Icon, label, value, trend, color }: { icon: any, label: string, value: string | number, trend?: string, color?: string }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className={`text-2xl font-bold mt-2 ${color || ''}`}>{value}</p>
          {trend && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </div>
  );


  export default SecurityCard;