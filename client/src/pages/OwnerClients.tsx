import { useState, useEffect } from "react";
import { Copy, FileDown, MoreHorizontal, PieChart, UserCheck2, Clock, Hotel, Home } from "lucide-react";
import User from "../models/User";
import UserService from "../services/UserService";
import LeaseService from "../services/LeaseService";
import BookingService from "../services/BookingService";
import TransactionService from "../services/TransactionService";

interface ClientData extends User {
  totalTransactions: number;
  lastTransaction?: Date;
  propertyTypes: Set<string>;
  status: "active" | "inactive";
}

export default function OwnerClients() {
  const [isVisible, setIsVisible] = useState(false);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "balances">("overview");
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    setIsVisible(true);
    fetchClientsData();
  }, []);

  const fetchClientsData = async () => {
    try {
      const [users, leases, bookings, transactions] = await Promise.all([
        UserService.getAll(),
        LeaseService.getAll(),
        BookingService.getAll(),
        TransactionService.getAll(),
      ]);

      const clientsMap = new Map<string, ClientData>();

      const processClient = (userId: string, user: User) => {
        if (!clientsMap.has(userId)) {
          clientsMap.set(userId, {
            ...user,
            totalTransactions: 0,
            propertyTypes: new Set(),
            status: "active",
          });
        }
        return clientsMap.get(userId)!;
      };

      leases.forEach((lease) => {
        const user = users.find((u) => u._id === lease.clientId);
        if (user) {
          const clientData = processClient(user._id, user);
          clientData.propertyTypes.add("rented_real_estate");
          if (lease.status === "active") {
            clientData.status = "active";
          }
        }
      });

      bookings.forEach((booking) => {
        const user = users.find((u) => u._id === booking.clientId);
        if (user) {
          const clientData = processClient(user._id, user);
          clientData.propertyTypes.add("hotel");
        }
      });

      transactions.forEach((transaction) => {
        const user = users.find((u) => u._id === transaction.payerId);
        if (user) {
          const clientData = processClient(user._id, user);
          clientData.totalTransactions += 1;
          if (!clientData.lastTransaction || new Date(transaction.date) > new Date(clientData.lastTransaction)) {
            clientData.lastTransaction = transaction.date;
          }
        }
      });

      setClients(Array.from(clientsMap.values()));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching clients data:", error);
      setLoading(false);
    }
  };

  const getPropertyTypeIcon = (types: Set<string>) => {
    if (types.has("hotel")) return <Hotel size={16} className="text-blue-500" />;
    if (types.has("rented_real_estate")) return <Home size={16} className="text-green-500" />;
    return <Home size={16} className="text-gray-500" />;
  };

  const filterButtons = ["Status", "Property Type", "Created date", "Transactions", "More filters"];
  const actionButtons = [
    { icon: Copy, label: "Copy" },
    { icon: FileDown, label: "Export" },
    { icon: PieChart, label: "Analyse" },
    { icon: MoreHorizontal, label: "Edit columns" },
  ];

  return (
    <div
      className={`transition-all duration-500 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Clients</h1>
      </div>

      <div className="w-full">
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700 w-full justify-start h-auto">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 py-4 px-1 text-sm font-medium rounded-none ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("balances")}
              className={`border-b-2 py-4 px-1 text-sm font-medium rounded-none ${
                activeTab === "balances"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Remaining balances
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                  {filterButtons.map((label) => (
                    <button
                      key={label}
                      onClick={() => {
                        if (selectedFilters.includes(label)) {
                          setSelectedFilters(selectedFilters.filter((f) => f !== label));
                        } else {
                          setSelectedFilters([...selectedFilters, label]);
                        }
                      }}
                      className={`text-sm px-4 py-2 rounded-md ${
                        selectedFilters.includes(label)
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end p-4 space-x-2 border-b border-gray-200 dark:border-gray-700">
                {actionButtons.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="text-sm text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon size={16} className="mr-2 inline" />
                    {label}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="w-8 py-3 pl-4">
                        <input type="checkbox" className="rounded" />
                      </th>
                      {["Name", "Email", "Property Types", "Status", "Total Transactions", "Last Activity", ""].map(
                        (header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                          Loading clients...
                        </td>
                      </tr>
                    ) : clients.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
                          No clients found
                        </td>
                      </tr>
                    ) : (
                      clients.map((client) => (
                        <tr key={client._id}>
                          <td className="py-4 pl-4">
                            <input type="checkbox" className="rounded" />
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {client.avatar ? (
                                <img
                                  src={client.avatar || "/placeholder.svg"}
                                  alt={client.fullName}
                                  className="h-8 w-8 rounded-full mr-3"
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3 flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                    {client.fullName.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {client.fullName}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100 flex items-center">
                              {client.email}
                              {client.isVerified && <UserCheck2 size={16} className="inline ml-2 text-green-500" />}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {Array.from(client.propertyTypes).map((type) => (
                                <span
                                  key={type}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                >
                                  {getPropertyTypeIcon(client.propertyTypes)}
                                  <span className="ml-1">{type === "rented_real_estate" ? "Rental" : "Hotel"}</span>
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                client.status === "active"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                              }`}
                            >
                              {client.status}
                            </span>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-gray-100">{client.totalTransactions}</div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Clock size={16} className="mr-1" />
                              {client.lastTransaction
                                ? new Date(client.lastTransaction).toLocaleDateString()
                                : "No activity"}
                            </div>
                          </td>
                          <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
                            >
                              <MoreHorizontal size={20} />
                              <span className="sr-only">Actions</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                {clients.length} {clients.length === 1 ? "result" : "results"}
              </div>
            </div>
          </div>
        )}

        {activeTab === "balances" && (
          <div className="mt-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <p className="text-gray-500 dark:text-gray-400">Remaining balances information will be displayed here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}