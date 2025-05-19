import { PropertyCategory } from '../models/Category'

const CategoryCard = ({category}:{category:PropertyCategory}) => {
  return (
    <div 
    key={category.id} 
    className="flex-none w-40 snap-start bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center cursor-pointer group"
  >
    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
    <h3 className="font-medium mb-1">{category.name}</h3>
    <p className="text-sm text-gray-500">{0} properties</p> 
  </div>
  )
}

export default CategoryCard