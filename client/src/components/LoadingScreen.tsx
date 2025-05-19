const LoadingScreen: React.FC = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-gray-700"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">Loading...</h2>
        </div>
      </div>
    )
  }
  
  export default LoadingScreen