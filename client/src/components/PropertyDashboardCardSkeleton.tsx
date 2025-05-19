const PropertyDashboardCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden animate-pulse">
      {/*Image Gallery Skeleton */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
      
      {/*Content Skeleton */}
      <div className="p-4">
        {/*Title */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        {/*Location */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
        
        {/*Owner */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
        </div>
        
        {/*Tags */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        
        {/*Price */}
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-4" />
        
        {/*Actions */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="flex gap-2">
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDashboardCardSkeleton;