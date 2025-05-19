class CategoryService {
    private static instance: CategoryService;
    constructor() {
      if (CategoryService.instance) {
        return CategoryService.instance;
      }
      CategoryService.instance = this;
    }
    static getInstance() {
      if (!CategoryService.instance) {
        CategoryService.instance = new CategoryService();
      }
      return CategoryService.instance;
    }
  }
  export default CategoryService.getInstance();
  