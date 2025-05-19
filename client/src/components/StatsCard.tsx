import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
const DefaultIcon = ArrowUpRight;
interface StatCardProps {
  Icon: React.ElementType;
  label: string;
  value: string;
  trend?: string;
  change?: string;
}

export default function StatCard({ Icon = DefaultIcon, label, value, trend, change }: StatCardProps) { 
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 border ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-100 text-gray-900"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            {label}
          </p>
          <h3 className={`text-2xl font-bold mt-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
            {value}
          </h3>
          <div className="flex items-center mt-2">
            {trend && (
              <span
                className={`flex items-center text-sm ${
                  trend === "up"
                    ? theme === "dark"
                      ? "text-green-400"
                      : "text-green-600"
                    : theme === "dark"
                    ? "text-red-400"
                    : "text-red-600"
                }`}
              >
                {trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {change || ""}
              </span>
            )}
            <span className={`text-sm ml-2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              vs last month
            </span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${theme === "dark" ? "bg-blue-900/30" : "bg-blue-50"}`}>
          <Icon className={`w-6 h-6 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
        </div>
      </div>
    </div>
  );
}
