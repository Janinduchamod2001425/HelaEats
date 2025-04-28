// import React from "react";
// import { format } from "date-fns";
// import { FiEye } from "react-icons/fi";
// import { useUserDetails } from "../../hooks/useuserDetails";

// const RestaurantOrdersTable = ({ orders }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-yellow-100 text-yellow-800";
//       case "confirmed":
//         return "bg-blue-100 text-blue-800";
//       case "preparing":
//         return "bg-orange-100 text-orange-800";
//       case "ready":
//         return "bg-purple-100 text-purple-800";
//       case "delivered":
//         return "bg-green-100 text-green-800";
//       case "cancelled":
//         return "bg-red-100 text-red-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Order ID
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Date
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Items
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Total
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Status
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {orders.map((order) => (
//             <tr key={order.orderId}>
//               <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                 {order.orderId}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-500">
//                 {order.baskets.map((basket) =>
//                   basket.items.map((item) => (
//                     <div key={item.itemId}>
//                       {item.name} x {item.quantity}
//                     </div>
//                   ))
//                 )}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 Rs. {order.totalAmount.toFixed(2)}
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap">
//                 <span
//                   className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
//                     order.status
//                   )}`}
//                 >
//                   {order.status}
//                 </span>
//               </td>
//               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                 <button
//                   className="text-blue-600 hover:text-blue-900"
//                   onClick={() => onViewDetails(order.orderId)}
//                 >
//                   <FiEye className="w-5 h-5" />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RestaurantOrdersTable;

import React from "react";
import { format } from "date-fns";
import { FiEye } from "react-icons/fi";
import { useUserDetails } from "../../hooks/useuserDetails";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "preparing":
      return "bg-orange-100 text-orange-800";
    case "ready":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Create a separate OrderRow component to handle individual rows
const OrderRow = ({ order, onViewDetails }) => {
  const { user, loading, error } = useUserDetails(order.userId);

  const handleClick = (e) => {
    e.preventDefault();
    if (onViewDetails) {
      onViewDetails(order._id);
    }
  };

  return (
    <tr key={order.orderId}>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {order.orderId}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-5 w-32 rounded"></div>
        ) : error ? (
          <span className="text-red-500">Error loading user</span>
        ) : (
          <div>
            <span className="font-medium">{user?.name || "Unknown User"}</span>
            {user?.email && (
              <span className="block text-xs text-gray-400">{user.email}</span>
            )}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {format(new Date(order.createdAt), "MMM dd, yyyy HH:mm")}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {order.baskets.map((basket) =>
          basket.items.map((item) => (
            <div key={item.itemId}>
              {item.name} x {item.quantity}
            </div>
          ))
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        Rs. {order.totalAmount.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <button
          className="text-blue-600 hover:text-blue-900"
          onClick={() => onViewDetails(order.orderId)}
        >
          <FiEye className="w-5 h-5" />
        </button>
      </td>
    </tr>
  );
};

const RestaurantOrdersTable = ({ orders, onViewDetails }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <OrderRow
              key={order.orderId}
              order={order}
              onViewDetails={onViewDetails}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RestaurantOrdersTable;
